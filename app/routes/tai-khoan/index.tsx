import { useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { toast } from 'react-toastify';
import { ProfileService, type getProfileResponse } from '~/service/profile.service';
import type { Route } from './+types';

const profileService = new ProfileService();

export async function clientLoader() {
    const [data, error] = await profileService.getProfile();

    return {
        profile: data?.data,
        error,
    };
}

function ThongTin({profile}: {profile: getProfileResponse['data']}) {
    const [profileData, setProfileData] = useState(profile);
    const [date, setDate] = useState<Date>(new Date());
    const [cloneData, setCloneData] = useState(profile);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(profileData.avatar_url || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleSave = async () => {
        const [data, error] = await profileService.updateProfile({
            fullname: profileData.fullname,
            email: profileData.email,
            phone_number: profileData.phone_number,
        });

        if (error) {
            toast.error('Cập nhật thông tin thất bại');
            return;
        }

        toast.success('Cập nhật thông tin thành công');
        console.log(data);
        if (data) 
            setProfileData(data.data);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCloneData({
            ...cloneData,
            [e.target.name]: e.target.value,
        });
    };
    
    const openFileSelector = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };
    
    const handleUploadAvatar = async () => {
        if (!selectedFile) return;
        
        setUploading(true);
        try {
            const [data, error] = await profileService.uploadAvatar(selectedFile);
            
            if (error) {
                toast.error('Cập nhật ảnh đại diện thất bại');
                return;
            }
            
            if (data) {
                setProfileData(data.data);
                toast.success('Cập nhật ảnh đại diện thành công');
                setIsModalOpen(false);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật ảnh đại diện');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="card border-1 border-base-300">
            <div className="card-body flex-col gap-5">
                <div>
                    <h3 className="text-xl font-bold">Thông tin cá nhân</h3>
                    <p className="text-sm text-primary/50">Cập nhật thông tin cá nhân</p>
                </div>
                <div className="flex gap-5 items-center">
                    <div className="avatar cursor-pointer relative group" onClick={() => setIsModalOpen(true)}>
                        <div className="w-24 rounded-full overflow-hidden">
                            <img src={profileData.avatar_url} alt="Avatar" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs font-medium">Thay đổi</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-xl font-bold">{profileData.fullname}</div>
                        {/* <p className="text-sm text-primary/50">Thành viên từ tháng 5, 2003</p> */}
                        {/* <div className="flex">
                            <div className="badge badge-soft badge-primary">Rank đồng</div>
                        </div> */}
                    </div>
                </div>
                
                {/* Avatar Upload Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full">
                            <h3 className="text-xl font-bold mb-4">Cập nhật ảnh đại diện</h3>
                            
                            <div className="flex flex-col items-center justify-center mb-4">
                                <div className="avatar mb-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden">
                                        <img src={previewImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} 
                                             alt="Avatar preview" 
                                             className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                
                                <button 
                                    className="btn btn-outline mb-2"
                                    onClick={openFileSelector}
                                >
                                    Chọn ảnh
                                </button>
                                
                                <p className="text-sm text-gray-500 mb-4">Hỗ trợ định dạng: JPG, PNG, GIF (tối đa 5MB)</p>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <button 
                                    className="btn" 
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Hủy
                                </button>
                                <button 
                                    className="btn btn-primary"
                                    onClick={handleUploadAvatar}
                                    disabled={!selectedFile || uploading}
                                >
                                    {uploading ? (
                                        <>
                                            <span className="loading loading-spinner"></span>
                                            Đang tải lên...
                                        </>
                                    ) : 'Cập nhật'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <label className="w-full">
                        <span>Họ và tên</span>
                        <input type="text" className="input w-full" defaultValue={cloneData.fullname} name='fullname' onChange={handleChange}/>
                    </label>
                    <label className="w-full">
                        <span>Email</span>
                        <input type="text" className="input w-full" defaultValue={cloneData.email} name='email' onChange={handleChange}/>
                    </label>
                    <label className="w-full">
                        <span>Số điện thoại</span>
                        <input type="text" className="input w-full" defaultValue={cloneData.phone_number} name='phone_number' onChange={handleChange}/>
                    </label>
                    <label className="w-full">
                        <span>Ngày sinh</span>
                        <button
                            popoverTarget="rdp-popover"
                            className="input input-border w-full"
                            style={{ anchorName: '--rdp' } as React.CSSProperties}
                        >
                            {date ? date.toLocaleDateString() : 'Pick a date'}
                        </button>
                        <div
                            popover="auto"
                            id="rdp-popover"
                            className="dropdown"
                            style={{ positionAnchor: '--rdp' } as React.CSSProperties}
                        >
                            <DayPicker
                                className="react-day-picker"
                                mode="single"
                                selected={date || new Date()}
                                onSelect={(e) => setDate(e || new Date())}
                            />
                        </div>
                    </label>
                    <label>
                        <span>Gới tính</span>
                        <select defaultValue="Pick a font" className="select w-full">
                            <option>Nam</option>
                            <option>Nữ</option>
                        </select>
                    </label>
                </div>
                <div className="flex w-full justify-end">
                    <button className="btn btn-primary w-full lg:w-fit" onClick={handleSave}>Cập nhật</button>
                </div>
            </div>
        </div>
    );
}

export default function TaiKhoan({loaderData}: Route.ComponentProps) {

    const { profile, error } = loaderData;

    if (!profile) {
        return (
            <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-bold h-fit">Thông tin tài khoản</h3>
                <div className="alert alert-error shadow-lg">
                    <div>
                        <span>Không thể tải thông tin tài khoản</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold h-fit">Thông tin tài khoản</h3>
            <ThongTin profile={profile}/>
            <div className="card border-1 border-base-300">
                <div className="card-body">
                    <div>
                        <h3 className="text-xl font-bold">Thông tin cá nhân</h3>
                        <p className="text-sm text-primary/50">Cập nhật thông tin cá nhân</p>
                    </div>

                    <label>
                        <span>Mật khẩu hiện tại</span>
                        <input type="text" className="input w-full" />
                    </label>

                    <label>
                        <span>Mật khẩu mới</span>
                        <input type="text" className="input w-full" />
                    </label>

                    <label>
                        <span>Xác nhận mật khẩu mới</span>
                        <input type="text" className="input w-full" />
                    </label>

                    <div className="flex w-full justify-end">
                        <button className="btn btn-primary w-full lg:w-fit">Cập nhật</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
