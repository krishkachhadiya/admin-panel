import Hero from "@/components/frontend/hero";
import Aboutpre from "@/components/frontend/aboutpre";
import FeaturedCategories from "@/components/frontend/FeaturedCategories";
import FeaturedProducts from "@/components/frontend/FeaturedProducts";
import WhyChooseUs from "@/components/frontend/WhyChooseUs";
import CTA from "@/components/frontend/CTA";

// ======================
// SETTINGS DATA
// ======================
async function getSettings() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/settings`, {
    cache: "no-store",
  });

  const result = await res.json();

  return result.data;
}

// ======================
// MAIN HOME PAGE
// ======================
export default async function HomePage() {
  const settings = await getSettings();

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: settings.companyName,
      url: process.env.NEXT_PUBLIC_SITE_URL,
      logo: `${process.env.NEXT_PUBLIC_SITE_URL}${settings.logo}`,
      email: settings.email,
      telephone: settings.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
        addressCountry: "IN",
      },
      sameAs: [
        settings.facebook,
        settings.instagram,
        settings.linkedin,
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: settings.companyName,
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
  ];

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <Hero />
      <Aboutpre />
      <FeaturedCategories />
      <FeaturedProducts />
      <WhyChooseUs />
      <CTA />
    </div>
  );
}