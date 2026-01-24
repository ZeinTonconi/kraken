import { Button, Card, Space, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import type { Enrollment } from "../../../types/academics";

type SummaryPanelProps = {
  enrollments: Enrollment[];
  hasPendingRoles: boolean;
  onSelectRoles?: () => void;
};

const formatLabel = (value: string) => {
  return value.toLowerCase().replace(/_/g, " ");
};

const getPrimaryEnrollment = (enrollments: Enrollment[]) => {
  const approved = enrollments.filter((enrollment) => enrollment.status === "APPROVED");
  const practica = approved.find((enrollment) => enrollment.track === "PRACTICA_INTERNA");
  return practica ?? approved[0] ?? null;
};

export function SummaryPanel({
  enrollments,
  hasPendingRoles,
  onSelectRoles,
}: SummaryPanelProps) {
  if (enrollments.length === 0) {
    return (
      <Card className="dashboard-card summary-panel">
        <Space direction="vertical" size={12}>
          <Typography.Title level={5} className="!m-0">
            Aún no tienes cursos
          </Typography.Title>
          <Typography.Text type="secondary">
            Explora los cursos disponibles para iniciar tu ruta.
          </Typography.Text>
          <Button type="primary">
            <Link to="/offerings/available">Explorar cursos disponibles</Link>
          </Button>
        </Space>
      </Card>
    );
  }

  const primaryEnrollment = getPrimaryEnrollment(enrollments);
  const primaryTrack = primaryEnrollment ? formatLabel(primaryEnrollment.track) : "sin track";
  const statusLabel = primaryEnrollment ? formatLabel(primaryEnrollment.status) : "sin estado";

  return (
    <Card className="dashboard-card summary-panel">
      <Space direction="vertical" size={12}>
        <Typography.Title level={5} className="!m-0">
          Resumen
        </Typography.Title>
        <Space size={8} wrap>
          <Tag color="blue">{primaryTrack}</Tag>
          <Tag color="default">{statusLabel}</Tag>
          {hasPendingRoles ? (
            <Tag color="gold">Roles pendientes</Tag>
          ) : (
            <Tag color="green">Roles configurados</Tag>
          )}
        </Space>
        <Space direction="vertical" size={6}>
          <Typography.Text type="secondary">Qué sigue</Typography.Text>
          <Typography.Text>
            {hasPendingRoles
              ? "Selecciona tus roles para avanzar en la práctica."
              : "Todo listo. Esperando inicio del programa."}
          </Typography.Text>
        </Space>
        {hasPendingRoles ? (
          <Button type="primary" onClick={onSelectRoles}>
            Elegir roles
          </Button>
        ) : (
          <Button>
            <Link to="/offerings/available">Ver cursos disponibles</Link>
          </Button>
        )}
      </Space>
    </Card>
  );
}
