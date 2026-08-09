import type { Metadata } from "next";

import { BestSellers } from "@/components/sections/BestSellers";
import { Categories } from "@/components/sections/Categories";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { RitualKits } from "@/components/sections/RitualKits";
import { ShopByConcern } from "@/components/sections/ShopByConcern";
import { ShramasaFormula } from "@/components/sections/ShramasaFormula";
import { TrustStrip } from "@/components/sections/TrustStrip";

export const metadata: Metadata = {
  title: "Premium Skincare & Haircare",
  description:
    "Shramasa creates thoughtful skincare and haircare rituals with purposeful ingredients for healthy skin and beautiful hair.",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <ShopByConcern />
      <BestSellers />
      <Categories />
      <RitualKits />
      <ShramasaFormula />
      <TrustStrip />
      <FinalCta />
    </main>
  );
}
