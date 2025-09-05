import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Smartphone, MapPin, Clock } from "lucide-react";
import { formatIndianDate } from "../utils/formatDate";

const AllUsers = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // React Query fetch function
  const fetchUsers = async () => {
    const res = await axios.get(`${backendUrl}/user/allusers`);
    return res.data;
  };

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allUsers"], // cache key
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes for faster repeated loads
  });

    // Sort all users by branch name (alphabetical, case-insensitive)
  const sortedUsers = [...users].sort((a, b) =>
    (a.brName || "").localeCompare(b.brName || "", "en", {
      sensitivity: "base",
    })
  );

  if (isLoading) {
     return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">All Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="card bg-base-100 shadow-xl border border-base-300 animate-pulse"
          >
            <div className="card-body space-y-3">
              <div className="h-6 w-1/2 bg-base-300 rounded"></div>
              <div className="h-4 w-1/3 bg-base-300 rounded"></div>
              <div className="h-4 w-2/3 bg-base-300 rounded"></div>
              <div className="h-4 w-1/4 bg-base-300 rounded"></div>
              <div className="h-5 w-1/2 bg-base-300 rounded mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  }

  if (isError) {
    return <p className="text-red-500 text-center">Failed to load users. Try again later.</p>;
  }

  return (
    <div className="p-4">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-primary">All Users</h1>

      {/* User Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedUsers.map((user) => (
          <div
            key={user._id}
            className="card bg-base-100 shadow-xl border border-base-300 cursor-pointer"
          >
            <div className="card-body">
              {/* Name & Status */}
              <div className="flex justify-between items-center">
                <h2 className="card-title">{user.name}</h2>
                <div
                  className={`badge ${
                    user.userStatus === "active" ? "badge-success" : "badge-error"
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
