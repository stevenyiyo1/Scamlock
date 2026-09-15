import { ArrowLeft, BookOpen, FileCheck2, FileText, Home, LifeBuoy, Lock, PlayCircle, Shield, ShieldAlert } from 'lucide-react';
import React from 'react';
import { Link, useRouter } from '../../context/RouterContext';

interface PageNavButtonsProps {
  currentPage: 'home' | 'privacy' | 'terms' | 'support' | 'security';
}

export const PageNavButtons: React.FC<PageNavButtonsProps> = ({ currentPage }) => {
  const { path } = useRouter();

  const links = [
    { href: '/', label: 'Inicio', icon: Home, id: 'home' },
    { href: '/security', label: 'Seguridad', icon: Lock, id: 'security' },
    { href: '/support', label: 'Soporte', icon: LifeBuoy, id: 'support' },
    { href: '/privacy', label: 'Privacidad', icon: ShieldAlert, id: 'privacy' },
    { href: '/terms', label: 'Términos', icon: FileText, id: 'terms' },
  ];

  return (
    <div className="pt-8 border-t border-zinc-800/80 space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Back to Home Button */}
        {currentPage !== 'home' ? (
          <Link
            id="page-nav-back-to-home"
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-200 hover:text-white border border-zinc-800 hover:border-red-500/50 text-xs font-semibold font-mono transition-all group"
          >
            <ArrowLeft className="w-4 h-4 text-red-500 group-hover:-translate-x-0.5 transition-transform" />
            <span>Volver a la Página Principal</span>
          </Link>
        ) : (
          <div className="text-xs font-mono text-zinc-500 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-red-500" />
            <span>Scam Lock — Navegación del Sitio</span>
          </div>
        )}

        {/* Quick Links to Other Pages */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {links.map((item) => {
            const isCurrent = currentPage === item.id;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                id={`subnav-${item.id}`}
                href={item.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-red-600/20 text-red-400 border border-red-500/50 shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-red-500' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            id="subnav-dashboard"
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/40 text-red-300 hover:bg-red-900/40 border border-red-800/50 transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5 text-red-400" />
            <span>Consola Interactiva</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
