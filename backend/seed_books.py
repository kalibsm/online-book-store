"""
Standalone seed script — uses pymongo directly to avoid MongoEngine index issues.

Usage (from backend/ directory with venv active):
    python seed_books.py
    python seed_books.py --clear   # wipe books & categories first
"""
import argparse
import os
import sys
from datetime import datetime, date

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv(os.path.join(os.path.dirname(__file__), ".env.local"))

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/bookstore_db")
DB_NAME = "bookstore_db"

CATEGORIES = [
    {"name": "Fiction",        "slug": "fiction",        "description": "Novels and short stories that are not real."},
    {"name": "Non-Fiction",    "slug": "non-fiction",    "description": "Factual works about real events and people."},
    {"name": "Science & Tech", "slug": "science-tech",   "description": "Books on science, technology and engineering."},
    {"name": "Fantasy",        "slug": "fantasy",        "description": "Magical worlds and epic adventures."},
    {"name": "Mystery",        "slug": "mystery",        "description": "Whodunit thrillers and detective stories."},
    {"name": "Biography",      "slug": "biography",      "description": "Life stories of remarkable people."},
    {"name": "History",        "slug": "history",        "description": "The past, from ancient times to modern day."},
    {"name": "Self-Help",      "slug": "self-help",      "description": "Guides to personal growth and improvement."},
]

def ol_cover(isbn: str) -> str:
    """Open Library cover image URL (large size) for a given ISBN."""
    return f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"


BOOKS = [
    # Fiction
    {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "isbn": "9780743273565",
        "description": "A portrait of the Jazz Age in all of its decadence and excess, capturing the spirit of the author's generation and evoking a sense of nostalgia for a lost era.",
        "price": "12.99",
        "category_slug": "fiction",
        "stock": 25,
        "published_date": "1925-04-10",
        "is_featured": True,
        "is_new_release": False,
        "image": ol_cover("9780743273565"),
    },
    {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "isbn": "9780061935466",
        "description": "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
        "price": "14.99",
        "category_slug": "fiction",
        "stock": 30,
        "published_date": "1960-07-11",
        "is_featured": True,
        "is_new_release": False,
        "image": ol_cover("9780061935466"),
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "isbn": "9780451524935",
        "description": "A dystopian novel set in a totalitarian society ruled by Big Brother, exploring themes of surveillance, censorship and propaganda.",
        "price": "13.50",
        "category_slug": "fiction",
        "stock": 40,
        "published_date": "1949-06-08",
        "is_featured": True,
        "is_new_release": False,
        "image": ol_cover("9780451524935"),
    },
    {
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "isbn": "9780141439518",
        "description": "A romantic novel of manners that follows the character development of Elizabeth Bennet, who learns about the repercussions of hasty judgments.",
        "price": "10.99",
        "category_slug": "fiction",
        "stock": 35,
        "published_date": "1813-01-28",
        "is_featured": False,
        "is_new_release": False,
        "image": ol_cover("9780141439518"),
    },
    {
        "title": "The Catcher in the Rye",
        "author": "J. D. Salinger",
        "isbn": "9780316769174",
        "description": "The story of Holden Caulfield, a teenage boy who has just been expelled from prep school, as he roams New York City.",
        "price": "13.00",
        "category_slug": "fiction",
        "stock": 20,
        "published_date": "1951-07-16",
        "is_featured": False,
        "is_new_release": False,
        "image": ol_cover("9780316769174"),
    },
    # Fantasy
    {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "isbn": "9780547928227",
        "description": "Bilbo Baggins, a respectable hobbit, embarks on an unexpected journey with a wizard and thirteen dwarves to reclaim a treasure guarded by a dragon.",
        "price": "16.99",
        "category_slug": "fantasy",
        "stock": 50,
        "published_date": "1937-09-21",
        "is_featured": True,
        "is_new_release": False,
        "image": ol_cover("9780547928227"),
    },
    {
        "title": "Harry Potter and the Sorcerer's Stone",
        "author": "J.K. Rowling",
        "isbn": "9780590353427",
        "description": "Harry Potter has never been the star of a Quidditch team, scoring points while riding a broom far above the ground. He knows no spells, has never helped to hatch a dragon.",
        "price": "18.99",
        "category_slug": "fantasy",
        "stock": 60,
        "published_date": "1997-06-26",
        "is_featured": True,
        "is_new_release": False,
        "image": ol_cover("9780590353427"),
    },
    {
        "title": "A Game of Thrones",
        "author": "George R.R. Martin",
        "isbn": "9780553381689",
        "description": "In a land where summers can last decades and winters a lifetime, trouble is brewing. The cold is returning, and in the frozen wastes a terrible evil stirs.",
        "price": "19.99",
        "category_slug": "fantasy",
        "stock": 45,
        "published_date": "1996-08-01",
        "is_featured": False,
        "is_new_release": False,
        "image": ol_cover("9780553381689"),
    },
    {
        "title": "The Name of the Wind",
        "author": "Patrick Rothfuss",
        "isbn": "9780756404741",
        "description": "The riveting first-person narrative of a young man who grows to be the most notorious wizard his world has ever seen.",
        "price": "17.50",
        "category_slug": "fantasy",
        "stock": 30,
        "published_date": "2007-03-27",
        "is_featured": False,
        "is_new_release": True,
        "image": ol_cover("9780756404741"),
    },
    # Mystery
    {
        "title": "Gone Girl",
        "author": "Gillian Flynn",
        "isbn": "9780307588371",
        "description": "On a sunny summer morning in North Carthage, Missouri, it is Nick and Amy Dunne's fifth wedding anniversary. Amy goes missing. Nick becomes the prime suspect.",
        "price": "15.99",
        "category_slug": "mystery",
        "stock": 28,
        "published_date": "2012-06-05",
        "is_featured": True,
        "is_new_release": False,
        "image": ol_cover("9780307588371"),
    },
    {
        "title": "The Girl with the Dragon Tattoo",
        "author": "Stieg Larsson",
        "isbn": "9780307454546",
        "description": "Journalist Mikael Blomkvist and hacker Lisbeth Salander investigate a decades-old disappearance within the wealthy Vanger family.",
        "price": "16.50",
        "category_slug": "mystery",
        "stock": 22,
        "published_date": "2005-08-01",
        "is_featured": False,
        "is_new_release": False,
        "image": ol_cover("9780307454546"),
    },
    {
        "title": "Big Little Lies",
        "author": "Liane Moriarty",
        "isbn": "9780425274866",
        "description": "A brilliant take on ex-husbands and second wives, mothers and daughters, schoolyard scandal, and the dangerous little lies we tell ourselves just to survive.",
        "price": "14.50",
        "category_slug": "mystery",
        "stock": 18,
        "published_date": "2014-07-29",
        "is_featured": False,
        "is_new_release": True,
        "image": ol_cover("9780425274866"),
    },
    # Science & Tech
    {
        "title": "A Brief History of Time",
        "author": "Stephen Hawking",
        "isbn": "9780553380163",
        "description": "Stephen Hawking's landmark work on cosmology, black holes, and the nature of time — written for non-scientists.",
        "price": "15.00",
        "category_slug": "science-tech",
        "stock": 35,
        "published_date": "1988-04-01",
        "is_featured": True,
        "is_new_release": False,
        "image": ol_cover("9780553380163"),
    },
    {
        "title": "The Pragmatic Programmer",
        "author": "Andrew Hunt & David Thomas",
        "isbn": "9780135957059",
        "description": "Practical advice and anecdotes covering all aspects of software development, from career choices to architectural decisions.",
        "price": "49.99",
        "category_slug": "science-tech",
        "stock": 20,
        "published_date": "2019-09-23",
        "is_featured": False,
        "is_new_release": True,
        "image": ol_cover("9780135957059"),
    },
    {
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "isbn": "9780132350884",
        "description": "A handbook of agile software craftsmanship; a must-read for every professional software developer.",
        "price": "44.99",
        "category_slug": "science-tech",
        "stock": 25,
        "published_date": "2008-08-01",
        "is_featured": True,
        "is_new_release": False,
        "image": ol_cover("9780132350884"),
    },
    # Non-Fiction
    {
        "title": "Sapiens: A Brief History of Humankind",
        "author": "Yuval Noah Harari",
        "isbn": "9780062316097",
        "description": "A narrative of humanity's creation and evolution that explores how biology and history have defined us.",
        "price": "18.00",
        "category_slug": "non-fiction",
        "stock": 50,
        "published_date": "2011-01-01",
        "is_featured": True,
        "is_new_release": False,
        "image": ol_cover("9780062316097"),
    },
    {
        "title": "Educated",
        "author": "Tara Westover",
        "isbn": "9780399590504",
        "description": "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
        "price": "16.99",
        "category_slug": "non-fiction",
        "stock": 33,
        "published_date": "2018-02-20",
        "is_featured": False,
        "is_new_release": True,
        "image": ol_cover("9780399590504"),
    },
    # Biography
    {
        "title": "Steve Jobs",
        "author": "Walter Isaacson",
        "isbn": "9781451648539",
        "description": "Based on more than forty interviews with Jobs, as well as interviews with more than a hundred family members, friends, adversaries and competitors.",
        "price": "20.00",
        "category_slug": "biography",
        "stock": 27,
        "published_date": "2011-10-24",
        "is_featured": True,
        "is_new_release": False,
        "image": ol_cover("9781451648539"),
    },
    {
        "title": "Becoming",
        "author": "Michelle Obama",
        "isbn": "9781524763138",
        "description": "An intimate, powerful, and inspiring memoir by the former First Lady of the United States.",
        "price": "19.50",
        "category_slug": "biography",
        "stock": 40,
        "published_date": "2018-11-13",
        "is_featured": True,
        "is_new_release": True,
        "image": ol_cover("9781524763138"),
    },
    # History
    {
        "title": "The Guns of August",
        "author": "Barbara Tuchman",
        "isbn": "9780345476098",
        "description": "A Pulitzer Prize–winning account of the first month of World War I and the blunders that led to catastrophe.",
        "price": "17.00",
        "category_slug": "history",
        "stock": 15,
        "published_date": "1962-08-01",
        "is_featured": False,
        "is_new_release": False,
        "image": ol_cover("9780345476098"),
    },
    {
        "title": "SPQR: A History of Ancient Rome",
        "author": "Mary Beard",
        "isbn": "9781631492228",
        "description": "A fresh look at Roman history by one of the world's foremost classicists, exploring how Rome grew from a tiny village to a great empire.",
        "price": "18.50",
        "category_slug": "history",
        "stock": 12,
        "published_date": "2015-11-17",
        "is_featured": False,
        "is_new_release": True,
        "image": ol_cover("9781631492228"),
    },
    # Self-Help
    {
        "title": "Atomic Habits",
        "author": "James Clear",
        "isbn": "9780735211292",
        "description": "An easy and proven way to build good habits and break bad ones, using a framework of tiny changes that deliver remarkable results.",
        "price": "21.99",
        "category_slug": "self-help",
        "stock": 55,
        "published_date": "2018-10-16",
        "is_featured": True,
        "is_new_release": True,
        "image": ol_cover("9780735211292"),
    },
    {
        "title": "The 7 Habits of Highly Effective People",
        "author": "Stephen R. Covey",
        "isbn": "9780743269513",
        "description": "An approach to being effective by aligning oneself to principles with a character ethic.",
        "price": "17.99",
        "category_slug": "self-help",
        "stock": 42,
        "published_date": "1989-08-15",
        "is_featured": False,
        "is_new_release": False,
        "image": ol_cover("9780743269513"),
    },
]


def main():
    parser = argparse.ArgumentParser(description="Seed books and categories into MongoDB.")
    parser.add_argument("--clear", action="store_true", help="Drop all books & categories first")
    args = parser.parse_args()

    print(f"Connecting to MongoDB...")
    client = MongoClient(MONGODB_URI)
    db = client[DB_NAME]
    categories_col = db["categories"]
    books_col = db["books"]

    if args.clear:
        books_col.delete_many({})
        categories_col.delete_many({})
        print("Cleared all books and categories.")

    now = datetime.utcnow()

    # ── Categories ─────────────────────────────────────────────────────────────
    category_id_map: dict[str, object] = {}
    for cat in CATEGORIES:
        existing = categories_col.find_one({"slug": cat["slug"]})
        if existing:
            category_id_map[cat["slug"]] = existing["_id"]
            print(f"  Category already exists: {cat['name']}")
        else:
            doc = {**cat, "image": None, "created_at": now}
            result = categories_col.insert_one(doc)
            category_id_map[cat["slug"]] = result.inserted_id
            print(f"  Created category: {cat['name']}")

    # ── Books ──────────────────────────────────────────────────────────────────
    created = skipped = 0
    for book in BOOKS:
        if books_col.find_one({"isbn": book["isbn"]}):
            skipped += 1
            continue

        slug = book.pop("category_slug")
        doc = {
            **book,
            "category": category_id_map.get(slug),
            "created_at": now,
            "updated_at": now,
        }
        books_col.insert_one(doc)
        created += 1
        print(f"  Created book: {book['title']}")

    print(f"\nDone. {created} book(s) created, {skipped} skipped (already exist).")
    client.close()


if __name__ == "__main__":
    main()
