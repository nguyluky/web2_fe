export default function Card() {
  return (
    <section>
      <div className="hero">
        <div className="hero-content flex-row w-full">
          <div className="grid grid-cols-1 w-full gap-5 lg:grid-cols-[1fr_300px]">
            <div className="card border-1 border-base-300">
              <div className="card-body">
                <div className="card-title">Sản phẩm</div>
                <div className="">
                  <table className="table table-xs">
                    {/* head */}
                    <thead>
                      <tr>
                        <th>Check</th>
                        <th>Hình ảnh</th>
                        <th>Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>thành tiền</th>
                        <th>xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* row 1 */}
                      <tr>
                        <td>
                            <input type="checkbox" className="checkbox" />
                        </td>
                        <td>
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <img
                                src="https://placehold.co/30"
                                alt="Avatar Tailwind CSS Component"
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          iPhone 15 Pro Max 256GB
                          <br />
                          <span className="badge badge-ghost badge-sm">
                            Titan Tự Nhiên, 256GB
                          </span>
                        </td>
                        <td>32.990.000 ₫</td>
                        <td>
                          <div className="join">
                            <input
                              className="input join-item w-12"
                              type="number"
                              defaultValue={1}
                            />
                          </div>
                        </td>
                        <td>32.990.000 ₫</td>
                        <th>
                          <button className="btn btn-ghost btn-xs">
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
                              className="lucide lucide-trash2-icon lucide-trash-2"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </button>
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="card border-1 border-base-300">
              <div className="card-body">
                <p className="card-title">Mã giảm giá</p>
                <div className="join w-full">
                  <input className="input join-item w-full" placeholder="Mã giảm giá" />
                  <button className="btn btn-primary join-item rounded-r-ms">
                    Áp dụng
                  </button>
                </div>
                <p className="card-title">Tạm tính</p>
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between">
                        <p>Tạm tính</p>
                        <span>32.990.000 ₫</span>
                    </div>
                    <div className="flex justify-between">
                        <p>Giảm giá</p>
                        <span>0 ₫</span>
                    </div>
                    <div className="flex justify-between">
                        <p>Phí vận chuyển</p>
                        <span>0 ₫</span>
                    </div>
                    <div className="divider"></div>
                    <div className="flex justify-between">
                        <p className="font-bold">Tổng cộng</p>
                        <span className="text-xl font-bold">32.990.000 ₫</span>
                    </div>
                </div>
                <button className="btn btn-primary">
                    Mua
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
