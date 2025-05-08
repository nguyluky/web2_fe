//@ts-nocheck
import React from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDeleteLeft,
  faEdit,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const OrderManagement = () => {
  // const users = [
  //   {
  //     id: 1,
  //     name: 'Nguyễn Văn A',
  //     phone: '0901234567',
  //     email: 'abc@gmail.com',
  //     status: 'hd',
  //     role: 'Admin',
  //   },
  //   {
  //     id: 2,
  //     name: 'Trần Thị B',
  //     phone: '0912345678',
  //     email: 'abc@gmail.com',
  //     status: 'an',
  //     role: 'Imployee',
  //   },
  //   {
  //     id: 3,
  //     name: 'Lê Văn C',
  //     phone: '0923456789',
  //     email: 'abc@gmail.com',
  //     status: 'hd',
  //     role: 'Imployee',
  //   },
  // ];

  // const imports = [
  //   {
  //     id: 1,
  //     status: 'completed',
  //     created_at: '2023-04-01',
  //     employee_id: 2,
  //     supplier_id: 2,
  //     details: [
  //       { id: 1, product_id: 1, import_price: 3450000, amount: 2 },
  //       { id: 2, product_id: 3, import_price: 3600000, amount: 1 },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     status: 'pending',
  //     created_at: '2023-04-02',
  //     employee_id: 3,
  //     supplier_id: 1,
  //     details: [
  //       { id: 3, product_id: 3, import_price: 3000000, amount: 5 },
  //       { id: 4, product_id: 2, import_price: 4500000, amount: 3 },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     account_id: 3,
  //     status: 'canceled',
  //     created_at: '2023-04-03',
  //     employee_id: 2,
  //     supplier_id: 1,
  //     details: [{ id: 1, product_id: 305, import_price: 4000000, amount: 1 }],
  //   },
  // 
  const [users, setUsers] = useState([]);
  const [imports, setImports] = useState([]);
  const [importDetails, setImportDetails] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/admin/users');
      const data = await response.json();
      setUsers(data.data.data);
      console.log("aaaaaaa",data.data.data);

      const importRes = await fetch('http://127.0.0.1:8000/api/admin/imports'); // Replace with your API endpoint
      const importData = await importRes.json();
      setImports(importData.data.data);
      console.log("bbbbbb",importData.data.data);

      const importDetailsRes = await fetch('http://127.0.0.1:8000/api/admin/import-details'); // Replace with your API endpoint
    const importDetailsData = await importDetailsRes.json();
      setImportDetails(importDetailsData.data.data);
      console.log("cccccc",importDetailsData.data.data);

      const supplierRes = await fetch('http://127.0.0.1:8000/api/admin/suppliers'); // Replace with your API endpoint
      const supplierData = await supplierRes.json();
      setSuppliers(supplierData.data.data);
      console.log("dddddd",supplierData.data.data);
    };
    fetchData();
  }, []);
  const calculateTotalPerImport = (
    details: {
      import_price: number;
      amount: number;
    }[] = []
  ) => {
    return details.reduce((sum, item) => sum + item.import_price * item.amount, 0);
  };
  

  return (
    <div className="max-w-screen overflow-x-hidden px-4 py-6">
      {/* Header */}
      <header className="py-10 mb-6">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Phiếu nhập</h1>
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
              placeholder="Tìm kiếm theo tên nhân viên, nhà cung cấp"
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
              <th>Tên nhân viên</th>
              <th>Nhà cung cấp</th>
              <th>Email</th>
              <th>Ngày tạo</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {imports.map((import_item) => (
              <tr key={import_item.id} className="border-b border-gray-300">
                <td>{import_item.id}</td>
                <td>
                  {users.find((user) => user.id === import_item.employee_id)?.fullname ||
                    'Không tìm thấy'}
                </td>
                <td>
                  {suppliers.find((supplier) => supplier.id === import_item.supplier_id)?.name ||
                    'Không tìm thấy'}
                </td>
                <td>
                  {users.find((user) => user.id === import_item.employee_id)?.email ||
                    'Không tìm thấy'}
                </td>
                <td>{import_item.created_at}</td>
                <td>
                {calculateTotalPerImport(
                  importDetails.filter((im) => im.import_id === import_item.id)
                ).toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </td>


                <td>
                  <span
                    className={`border border-gray-300 rounded-lg px-2 py-1 ${
                      import_item.status === 'completed'
                        ? 'text-green-700'
                        : import_item.status === 'pending'
                        ? 'text-blue-500'
                        : 'text-red-500'
                    }`}
                  >
                    {import_item.status === 'completed'
                      ? 'Hoàn thành'
                      : import_item.status === 'pending'
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
