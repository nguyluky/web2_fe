import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
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
    return (
        <div className="card border-1 border-base-300">
            <div className="card-body flex-col gap-5">
                <div>
                    <h3 className="text-xl font-bold">Thông tin cá nhân</h3>
                    <p className="text-sm text-primary/50">Cập nhật thông tin cá nhân</p>
                </div>
                <div className="flex gap-5 items-center">
                    <div className="avatar">
                        <div className="w-24 rounded-full">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <div>
                        <div className="text-xl font-bold">{profile.fullname}</div>
                        {/* <p className="text-sm text-primary/50">Thành viên từ tháng 5, 2003</p> */}
                        {/* <div className="flex">
                            <div className="badge badge-soft badge-primary">Rank đồng</div>
                        </div> */}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <label className="w-full">
                        <span>Họ và tên</span>
                        <input type="text" className="input w-full" defaultValue={profile.fullname} />
                    </label>
                    <label className="w-full">
                        <span>Email</span>
                        <input type="text" className="input w-full" defaultValue={'Nguyễn Văn A'} />
                    </label>
                    <label className="w-full">
                        <span>Số điện thoại</span>
                        <input type="text" className="input w-full" defaultValue={'Nguyễn Văn A'} />
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
                                onSelect={(e) => setDate(e || null)}
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
                    <button className="btn btn-primary w-full lg:w-fit">Cập nhật</button>
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
