import { Link, Outlet, useLocation } from "react-router";
import { useAuth } from "~/contexts/AuthContext";

export default function TaiKhoanLayout() {
    const location = useLocation();
    const path = location.pathname;
    const {logout} = useAuth();
    
    // Kiểm tra đường dẫn hiện tại để xác định tab nào đang active
    const isActive = (route: string) => {
        if (route === '/tai-khoan' && path === '/tai-khoan') {
            return true;
        }
        if (route !== '/tai-khoan' && path.startsWith(route)) {
            return true;
        }
        return false;
    };

    return <>
      <section>
        <div className="hero">
          <div className="hero-content w-full">
            <div className="breadcrumbs text-sm w-full">
              <ul>
                <li>
                  <a>Home</a>
                </li>
                <li>Tài khoản</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="hero">
          <div className="hero-content w-full">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-5 w-full">
              <div className="grid gap-5 h-fit">
                <div className="card border-1 border-base-300">
                  <ul className="menu rounded-box w-full">
                    <li>
                      <Link to={'/tai-khoan'} className={`rounded-lg ${isActive('/tai-khoan') ? 'menu-active' : ''}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-user-round-icon lucide-user-round"
                        >
                          <circle cx="12" cy="8" r="5" />
                          <path d="M20 21a8 8 0 0 0-16 0" />
                        </svg>
                        Thông tin tài khoản
                      </Link>
                    </li>
                    <li>
                      <Link to={'/tai-khoan/don-hang'} className={`rounded-lg ${isActive('/tai-khoan/don-hang') ? 'menu-active' : ''}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-package-icon lucide-package"
                        >
                          <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                          <path d="M12 22V12" />
                          <polyline points="3.29 7 12 12 20.71 7" />
                          <path d="m7.5 4.27 9 5.15" />
                        </svg>
                        Đơn hàng của tôi
                      </Link>
                    </li>
                    <li>
                      <Link to={'/tai-khoan/address'} className={`rounded-lg ${isActive('/tai-khoan/address') ? 'menu-active' : ''}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-map-pin-icon lucide-map-pin"
                        >
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        Địa trỉ giao hàng
                      </Link>
                    </li>
                    <li>
                      <Link to={'/tai-khoan/setting'} className={`rounded-lg ${isActive('/tai-khoan/setting') ? 'menu-active' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-icon lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1-1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1-1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                        Cài đặt tài khoản
                      </Link>
                    </li>
                  </ul>
                  <div className="divider p-0 m-0"></div>
                  <ul className="menu w-full">
                    <li>
                        <div onClick={() => {logout()
                            window.location.href = '/auth/login'
                        }} className="rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out-icon lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                            Đăng xuất
                        </div>
                    </li>
                  </ul>
                </div>
              </div>
              <Outlet/>
            </div>
          </div>
        </div>
      </section>
    </>
}