import {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  ProfileOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Menu, Spin, Empty } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

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
  const location = useLocation();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!token || !user?.role) return;

    const getMenu = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/app/menu/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roles: user.role }),
        });
        const menuList = await response.json();
        setMenuItems(menuList);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    getMenu();
  }, [user, token]);

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

  if (loading) {
    return (
      <div style={{ paddingTop: 50, textAlign: "center" }}>
        <Spin
          tip={
            <span style={{ color: "#52c41a", fontWeight: 500 }}>
              Cargando menú...
            </span>
          }
          size="large"
        />
      </div>
    );
  }

  if (!menuItems.length) {
    return (
      <div style={{ paddingTop: 50, textAlign: "center" }}>
        <Empty
          description={
            <span style={{ color: "#ff4d4f", fontWeight: 500 }}>
              No hay elementos en el menú
            </span>
          }
        />
      </div>
    );
  }

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => {
        if (key !== location.pathname) {
          navigate(key);
        }
      }}
      items={renderMenu()}
      style={{ height: "100%", borderRight: 0 }}
    />
  );
}

export default MenuDynamic;
