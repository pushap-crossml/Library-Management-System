# Library Management System - Complete Setup Guide

## 🚀 Project Overview

A modern, full-stack Library Management System built with:
- **Backend**: Django + Django REST Framework + MySQL
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)

---

## 📋 Prerequisites

Before starting, ensure you have installed:

1. **Python 3.8+** - [Download](https://www.python.org/downloads/)
2. **Node.js 18+** - [Download](https://nodejs.org/)
3. **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/)
4. **Git** - [Download](https://git-scm.com/downloads/)

---

## 🛠️ Backend Setup (Django + DRF)

### Step 1: Database Setup

1. Start MySQL server
2. Open MySQL shell or workbench and run:

```sql
CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'library_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON library_db.* TO 'library_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step 2: Backend Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Environment Configuration

Create `.env` file in backend directory:

```bash
cp .env.example .env
```

Edit `.env` and update database credentials:

```env
DB_NAME=library_db
DB_USER=library_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=your-secret-key-here
```

Or directly update `library_project/settings.py` DATABASES section.

### Step 4: Run Migrations

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser
# Follow prompts to create admin account
```

### Step 5: Load Sample Data (Optional)

Create a file `load_sample_data.py` in backend directory:

```python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_project.settings')
django.setup()

from library.models import Category, Author, Publisher, Book
from django.contrib.auth import get_user_model

User = get_user_model()

# Create categories
categories = ['Fiction', 'Science', 'History', 'Technology', 'Biography']
for cat_name in categories:
    Category.objects.get_or_create(name=cat_name)

# Create authors
authors_data = [
    {'name': 'J.K. Rowling', 'country': 'UK'},
    {'name': 'George Orwell', 'country': 'UK'},
    {'name': 'Isaac Asimov', 'country': 'USA'},
]
for author_data in authors_data:
    Author.objects.get_or_create(**author_data)

# Create publishers
publishers = ['Penguin Random House', 'HarperCollins', 'Simon & Schuster']
for pub_name in publishers:
    Publisher.objects.get_or_create(name=pub_name)

print("Sample data loaded successfully!")
```

Run it:
```bash
python load_sample_data.py
```

### Step 6: Start Backend Server

```bash
python manage.py runserver
```

Backend will run at: `http://localhost:8000`

**Test the API:**
- Admin Panel: `http://localhost:8000/admin`
- API Root: `http://localhost:8000/api/`

---

## 🎨 Frontend Setup (Next.js + Tailwind)

### Step 1: Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install npm packages
npm install
```

### Step 2: Environment Configuration

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Content should be:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 3: Start Frontend Server

```bash
npm run dev
```

Frontend will run at: `http://localhost:3000`

---

## 🧪 Testing the Application

### 1. Register a New User

1. Go to `http://localhost:3000`
2. Click "Register here"
3. Fill in the registration form
4. Click "Create Account"

### 2. Login

1. Use your credentials to login
2. You'll be redirected to the dashboard

### 3. Add Books (Admin)

1. Login to admin panel: `http://localhost:8000/admin`
2. Use superuser credentials
3. Add Categories, Authors, Publishers, and Books

### 4. Test Features

- **Browse Books**: Navigate to Books section
- **Search**: Use search functionality
- **Issue Book**: Issue a book to your account
- **Return Book**: Return an issued book
- **View Stats**: Check dashboard statistics

---

## 📁 Project Structure

```
library-management-system/
│
├── backend/                    # Django Backend
│   ├── library_project/        # Main project settings
│   │   ├── settings.py         # Django settings
│   │   ├── urls.py             # URL routing
│   │   └── wsgi.py             # WSGI config
│   │
│   ├── library/                # Library app
│   │   ├── models.py           # Database models
│   │   ├── serializers.py      # DRF serializers
│   │   ├── views.py            # API views
│   │   ├── urls.py             # App URLs
│   │   └── admin.py            # Admin configuration
│   │
│   ├── manage.py               # Django management
│   └── requirements.txt        # Python dependencies
│
└── frontend/                   # Next.js Frontend
    ├── src/
    │   ├── app/                # Next.js app directory
    │   │   ├── dashboard/      # Dashboard pages
    │   │   ├── login/          # Login page
    │   │   ├── register/       # Register page
    │   │   ├── layout.tsx      # Root layout
    │   │   └── page.tsx        # Home page
    │   │
    │   ├── components/         # Reusable components
    │   └── lib/                # Utilities
    │       ├── api.ts          # API client
    │       └── types.ts        # TypeScript types
    │
    ├── package.json            # Node dependencies
    ├── tsconfig.json           # TypeScript config
    └── tailwind.config.js      # Tailwind config
```

---

## 🔑 Key Features Implemented

### User Management ✅
- User registration with role selection (Student/Staff/External)
- JWT-based authentication
- User profiles with detailed information
- Login/Logout functionality

### Book Management ✅
- Add, update, delete books
- ISBN-based book entry
- Multiple copies per book
- Categories, Authors, Publishers management

### Search & Discovery ✅
- Search by title, author, ISBN, category
- Advanced filters (availability, year, language)
- Pagination support

### Issue/Return System ✅
- Book issue tracking
- Automatic due date calculation (14 days)
- Return processing
- Book renewal (max 2 times)
- Overdue tracking
- Reservation/hold requests

### Dashboard ✅
- Real-time statistics
- Total books, members, issues
- Overdue books tracking
- Pending reservations

---

## 🔒 Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Password Validation**: Django's built-in validators
3. **CORS Protection**: Configured for localhost
4. **SQL Injection Protection**: Django ORM
5. **XSS Protection**: React's built-in escaping

---

## 🚀 Deployment (Production)

### Backend Deployment

1. Update `settings.py`:
```python
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']
```

2. Collect static files:
```bash
python manage.py collectstatic
```

3. Use production server (Gunicorn):
```bash
pip install gunicorn
gunicorn library_project.wsgi:application
```

### Frontend Deployment

```bash
npm run build
npm start
```

Or deploy to Vercel:
```bash
vercel --prod
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/token/` - Login (get JWT tokens)
- `POST /api/token/refresh/` - Refresh access token
- `POST /api/register/` - Register new user

### Books
- `GET /api/books/` - List all books
- `GET /api/books/{id}/` - Get book details
- `POST /api/books/` - Create book
- `PUT /api/books/{id}/` - Update book
- `DELETE /api/books/{id}/` - Delete book

### Issues
- `GET /api/issues/` - List issue records
- `POST /api/issues/` - Issue a book
- `POST /api/issues/{id}/return_book/` - Return book
- `POST /api/issues/{id}/renew/` - Renew book
- `GET /api/issues/my_issues/` - Get current user's issues

### Categories, Authors, Publishers
- Standard CRUD operations available
- `GET /api/categories/`
- `GET /api/authors/`
- `GET /api/publishers/`

### Dashboard
- `GET /api/dashboard/stats/` - Get dashboard statistics

---

## 🐛 Troubleshooting

### Backend Issues

**Error: `ModuleNotFoundError: No module named 'library'`**
- Solution: Run `python manage.py makemigrations library`

**Error: `Access denied for user`**
- Solution: Check MySQL credentials in `settings.py`

**Error: `Port 8000 already in use`**
- Solution: `python manage.py runserver 8001`

### Frontend Issues

**Error: `Module not found: Can't resolve '@/lib/api'`**
- Solution: Run `npm install` again

**Error: Network errors**
- Solution: Ensure backend is running on port 8000
- Check `.env.local` has correct API URL

**Error: CORS errors**
- Solution: Check `CORS_ALLOWED_ORIGINS` in Django settings

---

## 🎯 Next Steps & Enhancements

1. **Email Notifications**: Send reminders for due dates
2. **PDF Reports**: Generate issue/return reports
3. **QR Code**: Generate QR codes for books
4. **Mobile App**: React Native version
5. **Fine Calculation**: Automatic fine for overdue books
6. **Book Reviews**: Allow users to rate and review books
7. **Advanced Analytics**: Charts and graphs
8. **Export Data**: Export to CSV/Excel

---

## 📝 License

This project is created for educational purposes.

---

## 👥 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Django/Next.js documentation
3. Check console logs for errors

---

## 🎉 Congratulations!

You now have a fully functional Library Management System! 

Start by:
1. Creating some books in the admin panel
2. Registering as a user
3. Browsing and issuing books
4. Exploring all features

Happy coding! 📚
