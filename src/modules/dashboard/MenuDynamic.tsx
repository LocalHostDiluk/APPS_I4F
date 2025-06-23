import {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  ProfileOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Icons = {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  ShoppingOutlined,
  ProfileOutlined,
};

interface MenuItem {
  title: string;
  path: string;
  icon: string;
  roles: string[];
}

function MenuDynamic() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const navigate = useNavigate();

  const fakeMenuData = [
    {
      title: "Usuarios",
      path: "/users",
      icon: "UserOutlined",
      roles: ["665a1f2b40fd3a12b3e77612"],
    },
    {
      title: "Productos",
      path: "/products",
      icon: "ShoppingOutlined",
      roles: ["665a1f2b40fd3a12b3e77611", "665a1f2b40fd3a12b3e77612"],
    },
    {
      title: "Ordenes",
      path: "/orders",
      icon: "ProfileOutlined",
      roles: ["665a1f2b40fd3a12b3e77611"],
    },
    {
      title: "Reportes",
      path: "/reports",
      icon: "BarChartOutlined",
      roles: ["665a1f2b40fd3a12b3e77611", "665a1f2b40fd3a12b3e77612"],
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setMenuItems(fakeMenuData);
    }, 500);
  }, []); // Dependencias aquí

  const renderMenu = () => {
    return menuItems.map((item) => {
      const IconComponent = Icons[item.icon as keyof typeof Icons];
      return {
        key: item.path,
        icon: IconComponent ? <IconComponent /> : null,
        label: item.title,
      };
    });
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      items={renderMenu()}
      style={{ height: "100%", borderRight: 0 }}
    />
  );
}

export default MenuDynamic;
