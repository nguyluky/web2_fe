import { Link } from 'react-router';
import May_tinh_ban from '~/asset/img/May_tinh_ban.png';
import Phone from '~/asset/img/Phone.png';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export async function clientLoader({}) {
  // load danh muc
  return {
    title: 'Home',
    description: 'Welcome to React Router!',
  };
}

const categories = [
  { id: 1, name: 'Điện thoại', image: Phone },
  { id: 5, name: 'Máy tính', image: May_tinh_ban },
  { id: 2, name: 'Máy tính bảng', image: 'https://placehold.co/100x100' },
  { id: 3, name: 'Laptop', image: 'https://placehold.co/100x100' },
  { id: 4, name: 'Phụ kiện', image: 'https://placehold.co/100x100' },
];

export default function Home() {


  return (
    <>
      <section id="hero">
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
                    Khám phá các sản phẩm công nghệ hàng đầu với ưu đãi độc quyền chỉ có tại
                    TechStore
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
                  style={{ height: '300px', width: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-8 bg-base-200" id="category">
        <div className="hero">
          <div className="hero-content w-full flex-col">
            <div className="navbar">
              <div className="w-full">
                <h2 className="text-2xl font-bold">Danh mục sản phẩm</h2>
              </div>
              <div className="min-w-max">
                <Link className="link" to="/danh-muc">
                  Xem tất cả{'>'}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-4 lg:grid-cols-5">
              {categories.map((_, index) => (
                <Link
                  to={`/danh-muc/${_.id}`}
                  key={index}
                  className="flex flex-col items-center justify-center rounded-lg p-4 transition-colors hover:bg-base-100 shadow-sm bg-base-300"
                >
                  <div className="rounded-full bg-muted m-2 overflow-hidden">
                    <img height={100} width={100} src={_.image} alt={_.name} />
                  </div>
                  <span className="text-sm font-bold text-center">{_.name}</span>
                </Link>
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
                <Link to="" className="link">
                  Xem tất cả{'>'}
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-4 lg:grid-cols-5">
              {Array.from(Array(10).keys()).map((_, index) => (
                <div key={index} className="card shadow-sm bg-base-300">
                  <figure>
                    <img src="https://placehold.co/600x400" alt="Shoes" />
                  </figure>
                  <div className="card-body p-4">
                    <h2 className="card-title">Card Title</h2>
                    <div className="flex">
                      <div className="rating rating-xs">
                        <div className="mask mask-star" aria-label="1 star"></div>
                        <div className="mask mask-star" aria-label="2 star"></div>
                        <div
                          className="mask mask-star"
                          aria-label="3 star"
                          aria-current="true"
                        ></div>
                        <div className="mask mask-star" aria-label="4 star"></div>
                        <div className="mask mask-star" aria-label="5 star"></div>
                      </div>
                      <p>{'(20)'}</p>
                    </div>
                    <div className="flex gap-2 flex-col xl:flex-row">
                      <p className="text-lg font-bold">1.000.000đ</p>
                      <p className="text-sm text-gray-500 line-through">2.000.000đ</p>
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
                <Link to="" className="link">
                  Xem tất cả{'>'}
                </Link>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="card w-fit overflow-hidden">
                <figure>
                  <img src="https://placehold.co/500x600" alt="Shoes" className="object-cover" />
                </figure>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-6 flex flex-col justify-end">
                  <div className="badge badge-primary">Giảm giá lớn</div>
                  <h2 className="card-title text-primary-content">Card Title</h2>
                  <p className="font-light text-secondary-content">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae, cumque.
                  </p>
                  <button className="btn btn-primary mt-4">Buy Now</button>
                </div>
              </div>
              <div className="card w-fit overflow-hidden">
                <figure>
                  <img src="https://placehold.co/500x600" alt="Shoes" className="object-cover" />
                </figure>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-6 flex flex-col justify-end">
                  <div className="badge badge-primary">Giảm giá lớn</div>
                  <h2 className="card-title text-primary-content">Card Title</h2>
                  <p className="font-light text-secondary-content">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae, cumque.
                  </p>
                  <button className="btn btn-primary mt-4">Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
