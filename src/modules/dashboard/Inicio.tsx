import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography, message } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  DropboxOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";

const { Title } = Typography;
const COLORS = ["#1890ff", "#52c41a", "#faad14", "#eb2f96"];

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [ordersByMonth, setOrdersByMonth] = useState([]);
  const [productByCategory, setProductByCategory] = useState([]);

  const fetchAllData = async () => {
    try {
      const [productRes, orderRes, userRes] = await Promise.all([
        axios.get("http://localhost:3000/app/products"),
        axios.get("http://localhost:3000/app/order"),
        axios.get("http://localhost:3000/app/users"),
      ]);

      setProducts(productRes.data);
      setOrders(orderRes.data);
      setUsers(userRes.data.userList);

      // Procesar órdenes por mes
      const monthlyOrders = {};
      orderRes.data.forEach((order: any) => {
        const date = new Date(order.createDate);
        const key = `${date.toLocaleString("default", {
          month: "short",
        })} ${date.getFullYear()}`;
        monthlyOrders[key] = (monthlyOrders[key] || 0) + 1;
      });
      const orderedMonths = Object.entries(monthlyOrders).map(
        ([month, orders]) => ({ month, orders })
      );
      setOrdersByMonth(orderedMonths);

      // Categorías (si los productos tienen una propiedad `category`)
      const categoryCounts: Record<string, number> = {};
      productRes.data.forEach((p: any) => {
        const cat = p.category || "Sin Categoría";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
      const formattedCategories = Object.entries(categoryCounts).map(
        ([category, count]) => ({ category, count })
      );
      setProductByCategory(formattedCategories);
    } catch (err) {
      console.error("Error fetching data:", err);
      message.error("Error cargando el dashboard");
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Panel de Control</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Productos"
              value={products.length}
              prefix={<DropboxOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Órdenes"
              value={orders.length}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Usuarios"
              value={users.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Card title="Órdenes por Mes">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ordersByMonth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Productos por Categoría">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={productByCategory}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {productByCategory.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
