"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { booksApi, Book, bookImageUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";

const FeaturedBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  const { token } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    booksApi
      .list({ featured: true })
      .then((res) => setBooks(res.results))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  async function handleAddToCart(book: Book) {
    if (!token) {
      router.push("/login");
      return;
    }
    setAddingId(book.id);
    try {
      await addToCart(book.id);
    } catch {
      // silently ignore for now
    } finally {
      setAddingId(null);
    }
  }

  const displayed = showAll ? books : books.slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          Loading featured books…
        </div>
      </section>
    );
  }

  if (books.length === 0) return null;

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
          {displayed.map((book) => (
            <Card key={book.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <Link href={`/books/${book.id}`} className="block">
                  <div className="relative h-[400px] mb-4 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={bookImageUrl(book.image)}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      unoptimized={!book.image}
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-balance line-clamp-1 hover:underline">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(book.average_rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({book.average_rating})
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#393280]">
                  ${parseFloat(book.price).toFixed(2)}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full bg-[#393280]"
                  onClick={() => handleAddToCart(book)}
                  disabled={addingId === book.id || !book.in_stock}
                >
                  {!book.in_stock
                    ? "Out of Stock"
                    : addingId === book.id
                    ? "Adding…"
                    : "Add to Cart"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {books.length > 4 && (
          <div className="text-center mt-12">
            <Button
              onClick={() => setShowAll((v) => !v)}
              variant="outline"
              size="lg"
            >
              {showAll ? "View Less" : "View All Books"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBooks;
