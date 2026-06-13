export default function ProductDescription({
  product,
}) {

  if (
    !product.description
  ) {
    return null;
  }

  return (

    <section className="py-12 bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="mb-8">

          <span className="inline-block bg-[#1CA16B]/10 text-[#1CA16B] px-4 py-2 rounded-full text-sm font-semibold">

            PRODUCT OVERVIEW

          </span>

          <h2 className="mt-4 text-4xl font-bold text-[#1D3549]">

            Description

          </h2>

        </div>

        <div className="  bg-white  rounded-3xl  border  border-gray-200  shadow-sm  p-8">

          <div
            className="  prose  max-w-none  text-gray-700"
            dangerouslySetInnerHTML={{
              __html:
                product.description,
            }}
          />

        </div>

      </div>

    </section>

  );

}