import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./modules/dashboard/Dashboard";
import routes from "./core/menuRoutes";
import AuthRoutes from "./auth/AuthRoutes";
import LoginForm from "./modules/users/LoginForm";
import RegisterForm from "./modules/users/RegForm";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />

          <Route path="/registro" element={<RegisterForm/>}/>

          <Route
            path="/"
            element={
              <AuthRoutes>
                <Dashboard />
              </AuthRoutes>
            }
          >
            <Route index element={<Dashboard />} />
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
