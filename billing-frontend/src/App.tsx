import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';
import theme from './theme';
import { NotificationProvider } from './services/notification.service';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Bills from './pages/Bills';
import Residents from './pages/Residents';
// import Payments from './pages/Payments';
import AdminLayout from './components/AdminLayout';
import ResidentLayout from './components/ResidentLayout';
import AdminDashboard from './pages/admin/DashboardPage';
import ResidentManagementPages from './pages/admin/ResidentManagementPage';
import Statistics from './pages/admin/Statistics';
// import TemporaryManagement from './pages/admin/TemporaryManagement';
import ApartmentDetailsManagement from './pages/admin/ApartmentDetailsManagement';
import FeeManagementPage from './pages/admin/FeeManagementPage';
import DeviceManagement from './pages/admin/DeviceManagement';
import Profile from './pages/user/Profile';
import FeeNotification from "./pages/admin/FeeNotification";
import FeedbackManagement from "./pages/admin/FeedbackManagement";
import TemporaryManagement from "./pages/admin/TemporaryManagement";
import ResidentDashboard from './pages/resident/Dashboard';
import ResidentPayments from './pages/resident/Payments';
import ResidentAbsence from './pages/resident/Absence';
import ResidentTemporary from './pages/resident/Temporary';
import ResidentFeedback from './pages/resident/Feedback';
import ResidentComments from './pages/resident/Comments';
import ResidentProfile from './pages/resident/Profile';
import { NotFound, Forbidden, ServerError } from './pages/error';
import FeeTypeManagement from "./pages/admin/FeeTypeManagementPage";
import Payments from "./components/common/Payments"

const PrivateRoute: React.FC<{ children: React.ReactNode; role?: string }> = ({ children, role }) => {

  if (role) {
    return <Navigate to={role === 'ADMIN' ? '/admin/dashboard' : '/resident/dashboard'} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
        <NotificationProvider>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/*<Route path="/payment-test" element={<Payments>} />*/}

              {/* Main App Routes */}
              <Route path="/" element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }>
                {/*<Route index element={<Navigate to={ === 'ADMIN' ? '/admin/dashboard' : '/resident/dashboard'} replace />} />*/}
                <Route path="bills" element={<Bills />} />
                <Route path="residents" element={<Residents />} />
                <Route path="payments-test" element={<Payments />} />
              </Route>

              {/* Resident Routes */}
              <Route path="/resident" element={
                // <PrivateRoute role="RESIDENT">
                  <ResidentLayout />
                // </PrivateRoute>
              }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ResidentDashboard />} />
                <Route path="payments" element={<ResidentPayments />} />
                <Route path="absence" element={<ResidentAbsence />} />
                <Route path="temporary" element={<ResidentTemporary />} />
                <Route path="feedback" element={<ResidentFeedback />} />
                <Route path="comments" element={<ResidentComments />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={
                // <PrivateRoute role="ADMIN">
                  <AdminLayout />
                // </PrivateRoute>
              }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="residents" element={<Residents />} />
                <Route path="resident-management" element={<ResidentManagementPages />} />
                <Route path="temporary-residents" element={<TemporaryManagement />} />
                <Route path="payments" element={<Payments />} />
                <Route path="temporary-management" element={<TemporaryManagement />} />
                <Route path="apartment-details" element={<ApartmentDetailsManagement />} />
                <Route path="fee-types" element={<FeeTypeManagement />} />
                <Route path="fee-management" element={<FeeManagementPage />} />
                <Route path="devices" element={<DeviceManagement />} />
                <Route path="notifications" element={<FeeNotification />} />
                <Route path="feedback" element={<FeedbackManagement />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Error Routes */}
              <Route path="/error/403" element={<Forbidden />} />
              <Route path="/error/500" element={<ServerError />} />
              <Route path="/404" element={<NotFound />} />
              {/*<Route path="*" element={<Navigate to="/404" replace />} />*/}
            </Routes>
          </Router>
        </NotificationProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
