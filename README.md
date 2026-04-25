# Online Book Store

A full-stack online book store built with **Next.js** (frontend) and **Django REST Framework** (backend), using **MongoDB** as the database.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS 4 |
| UI Components | shadcn/ui (Radix UI) |
| Backend | Django 4.2 + Django REST Framework |
| Database | MongoDB (via MongoEngine ODM) |
| Authentication | JWT (PyJWT) |
| DB Schema (Next.js) | Prisma (MongoDB provider) |

---

## Project Structure

```
online-book-store/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home
│   ├── books/page.tsx      # Book catalog
│   ├── new-release/page.tsx
│   ├── about/page.tsx
│   └── contact/page.tsx
├── components/             # React components
│   ├── HeroSection.tsx
│   ├── FeaturedBooks.tsx
│   ├── TopCategories.tsx
│   ├── MainNavbar.tsx
│   ├── TopNavbar.tsx
│   ├── Footer.tsx
│   └── ui/                 # shadcn/ui primitives
├── prisma/
│   └── schema.prisma       # MongoDB schema (for Next.js server components)
├── backend/                # Django backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/             # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── store/              # Main Django app
│       ├── models.py       # MongoEngine documents
│       ├── serializers.py  # DRF serializers
│       ├── views.py        # API views
│       ├── urls.py         # URL routing
│       └── auth.py         # Custom JWT authentication
└── public/                 # Static assets (book images, icons)
```

---

## Database Models

| Model | Description |
|---|---|
| `User` | Custom user with email login, phone, address |
| `Category` | Book categories with slug |
| `Book` | Books with price, stock, featured/new-release flags |
| `Review` | User reviews with 1–5 star rating (one per user per book) |
| `Cart` | User cart with embedded `CartItem` documents |
| `Order` | Orders with embedded `OrderItem` documents and status tracking |
| `Wishlist` | User wishlist (list of book references) |

Cart items and Order items are **embedded documents** inside their parent — no separate collections needed.

---

## API Endpoints

Base URL: `http://localhost:8000/api/`

### Auth
| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| POST | `auth/register/` | Register new user | No |
| POST | `auth/login/` | Login, returns JWT token | No |
| GET | `auth/profile/` | Get current user profile | Yes |
| PATCH | `auth/profile/` | Update profile | Yes |

### Books & Categories
| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| GET | `books/` | List books (supports search, filter, ordering, pagination) | No |
| GET | `books/<id>/` | Book detail | No |
| GET | `books/<id>/reviews/` | List reviews for a book | No |
| POST | `books/<id>/reviews/` | Add a review | Yes |
| DELETE | `books/<id>/reviews/` | Delete your review | Yes |
| GET | `categories/` | List all categories | No |
| GET | `categories/<slug>/` | Category detail | No |

**Book list query params:** `?search=`, `?category=<slug>`, `?featured=true`, `?new_release=true`, `?ordering=price|-price|title|-title|created_at`, `?page=`

### Cart
| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| GET | `cart/` | View cart | Yes |
| POST | `cart/` | Add item (`book_id`, `quantity`) | Yes |
| PATCH | `cart/` | Update item quantity | Yes |
| DELETE | `cart/` | Remove item (`book_id`) | Yes |

### Orders
| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| GET | `orders/` | List user orders | Yes |
| POST | `orders/checkout/` | Place order from cart | Yes |
| GET | `orders/<id>/` | Order detail | Yes |
| PATCH | `orders/<id>/cancel/` | Cancel order | Yes |

### Wishlist
| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| GET | `wishlist/` | View wishlist | Yes |
| POST | `wishlist/` | Add book (`book_id`) | Yes |
| DELETE | `wishlist/` | Remove book (`book_id`) | Yes |

Authentication header: `Authorization: Bearer <token>`

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB running locally (or a MongoDB Atlas URI)

---

### 1. Frontend (Next.js)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

### 2. Backend (Django)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set MONGODB_URI and SECRET_KEY

# Run database setup (only creates Django's internal SQLite for auth hashers)
python manage.py migrate

# Start the server
python manage.py runserver
```

API will be available at [http://localhost:8000/api/](http://localhost:8000/api/).

No `makemigrations` needed — MongoDB is schema-less; collections are created automatically on first write.

---

### 3. Prisma (optional, for Next.js server components)

```bash
npm install prisma @prisma/client

# Set DATABASE_URL in .env.local
# DATABASE_URL=mongodb://localhost:27017/bookstore_db

npx prisma generate
```

---

### Environment Variables

**`backend/.env`**
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
MONGODB_URI=mongodb://localhost:27017/bookstore_db
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**`.env.local`** (Next.js)
```
DATABASE_URL=mongodb://localhost:27017/bookstore_db
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Frontend Pages

| Route | Description |
|---|---|
| `/` | Home — hero section, featured books, top categories |
| `/books` | Catalog — search, filter by category, sort by price/title/rating |
| `/new-release` | New releases with newsletter signup |
| `/about` | Mission, vision, core values |
| `/contact` | Contact form, business info, FAQ |
