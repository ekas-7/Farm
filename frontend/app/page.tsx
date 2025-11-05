import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EDF0ED]">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="font-bold text-2xl text-[#1a1f3d]">
            <span>QUICK</span>
            <br />
            <span>BITE</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
            Sign in
          </button>
          <button className="px-6 py-2 rounded-md bg-[#1a1f3d] text-white hover:bg-[#2a2f4d] transition-colors">
            Sign up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="relative flex items-center justify-between gap-16">
          {/* Left Image */}
          <div className="relative w-36 h-36 flex-shrink-0">
            <Image
              src="/hero1.png"
              alt="Food illustration"
              width={144}
              height={144}
              className="object-contain"
            />
          </div>

          {/* Center Content */}
          <div className="flex-1 max-w-3xl text-center">
            <h1 className="text-5xl font-bold text-[#1a1f3d] mb-10 leading-tight">
              The quickest way to<br />find the perfect bite
            </h1>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto relative">
              <input
                type="text"
                placeholder="Delivery address"
                className="w-full px-6 py-3 rounded-lg border border-gray-300 pr-32 focus:outline-none focus:ring-2 focus:ring-[#1a1f3d] bg-white"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[#1a1f3d] text-white rounded-md hover:bg-[#2a2f4d] transition-colors text-sm">
                Search
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-36 h-36 flex-shrink-0">
            <Image
              src="/hero2.png"
              alt="Food illustration"
              width={144}
              height={144}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <details className="border-t border-gray-300 py-10" open>
          <summary className="text-2xl font-semibold text-[#1a1f3d] cursor-pointer list-none flex justify-between items-center hover:text-gray-700">
            How it works
            <span className="text-2xl transform transition-transform">›</span>
          </summary>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mt-16 pt-10">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative w-full h-52 mb-8 flex items-center justify-center">
                <Image
                  src="/order.png"
                  alt="Step 1"
                  width={180}
                  height={180}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1f3d] mb-4">Step 1</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Enter your location. Type in your address, or pin your location by enabling location services.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center md:border-l md:border-r border-gray-200 md:px-12">
              <div className="relative w-full h-52 mb-8 flex items-center justify-center">
                <Image
                  src="/restarant.png"
                  alt="Step 2"
                  width={180}
                  height={180}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1f3d] mb-4">Step 2</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Now select a restaurant and a menu item. You're one step closer to the perfect quick bite.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative w-full h-52 mb-8 flex items-center justify-center">
                <Image
                  src="/window.svg"
                  alt="Step 3"
                  width={180}
                  height={180}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1f3d] mb-4">Step 3</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Settle your payment. Then, sit back and relax as we make your food ready!
              </p>
            </div>
          </div>
        </details>
      </section>

      {/* Work with QuickBite Section */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <details className="border-t border-gray-300 py-10" open>
          <summary className="text-2xl font-semibold text-[#1a1f3d] cursor-pointer list-none flex justify-between items-center hover:text-gray-700">
            Work with QuickBite
            <span className="text-2xl transform transition-transform">›</span>
          </summary>
          
          <div className="space-y-20 mt-16 pt-10">
            {/* As a rider */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center border-b border-gray-200 pb-20">
              <div className="md:col-span-4 flex justify-center">
                <Image
                  src="/scooter.png"
                  alt="Scooter"
                  width={220}
                  height={180}
                  className="object-contain"
                />
              </div>
              <div className="md:col-span-5 text-center md:text-left">
                <h3 className="text-2xl font-semibold text-[#1a1f3d] mb-5">As a rider</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-base">
                  Earn money by delivering food from restaurants. All you need are the skills and a bike.
                </p>
                <button className="px-7 py-3 rounded-md border-2 border-[#1a1f3d] text-[#1a1f3d] hover:bg-[#1a1f3d] hover:text-white transition-colors">
                  Ride with us
                </button>
              </div>
              <div className="md:col-span-3"></div>
            </div>

            {/* As a partner */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center border-b border-gray-200 pb-20">
              <div className="md:col-span-3 order-1 md:order-1"></div>
              <div className="md:col-span-5 order-3 md:order-2 text-center md:text-right">
                <h3 className="text-2xl font-semibold text-[#1a1f3d] mb-5">As a partner</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-base">
                  QuickBite helps restaurants grow with online ordering, loyalty programs, and more.
                </p>
                <button className="px-7 py-3 rounded-md border-2 border-[#1a1f3d] text-[#1a1f3d] hover:bg-[#1a1f3d] hover:text-white transition-colors">
                  Partner with us
                </button>
              </div>
              <div className="md:col-span-4 order-2 md:order-3 flex justify-center">
                <Image
                  src="/restarant.png"
                  alt="Restaurant"
                  width={220}
                  height={180}
                  className="object-contain"
                />
              </div>
            </div>

            {/* As a colleague */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center pb-10">
              <div className="md:col-span-4 flex justify-center">
                <Image
                  src="/colluge.png"
                  alt="Colleague"
                  width={220}
                  height={180}
                  className="object-contain"
                />
              </div>
              <div className="md:col-span-5 text-center md:text-left">
                <h3 className="text-2xl font-semibold text-[#1a1f3d] mb-5">As a colleague</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-base">
                  Be part of a team that's building a top-notch delivery service.
                </p>
                <button className="px-7 py-3 rounded-md border-2 border-[#1a1f3d] text-[#1a1f3d] hover:bg-[#1a1f3d] hover:text-white transition-colors">
                  Work with us
                </button>
              </div>
              <div className="md:col-span-3"></div>
            </div>
          </div>
        </details>
      </section>

      {/* Download our app Section */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <details className="border-t border-gray-300 py-10" open>
          <summary className="text-2xl font-semibold text-[#1a1f3d] cursor-pointer list-none flex justify-between items-center hover:text-gray-700">
            Download our app
            <span className="text-2xl transform transition-transform">›</span>
          </summary>
          
          <div className="mt-16 pt-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-16">
              <div className="flex-1 text-center md:text-left max-w-xl">
                <h3 className="text-2xl font-semibold text-[#1a1f3d] mb-5">Order easily!</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-base">
                  Get the most delicious bites delivered to you faster with QuickBite, our fastest delivery service carries a variety of cuisines from local restaurants!
                </p>
                <button className="px-8 py-3 rounded-md bg-[#1a1f3d] text-white hover:bg-[#2a2f4d] transition-colors">
                  Download
                </button>
              </div>
              <div className="flex items-center gap-10">
                <div className="relative w-44 h-44">
                  <Image
                    src="/hero2.png"
                    alt="Food illustration"
                    width={176}
                    height={176}
                    className="object-contain"
                  />
                </div>
                <div className="relative w-40 h-60">
                  <Image
                    src="/hero1.png"
                    alt="Mobile app"
                    width={160}
                    height={240}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </details>
      </section>

      {/* Footer */}
      <footer className="bg-[#c8d5c0] mt-16">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo */}
            <div>
              <div className="font-bold text-2xl text-[#1a1f3d] mb-4">
                <span>QUICK</span>
                <br />
                <span>BITE</span>
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold text-[#1a1f3d] mb-4">Social</h4>
              <ul className="space-y-2 text-gray-700">
                <li><a href="#" className="hover:text-[#1a1f3d]">Facebook</a></li>
                <li><a href="#" className="hover:text-[#1a1f3d]">Instagram</a></li>
                <li><a href="#" className="hover:text-[#1a1f3d]">LinkedIn</a></li>
              </ul>
            </div>

            {/* Get help */}
            <div>
              <h4 className="font-semibold text-[#1a1f3d] mb-4">Get help</h4>
              <ul className="space-y-2 text-gray-700">
                <li><a href="#" className="hover:text-[#1a1f3d]">Partner with us</a></li>
                <li><a href="#" className="hover:text-[#1a1f3d]">Add your restaurant</a></li>
                <li><a href="#" className="hover:text-[#1a1f3d]">Sign up to deliver</a></li>
              </ul>
            </div>

            {/* Read our blog */}
            <div>
              <h4 className="font-semibold text-[#1a1f3d] mb-4">Read our blog</h4>
              <ul className="space-y-2 text-gray-700">
                <li><a href="#" className="hover:text-[#1a1f3d]">Company</a></li>
                <li><a href="#" className="hover:text-[#1a1f3d]">Restaurants nearby</a></li>
                <li><a href="#" className="hover:text-[#1a1f3d]">Save on first order</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
