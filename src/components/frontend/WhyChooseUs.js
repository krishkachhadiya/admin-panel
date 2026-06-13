import Image from "next/image";

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">

      <div className="max-w-7xl mx-auto px-4 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Content */}

          <div className="order-2 lg:order-1">
            <span className="inline-block bg-[#1CA16B]/10 text-[#1CA16B] px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
              Why Choose Us
            </span>

            <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D3549] leading-tight">
              Built On Quality,
              <br />
              Trust & Innovation
            </h2>

            <p className="mt-6 text-base md:text-lg text-gray-600 leading-relaxed">
              We are committed to delivering high-quality
              products and exceptional service that help
              businesses achieve long-term success.
            </p>

            <div className="mt-10 space-y-6">

              <div className="flex gap-4">

                <div className="  w-8  h-8  rounded-full  bg-[#1CA16B]/10  flex  items-center  justify-center  text-[#1CA16B]  font-bold  shrink-0">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-[#1D3549]">
                    Premium Quality Products
                  </h3>

                  <p className="text-gray-600 mt-1">
                    Carefully selected products with reliable performance.
                  </p>
                </div>

              </div>

              <div className="flex gap-4">

                <div className=" w-8 h-8 rounded-full bg-[#1CA16B]/10 flex items-center justify-center text-[#1CA16B] font-bold shrink-0">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-[#1D3549]">
                    Fast Delivery
                  </h3>

                  <p className="text-gray-600 mt-1">
                    Efficient logistics and quick order fulfillment.
                  </p>
                </div>

              </div>

              <div className="flex gap-4">

                <div className="  w-8  h-8  rounded-full  bg-[#1CA16B]/10  flex  items-center  justify-center  text-[#1CA16B]  font-bold  shrink-0">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-[#1D3549]">
                    Expert Support
                  </h3>

                  <p className="text-gray-600 mt-1">
                    Professional assistance whenever you need it.
                  </p>
                </div>

              </div>

              <div className="flex gap-4">

                <div className="  w-8  h-8  rounded-full  bg-[#1CA16B]/10  flex  items-center  justify-center  text-[#1CA16B]  font-bold  shrink-0">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-[#1D3549]">
                    Trusted Service
                  </h3>

                  <p className="text-gray-600 mt-1">
                    Building long-term relationships with customers.
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* Image */}

          <div className="order-1 lg:order-2 flex justify-center">
            <Image
              src="/why-us.png"
              alt="Why Choose Us"
              width={600}
              height={700}
              priority
              className="  w-full  max-w-md  lg:max-w-full  h-auto  rounded-3xl"
            />

          </div>

        </div>

      </div>

    </section>
  );
}