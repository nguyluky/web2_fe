import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService, type CartItemWithProduct } from '~/service/cart.service';
import { orderService, type CreateOrderRequest, type OrderProduct } from '~/service/order.service';
import { ProfileService } from '~/service/profile.service';

const profileService = new ProfileService();

export async function clientLoader() {
  try {
    const cartResponse = await cartService.getCart();
    const profileResponse = await profileService.getProfile();
    
    return { 
      cartItems: cartResponse?.[0]?.carts || [], 
      profile: profileResponse?.[0]?.data,
      error: null 
    };
  } catch (error) {
    console.error('Error loading checkout data:', error);
    return { 
      cartItems: [], 
      profile: null,
      error: 'Không thể tải thông tin thanh toán. Vui lòng thử lại sau.' 
    };
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  const fetchCheckoutData = async () => {
    try {
      setLoading(true);
      const loaderData = await clientLoader();
      
      setCartItems(loaderData.cartItems);
      setProfile(loaderData.profile);
      setError(loaderData.error);
      
      // Redirect to cart if cart is empty
      if (loaderData.cartItems.length === 0 && !loaderData.error) {
        navigate('/cart');
      }
    } catch (err) {
      console.error('Error fetching checkout data:', err);
      setError('Không thể tải thông tin thanh toán. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product_variant.price * item.amount);
    }, 0);
  };

  const calculateShipping = () => {
    // Simple shipping calculation example - could be expanded with actual shipping options
    return 0; // Free shipping for this example
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handlePlaceOrder = async () => {
    if (!profile) {
      setError('Vui lòng đăng nhập để thanh toán');
      return;
    }

    // Prepare order products from cart items
    const orderProducts: OrderProduct[] = cartItems.map(item => ({
      product_variant_id: item.product_variant_id,
      serial: item.amount
    }));

    const orderData: CreateOrderRequest = {
      account_id: profile.account_id,
      employee_id: 1, // Assume default employee ID - this would come from somewhere in a real app
      payment_method: paymentMethod,
      products: orderProducts
    };

    try {
      setProcessing(true);
      const response = await orderService.createOrder(orderData);
      
      if (response && response[0] && response[0].order) {
        // Order created successfully
        navigate(`/tai-khoan/don-hang/${response[0].order.id}`, { 
          state: { success: true, message: 'Đặt hàng thành công!' } 
        });
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Không thể tạo đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error && cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Customer Information */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Thông tin khách hàng</h2>
              
              {profile ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Họ tên</label>
                      <input 
                        type="text" 
                        className="input input-bordered w-full" 
                        value={profile.fullname || ''}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="label">Số điện thoại</label>
                      <input 
                        type="text" 
                        className="input input-bordered w-full" 
                        value={profile.phone_number || ''}
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input 
                      type="email" 
                      className="input input-bordered w-full" 
                      value={profile.email || ''}
                      readOnly
                    />
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning">
                  <span>Vui lòng <a href="/auth/login" className="link">đăng nhập</a> để tiếp tục thanh toán</span>
                </div>
              )}
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Địa chỉ giao hàng</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Địa chỉ</label>
                  <textarea 
                    className="textarea textarea-bordered w-full" 
                    rows={3}
                    placeholder="Nhập địa chỉ giao hàng"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Tỉnh/Thành phố</label>
                    <select className="select select-bordered w-full">
                      <option disabled selected>Chọn tỉnh/thành phố</option>
                      <option>Hà Nội</option>
                      <option>TP. Hồ Chí Minh</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Quận/Huyện</label>
                    <select className="select select-bordered w-full">
                      <option disabled selected>Chọn quận/huyện</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Phường/Xã</label>
                    <select className="select select-bordered w-full">
                      <option disabled selected>Chọn phường/xã</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Phương thức thanh toán</h2>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input 
                      type="radio" 
                      name="payment-method" 
                      className="radio radio-primary" 
                      checked={paymentMethod === 'cash'}
                      onChange={() => setPaymentMethod('cash')}
                    />
                    <span className="label-text">Thanh toán khi nhận hàng (COD)</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input 
                      type="radio" 
                      name="payment-method" 
                      className="radio radio-primary"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                    />
                    <span className="label-text">Chuyển khoản ngân hàng</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input 
                      type="radio" 
                      name="payment-method" 
                      className="radio radio-primary"
                      checked={paymentMethod === 'momo'}
                      onChange={() => setPaymentMethod('momo')}
                    />
                    <span className="label-text">Ví điện tử MoMo</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Đơn hàng của bạn</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th className="text-right">Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.product_variant_id}>
                        <td>
                          {item.product_variant.product.name} ({item.product_variant.attributes}) x {item.amount}
                        </td>
                        <td className="text-right">
                          {formatCurrency(item.product_variant.price * item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divider"></div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrency(calculateShipping())}</span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-xl">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              {error && (
                <div className="alert alert-error mt-4">
                  <span>{error}</span>
                </div>
              )}

              <button 
                className="btn btn-primary w-full mt-4"
                onClick={handlePlaceOrder}
                disabled={processing || !profile || cartItems.length === 0}
              >
                {processing ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Đặt hàng'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
