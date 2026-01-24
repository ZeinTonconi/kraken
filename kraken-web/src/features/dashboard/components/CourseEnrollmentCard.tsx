import { Button, Card, Descriptions, Space, Steps, Tag, Typography, message } from "antd";
import { InfoCircleOutlined, TeamOutlined, FileTextOutlined } from "@ant-design/icons";
import type { Enrollment } from "../../../types/academics";

type CourseEnrollmentCardProps = {
  enrollment: Enrollment;
  onSelectRoles?: (enrollmentId: string) => void;
};

const formatLabel = (value: string) => {
  return value.toLowerCase().replace(/_/g, " ");
};

const roleColorMap: Record<string, string> = {
  QA: "purple",
  FRONTEND: "geekblue",
  BACKEND: "cyan",
  DEVOPS: "volcano",
};

const getRoleColor = (role: string) => {
  return roleColorMap[role] ?? "blue";
};

const getStepIndex = (enrollment: Enrollment) => {
  if (enrollment.status === "APPROVED") {
    if (enrollment.prefRole1 && enrollment.prefRole2) {
      return 2;
    }
    return 1;
  }
  return 0;
};

export function CourseEnrollmentCard({
  enrollment,
  onSelectRoles,
}: CourseEnrollmentCardProps) {
  const hasRoles = Boolean(enrollment.prefRole1 && enrollment.prefRole2);
  const primaryRole = enrollment.primaryRole ?? enrollment.prefRole3 ?? null;
  const currentStep = getStepIndex(enrollment);

  return (
    <Card
      className="dashboard-card course-card"
      title={
        <Space direction="vertical" size={2}>
          <Typography.Text strong>
            {enrollment.offering?.course?.name ?? "Curso sin nombre"}
          </Typography.Text>
          <Typography.Text type="secondary">
            {enrollment.offering?.term?.name ?? "Sin periodo"} •{" "}
            {enrollment.offering?.term?.year ?? "N/A"}
            {enrollment.offering?.term?.period ? ` • ${enrollment.offering.term.period}` : ""}
          </Typography.Text>
        </Space>
      }
      actions={[
        <Button
          key="details"
          type="text"
          icon={<FileTextOutlined />}
          onClick={() => message.info("Detalles próximamente.")}
        >
          Ver detalles
        </Button>,
        <Button
          key="teams"
          type="text"
          icon={<TeamOutlined />}
          disabled
          onClick={() => null}
        >
          Ir a equipos
        </Button>,
        <Button
          key="help"
          type="text"
          icon={<InfoCircleOutlined />}
          onClick={() => message.info("Estamos preparando la sección de ayuda.")}
        >
          Ayuda
        </Button>,
      ]}
    >
      <Space direction="vertical" size={12} className="w-full">
        <Descriptions column={2} size="small" className="dashboard-descriptions">
          <Descriptions.Item label="Docente">
            {enrollment.offering?.teacher?.profile?.fullName ??
              enrollment.offering?.teacher?.email ??
              "Docente por definir"}
          </Descriptions.Item>
          <Descriptions.Item label="Track">
            <Tag color="blue">{formatLabel(enrollment.track)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Estado">
            <Tag color="default">{formatLabel(enrollment.status)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Gestión">
            {enrollment.offering?.term?.year ?? "N/A"}
          </Descriptions.Item>
        </Descriptions>

        {enrollment.track === "PRACTICA_INTERNA" && enrollment.status === "APPROVED" ? (
          <div className="course-roles">
            {hasRoles ? (
              <Space direction="vertical" size={8} className="w-full">
                <Tag color="green">Roles configurados ✅</Tag>
                <Space direction="vertical" size={4}>
                  <Typography.Text type="secondary">Obligatorio/asignado</Typography.Text>
                  <Tag color={primaryRole ? getRoleColor(primaryRole) : "default"}>
                    {primaryRole ?? "N/A"}
                  </Tag>
                </Space>
                <Space direction="vertical" size={4}>
                  <Typography.Text type="secondary">Preferencias</Typography.Text>
                  <Space size={8} wrap>
                    {enrollment.prefRole1 ? (
                      <Tag color={getRoleColor(enrollment.prefRole1)}>
                        {enrollment.prefRole1}
                      </Tag>
                    ) : null}
                    {enrollment.prefRole2 ? (
                      <Tag color={getRoleColor(enrollment.prefRole2)}>
                        {enrollment.prefRole2}
                      </Tag>
                    ) : null}
                  </Space>
                </Space>
              </Space>
            ) : (
              <Space direction="vertical" size={8}>
                <Tag color="gold">Roles pendientes</Tag>
                <Button type="primary" onClick={() => onSelectRoles?.(enrollment.id)}>
                  Elegir roles
                </Button>
              </Space>
            )}
          </div>
        ) : null}

        <Steps
          size="small"
          current={currentStep}
          items={[
            { title: "Applied" },
            { title: "Approved" },
            { title: "Roles" },
            { title: "Program start" },
          ]}
        />
      </Space>
    </Card>
  );
}
