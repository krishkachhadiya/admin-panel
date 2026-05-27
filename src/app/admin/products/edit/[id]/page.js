"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

export default function EditProductPage() {

  const params =
    useParams();

  const router =
    useRouter();

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    formData,
    setFormData,
  ] = useState({
    title: "",
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


  // ======================
  // FETCH PRODUCT
  // ======================

  async function fetchProduct() {

    try {

      const response =
        await fetch(
          "/api/products"
        );

      const products =
        await response.json();

      const product =
        products.find(
          (item) =>
            item.id ==
            params.id
        );




      if (product) {

        setFormData({
          ...product,

          subcategory:
            product.subcategory ||
            "",

          images:
            Array.isArray(
              product.images
            )
              ? product.images
              : [],

          specifications:
            Array.isArray(
              product.specifications
            )
              ? product.specifications
              : [],
        });
      }

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

    fetchProduct();

    fetchCategories();
  }, []);




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
    selectedCategoryData
      ?.subcategories || [];



  // ======================
  // IMAGE UPLOAD
  // ======================

  async function handleImageUpload(
    e
  ) {

    const file =
      e.target.files[0];

    if (!file) return;

    setUploading(true);




    const uploadData =
      new FormData();

    uploadData.append(
      "file",
      file
    );




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
  // UPDATE PRODUCT
  // ======================

  async function handleUpdate(
    e
  ) {

    e.preventDefault();

    try {

      const response =
        await fetch(
          `/api/products/${params.id}`,
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
          "Product Updated Successfully"
        );

        router.push(
          "/admin/products"
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
      <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">

        Loading Product...

      </div>
    );
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
            Edit Product
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Update product details
          </p>

        </div>




        {/* Form */}

        <form
          onSubmit={
            handleUpdate
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




          {/* Description */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Description
            </label>

            <textarea
              value={
                formData.description
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description:
                    e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black resize-none h-36"
            />

          </div>




          {/* Category + Subcategory */}

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
                onChange={(e) =>
                  setFormData({
                    ...formData,

                    category:
                      e.target.value,

                    subcategory: "",
                  })
                }
                className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
              >

                <option value="">
                  Select Category
                </option>

                {categories.map(
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

            {/* Subcategory */}

            <div>

              <label className="block text-lg font-semibold text-gray-700 mb-3">

                Subcategory

              </label>

              <select
                value={
                  formData.subcategory
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,

                    subcategory:
                      e.target.value,
                  })
                }
                disabled={
                  !formData.category
                }
                className={`w-full border p-4 rounded-xl outline-none transition ${formData.category
                    ? "border-gray-300 bg-white text-black focus:ring-2 focus:ring-black"
                    : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >

                <option value="">

                  {
                    formData.category
                      ? "Select Subcategory"
                      : "First Select Category"
                  }

                </option>

                {filteredSubcategories.map(
                  (subcategory) => (

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
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black resize-none h-28"
            />

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
                    Product Images
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

            Update Product

          </button>

        </form>

      </div>

    </div>
  );
}