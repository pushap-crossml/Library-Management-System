from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, BookViewSet, CategoryViewSet, AuthorViewSet,
    PublisherViewSet, IssueRecordViewSet, ReservationViewSet,
    dashboard_stats, register_user
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'books', BookViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'publishers', PublisherViewSet)
router.register(r'issues', IssueRecordViewSet)
router.register(r'reservations', ReservationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('register/', register_user, name='register'),
]
