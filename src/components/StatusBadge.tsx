import React from 'react';
import type { DateStatus } from '../types/earnings';
import { STATUS_LABELS } from '../lib/constants';

interface StatusBadgeProps {
  status: DateStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const info = STATUS_LABELS[status] || { label: status, description: '' };

  let colorClasses = '';
  switch (status) {
    case 'confirmed':
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      break;
    case 'estimated':
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
      break;
    case 'unverified':
    default:
      colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
      break;
  }

  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium border rounded ${sizeClasses} ${colorClasses}`}
      title={info.description}
      role="status"
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === 'confirmed'
            ? 'bg-emerald-500'
            : status === 'estimated'
              ? 'bg-amber-500'
              : 'bg-slate-400'
        }`}
        aria-hidden="true"
      />
      {info.label}
    </span>
  );
};
