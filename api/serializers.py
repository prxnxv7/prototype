# serializers.py

from rest_framework import serializers
from .models import Person, Transaction

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'  # Use all fields of the Person model in the serializer

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'  # Use all fields of the Transaction model in the serializer
