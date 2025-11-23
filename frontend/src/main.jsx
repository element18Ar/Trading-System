import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Make sure index.html contains <div id="root"></div>
const container = document.getElementById('root');
if (!container) {
  // Helpful debug message if root missing
  console.error('Root element not found: make sure public/index.html contains <div id="root"></div>');
} else {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}