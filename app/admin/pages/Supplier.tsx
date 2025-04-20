import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDeleteLeft,
  faEdit,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const SuppplierManagement = () => {
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

  return (
    <div className="max-w-screen overflow-x-hidden px-4 py-6">
      {/* Header */}
      <header className="py-10 mb-6">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Nhà cung cấp</h1>
          <button className="px-4 py-2 text-base bg-gray-500 rounded-lg text-white hover:bg-gray-700">
            Thêm nhà cung cấp +
          </button>
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
              placeholder="Tìm kiếm theo tên sản phẩm"
              className="text-xl w-[16em] p-2 border border-gray-300 rounded-md box-border"
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
              <th>Tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b border-gray-300">
                <td>{supplier.id}</td>
                <td>{supplier.name}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.email}</td>
                <td>{supplier.create_at}</td>
                <td>
                  <span
                    className={`border border-gray-300 rounded-lg px-2 py-1 ${
                      supplier.status === 'hd' ? 'text-green-700' : 'text-red-500'
                    }`}
                  >
                    {supplier.status === 'hd' ? 'Hoạt động' : 'Ẩn'}
                  </span>
                </td>
                <td>
                  <div className="flex">
                    <button className="flex w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-black">
                      <FontAwesomeIcon icon={faEdit} className="text-xl" />
                    </button>
                    <button className="flex w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-black">
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

export default SuppplierManagement;
