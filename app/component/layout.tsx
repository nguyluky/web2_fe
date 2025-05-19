import { Link, Outlet, useNavigate, useNavigation, useSearchParams } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';
import { useCart } from '~/contexts/CartContext';
import { useCategories } from '~/contexts/CategoryContext';
import './loading.css';

export function Header() {
    const { isAuthenticated, profile: user, account } = useAuth();
    const { categories, loading } = useCategories();
    const [searchParams, setSearchParams] = useSearchParams();
    const {cartItems} = useCart();
    const navigate = useNavigate();
    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log('handleSearch', e.key);
        const location = window.location.pathname;
        if (e.key === 'Enter') {
            if (location === '/tim-kiem') {
                const value = (e.target as HTMLInputElement).value;
                setSearchParams({ q: value });
            }
            else {
                navigate('/tim-kiem?q=' + (e.target as HTMLInputElement).value);
            }
        }
    };
    return (
        <header className="navbar bg-base-100 shadow-sm sticky top-0 z-50 justify-center flex">
            <div className="navbar-center w-full max-w-[80rem]">
                <div className="navbar-start w-auto">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                        >
                            {loading ? (
                                <li>
                                    <span className="loading loading-spinner loading-sm"></span>
                                </li>
                            ) : (
                                categories.map((category) => (
                                    <li key={category.id}>
                                        <Link to={`/danh-muc/${category.id}`}>{category.name}</Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                    <Link to="/" className="btn btn-ghost text-xl font-bold">
                        TechStore
                    </Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal">
                        {loading ? (
                            <li>
                                <span className="loading loading-spinner loading-sm"></span>
                            </li>
                        ) : (
                            categories.slice(0, 3).map((category) => (
                                <li key={category.id}>
                                    <Link to={`/danh-muc/${category.id}`}>{category.name}</Link>
                                </li>
                            ))
                        )}
                        {categories.length > 5 && (
                            <li>
                                <Link to="/danh-muc">Xem thêm</Link>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="navbar-end flex gap-5 w-full">
                    <label className="input w-full hidden sm:flex max-w-[300px]">
                        <svg
                            className="h-[1em] opacity-50"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input type="search" className="grow" placeholder="Search" onKeyDown={handleSearch}/>
                        <kbd className="kbd kbd-sm">Ctrl</kbd>
                        <kbd className="kbd kbd-sm">/</kbd>
                    </label>
                    <div className="indicator mr-3 sm:mr-0">
                        <span className="indicator-item badge badge-secondary">{cartItems.length}</span>

                        <Link className="btn p-2.5 " to={'/cart'}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-shopping-cart h-5 w-5"
                            >
                                <circle cx="8" cy="21" r="1"></circle>
                                <circle cx="19" cy="21" r="1"></circle>
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                            </svg>
                        </Link>
                    </div>
                    <div className="flex gap-2">
                        {isAuthenticated ? (
                            <>
                                {account?.rule == 1 && (
                                    <Link to="/admin/dashboard" className="btn btn-outline">
                                        GOTO ADMIN
                                    </Link>
                                )}
                                <Link
                                    to="/tai-khoan"
                                    className="btn btn-outline btn-primary hidden sm:flex"
                                >
                                    {user?.fullname || 'undefind'}
                                </Link>
                            </>
                        ) : (
                            <Link to="/auth/login" className="btn btn-primary hidden sm:flex">
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
export function Footer() {
    return (
        <footer className="footer sm:footer-horizontal text-base-content p-10">
            <aside>
                <svg
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    className="fill-current"
                >
                    <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
                </svg>
                <p>
                    ACME Industries Ltd.
                    <br />
                    Providing reliable tech since 1992
                </p>
            </aside>
            <nav>
                <h6 className="footer-title">Services</h6>
                <Link to="/services/branding" className="link link-hover">
                    Branding
                </Link>
                <Link to="/services/design" className="link link-hover">
                    Design
                </Link>
                <Link to="/services/marketing" className="link link-hover">
                    Marketing
                </Link>
                <Link to="/services/advertisement" className="link link-hover">
                    Advertisement
                </Link>
            </nav>
            <nav>
                <h6 className="footer-title">Company</h6>
                <Link to="/company/about" className="link link-hover">
                    About us
                </Link>
                <Link to="/company/contact" className="link link-hover">
                    Contact
                </Link>
                <Link to="/company/jobs" className="link link-hover">
                    Jobs
                </Link>
                <Link to="/company/press" className="link link-hover">
                    Press kit
                </Link>
            </nav>
            <nav>
                <h6 className="footer-title">Legal</h6>
                <Link to="/legal/terms" className="link link-hover">
                    Terms of use
                </Link>
                <Link to="/legal/privacy" className="link link-hover">
                    Privacy policy
                </Link>
                <Link to="/legal/cookies" className="link link-hover">
                    Cookie policy
                </Link>
            </nav>
        </footer>
    );
}

const Loader = () => {
    return (
        <div>
            <div className="loader">
                <svg viewBox="0 0 80 80">
                    <circle r={32} cy={40} cx={40} id="test" />
                </svg>
            </div>
            <div className="loader triangle">
                <svg viewBox="0 0 86 80">
                    <polygon points="43 8 79 72 7 72" />
                </svg>
            </div>
            <div className="loader">
                <svg viewBox="0 0 80 80">
                    <rect height={64} width={64} y={8} x={8} />
                </svg>
            </div>
        </div>
    );
};

export default function Layout() {
    const navigation = useNavigation();
    const isNavigating = Boolean(navigation.location);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                {isNavigating && (
                    <div className="fixed inset-0 bg-base-200 opacity-50 z-50 flex items-center justify-center">
                        <Loader />
                    </div>
                )}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
