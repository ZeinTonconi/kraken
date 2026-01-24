import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchMe } from '../features/auth/authSlice';
import { tokenStorage } from '../services/tokenStorage';
import { LoadingScreen } from './LoadingScreen';

const useBootstrapAuth = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);
  const hasSession = tokenStorage.hasSession();

  useEffect(() => {
    if (hasSession && status === 'idle') {
      dispatch(fetchMe());
    }
  }, [dispatch, hasSession, status]);

  return { status, hasSession };
};

export function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const { status, hasSession } = useBootstrapAuth();
  const shouldCheckSession = hasSession && status === 'idle';

  if (status === 'loading' || shouldCheckSession) {
    return <LoadingScreen variant="dashboard" />;
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export function RequireGuest({ children }: { children: JSX.Element }) {
  const { status, hasSession } = useBootstrapAuth();
  const shouldCheckSession = hasSession && status === 'idle';

  if (status === 'loading' || shouldCheckSession) {
    return <LoadingScreen variant="auth" />;
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />;
  }

  return children;
}
