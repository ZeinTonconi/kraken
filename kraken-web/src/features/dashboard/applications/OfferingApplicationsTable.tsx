import {
  Avatar,
  Button,
  Input,
  Segmented,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { ApplicationStatus, OfferingApplication } from "./types";

type OfferingApplicationsTableProps = {
  loading: boolean;
  data: OfferingApplication[];
  total: number;
  page: number;
  pageSize: number;
  status: ApplicationStatus | "ALL";
  query: string;
  onStatusChange: (value: ApplicationStatus | "ALL") => void;
  onQueryChange: (value: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
  onApprove: (record: OfferingApplication) => void;
  onReject: (record: OfferingApplication) => void;
  onView: (record: OfferingApplication) => void;
  disableReject?: boolean;
};

const statusColor: Record<ApplicationStatus, string> = {
  APPLIED: "gold",
  APPROVED: "green",
  REJECTED: "red",
};

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "N/A"
    : date.toLocaleDateString("es-BO");
};

export function OfferingApplicationsTable({
  loading,
  data,
  total,
  page,
  pageSize,
  status,
  query,
  onStatusChange,
  onQueryChange,
  onPageChange,
  onApprove,
  onReject,
  onView,
  disableReject = false,
}: OfferingApplicationsTableProps) {
  const columns: ColumnsType<OfferingApplication> = [
    {
      title: "Estudiante",
      dataIndex: ["student", "fullName"],
      render: (_, record) => {
        const initials = record.student.fullName
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("");
        return (
          <Space>
            <Avatar>{initials || "U"}</Avatar>
            <Space direction="vertical" size={0}>
              <Typography.Text>{record.student.fullName}</Typography.Text>
              <Typography.Text type="secondary">
                {record.student.email}
              </Typography.Text>
            </Space>
          </Space>
        );
      },
    },
    {
      title: "Email",
      dataIndex: ["student", "email"],
      responsive: ["lg"],
    },
    {
      title: "Track",
      dataIndex: "track",
      render: (value: string) => value.replace(/_/g, " ").toLowerCase(),
    },
    {
      title: "Fecha",
      dataIndex: "createdAt",
      render: (value: string) => formatDate(value),
    },
    {
      title: "Estado",
      dataIndex: "status",
      render: (value: ApplicationStatus) => {
        const map = {
          APPLIED: {
            bg: "rgba(242,201,76,.18)",
            text: "#8a6d1d",
            label: "pendiente",
          },
          APPROVED: {
            bg: "rgba(39,174,96,.16)",
            text: "#1e874b",
            label: "aprobada",
          },
          REJECTED: {
            bg: "rgba(235,87,87,.16)",
            text: "#b23b3b",
            label: "rechazada",
          },
        }[value];

        return (
          <span
            style={{
              background: map.bg,
              color: map.text,
              padding: "4px 10px",
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 12,
              display: "inline-block",
            }}
          >
            {map.label}
          </span>
        );
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Aprobar">
            <Button
              type="text"
              shape="circle"
              icon={<CheckOutlined />}
              onClick={() => onApprove(record)}
              disabled={record.status !== "APPLIED"}
              className="ka-action ka-action--approve"
            />
          </Tooltip>
          <Tooltip title="Rechazar">
            <Button
              type="text"
              shape="circle"
              icon={<CloseOutlined />}
              onClick={() => onReject(record)}
              disabled={record.status !== "APPLIED" || disableReject}
              className="ka-action ka-action--reject"
            />
          </Tooltip>

          <Tooltip title="Ver detalle">
            <Button
              type="text"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              className="ka-action"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={12} className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={status}
          onChange={(value) =>
            onStatusChange(value as ApplicationStatus | "ALL")
          }
          options={[
            { label: "Todas", value: "ALL" },
            { label: "Pendientes", value: "APPLIED" },
            { label: "Aprobadas", value: "APPROVED" },
            { label: "Rechazadas", value: "REJECTED" },
          ]}
        />
        <Input.Search
          allowClear
          placeholder="Buscar por nombre o email"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>

      <Table
        className="ka-table"
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        size="middle"
        bordered={false}
        rowClassName={(record) =>
          record.status === "APPLIED" ? "ka-row--pending" : ""
        }
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
          showTotal: (totalItems, range) =>
            `Mostrando ${range[0]}–${range[1]} de ${totalItems}`,
          onChange: onPageChange,
        }}
      />
    </Space>
  );
}
