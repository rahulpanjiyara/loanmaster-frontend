import React from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import LoanForm from "../components/LoanForm";
import UserCard from "../components/UserCard";

const AdminPage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const queryClient = useQueryClient();

  // Fetch users using React Query
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
      // Refetch users after updating status
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateStatus = (userId, userStatus) => {
    mutation.mutate({ userId, userStatus });
  };

  if (isLoading) return <p className="text-center">Loading users...</p>;
  if (isError) return <p className="text-center text-red-500">Error fetching users.</p>;

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
