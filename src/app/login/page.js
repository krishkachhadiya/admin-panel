"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [
    loading,
    setLoading
  ] = useState(false);




  // ======================
  // LOGIN
  // ======================

  async function handleLogin(e) {

    e.preventDefault();

    setLoading(true);

    try {

      const response =

        await fetch(
          "/api/login",
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




      // ======================
      // SUCCESS
      // ======================

      if (data.success) {

        sessionStorage.setItem(
          "adminLoggedIn",
          "true"
        );

        sessionStorage.setItem(
          "admin",
          JSON.stringify(
            data.admin
          )
        );




        router.push("/admin");

      } else {

        alert(
          data.message
        );
      }

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  }




  // ======================
  // UI
  // ======================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">


      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10">


        {/* Header */}

        <div className="text-center mb-10">

          <h1 className="text-5xl font-bold text-black">
            Admin Login
          </h1>

          <p className="text-gray-500 mt-3">
            Login to access dashboard
          </p>

        </div>




        {/* Form */}

        <form
          onSubmit={
            handleLogin
          }
          className="space-y-6"
        >




          {/* Email */}

          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              value={
                formData.email
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email:
                    e.target
                      .value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />

          </div>




          {/* Password */}

          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={
                formData.password
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password:
                    e.target
                      .value,
                })
              }
              className="w-full border border-gray-300 bg-white text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
            />

          </div>




          {/* Button */}

          <button
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl text-lg font-semibold transition disabled:opacity-50"
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

      </div>
    </div>
  );
}