"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2, BookOpen } from "lucide-react";
import { wishlistApi, bookImageUrl, Book } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

export default function WishlistPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { addToCart } = useCart();

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    wishlistApi
      .get(token)
      .then((wl) => setBooks(wl.books))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token]);

  async function handleRemove(bookId: string) {
    if (!token) return;
    setRemovingId(bookId);
    try {
      await wishlistApi.remove(token, bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch { /* ignore */ }
    finally { setRemovingId(null); }
  }

  async function handleAddToCart(book: Book) {
    if (!token) { router.push("/login"); return; }
    setAddingId(book.id);
    try { await addToCart(book.id); }
    catch { /* ignore */ }
    finally { setAddingId(null); }
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-[#F5F1ED] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
          <Heart className="h-12 w-12 text-[#3D2E7C] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#3D2E7C] mb-2">Sign in to view your wishlist</h1>
          <p className="text-muted-foreground mb-6">Save books you love and find them here later.</p>
          <div className="flex gap-3 justify-center">
            <Button className="bg-[#3D2E7C] hover:bg-[#3D2E7C]/90" onClick={() => router.push("/login")}>
              Sign in
            </Button>
            <Button variant="outline" onClick={() => router.push("/register")}>
              Create account
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-[#F5F1ED] py-10 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Heart className="h-7 w-7 text-[#FF6B4A] fill-[#FF6B4A]" />
            <div>
              <h1 className="text-4xl font-bold text-[#3D2E7C]">My Wishlist</h1>
              {!isLoading && books.length > 0 && (
                <p className="text-muted-foreground mt-0.5">
                  {books.length} saved book{books.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="aspect-[2/3] bg-muted rounded-xl mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-3" />
                  <div className="h-9 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-24">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#3D2E7C] mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Browse our collection and save books you&apos;d like to read.
              </p>
              <Link href="/books">
                <Button className="bg-[#3D2E7C] hover:bg-[#3D2E7C]/90">Browse books</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.map((book) => (
                <div
                  key={book.id}
                  className={`group flex flex-col transition-opacity ${
                    removingId === book.id ? "opacity-40 pointer-events-none" : ""
                  }`}
                >
                  {/* Cover */}
                  <Link href={`/books/${book.id}`} className="block relative aspect-[2/3] rounded-xl overflow-hidden bg-muted mb-4 shadow-sm">
                    <Image
                      src={bookImageUrl(book.image)}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={!book.image}
                    />
                    {/* Remove from wishlist overlay */}
                    <button
                      onClick={(e) => { e.preventDefault(); handleRemove(book.id); }}
                      disabled={removingId === book.id}
                      className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>

                    {!book.in_stock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span className="text-yellow-500">★</span>
                      <span>{book.average_rating}</span>
                      {book.category_name && (
                        <span className="text-gray-300 ml-1">· {book.category_name}</span>
                      )}
                    </div>
                    <Link href={`/books/${book.id}`}>
                      <h3 className="font-semibold text-[#3D2E7C] line-clamp-1 hover:underline">
                        {book.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                    <p className="text-lg font-bold text-[#FF6B4A] mt-0.5">
                      ${parseFloat(book.price).toFixed(2)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex gap-2">
                    <Button
                      className="flex-1 bg-[#3D2E7C] hover:bg-[#3D2E7C]/90 gap-2 text-sm"
                      size="sm"
                      disabled={addingId === book.id || !book.in_stock}
                      onClick={() => handleAddToCart(book)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {addingId === book.id ? "Adding…" : "Add to Cart"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-2.5 border-gray-200 hover:border-red-300 hover:text-red-500 transition-colors"
                      disabled={removingId === book.id}
                      onClick={() => handleRemove(book.id)}
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="h-4 w-4 fill-[#FF6B4A] text-[#FF6B4A]" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
