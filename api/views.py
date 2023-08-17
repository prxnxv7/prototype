#views.py
from django.utils import timezone
from rest_framework.decorators import api_view , permission_classes
from rest_framework.response import Response
from .models import Payment, Person, Transaction
from .serializers import PersonSerializer, TransactionSerializer , PaymentSerializer
from rest_framework import status
from datetime import timedelta
from django.db.models import Q, F
from django.http import JsonResponse
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]

    return Response(routes)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def notification_page(request):
    today = timezone.now().date()
    transactions = Transaction.objects.filter(
        Q(next_due_date=today) & ~Q(final_paid=F('total_amount_owed')) & Q(final_paid__lt=F('total_amount_owed'))
    )
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)



@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_transaction(request, transaction_id):
    try:
        transaction = Transaction.objects.get(id=transaction_id)
        paid_amount = request.data.get('paid', 0)
        print(request.data)
        payment = Payment.objects.create(
            transaction=transaction,
            paid_amount=paid_amount,
            paid_date=timezone.now().date()
        )
        transaction.final_paid += paid_amount
        transaction.paid = paid_amount
        transaction.pending_amount = transaction.total_amount_owed - transaction.final_paid

        transaction.previous_due_date = timezone.now().date()


        if transaction.final_paid <= transaction.total_amount_owed:
            transaction.next_due_date += timedelta(minutes=transaction.time_period)

        transaction.save()

        serializer = TransactionSerializer(transaction)
        print(serializer.data)
        return Response(serializer.data)
    except Transaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def person_profile(request, person_id):
    try:
        person = Person.objects.get(id=person_id)
        person_serializer = PersonSerializer(person)
        transactions = Transaction.objects.filter(person=person)
        transaction_serializer = TransactionSerializer(transactions, many=True)
        
        
        transactions_ids = transactions.values_list('id', flat=True)
        payments = Payment.objects.filter(transaction__in=transactions_ids)
        payment_serializer = PaymentSerializer(payments, many=True)
        
        return Response({
            'person': person_serializer.data,
            'transactions': transaction_serializer.data,
            'payments': payment_serializer.data
        })
    except Person.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


   
@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def get_persons(request):
    persons = Person.objects.all()
    serializer = PersonSerializer(persons, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard(request):
    today = timezone.now().date()
    payments = Payment.objects.filter(paid_date=today)
    
    payment_data = []
    for payment in payments:
        payment_data.append({
            'person_name': payment.transaction.person.name,
            'paid_amount': payment.paid_amount,
        })
    return Response(payment_data , status=status.HTTP_200_OK)



        
