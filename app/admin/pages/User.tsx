//@ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
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


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [rules, setRules] = useState([]);
  const [account, setAccount] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    fullname: '',
    phone_number: '',
    email: '',
    username: '',
    password: '',
    rule: '',
    status: 'active',
  });
  const [updateUser, setUpdateUser] = useState({
    id: null,
    fullname: '',
    phone_number: '',
    email: '',
    username: '',
    password: '',
    rule: '',
    status: 'active',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải
  const passwordRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await fetch(`http://127.0.0.1:8000/api/admin/users?page=${currentPage}`);
        if (!usersResponse.ok) throw new Error('Không thể lấy danh sách người dùng');
        const usersData = await usersResponse.json();
        setUsers(usersData.data.data || []);
        setFilteredUsers(usersData.data.data || []);
        setTotalPages(usersData.data.last_page || 1);

        // Fetch accounts
        const accountsResponse = await fetch(`http://127.0.0.1:8000/api/admin/accounts?page=${currentPage}`);
        if (!accountsResponse.ok) throw new Error('Không thể lấy danh sách tài khoản');
        const accountsData = await accountsResponse.json();
        setAccount(accountsData.data.data || []);

        // Fetch rules
        const rulesResponse = await fetch('http://127.0.0.1:8000/api/admin/rules');
        if (!rulesResponse.ok) throw new Error('Không thể lấy danh sách vai trò');
        const rulesData = await rulesResponse.json();
        setRules(rulesData.data.data || []);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        toast.error('Lỗi khi lấy dữ liệu: ' + error.message);
      }
    };
    fetchData();
  }, [currentPage]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewUser({
      fullname: '',
      phone_number: '',
      email: '',
      username: '',
      password: '',
      rule: '',
      status: 'active',
    });
    setUpdateUser({
      id: null,
      fullname: '',
      phone_number: '',
      email: '',
      username: '',
      password: '',
      rule: '',
      status: 'active',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Kiểm tra đầu vào
      if (newUser.phone_number.length !== 10 || !/^\d+$/.test(newUser.phone_number)) {
        throw new Error('Số điện thoại phải có đúng 10 chữ số');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
        throw new Error('Email không hợp lệ');
      }
      if (!newUser.rule) {
        throw new Error('Vui lòng chọn vai trò');
      }
      if (newUser.password.length < 8) {
        throw new Error('Mật khẩu phải có ít nhất 8 kí tự');
      }
      if (newUser.password !== passwordRef.current.value) {
        throw new Error('Mật khẩu xác nhận không khớp');
      }

      // Kiểm tra username tồn tại
      const checkResponse = await fetch(`http://127.0.0.1:8000/api/admin/check-username/${newUser.username}`);
      if (!checkResponse.ok) {
        throw new Error('Không thể kiểm tra tên đăng nhập');
      }
      const checkData = await checkResponse.json();
      if (checkData.exists) {
        throw new Error('Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.');
      }

      // Tạo tài khoản
      const accountResponse = await fetch('http://127.0.0.1:8000/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUser.username,
          password: newUser.password,
          rule: parseInt(newUser.rule),
          status: newUser.status,
        }),
      });

      if (!accountResponse.ok) {
        const accountText = await accountResponse.text();
        console.log('Phản hồi tài khoản:', accountText);
        try {
          const accountData = JSON.parse(accountText);
          const errorMessage = accountData.message?.username?.[0] || accountData.message || 'Không thể tạo tài khoản';
          throw new Error(errorMessage);
        } catch (parseError) {
          throw new Error('Máy chủ trả về phản hồi không phải JSON: ' + accountText);
        }
      }

      const accountData = await accountResponse.json();
      const accountId = accountData.data.id;

      // Tạo hồ sơ người dùng
      const profileResponse = await fetch('http://127.0.0.1:8000/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: accountId,
          fullname: newUser.fullname,
          phone_number: newUser.phone_number,
          email: newUser.email,
        }),
      });

      if (!profileResponse.ok) {
        const profileText = await profileResponse.text();
        console.log('Phản hồi hồ sơ:', profileText);
        try {
          const profileData = JSON.parse(profileText);
          const errorMessage = profileData.message?.email?.[0] || profileData.message?.phone_number?.[0] || profileData.message || 'Không thể tạo hồ sơ người dùng';
          throw new Error(errorMessage);
        } catch (parseError) {
          throw new Error('Máy chủ trả về phản hồi không phải JSON: ' + profileText);
        }
      }

      const profileData = await profileResponse.json();

      // Làm mới danh sách
      const updatedUsersResponse = await fetch(`http://127.0.0.1:8000/api/admin/users?page=${currentPage}`);
      const updatedUsersData = await updatedUsersResponse.json();
      setUsers(updatedUsersData.data.data || []);
      setFilteredUsers(updatedUsersData.data.data || []);
      setTotalPages(updatedUsersData.data.last_page || 1);

      const updatedAccountsResponse = await fetch(`http://127.0.0.1:8000/api/admin/accounts?page=${currentPage}`);
      const updatedAccountData = await updatedAccountsResponse.json();
      setAccount(updatedAccountData.data.data || []);

      closeModal();
      toast.success('Thêm người dùng thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm người dùng:', error.message);
      toast.error('Thêm người dùng thất bại: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  // khi thông báo xong sẽ biến mất 
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này không?')) {
      return;
    }

    try {
      const accountResponse = await fetch(`http://127.0.0.1:8000/api/admin/accounts/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const contentType = accountResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Máy chủ không trả về dữ liệu JSON');
      }

      const accountData = await accountResponse.json();

      if (!accountResponse.ok) {
        throw new Error(accountData.message || 'Không thể xóa tài khoản');
      }

      // Cập nhật danh sách từ phản hồi API
      if (accountData.data) {
        setAccount(accountData.data.data || []);
        setTotalPages(accountData.data.last_page || 1);

        // Làm mới danh sách người dùng
        const updatedUsersResponse = await fetch(`http://127.0.0.1:8000/api/admin/users?page=${currentPage}`);
        const updatedUsersData = await updatedUsersResponse.json();
        setUsers(updatedUsersData.data.data || []);
        setFilteredUsers(updatedUsersData.data.data || []);

        // Quay về trang trước nếu trang hiện tại trống
        if (updatedUsersData.data.data.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        // Dự phòng: lấy lại dữ liệu nếu API không trả về danh sách cập nhật
        const fetchData = async () => {
          const usersResponse = await fetch(`http://127.0.0.1:8000/api/admin/users?page=${currentPage}`);
          const usersData = await usersResponse.json();
          setUsers(usersData.data.data || []);
          setFilteredUsers(usersData.data.data || []);
          setTotalPages(usersData.data.last_page || 1);

          const accountsResponse = await fetch(`http://127.0.0.1:8000/api/admin/accounts?page=${currentPage}`);
          const accountsData = await accountsResponse.json();
          setAccount(accountsData.data.data || []);
        };
        fetchData();
      }

      toast.success('Xóa người dùng thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error.message);
      toast.error('Xóa người dùng thất bại: ' + error.message);
    }
  };

  const handleSearch = () => {
    let filtered = users.filter((user) => {
      const accountData = account.find((a) => a.id === user.id);
      if (!accountData) return false;
      const matchesSearch = user.fullname.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || accountData.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredUsers(filtered);
  };

  const handleSearchInputChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleSearchButtonClick = () => handleSearch();
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openEditModal = (user) => {
    const accountData = account.find((a) => a.id === user.id);
    if (!accountData) return;
  
    setUpdateUser({
      id: user.id,
      fullname: user.fullname,
      phone_number: user.phone_number,
      email: user.email,
      username: accountData.username,
      password: '', // Không điền mật khẩu cũ, để trống để giữ nguyên nếu không thay đổi
      rule: accountData.rule.toString(),
      status: accountData.status,
    });
    setIsModalOpen(true);
  };
  
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleEditUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Kiểm tra đầu vào
      if (updateUser.phone_number.length !== 10 || !/^\d+$/.test(updateUser.phone_number)) {
        throw new Error('Số điện thoại phải có đúng 10 chữ số');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateUser.email)) {
        throw new Error('Email không hợp lệ');
      }
      if (!updateUser.rule) {
        throw new Error('Vui lòng chọn vai trò');
      }
  
      // Cập nhật tài khoản
      const accountUpdateData = {
        username: updateUser.username,
        rule: parseInt(updateUser.rule),
        status: updateUser.status,
      };
      if (updateUser.password) {
        accountUpdateData.password = updateUser.password; // Chỉ gửi mật khẩu nếu người dùng nhập mật khẩu mới
      }
  
      const accountResponse = await fetch(`http://127.0.0.1:8000/api/admin/accounts/${updateUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountUpdateData),
      });
  
      if (!accountResponse.ok) {
        const accountText = await accountResponse.text();
        console.log('Phản hồi tài khoản:', accountText);
        const accountData = JSON.parse(accountText);
        const errorMessage = accountData.message?.username?.[0] || accountData.message || 'Không thể cập nhật tài khoản';
        throw new Error(errorMessage);
      }
  
      // Cập nhật hồ sơ người dùng
      const profileResponse = await fetch(`http://127.0.0.1:8000/api/admin/users/${updateUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: updateUser.fullname,
          phone_number: updateUser.phone_number,
          email: updateUser.email,
        }),
      });
  
      if (!profileResponse.ok) {
        const profileText = await profileResponse.text();
        console.log('Phản hồi hồ sơ:', profileText);
        const profileData = JSON.parse(profileText);
        const errorMessage = profileData.message?.email?.[0] || profileData.message?.phone_number?.[0] || profileData.message || 'Không thể cập nhật hồ sơ người dùng';
        throw new Error(errorMessage);
      }
  
      // Làm mới danh sách
      const updatedUsersResponse = await fetch(`http://127.0.0.1:8000/api/admin/users?page=${currentPage}`);
      const updatedUsersData = await updatedUsersResponse.json();
      setUsers(updatedUsersData.data.data || []);
      setFilteredUsers(updatedUsersData.data.data || []);
      setTotalPages(updatedUsersData.data.last_page || 1);
  
      const updatedAccountsResponse = await fetch(`http://127.0.0.1:8000/api/admin/accounts?page=${currentPage}`);
      const updatedAccountData = await updatedAccountsResponse.json();
      setAccount(updatedAccountData.data.data || []);
  
      closeModal();
      toast.success('Cập nhật người dùng thành công!', { autoClose: 3000 });
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error.message);
      toast.error('Cập nhật người dùng thất bại: ' + error.message, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-x-hidden min-h-screen bg-white p-4">
      <ToastContainer />
      <header className="py-10">
        <div className="container flex justify-between px-4">
          <h1 className="text-2xl font-bold text-gray-800">Người dùng</h1>
          <button
            onClick={openModal}
            className="px-4 py-2 text-base bg-gray-500 rounded-lg text-white hover:bg-gray-700"
          >
            Thêm người dùng +
          </button>
        </div>
      </header>

      {isModalOpen && (
  <div className="fixed inset-0 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[40em] max-h-[90vh] overflow-y-auto backdrop-blur-lg border-4 border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{updateUser.id ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
        <button onClick={closeModal}>
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>
      </div>
      <form onSubmit={updateUser.id ? handleEditUser : handleAddUser}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Cột trái */}
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Họ và tên</label>
              <input
                type="text"
                name="fullname"
                value={updateUser.id ? updateUser.fullname : newUser.fullname}
                onChange={updateUser.id ? handleUpdateInputChange : handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Số điện thoại</label>
              <input
                type="text"
                name="phone_number"
                value={updateUser.id ? updateUser.phone_number : newUser.phone_number}
                onChange={updateUser.id ? handleUpdateInputChange : handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={updateUser.id ? updateUser.email : newUser.email}
                onChange={updateUser.id ? handleUpdateInputChange : handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Vai trò</label>
              <select
                name="rule"
                value={updateUser.id ? updateUser.rule : newUser.rule}
                onChange={updateUser.id ? handleUpdateInputChange : handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option disabled selected value="">Chọn vai trò</option>
                {rules.map((rule) => (
                  <option key={rule.id} value={rule.id}>
                    {rule.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Cột phải */}
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Tên đăng nhập</label>
              <input
                type="text"
                name="username"
                value={updateUser.id ? updateUser.username : newUser.username}
                onChange={updateUser.id ? handleUpdateInputChange : handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={updateUser.id ? updateUser.password : newUser.password}
                onChange={updateUser.id ? handleUpdateInputChange : handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={updateUser.id ? 'Để trống nếu không muốn thay đổi' : ''}
                required={!updateUser.id} // Chỉ yêu cầu mật khẩu khi thêm mới
              />
            </div>
            <div>
              <label className="block mb-2">Trạng thái</label>
              <select
                name="status"
                value={updateUser.id ? updateUser.status : newUser.status}
                onChange={updateUser.id ? handleUpdateInputChange : handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="active">Hoạt động</option>
                <option value="hidden">Ẩn</option>
              </select>
            </div>
          </div>
        </div>
        {/* Nút hành động */}
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
            {isLoading ? 'Đang xử lý...' : (updateUser.id ? 'Cập nhật' : 'Thêm')}
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
                placeholder="Nội dung tìm kiếm"
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
                <option value="active">Hoạt động</option>
                <option value="hidden">Ẩn</option>
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
                <th>Tên</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Email</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const accountData = account.find((a) => a.id === user.id);
                if (!accountData) return null;
                return (
                  <tr key={user.id} className="border-b border-gray-300">
                    <td>{user.id}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src="https://img.daisyui.com/images/profile/demo/5@94.webp"
                              alt="Avatar Tailwind CSS Component"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="">{user.fullname}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.phone_number}</td>
                    <td>
                      {rules.find((s) => s.id === accountData?.rule)?.name || 'Không tìm thấy'}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`border border-gray-300 rounded-lg px-2 py-1 ${
                          accountData?.status === 'active' ? 'text-green-700' : 'text-red-500'
                        }`}
                      >
                        {accountData?.status === 'active' ? 'Hoạt động' : 'Ẩn'}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-start">
                      <button
                          className="flex w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-black"
                          onClick={() => openEditModal(user)}
                        >
                          <FontAwesomeIcon icon={faEdit} className="text-xl" />
                        </button>
                        <button
                          className="flex w-12 h-12 px-4 py-2 text-base bg-white-500 text-gray-500 hover:text-red-500"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <FontAwesomeIcon icon={faDeleteLeft} className="text-xl" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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

export default UserManagement; 