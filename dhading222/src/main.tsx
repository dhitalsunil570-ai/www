import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} catch (error) {
  console.error('[v0] React render error:', error);
  document.body.innerHTML = '<div style="padding: 20px; color: red;">Error loading application: ' + (error instanceof Error ? error.message : 'Unknown error') + '</div>';
}
