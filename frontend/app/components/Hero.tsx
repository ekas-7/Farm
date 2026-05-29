"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const numeric = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");
  const count = useCountUp(numeric, 1600, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-left">
      <p className="text-2xl font-extrabold text-[#1a1f3d]">
        {visible ? `${count}${suffix}` : value}
      </p>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative grid items-center gap-10 pb-20 pt-8 md:grid-cols-2 md:gap-16"
    >
      {/* Left */}
      <div
        className={`flex w-full flex-col items-start text-left transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Direct from Farm · Punjab, India
        </div>

        <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-[#1a1f3d] md:text-5xl lg:text-[3.75rem]">
          Fresh Crops,<br />
          <span className="text-green-600">Direct from Farmers</span>
        </h1>

        <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-500 md:text-lg">
          AgriGet connects Punjab&apos;s farmers with businesses and consumers. Buy in bulk for your MSME or order retail — no middlemen, always fresh.
        </p>

        {/* Stats row with count-up */}
        <div className="mt-8 flex flex-wrap gap-6">
          <AnimatedStat value="500+" label="Farmers" />
          <AnimatedStat value="12000+" label="Orders Fulfilled" />
          <AnimatedStat value="98%" label="Fresh Guarantee" />
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {["WhatsApp Enabled", "Direct Delivery", "Farm Fresh"].map((badge, i) => (
            <span
              key={badge}
              className="rounded-full border border-[#c8cdd3] bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition-all duration-300 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <a
            href="#listings"
            className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-95"
          >
            Browse Crops →
          </a>
          <a
            href="https://wa.me/919877263109"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-[#c8cdd3] bg-white px-6 py-3 text-sm font-semibold text-[#1a1f3d] shadow-sm transition hover:bg-green-50 hover:border-green-300"
          >
            <span className="h-2 w-2 rounded-full bg-[#25D366]" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Right — hero image */}
      <div
        className={`relative flex items-center justify-center transition-all duration-700 delay-200 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="relative h-[420px] w-full overflow-hidden rounded-3xl shadow-2xl group">
          <Image
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&q=80&fit=crop"
            fill
            alt="Farmer in a lush green field in Punjab"
            className="object-cover transition duration-700 group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Floating card */}
          <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm animate-float">
            <div className="h-10 w-10 overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=80&q=80&fit=crop"
                width={40}
                height={40}
                alt="Fresh wheat"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1a1f3d]">Wheat — Grade A</p>
              <p className="text-xs text-gray-500">₹28/kg · Ludhiana, Punjab</p>
            </div>
            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700 animate-pulse">LIVE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
