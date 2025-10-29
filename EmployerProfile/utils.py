from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.core.mail import EmailMultiAlternatives
from email.utils import formataddr
from django.templatetags.static import static

def send_verification_email(request, user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    verification_url = request.build_absolute_uri(
        reverse('employer-emailverifypage', kwargs={'uidb64': uid, 'token': token})
    )
    print(verification_url)

    subject = "Verify your employer account"
    # plain text fallback (always include the link here)
    message = f"""
Hi {user.email},

Thanks for registering at JobStreet.
Please verify your account by clicking the link below:

{verification_url}

If you didn't register, you can ignore this message.

– JobStreet Team
"""

    from_email = formataddr(("JobSeeker", "no-reply@yourdomain.com"))
    logo_url = request.build_absolute_uri(static("download.jpg"))

    # HTML version
    html = f"""
    <div style="font-family:Arial; text-align:center;">
        <img src="{logo_url}" alt="JobSeeker Logo" width="120"/>
        <h2>Welcome to JobSeeker!</h2>
        <p>Please verify your account by clicking below:</p>
        <a href="{verification_url}"
           style="background:#2563eb;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">
           Verify Email
        </a>
        <p>If the button doesn’t work, copy this link:</p>
        <p>{verification_url}</p>
    </div>
    """

    # build email
    msg = EmailMultiAlternatives(subject, message, from_email, [user.email])
    msg.attach_alternative(html, "text/html")   # ✅ add HTML part
    msg.send()                                  # ✅ actually send it
