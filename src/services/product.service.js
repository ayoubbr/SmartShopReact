import api from './api';

const ProductService = {
    getAll: async (page = 0, size = 10, search = '') => {
        // Depending on backend implementation, filtering might be query params
        // Based on Controller: getAll(ProductFilterDTO filter, Pageable pageable)
        // We need to check how FilterDTO is mapped. Usually object fields as params.
        const params = {
            page,
            size,
            ...(search && { nom: search }) // Assuming 'nom' is the search field as per FilterDTO check needed
        };
        const response = await api.get('/products', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    create: async (productData) => {
        const response = await api.post('/products/admin', productData);
        return response.data;
    },

    update: async (id, productData) => {
        const response = await api.put(`/products/admin/${id}`, productData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/products/admin/${id}`);
        return response.data;
    }
};

export default ProductService;
