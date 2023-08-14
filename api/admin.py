# myapp/admin.py

from django.contrib import admin
from .models import Person, Transaction

# Register your models here

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'phno', 'money_owed', 'time_period_given', 'start_date')
    search_fields = ('name', 'phno')
    list_filter = ('time_period_given', 'start_date')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id','person', 'start_date', 'total_amount_owed', 'time_period', 'next_due_date', 'previous_due_date', 'paid', 'final_paid', 'pending_amount')
    search_fields = ('person__name', 'person__phno')
    list_filter = ('time_period', 'next_due_date', 'previous_due_date')
