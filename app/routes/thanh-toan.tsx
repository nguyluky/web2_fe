import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddressService } from '~/service/address.service';
import { cartService, type CartItemWithProduct } from '~/service/cart.service';
import { orderService, type CreateOrderRequest, type OrderProduct } from '~/service/order.service';
import { ProfileService } from '~/service/profile.service';
import type { Route } from './+types/thanh-toan';

const profileService = new ProfileService();
const addressService = new AddressService();

export async function clientLoader() {
    try {
        const cartResponse = await cartService.getCart();
        const profileResponse = await profileService.getProfile();
        const addressResponse = await addressService.getUserAddress();

        return {
            cartItems: cartResponse?.[0]?.carts || [],
            profile: profileResponse?.[0]?.data || null,
            address: addressResponse?.[0] || [],
            error: null,
        };
    } catch (error) {
        console.error('Error loading checkout data:', error);
        return {
            cartItems: [],
            profile: null,
            address: [],
            error: 'Không thể tải thông tin thanh toán. Vui lòng thử lại sau.',
        };
    }
}

export default function Checkout({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItemWithProduct[]>(loaderData.cartItems);
    const [profile, setProfile] = useState(loaderData.profile);
    const [paymentMethod, setPaymentMethod] = useState<number>(0);
    const [error, setError] = useState<string | null>(loaderData.error);
    const [processing, setProcessing] = useState<boolean>(false);
    const [addressSele, setAddressSele] = useState(loaderData.address[0]);
    const [differentSpecsByProduct, setDifferentSpecsByProduct] = useState<Record<number, string[]>>({});

    // Hàm để xác định các thông số khác nhau giữa các biến thể của một sản phẩm
    const findDifferentSpecifications = (productId: number, cartItems: CartItemWithProduct[]) => {
        // Lọc ra các biến thể của sản phẩm hiện tại
        const productVariants = cartItems
            .filter(item => item.product_variant.product.id === productId)
            .map(item => item.product_variant);
        
        if (productVariants.length <= 1) {
            return Object.keys(productVariants[0]?.specifications || {});
        }

        const allSpecKeys = new Set<string>();
        
        // Thu thập tất cả các khóa từ các biến thể
        productVariants.forEach(variant => {
            Object.keys(variant.specifications).forEach(key => {
                allSpecKeys.add(key);
            });
        });

        // Kiểm tra từng khóa xem có khác nhau giữa các biến thể không
        const differentKeys = Array.from(allSpecKeys).filter(key => {
            const values = new Set<string>();
            
            // Thu thập tất cả giá trị cho khóa này từ mọi biến thể
            productVariants.forEach(variant => {
                if (variant.specifications[key] !== undefined) {
                    values.add(String(variant.specifications[key]));
                }
            });
            
            // Nếu có nhiều hơn 1 giá trị khác nhau, thì khóa này là khác nhau giữa các biến thể
            return values.size > 1;
        });

        return differentKeys.length > 0 ? differentKeys : Object.keys(productVariants[0]?.specifications || {});
    };

    // Phân tích và lưu trữ các thông số khác nhau cho mỗi sản phẩm
    useEffect(() => {
        const productIds = [...new Set(cartItems.map(item => item.product_variant.product.id))];
        const specsByProduct: Record<number, string[]> = {};

        productIds.forEach(productId => {
            specsByProduct[productId] = findDifferentSpecifications(productId, cartItems);
        });

        setDifferentSpecsByProduct(specsByProduct);
    }, [cartItems]);

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            return total + item.product_variant.price * item.amount;
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
        const orderProducts: OrderProduct[] = cartItems.map((item) => ({
            product_variant_id: item.product_variant_id,
            amount: item.amount,
        }));

        const orderData: CreateOrderRequest = {
            payment_method: paymentMethod,
            products: orderProducts,
            address_id: addressSele.id,
        };

        try {
            setProcessing(true);
            const response = await orderService.createOrder(orderData);

            if (response && response[0] && response[0].order) {
                navigate('/thanh-toan-thanh-cong')
            }
        } catch (err) {
            console.error('Error creating order:', err);
            setError('Không thể tạo đơn hàng. Vui lòng thử lại sau.');
        } finally {
            setProcessing(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
            amount
        );
    };

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
        <>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                    <div className="card bg-base-100 shadow-sm">
                        <div className="card-body">
                            <div className="card-title">Sản phẩm</div>
                            <div className="">
                                <table className="table table-xs">
                                    {/* head */}
                                    <thead>
                                        <tr>
                                            <th>Hình ảnh</th>
                                            <th>Sản phẩm</th>
                                            <th>Đơn giá</th>
                                            <th>Số lượng</th>
                                            <th>thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {error ? (
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="text-center py-4 text-error"
                                                >
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
                                                        <div className="avatar">
                                                            <div className="mask mask-squircle h-12 w-12">
                                                                {item.product_variant.product
                                                                    .product_images?.[0] ? (
                                                                    <img
                                                                        src={
                                                                            item.product_variant
                                                                                .product
                                                                                .product_images[0]
                                                                                .image_url
                                                                        }
                                                                        alt={
                                                                            item.product_variant
                                                                                .product.name
                                                                        }
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
                                                        {/* <span className="badge badge-ghost badge-sm">
                                                            {'('}
                                                            {differentSpecsByProduct[item.product_variant.product.id] ? (
                                                                differentSpecsByProduct[item.product_variant.product.id].map((key, index) => (
                                                                    <span key={key}>
                                                                        {key}: {String(item.product_variant.specifications[key] || 'N/A')}
                                                                        {differentSpecsByProduct[item.product_variant.product.id].length - 1 > index ? ', ' : ''}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                Object.entries(
                                                                    item.product_variant.specifications
                                                                ).map(([key, value], index) => (
                                                                    <span key={key}>
                                                                        {key}: {String(value)}
                                                                        {Object.keys(
                                                                            item.product_variant.specifications
                                                                        ).length - 1 > index ? ', ' : ''}
                                                                    </span>
                                                                ))
                                                            )}
                                                            {')'}
                                                        </span> */}
                                                    </td>
                                                    <td>
                                                        {formatCurrency(item.product_variant.price)}
                                                    </td>
                                                    <td>
                                                        <div className="join">
                                                            <input
                                                                className="input join-item w-12"
                                                                type="number"
                                                                value={item.amount}
                                                                min={1}
                                                                disabled={true}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {formatCurrency(
                                                            item.product_variant.price * item.amount
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <div className="flex flex-col gap-8">
                            <div className="card bg-base-100 shadow-sm">
                                <div className="card-body">
                                    <h2 className="card-title">
                                        Thông tin giao hàng
                                        <button className="btn btn-sm btn-outline ml-auto"
                                            onClick={() => {
                                                const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
                                                if (modal) {
                                                    modal.showModal();
                                                }
                                            }}>
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                    </h2>
                                    {addressSele ? (
                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between">
                                                    <span>Họ tên:</span>
                                                    <span>{addressSele.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Số điện thoại:</span>
                                                    <span>{addressSele.phone_number}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Địa chỉ:</span>
                                                    <span>
                                                        {`${addressSele.street}, ${addressSele.ward}, ${addressSele.district}, ${addressSele.city}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="alert alert-warning">
                                            Vui lòng đăng nhập để xem thông tin giao hàng
                                        </div>
                                    )}
                                </div>
                            </div>

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
                                                            {item.product_variant.product.name} (
                                                            {differentSpecsByProduct[item.product_variant.product.id] 
                                                                ? differentSpecsByProduct[item.product_variant.product.id]
                                                                    .map((key) => `${key}: ${String(item.product_variant.specifications[key] || 'N/A')}`)
                                                                    .join(', ')
                                                                : Object.entries(item.product_variant.specifications)
                                                                    .map((e) => `${e[0]}: ${e[1]}`)
                                                                    .join(', ')
                                                            }
                                                            ) x {item.amount}
                                                        </td>
                                                        <td className="text-right">
                                                            {formatCurrency(
                                                                item.product_variant.price *
                                                                    item.amount
                                                            )}
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
                                            <span className="text-xl">
                                                {formatCurrency(calculateTotal())}
                                            </span>
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
            </div>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">


                    <h2 className="card-title">Chọn Địa chỉ giao hàng</h2>
                    <div className="overflow-x-auto">
                        <table className="table table-xs">
                            <thead>
                                <tr>
                                    <th>Họ tên</th>
                                    <th>Số điện thoại</th>
                                    <th>Địa chỉ</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loaderData.address.map((address) => (
                                    <tr key={address.id}>
                                        <td>{address.name}</td>
                                        <td>{address.phone_number}</td>
                                        <td>
                                            {`${address.street}, ${address.ward}, ${address.district}, ${address.city}`}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => {
                                                    setAddressSele(address);
                                                    const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
                                                    if (modal) {
                                                        modal.close();
                                                    }
                                                }}
                                            >
                                                Chọn
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </dialog>
        </>
    );
}
