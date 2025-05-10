import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.tsx';
import MessageProvider from './providers/MessageProvider.tsx';
import SidebarProvider from './providers/SidebarProvider.tsx';
import AlertMessageProvider from './providers/AlertMessageProvider.tsx';
import SettingsModalProvider from './providers/SettingsModalProvider.tsx';
import HealthProvider from './providers/HealthProvider.tsx';
import ModelProvider from './providers/ModelProvider.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SidebarProvider>
      <SettingsModalProvider>
        <AlertMessageProvider>
          <HealthProvider>
            <ModelProvider>
              <MessageProvider>
                <App />
              </MessageProvider>
            </ModelProvider>
          </HealthProvider>
        </AlertMessageProvider>
      </SettingsModalProvider>
    </SidebarProvider>
  </React.StrictMode>,
);
