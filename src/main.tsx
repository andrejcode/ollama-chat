import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App.tsx';
import './index.css';
import HealthProvider from './providers/HealthProvider.tsx';
import ModelProvider from './providers/ModelProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HealthProvider>
      <ModelProvider>
        <App />
      </ModelProvider>
    </HealthProvider>
  </React.StrictMode>,
);
