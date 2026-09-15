import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileCheck2,
  FileText,
  Gavel,
  Lock,
  Mail,
  Scale,
  Shield,
  ShieldAlert,
  Terminal,
  UserCheck
} from 'lucide-react';
import React from 'react';
import { Link } from '../../context/RouterContext';
import { DEFAULT_BRAND_CONFIG } from '../../data/branding';
import { PageNavButtons } from './PageNavButtons';
import { PlaceholderNotice } from './PlaceholderNotice';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Top Breadcrumb & Return to Home Button */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <Link
          id="terms-back-home-top"
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
          <span>Volver al Inicio</span>
        </Link>
        <span className="text-[11px] font-mono text-zinc-500">
          Documento Legal / Términos de Servicio
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-xs font-mono">
          <FileCheck2 className="w-3.5 h-3.5 text-red-500" />
          <span>CONDICIONES DE USO & ACUERDO DEL SERVICIO</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Términos de Servicio de {DEFAULT_BRAND_CONFIG.projectName}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            Fecha de entrada en vigor:{' '}
            <code className="text-red-300 bg-red-950/40 px-1.5 py-0.5 rounded border border-red-900/50">
              {DEFAULT_BRAND_CONFIG.effectiveDate}
            </code>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            Última revisión:{' '}
            <code className="text-red-300 bg-red-950/40 px-1.5 py-0.5 rounded border border-red-900/50">
              {DEFAULT_BRAND_CONFIG.lastUpdatedDate}
            </code>
          </span>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Al añadir <strong className="text-white font-semibold">{DEFAULT_BRAND_CONFIG.projectName}</strong> a tu servidor de Discord o interactuar con sus comandos, aceptas expresamente cumplir con estos Términos de Servicio. Por favor, léelos con detenimiento.
        </p>
      </div>

      {/* Operator Customization Banner */}
      <PlaceholderNotice pageName="Términos de Servicio" />

      {/* Mandatory Non-100% Notice Box */}
      <div className="p-5 rounded-2xl bg-red-950/30 border border-red-800/60 space-y-2">
        <div className="flex items-center gap-2 text-red-400 font-bold text-xs font-mono uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>Aviso Esencial sobre la Eficacia y Límites de la Ciberseguridad</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          <strong className="text-white font-semibold">
            {DEFAULT_BRAND_CONFIG.projectName} no garantiza la detección del 100% de las amenazas, fraudes, enlaces maliciosos o engaños de ingeniería social.
          </strong>{' '}
          El software opera bajo modelos heurísticos y listas de reputación diseñadas como una capa de defensa en profundidad complementaria. La administración humana del servidor de Discord mantiene en todo momento la supervisión final de sus miembros y contenidos.
        </p>
      </div>

      {/* Structured Terms */}
      <div className="space-y-8 text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-6">
        {/* 1. Partes y Aceptación */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">1.</span>
            <span>Aceptación de los Términos y Partes Contratantes</span>
          </h2>
          <p>
            El presente acuerdo se celebra entre el titular y operador del bot:{' '}
            <code className="text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/60 font-mono text-xs">
              {DEFAULT_BRAND_CONFIG.ownerName}
            </code>{' '}
            (Alias:{' '}
            <code className="text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/60 font-mono text-xs">
              {DEFAULT_BRAND_CONFIG.ownerAlias}
            </code>
            , contacto:{' '}
            <code className="text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/60 font-mono text-xs">
              {DEFAULT_BRAND_CONFIG.contactEmail}
            </code>
            ), y cualquier persona que instale, administre o interactúe con el bot en un servidor de Discord.
          </p>
          <p className="text-xs text-zinc-400">
            Si no estás de acuerdo con alguna parte de estos términos, no debes instalar el bot ni utilizar sus comandos.
          </p>
        </section>

        {/* 2. Capacidad y Autoridad del Administrador */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">2.</span>
            <span>Autoridad y Permisos en el Servidor de Discord</span>
          </h2>
          <p>
            Al invitar a {DEFAULT_BRAND_CONFIG.projectName} a un servidor, declaras y garantizas que:
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-zinc-300 text-xs">
            <li>Posees el rol de Administrador o el permiso <code className="text-zinc-200 font-mono">Manage Guild</code> (Gestionar Servidor) otorgado legítimamente por el propietario del servidor.</li>
            <li>Autorizas a {DEFAULT_BRAND_CONFIG.projectName} a inspeccionar mensajes en los canales autorizados para detectar patrones de phishing y estafas.</li>
            <li>Autorizas al bot a aplicar las sanciones configuradas por tu equipo (como eliminación de mensajes o timeouts automáticos para cuentas comprometidas).</li>
          </ul>
        </section>

        {/* 3. Naturaleza del Servicio */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">3.</span>
            <span>Descripción del Servicio y Operación Técnica</span>
          </h2>
          <p>
            {DEFAULT_BRAND_CONFIG.projectName} es una herramienta automatizada de asistencia a la moderación. Su función principal consiste en evaluar mensajes entrantes mediante motores de puntuación de riesgo, listas negras de dominios y reglas heurísticas de ingeniería social para reducir la exposición de la comunidad a ataques cibernéticos.
          </p>
          <p className="text-xs text-zinc-400">
            El servicio se presta a través de la infraestructura del Gateway de Discord y está sujeto a las limitaciones de latencia, interrupciones o cambios de API propios de Discord Inc.
          </p>
        </section>

        {/* 4. Uso Aceptable y Prohibiciones */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">4.</span>
            <span>Política de Uso Aceptable (Prohibiciones)</span>
          </h2>
          <p>
            Queda terminantemente prohibido utilizar el bot para:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <strong className="text-red-400 block font-mono font-bold">1. Ataques de Denegación (DoS)</strong>
              <p className="text-zinc-400 mt-1">
                Generar inundación intencionada de mensajes o comandos para saturar los recursos de procesamiento del bot.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <strong className="text-red-400 block font-mono font-bold">2. Evasión Maliciosa de Filtros</strong>
              <p className="text-zinc-400 mt-1">
                Utilizar el bot como campo de entrenamiento para perfeccionar campañas activas de phishing contra usuarios.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <strong className="text-red-400 block font-mono font-bold">3. Violación de Normas de Discord</strong>
              <p className="text-zinc-400 mt-1">
                Cualquier actividad que vulnere los Términos de Servicio o las Directrices de la Comunidad de Discord.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <strong className="text-red-400 block font-mono font-bold">4. Falsas Denuncias Masivas</strong>
              <p className="text-zinc-400 mt-1">
                Manipular premeditadamente las opciones de reporte para acosar o sancionar a miembros legítimos sin causa.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Exclusión de Garantías y Limitación de Responsabilidad */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">5.</span>
            <span>Exclusión de Garantías y Limitación de Responsabilidad</span>
          </h2>
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-2 text-zinc-300">
            <p>
              EL SERVICIO SE PROPORCIONA <strong className="text-white">"TAL CUAL" ("AS IS")</strong> Y SEGÚN DISPONIBILIDAD, SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS.
            </p>
            <p className="text-zinc-400">
              EN NINGÚN CASO EL DESARROLLADOR O TITULAR DE SCAM LOCK SERÁ RESPONSABLE POR DAÑOS DIRECTOS, INDIRECTOS, INCIDENTALES, PÉRDIDA DE DATOS, ROBO DE CUENTAS POR PARTE DE TERCEROS ATACANTES, INTERRUPCIONES DEL SERVIDOR O PÉRDIDAS FINANCIERAS SUFRIDAS POR USUARIOS O SERVIDORES.
            </p>
            <p className="text-zinc-400">
              La protección total contra el cibercrimen exige precaución individual por parte de cada usuario (no compartir contraseñas, no hacer clic en enlaces sospechosos y no desactivar la verificación en dos pasos).
            </p>
          </div>
        </section>

        {/* 6. Modificaciones y Rescisión */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">6.</span>
            <span>Modificaciones de los Términos y Rescisión</span>
          </h2>
          <p>
            Nos reservamos el derecho de actualizar estos Términos de Servicio cuando sea necesario para reflejar cambios legales, técnicos o de seguridad en el bot. Los cambios se notificarán mediante actualización de la fecha en esta página web y en el servidor oficial de soporte.
          </p>
          <p className="text-xs text-zinc-400">
            Cualquier administrador puede rescindir el presente acuerdo en cualquier momento simplemente expulsando a {DEFAULT_BRAND_CONFIG.projectName} de su servidor de Discord.
          </p>
        </section>

        {/* 7. Contacto para Cuestiones Legales */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">7.</span>
            <span>Canal de Contacto</span>
          </h2>
          <p>
            Para consultas relacionadas con estos Términos de Servicio, puedes dirigirte a:
          </p>
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300">
            Correo de contacto legal:{' '}
            <code className="text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/60">
              {DEFAULT_BRAND_CONFIG.contactEmail}
            </code>
          </div>
        </section>
      </div>

      {/* Cross-page Navigation Footer */}
      <PageNavButtons currentPage="terms" />
    </div>
  );
};
