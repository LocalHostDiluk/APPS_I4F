import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Modal,
  Form,
  Select,
  Button,
  message,
  Space,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";

const { Option } = Select;

interface Report {
  _id: string;
  title: string;
  description: string;
  status: "pendiente" | "completado" | "cancelado";
  createDate: string;
  updateDate?: string;
  deleteDate?: string | null;
}

export default function ReportData() {
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"crear" | "editar" | "eliminar">("crear");
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [form] = Form.useForm();

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:3000/app/getReports");
      const activos = (res.data || []).filter((r: Report) => !r.deleteDate);
      setReports(activos);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(search.toLowerCase()) ||
      report.description?.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (mode: "crear" | "editar" | "eliminar", report?: Report) => {
    setModalMode(mode);
    setEditingReport(report || null);
    if (mode !== "eliminar") {
      form.setFieldsValue(report || {});
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      if (modalMode === "eliminar" && editingReport) {
        await axios.delete(
          `http://localhost:3000/app/eliminarReporte/${editingReport._id}`
        );
        message.success("Reporte eliminado");
      } else {
        const values = await form.validateFields();
        if (editingReport) {
          await axios.put(
            `http://localhost:3000/app/actualizarReporte/${editingReport._id}`,
            values
          );
          message.success("Reporte actualizado correctamente");
        } else {
          await axios.post("http://localhost:3000/app/crearReporte", values);
          message.success("Reporte creado correctamente");
        }
      }

      setModalVisible(false);
      setEditingReport(null);
      fetchReports();
    } catch (err) {
      console.error("Error saving report:", err);
    }
  };

  const columns: ColumnsType<Report> = [
    { title: "Título", dataIndex: "title", key: "title" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) =>
        status.charAt(0).toUpperCase() + status.slice(1),
    },
    {
      title: "Creado el",
      dataIndex: "createDate",
      key: "createDate",
      render: (date: string) =>
        new Date(date).toLocaleDateString("es-MX", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Report) => (
        <Space>
          <Button type="link" onClick={() => openModal("editar", record)}>
            Editar
          </Button>
          <Button type="link" danger onClick={() => openModal("eliminar", record)}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Gestión de Reportes</h2>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <Input
          placeholder="Buscar por título o descripción"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => openModal("crear")}>
          Crear Reporte
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredReports}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={
          modalMode === "crear"
            ? "Crear Reporte"
            : modalMode === "editar"
            ? "Editar Reporte"
            : "Eliminar Reporte"
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        okText={modalMode === "eliminar" ? "Eliminar" : "Guardar"}
        cancelText="Cancelar"
      >
        {modalMode === "eliminar" ? (
          <p>¿Deseas eliminar este reporte?</p>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Título"
              rules={[
                { required: true, message: "El título es obligatorio" },
                { min: 3, message: "Mínimo 3 caracteres" },
                { max: 100, message: "Máximo 100 caracteres" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Descripción"
              rules={[
                { required: true, message: "La descripción es obligatoria" },
                { min: 10, message: "Mínimo 10 caracteres" },
                { max: 300, message: "Máximo 300 caracteres" },
              ]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Estado"
              rules={[{ required: true, message: "Selecciona un estado" }]}
            >
              <Select placeholder="Selecciona estado del reporte">
                <Option value="pendiente">Pendiente</Option>
                <Option value="completado">Completado</Option>
                <Option value="cancelado">Cancelado</Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
