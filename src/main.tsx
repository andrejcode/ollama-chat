import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.tsx';
import './index.css';
import MessageProvider from './providers/MessageProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MessageProvider>
      <App />
    </MessageProvider>
  </React.StrictMode>,
);
