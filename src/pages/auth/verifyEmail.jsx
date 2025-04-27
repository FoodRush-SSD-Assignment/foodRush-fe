import React, { useEffect, useState } from "react";
import VerifyEmailForm from "../../components/MailVerify";

const VerifyEmailPage = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("pendingRole"); // Assuming you saved this during register
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const isCustomer = role === "customer";

  return (
    <div
      className={` flex items-center justify-center relative overflow-hidden ${
        !isCustomer && "bg-gray-100"
      }`}
    >
      {isCustomer && (
        <>
          {/* Animated Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-400 via-yellow-300 to-white opacity-20"></div>
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-red-500 filter blur-3xl opacity-20 animate-pulse"
              style={{ backgroundColor: "#C83C3C" }}
            ></div>
            <div
              className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-yellow-400 filter blur-3xl opacity-20 animate-pulse"
              style={{ backgroundColor: "#FFD95F" }}
            ></div>
            <div
              className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-red-800 filter blur-3xl opacity-10 animate-pulse"
              style={{ backgroundColor: "#331C1C" }}
            ></div>
          </div>

          {/* Mesh pattern */}
          <div
            className="absolute inset-0 z-0 opacity-5"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000000" fill-opacity="1" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="1"%3E%3C/circle%3E%3C/g%3E%3C/svg%3E\')',
            }}
          ></div>
        </>
      )}

      {/* Email Form always shown */}
      <div className="z-10">
        <VerifyEmailForm />
      </div>
    </div>
  );
};

export default VerifyEmailPage;
