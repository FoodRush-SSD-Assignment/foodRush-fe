import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authApi from "../../api/authApi";

const GoogleOAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // Save token directly
      localStorage.setItem("token", token);

      // Fetch user profile
      authApi
        .get("/auth/getuser/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data));
          navigate("/landing-page", { replace: true });
        })
        .catch((err) => {
          const errorMsg =
            err.response?.data?.message || "google_profile_failed";
          navigate(`/login?error=${encodeURIComponent(errorMsg)}`);
        });
    } else {
      navigate("/login?error=missing_token");
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Logging you in with Google...</div>
    </div>
  );
};

export default GoogleOAuthSuccess;
