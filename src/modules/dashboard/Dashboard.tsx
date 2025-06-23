import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { Outlet } from "react-router-dom";
import MenuDynamic from "./MenuDynamic";

function Dashboard() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220}>
        <MenuDynamic></MenuDynamic>
      </Sider>
      <Layout>
        <Header></Header>
        <Content
          style={{ padding: 24, margin: "24px 16px 0", background: "#fff" }}
        >
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default Dashboard;
