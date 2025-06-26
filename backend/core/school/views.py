from django.shortcuts import render
from .models import Course, Assignment
from rest_framework import viewsets
from .models import Classroom, Enrollment, Submission
from django.conf import settings
from .serializers import UserSerializer, ClassroomSerializer, EnrollmentSerializer, CourseSerializer, AssignmentSerializer, SubmissionSerializer

from django.contrib.auth import get_user_model
User = get_user_model()

def course_list(request):
    courses = Course.objects.all()
    return render(request, 'school/course_list.html', {'courses': courses})

def assignment_detail(request, pk):
    assignment = Assignment.objects.get(pk=pk)
    return render(request, 'school/assignment_detail.html', {'assignment': assignment})

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ClassroomViewSet(viewsets.ModelViewSet):
    queryset = Classroom.objects.all()
    serializer_class = ClassroomSerializer

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

