import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2f7fd6',
          colorInfo: '#2f7fd6',
          colorSuccess: '#39c6c3',
          colorWarning: '#5bc27a',
          colorTextBase: '#142333',
          colorBgBase: '#eef6f8',
          fontFamily: "'Poppins', 'Segoe UI', sans-serif",
          borderRadius: 12,
        },
      }}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </ConfigProvider>
  </StrictMode>,
);
