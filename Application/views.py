# applications/views.py
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404  # see below
from django.db import IntegrityError, transaction
from .models import Jobs, JobseekerProfile
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from .models import *
from Jobs.models import *
from .serializers import *
#hello wrold

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def apply_job(request, job_id):
    # 1️⃣ Get job seeker profile & job
    profile = get_object_or_404(JobseekerProfile, user=request.user)
    job = get_object_or_404(Jobs, id=job_id)
    print(job.id)
    print("Max applicants:", job.max_applicants, type(job.max_applicants))
    

    # 2️⃣ Duplicate application check
    if Application.objects.filter(job=job, job_seeker_profile=profile).exists():
        return Response(
            {"message": "You have already applied for this job."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 3️⃣ Max applicants null-safe check
    max_limit = getattr(job, "max_applicants", None)
    total = Application.objects.filter(job=job).count()

    # Treat 0 or None as unlimited
    if max_limit is None or max_limit <= 0:
        max_limit = None

    if max_limit is not None and total >= max_limit:
        if job.is_active:
            job.is_active = False
            job.save(update_fields=["is_active"])
        return Response(
        {"message": "The maximum number of applicants for this job has been reached."},
        status=status.HTTP_400_BAD_REQUEST
    )
    # 4️⃣ Serialize incoming data
    serializer = ApplicationCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # 5️⃣ Create application inside a transaction
    try:
        with transaction.atomic():
            application = Application.objects.create(
                job_seeker_profile=profile,
                job=job,
                status=serializer.validated_data.get("status", "P"),
                cover_letter_text=serializer.validated_data.get("cover_letter_text", "")
            )

            # ✅ Re-count AFTER creating; close job if hitting limit
            total_after = Application.objects.filter(job=job).count()
            if max_limit is not None and total_after >= max_limit and job.is_active:
                job.is_active = False
                job.save(update_fields=["is_active"])

            s_application = ApplicationDetailSerializer(application).data
            return Response({
                "success": True,
                "message": f"You have successfully applied for the job '{job.title}'.",
                "data": s_application
            }, status=status.HTTP_201_CREATED)
   

    except IntegrityError:
        return Response(
            {"message": "You have already applied for this job."},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_job(request,job_id):
    try:
        profile=JobseekerProfile.objects.get(user=request.user)
    except JobseekerProfile.DoesNotExist:
        return Response({"detail": "Ah! You have to create profile before save job"}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        job=Jobs.objects.get(id=job_id)
    except Jobs.DoesNotExist:
        return Response({"detail": "This job does not exist"}, status=status.HTTP_404_NOT_FOUND)
    try:
        save_job=SaveJob.objects.create(profile=profile,job=job)
        s_save_job=SaveJobsSerializer(save_job).data
        return Response({
            "success": True,
            "message": f"Job '{job.title}' has been saved successfully.",
            "data": s_save_job
        }, status=status.HTTP_201_CREATED)
    except IntegrityError:
        return Response({"detail": "You have already saved this job"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET',])
@permission_classes([IsAuthenticated])
def saved_jobs(request):
    try:
        profile=JobseekerProfile.objects.get(user=request.user)
    except JobseekerProfile.DoesNotExist:
        return Response({"detail": "Ah! You have to create profile before save job"}, status=status.HTTP_404_NOT_FOUND)
    
    savejobs=SaveJob.objects.filter(profile=profile)
    s_savejobs=SaveJobsSerializer(savejobs,many=True).data
    return Response({"s_savejobs":s_savejobs})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def saved_job_detail(request,sj_id):
    try:
        profile=JobseekerProfile.objects.get(user=request.user)
    except JobseekerProfile.DoesNotExist:
        return Response({"detail": "Ah! You have to create profile before save job"}, status=status.HTTP_404_NOT_FOUND)
    try:
        saved_job=SaveJob.objects.get(profile=profile,id=sj_id)
    except SaveJob.DoesNotExist:
        return Response({"detail": "This job is not saved."}, status=status.HTTP_404_NOT_FOUND)
    s_saved_job=SaveJobsSerializer(saved_job).data
    return Response({"saved_job":s_saved_job})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def saved_job_remove(request,sj_id):
    if request.method == "DELETE":
        try:
            profile=JobseekerProfile.objects.get(user=request.user)
        except JobseekerProfile.DoesNotExist:
            return Response({"detail": "Ah! You have to create profile before save job"}, status=status.HTTP_404_NOT_FOUND)
        try:
            saved_job=SaveJob.objects.get(profile=profile,id=sj_id)
        except SaveJob.DoesNotExist:
            return Response({"detail": "This job is not saved."}, status=status.HTTP_404_NOT_FOUND)
        saved_job.delete()
        return Response({"Message":f"Job {saved_job.job.title} Succssfully Remove"},status=status.HTTP_200_OK)
    else:
        return Response({"Message":"Something Wrong Please try again"})

@api_view(['GET'])
def applied_jobs(request):
    applications = Application.objects.filter(job_seeker_profile__user=request.user)
    app_job=ApplicationListSerializer(applications,many=True).data
    return Response({"apply_jobs": app_job})

@api_view(['GET'])
def applied_job_detail(request,app_id):
    application = get_object_or_404(Application,id=app_id, job_seeker_profile__user=request.user)
    app_detail=ApplicationDetailSerializer(application).data
    return Response({"application_detail": app_detail})

@api_view(['DELETE'])
def applied_job_remove(request,app_id):
    if request.method == "DELETE":
        application=get_object_or_404(Application,id=app_id,job_seeker_profile__user=request.user)
        application.delete()
        return Response({"Message":f"Job {application.job.title} Succssfully Remove"},status=status.HTTP_200_OK)
    else:
        return Response({"Message":"Something Wrong Please try again"})
    

#applications for employer dashboard
@api_view(['GET'])
def applications(request):
    employer=get_object_or_404(EmployerProfile,user=request.user)
    query=Application.objects.applications_for_employer(employer)
    applications=ApplicationListSerializer(query,many=True).data
    return Response({"applications":applications})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def application_detail(request, app_id):
    app = get_object_or_404(Application, id=app_id, job__employer__user=request.user)
    s_app = ApplicationDetailSerializer(app).data
    return Response({"s_app": s_app}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def application_delete(request,app_id):
    if request.method == "DELETE":
        app = get_object_or_404(Application, id=app_id, job__employer__user=request.user)
        app.delete()
        return Response({"Message":f"{app} Delete Successfully"})
    else:
        return Response({"Message":"Something Wrong Please try again"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_applications(request):
    apps = Application.objects.submitted_applications(request.user)
    s_apps=ApplicationListSerializer(apps,many=True).data
    return Response({
        "pending_apps":s_apps,
        "count": len(s_apps)
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reviewed_applications(request):
    apps = Application.objects.reviewed_applications(request.user)
    s_apps=ApplicationListSerializer(apps,many=True).data
    return Response({
        "reviewed_apps":s_apps,
        "count": len(s_apps)
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def rejected_applications(request):
    apps = Application.objects.rejected_applications(request.user)
    s_apps=ApplicationListSerializer(apps,many=True).data
    return Response({
        "rejected_apps":s_apps,
        "count": len(s_apps)
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def shortlist_applications(request):
    apps = Application.objects.shortlist_applications(request.user)
    s_apps=ApplicationListSerializer(apps,many=True).data
    return Response({
        "shorlist_apps":s_apps,
        "count": len(s_apps)
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hired_applications(request):
    apps = Application.objects.hired_applications(request.user)
    s_apps=ApplicationListSerializer(apps,many=True).data
    return Response({
        "hired_apps":s_apps,
        "count": len(s_apps)
        })



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_application_status(request, app_id):
    """
    Update a single application status by its ID.
    Example:  POST /api/v1/applications/5/update-status/
              Body: { "new_status": "shortlist" }
    """
    employer = getattr(request.user, "employerprofile", None)
    if not employer:
        return Response(
            {"error": "Only employers can perform this action."},
            status=status.HTTP_403_FORBIDDEN,
        )
    app = get_object_or_404(Application, id=app_id, job__employer=employer)
    new_status = request.data.get("new_status")
    # hellor Map readable names → codes (optional, if you use short codes)
    STATUS_MAP = {
        "pending": "P",
        "review": "R",
        "shortlist": "SL",
        "rejected": "RJ",
        "hired": "H",
    }
    new_status = STATUS_MAP.get(str(new_status).lower(), new_status)
    valid_statuses = [choice[0] for choice in Application.STATUS_CHOICES]
    if new_status not in valid_statuses:
        return Response(
            {"error": "Invalid status value.", "valid_statuses": valid_statuses},
            status=status.HTTP_400_BAD_REQUEST,
        )

    app.status = new_status
    app.save()
    return Response(
        {
            "success": True,
            "id": app.id,
            "new_status": app.status,
            "message": f"Application {app.id} updated to '{new_status}'."
        },
        status=status.HTTP_200_OK,
    )

@api_view(['GET'])
def recent_applications(request):
    recent_apps=Application.objects.recent_applications()
    s_recent_apps=ApplicationListSerializer(recent_apps,many=True).data
    return Response({
        "s_recent_apps":s_recent_apps
    })





    
