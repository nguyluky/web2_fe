import axios from 'axios';

export const categoryService = {
    getMainCategories: () => axios.get('/api/tk_categories/main'),
    getAllCategories: () => axios.get('/api/tk_categories/all')
};