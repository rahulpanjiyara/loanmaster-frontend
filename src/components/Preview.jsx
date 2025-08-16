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
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-2xl mb-3">No Preview Available</h1>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Go Back
        </button>
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
