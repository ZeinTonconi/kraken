import { Card, Col, Empty, Row, Skeleton } from "antd";
import type { OfferingSummary } from "./types";
import { OfferingCard } from "./OfferingCard";

type OfferingsGridProps = {
  offerings: OfferingSummary[];
  loading: boolean;
  onOpen: (offeringId: string) => void;
};

export function OfferingsGrid({ offerings, loading, onOpen }: OfferingsGridProps) {
  if (loading) {
    return (
      <Row gutter={[18, 18]}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Col xs={24} md={12} xl={8} key={`skeleton-${index}`}>
            <Card className="dashboard-card">
              <Skeleton active />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (offerings.length === 0) {
    return (
      <Card className="dashboard-card">
        <Empty description="No hay offerings disponibles." />
      </Card>
    );
  }

  return (
    <Row gutter={[18, 18]}>
      {offerings.map((offering) => (
        <Col xs={24} md={12} xl={8} key={offering.id}>
          <OfferingCard offering={offering} onOpen={onOpen} />
        </Col>
      ))}
    </Row>
  );
}
