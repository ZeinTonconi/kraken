import "../Dashboard.css";
import { useEffect, useState } from "react";
import { Alert, Card, Empty, List, Space, Typography } from "antd";
import { DashboardLayout } from "../components/DashboardLayout";
import { getMyOfferings } from "../../../services/me.api";
import { getProfile } from "../../../services/profile.api";
import { tokenStorage } from "../../../services/tokenStorage";
import { HttpError } from "../../../services/api";
import type { Enrollment, Profile, ProfileResponse, User } from "../../../types/academics";

const formatLabel = (value: string) => {
  return value.toLowerCase().replace(/_/g, " ");
};

const fallbackProfile: Profile = {
  fullName: "Estudiante Kraken",
  role: "STUDENT",
  handle: null,
  avatarUrl: null,
};

export function MyOfferingsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    let active = true;
    const userId = tokenStorage.getUserId();

    if (!userId) {
      setError("No encontramos tu userId. Inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);

      const results = await Promise.allSettled([getMyOfferings(userId), getProfile(userId)]);
      if (!active) {
        return;
      }

      const [offeringsResult, profileResult] = results;

      if (offeringsResult.status === "fulfilled") {
        setEnrollments(offeringsResult.value);
      } else {
        setError("No pudimos cargar tus cursos aprobados.");
      }

      if (profileResult.status === "fulfilled") {
        const data = profileResult.value as ProfileResponse;
        setProfile(data.profile ?? fallbackProfile);
        setUserInfo(data.user ?? null);
      } else if (
        profileResult.reason instanceof HttpError &&
        profileResult.reason.status === 404
      ) {
        setProfile(fallbackProfile);
      }

      setLoading(false);
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardLayout profile={profile} user={userInfo}>
      <div className="dashboard">
        <Space direction="vertical" size={12}>
          <Typography.Title level={3} className="!m-0">
            Mis cursos
          </Typography.Title>
          <Typography.Text type="secondary">
            Cursos aprobados en los que ya estás inscrito.
          </Typography.Text>
        </Space>

        {error ? (
          <Alert type="warning" message="Datos incompletos" description={error} showIcon />
        ) : null}

        <Card className="dashboard-card" loading={loading}>
          {enrollments.length === 0 && !loading ? (
            <Empty description="Aún no tienes cursos aprobados." />
          ) : (
            <List
              size="small"
              dataSource={enrollments}
              renderItem={(item) => (
                <List.Item className="dashboard-list-item">
                  <Space direction="vertical" size={4}>
                    <Typography.Text className="label">
                      {item.offering?.course?.name ?? "Curso sin nombre"}
                    </Typography.Text>
                    <Typography.Text>
                      {item.offering?.term?.name ?? "Sin periodo"} •{" "}
                      {formatLabel(item.track)}
                    </Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
