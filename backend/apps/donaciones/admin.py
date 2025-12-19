from django.contrib import admin
from .models import Donante, Donacion

@admin.register(Donante)
class DonanteAdmin(admin.ModelAdmin):
    list_display = ('donante', 'tipo_id', 'identificacion', 'correo', 'created_at')
    search_fields = ('donante', 'identificacion', 'correo')
    list_filter = ('tipo_id', 'tipo_donante')

@admin.register(Donacion)
class DonacionAdmin(admin.ModelAdmin):
    list_display = ('id_donante', 'monto', 'fecha_donacion', 'estado', 'medio_pago')
    search_fields = ('id_donante__donante',)
    list_filter = ('estado', 'medio_pago', 'fecha_donacion')
