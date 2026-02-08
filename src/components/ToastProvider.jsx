import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

const Toast = ({ id, message, type, onClose, duration = 5000 }) => {
  const [timeLeft, setTimeLeft] = React.useState(Math.ceil(duration / 1000));

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [duration, onClose]);

  return (
    <div
      className={
        `min-w-[280px] px-4 py-3 rounded-lg shadow-lg text-white flex items-center justify-between gap-3 ` +
        (type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-900')
      }
    >
      <div className="flex-1">
        <p>{message}</p>
        {duration === 10000 && <p className="text-xs mt-1 opacity-75">Expires in {timeLeft}s</p>}
      </div>
      <button
        onClick={onClose}
        className="ml-2 text-xl font-bold hover:opacity-75 transition-opacity"
        aria-label="Close toast"
      >
        ×
      </button>
    </div>
  );
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            message={t.message}
            type={t.type}
            duration={t.duration}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
