import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopNavigation from './components/layout/TopNavigation';
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';

// Dashboard Pages
import SkillSnapshotPage from './pages/dashboard/SkillSnapshotPage';
import CareerSuggestionsPage from './pages/dashboard/CareerSuggestionsPage';
import SkillGapAnalysisPage from './pages/dashboard/SkillGapAnalysisPage';
import ResumeCenterPage from './pages/dashboard/ResumeCenterPage';
import InterviewPrepPage from './pages/dashboard/InterviewPrepPage';
import NetworkingZonePage from './pages/dashboard/NetworkingZonePage';
import ProgressTrackerPage from './pages/dashboard/ProgressTrackerPage';

// Other Main Pages
import QuizCenterPage from './pages/QuizCenterPage';
import CareerExplorerPage from './pages/CareerExplorerPage';
import SmartBotPage from './pages/SmartBotPage';
import AdminPanelPage from './pages/AdminPanelPage';
import SettingsProfilePage from './pages/SettingsProfilePage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<HomePage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Navigate to="/dashboard/skills" replace />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/skills"
          element={
            <DashboardLayout>
              <SkillSnapshotPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/careers"
          element={
            <DashboardLayout>
              <CareerSuggestionsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/gaps"
          element={
            <DashboardLayout>
              <SkillGapAnalysisPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/resume"
          element={
            <DashboardLayout>
              <ResumeCenterPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/interview"
          element={
            <DashboardLayout>
              <InterviewPrepPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/networking"
          element={
            <DashboardLayout>
              <NetworkingZonePage />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/progress"
          element={
            <DashboardLayout>
              <ProgressTrackerPage />
            </DashboardLayout>
          }
        />

        {/* Other Main Routes */}
        <Route path="/quiz" element={<QuizCenterPage />} />
        <Route path="/explore" element={<CareerExplorerPage />} />
        <Route path="/assistant" element={<SmartBotPage />} />
        <Route path="/admin" element={<AdminPanelPage />} />
        <Route path="/settings" element={<SettingsProfilePage />} />
      </Routes>
    </Router>
  );
}
