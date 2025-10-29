// src/components/RateLimitMessage.jsx
import React from "react";

const RateLimitMessage = ({ retryAfter }) => {
  return (
    <p className="text-red-600 text-center mb-3">
      Too many requests. Please wait {retryAfter} seconds.
    </p>
  );
};

export default RateLimitMessage;
