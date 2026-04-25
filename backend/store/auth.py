import jwt
from datetime import datetime, timedelta, timezone
from django.conf import settings
from rest_framework import authentication, exceptions


def generate_token(user):
    payload = {
        "user_id": str(user.id),
        "exp": datetime.now(tz=timezone.utc) + timedelta(hours=24),
        "iat": datetime.now(tz=timezone.utc),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return None

        token = auth_header[7:]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token has expired.")
        except jwt.DecodeError:
            raise exceptions.AuthenticationFailed("Invalid token.")

        from .models import User

        try:
            user = User.objects.get(id=payload["user_id"])
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed("User not found.")

        if not user.is_active:
            raise exceptions.AuthenticationFailed("User account is disabled.")

        return (user, token)
