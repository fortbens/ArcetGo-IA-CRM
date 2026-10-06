import React, { useState } from 'react';
import { X, Database, Copy, Check, Terminal, FolderTree, Layers } from 'lucide-react';
import { PRISMA_SCHEMA_CODE, ARCHITECTURE_TREE } from '../../data/databaseSchema';

interface DatabaseSchemaModalProps {
  onClose: () => void;
}

export const DatabaseSchemaModal: React.FC<DatabaseSchemaModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'prisma' | 'architecture'>('prisma');
  const [copied, setCopied] = useState(false);

  const activeContent = activeTab === 'prisma' ? PRISMA_SCHEMA_CODE : ARCHITECTURE_TREE;

  const handleCopy = () => {
    navigator.clipboard?.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 max-w-4xl w-full shadow-2xl border border-slate-800 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Schema do Banco Relacional & Arquitetura Next.js 14
              </h3>
              <p className="text-xs text-slate-400">
                PostgreSQL DDL / Prisma ORM com multi-tenancy & isolamento RLS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 pt-3 pb-2 border-b border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('prisma')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'prisma'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Prisma Schema (schema.prisma / PostgreSQL)
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'architecture'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Estrutura de Pastas (Next.js 14 App Router)
          </button>
        </div>

        {/* Code View */}
        <div className="flex-1 overflow-y-auto mt-3 p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 select-text">
          <pre className="whitespace-pre-wrap">{activeContent}</pre>
        </div>
      </div>
    </div>
  );
};
