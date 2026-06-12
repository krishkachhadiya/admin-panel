"use client";

import TextEditor from "@/components/editor/TextEditor";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSlug, generateSlug } from "@/lib/slug";

export default function AddCMSPage() {
  const router = useRouter();

  // ======================
  // STATES
  // ======================
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [existingCms, setExistingCms] = useState([]);
  const [pageExists, setPageExists] = useState(false);
  const [slugExists, setSlugExists] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    content: "",
    status: "active",
  });

  // ======================
  // AUTO GENERATE SLUG
  // ======================
  useEffect(() => {
    if (!isSlugEdited) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.title),
      }));
    }
  }, [formData.title, isSlugEdited]);

  useEffect(() => {
    async function fetchCms() {
      try {
        const response = await fetch("/api/cms");
        const data = await response.json();
        setExistingCms(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCms();
  }, []);

  // ======================
  // CREATE PAGE
  // ======================
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // FETCH EXISTING CMS
      const cmsResponse = await fetch("/api/cms");
      const existingCmsData = await cmsResponse.json();

      // ======================
      // UNIQUE SLUG
      // ======================
      const uniqueSlug = createSlug({
        text: formData.slug,
        items: existingCmsData,
      });

      // ======================
      // SLUG EXISTS
      // ======================
      if (!uniqueSlug) {
        alert("Slug already exists");
        return;
      }

      // ======================
      // UPDATED DATA
      // ======================
      const updatedFormData = {
        ...formData,
        slug: uniqueSlug,
      };

      // CREATE PAGE
      const response = await fetch("/api/cms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      const data = await response.json();

      // ERROR
      if (!data.success) {
        alert(data.message);
        return;
      }

      // SUCCESS
      alert("CMS Page Created Successfully");
      router.push("/admin/cms");
    } catch (error) {
      console.log(error);
      alert("CMS page already exist");
    }
  }

  // ======================
  // UI
  // ======================
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-black">Add CMS Page</h1>
          <p className="text-gray-500 mt-3 text-lg">Create website page</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Page Title *
            </label>
            {pageExists && (
              <p className="text-red-500 text-sm mt-2">Page already exists</p>
            )}
            <input
              required
              type="text"
              pattern=".*[A-Za-z].*"
              title="Title cannot contain only numbers"
              value={formData.title}
              onChange={(e) => {
                const value = e.target.value;
                const exists = existingCms.some(
                  (item) =>
                    item.title?.trim().toLowerCase() === value.trim().toLowerCase()
                );

                setPageExists(exists);
                setFormData({
                  ...formData,
                  title: value,
                  slug: !isSlugEdited ? generateSlug(value) : formData.slug,
                });
              }}
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Slug *
            </label>
            {slugExists && (
              <p className="text-red-500 text-sm mt-2">Slug already exists</p>
            )}
            <input
              required
              type="text"
              value={formData.slug}
              onChange={(e) => {
                const slugValue = generateSlug(e.target.value);
                const exists = existingCms.some(
                  (item) => item.slug === slugValue
                );

                setSlugExists(exists);
                setFormData({
                  ...formData,
                  slug: slugValue,
                });
                setIsSlugEdited(slugValue !== "");
              }}
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Meta Title */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  metaTitle: e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Meta Description
            </label>
            <textarea
              rows={5}
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  metaDescription: e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          {/* Content */}
          <div className="text-black">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Content
            </label>
            <TextEditor
              value={formData.content}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  content: value,
                })
              }
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit */}
          <button
            disabled={pageExists || slugExists}
            className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-xl text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Page
          </button>
        </form>
      </div>
    </div>
  );
}