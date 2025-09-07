import React from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import LoanForm from "../components/LoanForm";
import UserCard from "../components/UserCard";

const AdminPage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(`${backendUrl}/admin/users`);
      return res.data;
    },
  });

  // Mutation to update user status
  const mutation = useMutation({
    mutationFn: async ({ userId, userStatus }) => {
      await axios.put(`${backendUrl}/admin/user/${userId}/status`, {
        userStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateStatus = (userId, userStatus) => {
    mutation.mutate({ userId, userStatus });
  };

  // Calculate cutoff date (7 days ago)
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  // Sort all users by branch name (alphabetical, case-insensitive)
  const sortedUsers = [...users].sort((a, b) =>
    (a.brName || "").localeCompare(b.brName || "", "en", {
      sensitivity: "base",
    })
  );

  // Filter and sort recent users (last 7 days, by lastLogin)
  const recentUsers = users
    .filter((user) => user.lastLogin && new Date(user.lastLogin) >= monthAgo)
    .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-64 gap-3">
      <span className="loading loading-dots loading-lg text-primary"></span>
      <p className="text-lg text-gray-600">Fetching users...</p>
    </div>
  );
  if (isError)
    return <p className="text-center text-red-500">Error fetching users.</p>;

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Repo Rate & Spread Settings */}
      {/* <div className="collapse bg-base-200 rounded-lg shadow">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-lg font-semibold peer-checked:rounded-b-none">
          ⚙ Repo Rate & Spread Settings
        </div>
        <div className="collapse-content bg-base-100 rounded-b-lg">
          <LoanForm />
        </div>
      </div> */}

      {/* Users Logged in Last 30 Days */}
      <div className="collapse bg-base-200 rounded-lg shadow">
        <input type="checkbox" className="peer" />
        <div className="collapse-title text-lg font-semibold peer-checked:rounded-b-none">
          📅 Users Logged in Last 30 Days
        </div>
        <div className="collapse-content bg-base-100 rounded-b-lg overflow-x-auto">
          {recentUsers.length > 0 ? (
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Branch</th>
                  <th>Mobile</th>
                  <th>Last Login</th>
                  <th>Total Logins</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.brName}</td>
                    <td>{user.mobile}</td>
                    
                    <td>{new Date(user.lastLogin).toLocaleString()}</td>
                    <td>{user.totalLogins}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-2">
              No users logged in the last 30 days.
            </p>
          )}
        </div>
      </div>

      {/* All Users Section */}
      <h1 className="text-2xl font-bold text-center">All Users</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedUsers.map((user) => (
          <UserCard key={user._id} user={user} updateStatus={updateStatus} />
        ))}
      </div>

      
    </div>
  );
};

export default AdminPage;
