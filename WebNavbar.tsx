import {
  ExternalLink,
  FileText,
  LifeBuoy,
  Lock,
  Menu,
  PlayCircle,
  Shield,
  ShieldAlert,
  Terminal,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useRouter } from '../../context/RouterContext';
import { DEFAULT_BRAND_CONFIG } from '../../data/branding';

interface WebNavbarProps {
  onOpenDashboard?: () => void;
}

export const WebNavbar: React.FC<WebNavbarProps> = () => {
  const { path } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Inicio', icon: Shield, id: 'home' },
    { href: '/security', label: 'Seguridad', icon: Lock, id: 'security' },
    { href: '/support', label: 'Soporte', icon: LifeBuoy, id: 'support' },
    { href: '/privacy', label: 'Privacidad', icon: ShieldAlert, id: 'privacy' },
    { href: '/terms', label: 'Términos', icon: FileText, id: 'terms' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link
            id="brand-logo-link"
            href="/"
            className="flex items-center gap-3 group transition-opacity hover:opacity-95"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-red-900/60 text-red-500 shadow-inner group-hover:border-red-500/70 transition-colors">
              <Shield className="w-5 h-5 text-red-500" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-black flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-mono">
                  {DEFAULT_BRAND_CONFIG.projectName}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/60 font-mono">
                  DEFENSE
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Seguridad & Anti-Phishing para Discord
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = path === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  id={`nav-link-${link.id}`}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-red-950/40 text-red-400 border border-red-800/60 shadow-sm'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/80 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-500' : 'text-zinc-500'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              id="cta-dashboard-link"
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                path === '/dashboard'
                  ? 'bg-red-600 text-white border-red-500 shadow'
                  : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border-zinc-800 hover:border-red-900/60'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5 text-red-400" />
              <span>Consola & Simulador</span>
            </Link>

            <a
              id="cta-invite-discord-btn"
              href={DEFAULT_BRAND_CONFIG.discordInviteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-semibold shadow-lg shadow-red-950/50 transition-all border border-red-500/40 active:scale-95"
            >
              <span>Añadir a Discord</span>
              <ExternalLink className="w-3 h-3 text-red-200" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              id="mobile-quick-console-btn"
              href="/dashboard"
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-red-400 font-semibold"
            >
              Consola
            </Link>
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-red-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950/98 px-4 pt-3 pb-5 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = path === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  id={`mobile-nav-${link.id}`}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-950/50 text-red-400 border border-red-800/60'
                      : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-500' : 'text-zinc-500'}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-zinc-800/80 space-y-2">
            <Link
              id="mobile-drawer-dashboard"
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-semibold"
            >
              <PlayCircle className="w-4 h-4 text-red-400" />
              Consola Interactiva & Simulador
            </Link>

            <a
              id="mobile-drawer-invite"
              href={DEFAULT_BRAND_CONFIG.discordInviteUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow"
            >
              <span>Añadir Scam Lock a Discord</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
