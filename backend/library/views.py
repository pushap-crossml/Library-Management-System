from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.db.models import Q, Count
from datetime import datetime, date
from .models import User, Book, Category, Author, Publisher, IssueRecord, Reservation
from .serializers import (
    UserSerializer, UserProfileSerializer, BookListSerializer, BookDetailSerializer,
    CategorySerializer, AuthorSerializer, PublisherSerializer, IssueRecordSerializer,
    ReservationSerializer, DashboardStatsSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User CRUD operations"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'username']
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return UserProfileSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'])
    def update_profile(self, request):
        """Update current user profile"""
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Category CRUD operations"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']


class AuthorViewSet(viewsets.ModelViewSet):
    """ViewSet for Author CRUD operations"""
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'country']
    ordering_fields = ['name', 'created_at']


class PublisherViewSet(viewsets.ModelViewSet):
    """ViewSet for Publisher CRUD operations"""
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']


class BookViewSet(viewsets.ModelViewSet):
    """ViewSet for Book CRUD operations with advanced search"""
    queryset = Book.objects.all().select_related('category', 'publisher').prefetch_related('authors')
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'isbn', 'authors__name', 'publisher__name']
    ordering_fields = ['title', 'publication_year', 'created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BookListSerializer
        return BookDetailSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category_id=category)
        
        # Filter by author
        author = self.request.query_params.get('author', None)
        if author:
            queryset = queryset.filter(authors__id=author)
        
        # Filter by publisher
        publisher = self.request.query_params.get('publisher', None)
        if publisher:
            queryset = queryset.filter(publisher_id=publisher)
        
        # Filter by availability
        available = self.request.query_params.get('available', None)
        if available == 'true':
            queryset = queryset.filter(available_copies__gt=0)
        elif available == 'false':
            queryset = queryset.filter(available_copies=0)
        
        # Filter by language
        language = self.request.query_params.get('language', None)
        if language:
            queryset = queryset.filter(language=language)
        
        # Filter by publication year range
        year_from = self.request.query_params.get('year_from', None)
        year_to = self.request.query_params.get('year_to', None)
        if year_from:
            queryset = queryset.filter(publication_year__gte=year_from)
        if year_to:
            queryset = queryset.filter(publication_year__lte=year_to)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def add_copy(self, request, pk=None):
        """Add a copy of the book"""
        book = self.get_object()
        book.total_copies += 1
        book.available_copies += 1
        book.save()
        serializer = self.get_serializer(book)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def remove_copy(self, request, pk=None):
        """Remove a copy of the book"""
        book = self.get_object()
        if book.total_copies > book.available_copies:
            return Response(
                {"error": "Cannot remove copy. Some copies are currently issued."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if book.total_copies <= 1:
            return Response(
                {"error": "Cannot remove last copy."},
                status=status.HTTP_400_BAD_REQUEST
            )
        book.total_copies -= 1
        book.available_copies -= 1
        book.save()
        serializer = self.get_serializer(book)
        return Response(serializer.data)


class IssueRecordViewSet(viewsets.ModelViewSet):
    """ViewSet for IssueRecord CRUD operations"""
    queryset = IssueRecord.objects.all().select_related('user', 'book')
    serializer_class = IssueRecordSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__username', 'book__title', 'book__isbn']
    ordering_fields = ['issue_date', 'due_date']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by user (for non-admin users)
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        # Filter by user_id
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        # Filter by book_id
        book_id = self.request.query_params.get('book_id', None)
        if book_id:
            queryset = queryset.filter(book_id=book_id)
        
        # Filter overdue
        overdue = self.request.query_params.get('overdue', None)
        if overdue == 'true':
            queryset = queryset.filter(due_date__lt=date.today(), status='issued')
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        """Return a book"""
        issue_record = self.get_object()
        if issue_record.status == 'returned':
            return Response(
                {"error": "Book already returned"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        issue_record.return_book()
        serializer = self.get_serializer(issue_record)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def renew(self, request, pk=None):
        """Renew a book"""
        issue_record = self.get_object()
        days = request.data.get('days', 14)
        
        if issue_record.status != 'issued':
            return Response(
                {"error": "Only issued books can be renewed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if issue_record.renew_book(days):
            serializer = self.get_serializer(issue_record)
            return Response(serializer.data)
        else:
            return Response(
                {"error": "Maximum renewal limit reached"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def my_issues(self, request):
        """Get current user's issue records"""
        issues = self.queryset.filter(user=request.user)
        serializer = self.get_serializer(issues, many=True)
        return Response(serializer.data)


class ReservationViewSet(viewsets.ModelViewSet):
    """ViewSet for Reservation CRUD operations"""
    queryset = Reservation.objects.all().select_related('user', 'book')
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__username', 'book__title']
    ordering_fields = ['reservation_date']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by status
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by user (for non-admin users)
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a reservation"""
        reservation = self.get_object()
        if reservation.status != 'pending':
            return Response(
                {"error": "Only pending reservations can be cancelled"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reservation.status = 'cancelled'
        reservation.save()
        serializer = self.get_serializer(reservation)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_reservations(self, request):
        """Get current user's reservations"""
        reservations = self.queryset.filter(user=request.user)
        serializer = self.get_serializer(reservations, many=True)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics"""
    stats = {
        'total_books': Book.objects.count(),
        'total_members': User.objects.filter(is_active_member=True).count(),
        'books_issued': IssueRecord.objects.filter(status='issued').count(),
        'books_available': Book.objects.filter(available_copies__gt=0).count(),
        'overdue_books': IssueRecord.objects.filter(
            status='issued', due_date__lt=date.today()
        ).count(),
        'pending_reservations': Reservation.objects.filter(status='pending').count(),
    }
    
    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new user"""
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
