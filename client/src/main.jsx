import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('[PWA SW] Registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.error('[PWA SW] Registration failed:', err);
      });
  });
}

// Request Notification Permission
if ('Notification' in window && Notification.permission === 'default') {
  setTimeout(() => {
    Notification.requestPermission().then((perm) => {
      console.log('[PWA Notification Permission]', perm);
    });
  }, 3000);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
