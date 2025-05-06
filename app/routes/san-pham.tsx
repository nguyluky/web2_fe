import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '~/service/cart.service';
import { productsService } from '~/service/products.service';
import type { Route } from './+types/san-pham';

export async function clientLoader({ params }: { params: { id: string } }) {
  try {
    const productId = parseInt(params.id);
    const response = await productsService.getProductsDetail(productId);
    return { product: response?.[0]?.product, error: null };
  } catch (error) {
    console.error('Error loading product:', error);
    return { product: null, error: 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.' };
  }
}

export default function ProductDetail({loaderData}:Route.ComponentProps) {
  const navigate = useNavigate();
  const {product} = loaderData;
  const [selectedVariant, setSelectedVariant] = useState<number | null>(product?.product_variants?.[0]?.id || null);
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(loaderData.error);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setError('Vui lòng chọn phiên bản sản phẩm');
      return;
    }

    try {
      setAddingToCart(true);
      await cartService.addToCart({
        product_variant_id: selectedVariant,
        amount: quantity
      });
      
      // Show success message or navigate to cart
      alert('Đã thêm sản phẩm vào giỏ hàng');
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) {
      setError('Vui lòng chọn phiên bản sản phẩm');
      return;
    }

    try {
      setAddingToCart(true);
      await cartService.addToCart({
        product_variant_id: selectedVariant,
        amount: quantity
      });
      
      // Navigate to checkout
      navigate('/thanh-toan');
    } catch (err) {
      console.error('Error buying now:', err);
      setError('Không thể mua ngay. Vui lòng thử lại sau.');
    } finally {
      setAddingToCart(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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

  const selectedVariantData = product.product_variants.find(v => v.id === selectedVariant);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
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
          
          {/* Thumbnails */}
          {product.product_images && product.product_images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.product_images.map((image, index) => (
                <div 
                  key={image.id} 
                  className={`border cursor-pointer ${activeImageIndex === index ? 'border-primary' : ''}`}
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

        {/* Product Info */}
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
                      checked={Math.round(product.product_reviews.reduce((acc, review) => acc + review.rating, 0) / product.product_reviews.length) === star}
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
              : formatCurrency(product.base_price)
            }
            
            {(selectedVariantData?.original_price || product.base_original_price) && (
              <span className="text-gray-500 line-through text-lg ml-2">
                {selectedVariantData 
                  ? formatCurrency(selectedVariantData.original_price)
                  : formatCurrency(product.base_original_price)
                }
              </span>
            )}
          </div>

          {/* Variants */}
          {product.product_variants && product.product_variants.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Phiên bản</h3>
              <div className="flex flex-wrap gap-2">
                {product.product_variants.map((variant) => (
                  <button
                    key={variant.id}
                    className={`btn ${selectedVariant === variant.id ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setSelectedVariant(variant.id)}
                  >
                    {Object.entries(JSON.parse(variant.attributes)).map(([key, value]) => (
                      <span key={key} className="text-sm">
                        {key}: {String(value)}
                      </span>
                    ))}
                    {variant.stock > 0 ? ` (${variant.stock} còn lại)` : ' (Hết hàng)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
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

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button 
              className="btn btn-outline btn-primary flex-1"
              onClick={handleAddToCart}
              disabled={addingToCart || !selectedVariant}
            >
              {addingToCart ? <span className="loading loading-spinner"></span> : 'Thêm vào giỏ'}
            </button>
            <button 
              className="btn btn-primary flex-1"
              onClick={handleBuyNow}
              disabled={addingToCart || !selectedVariant}
            >
              {addingToCart ? <span className="loading loading-spinner"></span> : 'Mua ngay'}
            </button>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {/* Description */}
          <div className="divider"></div>
          <div>
            <h3 className="font-medium text-lg mb-2">Mô tả sản phẩm</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <>
              <div className="divider"></div>
              <div>
                <h3 className="font-medium text-lg mb-2">Thông số kỹ thuật</h3>
                <div className="overflow-x-auto">
                    {
                        Object.entries(JSON.parse(product.specifications)).map((spec: any, index: number) => (
                            <div key={index} className="flex justify-between py-1">
                                <span className="font-medium">{spec.name}</span>
                                <span>{spec.value}</span>
                            </div>
                        ))
                    }
                  {/* <div dangerouslySetInnerHTML={{ __html: product.specifications }} /> */}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Đánh giá sản phẩm</h2>
        
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
                    <span className="ml-2 font-medium">User #{review.user_id}</span>
                    <span className="ml-auto text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('vi-VN')}
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
          </div>
        )}
      </div>
    </div>
  );
}
