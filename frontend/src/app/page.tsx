import { Hero } from "@/components/sections/Hero";
import { Categories } from "@/components/sections/Categories";
import { BestSellers } from "@/components/sections/BestSellers";
import { WhyShramasa } from "@/components/sections/WhyShramasa";
import { Newsletter } from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <BestSellers />
      <WhyShramasa />
      <Newsletter />
    </main>
  );
}
