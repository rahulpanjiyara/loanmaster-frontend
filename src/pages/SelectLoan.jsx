import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";

export default function SelectLoan() {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user) {
      if (
        !user.brName ||
        !user.brPlace ||
        !user.brCode ||
        !user.brAbm ||
        !user.brManager ||
        !user.BMDesignation
      ) {
        setShowWarning(true);
        
      }
    }
  }, [user,navigate]);

  const loans = [
    {
      title: "SHG Loan",
      desc: "Quick processing for financing Self Help Groups",
      path: "/shgloan",
    },
    {
      title: "Loan Against Deposit",
      desc: "Need money urgently, without premature withdrwal of FD?",
      path: "/lodloan",
    },
    // { title: "Car Loan", desc: "Get your dream vehicle with easy EMIs" },
    // { title: "Education Loan", desc: "Support for higher education expenses" },
    // { title: "Gold Loan", desc: "Instant loan against your gold assets" },
    // { title: "Business Loan", desc: "Grow your business with flexible terms" },
  ];

  if (showWarning) {
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-secondary mb-2">
          Profile Incomplete
        </h2>
        <p className="text-gray-700">
          Please complete your profile (Branch Name, Branch Place, Branch Code,
          Branch ABM, Branch Manager, BM Designation) before selecting a loan.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          <Link to="/profile" className="btn btn-secondary">Update Profile</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Loan Documentation
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 w-full max-w-4xl ">
        {/* <div className="flex justify-center gap-6 max-w-6xl"> */}
        {loans.map((loan, idx) => (
          <div
            key={idx}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="card-body items-center text-center">
              <h2 className="card-title">{loan.title}</h2>
              <p className="text-sm opacity-80">{loan.desc}</p>
              <div className="card-actions mt-4">
                <Link to={loan.path} className="btn btn-primary btn-sm">
                  Select
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
