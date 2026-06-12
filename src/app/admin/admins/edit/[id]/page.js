"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditAdminPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // ======================
  // STATES
  // ======================
  const [existingUsers, setExistingUsers] = useState([]);
  const [emailExists, setEmailExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  // ======================
  // FETCH LOOKUP SYSTEM DATA
  // ======================
  async function fetchUsers() {
    try {
      const response = await fetch("/api/admins");
      const data = await response.json();
      setExistingUsers(data.admins || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchRoles() {
    try {
      const response = await fetch("/api/roles");
      const data = await response.json();
      setRoles(data.roles || []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  // ======================
  // FETCH TARGET RECORD
  // ======================
  async function fetchAdmin() {
    try {
      const response = await fetch(`/api/admins/${id}`);
      const data = await response.json();

      if (data.success) {
        setFormData({
          name: data.admin.name,
          email: data.admin.email,
          password: data.admin.password,
          role: data.admin.role,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchAdmin();
      fetchUsers();
    }
  }, [id]);

  // ======================
  // MUTATION HANDLING
  // ======================
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`/api/admins/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("User Updated Successfully");
        router.push("/admin/admins");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // ======================
  // LOADING STATE
  // ======================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">
        Loading User...
      </div>
    );
  }

  // ======================
  // UI RENDER
  // ======================
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Edit User</h1>
          <p className="text-gray-500 mt-2">Update user details</p>
        </div>

        {/* Input Identity Structure */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Name *
            </label>
            
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Email Field with Validity Exclusions */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Email *
            </label>
            {emailExists && (
              <p className="text-red-500 text-sm mb-2 font-medium">
                Email already exists
              </p>
            )}
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                const value = e.target.value;
                const exists = existingUsers.some(
                  (item) =>
                    String(item.id) !== String(id) &&
                    item.email?.trim().toLowerCase() ===
                      value.trim().toLowerCase()
                );

                setEmailExists(exists);
                setFormData({
                  ...formData,
                  email: value,
                });
              }}
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Password Field with Validation Guidelines */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Password *
            </label>
            <input
              type="password"
              required
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
              title="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Role Config Dropdown */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Commit Operations Trigger */}
          <button
            disabled={emailExists}
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update User
          </button>
        </form>
      </div>
    </div>
  );
}