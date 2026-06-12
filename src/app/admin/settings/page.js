"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ======================
  // PAGINATION STATE
  // ======================
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fields = [
    { key: "companyName", label: "Company Name", type: "text" },
    { key: "websiteTitle", label: "Website Title", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "address", label: "Address", type: "text" },
    { key: "facebook", label: "Facebook", type: "text" },
    { key: "instagram", label: "Instagram", type: "text" },
    { key: "linkedin", label: "LinkedIn", type: "text" },
    { key: "metaTitle", label: "Meta Title", type: "text" },
    { key: "metaDescription", label: "Meta Description", type: "textarea" },
    { key: "copyright", label: "Copyright", type: "text" },
    { key: "logo", label: "Logo", type: "file" },
    { key: "favicon", label: "Favicon", type: "file" },
    { key: "pagination", label: "Pagination Limit", type: "number" },
    { key: "OG Image", label: "OG Image", type: "file" },
  ];

  // ======================
  // FETCH ACTIONS
  // ======================
  async function fetchPagination() {
    try {
      const response = await fetch("/api/settings");
      const result = await response.json();
      setLimit(result.data.pagination || 10);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchSettings() {
    try {
      const response = await fetch("/api/settings");
      const result = await response.json();

      if (result.success) {
        setSettings(result.data || {});
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSettings();
    fetchPagination();
  }, []);

  // ======================
  // MUTATION HANDLERS
  // ======================
  function handleChange(key, value) {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleImageUpload(file, key) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSettings((prev) => ({
          ...prev,
          [key]: result.imageUrl,
        }));
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Upload Failed");
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.message);
        return;
      }

      alert("Settings Saved Successfully");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  // ======================
  // PAGINATION LOGIC
  // ======================
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedFields = fields.slice(start, end);
  const totalPages = Math.ceil(fields.length / limit);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black">Global Settings</h1>
          <p className="text-gray-500 mt-2">Manage website settings</p>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden text-black">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-5 text-left">Setting Name</th>
                <th className="p-5 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFields.map((field) => (
                <tr
                  key={field.key}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-5 font-semibold">{field.label}</td>
                  <td className="p-5">
                    {field.type === "file" ? (
                      <div className="space-y-3">
                        {settings[field.key] && (
                          <img
                            src={settings[field.key]}
                            alt={field.label}
                            className="h-16 object-contain"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, field.key);
                            }
                          }}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3"
                        />
                      </div>
                    ) : field.type === "textarea" ? (
                      <textarea
                        rows={4}
                        value={settings[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={settings[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Action Trigger */}
          <div className="p-6 border-t">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-center gap-2 mt-8 text-black">
          {page > 1 && (
            <button
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-lg border bg-white"
            >
              Prev
            </button>
          )}

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`px-4 py-2 rounded-lg border ${
                page === index + 1 ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              {index + 1}
            </button>
          ))}

          {page < totalPages && (
            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-lg border bg-white"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}