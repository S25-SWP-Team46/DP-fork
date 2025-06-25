from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from rest_framework import routers

from classroom.views import ClassroomModelViewSet

import schema.views

schema_view = get_schema_view(
   openapi.Info(
      title="Database Playground API",
      default_version='v1',
      description="Database Playground API Documentation",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


router = routers.SimpleRouter()
router.register(r'schema', schema.views.DBSchemaModelViewSet)
router.register(r'classroom', ClassroomModelViewSet)
from engines.views import ChromaQueryParser

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
          schema_view.without_ui(cache_timeout=0),
          name='schema-json'),
    path(
        'swagger/',
        schema_view.with_ui('swagger', cache_timeout=0),
        name='schema-swagger-ui'
    ),
    path(
        'redoc/',
        schema_view.with_ui('redoc', cache_timeout=0),
        name='schema-redoc'
    ),
    path('test/', include("test.urls")),
    path('template/', include("templates.urls")),
    path('api/chroma_query/', ChromaQueryParser.as_view(), {'default_action': 'query'}),
    path('api/chroma_state/', ChromaQueryParser.as_view(), {'default_action': 'state'}),
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root = settings.STATIC_ROOT)
