import { Navigate } from 'react-router-dom';
import { authSession, type GlobalRole } from './auth.session';

type RequireRoleProps = {
  allowed: GlobalRole[];
  children: JSX.Element;
};

export function RequireRole({ allowed, children }: RequireRoleProps) {
  const role = authSession.getRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
