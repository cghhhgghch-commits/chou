import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Favorites from "./pages/Favorites";
import Messages from "./pages/Messages";
import ChatThread from "./pages/ChatThread";
import MyAds from "./pages/MyAds";
import PlaceAd from "./pages/PlaceAd";
import Services from "./pages/Services";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import AdminDashboard2 from "./pages/AdminDashboard2";
import { AuthProvider } from "./lib/AuthContext";
import { NotificationsProvider } from "./lib/NotificationsContext";
import { FavoritesProvider } from "./lib/FavoritesContext";
import { AdminProvider } from "./lib/AdminContext";

export default function App() {
  return (
    <AdminProvider>
      <AuthProvider>
        <NotificationsProvider>
          <FavoritesProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="properties" element={<Properties />} />
                  <Route path="property/:id" element={<PropertyDetails />} />
                  <Route path="services" element={<Services />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="messages/:conversationId" element={<ChatThread />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="my-ads" element={<MyAds />} />
                  <Route path="place-ad" element={<PlaceAd />} />
                  <Route path="add-property" element={<PlaceAd />} />
                  <Route path="about" element={<AboutUs />} />
                  <Route path="privacy" element={<PrivacyPolicy />} />
                  <Route path="terms" element={<TermsOfService />} />
                  <Route path="contact" element={<ContactUs />} />
                  <Route path="help" element={<ContactUs />} />
                  <Route path="faq" element={<ContactUs />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="/admin" element={<AdminDashboard2 />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard2 />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/help" element={<ContactUs />} />
              </Routes>
            </BrowserRouter>
          </FavoritesProvider>
        </NotificationsProvider>
      </AuthProvider>
    </AdminProvider>
  );
}
