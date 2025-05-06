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

const ProductManagement = () => {

const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Simulate fetching data from an API
        const fetchData = async () => {
            const productRes = await fetch('http://127.0.0.1:8000/api/admin/products'); // Replace with your API endpoint
            const productData = await productRes.json();
            setProducts(productData.data.data);

            const categoryRes = await fetch('http://127.0.0.1:8000/api/admin/categories'); // Replace with your API endpoint
            const categoryData = await categoryRes.json();
            setCategories(categoryData.data.data);
            console.log('Categories:', categoryData.data.data);
        };
        fetchData();
    }, [])

    const getCategoryName = (categoryId) => {
      const category = categories.find((cat) => cat.id === categoryId);
      return category ? category.name : 'Không rõ';
    };

  return (
    <div className="overflow-x-hidden min-h-screen bg-white p-4">
      {/* Header */}
      <header className="py-10">
        <div className="container flex justify-between px-4">
          <h1 className="text-2xl font-bold text-gray-800">Sản phẩm</h1>
          <button className="px-4 py-2 text-base bg-gray-500 rounded-lg text-white hover:bg-gray-700">
            Thêm sản phẩm +
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
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Tồn kho</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {products.map((product) => (
              <tr key={product.id} className="">
                <td>{product.id}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="product-img">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-1-202309?wid=5120&hei=2880&fmt=jpeg&qlt=80&.v=1692837880911"
                          alt="iPhone 15 Pro"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td>{getCategoryName(product.category_id)}</td>
                <td>{product.base_price}</td>
                <td>{product.stock}</td>
                <td>{product.created_at}</td>
                <td>
                  <span
                    className={`border border-gray-300 rounded-lg px-2 py-1 ${
                      product.status === 'hd' ? 'text-green-700' : 'text-red-500'
                    }`}
                  >
                    {product.status === 'hd' ? 'Hoạt động' : 'Ẩn'}
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

export default ProductManagement;
