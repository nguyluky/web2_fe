import { useState } from 'react';
import { useNavigate } from 'react-router';
import { productsService, type NewProductsResponse } from '~/service/products.service';
import { formatCurrency } from '~/utils/formatCurrency';

export async function clientLoader() {
    try {
        const [newProductsData, error] = await productsService.getNewProducts(0, 24);
        return {
            newProducts: newProductsData?.data || [],
            error,
        };
    } catch (error) {
        console.error('Error loading new products:', error);
        return {
            newProducts: [],
            error: 'Không thể tải sản phẩm mới. Vui lòng thử lại sau.',
        };
    }
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

export default function NewProduct({
    loaderData,
}: {
    loaderData: { newProducts: NewProductsResponse['data']; error: any };
}) {
    const [products, setProducts] = useState<NewProductsResponse['data']>(
        loaderData.newProducts || []
    );
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(products.length >= 24);
    const [error, setError] = useState<string | null>(loaderData.error || null);
    const navigate = useNavigate();

    const loadMoreProducts = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const [newProductsData, error] = await productsService.getNewProducts(page, 24);

            if (error) {
                setError('Không thể tải thêm sản phẩm.');
            } else if (newProductsData?.data) {
                setProducts((prev) => [...prev, ...newProductsData.data]);
                setHasMore(newProductsData.data.length >= 24);
                setPage(page + 1);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải thêm sản phẩm.');
        } finally {
            setLoading(false);
        }
    };

    // Get primary image or first image for each product
    const getProductImage = (product: NewProductsResponse['data'][0]) => {
        if (!product.product_images || product.product_images.length === 0) {
            return '';
        }

        const primaryImage = product.product_images.find((img) => img.is_primary);
        return primaryImage ? primaryImage.image_url : product.product_images[0].image_url;
    };

    return (
        <section className="py-8">
            <div className="hero">
                <div className="hero-content w-full flex-col">
                    <div className="navbar">
                        <div className="w-full">
                            <h2 className="text-2xl font-bold">Sản Phẩm Mới Nhất</h2>
                        </div>
                        <div className="min-w-max text-gray-600">
                            Hiển thị {products.length} sản phẩm
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-error shadow-lg mb-6 w-full">
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {products.length === 0 && !error ? (
                        <div className="flex justify-center items-center h-96 w-full">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4">
                                    Chưa có sản phẩm mới nào
                                </h2>
                                <p className="text-gray-600">Hãy quay lại sau nhé</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 w-full md:grid-cols-4 lg:grid-cols-5">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="card shadow-sm bg-base-300 cursor-pointer"
                                    onClick={() =>
                                        (window.location.href = `/san-pham/${product.id}`)
                                    }
                                >
                                    <figure>
                                        <img
                                            src={
                                                getProductImage(product) ||
                                                'https://placehold.co/600x400'
                                            }
                                            height={400}
                                            width={600}
                                            alt={product.name}
                                        />
                                    </figure>{' '}
                                    <div className="card-body p-4">
                                        <h2 className="card-title">{product.name}</h2>
                                        <div className="flex">
                                            <div className="rating rating-xs">
                                                {[1, 2, 3, 4, 5].map((value) => (
                                                    <input
                                                        key={value}
                                                        type="radio"
                                                        name={`rating-${product.id}`}
                                                        className="mask mask-star-2"
                                                        disabled={true}
                                                        defaultChecked={
                                                            value ===
                                                            Math.round(
                                                                product.product_reviews_avg_rating ||
                                                                    0
                                                            )
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <p className="ml-1">
                                                {'(' + (product.product_reviews_count || 0) + ')'}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 flex-col xl:flex-row">
                                            <p className="text-lg font-bold">
                                                {formatCurrency(product.base_price)}
                                            </p>
                                            {product.base_original_price &&
                                                product.base_original_price >
                                                    product.base_price && (
                                                    <p className="text-sm text-gray-500 line-through">
                                                        {formatCurrency(
                                                            product.base_original_price
                                                        )}
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {hasMore && (
                        <div className="flex justify-center mt-10">
                            <button
                                className="btn btn-outline btn-primary"
                                onClick={loadMoreProducts}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-md"></span>
                                ) : (
                                    'Xem thêm sản phẩm'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
