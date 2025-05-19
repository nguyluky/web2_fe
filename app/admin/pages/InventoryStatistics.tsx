// @ts-nocheck
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchWithToken from '~/utils/fechWithToken';

const InventoryStatistics = () => {
  const [products, setProducts] = useState([]);
  const [productVars, setProductVars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');

  const fetchWithTokenProducts = async () => {
    try {
      const params = new URLSearchParams({
        keyword: searchTerm,
        status: statusFilter,
        page: currentPage,
        per_page: 10,
      });
      const productRes = await fetchWithToken(
        `http://127.0.0.1:8000/api/admin/products/search?${params.toString()}`
      );
      if (!productRes.ok) throw new Error('Không thể lấy dữ liệu sản phẩm');
      const productData = await productRes.json();
      setProducts(productData.data.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
      toast.error('Lỗi khi lấy dữ liệu sản phẩm: ' + error.message);
    }
  };

  const fetchWithTokenProductVariants = async () => {
    try {
      const params = new URLSearchParams({
        keyword: searchTerm,
        status: statusFilter,
        page: currentPage,
        per_page: 10,
      });
      if (selectedVariant) {
        params.append('variant_id', selectedVariant);
      }
      const productVarRes = await fetchWithToken(
        `http://127.0.0.1:8000/api/admin/product-variants/search?${params.toString()}`
      );
      if (!productVarRes.ok) throw new Error('Không thể lấy dữ liệu biến thể');
      const productVarData = await productVarRes.json();
      setProductVars(productVarData.data.data || []);
      setTotalPages(productVarData.data.last_page || 1);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu biến thể:', error);
      toast.error('Lỗi khi lấy dữ liệu biến thể: ' + error.message);
    }
  };

  useEffect(() => {
    fetchWithTokenProducts();
    fetchWithTokenProductVariants();
  }, [currentPage, searchTerm, statusFilter, selectedVariant]);

  const handleSearchInputChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleVariantChange = (e) => setSelectedVariant(e.target.value);
  const handleSearchButtonClick = () => setCurrentPage(1);
  const handleKeyPress = (e) => e.key === 'Enter' && setCurrentPage(1);

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="max-w-screen overflow-x-hidden px-4 py-6">
      <ToastContainer />

      <header className="py-10 mb-6">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Thống kê tồn kho</h1>
        </div>
      </header>

      <div className="flex flex-wrap justify-between mb-6">
        <div className="flex gap-4">
          <div className="flex flex-col mb-4 mr-8 md:mb-0">
            <span className="text-xl mb-2">Tìm kiếm</span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sản phẩm hoặc thuộc tính"
              className="text-xl w-[16em] p-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="flex flex-col mb-4 md:mb-0">
            <span className="text-xl mb-2">Trạng thái</span>
            <select
              className="text-xl w-[10em] p-2 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>
          </div>


        </div>

        {/* <div className="flex items-end mt-2 mb-4 md:mb-0">
          <button
            className="px-4 py-2 rounded-md bg-gray-500 text-white text-xl hover:bg-gray-700 shadow"
            onClick={handleSearchButtonClick}
          >
            Tìm kiếm
          </button>
        </div> */}
      </div>

      <div className="grid grid-cols-1 overflow-x-auto border border-gray-300 rounded-lg shadow-md">
        <table className="table text-lg w-full">
          <thead className="text-lg">
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Thuộc tính</th>
              <th>Trạng thái</th>
              <th>Tồn kho</th>
            </tr>
          </thead>
          <tbody>
            {productVars.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Không có sản phẩm nào
                </td>
              </tr>
            ) : (
              productVars.map((variant) => {
                const product = products.find((p) => p.id === variant.product_id);
                return (
                  <tr key={variant.id} className="border-b border-gray-300">
                    <td>{variant.id}</td>
                    <td>{product?.name || 'Không xác định'}</td>
                    <td>
                      {(() => {
                        try {
                          let attrs = variant.attributes;
                          if (typeof attrs === 'string') {
                            while (typeof attrs === 'string') {
                              attrs = JSON.parse(attrs);
                            }
                          }
                          return Object.entries(attrs)
                            .map(([key, val]) => `${key}: ${val}`)
                            .join(', ');
                        } catch (e) {
                          return 'Thuộc tính không hợp lệ';
                        }
                      })()}
                    </td>
                    <td>
                      {variant.status === 'active'
                        ? 'Hoạt động'
                        : variant.status === 'inactive'
                        ? 'Ngừng'
                        : 'Hết hàng'}
                    </td>
                    <td>{variant.stock}</td>
                  </tr>
                );
              })
            )}
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
    </div>
  );
};

export default InventoryStatistics;