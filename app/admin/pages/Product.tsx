// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faChevronRight,
    faDeleteLeft,
    faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [productVars, setProductVars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API tìm kiếm thay vì lấy toàn bộ danh sách
        const params = new URLSearchParams({
          keyword: searchTerm,
          status: statusFilter,
          date_start: dateStart,
          date_end: dateEnd,
          page: currentPage,
          per_page: 10,
        });
        const productRes = await fetch(`http://127.0.0.1:8000/api/admin/products/search?${params.toString()}`); // Replace with your API endpoint
        const productData = await productRes.json();
        setProducts(productData.data.data || []);

        const productVarRes = await fetch(`http://127.0.0.1:8000/api/admin/product-variants`); // Replace with your API endpoint
        const productVarData = await productVarRes.json();
        setProductVars(productVarData.data || []);

        const categoryRes = await fetch(`http://127.0.0.1:8000/api/admin/categories`); // Replace with your API endpoint
        const categoryData = await categoryRes.json();
        setCategories(categoryData.data.data || []);

        setTotalPages(productData.data.last_page || 1);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        toast.error('Lỗi khi lấy dữ liệu: ' + error.message, { autoClose: 3000 });
      }
    };
    fetchData();
  }, [currentPage, searchTerm, statusFilter, dateStart, dateEnd]);

  const handleSearchInputChange = (e) => {
    setCurrentPage(1);
    setSearchTerm(e.target.value);
  }

  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleDateStartChange = (e) => setDateStart(e.target.value);
  const handleDateEndChange = (e) => setDateEnd(e.target.value);
  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-x-hidden min-h-screen bg-white p-4">
      <ToastContainer />
      {/* Header */}
      <header className="py-10">
        <div className="container flex justify-between px-4">
          <h1 className="text-2xl font-bold text-gray-800">Sản phẩm</h1>
          <button className="px-4 py-2 text-base bg-gray-500 rounded-lg text-white hover:bg-gray-700">
            Thêm sản phẩm +
          </button>
        </div>
      </header>
      <main className="max-w-screen overflow-x-hidden px-4 py-6">
        {/* Search Bar */}
        <div className="flex flex-wrap justify-between mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Tìm kiếm */}
            <div className="flex flex-col mb-4 mr-8 md:mb-0">
              <span className="text-xl mb-2">Tìm kiếm</span>
              <input
                id="searchName"
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm"
                className="text-xl w-[16em] p-2 border border-gray-300 rounded-md box-border"
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
            </div>
            <div className="flex flex-col mb-4 mr-8 md:mb-0 ">
              <span className="text-xl mb-2">Ngày bắt đầu</span>
              <input
                id="searchDateStart"
                type="date"
                className="text-xl w-[12em] p-2 border border-gray-300 rounded-md"
                value={dateStart}
                onChange={handleDateStartChange}
              />
            </div>
            <div className="flex flex-col mb-4 mr-8 md:mb-0">
              <span className="text-xl mb-2">Ngày kết thúc</span>
              <input
                id="searchDateEnd"
                type="date"
                className="text-xl w-[12em] p-2 border border-gray-300 rounded-md"
                value={dateEnd}
                onChange={handleDateEndChange}
              />
            </div>

            {/* Trạng thái */}
            <div className="flex flex-col mb-4 md:mb-0">
              <span className="text-xl mb-2">Trạng thái</span>
              <select
                id="statusFilter"
                className="text-xl w-[10em] p-2 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={handleStatusChange}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang bán</option>
                <option value="inactive">Ngưng bán</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bảng */}
        <div className="grid grid-cols-1 overflow-x-auto border border-gray-300 rounded-lg shadow-md">
          <table className="table text-lg w-full">
            <thead className="text-lg">
              <tr>
                <th>ID</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {products.map((product) => (
                <tr key={product.id} className="">
                  <td>{product.id}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="product-img">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-1-202309?wid=5120&hei=2880&fmt=jpeg&qlt=80&.v=1692837880911"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {categories.find((category) => category.id === product.id)?.name || 'Not Found'}
                  </td>
                  <td>{product.base_price}</td>
                  <td>
                    {productVars
                      .filter((productVar) => productVar.product_id === product.id) 
                      .reduce((totalStock, productVar) => totalStock + productVar.stock, 0) || 'Not Found'}
                  </td>
                  <td>{product.created_at}</td>
                  <td>
                    <span
                      className={`border border-gray-300 rounded-lg px-2 py-1 ${
                        product.status === 'active' ? 'text-green-700' : 'text-red-500'
                      }`}
                    >
                      {product.status === 'active' ? 'Đang bán' : 'Ngưng bán'}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-start">
                      <button className="flex w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-black">
                        <FontAwesomeIcon icon={faEdit} className="text-xl" />
                      </button>
                      <button className="flex  w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-black">
                        <FontAwesomeIcon icon={faDeleteLeft} className="text-xl" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Phân trang */}
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

export default ProductManagement;
