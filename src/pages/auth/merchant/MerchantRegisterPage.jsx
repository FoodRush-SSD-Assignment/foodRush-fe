import React from "react";
import MerchantRegistrationForm from "../../../components/auth/merchant/MerchantRegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-200">
      <div className="z-10">
        <MerchantRegistrationForm />
      </div>
    </div>
  );
};

export default RegisterPage;
