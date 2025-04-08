import type { Route } from './+types/san-pham';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = params.id;
  return {
    id,
  };
}

export async function clientAction() {}
export default function SanPham() {
  return (
    <>
      <section>
        <div className="hero">
          <div className="hero-content w-full pb-0">
            <div className="breadcrumbs text-sm w-full">
              <ul>
                <li>
                  <a>Home</a>
                </li>
                <li>
                  <a>Điện thoại</a>
                </li>
                <li>Iphone 20</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="hero">
          <div className="hero-content">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <img
                  src="https://placehold.co/600x600"
                  alt=""
                  className="w-full aspect-square rounded-lg"
                />
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <img src="https://placehold.co/200" alt="" className="rounded-lg" />
                  <img src="https://placehold.co/200" alt="" className="rounded-lg" />
                  <img src="https://placehold.co/200" alt="" className="rounded-lg" />
                </div>
              </div>
              <div className="">
                <h2 className="text-3xl font-extrabold">iPhone 15 Pro Max 256GB</h2>
                <div className="flex gap-4">
                  <div className="rating rating-xs">
                    <div className="mask mask-star" aria-label="1 star"></div>
                    <div className="mask mask-star" aria-label="2 star"></div>
                    <div className="mask mask-star" aria-label="3 star" aria-current="true"></div>
                    <div className="mask mask-star" aria-label="4 star"></div>
                    <div className="mask mask-star" aria-label="5 star"></div>
                  </div>
                  <p className="text-primary/50 text-sm">{'(100 đáng giá)'}</p>
                  <p className="text-primary/50 text-sm">{'Đã bán: 100'}</p>
                </div>
                <div className="my-4">
                  <div className="flex">
                    <p className="text-3xl font-bold">32.990.000 ₫</p>
                    <p className="text-sm text-primary/50 line-through ml-4">35.000.000 ₫</p>
                  </div>
                  <div className="badge badge-outline badge-error">
                    <p className="text-base">Tính kiệm 2.000.000 ₫</p>
                  </div>
                </div>
                <div className="divider"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label>Màu sắc</label>
                    <div className="flex gap-4">
                      <input
                        type="radio"
                        name="radio-12"
                        defaultChecked
                        className="checkbox bg-blue-100 border-blue-300 checked:bg-blue-200 checked:text-blue-600 checked:border-blue-600"
                      />
                      <input
                        type="radio"
                        name="radio-12"
                        defaultChecked
                        className="checkbox bg-red-100 border-red-300 checked:bg-red-200 checked:text-red-600 checked:border-red-600"
                      />
                      <input
                        type="radio"
                        name="radio-12"
                        defaultChecked
                        className="checkbox bg-green-100 border-green-300 checked:bg-green-200 checked:text-green-600 checked:border-green-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label>Bộ nhớ</label>
                    <div className="flex gap-2 flex-wrap">
                      <label className="btn btn-sm btn-outline has-[*:checked]:bg-primary has-[*:checked]:text-primary-content">
                        <input type="radio" name="radio-ram" defaultChecked className="hidden" />
                        256GB
                      </label>
                      <label className="btn btn-sm btn-outline has-[*:checked]:bg-primary has-[*:checked]:text-primary-content">
                        <input type="radio" name="radio-ram" defaultChecked className="hidden" />
                        256GB
                      </label>
                      <label className="btn btn-sm btn-outline has-[*:checked]:bg-primary has-[*:checked]:text-primary-content">
                        <input type="radio" name="radio-ram" defaultChecked className="hidden" />
                        256GB
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <label>Số lượng</label>
                  <div className="flex gap-2 items-center">
                    <div className="join">
                      <button className="btn btn-sm border-1 border-base-300 rounded-l-md">
                        -
                      </button>
                      <input
                        type="number"
                        defaultValue={1}
                        className="input input-sm input-bordered w-10 text-center"
                      />
                      <button className="btn btn-sm border-1 border-base-300 rounded-r-md">
                        +
                      </button>
                    </div>
                    <p className="text-sm text-primary/50">50 sản phẩm có sẵn</p>
                  </div>
                </div>
                <div className="divider"></div>
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <button className="btn btn-primary">Mua</button>
                  <button className="btn btn-soft">
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
                  <button className="btn btn-square">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      className="size-[1.2em]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 mt-5">
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center ">
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
                        className="lucide lucide-truck-icon lucide-truck"
                      >
                        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                        <path d="M15 18H9" />
                        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                        <circle cx="17" cy="18" r="2" />
                        <circle cx="7" cy="18" r="2" />
                      </svg>
                    </div>
                    <div>
                      <div></div>Miễn phí vận chuyển
                      <div className="text-xs uppercase font-semibold opacity-60">
                        Cho đơn hàng từ 500.000đ
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="hero">
          <div className="hero-content w-full">
            {/* name of each tab group should be unique */}
            <div className="tabs tabs-lift w-full">
              <input type="radio" name="my_tabs_3" className="tab" aria-label="Mô tả sản phẩm" />
              <div className="tab-content bg-base-100 border-base-300 p-6">
                <div className="prose max-w-none">
                  <h3>Giới thiệu iPhone 15 Pro Max 256GB</h3>
                  <p>
                    iPhone 15 Pro Max 256GB là sản phẩm mới nhất của Apple, mang đến trải nghiệm
                    người dùng tuyệt vời với hiệu năng mạnh mẽ và thiết kế sang trọng.
                  </p>
                  <p>
                    Với màn hình Super Retina XDR OLED 6.7 inch, 120Hz, iPhone 15 Pro Max 256GB cho
                    hình ảnh sắc nét, màu sắc sống động. Bộ vi xử lý Apple A17 Pro mang lại hiệu
                    năng vượt trội, xử lý mọi tác vụ một cách mượt mà.
                  </p>
                  <p>
                    Camera 48MP + 12MP + 12MP cho phép bạn chụp những bức ảnh chất lượng cao trong
                    mọi điều kiện ánh sáng. Pin 4422 mAh giúp thiết bị hoạt động liên tục cả ngày
                    dài.
                  </p>
                  <h3>Tính năng nổi bật</h3>
                  <ul>
                    <li>Màn hình Super Retina XDR OLED 6.7 inch, 120Hz</li>
                    <li>Bộ vi xử lý Apple A17 Pro</li>
                    <li>Camera 48MP + 12MP + 12MP</li>
                    <li>Pin 4422 mAh</li>
                    <li>Bộ nhớ RAM 8GB</li>
                  </ul>
                </div>
              </div>

              <input
                type="radio"
                name="my_tabs_3"
                className="tab"
                aria-label="Thông số kỹ thuật"
                defaultChecked
              />
              <div className="tab-content bg-base-100 border-base-300 p-6">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b last:border-b-0">
                      <td className="bg-muted/50 p-3 font-medium capitalize">display</td>
                      <td className="p-3">Super Retina XDR OLED 6.7 inch, 120Hz</td>
                    </tr>
                    <tr className="border-b last:border-b-0">
                      <td className="bg-muted/50 p-3 font-medium capitalize">processor</td>
                      <td className="p-3">Apple A17 Pro</td>
                    </tr>
                    <tr className="border-b last:border-b-0">
                      <td className="bg-muted/50 p-3 font-medium capitalize">ram</td>
                      <td className="p-3">8GB</td>
                    </tr>
                    <tr className="border-b last:border-b-0">
                      <td className="bg-muted/50 p-3 font-medium capitalize">storage</td>
                      <td className="p-3">256GB</td>
                    </tr>
                    <tr className="border-b last:border-b-0">
                      <td className="bg-muted/50 p-3 font-medium capitalize">camera</td>
                      <td className="p-3">48MP + 12MP + 12MP</td>
                    </tr>
                    <tr className="border-b last:border-b-0">
                      <td className="bg-muted/50 p-3 font-medium capitalize">frontCamera</td>
                      <td className="p-3">12MP</td>
                    </tr>
                    <tr className="border-b last:border-b-0">
                      <td className="bg-muted/50 p-3 font-medium capitalize">battery</td>
                      <td className="p-3">4422 mAh</td>
                    </tr>
                    <tr className="border-b last:border-b-0">
                      <td className="bg-muted/50 p-3 font-medium capitalize">os</td>
                      <td className="p-3">iOS 17</td>
                    </tr>
                    <tr className="border-b last:border-b-0">
                      <td className="bg-muted/50 p-3 font-medium capitalize">weight</td>
                      <td className="p-3">221g</td>
                    </tr>
                    <tr className="border-b last:border-b-0">
                      <td className="bg-muted/50 p-3 font-medium capitalize">dimensions</td>
                      <td className="p-3">159.9 x 76.7 x 8.25 mm</td>
                    </tr>
                    <tr className="border-b last:border-b-0">
                      <td className="bg-muted/50 p-3 font-medium capitalize">connectivity</td>
                      <td className="p-3">5G, Wi-Fi 6E, Bluetooth 5.3, NFC</td>
                    </tr>
                    <tr className="border-b last:border-b-0">
                      <td className="bg-muted/50 p-3 font-medium capitalize">waterResistance</td>
                      <td className="p-3">IP68</td>
                    </tr>
                    <tr className="border-b last:border-b-0">
                      <td className="bg-muted/50 p-3 font-medium capitalize">security</td>
                      <td className="p-3">Face ID</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <input type="radio" name="my_tabs_3" className="tab" aria-label="Đánh giá (100)" />
              <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
