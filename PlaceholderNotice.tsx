import { AlertCircle, Check, Copy, Info, Settings2 } from 'lucide-react';
import React, { useState } from 'react';
import { DEFAULT_BRAND_CONFIG } from '../../data/branding';

interface PlaceholderNoticeProps {
  pageName: string;
}

export const PlaceholderNotice: React.FC<PlaceholderNoticeProps> = ({ pageName }) => {
  const [copied, setCopied] = useState(false);

  const configSnippet = `// Archivo: /src/data/branding.ts
export const DEFAULT_BRAND_CONFIG = {
  ownerName: "${DEFAULT_BRAND_CONFIG.ownerName}",
  ownerAlias: "${DEFAULT_BRAND_CONFIG.ownerAlias}",
  contactEmail: "${DEFAULT_BRAND_CONFIG.contactEmail}",
  supportEmail: "${DEFAULT_BRAND_CONFIG.supportEmail}",
  securityEmail: "${DEFAULT_BRAND_CONFIG.securityEmail}",
  discordInviteUrl: "${DEFAULT_BRAND_CONFIG.discordInviteUrl}",
  discordSupportServerUrl: "${DEFAULT_BRAND_CONFIG.discordSupportServerUrl}",
  githubRepoUrl: "${DEFAULT_BRAND_CONFIG.githubRepoUrl}",
  effectiveDate: "${DEFAULT_BRAND_CONFIG.effectiveDate}",
  lastUpdatedDate: "${DEFAULT_BRAND_CONFIG.lastUpdatedDate}",
};`;

  const copySnippet = () => {
    navigator.clipboard.writeText(configSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="my-6 p-4 rounded-xl bg-zinc-950/90 border border-red-900/40 shadow-xl text-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2 text-red-400 font-semibold font-mono">
          <Settings2 className="w-4 h-4 text-red-500" />
          <span>Configuración del Operador — {pageName}</span>
        </div>
        <button
          id="copy-branding-config-btn"
          onClick={copySnippet}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 hover:border-red-500/40 transition-colors self-start sm:self-auto font-mono text-[11px]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">¡Copiado al portapapeles!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>Copiar campos a personalizar</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-start gap-2.5 text-zinc-300">
        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed text-xs">
          <strong className="text-red-300 font-semibold">Campos marcados para reemplazar:</strong> Los textos entre corchetes como{' '}
          <code className="px-1.5 py-0.5 rounded bg-red-950/60 border border-red-800/60 text-red-300 font-mono text-[11px]">
            [TU_NOMBRE_O_TITULAR]
          </code>{' '}
          y{' '}
          <code className="px-1.5 py-0.5 rounded bg-red-950/60 border border-red-800/60 text-red-300 font-mono text-[11px]">
            [TU_EMAIL_DE_CONTACTO]
          </code>{' '}
          pueden ser completados directamente en el archivo{' '}
          <code className="text-red-400 font-mono underline font-semibold">src/data/branding.ts</code> antes de publicar en GitHub Pages o producción. No se han incluido afirmaciones legales falsas ni empresas ficticias.
        </p>
      </div>
    </div>
  );
};
