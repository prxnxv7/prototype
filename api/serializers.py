# serializers.py

from rest_framework import serializers
from .models import Person, Transaction, Payment


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = "__all__"


class TransactionSerializer(serializers.ModelSerializer):
    person_details = serializers.SerializerMethodField()

    def get_person_details(self, obj):
        person = obj.person
        person_serializer = PersonSerializer(person)
        return person_serializer.data

    class Meta:
        model = Transaction
        fields = "__all__"


class PaymentSerializer(serializers.ModelSerializer):
    transaction_details = serializers.SerializerMethodField()

    def get_transaction_details(self, obj):
        transaction = obj.transaction
        transaction_serializer = TransactionSerializer(transaction)
        return transaction_serializer.data

    class Meta:
        model = Payment
        fields = "__all__"
