import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/layout/Layout";
import { Loader2 } from "lucide-react";
import { AuthProvider } from "./lib/AuthContext";
import { NotificationsProvider } from "./lib/NotificationsContext";
import { FavoritesProvider } from "./lib/FavoritesContext";
import NotificationModal from "./components/notifications/NotificationModal";
import { AdminProvider } from "./lib/AdminContext";
import IOSBackButton from "./components/layout/IOSBackButton";
import { setupPushNotificationListeners } from "./lib/fcm";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const Properties = lazy(() => import("./pages/Properties"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Messages = lazy(() => import("./pages/Messages"));
const ChatThread = lazy(() => import("./pages/ChatThread"));
const MyAds = lazy(() => import("./pages/MyAds"));
const PlaceAd = lazy(() => import("./pages/PlaceAd"));
const Services = lazy(() => import("./pages/Services"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard2 = lazy(() => import("./pages/AdminDashboard2"));

function RouteLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-label="جارٍ تحميل الصفحة">
      <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  useEffect(() => {
    void setupPushNotificationListeners();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
      <AuthProvider>
        <NotificationsProvider>
          <FavoritesProvider>
            <BrowserRouter>
              <NotificationModal />
              <IOSBackButton />
              <Suspense fallback={<RouteLoading />}>
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
                  <Route path="/admin/login" element={<Login />} />
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
              </Suspense>
            </BrowserRouter>
          </FavoritesProvider>
        </NotificationsProvider>
      </AuthProvider>
      </AdminProvider>
    </QueryClientProvider>
  );
}