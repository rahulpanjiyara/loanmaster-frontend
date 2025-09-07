import React, { useState, useEffect, useContext } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";
import { toast } from "react-toastify";
import axios from "axios";


// Single-file refactored multi-step form with persistent data across steps.
// Pattern: parent holds canonical `formData`. Each step initializes its local
// state from `data` (on data change) AND writes updates back to parent via
// updateForm immediately on input changes. That guarantees persistence when
// navigating Back/Next.

const SAKHILoan = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useContext(UserContext);

  const nextStep = () => setStep((s) => Math.min(5, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const updateForm = (partial) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  // Field label mapping (used in submit validation)
  const fieldLabels = {
    customerName: "Customer Name",
    spouseFather: "Spouse/Father Name",
    villageCityResidence: "Village/City of Residence",
    po: "Post Office",
    ps: "Police Station",
    district: "District",
    state: "State",
    pin: "PIN Code",
    dob: "Date of Birth",
    qualification: "Qualification",
    email: "Email",
    contactNo: "Contact No",
    aadhar: "Aadhar Number",
    udyamRegnNo: "Udyam Registration No",
    pan: "PAN",
    cibilScore: "CIBIL Score",
    customerSince: "Customer Since",
    constitution: "Constitution",
    firmName: "Firm Name",
    activity: "Activity",
    establishedOn: "Established On",
    tradeLicenseNo: "Trade License No",
    registeredUnder: "Registered Under",
    experienceYears: "Experience (Years)",
    villageCityBusiness: "Village/City of Business",
    poBusiness: "Post Office (Business)",
    noOfEmployees: "No. of Employees",
    premisesOccupancy: "Premises Occupancy",
    cashAndBankBalance: "Cash & Bank Balance",
    lipGoldNscOtherInvestment: "LIP/Gold/NSC/Other Investment",
    landDetails: "Land Details",
    buildingDetails: "Building Details",
    plantMachineryFurniture: "Plant, Machinery & Furniture",
    currentStock: "Current Stock",
    debtorsValue: "Debtors Value",
    outstandingBankLoans: "Outstanding Bank Loans",
    totalExistingEmis: "Total Existing EMIs",
    turnoverLastFY: "Turnover Last FY",
    grossProfit: "Gross Profit",
    netProfit: "Net Profit",
    shgGroupName: "SHG/Group Name",
    shgGroupAddress: "SHG/Group Address",
    nrlmCode: "NRLM Code",
    noOfMembers: "No. of Members",
    dateOfFormation: "Date of Formation",
    shgSbAccount: "SHG SB Account",
    shgCcAccount: "SHG CC Account",
    dateOfFirstLending: "Date of First Lending",
    dateOfSecondLending: "Date of Second Lending",
    currentLimit: "Current Limit",
    currentGrading: "Current Grading",
    lapsReffNo: "LAPS Reference No",
    applicationDate: "Application Date",
    loanAmount: "Loan Amount",
    loanPurpose: "Loan Purpose",
    tenureMonths: "Tenure (Months)",
    currentRepoRate: "Current Repo Rate",
    sanctionDate: "Sanction Date",
  };

  const handleSubmit = async () => {
    // Because we sync on every change, formData should already have the latest values.
    const finalFormData = { ...formData };

    const requiredFields = Object.keys(fieldLabels);
    const emptyFields = requiredFields.filter(
      (key) =>
        !finalFormData[key] || finalFormData[key].toString().trim() === ""
    );

    if (emptyFields.length > 0) {
      const missingLabels = emptyFields.map((k) => fieldLabels[k]);
      alert(
        `Please fill all required fields. Missing: ${missingLabels.join(", ")}`
      );
      return;
    }

    console.log("Form submitted:", finalFormData);
    alert("Form submitted successfully! Check console for data.");

    try {
      //setLoading(true); // ✅ Start loader
      const dataToSend = {
        user_data: user,
        sakhi_data: finalFormData,
        
      };
      const res = await axios.post(
        `${backendUrl}/loan/sakhi-booklet`,
        dataToSend
      );
      navigate("/preview", { state: { htmlContent: res.data } });
    } catch (err) {
      console.error(err);
      toast.error("Error submitting data. Please try again.");
    }
  };

  const handleJSONUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        if (typeof json === "object" && json !== null) {
          setFormData(json);
          alert("Form data loaded from JSON!");
        } else {
          throw new Error("Invalid JSON structure");
        }
      } catch (err) {
        alert("Invalid JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const downloadJSON = () => {
    const customerName = formData.customerName || "customer";
    const filename = `${customerName}.json`;
    const blob = new Blob([JSON.stringify(formData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-5xl h-[700px] bg-base-100 shadow-xl rounded-lg p-6 flex flex-col">
        {/* JSON Upload */}
        <h2 className="text-xl font-bold text-center text-primary">
          MSME SAKHI LOAN
        </h2>
        <div className="mb-4 join">
          <label className="btn btn-xs join-item">
            Upload JSON
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => handleJSONUpload(e.target.files?.[0])}
            />
          </label>
          <button
            className="btn btn-xs join-item rounded-r-sm"
            onClick={downloadJSON}
          >
            Download JSON
          </button>
          <div className="ml-auto text-sm">Step {step} / 5</div>
        </div>

        {/* Stepper */}
        <ul className="steps mb-4">
          {[
            "Borrower's Profile",
            "Business Details",
            "Financial Details",
            "SHG Group Details",
            "Loan Details",
          ].map((label, idx) => (
            <li
              key={idx}
              className={`step ${step >= idx + 1 ? "step-primary" : ""}`}
              onClick={() => setStep(idx + 1)}
            >
              {label}
            </li>
          ))}
        </ul>

        {/* Steps */}
        <div className="flex-1 overflow-y-auto p-2">
          {step === 1 && (
            <StepBorrower
              data={formData}
              updateForm={updateForm}
              onNext={nextStep}
            />
          )}
          {step === 2 && (
            <StepBusiness
              data={formData}
              updateForm={updateForm}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {step === 3 && (
            <StepFinance
              data={formData}
              updateForm={updateForm}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {step === 4 && (
            <StepShg
              data={formData}
              updateForm={updateForm}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {step === 5 && (
            <StepLoan
              data={formData}
              updateForm={updateForm}
              onBack={prevStep}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SAKHILoan;

/* ---------------- Step Components ---------------- */

const StepBorrower = ({ data, updateForm, onNext }) => {
  const [local, setLocal] = useState({});
  const [legalHeirs, setLegalHeirs] = useState([
    { name: "", age: "", relation: "" },
  ]);

  // Sync whenever global `data` changes
  useEffect(() => {
    setLocal({
      customerName: data.customerName || "",
      spouseFather: data.spouseFather || "",
      villageCityResidence: data.villageCityResidence || "",
      po: data.po || "",
      ps: data.ps || "",
      district: data.district || "",
      state: data.state || "",
      pin: data.pin || "",
      dob: data.dob || "",
      qualification: data.qualification || "",
      email: data.email || "",
      contactNo: data.contactNo || "",
      aadhar: data.aadhar || "",
      udyamRegnNo: data.udyamRegnNo || "",
      pan: data.pan || "",
      cibilScore: data.cibilScore || "",
      customerSince: data.customerSince || "",
    });

    if (Array.isArray(data.legalHeirs) && data.legalHeirs.length) {
      setLegalHeirs(data.legalHeirs);
    } else {
      setLegalHeirs([{ name: "", age: "", relation: "" }]);
    }
  }, [data]);

  // Generic input change handler that also syncs to parent immediately
  const handle = (e) => {
    const { name, value } = e.target;
    setLocal((p) => {
      const next = { ...p, [name]: value };
      updateForm(next);
      return next;
    });
  };

  const handleHeirChange = (index, field, value) => {
    const updated = [...legalHeirs];
    updated[index] = { ...updated[index], [field]: value };
    setLegalHeirs(updated);
    updateForm({ legalHeirs: updated });
  };

  const addHeir = () => {
    const updated = [...legalHeirs, { name: "", age: "", relation: "" }];
    setLegalHeirs(updated);
    updateForm({ legalHeirs: updated });
  };

  const removeHeir = (idx) => {
    const updated = legalHeirs.filter((_, i) => i !== idx);
    setLegalHeirs(
      updated.length ? updated : [{ name: "", age: "", relation: "" }]
    );
    updateForm({ legalHeirs: updated });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Borrower's Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          ["Customer Name", "customerName", "text"],
          ["Spouse / Father", "spouseFather", "text"],
          ["Village / City of Residence", "villageCityResidence", "text"],
          ["Post Office", "po", "text"],
          ["Police Station", "ps", "text"],
          ["District", "district", "text"],
          ["State", "state", "text"],
          ["PIN", "pin", "text"],
          ["Date of Birth", "dob", "date"],
          ["Qualification", "qualification", "text"],
          ["E-mail ID", "email", "email"],
          ["Mobile No.", "contactNo", "number"],
          ["Aadhar", "aadhar", "number"],
          ["UDHYAM Regn. No.", "udyamRegnNo", "text"],
          ["PAN", "pan", "text"],
          ["CIBIL Score", "cibilScore", "number"],
          ["Customer Since", "customerSince", "date"],
        ].map(([label, name, type]) => (
          <Input
            key={name}
            label={label}
            name={name}
            type={type}
            value={local[name] || ""}
            onChange={handle}
          />
        ))}
      </div>

      {/* Legal Heirs Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Legal Heirs</h3>
        {legalHeirs.map((heir, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2 relative"
          >
            <Input
              label="Name"
              name={`heir_name_${idx}`}
              value={heir.name}
              onChange={(e) => handleHeirChange(idx, "name", e.target.value)}
            />
            <Input
              label="Age"
              name={`heir_age_${idx}`}
              type="number"
              value={heir.age}
              onChange={(e) => handleHeirChange(idx, "age", e.target.value)}
            />
            <Input
              label="Relation"
              name={`heir_relation_${idx}`}
              value={heir.relation}
              onChange={(e) =>
                handleHeirChange(idx, "relation", e.target.value)
              }
            />

            {legalHeirs.length > 1 && (
              <Trash2
                size={18}
                className="absolute top-2 right-2 text-red-500 cursor-pointer"
                onClick={() => removeHeir(idx)}
                title="Delete Heir"
              />
            )}
          </div>
        ))}
        <button className="btn btn-outline btn-sm mt-2" onClick={addHeir}>
          + Add Heir
        </button>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="btn btn-primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

const StepBusiness = ({ data, updateForm, onNext, onBack }) => {
  const [local, setLocal] = useState({});

  useEffect(() => {
    setLocal({
      constitution: data.constitution || "",
      firmName: data.firmName || "",
      activity: data.activity || "",
      establishedOn: data.establishedOn || "",
      tradeLicenseNo: data.tradeLicenseNo || "",
      registeredUnder: data.registeredUnder || "",
      experienceYears: data.experienceYears || "",
      villageCityBusiness: data.villageCityBusiness || "",
      poBusiness: data.poBusiness || "",
      noOfEmployees: data.noOfEmployees || "",
      premisesOccupancy: data.premisesOccupancy || "",
    });
  }, [data]);

  const handle = (e) => {
    const { name, value } = e.target;
    setLocal((p) => {
      const next = { ...p, [name]: value };
      updateForm(next);
      return next;
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Business Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select
          label="Constitution"
          name="constitution"
          value={local.constitution}
          onChange={handle}
          options={["Proprietorship", "Individual"]}
        />
        <Input
          label="Firm Name"
          name="firmName"
          value={local.firmName}
          onChange={handle}
        />
        <Input
          label="Activity"
          name="activity"
          value={local.activity}
          onChange={handle}
        />
        <Input
          label="Established On"
          name="establishedOn"
          type="date"
          value={local.establishedOn}
          onChange={handle}
        />
        <Input
          label="Trade License No."
          name="tradeLicenseNo"
          value={local.tradeLicenseNo}
          onChange={handle}
        />
        <Input
          label="Registered Under"
          name="registeredUnder"
          value={local.registeredUnder}
          onChange={handle}
        />
        <Input
          label="Experience (Years)"
          name="experienceYears"
          type="number"
          value={local.experienceYears}
          onChange={handle}
        />
        <Input
          label="Village/City of Business"
          name="villageCityBusiness"
          value={local.villageCityBusiness}
          onChange={handle}
        />
        <Input
          label="P.O. of Business Place"
          name="poBusiness"
          value={local.poBusiness}
          onChange={handle}
        />
        <Select
          label="Premises Occupancy"
          name="premisesOccupancy"
          value={local.premisesOccupancy}
          onChange={handle}
          options={["Owned", "Rented", "Leased"]}
        />
        <Input
          label="No. of Employees"
          name="noOfEmployees"
          type="number"
          value={local.noOfEmployees}
          onChange={handle}
        />
      </div>
      <div className="mt-6 flex justify-between">
        <button className="btn" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

const StepFinance = ({ data, updateForm, onNext, onBack }) => {
  const [local, setLocal] = useState({});
  useEffect(() => {
    setLocal({
      cashAndBankBalance: data.cashAndBankBalance || "",
      lipGoldNscOtherInvestment: data.lipGoldNscOtherInvestment || "",
      landDetails: data.landDetails || "",
      buildingDetails: data.buildingDetails || "",
      plantMachineryFurniture: data.plantMachineryFurniture || "",
      currentStock: data.currentStock || "",
      debtorsValue: data.debtorsValue || "",
      outstandingBankLoans: data.outstandingBankLoans || "",
      totalExistingEmis: data.totalExistingEmis || "",
      turnoverLastFY: data.turnoverLastFY || "",
      grossProfit: data.grossProfit || "",
      netProfit: data.netProfit || "",
    });
  }, [data]);

  const handle = (e) => {
    const { name, value } = e.target;
    setLocal((p) => {
      const next = { ...p, [name]: value };
      updateForm(next);
      return next;
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Financial Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Cash & Bank Balance"
          name="cashAndBankBalance"
          type="number"
          value={local.cashAndBankBalance}
          onChange={handle}
        />
        <Input
          label="LIP/GOLD/NSC/Other Investment"
          name="lipGoldNscOtherInvestment"
          type="number"
          value={local.lipGoldNscOtherInvestment}
          onChange={handle}
        />
        <Input
          label="Value of Land"
          name="landDetails"
          type="number"
          value={local.landDetails}
          onChange={handle}
        />
        <Input
          label="Value of Building"
          name="buildingDetails"
          type="number"
          value={local.buildingDetails}
          onChange={handle}
        />
        <Input
          label="Plant/Machinery/Furniture"
          name="plantMachineryFurniture"
          type="number"
          value={local.plantMachineryFurniture}
          onChange={handle}
        />
        <Input
          label="Current Stock"
          name="currentStock"
          type="number"
          value={local.currentStock}
          onChange={handle}
        />
        <Input
          label="Book-debts"
          name="debtorsValue"
          type="number"
          value={local.debtorsValue}
          onChange={handle}
        />
        <Input
          label="Outstanding Bank Loans"
          name="outstandingBankLoans"
          type="number"
          value={local.outstandingBankLoans}
          onChange={handle}
        />
        <Input
          label="Total Existing EMIs"
          name="totalExistingEmis"
          type="number"
          value={local.totalExistingEmis}
          onChange={handle}
        />
        <Input
          label="Turnover (Last FY)"
          name="turnoverLastFY"
          type="number"
          value={local.turnoverLastFY}
          onChange={handle}
        />
        <Input
          label="Gross Profit"
          name="grossProfit"
          type="number"
          value={local.grossProfit}
          onChange={handle}
        />
        <Input
          label="Net Profit"
          name="netProfit"
          type="number"
          value={local.netProfit}
          onChange={handle}
        />
      </div>
      <div className="mt-6 flex justify-between">
        <button className="btn" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

const StepShg = ({ data, updateForm, onNext, onBack }) => {
  const [local, setLocal] = useState({});
  useEffect(() => {
    setLocal({
      shgGroupName: data.shgGroupName || "",
      shgGroupAddress: data.shgGroupAddress || "",
      nrlmCode: data.nrlmCode || "",
      noOfMembers: data.noOfMembers || "",
      dateOfFormation: data.dateOfFormation || "",
      shgSbAccount: data.shgSbAccount || "",
      shgCcAccount: data.shgCcAccount || "",
      dateOfFirstLending: data.dateOfFirstLending || "",
      dateOfSecondLending: data.dateOfSecondLending || "",
      currentLimit: data.currentLimit || "",
      currentGrading: data.currentGrading || "",
    });
  }, [data]);

  const handle = (e) => {
    const { name, value } = e.target;
    setLocal((p) => {
      const next = { ...p, [name]: value };
      updateForm(next);
      return next;
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">SHG Group Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="SHG Name"
          name="shgGroupName"
          value={local.shgGroupName}
          onChange={handle}
        />
        <Input
          label="SHG Address"
          name="shgGroupAddress"
          value={local.shgGroupAddress}
          onChange={handle}
        />
        <Input
          label="NRLM Code"
          name="nrlmCode"
          value={local.nrlmCode}
          onChange={handle}
        />
        <Input
          label="Number of Members"
          name="noOfMembers"
          type="number"
          value={local.noOfMembers}
          onChange={handle}
        />
        <Input
          label="Date of Formation"
          name="dateOfFormation"
          type="date"
          value={local.dateOfFormation}
          onChange={handle}
        />
        <Input
          label="SHG SB Account"
          name="shgSbAccount"
          type="number"
          value={local.shgSbAccount}
          onChange={handle}
        />
        <Input
          label="SHG CC Account"
          name="shgCcAccount"
          type="number"
          value={local.shgCcAccount}
          onChange={handle}
        />
        <Input
          label="Date of First Lending"
          name="dateOfFirstLending"
          type="date"
          value={local.dateOfFirstLending}
          onChange={handle}
        />
        <Input
          label="Date of Second Lending"
          name="dateOfSecondLending"
          type="date"
          value={local.dateOfSecondLending}
          onChange={handle}
        />
        <Input
          label="Current CC Limit"
          name="currentLimit"
          type="number"
          value={local.currentLimit}
          onChange={handle}
        />
        <Select
          label="Current Grading"
          name="currentGrading"
          value={local.currentGrading}
          onChange={handle}
          options={[
            "1st Grading",
            "2nd Grading",
            "3rd Grading",
            "4th Grading",
            "5th Grading",
          ]}
        />
      </div>
      <div className="mt-6 flex justify-between">
        <button className="btn" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

const StepLoan = ({ data, updateForm, onBack, onSubmit }) => {
  // Keep a small local copy for immediate fields but sync on every change
  const [local, setLocal] = useState({
    lapsReffNo: data.lapsReffNo || "",
    applicationDate: data.applicationDate || "",
    loanAmount: data.loanAmount || "",
    loanPurpose: data.loanPurpose || "",
    tenureMonths: data.tenureMonths || "",
    currentRepoRate: data.currentRepoRate || "",
    sanctionDate: data.sanctionDate || "",
  });

  useEffect(() => {
    setLocal({
      lapsReffNo: data.lapsReffNo || "",
      applicationDate: data.applicationDate || "",
      loanAmount: data.loanAmount || "",
      loanPurpose: data.loanPurpose || "",
      tenureMonths: data.tenureMonths || "",
      currentRepoRate: data.currentRepoRate || "",
      sanctionDate: data.sanctionDate || "",
    });
  }, [data]);

  const handle = (e) => {
    const { name, value } = e.target;
    setLocal((p) => {
      const next = { ...p, [name]: value };
      updateForm({ [name]: value });
      return next;
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Loan Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="LAPS Reff No."
          name="lapsReffNo"
          type="number"
          value={local.lapsReffNo}
          onChange={handle}
        />
        <Input
          label="Loan Amount"
          name="loanAmount"
          type="number"
          value={local.loanAmount}
          onChange={handle}
        />
        <Input
          label="Tenure (Months)"
          name="tenureMonths"
          type="number"
          value={local.tenureMonths}
          onChange={handle}
        />
        <Input
          label="Loan Purpose"
          name="loanPurpose"
          value={local.loanPurpose}
          onChange={handle}
        />
        <Input
          label="Application Date"
          name="applicationDate"
          type="date"
          value={local.applicationDate}
          onChange={handle}
        />
        <Input
          label="Sanction Date"
          name="sanctionDate"
          type="date"
          value={local.sanctionDate}
          onChange={handle}
        />
        <Input
          label="Repo Rate (%)"
          name="currentRepoRate"
          type="number"
          value={local.currentRepoRate}
          onChange={handle}
        />
      </div>

      <div className="mt-6 flex justify-between">
        <button className="btn" onClick={onBack}>
          Back
        </button>
        <div className="flex gap-2">
          <button className="btn btn-success" onClick={onSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Input & Select Components ---------------- */
const Input = ({ label, name, type = "text", value = "", onChange }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text text-sm">{label}</span>
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="input w-full"
    />
  </div>
);

const Select = ({ label, name, value = "", onChange, options = [] }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text text-sm">{label}</span>
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="select w-full"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
