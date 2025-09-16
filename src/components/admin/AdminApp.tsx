import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  AdminLayout, 
  DashboardPage, 
  UsersPage, 
  UserKeysPage, 
  AdminAccessPage, 
  AppManagementPage,
  FeedbackPage 
} from './index';

export default function AdminApp() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/user-keys" element={<UserKeysPage />} />
        <Route path="/admin-access" element={<AdminAccessPage />} />
        <Route path="/app-management" element={<AppManagementPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
}