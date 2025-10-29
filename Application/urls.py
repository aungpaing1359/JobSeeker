from django.urls import path
from .views import *

urlpatterns = [
    #apply jobs jobseeker
    path("application/apply/jobs/list/",applied_jobs,name="apply-jobs-list"),
    path("application/apply/job/detail/<uuid:app_id>/",applied_job_detail,name="apply-job-detail"),
    path("application/apply/job/remove/<uuid:app_id>/",applied_job_remove,name="apply-job-remove"),
    path("application/<uuid:job_id>/apply/",apply_job, name="apply-job"),

    #save jobs
    path("save/job/<uuid:job_id>/", save_job, name="save-job"), 
    path("saved/jobs/", saved_jobs, name="saved-job-list"),   
    path("saved/job/detail/<uuid:sj_id>/",saved_job_detail, name="saved-job-detail"),
    path("saved/job/remove/<uuid:sj_id>/",saved_job_remove,name="save-job-remove"),

]