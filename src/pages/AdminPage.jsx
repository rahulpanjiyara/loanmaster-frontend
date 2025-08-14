import React, { useEffect, useState } from "react";
import axios from "axios";

import LoanForm from "../components/LoanForm";
import UserCard from "../components/UserCard";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Use the environment variable for backend URL

  const fetchUsers = async () => {
    try {
      const res = await axios.get(backendUrl+"/admin/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateStatus = async (userId, userStatus) => {
    try {
      await axios.put(backendUrl+`/admin/user/${userId}/status`, {
        userStatus,
      });
      fetchUsers(); // Refresh after update
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto">
      {/* Toggle for Repo Rate & Spread */}
      <div className="collapse bg-base-200 rounded-lg shadow">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-lg font-semibold peer-checked:rounded-b-none">
          ⚙ Repo Rate & Spread Settings
        </div>
        <div className="collapse-content bg-base-100 rounded-b-lg">
          <LoanForm />
        </div>
      </div>

      {/* User List */}
      <h1 className="text-2xl font-bold text-center">All Users</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.length > 0 ? (
          users.map((user) => (
            <UserCard key={user._id} user={user} updateStatus={updateStatus} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
