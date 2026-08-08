import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Categories from './pages/Categories';
import History from './pages/History';
import Settings from './pages/Settings';

import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Starting point */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Protected Application */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-tasks" element={<Tasks />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />

            </Route>
          </Route>

          {/* Any unknown URL */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>

        <Toaster position="top-right" />

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;