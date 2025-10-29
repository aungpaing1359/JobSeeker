

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
    category = serializers.PrimaryKeyRelatedField(
        queryset=JobCategory.objects.all()
    )
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Jobs
        fields = '__all__'
        read_only_fields = ['employer']

    
    






    

