import { Button, Form, Input } from "antd";

function UserForm() {
  const [formUser] = Form.useForm();

  return (
    <Form
      name="form_item_path"
      layout="horizontal"
      form={formUser}
      style={{
        backgroundColor: "#f0f2f5",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <Form.Item>
        <h1 className="text-2xl font-bold">User Form</h1>
      </Form.Item>
      <Form.Item
        label="Name"
        name="Name"
        rules={[{ required: true, message: "Please input your name!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="Email"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Role"
        name="Role"
        rules={[{ required: true, message: "Please input your role!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Phone"
        name="Phone"
        rules={[{ required: true, message: "Please input your phone!" }]}
      >
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
}

export default UserForm;
