export default function CompanyStory() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#1CA16B]/10 text-[#1CA16B] px-4 py-2 rounded-full text-sm font-semibold">
            OUR JOURNEY
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-[#1D3549]">
            Building Trust Through Quality
          </h2>
          <p className="mt-5 text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Over the years, we have built a reputation for quality, innovation and customer satisfaction.
            Our journey reflects our commitment to continuous improvement and delivering value at every step.
          </p>
        </div>

        {/* Timeline Timeline Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          
          {/* Step 01 */}
          <div className="text-center bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#1CA16B] text-white flex items-center justify-center text-xl font-bold shadow-lg">
              01
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[#1D3549]">
              Started
            </h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Our journey began with a simple vision: to provide customers with reliable products,
              exceptional quality and outstanding service.
            </p>
          </div>

          {/* Step 02 */}
          <div className="text-center bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#1CA16B] text-white flex items-center justify-center text-xl font-bold shadow-lg">
              02
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[#1D3549]">
              Expanded
            </h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              As customer trust grew, we expanded our product range and strengthened our presence
              across multiple industries and markets.
            </p>
          </div>

          {/* Step 03 */}
          <div className="text-center bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#1CA16B] text-white flex items-center justify-center text-xl font-bold shadow-lg">
              03
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[#1D3549]">
              Today
            </h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Today, we continue to deliver innovative solutions, premium products and long-term
              value to businesses and customers.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}