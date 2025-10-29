from django.urls import path
from .views import avatar_svg

urlpatterns = [
    path("avatar/<uuid:user_id>.svg", avatar_svg, name="avatar-svg"),
]
