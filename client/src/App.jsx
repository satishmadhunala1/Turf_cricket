import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import TurfListPage from './pages/turf/TurfListPage';
import TurfDetailPage from './pages/turf/TurfDetailPage';
import BookingPage from './pages/booking/BookingPage';
import BookingSuccessPage from './pages/booking/BookingSuccessPage';

import DashboardOverview from './pages/dashboard/DashboardOverview';
import BookingsPage from './pages/dashboard/BookingsPage';
import FavoritesPage from './pages/dashboard/FavoritesPage';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import WalletPage from './pages/dashboard/WalletPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import InvoicesPage from './pages/dashboard/InvoicesPage';
import SettingsPage from './pages/dashboard/SettingsPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth — no navbar / footer */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />

          <Route element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="turfs" element={<TurfListPage />} />
            <Route path="turfs/:id" element={<TurfDetailPage />} />
            <Route path="book/:id" element={<BookingPage />} />
            <Route path="booking/success" element={<BookingSuccessPage />} />
            <Route path="booking/success/:id" element={<BookingSuccessPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute roles={['owner', 'admin']} />}>
            <Route path="owner" element={<OwnerDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  );
}
