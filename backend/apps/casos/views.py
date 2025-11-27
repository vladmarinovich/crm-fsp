from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import Caso, HogarDePaso
from .serializers import CasoSerializer, HogarDePasoSerializer
from backend.apps.donaciones.serializers import DonacionSerializer
from backend.apps.finanzas.serializers import GastoSerializer

class CasoViewSet(viewsets.ModelViewSet):
    queryset = Caso.objects.all()
    serializer_class = CasoSerializer
    search_fields = ['nombre_caso', 'diagnostico']
    filterset_fields = ['estado', 'veterinaria']
    ordering = ['-fecha_ingreso']

    @action(detail=False, methods=['get'])
    def activos(self, request):
        """Retorna casos que no tienen fecha de salida (activos)"""
        casos = Caso.objects.filter(fecha_salida__isnull=True)
        serializer = self.get_serializer(casos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def balance(self, request, pk=None):
        """Retorna donaciones y gastos de un caso específico"""
        caso = self.get_object()
        donaciones = caso.donaciones.all()
        gastos = caso.gastos.all()
        
        total_donado = donaciones.aggregate(Sum('monto'))['monto__sum'] or 0
        total_gastado = gastos.aggregate(Sum('monto'))['monto__sum'] or 0
        
        return Response({
            "caso": caso.nombre_caso,
            "total_recaudado": total_donado,
            "total_gastado": total_gastado,
            "balance": total_donado - total_gastado,
            "donaciones": DonacionSerializer(donaciones, many=True).data,
            "gastos": GastoSerializer(gastos, many=True).data
        })

class HogarDePasoViewSet(viewsets.ModelViewSet):
    queryset = HogarDePaso.objects.all()
    serializer_class = HogarDePasoSerializer
