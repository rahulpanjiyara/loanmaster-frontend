import React, { useState } from "react";

const WBBCCLoan = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal
    name: "",
    age: "",
    gender: "",
    // Business
    businessName: "",
    businessType: "",
    turnover: "",
    // Family
    spouseName: "",
    childrenCount: "",
    dependents: "",
    // Loan
    loanAmount: "",
    loanPurpose: "",
    tenure: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted!");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-2xl shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            West Bengal Bhabishyat Credit Card (WBBCC)
          </h2>

          {/* Progress Bar */}
          <progress
            className="progress progress-primary w-full mb-4"
            value={(step / 4) * 100}
            max="100"
          ></progress>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <h3 className="text-lg font-bold mb-2">Personal Details</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="input input-bordered w-full mb-2"
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  className="input input-bordered w-full mb-2"
                  value={formData.age}
                  onChange={handleChange}
                />
                <select
                  name="gender"
                  className="select select-bordered w-full mb-2"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="text-lg font-bold mb-2">Business Details</h3>
                <input
                  type="text"
                  name="businessName"
                  placeholder="Business Name"
                  className="input input-bordered w-full mb-2"
                  value={formData.businessName}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="businessType"
                  placeholder="Business Type"
                  className="input input-bordered w-full mb-2"
                  value={formData.businessType}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="turnover"
                  placeholder="Annual Turnover"
                  className="input input-bordered w-full mb-2"
                  value={formData.turnover}
                  onChange={handleChange}
                />
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="text-lg font-bold mb-2">Family Details</h3>
                <input
                  type="text"
                  name="spouseName"
                  placeholder="Spouse Name"
                  className="input input-bordered w-full mb-2"
                  value={formData.spouseName}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="childrenCount"
                  placeholder="Number of Children"
                  className="input input-bordered w-full mb-2"
                  value={formData.childrenCount}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="dependents"
                  placeholder="Other Dependents"
                  className="input input-bordered w-full mb-2"
                  value={formData.dependents}
                  onChange={handleChange}
                />
              </>
            )}

            {step === 4 && (
              <>
                <h3 className="text-lg font-bold mb-2">Loan Details</h3>
                <input
                  type="number"
                  name="loanAmount"
                  placeholder="Loan Amount"
                  className="input input-bordered w-full mb-2"
                  value={formData.loanAmount}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="loanPurpose"
                  placeholder="Loan Purpose"
                  className="input input-bordered w-full mb-2"
                  value={formData.loanPurpose}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="tenure"
                  placeholder="Tenure (in months)"
                  className="input input-bordered w-full mb-2"
                  value={formData.tenure}
                  onChange={handleChange}
                />
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn btn-outline"
                >
                  Back
                </button>
              )}
              {step < 4 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary ml-auto"
                >
                  Next
                </button>
              )}
              {step === 4 && (
                <button type="submit" className="btn btn-success ml-auto">
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WBBCCLoan;
