import { Button, Card, Space, Tag, Typography } from "antd";
import type { OfferingSummary } from "./types";

type OfferingCardProps = {
  offering: OfferingSummary;
  onOpen: (offeringId: string) => void;
};

export function OfferingCard({ offering, onOpen }: OfferingCardProps) {
  return (
    <Card className="dashboard-card offering-card">
      <Space direction="vertical" size={10} className="w-full">
        <Typography.Title level={5} className="!m-0">
          {offering.name}
        </Typography.Title>
        {offering.secondary ? (
          <Typography.Text type="secondary">{offering.secondary}</Typography.Text>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Tag color="default">Total: {offering.total}</Tag>
          <Tag color="gold">Pendientes: {offering.pending}</Tag>
          <Tag color="green">Aprobadas: {offering.approved}</Tag>
          <Tag color="red">Rechazadas: {offering.rejected}</Tag>
        </div>
        <Button type="primary" onClick={() => onOpen(offering.id)}>
          Ver aplicaciones
        </Button>
      </Space>
    </Card>
  );
}
