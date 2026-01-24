import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { Dashboard } from '../features/dashboard/Dashboard';
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
