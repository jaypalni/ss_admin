import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginScreen from "./pages/loginscreen";
import ForgotPassword from "./pages/forgotpassword";
import CreatePassword from "./pages/createpassword";
import AppLayout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Customers from "./pages/Customers";
import BestCars from "./pages/bestcars";
import Documents from "./pages/Documents";
import Analytics from "./pages/Analytics";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Transactions from "./pages/Transactions";
import WebsiteContent from "./pages/WebsiteContent";
import ManageCountry from "./pages/ManageCountry";
import BannerManagement from "./pages/BannerManagement";
import CarDetails from "./components/cardetails";
import Subcriptions from "./pages/subcriptions";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/CreatePassword" element={<CreatePassword />} />

        {/* Protected Routes inside Layout */}
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/users"
          element={
            <AppLayout>
              <Users />
            </AppLayout>
          }
        />
        <Route
          path="/customers"
          element={
            <AppLayout>
              <Customers />
            </AppLayout>
          }
        />
        <Route
          path="/bestcars"
          element={
            <AppLayout>
              <BestCars />
            </AppLayout>
          }
        />
        <Route path="/bestcars/:car_id/CarDetails" element={<CarDetails />} />

        <Route
          path="/transactions"
          element={
            <AppLayout>
              <Transactions />
            </AppLayout>
          }
        />
        <Route
          path="/subcriptions"
          element={
            <AppLayout>
              <Subcriptions />
            </AppLayout>
          }
        />
        <Route
          path="/documents"
          element={
            <AppLayout>
              <Documents />
            </AppLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <AppLayout>
              <Analytics />
            </AppLayout>
          }
        />
        <Route
          path="/messages"
          element={
            <AppLayout>
              <Messages />
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout>
              <Settings />
            </AppLayout>
          }
        />
        <Route
          path="/content/websitecontent"
          element={
            <AppLayout>
              <WebsiteContent />
            </AppLayout>
          }
        />
        <Route
          path="/content/managecountry"
          element={
            <AppLayout>
              <ManageCountry />
            </AppLayout>
          }
        />
        <Route
          path="/content/bannermanagement"
          element={
            <AppLayout>
              <BannerManagement />
            </AppLayout>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
