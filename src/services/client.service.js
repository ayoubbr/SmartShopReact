import api from './api';

const ClientService = {
    getAll: async (page = 0, size = 10, search = '') => {
        const params = {
            page,
            size,
            search
        };
        const response = await api.get('/clients/admin', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/clients/admin/${id}`);
        return response.data;
    },

    getByEmail: async (email) => {
        const response = await api.get(`/clients/admin/email/${email}`);
        return response.data;
    },

    create: async (clientData) => {
        const response = await api.post('/clients/admin', clientData);
        return response.data;
    },

    update: async (id, clientData) => {
        const response = await api.put(`/clients/admin/${id}`, clientData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/clients/admin/${id}`);
        return response.data;
    }
};

export default ClientService;
