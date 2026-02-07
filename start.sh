#!/bin/bash

# Library Management System - Quick Start Script
# This script sets up and runs the entire project

echo "🚀 Library Management System - Quick Start"
echo "=========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL not found. Please ensure MySQL is installed and running."
fi

echo ""
echo "📦 Setting up Backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser prompt
echo ""
read -p "Do you want to create a superuser? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python manage.py createsuperuser
fi

# Load sample data prompt
echo ""
read -p "Do you want to load sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python load_sample_data.py
fi

# Start Django server in background
echo ""
echo "🔥 Starting Django server..."
python manage.py runserver &
DJANGO_PID=$!

cd ..

echo ""
echo "📦 Setting up Frontend..."
cd frontend

# Install Node dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

# Create .env.local if not exists
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
fi

# Start Next.js server
echo ""
echo "🔥 Starting Next.js server..."
npm run dev &
NEXT_PID=$!

cd ..

echo ""
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   Admin:    http://localhost:8000/admin"
echo ""
echo "📚 Sample Accounts:"
echo "   Username: student1, Password: password123"
echo "   Username: staff1, Password: password123"
echo ""
echo "Press Ctrl+C to stop both servers..."

# Wait for user interrupt
trap "kill $DJANGO_PID $NEXT_PID; exit" INT
wait
