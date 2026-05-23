"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, TrendingUp } from "lucide-react";
import { booksApi, Book, bookImageUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";

export default function NewReleasePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);

  const { token } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    booksApi
      .list({ new_release: true, ordering: "-created_at" })
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
      // silently ignore
    } finally {
      setAddingId(null);
    }
  }

  const featured = books[0];
  const rest = books.slice(1);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading new releases…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#3D2E7C] to-[#3D2E7C]/80 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-6 w-6" />
              <span className="text-[#FFD700] font-medium text-lg">Just Released</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">New Releases</h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Discover the latest additions to our collection. Fresh perspectives, compelling
              stories, and groundbreaking ideas just arrived.
            </p>
          </div>
        </div>
      </section>

      {/* Featured new release */}
      {featured && (
        <section className="py-16 bg-[#F5F1ED]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-2xl bg-muted">
                <Image
                  src={bookImageUrl(featured.image)}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  unoptimized={!featured.image}
                />
                <Badge className="absolute top-4 left-4 bg-[#FF6B4A] hover:bg-[#FF6B4A]">
                  Featured
                </Badge>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="border-[#FF6B4A] text-[#FF6B4A]">
                    NEW
                  </Badge>
                  {featured.average_rating >= 4.5 && (
                    <Badge variant="outline" className="border-primary text-[#3D2E7C]">
                      BESTSELLER
                    </Badge>
                  )}
                </div>

                <h2 className="text-4xl font-bold text-[#3D2E7C] mb-2">{featured.title}</h2>
                <p className="text-xl text-muted-foreground mb-4">by {featured.author}</p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">{featured.average_rating}</span>
                  </div>
                  {featured.published_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Released {new Date(featured.published_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-[#FF6B4A]">
                    ${parseFloat(featured.price).toFixed(2)}
                  </span>
                  <Button
                    size="lg"
                    className="bg-[#FF6B4A] hover:bg-[#FF6B4A]/90"
                    onClick={() => handleAddToCart(featured)}
                    disabled={addingId === featured.id || !featured.in_stock}
                  >
                    {!featured.in_stock
                      ? "Out of Stock"
                      : addingId === featured.id
                      ? "Adding…"
                      : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All new releases */}
      {rest.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#3D2E7C] mb-4">More New Arrivals</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse through our complete collection of newly released books
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[3/4] bg-muted">
                    <Image
                      src={bookImageUrl(book.image)}
                      alt={book.title}
                      fill
                      className="object-cover"
                      unoptimized={!book.image}
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-[#FF6B4A] hover:bg-[#FF6B4A]">NEW</Badge>
                      {book.average_rating >= 4.5 && (
                        <Badge className="bg-[#3D2E7C] hover:bg-[#3D2E7C]">BESTSELLER</Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-semibold">{book.average_rating}</span>
                      </div>
                      {book.published_date && (
                        <span className="text-sm text-muted-foreground">
                          •{" "}
                          {new Date(book.published_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-[#3D2E7C] mb-1 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">by {book.author}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#FF6B4A]">
                        ${parseFloat(book.price).toFixed(2)}
                      </span>
                      <Button
                        variant="outline"
                        className="border-[#FF6B4A] text-[#FF6B4A] hover:bg-[#FF6B4A] hover:text-white bg-transparent"
                        onClick={() => handleAddToCart(book)}
                        disabled={addingId === book.id || !book.in_stock}
                      >
                        {!book.in_stock
                          ? "Out of Stock"
                          : addingId === book.id
                          ? "Adding…"
                          : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {books.length === 0 && !isLoading && (
        <div className="py-32 text-center text-muted-foreground">
          No new releases available at the moment.
        </div>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-[#F5F1ED]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#3D2E7C] mb-4">Never Miss a New Release</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about our latest book arrivals
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-input bg-background"
            />
            <Button className="bg-[#FF6B4A] hover:bg-[#FF6B4A]/90">Subscribe</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
