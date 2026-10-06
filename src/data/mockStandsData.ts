import { StandVendas, RoletaRuleConfig } from '../types/crm';

export const DEFAULT_ROLETA_RULES: RoletaRuleConfig = {
  dailyDrawTime: '08:30',
  lateArrivalToleranceMinutes: 15,
  maxAbsenceMinutes: 15,
  absencePenalty: 'FINAL_DA_FILA',
  geofenceRadiusMeters: 10, // Exatamente 10 metros conforme regra solicitada
  autoEnforceTimeouts: true,
  shifts: [
    {
      id: 'shift_manha',
      name: 'Turno Matutino (Manhã)',
      drawTime: '08:30',
      startTime: '08:00',
      endTime: '13:00'
    },
    {
      id: 'shift_tarde',
      name: 'Turno Vespertino (Tarde)',
      drawTime: '13:15',
      startTime: '13:00',
      endTime: '19:00'
    },
    {
      id: 'shift_fds',
      name: 'Plantão Especial Fim de Semana',
      drawTime: '09:00',
      startTime: '08:30',
      endTime: '18:00'
    }
  ]
};

export const INITIAL_STANDS_VENDAS: StandVendas[] = [
  {
    id: 'stand_jardins_one',
    name: 'Stand Residencial Jardins One & Sky Lounge',
    developmentTitle: 'Residencial Jardins One & Sky Lounge',
    address: 'Alameda Lorena, 1420 - Jardins, São Paulo - SP',
    latitude: -23.561684,
    longitude: -46.655981,
    geofenceRadiusMeters: 10, // Validação estrita de 10 metros
    status: 'ABERTO',
    dailyDrawTime: '08:30',
    maxAbsenceMinutes: 15,
    activeShift: 'MANHA',
    attendanceList: [
      {
        id: 'att_1',
        brokerId: 'usr_corretor_juliana',
        brokerName: 'Juliana Mendes',
        brokerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        brokerPhone: '(11) 97777-2005',
        brokerCreci: '210984-F',
        checkInTime: '08:14',
        distanceMeters: 3.4,
        gpsStatus: 'VALIDADO_NO_RAIO',
        queuePosition: 1,
        status: 'EM_ATENDIMENTO',
        leadsAttendedCount: 2,
        userCoords: { lat: -23.561689, lng: -46.655979 }
      },
      {
        id: 'att_2',
        brokerId: 'usr_corretor_roberto',
        brokerName: 'Roberto Silveira',
        brokerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        brokerPhone: '(11) 97777-2008',
        brokerCreci: '198765-F',
        checkInTime: '08:21',
        distanceMeters: 5.8,
        gpsStatus: 'VALIDADO_NO_RAIO',
        queuePosition: 2,
        status: 'DISPONIVEL',
        leadsAttendedCount: 1,
        userCoords: { lat: -23.561695, lng: -46.655986 }
      },
      {
        id: 'att_3',
        brokerId: 'usr_corretor_fernanda',
        brokerName: 'Fernanda Castro',
        brokerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        brokerPhone: '(11) 98888-3434',
        brokerCreci: '221450-F',
        checkInTime: '08:25',
        distanceMeters: 4.1,
        gpsStatus: 'VALIDADO_NO_RAIO',
        queuePosition: 3,
        status: 'AUSENTE_PAUSADO',
        absenceStartedAt: '08:42',
        absenceSecondsRemaining: 510, // 8.5 minutos restantes de 15m
        absenceReason: 'Visita rápida ao decorado / Café',
        leadsAttendedCount: 1,
        userCoords: { lat: -23.561680, lng: -46.655975 }
      },
      {
        id: 'att_4',
        brokerId: 'usr_corretor_carlos',
        brokerName: 'Carlos Eduardo Silveira',
        brokerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        brokerPhone: '(11) 97654-3210',
        brokerCreci: '189420-F',
        checkInTime: '08:28',
        distanceMeters: 7.9,
        gpsStatus: 'VALIDADO_NO_RAIO',
        queuePosition: 4,
        status: 'DISPONIVEL',
        leadsAttendedCount: 0,
        userCoords: { lat: -23.561702, lng: -46.655988 }
      },
      {
        id: 'att_5',
        brokerId: 'usr_corretor_thiago',
        brokerName: 'Thiago Costa (Fora do Raio)',
        brokerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        brokerPhone: '(11) 98111-2233',
        brokerCreci: '204918-F',
        checkInTime: '08:32',
        distanceMeters: 84.6, // FORA DO RAIO DE 10M
        gpsStatus: 'FORA_DO_RAIO',
        queuePosition: 5,
        status: 'DISPONIVEL',
        leadsAttendedCount: 0,
        userCoords: { lat: -23.562300, lng: -46.656500 }
      }
    ],
    history: [
      {
        id: 'hdr_1',
        timestamp: 'Hoje às 08:30',
        standName: 'Stand Residencial Jardins One & Sky Lounge',
        shiftName: 'Turno Matutino',
        participantsCount: 4,
        drawnOrder: [
          { position: 1, brokerName: 'Juliana Mendes', distanceMeters: 3.4, gpsStatus: 'VALIDADO_NO_RAIO' },
          { position: 2, brokerName: 'Roberto Silveira', distanceMeters: 5.8, gpsStatus: 'VALIDADO_NO_RAIO' },
          { position: 3, brokerName: 'Fernanda Castro', distanceMeters: 4.1, gpsStatus: 'VALIDADO_NO_RAIO' },
          { position: 4, brokerName: 'Carlos Eduardo Silveira', distanceMeters: 7.9, gpsStatus: 'VALIDADO_NO_RAIO' }
        ]
      }
    ]
  },
  {
    id: 'stand_reserva_alphaville',
    name: 'Stand Mansões Reserva Alphaville',
    developmentTitle: 'Reserva Alphaville 2 Privilege',
    address: 'Alameda das Quaresmeiras, 340 - Alphaville Residencial 2, Barueri - SP',
    latitude: -23.498820,
    longitude: -46.852910,
    geofenceRadiusMeters: 10,
    status: 'ABERTO',
    dailyDrawTime: '09:00',
    maxAbsenceMinutes: 20,
    activeShift: 'INTEGRAL',
    attendanceList: [
      {
        id: 'att_alpha_1',
        brokerId: 'usr_corretor_juliana',
        brokerName: 'Juliana Mendes',
        brokerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        brokerPhone: '(11) 97777-2005',
        brokerCreci: '210984-F',
        checkInTime: '08:50',
        distanceMeters: 4.5,
        gpsStatus: 'VALIDADO_NO_RAIO',
        queuePosition: 1,
        status: 'DISPONIVEL',
        leadsAttendedCount: 0
      },
      {
        id: 'att_alpha_2',
        brokerId: 'usr_corretor_roberto',
        brokerName: 'Roberto Silveira',
        brokerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        brokerPhone: '(11) 97777-2008',
        brokerCreci: '198765-F',
        checkInTime: '08:55',
        distanceMeters: 6.8,
        gpsStatus: 'VALIDADO_NO_RAIO',
        queuePosition: 2,
        status: 'DISPONIVEL',
        leadsAttendedCount: 0
      }
    ],
    history: []
  },
  {
    id: 'stand_sky_tower',
    name: 'Stand Sky Tower Faria Lima Corporate',
    developmentTitle: 'Sky Tower Corporate & Boutique',
    address: 'Av. Brigadeiro Faria Lima, 2800 - Itaim Bibi, São Paulo - SP',
    latitude: -23.585210,
    longitude: -46.682340,
    geofenceRadiusMeters: 10,
    status: 'ABERTO',
    dailyDrawTime: '08:30',
    maxAbsenceMinutes: 15,
    activeShift: 'MANHA',
    attendanceList: [
      {
        id: 'att_sky_1',
        brokerId: 'usr_corretor_fernanda',
        brokerName: 'Fernanda Castro',
        brokerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        brokerPhone: '(11) 98888-3434',
        brokerCreci: '221450-F',
        checkInTime: '08:20',
        distanceMeters: 2.9,
        gpsStatus: 'VALIDADO_NO_RAIO',
        queuePosition: 1,
        status: 'DISPONIVEL',
        leadsAttendedCount: 1
      }
    ],
    history: []
  }
];
