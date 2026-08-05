import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../../lib/api/auth";
import Sidebar from "./Sidebar";

export default function Layout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isAuthenticated().then((isAuth) => {
      if (!isAuth) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    });
  }, [navigate]);

  if (loading) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
