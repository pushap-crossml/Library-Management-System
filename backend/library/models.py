from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import datetime, timedelta


class User(AbstractUser):
    """Custom User model for library members"""
    
    MEMBER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('external', 'External User'),
    ]
    
    member_type = models.CharField(max_length=20, choices=MEMBER_TYPE_CHOICES, default='student')
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_active_member = models.BooleanField(default=True)
    max_books_allowed = models.IntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:

        ordering = ['-created_at']

    
    def __str__(self):
        return f"{self.username} - {self.get_member_type_display()}"
    
    @property
    def currently_issued_books(self):
        return self.issued_books.filter(status='issued').count()
    
    @property
    def can_issue_more_books(self):
        return self.currently_issued_books < self.max_books_allowed


class Category(models.Model):
    """Book categories"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Author(models.Model):
    """Book authors"""
    name = models.CharField(max_length=200)
    biography = models.TextField(blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'authors'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Publisher(models.Model):
    """Book publishers"""
    name = models.CharField(max_length=200, unique=True)
    address = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'publishers'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Book(models.Model):
    """Book information"""
    
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('hi', 'Hindi'),
        ('es', 'Spanish'),
        ('fr', 'French'),
        ('de', 'German'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=300)
    isbn = models.CharField(max_length=13, unique=True)
    authors = models.ManyToManyField(Author, related_name='books')
    publisher = models.ForeignKey(Publisher, on_delete=models.SET_NULL, null=True, related_name='books')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='books')
    publication_year = models.IntegerField(validators=[MinValueValidator(1000), MaxValueValidator(2100)])
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, default='en')
    pages = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    total_copies = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    available_copies = models.IntegerField(default=1, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'books'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['isbn']),
            models.Index(fields=['title']),
        ]
    
    def __str__(self):
        return f"{self.title} (ISBN: {self.isbn})"
    
    @property
    def is_available(self):
        return self.available_copies > 0
    
    def save(self, *args, **kwargs):
        if not self.pk:  # New book
            self.available_copies = self.total_copies
        super().save(*args, **kwargs)


class IssueRecord(models.Model):
    """Book issue and return tracking"""
    
    STATUS_CHOICES = [
        ('issued', 'Issued'),
        ('returned', 'Returned'),
        ('overdue', 'Overdue'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='issued_books')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='issue_records')
    issue_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField()
    return_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='issued')
    fine_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    renewal_count = models.IntegerField(default=0)
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'issue_records'
        ordering = ['-issue_date']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['due_date']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.book.title} ({self.status})"
    
    def save(self, *args, **kwargs):
        # Set due date if not provided (14 days from issue)
        if not self.due_date:
            self.due_date = (datetime.now() + timedelta(days=14)).date()
        
        # Update book availability on issue/return
        if not self.pk:  # New issue
            if self.book.available_copies > 0:
                self.book.available_copies -= 1
                self.book.save()
        
        super().save(*args, **kwargs)
    
    def return_book(self):
        """Process book return"""
        self.return_date = datetime.now()
        self.status = 'returned'
        self.book.available_copies += 1
        self.book.save()
        self.save()
    
    def renew_book(self, days=14):
        """Renew book for additional days"""
        if self.renewal_count < 2:  # Max 2 renewals
            self.due_date = (datetime.now() + timedelta(days=days)).date()
            self.renewal_count += 1
            self.save()
            return True
        return False
    
    @property
    def is_overdue(self):
        if self.status == 'returned':
            return False
        return datetime.now().date() > self.due_date
    
    @property
    def days_overdue(self):
        if not self.is_overdue:
            return 0
        return (datetime.now().date() - self.due_date).days


class Reservation(models.Model):
    """Book reservation/hold requests"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('fulfilled', 'Fulfilled'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reservations')
    reservation_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    expiry_date = models.DateField()
    fulfilled_date = models.DateTimeField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'reservations'
        ordering = ['reservation_date']
        unique_together = ['user', 'book', 'status']
    
    def __str__(self):
        return f"{self.user.username} - {self.book.title} ({self.status})"
    
    def save(self, *args, **kwargs):
        # Set expiry date (7 days from reservation)
        if not self.expiry_date:
            self.expiry_date = (datetime.now() + timedelta(days=7)).date()
        super().save(*args, **kwargs)
