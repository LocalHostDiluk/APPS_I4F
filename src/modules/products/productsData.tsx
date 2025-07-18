import { useEffect, useState } from "react";
import { Table, Input, Button, message, Space} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import ModalForm from "../../components/ModalForm";

interface Product {
  _id: string;
  name: string;
  description: string;
  cant: number;
  price: number;
  createDate: string;
  deleteDate: string | null;
  status: boolean;
}

export default function ProductData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"crear" | "editar" | "eliminar">(
    "crear"
  );
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchProducts = () => {
    axios
      .get("http://localhost:3000/app/products")
      .then((res) => {
        const data = res.data.products || [];
        setProducts(data.filter((p: Product) => p.status !== false));
      })
      .catch(() => message.error("Error al obtener productos"));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fields = [
    {
      name: "name",
      label: "Nombre",
      type: "text",
      required: true,
      rules: [
        { required: true, message: "El nombre es obligatorio" },
        {
          pattern: /^[A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s]{3,50}$/,
          message: "3-50 caracteres: letras, números o espacios",
        },
      ],
    },
    {
      name: "description",
      label: "Descripción",
      type: "text",
      required: true,
      rules: [
        { required: true, message: "La descripción es obligatoria" },
        { min: 10, message: "Debe tener al menos 10 caracteres" },
        { max: 200, message: "Máximo 200 caracteres" },
      ],
    },
    {
      name: "cant",
      label: "Cantidad",
      type: "number",
      required: true,
      rules: [
        { required: true, message: "La cantidad es obligatoria" },
        { type: "number", min: 1, message: "Mínimo 1" },
      ],
    },
    {
      name: "price",
      label: "Precio",
      type: "number",
      required: true,
      rules: [
        { required: true, message: "El precio es obligatorio" },
        { type: "number", min: 0.01, message: "Debe ser mayor a 0" },
        {
          validator: (_: any, value: any) =>
            /^\d+(\.\d{1,2})?$/.test(String(value))
              ? Promise.resolve()
              : Promise.reject("Máximo 2 decimales"),
        },
      ],
    },
  ];

  const openModal = (
    mode: "crear" | "editar" | "eliminar",
    product?: Product
  ) => {
    setModalMode(mode);
    setEditingProduct(product || null);
    setModalVisible(true);
  };

  const handleOk = async (values?: any) => {
    setConfirmLoading(true);
    try {
      if (modalMode === "crear") {
        await axios.post("http://localhost:3000/app/products", values);
        message.success("Producto creado correctamente");
      } else if (modalMode === "editar" && editingProduct) {
        await axios.patch(
          `http://localhost:3000/app/products/${editingProduct._id}`,
          values
        );
        message.success("Producto actualizado correctamente");
      } else if (modalMode === "eliminar" && editingProduct) {
        await axios.delete(
          `http://localhost:3000/app/products/${editingProduct._id}`
        );
        message.success("Producto eliminado correctamente");
      }
      fetchProducts();
    } catch (err) {
      message.error("Ocurrió un error al procesar la solicitud");
      console.error("Error:", err);
    } finally {
      setConfirmLoading(false);
      setModalVisible(false);
      setEditingProduct(null);
    }
  };

  const columns: ColumnsType<Product> = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Cantidad", dataIndex: "cant", key: "cant" },
    { title: "Precio", dataIndex: "price", key: "price" },
    {
      title: "Fecha de Creación",
      dataIndex: "createDate",
      key: "createDate",
      render: (date: string) => new Date(date).toLocaleDateString("es-MX"),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record: Product) => (
        <Space>
          <Button type="link" onClick={() => openModal("editar", record)}>
            Editar
          </Button>
          <Button
            danger
            type="link"
            onClick={() => openModal("eliminar", record)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      <h2>Gestión de Productos</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" onClick={() => openModal("crear")}>
          Agregar Producto
        </Button>
      </div>

      <Table columns={columns} dataSource={filteredProducts} rowKey="_id" />

      <ModalForm
        visible={modalVisible}
        mode={modalMode}
        onCancel={() => {
          setModalVisible(false);
          setEditingProduct(null);
        }}
        onOk={handleOk}
        initialValues={editingProduct || {}}
        fields={fields}
        confirmLoading={confirmLoading}
      />
    </div>
  );
}
