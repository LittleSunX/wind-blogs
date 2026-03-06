import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';
import App from './App.tsx';
import './index.css';

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <I18nProvider>
        <ThemeProvider>
          <BrowserRouter future={routerFuture}>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </I18nProvider>
    </HelmetProvider>
  </React.StrictMode>
);
