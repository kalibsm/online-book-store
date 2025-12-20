import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, Heart, Zap, Globe, Palette } from "lucide-react";
import Link from "next/link";

const categories = [
  { name: "Fiction", icon: BookOpen, color: "bg-purple-100 text-purple-600" },
  { name: "Self-Help", icon: Brain, color: "bg-blue-100 text-blue-600" },
  { name: "Romance", icon: Heart, color: "bg-pink-100 text-pink-600" },
  { name: "Thriller", icon: Zap, color: "bg-yellow-100 text-yellow-600" },
  { name: "Travel", icon: Globe, color: "bg-green-100 text-green-600" },
  {
    name: "Art & Design",
    icon: Palette,
    color: "bg-orange-100 text-orange-600",
  },
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground text-lg">
            Find your favorite genre
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.name}
                href={`/category/${category.name.toLowerCase()}`}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
