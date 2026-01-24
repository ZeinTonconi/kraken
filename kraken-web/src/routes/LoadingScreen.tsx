import { Spin } from 'antd';
import { AppShell } from './AppShell';

type LoadingScreenProps = {
  variant: 'auth' | 'dashboard';
};

export function LoadingScreen({ variant }: LoadingScreenProps) {
  return (
    <AppShell variant={variant}>
      <div className="app-loading">
        <Spin size="large" />
      </div>
    </AppShell>
  );
}
