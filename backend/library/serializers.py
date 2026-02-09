from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Book, Category, Author, Publisher, IssueRecord, Reservation


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    currently_issued_books = serializers.SerializerMethodField()

    can_issue_more_books = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password2', 'first_name', 
                  'last_name', 'member_type', 'phone', 'address', 'date_of_birth',
                  'profile_picture', 'is_active_member', 'max_books_allowed',
                  'currently_issued_books', 'can_issue_more_books', 'created_at']
        read_only_fields = ['id', 'created_at']
    def get_currently_issued_books(self, obj):
        return IssueRecord.objects.filter(
            user=obj,
            status='issued'
        ).count()
    
    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password2'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile updates"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'member_type', 'phone', 'address', 'date_of_birth', 'profile_picture']
        read_only_fields = ['id', 'username']


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    books_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'books_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_books_count(self, obj):
        return obj.books.count()


class AuthorSerializer(serializers.ModelSerializer):
    """Serializer for Author model"""
    books_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Author
        fields = ['id', 'name', 'biography', 'birth_date', 'country', 
                  'books_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_books_count(self, obj):
        return obj.books.count()


class PublisherSerializer(serializers.ModelSerializer):
    """Serializer for Publisher model"""
    books_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Publisher
        fields = ['id', 'name', 'address', 'website', 'email', 
                  'books_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_books_count(self, obj):
        return obj.books.count()


class BookListSerializer(serializers.ModelSerializer):
    """Serializer for Book list view"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    publisher_name = serializers.CharField(source='publisher.name', read_only=True)
    authors_names = serializers.SerializerMethodField()
    is_available = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Book
        fields = ['id', 'title', 'isbn', 'authors_names', 'publisher_name', 
                  'category_name', 'publication_year', 'language', 'cover_image',
                  'total_copies', 'available_copies', 'is_available', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_authors_names(self, obj):
        return [author.name for author in obj.authors.all()]


class BookDetailSerializer(serializers.ModelSerializer):
    """Serializer for Book detail view"""
    category = CategorySerializer(read_only=True)
    publisher = PublisherSerializer(read_only=True)
    authors = AuthorSerializer(many=True, read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False
    )
    publisher_id = serializers.PrimaryKeyRelatedField(
        queryset=Publisher.objects.all(), source='publisher', write_only=True, required=False
    )
    author_ids = serializers.PrimaryKeyRelatedField(
        queryset=Author.objects.all(), source='authors', many=True, write_only=True, required=False
    )
    is_available = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Book
        fields = ['id', 'title', 'isbn', 'authors', 'author_ids', 'publisher', 
                  'publisher_id', 'category', 'category_id', 'publication_year',
                  'language', 'pages', 'description', 'cover_image', 'total_copies',
                  'available_copies', 'is_available', 'created_at', 'updated_at']
        read_only_fields = ['id', 'available_copies', 'created_at', 'updated_at']


class IssueRecordSerializer(serializers.ModelSerializer):
    """Serializer for IssueRecord model"""
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_isbn = serializers.CharField(source='book.isbn', read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)
    days_overdue = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = IssueRecord
        fields = ['id', 'user', 'user_name', 'user_username', 'book', 'book_title',
                  'book_isbn', 'issue_date', 'due_date', 'return_date', 'status',
                  'fine_amount', 'renewal_count', 'is_overdue', 'days_overdue', 'notes']
        read_only_fields = ['id', 'issue_date', 'return_date', 'fine_amount']
        read_only_fields = ['id', 'user', 'issue_date', 'return_date', 'fine_amount']
    
    def validate(self, attrs):
        user = attrs.get('user') or self.context.get('request').user
        book = attrs.get('book')
        
        if not user.can_issue_more_books:
            raise serializers.ValidationError(
                f"User has reached maximum book limit ({user.max_books_allowed})"
            )
        
        if not book.is_available:
            raise serializers.ValidationError("Book is not available")
        
        existing = IssueRecord.objects.filter(
            user=user, book=book, status='issued'
        ).exists()
        if existing:
            raise serializers.ValidationError("User already has this book issued")
        
        return attrs


class ReservationSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_isbn = serializers.CharField(source='book.isbn', read_only=True)

    class Meta:
        model = Reservation
        fields = ['id', 'user', 'user_name', 'user_username', 'book', 'book_title',
                  'book_isbn', 'reservation_date', 'status', 'expiry_date',
                  'fulfilled_date', 'notes']
        read_only_fields = ['id', 'reservation_date', 'expiry_date', 'fulfilled_date']


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    total_books = serializers.IntegerField()
    total_members = serializers.IntegerField()
    books_issued = serializers.IntegerField()
    books_available = serializers.IntegerField()
    overdue_books = serializers.IntegerField()
    pending_reservations = serializers.IntegerField()