import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Avatar, Button, Layout, Menu, Space, Typography } from "antd";
import {
  AppstoreOutlined,
  BookOutlined,
  FileTextOutlined,
  LogoutOutlined,
  ProfileOutlined,
  RocketOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { logout } from "../../auth/authSlice";
import { authSession } from "../../auth/auth.session";
import type { Profile, User } from "../../../types/academics";

type DashboardLayoutProps = {
  children: ReactNode;
  profile?: Profile | null;
  user?: User | null;
};

const resolveMenuKey = (pathname: string) => {
  if (pathname.startsWith("/dashboard")) {
    return "dashboard";
  }
  if (pathname.startsWith("/teacher/applications")) {
    return "teacher-applications";
  }
  if (pathname.startsWith("/offerings/available")) {
    return "available-courses";
  }
  if (pathname.startsWith("/me/offerings")) {
    return "my-courses";
  }
  if (pathname.startsWith("/profile")) {
    return "profile";
  }
  return "dashboard";
};

const fallbackProfile: Profile = {
  fullName: "Estudiante Kraken",
  role: "STUDENT",
  handle: null,
  avatarUrl: null,
};

export function DashboardLayout({
  children,
  profile,
  user,
}: DashboardLayoutProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const safeProfile = profile ?? fallbackProfile;
  const storedRole = authSession.getRole();
  const role = (storedRole ?? safeProfile.role ?? "STUDENT")
    .toLowerCase()
    .replace(/_/g, " ");
  const isAdmin = safeProfile.role === "ADMIN" || storedRole === "ADMIN";
  const isTeacher = storedRole === "TEACHER";
  const fullName =
    safeProfile.fullName && safeProfile.fullName.trim().length > 0
      ? safeProfile.fullName
      : (user?.email ?? fallbackProfile.fullName ?? "Estudiante Kraken");
  const selectedKey = useMemo(
    () => resolveMenuKey(location.pathname),
    [location.pathname],
  );
  const isStudent = storedRole === "STUDENT";

  return (
    <Layout className="dashboard-layout">
      <Layout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={260}
        className="dashboard-sider"
        breakpoint="lg"
      >
        <div className="sider-header">
          <span className="brand-mark">K</span>
          {!collapsed ? (
            <div className="sider-title">
              <Typography.Text className="brand-name">Kraken</Typography.Text>
              <Typography.Text className="brand-subtitle">
                UniJira
              </Typography.Text>
            </div>
          ) : null}
        </div>

        <Menu
          mode="inline"
          theme="dark"
          className="sider-menu"
          selectedKeys={[selectedKey]}
          items={[
            {
              key: "general",
              label: "General",
              type: "group",
              children: [
                {
                  key: "dashboard",
                  icon: <AppstoreOutlined />,
                  label: <Link to="/dashboard">Dashboard</Link>,
                },
                ...(isTeacher
                  ? [
                      {
                        key: "teacher-applications",
                        icon: <FileTextOutlined />,
                        label: (
                          <Link to="/teacher/applications">Applications</Link>
                        ),
                      },
                    ]
                  : []),
              ],
            },
            ...(isStudent
              ? [
                  {
                    key: "student",
                    label: "Estudiante",
                    type: "group",
                    children: [
                      {
                        key: "available-courses",
                        icon: <ShopOutlined />,
                        label: (
                          <Link to="/offerings/available">
                            Cursos disponibles
                          </Link>
                        ),
                      },
                      {
                        key: "my-courses",
                        icon: <BookOutlined />,
                        label: <Link to="/me/offerings">Mis cursos</Link>,
                      },
                      {
                        key: "rotations",
                        icon: <TeamOutlined />,
                        label: "Equipos / Rotaciones",
                        disabled: true,
                      },
                      {
                        key: "profile",
                        icon: <ProfileOutlined />,
                        label: "Perfil",
                        disabled: true,
                      },
                    ],
                  },
                ]
              : []),
            ...(isAdmin
              ? [
                  {
                    key: "admin",
                    label: "Admin",
                    type: "group",
                    children: [
                      {
                        key: "admin-applications",
                        icon: <UserOutlined />,
                        label: "Aplicaciones",
                        disabled: true,
                      },
                      {
                        key: "admin-offerings",
                        icon: <ShopOutlined />,
                        label: "Offerings",
                        disabled: true,
                      },
                      {
                        key: "admin-rotation",
                        icon: <RocketOutlined />,
                        label: "Iniciar Rotation Program",
                        disabled: true,
                      },
                    ],
                  },
                ]
              : []),
          ]}
        />

        <div className="sider-footer">
          <Space align="center" size={12} className="sider-user">
            <Avatar
              src={safeProfile.avatarUrl ?? undefined}
              icon={<UserOutlined />}
            />
            {!collapsed ? (
              <div>
                <Typography.Text className="sider-user-name">
                  {fullName}
                </Typography.Text>
                <Typography.Text className="sider-user-role">
                  {role}
                </Typography.Text>
              </div>
            ) : null}
          </Space>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            className="sider-logout"
            onClick={() => {
              dispatch(logout());
              navigate("/login", { replace: true });
            }}
          >
            {!collapsed ? "Log out" : null}
          </Button>
        </div>
      </Layout.Sider>

      <Layout.Content className="dashboard-content">{children}</Layout.Content>
    </Layout>
  );
}
