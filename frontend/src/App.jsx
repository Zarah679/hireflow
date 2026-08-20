import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import JobsPage from './pages/JobsPage.jsx'
import PipelinePage from './pages/PipelinePage.jsx'
import CandidatesPage from './pages/CandidatesPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route
          path="/app"
          element={(
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/app/jobs"
          element={(
            <ProtectedRoute>
              <JobsPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/app/pipeline"
          element={(
            <ProtectedRoute>
              <PipelinePage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/app/candidates"
          element={(
            <ProtectedRoute>
              <CandidatesPage />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
