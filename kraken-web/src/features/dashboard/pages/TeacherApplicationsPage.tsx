import "../Dashboard.css";
import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Select, Space, Table, Typography, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DashboardLayout } from "../components/DashboardLayout";
import { authSession } from "../../auth/auth.session";
import { getAvailableOfferings } from "../../../services/offerings.api";
import { approveEnrollment, getApplications } from "../../../services/teacher.api";
import { getProfile } from "../../../services/profile.api";
import { HttpError } from "../../../services/api";
import type {
  CourseOffering,
  EnrollmentApplication,
  Profile,
  ProfileResponse,
  User,
} from "../../../types/academics";

const fallbackProfile: Profile = {
  fullName: "Docente Kraken",
  role: "TEACHER",
  handle: null,
  avatarUrl: null,
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return "N/A";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("es-BO");
};

export function TeacherApplicationsPage() {
  const [offerings, setOfferings] = useState<CourseOffering[]>([]);
  const [applications, setApplications] = useState<EnrollmentApplication[]>([]);
  const [selectedOfferingId, setSelectedOfferingId] = useState<string | null>(null);
  const [loadingOfferings, setLoadingOfferings] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    let active = true;
    const userId = authSession.getUserId();

    const loadOfferings = async () => {
      setLoadingOfferings(true);
      setError(null);
      try {
        const available = await getAvailableOfferings();
        if (!active) {
          return;
        }
        setOfferings(available);
      } catch (err) {
        if (err instanceof HttpError) {
          setError(err.message);
        } else {
          setError("No pudimos cargar los offerings.");
        }
      } finally {
        if (active) {
          setLoadingOfferings(false);
        }
      }
    };

    const loadProfile = async () => {
      if (!userId) {
        return;
      }
      try {
        const data = (await getProfile(userId)) as ProfileResponse;
        if (!active) {
          return;
        }
        setProfile(data.profile ?? fallbackProfile);
        setUserInfo(data.user ?? null);
      } catch (err) {
        if (err instanceof HttpError && err.status === 404) {
          setProfile(fallbackProfile);
        }
      }
    };

    loadOfferings();
    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    if (!selectedOfferingId) {
      setApplications([]);
      return () => {
        active = false;
      };
    }

    const loadApplications = async () => {
      setLoadingApplications(true);
      setError(null);
      try {
        const data = await getApplications(selectedOfferingId);
        if (!active) {
          return;
        }
        setApplications(data);
      } catch (err) {
        if (err instanceof HttpError) {
          setError(err.message);
        } else {
          setError("No pudimos cargar las postulaciones.");
        }
      } finally {
        if (active) {
          setLoadingApplications(false);
        }
      }
    };

    loadApplications();

    return () => {
      active = false;
    };
  }, [selectedOfferingId]);

  const handleApprove = async (enrollmentId: string) => {
    if (!selectedOfferingId) {
      return;
    }
    setApprovingId(enrollmentId);
    try {
      await approveEnrollment(enrollmentId);
      message.success("Estudiante aprobado");
      const updated = await getApplications(selectedOfferingId);
      setApplications(updated);
    } catch (err) {
      if (err instanceof HttpError) {
        message.error(err.message);
      } else {
        message.error("No pudimos aprobar la postulación.");
      }
    } finally {
      setApprovingId(null);
    }
  };

  const offeringOptions = useMemo(
    () =>
      offerings.map((offering) => ({
        value: offering.id,
        label: `${offering.course?.name ?? "Curso"} - ${offering.term?.year ?? "N/A"} ${
          offering.term?.period ?? ""
        }`.trim(),
      })),
    [offerings],
  );

  const columns: ColumnsType<EnrollmentApplication> = [
    {
      title: "Estudiante",
      dataIndex: ["student", "profile", "fullName"],
      render: (_, record) =>
        record.student.profile?.fullName ?? record.student.email ?? "Sin nombre",
    },
    {
      title: "Email",
      dataIndex: ["student", "email"],
      render: (_, record) => record.student.email ?? "Sin email",
    },
    {
      title: "Track",
      dataIndex: "track",
      render: (value: string) => value?.replace(/_/g, " ").toLowerCase(),
    },
    {
      title: "Fecha",
      dataIndex: "createdAt",
      render: (value?: string | null) => formatDate(value),
    },
    {
      title: "Accion",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          loading={approvingId === record.id}
          onClick={() => handleApprove(record.id)}
        >
          Aprobar
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout profile={profile} user={userInfo}>
      <div className="dashboard">
        <Space direction="vertical" size={8}>
          <Typography.Title level={3} className="!m-0">
            Applications
          </Typography.Title>
          <Typography.Text type="secondary">
            Postulaciones pendientes de aprobación
          </Typography.Text>
        </Space>

        {error ? (
          <Alert type="warning" message="Datos incompletos" description={error} showIcon />
        ) : null}

        <Card className="dashboard-card">
          <Space direction="vertical" size={12} className="w-full">
            <Typography.Text>Selecciona un offering</Typography.Text>
            <Select
              className="w-full"
              placeholder="Selecciona un offering"
              options={offeringOptions}
              value={selectedOfferingId ?? undefined}
              onChange={(value) => setSelectedOfferingId(value)}
              loading={loadingOfferings}
              allowClear
            />
          </Space>
        </Card>

        <Card className="dashboard-card">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={applications}
            loading={loadingApplications}
            pagination={{ pageSize: 8 }}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
