import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ProductList from './pages/products/ProductList';
import ProductForm from './pages/products/ProductForm';
import ClientList from './pages/clients/ClientList';
import ClientForm from './pages/clients/ClientForm';
import OrderList from './pages/orders/OrderList';
import PromoList from './pages/promos/PromoList';
import PromoForm from './pages/promos/PromoForm';
import './index.css';
import OrderCreate from './pages/orders/OrderCreate';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id/edit" element={<ProductForm />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/:id/edit" element={<ClientForm />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/new" element={<OrderCreate />} />
            <Route path="/promos" element={<PromoList />} />
            <Route path="/promos/new" element={<PromoForm />} />
            <Route path="/promos/:id/edit" element={<PromoForm />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
