//@ts-nocheck
import React from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDeleteLeft,
  faEdit,
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

const OrderManagement = () => {
const [orders, setOrders] = useState([]);
const [users, setUsers] = useState([]);

  
      useEffect(() => {
        // Simulate fetching data from an API
        const fetchOrders = async () => {
            const response = await fetch('http://127.0.0.1:8000/api/admin/orders'); // Replace with your API endpoint
            const data = await response.json();
            setOrders(data.data.data);
            console.log("aaaaaaa",data.data.data);

            const userResponse = await fetch('http://127.0.0.1:8000/api/admin/users');
            const userData = await userResponse.json();
            setUsers(userData.data.data);
            console.log("user",userData.data.data); 
        }
  
        fetchOrders();
      }, []);

  return (
    <div className="overflow-x-hidden min-h-screen bg-white p-4">
      {/* Header */}
      <header className="py-10 mb-6">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Đơn hàng</h1>
        </div>
      </header>

      {/* Search Bar */}
      <div className="flex flex-wrap justify-between mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Tìm kiếm */}
          <div className="flex flex-col mb-4 mr-8 md:mb-0">
            <span className="text-xl mb-2">Tìm kiếm</span>
            <input
              id="searchName"
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng"
              className="text-xl w-[16em] p-2 border border-gray-300 rounded-md box-border"
            />
          </div>
          <div className="flex flex-col mb-4 mr-8 md:mb-0 ">
            <span className="text-xl mb-2">Ngày bắt đầu</span>
            <input
              id="searchDateStart"
              type="date"
              className="text-xl w-[12em] p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col mb-4 mr-8 md:mb-0">
            <span className="text-xl mb-2">Ngày kết thúc</span>
            <input
              id="searchDateEnd"
              type="date"
              className="text-xl w-[12em] p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Trạng thái */}
          <div className="flex flex-col mb-4 md:mb-0">
            <span className="text-xl mb-2">Trạng thái</span>
            <select
              id="statusFilter"
              className="text-xl w-[10em] p-2 border border-gray-300 rounded-md"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="hd">Hoạt động</option>
              <option value="an">Ẩn</option>
            </select>
          </div>
        </div>

        {/* Nút Tìm kiếm */}
        <div className="flex items-end mt-2 mb-4 mr-3 md:mb-0">
          <button className="px-4 py-2 rounded-md bg-gray-500 text-white text-xl hover:bg-gray-700 shadow">
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Bảng */}

      <div className="grid grid-cols-1 overflow-x-auto border border-gray-300 rounded-lg shadow-md">
        <table className="table text-lg w-full">
          <thead className="text-lg">
            <tr>
              <th> ID</th>
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
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-300">
                <td>{order.id}</td>
                <td>
                  {users.find((user) => user.id === order.account_id)?.fullname || 'Không tìm thấy'}
                </td>
                <td>
                  {users.find((user) => user.id === order.account_id)?.phone_number || 'Không tìm thấy'}
                </td>
                <td>
                  {users.find((user) => user.id === order.account_id)?.email || 'Không tìm thấy'}
                </td>
                <td>{order.created_at}</td>
                <td>{order.payment_method}</td>
                <td>
                  <span
                    className={`border border-gray-300 rounded-lg px-2 py-1 ${
                      order.status === 'completed'
                        ? 'text-green-700'
                        : order.status === 'pending'
                        ? 'text-blue-500'
                        : 'text-red-500'
                    }`}
                  >
                    {order.status === 'completed'
                      ? 'Hoàn thành'
                      : order.status === 'pending'
                      ? 'Đang xử lý'
                      : 'Hủy'}
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
        <button className="btn rounded-lg ml-3">
          <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
        </button>
        <button className="px-4 py-4 mx-2 badge text-gray-800 rounded-md hover:bg-gray-400 mt-1">
          <span className="text-lg">1</span>
        </button>
        <button className="btn rounded-lg mr-3">
          <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default OrderManagement;
