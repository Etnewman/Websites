# ExpensesTrackerServer/your_app/urls.py

from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('', home_view, name='home'),
    path('expenses/', expenses_view, name='expenses'),
    path('save_expense/', save_expense, name='save_expense'),
    path('income/', income_view, name='income'),
    path('analytics/', analytics_view, name='analytics'),
    path('data/', data_view, name='data'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('signup/', signup_view, name='signup')
    # Add other URL patterns as needed
]
