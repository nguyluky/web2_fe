// import type { Route } from "../+types/";

import { Link } from "react-router";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "New React Router App" },
//     { name: "description", content: "Welcome to React Router!" },
//   ];
// }

export default function Category() {
  return (
    <>
      <section>
        <div className="hero">
          <div className="hero-content w-full">
            <div className="breadcrumbs text-sm w-full">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>Danh mục</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="hero">
          <div className="hero-content flex-col">
            <h1 className="text-5xl font-extrabold">Danh mục sản phẩm</h1>
            <p className="text-sm max-w-[700px] text-center text-base-content/70">
              Khám phá đa dạng các sản phẩm công nghệ từ các thương hiệu hàng
              đầu thế giới với chất lượng đảm bảo và giá cả cạnh tranh
            </p>
          </div>
        </div>
      </section>
      <section className="py-8">
        <div className="hero">
          <div className="hero-content w-full flex-col">
            <h2 className="text-2xl font-bold w-full">Danh mục chính</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from(Array(6).keys()).map((_, index) => (
                <div className="card w-fit overflow-hidden">
                  <figure>
                    <img
                      src="https://placehold.co/400x200"
                      alt="Shoes"
                      className="object-cover"
                    />
                  </figure>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex flex-col justify-end">
                    <h2 className="card-title text-primary-content text-xl">
                      placeholder text
                    </h2>
                    <p className="font-light text-base-300">
                      placeholder text placeholder text placeholder text
                      placeholder text placeholder text placeholder text
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-8">
        <div className="hero">
          <div className="hero-content w-full flex-col">
            <h2 className="text-2xl font-bold w-full">Tất cả danh mục</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full">
              {Array.from(Array(20).keys()).map((_, index) => (
                <div className="card w-full overflow-hidden items-center border-1 border-base-300 p-4">
                  <div className="rounded-full bg-muted mb-2 overflow-hidden w-fit">
                    <img src="https://placehold.co/100x100" alt="" />
                  </div>
                  <span className="text-sm font-bold text-center">
                    Điện thoại
                  </span>
                  <p className="text-sm text-base-content/50">100 sản phẩm</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
