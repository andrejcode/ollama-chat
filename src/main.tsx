import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.tsx';
import MessageProvider from './providers/MessageProvider.tsx';
import SidebarProvider from './providers/SidebarProvider.tsx';
import AlertMessageProvider from './providers/AlertMessageProvider.tsx';
import SettingsModalProivder from './providers/SettingsModalProvider.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SidebarProvider>
      <SettingsModalProivder>
        <AlertMessageProvider>
          <MessageProvider>
            <App />
          </MessageProvider>
        </AlertMessageProvider>
      </SettingsModalProivder>
    </SidebarProvider>
  </React.StrictMode>,
);
