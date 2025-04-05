from django.db import models

class SpatialObject(models.Model):
    name = models.CharField(max_length=100)
    area = models.FloatField()
    status = models.BooleanField()
    date_create = models.DateField()
    type = models.IntegerField()
    longitude = models.FloatField()
    latitude = models.FloatField()

    def __str__(self):
        return self.name

