import FeaturedBooks from "@/components/FeaturedBooks";
import HeroSection from "@/components/HeroSection";
import TopCategories from "@/components/TopCategories";

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
