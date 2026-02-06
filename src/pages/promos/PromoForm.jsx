import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import PromoService from '../../services/promo.service';
import { useToast } from '../../context/ToastContext';

const PromoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        code: '',
        discountPercent: 0,
        expirationDate: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            const fetchPromo = async () => {
                try {
                    const data = await PromoService.getById(id);
                    setFormData({
                        code: data.code,
                        discountPercent: data.discountPercent,
                        expirationDate: data.expirationDate
                    });
                } catch (err) {
                    setError('Failed to fetch promo details.');
                    addToast('Failed to fetch promo details.', 'error');
                }
            };
            fetchPromo();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditMode) {
                await PromoService.update(id, formData);
                addToast('Promo code updated successfully.', 'success');
            } else {
                await PromoService.create(formData);
                addToast('Promo code created successfully.', 'success');
            }
            navigate('/promos');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to save promo.';
            setError(msg);
            addToast(msg, 'error');
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="promo-form-page container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '2rem 0', maxWidth: '600px', margin: '0 auto' }}
        >
            <div className="header" style={{ marginBottom: '2rem' }}>
                <Link to="/promos" className="btn" style={{ background: 'transparent', color: 'var(--color-text-muted)', paddingLeft: 0, marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Promos
                </Link>
                <h2 style={{ color: 'var(--color-text-main)' }}>{isEditMode ? 'Edit Promo Code' : 'Create New Promo Code'}</h2>
            </div>

            {error && (
                <div style={{ background: 'rgba(231, 29, 54, 0.1)', color: 'var(--color-danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '15px' }}>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Code</label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        required
                        placeholder="e.g. SUMMER2024"
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Discount Percentage (%)</label>
                    <input
                        type="number"
                        name="discountPercent"
                        value={formData.discountPercent}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        required
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Expiration Date</label>
                    <input
                        type="date"
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', justifyContent: 'center' }}
                >
                    {loading ? 'Saving...' : (
                        <>
                            <FontAwesomeIcon icon={faSave} style={{ marginRight: '0.5rem' }} /> Save Promo Code
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default PromoForm;
