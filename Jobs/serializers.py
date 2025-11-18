

from rest_framework import serializers
from .models import JobCategory, Jobs
from Accounts.models import CustomUser
from EmployerProfile.models import EmployerProfile

class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = ['id', 'name']
    

    
class JobsSerializer(serializers.ModelSerializer):
    employer = serializers.CharField(source='employer.business_name', read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=JobCategory.objects.all())
    category_name = serializers.CharField(source='category.name', read_only=True)

    # 🔥 Add display fields for choices
    location_display = serializers.CharField(source='get_location_display', read_only=True)
    job_type_display = serializers.CharField(source='get_job_type_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)

    class Meta:
        model = Jobs
        fields = [
            "id",
            "employer",
            "category",
            "category_name",
            "title",
            "description",

            # Choices field + display
            "location",
            "location_display",
            "job_type",
            "job_type_display",
            "priority",
            "priority_display",

            "salary",
            "is_active",
            "max_applicants",
            "deadline",
            "created_at",
            "updated_at",
        ]

        read_only_fields = ["employer"]



    
    






    

