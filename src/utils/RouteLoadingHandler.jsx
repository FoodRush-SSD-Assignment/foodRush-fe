import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLoading } from "../contexts/LoadingContext";

const RouteLoadingHandler = () => {
  const location = useLocation();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300); // fake delay
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
};

export default RouteLoadingHandler;
