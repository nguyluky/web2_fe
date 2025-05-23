//@ts-nocheck
import {
    faChevronLeft,
    faChevronRight,
    faEye,
    faEdit,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchWithToken from '~/utils/fechWithToken';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    const fetchWithTokenData = async () => {
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          status: statusFilter === 'all' ? '' : statusFilter,
          date_start: dateStart,
          date_end: dateEnd,
          limit: 10,
          page: currentPage,
        });

        const ordersResponse = await fetchWithToken(`http://127.0.0.1:8000/api/admin/orders?${params.toString()}`);
        if (!ordersResponse.ok) throw new Error('Không thể lấy danh sách đơn hàng');
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.data.data || []);
        setTotalPages(ordersData.data.last_page || 1);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        toast.error('Lỗi khi lấy dữ liệu: ' + error.message, { autoClose: 3000 });
      }
    };
    fetchWithTokenData();
  }, [currentPage, searchTerm, statusFilter, dateStart, dateEnd]);

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedOrder(null);
    setEditStatus('');
  };

  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
  
    setIsLoading(true);
    try {
      const response = await fetchWithToken(`http://127.0.0.1:8000/api/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: editStatus }),
      });
  
      let responseData;
      try {
        responseData = await response.json();
        console.log('Server response:', responseData); // Add this for debugging
      } catch (err) {
        throw new Error(`Invalid response: ${response.status} ${response.statusText}`);
      }
  
      if (!response.ok) {
        const errorMessage = responseData.message || 'Không thể cập nhật trạng thái đơn hàng';
        if (responseData.errors) {
          const errorDetails = Object.values(responseData.errors).flat().join(', ');
          throw new Error(`${errorMessage}: ${errorDetails}`);
        }
        throw new Error(errorMessage);
      }
  
      // Rest of the function remains the same
      const updatedOrdersResponse = await fetchWithToken(
        `http://127.0.0.1:8000/api/admin/orders?page=${currentPage}&limit=10`
      );
      if (!updatedOrdersResponse.ok) {
        throw new Error('Không thể lấy danh sách đơn hàng');
      }
      const updatedOrdersData = await updatedOrdersResponse.json();
      setOrders(updatedOrdersData.data.data || []);
      setTotalPages(updatedOrdersData.data.last_page || 1);
  
      closeEditModal();
      toast.success('Cập nhật trạng thái đơn hàng thành công!', { autoClose: 3000 });
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error, error.stack); // Log stack trace
      toast.error(`Cập nhật trạng thái thất bại: ${error.message}`, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleDateStartChange = (e) => setDateStart(e.target.value);
  const handleDateEndChange = (e) => setDateEnd(e.target.value);
  const handleEditStatusChange = (e) => setEditStatus(e.target.value);
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

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'processing':
        return 'Đã thanh toán';
      default:
        return 'Database Error';
    }
  };

   const getPaymentText = (payment) => {
    switch (payment) {
      case '0':
        return "Ngân hàng";
      case '1':
        return "Ví điện tử";
      case '2':
        return "Thẻ tín dụng";
      case '3':
        return "COD";
      default:
        return 'Database Error';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'processing':
        return 'text-blue-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="overflow-x-hidden min-h-screen bg-white p-4">
      <ToastContainer />
      <header className="py-10 mb-6">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Đơn hàng</h1>
        </div>
      </header>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[30em] max-h-[90vh] overflow-y-auto backdrop-blur-lg border-4 border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cập nhật trạng thái đơn hàng</h2>
              <button onClick={closeEditModal}>
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleUpdateStatus}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Trạng thái</label>
                  <select
                    value={editStatus}
                    onChange={handleEditStatusChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    {['completed', 'cancelled'].includes(editStatus) ? (
                      <option value={editStatus}>
                        {{
                          completed: 'Hoàn thành',
                          cancelled: 'Đã hủy',
                        }[editStatus]}
                      </option>
                    ) : (
                      ['pending', 'processing', 'completed', 'cancelled']
                        .slice(['pending', 'processing', 'completed', 'cancelled'].indexOf(editStatus))
                        .map((status) => (
                          <option key={status} value={status}>
                            {{
                              pending: 'Đang xử lý',
                              processing: 'Đã thanh toán',
                              completed: 'Hoàn thành',
                              cancelled: 'Đã hủy',
                            }[status]}
                          </option>
                        ))
                    )}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
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

{isDetailModalOpen && (
  <div className="fixed inset-0 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[60em] max-h-[90vh] overflow-y-auto backdrop-blur-lg border-4 border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chi tiết đơn hàng #{selectedOrder.id}</h2>
        <button onClick={closeDetailModal}>
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>
      </div>
      <div className="mb-4 text-base text-gray-700">
        <p><strong>Người nhận:</strong> {selectedOrder.address.name}</p>
        <p><strong>Email:</strong> {selectedOrder.address.email}</p>
        <p><strong>Số điện thoại:</strong> {selectedOrder.address.phone_number}</p>
        <p><strong>Địa chỉ:</strong> 
          {[
            selectedOrder.address.street,
            selectedOrder.address.ward,
            selectedOrder.address.district,
            selectedOrder.address.city
          ].filter(Boolean).join(', ')}
        </p>
      </div>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left p-3">Mã sản phẩm</th>
            <th className="text-left p-3">Tên sản phẩm</th>
            <th className="text-left p-3">Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            // Gom nhóm và tính tổng số lượng
            const grouped = selectedOrder.order_details.reduce((acc, detail) => {
              const id = detail.product_variant_id;
              if (!acc[id]) {
                acc[id] = { ...detail, quantity: detail.quantity || 1 };
              } else {
                acc[id].quantity += detail.quantity || 1;
              }
              return acc;
            }, {} as Record<number, typeof selectedOrder.order_details[0]>);
          
            const groupedArray = Object.values(grouped);
          
            return (
              <>
                {groupedArray.map(detail => (
                  <tr key={detail.id} className="border-b border-gray-200">
                    <td className="p-3">{detail.product_variant?.sku}</td>
                    <td className="p-3">{detail.product_variant?.product?.name}</td>
                    <td className="p-3">{detail.quantity}</td>
                  </tr>
                ))}
      
                <tr className="font-semibold text-right">
                  <td colSpan={2} className="p-3 text-right">Tổng sản phẩm:</td>
                  <td className="p-3 text-left">{groupedArray.reduce((sum, d) => sum + d.quantity, 0)}</td>
                </tr>
              </>
            );
          })()}
        </tbody>
      </table>
    </div>
  </div>
)}

      <div className="flex flex-wrap justify-between mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col mb-4 mr-8 md:mb-0">
            <span className="text-xl mb-2">Tìm kiếm</span>
            <input
              id="searchName"
              type="text"
              placeholder="Thông tin đơn hàng"
              className="text-xl w-[16em] p-2 border border-gray-300 rounded-md box-border"
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="flex flex-col mb-4 mr-8 md:mb-0">
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
          <div className="flex flex-col mb-4 md:mb-0">
            <span className="text-xl mb-2">Trạng thái</span>
            <select
              id="statusFilter"
              className="text-xl w-[12em] p-2 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Đang xử lý</option>
              <option value="processing">Đã thanh toán</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 overflow-x-auto border border-gray-300 rounded-lg shadow-md">
        <table className="table text-lg w-full">
          <thead className="text-lg">
            <tr>
              <th>Mã đơn</th>
              <th>Tên khách hàng</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Ngày tạo</th>
              <th>Phương thức</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
                return <tr key={order.id} className="border-b border-gray-300">
                <td>{order.id}</td>
                <td>
                    {order.profile.fullname || 'N/A'}
                </td>
                <td>
                    {order.profile.phone_number || 'N/A'}
                </td>
                <td>
                    {order.profile.email || 'N/A'}
                </td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{getPaymentText(order.payment_method) || 'N/A'}</td>
                <td>
                  <span
                    className={`border border-gray-300 rounded-lg px-2 py-1 ${getStatusColor(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td>
                  <div className="flex justify-start">
                    <button
                      className="flex w-12 h-12 px-4 py-2 text-base bg-white text-gray-500 hover:text-black"
                      onClick={() => openEditModal(order)}
                      disabled={isLoading}
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-xl" />
                    </button>
                    <button
                      className="flex w-12 h-12 px-4 py-2 text-base bg-white text-gray-500 hover:text-red-500"
                      onClick={() => openDetailModal(order)}
                      disabled={isLoading || order.status === 'cancelled'}
                    >
                      <FontAwesomeIcon icon={faEye} className="text-xl" />
                    </button>
                  </div>
                </td>
              </tr>
})}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="btn rounded-lg ml-3"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
        </button>
        <span className="px-4 py-2 mx-2 text-gray-800">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="btn rounded-lg mr-3"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default OrderManagement;