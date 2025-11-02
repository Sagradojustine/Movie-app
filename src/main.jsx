import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import pwaHandler from './utils/PWA'; // Adjust path as needed

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Register PWA service worker
pwaHandler.register({
  onSuccess: (registration) => {
    console.log('PWA: Content cached for offline use.');
  },
  onUpdate: (registration) => {
    console.log('PWA: New content available; please refresh.');
    // You can show a custom update notification here
  }
});

reportWebVitals();