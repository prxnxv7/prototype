# Generated by Django 3.2.20 on 2023-08-16 15:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_transaction_pending_amount'),
    ]

    operations = [
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('paid_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('paid_date', models.DateField()),
                ('transaction', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.transaction')),
            ],
        ),
    ]
