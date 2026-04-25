from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path("auth/register/", views.RegisterView.as_view(), name="register"),
    path("auth/login/", views.LoginView.as_view(), name="login"),
    path("auth/profile/", views.ProfileView.as_view(), name="profile"),

    # Categories
    path("categories/", views.CategoryListView.as_view(), name="category-list"),
    path("categories/<slug:slug>/", views.CategoryDetailView.as_view(), name="category-detail"),

    # Books
    path("books/", views.BookListView.as_view(), name="book-list"),
    path("books/<str:pk>/", views.BookDetailView.as_view(), name="book-detail"),
    path("books/<str:pk>/reviews/", views.ReviewView.as_view(), name="book-reviews"),

    # Cart
    path("cart/", views.CartView.as_view(), name="cart"),

    # Orders
    path("orders/", views.OrderListView.as_view(), name="order-list"),
    path("orders/checkout/", views.CheckoutView.as_view(), name="checkout"),
    path("orders/<str:pk>/", views.OrderDetailView.as_view(), name="order-detail"),
    path("orders/<str:pk>/cancel/", views.OrderDetailView.as_view(), name="order-cancel"),

    # Wishlist
    path("wishlist/", views.WishlistView.as_view(), name="wishlist"),
]
