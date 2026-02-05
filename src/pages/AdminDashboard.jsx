import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUsers, faBoxOpen, faHome, faArrowRight, faTags, faShoppingCart, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ProductService from '../services/product.service';
import ClientService from '../services/client.service';
import OrderService from '../services/order.service';

const AdminDashboard = () => {
    const [productCount, setProductCount] = useState(0);
    const [clientCount, setClientCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const productData = await ProductService.getAll(0, 1); // Fetch 1 just to get totalElements
                setProductCount(productData.totalElements || 0);

                const clientData = await ClientService.getAll(0, 1);
                setClientCount(clientData.totalElements || 0);

                const orderData = await OrderService.getAll(0, 1);
                setOrderCount(orderData.totalElements || 0);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="admin-dashboard container" style={{ padding: '2rem 0' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <Link to="/" className="btn" style={{ background: 'transparent', color: 'var(--color-primary)', paddingLeft: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <FontAwesomeIcon icon={faHome} /> Back Home
                    </Link>
                    <h1 style={{ color: 'var(--color-text-main)' }}>Admin Dashboard</h1>
                </div>
            </header>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <Link to="/clients">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="stat-card"
                        style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '1.5rem', height: '100%', color: 'inherit' }}
                    >
                        <div className="icon-box" style={{ background: 'rgba(255, 159, 28, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
                            <FontAwesomeIcon icon={faUsers} size="2x" color="var(--color-primary)" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '2rem', margin: 0 }}>{clientCount}</h3>
                            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Active Clients</p>
                        </div>
                    </motion.div>
                </Link>

                <Link to="/products">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="stat-card"
                        style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '1.5rem', height: '100%', color: 'inherit' }}
                    >
                        <div className="icon-box" style={{ background: 'rgba(6, 214, 160, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
                            <FontAwesomeIcon icon={faBoxOpen} size="2x" color="var(--color-info)" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '2rem', margin: 0 }}>{productCount}</h3>
                            <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Total Products</p>
                        </div>
                    </motion.div>
                </Link>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="stat-card"
                    style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                >
                    <div className="icon-box" style={{ background: 'rgba(231, 29, 54, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
                        <FontAwesomeIcon icon={faChartLine} size="2x" color="var(--color-danger)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem', margin: 0 }}>{orderCount}</h3>
                        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Total Orders</p>
                    </div>
                </motion.div>
            </div>

            <div className="quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Products Section */}
                <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '15px' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FontAwesomeIcon icon={faBoxOpen} color="var(--color-info)" /> Products
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link to="/products" className="btn" style={{ justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-main)' }}>
                            Manage Products <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                        <Link to="/products/new" className="btn" style={{ justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-main)' }}>
                            Add New Product <FontAwesomeIcon icon={faPlus} />
                        </Link>
                    </div>
                </div>

                {/* Clients Section */}
                <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '15px' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FontAwesomeIcon icon={faUsers} color="var(--color-primary)" /> Clients
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link to="/clients" className="btn" style={{ justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-main)' }}>
                            Manage Clients <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                        <Link to="/clients/new" className="btn" style={{ justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-main)' }}>
                            Add New Client <FontAwesomeIcon icon={faPlus} />
                        </Link>
                    </div>
                </div>

                {/* Orders Section - Moving out of Coming Soon */}
                <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '15px' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FontAwesomeIcon icon={faShoppingCart} color="var(--color-danger)" /> Orders
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link to="/orders" className="btn" style={{ justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-main)' }}>
                            Manage Orders <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                </div>

                {/* Coming Soon Section */}
                <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '15px' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FontAwesomeIcon icon={faTags} color="var(--color-secondary)" /> Promo Codes
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link to="/promos" className="btn" style={{ justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-main)' }}>
                            Manage Promos <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                        <Link to="/promos/new" className="btn" style={{ justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-main)' }}>
                            Add Promo <FontAwesomeIcon icon={faPlus} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
