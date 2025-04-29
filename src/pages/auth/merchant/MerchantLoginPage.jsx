import React from "react";
import MerchantLoginForm from "../../../components/auth/merchant/MerchantLoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-lightgray">
      <div className="z-10">
        <MerchantLoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
