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
import Subcriptions from "./pages/subcriptions";
import CustomerDetails from "./components/customerdetails";
import Profile from "./components/profile";
import Support from "./pages/Support";
import CarTypes from "./pages/CarTypes";
import ListingManagement from "./pages/listingmanagement";
import CreateSubadmin from "./components/createsubadmin";
import ListingDetails from "./pages/listingdetails";
import OtpScreen from "./pages/otpscreen";
import Individual from "./pages/Individual";
import Dealer from "./pages/Dealer";
import Individualdetails from "./pages/individualdetails";
import CreateNewUserAdmin from "./pages/CreateNewUserAdmin";
import GetAdminsData from "./pages/GetAdminsData";
import ChangePassword from "./pages/ChangePassword";
import Pricing from "./pages/Pricing";
import CreateNewSubscription from "./pages/CreateNewSubscription";
import TranscationsFin from "./pages/TranscationsFin";
import DealerDetails from "./pages/DealerDetails";
import FQA from "./pages/FQA";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import EditFaq from "./pages/EditFaq";


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/OtpScreen" element={<OtpScreen />} />
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
          path="/profile"
          element={
            <AppLayout>
              <Profile />
            </AppLayout>
          }
        />
        <Route
          path="/createsubadmin"
          element={
            <AppLayout>
              <CreateSubadmin />
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
          path="/car-types"
          element={
            <AppLayout>
              <CarTypes />
            </AppLayout>
          }
        />
        <Route
          path="/listingmanagement"
          element={
            <AppLayout>
              <ListingManagement />
            </AppLayout>
          }
        />
        <Route
          path="/listingmanagement/bestcars"
          element={
            <AppLayout>
              <BestCars />
            </AppLayout>
          }
        />
        
         <Route
  path="/listingdetails/:listingId"
  element={
    <AppLayout>
      <ListingDetails />
    </AppLayout>
  }
/>

         <Route
          path="/user-management/individual"
          element={
            <AppLayout>
              <Individual />
            </AppLayout>
          }
        />

        <Route
          path="/user-management/dealer"
          element={
            <AppLayout>
              <Dealer />
            </AppLayout>
          }
        />

        <Route
          path="/user-management/dealer/:dealerId"
          element={
            <AppLayout>
              <DealerDetails />
            </AppLayout>
          }
        />

 <Route
  path="/user-management/individual/:individualId"
  element={
    <AppLayout>
      <Individualdetails />
    </AppLayout>
  }
/>

        <Route
          path="/financials/pricing"
          element={
            <AppLayout>
              <Pricing />
            </AppLayout>
          }
        />

        <Route
          path="/financials/pricing/createNewPackage"
          element={
            <AppLayout>
              <CreateNewSubscription />
            </AppLayout>
          }
        />

         <Route
          path="/financials/pricing/createNewPackage/:id"
          element={
            <AppLayout>
              <CreateNewSubscription />
            </AppLayout>
          }
        />

         <Route
          path="/financials/transactions"
          element={
            <AppLayout>
              <TranscationsFin />
            </AppLayout>
          }
        />
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
          path="/support"
          element={
            <AppLayout>
              <Support />
            </AppLayout>
          }
        />
        <Route
          path="/CustomerDetails/:id"
          element={
            <AppLayout>
              <CustomerDetails />
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
          path="/accountsettings/changepassword"
          element={
            <AppLayout>
              <ChangePassword />
            </AppLayout>
          }
        />
        <Route
          path="/createNewAdmin"
          element={
            <AppLayout>
              <CreateNewUserAdmin />
            </AppLayout>
          }
        />
         <Route
          path="/createNewAdmin/:id"
          element={
            <AppLayout>
              <CreateNewUserAdmin />
            </AppLayout>
          }
        />

         <Route
          path="/Admins"
          element={
            <AppLayout>
              <GetAdminsData />
            </AppLayout>
          }
        />

        <Route
          path="/FAQ'S"
          element={
            <AppLayout>
              <FQA />
            </AppLayout>
          }
        />
         <Route
          path="/Add/FAQ'S"
          element={
            <AppLayout>
              <EditFaq />
            </AppLayout>
          }
        />
         <Route
          path="/FAQ'S/:id"
          element={
            <AppLayout>
              <EditFaq />
            </AppLayout>
          }
        />
        <Route
          path="/terms&conditions"
          element={
            <AppLayout>
              <TermsAndConditions />
            </AppLayout>
          }
        />
        <Route
          path="/privacyPolicy"
          element={
            <AppLayout>
              <PrivacyPolicy />
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
