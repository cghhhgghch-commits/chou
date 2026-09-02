import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileNav from "./MobileNav";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNav />
    </div>
  );
}
