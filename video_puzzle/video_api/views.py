from django.shortcuts import render,HttpResponse
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate,login
from django.contrib.auth.models import User

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
            user.save()
            return JsonResponse({'message': 'User registered successfully'})
    else:
        return JsonResponse({'message': 'Invalid request'})

@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username', None)
        password = data.get('password', None)
        print(username,password)
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request,user)
            return JsonResponse({'message': 'Login successfully'})
        else:
            return JsonResponse({'message': 'Invalid credentials'})
    else:
        return JsonResponse({'message': 'Invalid request'})