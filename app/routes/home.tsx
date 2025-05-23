import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import homeHeroImg from '~/asset/img/1-top-dien-thoai-ban-chay-tai-dien-may-cho-lon.jpg';
import { categoryService } from '~/service/category.service';
import { productsService } from '~/service/products.service';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
    return [{ title: 'TechStore' }, { name: 'description', content: 'Welcome to React Router!' }];
}

function Rating({
    rating,
    disable,
    onChange,
}: {
    rating: number;
    disable?: boolean;
    onChange?: (value: number) => void;
}) {
    const [ratingValue, setRatingValue] = useState(Math.round(rating));

    return (
        <div className="rating rating-xs">
            {[1, 2, 3, 4, 5].map((value) => (
                <input
                    key={value}
                    type="radio"
                    name="rating-3"
                    className="mask mask-star-2"
                    disabled={disable}
                    defaultChecked={value === ratingValue}
                    onChange={() => {
                        if (onChange) {
                            onChange(value);
                        }
                        setRatingValue(value);
                    }}
                />
            ))}
        </div>
    );
}

export async function clientLoader({}) {
    try {
        // Fetch new products and categories in parallel
        const [productsResponse, [categoriesResponse, categoryError]] = await Promise.all([
            productsService.getNewProducts(),
            categoryService.getCategories(),
        ]);

        // Filter categories where parent_id is null and add placeholder images
        const categoriesWithImages =
            categoriesResponse?.data
                .filter((category) => category.parent_id === null)
                .map((category) => ({
                    ...category,
                    // image: `https://placehold.co/100x100?text=${encodeURIComponent(category.name)}`
                })) || [];

        return {
            new_product: productsResponse[0],
            categories: categoriesWithImages,
            error: null,
        };
    } catch (error) {
        console.error('Error loading data:', error);
        return {
            new_product: { data: [] },
            categories: [],
            error: 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
        };
    }
}

export default function Home({ loaderData }: Route.ComponentProps) {
    const { new_product, categories, error } = loaderData;
    const nav = useNavigate();

    // Format currency function
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
            amount
        );
    };


    return (
        <>
            <section id="hero">
                <div className="hero">
                    <div className="hero-content">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <div className="badge badge-primary">Khuyến mãi đặp biệt</div>
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
                                    src={homeHeroImg}
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

                        <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-5 lg:grid-cols-6">
                            {categories.map((category, index) => (
                                <Link
                                    to={`/danh-muc/${category.id}`}
                                    key={index}
                                    className="flex flex-col items-center justify-center rounded-lg p-4 transition-colors hover:bg-base-100 shadow-sm bg-base-300"
                                >
                                    <div className="rounded-2xl bg-muted m-2 overflow-hidden">
                                        <img
                                            height={100}
                                            width={100}
                                            src={
                                                category.small_image ||
                                                `https://placehold.co/100x100?text=${encodeURIComponent(
                                                    category.name
                                                )}`
                                            }
                                            alt={category.name}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-center">
                                        {category.name}
                                    </span>
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
                                <h2 className="text-2xl font-bold">Sản phẩm mới</h2>
                            </div>
                            <div className="min-w-max">
                                <Link to="/san-pham-moi" className="link">
                                    Xem tất cả{'>'}
                                </Link>
                            </div>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-4 lg:grid-cols-5">
                            {(new_product?.data || []).map((value, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="card shadow-sm bg-base-300"
                                        onClick={() => nav('san-pham/' + value.id)}
                                    >
                                        <figure>
                                            <img
                                                src={
                                                    value.product_images.find((e) => e.is_primary)
                                                        ?.image_url ||
                                                    'https://placehold.co/600x400'
                                                }
                                                height={400}
                                                width={600}
                                                alt="Shoes"
                                            />
                                        </figure>
                                        <div className="card-body p-4">
                                            <h2 className="card-title">{value.name}</h2>
                                            <div className="flex">
                                                <Rating
                                                    rating={value.product_reviews_avg_rating}
                                                    disable={true}
                                                />
                                                <p>{'(' + value.product_reviews_count + ')'}</p>
                                            </div>
                                            <div className="flex gap-2 flex-col xl:flex-row">
                                                <p className="text-lg font-bold">
                                                    {formatCurrency(value.base_price)}
                                                </p>
                                                <p className="text-sm text-gray-500 line-through">
                                                    {formatCurrency(value.base_original_price)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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
                                    <img
                                        src="https://placehold.co/500x600"
                                        alt="Shoes"
                                        className="object-cover"
                                    />
                                </figure>
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-6 flex flex-col justify-end">
                                    <div className="badge badge-primary">Giảm giá lớn</div>
                                    <h2 className="card-title text-primary-content">Card Title</h2>
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
                                    <h2 className="card-title text-primary-content">Card Title</h2>
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
        </>
    );
}
