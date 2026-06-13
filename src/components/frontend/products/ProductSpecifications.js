export default function ProductSpecifications({ product }) {
  const specifications = product.specifications?.filter(Boolean) || [];

  if (specifications.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        <div className="mb-8">
          <span className="inline-block bg-[#1CA16B]/10 text-[#1CA16B] px-4 py-2 rounded-full text-sm font-semibold">
            TECHNICAL DETAILS
          </span>
          <h2 className="mt-4 text-4xl font-bold text-[#1D3549]">
            Specifications
          </h2>
        </div>

        {/* Specifications Data Grid */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
          {specifications.map((specification, index) => {
            const [key, value] = specification.split(":");

            return (
              <div
                key={index}
                className="grid grid-cols-2 border-b border-gray-200 last:border-b-0"
              >
                <div className="bg-gray-50 p-5 font-semibold text-[#1D3549]">
                  {key?.trim()}
                </div>
                <div className="bg-white p-5 text-gray-600">
                  {value?.trim()}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}