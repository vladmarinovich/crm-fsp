from rest_framework import serializers
from .models import HogarDePaso, Caso

class HogarDePasoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HogarDePaso
        fields = '__all__'

class CasoSerializer(serializers.ModelSerializer):
    total_recaudado = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total_gastado = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    nombre_hogar_de_paso = serializers.CharField(source='id_hogar_de_paso.nombre_hogar', read_only=True, allow_null=True)
    dias_activo = serializers.SerializerMethodField()
    
    class Meta:
        model = Caso
        fields = '__all__'
    
    def get_dias_activo(self, obj):
        """Calculate days since fecha_ingreso (only for active cases)"""
        if obj.fecha_salida:
            return None  # Caso cerrado
        from datetime import date
        return (date.today() - obj.fecha_ingreso).days

    def validate_fecha_ingreso(self, value):
        from django.utils import timezone
        if value > timezone.now().date():
            raise serializers.ValidationError("La fecha de ingreso no puede ser futura.")
        return value

    def validate(self, data):
        # Validación de fechas
        if data.get('fecha_salida') and data.get('fecha_ingreso'):
            if data['fecha_salida'] < data['fecha_ingreso']:
                raise serializers.ValidationError({"fecha_salida": "La fecha de salida no puede ser anterior a la de ingreso."})
        return data
