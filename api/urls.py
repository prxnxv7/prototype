from django.urls import path
from . import views
from .views import MyTokenObtainPairView
from django.contrib.auth import views as auth_views

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path("profile/", views.get_persons),
    path("dashboard/", views.get_dashboard, name="dashboard"),
    path("persons/", views.create_person, name="create_person"),
    path("transactions/", views.notification_page, name="notification_page"),
    path(
        "transactions/<int:transaction_id>/",
        views.update_transaction,
        name="updation_page",
    ),
    path(
        "ignore/<int:transaction_id>/",
        views.ignore_transaction,
        name="ignore_page",
    ),
    path("persons/<int:person_id>/", views.person_profile, name="person_profile"),
    path("delete/<int:person_id>/", views.delete_person, name="delete_profile"),
    # auth
    path("register/", views.register_user, name="register_user"),
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
