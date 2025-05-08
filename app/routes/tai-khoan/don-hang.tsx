import { faChevronLeft, faChevronRight, faEye, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "~/contexts/AuthContext";
import type { Order } from "~/service/order.service";
import { orderService } from "~/service/order.service";

export default function DonHang() {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");


  console.log(orders)

  // Các trạng thái đơn hàng để hiển thị
  const orderStatuses = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "pending", label: "Đang xử lý" },
    { value: "processing", label: "Đang giao hàng" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" }
  ];

  // Hàm định dạng ngày giờ
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'processing':
        return 'badge-info';
      case 'completed':
        return 'badge-success';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  };

  // Hàm lấy tên tiếng Việt cho trạng thái
  const getStatusName = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Đang xử lý';
      case 'processing':
        return 'Đang giao hàng';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  // Hàm tải danh sách đơn hàng
  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 5 // Số đơn hàng mỗi trang
      };

      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }

      const [response, err] = await orderService.getUserOrders(params);
      if (!response) return
      setOrders(response.data);
      setTotalPages(response.last_page);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentPage, statusFilter]);

  // Gọi API khi component mount hoặc các tham số thay đổi
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Xử lý hủy đơn hàng
  const handleCancelOrder = async (orderId: number) => {
    try {
      if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
        await orderService.cancelOrder(orderId);
        // Tải lại danh sách đơn hàng sau khi hủy
        fetchOrders();
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    }
  };

  // Lọc đơn hàng theo từ khóa tìm kiếm
  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchTerm)
  );

  return (
    <div className="card border-1 border-base-300">
      <div className="card-body flex-col gap-5">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h3 className="text-xl font-bold">Đơn hàng của tôi</h3>
          <div className="flex gap-3 flex-wrap">
            {/* Lọc theo trạng thái */}
            <div className="form-control">
              <div className="join">
                <select 
                  className="select select-bordered"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {orderStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <button className="btn btn-square btn-primary">
                  <FontAwesomeIcon icon={faFilter} />
                </button>
              </div>
            </div>
            
            {/* Tìm kiếm */}
            <div className="form-control">
              <div className="join">
                <input 
                  type="text" 
                  placeholder="Tìm theo mã đơn hàng" 
                  className="input input-bordered" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-square btn-primary">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-lg mb-3">Không có đơn hàng nào</div>
            <Link to="/san-pham" className="btn btn-primary">
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Mã đơn hàng</th>
                    <th>Ngày đặt</th>
                    <th>Phương thức thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.created_at ? formatDate(order.created_at) : 'N/A'}</td>
                      <td>
                        {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 
                         order.payment_method === 'banking' ? 'Chuyển khoản ngân hàng' : 
                         order.payment_method}
                      </td>
                      <td>
                        <div className={`badge ${getStatusColor(order.status)} gap-1`}>
                          {getStatusName(order.status)}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link to={`/tai-khoan/don-hang/${order.id}`} className="btn btn-sm btn-ghost">
                            <FontAwesomeIcon icon={faEye} /> Xem
                          </Link>
                          {order.status === 'pending' && (
                            <button 
                              className="btn btn-sm btn-error"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Hủy đơn
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <div className="join">
                  <button 
                    className="join-item btn"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button 
                      key={index}
                      className={`join-item btn ${currentPage === index + 1 ? 'btn-active' : ''}`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button 
                    className="join-item btn"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
