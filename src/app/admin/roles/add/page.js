"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddRolePage() {
  const router = useRouter();

  // ======================
  // STATES
  // ======================
  const [formData, setFormData] = useState({
    name: "",
    permissions: {
      products: { create: false, edit: false, delete: false },
      categories: { create: false, edit: false, delete: false },
      cms: { create: false, edit: false, delete: false },
    },
  });

  const [existingRoles, setExistingRoles] = useState([]);
  const [roleExists, setRoleExists] = useState(false);

  // ======================
  // LIFECYCLE
  // ======================
  useEffect(() => {
    fetchRoles();
  }, []);

  // ======================
  // DATA FETCHING
  // ======================
  async function fetchRoles() {
    try {
      const response = await fetch("/api/roles");
      const data = await response.json();
      setExistingRoles(data.roles || []);
    } catch (error) {
      console.log(error);
    }
  }

  // ======================
  // HANDLERS
  // ======================
  function handlePermissionChange(module, action, value) {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [module]: {
          ...formData.permissions[module],
          [action]: value,
        },
      },
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (roleExists) {
      alert("Cannot add role. Role name already exists.");
      return;
    }

    try {
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Role Added Successfully");
      router.push("/admin/roles");
    } catch (error) {
      console.log(error);
      alert("An error occurred while adding the role.");
    }
  }

  // ======================
  // CONFIGURATION
  // ======================
  const modules = ["products", "categories", "cms"];

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Add Role</h1>
          <p className="text-gray-500 mt-2">Create role & assign permissions</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Role Name */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Role Name
            </label>
            {roleExists && (
              <p className="text-red-500 text-sm mt-2">Role already exists</p>
            )}
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => {
                const value = e.target.value;
                const exists =
                  Array.isArray(existingRoles) &&
                  existingRoles.some(
                    (item) =>
                      item.name?.trim().toLowerCase() === value.trim().toLowerCase()
                  );
                
                setRoleExists(exists);
                setFormData({
                  ...formData,
                  name: value,
                });
              }}
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Permissions Table */}
          <div className="bg-white border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="text-left p-5 text-lg">Module</th>
                  <th className="text-center p-5 text-lg">Create</th>
                  <th className="text-center p-5 text-lg">Edit</th>
                  <th className="text-center p-5 text-lg">Delete</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr
                    key={module}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* Module Name */}
                    <td className="p-5 font-semibold text-gray-800 capitalize">
                      {module}
                    </td>

                    {/* Create Checkbox */}
                    <td className="text-center p-5">
                      <input
                        type="checkbox"
                        checked={formData.permissions[module]?.create || false}
                        onChange={(e) =>
                          handlePermissionChange(module, "create", e.target.checked)
                        }
                        className="w-5 h-5 accent-black"
                      />
                    </td>

                    {/* Edit Checkbox */}
                    <td className="text-center p-5">
                      <input
                        type="checkbox"
                        checked={formData.permissions[module]?.edit || false}
                        onChange={(e) =>
                          handlePermissionChange(module, "edit", e.target.checked)
                        }
                        className="w-5 h-5 accent-black"
                      />
                    </td>

                    {/* Delete Checkbox */}
                    <td className="text-center p-5">
                      <input
                        type="checkbox"
                        checked={formData.permissions[module]?.delete || false}
                        onChange={(e) =>
                          handlePermissionChange(module, "delete", e.target.checked)
                        }
                        className="w-5 h-5 accent-black"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
          <button
            disabled={roleExists}
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Role
          </button>
        </form>

      </div>
    </div>
  );
}