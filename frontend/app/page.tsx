import Header from "./components/Header";
import Hero from "./components/Hero";
import Steps from "./components/Steps";
import WorkItems from "./components/WorkItems";
import Download from "./components/Download";
import Footer from "./components/Footer";
import { steps, workItems } from "./data/home";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EDF0ED] text-[#1a1f3d]">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-6 pb-24">
        <Hero />
        <Steps steps={steps} />
        <WorkItems items={workItems} />
        <Download />
      </main>

      <Footer />
    </div>
  );
}
