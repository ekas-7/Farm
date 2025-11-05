import Image from "next/image";


export default function Hero() {
  return (
    <section className="grid items-center gap-12 pb-16 pt-6 md:grid-cols-[160px,1fr,160px]">
      <div className="mx-auto h-40 w-40">
        <Image
          src="/hero1.png"
          width={160}
          height={160}
          alt="Lemon drink illustration"
          className="h-full w-full object-contain"
          priority
        />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
          The quickest way to find the perfect bite
        </h1>
        <form className="mt-8 flex w-full max-w-xl items-center gap-3 rounded-full border border-[#c8cdd3] bg-white px-6 py-2 shadow-sm">
          <input
            type="text"
            placeholder="Delivery address"
            className="flex-1 border-none bg-transparent text-sm text-[#1a1f3d] outline-none placeholder:text-[#9aa0a6]"
          />
          <button
            type="submit"
            className="rounded-md bg-[#1a1f3d] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2a2f4d]"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mx-auto h-40 w-40">
        <Image
          src="/hero2.png"
          width={160}
          height={160}
          alt="Pizza illustration"
          className="h-full w-full object-contain"
          priority
        />
      </div>
    </section>
  );
}
