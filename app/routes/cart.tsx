import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '~/service/cart.service';
import type { Route } from './+types/cart';


import { formatCurrency } from '~/utils/formatCurrency';

export async function clientLoader() {
  try {
    const response = await cartService.getCart();
    if (response && response[0]) {
      return { cartItems: response[0].carts, error: null };
    }
    return { cartItems: [], error: null };
  } catch (error) {
    console.error('Error loading cart:', error);
    return { cartItems: [], error: 'Không thể tải giỏ hàng. Vui lòng thử lại sau.' };
  }
}

export default function Cart({loaderData}: Route.ComponentProps) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(loaderData.cartItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(loaderData.error);

  const handleUpdateQuantity = async (variantId: number, amount: number) => {
    try {
      setLoading(true);
      await cartService.updateCartItem(variantId, { amount });
      
      // Update local state to reflect changes
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.product_variant_id === variantId 
            ? { ...item, amount } 
            : item
        )
      );
    } catch (err) {
      console.error('Error updating cart:', err);
      setError('Không thể cập nhật giỏ hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (variantId: number) => {
    try {
      setLoading(true);
      await cartService.removeFromCart(variantId);
      
      // Remove item from local state
      setCartItems(prevItems => 
        prevItems.filter(item => item.product_variant_id !== variantId)
      );
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product_variant.price * item.amount);
    }, 0);
  };

  const handleCheckout = () => {
    navigate('/thanh-toan');
  };

  return (
    <section>
      <div className="hero">
        <div className="hero-content flex-row w-full">
          <div className="grid grid-cols-1 w-full gap-5 lg:grid-cols-[1fr_300px]">
            <div className="card border-1 border-base-300">
              <div className="card-body">
                <div className="card-title">Sản phẩm</div>
                <div className="">
                  <table className="table table-xs">
                    {/* head */}
                    <thead>
                      <tr>
                        <th>Check</th>
                        <th>Hình ảnh</th>
                        <th>Sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>thành tiền</th>
                        <th>xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {error ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4 text-error">
                            {error}
                          </td>
                        </tr>
                      ) : cartItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            Giỏ hàng của bạn đang trống
                          </td>
                        </tr>
                      ) : (
                        cartItems.map((item) => (
                          <tr key={item.product_variant_id}>
                            <td>
                              <input type="checkbox" className="checkbox" />
                            </td>
                            <td>
                              <div className="avatar">
                                <div className="mask mask-squircle h-12 w-12">
                                  {item.product_variant.product.product_images?.[0] ? (
                                    <img
                                      src={item.product_variant.product.product_images[0].image_url}
                                      alt={item.product_variant.product.name}
                                    />
                                  ) : (
                                    <img
                                      src="https://placehold.co/30"
                                      alt="Placeholder image"
                                    />
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              {item.product_variant.product.name}
                              <br />
                              <span className="badge badge-ghost badge-sm">
                                {'('}
                                {Object.entries(item.product_variant.specifications).map(([key, value], index) => (
                                    <span key={key}>
                                    {key}: {String(value)}
                                    {Object.keys(item.product_variant.specifications).length - 1 > index ? ', ' : ''}
                                  </span>
                                ))}
                                {')'}
                              </span>
                            </td>
                            <td>{formatCurrency(item.product_variant.price)}</td>
                            <td>
                              <div className="join">
                                <input
                                  className="input join-item w-12"
                                  type="number"
                                  value={item.amount}
                                  min={1}
                                  disabled={loading}
                                  onChange={(e) => handleUpdateQuantity(item.product_variant_id, parseInt(e.target.value))}
                                />
                              </div>
                            </td>
                            <td>{formatCurrency(item.product_variant.price * item.amount)}</td>
                            <th>
                              <button 
                                className="btn btn-ghost btn-xs"
                                onClick={() => handleRemoveItem(item.product_variant_id)}
                                disabled={loading}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-trash2-icon lucide-trash-2"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  <line x1="10" x2="10" y1="11" y2="17" />
                                  <line x1="14" x2="14" y1="11" y2="17" />
                                </svg>
                              </button>
                            </th>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="card border-1 border-base-300">
              <div className="card-body">
                <p className="card-title">Mã giảm giá</p>
                <div className="join w-full">
                  <input className="input join-item w-full" placeholder="Mã giảm giá" />
                  <button className="btn btn-primary join-item rounded-r-ms">
                    Áp dụng
                  </button>
                </div>
                <p className="card-title">Tạm tính</p>
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between">
                        <p>Tạm tính</p>
                        <span>{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                        <p>Giảm giá</p>
                        <span>0 ₫</span>
                    </div>
                    <div className="flex justify-between">
                        <p>Phí vận chuyển</p>
                        <span>0 ₫</span>
                    </div>
                    <div className="divider"></div>
                    <div className="flex justify-between">
                        <p className="font-bold">Tổng cộng</p>
                        <span className="text-xl font-bold">{formatCurrency(calculateSubtotal())}</span>
                    </div>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 || loading}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
