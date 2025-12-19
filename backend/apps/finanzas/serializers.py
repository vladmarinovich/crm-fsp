from rest_framework import serializers
from .models import Proveedor, Gasto
from backend.apps.casos.models import Caso

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'

class GastoSerializer(serializers.ModelSerializer):
    # Campos obligatorios
    id_proveedor = serializers.PrimaryKeyRelatedField(queryset=Proveedor.objects.all(), required=True)
    id_caso = serializers.PrimaryKeyRelatedField(queryset=Caso.objects.all(), required=True)
    
    # Campos de lectura
    proveedor_nombre = serializers.ReadOnlyField(source='id_proveedor.nombre_proveedor')
    caso_nombre = serializers.ReadOnlyField(source='id_caso.nombre_caso')

    class Meta:
        model = Gasto
        fields = '__all__'

    def validate_fecha_pago(self, value):
        from django.utils import timezone
        if value > timezone.now().date():
            raise serializers.ValidationError("La fecha de pago no puede ser futura.")
        return value

    def validate_monto(self, value):
        if value <= 0:
            raise serializers.ValidationError("El monto debe ser positivo.")
        return value
