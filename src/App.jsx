import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getToken } from './services/apiClient';
import Login from './pages/Login';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Teams from './pages/Teams';
import Tasks from './pages/Tasks';
import Budget from './pages/Budget';
import AIInsights from './pages/AIInsights';
import Departments from './pages/Departments';
import Milestones from './pages/Milestones';
import Reports from './pages/Reports';
import ProjectDetails from './pages/ProjectDetails';
import Risks from './pages/Risks';
import SmartAlertCenter from './pages/SmartAlertCenter';
import ProjectComparison from './pages/ProjectComparison';
import ResourceUtilization from './pages/ResourceUtilization';
import Settings from './pages/Settings';
import AuditLog from './pages/AuditLog';

export default function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(getToken()));
  useEffect(() => { const sync = () => setAuthenticated(Boolean(getToken())); window.addEventListener('auth:changed', sync); return () => window.removeEventListener('auth:changed', sync); }, []);
  const protectedLayout = authenticated ? <AppLayout /> : <Navigate to="/login" replace />;
  return <Routes><Route path="/login" element={authenticated ? <Navigate to="/dashboard" replace /> : <Login />} /><Route element={protectedLayout}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/projects/:projectId" element={<ProjectDetails />} />
    <Route path="/teams" element={<Teams />} />
    <Route path="/tasks" element={<Tasks />} />
    <Route path="/budget" element={<Budget />} />
    <Route path="/ai-insights" element={<AIInsights />} />
    <Route path="/risks" element={<Risks />} />
    <Route path="/departments" element={<Departments />} />
    <Route path="/milestones" element={<Milestones />} />
    <Route path="/reports" element={<Reports />} />
    <Route path="/alerts" element={<SmartAlertCenter />} />
    <Route path="/compare" element={<ProjectComparison />} />
    <Route path="/resources" element={<ResourceUtilization />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/audit-log" element={<AuditLog />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Route></Routes>;
}
