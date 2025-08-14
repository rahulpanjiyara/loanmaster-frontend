import React, { useEffect, useState } from "react";
import axios from "axios";
import { Smartphone, Mail, MapPin, Clock } from "lucide-react";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Use the environment variable for backend URL

  useEffect(() => {
    axios
      .get(backendUrl+"/user/allusers")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err))
      .finally(() => {
      setLoading(false); // stop loading no matter what
    });
    
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-primary">All Users</h1>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-1 cursor-pointer border border-base-300"
          >
            <div className="card-body">
              {/* Name & Status */}
              <div className="flex justify-between items-center">
                <h2 className="card-title">{user.name}</h2>
                <div
                  className={`badge ${
                    user.userStatus === "active"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {user.userStatus}
                </div>
              </div>

              {/* Mobile */}
              <div className="flex items-center gap-2 text-sm">
                <Smartphone size={16} className="text-primary" />
                {user.mobile || "N/A"}
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-secondary" />
                {user.email || "N/A"}
              </div>

              {/* Branch */}
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-accent" />
                {user.brName || "N/A"}
              </div>

              {/* Last Login */}
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-warning" />
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString("en-IN")
                  : "Never"}
              </div>

              {/* Total Logins */}
              <div className="badge badge-outline badge-primary mt-2">
                Total Logins: {user.totalLogins || 0}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
