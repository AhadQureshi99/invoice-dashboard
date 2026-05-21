import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  LandingPage, LoginPage, RegisterPage, AboutPage, DashboardPage, VerificationPage,
  DraftPage, InvoicesPage, ReportsPage, SettingsPage, InvoiceDetailPage, NotificationsPage,
} from './imports'
import ProtectedRoute from './components/auth/ProtectedRoute'

const Protected = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<LandingPage />} />
        <Route path="/about"               element={<AboutPage />} />
        <Route path="/login"               element={<LoginPage />} />
        <Route path="/register"            element={<RegisterPage />} />
        <Route path="/dashboard"           element={<Protected><DashboardPage /></Protected>} />
        <Route path="/dashboard/verification" element={<Protected><VerificationPage /></Protected>} />
        <Route path="/dashboard/draft"        element={<Protected><DraftPage /></Protected>} />
        <Route path="/dashboard/invoices"     element={<Protected><InvoicesPage /></Protected>} />
        <Route path="/dashboard/invoices/:id"  element={<Protected><InvoiceDetailPage /></Protected>} />
        <Route path="/dashboard/settings"     element={<Protected><SettingsPage /></Protected>} />
        <Route path="/dashboard/reports"      element={<Protected><ReportsPage /></Protected>} />
        <Route path="/dashboard/notifications" element={<Protected><NotificationsPage /></Protected>} />
        <Route path="/dashboard/*"         element={<Protected><DashboardPage /></Protected>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
