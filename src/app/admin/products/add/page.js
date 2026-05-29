"use client";
import TextEditor from "@/components/editor/TextEditor";
import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createSlug,
  generateSlug,
  isValidSlug,
} from "@/lib/slug";

export default function AddProductPage() {

  const router = useRouter();

  // ======================
  // STATES
  // ======================

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    isSlugEdited,
    setIsSlugEdited,
  ] = useState(false);


  const [
    formData,
    setFormData,
  ] = useState({

    title: "",

    slug: "",

    description: "",

    metaTitle: "",

    metaDescription: "",

    category: "",

    subcategory: "",

    status: "active",

    images: [],

    specifications: [],
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

      setCategories(data);

    } catch (error) {

      console.log(error);

    }
  }


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
  // LOAD DATA
  // ======================

  useEffect(() => {

    fetchCategories();

  }, []);




  // ======================
  // FILTER SUBCATEGORIES
  // ======================

  const selectedCategoryData =
    categories.find(
      (category) =>
        category.title
          ?.trim()
          .toLowerCase() ===
        formData.category
          ?.trim()
          .toLowerCase()
    );

  const filteredSubcategories =
    categories.filter(
      (item) =>
        String(
          item.parent
        ) ===
        String(
          selectedCategoryData?.id
        )
    );

  // ======================
  // IMAGE UPLOAD
  // ======================

  async function handleImageUpload(
    e
  ) {

    const file =
      e.target.files[0];

    if (!file)
      return;

    setUploading(true);

    const uploadData = new FormData();

    uploadData.append("file", file);

    try {

      const response =
        await fetch(
          "/api/upload",
          {
            method: "POST",
            body: uploadData,
          }
        );




      const data =
        await response.json();




      if (data.success) {

        setFormData(
          (prev) => ({

            ...prev,

            images: [
              ...prev.images,
              data.imageUrl,
            ],

          })
        );
      }

    } catch (error) {

      console.log(error);

    } finally {

      setUploading(false);

    }
  }




  // ======================
  // REMOVE IMAGE
  // ======================

  function removeImage(
    index
  ) {

    const updatedImages =
      formData.images.filter(
        (_, i) =>
          i !== index
      );




    setFormData({

      ...formData,

      images:
        updatedImages,
    });
  }




  // ======================
  // CREATE PRODUCT
  // ======================
  // ======================
  // CREATE PRODUCT
  // ======================

  async function handleSubmit(
    e
  ) {

    e.preventDefault();




    // ======================
    // VALIDATE SLUG
    // ======================

    if (
      !isValidSlug(
        formData.slug
      )
    ) {

      alert(
        "Number only slug is not valid"
      );

      return;
    }





    try {

      // ======================
      // FETCH PRODUCTS
      // ======================

      const productsResponse =
        await fetch(
          "/api/products"
        );




      const existingProducts =
        await productsResponse.json();




      // ======================
      // CREATE UNIQUE SLUG
      // ======================
      const slugExists =
        existingProducts.some(
          (item) =>
            item.slug ===
            formData.slug
        );

      if (
        slugExists
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

};




      // ======================
      // CREATE PRODUCT
      // ======================

      const response =
        await fetch(
          "/api/products",
          {

            method: "POST",

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




      // ======================
      // ERROR
      // ======================

      if (!data.success) {

        alert(
          data.message
        );

        return;
      }




      // ======================
      // SUCCESS
      // ======================

      alert(
        "Product Created Successfully"
      );




      router.push(
        "/admin/products"
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
    <div className="min-h-screen bg-gray-50 p-10">


      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">




        {/* Header */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold text-gray-900">

            Add Product

          </h1>

          <p className="text-gray-500 mt-3 text-lg">

            Create new product

          </p>

        </div>




        {/* Form */}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-8"
        >




          {/* Product Title */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Product Title

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
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />

          </div>

          {/* Product Slug */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Product Slug

            </label>

            <input
              type="text"
              value={
                formData.slug
              }
              onChange={(e) => {

                setIsSlugEdited(
                  true
                );

                setFormData({

                  ...formData,

                  slug:
                    generateSlug(
                      e.target.value
                    ),

                });

              }}
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />

          </div>



          {/* Description */}

          <div className="text-black">

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Description

            </label>

            <TextEditor

              value={
                formData.description
              }

              onChange={(content) =>

                setFormData({

                  ...formData,

                  description:
                    content,

                })

              }

              height={400}

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


          {/* Grid */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">




            {/* Category */}

            <div>

              <label className="block text-lg font-semibold text-gray-700 mb-3">

                Category

              </label>

              <select
                value={
                  formData.category
                }
                onChange={(e) => {

                  const value =
                    e.target.value;

                  setFormData(
                    (prev) => ({

                      ...prev,

                      category: value,

                      subcategory: "",
                    })
                  );
                }}
                className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
              >

                <option value="">
                  Select Category
                </option>

                {
                  categories
                    .filter(
                      (item) =>
                        item.parent === null
                    )
                    .map(
                      (category) => (

                        <option
                          key={category.id}
                          value={
                            category.title
                          }
                        >

                          {category.title}

                        </option>

                      )
                    )}

              </select>

            </div>




            {/* Subcategory */}

            <div>

              <label className="block text-lg font-semibold text-gray-700 mb-3">

                Subcategory

              </label>

              <select
                value={
                  formData.subcategory
                }
                onChange={(e) => {

                  const value =
                    e.target.value;

                  setFormData(
                    (prev) => ({

                      ...prev,

                      subcategory:
                        value,
                    })
                  );
                }}
                className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
              >

                <option value="">
                  Select Subcategory
                </option>

                {filteredSubcategories.map(
                  (
                    subcategory
                  ) => (

                    <option
                      key={
                        subcategory.id
                      }
                      value={
                        subcategory.title
                      }
                    >

                      {
                        subcategory.title
                      }

                    </option>

                  )
                )}

              </select>

            </div>

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




          {/* Upload Images */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-4">

              Upload Images

            </label>

            <label className="border-2 border-dashed border-gray-300 hover:border-black transition rounded-3xl bg-gray-50 p-10 flex flex-col items-center justify-center cursor-pointer">

              <input
                type="file"
                onChange={
                  handleImageUpload
                }
                className="hidden"
              />

              <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-4xl mb-5">

                +

              </div>

              <h2 className="text-2xl font-bold text-black">

                Upload Product Image

              </h2>

              <p className="text-gray-500 mt-2 text-center">

                Click to select image

              </p>

            </label>




            {uploading && (

              <div className="mt-5 bg-blue-50 text-blue-700 px-5 py-4 rounded-2xl font-medium">

                Uploading image...

              </div>

            )}





            {/* Preview */}

            {formData.images.length >
              0 && (

                <div className="mt-8">

                  <h3 className="text-xl font-bold text-black mb-5">

                    Uploaded Images

                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                    {formData.images.map(
                      (
                        img,
                        index
                      ) => (

                        <div
                          key={index}
                          className="relative group"
                        >

                          <img
                            src={img}
                            alt="product"
                            className="w-full h-40 object-cover rounded-2xl border shadow-md"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >

                            ×

                          </button>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

          </div>




          {/* Specifications */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Specifications

            </label>

            <textarea
              value={
                Array.isArray(
                  formData.specifications
                )
                  ? formData.specifications.join(
                    ", "
                  )
                  : ""
              }
              onChange={(e) =>
                setFormData({

                  ...formData,

                  specifications:
                    e.target.value
                      .split(",")
                      .map(
                        (item) =>
                          item.trim()
                      ),
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black resize-none h-40"
            />

          </div>




          {/* Submit */}

          <button className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-xl text-lg font-semibold transition">

            Create Product

          </button>

        </form>

      </div>

    </div>
  );
}