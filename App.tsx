import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FindAccount from './pages/FindAccount';
import Dashboard from './pages/Dashboard';
import NoticeList from './pages/notices/NoticeList';
import NoticeDetail from './pages/notices/NoticeDetail';
import ComplaintList from './pages/complaints/ComplaintList';
import ComplaintDetail from './pages/complaints/ComplaintDetail';
import ComplaintForm from './pages/complaints/ComplaintForm';
import AccessCard from './pages/services/AccessCard';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/support/PrivacyPolicy';
import TermsOfService from './pages/support/TermsOfService';
import CustomerSupport from './pages/support/CustomerSupport';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import NoticeManagement from './pages/admin/NoticeManagement';
import ComplaintManagement from './pages/admin/ComplaintManagement';
import MoveInCardManagement from './pages/admin/MoveInCardManagement';
import { useAuth } from './contexts/AuthContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

import { AuthProvider } from './contexts/AuthContext';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
        <HashRouter>
        <ScrollToTop />
        <Routes>
            {/* Default redirect to Login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/find-account" element={<FindAccount />} />
            
            {/* Support Pages */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/support" element={<CustomerSupport />} />
            
            {/* Protected Routes inside Layout */}
            <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notices" element={<NoticeList />} />
            <Route path="/notices/:id" element={<NoticeDetail />} />
            <Route path="/complaints" element={<ComplaintList />} />
            <Route path="/complaints/new" element={<ComplaintForm />} />
            <Route path="/complaints/edit/:id" element={<ComplaintForm />} />
            <Route path="/complaints/:id" element={<ComplaintDetail />} />
            <Route path="/access-card" element={<AccessCard />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="notices" element={<NoticeManagement />} />
                <Route path="complaints" element={<ComplaintManagement />} />
                <Route path="move-in-cards" element={<MoveInCardManagement />} />
            </Route>
        </Routes>
        </HashRouter>
    </AuthProvider>
  );
};

export default App;