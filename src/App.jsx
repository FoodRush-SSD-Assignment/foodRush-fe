import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layout
import AppLayout from "./layouts/AppLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/customer/LoginPage";
import RegisterPage from "./pages/auth/customer/RegisterPage";
import MerchantLoginPage from "./pages/auth/merchant/MerchantLoginPage";
import MerchantRegisterPage from "./pages/auth/merchant/MerchantRegisterPage";
import VerifyEmailPage from "./pages/auth/verifyEmail";
import CategoryPage from "./pages/restaurant/CategoryPage";
import RestaurantDetailPage from "./pages/restaurant/RestaurantDetail";
import StripeCheckoutButton from "./components/StripeCheckoutButton";
import UserRolePage from "./components/admin/usersRolePage";
import RouteLoadingHandler from "./utils/RouteLoadingHandler";
import RestaurantDetails from "./components/admin/RestaurantDetails";
import EditRestaurant from "./components/admin/EditRestaurant";
import AllRestaurants from "./components/admin/AllRestaurants";
import AllUsers from "./components/admin/AllUsers";
import UserPage from "./components/admin/UserPage";
import AllDrivers from "./components/admin/AllDrivers";
import ViewDriver from "./components/admin/ViewDriver";
import UserProfile from "./components/UserProfile";

//order services
import CartPage from "./pages/order/CartPage";
import CheckoutPage from "./pages/order/CheckoutPage";
import SuccessPage from "./pages/order/SuccessPage";
import StripeSuccessPage from "./pages/order/StripeSuccessPage";

const App = () => {
  return (
    <Router>
      {/* <RouteLoadingHandler /> */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/merchant-login" element={<MerchantLoginPage />} />
        <Route path="/merchant-register" element={<MerchantRegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected Routes with Layout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/category/:type" element={<CategoryPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          <Route path="/admin/users/:role" element={<UserRolePage />} />
          <Route path="/admin/users" element={<AllUsers />} />
          <Route path="/stripe-checkout" element={<StripeCheckoutButton />} />
          <Route path="/admin/user/:id" element={<UserPage />} />
          <Route path="/admin/alldrivers" element={<AllDrivers />} />
          <Route path="/view-driver/:driverId" element={<ViewDriver />} />
          <Route path="/myaccount" element={<UserProfile />} />

          <Route path="/admin/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/admin/restaurants" element={<AllRestaurants />} />
          <Route
            path="/admin/restaurants/:id/edit"
            element={<EditRestaurant />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout/:orderId" element={<CheckoutPage />} />
          <Route path="/success/:orderId" element={<SuccessPage />} />
          <Route path="/stripe-success" element={<StripeSuccessPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
