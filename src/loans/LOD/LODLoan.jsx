import React, { useState, useEffect, useContext } from "react";
import { Plus, Trash2 } from "lucide-react";
import { UserContext } from "../../contexts/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LODLoan = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Load saved data from localStorage
  const savedData = JSON.parse(localStorage.getItem("lod_booklet_data")) || {};
  const [loading, setLoading] = useState(false);

  // const [sbAcc, setSbAcc] = useState(savedData.loan_data?.sbAcc || "");
  // const [address, setAddress] = useState(savedData.loan_data?.address || "");

  const [borrowers, setBorrowers] = useState(
    savedData.borrowers_data || [{ name: "", father: "", mobile: "", dob: "" }]
  );

  const [deposits, setDeposits] = useState(
    savedData.deposits_data || [
      {
        depositorName: "",
        accNo: "",
        inttRate: "",
        termVal: "",
        matVal: "",
        issueDate: "",
        matDate: "",
      },
    ]
  );

  const [loanDetails, setLoanDetails] = useState(
    savedData.loan_data || {
      sbAcc: "",
    address: "",
      elgLoan: "",
      appLoan: "",
      loanType: "Overdraft",
      spread: "",
      appDate: "",
      sanDate: "",
      tenure: "",
    }
  );

  const [errors, setErrors] = useState({
    borrowers: [],
    deposits: [],
    loanDetails: "",
  });

  // --- Persist to localStorage whenever data changes ---
  useEffect(() => {
    const dataToSave = {
      user_data: user,
      borrowers_data: borrowers,
      deposits_data: deposits,
      loan_data: loanDetails,
    };
    localStorage.setItem("lod_booklet_data", JSON.stringify(dataToSave));
  }, [borrowers, deposits, loanDetails, user]);

  // --- Borrowers handlers ---
  const handleBorrowerChange = (index, field, value) => {
    const newBorrowers = [...borrowers];
    newBorrowers[index][field] = value;
    setBorrowers(newBorrowers);
  };

  const addBorrower = () => {
    setBorrowers([...borrowers, { name: "", father: "", mobile: "", dob: "" }]);
  };

  const deleteBorrower = (index) => {
    setBorrowers(borrowers.filter((_, i) => i !== index));
  };

  // --- Deposits handlers ---
  const handleDepositChange = (index, field, value) => {
    const newDeposits = [...deposits];
    newDeposits[index][field] = value;
    setDeposits(newDeposits);
  };

  const addDeposit = () => {
    setDeposits([
      ...deposits,
      {
        depositorName: "",
        accNo: "",
        inttRate: "",
        termVal: "",
        matVal: "",
        issueDate: "",
        matDate: "",
      },
    ]);
  };

  const deleteDeposit = (index) => {
    setDeposits(deposits.filter((_, i) => i !== index));
  };

  // --- Loan details handler ---
  const handleLoanChange = (field, value) => {
    if (field === "appLoan") {
      const applied = parseFloat(value) || 0;
      const eligible = parseFloat(loanDetails.elgLoan) || 0;
      if (applied > eligible) {
        alert("Applied loan cannot be greater than eligible loan.");
        return setLoanDetails((prev) => ({
          ...prev,
          appLoan: eligible ? eligible.toFixed(2) : "",
        }));
      }
    }
    setLoanDetails((prev) => ({ ...prev, [field]: value }));
  };

  // --- Auto-calculate eligible loan & tenure ---
  useEffect(() => {
    const totalTermVal = deposits.reduce(
      (sum, d) => sum + (parseFloat(d.termVal) || 0),
      0
    );
    const eligibleLoan = totalTermVal * 0.9;

    let tenureMonths = "";
    if (loanDetails.sanDate) {
      const sanDateObj = new Date(loanDetails.sanDate);
      const validMatDates = deposits
        .map((d) => (d.matDate ? new Date(d.matDate) : null))
        .filter((d) => d && !isNaN(d.getTime()));
      const latestMatDate =
        validMatDates.length > 0
          ? validMatDates.sort((a, b) => a - b)[0]
          : null;

      if (latestMatDate && latestMatDate >= sanDateObj) {
        tenureMonths =
          (latestMatDate.getFullYear() - sanDateObj.getFullYear()) * 12 +
          (latestMatDate.getMonth() - sanDateObj.getMonth());
        if (latestMatDate.getDate() < sanDateObj.getDate()) tenureMonths -= 1;
      } else {
        tenureMonths = 0;
      }
    }

    setLoanDetails((prev) => ({
      ...prev,
      elgLoan: eligibleLoan ? eligibleLoan.toFixed(2) : "",
      tenure: tenureMonths !== "" ? tenureMonths : "",
    }));
  }, [deposits, loanDetails.sanDate]);

  // --- Validation functions ---
  // const validateAccountDetails = () => {
  //   let sbError = "";
  //   let addrError = "";
  //   if (!sbAcc) sbError = "SB account is required";
  //   if (!address) addrError = "Address is required";
  //   setErrors((prev) => ({ ...prev, sbAcc: sbError, address: addrError }));
  //   return !sbError && !addrError;
  // };

  const validateBorrowers = () => {
    const errs = borrowers.map((b) => ({
      name: !b.name ? "Name is required" : "",
      father: !b.father ? "Father's name is required" : "",
      mobile: !b.mobile
        ? "Mobile is required"
        : !/^\d{10}$/.test(b.mobile)
        ? "Invalid mobile"
        : "",
      dob: !b.dob ? "Date of birth is required" : "",
    }));
    setErrors((prev) => ({ ...prev, borrowers: errs }));
    return errs.every((b) => Object.values(b).every((v) => !v));
  };

  const validateDeposits = () => {
    const errs = deposits.map((d) => ({
      depositorName: !d.depositorName ? "Required" : "",
      accNo: !d.accNo ? "Required" : "",
      inttRate: !d.inttRate ? "Required" : "",
      termVal: !d.termVal ? "Required" : "",
      matVal: !d.matVal ? "Required" : "",
      issueDate: !d.issueDate ? "Required" : "",
      matDate: !d.matDate ? "Required" : "",
    }));
    setErrors((prev) => ({ ...prev, deposits: errs }));
    return errs.every((d) => Object.values(d).every((v) => !v));
  };

  const validateLoanDetails = () => {
    const { elgLoan, appLoan, spread, appDate, sanDate } = loanDetails;
    let loanError = "";
    if (!appLoan) loanError = "Applied loan is required";
    else if (parseFloat(appLoan) > parseFloat(elgLoan))
      loanError = "Applied loan cannot exceed eligible loan";
    else if (!spread) loanError = "Spread is required";
    else if (!appDate) loanError = "Application date is required";
    else if (!sanDate) loanError = "Sanction date is required";

    setErrors((prev) => ({ ...prev, loanDetails: loanError }));
    return !loanError;
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    //const validAccount = validateAccountDetails();
    const validBorrowers = validateBorrowers();
    const validDeposits = validateDeposits();
    const validLoan = validateLoanDetails();

    if (!validAccount || !validBorrowers || !validDeposits || !validLoan) {
      toast.error("Please fix validation errors before submitting");
      return;
    }

    try {
      setLoading(true); // ✅ Start loader
      const dataToSend = {
        user_data: user,
        borrowers_data: borrowers,
        deposits_data: deposits,
        loan_data: loanDetails,
      };
      const res = await axios.post(
        `${backendUrl}/loan/lod-booklet`,
        dataToSend
      );
      navigate("/preview", { state: { htmlContent: res.data } });
    } catch (err) {
      console.error(err);
      toast.error("Error submitting data. Please try again.");
    } finally {
      setLoading(false); // ✅ Stop loader
    }
  };

  // --- Clear form ---
  const handleClear = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to clear the form?")) {
      localStorage.removeItem("lod_booklet_data");
      
      setBorrowers([{ name: "", father: "", mobile: "", dob: "" }]);
      setDeposits([
        {
          depositorName: "",
          accNo: "",
          inttRate: "",
          termVal: "",
          matVal: "",
          issueDate: "",
          matDate: "",
        },
      ]);
      setLoanDetails({
        sbAcc: "",
    address: "",
        elgLoan: "",
        appLoan: "",
        loanType: "Overdraft",
        spread: "",
        appDate: "",
        sanDate: "",
        tenure: "",
      });
    }
  };

  return (
    <div className="p-4">
      <main className="max-w-7xl mx-auto space-y-8">
        <fieldset className="fieldset bg-base-100 border-base-300 rounded-box border p-4">
          <legend className="fieldset-legend">
            <h1 className="text-center text-xl text-secondary">
              Loan Against Deposit
            </h1>
          </legend>

          {/* Account Details */}
          <section className="border p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Account Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">SB Account No.</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={loanDetails.sbAcc}
                  onChange={(e) => handleLoanChange("sbAcc", e.target.value)}
                />
{/*                 {errors.sbAcc && (
                  <span className="text-red-500 text-sm">{errors.sbAcc}</span>
                )} */}
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                   value={loanDetails.address}
                  onChange={(e) => handleLoanChange("address", e.target.value)}
                />
{/*                 {errors.address && (
                  <span className="text-red-500 text-sm">{errors.address}</span>
                )} */}
              </div>
            </div>
          </section>

          {/* Borrowers Section */}
          <section className="border p-4 rounded-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h3 className="text-lg font-semibold">Borrower(s) Details</h3>
              <button
                className="btn btn-sm btn-primary flex items-center gap-1"
                onClick={addBorrower}
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {borrowers.map((b, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 items-end relative"
              >
                {[
                  { field: "name", label: "Name", type: "text" },
                  { field: "father", label: "Father's Name", type: "text" },
                  { field: "mobile", label: "Mobile No.", type: "number" },
                  { field: "dob", label: "Date of Birth", type: "date" },
                ].map((item) => (
                  <div key={item.field} className="form-control w-full">
                    <label className="label">
                      <span className="label-text">{item.label}</span>
                    </label>
                    <input
                      type={item.type}
                      className="input input-bordered w-full"
                      value={b[item.field]}
                      onChange={(e) =>
                        handleBorrowerChange(i, item.field, e.target.value)
                      }
                    />
                    {errors.borrowers[i] && errors.borrowers[i][item.field] && (
                      <span className="text-red-500 text-sm">
                        {errors.borrowers[i][item.field]}
                      </span>
                    )}
                  </div>
                ))}

                {borrowers.length > 1 && (
                  <button
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                    onClick={() => deleteBorrower(i)}
                    title="Delete Borrower"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* Deposits Section */}
          <section className="border p-4 rounded-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h3 className="text-lg font-semibold">Deposit(s) Details</h3>
              <button
                className="btn btn-sm btn-primary flex items-center gap-1"
                onClick={addDeposit}
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {deposits.map((d, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 items-end relative"
              >
                {[
                  {
                    field: "depositorName",
                    label: "Depositor Name",
                    type: "text",
                  },
                  { field: "accNo", label: "FD/RD Acc No.", type: "number" },
                  { field: "inttRate", label: "Intt. Rate", type: "number" },
                  { field: "termVal", label: "Term Value", type: "number" },
                  { field: "matVal", label: "Maturity Value", type: "number" },
                  { field: "issueDate", label: "Issue Date", type: "date" },
                  { field: "matDate", label: "Maturity Date", type: "date" },
                ].map((item) => (
                  <div key={item.field} className="form-control w-full">
                    <label className="label">
                      <span className="label-text">{item.label}</span>
                    </label>
                    <input
                      type={item.type}
                      className="input input-bordered w-full"
                      value={d[item.field]}
                      onChange={(e) =>
                        handleDepositChange(i, item.field, e.target.value)
                      }
                    />
                    {errors.deposits[i] && errors.deposits[i][item.field] && (
                      <span className="text-red-500 text-sm">
                        {errors.deposits[i][item.field]}
                      </span>
                    )}
                  </div>
                ))}

                {deposits.length > 1 && (
                  <button
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                    onClick={() => deleteDeposit(i)}
                    title="Delete Deposit"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* Loan Details Section */}
          <section className="border p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-4">Loan Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Eligible Loan (Rs.)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={loanDetails.elgLoan}
                  disabled
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Applied Loan (Rs.)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={loanDetails.appLoan}
                  onChange={(e) => handleLoanChange("appLoan", e.target.value)}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Loan Type</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={loanDetails.loanType}
                  onChange={(e) => handleLoanChange("loanType", e.target.value)}
                >
                  {["Overdraft", "Term Loan"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Spread</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={loanDetails.spread}
                  onChange={(e) => handleLoanChange("spread", e.target.value)}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Application Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={loanDetails.appDate}
                  onChange={(e) => handleLoanChange("appDate", e.target.value)}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Sanction Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={loanDetails.sanDate}
                  onChange={(e) => handleLoanChange("sanDate", e.target.value)}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Tenure (Months)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={loanDetails.tenure}
                  disabled
                />
              </div>

              {errors.loanDetails && (
                <span className="text-red-500 text-sm col-span-full">
                  {errors.loanDetails}
                </span>
              )}
            </div>
          </section>

          {/* Buttons */}
          <div className="join flex justify-end mt-6">
            <button className="btn  join-item" onClick={handleClear}>
              Reset
            </button>
            <button className="btn btn-secondary join-item" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <span className="loader mr-2"></span> Submitting...
                </>
              ) : (
                "Submit Details"
              )}
            </button>
          </div>
        </fieldset>
      </main>
    </div>
  );
};

export default LODLoan;
