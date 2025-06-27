import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import MenuDynamic from "./MenuDynamic";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

function Dashboard() {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log("Pantalla rota:", broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log("Estado:", collapsed, "Tipo:", type);
        }}
        width={220}
      >
        <div
          onClick={() => navigate("/dashboard")}
          style={{
            height: 50,
            margin: "16px",
            background: "#4CAF50",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 18,
            fontWeight: 600,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            transition: "background 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#43a047";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#4CAF50";
          }}
        >
          <HomeOutlined style={{ marginRight: 8 }} />
          Inicio
        </div>
        <MenuDynamic />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
