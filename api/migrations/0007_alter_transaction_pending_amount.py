# Generated by Django 3.2.20 on 2023-08-16 14:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_delete_payment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='pending_amount',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]