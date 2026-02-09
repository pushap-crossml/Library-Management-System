# 📚 Library Management System (LMS)

A full-stack Library Management System built with Django REST Framework and Next.js, featuring comprehensive book cataloging, user management, and borrowing operations with a modern, responsive interface.

## 🚀 Features

### Backend (Django + DRF)

- 📖 **Book Management** – CRUD operations for books, authors, and categories
- 👥 **User Management** – Authentication and authorization with JWT
- 🔄 **Borrowing System** – Track book checkouts, returns, and due dates
- 🔍 **Search & Filter** – Advanced search capabilities across the catalog
- 📊 **Dashboard Analytics** – Library statistics and reporting
- 🔐 **Role-Based Access Control** – Admin and user permissions
- 📝 **RESTful API** – Well-documented API endpoints

### Frontend (Next.js + Tailwind CSS)

- 💻 **Modern UI/UX** – Responsive design with Tailwind CSS
- ⚡ **Fast Performance** – Server-side rendering with Next.js
- 📱 **Mobile Responsive** – Optimized for all device sizes
- 🎨 **Interactive Components** – Dynamic data tables and forms
- 🔔 **Real-time Notifications** – User feedback and alerts
- 🌙 **Dark Mode Support** (optional)

## ⚙️ Tech Stack

### Backend

- Python 3.8+
- Django 4.x
- Django REST Framework – API development
- MySQL – Database
- JWT – Authentication
- Swagger/OpenAPI – API documentation

### Frontend

- Next.js 14+
- React 18+
- Tailwind CSS – Styling
- Axios – HTTP client
- React Query – Data fetching and caching
- TypeScript (optional)

## 🔑 Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.8 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- npm or yarn
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/pushap-crossml/Library-Management-System.git
cd Library-Management-System
```

### 2. Backend Setup (Django + DRF)

#### Step 1: Create Virtual Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv myenv

# Activate virtual environment
# On Linux/Mac:
source myenv/bin/activate

# On Windows:
myenv\Scripts\activate
```

#### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

#### Step 3: Configure MySQL Database

```sql
-- Login to MySQL
mysql -u root -p

-- Create database and user
CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'library_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON library_db.* TO 'library_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 4: Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_NAME=library_db
DB_USER=library_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=3306

# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key
JWT_EXPIRATION_HOURS=24
```

#### Step 5: Update settings.py

Update your database configuration in `settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}
```

#### Step 6: Run Migrations

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

#### Step 7: (Optional) Load Sample Data

```bash
python manage.py loaddata fixtures/sample_data.json
```

#### Step 8: Run Development Server

```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup (Next.js + Tailwind CSS)

#### Step 1: Navigate to Frontend Directory

```bash
cd ../frontend
```

#### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

#### Step 3: Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Library Management System
```

#### Step 4: Run Development Server

```bash
npm run dev
# or
yarn dev
```

The frontend application will be available at `http://localhost:3000`

## 📋 API Endpoints

### Authentication

- `POST /api/auth/register/` – User registration
- `POST /api/auth/login/` – User login
- `POST /api/auth/logout/` – User logout
- `GET /api/auth/user/` – Get current user

### Books

- `GET /api/books/` – List all books
- `POST /api/books/` – Create new book
- `GET /api/books/{id}/` – Get book details
- `PUT /api/books/{id}/` – Update book
- `DELETE /api/books/{id}/` – Delete book

### Borrowing

- `GET /api/borrowing/` – List all borrowings
- `POST /api/borrowing/` – Borrow a book
- `PUT /api/borrowing/{id}/return/` – Return a book

## 🧪 Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm run test
# or
yarn test
```

## 🔒 Security Notes

- Never commit `.env` or `.env.local` files
- Use strong, unique passwords for database users
- Rotate `SECRET_KEY` and `JWT_SECRET_KEY` regularly
- Enable HTTPS in production
- Keep dependencies up to date
- Use environment variables for sensitive data
- Ensure `.gitignore` includes sensitive files

## 📌 Future Enhancements

- 📧 Email notifications for due dates
- 📱 Mobile app (React Native)
- 📊 Advanced analytics dashboard
- 🔍 Barcode/QR code scanning
- 📖 E-book support
- 💳 Fine payment integration
- 🌐 Multi-language support
- 📈 Recommendation system
- 🔔 Push notifications
- 📤 Export reports (PDF, Excel)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Django Documentation](https://docs.djangoproject.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- All contributors who help improve this project

