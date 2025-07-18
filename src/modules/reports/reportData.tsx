import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Modal,
  Form,
  Select,
  Button,
  message,
  Space,
  Popconfirm,
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
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [form] = Form.useForm();

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:3000/app/getReports");
      const activos = (res.data || []).filter((r: Report) => !r.deleteDate);
      setReports(activos);
    } catch (error) {
      message.error("Error al obtener reportes");
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

  const handleEdit = (report: Report) => {
    setEditingReport(report);
    form.setFieldsValue(report);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingReport(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingReport) {
        // Actualizar reporte
        await axios.put(
          `http://localhost:3000/app/actualizarReporte/${editingReport._id}`,
          values
        );
        message.success("Reporte actualizado correctamente");
      } else {
        // Crear nuevo reporte
        await axios.post("http://localhost:3000/app/crearReporte", values);
        message.success("Reporte creado correctamente");
      }

      setModalVisible(false);
      setEditingReport(null);
      fetchReports();
    } catch (err) {
      message.error("Error al guardar el reporte");
    }
  };

  const handleDelete = async (reportId: string) => {
    try {
      await axios.delete(
        `http://localhost:3000/app/eliminarReporte/${reportId}`
      );
      message.success("Reporte eliminado");
      fetchReports();
    } catch (err) {
      message.error("Error al eliminar el reporte");
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
          <Button type="link" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar reporte?"
            description="Esta acción no se puede deshacer"
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
      <h2>Gestión de Reportes</h2>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <Input
          placeholder="Buscar por título o descripción"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAdd}>
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
        title={editingReport ? "Editar Reporte" : "Crear Reporte"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        okText="Guardar"
        cancelText="Cancelar"
      >
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
            initialValue="pendiente"
          >
            <Select placeholder="Selecciona estado del reporte">
              <Option value="pendiente">Pendiente</Option>
              <Option value="completado">Completado</Option>
              <Option value="cancelado">Cancelado</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
