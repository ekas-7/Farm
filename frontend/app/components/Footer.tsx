import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#c8d5c0]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-3xl font-extrabold leading-none tracking-tight text-[#1a1f3d]">QUICK</p>
          <p className="text-3xl font-extrabold leading-none tracking-tight text-[#1a1f3d]">BITE</p>
        </div>
        <div className="grid flex-1 gap-10 text-sm text-[#1a1f3d] md:grid-cols-3">
          <div>
            <h4 className="text-base font-semibold">Social</h4>
            <ul className="mt-4 space-y-2 text-[#4b5563]">
              <li><a href="#" className="transition-colors hover:text-[#1a1f3d]">Facebook</a></li>
              <li><a href="#" className="transition-colors hover:text-[#1a1f3d]">Instagram</a></li>
              <li><a href="#" className="transition-colors hover:text-[#1a1f3d]">LinkedIn</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold">Get help</h4>
            <ul className="mt-4 space-y-2 text-[#4b5563]">
              <li><a href="#" className="transition-colors hover:text-[#1a1f3d]">Partner with us</a></li>
              <li><a href="#" className="transition-colors hover:text-[#1a1f3d]">Add your restaurant</a></li>
              <li><a href="#" className="transition-colors hover:text-[#1a1f3d]">Sign up to deliver</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold">Resources</h4>
            <ul className="mt-4 space-y-2 text-[#4b5563]">
              <li><a href="#" className="transition-colors hover:text-[#1a1f3d]">Read our blog</a></li>
              <li><a href="#" className="transition-colors hover:text-[#1a1f3d]">Restaurants nearby</a></li>
              <li><a href="#" className="transition-colors hover:text-[#1a1f3d]">Save on first order</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
