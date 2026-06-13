import ProductDetailsBanner from "@/components/frontend/products/ProductDetailsBanner";
import ProductDetailsContent from "@/components/frontend/products/ProductDetailsContent";

// ==========================================
// DATA FETCHING HELPERS (SERVER-SIDE)
// ==========================================

async function getSettings() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/settings`, {
    cache: "no-store",
  });
  const result = await res.json();
  return result.data;
}

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/categories`, {
    cache: "no-store",
  });
  return await res.json();
}

async function getProduct(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products`, {
    cache: "no-store",
  });
  const products = await res.json();
  return products.find((item) => item.slug === slug);
}

function getCategoryName(categories, categoryId) {
  // Safe array check in case API response changes structure
  const categoryList = Array.isArray(categories) ? categories : categories?.data || [];
  const category = categoryList.find((item) => String(item.id) === String(categoryId));
  return category?.title || "";
}

function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ==========================================
// DYNAMIC METADATA GENERATOR (SEO)
// ==========================================

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "Requested product not found.",
    };
  }

  const image = product.images?.[0]
    ? `${process.env.NEXT_PUBLIC_SITE_URL}${product.images[0]}`
    : `${process.env.NEXT_PUBLIC_SITE_URL}${product.thumbnail || ""}`;

  const title = product.metaTitle || product.title;
  const description = product.metaDescription || stripHtml(product.description);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  
  // Concurrent fetching to maximize loading performance
  const [product, settings, categories] = await Promise.all([
    getProduct(slug),
    getSettings(),
    getCategories()
  ]);

  // Fallback check if product doesn't exist
  if (!product) {
    return <div className="text-center py-20 text-gray-500">Product not found.</div>;
  }

  // Schema.org Product Structured Data
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
    name: product.title,
    description: product.metaDescription || stripHtml(product.description),
    sku: String(product.id),
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
    image: product.images?.map((img) => `${process.env.NEXT_PUBLIC_SITE_URL}${img}`) || [],
    category: getCategoryName(categories, product.category),
    brand: {
      "@type": "Brand",
      name: settings?.companyName || "LOTAS",
    },
    offers: {
      "@type": "Offer",
      availability: product.status === "active" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", // Valid schema.org absolute URLs
      itemCondition: "https://schema.org/NewCondition",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
    },
  };

  // Schema.org Breadcrumb Navigation Data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/frontend/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ProductDetailsBanner />
      <ProductDetailsContent slug={slug} />
    </>
  );
}