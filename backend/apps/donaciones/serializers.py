from rest_framework import serializers
from django.db.models import Sum, Count, Avg, Max
from .models import Donante, Donacion
from backend.apps.casos.models import Caso

class DonanteSerializer(serializers.ModelSerializer):
    total_donado = serializers.SerializerMethodField()
    cantidad_donaciones = serializers.SerializerMethodField()
    promedio_donacion = serializers.SerializerMethodField()
    ultima_donacion = serializers.SerializerMethodField()

    class Meta:
        model = Donante
        fields = '__all__'

    def _get_donaciones_validas(self, obj):
        estados_validos = [
            'APROBADA', 'Aprobada', 'aprobada', 
            'COMPLETADO', 'Completado', 'completado', 'Completada',
            'CONFIRMADO', 'Confirmado', 'confirmado',
            'EXITOSA', 'Exitosa', 'exitosa'
        ]
        return obj.donaciones.filter(estado__in=estados_validos)

    def get_total_donado(self, obj):
        total = self._get_donaciones_validas(obj).aggregate(Sum('monto'))['monto__sum']
        return total or 0

    def get_cantidad_donaciones(self, obj):
        return self._get_donaciones_validas(obj).count()

    def get_promedio_donacion(self, obj):
        promedio = self._get_donaciones_validas(obj).aggregate(Avg('monto'))['monto__avg']
        return round(promedio, 2) if promedio else 0

    def get_ultima_donacion(self, obj):
        return self._get_donaciones_validas(obj).aggregate(Max('fecha_donacion'))['fecha_donacion__max']

class DonacionSerializer(serializers.ModelSerializer):
    # Campos obligatorios para la API (aunque sean opcionales en BD)
    id_donante = serializers.PrimaryKeyRelatedField(queryset=Donante.objects.all(), required=True)
    id_caso = serializers.PrimaryKeyRelatedField(queryset=Caso.objects.all(), required=True)
    
    # Campos de lectura para mostrar nombres
    donante_nombre = serializers.ReadOnlyField(source='id_donante.donante')
    caso_nombre = serializers.ReadOnlyField(source='id_caso.nombre_caso')

    class Meta:
        model = Donacion
        fields = '__all__'

    def validate_monto(self, value):
        if value <= 0:
            raise serializers.ValidationError("El monto de la donación debe ser mayor a 0.")
        return value

    def validate_fecha_donacion(self, value):
        from django.utils import timezone
        if value > timezone.now().date():
            raise serializers.ValidationError("La fecha de donación no puede ser futura.")
        return value
