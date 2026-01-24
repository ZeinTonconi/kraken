import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMe } from '../features/auth/authSlice';
import { authSession } from '../features/auth/auth.session';
import { tokenStorage } from '../services/tokenStorage';
import { LoadingScreen } from './LoadingScreen';

const useBootstrapAuth = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);
  const hasTokenSession = tokenStorage.hasSession();
  const hasSession = authSession.getUserId() !== null || false;

  useEffect(() => {
    if (hasTokenSession && status === 'idle') {
      dispatch(fetchMe());
    }
  }, [dispatch, hasTokenSession, status]);

  return { status, hasSession, hasTokenSession };
};

export function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const { status, hasSession, hasTokenSession } = useBootstrapAuth();
  const shouldCheckSession = hasTokenSession && status === 'idle';

  if (status === 'loading' || shouldCheckSession) {
    return <LoadingScreen variant="dashboard" />;
  }

  if (status !== 'authenticated' && !authSession.getUserId()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export function RequireGuest({ children }: { children: JSX.Element }) {
  const { status, hasSession, hasTokenSession } = useBootstrapAuth();
  const shouldCheckSession = hasTokenSession && status === 'idle';

  if (status === 'loading' || shouldCheckSession) {
    return <LoadingScreen variant="auth" />;
  }

  if (status === 'authenticated' || hasSession) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
