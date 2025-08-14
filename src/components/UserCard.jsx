import React, { useState } from "react";
import { Smartphone, Clock, UserCheck, UserX } from "lucide-react";
import { formatIndianDate } from "../utils/formatDate";

const UserCard = ({ user, updateStatus }) => {
  const [status, setStatus] = useState(user.userStatus);

  const handleToggleStatus = () => {
    const newStatus = status === "active" ? "inactive" : "active";
    setStatus(newStatus);
    updateStatus(user._id, newStatus);
  };

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300 rounded-xl overflow-hidden cursor-pointer">
      {/* Header with Name & Status */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 flex justify-between items-center">
        <h2 className="font-semibold text-lg truncate">{user.name}</h2>
        <button
          onClick={handleToggleStatus}
          className={`badge gap-1 px-3 py-1 transition-transform hover:scale-110 ${
            status === "active" ? "badge-success" : "badge-error"
          }`}
        >
          {status === "active" ? (
            <UserCheck size={16} />
          ) : (
            <UserX size={16} />
          )}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      </div>

      {/* Card Body */}
      <div className="card-body space-y-3">
        {/* Branch */}
        <p className="text-sm text-gray-500">
          <span className="font-medium">Branch:</span> {user.brName}
        </p>

        {/* Mobile */}
        <div className="flex items-center gap-2 text-sm">
          <Smartphone size={16} className="text-primary" />
          <span className="font-medium">Mob:</span> {user.mobile}
        </div>

        {/* Last Login + Total Logins */}
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-secondary" />
            <span>
              <span className="font-medium">Last Login:</span>{" "}
              {formatIndianDate(user.lastLogin)  || "N/A"}
            </span>
          </div>
          <span className="badge badge-outline badge-primary w-fit">
            Total Logins: {user.totalLogins ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
