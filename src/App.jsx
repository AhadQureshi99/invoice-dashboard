import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage, LoginPage, RegisterPage, AboutPage, DashboardPage, VerificationPage, DraftPage, InvoicesPage, ReportsPage, SettingsPage, InvoiceDetailPage, NotificationsPage } from './imports'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                    element={<LandingPage />} />
        <Route path="/about"               element={<AboutPage />} />
        <Route path="/login"               element={<LoginPage />} />
        <Route path="/register"            element={<RegisterPage />} />
        <Route path="/dashboard"           element={<DashboardPage />} />
        <Route path="/dashboard/verification" element={<VerificationPage />} />
        <Route path="/dashboard/draft"        element={<DraftPage />} />
        <Route path="/dashboard/invoices"     element={<InvoicesPage />} />
        <Route path="/dashboard/invoices/:id"  element={<InvoiceDetailPage />} />
        <Route path="/dashboard/settings"     element={<SettingsPage />} />
        <Route path="/dashboard/reports"      element={<ReportsPage />} />
        <Route path="/dashboard/notifications" element={<NotificationsPage />} />
        <Route path="/dashboard/*"         element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
