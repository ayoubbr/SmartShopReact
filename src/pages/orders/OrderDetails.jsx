import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBox, faUser, faCalendar, faTag, faCreditCard, faCheck, faBan, faTimes } from '@fortawesome/free-solid-svg-icons';
import OrderService from '../../services/order.service';
import { useToast } from '../../context/ToastContext';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const fetchOrder = async () => {
        try {
            const data = await OrderService.getById(id);
            setOrder(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            addToast('Failed to load order details.', 'error');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleAction = async (type) => {
        try {
            if (type === 'CONFIRM') {
                await OrderService.confirm(id);
                addToast('Order confirmed!', 'success');
            } else if (type === 'CANCEL') {
                await OrderService.cancel(id);
                addToast('Order cancelled.', 'info');
            } else if (type === 'REJECT') {
                await OrderService.reject(id);
                addToast('Order rejected.', 'info');
            }
            fetchOrder();
        } catch (err) {
            addToast('Action failed: ' + (err.response?.data?.message || err.message), 'error');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading order details...</div>;
    if (!order) return <div style={{ textAlign: 'center', padding: '5rem' }}>Order not found.</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'CONFIRMED': return '#06d6a0';
            case 'CANCELED': return '#ffd166';
            case 'REJECTED': return '#e71d36';
            case 'PENDING': return 'orange';
            default: return 'var(--color-text-muted)';
        }
    };

    return (
        <motion.div
            className="order-details-page container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '2rem 0', maxWidth: '1000px', margin: '0 auto' }}
        >
            <div className="navigation" style={{ marginBottom: '2rem' }}>
                <Link to="/orders" className="btn" style={{ background: 'transparent', color: 'var(--color-primary)', paddingLeft: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Orders
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                <div className="main-info">
                    <div style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '15px', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ margin: 0 }}>Order #{order.id}</h2>
                            <span style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '25px',
                                background: `${getStatusColor(order.statut)}22`,
                                color: getStatusColor(order.statut),
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>
                                {order.statut}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <FontAwesomeIcon icon={faCalendar} style={{ color: 'var(--color-primary)' }} />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Date</div>
                                    <div>{new Date(order.date).toLocaleString()}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <FontAwesomeIcon icon={faUser} style={{ color: 'var(--color-info)' }} />
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Client</div>
                                    <div>{order.clientName}</div>
                                </div>
                            </div>
                        </div>

                        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                            <FontAwesomeIcon icon={faBox} style={{ marginRight: '0.8rem' }} /> Order Items
                        </h3>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text-muted)' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left' }}>Product</th>
                                        <th style={{ padding: '1rem', textAlign: 'center' }}>Quantity</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Price</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items && order.items.map(item => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem' }}>{item.productName}</td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>{item.quantite}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>{item.prixUnitaire.toFixed(2)} DH</td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>{(item.prixUnitaire * item.quantite).toFixed(2)} DH</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="side-panel">
                    <div style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '15px', position: 'sticky', top: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Summary</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                                <span>{order.sousTotal.toFixed(2)} DH</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Discount</span>
                                <span style={{ color: '#06d6a0' }}>-{order.remise.toFixed(2)} DH</span>
                            </div>
                            {order.promoCode && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '0.8rem', color: 'var(--color-info)' }}>
                                    <FontAwesomeIcon icon={faTag} />
                                    <span>Code: {order.promoCode}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>TVA (20%)</span>
                                <span>{order.tva.toFixed(2)} DH</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '1.5rem',
                                paddingTop: '1.5rem',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                fontSize: '1.3rem',
                                fontWeight: 'bold',
                                color: 'var(--color-primary)'
                            }}>
                                <span>Total</span>
                                <span>{order.totalTTC.toFixed(2)} DH</span>
                            </div>
                        </div>

                        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <h4 style={{ marginBottom: '1rem' }}>
                                <FontAwesomeIcon icon={faCreditCard} style={{ marginRight: '0.5rem' }} /> Payment
                            </h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--color-text-muted)' }}>Remaining</span>
                                <span style={{ color: order.montantRestant > 0 ? '#ffd166' : '#06d6a0' }}>
                                    {order.montantRestant.toFixed(2)} DH
                                </span>
                            </div>
                        </div>

                        {order.statut === 'PENDING' && (
                            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button
                                    onClick={() => handleAction('CONFIRM')}
                                    className="btn btn-primary"
                                    style={{ width: '100%', background: '#06d6a0', borderColor: '#06d6a0' }}
                                >
                                    <FontAwesomeIcon icon={faCheck} style={{ marginRight: '0.5rem' }} /> Confirm Order
                                </button>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleAction('CANCEL')}
                                        className="btn"
                                        style={{ flex: 1, background: 'rgba(255, 209, 102, 0.1)', color: '#ffd166', border: '1px solid #ffd166' }}
                                    >
                                        <FontAwesomeIcon icon={faBan} style={{ marginRight: '0.5rem' }} /> Cancel
                                    </button>
                                    <button
                                        onClick={() => handleAction('REJECT')}
                                        className="btn"
                                        style={{ flex: 1, background: 'rgba(231, 29, 54, 0.1)', color: '#e71d36', border: '1px solid #e71d36' }}
                                    >
                                        <FontAwesomeIcon icon={faTimes} style={{ marginRight: '0.5rem' }} /> Reject
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default OrderDetails;
