"""
Sample Data Loader for Library Management System
Run this script after migrations to populate the database with sample data
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library_project.settings')
django.setup()

from library.models import Category, Author, Publisher, Book, User
from datetime import datetime

def load_sample_data():
    print("Loading sample data...")
    
    # Create Categories
    print("\nCreating categories...")
    categories_data = [
        {'name': 'Fiction', 'description': 'Fictional works and novels'},
        {'name': 'Science', 'description': 'Scientific books and research'},
        {'name': 'History', 'description': 'Historical books and biographies'},
        {'name': 'Technology', 'description': 'Technology and programming books'},
        {'name': 'Biography', 'description': 'Biographies and memoirs'},
        {'name': 'Self-Help', 'description': 'Self-improvement and motivation'},
        {'name': 'Business', 'description': 'Business and economics'},
    ]
    
    categories = {}
    for cat_data in categories_data:
        cat, created = Category.objects.get_or_create(**cat_data)
        categories[cat.name] = cat
        print(f"  {'Created' if created else 'Found'}: {cat.name}")
    
    # Create Authors
    print("\nCreating authors...")
    authors_data = [
        {'name': 'J.K. Rowling', 'country': 'UK', 'biography': 'British author, best known for Harry Potter series'},
        {'name': 'George Orwell', 'country': 'UK', 'biography': 'English novelist and essayist'},
        {'name': 'Isaac Asimov', 'country': 'USA', 'biography': 'American writer and professor of biochemistry'},
        {'name': 'Agatha Christie', 'country': 'UK', 'biography': 'English writer known for detective novels'},
        {'name': 'Stephen Hawking', 'country': 'UK', 'biography': 'English theoretical physicist and cosmologist'},
        {'name': 'Malcolm Gladwell', 'country': 'Canada', 'biography': 'Canadian journalist and author'},
        {'name': 'Robert Kiyosaki', 'country': 'USA', 'biography': 'American businessman and author'},
    ]
    
    authors = {}
    for author_data in authors_data:
        author, created = Author.objects.get_or_create(name=author_data['name'], defaults=author_data)
        authors[author.name] = author
        print(f"  {'Created' if created else 'Found'}: {author.name}")
    
    # Create Publishers
    print("\nCreating publishers...")
    publishers_data = [
        {'name': 'Penguin Random House', 'email': 'info@penguinrandomhouse.com'},
        {'name': 'HarperCollins', 'email': 'info@harpercollins.com'},
        {'name': 'Simon & Schuster', 'email': 'info@simonandschuster.com'},
        {'name': "O'Reilly Media", 'email': 'info@oreilly.com'},
        {'name': 'Bloomsbury Publishing', 'email': 'info@bloomsbury.com'},
    ]
    
    publishers = {}
    for pub_data in publishers_data:
        pub, created = Publisher.objects.get_or_create(name=pub_data['name'], defaults=pub_data)
        publishers[pub.name] = pub
        print(f"  {'Created' if created else 'Found'}: {pub.name}")
    
    # Create Books
    print("\nCreating books...")
    books_data = [
        {
            'title': "Harry Potter and the Philosopher's Stone",
            'isbn': '9780747532699',
            'authors': ['J.K. Rowling'],
            'publisher': 'Bloomsbury Publishing',
            'category': 'Fiction',
            'publication_year': 1997,
            'language': 'en',
            'pages': 223,
            'description': 'The first novel in the Harry Potter series',
            'total_copies': 5,
        },
        {
            'title': '1984',
            'isbn': '9780451524935',
            'authors': ['George Orwell'],
            'publisher': 'Penguin Random House',
            'category': 'Fiction',
            'publication_year': 1949,
            'language': 'en',
            'pages': 328,
            'description': 'Dystopian social science fiction novel',
            'total_copies': 3,
        },
        {
            'title': 'Foundation',
            'isbn': '9780553293357',
            'authors': ['Isaac Asimov'],
            'publisher': 'Penguin Random House',
            'category': 'Science',
            'publication_year': 1951,
            'language': 'en',
            'pages': 255,
            'description': 'Science fiction novel about the fall and rise of civilizations',
            'total_copies': 4,
        },
        {
            'title': 'Murder on the Orient Express',
            'isbn': '9780062693662',
            'authors': ['Agatha Christie'],
            'publisher': 'HarperCollins',
            'category': 'Fiction',
            'publication_year': 1934,
            'language': 'en',
            'pages': 256,
            'description': 'Detective novel featuring Hercule Poirot',
            'total_copies': 2,
        },
        {
            'title': 'A Brief History of Time',
            'isbn': '9780553380163',
            'authors': ['Stephen Hawking'],
            'publisher': 'Penguin Random House',
            'category': 'Science',
            'publication_year': 1988,
            'language': 'en',
            'pages': 256,
            'description': 'Popular science book on cosmology',
            'total_copies': 3,
        },
        {
            'title': 'Outliers',
            'isbn': '9780316017923',
            'authors': ['Malcolm Gladwell'],
            'publisher': 'Penguin Random House',
            'category': 'Self-Help',
            'publication_year': 2008,
            'language': 'en',
            'pages': 309,
            'description': 'The Story of Success',
            'total_copies': 4,
        },
        {
            'title': 'Rich Dad Poor Dad',
            'isbn': '9781612680194',
            'authors': ['Robert Kiyosaki'],
            'publisher': 'Penguin Random House',
            'category': 'Business',
            'publication_year': 1997,
            'language': 'en',
            'pages': 336,
            'description': 'What the Rich Teach Their Kids About Money',
            'total_copies': 5,
        },
    ]
    
    for book_data in books_data:
        # Extract author names and get Author objects
        author_names = book_data.pop('authors')
        book_authors = [authors[name] for name in author_names]
        
        # Get publisher and category
        publisher_name = book_data.pop('publisher')
        category_name = book_data.pop('category')
        
        book_data['publisher'] = publishers[publisher_name]
        book_data['category'] = categories[category_name]
        
        # Create or get book
        book, created = Book.objects.get_or_create(
            isbn=book_data['isbn'],
            defaults=book_data
        )
        
        # Add authors (many-to-many relationship)
        if created:
            book.authors.set(book_authors)
        
        print(f"  {'Created' if created else 'Found'}: {book.title}")
    
    # Create sample users
    print("\nCreating sample users...")
    users_data = [
        {
            'username': 'student1',
            'email': 'student1@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'member_type': 'student',
            'password': 'password123',
        },
        {
            'username': 'staff1',
            'email': 'staff1@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'member_type': 'staff',
            'password': 'password123',
        },
    ]
    
    for user_data in users_data:
        password = user_data.pop('password')
        user, created = User.objects.get_or_create(
            username=user_data['username'],
            defaults=user_data
        )
        if created:
            user.set_password(password)
            user.save()
        print(f"  {'Created' if created else 'Found'}: {user.username} (password: password123)")
    
    print("\n✅ Sample data loaded successfully!")
    print("\nYou can now:")
    print("  1. Login as: student1 / password123")
    print("  2. Login as: staff1 / password123")
    print("  3. Or create a new account via registration")

if __name__ == '__main__':
    load_sample_data()
