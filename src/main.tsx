import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.tsx';
import MessageProvider from './providers/MessageProvider.tsx';
import SidebarProvider from './providers/SidebarProvider.tsx';
import AlertMessageProvider from './providers/AlertMessageProvider.tsx';
import SettingsModalProivder from './providers/SettingsModalProvider.tsx';
import HealthProvider from './providers/HealthProvider.tsx';
import './index.css';
import ModelProvider from './providers/ModelProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SidebarProvider>
      <SettingsModalProivder>
        <AlertMessageProvider>
          <HealthProvider>
            <ModelProvider>
              <MessageProvider>
                <App />
              </MessageProvider>
            </ModelProvider>
          </HealthProvider>
        </AlertMessageProvider>
      </SettingsModalProivder>
    </SidebarProvider>
  </React.StrictMode>,
);
