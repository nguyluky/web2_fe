import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

const userRoutes = [
    layout('./component/layout.tsx', [
        route('/tim-kiem', './routes/tim-kiem.tsx'),
        index('./routes/home.tsx'),
        route('/san-pham/:id', './routes/san-pham.tsx'),
        route('/san-pham-moi', './routes/newProduct.tsx'),
        ...prefix('danh-muc', [
            index('./routes/category/index.tsx'),
            route('/:id', './routes/category/category.tsx'),
        ]),

        route('tai-khoan', './component/tai-khoan-layout.tsx', [
            index('./routes/tai-khoan/index.tsx'),
            route('don-hang', './routes/tai-khoan/don-hang.tsx'),
            route('setting', './routes/tai-khoan/setting.tsx'),
            route('address', './routes/tai-khoan/address.tsx'),
        ]),
    ]),
    layout('./component/cart-layout.tsx', [
        route('/cart', './routes/cart.tsx'),
        route('/thanh-toan', './routes/thanh-toan.tsx'),
        route('/thanh-toan-thanh-cong', './routes/thanhtoan-thanhcong.tsx'),
    ]),

    // Thêm định tuyến cho đăng nhập và đăng ký
    ...prefix('auth', [
        route('/login', './routes/auth/login.tsx'),
        route('/register', './routes/auth/register.tsx'),
    ]),

];

const adminRoutes = [
    layout('admin/components/AdminLayout.tsx', [
        // route('/admin', ''),
        route('/admin/dashboard', './admin/components/DashBoard.tsx'),
        route('/admin/user', './admin/pages/User.tsx'),
        route('/admin/product', './admin/pages/Product.tsx'),
        route('/admin/category', './admin/pages/Category.tsx'),
        route('/admin/role', './admin/pages/Role.tsx'),
        route('/admin/supplier', './admin/pages/Supplier.tsx'),
        route('/admin/warranty', './admin/pages/Warranty.tsx'),
        route('/admin/order', './admin/pages/Order.tsx'),
        route('/admin/import', './admin/pages/Import.tsx'),
        route(
            '/admin/statistical/revenueandcoststatistics',
            './admin/pages/RevenueAndCostStatistics.tsx'
        ),
        route('/admin/statistical/inventorystatistics', './admin/pages/InventoryStatistics.tsx'),
    ]),
];

export default [...userRoutes, ...adminRoutes] satisfies RouteConfig;
