import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDeleteLeft,
  faEdit,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const WarrantyManagement = () => {
  const users = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'abc@gmail.com',
      status: 'hd',
      role: 'Admin',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      phone: '0912345678',
      email: 'abc@gmail.com',
      status: 'an',
      role: 'User',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      phone: '0923456789',
      email: 'abc@gmail.com',
      status: 'hd',
      role: 'User',
    },
  ];

  const suppliers = [
    {
      id: 1,
      name: 'Công ty TNHH ABC',
      tax: '0101234567',
      phone: '0901234567',
      email: 'contact@abc.com',
      status: 'hd',
      create_at: '2023-04-01',
    },
    {
      id: 2,
      name: 'Công ty CP XYZ',
      tax: '0202345678',
      phone: '0912345678',
      email: 'info@xyz.com',
      status: 'hd',
      create_at: '2023-04-05',
    },
    {
      id: 3,
      name: 'Công ty TNHH DEF',
      tax: '0303456789',
      phone: '0923456789',
      email: 'support@def.com',
      status: 'an',
      create_at: '2023-03-28',
    },
    {
      id: 4,
      name: 'Công ty CP LMN',
      tax: '0404567890',
      phone: '0934567890',
      email: 'sales@lmn.com',
      status: 'hd',
      create_at: '2023-04-10',
    },
    {
      id: 5,
      name: 'Công ty TNHH PQR',
      tax: '0505678901',
      phone: '0945678901',
      email: 'info@pqr.com',
      status: 'an',
      create_at: '2023-03-15',
    },
  ];

  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB',
      category: 'Điện thoại',
      price: '32.990.000 ₫',
      stock: 45,
      status: 'hd',
      creationDate: '15/09/2023',
    },
    {
      id: 2,
      name: 'Samsung Galaxy Z Fold 5',
      category: 'Điện thoại',
      price: '42.990.000 ₫',
      stock: 20,
      status: 'an',
      creationDate: '10/08/2023',
    },
    {
      id: 3,
      name: 'MacBook Pro 14-inch M2',
      category: 'Laptop',
      price: '52.990.000 ₫',
      stock: 10,
      status: 'an',
      creationDate: '01/11/2023',
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5',
      category: 'Tai nghe',
      price: '7.990.000 ₫',
      stock: 35,
      status: 'hd',
      creationDate: '20/09/2023',
    },
    {
      id: 5,
      name: 'iPad Air 2023 64GB',
      category: 'Máy tính bảng',
      price: '17.990.000 ₫',
      stock: 25,
      status: 'hd',
      creationDate: '05/10/2023',
    },
  ];

  const warranties = [
    {
      id: 1,
      userid: users[0].id,
      supplierid: suppliers[0].id,
      productid: products[0].id,
      issue_date: '2023-03-01',
      expiration_date: '2024-03-01',
      status: 'hd',
      note: 'Bảo hành được kích hoạt bởi khách hàng.',
    },
    {
      id: 2,
      userid: users[1].id,
      supplierid: suppliers[1].id,
      productid: products[1].id,
      issue_date: '2023-05-15',
      expiration_date: '2024-05-15',
      status: 'an',
      note: 'Bảo hành hết hạn và không được gia hạn.',
    },
    {
      id: 3,
      userid: users[2].id,
      supplierid: suppliers[2].id,
      productid: products[2].id,
      issue_date: 'Chưa có',
      expiration_date: '2024-07-20',
      status: 'hd',
      note: 'Bảo hành được gia hạn thêm thời gian.',
    },
    {
      id: 4,
      userid: users[0].id,
      supplierid: suppliers[3].id,
      productid: products[3].id,
      issue_date: '2022-12-10',
      expiration_date: '2023-12-10',
      status: 'an',
      note: 'Hủy bảo hành.',
    },
    {
      id: 5,
      userid: users[1].id,
      supplierid: suppliers[4].id,
      productid: products[4].id,
      issue_date: '2023-01-25',
      expiration_date: '2024-01-25',
      status: 'an',
      note: 'Bảo hành hoạt động mà không có vấn đề gì.',
    },
  ];

  return (
    <div className="max-w-screen overflow-x-hidden px-4 py-6">
      {/* Header */}
      <header className="py-10 mb-6">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Bảo hành</h1>
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
          {' '}
          <thead className="text-lg">
            <tr>
              <th> ID</th>
              <th>Tên khách hàng</th>
              <th>Tên nhà cung cấp</th>
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
                  {users.find((user) => user.id === warranty.userid)?.name || 'Không tìm thấy'}
                </td>
                <td>
                  {suppliers.find((supplier) => supplier.id === warranty.supplierid)?.name ||
                    'Không tìm thấy'}
                </td>
                <td>
                  {products.find((product) => product.id === warranty.productid)?.name ||
                    'Không tìm thấy'}
                </td>
                <td>{warranty.issue_date}</td>
                <td>{warranty.expiration_date}</td>
                <td>{warranty.note}</td>
                <td>
                  <span
                    className={`inline-block rounded-xl border border-gray-300 px-1 py-2 text-base min-w-[100px] text-center ${
                      warranty.status === 'hd' ? 'text-green-700' : 'text-red-500'
                    }`}
                  >
                    {warranty.status === 'hd' ? 'Hoạt động' : 'Ẩn'}
                  </span>
                </td>
                <td>
                  <div className="flex justify-start">
                    <button className="flex w-12 h-12 px-6 py-2 text-base bg-white-500 text-gray-500 hover:text-black">
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

export default WarrantyManagement;
