import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function Header() {
  return (
    <header className="navbar bg-base-100 shadow-sm">
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
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl font-bold">codelỏ</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal">
          <li>
            <a href="/danh-muc/dien-thoai">Điện thoại</a>
          </li>
          <li>
            <a href="/danh-muc/laptop">Laptop</a>
          </li>
          <li>
            <a href="/danh-muc/may-tinh-bang">Máy tính bảng</a>
          </li>
          <li>
            <a href="/danh-muc/man-hinh">Màn hình</a>
          </li>

          <li>
            <a href="/danh-muc/phu-kien">Phụ kiện</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end flex gap-5 w-full">
        <label className="input w-full hidden sm:flex">
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
          <input type="search" className="grow" placeholder="Search" />
          <kbd className="kbd kbd-sm">Ctrl</kbd>
          <kbd className="kbd kbd-sm">/</kbd>
        </label>
        <div className="indicator">
          <span className="indicator-item badge badge-secondary">0</span>

          <button className="btn p-2.5">
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
          </button>
        </div>
        <a className="btn btn-primary">Đăng nhập</a>
      </div>
    </header>
  );
}

function Footer() {
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
        <a className="link link-hover">Branding</a>
        <a className="link link-hover">Design</a>
        <a className="link link-hover">Marketing</a>
        <a className="link link-hover">Advertisement</a>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        <a className="link link-hover">Press kit</a>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
        <a className="link link-hover">Cookie policy</a>
      </nav>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <section>
        <div className="hero">
          <div className="hero-content">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="badge badge-primary">Khuyễn mãi đặp biệt</div>
                  <h1 className="text-3xl font-extrabold tracking-tighter">
                    Công nghệ mới nhất với giá tốt nhất
                  </h1>
                  <p>
                    Khám phá các sản phẩm công nghệ hàng đầu với ưu đãi độc
                    quyền chỉ có tại TechStore
                  </p>
                </div>
                <div className="flex gap-2 flex-col sm:flex-row">
                  <button className="btn btn-primary">Mua ngay</button>
                  <button className="btn">Xem thêm</button>
                </div>
              </div>
              <div>
                <img
                  src="https://placehold.co/600x400"
                  alt="hero img"
                  className="object-cover rounded-sm"
                  style={{ height: "300px", width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-8 bg-base-200">
        <div className="hero">
          <div className="hero-content w-full flex-col">
            <div className="navbar">
              <div className="w-full">
                <h2 className="text-2xl font-bold">Danh mục sản phẩm</h2>
              </div>
              <div className="min-w-max">
                <a className="link">Xem tất cả{">"}</a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-4 lg:grid-cols-5">
              {Array(5)
                .keys()
                .map((_, index) => (
                  <a
                    key={index}
                    className="flex flex-col items-center justify-center rounded-lg bg-primary-content p-4 transition-colors hover:bg-gray-200"
                  >
                    <div className="rounded-full bg-muted m-2 overflow-hidden">
                      <img src="https://placehold.co/100x100" alt="" />
                    </div>
                    <span className="text-sm font-bold text-center">
                      Điện thoại
                    </span>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-8">
        <div className="hero">
          <div className="hero-content w-full flex-col">
            <div className="navbar">
              <div className="w-full">
                <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
              </div>
              <div className="min-w-max">
                <a className="link">Xem tất cả{">"}</a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-4 lg:grid-cols-5">
              {Array(10)
                .keys()
                .map((_, index) => (
                  <div key={index} className="card shadow-sm bg-base-100">
                    <figure>
                      <img src="https://placehold.co/600x400" alt="Shoes" />
                    </figure>
                    <div className="card-body p-4">
                      <h2 className="card-title">Card Title</h2>
                      <div className="flex">
                        <div className="rating rating-xs">
                          <div
                            className="mask mask-star"
                            aria-label="1 star"
                          ></div>
                          <div
                            className="mask mask-star"
                            aria-label="2 star"
                          ></div>
                          <div
                            className="mask mask-star"
                            aria-label="3 star"
                            aria-current="true"
                          ></div>
                          <div
                            className="mask mask-star"
                            aria-label="4 star"
                          ></div>
                          <div
                            className="mask mask-star"
                            aria-label="5 star"
                          ></div>
                        </div>
                        <p>{"(20)"}</p>
                      </div>
                      <div className="flex gap-2">
                        <p className="text-lg font-bold">1.000.000đ</p>
                        <p className="text-sm text-gray-500 line-through">
                          2.000.000đ
                        </p>
                      </div>

                      <button className="btn btn-primary">Buy Now</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-8 bg-base-200">
        <div className="hero">
          <div className="hero-content flex-col w-full">
            <div className="navbar">
              <div className="w-full">
                <h2 className="text-2xl font-bold">Ưu đãi đặc biệt</h2>
              </div>
              <div className="min-w-max">
                <a className="link">Xem tất cả{">"}</a>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="card w-fit overflow-hidden">
                <figure>
                  <img
                    src="https://placehold.co/500x600"
                    alt="Shoes"
                    className="object-cover"
                  />
                </figure>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-6 flex flex-col justify-end">
                  <div className="badge badge-primary">Giảm giá lớn</div>
                  <h2 className="card-title text-primary-content">
                    Card Title
                  </h2>
                  <p className="font-light text-secondary-content">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Repudiandae, cumque.
                  </p>
                  <button className="btn btn-primary mt-4">Buy Now</button>
                </div>
              </div>
              <div className="card w-fit overflow-hidden">
                <figure>
                  <img
                    src="https://placehold.co/500x600"
                    alt="Shoes"
                    className="object-cover"
                  />
                </figure>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-6 flex flex-col justify-end">
                  <div className="badge badge-primary">Giảm giá lớn</div>
                  <h2 className="card-title text-primary-content">
                    Card Title
                  </h2>
                  <p className="font-light text-secondary-content">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Repudiandae, cumque.
                  </p>
                  <button className="btn btn-primary mt-4">Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
