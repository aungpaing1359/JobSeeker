from django.db import models
from Accounts.models import CustomUser
import uuid

class EmployerProfile(models.Model):
    id = models.UUIDField(
        primary_key=True,      # ဒီ field ကို primary key လုပ်မယ်
        default=uuid.uuid4,    # Auto-generate UUID v4
        editable=False         # User လက်နဲ့ မပြင်နိုင်အောင် lock
    )
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,related_name="employerprofile")
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    business_name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    phone = models.CharField(max_length=50, blank=True,null=True)
    size = models.CharField(max_length=50, blank=True,null=True)
    website = models.URLField(blank=True,null=True)
    industry = models.CharField(max_length=200, blank=True,null=True)
    logo = models.ImageField(upload_to="upload_to_logo",default="logo.png", null=True, blank=True)
    founded_year = models.PositiveIntegerField(blank=True, null=True)
    contact_email = models.EmailField(blank=True)
    description = models.TextField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True,null=True, blank=True)

    
    def __str__(self):
        return self.business_name

