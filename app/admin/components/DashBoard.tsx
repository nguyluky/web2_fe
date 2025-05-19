import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchWithToken from '~/utils/fechWithToken';
import LineChartComponent from './LineChartComponent';
import PieChartComponent from './PieChartComponent';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [statusStats, setStatusStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [sumorder, setSumorder] = useState([]);
  const [sumorder1, setSumorder1] = useState([]);
  const [customers, setAccount] = useState([]);

  useEffect(() => {
    const fetchSumOrder = async () => {
      try {
        const response = await fetchWithToken('http://127.0.0.1:8000/api/admin/orders/current-month');
        if (!response.ok) throw new Error('Failed to fetch sum order');
        const data = await response.json();
        setSumorder(data);
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa:', data);
        
      } catch (error) {
        console.error('Error fetching sum order:', error);
      }
    }
    const fetchSumOrder1 = async () => {
      try {
        const response1 = await fetchWithToken('http://127.0.0.1:8000/api/admin/orders/previous-month');
        if (!response1.ok) throw new Error('Failed to fetch sum order');
        const data1 = await response1.json();
        setSumorder1(data1);
        console.log('bbbbbbbbbbbbbbbbbbbbbbbb:', data1);
        
      } catch (error) {
        console.error('Error fetching sum order:', error);
      }
    }
    fetchSumOrder();
    fetchSumOrder1();
  }
  , []);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetchWithToken('http://127.0.0.1:8000/api/admin/aaccounts');
        if (!response.ok) throw new Error('Failed to fetch sum order');
        const datax = await response.json();
        setAccount(datax.data.data);
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa:', datax.data.data);
      } catch (error) {
        console.error('Error fetching sum order:', error);
      }
    }
    fetchAccount();
  }
  , []);



  // Fetch Top Products
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const topProductRes = await fetchWithToken('http://127.0.0.1:8000/api/admin/products/top');
        const topProductData = await topProductRes.json();
        setTopProducts(topProductData || []);
        console.log('Top Products:', topProductData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu top products:', error.message);
        toast.error('Lỗi khi lấy dữ liệu top products: ' + error.message, { autoClose: 3000 });
      }
    };

    fetchTopProducts();
  }, []);

  // Fetch Order Details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderDetailsRes = await fetchWithToken('http://127.0.0.1:8000/api/admin/OrderDetails');
        const orderDetailsData = await orderDetailsRes.json();
        setOrderDetails(orderDetailsData.data.data || []);
        console.log('Order Details:', orderDetailsData.data.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu order details:', error.message);
        toast.error('Lỗi khi lấy dữ liệu order details: ' + error.message, { autoClose: 3000 });
      }
    };

    fetchOrderDetails();
  }, []);

  // Fetch Product Variants
  useEffect(() => {
    const fetchProductVariants = async () => {
      try {
        const productVarRes = await fetchWithToken('http://127.0.0.1:8000/api/admin/product-variants');
        if (!productVarRes.ok) throw new Error('Không thể lấy danh sách product-variants');
        const productVarData = await productVarRes.json();
        setProductVariants(productVarData.data || []);
        console.log('Product Variants:', productVarData.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu product variants:', error.message);
        toast.error('Lỗi khi lấy dữ liệu product variants: ' + error.message, { autoClose: 3000 });
      }
    };

    fetchProductVariants();
  }, []);

  // Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await fetchWithToken('http://127.0.0.1:8000/api/admin/tk_orders/stats');
        if (!statsRes.ok) throw new Error('Không thể lấy dữ liệu thống kê');
        const statsData = await statsRes.json();
        setStats(statsData.data || []);
        console.log('Stats:', statsData.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
        toast.error('Lỗi khi lấy dữ liệu thống kê: ' + error.message);
      }
    };

    const fetchStatusStats = async () => {
      try {
        const statusRes = await fetchWithToken('http://127.0.0.1:8000/api/admin/tk_orders/status-stats');
        if (!statusRes.ok) throw new Error('Không thể lấy dữ liệu trạng thái');
        const statusData = await statusRes.json();
        setStatusStats(statusData.data || []);
        console.log('Status Stats:', statusData.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu trạng thái:', error);
        toast.error('Lỗi khi lấy dữ liệu trạng thái: ' + error.message);
      }
    };

    fetchStats();
    fetchStatusStats();
  }, []);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchWithToken('http://127.0.0.1:8000/api/admin/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        console.log('Orders API Response:', data);
        const sortedOrders = Array.isArray(data.data.data)
          ? data.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          : [];
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  // Calculate total amount for an order
  const calculateOrderTotal = (orderId) => {
    const details = orderDetails.filter((detail) => detail.order_id === orderId);
    return details.reduce((sum, item) => {
      const variant = productVariants.find((v) => v.id === item.product_variant_id);
      const price = variant ? variant.price : 0;
      return sum + price ;
    }, 0);
  };

const sumCalculateAllOrdersTotal = () => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return orderDetails.reduce((total, item) => {
    const order = orders.find((o) => o.id === item.order_id);

    if (
      order &&
      order.status === "completed"
    ) {
      const createdAt = new Date(order.created_at);
      if (createdAt >= startOfCurrentMonth && createdAt <= endOfCurrentMonth) {
        const variant = productVariants.find((v) => v.id === item.product_variant_id);
        const price = variant ? variant.price : 0;
        return total + price;
      }
    }

    return total;
  }, 0);
};

const sumCalculateAllOrdersTotalTruoc = () => {
  const now = new Date();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  return orderDetails.reduce((total, item) => {
    const order = orders.find((o) => o.id === item.order_id);

    if (
      order &&
      order.status === "completed"
    ) {
      const createdAt = new Date(order.created_at);
      if (createdAt >= startOfLastMonth && createdAt <= endOfLastMonth) {
        const variant = productVariants.find((v) => v.id === item.product_variant_id);
        const price = variant ? variant.price : 0;
        return total + price;
      }
    }

    return total;
  }, 0);
};
const currentTotal = sumCalculateAllOrdersTotal();
const lastMonthTotal = sumCalculateAllOrdersTotalTruoc();

const percentageChange =
  lastMonthTotal === 0
    ? 100 // hoặc 0, tùy bạn muốn xử lý chia cho 0 thế nào
    : ((currentTotal - lastMonthTotal) / lastMonthTotal) * 100;

    const countCompletedOrdersCurrentMonth = () => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return orders.filter((order) => {
    const createdAt = new Date(order.created_at);
    return (
      order.status === 'completed' &&
      createdAt >= startOfCurrentMonth &&
      createdAt <= endOfCurrentMonth
    );
  }).length;
};

const countCompletedOrdersLastMonth = () => {
  const now = new Date();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  return orders.filter((order) => {
    const createdAt = new Date(order.created_at);
    return (
      order.status === 'completed' &&
      createdAt >= startOfLastMonth &&
      createdAt <= endOfLastMonth
    );
  }).length;
};

const currentMonthOrderCount = countCompletedOrdersCurrentMonth();
const lastMonthOrderCount = countCompletedOrdersLastMonth();
const orderChangePercentage = lastMonthOrderCount === 0
  ? 100
  : ((currentMonthOrderCount - lastMonthOrderCount) / lastMonthOrderCount) * 100;

  // Tính toán số lượng khách hàng mới trong tháng hiện tại và tháng trước
const countNewCustomersCurrentMonth = () => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return customers.filter((customer) => {
    const createdAt = new Date(customer.created);
    return (
      customer.rule === 4 &&
      createdAt >= startOfCurrentMonth &&
      createdAt <= endOfCurrentMonth
    );
  }).length;
};

const countNewCustomersLastMonth = () => {
  const now = new Date();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  return customers.filter((customer) => {
    const createdAt = new Date(customer.created);
    return (
      customer.rule === 4 &&
      createdAt >= startOfLastMonth &&
      createdAt <= endOfLastMonth
    );
  }).length;
};


const currentMonthCustomerCount = countNewCustomersCurrentMonth();
const lastMonthCustomerCount = countNewCustomersLastMonth();
const customerChangePercentage = lastMonthCustomerCount === 0
  ? 100
  : ((currentMonthCustomerCount - lastMonthCustomerCount) / lastMonthCustomerCount) * 100;

// Tính toán số lượng sản phẩm đã bán trong tháng hiện tại và tháng trước
const countNewProductsCurrentMonth = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return productVariants.filter((v) => {
    const createdAt = new Date(v.created_at);
    return createdAt >= start && createdAt <= end;
  }).length;
};

const countNewProductsLastMonth = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  return productVariants.filter((v) => {
    const createdAt = new Date(v.created_at);
    return createdAt >= start && createdAt <= end;
  }).length;
};

const currentMonthProducts = countNewProductsCurrentMonth();
const lastMonthProducts = countNewProductsLastMonth();
const percentProductChange = lastMonthProducts === 0
  ? 100
  : ((currentMonthProducts - lastMonthProducts) / lastMonthProducts) * 100;





  const dataKeys = [
    { key: 'năm này', color: '#8884d8' },
    { key: 'năm trước', color: '#82ca9d' },
  ];

  const xAxisKey = 'name';

  return (
    <div className="overflow-x-hidden min-h-screen bg-gray-100">
      <ToastContainer />
      {/* Header */}
      <header className="">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen overflow-x-hidden px-4 py-6">
        {/* Overview Section */}
               <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-white text-gray-600 shadow-md p-4">
            <h2 className="text-lg font-semibold">Doanh thu</h2>
<p className="text-2xl font-bold break-words">
  {sumCalculateAllOrdersTotal().toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
</p>
<p className={`mt-2 ${percentageChange >= 0 ? 'text-green-700' : 'text-red-700'}`}>
  {percentageChange >= 0 ? '+' : ''}
  {percentageChange.toFixed(2)}%
</p>
            <span className="m-2">So với tháng trước</span>
          </div>
          <div className="card bg-white text-gray-600 shadow-md p-4">
  <h2 className="text-lg font-semibold">Khách hàng</h2>
  <p className="text-2xl font-bold">{currentMonthCustomerCount}</p>
  <p className={`mt-2 ${customerChangePercentage >= 0 ? 'text-green-700' : 'text-red-700'}`}>
    {customerChangePercentage >= 0 ? '+' : ''}
    {customerChangePercentage.toFixed(2)}%
  </p>
  <span className="m-2">So với tháng trước</span>
</div>

<div className="card bg-white text-gray-600 shadow-md p-4">
  <h2 className="text-lg font-semibold">Sản phẩm</h2>
  <p className="text-2xl font-bold">{currentMonthProducts}</p>
  <p className={`${percentProductChange >= 0 ? 'text-green-700' : 'text-red-700'} mt-2`}>
    {percentProductChange >= 0 ? '+' : ''}
    {percentProductChange.toFixed(1)}%
  </p>
  <span className="m-2">So với tháng trước</span>
</div>

<div className="card bg-white text-gray-600 shadow-md p-4">
  <h2 className="text-lg font-semibold">Đơn hàng</h2>
  <p className="text-2xl font-bold">{currentMonthOrderCount}</p>
  <p className={`mt-2 ${orderChangePercentage >= 0 ? 'text-green-700' : 'text-red-700'}`}>
    {orderChangePercentage >= 0 ? '+' : ''}
    {orderChangePercentage.toFixed(2)}%
  </p>
  <span className="m-2">So với tháng trước</span>
</div>

        </section>

        <div className="grid gap-10 grid-cols-1 lg:grid-cols-2">
          <div className="chart-container w-full rounded-lg bg-white text-gray-600 shadow-md p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Biểu đồ doanh thu</h2>
            <LineChartComponent data={stats} dataKeys={dataKeys} xAxisKey={xAxisKey} />
          </div>

          <div className="chart-container w-full rounded-lg bg-white text-gray-600 shadow-md p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Trạng thái đơn hàng</h2>
            <PieChartComponent data={statusStats} />
          </div>
        </div>

        <div className="grid gap-10 grid-cols-1 lg:grid-cols-2 mt-8">
          {/* Recent Orders Section */}
          <section className="rounded-lg bg-white text-gray-600 shadow-md p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Đơn hàng gần đây</h2>
            <div className="overflow-x-auto">
              <table className="table text-lg w-full">
                <thead className="text-lg">
                  <tr>
                    <th>Mã đơn #</th>
                    <th>Tên khách hàng</th>
                    <th>Trạng thái</th>
                    <th>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(orders) &&
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.profile?.fullname || 'Unknown'}</td>
                        <td>
                          {order.status === 'completed' && <span className="text-green-500">Đã thanh toán</span>}
                          {order.status === 'processing' && <span className="text-blue-500">Đang xử lý</span>}
                          {order.status === 'pending' && <span className="text-yellow-500">Đang chờ</span>}
                          {order.status === 'cancelled' && <span className="text-red-500">Đã hủy</span>}
                        </td>
                        <td>
                          {calculateOrderTotal(order.id).toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <button className="flex items-center justify-center border border-gray-300 w-full px-4 py-2 text-base bg-white-500 text-gray-500 rounded hover:bg-gray-200 hover:text-black">
                <span className="font-semibold">Xem tất cả đơn hàng</span>
              </button>
            </div>
          </section>
          {/* Top Products Section */}
          <section className="rounded-lg bg-white text-gray-600 shadow-md p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Sản phẩm bán chạy</h2>
            <p className="text-gray-500 mb-3">Top 5 sản phẩm bán chạy của tháng</p>
            <div className="overflow-x-auto">
              <table className="table text-lg w-full">
                <thead>
                  <tr className="text-lg">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Tên sản phẩm</th>
                    <th className="px-4 py-2 text-center">Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((topProduct) => (
                    <tr key={topProduct.id}>
                      <td>{topProduct.id}</td>
                      <td>{topProduct.name}</td>
                      <td className="text-center">{topProduct.total_sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;