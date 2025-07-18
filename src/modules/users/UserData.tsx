import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  message,
  Select,
  Space,
  Popconfirm,
} from "antd";
import axios from "axios";

const { Option } = Select;

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string[];
  status: boolean;
}

interface Role {
  _id: string;
  name: string;
}

export default function UserData() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:3000/app/role");
      const rolesData = Array.isArray(res.data) ? res.data : [];

      // Adaptamos los roles a que tengan 'name'
      const mappedRoles = rolesData.map((role: any) => ({
        _id: role._id,
        name: role.type, // Añadimos el campo que tu frontend espera
      }));

      setRoles(mappedRoles);
    } catch (err) {
      console.error("Error al obtener roles:", err);
      setRoles([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/app/users");
      const activeUsers = Array.isArray(res.data.userList)
        ? res.data.userList.filter((u: User) => u.status === true)
        : [];
      setUsers(activeUsers);
      setFilteredUsers(activeUsers);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setUsers([]);
      setFilteredUsers([]);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter((u) => u.email.toLowerCase().includes(value));
    setFilteredUsers(filtered);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:3000/app/users/${userId}`);
      message.success("Usuario eliminado correctamente");
      fetchUsers();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      message.error("Error al eliminar usuario");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingUser) {
        await axios.put(
          `http://localhost:3000/app/users/${editingUser._id}`,
          values
        );
        message.success("Usuario actualizado correctamente");
      } else {
        await axios.post("http://localhost:3000/app/users", values);
        message.success("Usuario creado correctamente");
      }

      fetchUsers();
      setModalVisible(false);
    } catch (err) {
      console.error("Error al guardar usuario:", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Correo", dataIndex: "email", key: "email" },
    { title: "Teléfono", dataIndex: "phone", key: "phone" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: User) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Editar
          </Button>
          <Popconfirm
            title={`¿Eliminar a ${record.name}?`}
            description="Esta acción marcará al usuario como inactivo"
            okText="Sí, eliminar"
            cancelText="Cancelar"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Gestión de Usuarios</h2>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <Input
          placeholder="Buscar por correo"
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" onClick={openCreateModal}>
          Agregar Usuario
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingUser ? "Editar Usuario" : "Nuevo Usuario"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nombre"
            name="name"
            rules={[
              { required: true, message: "El nombre es obligatorio" },
              { min: 3, message: "Debe tener al menos 3 caracteres" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Correo"
            name="email"
            rules={[
              { required: true, message: "El correo es obligatorio" },
              { type: "email", message: "Formato de correo inválido" },
            ]}
          >
            <Input disabled={!!editingUser} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              label="Contraseña"
              name="password"
              rules={[
                { required: true, message: "La contraseña es obligatoria" },
                {
                  pattern:
                    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message:
                    "Mínimo 6 caracteres, una mayúscula, un número y un símbolo",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            label="Teléfono"
            name="phone"
            rules={[
              { required: true, message: "El teléfono es obligatorio" },
              {
                pattern: /^\d{10}$/,
                message: "Debe tener exactamente 10 dígitos",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              label="Rol"
              name="role"
              rules={[
                { required: true, message: "Selecciona al menos un rol" },
              ]}
            >
              {Array.isArray(roles) && roles.length > 0 ? (
                <Select mode="multiple" placeholder="Selecciona roles">
                  {roles.map((r) => (
                    <Option key={r._id} value={r._id}>
                      {r.name}
                    </Option>
                  ))}
                </Select>
              ) : (
                <div>Cargando roles...</div>
              )}
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}
