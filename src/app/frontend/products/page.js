import ProductsBanner from "@/components/frontend/products/ProductsBanner";
import ProductsContent from "@/components/frontend/products/ProductsContent";

// ======================
// CMS DATA
// ======================
async function getCms() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cms`, {
    cache: "no-store",
  });

  const cms = await res.json();

  return cms.find((item) => item.slug === "products");
}

// ======================
// SEO
// ======================
export async function generateMetadata() {
  const cms = await getCms();

  if (!cms) {
    return {
      title: "Products",
      description: "",
    };
  }

  return {
    title: cms.metaTitle || cms.title,
    description: cms.metaDescription || "",
  };
}

// ======================
// PAGE
// ======================
export default async function ProductsPage() {
  const cms = await getCms();

  const productsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cms?.title || "Products",
    description: cms?.metaDescription || "",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/frontend/products`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productsSchema),
        }}
      />

      <ProductsBanner />
      <ProductsContent />
    </>
  );
}