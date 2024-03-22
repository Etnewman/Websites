from django.db import models
from django.contrib.auth.models import User

class ExpenseSet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    running_total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ExpenseSet for {self.user.username} on {self.timestamp}"

class Expense(models.Model):
    expense_set = models.ForeignKey(ExpenseSet, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.name} - {self.amount}"

    def save(self, *args, **kwargs):
        # Calculate and update the running total of the associated ExpenseSet
        self.expense_set.running_total += self.amount
        self.expense_set.save()
        super().save(*args, **kwargs)