export default function ThanhToan() {
  return (
    <>
      <section>
        <div className="hero">
          <div className="hero-content w-full">
            <div className="breadcrumbs text-sm w-full">
              <ul>
                <li>
                  <a>Home</a>
                </li>
                <li>
                  <a>Giỏ hàng</a>
                </li>
                <li>Thanh toán</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="hero">
          <div className="hero-content w-full">
            <div className="grid grid-cols-[1fr_450px] w-full gap-5">
              <div className="flex flex-col gap-5">
                <div className="card border-1 border-base-300">
                  <div className="card-body">
                    <div className="card-title">
                      <h2 className="text-2xl">Thông tin giao hàng</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            // for="first-name"
                          >
                            Họ
                          </label>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="first-name"
                            placeholder="Nhập họ"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            // form="last-name"
                          >
                            Tên
                          </label>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="last-name"
                            placeholder="Nhập tên"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          //   for="email"
                        >
                          Email
                        </label>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          id="email"
                          placeholder="Nhập email"
                          //   type="email"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          //   for="phone"
                        >
                          Số điện thoại
                        </label>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          id="phone"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          //   for="address"
                        >
                          Địa chỉ
                        </label>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          id="address"
                          placeholder="Nhập địa chỉ"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            // for="city"
                          >
                            Tỉnh/Thành phố
                          </label>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="city"
                            placeholder="Nhập tỉnh/thành phố"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            // for="district"
                          >
                            Quận/Huyện
                          </label>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="district"
                            placeholder="Nhập quận/huyện"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            // for="ward"
                          >
                            Phường/Xã
                          </label>
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="ward"
                            placeholder="Nhập phường/xã"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card border-1 border-base-300">
                  <div className="card-body h-full">
                    <div className="card-title">
                      <h2 className="text-2xl">Phương thức thanh toán</h2>
                    </div>
                    <div className="tabs tabs-box flex justify-center bg-transparent">
                      <input
                        type="radio"
                        name="my_tabs_6"
                        className="tab checked:bg-red-50"
                        aria-label="Tiền mặt"
                      />
                      <div className="tab-content">Tiền mặt</div>

                      <input
                        type="radio"
                        name="my_tabs_6"
                        className="tab"
                        aria-label="Thẻ tín dụng"
                        defaultChecked
                      />
                      <div className="tab-content"></div>

                      <input
                        type="radio"
                        name="my_tabs_6"
                        className="tab"
                        aria-label="Chuyển khoản"
                      />
                      <div className="tab-content">Tab content 3</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="card border-1 border-base-300 h-fit">
                  <div className="card-body">
                    <div className="card-title">
                      <h2 className="text-2xl">Đơn hàng của bạn</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                          <img
                            alt="iPhone 15 Pro Max 256GB"
                            loading="lazy"
                            decoding="async"
                            data-nimg="fill"
                            className="object-cover"
                            src="https://placehold.co/100"
                            style={{
                              position: 'absolute',
                              height: '100%',
                              width: '100%',
                              inset: 0,
                              color: 'transparent',
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">iPhone 15 Pro Max 256GB</div>
                          <div className="text-sm text-muted-foreground">Titan Tự Nhiên, 256GB</div>
                          <div className="mt-1 text-sm">1 x 32.990.000&nbsp;₫</div>
                        </div>
                        <div className="font-medium">32.990.000&nbsp;₫</div>
                      </div>
                      <div className="flex gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                          <img
                            alt="Tai nghe AirPods Pro 2"
                            loading="lazy"
                            decoding="async"
                            data-nimg="fill"
                            className="object-cover"
                            src="https://placehold.co/100"
                            style={{
                              position: 'absolute',
                              height: '100%',
                              width: '100%',
                              inset: 0,
                              color: 'transparent',
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Tai nghe AirPods Pro 2</div>
                          <div className="text-sm text-muted-foreground">Trắng</div>
                          <div className="mt-1 text-sm">1 x 5.990.000&nbsp;₫</div>
                        </div>
                        <div className="font-medium">5.990.000&nbsp;₫</div>
                      </div>
                    </div>
                    <div className="divider"></div>
                    <div>
                      <div className="flex justify-between">
                        <div className="text-medium text-primary/50">Tạm tính</div>
                        <div className="font-medium">38.980.000&nbsp;₫</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-medium text-primary/50">Phí vận chuyển</div>
                        <div className="font-medium">0&nbsp;₫</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-medium text-primary/50">Giảm giá</div>
                        <div className="font-medium">0&nbsp;₫</div>
                      </div>
                    </div>
                    <div className="divider"></div>
                    <div className="flex justify-between">
                      <div className="text-lg font-medium">Tổng cộng</div>
                      <div className="text-lg font-medium">38.980.000&nbsp;₫</div>
                    </div>
                    <button className="btn btn-primary btn-lg">Đặt hàng</button>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
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
                        className="lucide lucide-shield-check h-4 w-4"
                      >
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                      <span>Thanh toán an toàn &amp; bảo mật</span>
                    </div>
                  </div>
                </div>
                <div className="card border-1 border-base-300">
                  <div className="card-body">
                    <div className="card-title">
                      <h2 className="text-2xl">Cần hỗ trợ?</h2>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p>Nếu bạn có câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ:</p>
                      <p>Hotline: 1900 1234</p>
                      <p>Email: hotro@techstore.vn</p>
                      <p>Thời gian hỗ trợ: 8:00 - 22:00 (Thứ 2 - Chủ nhật)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
