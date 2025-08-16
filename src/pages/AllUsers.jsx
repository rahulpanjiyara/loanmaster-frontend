import React, { useEffect, useState } from "react";
import axios from "axios";
import { Smartphone, Mail, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { formatIndianDate } from "../utils/formatDate";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios
      .get(`${backendUrl}/user/allusers`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-primary">All Users</h1>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? // Show skeleton loaders while loading
            Array.from({ length: users.length || 12 }).map((_, idx) => (
              <div
                key={idx}
                className="card bg-base-200 shadow animate-pulse h-48"
              >
                <div className="card-body space-y-3">
                  <div className="h-5 bg-base-300 rounded w-2/3"></div>
                  <div className="h-4 bg-base-300 rounded w-1/2"></div>
                  <div className="h-4 bg-base-300 rounded w-1/3"></div>
                  <div className="h-4 bg-base-300 rounded w-1/4"></div>
                </div>
              </div>
            ))
          : // Show users with fade-in animation
            users.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
                    <span className="font-medium">Last Login:</span>{" "}
                    {formatIndianDate(user.lastLogin) || "Never"}
                  </div>

                  {/* Total Logins */}
                  <div className="badge badge-outline badge-primary mt-2">
                    Total Logins: {user.totalLogins || 0}
                  </div>
                </div>
              </motion.div>
            ))}
      </div>
    </div>
  );
};

export default AllUsers;
