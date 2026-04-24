# Musawwir Art - Technical Documentation

## 1. Project Overview

**Musawwir Art** is a full-stack e-commerce art gallery platform built for showcasing, selling, and managing fine art collections. The platform features a public-facing website with an immersive art browsing experience, a complete admin dashboard for content management, and a robust backend API handling paintings, blogs, testimonials, inquiries, and more.

| Attribute | Details |
|-----------|---------|
| **Project Name** | Musawwir Art |
| **Architecture** | MERN Stack (MongoDB, Express, React, Node.js) |
| **Deployment** | Docker containers with Traefik reverse proxy |
| **Live Domain** | https://musawwirart.com |
| **API Domain** | https://api.musawwirart.com |

---

## 2. Tech Stack

### 2.1 Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^19.2.4 | UI Library |
| **Vite** | ^8.0.0 | Build Tool & Dev Server |
| **Tailwind CSS** | ^4.2.1 | Utility-first CSS Framework |
| **React Router DOM** | ^7.13.1 | Client-side Routing |
| **Framer Motion** | ^12.36.0 | Animations & Transitions |
| **Axios** | ^1.13.6 | HTTP Client |
| **Lucide React** | ^0.577.0 | Icon Library |
| **React Icons** | ^5.6.0 | Additional Icons (WhatsApp, etc.) |
| **ESLint** | ^9.39.4 | Code Linting |

### 2.2 Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20 (Alpine) | Runtime Environment |
| **Express.js** | ^5.2.1 | Web Framework |
| **MongoDB** | (Cloud/Atlas) | NoSQL Database |
| **Mongoose** | ^9.3.1 | MongoDB ODM |
| **JWT** | ^9.0.3 | Authentication Tokens |
| **Bcrypt** | ^6.0.0 | Password Hashing |
| **Multer** | ^2.1.1 | File Upload Handling |
| **Sharp** | ^0.34.5 | Image Processing (WebP conversion) |
| **Helmet** | ^8.1.0 | Security Headers |
| **CORS** | ^2.8.6 | Cross-Origin Resource Sharing |
| **Morgan** | ^1.10.1 | HTTP Request Logging |
| **Slugify** | ^1.6.9 | URL-friendly string generation |

### 2.3 DevOps & Infrastructure
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Static file serving & reverse proxy |
| **Traefik** | Reverse proxy & SSL termination |
| **Let's Encrypt** | Free SSL certificates |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        TRAEFIK (Reverse Proxy)                   │
│  ┌─────────────────────┐        ┌─────────────────────────────┐ │
│  │  musawwirart.com    │        │  api.musawwirart.com        │ │
│  │  (Frontend)         │        │  (Backend API)              │ │
│  └──────────┬──────────┘        └─────────────┬───────────────┘ │
└─────────────┼───────────────────────────────────┼─────────────────┘
              │                                   │
              ▼                                   ▼
┌─────────────────────────┐          ┌────────────────────────────┐
│   Frontend Container    │          │    Backend Container       │
│   (Nginx + Static)      │          │    (Node.js + Express)     │
│   - React SPA           │          │    - REST API              │
│   - Nginx Config        │◄─────────┤    - Image Processing      │
│   - Uploads Proxy       │  /api/*  │    - JWT Auth              │
└─────────────────────────┘          └────────────┬───────────────┘
                                                  │
                                                  ▼
                                     ┌────────────────────────┐
                                     │    MongoDB Atlas       │
                                     │    (Cloud Database)    │
                                     └────────────────────────┘
```

---

## 4. Database Schema (MongoDB)

### 4.1 Paintings Collection
```javascript
{
  title: String (required, trimmed),
  description: String (required),
  dimensions: String (required),
  medium: String (required),
  imageUrl: String (required),
  category: ObjectId (ref: 'Category', indexed),
  isAvailable: Boolean (default: true),
  status: String (enum: ['draft', 'published'], default: 'published'),
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 Categories Collection
```javascript
{
  name: String (required, trimmed),
  slug: String (required, unique, lowercase),
  description: String,
  parent: ObjectId (ref: 'Category', default: null),
  bannerImage: String,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### 4.3 Blogs Collection
```javascript
{
  title: String (required, trimmed),
  slug: String (unique, auto-generated from title),
  excerpt: String (required, max: 300),
  content: String (required),
  images: [String],
  categories: [String],
  tags: [String],
  status: String (enum: ['draft', 'published', 'scheduled'], default: 'draft'),
  publishedAt: Date,
  scheduledAt: Date,
  author: String (default: 'Musawwir Art'),
  seo: {
    metaTitle: String,
    metaDescription: String,
    canonicalUrl: String,
    ogImage: String,
    keywords: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 4.4 Testimonials Collection
```javascript
{
  name: String (required),
  location: String (required),
  text: String (required),
  stars: Number (default: 5, min: 1, max: 5),
  authorImage: String,
  isFeatured: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### 4.5 Inquiries Collection
```javascript
{
  name: String (required),
  email: String (required, lowercase),
  phone: String,
  message: String (required, max: 1000),
  paintingId: ObjectId (ref: 'Painting', optional),
  paintingTitle: String (optional),
  status: String (enum: ['New', 'In Progress', 'Responded', 'Archived'], default: 'New'),
  createdAt: Date
}
```

### 4.6 Users Collection (Admin)
```javascript
{
  email: String (required, unique, lowercase),
  password: String (required, bcrypt hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### 4.7 Homepage Config Collection
```javascript
{
  banners: [{
    type: String (enum: ['image', 'video']),
    url: String,
    filename: String,
    title: String,
    subtitle: String,
    ctaText: String,
    ctaLink: String
  }],
  sections: [{
    id: String,
    label: String,
    isVisible: Boolean,
    order: Number
  }],
  seo: {
    metaTitle: String,
    metaDescription: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 4.8 Featured Collections Collection
```javascript
{
  title: String (required),
  dimensions: String (required),
  medium: String (required),
  layoutStyle: String (enum: ['Square (1:1)', 'Horizontal Rectangle (4:3)', 'Landscape (16:9)', 'Vertical Rectangle (3:4)', 'Portrait (9:16)']),
  imageUrl: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 5. API Endpoints

### Base URL: `https://api.musawwirart.com/api`

### 5.1 Authentication Routes (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Create admin account |
| POST | `/auth/login` | Public | Login & receive JWT |
| POST | `/auth/change-password` | Bearer Token | Update password |

### 5.2 Paintings Routes (`/api/paintings`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/paintings` | Public | Get all paintings (supports `mode=admin`, `category` filter) |
| GET | `/paintings/:id` | Public | Get single painting by ID |
| POST | `/paintings` | Bearer Token + `upload.single('image')` | Create new painting |
| PUT | `/paintings/:id` | Bearer Token + `upload.single('image')` | Update painting |
| DELETE | `/paintings/:id` | Bearer Token | Delete painting & image file |

### 5.3 Categories Routes (`/api/categories`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/categories` | Public | Get all categories |
| GET | `/categories/tree` | Public | Get category hierarchy tree |
| POST | `/categories` | Public | Create category |
| PUT | `/categories/:id` | Public | Update category |
| DELETE | `/categories/:id` | Public | Delete category |

### 5.4 Blog Routes (`/api/blogs`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/blogs` | Public | Get all blogs (supports pagination, search, category, tag filters) |
| GET | `/blogs/:slug` | Public | Get single blog by slug |
| GET | `/blogs/id/:id` | Public | Get single blog by ID |
| POST | `/blogs` | Bearer Token + `upload.array('images', 5)` | Create blog with up to 5 images |
| PUT | `/blogs/:id` | Bearer Token + `upload.array('images', 5)` | Update blog |
| DELETE | `/blogs/:id` | Bearer Token | Delete blog & images |

### 5.5 Testimonials Routes (`/api/testimonials`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/testimonials` | Public | Get featured testimonials |
| POST | `/testimonials` | `upload.single('authorImage')` | Create testimonial |
| PUT | `/testimonials/:id` | `upload.single('authorImage')` | Update testimonial |
| DELETE | `/testimonials/:id` | Public | Delete testimonial |

### 5.6 Inquiries Routes (`/api/inquiries`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/inquiries/submit` | Public | Submit inquiry form |
| GET | `/inquiries/all` | Bearer Token | Get all inquiries (admin) |
| PATCH | `/inquiries/:id/status` | Bearer Token | Mark inquiry as completed |
| DELETE | `/inquiries/:id` | Bearer Token | Delete inquiry |

### 5.7 Homepage Routes (`/api/homepage`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/homepage` | Public | Get homepage config (banners, sections, SEO) |
| POST | `/homepage/update` | Bearer Token + `upload.single('file')` | Add/update banner slide |
| DELETE | `/homepage/banner/:id` | Bearer Token | Delete banner slide & file |

### 5.8 Featured Collections Routes (`/api/featured-collections`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/featured-collections` | Public | Get all featured collections |
| POST | `/featured-collections` | Bearer Token + `upload.single('image')` | Create collection |
| DELETE | `/featured-collections/:id` | Bearer Token | Delete collection |

### 5.9 Admin Stats Routes (`/api/admin`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/stats` | Public | Get dashboard stats (total paintings, inquiries, recent activity) |

---

## 6. Frontend Architecture

### 6.1 Routing Structure
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Landing page with all sections |
| `/aboutus` | `AboutUs` | About the gallery |
| `/art-maintenance` | `ArtMaintenance` | Art care guide |
| `/paintings` | `PaintingsPage` | Art catalog with filters |
| `/paintings/:id` | `ProductDetailsPage` | Individual painting detail |
| `/blog` | `BlogPage` | Blog listing |
| `/blog/:slug` | `BlogDetailPage` | Single blog post |
| `/faq` | `FAQ` | Frequently asked questions |
| `/terms` | `TermsOfService` | Terms of service |
| `/copyright` | `CopyrightPolicy` | Copyright policy |
| `/artist` | `MandeepGhai` | Artist profile page |
| `/admin/login` | `AdminLogin` | Admin login |
| `/admin/signup` | `AdminSignup` | Admin registration |
| `/admin/dashboard` | `AdminDashboard` | Protected admin panel |

### 6.2 Public Components
| Component | Path | Description |
|-----------|------|-------------|
| **Header** | `Components/Header.jsx` | Navigation bar with logo, links, search, cart, user icons |
| **HeroSection** | `Components/HeroSection/HeroSection.jsx` | Full-screen carousel with images/video, auto-play, Framer Motion animations |
| **Features** | `Components/HeroSection/Features.jsx` | 3-column feature grid (Blockchain, Curated, Worldwide Shipping) |
| **CategorySection** | `Components/CategorySection.jsx` | 4 category cards with hover effects |
| **ExploreByStyle** | `Components/ExploreByStyle.jsx` | Style filter grid linking to paintings page |
| **FeaturedCollections** | `Components/FeaturedCollections.jsx` | Featured artwork showcase |
| **NewCollection** | `Components/NewCollection.jsx` | Signature collection promo section |
| **ArtSection** | `Components/ArtSection.jsx` | Curated masterpieces grid with wishlist |
| **DiscoverArt** | `Components/DiscoverArt.jsx` | Category discovery + product prints grid |
| **SoldPaintings** | `Components/SoldPaintings.jsx` | Gallery of sold artwork |
| **InstagramSection** | `Components/ConnectInstagram.jsx` | Instagram feed grid |
| **TestimonialSlider** | `Components/TestimonialSlider.jsx` | Client testimonials carousel |
| **ContactForm** | `Components/ContactForm.jsx` | Art inquiry modal form |
| **FloatingButtons** | `Components/FloatingButtons.jsx` | Scroll-to-top & WhatsApp floating buttons |
| **Footer** | `Components/Footer.jsx` | 4-column footer with contacts, links, social, logo |
| **ImageZoom** | `Components/ImageZoom.jsx` | Product image zoom component |
| **SubNav** | `Components/SubNav.jsx` | Sub-navigation component |
| **TwoGrid** | `Components/TwoGrid.jsx` | Asymmetric mosaic image layout |

### 6.3 Admin Components
| Component | Path | Description |
|-----------|------|-------------|
| **AdminDashboard** | `Admin/AdminDashboard.jsx` | Main admin layout with sidebar |
| **AdminLogin** | `Admin/AdminLogin.jsx` | Admin authentication |
| **AdminSignup** | `Admin/AdminSignup.jsx` | Admin registration |
| **OverviewComponent** | `Admin/components/OverviewComponent.jsx` | Dashboard overview stats |
| **ManageGallery** | `Admin/components/ManageGallery.jsx` | Painting CRUD management |
| **PaintingForm** | `Admin/components/PaintingForm.jsx` | Add/edit painting form |
| **CategoryManager** | `Admin/components/CategoryManager.jsx` | Category management |
| **BlogManager** | `Admin/components/BlogManager.jsx` | Blog CRUD with rich text |
| **DraftsList** | `Admin/components/DraftsList.jsx` | Manage blog drafts |
| **Testimonials** | `Admin/components/Testimonials.jsx` | Testimonial management |
| **ManageInquires** | `Admin/components/ManageInquires.jsx` | View & manage inquiries |
| **FeaturedCollectionsManager** | `Admin/components/FeaturedCollectionsManager.jsx` | Featured collections CRUD |
| **ManageHomePage** | `Admin/components/ManageHomePage.jsx` | Homepage banner management |
| **EditHomePage** | `Admin/components/EditHomePage.jsx` | Edit homepage sections |
| **ChangePassword** | `Admin/components/ChangePassword.jsx` | Admin password update |

### 6.4 Utility Functions
| Utility | Path | Description |
|---------|------|-------------|
| **buildImageUrl** | `Utils/buildImageUrl.js` | Normalizes image URLs across environments (local, production, uploads) |
| **API Service** | `Services/api.js` | Axios instance with JWT interceptor for authenticated requests |

---

## 7. Image Processing Pipeline

### 7.1 Upload Flow
```
Client Upload → Multer (temp storage) → Sharp Processing → WebP Conversion → Local Storage → URL Response
```

### 7.2 Sharp Processing Settings
| Asset Type | Resize | Format | Quality | Max Size |
|------------|--------|--------|---------|----------|
| Paintings | 2000x2000 (fit: inside) | WebP | 80% | - |
| Blog Images | 1400x900 (fit: cover) | WebP | 85% | - |
| Testimonials | 2500x2500 (fit: inside) | WebP | 85% | - |
| Hero Videos | - | MP4/WebM | - | 100MB |

### 7.3 Supported File Types
- **Images**: JPEG, JPG, PNG, WebP
- **Videos**: MP4, WebM, MOV (QuickTime)

### 7.4 Storage Structure
```
Backend/public/uploads/
├── paintings/        # Processed painting images (WebP)
├── blogs/            # Blog post images (WebP)
├── testimonials/     # Testimonial author images (WebP)
└── homepage/         # Hero banner images/videos
```

---

## 8. Authentication & Security

### 8.1 JWT Authentication
- **Token Type**: Bearer Token
- **Expiry**: 1 day
- **Storage**: `localStorage` (Frontend)
- **Header**: `Authorization: Bearer <token>`

### 8.2 Security Middleware
| Middleware | Purpose |
|------------|---------|
| **Helmet** | Security headers (CSP, HSTS, X-Frame-Options) |
| **CORS** | Cross-origin access control |
| **Morgan** | HTTP request logging (dev mode) |
| **Bcrypt** | Password hashing (salt rounds: 10) |

### 8.3 Nginx Security Headers
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- CORS headers for uploads

---

## 9. Deployment & Infrastructure

### 9.1 Docker Configuration

#### Frontend Dockerfile
```dockerfile
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### 9.2 Docker Compose Services
| Service | Image | Port | Domain |
|---------|-------|------|--------|
| Backend | Custom Node | 3000 | api.musawwirart.com |
| Frontend | Custom Nginx | 80 | musawwirart.com, www.musawwirart.com |

### 9.3 Traefik Labels
- SSL termination via Let's Encrypt
- CORS middleware for API
- Automatic HTTPS redirect
- Load balancing on port 80 (frontend) and 3000 (backend)

### 9.4 Volume Mounts
| Container | Host Path | Container Path | Purpose |
|-----------|-----------|----------------|---------|
| Backend | `/var/www/musawwir_data/public` | `/app/public` | Persistent uploads |
| Frontend | `/var/www/musawwir_data/public/uploads` | `/usr/share/nginx/html/uploads` | Image serving |

---

## 10. Environment Variables

### 10.1 Backend (.env)
```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/musawwirarts
JWT_SECRET=your-super-secret-jwt-key
```

### 10.2 Frontend (.env)
```env
VITE_BASE_URL=https://api.musawwirart.com/api
VITE_API_URL=https://api.musawwirart.com
```

---

## 11. Key Features

### 11.1 Public Website
- **Responsive Design**: Mobile-first, works on all devices
- **Hero Carousel**: Image/video slides with auto-play (9s interval)
- **Art Catalog**: Filter by category, style, availability
- **Product Detail**: Image zoom, painting specs, inquiry form
- **Blog System**: SEO-optimized with categories, tags, scheduled publishing
- **Testimonials**: Client reviews carousel
- **Contact/Inquiry**: Art-specific inquiry forms linked to paintings
- **Floating Actions**: WhatsApp direct chat + scroll-to-top

### 11.2 Admin Dashboard
- **Painting Management**: CRUD operations with image upload
- **Category System**: Parent-child hierarchy for art categorization
- **Blog Editor**: Rich content with multiple images, drafts, scheduling
- **Testimonials**: Add/edit collector reviews with photos
- **Inquiry Management**: View, status update, delete inquiries
- **Homepage Editor**: Dynamic banner slides (image/video), section visibility
- **Featured Collections**: Curated collections with layout styles
- **Analytics**: Dashboard stats (total paintings, inquiries, recent activity)
- **Password Management**: Secure password change

### 11.3 SEO Features
- Meta title/description per page
- Canonical URLs
- Open Graph images
- Slug-based URLs for blogs
- Keyword support

---

## 12. File Structure

```
Musawwir-Art/
├── docker-compose.yml              # Docker orchestration
├── Technical_document.md           # This document
│
├── Backend/
│   ├── server.js                   # Express entry point
│   ├── db.js                       # MongoDB connection
│   ├── Dockerfile
│   ├── package.json
│   ├── .env                        # Environment variables
│   │
│   ├── Models/                     # Mongoose schemas
│   │   ├── PaintingModel.js
│   │   ├── CategoryModel.js
│   │   ├── BlogModel.js
│   │   ├── TestimonialModel.js
│   │   ├── InquiryModel.js
│   │   ├── UserModel.js
│   │   ├── HomePageModel.js
│   │   ├── FeaturedCollectionModel.js
│   │   └── seed.js
│   │
│   ├── controllers/                # Business logic
│   │   ├── paintingController.js
│   │   ├── blogController.js
│   │   ├── categoryController.js
│   │   ├── testimonialController.js
│   │   └── featuredCollectionController.js
│   │
│   ├── Routes/                     # API route definitions
│   │   ├── AuthUserRoutes.js
│   │   ├── PaintingRoutes.js
│   │   ├── CategoryRoutes.js
│   │   ├── BlogRoutes.js
│   │   ├── TestimonialRoutes.js
│   │   ├── InquiryRoutes.js
│   │   ├── HomePageRoutes.js
│   │   ├── FeaturedCollectionRoutes.js
│   │   └── AdminRoutes.js
│   │
│   ├── middlewares/                # Express middleware
│   │   ├── authMiddlewares.js      # JWT verification
│   │   └── Multer.js               # File upload config
│   │
│   ├── localImageStorage.js        # Sharp image processing helpers
│   └── public/uploads/             # Uploaded assets
│       ├── paintings/
│       ├── blogs/
│       ├── testimonials/
│       └── homepage/
│
└── Frontend/
    ├── index.html
    ├── vite.config.js
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── .env
    │
    ├── public/                     # Static assets
    │   ├── Client_images/          # Client artwork images
    │   ├── logo*.png/jpeg
    │   └── video1.mp4
    │
    └── src/
        ├── main.jsx                # React entry point
        ├── App.jsx                 # Router & layout
        ├── App.css
        ├── index.css
        │
        ├── Components/             # Reusable public components
        │   ├── HeroSection/
        │   │   ├── HeroSection.jsx
        │   │   └── Features.jsx
        │   ├── Header.jsx
        │   ├── Footer.jsx
        │   ├── ArtSection.jsx
        │   ├── CategorySection.jsx
        │   ├── ExploreByStyle.jsx
        │   ├── NewCollection.jsx
        │   ├── DiscoverArt.jsx
        │   ├── FeaturedCollections.jsx
        │   ├── SoldPaintings.jsx
        │   ├── ContactForm.jsx
        │   ├── TestimonialSlider.jsx
        │   ├── ConnectInstagram.jsx
        │   ├── FloatingButtons.jsx
        │   ├── TwoGrid.jsx
        │   ├── ImageZoom.jsx
        │   └── SubNav.jsx
        │
        ├── Pages/                  # Route-level pages
        │   ├── PaintingsPage.jsx
        │   ├── ProductDetail/
        │   │   ├── ProductDetailPage.jsx
        │   │   └── ProductExtras.jsx
        │   ├── AboutUs/
        │   │   ├── AboutUs.jsx
        │   │   └── FAQsection.jsx
        │   ├── Artist/
        │   │   └── MandeepGhai.jsx
        │   ├── ArtMaintainence/
        │   │   └── ArtMaintenance.jsx
        │   ├── Blog/
        │   │   ├── BlogPage.jsx
        │   │   └── BlogDetailPage.jsx
        │   ├── FAQ/
        │   │   └── FAQ.jsx
        │   ├── TermsOfService/
        │   │   └── TermsOfService.jsx
        │   ├── CopyRight/
        │   │   └── Copyrightpolicy.jsx
        │   └── dataraw.js
        │
        ├── Admin/                  # Admin panel
        │   ├── AdminDashboard.jsx
        │   ├── AdminLogin.jsx
        │   ├── AdminSignup.jsx
        │   └── components/
        │       ├── OverviewComponent.jsx
        │       ├── ManageGallery.jsx
        │       ├── PaintingForm.jsx
        │       ├── CategoryManager.jsx
        │       ├── BlogManager.jsx
        │       ├── DraftsList.jsx
        │       ├── Testimonials.jsx
        │       ├── ManageInquires.jsx
        │       ├── FeaturedCollectionsManager.jsx
        │       ├── ManageHomePage.jsx
        │       ├── EditHomePage.jsx
        │       └── ChangePassword.jsx
        │
        ├── Services/
        │   └── api.js              # Axios API client
        │
        ├── Utils/
        │   └── buildImageUrl.js    # Image URL normalizer
        │
        └── assets/                 # Bundled assets
            ├── hero.png
            ├── maintenance/        # Art maintenance icons
            └── sold-paintings/     # Sold artwork images
```

---

## 13. Development Commands

### Local Development
```bash
# Backend
cd Backend
npm install
node server.js          # Runs on http://localhost:3000

# Frontend
cd Frontend
npm install
npm run dev             # Runs on http://localhost:5173

# Production Build (Frontend)
npm run build           # Output: dist/ folder
```

### Docker Deployment
```bash
# Start all services
docker-compose up -d

# Rebuild after changes
docker-compose up -d --build

# View logs
docker-compose logs -f
```

---

## 14. Contact & Support

| Contact | Details |
|---------|---------|
| **Phone** | +971 55 743 0228 |
| **Email** | musawwirart1@gmail.com |
| **WhatsApp** | https://wa.me/+971557430228 |

---

*Document Version: 1.0*  
*Last Updated: 2025*  
*Project: Musawwir Art - Premium Art Gallery Platform*

