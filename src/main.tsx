import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

console.log('=== 1. BASE IMPORTS OK ===');

try {
  const { initTelegram } = await import('./lib/telegram');
  console.log('=== 2. TELEGRAM IMPORT OK ===');
  initTelegram();
} catch (e) {
  console.error('!!! TELEGRAM FAIL:', e);
}

let App: any;
try {
  App = (await import('./App')).default;
  console.log('=== 3. APP IMPORT OK ===');
} catch (e) {
  console.error('!!! APP IMPORT FAIL:', e);
  document.body.innerHTML = '<pre style="padding:20px;color:red;font-size:12px">' + String(e) + '</pre>';
  throw e;
}

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('=== 4. RENDER CALLED ===');
} catch (e) {
  console.error('!!! RENDER FAIL:', e);
  document.body.innerHTML = '<pre style="padding:20px;color:red">' + String(e) + '</pre>';
}