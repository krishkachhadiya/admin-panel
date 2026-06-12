"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Static Hero Slide Configurations
const HERO_SLIDES = [
  { image: "/hero.png", category: "fashion" },
  { image: "/slide_2.png", category: "electronics" },
  { image: "/slide_1.png", category: "furniture" },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);

  // Auto-playing Slideshow Controller Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        setFade(true);
      }, 400); // Wait for fade-out transition duration
    }, 4000); // Change slides every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Interactive Image Slider Column */}
          <div className="order-1 lg:order-2">
            <Link href={`/frontend/products?category=${HERO_SLIDES[currentSlide].category}`}>
              <div className="overflow-hidden rounded-3xl shadow-xl cursor-pointer bg-gray-50">
                <Image
                  src={HERO_SLIDES[currentSlide].image}
                  alt={`${HERO_SLIDES[currentSlide].category} collection banner`}
                  width={700}
                  height={500}
                  priority // Drastically improves initial Largest Contentful Paint (LCP) performance metrics
                  className={`w-full h-auto object-cover hover:scale-105 transition-all duration-700 ease-in-out ${
                    fade ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </Link>

            {/* Slider Interface Dot Controls */}
            <div className="flex justify-center gap-2 mt-4">
              {HERO_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFade(false);
                    setTimeout(() => {
                      setCurrentSlide(index);
                      setFade(true);
                    }, 200);
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none ${
                    currentSlide === index ? "bg-[#1CA16B] w-8" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Marketing Copy/Content Column */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <span className="inline-block bg-[#1CA16B]/10 text-[#1CA16B] px-4 py-2 rounded-full text-sm font-medium">
              Welcome To Our Company
            </span>

            <h1 className="mt-6 text-3xl md:text-5xl lg:text-6xl font-bold text-[#1D3549] leading-tight">
              Premium Products
              <br />
              For Modern Business
            </h1>

            <p className="mt-5 text-base md:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Delivering high quality products and innovative solutions for customers around the world.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
              <Link
                href="/frontend/products"
                className="bg-[#1D3549] text-white px-6 md:px-8 py-3 rounded-xl hover:bg-[#19535B] transition-colors duration-300 font-medium"
              >
                Explore Products
              </Link>
              <Link
                href="/frontend/contact-us"
                className="border border-[#1CA16B] text-[#1CA16B] px-6 md:px-8 py-3 rounded-xl hover:bg-[#1CA16B] hover:text-white transition-all duration-300 font-medium"
              >
                Contact Us
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}