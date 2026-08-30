import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 200,
        backgroundColor: 'var(--bg-surface-elevated)',
        color: 'var(--text-primary)',
        border: '1px solid var(--accent-emerald)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1.25rem',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.875rem',
        animation: 'slideUp 0.25s ease-out'
      }}
    >
      <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
      <span>{message}</span>
    </div>
  );
};
