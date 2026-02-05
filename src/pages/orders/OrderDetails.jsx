import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faBan, faPrint } from '@fortawesome/free-solid-svg-icons';
import OrderService from '../../services/order.service';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const data = await OrderService.getById(id);
            setOrder(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load order details.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleConfirm = async () => {
        if (window.confirm('Are you sure you want to confirm this order?')) {
            try {
                await OrderService.confirm(id);
                fetchOrder();
            } catch (err) {
                alert('Failed to confirm order: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await OrderService.cancel(id);
                fetchOrder();
            } catch (err) {
                alert('Failed to cancel order: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'orange';
            case 'CONFIRMED': return '#06d6a0';
            case 'CANCELED': return '#e71d36';
            case 'REJECTED': return '#e71d36';
            default: return 'gray';
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
    if (error) return <div style={{ textAlign: 'center', color: 'var(--color-danger)', padding: '2rem' }}>{error}</div>;
    if (!order) return null;

    return (
        <motion.div
            className="order-details-page container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}
        >
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <Link to="/orders" className="btn" style={{ background: 'transparent', color: 'var(--color-primary)', paddingLeft: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Orders
                </Link>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {order.statut === 'PENDING' && (
                        <>
                            <button onClick={handleConfirm} className="btn" style={{ background: '#06d6a0', color: '#fff' }}>
                                <FontAwesomeIcon icon={faCheck} style={{ marginRight: '0.5rem' }} /> Confirm
                            </button>
                            <button onClick={handleCancel} className="btn" style={{ background: '#e71d36', color: '#fff' }}>
                                <FontAwesomeIcon icon={faBan} style={{ marginRight: '0.5rem' }} /> Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Order Header Card */}
            <div style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '15px', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Order #{order.id}</h2>
                        <div style={{ color: 'var(--color-text-muted)' }}>
                            Placed on {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                        </div>
                    </div>
                    <div>
                        <span style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '25px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            border: `2px solid ${getStatusColor(order.statut)}`,
                            color: getStatusColor(order.statut)
                        }}>
                            {order.statut}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div>
                        <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Client Details</h4>
                        <p style={{ margin: 0, fontSize: '1.1rem' }}>{order.clientName}</p>
                        <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Client ID: {order.clientId}</p>
                    </div>
                    {/* Add Payment info here later */}
                </div>
            </div>

            {/* Order Items */}
            <div style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '15px', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Items</h3>
                {/* 
                     Note: The current OrderResponse DTO does NOT explicitly include the breakdown of items list!
                     It only has totals. 
                     I checked OrderResponse.java in step 362: 
                     record OrderResponse(Long id, String clientName, LocalDateTime date, Double sousTotal...)
                     It does NOT have List<OrderItemResponse>. 
                     This is a backend limitation I missed. 
                     
                     I cannot show items unless I update backend OrderResponse to include items.
                     For now, I will display a message or just totals.
                     
                     Wait, the user wants "view order details". Viewing just totals is not "details".
                     I *must* update the backend to include items in OrderResponse if I want to show them.
                     
                     Let's check OrderResponse again.
                 */}
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                    Items list not available in current API response.
                </div>
            </div>

            {/* Totals Summary */}
            <div style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                    <span>{order.sousTotal?.toFixed(2)} DH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Discount</span>
                    <span style={{ color: '#06d6a0' }}>-{order.remise?.toFixed(2)} DH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>TVA</span>
                    <span>{order.tva?.toFixed(2)} DH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    <span>Total TTC</span>
                    <span>{order.totalTTC?.toFixed(2)} DH</span>
                </div>
                {order.montantRestant > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--color-danger)' }}>
                        <span>Remaining Amount</span>
                        <span>{order.montantRestant?.toFixed(2)} DH</span>
                    </div>
                )}
            </div>

        </motion.div>
    );
};

export default OrderDetails;
