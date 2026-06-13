import Link from "next/link";

export default function AboutPreview() {
  return (
    <section className="py-20 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side Content */}
          <div>
            <span className="inline-block bg-[#1CA16B]/10 text-[#1CA16B] px-4 py-2 rounded-full text-sm font-semibold">
              ABOUT US
            </span>

            <h1 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D3549] leading-tight">
              Trusted Product Solutions
              <br />
              For Every Industry
            </h1>

            <p className="mt-6 text-gray-600 leading-relaxed text-base md:text-lg">
              We provide high-quality products and innovative solutions designed to meet
              modern business requirements. Our goal is to deliver reliable products,
              exceptional service, and long-term value to our customers.
            </p>

            <Link
              href="/frontend/about-us"
              className="inline-block mt-8 bg-[#1D3549] text-white px-6 py-3 rounded-lg hover:bg-[#19535B] transition"
            >
              Read More
            </Link>
          </div>

          {/* Right Side Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <h2 className="text-3xl font-bold text-[#1CA16B]">
                500+
              </h2>
              <p className="mt-2 text-gray-600">
                Products
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <h3 className="text-3xl font-bold text-[#1CA16B]">
                100+
              </h3>
              <p className="mt-2 text-gray-600">
                Clients
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <h3 className="text-3xl font-bold text-[#1CA16B]">
                10+
              </h3>
              <p className="mt-2 text-gray-600">
                Years Experience
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <h3 className="text-3xl font-bold text-[#1CA16B]">
                24/7
              </h3>
              <p className="mt-2 text-gray-600">
                Support
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}