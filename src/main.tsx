import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.tsx';
import MessageProvider from './providers/MessageProvider.tsx';
import SidebarProvider from './providers/SidebarProvider.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SidebarProvider>
      <MessageProvider>
        <App />
      </MessageProvider>
    </SidebarProvider>
  </React.StrictMode>,
);
