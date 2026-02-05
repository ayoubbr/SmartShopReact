import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import ClientService from '../../services/client.service';

const ClientForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        username: '',
        password: '' // Only for creation
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            fetchClient();
        }
    }, [id]);

    const fetchClient = async () => {
        try {
            setLoading(true);
            const data = await ClientService.getById(id);
            setFormData({
                nom: data.nom,
                email: data.email,
                username: data.username,
                password: ''
            });
            setLoading(false);
        } catch (err) {
            setError('Failed to load client details.');
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
                // Remove password for update if blank or handle separately
                const { password, ...updateData } = formData;
                await ClientService.update(id, updateData);
            } else {
                await ClientService.create(formData);
            }
            navigate('/clients');
        } catch (err) {
            console.error(err);
            setError('Failed to save client. Email or Username might already exist.');
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="client-form-page container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ padding: '2rem 0', maxWidth: '600px' }}
        >
            <div className="header" style={{ marginBottom: '2rem' }}>
                <Link to="/clients" className="btn" style={{ background: 'transparent', color: 'var(--color-primary)', paddingLeft: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Clients
                </Link>
                <h2 style={{ color: 'var(--color-text-main)' }}>{isEditMode ? 'Edit Client' : 'Register New Client'}</h2>
            </div>

            {error && (
                <div style={{ background: 'rgba(231, 29, 54, 0.1)', color: 'var(--color-danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon icon={faExclamationCircle} /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '15px' }}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Full Name</label>
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

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
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

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={isEditMode} // Usually username is immutable
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: isEditMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)',
                            color: isEditMode ? 'var(--color-text-muted)' : 'var(--color-text-main)',
                            fontFamily: 'Ubuntu, sans-serif',
                            cursor: isEditMode ? 'not-allowed' : 'text'
                        }}
                    />
                </div>

                {!isEditMode && (
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
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
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                >
                    {loading ? 'Saving...' : <><FontAwesomeIcon icon={faSave} /> {isEditMode ? 'Update Client' : 'Register Client'}</>}
                </button>
            </form>
        </motion.div>
    );
};

export default ClientForm;
