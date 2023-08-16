# models.py

from django.db import models
from django.utils import timezone

class Person(models.Model):
    name = models.CharField(max_length=100)
    phno = models.CharField(max_length=15)
    money_owed = models.DecimalField(max_digits=10, decimal_places=2)
    time_period_given = models.PositiveIntegerField(default=30)
    start_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    start_date = models.DateField()
    total_amount_owed = models.DecimalField(max_digits=10, decimal_places=2)
    time_period = models.PositiveIntegerField(default=30)
    final_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    next_due_date = models.DateField(null=True, blank=True)
    previous_due_date = models.DateField(null=True, blank=True)
    pending_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.person.name
    
class Payment(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_date = models.DateField()

    def __str__(self):
        return f"{self.transaction.person.name} - {self.paid_date}"
    