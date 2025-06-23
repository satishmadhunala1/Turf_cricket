import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TurfPage from './pages/TurfPage';
import TurfDetailsPage from './pages/TurfDetailsPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTurfs from './pages/admin/AdminTurfs';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBookings from './pages/admin/AdminBookings';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

function App() {
  return (
    <Router>
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/turfs" element={<TurfPage />} />
          <Route path="/turfs/:id" element={<TurfDetailsPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          
          <Route path="" element={<PrivateRoute />}>
            <Route path="/bookings" element={<BookingPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Route>

          <Route path="" element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/turfs" element={<AdminTurfs />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </Router>
  );
}

export default App;