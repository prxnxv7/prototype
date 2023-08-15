# serializers.py

from rest_framework import serializers
from .models import Person, Transaction

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__' 

class TransactionSerializer(serializers.ModelSerializer):
    person_details = serializers.SerializerMethodField()

    def get_person_details(self, obj):
        person = obj.person
        person_serializer = PersonSerializer(person)
        return person_serializer.data

    class Meta:
        model = Transaction
        fields = '__all__'
