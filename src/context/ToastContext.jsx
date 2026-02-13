import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000); // Auto remove after 5s
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <AnimatePresence>
                    {toasts.map(toast => (
                        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const Toast = ({ message, type, onClose }) => {
    const bgColors = {
        success: '#06d6a0',
        error: '#e71d36',
        info: '#118ab2',
        warning: '#ffd166'
    };

    const icons = {
        success: faCheckCircle,
        error: faExclamationCircle,
        info: faInfoCircle, 
        warning: faExclamationCircle
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            layout
            style={{
                background: 'var(--color-bg-card)', 
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '300px',
                maxWidth: '400px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                borderLeft: `5px solid ${bgColors[type] || bgColors.info}`
            }}
        >
            <FontAwesomeIcon icon={icons[type] || icons.info} style={{ color: bgColors[type], fontSize: '1.2rem' }} />
            <span style={{ flex: 1, fontSize: '0.95rem' }}>{message}</span>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faTimes} />
            </button>
        </motion.div>
    );
};
