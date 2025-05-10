
//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDeleteLeft,
  faEdit,
  faChevronLeft,
  faChevronRight,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    status: 1,
  });
  const [updateRole, setUpdateRole] = useState({
    id: null,
    name: '',
    status: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          name: searchTerm,
          status: statusFilter,
          page: currentPage,
          per_page: 10,
        });

        const rolesResponse = await fetch(`http://127.0.0.1:8000/api/admin/rules/search?${params.toString()}`);
        if (!rolesResponse.ok) throw new Error('Không thể lấy danh sách nhóm quyền');
        const rolesData = await rolesResponse.json();
        setRoles(rolesData.data.data || []);
        setFilteredRoles(rolesData.data.data || []);
        setTotalPages(rolesData.data.last_page || 1);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        toast.error('Lỗi khi lấy dữ liệu: ' + error.message, { autoClose: 3000 });
      }
    };
    fetchData();
  }, [currentPage, searchTerm, statusFilter]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewRole({
      name: '',
      status: 1,
    });
    setUpdateRole({
      id: null,
      name: '',
      status: 1,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateRole((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!newRole.name) {
        throw new Error('Vui lòng nhập tên nhóm quyền');
      }

      const response = await fetch('http://127.0.0.1:8000/api/admin/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRole.name,
          status: newRole.status,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Không thể tạo nhóm quyền');
        } catch {
          throw new Error('Máy chủ trả về phản hồi không phải JSON: ' + errorText);
        }
      }

      const updatedRolesResponse = await fetch(`http://127.0.0.1:8000/api/admin/rules?page=${currentPage}`);
      const updatedRolesData = await updatedRolesResponse.json();
      setRoles(updatedRolesData.data.data || []);
      setFilteredRoles(updatedRolesData.data.data || []);
      setTotalPages(updatedRolesData.data.last_page || 1);

      closeModal();
      toast.success('Thêm nhóm quyền thành công!', { autoClose: 3000 });
    } catch (error) {
      console.error('Lỗi khi thêm nhóm quyền:', error.message);
      toast.error('Thêm nhóm quyền thất bại: ' + error.message, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRole = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!updateRole.name) {
        throw new Error('Vui lòng nhập tên nhóm quyền');
      }

      const response = await fetch(`http://127.0.0.1:8000/api/admin/rules/${updateRole.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updateRole.name,
          status: updateRole.status,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Không thể cập nhật nhóm quyền');
        } catch {
          throw new Error('Máy chủ trả về phản hồi không phải JSON: ' + errorText);
        }
      }

      const updatedRolesResponse = await fetch(`http://127.0.0.1:8000/api/admin/rules?page=${currentPage}`);
      const updatedRolesData = await updatedRolesResponse.json();
      setRoles(updatedRolesData.data.data || []);
      setFilteredRoles(updatedRolesData.data.data || []);
      setTotalPages(updatedRolesData.data.last_page || 1);

      closeModal();
      toast.success('Cập nhật nhóm quyền thành công!', { autoClose: 3000 });
    } catch (error) {
      console.error('Lỗi khi cập nhật nhóm quyền:', error.message);
      toast.error('Cập nhật nhóm quyền thất bại: ' + error.message, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm('Bạn có chắc muốn xóa nhóm quyền này không?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/rules/${roleId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Không thể xóa nhóm quyền');
        } catch {
          throw new Error('Máy chủ trả về phản hồi không phải JSON: ' + errorText);
        }
      }

      const updatedRolesResponse = await fetch(`http://127.0.0.1:8000/api/admin/rules?page=${currentPage}`);
      const updatedRolesData = await updatedRolesResponse.json();
      setRoles(updatedRolesData.data.data || []);
      setFilteredRoles(updatedRolesData.data.data || []);
      setTotalPages(updatedRolesData.data.last_page || 1);

      if (updatedRolesData.data.data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }

      toast.success('Xóa nhóm quyền thành công!', { autoClose: 3000 });
    } catch (error) {
      console.error('Lỗi khi xóa nhóm quyền:', error.message);
      toast.error('Xóa nhóm quyền thất bại: ' + error.message, { autoClose: 3000 });
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams({
        name: searchTerm,
        status: statusFilter,
        page: currentPage,
        per_page: 10,
      });

      const response = await fetch(`http://127.0.0.1:8000/api/admin/rules/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Không thể tìm kiếm nhóm quyền');
      }

      const searchData = await response.json();
      setFilteredRoles(searchData.data.data || []);
      setTotalPages(searchData.data.last_page || 1);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm nhóm quyền:', error.message);
      toast.error('Tìm kiếm thất bại: ' + error.message, { autoClose: 3000 });
    }
  };

  const handleSearchInputChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleSearchButtonClick = () => {
    setCurrentPage(1); // Reset to first page on new search
    handleSearch();
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      handleSearch();
    }
  };

  const openEditModal = (role) => {
    setUpdateRole({
      id: role.id,
      name: role.name,
      status: role.status,
    });
    setIsModalOpen(true);
  };

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-x-hidden min-h-screen bg-white p-4">
      <ToastContainer />
      <header className="py-10">
        <div className="container flex justify-between px-4">
          <h1 className="text-2xl font-bold text-gray-800">Nhóm quyền</h1>
          <button
            onClick={openModal}
            className="px-4 py-2 text-base bg-gray-500 rounded-lg text-white hover:bg-gray-700"
          >
            Thêm nhóm quyền +
          </button>
        </div>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[30em] max-h-[90vh] overflow-y-auto backdrop-blur-lg border-4 border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{updateRole.id ? 'Chỉnh sửa nhóm quyền' : 'Thêm nhóm quyền mới'}</h2>
              <button onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
            <form onSubmit={updateRole.id ? handleEditRole : handleAddRole}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">Tên nhóm quyền</label>
                  <input
                    type="text"
                    name="name"
                    value={updateRole.id ? updateRole.name : newRole.name}
                    onChange={updateRole.id ? handleUpdateInputChange : handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Trạng thái</label>
                  <select
                    name="status"
                    value={updateRole.id ? updateRole.status : newRole.status}
                    onChange={updateRole.id ? handleUpdateInputChange : handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="1">Hoạt động</option>
                    <option value="0">Ẩn</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
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
                  {isLoading ? 'Đang xử lý...' : (updateRole.id ? 'Cập nhật' : 'Thêm')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-screen overflow-x-hidden px-4 py-6">
        <div className="flex flex-wrap justify-between mb-6">
          <div className="flex gap-4">
            <div className="flex flex-col mb-4 mr-8 md:mb-0">
              <span className="text-xl mb-2">Tìm kiếm</span>
              <input
                id="searchName"
                type="text"
                placeholder="Tìm kiếm theo tên nhóm quyền"
                className="text-xl w-[16em] p-2 border border-gray-300 rounded-md box-border"
                value={searchTerm}
                onChange={handleSearchInputChange}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="flex flex-col mb-4 md:mb-0">
              <span className="text-xl mb-2">Trạng thái</span>
              <select
                id="statusFilter"
                className="text-xl w-[10em] p-2 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={handleStatusChange}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Ẩn</option>
              </select>
            </div>
          </div>
          <div className="flex items-end mt-2 mb-4 md:mb-0">
            <button
              className="px-4 py-2 rounded-md bg-gray-500 text-white text-xl hover:bg-gray-700 shadow"
              onClick={handleSearchButtonClick}
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
                <th>Tên nhóm quyền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide">
              {filteredRoles.map((role) => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.name}</td>
                  <td>
                    <span
                      className={`border border-gray-300 rounded-lg px-2 py-1 ${
                        role.status === 1 ? 'text-green-700' : 'text-red-500'
                      }`}
                    >
                      {role.status === 1 ? 'Hoạt động' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-start">
                      <button
                        className="flex w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-black"
                        onClick={() => openEditModal(role)}
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-xl" />
                      </button>
                      <button
                        className="flex w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-red-500"
                        onClick={() => handleDeleteRole(role.id)}
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
    </div>
  );
};

export default RoleManagement;
