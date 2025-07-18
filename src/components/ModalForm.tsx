import React from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  options?: { label: string; value: string }[];
  required?: boolean;
  rules?: any[];
}

interface ModalFormProps {
  visible: boolean;
  mode: "crear" | "editar" | "eliminar";
  confirmLoading?: boolean;
  onCancel: () => void;
  onOk: (values?: any) => void;
  initialValues?: any;
  fields: FieldConfig[];
}

const ModalForm: React.FC<ModalFormProps> = ({
  visible,
  mode,
  onCancel,
  onOk,
  initialValues = {},
  fields,
  confirmLoading,
}) => {
  const [form] = Form.useForm();
  const isDelete = mode === "eliminar";

  const handleOk = () => {
    if (isDelete) {
      onOk(initialValues); // ejecuta directamente sin validar
    } else {
      form.validateFields().then((values) => onOk(values));
    }
  };

  return (
    <Modal
      title={
        mode === "crear"
          ? "Crear Producto"
          : mode === "editar"
          ? "Editar Producto"
          : "Eliminar Producto"
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText={mode === "eliminar" ? "Eliminar" : "Guardar"}
      cancelText="Cancelar"
      confirmLoading={confirmLoading}
      okButtonProps={mode === "eliminar" ? { danger: true } : {}}
    >
      {!isDelete ? (
        <Form form={form} layout="vertical" initialValues={initialValues}>
          {fields.map((field) => {
            const rules =
              field.rules ||
              (field.required
                ? [{ required: true, message: `${field.label} es requerido` }]
                : []);

            if (field.type === "number") {
              return (
                <Form.Item
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  rules={rules}
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              );
            }

            if (field.type === "select") {
              return (
                <Form.Item
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  rules={rules}
                >
                  <Select options={field.options} />
                </Form.Item>
              );
            }

            return (
              <Form.Item
                key={field.name}
                label={field.label}
                name={field.name}
                rules={rules}
              >
                <Input />
              </Form.Item>
            );
          })}
        </Form>
      ) : (
        <p>
          ¿Estás seguro de que deseas eliminar este producto? Esta acción no se
          puede deshacer.
        </p>
      )}
    </Modal>
  );
};

export default ModalForm;
