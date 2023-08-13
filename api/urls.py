# urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.get_persons, name='create_person'),
    path('persons/', views.create_person, name='create_person'),
    path('transactions/', views.notification_page, name='notification_page'),
    path('persons/<int:person_id>/', views.person_profile, name='person_profile'),

]
