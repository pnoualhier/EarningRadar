import React, { useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Clock, Calendar, DollarSign, Building2 } from 'lucide-react';
import type { EarningsEvent } from '../types/earnings';
import { StatusBadge } from './StatusBadge';
import { formatFullFrenchDate, formatAnnouncementTime } from '../lib/date-utils';
import { formatRevenue, formatEps } from '../lib/formatters';
import { SESSION_LABELS, STATUS_LABELS } from '../lib/constants';

interface CompanyDetailProps {
  event: EarningsEvent | null;
  onClose: () => void;
}

export const CompanyDetail: React.FC<CompanyDetailProps> = ({ event, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const sessionInfo = SESSION_LABELS[event.session];
  const statusInfo = STATUS_LABELS[event.dateStatus];
  const formattedTime = formatAnnouncementTime(event.announcementTime, event.timeZone);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl text-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-800 bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-black tracking-tight text-white">
                {event.symbol}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-bold ${
                  event.market === 'US'
                    ? 'bg-blue-900/60 text-blue-300 border border-blue-700/60'
                    : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                }`}
              >
                {event.market === 'US' ? 'Marché US' : 'Marché Européen'}
              </span>
              <StatusBadge status={event.dateStatus} size="md" />
            </div>
            <h2 id="detail-title" className="text-sm font-semibold text-slate-300">
              {event.companyName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Fermer la fiche détaillée"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Key dates and sessions */}
          <div className="grid grid-cols-2 gap-3 bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Date d’annonce</span>
              </div>
              <div className="text-slate-100 font-semibold text-xs">
                {formatFullFrenchDate(event.announcementDate)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Horaire & Session</span>
              </div>
              <div className="text-slate-100 font-semibold text-xs">
                {sessionInfo?.label}
                {formattedTime && <span className="block text-slate-400 text-[11px]">{formattedTime}</span>}
              </div>
            </div>
          </div>

          {/* Market & Listing */}
          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Bourse & Localisation</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Place boursière :</span>{' '}
                <strong className="text-slate-200">{event.exchange || 'Non précisée'}</strong>
              </div>
              <div>
                <span className="text-slate-400">Pays :</span>{' '}
                <strong className="text-slate-200">{event.country || 'Non précisé'}</strong>
              </div>
              {event.fiscalPeriod && (
                <div className="col-span-2">
                  <span className="text-slate-400">Période fiscale :</span>{' '}
                  <strong className="text-slate-200">{event.fiscalPeriod}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Financial estimates */}
          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Consensus & Estimations financières</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Bénéfice net / action (BPA)</span>
                <span className="text-sm font-bold text-slate-100">
                  {formatEps(event.epsEstimate, event.currency)}
                </span>
                {event.epsActual !== undefined && (
                  <span className="block text-[11px] text-emerald-400 mt-0.5">
                    Réalisé : {formatEps(event.epsActual, event.currency)}
                  </span>
                )}
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Chiffre d’affaires estimé</span>
                <span className="text-sm font-bold text-slate-100">
                  {formatRevenue(event.revenueEstimate, event.currency)}
                </span>
                {event.revenueActual !== undefined && (
                  <span className="block text-[11px] text-emerald-400 mt-0.5">
                    Réalisé : {formatRevenue(event.revenueActual, event.currency)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status explanation */}
          <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-3 text-[11px] text-amber-200/90 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Fiabilité de la date : {statusInfo?.label}</span>
            </div>
            {statusInfo?.description}
          </div>

          {/* Source provenance */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <div>
              <span>Source : </span>
              <strong className="text-slate-300">{event.sourceName}</strong>
            </div>
            {event.sourceUrl && (
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium"
              >
                <span>Consulter la source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Footer disclaimer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-[10px] text-slate-400 text-center leading-normal">
          Earnings Radar affiche uniquement des informations de calendrier financier. Aucun conseil d’achat ou de vente.
        </div>
      </div>
    </div>
  );
};
