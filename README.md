# Library Management System - Complete Project

## Backend Setup (Django + DRF)

### Installation Steps:

1. Install Python 3.8+ and MySQL
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create MySQL database:
   ```sql
   CREATE DATABASE library_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'library_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON library_db.* TO 'library_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. Update settings.py with your database credentials

6. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

7. Run server:
   ```bash
   python manage.py runserver
   ```

## Frontend Setup (Next.js + Tailwind)

1. Install Node.js 18+
2. Navigate to frontend directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

## Project Structure Created:
```
library-management-system/
├── backend/
│   ├── library_project/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── library/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   └── lib/
    ├── package.json
    └── next.config.js
```
