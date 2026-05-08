import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App.jsx';
import { DemoStoreProvider } from './state/DemoStore';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DemoStoreProvider><App /></DemoStoreProvider>
  </StrictMode>
);