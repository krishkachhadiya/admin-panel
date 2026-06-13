import ContactBanner from "@/components/frontend/contact-us/ContactBanner";
import ContactInfo from "@/components/frontend/contact-us/ContactInfo";
import ContactForm from "@/components/frontend/contact-us/ContactForm";
import ContactMap from "@/components/frontend/contact-us/ContactMap";

// ======================
// CMS DATA
// ======================
async function getCms() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cms`, {
    cache: "no-store",
  });

  const cms = await res.json();

  return cms.find((item) => item.slug === "contact-us");
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
      title: "Contact Us",
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
export default async function ContactPage() {
  const cms = await getCms();
  const settings = await getSettings();

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: cms.metatitle,
    description: cms.metaDescription,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/frontend/contact-us`,
    mainEntity: {
      "@type": "Organization",
      name: settings.companyName,
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}${settings.logo}`,
      },
      email: settings.email,
      telephone: settings.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
      />

      <ContactBanner />
      <ContactInfo />
      <ContactForm />
      <ContactMap />
    </>
  );
}