import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();

  // get the HTML string passed via navigate state
  const { htmlContent } = location.state || {};

  // If no content, redirect back to form or show error
  if (!htmlContent) {
    return (
      <div>
        <p>No preview available.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div>
      <div
        // style={{ padding: "2rem", marginTop: "1rem" }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      
    </div>
  );
}
