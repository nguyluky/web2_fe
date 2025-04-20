import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./component/layout.tsx", [
    index("./routes/home.tsx"),
    route("/san-pham/:id", "./routes/san-pham.tsx"),
    ...prefix("danh-muc", [
      index("./routes/category/index.tsx"),
      route("/:id", "./routes/category/category.tsx"),
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
]),
] satisfies RouteConfig;
