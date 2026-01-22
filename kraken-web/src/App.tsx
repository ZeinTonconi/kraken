import './App.css';
import { useEffect } from 'react';
import { LoginForm } from './features/auth/components/LoginForm';
import { Dashboard } from './features/dashboard/Dashboard';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchMe } from './features/auth/authSlice';
import { tokenStorage } from './services/tokenStorage';

function App() {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);
  const isAuthenticated = status === 'authenticated';
  const hasSession = tokenStorage.hasSession();
  const showDashboard = isAuthenticated || hasSession;

  useEffect(() => {
    if (hasSession && status === 'idle') {
      dispatch(fetchMe());
    }
  }, [dispatch, hasSession, status]);

  return (
    <div className={showDashboard ? 'dashboard-shell' : 'auth-shell'}>
      <div className="app-chrome">
        {showDashboard ? <Dashboard /> : <LoginForm />}
      </div>
    </div>
  );
}

export default App;
