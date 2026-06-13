"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProductGallery({ product }) {
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (product.images && product.images.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
          
          {/* Main Image View */}
          <div className="relative h-[320px] md:h-[380px] rounded-2xl overflow-hidden bg-gray-50">
            <Image
              src={activeImage || "/no-image.jpg"}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-4"
            />
          </div>

          {/* Thumbnails Navigation */}
          {product.images?.length > 1 && (
            <div className="flex flex-wrap gap-3 mt-6">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(image)}
                  className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === image
                      ? "border-[#1CA16B]"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}