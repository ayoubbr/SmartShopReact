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
        const response = await api.get(`/orders/${id}`);
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
    },

    reject: async (orderId) => {
        const response = await api.put(`/orders/admin/reject`, null, { params: { orderId } });
        return response.data;
    }
};

export default OrderService;
