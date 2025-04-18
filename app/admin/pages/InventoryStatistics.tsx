import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const InventoryStatistics = () => {
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
  return (
    <div className="max-w-screen overflow-x-hidden px-4 py-6">
      {/* Header */}
      <header className="py-10 mb-6">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Thống kê tồn kho</h1>
        </div>
      </header>

      {/* Bảng */}
      <div className="grid grid-cols-1 overflow-x-auto border border-gray-300 rounded-lg shadow-md">
        <table className="table text-lg w-full">
          {' '}
          <thead className="text-lg">
            <tr>
              <th> ID</th>
              <th>Tên</th>
              <th>Tồn kho</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-300">
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.stock}</td>
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

export default InventoryStatistics;
