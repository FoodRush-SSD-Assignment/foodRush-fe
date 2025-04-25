import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
//auth services
import LoginPage from "./pages/auth/customer/LoginPage";
import RegisterPage from "./pages/auth/customer/RegisterPage";
import MerchantLoginPage from "./pages/auth/merchant/MerchantLoginPage";
import MerchantRegisterPage from "./pages/auth/merchant/MerchantRegisterPage";
import VerifyEmailForm from "./components/MailVerify";
import StripeCheckoutButton from "./components/StripeCheckoutButton";

//admin services
import UserRolePage from "./components/admin/usersRolePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/merchant-login" element={<MerchantLoginPage />} />
        <Route path="/merchant-register" element={<MerchantRegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/verify-email" element={<VerifyEmailForm />} />
        <Route path="/admin/users/:role" element={<UserRolePage />} />
        <Route
          path="/StripeCheckoutButton"
          element={<StripeCheckoutButton />}
        />
      </Routes>
    </Router>
  );
}
export default App;
