# ExpensesTrackerServer/your_app/views.py

from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.utils import timezone
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from .forms import SignUpForm, LoginForm
from .models import Expense, ExpenseSet
from datetime import timedelta
import math
import logging
import json

logger = logging.getLogger(__name__)

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request, request.POST)
        if form.is_valid():
            user = authenticate(request, username=form.cleaned_data['username'], password=form.cleaned_data['password'])
            if user is not None:
                login(request, user)
                # Redirect to a success page or home
                return redirect('home')  # Update with your home URL name
    else:
        form = LoginForm()

    return render(request, 'ExpensesTracker/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('home')  # Replace 'home' with your home view name

# This will be a home-view dashboard in the future.
def home_view(request):
    return render(request, 'ExpensesTracker/home.html')

def expenses_view(request):
    return render(request, 'ExpensesTracker/expenses.html')

def income_view(request):
    return render(request, 'ExpensesTracker/income.html')

def analytics_view(request):
    return render(request, 'ExpensesTracker/analytics.html')

def data_view(request):
    # Assuming you want to filter expenses for the last week
    start_date = timezone.now() - timedelta(days=7)

    # Filter ExpenseSets based on the timestamp
    expense_sets = ExpenseSet.objects.filter(timestamp__gte=start_date)

    # Retrieve the associated expenses for each ExpenseSet
    expenses = Expense.objects.filter(expense_set__in=expense_sets)

    # Pass the data to the template
    context = {
        'expenses': expenses,
    }

    return render(request, 'ExpensesTracker/data.html', context)

def signup_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        # Check if passwords match
        if password == confirm_password:
            # Create a new user
            User.objects.create_user(username=username, password=password)

            # Redirect to a success page or login page
            return redirect('login')  # Assuming you have a 'login' URL name

        else:
            # Passwords don't match, handle this case as needed
            return render(request, 'ExpensesTracker/signup.html', {'error': 'Passwords do not match'})

    return render(request, 'ExpensesTracker/signup.html')

@login_required
@transaction.atomic
def save_expense(request):
    if request.method == 'POST':
        # Read the JSON data from the request body
        data = json.loads(request.body.decode('utf-8'))

        # Extract the data from the JSON payload
        expenses = data.get('expenses', [])  # Assuming 'expenses' is an array in the JSON payload
        running_total = data.get('runningTotal', 0.0)  # Default to 0.0 if 'runningTotal' is not present

        # Get the current user
        user = request.user

        # Create an ExpenseSet with the associated user, running total, and timestamp
        expense_set = ExpenseSet.objects.create(user=user, running_total=running_total, timestamp=timezone.now())

        # Save each expense to the database with the associated ExpenseSet
        for expense_data in expenses:
            name = expense_data.get('name', '')  # Get the expense name
            amount = expense_data.get('amount', 0.0)  # Default to 0.0 if 'amount' is not present

            expense = Expense(expense_set=expense_set, name=name, amount=amount)
            expense.save()

        return JsonResponse({'message': 'Expenses saved successfully'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)