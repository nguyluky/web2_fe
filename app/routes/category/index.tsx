import axios from 'axios';

export const categoryService = {
  getMainCategories: async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tk_categories/main', {
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error('Error in getMainCategories:', error.response?.data || error.message);
      throw error;
    }
  },
  getAllCategories: async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tk_categories/all', {
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error('Error in getAllCategories:', error.response?.data || error.message);
      throw error;
    }
  },
};