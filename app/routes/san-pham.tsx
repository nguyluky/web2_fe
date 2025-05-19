import { faStar as regularStar, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '~/contexts/AuthContext';
import { useCart } from '~/contexts/CartContext';
import { orderService } from '~/service/order.service';
import { productReviewService } from '~/service/productReview.service';
import { productsService } from '~/service/products.service';
import type { Route } from './+types/san-pham';

export async function clientLoader({ params }: { params: { id: string } }) {
    try {
        const productId = params.id;
        const response = await productsService.getProductsDetail(productId);
        return { product: response?.[0]?.product, error: null };
    } catch (error) {
        console.error('Error loading product:', error);
        return { product: null, error: 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.' };
    }
}

export default function ProductDetail({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const { product } = loaderData;
    const { isAuthenticated, profile: user } = useAuth();
    const { addToCart, isLoading: cartLoading } = useCart();
    
    const [selectedVariant, setSelectedVariant] = useState<number | null>(
        product?.product_variants?.[0]?.id || null
    );
    const [quantity, setQuantity] = useState<number>(1);
    const [error, setError] = useState<string | null>(loaderData.error);
    const [addingToCart, setAddingToCart] = useState<boolean>(false);
    const [buyNow, setBuyNow] = useState<boolean>(false);
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
    const [hasPurchased, setHasPurchased] = useState<boolean>(false);
    const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
    const [reviewFormData, setReviewFormData] = useState({
        rating: 5,
        comment: '',
    });
    const [submittingReview, setSubmittingReview] = useState<boolean>(false);

    useEffect(() => {
        if (isAuthenticated && product) {
            checkPurchaseStatus();
        }
    }, [isAuthenticated, product]);

    const checkPurchaseStatus = async () => {
        try {
            const [response, error] = await orderService.getUserOrders({ status: 'completed' });

            if (response && response.data.length > 0) {
                for (const order of response.data) {
                    const [detailsResponse, detailsError] = await orderService.getOrderDetail(order.id);

                    if (detailsResponse && detailsResponse.orderDetail) {
                        const productFound = detailsResponse.orderDetail.some(
                            item => item.product.id === product?.id
                        );

                        if (productFound) {
                            setHasPurchased(true);
                            break;
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Error checking purchase status:', err);
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setQuantity(value);
        }
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            toast.error('Vui lòng chọn phiên bản sản phẩm');
            return;
        }

        try {
            setAddingToCart(true);
            await addToCart({
                product_variant_id: selectedVariant,
                amount: quantity,
            });

            toast.success('Đã thêm sản phẩm vào giỏ hàng');
        } catch (err) {
            console.error('Error adding to cart:', err);
            toast.error('Vui lòng chọn phiên bản sản phẩm');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!selectedVariant) {
            toast.error('Vui lòng chọn phiên bản sản phẩm');
            return;
        }

        try {
            setBuyNow(true);
            await addToCart({
                product_variant_id: selectedVariant,
                amount: quantity,
            });

            navigate('/thanh-toan');
        } catch (err) {
            toast.error('Vui lòng chọn phiên bản sản phẩm');
        } finally {
            setBuyNow(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
            amount
        );
    };

    // Hàm để tạo tiêu đề đầy đủ cho tooltip khi hover lên variant
    const formatVariantTitle = (variant: any, differentKeys: string[] = []) => {
        if (differentKeys.length > 0) {
            return differentKeys.map(key => 
                `${key}: ${String(variant.specifications[key] || 'N/A')}`
            ).join(' | ');
        } else {
            return Object.entries(variant.specifications)
                .map(([key, value]) => `${key}: ${String(value)}`)
                .join(' | ');
        }
    };

    // Hàm để tạo nhãn ngắn gọn cho phiên bản
    const formatShortVariantLabel = (variant: any, differentKeys: string[] = []) => {
        let label = '';
        if (differentKeys.length > 0) {
            // Giới hạn hiển thị tối đa 2 thông số khác nhau
            const limitedKeys = differentKeys.slice(0, 2);
            label = limitedKeys.map(key => {
                const value = String(variant.specifications[key] || 'N/A');
                // Giới hạn độ dài của mỗi giá trị
                const shortValue = value.length > 8 ? value.substring(0, 6) + '...' : value;
                return `${key}: ${shortValue}`;
            }).join(' | ');
            
            // Hiển thị dấu ... nếu có nhiều hơn 2 thông số
            if (differentKeys.length > 2) {
                label += ' ...';
            }
        } else if (Object.keys(variant.specifications).length > 0) {
            // Nếu không có thông số khác biệt, hiển thị tối đa 2 thông số đầu tiên
            const entries = Object.entries(variant.specifications);
            const limitedEntries = entries.slice(0, 2);
            
            label = limitedEntries.map(([key, value]) => {
                const shortKey = key.length > 5 ? key.substring(0, 4) + '...' : key;
                const shortValue = String(value).length > 8 ? String(value).substring(0, 6) + '...' : String(value);
                return `${shortKey}: ${shortValue}`;
            }).join(' | ');
            
            // Hiển thị dấu ... nếu có nhiều hơn 2 thông số
            if (entries.length > 2) {
                label += ' ...';
            }
        } else {
            label = "Mặc định";
        }
        
        return label;
    };

    const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setReviewFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value
        }));
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error('Vui lòng đăng nhập để đánh giá sản phẩm');
            navigate('/auth/login');
            return;
        }

        try {
            setSubmittingReview(true);

            const reviewData = {
                product_id: product?.id,
                rating: reviewFormData.rating,
                comment: reviewFormData.comment
            };

            const [response, error] = await productReviewService.createReview(product?.id || -1, reviewData);

            if (error) {
                toast.error('Không thể gửi đánh giá. Vui lòng thử lại sau!');
                return;
            }

            toast.success('Đã gửi đánh giá thành công!');
            setShowReviewForm(false);
            setReviewFormData({
                rating: 5,
                comment: ''
            });

            window.location.reload();
        } catch (err) {
            console.error('Error submitting review:', err);
            toast.error('Đã xảy ra lỗi khi gửi đánh giá!');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (error && !product) {
        return (
            <div className="flex justify-center items-center min-h-[500px]">
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center min-h-[500px]">
                <div className="alert alert-error">
                    <span>Không tìm thấy sản phẩm</span>
                </div>
            </div>
        );
    }

    // Xác định các thông số khác nhau giữa các phiên bản
    const findDifferentSpecifications = () => {
        if (!product.product_variants || product.product_variants.length <= 1) {
            return [];
        }

        const allSpecKeys = new Set<string>();
        
        // Thu thập tất cả các keys từ tất cả các phiên bản
        product.product_variants.forEach(variant => {
            Object.keys(variant.specifications).forEach(key => {
                allSpecKeys.add(key);
            });
        });

        // Kiểm tra từng key xem có khác nhau giữa các phiên bản không
        const differentKeys = Array.from(allSpecKeys).filter(key => {
            const values = new Set<string>();
            
            // Thu thập tất cả giá trị cho key này từ mọi phiên bản
            product.product_variants.forEach(variant => {
                if (variant.specifications[key] !== undefined) {
                    values.add(String(variant.specifications[key]));
                }
            });
            
            // Nếu có nhiều hơn 1 giá trị khác nhau, thì key này là khác nhau giữa các phiên bản
            return values.size > 1;
        });

        return differentKeys;
    };

    const differentSpecKeys = findDifferentSpecifications();
    
    const selectedVariantData = product.product_variants.find((v) => v.id === selectedVariant);

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                        {product.product_images && product.product_images.length > 0 ? (
                            <img
                                src={product.product_images[activeImageIndex].image_url}
                                alt={product.name}
                                className="w-full h-auto object-cover"
                            />
                        ) : (
                            <div className="bg-gray-200 w-full h-64 flex items-center justify-center">
                                <span>Không có hình ảnh</span>
                            </div>
                        )}
                    </div>

                    {product.product_images && product.product_images.length > 1 && (
                        <div className="flex space-x-2 overflow-x-auto">
                            {product.product_images.map((image, index) => (
                                <div
                                    key={image.id}
                                    className={`border cursor-pointer ${
                                        activeImageIndex === index ? 'border-primary' : ''
                                    }`}
                                    onClick={() => setActiveImageIndex(index)}
                                >
                                    <img
                                        src={image.image_url}
                                        alt={`${product.name} - ${index + 1}`}
                                        className="w-20 h-20 object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>

                    <div className="flex items-center space-x-2">
                        {product.product_reviews && product.product_reviews.length > 0 ? (
                            <>
                                <div className="rating rating-sm">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <input
                                            key={star}
                                            type="radio"
                                            name="rating-2"
                                            className="mask mask-star-2 bg-orange-400"
                                            readOnly
                                            checked={
                                                Math.round(
                                                    product.product_reviews.reduce(
                                                        (acc, review) => acc + review.rating,
                                                        0
                                                    ) / product.product_reviews.length
                                                ) === star
                                            }
                                        />
                                    ))}
                                </div>
                                <span className="text-sm">
                                    ({product.product_reviews.length} đánh giá)
                                </span>
                            </>
                        ) : (
                            <span className="text-sm text-gray-500">Chưa có đánh giá</span>
                        )}
                    </div>

                    <div className="text-2xl font-bold text-primary">
                        {selectedVariantData
                            ? formatCurrency(selectedVariantData.price)
                            : formatCurrency(product.base_price)}

                        {(selectedVariantData?.original_price || product.base_original_price) && (
                            <span className="text-gray-500 line-through text-lg ml-2">
                                {selectedVariantData
                                    ? formatCurrency(selectedVariantData.original_price)
                                    : formatCurrency(product.base_original_price)}
                            </span>
                        )}
                    </div>

                    {product.product_variants && product.product_variants.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-medium">Phiên bản</h3>
                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                                {product.product_variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        className={`btn btn-sm md:btn-md ${
                                            selectedVariant === variant.id
                                                ? 'btn-primary'
                                                : 'btn-outline'
                                        } ${variant.stock <= 0 ? 'opacity-70' : ''}`}
                                        onClick={() => setSelectedVariant(variant.id)}
                                        title={formatVariantTitle(variant, differentSpecKeys)}
                                        disabled={variant.stock <= 0}
                                    >
                                        {differentSpecKeys.length > 0 ? (
                                            // Chỉ hiển thị các thông số khác nhau với giới hạn độ dài
                                            <span className="text-xs md:text-sm">
                                                {formatShortVariantLabel(variant, differentSpecKeys)}
                                                <span className="ml-1 badge badge-sm badge-outline">
                                                    {variant.stock > 0
                                                        ? variant.stock
                                                        : 'Hết'}
                                                </span>
                                            </span>
                                        ) : (
                                            // Nếu không có thông số khác nhau, hiển thị giới hạn
                                            <span className="text-xs md:text-sm">
                                                {formatShortVariantLabel(variant)}
                                                <span className="ml-1 badge badge-sm badge-outline">
                                                    {variant.stock > 0
                                                        ? variant.stock
                                                        : 'Hết'}
                                                </span>
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <h3 className="font-medium">Số lượng</h3>
                        <div className="join">
                            <button
                                className="btn join-item"
                                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                className="input join-item w-20 text-center"
                                value={quantity}
                                onChange={handleQuantityChange}
                                min="1"
                            />
                            <button
                                className="btn join-item"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button
                            className="btn btn-outline btn-primary flex-1"
                            onClick={handleAddToCart}
                            disabled={addingToCart || !selectedVariant}
                        >
                            {addingToCart ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                'Thêm vào giỏ'
                            )}
                        </button>
                        <button
                            className="btn btn-primary flex-1"
                            onClick={handleBuyNow}
                            disabled={buyNow || !selectedVariant}
                        >
                            {buyNow ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                'Mua ngay'
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="divider"></div>
                    <div>
                        <h3 className="font-medium text-lg mb-2">Mô tả sản phẩm</h3>
                        <p className="text-gray-700">{product.description}</p>
                    </div>

                    {product.specifications && (
                        <>
                            <div className="divider"></div>
                            <div>
                                <h3 className="font-medium text-lg mb-2">Thông số kỹ thuật</h3>
                                <div className="overflow-x-auto">
                                    {Object.entries(product.specifications).map(
                                        (spec: any, index: number) => (
                                            <div key={index} className="flex justify-between py-1">
                                                <span className="font-medium">{spec[0]}</span>
                                                <span>{spec[1]}</span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>

                    {/* {isAuthenticated && hasPurchased && !showReviewForm && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowReviewForm(true)}
                        >
                            Viết đánh giá
                        </button>
                    )} */}
                </div>

                {showReviewForm && (
                    <div className="card bg-base-100 shadow-lg mb-6">
                        <div className="card-body">
                            <h3 className="card-title">Viết đánh giá của bạn</h3>
                            <form onSubmit={handleSubmitReview}>
                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text font-medium">Đánh giá</span>
                                    </label>
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <div key={star} className="mr-2">
                                                <input
                                                    type="radio"
                                                    name="rating"
                                                    value={star}
                                                    id={`star-${star}`}
                                                    checked={reviewFormData.rating === star}
                                                    onChange={handleReviewChange}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor={`star-${star}`}
                                                    className="cursor-pointer text-2xl"
                                                    onClick={() =>
                                                        setReviewFormData(prev => ({
                                                            ...prev,
                                                            rating: star
                                                        }))
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={
                                                            reviewFormData.rating >= star
                                                                ? solidStar
                                                                : regularStar
                                                        }
                                                        className={
                                                            reviewFormData.rating >= star
                                                                ? 'text-yellow-400'
                                                                : 'text-gray-300'
                                                        }
                                                    />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-control mb-4">
                                    <label className="label">
                                        <span className="label-text font-medium">Nội dung đánh giá</span>
                                    </label>
                                    <textarea
                                        name="comment"
                                        value={reviewFormData.comment}
                                        onChange={handleReviewChange}
                                        className="textarea textarea-bordered h-24"
                                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        onClick={() => setShowReviewForm(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={submittingReview}
                                    >
                                        {submittingReview ? (
                                            <span className="loading loading-spinner loading-xs"></span>
                                        ) : (
                                            'Gửi đánh giá'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {product.product_reviews && product.product_reviews.length > 0 ? (
                    <div className="space-y-4">
                        {product.product_reviews.map((review) => (
                            <div key={review.id} className="card bg-base-100 shadow-sm">
                                <div className="card-body">
                                    <div className="flex items-center mb-2">
                                        <div className="rating rating-sm">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <input
                                                    key={star}
                                                    type="radio"
                                                    name={`rating-${review.id}`}
                                                    className="mask mask-star-2 bg-orange-400"
                                                    readOnly
                                                    checked={review.rating === star}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-2 font-medium">
                                            {review.account?.profile?.fullname || 'Khách hàng'}
                                        </span>
                                        <div className="ml-2 badge badge-success badge-sm">Đã mua hàng</div>
                                        <span className="ml-auto text-sm text-gray-500">
                                            {new Date(review.created_at).toLocaleDateString(
                                                'vi-VN'
                                            )}
                                        </span>
                                    </div>
                                    <p>{review.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
                        {isAuthenticated && hasPurchased && (
                            <button
                                className="btn btn-primary mt-4"
                                onClick={() => setShowReviewForm(true)}
                            >
                                Hãy là người đầu tiên đánh giá
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
