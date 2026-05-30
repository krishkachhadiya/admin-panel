"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createSlug,
} from "@/lib/slug";

export default function AddCategoryPage() {

  const router =
    useRouter();




  // ======================
  // STATES
  // ======================

  const [
    allCategories,
    setAllCategories,
  ] = useState([]);




  const [
    formData,
    setFormData,
  ] = useState({

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

      const response =
        await fetch(
          "/api/categories"
        );

      const data =
        await response.json();

      setAllCategories(
        data
      );

    } catch (error) {

      console.log(error);

    }
  }

  useEffect(() => {

    fetchCategories();

  }, []);




  // ======================
  // AUTO SLUG
  // ======================

  function generateSlug(
    text
  ) {

    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }




  // ======================
  // HANDLE TITLE
  // ======================

  function handleTitleChange(
    value
  ) {

    setFormData({

      ...formData,

      title: value,

      slug:
        generateSlug(value),
    });
  }




  // ======================
  // CREATE CATEGORY
  // ======================

  async function handleSubmit(
    e
  ) {

    e.preventDefault();

    // ======================
    // CHECK DUPLICATE SLUG
    // ======================

    const uniqueSlug =
      createSlug({

        text:
          formData.slug,

        items:
          allCategories,
      });

    if (
      !uniqueSlug
    ) {

      alert(
        "Slug already exists"
      );

      return;
    }

    // ======================
    // CHECK DUPLICATE TITLE
    // ======================

    const titleExists =
      allCategories.some(
        (item) =>

          item.title
            ?.trim()
            .toLowerCase() ===

          formData.title
            ?.trim()
            .toLowerCase()
      );

    if (
      titleExists
    ) {

      alert(
        "Category title already exists"
      );

      return;
    }

    try {

      const response =
        await fetch(
          "/api/categories",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              formData
            ),
          }
        );




      const data =
        await response.json();




      // ERROR

      if (!data.success) {

        alert(
          data.message
        );

        return;
      }




      // SUCCESS

      alert(
        "Category Created Successfully"
      );




      router.push(
        "/admin/categories"
      );

    } catch (error) {

      console.log(error);




      alert(
        "Something went wrong"
      );
    }
  }




  // ======================
  // UI
  // ======================

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">


        {/* Header */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold text-gray-900">

            Add Category

          </h1>

          <p className="text-gray-500 mt-3 text-lg">

            Create category or subcategory

          </p>

        </div>




        {/* Form */}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-8"
        >


          {/* Category Title */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Title

            </label>

            <input
              type="text"
              value={
                formData.title
              }
              onChange={(e) =>
                handleTitleChange(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />

          </div>




          {/* Slug */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Slug

            </label>

            <input
              type="text"
              value={
                formData.slug
              }
              onChange={(e) =>
                setFormData({
                  ...formData,

                  slug:
                    generateSlug(
                      e.target.value
                    ),
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />

          </div>




          {/* Parent Category */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Parent Category

            </label>

            <select
              value={
                formData.parent || ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,

                  parent:
                    e.target.value || null,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            >

              <option value="">
                Main Category
              </option>

              {
                allCategories
                  .filter(
                    (item) =>
                      item.parent === null
                  )
                  .map((item) => (

                    <option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                    >

                      {item.title}

                    </option>
                  )
                  )
              }

            </select>

          </div>




          {/* Meta Title */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Meta Title

            </label>

            <input
              type="text"
              value={
                formData.metaTitle
              }
              onChange={(e) =>
                setFormData({
                  ...formData,

                  metaTitle:
                    e.target.value,
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
              value={
                formData.metaDescription
              }
              onChange={(e) =>
                setFormData({
                  ...formData,

                  metaDescription:
                    e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />

          </div>




          {/* Status */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Status

            </label>

            <select
              value={
                formData.status
              }
              onChange={(e) =>
                setFormData({
                  ...formData,

                  status:
                    e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            >

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

            </select>

          </div>




          {/* Submit */}

          <button className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-xl text-lg font-semibold transition">

            Create Category

          </button>

        </form>

      </div>

    </div>
  );
}