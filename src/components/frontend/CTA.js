import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-[#1D3549] rounded-3xl overflow-hidden">
          <div className="px-6 py-12 md:px-10 md:py-16 lg:px-16 text-center">

            <span className="inline-block bg-[#1CA16B]/20 text-[#1CA16B] px-4 py-2 rounded-full text-sm font-semibold">
              LET'S WORK TOGETHER
            </span>

            <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Ready To Grow Your Business?
            </h2>

            <p className="mt-5 text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
              Contact our team today and discover how our products can help your business
              achieve better results.
            </p>

            <Link
              href="/frontend/contact-us"
              className="inline-block mt-8 bg-[#1CA16B] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#19535B] transition"
            >
              Get In Touch
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}