import { ArrowLeft, BookOpen, Download, FileText, ListFilter, PlayCircle, Settings, Shield, Terminal } from 'lucide-react';
import React from 'react';
import { Link } from '../context/RouterContext';
import { DEFAULT_BRAND_CONFIG } from '../data/branding';
import { BotStatus } from '../types/scamlock';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  botStatus: BotStatus;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, botStatus }) => {
  const tabs = [
    { id: 'tester', label: 'Simulador / Tester', icon: PlayCircle },
    { id: 'logs', label: 'Incidentes & Logs', icon: FileText },
    { id: 'config', label: 'Configuración Servidor', icon: Settings },
    { id: 'whitelist', label: 'Whitelist Dominios', icon: ListFilter },
    { id: 'commands', label: 'Comandos Slash', icon: Terminal },
    { id: 'setup', label: 'Guía de Instalación', icon: BookOpen },
  ];

  return (
    <header className="bg-black border-b border-zinc-800 sticky top-0 z-50 text-zinc-100 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-red-900/60 flex items-center justify-center text-red-500 shadow-inner">
              <Shield className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-mono">
                  {DEFAULT_BRAND_CONFIG.projectName}
                </span>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-red-950/60 text-red-400 border border-red-800/60 font-mono">
                  CONSOLE
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Panel de Moderación & Simulador Heurístico
              </p>
            </div>
          </Link>

          {/* Bot Live Status Badge & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              id="back-to-website-btn"
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-800 hover:border-red-900/60 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline">Volver a la Web</span>
              <span className="sm:hidden">Web</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
              {botStatus.online ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="font-medium text-red-400">Conectado a Discord</span>
                  <span className="text-zinc-500 hidden lg:inline">• {botStatus.pingMs}ms</span>
                </>
              ) : botStatus.mode === 'standby' ? (
                <>
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                  <span className="font-medium text-amber-400">En Espera de Token</span>
                </>
              ) : (
                <>
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                  <span className="font-medium text-zinc-300">Modo Interactivo & Demo</span>
                </>
              )}
            </div>

            <a
              id="download-zip-btn"
              href="/scamlock-bot.zip"
              download="scamlock-bot.zip"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm transition-colors border border-red-500/50"
              title="Descargar paquete ZIP completo listo para alojar en VPS o Cloud"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descargar ZIP Host</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none border-t border-zinc-800/80 sm:border-t-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-red-500 text-white bg-red-950/20'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-zinc-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
