import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/AppShell'

// Public pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Privacy from './pages/Privacy'

// Protected pages
import Home from './pages/Home'
import Power from './pages/Power'
import Task from './pages/Task'
import AI from './pages/AI'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import NodePartner from './pages/NodePartner'
import Tutorials from './pages/Tutorials'
import Language from './pages/Language'

// My pages
import Device from './pages/my/Device'
import Team from './pages/my/Team'
import Orders from './pages/my/Orders'
import Share from './pages/my/Share'
import KYC from './pages/my/KYC'
import Deposit from './pages/my/Deposit'
import Withdraw from './pages/my/Withdraw'
import AboutUs from './pages/my/AboutUs'

function App() {
  return (
    <AppShell>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Protected */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/power" element={<ProtectedRoute><Power /></ProtectedRoute>} />
          <Route path="/task" element={<ProtectedRoute><Task /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><AI /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/node-partner" element={<ProtectedRoute><NodePartner /></ProtectedRoute>} />
          <Route path="/tutorials" element={<ProtectedRoute><Tutorials /></ProtectedRoute>} />
          <Route path="/lang" element={<ProtectedRoute><Language /></ProtectedRoute>} />

          {/* My pages */}
          <Route path="/my/device" element={<ProtectedRoute><Device /></ProtectedRoute>} />
          <Route path="/my/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
          <Route path="/my/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/my/share" element={<ProtectedRoute><Share /></ProtectedRoute>} />
          <Route path="/my/kyc" element={<ProtectedRoute><KYC /></ProtectedRoute>} />
          <Route path="/my/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
          <Route path="/my/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
          <Route path="/my/about-us" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </AppShell>
  )
}

export default App
