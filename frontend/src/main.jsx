
import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";
import IssueDetail from "./pages/IssueDetail";

import "./styles.css";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <AuthPage mode="login" />}
      />

      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <AuthPage mode="register" />}
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/issues/:id" element={<IssueDetail />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
