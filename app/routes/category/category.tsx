import { useState } from 'react';
import type { Route } from './+types/category';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const id = params.id;
  await new Promise((r,l) => {
    setTimeout(r, 1000)
  })
  return {
    id,
  };
}

export async function clientAction() {}

export default function Category({ loaderData }: Route.ComponentProps) {
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
                  <a>Danh mục</a>
                </li>
                <li>{loaderData.id.replaceAll('-', ' ')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="hero">
          <div className="hero-content w-full">
            <div className="relative w-full rounded-lg overflow-hidden">
              <img src="https://placehold.co/1000x400" alt="" className='w-full'/>
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-6 flex flex-col justify-center">
                <h1 className="text-2xl font-bold text-base-100 md:text-3xl lg:text-4xl">
                  Điện thoại
                </h1>
                <p className="text-base-100/70 text-sm md:text-base lg:text-lg max-w-1/2">
                  Khám phá các mẫu điện thoại thông minh mới nhất từ các thương hiệu hàng đầu với đa
                  dạng mức giá.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="hero">
          <div className="hero-content w-full">
            <div className="grid grid-cols-[300px_1fr] gap-4 w-full">
              <div>
                <h2 className="text-2xl font-bold">Bộ lọc</h2>
                <div className="divider m-0"></div>
                <div className="collapse collapse-arrow">
                  <input type="checkbox" className="peer p-0 m-0" />
                  <div className="collapse-title">Hãng</div>
                  <div className="collapse-content">
                    <label className="flex gap-5">
                      <input type="checkbox" name="" id="" className="checkbox" />
                      <span>hello</span>
                    </label>
                  </div>
                </div>
                <div className="divider m-0"></div>
                <div className="collapse collapse-arrow">
                  <input type="checkbox" className="peer p-0 m-0" />
                  <div className="collapse-title">Ram</div>
                  <div className="collapse-content">
                    <label className="flex gap-5">
                      <input type="checkbox" name="" id="" className="checkbox" />
                      <span>hello</span>
                    </label>
                  </div>
                </div>
                <div className="divider m-0"></div>
                <div className="collapse collapse-arrow">
                  <input type="checkbox" className="peer p-0 m-0" />
                  <div className="collapse-title">Bộ nhớ trong</div>
                  <div className="collapse-content">
                    <label className="flex gap-5">
                      <input type="checkbox" name="" id="" className="checkbox" />
                      <span>hello</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {Array(20)
                    .keys()
                    .map(() => (
                      <div
                        className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden"
                        data-v0-t="card"
                      >
                        <a href="/san-pham/iphone-15-pro-max" className="block">
                          <div className="relative aspect-square">
                            <img
                              alt="iPhone 15 Pro Max 256GB"
                              loading="lazy"
                              decoding="async"
                              data-nimg="fill"
                              className="object-cover transition-transform hover:scale-105"
                              src="https://placehold.co/300"
                            />
                            <div
                              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-primary-foreground hover:bg-primary/80 absolute right-2 top-2 bg-red-500"
                              data-v0-t="badge"
                            >
                              -5%
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="space-y-1">
                              <h3 className="line-clamp-2 text-sm font-medium">
                                iPhone 15 Pro Max 256GB
                              </h3>
                              <div className="flex items-center gap-1">
                                <div className="flex">
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
                                    className="lucide lucide-star h-3 w-3 fill-primary text-primary"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                  </svg>
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
                                    className="lucide lucide-star h-3 w-3 fill-primary text-primary"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                  </svg>
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
                                    className="lucide lucide-star h-3 w-3 fill-primary text-primary"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                  </svg>
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
                                    className="lucide lucide-star h-3 w-3 fill-primary text-primary"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                  </svg>
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
                                    className="lucide lucide-star h-3 w-3 fill-primary text-primary"
                                  >
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                  </svg>
                                </div>
                                <span className="text-xs text-muted-foreground">(120)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-primary">32.990.000&nbsp;₫</span>
                                <span className="text-xs text-muted-foreground line-through">
                                  34.990.000&nbsp;₫
                                </span>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                </div>
                <div className="flex justify-center mt-5">
                  <div className="join">
                    <button className="join-item btn">«</button>
                    <button className="join-item btn">Page 22</button>
                    <button className="join-item btn">»</button>
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
