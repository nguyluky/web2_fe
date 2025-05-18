// @ts-nocheck
import { faChevronDown, faChevronUp, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchWithToken from '~/utils/fechWithToken';

const TopCustomersStatisticsPage = () => {
  const [customers, setCustomers] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedOrders, setExpandedOrders] = useState({});
  const [orders, setOrders] = useState({}); // Store as { [order_id]: details }

  // fetchWithToken customers
  useEffect(() => {
    const fetchWithTokenData = async () => {
      if (!startDate || !endDate) {
        toast.error('Vui lòng nhập đầy đủ khoảng thời gian', { autoClose: 3000 });
        return;
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        toast.error('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu', { autoClose: 3000 });
        return;
      }

      try {
        const params = new URLSearchParams({
          start_date: startDate,
          end_date: endDate,
          sort: sortOrder,
        }).toString();
        console.log('fetchWithTokening customers with params:', params);
        const response = await fetchWithToken(`http://127.0.0.1:8000/api/admin/top-customers?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Không thể lấy dữ liệu thống kê (Mã trạng thái: ${response.status}, Chi tiết: ${errorText})`);
        }
        const data = await response.json();
        console.log('API Response (top-customers):', data);

        // // Check if data.data.data exists and is an array
        // if (!data.data || !data.data.data || !Array.isArray(data.data.data)) {
        //   console.warn('No valid customer data found:', data);
        //   setCustomers([]);
        //   toast.warn(data.message || 'Không tìm thấy khách hàng trong khoảng thời gian này', { autoClose: 3000 });
        //   return;
        // }

        setCustomers(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        toast.error('Lỗi khi lấy dữ liệu thống kê: ' + error.message, { autoClose: 3000 });
        setCustomers([]);
      }
    };
    fetchWithTokenData();
  }, [startDate, endDate, sortOrder]);

  // fetchWithToken order details for a specific order_id
  const fetchWithTokenOrderDetails = async (orderId) => {
    if (orders[orderId]) return; // Skip if already fetchWithTokened
    try {
      const response = await fetchWithToken(`http://127.0.0.1:8000/api/admin/order-details?order_id=${orderId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể lấy chi tiết đơn hàng #${orderId}: ${errorText}`);
      }
      const data = await response.json();
      console.log(`Order details for #${orderId}:`, data);
      setOrders((prev) => ({
        ...prev,
        [orderId]: data.data || [],
      }));
    } catch (error) {
      console.error(`Error fetchWithTokening details for order ${orderId}:`, error.message);
      toast.error(`Lỗi khi lấy chi tiết đơn hàng #${orderId}: ${error.message}`, { autoClose: 3000 });
      setOrders((prev) => ({
        ...prev,
        [orderId]: [],
      }));
    }
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const getSortIcon = () => {
    if (sortOrder === 'desc') return faSortDown;
    if (sortOrder === 'asc') return faSortUp;
    return faSort;
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
    if (!orders[orderId]) {
      fetchWithTokenOrderDetails(orderId); // fetchWithToken details when expanding
    }
  };

  return (
    <div className="max-w-screen overflow-x-hidden px-4 py-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6 text-center">Thống kê 5 khách hàng mua hàng cao nhất</h1>

      <div className="mb-4">
        <label className="mr-2">Từ ngày:</label>
        <input
          type="date"
          value={startDate || ''}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <label className="ml-4 mr-2">Đến ngày:</label>
        <input
          type="date"
          value={endDate || ''}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Tên khách hàng</th>
            <th className="border p-2">
              Tổng tiền mua
              <button onClick={handleSort} className="ml-2">
                <FontAwesomeIcon icon={getSortIcon()} />
              </button>
            </th>
            <th className="border p-2">Danh sách đơn hàng</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="3" className="border p-2 text-center">
                Không có dữ liệu khách hàng
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <React.Fragment key={customer.customer_id}>
                <tr className="border">
                  <td className="border p-2">{customer.customer_name}</td>
                  <td className="border p-2">{customer.total_purchase.toLocaleString('vi-VN')} VND</td>
                  <td className="border p-2">
                    {customer.orders.length === 0 ? (
                      <span>Không có đơn hàng</span>
                    ) : (
                      <ul className="list-disc pl-5">
                        {customer.orders.map((order) => (
                          <li key={order.order_id} className="flex items-center">
                            <span>
                              Đơn hàng #{order.order_id} ({new Date(order.created_at).toLocaleDateString('vi-VN')}):{' '}
                              {order.order_total.toLocaleString('vi-VN')} VND
                            </span>
                            <button
                              onClick={() => toggleOrderDetails(order.order_id)}
                              className="ml-2 text-blue-500 hover:underline text-sm"
                            >
                              <FontAwesomeIcon icon={expandedOrders[order.order_id] ? faChevronUp : faChevronDown} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
                {customer.orders.map((order) =>
                  expandedOrders[order.order_id] ? (
                    <tr key={`details-${order.order_id}`} className="border bg-gray-50">
                      <td colSpan="3" className="border p-2">
                        <div className="ml-8">
                          <h4 className="font-semibold">Chi tiết đơn hàng #{order.order_id}</h4>
                          {!orders[order.order_id] || orders[order.order_id].length === 0 ? (
                            <p>Không có chi tiết đơn hàng</p>
                          ) : (
                            <table className="w-full border-collapse border mt-2">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="border p-2">Tên sản phẩm</th>
                                  <th className="border p-2">Giá</th>
                                  <th className="border p-2">Thuộc tính</th>
                                </tr>
                              </thead>
                              <tbody>
                                {orders[order.order_id].map((detail) => (
                                  <tr key={detail.detail_id} className="border">
                                    <td className="border p-2">{detail.product_name}</td>
                                    <td className="border p-2">{detail.price.toLocaleString('vi-VN')} VND</td>
                                    <td className="border p-2">
                                        {(() => {
                                          let attrs = detail.attributes;

                                          try {
                                            // Nếu là mảng ký tự hoặc string JSON
                                            if (typeof attrs === 'string') {
                                              // Có thể là JSON string
                                              attrs = JSON.parse(attrs);
                                            }
                                            // Nếu là mảng ký tự thì ghép lại và parse
                                            if (Array.isArray(attrs)) {
                                              attrs = JSON.parse(attrs.join(''));
                                            }

                                            // Nếu vẫn là object sau xử lý
                                            if (attrs && typeof attrs === 'object') {
                                              return (
                                                <ul className="list-disc list-inside">
                                                  {Object.entries(attrs).map(([key, value]) => (
                                                    <li key={key}>
                                                      <strong>{key}:</strong> {value}
                                                    </li>
                                                  ))}
                                                </ul>
                                              );
                                            } else {
                                              return 'Không có thuộc tính';
                                            }
                                          } catch (error) {
                                            console.error('Lỗi khi xử lý attributes:', error);
                                            return 'Thuộc tính không hợp lệ';
                                          }
                                        })()}
                                      </td>


                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : null
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TopCustomersStatisticsPage;