import Link from "next/link";
import Image from "next/image";

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    return [];
  }
}

async function getSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/settings`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export default async function Footer() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSettings(),
  ]);

  const activeCategories = categories
    .filter((item) => item.status === "active" && item.parent === null)
    .slice(0, 5);

  return (
    <footer className="bg-[#1D3549] text-white border-t-4 border-[#1CA16B]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Company Info */}
          <div className="text-center lg:text-left">
            <Image
              src={settings?.logo || "/logo.png"}
              alt={settings?.companyName || "Logo"}
              width={180}
              height={60}
              className="object-contain mx-auto lg:mx-0"
              style={{
                width: "auto",
                height: "auto",
              }}
            />
            <p className="mt-6 text-gray-300 leading-relaxed">
              Delivering premium products and innovative solutions for modern businesses worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center lg:text-left">
            <h2 className="text-lg font-semibold mb-5 text-white">
              Quick Links
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/frontend"
                  className="text-gray-300 hover:text-[#1CA16B] hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/frontend/about-us"
                  className="text-gray-300 hover:text-[#1CA16B] hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/frontend/products"
                  className="text-gray-300 hover:text-[#1CA16B] hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/frontend/contact-us"
                  className="text-gray-300 hover:text-[#1CA16B] hover:translate-x-1 transition-all duration-300 inline-block"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-semibold mb-5 text-white">
              Categories
            </h3>
            <ul className="space-y-3">
              {activeCategories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/frontend/products?category=${category.slug}`}
                    className="text-gray-300 hover:text-[#1CA16B] hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-semibold mb-5 text-white">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="text-gray-300 hover:text-[#1CA16B] transition">
                📍 {settings?.address}
              </li>
              <li>
                <a
                  href={`tel:${settings?.phone}`}
                  className="inline-block font-medium hover:text-[#1CA16B] transition"
                >
                  📞 {settings?.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings?.email}`}
                  className="inline-block font-medium hover:text-[#1CA16B] transition"
                >
                  📧 {settings?.email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-[#19535B]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              {settings?.copyright || "© 2026 All Rights Reserved."}
            </p>
            <div className="flex gap-6">
              <a
                href={settings?.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#1CA16B] transition"
              >
                Facebook
              </a>
              <a
                href={settings?.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#1CA16B] transition"
              >
                Instagram
              </a>
              <a
                href={settings?.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#1CA16B] transition"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}