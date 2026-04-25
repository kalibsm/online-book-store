from mongoengine.queryset.visitor import Q
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .auth import generate_token
from .models import Book, Cart, Category, Order, OrderItem, Review, User, Wishlist
from .serializers import (
    BookDetailSerializer,
    BookListSerializer,
    CartSerializer,
    CategorySerializer,
    OrderSerializer,
    ReviewSerializer,
    UserRegisterSerializer,
    UserSerializer,
    WishlistSerializer,
)


# ─── Auth ────────────────────────────────────────────────────────────────────

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"token": generate_token(user), "user": UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "")
        password = request.data.get("password", "")

        user = User.objects(email=email).first()
        if not user or not user.check_password(password):
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        if not user.is_active:
            return Response(
                {"detail": "Account is disabled."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response({"token": generate_token(user), "user": UserSerializer(user).data})


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


# ─── Categories ──────────────────────────────────────────────────────────────

class CategoryListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        categories = Category.objects.all()
        return Response(CategorySerializer(categories, many=True).data)


class CategoryDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        try:
            category = Category.objects.get(slug=slug)
        except Category.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(CategorySerializer(category).data)


# ─── Books ────────────────────────────────────────────────────────────────────

class BookListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = Book.objects.all()

        # Filter
        category_slug = request.query_params.get("category")
        if category_slug:
            try:
                category = Category.objects.get(slug=category_slug)
                queryset = queryset.filter(category=category)
            except Category.DoesNotExist:
                return Response([])

        if request.query_params.get("featured") == "true":
            queryset = queryset.filter(is_featured=True)

        if request.query_params.get("new_release") == "true":
            queryset = queryset.filter(is_new_release=True)

        # Search
        search = request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(author__icontains=search) | Q(isbn__icontains=search)
            )

        # Ordering
        ordering = request.query_params.get("ordering", "-created_at")
        allowed_orderings = {"price", "-price", "title", "-title", "created_at", "-created_at"}
        if ordering in allowed_orderings:
            queryset = queryset.order_by(ordering)

        # Pagination
        page_size = 12
        try:
            page = max(1, int(request.query_params.get("page", 1)))
        except ValueError:
            page = 1
        start = (page - 1) * page_size
        total = queryset.count()
        books = queryset[start : start + page_size]

        return Response({
            "count": total,
            "page": page,
            "total_pages": -(-total // page_size),  # ceiling division
            "results": BookListSerializer(books, many=True).data,
        })


class BookDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            book = Book.objects.get(id=pk)
        except (Book.DoesNotExist, Exception):
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(BookDetailSerializer(book).data)


# ─── Reviews ─────────────────────────────────────────────────────────────────

class ReviewView(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_book(self, pk):
        try:
            return Book.objects.get(id=pk)
        except (Book.DoesNotExist, Exception):
            return None

    def get(self, request, pk):
        book = self.get_book(pk)
        if not book:
            return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)
        reviews = Review.objects(book=book)
        return Response(ReviewSerializer(reviews, many=True).data)

    def post(self, request, pk):
        book = self.get_book(pk)
        if not book:
            return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

        if Review.objects(user=request.user, book=book).first():
            return Response(
                {"detail": "You have already reviewed this book."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review = Review(
            user=request.user,
            book=book,
            rating=serializer.validated_data["rating"],
            comment=serializer.validated_data.get("comment", ""),
        )
        review.save()
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        book = self.get_book(pk)
        if not book:
            return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)
        review = Review.objects(user=request.user, book=book).first()
        if not review:
            return Response({"detail": "Review not found."}, status=status.HTTP_404_NOT_FOUND)
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ─── Cart ─────────────────────────────────────────────────────────────────────

class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def _get_cart(self, user):
        cart = Cart.objects(user=user).first()
        if not cart:
            cart = Cart(user=user)
            cart.save()
        return cart

    def get(self, request):
        cart = self._get_cart(request.user)
        return Response(CartSerializer(cart).data)

    def post(self, request):
        book_id = request.data.get("book_id")
        quantity = int(request.data.get("quantity", 1))

        try:
            book = Book.objects.get(id=book_id)
        except (Book.DoesNotExist, Exception):
            return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

        cart = self._get_cart(request.user)

        for item in cart.items:
            if str(item.book.id) == str(book.id):
                item.quantity += quantity
                cart.save()
                return Response(CartSerializer(cart).data)

        from .models import CartItem
        cart.items.append(CartItem(book=book, quantity=quantity))
        cart.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    def patch(self, request):
        book_id = request.data.get("book_id")
        quantity = int(request.data.get("quantity", 1))

        cart = self._get_cart(request.user)
        for item in cart.items:
            if str(item.book.id) == str(book_id):
                item.quantity = quantity
                cart.save()
                return Response(CartSerializer(cart).data)

        return Response({"detail": "Item not in cart."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request):
        book_id = request.data.get("book_id")
        cart = self._get_cart(request.user)
        cart.items = [item for item in cart.items if str(item.book.id) != str(book_id)]
        cart.save()
        return Response(CartSerializer(cart).data)


# ─── Orders ───────────────────────────────────────────────────────────────────

class OrderListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects(user=request.user).order_by("-created_at")
        return Response(OrderSerializer(orders, many=True).data)


class OrderDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.get(id=pk, user=request.user)
        except (Order.DoesNotExist, Exception):
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(OrderSerializer(order).data)

    def patch(self, request, pk):
        try:
            order = Order.objects.get(id=pk, user=request.user)
        except (Order.DoesNotExist, Exception):
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        if order.status not in ("pending", "confirmed"):
            return Response(
                {"detail": "Only pending or confirmed orders can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = "cancelled"
        order.save()
        return Response(OrderSerializer(order).data)


class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        shipping_address = request.data.get("shipping_address", "").strip()
        if not shipping_address:
            return Response(
                {"detail": "shipping_address is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart = Cart.objects(user=request.user).first()
        if not cart or not cart.items:
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        order_items = []
        total = 0
        for item in cart.items:
            book = item.book
            subtotal = float(book.price) * item.quantity
            total += subtotal
            order_items.append(
                OrderItem(
                    book=book,
                    book_title=book.title,
                    quantity=item.quantity,
                    unit_price=book.price,
                )
            )
            # Decrement stock
            book.stock = max(0, book.stock - item.quantity)
            book.save()

        order = Order(
            user=request.user,
            total_amount=round(total, 2),
            shipping_address=shipping_address,
            notes=request.data.get("notes", ""),
            items=order_items,
        )
        order.save()

        cart.items = []
        cart.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


# ─── Wishlist ─────────────────────────────────────────────────────────────────

class WishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def _get_wishlist(self, user):
        wishlist = Wishlist.objects(user=user).first()
        if not wishlist:
            wishlist = Wishlist(user=user)
            wishlist.save()
        return wishlist

    def get(self, request):
        return Response(WishlistSerializer(self._get_wishlist(request.user)).data)

    def post(self, request):
        book_id = request.data.get("book_id")
        try:
            book = Book.objects.get(id=book_id)
        except (Book.DoesNotExist, Exception):
            return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

        wishlist = self._get_wishlist(request.user)
        if book not in wishlist.books:
            wishlist.books.append(book)
            wishlist.save()
        return Response(WishlistSerializer(wishlist).data)

    def delete(self, request):
        book_id = request.data.get("book_id")
        wishlist = self._get_wishlist(request.user)
        wishlist.books = [b for b in wishlist.books if str(b.id) != str(book_id)]
        wishlist.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
