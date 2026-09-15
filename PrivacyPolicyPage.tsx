import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Database,
  EyeOff,
  FileCheck,
  Globe,
  Lock,
  Mail,
  Scale,
  Server,
  Shield,
  ShieldAlert,
  Terminal,
  Trash2,
  UserCheck
} from 'lucide-react';
import React from 'react';
import { Link } from '../../context/RouterContext';
import { DEFAULT_BRAND_CONFIG } from '../../data/branding';
import { PageNavButtons } from './PageNavButtons';
import { PlaceholderNotice } from './PlaceholderNotice';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Top Breadcrumb & Return to Home Button */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <Link
          id="privacy-back-home-top"
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
          <span>Volver al Inicio</span>
        </Link>
        <span className="text-[11px] font-mono text-zinc-500">
          Documento Legal / Privacidad de Datos
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-xs font-mono">
          <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
          <span>DOCUMENTO OFICIAL DE PROTECCIÓN DE DATOS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Política de Privacidad de {DEFAULT_BRAND_CONFIG.projectName}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            Vigente desde:{' '}
            <code className="text-red-300 bg-red-950/40 px-1.5 py-0.5 rounded border border-red-900/50">
              {DEFAULT_BRAND_CONFIG.effectiveDate}
            </code>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            Última actualización:{' '}
            <code className="text-red-300 bg-red-950/40 px-1.5 py-0.5 rounded border border-red-900/50">
              {DEFAULT_BRAND_CONFIG.lastUpdatedDate}
            </code>
          </span>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Esta Política de Privacidad describe de forma veraz, transparente y exhaustiva el tratamiento que{' '}
          <strong className="text-white font-semibold">{DEFAULT_BRAND_CONFIG.projectName}</strong> (en adelante, "el Bot" o "el Servicio") hace de la información. No recopilamos datos personales innecesarios, no archivamos el historial de chat de los usuarios y no comercializamos ninguna información.
        </p>
      </div>

      {/* Operator Customization Banner with copy tool */}
      <PlaceholderNotice pageName="Política de Privacidad" />

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Database className="w-4 h-4 text-red-500" />
            <span>Memoria Volátil (RAM)</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Los mensajes normales se analizan en memoria y se descartan en milisegundos tras comprobar que son seguros.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <EyeOff className="w-4 h-4 text-red-500" />
            <span>Sin Acceso a DMs</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            El bot no puede leer mensajes privados ni mensajes de canales donde no posea permisos explícitos otorgados por administradores.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Trash2 className="w-4 h-4 text-red-500" />
            <span>Derecho al Olvido</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Cualquier administrador o usuario puede solicitar la eliminación de configuraciones de servidor asociadas a sus IDs.
          </p>
        </div>
      </div>

      {/* Structured Legal Content */}
      <div className="space-y-8 text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-6">
        {/* 1. Responsable del Tratamiento */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">1.</span>
            <span>Identificación del Responsable del Tratamiento</span>
          </h2>
          <p>
            El responsable de la gestión, desarrollo técnico y administración del software{' '}
            <strong className="text-white">{DEFAULT_BRAND_CONFIG.projectName}</strong> es:
          </p>
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs space-y-1.5 text-zinc-300">
            <div>
              <span className="text-zinc-500">Titular / Operador:</span>{' '}
              <code className="text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/60">
                {DEFAULT_BRAND_CONFIG.ownerName}
              </code>{' '}
              (Alias en Discord/GitHub:{' '}
              <code className="text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/60">
                {DEFAULT_BRAND_CONFIG.ownerAlias}
              </code>)
            </div>
            <div>
              <span className="text-zinc-500">Correo electrónico de contacto:</span>{' '}
              <code className="text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/60">
                {DEFAULT_BRAND_CONFIG.contactEmail}
              </code>
            </div>
            <div>
              <span className="text-zinc-500">Correo para asuntos de seguridad:</span>{' '}
              <code className="text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/60">
                {DEFAULT_BRAND_CONFIG.securityEmail}
              </code>
            </div>
            <div>
              <span className="text-zinc-500">Servidor oficial de soporte:</span>{' '}
              <a
                href={DEFAULT_BRAND_CONFIG.discordSupportServerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-red-400 underline hover:text-red-300"
              >
                {DEFAULT_BRAND_CONFIG.discordSupportServerUrl}
              </a>
            </div>
          </div>
          <p className="text-xs text-zinc-400">
            Scam Lock es un proyecto de software de ciberseguridad independiente concebido para asistir a servidores de Discord contra el fraude digital. No pertenece ni afirma pertenecer a ninguna corporación ficticia.
          </p>
        </section>

        {/* 2. Datos Procesados Estrictamente */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">2.</span>
            <span>Datos que Realmente Procesa el Bot</span>
          </h2>
          <p>
            En cumplimiento estricto del principio de minimización de datos,{' '}
            {DEFAULT_BRAND_CONFIG.projectName} solo procesa la información técnica indispensable para ejecutar las funciones de ciberseguridad que los administradores del servidor le solicitan:
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-red-400">
                A. Contenido de Mensajes en Tránsito (Inspección en Memoria RAM Volátil)
              </h3>
              <p className="mt-1.5 text-xs text-zinc-300">
                Cuando un usuario envía un mensaje en un canal donde el bot tiene permiso para leer, el contenido textual y las URLs son transferidos mediante el Gateway WebSocket oficial de Discord e inspeccionados en memoria por el analizador heurístico.
              </p>
              <ul className="mt-2 space-y-1 text-xs text-zinc-400 list-disc list-inside">
                <li>
                  <strong className="text-zinc-200">Mensajes legítimos (Score &lt; umbral):</strong> Son desechados instantáneamente de la memoria (&lt;15 milisegundos). No se registra el texto ni se guarda copia en ninguna base de datos.
                </li>
                <li>
                  <strong className="text-zinc-200">Mensajes maliciosos confirmados:</strong> Se extraen fragmentos de evidencia técnica (por ejemplo, el dominio de phishing detectado como <code className="text-zinc-300">discord-gift.xyz</code> o el tipo de scam financiero) únicamente para emitir la advertencia de moderación requerida al canal de logs del servidor.
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-red-400">
                B. Identificadores Numéricos Públicos de Discord (Snowflakes)
              </h3>
              <p className="mt-1.5 text-xs text-zinc-300">
                Discord utiliza números públicos no confidenciales para identificar entidades en su plataforma:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-zinc-400 list-disc list-inside">
                <li>
                  <code className="text-zinc-200 font-mono">guild_id</code> (ID del Servidor): Almacenado junto con la configuración de seguridad elegida por los administradores (sensibilidad, canales de logs, umbral de sanción).
                </li>
                <li>
                  <code className="text-zinc-200 font-mono">channel_id</code> (ID del Canal): Empleado para enviar alertas de amenaza y ejecutar el borrado del mensaje infractor.
                </li>
                <li>
                  <code className="text-zinc-200 font-mono">user_id</code> (ID del Usuario): Empleado para aplicar sanciones preventivas delegadas (aislamiento temporal / timeout, advertencia) y evitar que una cuenta comprometida continúe propagando malware.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Datos que NUNCA se Recopilan */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">3.</span>
            <span>Datos que NUNCA Recopilamos</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <strong className="text-zinc-200 block font-semibold">❌ Mensajes Directos (DMs)</strong>
              <p className="text-zinc-400 mt-1">
                El bot no tiene intención ni capacidad técnica de leer tus conversaciones privadas fuera de los servidores autorizados.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <strong className="text-zinc-200 block font-semibold">❌ Audio o Llamadas de Voz</strong>
              <p className="text-zinc-400 mt-1">
                El bot no se conecta a canales de voz, no procesa audio ni graba llamadas de los usuarios.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <strong className="text-zinc-200 block font-semibold">❌ Contraseñas o Tokens de Discord</strong>
              <p className="text-zinc-400 mt-1">
                Scam Lock jamás solicita, procesa ni almacena contraseñas, tokens de autenticación o códigos 2FA.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
              <strong className="text-zinc-200 block font-semibold">❌ Datos Bancarios o de Pago</strong>
              <p className="text-zinc-400 mt-1">
                No recopilamos números de tarjetas de crédito, cuentas bancarias ni credenciales financieras.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Finalidad del Tratamiento y Base Legal */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">4.</span>
            <span>Finalidad y Base Legal del Tratamiento</span>
          </h2>
          <p>
            La información procesada se utiliza con el único fin de:
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-zinc-300 text-xs">
            <li>Detectar e interceptar URLs maliciosas, phishing y scams dirigidos a comunidades.</li>
            <li>Ejecutar acciones automatizadas de mitigación de daños (borrado de mensajes peligrosos, timeout preventivo) según las directrices del administrador.</li>
            <li>Mantener registros de auditoría de incidentes de seguridad accesibles únicamente para los moderadores autorizados del servidor.</li>
          </ul>
          <p className="text-xs text-zinc-400 pt-1">
            <strong className="text-zinc-300">Base Legal:</strong> El tratamiento se fundamenta en el{' '}
            <em>interés legítimo</em> de los administradores y usuarios de salvaguardar la integridad de la comunidad frente al cibercrimen, así como en la relación contractual voluntaria al instalar el bot en el servidor.
          </p>
        </section>

        {/* 5. Conservación y Plazo de Retención */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">5.</span>
            <span>Periodos de Conservación y Eliminación</span>
          </h2>
          <ul className="space-y-2 text-xs text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
              <div>
                <strong className="text-white">Mensajes ordinarios:</strong> 0 días (eliminación inmediata de la memoria volátil en milisegundos).
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
              <div>
                <strong className="text-white">Registros de Incidentes de Seguridad:</strong> Se conservan de forma transitoria en la base de datos del servidor local del bot durante un periodo máximo de hasta 30 días, tras el cual se eliminan automáticamente mediante rotación.
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
              <div>
                <strong className="text-white">Configuración del Servidor:</strong> Se conserva mientras el bot permanezca en el servidor. Si el bot es expulsado del servidor, los administradores pueden solicitar el borrado total de sus registros enviando una solicitud a{' '}
                <code className="text-red-300 font-mono">{DEFAULT_BRAND_CONFIG.contactEmail}</code>.
              </div>
            </li>
          </ul>
        </section>

        {/* 6. Derechos de los Usuarios (Acceso, Supresión, Oposición) */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">6.</span>
            <span>Tus Derechos de Protección de Datos</span>
          </h2>
          <p>
            Cualquier usuario de Discord cuyos datos técnicos hayan sido procesados por Scam Lock tiene derecho a:
          </p>
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-white font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Solicitud de Información y Borrado Inmediato</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Para solicitar la confirmación de si tus identificadores numéricos figuran en los registros de seguridad de un servidor, o para solicitar su eliminación inmediata de nuestra base de datos, envía un correo a{' '}
              <code className="text-red-300 font-mono bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/60">
                {DEFAULT_BRAND_CONFIG.contactEmail}
              </code>{' '}
              indicando tu Discord User ID numérico.
            </p>
          </div>
        </section>

        {/* 7. Contacto Directo */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-red-500 font-mono">7.</span>
            <span>Contacto y Consultas de Privacidad</span>
          </h2>
          <p>
            Si tienes cualquier duda, inquietud o sugerencia sobre esta Política de Privacidad, puedes ponerte en contacto directo con el titular del proyecto a través de:
          </p>
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-zinc-400 block font-sans">Dirección de correo electrónico oficial:</span>
              <span className="text-white font-mono font-bold text-sm">
                {DEFAULT_BRAND_CONFIG.contactEmail}
              </span>
            </div>
            <a
              href={`mailto:${DEFAULT_BRAND_CONFIG.contactEmail}?subject=[Scam%20Lock]%20Consulta%20de%20Privacidad`}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors text-xs"
            >
              Enviar Consulta
            </a>
          </div>
        </section>
      </div>

      {/* Cross-page Navigation Footer */}
      <PageNavButtons currentPage="privacy" />
    </div>
  );
};
