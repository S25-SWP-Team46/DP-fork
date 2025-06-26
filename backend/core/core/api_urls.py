from rest_framework import routers
from school.views import UserViewSet, ClassroomViewSet, EnrollmentViewSet, CourseViewSet, AssignmentViewSet, SubmissionViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'classrooms', ClassroomViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'assignments', AssignmentViewSet)
router.register(r'submissions', SubmissionViewSet)

urlpatterns = router.urls