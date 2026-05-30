"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  createSlug,
} from "@/lib/slug";

export default function EditCategoryPage() {

  const params =
    useParams();

  const router =
    useRouter();




  // ======================
  // STATES
  // ======================

  const [
    loading,
    setLoading,
  ] = useState(true);




  const [
    allCategories,
    setAllCategories,
  ] = useState([]);




  const [
    subcategories,
    setSubcategories,
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
  // FETCH CATEGORY
  // ======================

  async function fetchCategory() {

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




      const category =
        data.find(
          (item) =>
            Number(item.id) ===
            Number(params.id)
        );




      if (category) {

        setFormData(
          category
        );




        const filteredSubcategories =
          data.filter(
            (item) => {

              return (
                item.parent !== null &&

                String(item.parent) ===
                String(params.id)
              );
            }
          );




        setSubcategories(
          filteredSubcategories
        );
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }




  // ======================
  // LOAD
  // ======================

  useEffect(() => {

    fetchCategory();

  }, []);




  // ======================
  // UPDATE CATEGORY
  // ======================

  async function handleSubmit(
    e
  ) {

    e.preventDefault();

    const titleExists =
      allCategories.some(
        (item) =>

          item.title
            ?.trim()
            .toLowerCase() ===

          formData.title
            ?.trim()
            .toLowerCase() &&

          item.id !==
          formData.id
      );

    if (
      titleExists
    ) {

      alert(
        "Category title already exists"
      );

      return;
    }



    // ======================
    // CHECK DUPLICATE SLUG
    // ======================

    const uniqueSlug =
      createSlug({

        text:
          formData.slug,

        items:
          allCategories,

        currentId:
          formData.id,
      });

    if (
      !uniqueSlug
    ) {

      alert(
        "Slug already exists"
      );

      return;
    }


    try {

      const response =
        await fetch(
          `/api/categories/${params.id}`,
          {

            method: "PUT",

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




      if (data.success) {

        alert(
          "Category Updated Successfully"
        );




        router.push(
          "/admin/categories"
        );
      }

    } catch (error) {

      console.log(error);

    }
  }




  // ======================
  // DELETE SUBCATEGORY
  // ======================

  async function handleDelete(
    id
  ) {

    const confirmDelete =
      confirm(
        "Delete subcategory?"
      );




    if (!confirmDelete)
      return;




    try {

      const response =
        await fetch(
          `/api/categories/${id}`,
          {
            method: "DELETE",
          }
        );




      const data =
        await response.json();




      if (data.success) {

        fetchCategory();
      }

    } catch (error) {

      console.log(error);

    }
  }




  // ======================
  // LOADING
  // ======================

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">

        Loading Category...

      </div>
    );
  }




  // ======================
  // UI
  // ======================

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-10">


        {/* Header */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold text-gray-900">

            Edit Category

          </h1>

          <p className="text-gray-500 mt-3 text-lg">

            Update category details

          </p>

        </div>




        {/* Form */}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-8"
        >


          {/* Title */}

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
                setFormData({

                  ...formData,

                  title:
                    e.target.value,

                  slug:
                    generateSlug(
                      e.target.value
                    ),
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl"
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
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl"
            />

          </div>




          {/* Parent */}

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
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl"
            >

              <option value="">
                Main Category
              </option>

              {
                allCategories
                  .filter(
                    (item) =>
                      item.parent ===
                      null &&
                      item.id !==
                      formData.id
                  )
                  .map(
                    (category) => (

                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >

                        {
                          category.title
                        }

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
                formData.metaTitle ||
                ""
              }
              onChange={(e) =>
                setFormData({

                  ...formData,

                  metaTitle:
                    e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl"
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
                formData.metaDescription ||
                ""
              }
              onChange={(e) =>
                setFormData({

                  ...formData,

                  metaDescription:
                    e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl"
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
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl"
            >

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

            </select>

          </div>




          {/* SUBCATEGORY TABLE */}

          {
            formData.parent ===
            null && (

              <div className="text-black">

                <div className="flex items-center justify-between mb-5">

                  <h2 className="text-2xl font-bold text-black">

                    Subcategories

                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/admin/categories/add"
                      )
                    }
                    className="bg-black text-white px-5 py-3 rounded-xl"
                  >

                    Add Subcategory

                  </button>

                </div>




                <div className="overflow-hidden border border-gray-200 rounded-2xl">

                  <table className="w-full">

                    <thead className="bg-black text-white">

                      <tr>

                        <th className="text-left p-4">

                          Title

                        </th>

                        <th className="text-left p-4">

                          Slug

                        </th>

                        <th className="text-left p-4">

                          Status

                        </th>

                        <th className="text-left p-4">

                          Actions

                        </th>

                      </tr>

                    </thead>




                    <tbody>

                      {
                        subcategories.length >
                          0 ? (

                          subcategories.map(
                            (
                              subcategory
                            ) => (

                              <tr
                                key={
                                  subcategory.id
                                }
                                className="border-b"
                              >

                                <td className="p-4">

                                  {
                                    subcategory.title
                                  }

                                </td>

                                <td className="p-4">

                                  {
                                    subcategory.slug
                                  }

                                </td>

                                <td className="p-4">

                                  {
                                    subcategory.status
                                  }

                                </td>

                                <td className="p-4">

                                  <div className="flex gap-3">

                                    <button
                                      type="button"
                                      onClick={() =>
                                        router.push(
                                          `/admin/categories/edit/${subcategory.id}`
                                        )
                                      }
                                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                                    >

                                      Edit

                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDelete(
                                          subcategory.id
                                        )
                                      }
                                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                                    >

                                      Delete

                                    </button>

                                  </div>

                                </td>

                              </tr>
                            )
                          )

                        ) : (

                          <tr>

                            <td
                              colSpan="4"
                              className="text-center p-6 text-gray-500"
                            >

                              No Subcategories Found

                            </td>

                          </tr>
                        )
                      }

                    </tbody>

                  </table>

                </div>

              </div>
            )
          }




          {/* Submit */}

          <button className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-xl text-lg font-semibold">

            Update Category

          </button>

        </form>

      </div>

    </div>
  );
}