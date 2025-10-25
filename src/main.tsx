import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Health from './pages/Health';
import ErrorBoundary from './ErrorBoundary';
import './index.css';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/booking', element: <Booking /> },
  { path: '/faq', element: <FAQ /> },
  { path: '/contact', element: <Contact /> },
  { path: '/admin', element: <Admin /> },
  { path: '/health', element: <Health /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>
);