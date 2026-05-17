# Engineers Door — Admin Panel

A full-featured admin panel for Engineers Door IT company, built with Next.js 14+, TypeScript, Tailwind CSS, Prisma ORM, and NextAuth.js.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL via Prisma ORM v7
- **Auth**: NextAuth.js v5 (credentials provider)
- **UI Components**: Radix UI primitives + custom components
- **Icons**: Lucide React

## Color Scheme

| Token | Value |
|-------|-------|
| Background | `#0a0f2c` |
| Accent (Cyan) | `#00c2ff` |
| Secondary (Purple) | `#7c3aed` |
| Card Background | `#111827` |
| Border | `#1e2a4a` |

## Features

- **Authentication** — Email/password login with NextAuth.js. All `/admin/*` routes are protected.
- **Dashboard** — Stats overview, recent activity feed, quick action buttons.
- **Blog Post Management** — Full CRUD with title, slug (auto-generated), excerpt, category, author, read time, icon, gradient, markdown body, and publish toggle.
- **Job Listings** — Full CRUD with title, department, type, location, tech tags, and active toggle.
- **Portfolio Projects** — Full CRUD with title, category, description, result metric, tech tags, icon, and gradient.
- **Contact Submissions** — View, mark read/unread, delete. Click to open full message in a dialog.
- **REST API** — Full CRUD API routes under `/api/` for all resources.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Edit `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/engineers_door_admin"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Set up the database

```bash
# Push schema to database
npm run db:push

# Seed with sample data (creates admin user + demo content)
npm run db:seed
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page.

### Default Login

```
Email:    admin@engineersdoor.com
Password: admin123
```

> **Change this password immediately in production!**

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run setup` | Generate client + push schema + seed |

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/posts` | List / create posts |
| GET/PUT/DELETE | `/api/posts/[id]` | Get / update / delete post |
| GET/POST | `/api/jobs` | List / create jobs |
| GET/PUT/DELETE | `/api/jobs/[id]` | Get / update / delete job |
| GET/POST | `/api/projects` | List / create projects |
| GET/PUT/DELETE | `/api/projects/[id]` | Get / update / delete project |
| GET | `/api/contact` | List contact submissions |
| GET/PATCH/DELETE | `/api/contact/[id]` | Get / update read status / delete |
| POST | `/api/setup` | Create initial admin user |

## Project Structure

```
engineers-door-admin/
├── app/
│   ├── admin/
│   │   ├── page.tsx              # Dashboard
│   │   ├── layout.tsx            # Admin layout with sidebar
│   │   ├── blog/                 # Blog management
│   │   ├── jobs/                 # Job listings management
│   │   ├── portfolio/            # Portfolio management
│   │   └── contact/              # Contact submissions
│   ├── api/                      # REST API routes
│   ├── login/                    # Login page
│   └── globals.css               # Global styles + Tailwind theme
├── components/
│   ├── layout/                   # Sidebar, Topbar
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client
│   └── utils.ts                  # Utility functions
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeder
└── proxy.ts                      # Route protection (Next.js 16 proxy)
```
