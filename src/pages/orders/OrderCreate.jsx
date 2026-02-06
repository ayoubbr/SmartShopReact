import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faPlus, faTrash, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';
import ClientService from '../../services/client.service';
import ProductService from '../../services/product.service';
import OrderService from '../../services/order.service';
import PromoService from '../../services/promo.service';
import { useToast } from '../../context/ToastContext';

const OrderCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Search States
    const [clients, setClients] = useState([]);
    const [clientSearch, setClientSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [promos, setPromos] = useState([]); // Or just verify code on input

    // Selection States
    const [selectedClient, setSelectedClient] = useState(null);
    const [orderItems, setOrderItems] = useState([]);

    // Promo State
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState(null);

    // Totals
    const [sousTotal, setSousTotal] = useState(0);
    const [remise, setRemise] = useState(0);
    const [tva, setTva] = useState(0);
    const [totalTTC, setTotalTTC] = useState(0);

    // Fetch Clients for Search
    useEffect(() => {
        const fetchClients = async () => {
            if (clientSearch.length < 2) return;
            try {
                const data = await ClientService.getAll(0, 5, clientSearch); // Low size for dropdown
                setClients(data.content);
            } catch (err) {
                console.error("Failed to search clients");
            }
        };
        const timer = setTimeout(fetchClients, 300);
        return () => clearTimeout(timer);
    }, [clientSearch]);

    // Fetch Products for Search
    useEffect(() => {
        const fetchProducts = async () => {
            // Assuming ProductService.getAll accepts search which maps to 'nom'
            try {
                const data = await ProductService.getAll(0, 10, productSearch);
                setProducts(data.content);
            } catch (err) {
                console.error("Failed to search products");
            }
        };
        const timer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timer);
    }, [productSearch]);

    const handleAddProduct = (product) => {
        const existing = orderItems.find(item => item.productId === product.id);
        if (existing) {
            // Increment quantity
            handleQuantityChange(product.id, existing.quantite + 1);
        } else setOrderItems([...orderItems, {
            productId: product.id,
            nom: product.nom,
            prixUnitaire: product.prixUnitaire,
            quantite: 1,
            maxStock: product.stockDisponible
        }]);
    }


    const handleQuantityChange = (productId, newQty) => {
        if (newQty < 1) return;
        setOrderItems(prev => prev.map(item => {
            if (item.productId === productId) {
                if (newQty > item.maxStock) {
                    alert(`Only ${item.maxStock} available in stock.`);
                    return item;
                }
                return { ...item, quantite: newQty };
            }
            return item;
        }));
    };

    const handleRemoveItem = (productId) => {
        setOrderItems(prev => prev.filter(item => item.productId !== productId));
    };



    // ... (in component)
    const { addToast } = useToast();

    // ... 
    const applyPromo = async () => {
        if (!promoCode) return;
        try {
            const allPromos = await PromoService.getAll();
            // Check expiry manually since backend DTO has date but logic might be frontend based for now
            const match = allPromos.find(p => p.code === promoCode && new Date(p.expirationDate) > new Date());

            if (match) {
                setAppliedPromo(match);
                setPromoError(null);
                addToast('Promo code applied!', 'success');
            } else {
                setAppliedPromo(null);
                setPromoError('Invalid or expired promo code.');
                addToast('Invalid or expired promo code.', 'error');
            }
        } catch (err) {
            setPromoError('Failed to verify promo.');
            addToast('Failed to verify promo.', 'error');
        }
    };

    // Calculate Totals
    useEffect(() => {
        let sub = 0;
        orderItems.forEach(item => {
            sub += item.prixUnitaire * item.quantite;
        });
        setSousTotal(sub);

        // Calculate Discount (Mock logic similar to backend to show preview)
        // Real calculation happens on backend, but good to show estimate.
        let discount = 0;

        // Tier discount logic (simplified for UI preview)
        if (selectedClient) {
            // Need client tier info. ClientService.getAll returns client details including tier.
            // Assuming selectedClient has customerTier
            // Logic from backend: SILVER > 500 (5%), GOLD > 800 (10%), PLATINUM > 1200 (15%)
            // Note: Tier names might differ, checking backend logic...
            const tier = selectedClient.customerTier;
            if (tier === 'SILVER' && sub >= 500) discount += sub * 0.05;
            if (tier === 'GOLD' && sub >= 800) discount += sub * 0.10;
            if (tier === 'PLATINUM' && sub >= 1200) discount += sub * 0.15;

            console.log("discount : ", discount);

        }

        // Promo discount
        if (appliedPromo) {
            discount += (sub * appliedPromo.discountPercent) / 100;
        }

        setRemise(discount);

        const taxable = sub - discount;
        const taxes = taxable * 0.20; // 20% TVA0
        setTva(taxes);
        setTotalTTC(taxable + taxes);

    }, [orderItems, selectedClient, appliedPromo]);


    const handleSubmit = async () => {
        if (!selectedClient) {
            setError('Please select a client.');
            return;
        }
        if (orderItems.length === 0) {
            setError('Your cart is empty.');
            return;
        }

        setLoading(true);
        setError(null);

        const orderRequest = {
            clientId: selectedClient.id,
            items: orderItems.map(item => ({
                productId: item.productId,
                quantite: item.quantite
            })),
            promoId: appliedPromo ? appliedPromo.id : null
        };

        try {
            await OrderService.create(orderRequest);
            navigate('/orders');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create order.');
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="order-create-page container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: '2rem 0', maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}
        >

            {/* Left Column: Selection */}
            <div className="selection-panel">
                <Link to="/orders" className="btn" style={{ background: 'transparent', color: 'var(--color-text-muted)', paddingLeft: 0, marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Back to Orders
                </Link>
                <h2 style={{ color: 'var(--color-text-main)', marginBottom: '1.5rem' }}>New Order</h2>

                {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</div>}

                {/* Client Search */}
                <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '15px', marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>1. Select Client</h3>
                    {selectedClient ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '8px' }}>
                            <div>
                                <span style={{ fontWeight: 'bold' }}>{selectedClient.nom}</span> <br />
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{selectedClient.email} • {selectedClient.customerTier}</span>
                            </div>
                            <button onClick={() => setSelectedClient(null)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>Change</button>
                        </div>
                    ) : (
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Search client by name or email..."
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            />
                            {clients.length > 0 && clientSearch.length >= 2 && (
                                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#2D1B2E', border: '1px solid rgba(255,255,255,0.1)', zIndex: 10, borderRadius: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                                    {clients.map(c => (
                                        <div
                                            key={c.id}
                                            onClick={() => { setSelectedClient(c); setClientSearch(''); setClients([]); }}
                                            style={{ padding: '0.8rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                            className="hover-bg-light" // Add hover class in css or use inline hover logic if complex
                                        >
                                            {c.nom} <span style={{ color: 'var(--color-text-muted)' }}>({c.email})</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Product Search */}
                <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '15px' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--color-info)' }}>2. Add Products</h3>
                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                        {products.map(p => (
                            <motion.div
                                key={p.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => handleAddProduct(p)}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '1rem',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    border: orderItems.some(i => i.productId === p.id) ? '1px solid var(--color-primary)' : '1px solid transparent'
                                }}
                            >
                                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{p.nom}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>{p.prixUnitaire.toFixed(2)} DH</span>
                                    <span style={{ fontSize: '0.8rem', color: p.stockDisponible > 0 ? '#06d6a0' : '#e71d36' }}>Stock: {p.stockDisponible}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>


            {/* Right Column: Summary */}
            <div className="summary-panel">
                <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '15px', position: 'sticky', top: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Order Summary</h3>

                    {/* Items List */}
                    <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                        {orderItems.length === 0 && <div style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Cart is empty</div>}
                        {orderItems.map(item => (
                            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '500' }}>{item.nom}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{item.prixUnitaire.toFixed(2)} DH/unit</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', padding: '0.2rem' }}>
                                        <button
                                            onClick={() => handleQuantityChange(item.productId, item.quantite - 1)}
                                            style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}
                                        >-</button>
                                        <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantite}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.productId, item.quantite + 1)}
                                            style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'var(--color-primary)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}
                                        >+</button>
                                    </div>
                                    <button onClick={() => handleRemoveItem(item.productId)} style={{ color: 'var(--color-danger)', border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.5rem' }}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Promo Code */}
                    <div style={{ marginBottom: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Promo Code</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Enter code"
                                style={{ flex: 1, padding: '0.5rem', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            />
                            <button onClick={applyPromo} className="btn" style={{ background: 'var(--color-primary)', fontSize: '0.9rem' }}>Apply</button>
                        </div>
                        {appliedPromo && <div style={{ color: '#06d6a0', fontSize: '0.8rem', marginTop: '0.5rem' }}>Code {appliedPromo.code} applied!</div>}
                        {promoError && <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{promoError}</div>}
                    </div>

                    {/* Totals */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                            <span>{sousTotal.toFixed(2)} DH</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>Discount</span>
                            <span style={{ color: '#06d6a0' }}>-{remise.toFixed(2)} DH</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>TVA (20%)</span>
                            <span>{tva.toFixed(2)} DH</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total TTC</span>
                            <span>{totalTTC.toFixed(2)} DH</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || orderItems.length === 0 || !selectedClient}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem', justifyContent: 'center' }}
                    >
                        {loading ? 'Creating...' : (
                            <>
                                <FontAwesomeIcon icon={faCheck} style={{ marginRight: '0.5rem' }} /> Confirm Order
                            </>
                        )}
                    </button>

                </div>
            </div>

        </motion.div>
    );
}

export default OrderCreate;