"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSlug } from "@/lib/slug";
import CategoryPicker from "@/components/CategoryPicker";

export default function AddCategoryPage() {
  const router = useRouter();

  // ======================
  // STATES
  // ======================
  const [allCategories, setAllCategories] = useState([]);
  const [titleExists, setTitleExists] = useState(false);
  const [slugExists, setSlugExists] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    parent: null,
    status: "active",
  });

  // ======================
  // FETCH CATEGORIES
  // ======================
  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setAllCategories(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // ======================
  // AUTO SLUG UTILITY
  // ======================
  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  // ======================
  // HANDLE TITLE ALTERATIONS
  // ======================
  function handleTitleChange(value) {
    const exists = allCategories.some(
      (item) =>
        item.title?.trim().toLowerCase() === value.trim().toLowerCase()
    );

    setTitleExists(exists);
    setFormData({
      ...formData,
      title: value,
      slug: generateSlug(value),
    });
  }

  // ======================
  // CREATE CATEGORY
  // ======================
  async function handleSubmit(e) {
    e.preventDefault();

    // Check duplicate slug via external engine
    const uniqueSlug = createSlug({
      text: formData.slug,
      items: allCategories,
    });

    if (!uniqueSlug) {
      alert("Slug already exists");
      return;
    }

    // Secondary verification check for title duplication
    const titleExistsCheck = allCategories.some(
      (item) =>
        item.title?.trim().toLowerCase() === formData.title?.trim().toLowerCase()
    );

    if (titleExistsCheck) {
      alert("Category title already exists");
      return;
    }

    try {
      const response = await fetch("/api/categories", {
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

      alert("Category Created Successfully");
      router.push("/admin/categories");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  }

  // ======================
  // UI RENDER
  // ======================
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        {/* Header Block */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-900">Add Category</h1>
          <p className="text-gray-500 mt-3 text-lg">
            Create category or subcategory
          </p>
        </div>

        {/* Data Configuration Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Category Title Input */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Title
            </label>
            {titleExists && (
              <p className="text-red-500 text-sm mb-2 font-medium">
                Category already exists
              </p>
            )}
            <input
              type="text"
              required
              pattern=".*[A-Za-z].*"
              title="Title cannot contain only numbers"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Slug Input with Direct Collision State Mapping */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Slug
            </label>
            {slugExists && (
              <p className="text-red-500 text-sm mb-2 font-medium">
                Slug already exists
              </p>
            )}
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => {
                const slugValue = generateSlug(e.target.value);
                const exists = allCategories.some(
                  (item) => item.slug === slugValue
                );

                setSlugExists(exists);
                setFormData({
                  ...formData,
                  slug: slugValue,
                });
              }}
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Parent Structural Picker Selector */}
          <div className="text-black">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Parent Category
            </label>
            <CategoryPicker
              categories={allCategories}
              value={formData.parent}
              onChange={(id) =>
                setFormData({
                  ...formData,
                  parent: id,
                })
              }
              label="Select Parent Category"
            />
          </div>

          {/* SEO Meta Title Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Meta Title
            </label>
            <input
              type="text"
              pattern=".*[A-Za-z].*"
              title="Meta Title cannot contain only numbers"
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

          {/* SEO Meta Description Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Meta Description
            </label>
            <textarea
              pattern=".*[A-Za-z].*"
              title="Description cannot contain only numbers"
              rows={5}
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  metaDescription: e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Status Select Options */}
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

          {/* Mutational Submit Trigger */}
          <button
            disabled={titleExists || slugExists}
            className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-xl text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Category
          </button>
        </form>
      </div>
    </div>
  );
}