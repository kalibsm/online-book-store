"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { booksApi, categoriesApi, Book, Category, bookImageUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useRouter, useSearchParams } from "next/navigation";

export default function BooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const { addToCart } = useCart();

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "all");
  const [sortBy, setSortBy] = useState("title");
  const [page, setPage] = useState(1);

  // Fetch categories once
  useEffect(() => {
    categoriesApi.list().then(setCategories).catch(() => {});
  }, []);

  // Debounced search — rebuild fetch whenever filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, sortBy, page]);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiOrdering = sortBy === "price-low"
        ? "price"
        : sortBy === "price-high"
        ? "-price"
        : sortBy === "title"
        ? "title"
        : "-created_at"; // rating: sort client-side after fetch

      const res = await booksApi.list({
        search: searchQuery || undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        ordering: apiOrdering,
        page,
      });

      let results = res.results;
      if (sortBy === "rating") {
        results = [...results].sort((a, b) => b.average_rating - a.average_rating);
      }

      setBooks(results);
      setTotalPages(res.total_pages);
      setTotalCount(res.count);
    } catch {
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, sortBy, page]);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setPage(1);
  }

  function handleCategoryChange(value: string) {
    setSelectedCategory(value);
    setPage(1);
  }

  function handleSortChange(value: string) {
    setSortBy(value);
    setPage(1);
  }

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

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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
            <h1 className="text-5xl font-bold text-[#3D2E7C] mb-4">Browse All Books</h1>
            <p className="text-lg text-muted-foreground">
              Explore our extensive collection of books across all genres and categories
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books or authors…"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `Showing ${books.length} of ${totalCount} books`}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-6 bg-muted rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {books.map((book) => (
                <div key={book.id} className="group">
                  <Link href={`/books/${book.id}`} className="block">
                    <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden mb-4">
                      <Image
                        src={bookImageUrl(book.image)}
                        alt={book.title}
                        fill
                        className="object-cover"
                        unoptimized={!book.image}
                      />
                      <button
                        className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-[#FF6B4A] hover:text-white"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Heart className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          className="w-full bg-[#FF6B4A] hover:bg-[#FF6B4A]/90"
                          onClick={(e) => { e.preventDefault(); handleAddToCart(book); }}
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
                  </Link>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span className="text-yellow-500">★</span>
                      <span>{book.average_rating}</span>
                    </div>
                    <Link href={`/books/${book.id}`}>
                      <h3 className="font-semibold text-[#3D2E7C] line-clamp-1 hover:underline">{book.title}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                    <p className="text-lg font-bold text-[#FF6B4A]">
                      ${parseFloat(book.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No books found matching your criteria</p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="py-8 border-t">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              {pageNumbers.map((num) => (
                <Button
                  key={num}
                  variant={num === page ? "default" : "outline"}
                  size="sm"
                  className={num === page ? "bg-[#3D2E7C]" : ""}
                  onClick={() => setPage(num)}
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
