import { useEffect, useState } from "react";
import api from "./apiClient";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await api.get("/api/auth/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = async (id, role) => {
    try {
      setUpdatingId(id);
      await api.put(`/api/auth/admin/users/${id}/role`, { role });
      loadUsers();
    } catch (err) {
      console.error("Failed to update role", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (id, role) => {
    if (role === "SUPER_ADMIN") {
      alert("SUPER_ADMIN cannot be deleted!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/api/auth/admin/users/${id}`);
      loadUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-xl">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6">Manage Users</h2>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-slate-800 text-left">
          <thead>
            <tr className="bg-slate-700 text-slate-300">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Change Role</th>
              <th className="py-3 px-4">Delete</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b border-slate-700 hover:bg-slate-700/50 transition"
              >
                <td className="py-3 px-4">{u.id}</td>
                <td className="py-3 px-4 capitalize">{u.username}</td>

                <td className="py-3 px-4">
                  <span className="px-3 py-1 rounded bg-slate-900 border border-slate-600 text-cyan-300 font-semibold">
                    {u.role}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <select
                    disabled={updatingId === u.id}
                    onChange={(e) => updateRole(u.id, e.target.value)}
                    value={u.role}
                    className="bg-slate-900 border border-slate-600 text-white px-3 py-1 rounded"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </td>

                <td className="py-3 px-4">
                  <button
                    disabled={u.role === "SUPER_ADMIN"}
                    onClick={() => deleteUser(u.id, u.role)}
                    className={`px-4 py-1 rounded text-white shadow 
                      ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
