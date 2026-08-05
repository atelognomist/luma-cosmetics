import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

export default function App() {
  const location = useLocation();
  const isOrderPage = location.pathname === "/order";

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      {!isOrderPage && <Footer />}
    </div>
  );
}
