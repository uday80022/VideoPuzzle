from django.urls import path
from . import views

urlpatterns = [
    path('',views.home),
    path('register/',views.user_register),
    path('login/',views.user_login),
    path('activate/<uidb64>/<token>', views.activate, name='activate'),
    path('password_reset/', views.password_reset_request, name="password_reset"),
    path('password_reset_confirm/<str:uidb64>/<str:token>/<str:new_password>/', views.password_reset_confirm, name='password_reset_confirm'),
    path('user_logout/', views.user_logout, name='user_logout'),
    path('check_authentication/', views.check_authentication, name='check_authentication'),
]