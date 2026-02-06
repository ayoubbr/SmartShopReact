import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ProductService from '../../services/product.service';
import Pagination from '../../components/common/Pagination';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination State
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isFirst, setIsFirst] = useState(true);
    const [isLast, setIsLast] = useState(false);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');

    // Toast & Modal
    const { addToast } = useToast();
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await ProductService.getAll(page, 10, searchTerm);

            setProducts(data.content || []);
            setTotalPages(data.totalPages);
            setIsFirst(data.first);
            setIsLast(data.last);
            setLoading(false);
        } catch (err) {
            setError('Failed to load products.');
            addToast('Failed to load products.', 'error');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, searchTerm]);

    const handleDeleteClick = (id) => {
        setDeleteModal({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await ProductService.delete(deleteModal.id);
            addToast('Product deleted successfully.', 'success');
            fetchProducts(); // Refresh
        } catch (err) {
            addToast('Failed to delete product. ' + (err.response?.data?.message || err.message), 'error');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    return (
        <motion.div
            className="product-list-page container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ padding: '2rem 0' }}
        >
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={confirmDelete}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                isDangerous={true}
            />

            <div className="navigation" style={{ marginBottom: '1rem' }}>
                <Link to="/admin" className="btn" style={{ background: 'transparent', color: 'var(--color-primary)', paddingLeft: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                </Link>
            </div>

            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-text-main)' }}>Products Management</h2>
                <Link to="/products/new" className="btn btn-primary">
                    <FontAwesomeIcon icon={faPlus} /> Add Product
                </Link>
            </div>

            <div className="filters" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div className="search-box" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            borderRadius: '8px',
                            border: '1px solid var(--color-bg-card)',
                            background: 'var(--color-bg-card)',
                            color: 'var(--color-text-main)',
                            fontFamily: 'Ubuntu, sans-serif'
                        }}
                    />
                    <FontAwesomeIcon
                        icon={faSearch}
                        style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                    />
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
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Product Name</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Price (HT)</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Stock</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? products.map(product => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{product.nom}</td>
                                        <td style={{ padding: '1rem' }}>{product.prixUnitaire.toFixed(2)} DH</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                color: product.stockDisponible < 10 ? 'var(--color-danger)' : 'var(--color-success)',
                                                fontWeight: 'bold'
                                            }}>
                                                {product.stockDisponible}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                background: product.isActive ? 'rgba(46, 196, 182, 0.2)' : 'rgba(231, 29, 54, 0.2)',
                                                color: product.isActive ? 'var(--color-success)' : 'var(--color-danger)'
                                            }}>
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <Link to={`/products/${product.id}/edit`} className="btn" style={{ padding: '0.5rem', color: 'var(--color-info)', marginRight: '0.5rem' }}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Link>
                                            <button onClick={() => handleDeleteClick(product.id)} className="btn" style={{ padding: '0.5rem', color: 'var(--color-danger)', background: 'transparent' }}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                            No products found.
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

export default ProductList;
