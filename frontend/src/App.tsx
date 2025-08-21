import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import Register from "./pages/Register";
import Home from "./pages/Home";
import OtpVerification from "./pages/OtpVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./component/Routes/ProtectedRoute";
import AdminRoute from "./component/Routes/AdminRoute";

import AdminDashboard from "./pages/AdminDashboard";
import User from "./pages/Users";
import Subscriptions from "./pages/Subscriptions";
import Events from "./pages/Events";
import SingleEventPage from "./pages/SingleEventPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected User Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/:id"
          element={
            <ProtectedRoute>
              <SingleEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<User />} />
          <Route path="/admin/subscriptions" element={<Subscriptions />} />
          <Route path="/admin/events" element={<Events />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
