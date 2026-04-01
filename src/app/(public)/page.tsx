import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Gallery from "@/components/sections/Gallery";
import Pricing from "@/components/sections/Pricing";
import Blog from "@/components/sections/Blog";
import Calendar from "@/components/sections/Calendar";
import Contact from "@/components/sections/Contact";
import Company from "@/components/sections/Company";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Gallery />
      <Pricing />
      <Blog />
      <Calendar />
      <Contact />
      <Company />
    </main>
  );
}
