import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MerchantNavbar from "../components/navbar/merchantNavbar";
import CustomerNavbar from "../components/navbar/customerNavbar";
import { useLoading } from "../contexts/LoadingContext";

const AppLayout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(true);
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }

    const timer = setTimeout(() => setIsLoading(false), 500); // fake delay
    return () => clearTimeout(timer);
  }, [navigate, setIsLoading]);

  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div>
      {user.role === "customer" ? <CustomerNavbar /> : <MerchantNavbar />}
      <main className="p-0">
        {/* <RouteLoadingHandler /> */}
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
