"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ShoppingCart, Heart, ArrowLeft, Package } from "lucide-react";
import { booksApi, wishlistApi, bookImageUrl, BookDetail, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHovered(i + 1)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i + 1)}
          className="focus:outline-none"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              i < (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, token } = useAuth();
  const { addToCart } = useCart();

  const [book, setBook] = useState<BookDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewDeleting, setReviewDeleting] = useState(false);

  useEffect(() => {
    booksApi
      .get(id)
      .then(setBook)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!token || !book) return;
    wishlistApi
      .get(token)
      .then((wl) => setIsWishlisted(wl.books.some((b) => b.id === book.id)))
      .catch(() => {});
  }, [token, book]);

  async function handleAddToCart() {
    if (!token) { router.push("/login"); return; }
    setAddingToCart(true);
    try { await addToCart(book!.id); }
    catch { /* ignore */ }
    finally { setAddingToCart(false); }
  }

  async function handleToggleWishlist() {
    if (!token) { router.push("/login"); return; }
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await wishlistApi.remove(token, book!.id);
        setIsWishlisted(false);
      } else {
        await wishlistApi.add(token, book!.id);
        setIsWishlisted(true);
      }
    } catch { /* ignore */ }
    finally { setWishlistLoading(false); }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !book) return;
    setReviewError("");
    setReviewSubmitting(true);
    try {
      const review = await booksApi.addReview(book.id, token, { rating, comment });
      setBook((b) => (b ? { ...b, reviews: [...b.reviews, review] } : b));
      setComment("");
      setRating(5);
    } catch (err) {
      setReviewError(err instanceof ApiError ? err.message : "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  }

  async function handleDeleteReview() {
    if (!token || !book || !user) return;
    setReviewDeleting(true);
    try {
      await booksApi.deleteReview(book.id, token);
      setBook((b) =>
        b ? { ...b, reviews: b.reviews.filter((r) => r.user_email !== user.email) } : b
      );
    } catch { /* ignore */ }
    finally { setReviewDeleting(false); }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 animate-pulse">
          <div className="h-4 bg-muted rounded w-40 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[2/3] bg-muted rounded-xl max-w-md" />
            <div className="space-y-4 pt-4">
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-5 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-10 bg-muted rounded w-1/4" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-12 bg-muted rounded" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !book) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#3D2E7C] mb-2">Book not found</h1>
          <p className="text-muted-foreground mb-6">This book doesn&apos;t exist or has been removed.</p>
          <Link href="/books">
            <Button className="bg-[#3D2E7C] hover:bg-[#3D2E7C]/90">Browse all books</Button>
          </Link>
        </div>
      </main>
    );
  }

  const userReview = book.reviews.find((r) => r.user_email === user?.email);

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <section className="bg-[#F5F1ED] py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-[#3D2E7C] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/books" className="hover:text-[#3D2E7C] transition-colors">Books</Link>
            <span>/</span>
            <span className="text-[#3D2E7C] font-medium line-clamp-1">{book.title}</span>
          </div>
        </div>
      </section>

      {/* Book Detail */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#3D2E7C] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to books
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Cover */}
            <div className="max-w-sm mx-auto lg:mx-0 w-full">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl bg-muted">
                <Image
                  src={bookImageUrl(book.image)}
                  alt={book.title}
                  fill
                  className="object-cover"
                  unoptimized={!book.image}
                  priority
                />
              </div>
            </div>

            {/* Info */}
            <div className="space-y-5">
              {book.category_name && (
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#FF6B4A] bg-[#FF6B4A]/10 px-3 py-1 rounded-full">
                  {book.category_name}
                </span>
              )}

              <h1 className="text-4xl font-bold text-[#3D2E7C] leading-tight">{book.title}</h1>

              <p className="text-xl text-muted-foreground">
                by <span className="font-medium text-gray-700">{book.author}</span>
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(book.average_rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {book.average_rating} &middot; {book.reviews.length} review{book.reviews.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-[#FF6B4A]">
                ${parseFloat(book.price).toFixed(2)}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2 text-sm">
                <Package className={`h-4 w-4 ${book.in_stock ? "text-green-500" : "text-red-400"}`} />
                {book.in_stock ? (
                  <span className="text-green-600 font-medium">{book.stock} in stock</span>
                ) : (
                  <span className="text-red-500 font-medium">Out of stock</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  size="lg"
                  className="flex-1 bg-[#3D2E7C] hover:bg-[#3D2E7C]/90 gap-2"
                  disabled={addingToCart || !book.in_stock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addingToCart ? "Adding…" : book.in_stock ? "Add to Cart" : "Out of Stock"}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className={`gap-2 border-2 transition-colors ${
                    isWishlisted ? "border-[#FF6B4A] text-[#FF6B4A]" : "border-gray-300"
                  }`}
                  disabled={wishlistLoading}
                  onClick={handleToggleWishlist}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-[#FF6B4A]" : ""}`} />
                  {isWishlisted ? "Saved" : "Wishlist"}
                </Button>
              </div>

              {/* Metadata */}
              <div className="border-t pt-5 space-y-2 text-sm">
                {book.isbn && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-28 shrink-0">ISBN</span>
                    <span className="font-medium">{book.isbn}</span>
                  </div>
                )}
                {book.published_date && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-28 shrink-0">Published</span>
                    <span className="font-medium">
                      {new Date(book.published_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {book.category_name && (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground w-28 shrink-0">Category</span>
                    <span className="font-medium">{book.category_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      {book.description && (
        <section className="py-12 bg-[#F5F1ED]">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-[#3D2E7C] mb-4">About this book</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{book.description}</p>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-[#3D2E7C] mb-8">
            Reviews ({book.reviews.length})
          </h2>

          {book.reviews.length === 0 ? (
            <p className="text-muted-foreground mb-10">
              No reviews yet. Be the first to review this book!
            </p>
          ) : (
            <div className="space-y-5 mb-10">
              {book.reviews.map((review) => (
                <div key={review.id} className="border rounded-xl p-5 space-y-2 bg-white">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#3D2E7C] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {review.user_email[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{review.user_email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      {review.user_email === user?.email && (
                        <button
                          onClick={handleDeleteReview}
                          disabled={reviewDeleting}
                          className="text-xs text-red-500 hover:underline ml-2"
                        >
                          {reviewDeleting ? "Deleting…" : "Delete"}
                        </button>
                      )}
                    </div>
                  </div>

                  {review.comment && (
                    <p className="text-gray-600 text-sm pt-1">{review.comment}</p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Add Review */}
          {token && !userReview && (
            <div className="border-t pt-8">
              <h3 className="text-lg font-bold text-[#3D2E7C] mb-4">Write a review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your rating</label>
                  <StarPicker value={rating} onChange={setRating} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this book…"
                    rows={4}
                  />
                </div>

                {reviewError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {reviewError}
                  </p>
                )}

                <Button
                  type="submit"
                  className="bg-[#3D2E7C] hover:bg-[#3D2E7C]/90"
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting ? "Submitting…" : "Submit review"}
                </Button>
              </form>
            </div>
          )}

          {!token && (
            <div className="border-t pt-8 text-sm text-muted-foreground">
              <Link href="/login" className="text-[#FF6B4A] font-medium hover:underline">
                Sign in
              </Link>{" "}
              to leave a review.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
