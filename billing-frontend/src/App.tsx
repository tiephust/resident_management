import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import vi from 'date-fns/locale/vi';
import theme from './theme';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Bills from './pages/Bills';
import Residents from './pages/Residents';
import Payments from './pages/Payments';
import AdminLayout from './components/AdminLayout';
import ResidentLayout from './components/ResidentLayout';
import AdminDashboard from './pages/admin/Dashboard';
import Statistics from './pages/admin/Statistics';
import TemporaryManagement from './pages/admin/TemporaryManagement';
import ApartmentDetailsManagement from './pages/admin/ApartmentDetailsManagement';
import FeeManagementPage from './pages/admin/FeeManagement';
import DeviceManagement from './pages/admin/DeviceManagement';
import Profile from './pages/admin/Profile';
import ResidentDashboard from './pages/resident/Dashboard';
import ResidentPayments from './pages/resident/Payments';
import ResidentAbsence from './pages/resident/Absence';
import ResidentTemporary from './pages/admin/ResidentTemporary';
import ResidentFeedback from './pages/resident/Feedback';
import ResidentComments from './pages/resident/Comments';
import ResidentProfile from './pages/resident/Profile';
import { NotFound, Forbidden, ServerError } from './pages/error';
import { authService } from './services/authService';

const PrivateRoute: React.FC<{ children: React.ReactNode; role: string }> = ({ children, role }) => {
  const user = authService.getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/resident/dashboard'} />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Main App Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="bills" element={<Bills />} />
              <Route path="residents" element={<Residents />} />
              <Route path="payments" element={<Payments />} />
            </Route>

            {/* Resident Routes */}
            <Route
              path="/resident/*"
              element={
                <PrivateRoute role="RESIDENT">
                  <ResidentLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<ResidentDashboard />} />
              <Route path="payments" element={<ResidentPayments />} />
              <Route path="absence" element={<ResidentAbsence />} />
              <Route path="temporary" element={<ResidentTemporary />} />
              <Route path="feedback" element={<ResidentFeedback />} />
              <Route path="comments" element={<ResidentComments />} />
              <Route path="profile" element={<ResidentProfile />} />
              <Route path="*" element={<Navigate to="/resident/dashboard" replace />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute role="ADMIN">
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="residents" element={<Residents />} />
              <Route path="payments" element={<Payments />} />
              <Route path="temporary-management" element={<TemporaryManagement />} />
              <Route path="apartment-details" element={<ApartmentDetailsManagement />} />
              <Route path="fee-types" element={<FeeManagementPage />} />
              <Route path="devices" element={<DeviceManagement />} />
              <Route path="profile" element={<Profile />} />
              <Route path="temporary-residents" element={<ResidentTemporary />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* Error Routes */}
            <Route path="/404" element={<NotFound />} />
            <Route path="/403" element={<Forbidden />} />
            <Route path="/500" element={<ServerError />} />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
