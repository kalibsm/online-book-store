"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { categoriesApi, Category, bookImageUrl } from "@/lib/api";

// Fallback images for categories that have no image set
import engineringBooksImage from "@/public/images/engineering-books.png";
import higherEducationImage from "@/public/images/higherEducation.png";
import booksManagementsImage from "@/public/images/bookManagements.png";
import { StaticImageData } from "next/image";

const fallbackImages: StaticImageData[] = [
  higherEducationImage,
  booksManagementsImage,
  engineringBooksImage,
];

const TopCategories = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    categoriesApi.list().catch(() => []).then((cats) => {
      if (Array.isArray(cats)) setCategories(cats);
    });
  }, []);

  const displayed = categories.slice(startIndex, startIndex + 3);

  function prev() {
    setStartIndex((i) => Math.max(0, i - 3));
  }

  function next() {
    setStartIndex((i) => Math.min(Math.max(0, categories.length - 3), i + 3));
  }

  return (
    <section className="px-14 py-4 bg-white">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="lg:w-1/2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-[2px] bg-orange-500"></div>
              <span className="text-orange-500 text-sm font-medium uppercase tracking-wide">
                Categories
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#393280] mb-8">
              Explore our Top Categories
            </h2>
            <div className="flex gap-3">
              <button
                onClick={prev}
                disabled={startIndex === 0}
                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={next}
                disabled={startIndex + 3 >= categories.length}
                className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-40"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="lg:w-1/2">
            <p className="text-gray-600 leading-relaxed">
              Browse our curated selection of book categories — from academic textbooks and
              professional development to fiction, science fiction, and more. Find your next
              favourite read across all genres.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {(displayed.length > 0 ? displayed : fallbackImages.map((img, i) => ({
            id: String(i),
            name: ["Higher Education", "Management Books", "Engineering Books"][i],
            slug: "",
            description: "",
            image: null,
            book_count: 0,
            _fallback: img,
          } as Category & { _fallback?: StaticImageData }))).map((cat, idx) => {
            const extCat = cat as Category & { _fallback?: StaticImageData };
            const imgSrc = extCat._fallback ?? (cat.image ? bookImageUrl(cat.image) : fallbackImages[idx % fallbackImages.length]);
            return (
              <div
                key={cat.id}
                className="group cursor-pointer"
                onClick={() => cat.slug && router.push(`/books?category=${cat.slug}`)}
              >
                <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={imgSrc}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized={typeof imgSrc === "string" && !imgSrc.startsWith("/")}
                  />
                </div>
                <h3 className="text-2xl font-bold text-[#393280] mb-3 text-center">{cat.name}</h3>
                <p className="text-gray-600 text-center leading-relaxed text-sm">
                  {cat.description || "Explore our curated collection in this category."}
                </p>
                {cat.book_count > 0 && (
                  <p className="text-center text-xs text-muted-foreground mt-1">
                    {cat.book_count} {cat.book_count === 1 ? "book" : "books"}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => router.push("/books")}
            variant="outline"
            size="lg"
            className="cursor-pointer border-2 border-[#393280] text-[#393280] hover:bg-[#393280] hover:text-white px-8 py-6 text-base font-medium rounded-lg group bg-transparent"
          >
            VIEW MORE
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TopCategories;
