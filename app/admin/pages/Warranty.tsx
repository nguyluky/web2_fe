//@ts-nocheck
import React, { use } from 'react';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDeleteLeft,
  faEdit,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const WarrantyManagement = () => {
  const [warranties, setWarranties] = useState([]);
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = async () => {
      const warrantyRes = await fetch('http://127.0.0.1:8000/api/admin/warrantys'); // Replace with your API endpoint
      const warrantyData = await warrantyRes.json();
      setWarranties(warrantyData.data.data);
      console.log("aaaaaaaa",warrantyData.data.data);
      

      const userRes = await fetch('http://127.0.0.1:8000/api/admin/users'); // Replace with your API endpoint
      const userData = await userRes.json();
      setUsers(userData.data.data);
      console.log("bbbbbb",userData.data.data);

      const supplierRes = await fetch('http://127.0.0.1:8000/api/admin/suppliers'); // Replace with your API endpoint
      const supplierData = await supplierRes.json();
      setSuppliers(supplierData.data.data);
      console.log("cccccc",supplierData.data.data);

      const productRes = await fetch('http://127.0.0.1:8000/api/admin/products'); // Replace with your API endpoint
      const productData = await productRes.json();
      setProducts(productData.data.data);
      console.log("dddddd",productData.data.data);
    };
    fetchData();

  }, []);

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
                  {users.find((user) => user.id === warranty.id)?.fullname || 'Không tìm thấy'}
                </td>
                <td>
                  {suppliers.find((supplier) => supplier.id === warranty.supplier_id)?.name ||
                    'Không tìm thấy'}
                </td>
                <td>
                  {products.find((product) => product.id === warranty.product_id)?.name ||
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
