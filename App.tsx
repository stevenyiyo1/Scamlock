import React, { useEffect, useState } from 'react';
import { CommandsView } from './components/CommandsView';
import { LogsView } from './components/LogsView';
import { MessageSimulator } from './components/MessageSimulator';
import { Navbar } from './components/Navbar';
import { ServerConfigView } from './components/ServerConfigView';
import { SetupGuideView } from './components/SetupGuideView';
import { LandingPage } from './components/website/LandingPage';
import { PrivacyPolicyPage } from './components/website/PrivacyPolicyPage';
import { SecurityPage } from './components/website/SecurityPage';
import { SupportPage } from './components/website/SupportPage';
import { TermsOfServicePage } from './components/website/TermsOfServicePage';
import { WebFooter } from './components/website/WebFooter';
import { WebNavbar } from './components/website/WebNavbar';
import { WhitelistView } from './components/WhitelistView';
import { RouterProvider, useRouter } from './context/RouterContext';
import { DEFAULT_BRAND_CONFIG } from './data/branding';
import { BotStatus } from './types/scamlock';

function AppContent() {
  const { path } = useRouter();
  const [activeConsoleTab, setActiveConsoleTab] = useState<string>('tester');
  const [botStatus, setBotStatus] = useState<BotStatus>({
    online: false,
    botTag: null,
    botId: null,
    guildsCount: 1,
    analyzedCount: 54,
    scamsBlocked: 7,
    uptimeSeconds: 0,
    pingMs: 0,
    mode: 'simulated',
  });

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setBotStatus(data);
      }
    } catch {
      // fallback in simulation mode
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Sync document title and meta tag based on current route path
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': `${DEFAULT_BRAND_CONFIG.projectName} — Bot de Ciberseguridad & Anti-Phishing para Discord`,
      '/privacy': `Política de Privacidad — ${DEFAULT_BRAND_CONFIG.projectName}`,
      '/terms': `Términos de Servicio — ${DEFAULT_BRAND_CONFIG.projectName}`,
      '/support': `Soporte & FAQ — ${DEFAULT_BRAND_CONFIG.projectName}`,
      '/security': `Seguridad & Confianza — ${DEFAULT_BRAND_CONFIG.projectName}`,
      '/dashboard': `Consola & Simulador — ${DEFAULT_BRAND_CONFIG.projectName}`,
    };

    const cleanPath = path.split('?')[0].split('#')[0];
    const pageTitle = titles[cleanPath] || titles['/'];
    document.title = pageTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      if (cleanPath === '/privacy') {
        metaDesc.setAttribute(
          'content',
          'Política de Privacidad de Scam Lock. Procesamiento en memoria volátil efímera y cero archivo de conversaciones cotidianas.'
        );
      } else if (cleanPath === '/terms') {
        metaDesc.setAttribute(
          'content',
          'Términos de Servicio de Scam Lock. Condiciones de uso, descargo de responsabilidad de ciberseguridad y normas de uso aceptable.'
        );
      } else if (cleanPath === '/security') {
        metaDesc.setAttribute(
          'content',
          'Centro de Seguridad y Confianza de Scam Lock. Auditoría de permisos de Discord, motor heurístico y divulgación responsable.'
        );
      } else if (cleanPath === '/support') {
        metaDesc.setAttribute(
          'content',
          'Centro de Asistencia de Scam Lock. Guía de solución de problemas para administradores y preguntas frecuentes.'
        );
      } else {
        metaDesc.setAttribute(
          'content',
          'Scam Lock es un bot de seguridad para Discord que detecta phishing, estafas, ingeniería social, scams financieros y malware.'
        );
      }
    }
  }, [path]);

  // If path is /dashboard (or aliases /demo or /tester), render the Interactive Console
  if (path === '/dashboard' || path === '/demo' || path === '/tester') {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
        <Navbar
          activeTab={activeConsoleTab}
          setActiveTab={setActiveConsoleTab}
          botStatus={botStatus}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeConsoleTab === 'tester' && <MessageSimulator onLogCreated={fetchStatus} />}
          {activeConsoleTab === 'logs' && <LogsView />}
          {activeConsoleTab === 'config' && <ServerConfigView />}
          {activeConsoleTab === 'whitelist' && <WhitelistView />}
          {activeConsoleTab === 'commands' && <CommandsView />}
          {activeConsoleTab === 'setup' && <SetupGuideView />}
        </main>

        <WebFooter />
      </div>
    );
  }

  // Otherwise, render the Website Pages
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      <WebNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {path === '/privacy' ? (
          <PrivacyPolicyPage />
        ) : path === '/terms' ? (
          <TermsOfServicePage />
        ) : path === '/support' ? (
          <SupportPage />
        ) : path === '/security' ? (
          <SecurityPage />
        ) : (
          <LandingPage />
        )}
      </main>

      <WebFooter />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
