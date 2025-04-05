
from django.contrib import admin
from django.urls import path
from geoapi.views import SpatialObjectList, SpatialObjectDetail,Create_objects
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='geoapi/index.html')),
    path('api/objects/', SpatialObjectList.as_view(), name='object-list'),
    path('api/objects/<int:pk>/', SpatialObjectDetail.as_view(), name='object-detail'),
    path('api/objects/objects_create/', Create_objects, name='objects-create'),
]
