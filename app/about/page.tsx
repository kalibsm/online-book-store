import Image from "next/image";
import { Button } from "@/components/ui/button";
import bookstoreImage from "@/public/images/about-bookstore.png";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-[#F5F1ED] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-0.5 bg-[#FF6B4A]" />
              <span className="text-[#FF6B4A] font-medium">About Us</span>
            </div>
            <h1 className="text-5xl font-bold text-[#3D2E7C] mb-6">
              Your Trusted Book Partner
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are passionate about connecting readers with the books they
              love. With over 20 years of experience in the book industry, we
              curate the finest collection of books across all genres and
              categories.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src={bookstoreImage}
                alt="Book store interior"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#3D2E7C] mb-6">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our mission is to inspire a love for reading by providing access
                to quality books and creating a community of book lovers. We
                believe that every book has the power to transform lives and
                expand horizons.
              </p>
              <h2 className="text-3xl font-bold text-[#3D2E7C] mb-6">
                Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We envision a world where everyone has access to the knowledge
                and stories they seek. Through our carefully selected collection
                and exceptional service, we aim to be the go-to destination for
                book enthusiasts everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#F5F1ED]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#3D2E7C] mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-[#3D2E7C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#3D2E7C] mb-3">
                Quality Selection
              </h3>
              <p className="text-muted-foreground">
                Every book in our collection is carefully chosen to ensure the
                highest quality and relevance for our readers.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-[#3D2E7C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#3D2E7C] mb-3">
                Customer First
              </h3>
              <p className="text-muted-foreground">
                Your satisfaction is our priority. We&apos;re committed to providing
                exceptional service and support at every step.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-[#3D2E7C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#3D2E7C] mb-3">
                Community Focus
              </h3>
              <p className="text-muted-foreground">
                We foster a vibrant community of readers through events,
                discussions, and shared passion for literature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#3D2E7C] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Subscribe to our newsletter for book recommendations, exclusive
            offers, and updates on new releases.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-[#3D2E7C] hover:bg-white/90"
          >
            Subscribe Now
          </Button>
        </div>
      </section>
    </main>
  );
}
