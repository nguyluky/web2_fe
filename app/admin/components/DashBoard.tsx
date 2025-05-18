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

  useEffect(() => {
    const fetchWithTokenTopProducts = async () => {
      try {
        const topProductRes = await fetchWithToken('http://127.0.0.1:8000/api/admin/products/top');
        const topProductData = await topProductRes.json();
        setTopProducts(topProductData || []);
        console.log(topProductData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        toast.error('Lỗi khi lấy dữ liệu: ' + error.message, { autoClose: 3000 });
      };
    };
    fetchWithTokenTopProducts();
  }, []);


  const fetchWithTokenStats = async () => {
    try {
      const statsRes = await fetchWithToken('http://127.0.0.1:8000/api/admin/tk_orders/stats');
      if (!statsRes.ok) throw new Error('Không thể lấy dữ liệu thống kê');
      const statsData = await statsRes.json();
      setStats(statsData.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu thống kê:', error);
      toast.error('Lỗi khi lấy dữ liệu thống kê: ' + error.message);
    }
  };

  const fetchWithTokenStatusStats = async () => {
    try {
      const statusRes = await fetchWithToken('http://127.0.0.1:8000/api/admin/tk_orders/status-stats');
      if (!statusRes.ok) throw new Error('Không thể lấy dữ liệu trạng thái');
      const statusData = await statusRes.json();
      setStatusStats(statusData.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu trạng thái:', error);
      toast.error('Lỗi khi lấy dữ liệu trạng thái: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchWithToken('http://127.0.0.1:8000/api/admin/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        console.log('Orders API Response:', data);
        const sortedOrders = Array.isArray(data.data.data) ? data.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/admin/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        console.log('Orders API Response:', data);
        const sortedOrders = Array.isArray(data.data.data) ? data.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) : [];
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    fetchWithTokenStats();
    fetchWithTokenStatusStats(); // Uncomment when backend endpoint is ready
  }, []);

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
            <p className="text-2xl font-bold break-words">1,235,000,000₫</p>
            <p className="text-green-700 mt-2">+12.5%</p>
            <span className="m-2">So với tháng trước</span>
          </div>
          <div className="card bg-white text-gray-600 shadow-md p-4">
            <h2 className="text-lg font-semibold">Khách hàng</h2>
            <p className="text-2xl font-bold">+60</p>
            <p className="text-green-700 mt-2">+12.5%</p>
            <span className="m-2">So với tháng trước</span>
          </div>
          <div className="card bg-white text-gray-600 shadow-md p-4">
            <h2 className="text-lg font-semibold">Sản phẩm</h2>
            <p className="text-2xl font-bold">160</p>
            <p className="text-green-700 mt-2">+10 sản phẩm</p>
            <span className="m-2">Được thêm mới</span>
          </div>
          <div className="card bg-white text-gray-600 shadow-md p-4">
            <h2 className="text-lg font-semibold">Khách hàng</h2>
            <p className="text-2xl font-bold">+150</p>
            <p className="text-green-700 mt-2">+12.5%</p>
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
                  {/* <tr>
                    <td>#ORD-7352</td>
                    <td>Nguyễn Văn A</td>
                    <td className="text-blue-500">Đang xử lý</td>
                    <td>1,250,000₫</td>
                  </tr>
                  <tr>
                    <td>#ORD-7351</td>
                    <td>Trần Thị B</td>
                    <td className="text-green-500">Đã thanh toán</td>
                    <td>3,490,000₫</td>
                  </tr>
                  <tr>
                    <td>#ORD-7350</td>
                    <td>Lê Văn C</td>
                    <td className="text-yellow-500">Đã giao hàng</td>
                    <td>5,990,000₫</td>
                  </tr>
                  <tr>
                    <td>#ORD-7349</td>
                    <td>Phạm Thị D</td>
                    <td className="text-red-500">Đã hủy</td>
                    <td>2,490,000₫</td>
                  </tr> */}
                  {Array.isArray(orders) && orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.profile?.fullname || 'Unknown'}</td>
                      <td>
                        {order.status === 'completed' && <span className="text-green-500">Đã thanh toán</span>}
                        {order.status === 'processing' && <span className="text-blue-500">Đang xử lý</span>}
                        {order.status === 'pending' && <span className="text-yellow-500">Đang chờ</span>}
                        {order.status === 'cancelled' && <span className="text-red-500">Đã hủy</span>}
                      </td>                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
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