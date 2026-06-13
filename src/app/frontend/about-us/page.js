import Aboutpre from "@/components/frontend/aboutpre";
import CompanyStory from "@/components/frontend/about/CompanyStory";
import MissionVision from "@/components/frontend/about/MissionVision";
import WhyChooseUs from "@/components/frontend/WhyChooseUs";
import CTA from "@/components/frontend/CTA";

// ======================
// CMS DATA
// ======================
async function getCms() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cms`, {
    cache: "no-store",
  });

  const cms = await res.json();

  return cms.find((item) => item.slug === "about-us");
}

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
// SEO
// ======================
export async function generateMetadata() {
  const cms = await getCms();

  if (!cms) {
    return {
      title: "About Us",
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
export default async function AboutUsPage() {
  const cms = await getCms();
  const settings = await getSettings();

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: cms.title,
    description: cms.metaDescription,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/frontend/about-us`,
    publisher: {
      "@type": "Organization",
      name: settings.companyName,
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}${settings.logo}`,
      },
    },
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutSchema),
        }}
      />

      <Aboutpre />
      <CompanyStory />
      <MissionVision />
      <WhyChooseUs />
      <CTA />
    </div>
  );
}