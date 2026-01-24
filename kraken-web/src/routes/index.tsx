import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { Dashboard } from '../features/dashboard/Dashboard';
import { AvailableOfferingsPage } from '../features/dashboard/pages/AvailableOfferingsPage';
import { MyOfferingsPage } from '../features/dashboard/pages/MyOfferingsPage';
import { TeacherApplicationsPage } from '../features/dashboard/pages/TeacherApplicationsPage';
import { RequireRole } from '../features/auth/RequireRole';
import { AppShell } from './AppShell';
import { RequireAuth, RequireGuest } from './guards';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell variant="dashboard">
          <Dashboard />
        </AppShell>
      </RequireAuth>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <AppShell variant="dashboard">
          <Dashboard />
        </AppShell>
      </RequireAuth>
    ),
  },
  {
    path: '/offerings/available',
    element: (
      <RequireAuth>
        <AppShell variant="dashboard">
          <RequireRole allowed={['STUDENT']}>
            <AvailableOfferingsPage />
          </RequireRole>
        </AppShell>
      </RequireAuth>
    ),
  },
  {
    path: '/me/offerings',
    element: (
      <RequireAuth>
        <AppShell variant="dashboard">
          <RequireRole allowed={['STUDENT']}>
            <MyOfferingsPage />
          </RequireRole>
        </AppShell>
      </RequireAuth>
    ),
  },
  {
    path: '/teacher/applications',
    element: (
      <RequireAuth>
        <AppShell variant="dashboard">
          <RequireRole allowed={['TEACHER']}>
            <TeacherApplicationsPage />
          </RequireRole>
        </AppShell>
      </RequireAuth>
    ),
  },
  {
    path: '/login',
    element: (
      <RequireGuest>
        <AppShell variant="auth">
          <LoginPage />
        </AppShell>
      </RequireGuest>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
