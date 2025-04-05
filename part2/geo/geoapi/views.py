from rest_framework import generics
from .models import SpatialObject
from .serializers import SpatialObjectSerializer
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from datetime import datetime


@csrf_exempt
def Create_objects(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            objects = data.get('objects', [])

            created_ids = []
            for obj in objects:
                # Преобразуем дату из строки в объект Date
                date_create = datetime.strptime(obj['date_create'], '%d.%m.%Y').date()

                new_obj = SpatialObject.objects.create(
                    name=obj['name'],
                    longitude=obj['longitude'],
                    latitude=obj['latitude'],
                    area=obj['area'],
                    status=obj['status'],
                    date_create=date_create,
                    type=obj['type']
                )
                created_ids.append(new_obj.id)

            return JsonResponse({'status': 'success', 'created': len(created_ids)})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Only POST allowed'}, status=405)


class SpatialObjectList(generics.ListAPIView):
    serializer_class = SpatialObjectSerializer

    def get_queryset(self):
        queryset = SpatialObject.objects.all()
        serializer_class = SpatialObjectSerializer

        # Фильтрация
        name = self.request.query_params.get('name', None)
        if name:
            queryset = queryset.filter(name__icontains=name)

        # Сортировка
        sort = self.request.query_params.get('sort', 'id')
        order = self.request.query_params.get('order', 'asc')
        if order == 'desc':
            sort = f'-{sort}'
        return queryset.order_by(sort)


class SpatialObjectDetail(generics.RetrieveAPIView):
    queryset = SpatialObject.objects.all()
    serializer_class = SpatialObjectSerializer