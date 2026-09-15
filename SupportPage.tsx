import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Github,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageSquare,
  Shield,
  Terminal,
  Wrench
} from 'lucide-react';
import React, { useState } from 'react';
import { Link } from '../../context/RouterContext';
import { DEFAULT_BRAND_CONFIG } from '../../data/branding';
import { PageNavButtons } from './PageNavButtons';
import { PlaceholderNotice } from './PlaceholderNotice';

interface FAQItem {
  question: string;
  category: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Configuración y Permisos',
    question: '¿Por qué Scam Lock no puede borrar mensajes o silenciar a ciertos usuarios?',
    answer:
      'En Discord, la jerarquía de roles es estricta. El rol asignado a Scam Lock debe colocarse por ENCIMA de los roles que el bot necesita moderar (en Ajustes del Servidor > Roles). Además, el bot debe contar con los permisos "Gestionar Mensajes" (Manage Messages) y "Aislar Temporalmente a Miembros" (Moderate Members). El bot nunca podrá sancionar al Propietario del Servidor ni a roles superiores al suyo.',
  },
  {
    category: 'Configuración y Permisos',
    question: '¿Cómo configuro el canal donde se envían las alertas de seguridad?',
    answer:
      'Utiliza el comando de barra oblicua `/config log-channel #nombre-del-canal` en tu servidor. Asegúrate de que el bot tenga permisos de "Ver Canal" y "Enviar Mensajes" en ese canal privado de moderación.',
  },
  {
    category: 'Detección y Precisión',
    question: '¿Qué hago si el bot marca un enlace legítimo por error (Falso Positivo)?',
    answer:
      'Puedes añadir dominios confiables a la lista blanca comunitaria de tu servidor ejecutando `/whitelist add <dominio>` (por ejemplo `/whitelist add mitiendaoficial.com`). Los dominios verificados en la lista blanca reciben un descuento inmediato en el cálculo heurístico.',
  },
  {
    category: 'Detección y Precisión',
    question: '¿Scam Lock detecta el 100% de los ataques de phishing y estafas?',
    answer:
      'No. Ningún sistema automatizado puede garantizar la detección del 100% de las amenazas emergentes. Los atacantes crean continuamente dominios nuevos, técnicas de ofuscación y nuevos ardides de ingeniería social. Scam Lock es una poderosa barrera de defensa preventiva, pero debe complementarse con la prudencia de los usuarios y la vigilancia de los moderadores humanos.',
  },
  {
    category: 'Privacidad y Rendimiento',
    question: '¿Scam Lock guarda copias de los mensajes cotidianos de mi servidor?',
    answer:
      'No. El contenido de los mensajes se examina exclusivamente en memoria RAM volátil en milisegundos y se descarta de inmediato si no supera el umbral de riesgo. Solo se registran fragmentos de evidencia en incidentes de seguridad confirmados para alimentar el log de moderación de tu servidor.',
  },
  {
    category: 'Soporte y Código',
    question: '¿Puedo autohospedar Scam Lock en mi propio VPS o servidor?',
    answer:
      'Sí. Puedes descargar el código fuente completo en formato .zip desde esta web, configurar tus variables en el archivo .env (DISCORD_TOKEN, CLIENT_ID) y ejecutarlo con Node.js 18+ o Docker en tu propia infraestructura.',
  },
];

export const SupportPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Top Breadcrumb & Return to Home */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <Link
          id="support-back-home-top"
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
          <span>Volver al Inicio</span>
        </Link>
        <span className="text-[11px] font-mono text-zinc-500">
          Centro de Ayuda & Asistencia Técnica
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-xs font-mono">
          <LifeBuoy className="w-3.5 h-3.5 text-red-500" />
          <span>CENTRO DE ASISTENCIA & RESOLUCIÓN DE DUDAS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Soporte y Documentación de {DEFAULT_BRAND_CONFIG.projectName}
        </h1>
        <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">
          Encuentra asistencia rápida para configurar el bot en tu servidor, resolver problemas de permisos en Discord y consultar las preguntas frecuentes.
        </p>
      </div>

      {/* Operator Customization Banner */}
      <PlaceholderNotice pageName="Soporte y Contacto" />

      {/* 3 Direct Support Channels Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Discord Support Server */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-3 flex flex-col justify-between shadow-xl">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Comunidad en Discord</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Únete a nuestro servidor de Discord para recibir asistencia en directo, soporte entre administradores y avisos de actualización.
            </p>
          </div>
          <div className="pt-2">
            <a
              id="support-channel-discord-btn"
              href={DEFAULT_BRAND_CONFIG.discordSupportServerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold w-full justify-center transition-colors shadow"
            >
              <span>Entrar al Servidor</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <div className="text-[10px] font-mono text-zinc-500 mt-1.5 truncate">
              {DEFAULT_BRAND_CONFIG.discordSupportServerUrl}
            </div>
          </div>
        </div>

        {/* Direct Email Support */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-3 flex flex-col justify-between shadow-xl">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
              <Mail className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">Correo de Soporte</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Para consultas técnicas formales, solicitudes de eliminación de datos de servidor o dudas sobre privacidad.
            </p>
          </div>
          <div className="pt-2">
            <a
              id="support-channel-email-btn"
              href={`mailto:${DEFAULT_BRAND_CONFIG.supportEmail}?subject=[Scam%20Lock]%20Solicitud%20de%20Soporte`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-zinc-200 text-xs font-semibold w-full justify-center transition-colors"
            >
              <span>Escribir por Correo</span>
              <Mail className="w-3 h-3 text-red-400" />
            </a>
            <div className="text-[10px] font-mono text-zinc-500 mt-1.5 truncate">
              {DEFAULT_BRAND_CONFIG.supportEmail}
            </div>
          </div>
        </div>

        {/* GitHub / Bug Reports */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-3 flex flex-col justify-between shadow-xl">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
              <Github className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-white">GitHub Issues & Código</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Reporta errores de software, sugiere nuevos patrones heurísticos o revisa el código fuente auditable en GitHub.
            </p>
          </div>
          <div className="pt-2">
            <a
              id="support-channel-github-btn"
              href={DEFAULT_BRAND_CONFIG.githubRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-zinc-200 text-xs font-semibold w-full justify-center transition-colors"
            >
              <span>Ver Repositorio</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
            <div className="text-[10px] font-mono text-zinc-500 mt-1.5 truncate">
              {DEFAULT_BRAND_CONFIG.githubRepoUrl}
            </div>
          </div>
        </div>
      </div>

      {/* Administrator Troubleshooting Checklist */}
      <section className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
          <Wrench className="w-4 h-4 text-red-500" />
          <span>Guía de Solución de Problemas Frecuentes para Administradores</span>
        </div>
        <h2 className="text-lg font-bold text-white">
          Comprobaciones Esenciales si el Bot No Responde o No Modera
        </h2>

        <div className="space-y-3 text-xs text-zinc-300">
          <div className="p-3.5 rounded-xl bg-black border border-zinc-850 space-y-1">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="text-red-500 font-mono">1.</span>
              <span>Jerarquía de Roles de Discord</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              En Ajustes del Servidor &gt; Roles, asegúrate de arrastrar el rol de{' '}
              <strong className="text-zinc-200">Scam Lock</strong> por encima de los roles habituales de los usuarios. Discord impide a cualquier bot moderar miembros con roles iguales o superiores al suyo.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-zinc-850 space-y-1">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="text-red-500 font-mono">2.</span>
              <span>Permisos del Canal</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Verifica que el bot tenga el permiso <code className="text-zinc-200 font-mono">Gestionar Mensajes</code> (para suprimir enlaces peligrosos) y <code className="text-zinc-200 font-mono">Ver Canal</code> en los canales que deseas proteger.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black border border-zinc-850 space-y-1">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="text-red-500 font-mono">3.</span>
              <span>Permisos Privilegiados de Gateway (Para Autohospedaje)</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Si autohospedas el bot con tu propio token, debes activar el intent privilegiado{' '}
              <code className="text-red-300 font-mono">MESSAGE CONTENT INTENT</code> en el Discord Developer Portal (pestaña Bot &gt; Privileged Gateway Intents).
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (Accordion) */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-red-500" />
            <span>Preguntas Frecuentes</span>
          </div>
          <h2 className="text-xl font-bold text-white">Respuestas a Dudas Comunes</h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-zinc-950 border border-zinc-850 overflow-hidden transition-colors"
              >
                <button
                  id={`faq-toggle-btn-${idx}`}
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-red-400 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-red-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-zinc-300 leading-relaxed border-t border-zinc-900 animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Cross-page Navigation Footer */}
      <PageNavButtons currentPage="support" />
    </div>
  );
};
