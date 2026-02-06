import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDangerous = false }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(5px)',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    style={{
                        background: 'var(--color-bg-main)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2rem',
                        borderRadius: '15px',
                        maxWidth: '400px',
                        width: '90%',
                        textAlign: 'center',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                    }}
                >
                    <h3 style={{ marginBottom: '1rem', color: isDangerous ? 'var(--color-danger)' : 'var(--color-text-main)' }}>{title}</h3>
                    <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>{message}</p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button
                            onClick={onClose}
                            className="btn"
                            style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--color-text-main)' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            className="btn"
                            style={{
                                background: isDangerous ? 'var(--color-danger)' : 'var(--color-primary)',
                                color: 'white'
                            }}
                        >
                            {isDangerous ? 'Delete' : 'Confirm'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmModal;
