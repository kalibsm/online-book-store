"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import atWargoghic from "@/public/images/at-war-goghic-line.png";
import AtomicHabits from "@/public/images/atomic-habits.png";
import educated from "@/public/images/educated.png";
import fatherhoodImage from "@/public/images/fatherhood.png";
import midnight from "@/public/images/midnight-Library.png";
import silentPatient from "@/public/images/the-silent-patient.png";
import timetraveler from "@/public/images/time-time-travelers.png";
import worldofwar from "@/public/images/world-of-war-2020.png";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const featuredBooks = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 24.99,
    rating: 4.5,
    image: midnight,
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    price: 29.99,
    rating: 5,
    image: AtomicHabits,
  },
  {
    id: 3,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 19.99,
    rating: 4.8,
    image: silentPatient,
  },
  {
    id: 4,
    title: "Educated",
    author: "Tara Westover",
    price: 27.99,
    rating: 4.7,
    image: educated,
  },
  {
    id: 5,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 24.99,
    rating: 4.5,
    image: atWargoghic,
  },
  {
    id: 6,
    title: "Atomic Habits",
    author: "James Clear",
    price: 29.99,
    rating: 5,
    image: fatherhoodImage,
  },
  {
    id: 7,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 19.99,
    rating: 4.8,
    image: timetraveler,
  },
  {
    id: 8,
    title: "Educated",
    author: "Tara Westover",
    price: 27.99,
    rating: 4.7,
    image: worldofwar,
  },
];
const FeaturedBooks = () => {
  const [length, setLength] = useState(0);
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Books</h2>
          <p className="text-muted-foreground text-lg">
            Discover our handpicked selection of must-read titles
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.slice(0, 4 + length).map((book) => (
            <Card
              key={book.id}
              className="group hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-4">
                <div className="relative h-[400px] mb-4 overflow-hidden rounded-md">
                  <Image
                    src={book.image || "/placeholder.svg"}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-1 text-balance">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {book.author}
                </p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(book.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({book.rating})
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#393280]">
                  ${book.price}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-[#393280]">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            onClick={() => (length === 8 ? setLength(0) : setLength(8))}
            variant="outline"
            size="lg"
            className="cursor-pointer"
          >
            {length === 8 ? "View Less" : "View All Books"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBooks;
