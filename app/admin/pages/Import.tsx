import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faDeleteLeft,
  faChevronLeft,
  faChevronRight,
  faTimes,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderManagement = () => {
  const [users, setUsers] = useState([]);
  const [imports, setImports] = useState([]);
  const [importDetails, setImportDetails] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedImport, setSelectedImport] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [newImport, setNewImport] = useState({
    employee_id: '',
    supplier_id: '',
    status: 'pending',
    import_details: [{ product_id: '', amount: '' }],
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          status: statusFilter === 'all' ? '' : statusFilter,
          date_start: dateStart,
          date_end: dateEnd,
          limit: 10,
          page: currentPage,
        });

        const usersResponse = await fetch('http://127.0.0.1:8000/api/admin/users');
        if (!usersResponse.ok) throw new Error('Không thể lấy danh sách người dùng');
        const usersData = await usersResponse.json();
        setUsers(usersData.data.data || []);

        const importsResponse = await fetch(`http://127.0.0.1:8000/api/admin/imports?${params.toString()}`);
        if (!importsResponse.ok) throw new Error('Không thể lấy danh sách phiếu nhập');
        const importsData = await importsResponse.json();
        setImports(importsData.data.data || []);
        setTotalPages(importsData.data.last_page || 1);

        const importDetailsResponse = await fetch('http://127.0.0.1:8000/api/admin/import-details');
        if (!importDetailsResponse.ok) throw new Error('Không thể lấy chi tiết phiếu nhập');
        const importDetailsData = await importDetailsResponse.json();
        setImportDetails(importDetailsData.data.data || []);

        const suppliersResponse = await fetch('http://127.0.0.1:8000/api/admin/suppliers');
        if (!suppliersResponse.ok) throw new Error('Không thể lấy danh sách nhà cung cấp');
        const suppliersData = await suppliersResponse.json();
        setSuppliers(suppliersData.data.data || []);

        const productsResponse = await fetch('http://127.0.0.1:8000/api/admin/products');
        if (!productsResponse.ok) throw new Error('Không thể lấy danh sách sản phẩm');
        const productsData = await productsResponse.json();
        setProducts(productsData.data.data || []);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        toast.error('Lỗi khi lấy dữ liệu: ' + error.message, { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchTerm, statusFilter, dateStart, dateEnd]);

  const calculateTotalPerImport = (details = []) => {
    return details.reduce((sum, item) => sum + item.import_price * item.amount, 0);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Đang xử lý';
      case 'completed':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      case 'processing':
        return 'Đã thanh toán';
      default:
        return 'Database Error';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-yellow-500';
      case 'pending':
        return 'text-blue-500';
      case 'processing':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const openEditModal = (importItem) => {
    setSelectedImport(importItem);
    setEditStatus(importItem.status);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedImport(null);
    setEditStatus('');
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewImport({
      employee_id: '',
      supplier_id: '',
      status: 'pending',
      import_details: [{ product_id: '', amount: '' }],
    });
  };

  const handleNewImportChange = (e) => {
    const { name, value } = e.target;
    setNewImport((prev) => ({ ...prev, [name]: value }));
  };

  const handleImportDetailChange = (index, e) => {
    const { name, value } = e.target;
    setNewImport((prev) => {
      const updatedDetails = [...prev.import_details];
      updatedDetails[index] = { ...updatedDetails[index], [name]: value };
      return { ...prev, import_details: updatedDetails };
    });
  };

  const addImportDetail = () => {
    setNewImport((prev) => ({
      ...prev,
      import_details: [...prev.import_details, { product_id: '', amount: '' }],
    }));
  };

  const removeImportDetail = (index) => {
    setNewImport((prev) => {
      const updatedDetails = prev.import_details.filter((_, i) => i !== index);
      return { ...prev, import_details: updatedDetails };
    });
  };

  const handleAddImport = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!newImport.employee_id || !newImport.supplier_id) {
        throw new Error('Vui lòng chọn nhân viên và nhà cung cấp');
      }
      if (newImport.import_details.some((detail) => !detail.product_id || !detail.amount || detail.amount <= 0)) {
        throw new Error('Vui lòng chọn sản phẩm và nhập số lượng hợp lệ cho tất cả chi tiết');
      }

      // Check for duplicate products
      const productIds = newImport.import_details.map((detail) => detail.product_id);
      if (new Set(productIds).size !== productIds.length) {
        throw new Error('Không được chọn sản phẩm trùng lặp');
      }

      const response = await fetch('http://127.0.0.1:8000/api/admin/imports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          employee_id: parseInt(newImport.employee_id),
          supplier_id: parseInt(newImport.supplier_id),
          status: newImport.status,
          import_details: newImport.import_details.map((detail) => ({
            product_id: parseInt(detail.product_id),
            amount: parseInt(detail.amount),
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo phiếu nhập');
      }

      const updatedImportsResponse = await fetch(
        `http://127.0.0.1:8000/api/admin/imports?page=${currentPage}&limit=10`
      );
      if (!updatedImportsResponse.ok) throw new Error('Không thể lấy danh sách phiếu nhập');
      const updatedImportsData = await updatedImportsResponse.json();
      setImports(updatedImportsData.data.data || []);
      setTotalPages(updatedImportsData.data.last_page || 1);

      // Refresh import details
      const updatedImportDetailsResponse = await fetch('http://127.0.0.1:8000/api/admin/import-details');
      if (!updatedImportDetailsResponse.ok) throw new Error('Không thể lấy chi tiết phiếu nhập');
      const updatedImportDetailsData = await updatedImportDetailsResponse.json();
      setImportDetails(updatedImportDetailsData.data.data || []);

      closeAddModal();
      toast.success('Thêm phiếu nhập thành công!', { autoClose: 3000 });
    } catch (error) {
      console.error('Lỗi khi thêm phiếu nhập:', error.message);
      toast.error('Thêm phiếu nhập thất bại: ' + error.message, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedImport) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/imports/${selectedImport.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: editStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật trạng thái phiếu nhập');
      }

      const updatedImportsResponse = await fetch(
        `http://127.0.0.1:8000/api/admin/imports?page=${currentPage}&limit=10`
      );
      if (!updatedImportsResponse.ok) throw new Error('Không thể lấy danh sách phiếu nhập');
      const updatedImportsData = await updatedImportsResponse.json();
      setImports(updatedImportsData.data.data || []);
      setTotalPages(updatedImportsData.data.last_page || 1);

      closeEditModal();
      toast.success('Cập nhật trạng thái phiếu nhập thành công!', { autoClose: 3000 });
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái phiếu nhập:', error.message);
      toast.error('Cập nhật trạng thái thất bại: ' + error.message, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelImport = async (importId) => {
    if (!window.confirm('Bạn có chắc muốn hủy phiếu nhập này không?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/imports/${importId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể hủy phiếu nhập');
      }

      const updatedImportsResponse = await fetch(
        `http://127.0.0.1:8000/api/admin/imports?page=${currentPage}&limit=10`
      );
      if (!updatedImportsResponse.ok) throw new Error('Không thể lấy danh sách phiếu nhập');
      const updatedImportsData = await updatedImportsResponse.json();
      setImports(updatedImportsData.data.data || []);
      setTotalPages(updatedImportsData.data.last_page || 1);

      if (updatedImportsData.data.data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

      toast.success('Hủy phiếu nhập thành công!', { autoClose: 3000 });
    } catch (error) {
      console.error('Lỗi khi hủy phiếu nhập:', error.message);
      toast.error('Hủy phiếu nhập thất bại: ' + error.message, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleDateStartChange = (e) => setDateStart(e.target.value);
  const handleDateEndChange = (e) => setDateEnd(e.target.value);
  const handleEditStatusChange = (e) => setEditStatus(e.target.value);
  const handleSearchButtonClick = () => {
    setCurrentPage(1);
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
    }
  };

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="overflow-x-hidden min-h-screen bg-white p-4">
      <ToastContainer />
      <header className="py-10 mb-6">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Phiếu nhập</h1>
          <button
            className="px-4 py-2 text-base bg-gray-500 rounded-lg text-white hover:bg-gray-700"
            onClick={openAddModal}
            disabled={isLoading}
          >
            Thêm phiếu nhập +
          </button>
        </div>
      </header>

      {isAddModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[40em] max-h-[90vh] overflow-y-auto backdrop-blur-lg border-4 border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Thêm phiếu nhập mới</h2>
              <button onClick={closeAddModal}>
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleAddImport}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Nhân viên</label>
                  <select
                    name="employee_id"
                    value={newImport.employee_id}
                    onChange={handleNewImportChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Chọn nhân viên</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fullname}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Nhà cung cấp</label>
                  <select
                    name="supplier_id"
                    value={newImport.supplier_id}
                    onChange={handleNewImportChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Chọn nhà cung cấp</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Trạng thái</label>
                  <select
                    name="status"
                    value={newImport.status}
                    onChange={handleNewImportChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="pending">Đang xử lý</option>
                    <option value="processing">Đã thanh toán</option>
                    <option value="completed">Đã giao hàng</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Chi tiết phiếu nhập</label>
                  {newImport.import_details.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <select
                        name="product_id"
                        value={detail.product_id}
                        onChange={(e) => handleImportDetailChange(index, e)}
                        className="w-1/2 p-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Chọn sản phẩm</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        name="amount"
                        value={detail.amount}
                        onChange={(e) => handleImportDetailChange(index, e)}
                        className="w-1/4 p-2 border border-gray-300 rounded-md"
                        placeholder="Số lượng"
                        min="1"
                        required
                      />
                      {newImport.import_details.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImportDetail(index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImportDetail}
                    className="mt-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Thêm sản phẩm
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeAddModal}
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
                  {isLoading ? 'Đang xử lý...' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[30em] max-h-[90vh] overflow-y-auto backdrop-blur-lg border-4 border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cập nhật trạng thái phiếu nhập</h2>
              <button onClick={closeEditModal}>
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleUpdateStatus}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Trạng thái</label>
                  <select
                    value={editStatus}
                    onChange={handleEditStatusChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="pending">Đang xử lý</option>
                    <option value="processing">Đã thanh toán</option>
                    <option value="completed">Đã giao hàng</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
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
                  {isLoading ? 'Đang xử lý...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-between mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col mb-4 mr-8 md:mb-0">
            <span className="text-xl mb-2">Tìm kiếm</span>
            <input
              id="searchName"
              type="text"
              placeholder="ID phiếu nhập"
              className="text-xl w-[16em] p-2 border border-gray-300 rounded-md box-border"
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="flex flex-col mb-4 mr-8 md:mb-0">
            <span className="text-xl mb-2">Ngày bắt đầu</span>
            <input
              id="searchDateStart"
              type="date"
              className="text-xl w-[12em] p-2 border border-gray-300 rounded-md"
              value={dateStart}
              onChange={handleDateStartChange}
            />
          </div>
          <div className="flex flex-col mb-4 mr-8 md:mb-0">
            <span className="text-xl mb-2">Ngày kết thúc</span>
            <input
              id="searchDateEnd"
              type="date"
              className="text-xl w-[12em] p-2 border border-gray-300 rounded-md"
              value={dateEnd}
              onChange={handleDateEndChange}
            />
          </div>
          <div className="flex flex-col mb-4 md:mb-0">
            <span className="text-xl mb-2">Trạng thái</span>
            <select
              id="statusFilter"
              className="text-xl w-[12em] p-2 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Đang xử lý</option>
              <option value="completed">Đã giao hàng</option>
              <option value="cancelled">Đã hủy</option>
              <option value="processing">Đã thanh toán</option>
            </select>
          </div>
        </div>
        <div className="flex items-end mt-2 mb-4 mr-3 md:mb-0">
          <button
            className="px-4 py-2 rounded-md bg-gray-500 text-white text-xl hover:bg-gray-700 shadow"
            onClick={handleSearchButtonClick}
            disabled={isLoading}
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 overflow-x-auto border border-gray-300 rounded-lg shadow-md">
        <table className="table text-lg w-full">
          <thead className="text-lg">
            <tr>
              <th>ID</th>
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
            {imports.map((importItem) => (
              <tr key={importItem.id} className="border-b border-gray-300">
                <td>{importItem.id}</td>
                <td>
                  {users.find((user) => user.id === importItem.employee_id)?.fullname ||
                    'Không tìm thấy'}
                </td>
                <td>
                  {suppliers.find((supplier) => supplier.id === importItem.supplier_id)?.name ||
                    'Không tìm thấy'}
                </td>
                <td>
                  {suppliers.find((supplier) => supplier.id === importItem.supplier_id)?.email ||
                    'Không tìm thấy'}
                </td>
                <td>{new Date(importItem.created_at).toLocaleDateString()}</td>
                <td>
                  {calculateTotalPerImport(
                    importDetails.filter((detail) => detail.import_id === importItem.id)
                  ).toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </td>
                <td>
                  <span
                    className={`border border-gray-300 rounded-lg px-2 py-1 ${getStatusColor(
                      importItem.status
                    )}`}
                  >
                    {getStatusText(importItem.status)}
                  </span>
                </td>
                <td>
                  <div className="flex justify-start">
                    <button
                      className="flex w-12 h-12 px-4 py-2 text-base bg-white text-gray-500 hover:text-black"
                      onClick={() => openEditModal(importItem)}
                      disabled={isLoading}
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-xl" />
                    </button>
                    <button
                      className="flex w-12 h-12 px-4 py-2 text-base bg-white text-gray-500 hover:text-red-500"
                      onClick={() => handleCancelImport(importItem.id)}
                      disabled={isLoading || importItem.status === 'cancelled'}
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

      <div className="flex justify-center mt-4">
        <button
          className="btn rounded-lg ml-3"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
        </button>
        <span className="px-4 py-2 mx-2 text-gray-800">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="btn rounded-lg mr-3"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default OrderManagement;