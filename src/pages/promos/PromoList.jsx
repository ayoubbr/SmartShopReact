import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import PromoService from '../../services/promo.service';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';

const PromoList = () => {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Toast & Modal
    const { addToast } = useToast();
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    const fetchPromos = async () => {
        try {
            setLoading(true);
            const data = await PromoService.getAll();
            setPromos(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load promos.');
            addToast('Failed to load promos.', 'error');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    const handleDeleteClick = (id) => {
        setDeleteModal({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await PromoService.delete(deleteModal.id);
            addToast('Promo code deleted successfully.', 'success');
            setPromos(promos.filter(p => p.id !== deleteModal.id));
            setDeleteModal({ isOpen: false, id: null });
        } catch (err) {
            addToast('Failed to delete promo. ' + (err.response?.data?.message || err.message), 'error');
            setDeleteModal({ isOpen: false, id: null });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    return (
        <motion.div
            className="promo-list-page container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ padding: '2rem 0' }}
        >
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={confirmDelete}
                title="Delete Promo Code"
                message="Are you sure you want to delete this promo code? This will prevent it from being applied to future orders."
                isDangerous={true}
            />

            <div className="navigation" style={{ marginBottom: '1rem' }}>
                <Link to="/admin" className="btn" style={{ background: 'transparent', color: 'var(--color-primary)', paddingLeft: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                </Link>
            </div>

            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-text-main)' }}>Promo Codes</h2>
                <Link to="/promos/new" className="btn btn-primary">
                    <FontAwesomeIcon icon={faPlus} /> Add Promo
                </Link>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : error ? (
                <div style={{ color: 'var(--color-danger)', textAlign: 'center' }}>{error}</div>
            ) : (
                <div className="table-responsive" style={{ overflowX: 'auto', background: 'var(--color-bg-card)', borderRadius: '15px', padding: '1rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--color-text-main)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Code</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Value</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Expiration Date</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Active</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promos.length > 0 ? promos.map(promo => {
                                const isActive = new Date(promo.expirationDate) > new Date(); // Active if expiration is in future
                                return (
                                    <tr key={promo.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{promo.code}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            {promo.discountPercent}%
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>{promo.expirationDate}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span style={{
                                                color: isActive ? '#06d6a0' : '#e71d36',
                                                fontWeight: 'bold'
                                            }}>
                                                {isActive ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <Link to={`/promos/${promo.id}/edit`} className="btn" style={{ padding: '0.5rem', color: 'var(--color-info)', background: 'transparent', marginRight: '0.5rem' }}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Link>
                                            <button onClick={() => handleDeleteClick(promo.id)} className="btn" style={{ padding: '0.5rem', color: 'var(--color-danger)', background: 'transparent' }}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                                        No promo codes found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
};

export default PromoList;
