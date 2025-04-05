from rest_framework import serializers
from .models import SpatialObject

class SpatialObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpatialObject
        fields = '__all__'