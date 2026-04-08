# 📖 PageTurn — MERN Online Book Rental Store

A full-stack book rental web application built with **MongoDB, Express.js, React, and Node.js**.

---

## 🚀 Features

### User Features
- Register & Login with email/password (JWT auth)
- Browse books with search, filter by genre, pagination
- View book details with cover, description, ratings
- Rent books for custom duration (7/14/21/30 days)
- Personal "My Shelf" — view active/returned rentals
- Return books anytime from shelf

### Admin Features
- Admin Dashboard with stats (users, books, rentals, overdue)
- Book management — Add, Edit, Delete books
- View all users and their individual rental history
- View all rentals with filter by status (active/returned/overdue)
- Genre breakdown chart

---

## 🔑 Admin Credentials

```
Email:    admin@admin.com
Password: admin@123
```

Access admin panel at: `http://localhost:3000/admin`

---

## 📦 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router v6        |
| Styling   | Inline CSS with CSS Variables     |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB with Mongoose             |
| Auth      | JWT + bcryptjs                    |
| Toasts    | react-hot-toast                   |

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js v16+
- MongoDB running locally on port 27017
- npm or yarn

### Step 1: Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment

The backend `.env` is already configured:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=bookstore_secret_key_2024
NODE_ENV=development
```

### Step 3: Start the App

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Server runs at: `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```
App runs at: `http://localhost:3000`

> On first start, the backend **auto-seeds**:
> - Admin user: `admin@admin.com` / `admin@123`
> - 12 sample books across multiple genres

---

## 📁 Project Structure

```
bookstore/
├── backend/
│   ├── models/
│   │   ├── User.js         # User schema (name, email, password, role)
│   │   ├── Book.js         # Book schema (title, author, genre, copies, etc.)
│   │   └── Rental.js       # Rental schema (user, book, dates, status)
│   ├── routes/
│   │   ├── auth.js         # POST /register, /login, GET /profile
│   │   ├── books.js        # GET all/one, POST, PUT, DELETE
│   │   ├── rentals.js      # POST rent, GET my-rentals, PUT return
│   │   └── admin.js        # GET stats, users, all-rentals
│   ├── middleware/
│   │   └── auth.js         # JWT protect + adminOnly middleware
│   ├── seed.js             # Admin + sample books seeder
│   ├── server.js           # Express app entry
│   └── .env                # Environment variables
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.js   # Global auth state + localStorage
        ├── components/
        │   ├── Navbar.js        # Responsive top navigation
        │   └── BookCard.js      # Book card with hover effects
        ├── pages/
        │   ├── Home.js          # Landing page with hero, genres, featured books
        │   ├── Books.js         # Browse with search + genre filter + pagination
        │   ├── BookDetail.js    # Single book with rent form
        │   ├── Login.js         # Email/password login
        │   ├── Register.js      # User registration
        │   ├── MyShelf.js       # User rental history + return action
        │   └── admin/
        │       ├── AdminLayout.js    # Sidebar + topbar layout
        │       ├── AdminDashboard.js # Stats + genre chart
        │       ├── AdminBooks.js     # CRUD books table + modal form
        │       ├── AdminUsers.js     # Users list + per-user rentals
        │       └── AdminRentals.js   # All rentals with filters
        └── App.js               # Routes + protected routes
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint              | Auth     | Description         |
|--------|-----------------------|----------|---------------------|
| POST   | /api/auth/register    | Public   | Register new user   |
| POST   | /api/auth/login       | Public   | Login, get JWT      |
| GET    | /api/auth/profile     | User     | Get own profile     |

### Books
| Method | Endpoint              | Auth     | Description                   |
|--------|-----------------------|----------|-------------------------------|
| GET    | /api/books            | Public   | All books (filter, paginate)  |
| GET    | /api/books/:id        | Public   | Single book                   |
| POST   | /api/books            | Admin    | Create book                   |
| PUT    | /api/books/:id        | Admin    | Update book                   |
| DELETE | /api/books/:id        | Admin    | Soft delete book              |

### Rentals
| Method | Endpoint                  | Auth  | Description           |
|--------|---------------------------|-------|-----------------------|
| POST   | /api/rentals              | User  | Rent a book           |
| GET    | /api/rentals/my           | User  | My rental history     |
| PUT    | /api/rentals/:id/return   | User  | Return a book         |

### Admin
| Method | Endpoint                        | Auth  | Description              |
|--------|---------------------------------|-------|--------------------------|
| GET    | /api/admin/stats                | Admin | Dashboard statistics     |
| GET    | /api/admin/users                | Admin | All registered users     |
| GET    | /api/admin/rentals              | Admin | All rentals              |
| GET    | /api/admin/rentals/user/:userId | Admin | Rentals by user          |

---

## 🎨 Design

- **Theme**: Dark luxury with gold accents
- **Fonts**: Playfair Display (headings) + DM Sans (body)
- **Colors**: Deep navy bg, amber/gold accent (#e8c547)
- **Responsive**: Mobile-first, hamburger nav, fluid grids

---

## 📝 MongoDB Data Models

### User
```js
{ name, email, password (bcrypt), role: ['user','admin'], createdAt }
```

### Book
```js
{ title, author, description, genre, coverImage, rentPrice, totalCopies, availableCopies, isbn, publishedYear, language, rating, isActive }
```

### Rental
```js
{ user (ref), book (ref), rentedAt, dueDate, returnedAt, status: ['active','returned','overdue'], rentPrice }
```
