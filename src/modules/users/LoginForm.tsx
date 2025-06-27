import { Button, Form, Input, type FormProps } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

type FieldType = {
  email?: string;
  password?: string;
};

function LoginForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async () => {
    try {
      const values = form.getFieldsValue();

      const response = await fetch("http://localhost:3000/app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      login(data.accessToken, data.user);
      navigate("/dashboard");
      form.resetFields();
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="flex justify-center">
          <svg
            className="h-12 w-12 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Inicia sesión en tu cuenta
        </h2>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          form={form}
        >
          <Form.Item<FieldType>
            label={
              <span className="text-sm font-medium text-gray-700">
                Username
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Please input your email address!" },
            ]}
            className="mb-4"
          >
            <Input size="large" placeholder="you@example.com" />
          </Form.Item>

          <Form.Item<FieldType>
            label={
              <div className="flex justify-between w-full">
                <span className="text-sm font-medium text-gray-700">
                  Password
                </span>
              </div>
            }
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            className="mb-6"
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button
              onClick={handleSubmit}
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes cuenta?{" "}
          <a
            href="/registro"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Regístrate aquí
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
