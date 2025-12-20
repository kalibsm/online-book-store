"use client";

import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import engineringBooksImage from "@/public/images/engineering-books.png";
import higherEducationImage from "@/public/images/higherEducation.png";
import booksManagementsImage from "@/public/images/bookManagements.png";

const TopCategories = () => {
  return (
    <section className="px-14 py-4 bg-white">
      <div className="w-full">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Left: Title and Navigation */}
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
              <button className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors">
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Right: Description */}
          <div className="lg:w-1/2">
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu
              feugiat amet, libero ipsum enim pharetra hac. Urna commodo, lacus
              ut magna velit eleifend. Amet, quis urna, a eu.Lorem ipsum dolor
              sit amet, consectetur adipiscing elit. Sed eu feugiat amet, libero
              ipsum ipsum dolor sit amet, consectetur adipiscing elit. Sed eu
              feugiat amet, libero ipsum..
            </p>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Higher Education */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-lg">
              <Image
                src={higherEducationImage}
                alt="Higher Education Books"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-2xl font-bold text-[#393280] mb-3 text-center">
              Higher Education
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu
              feugiat amet, libero ipsum enim pharetra hac. Urna commodo, lacus
              ut mat,
            </p>
          </div>

          {/* Management Books */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-lg">
              <Image
                src={booksManagementsImage}
                alt="Management Books"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-2xl font-bold text-[#393280] mb-3 text-center">
              Management Books
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu
              feugiat amet, libero ipsum enim pharetra hac. Urna commodo, lacus
              ut mat,
            </p>
          </div>

          {/* Engineering Books */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-lg">
              <Image
                src={engineringBooksImage}
                alt="Engineering Books"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-2xl font-bold text-[#393280] mb-3 text-center">
              Engineering Books
            </h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu
              feugiat amet, libero ipsum enim pharetra hac. Urna commodo, lacus
              ut mat,
            </p>
          </div>
        </div>

        {/* View More Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-[#393280] text-[#393280] hover:bg-[#393280] hover:text-white px-8 py-6 text-base font-medium rounded-lg group bg-transparent"
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
