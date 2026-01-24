import type { ReactNode } from 'react';
import { Layout } from 'antd';

type AppShellProps = {
  variant: 'auth' | 'dashboard';
  children: ReactNode;
};

export function AppShell({ variant, children }: AppShellProps) {
  return (
    <Layout className={variant === 'auth' ? 'auth-shell' : 'dashboard-shell'}>
      <Layout.Content className="app-chrome">{children}</Layout.Content>
    </Layout>
  );
}
