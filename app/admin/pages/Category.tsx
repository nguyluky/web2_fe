//@ts-nocheck
import {
    faChevronLeft,
    faChevronRight,
    faDeleteLeft,
    faEdit,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    status: 'active',
    parent_id: null,
    small_image: null,
    large_image: null,
    description: '',
    small_image_preview: null,
    large_image_preview: null,
  });
  const [updateCategory, setUpdateCategory] = useState({
    id: null,
    name: '',
    status: 'active',
    parent_id: null,
    small_image: null,
    large_image: null,
    description: '',
    small_image_preview: null,
    large_image_preview: null,
    small_image_url: '',
    large_image_url: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          name: searchTerm,
          status: statusFilter ,
          page: currentPage,
          per_page: 10,
        });

        const response = await fetch(`http://127.0.0.1:8000/api/admin/categories/search?${params.toString()}`);
        if (!response.ok) throw new Error('Không thể lấy danh sách danh mục');
        const data = await response.json();
        setCategories(data.data.data || []);
        setFilteredCategories(data.data.data || []);
        setTotalPages(data.data.last_page || 1);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        toast.error('Lỗi khi lấy dữ liệu: ' + error.message, { autoClose: 3000 });
      }
    };
    fetchData();
  }, [currentPage, searchTerm, statusFilter]);

  // Mở/đóng modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewCategory({ name: '', status: 'active', parent_id: null, small_image: null, large_image: null, description: '', small_image_preview: null, large_image_preview: null });
    setUpdateCategory({ id: null, name: '', status: 'active', parent_id: null, small_image: null, large_image: null, description: '', small_image_preview: null, large_image_preview: null, small_image_url: '', large_image_url: '' });
  };

  // Xử lý input
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setNewCategory((prev) => ({ ...prev, [name]: file }));
      
      // Tạo URL preview cho hình ảnh
      if (file && file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setNewCategory((prev) => ({ ...prev, [`${name}_preview`]: previewUrl }));
      }
    } else {
      setNewCategory((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setUpdateCategory((prev) => ({ ...prev, [name]: file }));
      
      // Tạo URL preview cho hình ảnh
      if (file && file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setUpdateCategory((prev) => ({ ...prev, [`${name}_preview`]: previewUrl }));
      }
    } else {
      setUpdateCategory((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Thêm danh mục
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        if (!newCategory.name) throw new Error('Vui lòng nhập tên danh mục');

        const formData = new FormData();
        formData.append('name', newCategory.name);
        formData.append('status', newCategory.status);
        if (newCategory.parent_id) {
          formData.append('parent_id', newCategory.parent_id);
        }
        formData.append('require_fields', JSON.stringify(requiredFields));
        
        if (newCategory.small_image) {
          formData.append('small_image', newCategory.small_image);
        }
        
        if (newCategory.large_image) {
          formData.append('large_image', newCategory.large_image);
        }
        
        if (newCategory.description) {
          formData.append('description', newCategory.description);
        }

        const response = await fetch('http://127.0.0.1:8000/api/admin/categories', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 422) {
                const errors = errorData.message;
                // Dịch lỗi sang tiếng Việt
                const errorMessage = Object.values(errors)
                    .flat()
                    .map((msg) =>
                        msg.includes('The name has already been taken')
                            ? 'Tên danh mục đã tồn tại'
                            : msg
                    )
                    .join(', ');
                throw new Error(errorMessage);
            }
            throw new Error(errorData.message || 'Không thể tạo danh mục');
        }

        await fetchCategories(currentPage);

        toast.error('Thêm danh mục thất bại: ' + error.message, { autoClose: 3000 });
    } catch (error) {
        console.error('Lỗi khi thêm danh mục:', error.message);
        closeModal();
        toast.success('Thêm danh mục thành công!', { autoClose: 3000 });
        // Không đóng modal để người dùng sửa lại
    } finally {
        setIsLoading(false);
    }
};

  // Sửa danh mục
  const handleEditCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!updateCategory.name) throw new Error('Vui lòng nhập tên danh mục');

      const formData = new FormData();
      formData.append('name', updateCategory.name);
      formData.append('status', updateCategory.status);
      if (updateCategory.parent_id) {
        formData.append('parent_id', updateCategory.parent_id);
      }
      formData.append('require_fields', JSON.stringify(requiredFields));
      
      if (updateCategory.small_image) {
        formData.append('small_image', updateCategory.small_image);
      }
      
      if (updateCategory.large_image) {
        formData.append('large_image', updateCategory.large_image);
      }
      
      if (updateCategory.description) {
        formData.append('description', updateCategory.description);
      }
      
      // Thêm _method=PUT để Laravel hiểu đây là request PUT
      formData.append('_method', 'PUT');

      const response = await fetch(`http://127.0.0.1:8000/api/admin/categories/${updateCategory.id}`, {
        method: 'POST', // Sử dụng POST nhưng với _method=PUT
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Không thể cập nhật danh mục');
        } catch {
          throw new Error('Máy chủ trả về phản hồi không phải JSON: ' + errorText);
        }
      }

      const updatedResponse = await fetch(`http://127.0.0.1:8000/api/admin/categories?page=${currentPage}`);
      const updatedData = await updatedResponse.json();
      setCategories(updatedData.data.data || []);
      setFilteredCategories(updatedData.data.data || []);
      setTotalPages(updatedData.data.last_page || 1);

      closeModal();
      toast.success('Cập nhật danh mục thành công!', { autoClose: 3000 });
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error.message);
      toast.error('Cập nhật danh mục thất bại: ' + error.message, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  // Xóa danh mục
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này không?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Không thể xóa danh mục');
        } catch {
          throw new Error('Máy chủ trả về phản hồi không phải JSON: ' + errorText);
        }
      }

      const updatedResponse = await fetch(`http://127.0.0.1:8000/api/admin/categories?page=${currentPage}`);
      const updatedData = await updatedResponse.json();
      setCategories(updatedData.data.data || []);
      setFilteredCategories(updatedData.data.data || []);
      setTotalPages(updatedData.data.last_page || 1);

      if (updatedData.data.data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

      toast.success('Xóa danh mục thành công!', { autoClose: 3000 });
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error.message);
      toast.error('Xóa danh mục thất bại: ' + error.message, { autoClose: 3000 });
    }
  };

  // Tìm kiếm
  const handleSearch = async () => {
    try {
      const params = new URLSearchParams({
        name: searchTerm,
        status: statusFilter,
        page: currentPage,
        per_page: 10,
      });

      const response = await fetch(`http://127.0.0.1:8000/api/admin/categories/search?${params.toString()}`);
      if (!response.ok) throw new Error('Không thể tìm kiếm danh mục');

      const searchData = await response.json();
      setFilteredCategories(searchData.data.data || []);
      setTotalPages(searchData.data.last_page || 1);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm danh mục:', error.message);
      toast.error('Tìm kiếm thất bại: ' + error.message, { autoClose: 3000 });
    }
  };

  const handleSearchInputChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleSearchButtonClick = () => {
    setCurrentPage(1);
    handleSearch();
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      handleSearch();
    }
  };

  const openEditModal = (category) => {
    setUpdateCategory({
      id: category.id,
      name: category.name,
      status: category.status,
      parent_id: category.parent_id,
      small_image: null,
      large_image: null,
      description: category.description || '',
      small_image_preview: null,
      large_image_preview: null,
      small_image_url: category.small_image ? category.small_image : '',
      large_image_url: category.large_image ? category.large_image : '',
    });
    // Cập nhật requiredFields từ category
    setRequiredFields(category.require_fields || []);
    setIsModalOpen(true);
  };

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="overflow-x-hidden min-h-screen bg-white p-4">
      <ToastContainer />
      <header className="py-10">
        <div className="container flex justify-between px-4">
          <h1 className="text-2xl font-bold text-gray-800">Loại sản phẩm</h1>
          <button
            onClick={openModal}
            className="px-4 py-2 text-base bg-gray-500 rounded-lg text-white hover:bg-gray-700"
          >
            Thêm loại sản phẩm +
          </button>
        </div>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[60em] max-h-[90vh] overflow-y-auto backdrop-blur-lg border-4 border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{updateCategory.id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2>
              <button onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
            <form onSubmit={updateCategory.id ? handleEditCategory : handleAddCategory}>
              <div className="grid grid-cols-2 gap-6">
                {/* Cột 1 */}
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">Tên danh mục</label>
                    <input
                      type="text"
                      name="name"
                      value={updateCategory.id ? updateCategory.name : newCategory.name}
                      onChange={updateCategory.id ? handleUpdateInputChange : handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2">Trạng thái</label>
                    <select
                      name="status"
                      value={updateCategory.id ? updateCategory.status : newCategory.status}
                      onChange={updateCategory.id ? handleUpdateInputChange : handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="hidden">Ẩn</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-2">Danh mục cha</label>
                    <select
                      name="parent_id"
                      value={updateCategory.id ? updateCategory.parent_id : newCategory.parent_id}
                      onChange={updateCategory.id ? handleUpdateInputChange : handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Không có danh mục cha</option>
                      {categories.map((category) => (
                        // Loại trừ danh mục hiện tại đang sửa để tránh chọn chính nó làm cha
                        updateCategory.id !== category.id && (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        )
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-2">Mô tả</label>
                    <textarea
                      name="description"
                      value={updateCategory.id ? updateCategory.description : newCategory.description}
                      onChange={updateCategory.id ? handleUpdateInputChange : handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      maxLength={255}
                      placeholder="Nhập mô tả danh mục"
                      rows={4}
                    ></textarea>
                  </div>
                </div>
                
                {/* Cột 2 */}
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">Ảnh nhỏ (small_image)</label>
                    <input
                      type="file"
                      name="small_image"
                      onChange={updateCategory.id ? handleUpdateInputChange : handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      accept="image/*"
                    />
                    {/* Hiển thị ảnh preview khi tải lên hoặc khi đang sửa */}
                    {((updateCategory.id && updateCategory.small_image_url) || updateCategory.small_image_preview || newCategory.small_image_preview) && (
                      <div className="mt-2">
                        <img 
                          src={updateCategory.id 
                            ? (updateCategory.small_image_preview || updateCategory.small_image_url) 
                            : newCategory.small_image_preview} 
                          alt="Xem trước ảnh nhỏ" 
                          className="h-20 object-contain border rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-2">Ảnh lớn (large_image)</label>
                    <input
                      type="file"
                      name="large_image"
                      onChange={updateCategory.id ? handleUpdateInputChange : handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      accept="image/*"
                    />
                    {/* Hiển thị ảnh preview khi tải lên hoặc khi đang sửa */}
                    {((updateCategory.id && updateCategory.large_image_url) || updateCategory.large_image_preview || newCategory.large_image_preview) && (
                      <div className="mt-2">
                        <img 
                          src={updateCategory.id 
                            ? (updateCategory.large_image_preview || updateCategory.large_image_url) 
                            : newCategory.large_image_preview} 
                          alt="Xem trước ảnh lớn" 
                          className="h-32 object-contain border rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block mb-2">Các trường yêu cầu (required fields)</label>
                    <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
                      {
                        requiredFields.map((field, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <input
                              type="text"
                              value={field}
                              onChange={(e) => {
                                const newFields = [...requiredFields];
                                newFields[index] = e.target.value;
                                setRequiredFields(newFields);
                              }}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newFields = requiredFields.filter((_, i) => i !== index);
                                setRequiredFields(newFields);
                              }}
                              className="ml-2 text-red-500"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        ))
                      }

                      <input
                        type="text"
                        placeholder="Thêm trường yêu cầu và nhấn Enter"
                        className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            const newField = e.target.value;
                            if (newField && !requiredFields.includes(newField)) {
                              setRequiredFields([...requiredFields, newField]);
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang xử lý...' : (updateCategory.id ? 'Cập nhật' : 'Thêm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-screen overflow-x-hidden px-4 py-6">
        <div className="flex flex-wrap justify-between mb-6">
          <div className="flex gap-4">
            <div className="flex flex-col mb-4 mr-8 md:mb-0">
              <span className="text-xl mb-2">Tìm kiếm</span>
              <input
                id="searchName"
                type="text"
                placeholder="Tìm kiếm theo tên loại sản phẩm"
                className="text-xl w-[16em] p-2 border border-gray-300 rounded-md box-border"
                value={searchTerm}
                onChange={handleSearchInputChange}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="flex flex-col mb-4 md:mb-0">
              <span className="text-xl mb-2">Trạng thái</span>
              <select
                id="statusFilter"
                className="text-xl w-[10em] p-2 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={handleStatusChange}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="hidden">Ẩn</option>
              </select>
            </div>
          </div>
          <div className="flex items-end mt-2 mb-4 md:mb-0">
            <button
              className="px-4 py-2 rounded-md bg-gray-500 text-white text-xl hover:bg-gray-700 shadow"
              onClick={handleSearchButtonClick}
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 overflow-x-auto border border-gray-300 rounded-lg shadow-md">
          <table className="table text-lg w-full">
            <thead className="text-lg">
              <tr>
                <th>ID</th>
                <th>Tên danh mục</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide">
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>
                    <span
                      className={`border border-gray-300 rounded-lg px-2 py-1 ${
                        category.status === 'active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                      }`}
                    >
                      {category.status === 'active' ? 'Hoạt động' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-start">
                      <button
                        className="flex w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-black"
                        onClick={() => openEditModal(category)}
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-xl" />
                      </button>
                      <button
                        className="flex w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-red-500"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <FontAwesomeIcon icon={faDeleteLeft} className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          <button
            className="btn rounded-lg ml-3"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
          </button>
          <span className="px-4 py-2 mx-2 text-gray-800">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            className="btn rounded-lg mr-3"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default CategoryManagement;