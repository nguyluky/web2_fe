import { Link } from 'react-router';

export default function ThanhToanThanhCong() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Thanh toán thành công</h1>
            <p className="text-lg">Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi!</p>
            <p className="text-lg">Đơn hàng của bạn đang được xử lý.</p>
            <div className="flex gap-5 pt-10">
                <Link to={'/'} className="btn btn-primary">
                    Quay về trang chủ
                </Link>
                <Link to={'/tai-khoan/don-hang'} className="btn">
                    Xem đơn hàng
                </Link>
            </div>
        </div>
    );
}
