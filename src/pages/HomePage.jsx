import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";

export default function HomePage() {
  const { user } = useContext(UserContext);
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero bg-base-100 py-10">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src="https://img.freepik.com/free-vector/loan-agreement-concept-illustration_114360-7991.jpg"
            className="max-w-sm rounded-lg shadow-2xl"
            alt="Loan Booklet"
          />
          <div>
            <h1 className="text-5xl font-bold">Loan Booklet Generator</h1>
            <p className="py-6">
              Simplify loan documentation for bankers with a fast, accurate, and
              automated booklet generator. Save time, reduce errors, and focus
              on what matters — serving your customers.
            </p>
            <Link to="/selectloan" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-10 px-5">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Choose Our Application?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <h2 className="card-title">📄 Auto-Generated Documents</h2>
              <p>
                Create loan booklets instantly with borrower details and
                calculations in a ready-to-print PDF format.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <h2 className="card-title">⚡ Save Time</h2>
              <p>
                Reduce hours of manual work into just a few clicks — perfect for
                busy branch environments.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <h2 className="card-title">✅ Error-Free Output</h2>
              <p>
                Avoid costly mistakes by generating standardized and verified
                loan documentation every time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-10 bg-primary text-primary-content">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Simplify Loan Documentation?
        </h2>

        {user ? (
          <Link to="/selectloan" className="btn btn-secondary">
            Go to Loans
          </Link>
        ) : (
          <div>
            <p className="mb-6">
              Sign up now and experience the fastest way to prepare loan
              booklets.
            </p>
            <Link to="/register" className="btn btn-secondary">
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
