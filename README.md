# Online Book Store

A full-stack online book store built with **Next.js** (frontend) and **Django REST Framework** (backend), using **MongoDB Atlas** as the database.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| UI Components | shadcn/ui (Radix UI) |
| Backend | Django 5 + Django REST Framework |
| Database | MongoDB Atlas (via MongoEngine ODM) |
| Authentication | JWT (PyJWT) |
| DB Schema (Next.js) | Prisma (MongoDB provider) |

---

## Project Structure

```
online-book-store/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home — hero, featured books, top categories
│   ├── books/
│   │   ├── page.tsx            # Book catalog with search, filter, sort
│   │   └── [id]/page.tsx       # Book detail with reviews
│   ├── new-release/page.tsx    # New releases + newsletter
│   ├── cart/page.tsx           # Shopping cart
│   ├── orders/
│   │   ├── page.tsx            # Order history
│   │   └── [id]/page.tsx       # Order detail
│   ├── wishlist/page.tsx       # Wishlist
│   ├── profile/page.tsx        # User profile
│   ├── login/page.tsx          # Login
│   ├── register/page.tsx       # Registration
│   ├── about/page.tsx          # About page
│   └── contact/page.tsx        # Contact form
├── components/                 # Shared React components
│   ├── HeroSection.tsx
│   ├── FeaturedBooks.tsx
│   ├── TopCategories.tsx
│   ├── CategorySection.tsx
│   ├── MainNavbar.tsx
│   ├── TopNavbar.tsx
│   ├── Footer.tsx
│   ├── Providers.tsx           # Auth + Cart context providers
│   └── ui/                     # shadcn/ui primitives
├── lib/                        # Frontend utilities
│   └── api.ts                  # Typed API client
├── prisma/
│   └── schema.prisma           # MongoDB schema (for Next.js server components)
├── backend/                    # Django backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── seed_books.py           # Standalone pymongo seed script
│   ├── config/                 # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── store/                  # Main Django app
│       ├── models.py           # MongoEngine documents
│       ├── serializers.py      # DRF serializers
│       ├── views.py            # API views
│       ├── urls.py             # URL routing
│       ├── auth.py             # Custom JWT authentication
│       └── management/
│           └── commands/
│               └── seed_books.py  # Django management command (alternate)
└── public/                     # Static assets
```

---

## Database Models

| Model | Description |
|---|---|
| `User` | Custom user with email login, phone, address |
| `Category` | Book categories with slug |
| `Book` | Books with price, stock, featured / new-release flags |
| `Review` | User reviews with 1–5 star rating (one per user per book) |
| `Cart` | User cart with embedded `CartItem` documents |
| `Order` | Orders with embedded `OrderItem` documents and status tracking |
| `Wishlist` | User wishlist (list of book references) |

`CartItem` and `OrderItem` are **embedded documents** — no separate collections needed.

---

## API Endpoints

Base URL: `http://localhost:8000/api/`

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `auth/register/` | Register new user | No |
| POST | `auth/login/` | Login, returns JWT token | No |
| GET | `auth/profile/` | Get current user profile | Yes |
| PATCH | `auth/profile/` | Update profile | Yes |

### Books & Categories

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `books/` | List books (search, filter, sort, paginate) | No |
| GET | `books/<id>/` | Book detail | No |
| GET | `books/<id>/reviews/` | List reviews for a book | No |
| POST | `books/<id>/reviews/` | Add a review | Yes |
| DELETE | `books/<id>/reviews/` | Delete your review | Yes |
| GET | `categories/` | List all categories | No |
| GET | `categories/<slug>/` | Category detail | No |

**Book list query params:** `?search=`, `?category=<slug>`, `?featured=true`, `?new_release=true`, `?ordering=price|-price|title|-title|created_at`, `?page=`

### Cart

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `cart/` | View cart | Yes |
| POST | `cart/` | Add item (`book_id`, `quantity`) | Yes |
| PATCH | `cart/` | Update item quantity | Yes |
| DELETE | `cart/` | Remove item (`book_id`) | Yes |

### Orders

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `orders/` | List user orders | Yes |
| POST | `orders/checkout/` | Place order from cart | Yes |
| GET | `orders/<id>/` | Order detail | Yes |
| PATCH | `orders/<id>/cancel/` | Cancel order | Yes |

### Wishlist

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `wishlist/` | View wishlist | Yes |
| POST | `wishlist/` | Add book (`book_id`) | Yes |
| DELETE | `wishlist/` | Remove book (`book_id`) | Yes |

Authentication header: `Authorization: Bearer <token>`

---

## Getting Started

### Prerequisites

- MongoDB Atlas URI (connection string for your cluster)
- **Docker setup:** Docker + Docker Compose
- **Manual setup:** Node.js 18+ and Python 3.10+

---

## Option A — Docker (recommended)

The fastest way to run the project with no local Python or Node.js setup required.

### 1. Configure environment files

Copy the example files and fill in your MongoDB Atlas credentials:

```bash
cp .env.local.example .env.local
cp backend/.env.local.example backend/.env.local
```

Edit both files and replace the `<user>`, `<password>`, and `<cluster>` placeholders with your actual Atlas connection string.

### 2. Build and start

```bash
docker compose up --build
```

- Frontend → [http://localhost:3000](http://localhost:3000)
- Backend API → [http://localhost:8000/api/](http://localhost:8000/api/)

> **Note:** If you have local dev servers already running on ports 3000 or 8000, stop them first.

### 3. Seed the database (first run)

While the containers are running, open a second terminal:

```bash
docker compose exec backend python seed_books.py
```

### 4. Stop

```bash
docker compose down
```

---

## Option B — Manual setup

### 1. Clone and configure environment

**Frontend** — create `.env.local` in the project root:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bookstore_db
```

**Backend** — create `backend/.env.local`:

```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bookstore_db
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

### 2. Backend setup (Django)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run internal SQLite migration (needed for Django auth hashers only)
python manage.py migrate

# Start the server
python manage.py runserver
```

API available at [http://localhost:8000/api/](http://localhost:8000/api/).

> No `makemigrations` needed — MongoDB is schema-less; collections are created automatically on first write.

---

### 3. Seed the database (manual)

The seed script populates **8 categories** and **23 books** (a mix of featured and new releases):

```bash
cd backend
source venv/bin/activate

python seed_books.py            # add seed data, skips duplicates
python seed_books.py --clear    # wipe books & categories, then re-seed
```

Categories seeded: Fiction, Non-Fiction, Science & Tech, Fantasy, Mystery, Biography, History, Self-Help.

---

### 4. Frontend setup (Next.js)

```bash
# From the project root
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

### 5. Prisma (optional)

Used for Next.js server-side access to MongoDB.

```bash
npx prisma generate
```

---

## Frontend Pages

| Route | Description |
|---|---|
| `/` | Home — hero section, featured books, top categories |
| `/books` | Catalog — search, filter by category, sort by price / title / rating |
| `/books/[id]` | Book detail — description, reviews, add to cart / wishlist |
| `/new-release` | New releases with newsletter signup |
| `/cart` | Shopping cart with quantity controls and checkout |
| `/orders` | Order history |
| `/orders/[id]` | Order detail with status and items |
| `/wishlist` | Saved books |
| `/profile` | User profile — edit name, phone, address |
| `/login` | Login |
| `/register` | Create account |
| `/about` | Mission, vision, core values |
| `/contact` | Contact form, business info, FAQ |
