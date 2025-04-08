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
  ]),
  layout("./component/cart-layout.tsx", [route("/cart", "./routes/cart.tsx")]),
] satisfies RouteConfig;
