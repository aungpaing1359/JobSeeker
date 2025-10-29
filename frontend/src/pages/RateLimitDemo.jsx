// src/pages/RateLimitDemo.jsx
import React, { useState } from "react";

const RateLimitDemo = () => {
  const [retryAfter, setRetryAfter] = useState(10);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Rate Limit Demo</h2>
      <p>Retry after: {retryAfter} seconds</p>
    </div>
  );
};

export default RateLimitDemo;
