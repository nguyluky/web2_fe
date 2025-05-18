import { faChevronLeft, faChevronRight, faComment, faEye, faFilter, faSearch, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "~/contexts/AuthContext";
import type { Order, OrderDetail } from "~/service/order.service";
import { orderService } from "~/service/order.service";
import { productReviewService, type Review } from "~/service/productReview.service";
import { formatCurrency } from "~/utils/formatCurrency";

export default function DonHang() {
  const { isAuthenticated, profile: user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [reviewItem, setReviewItem] = useState<OrderDetail | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    comment: "",
  });

  console.log(orders);

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

  // Hàm hiển thị tên phương thức thanh toán
  const getPaymentMethodName = (method: string | number) => {
    // Xử lý với cả kiểu chuỗi và kiểu số
    if (method === 0 || method === '0') {
      return 'Thanh toán khi nhận hàng';
    } else if (method === 1 || method === '1') {
      return 'Chuyển khoản';
    } else if (method === 2 || method === '2') {
      return 'Momo';
    } else if (method === 'cod') {
      return 'Thanh toán khi nhận hàng';
    } else if (method === 'banking') {
      return 'Chuyển khoản ngân hàng';
    } else {
      return method?.toString() || 'Không xác định';
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
      if (!response) return;
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

  // Hàm lấy chi tiết đơn hàng
  const fetchOrderDetails = async (orderId: number) => {
    try {
      setLoadingDetails(true);
      const [response, err] = await orderService.getOrderDetail(orderId);
      if (response) {
        // Nhóm các sản phẩm giống nhau
        const groupedDetails = groupSimilarItems(response.orderDetail);
        setOrderDetails(groupedDetails);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };
  
  // Hàm nhóm các sản phẩm giống nhau
  const groupSimilarItems = (items: OrderDetail[]) => {
    const groupedMap = new Map<string, OrderDetail & { originalItems?: OrderDetail[] }>();
    
    items.forEach(item => {
      // Tạo key duy nhất cho mỗi sản phẩm dựa trên product_id và variant_id
      const key = `${item.product.id}-${item.variant.id}`;
      
      if (groupedMap.has(key)) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng và cập nhật tổng giá
        const existingItem = groupedMap.get(key)!;
        existingItem.amount += item.amount;
        
        // Lưu lại item gốc để đảm bảo id gốc được giữ lại cho đánh giá
        if (!existingItem.originalItems) {
          existingItem.originalItems = [{ ...existingItem }];
        }
        existingItem.originalItems.push(item);
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm vào map
        groupedMap.set(key, { ...item, originalItems: [item] });
      }
    });
    
    // Chuyển map thành mảng để hiển thị
    return Array.from(groupedMap.values());
  };

  // Hàm hiển thị modal chi tiết đơn hàng
  const handleViewOrderDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    fetchOrderDetails(orderId);
    (document.getElementById(`order_detail_modal_${orderId}`) as HTMLDialogElement)?.showModal();
  };

  // Hàm mở modal đánh giá sản phẩm
  const handleOpenReviewModal = (item: OrderDetail & { originalItems?: OrderDetail[] }) => {
    // Sử dụng item gốc đầu tiên để đánh giá, hoặc sử dụng item hiện tại nếu không có originalItems
    const reviewTargetItem = item.originalItems ? item.originalItems[0] : item;
    setReviewItem(reviewTargetItem);
    setReviewFormData({
      rating: 5,
      comment: "",
    });
    setShowReviewModal(true);
    (document.getElementById(`review_modal`) as HTMLDialogElement)?.showModal();
  };

  // Hàm đóng modal đánh giá
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setReviewItem(null);
    (document.getElementById(`review_modal`) as HTMLDialogElement)?.close();
  };

  // Xử lý thay đổi giá trị đánh giá
  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  // Gửi đánh giá sản phẩm
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewItem) return;
    
    try {
      const reviewData: Review = {
        product_id: reviewItem.product.id,
        rating: reviewFormData.rating,
        comment: reviewFormData.comment
      };
      
      const [response, error] = await productReviewService.createReview(reviewItem.product.id, reviewData);
      
      if (error) {
        toast.error("Không thể gửi đánh giá. Vui lòng thử lại sau!");
        return;
      }
      
      toast.success("Đã gửi đánh giá thành công!");
      handleCloseReviewModal();
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Đã xảy ra lỗi khi gửi đánh giá!");
    }
  };

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
                      <td>{getPaymentMethodName(order.payment_method)}</td>
                      <td>
                        <div className={`badge ${getStatusColor(order.status)} gap-1`}>
                          {getStatusName(order.status)}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => handleViewOrderDetails(order.id)}
                          >
                            <FontAwesomeIcon icon={faEye} /> Xem
                          </button>
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

        {/* Modal Chi tiết đơn hàng */}
        {orders.map((order) => (
          <dialog key={order.id} id={`order_detail_modal_${order.id}`} className="modal">
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-lg border-b pb-2">Chi tiết đơn hàng #{order.id}</h3>

              <div className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold">Thông tin đơn hàng</h4>
                    <div className="mt-2">
                      <p><span className="font-medium">Mã đơn hàng:</span> #{order.id}</p>
                      <p><span className="font-medium">Ngày đặt:</span> {formatDate(order.created_at)}</p>
                      <p>
                        <span className="font-medium">Trạng thái:</span>
                        <span className={`badge ${getStatusColor(order.status)} ml-2`}>
                          {getStatusName(order.status)}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Phương thức thanh toán:</span> {getPaymentMethodName(order.payment_method)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold border-b pb-2">Sản phẩm đã đặt</h4>

                  {loadingDetails ? (
                    <div className="flex justify-center py-4">
                      <span className="loading loading-spinner loading-md"></span>
                    </div>
                  ) : orderDetails.length === 0 ? (
                    <div className="text-center py-4">
                      <p>Không có thông tin sản phẩm</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto mt-2">
                      <table className="table table-compact w-full">
                        <thead>
                          <tr>
                            <th>Sản phẩm</th>
                            <th>Phiên bản</th>
                            <th className="text-right">Số lượng</th>
                            <th className="text-right">Đơn giá</th>
                            <th className="text-right">Thành tiền</th>
                            {order.status === 'completed' && <th>Đánh giá</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {orderDetails.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <Link 
                                  to={`/san-pham/${item.product.id}`} 
                                  className="flex items-center gap-2 hover:text-primary"
                                >
                                  <div className="avatar">
                                    <div className="w-12 h-12 rounded">
                                      {item.product.product_images?.length > 0 ? (
                                        <img 
                                          src={item.product.product_images[0]?.image_url} 
                                          alt={item.product.name}
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100.png?text=No+Image';
                                          }}
                                        />
                                      ) : (
                                        <div className="bg-base-300 w-full h-full flex items-center justify-center">
                                          <span className="text-xs">No image</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <span className="font-medium">{item.product.name}</span>
                                </Link>
                              </td>
                              <td>
                                <span className="badge badge-outline">
                                  {item.variant.sku || `#${item.variant.id}`}
                                </span>
                              </td>
                              <td className="text-right">{item.amount}</td>
                              <td className="text-right">{formatCurrency(item.price)}</td>
                              <td className="text-right">{formatCurrency(item.price * item.amount)}</td>
                              {order.status === 'completed' && (
                                <td>
                                  <div className="flex flex-col gap-1">
                                    <button 
                                      className="btn btn-xs btn-secondary"
                                      onClick={() => handleOpenReviewModal(item)}
                                    >
                                      <FontAwesomeIcon icon={faComment} className="mr-1" />
                                      Đánh giá
                                    </button>
                                    {/* Hiển thị số lượng sản phẩm đã nhóm (nếu > 1) */}
                                    {item.originalItems && item.originalItems.length > 1 && (
                                      <span className="text-xs text-gray-500 text-center">
                                        ({item.originalItems.length} sản phẩm)
                                      </span>
                                    )}
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={order.status === 'completed' ? 5 : 4} className="text-right font-semibold">Tổng cộng:</td>
                            <td className="text-right font-semibold">
                              {formatCurrency(orderDetails.reduce((sum, item) => sum + item.price * item.amount, 0))}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-action">
                <form method="dialog">
                  <button className="btn btn-primary">Đóng</button>
                </form>
              </div>
            </div>
          </dialog>
        ))}

        {/* Modal đánh giá sản phẩm */}
        <dialog id="review_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg border-b pb-2">Đánh giá sản phẩm</h3>
            
            {reviewItem && (
              <form onSubmit={handleSubmitReview} className="py-4">
                <div className="mb-4 flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-16 h-16 rounded">
                      {reviewItem.product.product_images?.length > 0 ? (
                        <img 
                          src={reviewItem.product.product_images[0]?.image_url} 
                          alt={reviewItem.product.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100.png?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="bg-base-300 w-full h-full flex items-center justify-center">
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">{reviewItem.product.name}</h4>
                    <p className="text-sm">
                      <span className="badge badge-outline badge-sm">
                        {reviewItem.variant.sku || `#${reviewItem.variant.id}`}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Đánh giá</span>
                  </label>
                  <div className="rating rating-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="flex items-center mr-2">
                        <input
                          type="radio"
                          name="rating"
                          value={star}
                          className="hidden"
                          id={`star-${star}`}
                          checked={reviewFormData.rating === star}
                          onChange={handleReviewChange}
                        />
                        <label 
                          htmlFor={`star-${star}`}
                          className={`cursor-pointer ${reviewFormData.rating >= star ? 'text-warning' : 'text-gray-300'}`}
                          onClick={() => setReviewFormData(prev => ({ ...prev, rating: star }))}
                        >
                          <FontAwesomeIcon icon={faStar} size="lg" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Nội dung đánh giá</span>
                  </label>
                  <textarea 
                    name="comment"
                    value={reviewFormData.comment}
                    onChange={handleReviewChange}
                    className="textarea textarea-bordered h-32" 
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    required
                  ></textarea>
                </div>
                
                <div className="modal-action">
                  <button type="button" className="btn btn-ghost" onClick={handleCloseReviewModal}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Gửi đánh giá
                  </button>
                </div>
              </form>
            )}
          </div>
        </dialog>
      </div>
    </div>
  );
}
