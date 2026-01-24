import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { Dashboard } from '../features/dashboard/Dashboard';
import { AvailableOfferingsPage } from '../features/dashboard/pages/AvailableOfferingsPage';
import { MyOfferingsPage } from '../features/dashboard/pages/MyOfferingsPage';
import { TeacherApplicationsPage } from '../features/dashboard/pages/TeacherApplicationsPage';
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
    path: '/offerings/available',
    element: (
      <RequireAuth>
        <AppShell variant="dashboard">
          <AvailableOfferingsPage />
        </AppShell>
      </RequireAuth>
    ),
  },
  {
    path: '/me/offerings',
    element: (
      <RequireAuth>
        <AppShell variant="dashboard">
          <MyOfferingsPage />
        </AppShell>
      </RequireAuth>
    ),
  },
  {
    path: '/teacher/applications',
    element: (
      <RequireAuth>
        <AppShell variant="dashboard">
          <TeacherApplicationsPage />
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
