"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Heart } from "lucide-react";
import atWargoghic from "@/public/images/at-war-goghic-line.png";
import managementEssentials from "@/public/images/management-essentials.png";
import advancedEngineering from "@/public/images/advanced-engineering-maths.png";
import fatherhoodImage from "@/public/images/fatherhood.png";
import doctorWho from "@/public/images/doctor-who.png";
import slugfest from "@/public/images/slugfest.png";
import timetraveler from "@/public/images/time-time-travelers.png";
import worldofwar from "@/public/images/world-of-war-2020.png";

const books = [
  {
    id: 1,
    title: "2020 World of War",
    author: "Tim Marshall",
    price: 29.99,
    category: "History",
    image: worldofwar,
    rating: 4.5,
  },
  {
    id: 2,
    title: "At War on the Gothic Line",
    author: "Paul Cornish",
    price: 34.99,
    category: "History",
    image: atWargoghic,
    rating: 4.2,
  },
  {
    id: 3,
    title: "The Time Traveler's Handbook",
    author: "Johnny Acton",
    price: 24.99,
    category: "Science Fiction",
    image: timetraveler,
    rating: 4.7,
  },
  {
    id: 4,
    title: "Doctor Who: The Collection",
    author: "BBC Books",
    price: 39.99,
    category: "Science Fiction",
    image: doctorWho,
    rating: 4.8,
  },
  {
    id: 5,
    title: "Slugfest: Marvel vs DC",
    author: "Reed Tucker",
    price: 27.99,
    category: "Comics",
    image: slugfest,
    rating: 4.4,
  },
  {
    id: 6,
    title: "Fatherhood",
    author: "George Dawes Green",
    price: 19.99,
    category: "Fiction",
    image: fatherhoodImage,
    rating: 4.1,
  },
  {
    id: 7,
    title: "Advanced Engineering Mathematics",
    author: "Erwin Kreyszig",
    price: 89.99,
    category: "Engineering",
    image: advancedEngineering,
    rating: 4.6,
  },
  {
    id: 8,
    title: "Business Management Essentials",
    author: "Peter Drucker",
    price: 54.99,
    category: "Management",
    image: managementEssentials,
    rating: 4.5,
  },
];

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  const categories = [
    "all",
    ...Array.from(new Set(books.map((book) => book.category))),
  ];

  const filteredBooks = books
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return a.title.localeCompare(b.title);
    });

  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-[#F5F1ED] py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-0.5 bg-[#FF6B4A]" />
              <span className="text-[#FF6B4A] font-medium">Our Collection</span>
            </div>
            <h1 className="text-5xl font-bold text-[#3D2E7C] mb-4">
              Browse All Books
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our extensive collection of books across all genres and
              categories
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">
                    Price (High to Low)
                  </SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredBooks.length}{" "}
            {filteredBooks.length === 1 ? "book" : "books"}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <div key={book.id} className="group">
                <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden mb-4">
                  <Image
                    src={book.image || "/placeholder.svg"}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                  <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-[#FF6B4A] hover:text-white">
                    <Heart className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      className="w-full bg-[#FF6B4A] hover:bg-[#FF6B4A]/90"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span className="text-yellow-500">★</span>
                    <span>{book.rating}</span>
                  </div>
                  <h3 className="font-semibold text-[#3D2E7C] line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {book.author}
                  </p>
                  <p className="text-lg font-bold text-[#FF6B4A]">
                    ${book.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No books found matching your criteria
              </p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Pagination would go here */}
      <section className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="default" size="sm" className="bg-[#3D2E7C]">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
