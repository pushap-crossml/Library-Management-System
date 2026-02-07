# 📚 Library Management System

A modern, full-stack Library Management System built with Django REST Framework and Next.js.

![Tech Stack](https://img.shields.io/badge/Backend-Django%20%2B%20DRF-green)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%20%2B%20TypeScript-blue)
![Database](https://img.shields.io/badge/Database-MySQL-orange)
![Authentication](https://img.shields.io/badge/Auth-JWT-red)

## ✨ Features

### 🔐 User Management
- User registration with role selection (Student, Staff, External User)
- JWT-based authentication
- User profiles with detailed information
- Secure login/logout functionality

### 📖 Book Management
- Add, update, and delete books
- ISBN-based book identification
- Support for multiple copies per book
- Categories, Authors, and Publishers management
- Cover image upload support

### 🔍 Search & Discovery
- Advanced search by title, author, ISBN, category
- Filter by availability, publication year, language
- Pagination for large datasets
- Real-time search results

### 📤 Issue/Return System
- Book issue tracking with due dates
- Automatic due date calculation (14 days)
- Book return processing
- Renewal system (up to 2 renewals per book)
- Overdue tracking with days calculation
- Reservation/hold requests for unavailable books

### 📊 Dashboard
- Real-time statistics and metrics
- Total books, members, and active issues
- Overdue books monitoring
- Pending reservations tracking
- User-specific issue history

## 🛠️ Tech Stack

### Backend
- **Django 4.2** - Python web framework
- **Django REST Framework** - REST API toolkit
- **MySQL 8.0** - Relational database
- **JWT** - Token-based authentication
- **CORS Headers** - Cross-origin resource sharing

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- MySQL 8.0+

### Option 1: Automated Setup (Recommended)

#### For Unix/macOS/Linux:
```bash
# Extract the project
tar -xzf library-management-system.tar.gz
cd library-management-system

# Run the automated setup script
./start.sh
```

#### For Windows:
```cmd
# Extract the project
# Double-click library-management-system.tar.gz to extract

# Run the automated setup script
start.bat
```

### Option 2: Manual Setup

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed manual setup instructions.

## 📁 Project Structure

```
library-management-system/
├── backend/                    # Django Backend
│   ├── library_project/        # Django project settings
│   │   ├── settings.py         # Configuration
│   │   ├── urls.py             # URL routing
│   │   └── wsgi.py             # WSGI application
│   ├── library/                # Main app
│   │   ├── models.py           # Database models
│   │   ├── serializers.py      # API serializers
│   │   ├── views.py            # API views
│   │   ├── urls.py             # App URLs
│   │   └── admin.py            # Admin panel config
│   ├── manage.py               # Django CLI
│   ├── requirements.txt        # Python dependencies
│   └── load_sample_data.py     # Sample data loader
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/                # App router pages
│   │   │   ├── dashboard/      # Dashboard pages
│   │   │   ├── login/          # Login page
│   │   │   └── register/       # Registration page
│   │   ├── components/         # React components
│   │   └── lib/                # Utilities
│   │       ├── api.ts          # API client
│   │       └── types.ts        # TypeScript types
│   ├── package.json            # Node dependencies
│   └── tailwind.config.js      # Tailwind config
│
├── SETUP_GUIDE.md             # Detailed setup guide
├── README.md                  # This file
├── start.sh                   # Unix startup script
└── start.bat                  # Windows startup script
```

## 🌐 Application URLs

After successful setup:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

## 👤 Default Credentials

After loading sample data:

**Student Account:**
- Username: `student1`
- Password: `password123`

**Staff Account:**
- Username: `staff1`
- Password: `password123`

## 📊 API Documentation

### Authentication Endpoints
```
POST /api/token/              - Login (obtain JWT tokens)
POST /api/token/refresh/      - Refresh access token
POST /api/register/           - Register new user
```

### Books Endpoints
```
GET    /api/books/            - List all books
GET    /api/books/{id}/       - Get book details
POST   /api/books/            - Create new book
PUT    /api/books/{id}/       - Update book
DELETE /api/books/{id}/       - Delete book
POST   /api/books/{id}/add_copy/     - Add book copy
POST   /api/books/{id}/remove_copy/  - Remove book copy
```

### Issue Management
```
GET  /api/issues/                    - List issue records
POST /api/issues/                    - Issue a book
POST /api/issues/{id}/return_book/   - Return book
POST /api/issues/{id}/renew/         - Renew book
GET  /api/issues/my_issues/          - Current user's issues
```

### Other Endpoints
```
GET /api/categories/          - Categories CRUD
GET /api/authors/             - Authors CRUD
GET /api/publishers/          - Publishers CRUD
GET /api/reservations/        - Reservations CRUD
GET /api/dashboard/stats/     - Dashboard statistics
```

## 🎯 Key Features Implementation

### Database Models
- **User**: Custom user model with member types
- **Book**: Complete book information with relationships
- **Category**: Book categorization
- **Author**: Author management
- **Publisher**: Publisher details
- **IssueRecord**: Track book issues and returns
- **Reservation**: Handle book reservations

### Authentication
- JWT token-based authentication
- Token refresh mechanism
- Protected routes and API endpoints
- Role-based access control

### Search & Filtering
- Multi-field search (title, author, ISBN, category)
- Filter by availability, language, publication year
- Advanced query parameters
- Pagination support

## 🔒 Security Features

- **Password Hashing**: Django's built-in password hashing
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Configured CORS headers
- **SQL Injection Protection**: Django ORM parameterized queries
- **XSS Protection**: React's automatic escaping
- **CSRF Protection**: Django CSRF middleware

## 📈 Future Enhancements

- [ ] Email notifications for due dates
- [ ] PDF report generation
- [ ] QR code generation for books
- [ ] Mobile application (React Native)
- [ ] Automated fine calculation
- [ ] Book reviews and ratings
- [ ] Advanced analytics dashboard
- [ ] Export data to CSV/Excel
- [ ] Barcode scanning support
- [ ] Multiple library branch support

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure MySQL is running
- Check database credentials in `settings.py`
- Run migrations: `python manage.py migrate`

**Frontend shows network errors:**
- Verify backend is running on port 8000
- Check `.env.local` has correct API URL
- Ensure CORS is properly configured

**Database connection failed:**
- Verify MySQL service is running
- Check username/password in settings
- Ensure database `library_db` exists

For more issues, see [SETUP_GUIDE.md](SETUP_GUIDE.md#troubleshooting)

## 📝 Development

### Backend Development
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Run Tests
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

This is an educational project. Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is created for educational purposes as part of a Django + Next.js learning assignment.

## 👨‍💻 Assignment Details

**Technologies Used:**
- Backend: Django REST Framework
- Frontend: Next.js + Tailwind CSS
- Database: MySQL

**Timeline:** 3 days
**Goal:** Create a complete library management system with best UI/UX

## 🎉 Acknowledgments

- Django documentation
- Next.js documentation
- Tailwind CSS documentation
- MySQL documentation
- React documentation

---

**Made with ❤️ for the Django + DRF Learning Assignment**

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)
