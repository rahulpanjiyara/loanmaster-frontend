
export const formatIndianDate = (dateString) => {
    if (!dateString) return "Never logged in";
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // AM/PM format
  };
  return new Date(dateString).toLocaleString("en-IN", options);
};
