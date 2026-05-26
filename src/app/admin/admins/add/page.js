"use client";

import {
  useState,
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function AddAdminPage() {

  const router =
    useRouter();




  // ======================
  // STATES
  // ======================

  const [
    roles,
    setRoles,
  ] = useState([]);

  const [
    formData,
    setFormData,
  ] = useState({

    name: "",

    email: "",

    password: "",

    role: "",
  });




  // ======================
  // FETCH ROLES
  // ======================

  async function fetchRoles() {

    try {

      const response =
        await fetch(
          "/api/roles"
        );

      const data =
        await response.json();




      setRoles(
        data.roles || []
      );

    } catch (error) {

      console.log(error);

    }
  }

  useEffect(() => {

    fetchRoles();

  }, []);




  // ======================
  // HANDLE SUBMIT
  // ======================

  async function handleSubmit(
    e
  ) {

    e.preventDefault();




    try {

      const response =
        await fetch(
          "/api/admins/add",
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
        "User Added Successfully"
      );

      router.push(
        "/admin/admins"
      );

    } catch (error) {

      console.log(error);

    }
  }




  // ======================
  // UI
  // ======================

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10">


        {/* Header */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold text-gray-800">

            Add User

          </h1>

          <p className="text-gray-500 mt-2">

            Create new user

          </p>

        </div>




        {/* Form */}

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-8"
        >


          {/* Name */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Name

            </label>

            <input
              type="text"
              value={
                formData.name
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name:
                    e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
              required
            />

          </div>




          {/* Email */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Email

            </label>

            <input
              type="email"
              value={
                formData.email
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email:
                    e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
              required
            />

          </div>




          {/* Password */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Password

            </label>

            <input
              type="password"
              value={
                formData.password
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password:
                    e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
              required
            />

          </div>




          {/* Role */}

          <div>

            <label className="block text-lg font-semibold text-gray-700 mb-3">

              Role

            </label>

            <select
              value={
                formData.role
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role:
                    e.target.value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
              required
            >

              <option value="">
                Select Role
              </option>

              {roles.map(
                (role) => (

                  <option
                    key={role.id}
                    value={role.name}
                  >

                    {role.name}

                  </option>

                )
              )}

            </select>

          </div>




          {/* Submit */}

          <button className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition">

            Add User

          </button>

        </form>

      </div>

    </div>
  );
}