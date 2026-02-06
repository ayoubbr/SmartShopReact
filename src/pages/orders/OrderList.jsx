import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheck, faBan, faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import OrderService from '../../services/order.service';
import Pagination from '../../components/common/Pagination';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination State
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isFirst, setIsFirst] = useState(true);
    const [isLast, setIsLast] = useState(false);

    // Filter State
    const [statusFilter, setStatusFilter] = useState('');
    const [clientFilter, setClientFilter] = useState('');

    // Toast and Modal State
    const { addToast } = useToast();
    const [confirmAction, setConfirmAction] = useState({ isOpen: false, type: null, id: null });

    // Debounce Logic for search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOrders();
        }, 500);
        return () => clearTimeout(timer);
    }, [page, statusFilter, clientFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await OrderService.getAll(page, 10, statusFilter, clientFilter);

            setOrders(data.content || []);
            setTotalPages(data.totalPages);
            setIsFirst(data.first);
            setIsLast(data.last);
            setLoading(false);
        } catch (err) {
            setError('Failed to load orders.');
            setLoading(false);
        }
    };

    const handleActionClick = (type, id) => {
        setConfirmAction({ isOpen: true, type, id });
    };

    const executeAction = async () => {
        const { type, id } = confirmAction;
        if (!id) return;

        try {
            if (type === 'CONFIRM') {
                await OrderService.confirm(id);
                addToast('Order confirmed successfully.', 'success');
            } else if (type === 'CANCEL') {
                await OrderService.cancel(id);
                addToast('Order canceled successfully.', 'success');
            }
            fetchOrders();
        } catch (err) {
            console.error(err);
            addToast('Failed to update order. ' + (err.response?.data?.message || err.message), 'error');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'orange';
            case 'CONFIRMED': return '#06d6a0'; // green
            case 'CANCELED': return '#e71d36'; // red
            case 'REJECTED': return '#e71d36';
            default: return 'gray';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    return (
        <motion.div
            className="order-list-page container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ padding: '2rem 0' }}
        >
            <ConfirmModal
                isOpen={confirmAction.isOpen}
                onClose={() => setConfirmAction({ ...confirmAction, isOpen: false })}
                onConfirm={executeAction}
                title={confirmAction.type === 'CONFIRM' ? 'Confirm Order' : 'Cancel Order'}
                message={`Are you sure you want to ${confirmAction.type === 'CONFIRM' ? 'confirm' : 'cancel'} this order?`}
                isDangerous={confirmAction.type === 'CANCEL'}
            />

            <div className="navigation" style={{ marginBottom: '1rem' }}>
                <Link to="/admin" className="btn" style={{ background: 'transparent', color: 'var(--color-primary)', paddingLeft: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                </Link>
            </div>

            <div className="header" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ color: 'var(--color-text-main)', margin: 0 }}>Orders Management</h2>
                    <Link to="/orders/new" className="btn btn-primary">
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} /> New Order
                    </Link>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', background: 'var(--color-bg-card)', padding: '1rem', borderRadius: '10px' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <input
                            type="text"
                            placeholder="Search by Client Name..."
                            value={clientFilter}
                            onChange={(e) => setClientFilter(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                        />
                    </div>
                    <div style={{ flex: 0, minWidth: '150px' }}>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                appearance: 'none',
                                backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right .7em top 50%',
                                backgroundSize: '.65em auto'
                            }}
                        >
                            <option value="" style={{ color: 'black' }}>All Statuses</option>
                            <option value="PENDING" style={{ color: 'black' }}>Pending</option>
                            <option value="CONFIRMED" style={{ color: 'black' }}>Confirmed</option>
                            <option value="CANCELED" style={{ color: 'black' }}>Canceled</option>
                            <option value="REJECTED" style={{ color: 'black' }}>Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
            ) : error ? (
                <div style={{ color: 'var(--color-danger)', textAlign: 'center' }}>{error}</div>
            ) : (
                <>
                    <div className="table-responsive" style={{ overflowX: 'auto', background: 'var(--color-bg-card)', borderRadius: '15px', padding: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--color-text-main)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Order ID</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Client</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Total (TTC)</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? orders.map(order => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>#{order.id}</td>
                                        <td style={{ padding: '1rem' }}>{order.clientName}</td>
                                        <td style={{ padding: '1rem' }}>{new Date(order.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>{order.totalTTC.toFixed(2)} DH</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                border: `1px solid ${getStatusColor(order.statut)}`,
                                                color: getStatusColor(order.statut)
                                            }}>
                                                {order.statut}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            {order.statut === 'PENDING' && (
                                                <>
                                                    <button onClick={() => handleActionClick('CONFIRM', order.id)} className="btn" title="Confirm" style={{ padding: '0.5rem', color: '#06d6a0', background: 'transparent', marginRight: '0.5rem' }}>
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </button>
                                                    <button onClick={() => handleActionClick('CANCEL', order.id)} className="btn" title="Cancel" style={{ padding: '0.5rem', color: '#e71d36', background: 'transparent', marginRight: '0.5rem' }}>
                                                        <FontAwesomeIcon icon={faBan} />
                                                    </button>
                                                </>
                                            )}
                                            <Link to={`/orders/${order.id}`} className="btn" style={{ padding: '0.5rem', color: 'var(--color-info)', background: 'transparent' }} title="Details">
                                                <FontAwesomeIcon icon={faEye} />
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        isFirst={isFirst}
                        isLast={isLast}
                    />
                </>
            )}
        </motion.div>
    );
};

export default OrderList;
