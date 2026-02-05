import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ClientService from '../../services/client.service';
import Pagination from '../../components/common/Pagination';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0); // Reset to first page
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Pagination State
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isFirst, setIsFirst] = useState(true);
    const [isLast, setIsLast] = useState(false);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const data = await ClientService.getAll(page, 10, debouncedSearch);

            setClients(data.content || []);
            setTotalPages(data.totalPages);
            setIsFirst(data.first);
            setIsLast(data.last);
            setLoading(false);
        } catch (err) {
            setError('Failed to load clients.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, [page, debouncedSearch]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            try {
                await ClientService.delete(id);
                fetchClients(); // Refresh
            } catch (err) {
                alert('Failed to delete client');
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    return (
        <motion.div
            className="client-list-page container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ padding: '2rem 0' }}
        >
            <div className="navigation" style={{ marginBottom: '1rem' }}>
                <Link to="/admin" className="btn" style={{ background: 'transparent', color: 'var(--color-primary)', paddingLeft: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
                </Link>
            </div>

            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--color-text-main)' }}>Clients Management</h2>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                padding: '0.5rem 0.5rem 0.5rem 2rem',
                                borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'var(--color-text-main)',
                                width: '250px'
                            }}
                        />
                    </div>
                    <Link to="/clients/new" className="btn btn-primary">
                        <FontAwesomeIcon icon={faPlus} /> Add Client
                    </Link>
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
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Tier</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Orders</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Spent (DH)</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.length > 0 ? clients.map(client => (
                                    <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{client.nom}</td>
                                        <td style={{ padding: '1rem' }}>{client.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                background: client.customerTier === 'PLATINUM' ? 'rgba(255, 215, 0, 0.2)' :
                                                    client.customerTier === 'GOLD' ? 'rgba(255, 165, 0, 0.2)' : 'rgba(192, 192, 192, 0.2)',
                                                color: client.customerTier === 'PLATINUM' ? '#FFD700' :
                                                    client.customerTier === 'GOLD' ? '#FFA500' : '#C0C0C0'
                                            }}>
                                                {client.customerTier}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>{client.totalOrders || 0}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>{(client.totalSpent || 0).toFixed(2)}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <Link to={`/clients/${client.id}/edit`} className="btn" style={{ padding: '0.5rem', color: 'var(--color-info)', marginRight: '0.5rem' }}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Link>
                                            <button onClick={() => handleDelete(client.id)} className="btn" style={{ padding: '0.5rem', color: 'var(--color-danger)', background: 'transparent' }}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                            No clients found.
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

export default ClientList;
