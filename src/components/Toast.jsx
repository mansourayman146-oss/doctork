import React from 'react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`toast ${toast.type || ''}`}
          onClick={() => onDismiss(toast.id)}
          role="status"
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
