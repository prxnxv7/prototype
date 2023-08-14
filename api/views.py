
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Person, Transaction
from .serializers import PersonSerializer, TransactionSerializer
from rest_framework import status
from datetime import timedelta

@api_view(['POST'])
def create_person(request):
    if request.method == 'POST':
        serializer = PersonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            person = serializer.instance

            initial_next_due_date = timezone.now() + timedelta(minutes=person.time_period_given)

            Transaction.objects.create(
                person=person,
                start_date=person.start_date,
                total_amount_owed=person.money_owed,
                time_period=person.time_period_given,
                next_due_date=initial_next_due_date,
                paid=0,
                final_paid=0,
                pending_amount=person.money_owed
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def notification_page(request):
    today = timezone.now().date()
    transactions = Transaction.objects.filter(next_due_date=today)
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
def update_transaction(request, transaction_id):
    try:
        transaction = Transaction.objects.get(id=transaction_id)
        paid_amount = request.data.get('paid', 0)

        transaction.final_paid += paid_amount
        transaction.paid = paid_amount
        transaction.pending_amount = transaction.total_amount_owed - transaction.final_paid

        transaction.previous_due_date = timezone.now().date()

        transaction.paid_date = timezone.now().date()

        while transaction.final_paid <= transaction.total_amount_owed:
            transaction.next_due_date += timedelta(minutes=transaction.time_period)

        transaction.save()

        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)
    except Transaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def person_profile(request, person_id):
    try:
        person = Person.objects.get(id=person_id)
        person_serializer = PersonSerializer(person)
        transactions = Transaction.objects.filter(person=person)
        transaction_serializer = TransactionSerializer(transactions, many=True)
        return Response({
            'person': person_serializer.data,
            'transactions': transaction_serializer.data
        })
    except Person.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def get_persons(request):
    persons = Person.objects.all()
    serializer = PersonSerializer(persons, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
    



