import {
  Download,
  FileCode,
  Globe,
  LifeBuoy,
  Lock,
  Mail,
  Shield,
  ShieldAlert,
  Terminal
} from 'lucide-react';
import React from 'react';
import { Link } from '../../context/RouterContext';
import { DEFAULT_BRAND_CONFIG } from '../../data/branding';

export const WebFooter: React.FC = () => {
  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400 text-xs">
      {/* Upper Navigation & Brand Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-red-900/60 flex items-center justify-center text-red-500">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-base font-mono tracking-tight">
                {DEFAULT_BRAND_CONFIG.projectName}
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Detección heurística de amenazas, intercepción de phishing, bloqueo de enlaces maliciosos y estafas financieras para servidores de Discord.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/60 border border-red-800/60 text-red-400 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Motor Activo
              </span>
              <span className="text-zinc-700 text-[10px]">•</span>
              <span className="text-zinc-500 text-[10px] font-mono">Heuristic Core v1.0</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider font-mono">
              Navegación
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  id="footer-nav-home"
                  href="/"
                  className="hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Inicio & Características</span>
                </Link>
              </li>
              <li>
                <Link
                  id="footer-nav-security"
                  href="/security"
                  className="hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Seguridad & Arquitectura</span>
                </Link>
              </li>
              <li>
                <Link
                  id="footer-nav-support"
                  href="/support"
                  className="hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <LifeBuoy className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Centro de Soporte & FAQ</span>
                </Link>
              </li>
              <li>
                <Link
                  id="footer-nav-console"
                  href="/dashboard"
                  className="hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Consola & Simulador en Vivo</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider font-mono">
              Políticas y Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  id="footer-nav-privacy"
                  href="/privacy"
                  className="hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Política de Privacidad</span>
                </Link>
              </li>
              <li>
                <Link
                  id="footer-nav-terms"
                  href="/terms"
                  className="hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Términos de Servicio</span>
                </Link>
              </li>
              <li>
                <a
                  id="footer-security-disclosure"
                  href={`mailto:${DEFAULT_BRAND_CONFIG.securityEmail}?subject=[Scam%20Lock]%20Reporte%20de%20Vulnerabilidad`}
                  className="hover:text-red-400 transition-colors flex items-center gap-1.5 font-mono text-[11px]"
                >
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Reporte de Vulnerabilidad</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Deployment & Self-Hosting */}
          <div className="space-y-3">
            <h4 className="text-zinc-200 text-xs font-bold uppercase tracking-wider font-mono">
              Código & GitHub Pages
            </h4>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Diseñado para publicarse en GitHub Pages y autohospedarse con Node.js y Discord.js.
            </p>
            <div className="pt-1">
              <a
                id="footer-download-source-zip"
                href="/scamlock-bot.zip"
                download="scamlock-bot.zip"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-red-900/60 text-zinc-200 text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-red-500" />
                <span>Descargar Proyecto (.zip)</span>
              </a>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">
              Variables en <code className="text-zinc-400 font-mono">branding.ts</code>
            </p>
          </div>
        </div>
      </div>

      {/* Lower Bar with Transparency Disclaimers */}
      <div className="border-t border-zinc-900 bg-zinc-950/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              © {new Date().getFullYear()} {DEFAULT_BRAND_CONFIG.projectName}. Titular / Desarrollador:{' '}
              <span className="text-zinc-300 font-mono">{DEFAULT_BRAND_CONFIG.ownerName}</span>.
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Software de Seguridad Independiente.</span>
          </div>

          <p className="text-center md:text-right max-w-xl text-[11px] text-zinc-500">
            Aviso de transparencia: Scam Lock es un proyecto de software independiente. Discord es una marca registrada de Discord Inc. Scam Lock no está afiliado ni respaldado por Discord Inc. Ningún software de seguridad garantiza la detección del 100% de las amenazas.
          </p>
        </div>
      </div>
    </footer>
  );
};
