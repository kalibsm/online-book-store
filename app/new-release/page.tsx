import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, TrendingUp } from "lucide-react";
import atWargoghic from "@/public/images/at-war-goghic-line.png";
import managementEssentials from "@/public/images/management-essentials.png";
import advancedEngineering from "@/public/images/advanced-engineering-maths.png";
import fatherhoodImage from "@/public/images/fatherhood.png";
import doctorWho from "@/public/images/doctor-who.png";
import slugfest from "@/public/images/slugfest.png";
import timetraveler from "@/public/images/time-time-travelers.png";
import worldofwar from "@/public/images/world-of-war-2020.png";

const newReleases = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 27.99,
    releaseDate: "2025-01-15",
    image: timetraveler,
    rating: 4.9,
    isNew: true,
    isBestseller: true,
    description:
      "A dazzling novel about all the choices that go into a life well lived, from the internationally bestselling author.",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    price: 32.99,
    releaseDate: "2025-01-10",
    image: worldofwar,
    rating: 4.8,
    isNew: true,
    description:
      "An easy and proven way to build good habits and break bad ones. Transform your life one tiny change at a time.",
  },
  {
    id: 3,
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 29.99,
    releaseDate: "2025-01-08",
    image: advancedEngineering,
    rating: 4.7,
    isNew: true,
    isBestseller: true,
    description:
      "A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the author of The Martian.",
  },
  {
    id: 4,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 24.99,
    releaseDate: "2025-01-05",
    image: slugfest,
    rating: 4.6,
    isNew: true,
    description:
      "Timeless lessons on wealth, greed, and happiness doing well with money isn't necessarily about what you know.",
  },
  {
    id: 5,
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    price: 28.99,
    releaseDate: "2024-12-28",
    image: fatherhoodImage,
    rating: 4.5,
    description:
      "A thrilling book that offers a look at our changing world through the eyes of an unforgettable narrator.",
  },
  {
    id: 6,
    title: "The Four Winds",
    author: "Kristin Hannah",
    price: 26.99,
    releaseDate: "2024-12-20",
    image: atWargoghic,
    rating: 4.7,
    description:
      "An epic novel of love and heroism and hope, set against the backdrop of one of America's most defining eras.",
  },
];

export default function NewReleasePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3D2E7C] to-[#3D2E7C]/80 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6" />
              <span className="text-[#FFD700] font-medium text-lg">
                Just Released
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-6">New Releases</h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Discover the latest additions to our collection. Fresh
              perspectives, compelling stories, and groundbreaking ideas just
              arrived.
            </p>
          </div>
        </div>
      </section>

      {/* Featured New Release */}
      <section className="py-16 bg-[#F5F1ED]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={newReleases[0].image || "/placeholder.svg"}
                alt={newReleases[0].title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-[#FF6B4A] hover:bg-[#FF6B4A]">
                Featured
              </Badge>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant="outline"
                  className="border-[#FF6B4A] text-[#FF6B4A]"
                >
                  NEW
                </Badge>
                {newReleases[0].isBestseller && (
                  <Badge
                    variant="outline"
                    className="border-primary text-[#3D2E7C]"
                  >
                    BESTSELLER
                  </Badge>
                )}
              </div>
              <h2 className="text-4xl font-bold text-[#3D2E7C] mb-2">
                {newReleases[0].title}
              </h2>
              <p className="text-xl text-muted-foreground mb-4">
                by {newReleases[0].author}
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{newReleases[0].rating}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Released{" "}
                    {new Date(newReleases[0].releaseDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {newReleases[0].description}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-[#FF6B4A]">
                  ${newReleases[0].price.toFixed(2)}
                </span>
                <Button
                  size="lg"
                  className="bg-[#FF6B4A] hover:bg-[#FF6B4A]/90"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All New Releases Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#3D2E7C] mb-4">
              More New Arrivals
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse through our complete collection of newly released books
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newReleases.slice(1).map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={book.image || "/placeholder.svg"}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {book.isNew && (
                      <Badge className="bg-[#FF6B4A] hover:bg-[#FF6B4A]">
                        NEW
                      </Badge>
                    )}
                    {book.isBestseller && (
                      <Badge className="bg-[#3D2E7C] hover:bg-[#3D2E7C]">
                        BESTSELLER
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-semibold">
                        {book.rating}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      •{" "}
                      {new Date(book.releaseDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#3D2E7C] mb-1 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    by {book.author}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {book.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#FF6B4A]">
                      ${book.price.toFixed(2)}
                    </span>
                    <Button
                      variant="outline"
                      className="border-[#FF6B4A] text-[#FF6B4A] hover:bg-[#FF6B4A] hover:text-white bg-transparent"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-[#F5F1ED]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#3D2E7C] mb-4">
            Never Miss a New Release
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about our
            latest book arrivals
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-input bg-background"
            />
            <Button className="bg-[#FF6B4A] hover:bg-[#FF6B4A]/90">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
