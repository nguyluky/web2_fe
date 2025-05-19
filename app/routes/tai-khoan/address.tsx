import { faCheck, faEdit, faMapMarkerAlt, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "~/contexts/AuthContext";
import type { UserAddress } from "~/service/address.service";
import { AddressService, } from "~/service/address.service";

// Khởi tạo service
const addressService = new AddressService();

export default function Address() {
    const { isAuthenticated } = useAuth();
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<UserAddress | null>(null);
    
    // Form state
    const [formData, setFormData] = useState<Omit<UserAddress, "id" | "profile_id">>({
        phone_number: "",
        email: "",
        name: "",
        street: "",
        ward: "",
        district: "",
        city: ""
    });

    // Lấy danh sách Địa chỉ khi component mount
    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        
        fetchAddresses();
    }, [isAuthenticated]);

    // Lấy danh sách Địa chỉ từ API
    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const [response, error] = await addressService.getUserAddress();
            
            if (error) {
                setError("Không thể tải danh sách Địa chỉ");
                return;
            }
            
            setAddresses(response || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching addresses:", err);
            setError("Đã xảy ra lỗi khi tải danh sách Địa chỉ");
        } finally {
            setLoading(false);
        }
    };

    // Xử lý thay đổi form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Xử lý thêm Địa chỉ mới
    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            // Thêm profile_id vào formData khi gửi lên server
            const [response, error] = await addressService.addNewAddress(formData);
            
            if (error) {
                toast.error("Không thể thêm Địa chỉ mới");
                return;
            }
            
            toast.success("Thêm Địa chỉ mới thành công");
            setShowAddForm(false);
            // Reset form
            setFormData({
                phone_number: "",
                email: "",
                name: "",
                street: "",
                ward: "",
                district: "",
                city: ""
            });
            
            // Làm mới danh sách Địa chỉ
            fetchAddresses();
        } catch (err) {
            console.error("Error adding address:", err);
            toast.error("Đã xảy ra lỗi khi thêm Địa chỉ mới");
        } finally {
            setLoading(false);
        }
    };

    // Mở form sửa Địa chỉ
    const handleEditClick = (address: UserAddress) => {
        setCurrentAddress(address);
        setFormData({
            phone_number: address.phone_number,
            email: address.email,
            name: address.name,
            street: address.street,
            ward: address.ward,
            district: address.district,
            city: address.city
        });
        setShowEditForm(true);
    };

    // Xử lý cập nhật Địa chỉ
    const handleUpdateAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentAddress) return;
        
        try {
            setLoading(true);
            
            const [response, error] = await addressService.updateAddress(
                currentAddress.id,
                formData
            );
            
            if (error) {
                toast.error("Không thể cập nhật Địa chỉ");
                return;
            }
            
            toast.success("Cập nhật Địa chỉ thành công");
            setShowEditForm(false);
            // Reset form
            setFormData({
                phone_number: "",
                email: "",
                name: "",
                street: "",
                ward: "",
                district: "",
                city: ""
            });
            setCurrentAddress(null);
            
            // Làm mới danh sách Địa chỉ
            fetchAddresses();
        } catch (err) {
            console.error("Error updating address:", err);
            toast.error("Đã xảy ra lỗi khi cập nhật Địa chỉ");
        } finally {
            setLoading(false);
        }
    };

    // Xử lý xóa Địa chỉ
    const handleDeleteAddress = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa Địa chỉ này không?")) {
            return;
        }
        
        try {
            setLoading(true);
            
            const [response, error] = await addressService.deleteAddress(id);
            
            if (error) {
                toast.error("Không thể xóa Địa chỉ");
                return;
            }
            
            toast.success("Xóa Địa chỉ thành công");
            
            // Làm mới danh sách Địa chỉ
            fetchAddresses();
        } catch (err) {
            console.error("Error deleting address:", err);
            toast.error("Đã xảy ra lỗi khi xóa Địa chỉ");
        } finally {
            setLoading(false);
        }
    };

    // Hủy form
    const handleCancel = () => {
        setShowAddForm(false);
        setShowEditForm(false);
        setFormData({
            phone_number: "",
            email: "",
            name: "",
            street: "",
            ward: "",
            district: "",
            city: ""
        });
        setCurrentAddress(null);
    };

    // Format Địa chỉ đầy đủ
    const formatFullAddress = (address: UserAddress) => {
        return `${address.street}, ${address.ward}, ${address.district}, ${address.city}`;
    };

    return (
        <div className="card border-1 border-base-300">
            <div className="card-body flex-col gap-5">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Địa chỉ giao hàng</h3>
                    {!showAddForm && !showEditForm && (
                        <button 
                            className="btn btn-primary" 
                            onClick={() => setShowAddForm(true)}
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Thêm Địa chỉ mới
                        </button>
                    )}
                </div>
                
                {loading && !showAddForm && !showEditForm ? (
                    <div className="flex justify-center items-center py-8">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : error ? (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                ) : (
                    <>
                        {/* Form thêm Địa chỉ mới */}
                        {showAddForm && (
                            <div className="card bg-base-100 shadow-sm">
                                <div className="card-body">
                                    <h2 className="card-title">Thêm Địa chỉ mới</h2>
                                    <form onSubmit={handleAddAddress}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text">Số điện thoại</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="phone_number"
                                                    value={formData.phone_number}
                                                    onChange={handleChange}
                                                    className="input input-bordered w-full" 
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text">Email</span>
                                                </label>
                                                <input 
                                                    type="email" 
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="input input-bordered w-full" 
                                                    required
                                                />
                                            </div>

                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text">Tên</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="input input-bordered w-full" 
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text">Tỉnh/Thành phố</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className="input input-bordered w-full" 
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text">Quận/Huyện</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="district"
                                                    value={formData.district}
                                                    onChange={handleChange}
                                                    className="input input-bordered w-full" 
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text">Phường/Xã</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="ward"
                                                    value={formData.ward}
                                                    onChange={handleChange}
                                                    className="input input-bordered w-full" 
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="form-control w-full md:col-span-2">
                                                <label className="label">
                                                    <span className="label-text">Địa chỉ cụ thể</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="street"
                                                    value={formData.street}
                                                    onChange={handleChange}
                                                    className="input input-bordered w-full" 
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                type="button" 
                                                className="btn btn-ghost" 
                                                onClick={handleCancel}
                                            >
                                                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                                Hủy
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary" 
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                ) : (
                                                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                                                )}
                                                Lưu Địa chỉ
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        
                        {/* Form sửa Địa chỉ */}
                        {showEditForm && currentAddress && (
                            <div className="card bg-base-100 shadow-sm">
                                <div className="card-body">
                                    <h2 className="card-title">Cập nhật Địa chỉ</h2>
                                    <form onSubmit={handleUpdateAddress}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text">Số điện thoại</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="phone_number"
                                                    value={formData.phone_number}
                                                    onChange={handleChange}
                                                    className="input input-bordered w-full" 
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text">Email</span>
                                                </label>
                                                <input 
                                                    type="email" 
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="input input-bordered w-full" 
                                                    required
                                                />
                                            </div>

                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text">Tên</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="input input-bordered w-full" 
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text">Tỉnh/Thành phố</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className="input input-bordered w-full" 
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text">Quận/Huyện</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="district"
                                                    value={formData.district}
                                                    onChange={handleChange}
                                                    className="input input-bordered w-full" 
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="form-control w-full">
                                                <label className="label">
                                                    <span className="label-text">Phường/Xã</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="ward"
                                                    value={formData.ward}
                                                    onChange={handleChange}
                                                    className="input input-bordered w-full" 
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="form-control w-full md:col-span-2">
                                                <label className="label">
                                                    <span className="label-text">Địa chỉ cụ thể</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="street"
                                                    value={formData.street}
                                                    onChange={handleChange}
                                                    className="input input-bordered w-full" 
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                type="button" 
                                                className="btn btn-ghost" 
                                                onClick={handleCancel}
                                            >
                                                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                                Hủy
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="btn btn-primary" 
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                ) : (
                                                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                                                )}
                                                Cập nhật
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        
                        {/* Danh sách Địa chỉ */}
                        {!showAddForm && !showEditForm && (
                            <>
                                {addresses.length === 0 ? (
                                    <div className="alert alert-info">
                                        <div>
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                                            <span>Bạn chưa có Địa chỉ giao hàng nào. Vui lòng thêm Địa chỉ mới.</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map(address => (
                                            <div key={address.id} className="card bg-base-100 shadow-sm">
                                                <div className="card-body">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex gap-2 items-center">
                                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                                                            <h3 className="font-semibold">Địa chỉ #{address.id}</h3>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                className="btn btn-sm btn-ghost" 
                                                                onClick={() => handleEditClick(address)}
                                                            >
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-ghost text-error" 
                                                                onClick={() => handleDeleteAddress(address.id)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="divider my-1"></div>
                                                    <p><strong>Số điện thoại:</strong> {address.phone_number}</p>
                                                    <p><strong>Email:</strong> {address.email}</p>
                                                    <p><strong>Tên:</strong> {address.name}</p>
                                                    <p><strong>Địa chỉ:</strong> {formatFullAddress(address)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}