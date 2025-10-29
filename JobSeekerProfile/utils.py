import random
from django.core.mail import send_mail
from django.conf import settings

def send_verification_code(email):
    code = random.randint(100000, 999999)
    subject = "Your JobSeeker Verification Code"
    message = f"Use this verification code to complete your registration: {code}"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])
    return str(code)