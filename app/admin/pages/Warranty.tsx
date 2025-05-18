//@ts-nocheck
import {
    faChevronLeft,
    faChevronRight,
    faDeleteLeft,
    faEdit,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchWithToken from '~/utils/fechWithToken';

const WarrantyManagement = () => {
  const [warranties, setWarranties] = useState([]);
  const [users, setUsers] = useState([]);
  const [orderDetail, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredWarranties, setFilteredWarranties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWarranty, setNewWarranty] = useState({
      product_id: '',
      supplier_id: '',
      issue_date: '',
      expiration_date: '',
      status: 'active',
      note: '',
    });
  const [updateWarranty, setUpdateWarranty] = useState({
    id: null,
    issue_date: '',
    expiration_date: '',
    status: 'active',
    note: '',
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchWithTokenData = async () => {
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

        const warrantyRes = await fetchWithToken(`http://127.0.0.1:8000/api/admin/warrantys/search?${params.toString()}`); // Replace with your API endpoint
        const warrantyData = await warrantyRes.json();
        setWarranties(warrantyData.data.data || []);

        const orderRes = await fetchWithToken('http://127.0.0.1:8000/api/admin/order/detail'); // Replace with your API endpoint
        const orderData = await orderRes.json();
        setOrders(orderData.data.data || []);
        

        const productRes = await fetchWithToken('http://127.0.0.1:8000/api/admin/products'); // Replace with your API endpoint
        const productData = await productRes.json();
        setProducts(productData.data.data || []);
        setTotalPages(warrantyData.data.last_page || 1);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        toast.error('Lỗi khi lấy dữ liệu: ' + error.message, { autoClose: 3000 });
      }
    };
    fetchWithTokenData();
  }, [currentPage, searchTerm, statusFilter, dateStart, dateEnd]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewWarranty({
      product_id: '',
      supplier_id: '',
      issue_date: '',
      expiration_date: '',
      status: 'active',
      note: '',
    });
    setUpdateWarranty({
      id: null,
      status: 'active',
      note: '',
    });
  };
  
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateWarranty((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditWarranty = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Cập nhật bảo hành
      const warrantyUpdateData = {
        issue_date: updateWarranty.issue_date,
        expiration_date: updateWarranty.expiration_date,
        status: updateWarranty.status,
        note: updateWarranty.note,
      };
      console.log(updateWarranty.id);
      const warrantyResponse = await fetchWithToken(`http://127.0.0.1:8000/api/admin/warrantys/${updateWarranty.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(warrantyUpdateData),
      });
  
      if (!warrantyResponse.ok) {
        const warrantyText = await warrantyResponse.text();
        const warrantyData = JSON.parse(warrantyText);
        const errorMessage = warrantyData.message?.name?.[0] || warrantyData.message || 'Không thể cập nhật bảo hành';
        throw new Error(errorMessage);
      }
  
      // Làm mới danh sách
      const updatedWarrantyResponse = await fetchWithToken(`http://127.0.0.1:8000/api/admin/warrantys/search?page=${currentPage}&status=${statusFilter}`);
      const updatedWarrantyData = await updatedWarrantyResponse.json();
      setWarranties(updatedWarrantyData.data.data || []);
      setTotalPages(updatedWarrantyData.data.last_page || 1);

      closeModal();
      toast.success('Cập nhật bảo hành thành công!', { autoClose: 3000 });
    } catch (error) {
      console.error('Lỗi khi cập nhật bảo hành:', error.message);
      toast.error('Cập nhật bảo hành thất bại: ' + error.message, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };  

  const handleDeleteWarranty = async (warrantyId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bảo hành này không?')) {
      return;
    }

    try {
      const warrantyResponse = await fetchWithToken(`http://127.0.0.1:8000/api/admin/warrantys/${warrantyId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const contentType = warrantyResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Máy chủ không trả về dữ liệu JSON');
      }

      const warrantyData = await warrantyResponse.json();

      if (!warrantyResponse.ok) {
        throw new Error(warrantyData.message || 'Không thể xóa bảo hành');
      }

      // Cập nhật danh sách từ phản hồi API
      if (warrantyData.data) {
        setWarranty(warrantyData.data.data || []);
        setTotalPages(warrantyData.data.last_page || 1);

        // Làm mới danh sách
        const updatedWarrantyResponse = await fetchWithToken(`http://127.0.0.1:8000/api/admin/warrantys/search?page=${currentPage}&status=${statusFilter}`);
        const updatedWarrantyData = await updatedWarrantyResponse.json();
        setOrders(updatedWarrantyData.data.data || []);

        // Quay về trang trước nếu trang hiện tại trống
        if (updatedWarrantyData.data.data.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
      toast.success('Xóa bảo hành thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa bảo hành:', error.message);
      toast.error('Xóa bảo hành thất bại:' + error.message);
    }
  };

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

  const openEditModal = (warranty) => {
    const warrantyData = warranties.find((a) => a.id === warranty.id);
    console.log(warrantyData);
    if (!warrantyData) return;
  
    setUpdateWarranty({
      id: warranty.id,
      issue_date: warranty.issue_date,
      expiration_date: warranty.expiration_date,
      status: warrantyData.status,
      note: warranty.note
    });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-screen overflow-x-hidden px-4 py-6">
      <ToastContainer />
      {/* Header */}
      <header className="py-10 mb-6">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Bảo hành</h1>
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
                placeholder="Tìm kiếm theo số serial"
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
                <option value="active">Còn hạn</option>
                <option value="expired">Hết hạn</option>
              </select>
            </div>
          </div>
        </div>


        {/* Bảng */}
        <div className="grid grid-cols-1 overflow-x-auto border border-gray-300 rounded-lg shadow-md">
          <table className="table text-lg w-full">
            {' '}
            <thead className="text-lg">
              <tr>
                <th>ID</th>
                <th>Serial</th>
                <th>Tên sản phẩm</th>
                <th>Ngày bảo hành</th>
                <th>Ngày hết hạn</th>
                <th>Ghi chú</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {warranties.map((warranty) => (
                <tr key={warranty.id} className="border-b border-gray-300">
                  <td>{warranty.id}</td>
                  <td>
                    {orderDetail.find((orderDetail) => orderDetail.id === warranty.product_id)?.serial ||
                      'Không tìm thấy'}
                  </td>
                  <td>
                    {products.find((product) => product.id === warranty.product_id)?.name ||
                      'Không tìm thấy'}
                  </td>
                  <td>{warranty.issue_date}</td>
                  <td>{warranty.expiration_date}</td>
                  <td>{warranty.note}</td>
                  <td>
                    <span
                      className={`inline-block rounded-xl border border-gray-300 px-1 py-2 text-base min-w-[100px] text-center ${
                        warranty.status === 'active' ? 'text-green-700' : 'text-red-500'
                      }`}
                    >
                      {warranty.status === 'active' ? 'Còn hạn' : 'Hết hạn'}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-start">
                      <button 
                        className="flex w-12 h-12 px-6 py-2 text-base bg-white-500 text-gray-500 hover:text-black"
                        onClick={() => openEditModal(warranty)}
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-xl" />
                      </button>
                      <button 
                        className="flex  w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-black"
                        onClick={() => handleDeleteWarranty(warranty.id)}
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

      {/* Model sửa bảo hành */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[40em] max-h-[90vh] overflow-y-auto backdrop-blur-lg border-4 border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chỉnh sửa thông tin bảo hành</h2>
              <button onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleEditWarranty}>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">Ngày bảo hành</label>
                    <input
                      type="date"
                      name="issue_date"
                      value={updateWarranty.issue_date}
                      onChange={handleUpdateInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Ngày hết hạn</label>
                    <input
                      type="date"
                      name="expiration_date"
                      value={updateWarranty.expiration_date}
                      onChange={handleUpdateInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Ghi chú</label>
                    <textarea
                      name="note"
                      value={updateWarranty.note}
                      onChange={handleUpdateInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
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
                  {isLoading ? 'Đang xử lý...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarrantyManagement;
