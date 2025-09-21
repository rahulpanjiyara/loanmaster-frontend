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
  const [loading, setLoading] = useState(false);
  // Add state for error modal

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  // Load saved data from localStorage
  const savedData =
    JSON.parse(localStorage.getItem("sakhi_booklet_data")) || {};

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(savedData?.sakhi_data || {});
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
    contactNo: "Mobile No.",
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
    landValue: "Value of Land",
    buildingValue: "Value of Building",
    plantMachineryFurniture: "Plant, Machinery & Furniture (Value)",
    currentStock: "Current Stock (Value)",
    debtors: "Debtors (Value)",
    lastYearSales: "Last Year Sales",
    lastYearGrossProfit: "Last Year Gross Profit",
    lastYearNetProfit: "Last Year Net Profit",
    lastYearCapital: "Last Year Capital",
    shgGroupName: "SHG/Group Name",
    shgGroupAddress: "SHG/Group Address",
    nrlmCode: "NRLM Code",
    noOfMembers: "No. of Members",
    dateOfFormation: "Date of Formation",
    shgSbAccount: "SHG SB Account",
    shgCcAccount: "SHG CC Account",
    dateOfFirstLending: "Date of First Lending",
    dateOfSecondLending: "Date of Second Lending",
    currentLimit: "Current CC Limit of SHG",
    currentGrading: "Current Grading of SHG",
    loanScheme: "Loan Scheme",
    applicationDate: "Application Date",
    loanAmount: "Loan Amount",
    loanPurpose: "Loan Purpose",
    tenureMonths: "Tenure (Months)",
    repoMclr: "Repo/MCLR Rate",
    sanctionDate: "Sanction Date",
    unitVisitDate: "Unit Visit Date",
    cif: "CIF",
    neighbour: "Neighbour",
  };

  const handleSubmit = async () => {
    const finalFormData = { ...formData };

    // Define sections and their fields
    const sections = {
      "Borrower's Profile": [
        "customerName",
        "spouseFather",
        "villageCityResidence",
        "po",
        "ps",
        "district",
        "state",
        "pin",
        "dob",
        "qualification",
        //"email",
        "contactNo",
        "aadhar",
        "udyamRegnNo",
        "pan",
        "cibilScore",
        "customerSince",
        "sbAccount",
        "cif",
        "neighbour",
      ],
      "Business Details": [
        "constitution",
        "firmName",
        "activity",
        "establishedOn",
        "tradeLicenseNo",
        "registeredUnder",
        "experienceYears",
        "villageCityBusiness",
        "poBusiness",
        "noOfEmployees",
        "premisesOccupancy",
      ],
      "Financial Details": [
        "cashAndBankBalance",
        "lipGoldNscOtherInvestment",
        "landValue",
        "buildingValue",
        "plantMachineryFurniture",
        "currentStock",
        "debtors",
        "lastYearSales",
        "lastYearGrossProfit",
        "lastYearNetProfit",
        "lastYearCapital",
      ],
      "SHG Group Details": [
        "shgGroupName",
        "shgGroupAddress",
        "nrlmCode",
        "noOfMembers",
        "dateOfFormation",
        "shgSbAccount",
        "shgCcAccount",
        "dateOfFirstLending",
        "dateOfSecondLending",
        "currentLimit",
        "currentGrading",
      ],
      "Loan Details": [
        "loanScheme",
        "applicationDate",
        "loanAmount",
        "loanPurpose",
        "articles",
        "articlesPrice",
        "tenureMonths",
        "repoMclr",
        "sanctionDate",
        "unitVisitDate",
      ],
    };

    const errorsBySection = {};

    // Check empty fields
    for (const [section, fields] of Object.entries(sections)) {
      const missing = fields.filter(
        (key) =>
          !finalFormData[key] || finalFormData[key].toString().trim() === ""
      );
      if (missing.length > 0) {
        errorsBySection[section] = missing.map((k) => fieldLabels[k]);
      }
    }

    // Custom rules
    if (finalFormData.tenureMonths && Number(finalFormData.tenureMonths) < 13) {
      errorsBySection["Loan Details"] = errorsBySection["Loan Details"] || [];
      errorsBySection["Loan Details"].push(
        "Tenure (Months) should be greater than 12"
      );
    }

    const appDate = finalFormData.applicationDate
      ? new Date(finalFormData.applicationDate)
      : null;
    const sanctionDate = finalFormData.sanctionDate
      ? new Date(finalFormData.sanctionDate)
      : null;
    if (appDate && sanctionDate && appDate > sanctionDate) {
      errorsBySection["Loan Details"] = errorsBySection["Loan Details"] || [];
      errorsBySection["Loan Details"].push(
        "Sanction Date should not be before Application Date"
      );
    }

    // Invalid date check
    for (let key of [
      "dob",
      "customerSince",
      "establishedOn",
      "dateOfFormation",
      "dateOfFirstLending",
      "dateOfSecondLending",
      "applicationDate",
      "sanctionDate",
      "unitVisitDate",
    ]) {
      if (finalFormData[key] && isNaN(new Date(finalFormData[key]).getTime())) {
        const section = Object.keys(sections).find((s) =>
          sections[s].includes(key)
        );
        errorsBySection[section] = errorsBySection[section] || [];
        errorsBySection[section].push(
          `${fieldLabels[key]} is not a valid date`
        );
      }
    }

    const hasErrors = Object.keys(errorsBySection).length > 0;
    if (hasErrors) {
      // Flatten errors for modal but keep section info
      const formattedErrors = [];
      for (const [section, errs] of Object.entries(errorsBySection)) {
        errs.forEach((e) => formattedErrors.push(`${section}: ${e}`));
      }
      setMissingFields(formattedErrors);
      setShowErrorModal(true);
      return;
    }

    try {
      setLoading(true);
      const dataToSend = { user_data: user, sakhi_data: finalFormData };
      const res = await axios.post(
        `${backendUrl}/loan/sakhi-booklet`,
        dataToSend
      );
      navigate("/preview", { state: { htmlContent: res.data } });
    } catch (err) {
      console.error(err);
      toast.error("Error submitting data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Persist to localStorage whenever data changes ---
  useEffect(() => {
    const dataToSave = {
      user_data: user,
      sakhi_data: formData,
    };
    localStorage.setItem("sakhi_booklet_data", JSON.stringify(dataToSave));
  }, [user, formData]);

  // --- Clear form ---
  const handleClear = () => {
    setShowResetModal(true); // ✅ Open modal instead of confirm
  };

  const confirmClear = () => {
    localStorage.removeItem("sakhi_booklet_data");
    setFormData({});
    setShowResetModal(false);
  };

  const handleJSONUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        if (typeof json === "object" && json !== null) {
          setFormData(json);
          //alert("Form data loaded from JSON!");
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
          IND MSME SAKHI & IND LAKHPATI DIDI
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
          <button
            className="btn btn-xs join-item rounded-r-sm"
            onClick={handleClear}
          >
            Reset Form
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
              loading={loading} // Pass loading state to disable submit button
            />
          )}
        </div>
      </div>
      {/* ✅ Error Modal */}
      {showErrorModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Missing Fields</h3>
            <p className="py-2">Please fill all required fields:</p>
            <ol className="list-decimal list-inside space-y-1">
              {missingFields.map((field, idx) => (
                <li key={idx}>{field}</li>
              ))}
            </ol>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowErrorModal(false)}>
                OK
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* ✅ Reset Confirmation Modal */}
      {showResetModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Reset</h3>
            <p className="py-4">Are you sure you want to clear the form?</p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={confirmClear}>
                Yes, Clear
              </button>
              <button className="btn" onClick={() => setShowResetModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default SAKHILoan;

/* ---------------- Step Components ---------------- */

const StepBorrower = ({ data, updateForm, onNext }) => {
  const [local, setLocal] = useState({});
  const [legalHeirs, setLegalHeirs] = useState([
    { name: "", age: "", relation: "", occupation: "" },
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
      sbAccount: data.sbAccount || "",
      cif: data.cif || "",
      neighbour: data.neighbour || "",
    });

    if (Array.isArray(data.legalHeirs) && data.legalHeirs.length) {
      setLegalHeirs(data.legalHeirs);
    } else {
      setLegalHeirs([{ name: "", age: "", relation: "", occupation: "" }]);
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
    const updated = [
      ...legalHeirs,
      { name: "", age: "", relation: "", occupation: "" },
    ];
    setLegalHeirs(updated);
    updateForm({ legalHeirs: updated });
  };

  const removeHeir = (idx) => {
    const updated = legalHeirs.filter((_, i) => i !== idx);
    setLegalHeirs(
      updated.length
        ? updated
        : [{ name: "", age: "", relation: "", occupation: "" }]
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
          ["Aadhar No.", "aadhar", "text"],
          ["UDHYAM Regn. No.", "udyamRegnNo", "text"],
          ["PAN", "pan", "text"],
          ["CIBIL Score", "cibilScore", "number"],
          ["Customer Since", "customerSince", "date"],
          ["SB Account", "sbAccount", "number"],
          ["CIF", "cif", "number"],
          ["Neighbour Name", "neighbour", "text"],
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
            className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 relative"
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
            <Input
              label="Occupation"
              name={`heir_occupation_${idx}`}
              value={heir.occupation}
              onChange={(e) =>
                handleHeirChange(idx, "occupation", e.target.value)
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
  const [existingLoans, setExistingLoans] = useState([
    {
      loanType: "",
      financier: "",
      bank: "",
      branch: "",
      limit: "",
      outstanding: "",
      emi: "",
    },
  ]);

  useEffect(() => {
    setLocal({
      cashAndBankBalance: data.cashAndBankBalance || "",
      lipGoldNscOtherInvestment: data.lipGoldNscOtherInvestment || "",
      landValue: data.landValue || "",
      buildingValue: data.buildingValue || "",
      plantMachineryFurniture: data.plantMachineryFurniture || "",
      currentStock: data.currentStock || "",
      debtors: data.debtors || "",
      lastYearSales: data.lastYearSales || "",
      lastYearGrossProfit: data.lastYearGrossProfit || "",
      lastYearNetProfit: data.lastYearNetProfit || "",
      lastYearCapital: data.lastYearCapital || "",
    });

    if (Array.isArray(data.existingLoans) && data.existingLoans.length) {
      setExistingLoans(data.existingLoans);
    }
  }, [data]);

  const handle = (e) => {
    const { name, value } = e.target;
    setLocal((p) => {
      const next = { ...p, [name]: value };
      updateForm(next);
      return next;
    });
  };

  // --- Existing Loans Handlers ---
  const handleLoanChange = (index, field, value) => {
    const updated = [...existingLoans];
    updated[index] = { ...updated[index], [field]: value };
    setExistingLoans(updated);
    updateForm({ existingLoans: updated });
  };

  const addLoan = () => {
    const updated = [
      ...existingLoans,
      {
        loanType: "",
        bank: "",
        branch: "",
        limit: "",
        outstanding: "",
        emi: "",
      },
    ];
    setExistingLoans(updated);
    updateForm({ existingLoans: updated });
  };

  const removeLoan = (idx) => {
    const updated = existingLoans.filter((_, i) => i !== idx);
    setExistingLoans(
      updated.length
        ? updated
        : [
            {
              loanType: "",
              bank: "",
              branch: "",
              limit: "",
              outstanding: "",
              emi: "",
            },
          ]
    );
    updateForm({ existingLoans: updated });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Financial Details</h2>

      {/* Fixed fields */}
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
          name="landValue"
          type="number"
          value={local.landValue}
          onChange={handle}
        />
        <Input
          label="Value of Building"
          name="buildingValue"
          type="number"
          value={local.buildingValue}
          onChange={handle}
        />
        <Input
          label="Plant/Machinery/Furniture (Value)"
          name="plantMachineryFurniture"
          type="number"
          value={local.plantMachineryFurniture}
          onChange={handle}
        />
        <Input
          label="Current Stock (Value)"
          name="currentStock"
          type="number"
          value={local.currentStock}
          onChange={handle}
        />
        <Input
          label="Book-debts (Value)"
          name="debtors"
          type="number"
          value={local.debtors}
          onChange={handle}
        />

        <Input
          label="Last Year Sales"
          name="lastYearSales"
          type="number"
          value={local.lastYearSales}
          onChange={handle}
        />
        <Input
          label="Last Year Gross Profit"
          name="lastYearGrossProfit"
          type="number"
          value={local.lastYearGrossProfit}
          onChange={handle}
        />

        <Input
          label="Last Year Net Profit"
          name="lastYearNetProfit"
          type="number"
          value={local.lastYearNetProfit}
          onChange={handle}
        />
        <Input
          label="Last Year Capital"
          name="lastYearCapital"
          type="number"
          value={local.lastYearCapital}
          onChange={handle}
        />
      </div>

      {/* Existing Loan Details Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Existing Loans</h3>
        {existingLoans.map((loan, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-2 relative"
          >
            <Select
              label="Financier"
              value={loan.financier}
              options={[
                "Indian Bank",
                "Other Bank",
                "Other financial institution",
              ]}
              onChange={(e) =>
                handleLoanChange(idx, "financier", e.target.value)
              }
            />
            <Select
              label="Loan Type"
              value={loan.loanType}
              options={[
                "Consumer Loan",
                "Gold Loan",
                "Loan Against Deposit",
                "Vehicle Loan",
                "Personl Loan",
                "KCC",
                "Cash Credit",
                "Term Loan",
                "Others",
              ]}
              onChange={(e) =>
                handleLoanChange(idx, "loanType", e.target.value)
              }
            />

            <Input
              label="Bank Name"
              value={loan.bank}
              onChange={(e) => handleLoanChange(idx, "bank", e.target.value)}
            />
            <Input
              label="Branch Name"
              value={loan.branch}
              onChange={(e) => handleLoanChange(idx, "branch", e.target.value)}
            />
            <Input
              label="Limit (Rs.)"
              type="number"
              value={loan.limit}
              onChange={(e) => handleLoanChange(idx, "limit", e.target.value)}
            />
            <Input
              label="Outstanding (Rs.)"
              type="number"
              value={loan.outstanding}
              onChange={(e) =>
                handleLoanChange(idx, "outstanding", e.target.value)
              }
            />
            <Input
              label="EMI (Rs.)"
              type="number"
              value={loan.emi}
              onChange={(e) => handleLoanChange(idx, "emi", e.target.value)}
            />

            {existingLoans.length > 1 && (
              <Trash2
                size={18}
                className="absolute top-2 right-2 text-red-500 cursor-pointer"
                onClick={() => removeLoan(idx)}
                title="Delete Loan"
              />
            )}
          </div>
        ))}
        <button className="btn btn-outline btn-sm mt-2" onClick={addLoan}>
          + Add Loan
        </button>
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

const StepLoan = ({ data, updateForm, onBack, onSubmit, loading }) => {
  // Keep a small local copy for immediate fields but sync on every change
  const [local, setLocal] = useState({
    loanScheme: data.loanScheme || "",
    applicationDate: data.applicationDate || "",
    loanAmount: data.loanAmount || "",
    loanPurpose: data.loanPurpose || "",
    articles: data.articles || "",
    articlesPrice: data.articlesPrice || "",
    tenureMonths: data.tenureMonths || "",
    repoMclr: data.repoMclr || "",
    sanctionDate: data.sanctionDate || "",
    unitVisitDate: data.unitVisitDate || "",
  });
  const [showOtherModal, setShowOtherModal] = useState(false);
  const [otherPurpose, setOtherPurpose] = useState("");

  // ✅ Loan Purpose options mapping
  const loanPurposeOptions = {
    "IND-LAKHPATI-DIDI": [
      "Creation of Live Stocks",
      "Purchase of Farm Machinery",
      "Fisheries Development",
      "Horticulture Development",
      "Floriculture Development",
      "Apiculture Development",
      "Others",
      
    ],
    "IND-MSME-SAKHI": [
      "Stock Creation",
      "Purchase of Machinery",
      "Purchase of Commercial Vehicle",
      "Purchase of Stocks & Machinery",
      "Others",
      
    ],
  };

  useEffect(() => {
    setLocal({
      loanScheme: data.loanScheme || "",
      applicationDate: data.applicationDate || "",
      loanAmount: data.loanAmount || "",
      loanPurpose: data.loanPurpose || "",
      articles: data.articles || "",
      articlesPrice: data.articlesPrice || "",
      tenureMonths: data.tenureMonths || "",
      repoMclr: data.repoMclr || "",
      sanctionDate: data.sanctionDate || "",
      unitVisitDate: data.unitVisitDate || "",
    });
  }, [data]);

  

  const handle = (e) => {
    const { name, value } = e.target;

     // ✅ If user selects "Others"
    if (name === "loanPurpose" && value === "Others") {
      setShowOtherModal(true);
      return;
    }
    setLocal((p) => {
      const next = { ...p, [name]: value };
      updateForm({ [name]: value });
      return next;
    });
  };

  const handleOtherSubmit = () => {
    setLocal((p) => {
      const next = { ...p, loanPurpose: otherPurpose };
      updateForm(next);
      return next;
    });
    setShowOtherModal(false);
  };

  // ✅ Purposes as per scheme
  const currentPurposes = loanPurposeOptions[local.loanScheme] || ["Others"];

  // Merge typed custom value if it’s not in the list
  const purposeOptions = [
    ...currentPurposes,
    ...(local.loanPurpose &&
    !currentPurposes.includes(local.loanPurpose)
      ? [local.loanPurpose]
      : []),
  ];

  

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Loan Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select
          label="Loan Scheme"
          name="loanScheme"
          type="text"
          options={["IND-MSME-SAKHI", "IND-LAKHPATI-DIDI",]}
          value={local.loanScheme}
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
        <Select
          label="Loan Purpose"
          name="loanPurpose"
          value={local.loanPurpose}
          onChange={handle}
          options={purposeOptions}
        />
        <Input
          type="text"
          label="Articles to be purchased"
          name="articles"
          value={local.articles}
          onChange={handle}
        />
        <Input
          type="text"
          label="Price of Articles"
          name="articlesPrice"
          value={local.articlesPrice}
          onChange={handle}
          placeholder={
            local.loanAmount
              ? Math.ceil((local.loanAmount * 10) / 9 / 1000) * 1000
              : ""
          }
        />
        <Input
          label="Application Date"
          name="applicationDate"
          type="date"
          value={local.applicationDate}
          onChange={handle}
        />
        <Input
          label="Unit Visit Date"
          name="unitVisitDate"
          type="date"
          value={local.unitVisitDate}
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
          label={
            local.loanScheme === "IND-LAKHPATI-DIDI"
              ? "MCLR (%)"
              : "Repo Rate (%)"
          }
          name="repoMclr"
          type="number"
          value={local.repoMclr}
          onChange={handle}
        />
      </div>

      <div className="mt-6 flex justify-between">
        <button className="btn" onClick={onBack}>
          Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={onSubmit}
            className="btn btn-success px-10"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loader mr-2"></span> Generating...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
       {/* ✅ Other Purpose Modal */}
      {showOtherModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Specify Loan Purpose</h3>
            <input
              type="text"
              className="input input-bordered w-full mt-2"
              placeholder="Enter loan purpose"
              value={otherPurpose}
              onChange={(e) => setOtherPurpose(e.target.value)}
            />
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={handleOtherSubmit}
                disabled={!otherPurpose.trim()}
              >
                Save
              </button>
              <button
                className="btn"
                onClick={() => {
                  setShowOtherModal(false);
                  setOtherPurpose("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
    
  );
};

/* ---------------- Input & Select Components ---------------- */
const Input = ({
  label,
  name,
  type = "text",
  value = "",
  placeholder,
  onChange,
}) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text text-sm">{label}</span>
    </label>
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
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
