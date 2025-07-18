import React from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "mx", label: "Mexico" },
  { value: "gb", label: "United Kingdom" },
  { value: "au", label: "Australia" },
];

type FieldType = {
  email?: string;
  fullName?: string;
  password?: string;
  confirmPassword?: string;
  country?: string;
  phoneNumber?: string;
  receiveUpdates?: boolean;
};

function RegisterForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const payload = {
        name: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phoneNumber || "",
        role: ["685bfd49654ce0bb55969f51"], // 👈 Cambia por el ID real de rol por defecto
      };

      const response = await fetch("http://localhost:3000/app/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Error al registrar el usuario");
      }

      form.resetFields();
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
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
          ¡Crea tu cuenta!
        </h2>

        <Form
          form={form}
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item<FieldType>
            label={
              <span className="text-sm font-medium text-gray-700">Email</span>
            }
            name="email"
            rules={[
              {
                required: true,
                message: "Por favor introduce tu correo electrónico",
              },
              { type: "email", message: "Introduce un correo válido" },
            ]}
            className="mb-4"
          >
            <Input
              size="large"
              placeholder="you@example.com"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </Form.Item>

          <Form.Item<FieldType>
            label={
              <span className="text-sm font-medium text-gray-700">
                Nombre completo
              </span>
            }
            name="fullName"
            rules={[
              {
                required: true,
                message: "Por favor introduce tu nombre completo",
              },
            ]}
            className="mb-4"
          >
            <Input
              size="large"
              placeholder="Juan Pérez"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </Form.Item>

          <Form.Item<FieldType>
            label={
              <span className="text-sm font-medium text-gray-700">
                Contraseña
              </span>
            }
            name="password"
            rules={[
              { required: true, message: "Por favor introduce una contraseña" },
              {
                min: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            ]}
            hasFeedback
            className="mb-4"
          >
            <Input.Password
              size="large"
              placeholder="••••••••"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </Form.Item>

          <Form.Item<FieldType>
            label={
              <span className="text-sm font-medium text-gray-700">
                Confirmar contraseña
              </span>
            }
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Confirma tu contraseña" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Las contraseñas no coinciden")
                  );
                },
              }),
            ]}
            className="mb-4"
          >
            <Input.Password
              size="large"
              placeholder="••••••••"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </Form.Item>

          <Form.Item<FieldType>
            label={
              <span className="text-sm font-medium text-gray-700">
                Teléfono
              </span>
            }
            name="phoneNumber"
            rules={[
              {
                pattern: /^[0-9\s-()]*$/,
                message: "Introduce un teléfono válido",
              },
            ]}
            className="mb-4"
          >
            <Input
              size="large"
              placeholder="(123) 456-7890"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </Form.Item>

          <Form.Item<FieldType>
            label={
              <span className="text-sm font-medium text-gray-700">País</span>
            }
            name="country"
            rules={[{ required: true, message: "Selecciona tu país" }]}
            className="mb-6"
          >
            <Select
              size="large"
              placeholder="Selecciona tu país"
              className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md"
            >
              {countries.map((country) => (
                <Option key={country.value} value={country.value}>
                  {country.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<FieldType>
            name="receiveUpdates"
            valuePropName="checked"
            className="mb-6 flex justify-start items-center"
          >
            <Checkbox className="text-gray-600">
              Acepto los términos y condiciones.
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Crear cuenta
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Inicia sesión aquí
          </a>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
