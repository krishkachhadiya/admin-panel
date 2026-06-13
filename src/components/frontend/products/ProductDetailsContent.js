"use client";

import { useEffect, useState } from "react";
import ProductBreadcrumb from "./ProductBreadcrumb";
import ProductInfo from "./ProductInfo";
import ProductGallery from "./ProductGallery";
import ProductSpecifications from "./ProductSpecifications";
import ProductDescription from "./ProductDescription";
import RelatedProducts from "./RelatedProducts";

export default function ProductDetailsContent({ slug }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        const found = data.find((item) => item.slug === slug);
        
        setProduct(found || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center text-black">
        Loading Product...
      </div>
    );
  }

  if (!product) {
    return (
      <section className="py-20 text-center text-black">
        Product Not Found
      </section>
    );
  }

  return (
    <>
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          
          <ProductBreadcrumb product={product} />

          <div className="grid lg:grid-cols-2 gap-10 mt-8">
            <ProductGallery product={product} />
            <ProductInfo product={product} />
          </div>

        </div>
      </section>

      <ProductSpecifications product={product} />
      <ProductDescription product={product} />
      <RelatedProducts product={product} />
    </>
  );
}