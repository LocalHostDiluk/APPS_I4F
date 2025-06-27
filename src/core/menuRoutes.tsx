import type { JSX } from "react";
import UserForm from "../modules/users/UserForm";
import Products from "../modules/products/products";
import Order from "../modules/order/order";
import Reports from "../reports/reports";
import Inicio from "../modules/dashboard/Inicio";

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
    element: <UserForm />,
    label: "Usuarios",
    icon: "UserOutlined",
  },
  {
    path: "/products",
    element: <Products />,
    label: "Productos",
    icon: "ShoppingOutlined",
  },
  {
    path: "/orders",
    element: <Order />,
    label: "Pedidos",
    icon: "ProfileOutlined",
  },
  {
    path: "/reports",
    element: <Reports />,
    label: "Reportes",
    icon: "BarChartOutlined",
  },
];

export default routes;
