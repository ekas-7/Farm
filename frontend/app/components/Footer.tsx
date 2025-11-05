import React from "react";

export default function Footer() {
  return (
    <footer className="bg-green-50 border-t border-green-200">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="leading-none">
              <p className="text-2xl font-extrabold leading-none tracking-tight text-green-700">AgriGet</p>
              <p className="text-sm text-gray-600">Farm to Market</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 max-w-xs">
            Connecting farmers directly with businesses and consumers for fresh, quality produce.
          </p>
        </div>
        <div className="grid flex-1 gap-10 text-sm text-gray-700 md:grid-cols-3">
          <div>
            <h4 className="text-base font-semibold text-green-700">For Users</h4>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li><a href="#" className="transition-colors hover:text-green-700">Browse Products</a></li>
              <li><a href="#" className="transition-colors hover:text-green-700">Bulk Orders (B2B)</a></li>
              <li><a href="#" className="transition-colors hover:text-green-700">Retail Shopping</a></li>
              <li><a href="#" className="transition-colors hover:text-green-700">How It Works</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-green-700">For Farmers</h4>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li><a href="#" className="transition-colors hover:text-green-700">Register as Farmer</a></li>
              <li><a href="#" className="transition-colors hover:text-green-700">Dashboard</a></li>
              <li><a href="#" className="transition-colors hover:text-green-700">List Products</a></li>
              <li><a href="#" className="transition-colors hover:text-green-700">Pricing Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-green-700">Support</h4>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li><a href="#" className="transition-colors hover:text-green-700">Help Center</a></li>
              <li><a href="#" className="transition-colors hover:text-green-700">WhatsApp Support</a></li>
              <li><a href="#" className="transition-colors hover:text-green-700">Contact Us</a></li>
              <li><a href="#" className="transition-colors hover:text-green-700">FAQs</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-green-200 bg-green-100">
        <div className="mx-auto max-w-6xl px-6 py-4 text-center text-sm text-gray-600">
          © 2025 AgriGet. Bridging farms and markets. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
