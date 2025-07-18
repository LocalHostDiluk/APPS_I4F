import type { JSX } from "react";
import Inicio from "../modules/dashboard/Inicio";
import OrderData from "../modules/order/orderData";
import ProductData from "../modules/products/productsData";
import UserData from "../modules/users/UserData";
import ReportData from "../modules/reports/reportData";

export interface AppRoute {
  path: string;
  element: JSX.Element;
  label: string;
  icon?: string;
}

const routes: AppRoute[] = [
  {
    path: "/dashboard",
    element: <Inicio />,
    label: "Inicio",
    icon: "HomeOutlined",
  },
  {
    path: "/users",
    element: <UserData />,
    label: "Usuarios",
    icon: "UserOutlined",
  },
  {
    path: "/products",
    element: <ProductData />,
    label: "Productos",
    icon: "ShoppingOutlined",
  },
  {
    path: "/orders",
    element: <OrderData />,
    label: "Pedidos",
    icon: "ProfileOutlined",
  },
  {
    path: "/reports",
    element: <ReportData />,
    label: "Reportes",
    icon: "BarChartOutlined",
  },
];

export default routes;
