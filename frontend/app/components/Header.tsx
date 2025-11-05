import React from "react";

export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 sm:py-10">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white font-bold text-xl sm:h-12 sm:w-12">
          🌾
        </div>
        <div className="leading-none">
          <p className="text-2xl font-extrabold tracking-tight text-green-700 sm:text-3xl">AgriGet</p>
          <p className="text-xs text-gray-600 sm:text-sm">Farm to Market</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm sm:gap-4">
        <button className="rounded-full border border-[#c8cdd3] bg-white px-4 py-2 font-medium shadow-sm transition-all hover:bg-[#f2f4f3] hover:shadow-md active:scale-95 sm:px-6">
          Sign in
        </button>
        <button className="rounded-full bg-green-600 px-4 py-2 font-medium text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md active:scale-95 sm:px-6">
          Get Started
        </button>
      </div>
    </header>
  );
}
