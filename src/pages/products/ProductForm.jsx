import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import ProductService from '../../services/product.service';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        nom: '',
        prixUnitaire: '',
        stockDisponible: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const data = await ProductService.getById(id);
            setFormData({
                nom: data.nom,
                prixUnitaire: data.prixUnitaire,
                stockDisponible: data.stockDisponible
            });
            setLoading(false);
        } catch (err) {
            setError('Failed to load product details.');
            setLoading(false);
        }
    };

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
                await ProductService.update(id, formData);
            } else {
                await ProductService.create(formData);
            }
            navigate('/products');
        } catch (err) {
            console.error(err);
            setError('Failed to save product. Please check the inputs.');
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="product-form-page container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ padding: '2rem 0', maxWidth: '600px' }}
        >
            <div className="header" style={{ marginBottom: '2rem' }}>
                <Link to="/products" className="btn" style={{ background: 'transparent', color: 'var(--color-primary)', paddingLeft: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Products
                </Link>
                <h2 style={{ color: 'var(--color-text-main)' }}>{isEditMode ? 'Edit Product' : 'Create New Product'}</h2>
            </div>

            {error && (
                <div style={{ background: 'rgba(231, 29, 54, 0.1)', color: 'var(--color-danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon icon={faExclamationCircle} /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '15px' }}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Product Name</label>
                    <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'var(--color-text-main)',
                            fontFamily: 'Ubuntu, sans-serif'
                        }}
                    />
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Price (HT)</label>
                        <input
                            type="number"
                            name="prixUnitaire"
                            value={formData.prixUnitaire}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'var(--color-text-main)',
                                fontFamily: 'Ubuntu, sans-serif'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Stock Quantity</label>
                        <input
                            type="number"
                            name="stockDisponible"
                            value={formData.stockDisponible}
                            onChange={handleChange}
                            min="0"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'var(--color-text-main)',
                                fontFamily: 'Ubuntu, sans-serif'
                            }}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                >
                    {loading ? 'Saving...' : <><FontAwesomeIcon icon={faSave} /> {isEditMode ? 'Update Product' : 'Create Product'}</>}
                </button>
            </form>
        </motion.div>
    );
};

export default ProductForm;
