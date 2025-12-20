import FeaturedBooks from "@/components/FeaturedBooks";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MainNavbar from "@/components/MainNavbar";
import TopCategories from "@/components/TopCategories";
import TopNavbar from "@/components/TopNavbar";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <main>
        <HeroSection />
        <TopCategories />
        <FeaturedBooks />
      </main>
    </div>
  );
}
