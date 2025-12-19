from django.db import models
from django.utils.translation import gettext_lazy as _
from backend.apps.core.models import TimeStampedModel

class Proveedor(TimeStampedModel):
    """
    Representa un proveedor de bienes o servicios para la fundación.
    """
    id_proveedor = models.AutoField(primary_key=True)
    nombre_proveedor = models.CharField(max_length=255, db_index=True)
    tipo_proveedor = models.CharField(max_length=100, null=True, blank=True)
    nit = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    nombre_contacto = models.CharField(max_length=255, null=True, blank=True)
    correo = models.CharField(max_length=255, null=True, blank=True)
    telefono = models.CharField(max_length=50, null=True, blank=True)
    ciudad = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        db_table = 'proveedores'
        verbose_name = _('Proveedor')
        verbose_name_plural = _('Proveedores')

    def __str__(self):
        return str(self.nombre_proveedor)

class Gasto(TimeStampedModel):
    """
    Registra un egreso o gasto realizado por la fundación.
    """
    class EstadoGasto(models.TextChoices):
        PAGADO = 'PAGADO', _('Pagado')
        PENDIENTE = 'PENDIENTE', _('Pendiente')
        ANULADO = 'ANULADO', _('Anulado')

    id_gasto = models.AutoField(primary_key=True)
    nombre_gasto = models.CharField(max_length=255)
    fecha_pago = models.DateField(null=True, blank=True)
    
    # FK externa a Casos
    id_caso = models.ForeignKey('casos.Caso', on_delete=models.CASCADE, db_column='id_caso', null=True, blank=True, related_name='gastos')
    
    medio_pago = models.CharField(max_length=100, null=True, blank=True)
    monto = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    estado = models.CharField(max_length=50, choices=EstadoGasto.choices, null=True, blank=True)
    comprobante = models.TextField(null=True, blank=True)
    
    # FK interna
    id_proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE, db_column='id_proveedor', null=True, blank=True, related_name='gastos')

    class Meta:
        db_table = 'gastos'
        verbose_name = _('Gasto')
        verbose_name_plural = _('Gastos')

    def __str__(self):
        return str(self.nombre_gasto)
