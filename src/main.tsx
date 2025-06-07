import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.tsx';
import './index.css';
import AlertMessageProvider from './providers/AlertMessageProvider.tsx';
import HealthProvider from './providers/HealthProvider.tsx';
import ModelProvider from './providers/ModelProvider.tsx';
import SettingsModalProvider from './providers/SettingsModalProvider.tsx';
import SidebarProvider from './providers/SidebarProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SidebarProvider>
      <SettingsModalProvider>
        <AlertMessageProvider>
          <HealthProvider>
            <ModelProvider>
              <App />
            </ModelProvider>
          </HealthProvider>
        </AlertMessageProvider>
      </SettingsModalProvider>
    </SidebarProvider>
  </React.StrictMode>,
);
