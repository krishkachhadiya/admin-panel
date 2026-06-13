export default function MissionVision() {
  return (
    <section className="py-20 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#1CA16B]/10 text-[#1CA16B] px-4 py-2 rounded-full text-sm font-semibold">
            OUR VALUES
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-[#1D3549]">
            Mission, Vision & Values
          </h2>
        </div>

        {/* Core Value Card Grid */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Mission Card */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
            <div className="w-14 h-14 rounded-xl bg-[#1CA16B]/10 flex items-center justify-center text-2xl mb-5">
              🎯
            </div>
            <h3 className="text-xl font-bold text-[#1D3549]">
              Our Mission
            </h3>
            <p className="mt-4 text-gray-600 leading-relaxed">
              To provide premium quality products and innovative solutions that help customers achieve long-term success.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
            <div className="w-14 h-14 rounded-xl bg-[#1CA16B]/10 flex items-center justify-center text-2xl mb-5">
              🚀
            </div>
            <h3 className="text-xl font-bold text-[#1D3549]">
              Our Vision
            </h3>
            <p className="mt-4 text-gray-600 leading-relaxed">
              To become a trusted leader known for quality, innovation and customer satisfaction across industries.
            </p>
          </div>

          {/* Values Card */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition">
            <div className="w-14 h-14 rounded-xl bg-[#1CA16B]/10 flex items-center justify-center text-2xl mb-5">
              ⭐
            </div>
            <h3 className="text-xl font-bold text-[#1D3549]">
              Core Values
            </h3>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Integrity, quality, innovation, teamwork and commitment to delivering value to every customer.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}