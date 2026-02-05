import api from './api';

const PromoService = {
    getAll: async () => {
        const response = await api.get('/promos/admin');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/promos/admin/${id}`);
        return response.data;
    },

    create: async (promoRequest) => {
        const response = await api.post('/promos/admin', promoRequest);
        return response.data;
    },

    update: async (id, promoRequest) => {
        const response = await api.put(`/promos/admin/${id}`, promoRequest);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/promos/admin/${id}`);
    }
};

export default PromoService;
