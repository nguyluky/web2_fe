import { useState } from 'react';
import { categoryService } from '~/service/category.service';
import type { SearchProductsPagination } from '~/service/products.service';
import { productsService } from '~/service/products.service';
import type { Route } from './+types/category';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const [filter, error] = await categoryService.getFilterCategory(Number(params.id));
    const [categorie, error2] = await categoryService.getCategory(Number(params.id));
    const [products, error3] = await productsService.searchProducts(
        new URLSearchParams({
            category: params.id,
        })
    );
    return {
        filter,
        categorie,
        products,
        error: error || error2,
    };
}

export async function clientAction({ request }: Route.ActionArgs) {
    const data = await request.formData();
    console.log(data);
}

export default function Category({ loaderData }: Route.ComponentProps) {
    const [products, setProducts] = useState<SearchProductsPagination>(
        loaderData.products || ({} as SearchProductsPagination)
    );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);

        // Tạo object để lưu trữ dữ liệu form, bao gồm cả các giá trị mảng
        const formValues: Record<string, string | string[]> = {};

        // Duyệt qua từng cặp key-value trong formData
        formData.forEach((value, key) => {
            // Kiểm tra xem key có phải là dạng mảng không (kết thúc bằng [])
            if (key.endsWith('[]')) {
                const actualKey = key.slice(0, -2); // Loại bỏ [] ở cuối

                if (!formValues[actualKey]) {
                    formValues[actualKey] = [];
                }

                // Thêm giá trị vào mảng
                (formValues[actualKey] as string[]).push(value.toString());
            } else {
                // Nếu không phải mảng thì xử lý bình thường
                formValues[key] = value.toString();
            }
        });

        console.log('Form values:', formValues);

        // chuyển dữ liệu formValues thành query string
        const queryString = new URLSearchParams(formValues as Record<string, string>);

        // Gửi dữ liệu đến server
        const [data, error] = await productsService.searchProducts(queryString);
        if (data) {
            setProducts(data);
            return 
        }
    }

    const handleGoToPage = async (url: string) => {
        // url to URLSearchParams
        // URLSearchParams
        const urlParams = new URL(url);
        const params = urlParams.searchParams;

        const [data, error] = await productsService.searchProducts(params);
        if (data) {
            setProducts(data);
            return
        }
    }

    if (loaderData.error) {
        return (
            <div className="hero">
                <div className="hero-content w-full">
                    <h1 className="text-5xl font-extrabold">Có lỗi xảy ra</h1>
                    <p className="text-sm max-w-[700px] text-center text-base-content/70">
                        Không thể tải danh mục sản phẩm
                    </p>
                </div>
            </div>
        );
    }

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
                                <li>{loaderData.categorie?.data.name.replaceAll('-', ' ')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="hero">
                    <div className="hero-content w-full">
                        <div className="relative w-full rounded-lg overflow-hidden">
                            <img src="https://placehold.co/1000x400" alt="" className="w-full" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-6 flex flex-col justify-center">
                                <h1 className="text-2xl font-bold text-base-100 md:text-3xl lg:text-4xl">
                                    {loaderData.categorie?.data.name}
                                </h1>
                                <p className="text-base-100/70 text-sm md:text-base lg:text-lg max-w-1/2">
                                    Khám phá các mẫu điện thoại thông minh mới nhất từ các thương
                                    hiệu hàng đầu với đa dạng mức giá.
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
                            <form onSubmit={handleSubmit}>
                                <h2 className="text-2xl font-bold">Bộ lọc</h2>
                                <div className="divider m-0"></div>

                                {/* Thêm ô tìm kiếm */}
                                <div className="mb-4">
                                    <div className="form-control">
                                        <div className="join w-full">
                                            <input
                                                name="query"
                                                type="text"
                                                placeholder="Tìm kiếm..."
                                                className="input input-bordered input-sm w-full"
                                            />
                                            <button className="btn btn-square btn-sm btn-primary">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-search"
                                                >
                                                    <circle cx="11" cy="11" r="8" />
                                                    <path d="m21 21-4.3-4.3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {Object.entries(loaderData.filter?.data || {}).map(
                                    ([key, value]) => (
                                        <div key={key} className="collapse collapse-arrow">
                                            <input type="checkbox" className="peer p-0 m-0" />
                                            <div className="collapse-title">{key}</div>
                                            <div className="collapse-content">
                                                {Object.values(value).map((e) => (
                                                    <label key={e} className="flex gap-5 my-3">
                                                        <input
                                                            type="checkbox"
                                                            name={`${key}[]`}
                                                            value={e}
                                                            className="checkbox"
                                                        />
                                                        <span>{e}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                )}
                            </form>
                            <div className="w-full">
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                    {products.data.map((e) => (
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
                                                        {(
                                                            ((e.base_original_price -
                                                                e.base_price) /
                                                                e.base_original_price) *
                                                            100
                                                        ).toFixed(2)}
                                                        %
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <div className="space-y-1">
                                                        <h3 className="line-clamp-2 text-sm font-medium">
                                                            {e.name}
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
                                                            <span className="text-xs text-muted-foreground">
                                                                (120)
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-primary">
                                                                32.990.000&nbsp;₫
                                                            </span>
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
                                        {
                                            products.links.map((e) => {
                                                return <button onClick={() => {
                                                    if (e.url) {
                                                        handleGoToPage(e.url);
                                                    }
                                                }} className={"join-item btn" + (e.url ? "" : " btn-soft") + (e.active ? " btn-active": "")} dangerouslySetInnerHTML={{__html: e.label}}></button>
                                            })
                                        }
                                        {/* <button className={"join-item btn"}>«</button>
                                        <button className="join-item btn">{products.current_page}</button>
                                        <button className="join-item btn">»</button> */}
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
