"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // ======================
  // STATES
  // ======================
  const [loading, setLoading] = useState(true);
  const [existingRoles, setExistingRoles] = useState([]);
  const [roleExists, setRoleExists] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    permissions: {
      products: { create: false, edit: false, delete: false },
      categories: { create: false, edit: false, delete: false },
      cms: { create: false, edit: false, delete: false },
    },
  });

  // ======================
  // CONFIGURATION
  // ======================
  const modules = ["products", "categories", "cms"];

  // ======================
  // LIFECYCLE / FETCH
  // ======================
  useEffect(() => {
    if (id) {
      fetchRole();
    }
  }, [id]);

  async function fetchRole() {
    try {
      const response = await fetch(`/api/roles/${id}`);
      const data = await response.json();

      const rolesResponse = await fetch("/api/roles");
      const rolesData = await rolesResponse.json();
      setExistingRoles(rolesData.roles || []);

      if (data.success) {
        setFormData({
          name: data.role.name,
          permissions: data.role.permissions,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // ======================
  // HANDLERS
  // ======================
  function handlePermissionChange(module, action, value) {
    let updatedPermissions = {
      ...formData.permissions,
      [module]: {
        ...formData.permissions[module],
        [action]: value,
      },
    };

    // Auto-cascade categories permissions to subcategories
    if (module === "categories") {
      updatedPermissions = {
        ...updatedPermissions,
        subcategories: {
          ...formData.permissions?.subcategories,
          [action]: value,
        },
      };
    }

    setFormData({
      ...formData,
      permissions: updatedPermissions,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (roleExists) {
      alert("Cannot update role. This name is already taken by another role.");
      return;
    }

    try {
      const response = await fetch(`/api/roles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Role Updated Successfully");
        router.push("/admin/roles");
      } else {
        alert(data.message || "Failed to update role");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // ======================
  // LOADING UI
  // ======================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">
        Loading Role...
      </div>
    );
  }

  // ======================
  // MAIN UI
  // ======================
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Edit Role</h1>
          <p className="text-gray-500 mt-2">Update role permissions</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Role Name */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Role Name *
            </label>
            {roleExists && (
              <p className="text-red-500 text-sm mt-2">Role already exists</p>
            )}
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                const value = e.target.value;
                const exists = existingRoles.some(
                  (item) =>
                    String(item.id) !== String(id) &&
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
                    {/* Module Title */}
                    <td className="p-5 font-semibold text-gray-800 capitalize">
                      {module}
                    </td>

                    {/* Create Action */}
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

                    {/* Edit Action */}
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

                    {/* Delete Action */}
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

          {/* Submit Action */}
          <button
            disabled={roleExists}
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Role
          </button>
        </form>

      </div>
    </div>
  );
}