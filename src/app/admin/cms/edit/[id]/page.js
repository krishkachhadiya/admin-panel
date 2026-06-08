"use client";

import TextEditor from "@/components/editor/TextEditor";

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
  generateSlug,
} from "@/lib/slug";

export default function EditCMSPage() {

  const router =
    useRouter();

  const params =
    useParams();




  // ======================
  // STATES
  // ======================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    isSlugEdited,
    setIsSlugEdited,
  ] = useState(false);

  const [
    existingCms,
    setExistingCms,
  ] = useState([]);

  const [
    pageExists,
    setPageExists,
  ] = useState(false);

  const [
    slugExists,
    setSlugExists,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState({

    title: "",

    slug: "",

    metaTitle: "",

    metaDescription: "",

    content: "",

    status: "active",
  });




  // ======================
  // FETCH PAGE
  // ======================

  async function fetchPage() {

    try {

      const response =
        await fetch(
          `/api/cms/${params?.id}`
        );

      const data =
        await response.json();

      const cmsResponse =
        await fetch(
          "/api/cms"
        );

      const cmsData =
        await cmsResponse.json();

      setExistingCms(
        cmsData
      );


      setFormData({

        id:
          data.id || "",

        title:
          data.title || "",

        slug:
          data.slug || "",

        metaTitle:
          data.metaTitle || "",

        metaDescription:
          data.metaDescription || "",

        content:
          data.content || "",

        status:
          data.status || "active",
      });
      setIsSlugEdited(

        data.slug &&

        data.slug !==
        generateSlug(
          data.title
        )

      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }




  // ======================
  // LOAD DATA
  // ======================

  useEffect(() => {

    if (!params?.id)
      return;

    fetchPage();

  }, [params?.id]);




  // ======================
  // AUTO GENERATE SLUG
  // ======================


  useEffect(() => {

    if (!isSlugEdited) {

      setFormData(
        (prev) => ({

          ...prev,

          slug:
            generateSlug(
              prev.title
            ),

        })
      );

    }

  }, [
    formData.title,
    isSlugEdited,
  ]);


  // ======================
  // UPDATE PAGE
  // ======================

  async function handleSubmit(
    e
  ) {

    e.preventDefault();

    try {

      // FETCH EXISTING CMS

      const cmsResponse =
        await fetch(
          "/api/cms"
        );

      const existingCms =
        await cmsResponse.json();
      // ======================
      // UNIQUE SLUG
      // ======================

      const uniqueSlug =
        createSlug({

          text:
            formData.slug,

          items:
            existingCms,

          currentId:
            formData.id,

        });
      // ======================
      // TITLE EXISTS
      // ======================

      const titleExists =
        existingCms.some(
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
          "CMS title already exists"
        );

        return;
      }



      // ======================
      // SLUG EXISTS
      // ======================

      if (
        !uniqueSlug
      ) {

        alert(
          "Slug already exists"
        );

        return;
      }
      // ======================
      // UPDATED DATA
      // ======================

      const updatedFormData = {

        ...formData,

        slug:
          uniqueSlug,

      };

      // UPDATE PAGE

      const response =
        await fetch(
          `/api/cms/${params?.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              updatedFormData
            ),
          }
        );

      const data =
        await response.json();




      if (data.success) {

        alert(
          "CMS Page Updated Successfully"
        );

        router.push(
          "/admin/cms"
        );
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

      <div className="flex items-center justify-center min-h-screen bg-gray-100">

        <h1 className="text-2xl font-bold">

          Loading...

        </h1>

      </div>

    );
  }

  // ======================
  // UI
  // ======================

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">




        {/* Header */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold text-black">

            Edit CMS Page

          </h1>

          <p className="text-gray-500 mt-3 text-lg">

            Update website page

          </p>

        </div>




        {/* Form */}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-8"
        >




          {/* Page Title */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Page Title *

            </label>
            {pageExists && (
              <p className="text-red-500 text-sm mt-2">
                Page already exists
              </p>
            )}
            <input
              type="text"
              required
              pattern=".*[A-Za-z].*"
              title="Title cannot contain only numbers"
              value={
                formData.title
              }
              onChange={(e) => {

                const value =
                  e.target.value;

                const exists =
                  existingCms.some(
                    (item) =>

                      item.id !=
                      params.id &&

                      item.title
                        ?.trim()
                        .toLowerCase() ===

                      value
                        .trim()
                        .toLowerCase()
                  );

                setPageExists(
                  exists
                );

                setFormData({

                  ...formData,

                  title: value,

                  slug:
                    !isSlugEdited
                      ? generateSlug(
                        value
                      )
                      : formData.slug,

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
              <p className="text-red-500 text-sm mt-2">
                Slug already exists
              </p>
            )}
            <input
              type="text"
              required
              value={
                formData.slug
              }
              onChange={(e) => {

                const slugValue =
                  generateSlug(
                    e.target.value
                  );

                const exists =
                  existingCms.some(
                    (item) =>

                      item.id !=
                      params.id &&

                      item.slug ===
                      slugValue
                  );

                setSlugExists(
                  exists
                );

                setFormData({

                  ...formData,

                  slug:
                    slugValue,

                });

                setIsSlugEdited(
                  slugValue !== ""
                );

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
              className="w-full h-40 border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black resize-none"
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

           <button
            disabled={pageExists || slugExists}
            className=" bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-xl text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed" >
            Update Page
          </button>
        </form>

      </div>

    </div>

  );
}