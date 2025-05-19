import { useState } from 'react';
import { Link } from 'react-router';
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
        loaderData.products || {
            data: [],
            links: [],
            current_page: 1,
            total: 0,
            per_page: 10,
            last_page: 1
        } as SearchProductsPagination
    );
    
    // Sorting state
    const [sortBy, setSortBy] = useState<string>('');
    
    // Price range state
    const [priceRange, setPriceRange] = useState({
        min: 0,
        max: 10000000, // 10 million VND default max
        currentMin: 0,
        currentMax: 10000000
    });

    // Handle price range change
    const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
        const numValue = value === '' ? (type === 'min' ? 0 : priceRange.max) : parseInt(value);
        
        if (type === 'min') {
            setPriceRange(prev => ({
                ...prev,
                currentMin: Math.min(numValue, prev.currentMax)
            }));
        } else {
            setPriceRange(prev => ({
                ...prev,
                currentMax: Math.max(numValue, prev.currentMin)
            }));
        }
    };

    // Format price to display in VND
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);

        // Tạo object để lưu trữ dữ liệu form, bao gồm cả các giá trị mảng
        const formValues: Record<string, string | string[]> = {};

        // Duyệt qua từng cặp key-value trong formData
        formData.forEach((value, key) => {
            // Skip empty values for price ranges
            if ((key === 'min_price' || key === 'max_price') && value === '') {
                return;
            }
            
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

        // Add category id to the form values
        if (loaderData.categorie?.data?.id) {
            formValues['category'] = loaderData.categorie.data.id.toString();
        }
        
        // Add sorting if selected
        if (sortBy) {
            formValues['sort'] = sortBy;
        }

        // chuyển dữ liệu formValues thành query string
        const queryString = new URLSearchParams(formValues as Record<string, string>);

        try {
            // Gửi dữ liệu đến server
            const [data, error] = await productsService.searchProducts(queryString);
            if (error) {
                console.error("Error fetching products:", error);
                // Set empty products to trigger the "no products found" notification
                setProducts({
                    ...products,
                    data: []
                });
                return;
            }
            
            if (data) {
                setProducts(data);
                // Scroll to top of product section after filter apply
                window.scrollTo({ 
                    top: document.querySelector('.drawer-content')?.getBoundingClientRect().top || 0,
                    behavior: 'smooth'
                });
            }
        } catch (err) {
            console.error("Exception while fetching products:", err);
            // Set empty products to trigger the "no products found" notification
            setProducts({
                ...products,
                data: []
            });
        }
    }

    const handleGoToPage = async (url: string) => {
        // url to URLSearchParams
        const urlParams = new URL(url);
        const params = urlParams.searchParams;
        
        // Add sort parameter if it's not already in the URL and we have a sortBy value
        if (sortBy && !params.has('sort')) {
            params.set('sort', sortBy);
        }

        try {
            const [data, error] = await productsService.searchProducts(params);
            if (error) {
                console.error("Error fetching products:", error);
                // Set empty products to trigger the "no products found" notification
                setProducts({
                    ...products,
                    data: []
                });
                return;
            }
            
            if (data) {
                setProducts(data);
                // Scroll to top of the products section after page change
                window.scrollTo({ 
                    top: document.querySelector('.drawer-content')?.getBoundingClientRect().top || 0,
                    behavior: 'smooth'
                });
            }
        } catch (err) {
            console.error("Exception while fetching products:", err);
            // Set empty products to trigger the "no products found" notification
            setProducts({
                ...products, 
                data: []
            });
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
            <div className="drawer lg:drawer-open">
                <input id="filter-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
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
                                    <img 
                                        src={loaderData.categorie?.data.large_image || `https://placehold.co/1000x400?text=${loaderData.categorie?.data.name}`} 
                                        alt="" 
                                        className="w-full h-[200px] md:h-[300px] lg:h-[400px] object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-3 md:p-6 flex flex-col justify-center">
                                        <h1 className="text-xl font-bold text-base-100 md:text-3xl lg:text-4xl">
                                            {loaderData.categorie?.data.name}
                                        </h1>
                                        <p className="text-base-100/70 text-xs md:text-base lg:text-lg max-w-1/2">
                                        {loaderData.categorie?.data.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="hero">
                            <div className="hero-content w-full px-2 md:px-4">
                                <div className="w-full">
                                    <div className="flex flex-wrap justify-between items-center mb-4">
                                        <div className="flex items-center">
                                            <h2 className="text-xl font-bold mr-2">Sản phẩm</h2>
                                            <span className="text-sm text-base-content/70">({products.total} kết quả)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex lg:hidden">
                                                <label htmlFor="filter-drawer" className="btn btn-sm drawer-button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
                                                    </svg>
                                                    Bộ lọc
                                                </label>
                                            </div>
                                            <div className="form-control">
                                                <select 
                                                    className="select select-bordered select-sm"
                                                    value={sortBy}
                                                    onChange={(e) => {
                                                        setSortBy(e.target.value);
                                                        if (e.target.value) {
                                                            const params = new URLSearchParams();
                                                            if (loaderData.categorie?.data?.id) {
                                                                params.append('category', loaderData.categorie.data.id.toString());
                                                            }
                                                            params.append('sort', e.target.value);
                                                            
                                                            (async () => {
                                                                try {
                                                                    const [data, error] = await productsService.searchProducts(params);
                                                                    if (data) {
                                                                        setProducts(data);
                                                                        window.scrollTo({ 
                                                                            top: document.querySelector('.drawer-content')?.getBoundingClientRect().top || 0,
                                                                            behavior: 'smooth'
                                                                        });
                                                                    }
                                                                } catch (err) {
                                                                    console.error("Error sorting products:", err);
                                                                }
                                                            })();
                                                        }
                                                    }}
                                                >
                                                    <option value="">Sắp xếp theo</option>
                                                    <option value="price_asc">Giá tăng dần</option>
                                                    <option value="price_desc">Giá giảm dần</option>
                                                    <option value="created_at_desc">Mới nhất</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {products.data && products.data.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                                        {products.data.map((e) => (
                                            <div
                                                key={e.id}
                                                className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden"
                                                data-v0-t="card"
                                            >
                                                <Link to={"/san-pham/" + e.slug} className="block">
                                                    <div className="relative aspect-square">
                                                        <img
                                                            alt={e.name}
                                                            loading="lazy"
                                                            decoding="async"
                                                            data-nimg="fill"
                                                            className="object-cover transition-transform hover:scale-105 w-full h-full"
                                                            src={e.product_images && e.product_images[0] ? e.product_images[0].image_url : "https://placehold.co/300"}
                                                        />
                                                        {e.base_original_price > e.base_price && (
                                                            <div
                                                                className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-primary-foreground hover:bg-primary/80 absolute right-2 top-2 bg-red-500"
                                                                data-v0-t="badge"
                                                            >
                                                                {(
                                                                    ((e.base_original_price -
                                                                        e.base_price) /
                                                                        e.base_original_price) *
                                                                    100
                                                                ).toFixed(0)}
                                                                %
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-2 md:p-3">
                                                        <div className="space-y-1">
                                                            <h3 className="line-clamp-2 text-xs sm:text-sm font-medium">
                                                                {e.name}
                                                            </h3>
                                                            <div className="flex items-center gap-1">
                                                                <div className="flex">
                                                                    {Array(5).fill(0).map((_, index) => (
                                                                        <svg
                                                                            key={index}
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="24"
                                                                            height="24"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            className="lucide lucide-star h-3 w-3 fill-primary text-primary"
                                                                        >
                                                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                                                        </svg>
                                                                    ))}
                                                                </div>
                                                                <span className="text-xs text-muted-foreground">
                                                                    ({e.product_reviews?.length || 0})
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1 flex-wrap">
                                                                <span className="font-bold text-primary text-sm sm:text-base">
                                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(e.base_price)}
                                                                </span>
                                                                {e.base_original_price > e.base_price && (
                                                                    <span className="text-xs text-muted-foreground line-through">
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(e.base_original_price)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                    ) : (
                                    <div className="alert flex flex-col items-center py-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-base-content/60 mb-4">
                                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                                        </svg>
                                        <h3 className="text-lg font-bold">Không tìm thấy sản phẩm nào</h3>
                                        <p className="text-base-content/70 text-center mt-2">
                                            Không có sản phẩm nào phù hợp với tiêu chí tìm kiếm. <br />
                                            Vui lòng thử lại với các bộ lọc khác hoặc xem các danh mục khác.
                                        </p>
                                        <button 
                                            className="btn btn-primary mt-4"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.location.reload();
                                            }}
                                        >
                                            Đặt lại bộ lọc
                                        </button>
                                    </div>
                                    )}
                                    {products.last_page > 1 && (
                                        <div className="flex justify-center mt-5">
                                            <div className="join">
                                                {
                                                    products.links.map((e, index) => (
                                                        <button 
                                                            key={index}
                                                            onClick={() => {
                                                                if (e.url) {
                                                                    handleGoToPage(e.url);
                                                                }
                                                            }} 
                                                            className={"join-item btn btn-sm md:btn-md" + (e.url ? "" : " btn-disabled") + (e.active ? " btn-active": "")} 
                                                            dangerouslySetInnerHTML={{__html: e.label}}
                                                        ></button>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="drawer-side z-10">
                    <label htmlFor="filter-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="p-4 w-80 min-h-full bg-base-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Bộ lọc</h2>
                            <label htmlFor="filter-drawer" className="btn btn-sm btn-circle">✕</label>
                        </div>
                        <div className="divider m-0"></div>
                        <form onSubmit={handleSubmit}>
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
                                                        className="checkbox checkbox-sm"
                                                    />
                                                    <span className="text-sm">{e}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                            
                            {/* Price Range Filter */}
                            <div className="collapse collapse-arrow mt-2">
                                <input type="checkbox" className="peer p-0 m-0" defaultChecked />
                                <div className="collapse-title">Khoảng giá</div>
                                <div className="collapse-content">
                                    <div className="mb-3 px-2">
                                        <div className="text-xs flex justify-between mb-2">
                                            <span>{formatPrice(priceRange.currentMin)}</span>
                                            <span>{formatPrice(priceRange.currentMax)}</span>
                                        </div>
                                        <div className="relative pt-1">
                                            <input
                                                type="range"
                                                min={priceRange.min}
                                                max={priceRange.max}
                                                step="100000"
                                                value={priceRange.currentMin}
                                                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                                                className="range range-xs range-primary"
                                            />
                                            <input
                                                type="range"
                                                min={priceRange.min}
                                                max={priceRange.max}
                                                step="100000"
                                                value={priceRange.currentMax}
                                                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                                                className="range range-xs range-primary mt-2"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="label">
                                                <span className="label-text text-xs">Từ</span>
                                            </label>
                                            <input 
                                                type="number" 
                                                name="min_price" 
                                                className="input input-bordered input-sm w-full" 
                                                placeholder="0₫"
                                                min={priceRange.min}
                                                max={priceRange.currentMax}
                                                value={priceRange.currentMin}
                                                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="label">
                                                <span className="label-text text-xs">Đến</span>
                                            </label>
                                            <input 
                                                type="number" 
                                                name="max_price" 
                                                className="input input-bordered input-sm w-full" 
                                                placeholder="10.000.000₫"
                                                min={priceRange.currentMin}
                                                max={priceRange.max}
                                                value={priceRange.currentMax}
                                                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <button type="submit" className="btn btn-primary btn-sm w-full mt-4">Áp dụng</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
