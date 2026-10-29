import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import ToastNotification from '../components/ToastNotification.jsx';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const show = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => dismiss(id), 4500);
  }, [dismiss]);

  const value = useMemo(() => ({
    success: (m) => show(m, 'success'),
    error: (m) => show(m, 'error'),
  }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastNotification toasts={toasts} onClose={dismiss} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
