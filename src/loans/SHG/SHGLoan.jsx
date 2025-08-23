import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import MemberInput from "./MemberInput";
import ColumnInput from "./ColumnInput";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";

export default function SHGLoan() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const backendUrl = import.meta.env.VITE_BACKEND_URL; // env-based backend
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { user } = useContext(UserContext);
  const [members, setMembers] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      role:
        i === 0
          ? "President"
          : i === 1
          ? "Secretary"
          : i === 2
          ? "Treasurer"
          : `Member ${i + 1}`,
      name: "",
      spouse: "",
      dob: "",
      aadhar: "",
      mobile: "",
      maritalstatus: "",
      category: "",
      sbaccount: "",
    }))
  );
  const [errors, setErrors] = useState([]);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  // ---- change handlers ----
  const handleChange = (e) => {
    const { name, value } = e.target;
    const memberFieldMatch = name.match(/^(\w+)\.(\d+)$/);
    if (memberFieldMatch) {
      const field = memberFieldMatch[1];
      const idx = parseInt(memberFieldMatch[2], 10);
      setMembers((prev) => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], [field]: value };
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDelete = (deleteIndex) => {
    setMembers((prev) => {
      const filtered = prev.filter((_, i) => i !== deleteIndex);

      // Reassign roles after deletion
      return filtered.map((m, i) => ({
        ...m,
        role:
          i === 0
            ? "President"
            : i === 1
            ? "Secretary"
            : i === 2
            ? "Treasurer"
            : `Member ${i + 1}`,
      }));
    });

    toast.error("Member deleted");
  };

  const addMember = () => {
    setMembers((prev) => {
      if (prev.length < 20) {
        return [
          ...prev,
          {
            role: `Member ${prev.length + 1}`,
            name: "",
            spouse: "",
            dob: "",
            aadhar: "",
            mobile: "",
            maritalstatus: "",
            category: "",
            sbaccount: "",
          },
        ];
      }
      return prev;
    });
    toast.success("A new member added");
  };

  // ---- helpers ----
  const onlyDigits = (v) => /^\d+$/.test(String(v || "").trim());
  const toInt = (v) => {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? null : n;
  };
  const startOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const isFutureDate = (yyyy_mm_dd) => {
    if (!yyyy_mm_dd) return false;
    const d = startOfDay(yyyy_mm_dd);
    const today = startOfDay(new Date());
    return d.getTime() > today.getTime();
  };
  const daysFromToday = (yyyy_mm_dd) => {
    if (!yyyy_mm_dd) return null;
    const d = startOfDay(yyyy_mm_dd);
    const today = startOfDay(new Date());
    const diffMs = d.getTime() - today.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  };

  const labelMap = {
    shgname: "Name of SHG",
    gradingmarks: "Grading Marks",
    shgdof: "Date of Formation",
    noofmembers: "No. of Members",
    villtown: "Village/Town",
    po: "Post Office",
    ps: "Police Station",
    gpward: "Gram Panchayat/Ward No.",
    blockmunicipality: "Block/Municipality",
    district: "District",
    state: "State",
    pin: "PIN",
    shgcategory: "SHG Category",
    shglocation: "SHG Location",
    shgsbaccount: "SB Account No.",
    sbopeningdate: "SB Opening Date",
    sbbalance: "SB Balance",
    dateoffirstlending: "Date of First Lending",
    ccaccount: "CC Account No.",
    ccoutstanding: "CC Outstanding",
    lastsanctiondate: "Last Sanction Date",
    lastsanctionlimit: "Last Sanction Limit",
    appliedlimit: "Applied Limit",
    grading: "Grading",
    applicationdate: "Application Date",
    sanctiondate: "Sanction Date",
    reporate: "Repo Rate",
    mclr: "MCLR",
  };

  // ---- validation (step-wise aware) ----
  const validateForm = (step = 3) => {
    const newErrors = [];
    const isFirstGrading = (formData.grading || "").trim() === "1st Grading";

    // STEP 1: Members
    if (step >= 1) {
      members.forEach((m, idx) => {
        if (!m.name?.trim())
          newErrors.push(`Member ${idx + 1}: Name is required`);
        if (!m.spouse?.trim())
          newErrors.push(`Member ${idx + 1}: Spouse name is required`);
        if (!m.dob)
          newErrors.push(`Member ${idx + 1}: Date of birth is required`);
        if (m.dob && isFutureDate(m.dob))
          newErrors.push(
            `Member ${idx + 1}: Date of birth can't be in the future`
          );
        if (
          !m.aadhar ||
          !onlyDigits(m.aadhar) ||
          String(m.aadhar).length !== 12
        )
          newErrors.push(`Member ${idx + 1}: Aadhaar must be 12 digits`);
        if (!m.mobile || !/^[6-9]\d{9}$/.test(String(m.mobile)))
          newErrors.push(
            `Member ${idx + 1}: Mobile must be a valid 10-digit Indian number`
          );
        if (!m.maritalstatus?.trim())
          newErrors.push(`Member ${idx + 1}: Marital status is required`);
        if (!m.category?.trim())
          newErrors.push(`Member ${idx + 1}: Category is required`);
        if (
          !m.sbaccount ||
          !onlyDigits(m.sbaccount) ||
          String(m.sbaccount).length < 6
        )
          newErrors.push(
            `Member ${idx + 1}: SB Account must be numeric (min 6 digits)`
          );
      });
    }

    // STEP 2: Group & Address
    if (step >= 2) {
      const step2Fields = [
        "shgname",
        "gradingmarks",
        "shgdof",
        "noofmembers",
        "villtown",
        "po",
        "ps",
        "gpward",
        "blockmunicipality",
        "district",
        "state",
        "pin",
        "shgcategory",
        "shglocation",
      ];
      step2Fields.forEach((f) => {
        if (!formData[f]) newErrors.push(`${labelMap[f]} is required`);
      });

      if (
        formData.pin &&
        (!onlyDigits(formData.pin) || String(formData.pin).length !== 6)
      ) {
        newErrors.push("PIN must be exactly 6 digits");
      }
      if (formData.gradingmarks && toInt(formData.gradingmarks) === null) {
        newErrors.push("Grading Marks must be a number");
      }
      if (formData.noofmembers) {
        const nm = toInt(formData.noofmembers);
        if (nm === null || nm <= 0)
          newErrors.push("No. of Members must be a positive number");
        else if (nm !== members.length)
          newErrors.push(
            `No. of Members (${nm}) must match Members listed (${members.length})`
          );
      }
      if (formData.shgdof && isFutureDate(formData.shgdof)) {
        newErrors.push("Date of Formation can't be in the future");
      }
    }

    // STEP 3: Bank & Lending
    if (step >= 3) {
      const isAgriCategory = (formData.shgcategory || "")
        .toUpperCase()
        .includes("A");

      const alwaysRequired = [
        "shgsbaccount",
        "sbopeningdate",
        "sbbalance",
        "appliedlimit",
        "grading",
        "applicationdate",
        "sanctiondate",
      ];

      if (isAgriCategory) {
        alwaysRequired.push("mclr");
      } else {
        alwaysRequired.push("reporate");
      }

      const notRequiredIfFirst = [
        "dateoffirstlending",
        "ccaccount",
        "ccoutstanding",
        "lastsanctiondate",
        "lastsanctionlimit",
      ];
      const extraRequiredWhenNotFirst = isFirstGrading
        ? []
        : notRequiredIfFirst;

      [...alwaysRequired, ...extraRequiredWhenNotFirst].forEach((f) => {
        if (!formData[f]) newErrors.push(`${labelMap[f]} is required`);
      });

      [
        "shgsbaccount",
        "sbbalance",
        "ccaccount",
        "ccoutstanding",
        "lastsanctionlimit",
        "appliedlimit",
      ].forEach((f) => {
        if (
          formData[f] != null &&
          formData[f] !== "" &&
          !onlyDigits(formData[f])
        ) {
          newErrors.push(`${labelMap[f]} must be numeric`);
        }
      });

      ["reporate", "mclr"].forEach((f) => {
        if (
          formData[f] != null &&
          formData[f] !== "" &&
          isNaN(Number(formData[f]))
        ) {
          newErrors.push(`${labelMap[f]} must be a valid number`);
        }
      });

      const futureForbidden = [
        "sbopeningdate",
        "dateoffirstlending",
        "applicationdate",
        "lastsanctiondate",
      ];
      futureForbidden.forEach((d) => {
        if (formData[d] && isFutureDate(formData[d])) {
          newErrors.push(`${labelMap[d]} can't be in the future`);
        }
      });

      if (formData.sanctiondate) {
        const df = daysFromToday(formData.sanctiondate);
        if (df != null && df > 15) {
          newErrors.push(
            "Sanction Date can't be more than 15 days in the future"
          );
        }
      }

      if (formData.applicationdate && formData.sanctiondate) {
        const app = new Date(formData.applicationdate).getTime();
        const sanc = new Date(formData.sanctiondate).getTime();
        if (sanc < app) {
          newErrors.push("Sanction Date can't be before Application Date");
        }
      }
    }

    return newErrors;
  };

  // ---- step navigation ----
  const increaseStep = () => {
    const stepErrors = validateForm(currentStep);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      setValidated(false);
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };
  const decreaseStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(3);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setValidated(false);
      return;
    }

    setLoading(true);
    setProgress(0);
    setErrors([]);

    const dataToSend = {
      user_data: user,
      shg_data: formData,
      members_data: members,
    };

    // Simulate smooth progress
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval); // stop before complete
          return prev;
        }
        return prev + 5; // increment smoothly
      });
    }, 100);

    try {
      const res = await axios.post(
        `${backendUrl}/loan/shg-booklet`,
        dataToSend
      );

      clearInterval(interval); // stop interval on completion
      setProgress(100); // mark complete

      localStorage.setItem("shg_booklet_data", JSON.stringify(dataToSend));

      if (res.data?.errors?.length) {
        setErrors(res.data.errors);
        setValidated(false);
      } else {
        setValidated(true);
        navigate("/preview", { state: { htmlContent: res.data } });
      }
    } catch (err) {
      console.error(err);
      setErrors(["Something went wrong while submitting. Please try again."]);
    } finally {
      setLoading(false);
      // Reset progress after a short delay for UX
      setTimeout(() => setProgress(0), 500);
    }
  };

  // ---- load saved ----
  useEffect(() => {
    const savedData = localStorage.getItem("shg_booklet_data");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed.shg_data || {});
      setMembers(parsed.members_data || []);
    }
  }, []);

  // --- Clear form ---
  const handleClear = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to clear the form?")) {
      localStorage.removeItem("shg_booklet_data");
      //window.location.reload();
      setFormData({});
      setMembers(
        Array.from({ length: 10 }, (_, i) => ({
          role:
            i === 0
              ? "President"
              : i === 1
              ? "Secretary"
              : i === 2
              ? "Treasurer"
              : `Member ${i + 1}`,
          name: "",
          spouse: "",
          dob: "",
          aadhar: "",
          mobile: "",
          maritalstatus: "",
          category: "",
          sbaccount: "",
        }))
      );

      return;
    }
  };

  return (
    <main className="p-4 max-w-7xl mx-auto">
      <h2 className="text-center font-semibold text-secondary text-xl mb-8 tracking-wide select-none">
        SHG CASH CREDIT
      </h2>

      {/* Progress bar */}
      <div className="mb-10">
        <div className="w-full bg-gray-300 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm font-medium text-gray-700 select-none px-1">
          <span
            className={currentStep === 1 ? "text-primary font-semibold" : ""}
          >
            Step 1
          </span>
          <span
            className={currentStep === 2 ? "text-primary font-semibold" : ""}
          >
            Step 2
          </span>
          <span
            className={currentStep === 3 ? "text-primary font-semibold" : ""}
          >
            Step 3
          </span>
        </div>
      </div>

      {/* Modal */}
      {(errors.length > 0 || validated) && (
        <dialog open className="modal">
          <div className="modal-box">
            {errors.length > 0 ? (
              <>
                <h3 className="font-bold text-lg text-red-600">
                  Validation Errors
                </h3>
                <ul className="list-disc list-inside text-red-600 max-h-60 overflow-y-auto space-y-1 mt-2">
                  {errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </>
            ) : (
              <h4 className="text-green-600 font-semibold text-center">
                All fields validated successfully!
              </h4>
            )}

            <div className="modal-action">
              <button
                className="btn btn-outline btn-primary"
                onClick={() => {
                  setErrors([]);
                  setValidated(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* STEP 1 - Members */}
        {currentStep === 1 && (
          <section className="p-6 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center">
              <h5 className="text-md font-medium text-secondary select-none mb-3">
                STEP 1/3 - SHG Member Details
              </h5>
              <div className="join join-vertical sm:join-horizontal">
                <button
                  type="submit"
                  className="btn btn-xs btn-secondary join-item"
                  onClick={handleClear}
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={addMember}
                  className="btn btn-xs btn-primary  join-item"
                  disabled={members.length >= 20}
                  title={
                    members.length >= 20
                      ? "Maximum 20 members allowed"
                      : "Add Member"
                  }
                >
                  + Add Member
                </button>
              </div>
            </div>

            <div className="space-y-5 max-h-[500px] overflow-y-auto">
              {members.map((member, idx) => (
                <MemberInput
                  key={idx}
                  memberTitle={member.role}
                  name={`name.${idx}`}
                  nameValue={member.name}
                  spouse={`spouse.${idx}`}
                  spouseValue={member.spouse}
                  dob={`dob.${idx}`}
                  dobValue={member.dob}
                  aadhar={`aadhar.${idx}`}
                  aadharValue={member.aadhar}
                  mobile={`mobile.${idx}`}
                  mobileValue={member.mobile}
                  maritalStatus={`maritalstatus.${idx}`}
                  maritalStatusValue={member.maritalstatus}
                  category={`category.${idx}`}
                  categoryValue={member.category}
                  sbAccount={`sbaccount.${idx}`}
                  sbAccountValue={member.sbaccount}
                  handleChange={handleChange}
                  handleDelete={() => handleDelete(idx)}
                  index={idx}
                />
              ))}
            </div>
          </section>
        )}

        {/* STEP 2 - Group & Address */}
        {currentStep === 2 && (
          <section className="p-6 border border-gray-200 rounded-md">
            <h5 className="text-md font-medium text-secondary select-none mb-3 ">
              STEP 2/3 - SHG Group & Address Details
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ColumnInput
                label="Name of SHG"
                type="text"
                placeholder="Name of SHG"
                name="shgname"
                value={formData.shgname || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="Grading Marks"
                type="number"
                placeholder="Grading Marks"
                name="gradingmarks"
                value={formData.gradingmarks || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="Date of Formation"
                type="date"
                placeholder="Date of Formation"
                name="shgdof"
                value={formData.shgdof || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="No. of Members"
                type="number"
                placeholder="No. of Members"
                name="noofmembers"
                value={formData.noofmembers || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="Village/Town"
                type="text"
                placeholder="Village/Town"
                name="villtown"
                value={formData.villtown || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="Post Office"
                type="text"
                placeholder="Post Office"
                name="po"
                value={formData.po || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="Police Station"
                type="text"
                placeholder="Police Station"
                name="ps"
                value={formData.ps || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="Gram Panchayat/Ward No."
                type="text"
                placeholder="Gram Panchayat/Ward No."
                name="gpward"
                value={formData.gpward || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="Block/Municipality"
                type="text"
                placeholder="Block/Municipality"
                name="blockmunicipality"
                value={formData.blockmunicipality || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="District"
                type="text"
                placeholder="District"
                name="district"
                value={formData.district || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="State"
                type="text"
                placeholder="State"
                name="state"
                value={formData.state || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="PIN"
                type="number"
                placeholder="PIN"
                name="pin"
                value={formData.pin || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="SHG Category"
                type="select"
                placeholder="SHG Category"
                name="shgcategory"
                value={formData.shgcategory || ""}
                options={[
                  { value: "NA", label: "SHG CC-NRLM-AGRI" },
                  // { value: "NNA", label: "SHG CC-NON-NRLM-AGRI" },
                  { value: "SNA", label: "SHG CC-SHAKTI-NRLM-AGRI" },
                  // { value: "SNNA", label: "SHG CC-SHAKTI-NON-NRLM-AGRI" },
                  // { value: "NM", label: "SHG CC-NRLM-NON-AGRI" },
                ]}
                handleChange={handleChange}
              />
              <ColumnInput
                label="SHG Location"
                type="select"
                placeholder="SHG Location"
                name="shglocation"
                value={formData.shglocation || ""}
                options={[
                  { value: "rural", label: "Rural" },
                  { value: "urban", label: "Urban" },
                ]}
                handleChange={handleChange}
              />
            </div>
          </section>
        )}

        {/* STEP 3 - Bank & Lending */}
        {currentStep === 3 && (
          <section className="p-6 border border-gray-200 rounded-md">
            <h5 className="text-md font-medium text-secondary  select-none mb-3">
              STEP 3/3 - Bank & Lending Details
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ColumnInput
                label="SB Account No."
                type="number"
                placeholder="SB Account No."
                name="shgsbaccount"
                value={formData.shgsbaccount || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="SB Opening Date"
                type="date"
                placeholder="SB Opening Date"
                name="sbopeningdate"
                value={formData.sbopeningdate || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="SB Balance"
                type="number"
                placeholder="SB Balance"
                name="sbbalance"
                value={formData.sbbalance || ""}
                handleChange={handleChange}
              />

              {/* Conditionally not required if 1st Grading */}
              <ColumnInput
                label="Date of First Lending"
                type="date"
                placeholder="Date of First Lending"
                name="dateoffirstlending"
                value={formData.dateoffirstlending || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="CC Account No."
                type="number"
                placeholder="CC Account No."
                name="ccaccount"
                value={formData.ccaccount || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="CC Outstanding"
                type="number"
                placeholder="CC Outstanding"
                name="ccoutstanding"
                value={formData.ccoutstanding || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="Last Sanction Date"
                type="date"
                placeholder="Last Sanction Date"
                name="lastsanctiondate"
                value={formData.lastsanctiondate || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="Last Sanction Limit"
                type="number"
                placeholder="Last Sanction Limit"
                name="lastsanctionlimit"
                value={formData.lastsanctionlimit || ""}
                handleChange={handleChange}
              />

              <ColumnInput
                label="Applied Limit"
                type="number"
                placeholder="Applied Limit"
                name="appliedlimit"
                value={formData.appliedlimit || ""}
                handleChange={handleChange}
              />

              {/* Grading */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-sm font-medium text-gray-700">
                    Grading
                  </span>
                </label>
                <select
                  name="grading"
                  className="select select-bordered w-full"
                  value={formData.grading || ""}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Grading
                  </option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const num = i + 1;
                    const suffix =
                      num === 1
                        ? "st"
                        : num === 2
                        ? "nd"
                        : num === 3
                        ? "rd"
                        : "th";
                    return (
                      <option key={num} value={`${num}${suffix} Grading`}>
                        {num}
                        {suffix} Grading
                      </option>
                    );
                  })}
                </select>
              </div>

              <ColumnInput
                label="Application Date"
                type="date"
                placeholder="Application Date"
                name="applicationdate"
                value={formData.applicationdate || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="Sanction Date"
                type="date"
                placeholder="Sanction Date"
                name="sanctiondate"
                value={formData.sanctiondate || ""}
                handleChange={handleChange}
              />
              <ColumnInput
                label="Repo Rate"
                type="number"
                placeholder="Repo Rate"
                name="reporate"
                value={formData.reporate || ""}
                handleChange={handleChange}
                disabled={formData.shgcategory !== "NM"}
              />
              <ColumnInput
                label="MCLR"
                type="number"
                placeholder="MCLR"
                name="mclr"
                value={formData.mclr || ""}
                handleChange={handleChange}
                disabled={formData.shgcategory === "NM"}
              />
            </div>
          </section>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-10">
          {currentStep > 1 && (
            <button
              type="button"
              className="btn btn-outline btn-primary px-8"
              onClick={decreaseStep}
            >
              ← Back
            </button>
          )}
          {currentStep < 3 && (
            <button
              type="button"
              className="btn btn-primary px-8"
              onClick={increaseStep}
            >
              Next →
            </button>
          )}
          {currentStep === 3 && (
            <button
              type="submit"
              className="btn btn-success px-10"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2 w-full">
                  <span>Generating...</span>
                  <progress
                    className="progress w-56 progress-primary"
                    value={progress}
                    max="100"
                  ></progress>
                  <span className="ml-2">{progress}%</span>
                </div>
              ) : (
                "Submit"
              )}
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
