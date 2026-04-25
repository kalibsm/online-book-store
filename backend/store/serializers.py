from rest_framework import serializers
from .models import Book, Cart, CartItem, Category, Order, OrderItem, Review, User, Wishlist


class UserRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True, default="")
    address = serializers.CharField(required=False, allow_blank=True, default="")

    def validate_email(self, value):
        if User.objects(email=value).first():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        if User.objects(username=value).first():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop("password2")
        raw_password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(raw_password)
        user.save()
        return user


class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    username = serializers.CharField()
    phone = serializers.CharField(allow_blank=True, default="")
    address = serializers.CharField(allow_blank=True, default="")
    avatar = serializers.CharField(allow_null=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class CategorySerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField()
    slug = serializers.CharField()
    description = serializers.CharField(allow_blank=True, default="")
    image = serializers.CharField(allow_null=True, required=False)
    book_count = serializers.SerializerMethodField()

    def get_book_count(self, obj):
        return Book.objects(category=obj).count()


class ReviewSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    user_email = serializers.SerializerMethodField()
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(allow_blank=True, default="")
    created_at = serializers.DateTimeField(read_only=True)

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None


class BookListSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField()
    author = serializers.CharField()
    isbn = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    category_id = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    image = serializers.CharField(allow_null=True, required=False)
    stock = serializers.IntegerField()
    in_stock = serializers.BooleanField(read_only=True)
    is_featured = serializers.BooleanField()
    is_new_release = serializers.BooleanField()
    average_rating = serializers.FloatField(read_only=True)
    published_date = serializers.DateField(allow_null=True, required=False)
    created_at = serializers.DateTimeField(read_only=True)

    def get_category_id(self, obj):
        return str(obj.category.id) if obj.category else None

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None


class BookDetailSerializer(BookListSerializer):
    description = serializers.CharField()
    reviews = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    def get_reviews(self, obj):
        reviews = Review.objects(book=obj).select_related()
        return ReviewSerializer(reviews, many=True).data

    def get_category(self, obj):
        if obj.category:
            return CategorySerializer(obj.category).data
        return None


class CartItemSerializer(serializers.Serializer):
    book = BookListSerializer(read_only=True)
    book_id = serializers.CharField(write_only=True)
    quantity = serializers.IntegerField(min_value=1, default=1)
    subtotal = serializers.FloatField(read_only=True)


class CartSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.FloatField(read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)


class OrderItemSerializer(serializers.Serializer):
    book_id = serializers.SerializerMethodField()
    book_title = serializers.CharField()
    quantity = serializers.IntegerField()
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    subtotal = serializers.FloatField(read_only=True)

    def get_book_id(self, obj):
        return str(obj.book.id) if obj.book else None


class OrderSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    user_email = serializers.SerializerMethodField()
    status = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = serializers.CharField()
    notes = serializers.CharField(allow_blank=True, default="")
    items = OrderItemSerializer(many=True, read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None


class WishlistSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    books = BookListSerializer(many=True, read_only=True)
