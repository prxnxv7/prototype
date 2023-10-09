# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Payment, Person, Transaction
from .serializers import PersonSerializer, TransactionSerializer, PaymentSerializer
from rest_framework import status
from django.db.models import Q, F, Sum
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from datetime import date, timedelta
from django.utils import timezone


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["GET"])
def getRoutes(request):
    routes = [
        "/api/token",
        "/api/token/refresh",
    ]

    return Response(routes)


@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    username = data.get("username")
    password = data.get("password")
    first_name = data.get("first_name")
    last_name = data.get("last_name")

    if username and password and first_name and last_name:
        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        return Response(
            {"message": "User created successfully"}, status=status.HTTP_201_CREATED
        )
    else:
        return Response({"message": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_person(request):
    if request.method == "POST":
        serializer = PersonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            person = serializer.instance

            initial_next_due_date = date.today() + timedelta(days=person.time_period_given)
            
            Transaction.objects.create(
                user=request.user,
                person=person,
                start_date=person.start_date,
                total_amount_owed=person.money_owed,
                time_period=person.time_period_given,
                next_due_date=initial_next_due_date,
                paid=0,
                final_paid=0,
                pending_amount=person.money_owed,
                per_due_amount=person.amount_per_due,
                number_of_dues=person.dues
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_person(request,person_id):
    try:
        person = Person.objects.filter(id=person_id, user=request.user)
        person.delete()
        return Response({"message":"Person deleted"})
    except Person.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def notification_page(request):
    overdues = update_overdue_transactions(request.user)
    today = date.today()
    transactions = Transaction.objects.filter(
        Q(next_due_date=today)
        & ~Q(final_paid=F("total_amount_owed"))
        & Q(final_paid__lt=F("total_amount_owed"))
        & Q(user=request.user)
    )
    combined_transactions = overdues.union(transactions)
    serializer = TransactionSerializer(combined_transactions, many=True)
    return Response(serializer.data)

def update_overdue_transactions(user):
    today = date.today()
    overdue_transactions = Transaction.objects.filter(
        Q(next_due_date__lt=today)
        & ~Q(final_paid=F("total_amount_owed"))
        & Q(final_paid__lt=F("total_amount_owed"))
        & Q(user=user)
    )

    return overdue_transactions


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_transaction(request, transaction_id):
    try:
        transaction = Transaction.objects.get(id=transaction_id, user=request.user)
        paid_amount = request.data.get("paid", 0)
        print(request.data)
        payment = Payment.objects.create(
            transaction=transaction,
            paid_amount=paid_amount,
            paid_date=date.today(),
            user=request.user,
        )
        transaction.final_paid += paid_amount
        transaction.paid = paid_amount
        transaction.pending_amount = (
            transaction.total_amount_owed - transaction.final_paid
        )

        transaction.previous_due_date = date.today()

        if transaction.final_paid <= transaction.total_amount_owed:
            transaction.next_due_date += timedelta(days=transaction.time_period)

        transaction.save()

        serializer = TransactionSerializer(transaction)
        print(serializer.data)
        return Response(serializer.data)
    except Transaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def ignore_transaction(request, transaction_id):
    try:
        transaction = Transaction.objects.get(id=transaction_id, user=request.user)

        if transaction.final_paid <= transaction.total_amount_owed:
            transaction.next_due_date += timedelta(days=transaction.time_period)

        transaction.save()

        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)
    except Transaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def person_profile(request, person_id):
    try:
        person = Person.objects.get(id=person_id, user=request.user)
        person_serializer = PersonSerializer(person)
        transactions = Transaction.objects.filter(person=person)
        transaction_serializer = TransactionSerializer(transactions, many=True)

        transactions_ids = transactions.values_list("id", flat=True)
        payments = Payment.objects.filter(transaction__in=transactions_ids)
        payment_serializer = PaymentSerializer(payments, many=True)

        return Response(
            {
                "person": person_serializer.data,
                "transactions": transaction_serializer.data,
                "payments": payment_serializer.data,
            }
        )
    except Person.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_persons(request):
    persons = Person.objects.filter(user=request.user)
    serializer = PersonSerializer(persons, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_dashboard(request):
    today = date.today()
    overdue_transactions = Transaction.objects.filter(
        Q(next_due_date__lt=today)
        & ~Q(final_paid=F("total_amount_owed"))
        & Q(final_paid__lt=F("total_amount_owed"))
        & Q(user=request.user)
    )
    overdue_count = overdue_transactions.count()

    transactions = Transaction.objects.filter(
        Q(next_due_date=today)
        & ~Q(final_paid=F("total_amount_owed"))
        & Q(final_paid__lt=F("total_amount_owed"))
        & Q(user=request.user)
    )
    transaction_count = transactions.count() 

    total_payment_amount_today = (
        Payment.objects.filter(paid_date=today, user=request.user).aggregate(
            total_amount=Sum("paid_amount")
        )["total_amount"]
        or 0
    )

    payments_today = Payment.objects.filter(paid_date=today, user=request.user)
    payments_today_data = PaymentSerializer(payments_today, many=True).data

    transaction = Transaction.objects.filter(pending_amount__gt=0, user=request.user)
    transaction_data = TransactionSerializer(transactions, many=True).data

    response_data = {
        "overdue_count": overdue_count,
        "transaction_count": transaction_count,
        "total_payment_amount_today": total_payment_amount_today,
        "payments_today": payments_today_data,
        "transaction_data": transaction_data,
    }
    print(response_data["overdue_count"])
    return Response(response_data)
