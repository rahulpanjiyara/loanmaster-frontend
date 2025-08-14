// src/pages/Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorised = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-center p-4">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-error mb-4">401</h1>
        <h2 className="text-3xl font-semibold mb-2">Unauthorized</h2>
        <p className="mb-6 text-base-content">
          Sorry, you are not authorized to access this page.
        </p>
        <Link to="/" className="btn btn-primary">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorised;
