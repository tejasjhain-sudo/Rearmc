import type { Metadata } from "next";
import TierListPage from "@/components/TierListPage";

export const metadata: Metadata = {
  title: "Tier List | RearMC – India's Competitive Minecraft PvP Server",
  description:
    "View the official RearMC player tier list. See where every player ranks across Sword, Axe, NethPot, DPot, UHC, SMP, Crystal, and Mace.",
};

export default function TierList() {
  return <TierListPage />;
}
