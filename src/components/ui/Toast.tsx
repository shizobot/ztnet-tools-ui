import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

type ToastType = 'ok' | 'err';

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastApi = {
  toast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'ok') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setItems((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div id="toast-wrap">
        {items.map((item) => (
          <div key={item.id} className={`toast ${item.type}`}>
            <span style={{ flexShrink: 0 }}>{item.type === 'ok' ? '✓' : '✕'}</span> {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
