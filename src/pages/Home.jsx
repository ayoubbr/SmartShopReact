import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faShoppingBag, faTags, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Home = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="home-page">
            <nav className="navbar" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                    <FontAwesomeIcon icon={faStore} /> SmartShop
                </div>
                <div className="nav-links">
                    <Link to="/admin" className="btn btn-primary"><FontAwesomeIcon icon={faUserShield} /> Admin Portal</Link>
                </div>
            </nav>

            <motion.div
                className="hero"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ textAlign: 'center', padding: '5rem 1rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
                <motion.h1 variants={itemVariants} style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>
                    Welcome to <span style={{ color: 'var(--color-primary)' }}>SmartShop</span>
                </motion.h1>
                <motion.p variants={itemVariants} style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                    Your premium destination for smart shopping. Experience the future of retail with our seamless platform.
                </motion.p>

                <motion.div variants={itemVariants} className="features" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                    <div className="feature-card" style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '15px' }}>
                        <FontAwesomeIcon icon={faShoppingBag} size="3x" color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
                        <h3>Wide Selection</h3>
                        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Browse thousands of products at the best prices.</p>
                    </div>
                    <div className="feature-card" style={{ background: 'var(--color-bg-card)', padding: '2rem', borderRadius: '15px' }}>
                        <FontAwesomeIcon icon={faTags} size="3x" color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
                        <h3>Best Deals</h3>
                        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Daily offers and exclusive discounts for members.</p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Home;
