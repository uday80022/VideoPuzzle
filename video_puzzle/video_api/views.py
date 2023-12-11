from django.shortcuts import render,HttpResponse
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import force_bytes,force_str
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.urls import reverse
from django.utils.html import format_html
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
import base64
from django.http import HttpResponseRedirect
from django.db.models import Q

def home(request):
    return HttpResponse('Hello World')

@csrf_exempt
def user_register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username', None)
        password = data.get('password', None)
        email = data.get('email', None)
        print(username,password,email)
        all_usernames = User.objects.values_list('username', flat=True)
        if username in all_usernames:
           return JsonResponse({'message': "Username is already taken"})
        all_emails = User.objects.values_list('email', flat=True)
        if email in all_emails:
            return JsonResponse({'message': "Email is already registered"})
        else:
            user = User(username=username, email=email)
            user.set_password(password)
            user.is_active = False
            user.save()
            activate_email(request, user.email, user)
            return JsonResponse({'message': '''please check your email inbox and click on the activation link to confirm and complete the registration. 
                                 Note: Check your spam folder if you do not see the email.'''})
    else:
        return JsonResponse({'message': 'Invalid request'})

@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username', None)
        password = data.get('password', None)
        # username = 'uday'
        # password = 'uday'
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'message': 'Invalid credentials'})
        if user.check_password(password):
            if user.is_active:
                return JsonResponse({'type': 'success', 'message': 'Login successfully'})
            else:
                return JsonResponse({'message': 'Account is not activated. Please check your email for activation instructions.'})
        else:
            return JsonResponse({'message': 'Invalid credentials'})
    else:
        print(request.method)
        return JsonResponse({'message': 'Invalid request'})
    
def activate_email(request, to_email, user):
    subject = "Activate your user account"
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    
    activation_link = request.build_absolute_uri(reverse('activate', kwargs={'uidb64': uidb64, 'token': token}))
    message = format_html(
        "Hi <b>{user}<b>,<br><br>"
        "Please click on the link below to confirm your registration:<br><br>"
        "<a href='{activation_link}'>{activation_link}</a><br><br>"
        "Thank you!",
        user=user.username,
        activation_link=activation_link
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [to_email],
        fail_silently=False,
        html_message=message,
    )

    return 'Dear',user.username,'please check your email inbox and click on the activation link to confirm and complete the registration. Note: Check your spam folder if you do not see the email.'

def activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)
        return HttpResponse("Thank you for your email confirmation. Now you are logged in.")
    else:
        return HttpResponse("Activation link is invalid!")
    
@csrf_exempt
def password_reset_request(request):
    data = json.loads(request.body)
    print(data)
    user_email = data.get('email',None)
    new_password = data.get('new_password',None)
    print(user_email,new_password)
    User = get_user_model()
    associated_user = User.objects.filter(Q(email=user_email)).first()
    print(associated_user)
    if associated_user:
        subject = "Password Reset request"
        uidb64 = urlsafe_base64_encode(force_bytes(associated_user.pk))
        token = default_token_generator.make_token(associated_user)
        encoded_new_password = base64.urlsafe_b64encode(new_password.encode()).decode()
        reset_link = request.build_absolute_uri(reverse('password_reset_confirm', kwargs={'uidb64': uidb64, 'token': token, 'new_password': encoded_new_password}))
        message = format_html(
            "Hi <b>{user}</b>,<br><br>"
            "Please click on the link below to reset your password:<br><br>"
            "<a href='{reset_link}'>{reset_link}</a><br><br>"
            "Thank you!",
            user=associated_user.username,
            reset_link=reset_link
        )

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [associated_user.email],
            fail_silently=False,
            html_message=message,
        )

        return JsonResponse({
            'status': 'success',
            'message': 'Password reset email sent. Please check your email and follow the instructions.'
        })
    else:
        return JsonResponse({
            'status': 'error',
            'message': 'No user found with the provided email address.'
        })


def password_reset_confirm(request, uidb64, token, new_password):
    User = get_user_model()
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return JsonResponse({'status': 'error', 'message': 'Password reset link is invalid or expired.'})
    print(user)
    if default_token_generator.check_token(user, token):
        decoded_new_password = base64.urlsafe_b64decode(new_password.encode()).decode()
        if decoded_new_password:
            user.set_password(decoded_new_password)
            user.save()
            print("e")
            return HttpResponseRedirect('http://localhost:3000/login?message=Password%20reset%20successful.%20You%20can%20now%20login.')
        else:
            return JsonResponse({'status': 'error', 'message': 'New password is required.'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Password reset link is invalid or expired.'})
    
@csrf_exempt
def user_logout(request):
    print(request.user.is_authenticated)
    if request.user.is_authenticated:
        logout(request)
        return JsonResponse({"message": "success"})
    return JsonResponse({"message": "User not authenticated"})
    
@csrf_exempt
def check_authentication(request):
    if request.user.is_authenticated:
        return JsonResponse({"isAuthenticated": True})
    else:
        return JsonResponse({"isAuthenticated": False})
