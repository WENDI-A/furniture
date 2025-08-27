import React from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/lib/utils";
import {
  Sparkles,
  ShieldCheck,
  Leaf,
  Users,
  Truck,
  Heart
} from "lucide-react";

function About() {
  const showcase = [
    getImageUrl("ContemporarySofa.jpg"),
    getImageUrl("ModernTable.jpg"),
    getImageUrl("AvantGardeLamp.jpg")
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 ring-1 ring-blue-200">
              <Sparkles className="w-3.5 h-3.5" />
              Since 2016
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
              Comfort-first furniture for modern living
            </h1>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              We design and curate timeless pieces that elevate your space and
              simplify everyday life. Quality materials, human-centered design, and
              sustainable processes—without the premium fuss.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/product"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Browse Products
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-blue-700 font-semibold ring-1 ring-blue-200 hover:bg-blue-50 transition-colors"
              >
                View Cart
              </Link>
            </div>

            {/* Quick stats */}
            <dl className="mt-10 grid grid-cols-3 gap-4 sm:gap-6">
              <div className="rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
                <dt className="text-xs text-gray-500">Happy customers</dt>
                <dd className="mt-1 text-xl font-bold">25k+</dd>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
                <dt className="text-xs text-gray-500">Products delivered</dt>
                <dd className="mt-1 text-xl font-bold">120k+</dd>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
                <dt className="text-xs text-gray-500">Avg. rating</dt>
                <dd className="mt-1 text-xl font-bold">4.8/5</dd>
              </div>
            </dl>
          </div>

          {/* Mosaic */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <img src={showcase[0]} alt="Sofa" className="col-span-2 h-64 md:h-80 w-full object-cover rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-800" />
            <img src={showcase[1]} alt="Table" className="row-span-2 h-64 md:h-full w-full object-cover rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-800" />
            <img src={showcase[2]} alt="Lamp" className="col-span-2 h-40 md:h-44 w-full object-cover rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-800" />
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Our mission</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              We believe comfort isn’t a luxury—it’s a lifestyle. Every curve,
              fabric, and finish we choose is carefully considered to bring calm and
              clarity to your home. We build long-lasting pieces with responsible
              materials and trusted craftsmanship.
            </p>
            <ul className="mt-6 space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                <span>Durable materials and stress-tested construction</span>
              </li>
              <li className="flex items-start gap-3">
                <Leaf className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Responsible sourcing and reduced packaging waste</span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="w-5 h-5 text-indigo-600 mt-0.5" />
                <span>Human-centered design for everyday living</span>
              </li>
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 via-indigo-100 to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-black blur-2xl opacity-60 rounded-3xl" />
            <div className="relative rounded-3xl bg-white/70 dark:bg-gray-900/70 p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
              <blockquote className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                “At Comfy, our goal is simple: create beautiful, reliable furniture that
                genuinely improves the way people live at home.”
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-600/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="font-semibold">The Comfy Team</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Design • Engineering • Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center">What we value</h3>
          <p className="mt-3 text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Principles that shape our products and your experience.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl ring-1 ring-gray-100 dark:ring-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-700" />
              </div>
              <h4 className="mt-4 font-semibold">Timeless design</h4>
              <p className="mt-2 text-gray-600 text-sm">
                Minimal aesthetics and practical forms that age gracefully.
              </p>
            </div>

            <div className="p-6 rounded-2xl ring-1 ring-gray-100 dark:ring-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="h-10 w-10 rounded-lg bg-green-600/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-green-700" />
              </div>
              <h4 className="mt-4 font-semibold">Sustainability</h4>
              <p className="mt-2 text-gray-600 text-sm">
                Responsible sourcing and packaging with a smaller footprint.
              </p>
            </div>

            <div className="p-6 rounded-2xl ring-1 ring-gray-100 dark:ring-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="h-10 w-10 rounded-lg bg-indigo-600/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-700" />
              </div>
              <h4 className="mt-4 font-semibold">Human comfort</h4>
              <p className="mt-2 text-gray-600 text-sm">
                Ergonomic proportions and soft-touch finishes for daily use.
              </p>
            </div>

            <div className="p-6 rounded-2xl ring-1 ring-gray-100 dark:ring-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="h-10 w-10 rounded-lg bg-rose-600/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-700" />
              </div>
              <h4 className="mt-4 font-semibold">Long-lasting quality</h4>
              <p className="mt-2 text-gray-600 text-sm">
                Built to be used—and loved—every day, for years.
              </p>
            </div>

            <div className="p-6 rounded-2xl ring-1 ring-gray-100 dark:ring-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="h-10 w-10 rounded-lg bg-amber-600/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
              </div>
              <h4 className="mt-4 font-semibold">Honest warranty</h4>
              <p className="mt-2 text-gray-600 text-sm">
                Straightforward guarantees and responsive support.
              </p>
            </div>

            <div className="p-6 rounded-2xl ring-1 ring-gray-100 dark:ring-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="h-10 w-10 rounded-lg bg-cyan-600/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-cyan-700" />
              </div>
              <h4 className="mt-4 font-semibold">Reliable delivery</h4>
              <p className="mt-2 text-gray-600 text-sm">
                Fast, careful shipping and clear order tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h3 className="text-2xl md:text-3xl font-bold">
                Ready to refresh your space?
              </h3>
              <p className="mt-2 text-blue-100">
                Explore our curated collection and find pieces that fit your life,
                your style, and your budget.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Link
                to="/product"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-blue-700 font-semibold shadow-sm hover:bg-blue-50 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
