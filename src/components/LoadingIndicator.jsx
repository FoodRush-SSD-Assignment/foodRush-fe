import React from "react";
import { useLoading } from "../contexts/LoadingContext";

const LoadingIndicator = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return <div className="loading-indicator">Loading...</div>;
};

export default LoadingIndicator;
