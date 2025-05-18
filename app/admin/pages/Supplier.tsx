//@ts-nocheck
import {
    faChevronLeft,
    faChevronRight,
    faDeleteLeft,
    faEdit,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchWithToken from '~/utils/fechWithToken';

const SuppplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    tax: '',
    contact_name: '',
    phone_number: '',
    email: '',
    status: 'active',
  });
  const [updateSupplier, setUpdateSupplier] = useState({
    id: null,
    name: '',
    tax: '',
    contact_name: '',
    phone_number: '',
    email: '',
    status: 'active',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchWithTokenData = async () => {
      try {
        // Gọi API tìm kiếm thay vì lấy toàn bộ danh sách
        const params = new URLSearchParams({
          keyword: searchTerm,
          status: statusFilter,
          page: currentPage,
          per_page: 10,
        });
  
        const suppliersResponse = await fetchWithToken(`http://127.0.0.1:8000/api/admin/suppliers/search?${params.toString()}`);
        if (!suppliersResponse.ok) throw new Error('Không thể lấy danh sách nhà cung cấp');
        const suppliersData = await suppliersResponse.json();
        setSuppliers(suppliersData.data.data || []);
        setTotalPages(suppliersData.data.last_page || 1);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        toast.error('Lỗi khi lấy dữ liệu: ' + error.message, { autoClose: 3000 });
      }
    };
    fetchWithTokenData();
  }, [currentPage, searchTerm, statusFilter]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewSupplier({
      name: '',
      tax: '',
      contact_name: '',
      phone_number: '',
      email: '',
      status: 'active',
    });
    setUpdateSupplier({
      id: null,
      name: '',
      tax: '',
      contact_name: '',
      phone_number: '',
      email: '',
      status: 'active',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Kiểm tra đầu vào
      if (newSupplier.phone_number.length !== 10 || !/^\d+$/.test(newSupplier.phone_number)) {
        throw new Error('Số điện thoại phải có đúng 10 chữ số');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newSupplier.email)) {
        throw new Error('Email không hợp lệ');
      }

      // Kiểm tra số điện thoại tồn tại
      let checkResponse = await fetchWithToken(`http://127.0.0.1:8000/api/admin/suppliers/check/${newSupplier.phone_number}`);

      if (!checkResponse.ok) {
        throw new Error('Không thể kiểm tra số điện thoại');
      }
      let checkData = await checkResponse.json();
      if (checkData.exists) {
        throw new Error('Số điện thoại đã tồn tại. Vui lòng chọn số điện thoại khác.');
      }

      // Kiểm tra email tồn tại
      checkResponse = await fetchWithToken(`http://127.0.0.1:8000/api/admin/suppliers/check/${newSupplier.email}`);
      if (!checkResponse.ok) {
        throw new Error('Không thể kiểm tra email');
      }
      checkData = await checkResponse.json();
      if (checkData.exists) {
        throw new Error('Email đã tồn tại. Vui lòng chọn email khác.');
      }

      // Tạo nhà cung cấp
      const supplierResponse = await fetchWithToken('http://127.0.0.1:8000/api/admin/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSupplier.name,
          tax: newSupplier.tax,
          contact_name: newSupplier.contact_name,
          phone_number: newSupplier.phone_number,
          email: newSupplier.email,
          status: newSupplier.status,
        }),
      });

      if (!supplierResponse.ok) {
        const supplierText = await supplierResponse.text();
        console.log('Phản hồi nhà cung cấp:', supplierText);
        try {
          const supplierData = JSON.parse(supplierText);
          const errorMessage = supplierData.message?.Suppliername?.[0] || supplierData.message || 'Không thể tạo nhà cung cấp';
          throw new Error(errorMessage);
        } catch (parseError) {
          throw new Error('Máy chủ trả về phản hồi không phải JSON: ' + supplierText);
        }
      }

      // Làm mới danh sách
      const updatedSuppliersResponse = await fetchWithToken(`http://127.0.0.1:8000/api/admin/suppliers/search?page=${currentPage}&status=${statusFilter}`);
      const updatedSuppliersData = await updatedSuppliersResponse.json();
      setSuppliers(updatedSuppliersData.data.data || []);
      setTotalPages(updatedSuppliersData.data.last_page || 1);

      closeModal();
      toast.success('Thêm nhà cung cấp thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm nhà cung cấp:', error.message);
      toast.error('Thêm nhà cung cấp thất bại:' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSupplier = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Kiểm tra đầu vào
      if (updateSupplier.phone_number.length !== 10 || !/^\d+$/.test(updateSupplier.phone_number)) {
        throw new Error('Số điện thoại phải có đúng 10 chữ số');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateSupplier.email)) {
        throw new Error('Email không hợp lệ');
      }

      // Cập nhật nhà cung cấp
      const supplierUpdateData = {
        name: updateSupplier.name,
        tax: updateSupplier.tax,
        contact_name: updateSupplier.contact_name,
        phone_number: updateSupplier.phone_number,
        email: updateSupplier.email,
        status: updateSupplier.status,
      };
      console.log(updateSupplier.id);
      const supplierResponse = await fetchWithToken(`http://127.0.0.1:8000/api/admin/suppliers/${updateSupplier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplierUpdateData),
      });
  
      if (!supplierResponse.ok) {
        const supplierText = await supplierResponse.text();
        const supplierData = JSON.parse(supplierText);
        const errorMessage = supplierData.message?.name?.[0] || supplierData.message || 'Không thể cập nhật nhà cung cấp';
        throw new Error(errorMessage);
      }
  
      // Làm mới danh sách
      const updatedSuppliersResponse = await fetchWithToken(`http://127.0.0.1:8000/api/admin/suppliers/search?page=${currentPage}&status=${statusFilter}`);
      const updatedSuppliersData = await updatedSuppliersResponse.json();
      setSuppliers(updatedSuppliersData.data.data || []);
      setTotalPages(updatedSuppliersData.data.last_page || 1);

      closeModal();
      toast.success('Cập nhật nhà cung cấp thành công!', { autoClose: 3000 });
    } catch (error) {
      console.error('Lỗi khi cập nhật nhà cung cấp:', error.message);
      toast.error('Cập nhật nhà cung cấp thất bại: ' + error.message, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (!window.confirm('Bạn có chắc muốn xóa nhà cung cấp này không?')) {
      return;
    }

    try {
      const supplierResponse = await fetchWithToken(`http://127.0.0.1:8000/api/admin/suppliers/${supplierId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const contentType = supplierResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Máy chủ không trả về dữ liệu JSON');
      }

      const supplierData = await supplierResponse.json();

      if (!supplierResponse.ok) {
        throw new Error(supplierData.message || 'Không thể xóa nhà cung cấp');
      }

      // Cập nhật danh sách từ phản hồi API
      if (supplierData.data) {
        setSupplier(supplierData.data.data || []);
        setTotalPages(supplierData.data.last_page || 1);

        // Làm mới danh sách
        const updatedSuppliersResponse = await fetchWithToken(`http://127.0.0.1:8000/api/admin/suppliers/search?page=${currentPage}&status=${statusFilter}`);
        const updatedSuppliersData = await updatedSuppliersResponse.json();
        setSuppliers(updatedSuppliersData.data.data || []);

        // Quay về trang trước nếu trang hiện tại trống
        if (updatedSuppliersData.data.data.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
      toast.success('Xóa nhà cung cấp thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa nhà cung cấp:', error.message);
      toast.error('Xóa nhà cung cấp thất bại:' + error.message);
    }
  };

  const handleSearchInputChange = (e) => {
    setCurrentPage(1);
    setSearchTerm(e.target.value);
  }
  
  const handleStatusChange = (e) => setStatusFilter(e.target.value);

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openEditModal = (supplier) => {
    const supplierData = suppliers.find((a) => a.id === supplier.id);
    console.log(supplierData);
    if (!supplierData) return;
  
    setUpdateSupplier({
      id: supplier.id,
      name: supplier.name,
      tax: supplier.tax,
      contact_name: supplier.contact_name,
      phone_number: supplier.phone_number,
      email: supplier.email,
      status: supplierData.status,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-screen overflow-x-hidden px-4 py-6">
      <ToastContainer />
      {/* Header */}
      <header className="py-10 mb-6">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Nhà cung cấp</h1>
          <button 
            className="px-4 py-2 text-base bg-gray-500 rounded-lg text-white hover:bg-gray-700"
            onClick={openModal}
          >
            Thêm nhà cung cấp +
          </button>
        </div>
      </header>

      <main className="max-w-screen overflow-x-hidden px-4 py-6">
        {/* Search Bar */}
        <div className="flex flex-wrap justify-between mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Tìm kiếm */}
            <div className="flex flex-col mb-4 mr-8 md:mb-0">
              <span className="text-xl mb-2">Tìm kiếm</span>
              <input
                id="searchName"
                type="text"
                placeholder="Nội dung tìm kiếm"
                className="text-xl w-[16em] p-2 border border-gray-300 rounded-md box-border"
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
            </div>

            {/* Trạng thái */}
            <div className="flex flex-col mb-4 md:mb-0">
              <span className="text-xl mb-2">Trạng thái</span>
              <select
                id="statusFilter"
                className="text-xl w-[10em] p-2 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={handleStatusChange}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Đã ngừng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bảng */}
        <div className="grid grid-cols-1 overflow-x-auto border border-gray-300 rounded-lg shadow-md">
          <table className="table text-lg w-full">
            <thead className="text-lg">
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">Tên</th>
                <th className="text-center">Số điện thoại</th>
                <th className="text-center">Email</th>
                <th className="text-center">Ngày tạo</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b border-gray-300">
                  <td>{supplier.id}</td>
                  <td>{supplier.name}</td>
                  <td>{supplier.phone_number}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.created_at}</td>
                  <td>
                    <span
                      className={`border border-gray-300 rounded-lg px-2 py-1 ${
                        supplier.status === 'active' ? 'text-green-700' : 'text-red-500'
                      }`}
                    >
                      {supplier.status === 'active' ? 'Hoạt động' : 'Đã ngừng'}
                    </span>
                  </td>
                  <td>
                    <div className="flex">
                      <button 
                        className="flex w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-black"
                        onClick={() => openEditModal(supplier)}
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-xl" />
                      </button>
                      <button 
                        className="flex w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-black"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                      >
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
          <button 
            className="btn rounded-lg ml-3"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
          </button>
          <span className="px-4 py-2 mx-2 text-gray-800">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            className="btn rounded-lg mr-3"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
          </button>
        </div>
      </main>

      {/* Model Thêm nhà cung cấp */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[40em] max-h-[90vh] overflow-y-auto backdrop-blur-lg border-4 border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{updateSupplier.id ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}</h2>
              <button onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
            <form onSubmit={updateSupplier.id ? handleEditSupplier : handleAddSupplier}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Cột trái */}
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">Tên</label>
                    <input
                      type="text"
                      name="name"
                      value={updateSupplier.id ? updateSupplier.name : newSupplier.name}
                      onChange={updateSupplier.id ? handleUpdateInputChange : handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Người đại diện</label>
                    <input
                      type="text"
                      name="contact_name"
                      value={updateSupplier.id ? updateSupplier.contact_name : newSupplier.contact_name}
                      onChange={updateSupplier.id ? handleUpdateInputChange : handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Mã số thuế</label>
                    <input
                      type="text"
                      name="tax"
                      value={updateSupplier.id ? updateSupplier.tax : newSupplier.tax}
                      onChange={updateSupplier.id ? handleUpdateInputChange : handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                {/* Cột phải */}
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">Số điện thoại</label>
                    <input
                      type="text"
                      name="phone_number"
                      value={updateSupplier.id ? updateSupplier.phone_number : newSupplier.phone_number}
                      onChange={updateSupplier.id ? handleUpdateInputChange : handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={updateSupplier.id ? updateSupplier.email : newSupplier.email}
                      onChange={updateSupplier.id ? handleUpdateInputChange : handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required={!updateSupplier.id}
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Trạng thái</label>
                    <select
                      name="status"
                      value={updateSupplier.id ? updateSupplier.status : newSupplier.status}
                      onChange={updateSupplier.id ? handleUpdateInputChange : handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Đã ngừng</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang xử lý...' : (updateSupplier.id ? 'Cập nhật' : 'Thêm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppplierManagement;
