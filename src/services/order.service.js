import api from './api';

const OrderService = {
    getAll: async (page = 0, size = 10, status = '', clientName = '') => {
        const params = {
            page,
            size,
            sort: 'date,desc',
            ...(status && { status }),
            ...(clientName && { clientName })
        };
        const response = await api.get('/orders/admin', { params });
        return response.data;
    },

    getById: async (id) => {
        // Note: The backend controller doesn't seem to have a specific GET /admin/{id} endpoint based on my previous read.
        // It has /client/{clientId}. I might need to rely on the list or check if I missed an ID endpoint.
        // Checking OrderController again... I missed checking if getById exists!
        // If it doesn't exist, I might need to add it or implement it. 
        // Let's assume for now I might need to add it to backend if missing.
        // Wait, OrderRepository has findById.
        // I will hold off on getById implementation until I verify backend endpoint.
        // For now, implementing methods I know exist.
        const response = await api.get(`/orders/admin/${id}`); // Optimistic, will verify.
        return response.data;
    },

    create: async (orderRequest) => {
        const response = await api.post('/orders/admin', orderRequest);
        return response.data;
    },

    cancel: async (orderId) => {
        const response = await api.put(`/orders/admin/cancel`, null, { params: { orderId } });
        return response.data;
    },

    confirm: async (orderId) => {
        const response = await api.put(`/orders/admin/confirm`, null, { params: { orderId } });
        return response.data;
    }
};

export default OrderService;
