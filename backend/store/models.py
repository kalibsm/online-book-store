from datetime import datetime
from django.contrib.auth.hashers import check_password, make_password
from mongoengine import (
    BooleanField,
    DateField,
    DateTimeField,
    DecimalField,
    Document,
    EmbeddedDocument,
    EmbeddedDocumentListField,
    EmailField,
    IntField,
    ListField,
    ReferenceField,
    StringField,
    CASCADE,
    NULLIFY,
)


class User(Document):
    email = EmailField(required=True, unique=True)
    username = StringField(required=True, unique=True, max_length=150)
    password = StringField(required=True)
    phone = StringField(default="", max_length=20)
    address = StringField(default="")
    avatar = StringField(null=True)
    is_active = BooleanField(default=True)
    is_admin = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "users",
        "indexes": ["email", "username"],
    }

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    # Required by DRF's IsAuthenticated permission
    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def __str__(self):
        return self.email


class Category(Document):
    name = StringField(required=True, unique=True, max_length=100)
    slug = StringField(required=True, unique=True, max_length=100)
    description = StringField(default="")
    image = StringField(null=True)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "categories",
        "indexes": ["slug"],
        "ordering": ["name"],
    }

    def __str__(self):
        return self.name


class Book(Document):
    title = StringField(required=True, max_length=255)
    author = StringField(required=True, max_length=255)
    isbn = StringField(required=True, unique=True, max_length=13)
    description = StringField(default="")
    price = DecimalField(required=True, precision=2, min_value=0)
    category = ReferenceField(Category, null=True, reverse_delete_rule=NULLIFY)
    image = StringField(null=True)
    stock = IntField(default=0, min_value=0)
    published_date = DateField(null=True)
    is_featured = BooleanField(default=False)
    is_new_release = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "books",
        "indexes": ["isbn", "category", "is_featured", "is_new_release"],
        "ordering": ["-created_at"],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    @property
    def average_rating(self):
        reviews = Review.objects(book=self)
        if not reviews:
            return 0
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)

    @property
    def in_stock(self):
        return self.stock > 0

    def __str__(self):
        return f"{self.title} by {self.author}"


class Review(Document):
    user = ReferenceField(User, required=True, reverse_delete_rule=CASCADE)
    book = ReferenceField(Book, required=True, reverse_delete_rule=CASCADE)
    rating = IntField(required=True, min_value=1, max_value=5)
    comment = StringField(default="")
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "reviews",
        "indexes": [
            {"fields": ["user", "book"], "unique": True},
        ],
        "ordering": ["-created_at"],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} - {self.book.title} ({self.rating}★)"


class CartItem(EmbeddedDocument):
    book = ReferenceField(Book, required=True)
    quantity = IntField(default=1, min_value=1)
    added_at = DateTimeField(default=datetime.utcnow)

    @property
    def subtotal(self):
        return float(self.book.price) * self.quantity


class Cart(Document):
    user = ReferenceField(User, required=True, unique=True, reverse_delete_rule=CASCADE)
    items = EmbeddedDocumentListField(CartItem)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {"collection": "carts"}

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    @property
    def total(self):
        return sum(item.subtotal for item in self.items)

    @property
    def item_count(self):
        return sum(item.quantity for item in self.items)

    def __str__(self):
        return f"Cart of {self.user.email}"


class OrderItem(EmbeddedDocument):
    book = ReferenceField(Book, null=True)
    book_title = StringField()  # snapshot in case book is deleted
    quantity = IntField(required=True, min_value=1)
    unit_price = DecimalField(required=True, precision=2)

    @property
    def subtotal(self):
        return float(self.unit_price) * self.quantity


class Order(Document):
    STATUS_CHOICES = ("pending", "confirmed", "shipped", "delivered", "cancelled")

    user = ReferenceField(User, required=True, reverse_delete_rule=CASCADE)
    status = StringField(default="pending", choices=STATUS_CHOICES)
    total_amount = DecimalField(required=True, precision=2)
    shipping_address = StringField(required=True)
    notes = StringField(default="")
    items = EmbeddedDocumentListField(OrderItem)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "orders",
        "ordering": ["-created_at"],
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.utcnow()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"Order #{self.id} by {self.user.email} ({self.status})"


class Wishlist(Document):
    user = ReferenceField(User, required=True, unique=True, reverse_delete_rule=CASCADE)
    books = ListField(ReferenceField(Book))
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {"collection": "wishlists"}

    def __str__(self):
        return f"Wishlist of {self.user.email}"
