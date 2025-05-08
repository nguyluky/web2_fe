import { faArrowLeft, faBox, faCheckCircle, faCreditCard, faMoneyBill, faShippingFast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { OrderDetailsResponse, orderService } from "~/service/order.service";

export default function ChiTietDonHang() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailsResponse | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  // Kiểm tra thông báo thành công từ trang thanh toán
  const success = location.state?.success;
  const message = location.state?.message;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await orderService.getOrderDetail(parseInt(id));
        setOrderDetails(response);
        
        // Giả định chúng ta có thông tin đơn hàng từ API
        // Trong trường hợp thực tế, API sẽ trả về đầy đủ thông tin đơn hàng
        // bao gồm cả thông tin sản phẩm và giá cả
        const orderResponse = await orderService.getUserOrders();
        const foundOrder = orderResponse.data.find(order => order.id === parseInt(id));
        if (foundOrder) {
          setOrder(foundOrder);
        }

        // Tính tổng tiền đơn hàng
        let total = 0;
        if (response && response.orderDetail) {
          response.orderDetail.forEach(item => {
            total += item.price * item.amount;
          });
          setTotalAmount(total);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Không thể tải thông tin chi tiết đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // Hàm xử lý hủy đơn hàng
  const handleCancelOrder = async () => {
    if (!id) return;

    try {
      if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
        await orderService.cancelOrder(parseInt(id));
        // Load lại thông tin đơn hàng sau khi hủy
        const orderResponse = await orderService.getUserOrders();
        const updatedOrder = orderResponse.data.find(order => order.id === parseInt(id));
        if (updatedOrder) {
          setOrder(updatedOrder);
        }
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    }
  };

  // Hàm định dạng số tiền VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

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

  // Hàm lấy tên trạng thái đơn hàng
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

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-content';
      case 'processing':
        return 'bg-info text-info-content';
      case 'completed':
        return 'bg-success text-success-content';
      case 'cancelled':
        return 'bg-error text-error-content';
      default:
        return 'bg-base-300';
    }
  };

  // Hiển thị icon theo trạng thái
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return faBox;
      case 'processing':
        return faShippingFast;
      case 'completed':
        return faCheckCircle;
      default:
        return faBox;
    }
  };

  return (
    <div className="card border-1 border-base-300">
      <div className="card-body flex-col gap-5">
        {/* Nút quay lại và tiêu đề */}
        <div className="flex items-center gap-3">
          <button className="btn btn-circle btn-ghost" onClick={() => navigate('/tai-khoan/don-hang')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h3 className="text-xl font-bold">Chi tiết đơn hàng #{id}</h3>
        </div>

        {/* Thông báo thành công nếu có */}
        {success && (
          <div className="alert alert-success shadow-lg">
            <div>
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>{message || 'Đặt hàng thành công!'}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : (
          <>
            {/* Trạng thái đơn hàng */}
            {order && (
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <div className={`badge badge-lg ${order.status === 'cancelled' ? 'badge-error' : 'badge-primary'}`}>
                    <FontAwesomeIcon icon={getStatusIcon(order.status)} className="mr-2" />
                    {getStatusName(order.status)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {order.created_at ? `Đặt hàng ngày ${formatDate(order.created_at)}` : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Thông tin đơn hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h2 className="card-title">Thông tin đơn hàng</h2>
                  <div className="divider mt-0 mb-2"></div>
                  <p><strong>Mã đơn hàng:</strong> #{id}</p>
                  <p><strong>Ngày đặt:</strong> {order?.created_at ? formatDate(order.created_at) : 'N/A'}</p>
                  <p>
                    <strong>Phương thức thanh toán:</strong> 
                    <span className="ml-2">
                      <FontAwesomeIcon icon={order?.payment_method === 'cod' ? faMoneyBill : faCreditCard} className="mr-1" />
                      {order?.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 
                       order?.payment_method === 'banking' ? 'Chuyển khoản ngân hàng' : 
                       order?.payment_method}
                    </span>
                  </p>
                  <p><strong>Trạng thái:</strong> {order ? getStatusName(order.status) : 'N/A'}</p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h2 className="card-title">Thông tin giao hàng</h2>
                  <div className="divider mt-0 mb-2"></div>
                  <p><strong>Tên người nhận:</strong> {order?.shipping_name || 'Chưa có thông tin'}</p>
                  <p><strong>Số điện thoại:</strong> {order?.shipping_phone || 'Chưa có thông tin'}</p>
                  <p><strong>Địa chỉ:</strong> {order?.shipping_address || 'Chưa có thông tin'}</p>
                  <p><strong>Ghi chú:</strong> {order?.note || 'Không có ghi chú'}</p>
                </div>
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="card bg-base-100 shadow-sm mb-6">
              <div className="card-body">
                <h2 className="card-title">Sản phẩm đã đặt</h2>
                <div className="divider mt-0 mb-2"></div>
                
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails?.orderDetail && orderDetails.orderDetail.length > 0 ? (
                        orderDetails.orderDetail.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="avatar">
                                  <div className="mask mask-squircle w-12 h-12">
                                    <img 
                                      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" 
                                      alt="Sản phẩm" 
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div className="font-bold">Sản phẩm {item.product_id}</div>
                                  <div className="text-sm opacity-50">Variant {item.variant_id}</div>
                                </div>
                              </div>
                            </td>
                            <td>{item.amount}</td>
                            <td>{formatCurrency(item.price)}</td>
                            <td>{formatCurrency(item.price * item.amount)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center">Không có thông tin sản phẩm</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="text-right font-bold">Tổng cộng:</td>
                        <td className="font-bold">{formatCurrency(totalAmount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Nút thao tác */}
            <div className="flex justify-between items-center mt-4">
              <Link to="/tai-khoan/don-hang" className="btn btn-outline">
                Quay lại danh sách
              </Link>
              
              {order && order.status === 'pending' && (
                <button className="btn btn-error" onClick={handleCancelOrder}>
                  Hủy đơn hàng
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}