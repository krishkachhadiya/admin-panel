export default function ContactInfo() {

  return (

    <section className="py-16 bg-white">

      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-gray-50 border rounded-3xl p-6">

            <h2 className="text-xl font-bold text-[#1D3549]">

              Address

            </h2>

            <p className="mt-3 text-gray-600">

              Rajkot, Gujarat, India

            </p>

          </div>

          <div className="bg-gray-50 border rounded-3xl p-6">

            <h2 className="text-xl font-bold text-[#1D3549]">

              Phone

            </h2>

            <a
              href="tel:+919876543210"
              className=" mt-3 inline-block text-black font-medium hover:text-[#1CA16B] transition">
              +91 9876543210
            </a>

          </div>

          <div className="bg-gray-50 border rounded-3xl p-6">

            <h2 className="text-xl font-bold text-[#1D3549]">

              Email

            </h2>

            <a
              href="mailto:info@example.com"
              className=" mt-3 inline-block text-black font-medium hover:text-[#1CA16B] transition">
              info@example.com
            </a>

          </div>

          <div className="bg-gray-50 border rounded-3xl p-6">

            <h2 className="text-xl font-bold text-[#1D3549]">

              Business Hours

            </h2>

            <p className="mt-3 text-gray-600">

              Mon - Sat : 9 AM - 6 PM

            </p>

          </div>

        </div>

      </div>

    </section>

  );

}