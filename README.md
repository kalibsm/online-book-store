# Online Book Store

A full-stack online book store built with **Next.js** (frontend), **Django REST Framework** (backend), **MongoDB Atlas** as the database, and **Nginx** as a reverse proxy.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| UI Components | shadcn/ui (Radix UI) |
| Backend | Django 5 + Django REST Framework |
| Database | MongoDB Atlas (via MongoEngine ODM) |
| Authentication | JWT (PyJWT) |
| Reverse Proxy | Nginx (routes `/api/`, serves static/media files) |
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
├── lib/
│   └── api.ts                  # Typed API client (all fetch calls)
├── nginx/
│   └── nginx.conf              # Nginx reverse proxy config
├── prisma/
│   └── schema.prisma           # MongoDB schema (for Next.js server components)
├── backend/                    # Django backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── seed_books.py           # Standalone seed script (pymongo)
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
│               └── seed_books.py
└── public/                     # Static assets
```

---

## How Nginx Fits In

All traffic goes through a single entry point on **port 80**:

```
Browser → http://localhost
              │
              ▼
           Nginx :80
         ┌────┴────┐
    /api/ │         │ /
    /admin/│         │ everything else
         ▼         ▼
    Django :8000   Next.js :3000
         │
    /static/ → served directly from volume
    /media/  → served directly from volume
```

- No direct access to `:3000` or `:8000` is needed.
- Nginx serves Django's static and media files directly (no Python involved).
- WebSocket support for Next.js HMR is included.

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

Base URL (via Nginx): `http://localhost/api/`

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

**Query params:** `?search=`, `?category=<slug>`, `?featured=true`, `?new_release=true`, `?ordering=price|-price|title|-title|created_at`, `?page=`

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

- **Docker** + **Docker Compose** (for Docker setup)
- **Node.js 18+** and **Python 3.10+** (for manual setup only)
- A **MongoDB Atlas** account with a cluster and connection string

---

## Option A — Docker with Nginx (recommended)

Runs all three services (Nginx, Next.js, Django) in containers with a single `docker compose up`.

### 1. Configure Docker DNS

If you are on a standard home/office network, skip this step.

If you are on a **university or corporate VPN** and pip/npm installs fail inside Docker due to DNS issues, run these once:

```bash
echo '{"dns": ["8.8.8.8", "1.1.1.1"]}' | sudo tee /etc/docker/daemon.json
sudo systemctl restart docker
```

This tells Docker to use Google's DNS instead of the local stub resolver.

### 2. Configure environment files

```bash
cp .env.local.example .env.local
cp backend/.env.local.example backend/.env.local
```

Edit `backend/.env.local` and set your MongoDB Atlas connection string:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bookstore_db?retryWrites=true&w=majority

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost
```

> **Note on the MongoDB URI format:**
> The default `mongodb+srv://` format requires DNS SRV record resolution.
> On restricted networks where `*.mongodb.net` DNS is blocked, use a direct URI instead — see [Restricted Network Setup](#restricted-network-setup-vpn--corporate) below.

The `.env.local` frontend file only needs the Prisma `DATABASE_URL`. The `NEXT_PUBLIC_API_URL` is overridden by Docker Compose automatically.

### 3. Build and start

```bash
docker compose up --build
```

All three containers start:
- **Nginx** — `http://localhost` (port 80, the only public port)
- **Django** — internal port 8000
- **Next.js** — internal port 3000

### 4. Seed the database (first run only)

While containers are running, open a second terminal:

```bash
docker compose exec backend python seed_books.py
```

This populates **8 categories** and **23 books**.

To reset and re-seed:

```bash
docker compose exec backend python seed_books.py --clear
```

### 5. Verify everything works

```bash
# Frontend loads
curl -o /dev/null -w "%{http_code}" http://localhost

# API responds through Nginx
curl http://localhost/api/books/
```

Open `http://localhost` in the browser. All API calls and pages go through port 80.

### 6. Stop

```bash
docker compose down
```

---

## Restricted Network Setup (VPN / Corporate)

On networks that block DNS for `*.mongodb.net` or interfere with Docker bridge networking (common on university VPNs), two extra steps are required.

### Step 1 — Resolve MongoDB Atlas hosts

First, find your cluster's actual server IPs. Run these from your terminal (not inside Docker):

```bash
nslookup -type=SRV _mongodb._tcp.<your-cluster>.mongodb.net 8.8.8.8
nslookup -type=TXT <your-cluster>.mongodb.net 8.8.8.8
nslookup <shard-host-from-srv>.mongodb.net 8.8.8.8
```

The SRV response gives you 2–3 hostnames like `ac-xxxxx-shard-00-00.<cluster>.mongodb.net`.
The TXT response gives you `authSource=admin&replicaSet=<name>`.
The final nslookup gives you the IPs for each host.

### Step 2 — Add hosts to `/etc/hosts`

```bash
sudo tee -a /etc/hosts << 'EOF'
<ip1> ac-xxxxx-shard-00-00.<cluster>.mongodb.net
<ip2> ac-xxxxx-shard-00-01.<cluster>.mongodb.net
<ip3> ac-xxxxx-shard-00-02.<cluster>.mongodb.net
EOF
```

### Step 3 — Use a direct MongoDB URI

In `backend/.env.local`, replace the `mongodb+srv://` URI with a direct one:

```env
MONGODB_URI=mongodb://<user>:<password>@ac-xxxxx-shard-00-00.<cluster>.mongodb.net:27017,ac-xxxxx-shard-00-01.<cluster>.mongodb.net:27017,ac-xxxxx-shard-00-02.<cluster>.mongodb.net:27017/?authSource=admin&replicaSet=<replicaSet-name>&tls=true&retryWrites=true&w=majority
```

This bypasses SRV DNS lookup entirely. The hosts resolve via `/etc/hosts`, so no DNS is needed.

### Step 4 — Start normally

```bash
docker compose up --build
```

The compose file uses `network_mode: host` so all services bind directly to the host's network interfaces, bypassing Docker's bridge NAT (which VPN iptables rules can interfere with).

---

## Option B — Manual Setup

### 1. Environment files

**Frontend** — create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bookstore_db
```

**Backend** — create `backend/.env.local`:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bookstore_db?retryWrites=true&w=majority
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 2. Backend (Django)

```bash
cd backend

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate        # creates SQLite DB for Django auth hashers

python manage.py runserver
```

API available at `http://localhost:8000/api/`.

> No `makemigrations` needed — MongoDB is schema-less; collections are created automatically on first write.

### 3. Seed the database

```bash
cd backend
source venv/bin/activate

python seed_books.py            # add seed data, skips duplicates
python seed_books.py --clear    # wipe and re-seed
```

Categories seeded: Fiction, Non-Fiction, Science & Tech, Fantasy, Mystery, Biography, History, Self-Help.

### 4. Frontend (Next.js)

```bash
# From the project root
npm install
npm run dev
```

Open `http://localhost:3000`. The frontend calls the Django API directly on port 8000.

### 5. Prisma (optional)

Used for Next.js server-side access to MongoDB:

```bash
npx prisma generate
```

---

## Frontend Pages

| Route | Description |
|---|---|
| `/` | Home — hero section, featured books, top categories |
| `/books` | Catalog — search, filter by category, sort by price / title / date |
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
