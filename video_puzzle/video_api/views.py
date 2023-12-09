from django.shortcuts import render,HttpResponse
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate,login
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import force_bytes,force_str
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.urls import reverse
from django.utils.html import format_html
from django.core.mail import send_mail

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
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request,user)
            return JsonResponse({'message': 'Login successfully'})
        else:
            return JsonResponse({'message': 'Invalid credentials'})
    else:
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