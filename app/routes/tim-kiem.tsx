import { faChevronLeft, faChevronRight, faSearch, faStar, faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "~/contexts/AuthContext";
import { cartService } from "~/service/cart.service";
import { productsService, type Product } from "~/service/products.service";
import { formatCurrency } from "~/utils/formatCurrency";

export default function TimKiem() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null);

  // Parse URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    
    setSearchTerm(query);
    setCurrentPage(page);
  }, [location.search]);

  // Function to update URL with pagination
  const updateSearchParams = useCallback(() => {
    const searchParams = new URLSearchParams();
    
    if (searchTerm) searchParams.set("q", searchTerm);
    if (currentPage > 1) searchParams.set("page", currentPage.toString());
    
    navigate(`/tim-kiem?${searchParams.toString()}`, { replace: true });
  }, [searchTerm, currentPage, navigate]);

  // Search products function
  const searchProducts = useCallback(async () => {
    if (!searchTerm.trim()) {
      setProducts([]);
      setError(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.set("query", searchTerm);
      params.set("page", currentPage.toString());
      params.set("limit", "12"); // Số sản phẩm mỗi trang
      
      const [response, err] = await productsService.searchProducts(params);
      
      if (err) {
        setError("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.");
        return;
      }
      
      if (response) {
        setProducts(response.data);
        setTotalPages(response.last_page);
        
        if (response.data.length === 0) {
          setError("Không tìm thấy sản phẩm nào phù hợp với từ khóa tìm kiếm.");
        }
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage]);

  // Effect to fetch products when search params change
  useEffect(() => {
    searchProducts();
  }, [searchProducts]);

  // Effect to update URL when pagination changes
  useEffect(() => {
    // Only update URL when pagination changes, not on initial load or search term changes
    // that come from the URL
    if (location.search && location.search.includes('page=')) {
      updateSearchParams();
    }
  }, [currentPage, updateSearchParams]);

  // No need for handleSubmit as we only rely on URL parameters

  // Calculate average rating for a product
  const getAverageRating = (product: Product) => {
    if (!product.product_reviews || product.product_reviews.length === 0) {
      return 0;
    }
    
    const sum = product.product_reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / product.product_reviews.length;
  };

  // Calculate discount percentage for a product
  const getDiscountPercentage = (product: Product) => {
    if (!product.product_variants || product.product_variants.length === 0) {
      if (product.base_original_price <= product.base_price) return null;
      return Math.round(((product.base_original_price - product.base_price) / product.base_original_price) * 100);
    }
    
    // Find the variant with the highest discount percentage
    const variantWithHighestDiscount = product.product_variants.reduce((highest, current) => {
      if (current.original_price <= current.price) return highest;
      
      const currentDiscount = (current.original_price - current.price) / current.original_price;
      const highestDiscount = highest ? (highest.original_price - highest.price) / highest.original_price : 0;
      
      return currentDiscount > highestDiscount ? current : highest;
    }, null as any);
    
    if (!variantWithHighestDiscount || variantWithHighestDiscount.original_price <= variantWithHighestDiscount.price) {
      return null;
    }
    
    return Math.round(
      ((variantWithHighestDiscount.original_price - variantWithHighestDiscount.price) / 
       variantWithHighestDiscount.original_price) * 100
    );
  };

  // Get original price for display (for discounts)
  const getDisplayOriginalPrice = (product: Product) => {
    if (!product.product_variants || product.product_variants.length === 0) {
      return product.base_original_price > product.base_price 
        ? formatCurrency(product.base_original_price)
        : null;
    }
    
    // Find the variant with the lowest current price
    const lowestPriceVariant = product.product_variants.reduce(
      (lowest, current) => (current.price < lowest.price ? current : lowest),
      product.product_variants[0]
    );
    
    return lowestPriceVariant.original_price > lowestPriceVariant.price
      ? formatCurrency(lowestPriceVariant.original_price)
      : null;
  };
  
  // Handle adding product to cart
  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      toast.warn("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    try {
      setAddingToCartId(productId);
      
      const product = products.find(p => p.id === productId);
      if (!product) return;
      
      const defaultVariantId = product.product_variants[0]?.id;
      if (!defaultVariantId) {
        toast.error("Sản phẩm không có biến thể để thêm vào giỏ hàng!");
        return;
      }

      const cartItem = {
        product_variant_id: defaultVariantId,
        amount: 1
      };

      const [response, error] = await cartService.addToCart(cartItem);
      
      if (error) {
        toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
        return;
      }
      
      toast.success("Đã thêm sản phẩm vào giỏ hàng thành công!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng!");
    } finally {
      setAddingToCartId(null);
    }
  };

  // Render star rating component
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon 
            key={star}
            icon={faStar}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
            size="sm"
          />
        ))}
        {rating > 0 && (
          <span className="ml-1 text-sm text-gray-500">
            ({rating.toFixed(1)})
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-4">
        <ul>
          <li><Link to="/">Trang chủ</Link></li>
          <li>Tìm kiếm</li>
          {searchTerm && <li className="text-primary font-medium">{searchTerm}</li>}
        </ul>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">
        {searchTerm ? `Kết quả tìm kiếm cho "${searchTerm}"` : "Tìm kiếm sản phẩm"}
      </h1>
      
      {/* Results info */}
      {!loading && !error && products.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <p className="text-sm text-gray-600">
            Tìm thấy <span className="font-medium">{products.length}</span> sản phẩm
            {searchTerm && <span> cho từ khóa "<span className="italic">{searchTerm}</span>"</span>}
          </p>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      
      {/* Error state */}
      {!loading && error && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-error mb-2">{error}</div>
          {error.includes("Không tìm thấy") && (
            <p className="text-sm text-gray-600 mt-2">
              Hãy thử tìm kiếm với từ khóa khác để có kết quả phù hợp hơn.
            </p>
          )}
        </div>
      )}
      
      {/* Empty search state */}
      {!loading && !error && searchTerm === "" && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl text-gray-300 mb-4">
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <h2 className="text-xl font-medium mb-2">Không có từ khóa tìm kiếm</h2>
          <p className="text-gray-600">
            Vui lòng thêm tham số tìm kiếm vào URL (ví dụ: /tim-kiem?q=điện thoại)
          </p>
        </div>
      )}
      
      {/* Products grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="card bg-white shadow hover:shadow-lg transition-shadow overflow-hidden">
              <figure className="relative px-4 pt-4">
                {getDiscountPercentage(product) && (
                  <div className="badge badge-secondary absolute top-6 right-6">
                    -{getDiscountPercentage(product)}%
                  </div>
                )}
                <Link to={`/san-pham/${product.id}`} className="w-full">
                  {product.product_images && product.product_images.length > 0 ? (
                    <img
                      src={product.product_images[0].image_url}
                      alt={product.name}
                      className="rounded-lg h-48 w-full object-contain hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300.png?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="bg-gray-100 rounded-lg h-48 w-full flex items-center justify-center">
                      <span className="text-gray-400">Không có ảnh</span>
                    </div>
                  )}
                </Link>
              </figure>
              <div className="card-body p-4">
                <Link to={`/san-pham/${product.id}`} className="hover:text-primary transition-colors">
                  <h2 className="card-title text-base line-clamp-2 h-12">{product.name}</h2>
                </Link>
                <div className="mt-2">
                  {renderStarRating(getAverageRating(product))}
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-lg font-semibold text-primary">
                    {formatCurrency(product.base_price)}
                  </span>
                  {getDisplayOriginalPrice(product) && (
                    <span className="text-sm line-through text-gray-500 ml-2">
                      {getDisplayOriginalPrice(product)}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-3">
                  {product.category && (
                    <div className="flex items-center text-xs text-gray-500">
                      <FontAwesomeIcon icon={faTags} className="mr-1" />
                      <span>{product.category.name}</span>
                    </div>
                  )}
                  <button
                    className={`btn btn-sm btn-primary ${addingToCartId === product.id ? "loading" : ""}`}
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addingToCartId === product.id}
                  >
                    {addingToCartId !== product.id && "Thêm vào giỏ"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`join-item btn ${currentPage === index + 1 ? 'btn-active' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              className="join-item btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}