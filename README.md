# BCN – The Bengal Chronicle Network
## Complete Platform Documentation

---

## 📋 Table of Contents

1. [Project Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Directory Structure](#directory-structure)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [SEO Strategy](#seo-strategy)
8. [Setup & Installation](#setup)
9. [Deployment Guide](#deployment)
10. [Admin Workflow](#admin-workflow)
11. [Environment Variables](#environment-variables)

---

## 1. Project Overview <a name="overview"></a>

**BCN – The Bengal Chronicle Network** is a world-class news platform. Built with enterprise-grade architecture, it delivers:

- ⚡ **Ultra-fast performance** via SSR/SSG + Redis caching
- 🔍 **Maximum SEO** — structured data, sitemaps, auto-metadata
- 📱 **Fully responsive** — desktop, tablet, mobile
- 🌙 **Dark mode** support
- 🛡️ **Secure** — JWT + refresh tokens, rate limiting, HTTPS
- 📊 **Analytics** — views, engagement, SEO scoring
- ♾️ **Scalable** — supports millions of users

---

## 2. Architecture <a name="architecture"></a>

```
┌─────────────────────────────────────────────┐
│                  CLIENTS                      │
│   Browser  •  Mobile App  •  RSS Readers      │
└──────────────────┬──────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────┐
│              NGINX (Reverse Proxy)            │
│   Rate Limiting • SSL • Caching • Gzip        │
└────────────┬───────────────┬────────────────┘
             │               │
┌────────────▼────┐  ┌───────▼────────────────┐
│  Next.js Frontend│  │   Express.js Backend    │
│  (SSR/SSG/ISR)  │  │   (REST API + MVC)      │
└─────────────────┘  └──────┬─────────┬────────┘
                             │         │
                   ┌─────────▼──┐  ┌───▼───────┐
                   │ PostgreSQL  │  │   Redis    │
                   │  (Primary)  │  │  (Cache)   │
                   └────────────┘  └────────────┘
```

---

## 3. Tech Stack <a name="tech-stack"></a>

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 14 | SSR/SSG/ISR framework |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Zustand | State management |
| React Query | Server state + caching |
| Axios | HTTP client |
| Framer Motion | Animations |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API server |
| TypeScript | Type safety |
| Prisma ORM | Database access |
| PostgreSQL | Primary database |
| Redis | Caching layer |
| JWT | Authentication |
| Cloudinary | Media storage |
| Winston | Logging |

---

## 4. Directory Structure <a name="directory-structure"></a>

```
bcn-platform/
├── frontend/                    # Next.js App
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── page.tsx         # Home (SSR)
│   │   │   ├── news/[slug]/     # Article page (SSR)
│   │   │   ├── category/[slug]/ # Category page (ISR)
│   │   │   ├── author/[username]/ # Author page
│   │   │   ├── search/          # Search page
│   │   │   ├── trending/        # Trending news
│   │   │   ├── admin/           # Admin dashboard
│   │   │   └── auth/            # Login/Register
│   │   ├── components/
│   │   │   ├── layout/          # Header, Footer
│   │   │   ├── news/            # News components
│   │   │   ├── admin/           # Admin components
│   │   │   ├── seo/             # SEO components (JSON-LD)
│   │   │   └── ui/              # Shared UI components
│   │   ├── lib/                 # Utilities, API client
│   │   ├── store/               # Zustand stores
│   │   ├── hooks/               # Custom React hooks
│   │   └── types/               # TypeScript types
│
├── backend/                     # Express.js API
│   ├── src/
│   │   ├── controllers/         # Route handlers
│   │   ├── services/            # Business logic
│   │   ├── repositories/        # Data access layer
│   │   ├── routes/              # Express routes
│   │   ├── middlewares/         # Auth, error handling
│   │   ├── validators/          # Input validation (Zod)
│   │   ├── utils/               # Helpers, logger
│   │   ├── config/              # DB, Redis, env config
│   │   ├── jobs/                # Background jobs
│   │   └── server.ts            # Entry point
│   └── prisma/
│       └── schema.prisma        # Database schema
│
├── docker/
│   ├── docker-compose.yml
│   └── nginx/nginx.conf
│
└── docs/                        # This file
```

---

## 5. Database Schema <a name="database-schema"></a>

### Core Tables

```
users
├── id (CUID primary key)
├── email (unique)
├── username (unique)
├── password (bcrypt hashed)
├── role (SUPER_ADMIN | ADMIN | JOURNALIST | EDITOR | USER)
├── refreshToken
└── ...

articles
├── id
├── title
├── slug (unique, SEO-friendly)
├── excerpt
├── content (HTML)
├── thumbnail
├── status (DRAFT | REVIEW | PUBLISHED | SCHEDULED | ARCHIVED)
├── isBreaking, isFeatured, isTrending
├── authorId → users
├── categoryId → categories
├── viewCount, likeCount, commentCount
├── readingTime
├── seoTitle, seoDescription, seoKeywords[]
├── canonicalUrl
├── articleSchema (JSON-LD)
├── seoScore, readabilityScore
└── publishedAt, scheduledAt

categories
├── id, name, slug, description
├── color, icon, image
├── parentId (for sub-categories)
└── isActive, sortOrder

tags
├── id, name, slug
└── usageCount

seo_metadata
├── articleId / categoryId
├── title, description, keywords[]
├── ogTitle, ogDescription, ogImage
├── twitterTitle, twitterDescription, twitterImage
├── jsonLd (Schema.org JSON-LD)
└── seoScore, readabilityScore, keywordDensity
```

---

## 6. API Documentation <a name="api-documentation"></a>

Base URL: `https://api.bengalchronicle.com/api/v1`

### Articles

```
GET    /articles                    # List articles (with pagination, filters)
GET    /articles/trending           # Trending articles
GET    /articles/breaking           # Breaking news
GET    /articles/:slug              # Single article (increments view)
GET    /articles/:slug/related      # Related articles
POST   /articles                    # Create article (Journalist+)
PUT    /articles/:id                # Update article
PATCH  /articles/:id/publish        # Publish article
PATCH  /articles/:id/schedule       # Schedule article
DELETE /articles/:id                # Delete (Admin only)
POST   /articles/:id/like           # Toggle like (auth required)
POST   /articles/:id/bookmark       # Toggle bookmark (auth required)
GET    /articles/:id/seo-analysis   # SEO score & suggestions
```

### Query Parameters for GET /articles

```
?page=1
?limit=20
?category=politics       (slug)
?tag=breaking-news       (slug)
?author=john-doe         (username)
?status=PUBLISHED
?search=bengal election
?sort=publishedAt|views|likes|comments
?order=desc|asc
?featured=true
?breaking=true
?trending=true
```

### Auth

```
POST /auth/register     { name, email, username, password }
POST /auth/login        { email, password }
POST /auth/refresh      { refreshToken }
POST /auth/logout       (auth required)
GET  /auth/me           (auth required)
```

### Categories

```
GET  /categories
GET  /categories/:slug
POST /categories        (Admin)
PUT  /categories/:id    (Admin)
```

### Search

```
GET /search?q=query&category=politics&page=1&limit=20
```

### SEO

```
POST /seo/generate      { title, content, excerpt }  → Auto-generate SEO
GET  /sitemap.xml       → Sitemap index
GET  /sitemap-news.xml  → Google News sitemap
GET  /robots.txt        → Robots file
```

### Response Format

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 1250,
    "page": 1,
    "limit": 20,
    "totalPages": 63,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 7. SEO Strategy <a name="seo-strategy"></a>

BCN is engineered for **maximum Google visibility**:

### On-Page SEO
- ✅ **Dynamic metadata** per article (title, description, keywords)
- ✅ **Canonical URLs** to prevent duplicate content
- ✅ **Open Graph** tags for social media previews
- ✅ **Twitter Cards** for Twitter/X sharing
- ✅ **Schema.org NewsArticle** JSON-LD structured data
- ✅ **Organization schema** on every page
- ✅ **Breadcrumb schema** for category pages

### Technical SEO
- ✅ **sitemap.xml** with sitemap index
- ✅ **sitemap-news.xml** for Google News inclusion
- ✅ **robots.txt** configured correctly
- ✅ **SSR** for instant Google indexing
- ✅ **Fast Core Web Vitals** (LCP, FID, CLS)
- ✅ **Image optimization** (WebP, AVIF, lazy loading)
- ✅ **Gzip compression** via Nginx

### Auto-SEO on Publish
When an admin publishes an article, the system automatically:
1. Generates SEO title (includes "BCN" brand)
2. Generates meta description (120-160 chars)
3. Extracts focus keywords from content
4. Creates Schema.org JSON-LD markup
5. Calculates SEO score (0-100)
6. Measures readability score (Flesch-Kincaid)
7. Analyzes keyword density
8. Provides optimization suggestions

### Targeting "BCN" keyword
- Brand name in every page title: `Article Title | BCN`
- "BCN" in Organization schema
- "BCN" in publisher field of ArticleNewsArticle schema
- "BCN" in alt text and meta tags
- Site name: "BCN – The Bengal Chronicle Network"

---

## 8. Setup & Installation <a name="setup"></a>

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (for production)

### Development Setup

```bash
# 1. Clone & setup backend
cd bcn-platform/backend
npm install
cp .env.example .env
# Edit .env with your values

# 2. Setup database
npx prisma migrate dev
npx prisma db seed  # Optional: seed sample data

# 3. Start backend
npm run dev   # Runs on :8000
npx ts-node-dev --transpile-only src/server.ts

# 4. Setup frontend (new terminal)
cd ../frontend
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# 5. Start frontend
npm run dev   # Runs on :3000
```

---

## 9. Deployment Guide <a name="deployment"></a>

### Docker Production Deploy

```bash
# 1. Copy environment file
cp .env.example .env
# Fill in all production values

# 2. Build & start all services
cd docker
docker-compose up -d --build

# 3. Run database migrations
docker-compose exec backend npx prisma migrate deploy

# 4. Seed initial data (optional)
docker-compose exec backend npm run seed

# 5. Check health
curl https://bengalchronicle.com/health
```

### Services started by Docker Compose:
- **PostgreSQL** → port 5432
- **Redis** → port 6379
- **Backend API** → port 8000
- **Frontend** → port 3000
- **Nginx** → port 80/443

### SSL Certificate (Let's Encrypt)
```bash
certbot certonly --webroot -w /var/www/html -d bengalchronicle.com -d www.bengalchronicle.com
# Place certs in: docker/ssl/fullchain.pem and docker/ssl/privkey.pem
```

---

## 10. Admin Workflow <a name="admin-workflow"></a>

### Publishing a News Article

1. **Login** to Admin Dashboard at `/admin`
2. Click **"New Article"** tab
3. Enter **title** — auto-slug is generated
4. Write **excerpt** (shown in cards and search results)
5. Write **article content** (HTML supported)
6. Click **"Analyze SEO"** button
   - System auto-generates: SEO title, description, keywords
   - Shows SEO score (0-100), readability score
   - Displays Google preview
   - Lists optimization suggestions
7. Review SEO panel and adjust if needed
8. Go to **Settings** tab: set thumbnail, mark as Breaking/Featured
9. Click **Publish** or **Save Draft**
10. Article is live with full SEO metadata at `/news/{slug}`

### SEO Score Interpretation
- **80-100**: Excellent — will rank well
- **60-79**: Good — minor improvements possible
- **40-59**: Needs work — follow suggestions
- **0-39**: Poor — significant SEO issues

---

## 11. Environment Variables <a name="environment-variables"></a>

### Backend (.env)
```env
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://bcn_user:password@localhost:5432/bcn_db

# Redis
REDIS_URL=redis://:password@localhost:6379

# JWT (generate with: openssl rand -base64 64)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGINS=https://bengalchronicle.com,https://www.bengalchronicle.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=news@bengalchronicle.com
SMTP_PASS=your-app-password

# Site
SITE_URL=https://bengalchronicle.com

# Google Verification
GOOGLE_VERIFICATION_TOKEN=your-token
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.bengalchronicle.com/api/v1
NEXT_PUBLIC_SITE_URL=https://bengalchronicle.com
GOOGLE_VERIFICATION_TOKEN=your-google-token
```

---

## FOR ADMIN USER AND PASSWORD
Email:    admin@bengalchronicle.com
Password: Admin@BCN2024!

## backend check
http://localhost:3000/auth/login
http://localhost:3000/admin
http://localhost:3000/admin/articles
http://localhost:3000/admin/articles/create
http://localhost:3000/category/bengal
http://localhost:3000/trending
http://localhost:3000/search
http://localhost:3000/about
http://localhost:3000/contact

## 📞 Support

start laways redis-server
cd /Users/soumyachatterjee/Desktop/bcn-platform/frontend && npm run dev
npx ts-node-dev --transpile-only src/server.ts
cd /Users/soumyachatterjee/Desktop/bcn-platform/backend && npx ts-node-dev --transpile-only src/server.ts

- **Email**: tech@bengalchronicle.com
- **GitHub Issues**: github.com/BCNChronicle/platform/issues

---

*Built with ❤️ for BCN – The Bengal Chronicle Network*
*"Truth. Speed. Bengal."*# BCN-News-Channel-SC
# BCN-News-Channel-SC
