import { useState } from 'react';
import { Link } from 'react-router';
import { useCategories } from '~/contexts/CategoryContext';
import { categoryService, type Category } from '~/service/category.service';

export async function clientLoader() {
  const [categories, error] = await categoryService.getCategories();
  
  return {
    categories: categories?.data || [],
    error
  };
}

export default function CategoryIndex({ loaderData }: { loaderData: { categories: Category[], error: any } }) {
  const { categories: contextCategories } = useCategories();
  const [categories, setCategories] = useState<Category[]>(loaderData.categories || contextCategories);

  // Group categories by parent_id
  const mainCategories = categories.filter(cat => cat.parent_id === null);
  const childCategories = categories.filter(cat => cat.parent_id !== null);
  
  // Function to get children of a category
  const getCategoryChildren = (parentId: number) => {
    return childCategories.filter(cat => cat.parent_id === parentId);
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy danh mục nào</h2>
          <p className="text-gray-600">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Danh Mục Sản Phẩm</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainCategories.map((category) => (
          <div key={category.id} className="card bg-base-100 shadow-xl overflow-hidden">
            <figure className="px-10 pt-10">
              {category.small_image ? (
                <img 
                  src={category.small_image} 
                  alt={category.name} 
                  className="rounded-xl h-48 w-full object-cover"
                />
              ) : (
                <div className="bg-gray-200 rounded-xl h-48 w-full flex items-center justify-center">
                  <span className="text-gray-400 text-xl">{category.name}</span>
                </div>
              )}
            </figure>
            <div className="card-body">
              <h2 className="card-title">{category.name}</h2>
              {category.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
              )}
              
              {/* Sub-categories section */}
              {getCategoryChildren(category.id).length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Danh mục con:</h3>
                  <div className="flex flex-wrap gap-2">
                    {getCategoryChildren(category.id).map(child => (
                      <Link 
                        key={child.id}
                        to={`/category/${child.id}`}
                        className="badge badge-outline badge-primary badge-lg"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="card-actions justify-end mt-4">
                <Link 
                  to={`/category/${category.id}`} 
                  className="btn btn-primary"
                >
                  Xem sản phẩm
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}