import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated from 'react-dom' to 'react-dom/client'
import './index.css';
import App from './App';
import './helpers/i18n';


const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot instead of render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('[Service Worker] Registered:', reg);
  });

  navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'offline-alert') {
          alert('You are offline, but cached content is being served.');
      }
  });
}