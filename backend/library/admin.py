from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Book, Category, Author, Publisher, IssueRecord, Reservation


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'member_type', 'is_active_member', 'created_at']
    list_filter = ['member_type', 'is_active_member', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Library Info', {'fields': ('member_type', 'phone', 'address', 'date_of_birth', 
                                     'profile_picture', 'is_active_member', 'max_books_allowed')}),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Library Info', {'fields': ('member_type', 'phone', 'max_books_allowed')}),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'birth_date', 'created_at']
    search_fields = ['name', 'country']
    list_filter = ['country', 'created_at']


@admin.register(Publisher)
class PublisherAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'website', 'created_at']
    search_fields = ['name', 'email']


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'isbn', 'publisher', 'category', 'publication_year', 
                    'language', 'total_copies', 'available_copies', 'is_available']
    list_filter = ['category', 'language', 'publication_year', 'created_at']
    search_fields = ['title', 'isbn', 'authors__name']
    filter_horizontal = ['authors']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(IssueRecord)
class IssueRecordAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'issue_date', 'due_date', 'return_date', 
                    'status', 'renewal_count', 'is_overdue']
    list_filter = ['status', 'issue_date', 'due_date']
    search_fields = ['user__username', 'book__title', 'book__isbn']
    readonly_fields = ['issue_date', 'is_overdue', 'days_overdue']
    date_hierarchy = 'issue_date'


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'reservation_date', 'status', 'expiry_date']
    list_filter = ['status', 'reservation_date']
    search_fields = ['user__username', 'book__title']
    readonly_fields = ['reservation_date', 'expiry_date']
