import { createContext, useContext, useEffect, useState } from 'react';
import { categoryService, type Category } from '~/service/category.service';

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  loading: true,
  error: null,
});

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [response, fetchError] = await categoryService.getCategories();
        if (response) {
          setCategories(response.data);
        } else if (fetchError) {
          setError('Không thể tải danh mục. Vui lòng thử lại sau.');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải danh mục.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);
