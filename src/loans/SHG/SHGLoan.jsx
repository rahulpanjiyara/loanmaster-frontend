import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import MemberInput from "./MemberInput";
import ColumnInput from "./ColumnInput";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";

export default function SHGLoan() {
  //const [htmlContent, setHtmlContent] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Use the environment variable for backend URL
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({}); // non-member fields
  const { user} = useContext(UserContext);
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

  // Update either member or form field based on input name
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Member fields: names like "name.0", "spouse.3", etc.
    const memberFieldMatch = name.match(/^(\w+)\.(\d+)$/);
    if (memberFieldMatch) {
      const field = memberFieldMatch[1]; // e.g. "name"
      const idx = parseInt(memberFieldMatch[2], 10);

      setMembers((prev) => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], [field]: value };
        return updated;
      });
    } else {
      // Other fields in formData
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDelete = (deleteIndex) => {
    setMembers((prev) => prev.filter((_, i) => i !== deleteIndex));
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

  const increaseStep = () => setCurrentStep((prev) => prev + 1);
  const decreaseStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrors([]);
      const dataToSend = {
        user_data: user,
        shg_data: formData,
        members_data: members,
      };
      console.log("Sending data:", dataToSend);
      const res = await axios.post(backendUrl +
        "/loan/shg-booklet",
        dataToSend
      );
      //console.log("Response:", res.data);
      localStorage.setItem("shg_booklet_data", JSON.stringify(dataToSend));
      navigate("/preview", { state: { htmlContent: res.data } });
      if (res.data.errors) {
        setErrors(res.data.errors);
        setValidated(false);
      } else {
        setValidated(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem("shg_booklet_data");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData.shg_data || {});
      setMembers(parsedData.members_data || []);
    }
  }, []);

  return (
    <main className="p-8 max-w-5xl mx-auto ">
      <h2 className="text-center font-semibold text-gray-900 text-3xl mb-8 tracking-wide select-none">
        SHG CASH CREDIT FORM
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

      {(errors.length > 0 || validated) && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-30 p-4">
          <div className="bg-white p-6 rounded-md border border-gray-300 w-full max-w-md">
            {errors.length > 0 ? (
              <>
                <h3 className="text-red-600 font-semibold mb-3">
                  Validation Errors
                </h3>
                <ul className="list-disc list-inside text-red-600 max-h-48 overflow-y-auto space-y-1">
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
            <button
              className="btn btn-sm btn-outline btn-primary mt-6 w-full"
              onClick={() => {
                setErrors([]);
                setValidated(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {currentStep === 1 && (
          <section className="p-6 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-800 select-none">
                STEP 1/3 - SHG Member Details
              </h3>
              <button
                type="button"
                onClick={addMember}
                className="btn btn-sm btn-primary"
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

            <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
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

        {currentStep === 2 && (
          <section className="p-6 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium text-gray-800 mb-6 select-none">
              STEP 2/3 - SHG Group & Address Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  { value: "NNA", label: "SHG CC-NON-NRLM-AGRI" },
                  { value: "SNA", label: "SHG CC-SHAKTI-NRLM-AGRI" },
                  { value: "SNNA", label: "SHG CC-SHAKTI-NON-NRLM-AGRI" },
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

        {currentStep === 3 && (
          <section className="p-6 border border-gray-200 rounded-md">
            <h3 className="text-lg font-medium text-gray-800 mb-6 select-none">
              STEP 3/3 - Bank & Lending Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
              />
              <ColumnInput
                label="MCLR"
                type="number"
                placeholder="MCLR"
                name="mclr"
                value={formData.mclr || ""}
                handleChange={handleChange}
              />
            </div>
          </section>
        )}

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
            <button type="submit" className="btn btn-success px-10">
              Validate
            </button>
          )}
        </div>
      </form>
    </main>
  );
}
