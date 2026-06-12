"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Dynamic Navigation Menu Items Configuration
const MENU_ITEMS = [
  { label: "Home", href: "/frontend" },
  { label: "About Us", href: "/frontend/about-us" },
  { label: "Products", href: "/frontend/products" },
  { label: "Contact Us", href: "/frontend/contact-us" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  // Fetch Global Configuration/Settings on Mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/settings");
        const result = await response.json();
        
        if (result.success) {
          setSettings(result.data);
        }
      } catch (error) {
        console.error("Failed fetching header settings:", error);
      }
    }

    fetchSettings();
  }, []);

  // Helper function to handle active route comparisons accurately
  const isActiveRoute = (href) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-[#1D3549] shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-25">
          
          {/* Logo Section */}
          <Link href="/frontend">
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
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <nav className="flex items-center gap-8">
              {MENU_ITEMS.map((item) => {
                const active = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative font-medium py-2 transition-all duration-300 ${
                      active 
                        ? "text-[#1CA16B]" 
                        : "text-white/80 hover:text-[#1CA16B]"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-[#1CA16B] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden text-3xl text-white focus:outline-none"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#1D3549] border-t border-white/10 shadow-lg">
          <div className="flex flex-col px-4 py-4">
            {MENU_ITEMS.map((item) => {
              const active = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3 border-b border-white/5 font-medium transition ${
                    active 
                      ? "text-[#1CA16B]" 
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/frontend/contact-us"
              onClick={() => setMenuOpen(false)}
              className="mt-4 text-center bg-[#1CA16B] text-white py-3 rounded-lg font-medium hover:bg-[#19535B] transition"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}