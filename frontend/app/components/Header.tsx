import React from "react";

export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 sm:px-6 sm:py-10">
      <div className="leading-none">
        <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">QUICK</p>
        <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">BITE</p>
      </div>
      <div className="flex items-center gap-2 text-sm sm:gap-4">
        <button className="rounded-full border border-[#c8cdd3] bg-white px-4 py-2 font-medium shadow-sm transition-all hover:bg-[#f2f4f3] hover:shadow-md active:scale-95 sm:px-6">
          Sign in
        </button>
        <button className="rounded-full bg-[#1a1f3d] px-4 py-2 font-medium text-white shadow-sm transition-all hover:bg-[#2a2f4d] hover:shadow-md active:scale-95 sm:px-6">
          Sign up
        </button>
      </div>
    </header>
  );
}
