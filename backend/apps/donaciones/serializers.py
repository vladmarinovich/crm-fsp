from rest_framework import serializers
from django.db.models import Sum
from .models import Donante, Donacion
from backend.apps.casos.models import Caso

class DonanteSerializer(serializers.ModelSerializer):
    total_donado = serializers.SerializerMethodField()

    class Meta:
        model = Donante
        fields = '__all__'

    def get_total_donado(self, obj):
        # Calcula el total histórico donado por este donante
        # Incluimos estados legacy que se ven en la captura (completado, confirmado)
        estados_validos = [
            'APROBADA', 'Aprobada', 'aprobada', 
            'COMPLETADO', 'Completado', 'completado', 'Completada',
            'CONFIRMADO', 'Confirmado', 'confirmado',
            'EXITOSA', 'Exitosa', 'exitosa'
        ]
        total = obj.donaciones.filter(estado__in=estados_validos).aggregate(Sum('monto'))['monto__sum']
        print(f"💰 [Debug] Donante {obj.id_donante}: Total calculado={total} (Estados: {estados_validos})")
        return total or 0

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
