import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

const userRoutes = [
  layout('./component/layout.tsx', [
    index('./routes/home.tsx'),
    route('/san-pham/:id', './routes/san-pham.tsx'),
    ...prefix('danh-muc', [
      index('./routes/category/index.tsx'),
      route('/:id', './routes/category/category.tsx'),
    ]),
    // ...prefix("tai-khoan", [
    //     index("./routes/tai-khoan/index.tsx")
    // ])
    
    route('tai-khoan', "./component/tai-khoan-layout.tsx", [
        index('./routes/tai-khoan/index.tsx'),
        route('don-hang', './routes/tai-khoan/don-hang.tsx'),
    ]),
  ]),
  layout("./component/cart-layout.tsx", [
    route("/cart", "./routes/cart.tsx"),
    route("/cart/thanh-toan", "./routes/thanh-toan.tsx"),
])]

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
