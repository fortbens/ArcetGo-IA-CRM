export const PRISMA_SCHEMA_CODE = `// ============================================================================
// ACERTGO ECOSYSTEM - PRISMA ORM SCHEMA (PostgreSQL / Supabase RLS)
// ============================================================================

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

enum UserRole {
  MASTER_ADMIN
  MANAGER
  BROKER
  FINANCIAL_OPERATOR
  EXTERNAL_PARTNER
}

enum FunnelStage {
  NOVO_LEAD
  PRIMEIRO_CONTATO
  QUALIFICACAO
  VISITA_AGENDADA
  VISITA_REALIZADA
  PROPOSTA_ENVIADA
  FECHAMENTO_GANHO
  FECHAMENTO_PERDIDO
}

enum UnitStatus {
  DISPONIVEL
  RESERVADO
  VENDIDO
}

enum InspectionCondition {
  NOVO
  BOM
  DANIFICADO
}

enum CCABankStage {
  SIMULACAO
  COLETA_DOCUMENTOS
  ANALISE_RISCO
  AVALIACAO_ENGENHARIA
  EMISSAO_CONTRATO
  PAGO_COMISSAO_CCA
}

// Multi-Tenant Core
model Tenant {
  id              String         @id @default(uuid()) @db.Uuid
  name            String         @db.VarChar(120)
  documentCnpj    String         @unique @db.VarChar(18)
  domain          String?        @unique @db.VarChar(100)
  brandColorHex   String         @default("#0056D2")
  creciJuridico   String         @db.VarChar(20)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  users           User[]
  leads           Lead[]
  developments    Development[]
  properties      Property[]
  rentalContracts RentalContract[]
  fleetVehicles   FleetVehicle[]
  companyAssets   CompanyAsset[]
  roletaQueues    RoletaQueue[]
}

model User {
  id              String         @id @default(uuid()) @db.Uuid
  tenantId        String         @db.Uuid
  tenant          Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  email           String         @unique
  fullName        String         @db.VarChar(120)
  phone           String         @db.VarChar(25)
  creci           String?        @db.VarChar(20)
  role            UserRole       @default(BROKER)
  active          Boolean        @default(true)
  scorePoints     Int            @default(0)
  avatarUrl       String?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  leadsAssigned   Lead[]         @relation("AssignedBroker")
  interactions    LeadInteraction[]
  reservations    DevelopmentUnit[] @relation("ReservedUnits")
  keyLogs         PropertyKeyLog[]
  commissionsEarned CommissionSplit[]
}

// Omnichannel Leads Engine & Roleta
model RoletaQueue {
  id              String         @id @default(uuid()) @db.Uuid
  tenantId        String         @db.Uuid
  tenant          Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name            String         @db.VarChar(60) // "Terça", "Quinta", etc.
  strategy        String         @default("ALEATORIO") // ALEATORIO | ROUND_ROBIN
  mode            String         @default("Manual")
  active          Boolean        @default(true)
  createdAt       DateTime       @default(now())

  members         RoletaMember[]
  distributions   RoletaDistributionLog[]
}

model RoletaMember {
  id              String         @id @default(uuid()) @db.Uuid
  queueId         String         @db.Uuid
  queue           RoletaQueue    @relation(fields: [queueId], references: [id], onDelete: Cascade)
  userId          String         @db.Uuid
  active          Boolean        @default(true)
  weight          Int            @default(1)
  assignedToday   Int            @default(0)
}

model RoletaDistributionLog {
  id              String         @id @default(uuid()) @db.Uuid
  queueId         String         @db.Uuid
  queue           RoletaQueue    @relation(fields: [queueId], references: [id])
  leadId          String         @db.Uuid
  assignedUserId  String         @db.Uuid
  distributedAt   DateTime       @default(now())
}

model Lead {
  id              String         @id @default(uuid()) @db.Uuid
  tenantId        String         @db.Uuid
  tenant          Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name            String         @db.VarChar(120)
  phone           String         @db.VarChar(25)
  email           String?        @db.VarChar(120)
  source          String         @db.VarChar(40) // ZAP, VIVAREAL, WHATSAPP, PLACA_QR
  stage           FunnelStage    @default(NOVO_LEAD)
  assignedUserId  String?        @db.Uuid
  assignedUser    User?          @relation("AssignedBroker", fields: [assignedUserId], references: [id])
  budgetMin       Decimal?       @db.Decimal(14, 2)
  budgetMax       Decimal?       @db.Decimal(14, 2)
  lossReason      String?
  rating          Int            @default(3)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  interactions    LeadInteraction[]
  chatMessages    ChatMessage[]
}

model LeadInteraction {
  id              String         @id @default(uuid()) @db.Uuid
  leadId          String         @db.Uuid
  lead            Lead           @relation(fields: [leadId], references: [id], onDelete: Cascade)
  authorId        String         @db.Uuid
  author          User           @relation(fields: [authorId], references: [id])
  type            String         @db.VarChar(30) // WHATSAPP, CALL, VISIT, WHISPER_NOTE
  title           String         @db.VarChar(150)
  description     String         @db.Text
  isPrivateWhisper Boolean       @default(false) // Ghost mode note
  createdAt       DateTime       @default(now())
}

model ChatMessage {
  id              String         @id @default(uuid()) @db.Uuid
  leadId          String         @db.Uuid
  lead            Lead           @relation(fields: [leadId], references: [id], onDelete: Cascade)
  senderType      String         @db.VarChar(20) // LEAD, BROKER, MANAGER, SYSTEM
  content         String         @db.Text
  messageType     String         @default("TEXT") // TEXT, AUDIO, IMAGE, WHISPER
  isWhisperNote   Boolean        @default(false)
  audioDurationSec Int?
  createdAt       DateTime       @default(now())
}

// Lançamentos & Espelho de Vendas 360
model Development {
  id              String            @id @default(uuid()) @db.Uuid
  tenantId        String            @db.Uuid
  tenant          Tenant            @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  title           String            @db.VarChar(150)
  builderName     String            @db.VarChar(120)
  neighborhood    String            @db.VarChar(80)
  city            String            @db.VarChar(60)
  deliveryDate    DateTime
  brochureUrl     String?
  bannerUrl       String?
  createdAt       DateTime          @default(now())

  units           DevelopmentUnit[]
}

model DevelopmentUnit {
  id              String         @id @default(uuid()) @db.Uuid
  developmentId   String         @db.Uuid
  development     Development    @relation(fields: [developmentId], references: [id], onDelete: Cascade)
  tower           String         @db.VarChar(50)
  floor           Int
  unitNumber      String         @db.VarChar(20)
  typology        String         @db.VarChar(50) // "3 Suítes", etc.
  privateAreaM2   Decimal        @db.Decimal(8, 2)
  parkingSpaces   Int            @default(1)
  price           Decimal        @db.Decimal(14, 2)
  status          UnitStatus     @default(DISPONIVEL)
  reservedById    String?        @db.Uuid
  reservedBy      User?          @relation("ReservedUnits", fields: [reservedById], references: [id])
  reservedUntil   DateTime?
  versionLock     Int            @default(1) // Concurrency optimistic locking
  updatedAt       DateTime       @updatedAt

  @@unique([developmentId, tower, unitNumber])
}

// Locações, Vistorias & Motor Fintech Split
model Property {
  id              String            @id @default(uuid()) @db.Uuid
  tenantId        String            @db.Uuid
  tenant          Tenant            @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  code            String            @unique @db.VarChar(30)
  title           String            @db.VarChar(150)
  address         String            @db.VarChar(200)
  neighborhood    String            @db.VarChar(80)
  city            String            @db.VarChar(60)
  rentalPrice     Decimal?          @db.Decimal(12, 2)
  salePrice       Decimal?          @db.Decimal(14, 2)
  createdAt       DateTime          @default(now())

  contracts       RentalContract[]
  inspections     PropertyInspection[]
  keyLogs         PropertyKeyLog[]
}

model RentalContract {
  id              String         @id @default(uuid()) @db.Uuid
  tenantId        String         @db.Uuid
  tenant          Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  propertyId      String         @db.Uuid
  property        Property       @relation(fields: [propertyId], references: [id])
  tenantName      String         @db.VarChar(120)
  tenantCpf       String         @db.VarChar(14)
  ownerName       String         @db.VarChar(120)
  ownerPixKey     String         @db.VarChar(100)
  monthlyRent     Decimal        @db.Decimal(10, 2)
  condoFee        Decimal        @db.Decimal(10, 2)
  iptuFee         Decimal        @db.Decimal(10, 2)
  guaranteeFee    Decimal        @db.Decimal(10, 2)
  adminFeePct     Decimal        @default(10.00) @db.Decimal(5, 2)
  guaranteeType   String         @db.VarChar(30)
  status          String         @default("ATIVO")
  createdAt       DateTime       @default(now())

  splitLedgers    FintechSplitLedger[]
}

model FintechSplitLedger {
  id              String         @id @default(uuid()) @db.Uuid
  contractId      String         @db.Uuid
  contract        RentalContract @relation(fields: [contractId], references: [id])
  totalPaid       Decimal        @db.Decimal(12, 2)
  platformFee     Decimal        @db.Decimal(8, 2)
  agencyAdmFee    Decimal        @db.Decimal(10, 2)
  netOwnerPayout  Decimal        @db.Decimal(10, 2)
  insurancePayout Decimal        @db.Decimal(10, 2)
  taxWithheld     Decimal        @db.Decimal(8, 2)
  pixTxId         String         @unique @db.VarChar(80)
  settledAt       DateTime       @default(now())
}

model PropertyInspection {
  id              String         @id @default(uuid()) @db.Uuid
  propertyId      String         @db.Uuid
  property        Property       @relation(fields: [propertyId], references: [id])
  type            String         @db.VarChar(20) // ENTRADA | SAIDA
  inspectorName   String         @db.VarChar(100)
  status          String         @default("CONCLUIDA")
  checklistJson   Json
  signedAt        DateTime?
  createdAt       DateTime       @default(now())
}

model PropertyKeyLog {
  id              String         @id @default(uuid()) @db.Uuid
  propertyId      String         @db.Uuid
  property        Property       @relation(fields: [propertyId], references: [id])
  userId          String         @db.Uuid
  user            User           @relation(fields: [userId], references: [id])
  status          String         @default("EM_VISITA")
  checkedOutAt    DateTime       @default(now())
  returnedAt      DateTime?
}

// Comissões & RPA
model CommissionSplit {
  id              String         @id @default(uuid()) @db.Uuid
  userId          String         @db.Uuid
  user            User           @relation(fields: [userId], references: [id])
  roleType        String         @db.VarChar(30) // CAPTADOR | FECHADOR | GERENTE
  dealCode        String         @db.VarChar(50)
  salePrice       Decimal        @db.Decimal(14, 2)
  commissionValue Decimal        @db.Decimal(12, 2)
  status          String         @default("RECEBIDO")
  rpaDocUrl       String?
  createdAt       DateTime       @default(now())
}

// Esteira de Crédito Bancário CCA
model CreditProposalCCA {
  id              String         @id @default(uuid()) @db.Uuid
  clientName      String         @db.VarChar(120)
  clientCpf       String         @db.VarChar(14)
  bank            String         @db.VarChar(40)
  propertyValue   Decimal        @db.Decimal(14, 2)
  financedValue   Decimal        @db.Decimal(14, 2)
  stage           CCABankStage   @default(SIMULACAO)
  bankFeeEarned   Decimal        @db.Decimal(10, 2)
  updatedAt       DateTime       @updatedAt
}

// Patrimônio & Frota
model FleetVehicle {
  id              String         @id @default(uuid()) @db.Uuid
  tenantId        String         @db.Uuid
  tenant          Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  plate           String         @unique @db.VarChar(10)
  model           String         @db.VarChar(80)
  currentKm       Int            @default(0)
  fuelPercent     Int            @default(100)
  status          String         @default("DISPONIVEL")
}

model CompanyAsset {
  id              String         @id @default(uuid()) @db.Uuid
  tenantId        String         @db.Uuid
  tenant          Tenant         @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  assetCode       String         @unique @db.VarChar(30)
  title           String         @db.VarChar(100)
  category        String         @db.VarChar(50)
  assignedTo      String?        @db.VarChar(100)
  estimatedValue  Decimal        @db.Decimal(10, 2)
}
`;

export const ARCHITECTURE_TREE = `acertgo-enterprise/
├── src/
│   ├── app/ (Next.js App Router)
│   │   ├── (auth)/login/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx (RBAC, Multi-tenant provider)
│   │   │   ├── page.tsx (BI Executive Dashboard & Bottleneck Alerts)
│   │   │   ├── leads/ (Whaticket-style multi-agent & Roleta)
│   │   │   │   ├── page.tsx
│   │   │   │   ├── roleta/page.tsx
│   │   │   │   └── kanban/page.tsx
│   │   │   ├── lancamentos/ (Espelho de Vendas 360 & Matrix)
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── parceiro-externo/page.tsx
│   │   │   ├── locacoes/ (Fintech Split Engine, Vistorias, Chaves)
│   │   │   │   ├── split-engine/page.tsx
│   │   │   │   └── vistorias/page.tsx
│   │   │   ├── comissoes/ (Regras de Repasse & Gerador de RPA)
│   │   │   ├── cca-credito/ (Esteira Bancária Caixa/Itaú)
│   │   │   ├── operacoes/ (Controle de Frotas & Inventário Patrimonial)
│   │   │   ├── gamificacao/ (Ranking & Indicou-Ganhou)
│   │   │   ├── universidade/ (LMS & Podcasts)
│   │   │   └── mkt-brand/ (Brand Equity Hub & QR Placas)
│   │   └── api/
│   │       ├── webhooks/asaas-split/route.ts
│   │       ├── webhooks/whatsapp/route.ts
│   │       └── acert-ai/sdr/route.ts
│   ├── components/
│   │   ├── ui/ (Button, Dialog, Sheet, Tabs, Badge)
│   │   ├── omnichannel/ (WhatsApp Chat, Timeline, Ghost Manager)
│   │   ├── sales-mirror/ (UnitGrid, TowerViewer, LockReservationModal)
│   │   ├── fintech/ (PixSplitCalculator, SettlementReceipt)
│   │   └── roleta/ (RouletteWheel, QueueRoster, DistributionWorker)
│   ├── lib/
│   │   ├── prisma.ts (Database client with RLS)
│   │   ├── supabaseClient.ts
│   │   └── asaasSdk.ts (Fintech Split API)
│   └── actions/ (Server Actions with optimistic mutation)
│       ├── lockUnitAction.ts
│       ├── executeSplitAction.ts
│       └── distributeLeadAction.ts
└── prisma/
    └── schema.prisma (PostgreSQL Multi-Tenant Schema)`;
