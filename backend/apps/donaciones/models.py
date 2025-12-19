from django.db import models
from django.utils.translation import gettext_lazy as _
from backend.apps.core.models import TimeStampedModel

class Donante(TimeStampedModel):
    """
    Representa a un donante en el sistema CRM.
    """
    class TipoId(models.TextChoices):
        CC = 'CC', _('Cédula de Ciudadanía')
        NIT = 'NIT', _('NIT')
        CE = 'CE', _('Cédula de Extranjería')
        TI = 'TI', _('Tarjeta de Identidad')
        PASAPORTE = 'PASAPORTE', _('Pasaporte')
        OTRO = 'OTRO', _('Otro')

    class TipoDonante(models.TextChoices):
        PERSONA_NATURAL = 'PERSONA_NATURAL', _('Persona Natural')
        EMPRESA = 'EMPRESA', _('Empresa')
        FUNDACION = 'FUNDACION', _('Fundación')
        OTRO = 'OTRO', _('Otro')

    id_donante = models.AutoField(primary_key=True)
    donante = models.CharField(max_length=255, db_index=True)
    tipo_id = models.CharField(max_length=50, choices=TipoId.choices, null=True, blank=True)
    identificacion = models.CharField(max_length=50, null=True, blank=True, db_index=True)
    # created_at y last_modified_at vienen de TimeStampedModel
    correo = models.CharField(max_length=255, null=True, blank=True, db_index=True)
    telefono = models.CharField(max_length=50, null=True, blank=True)
    ciudad = models.CharField(max_length=100, null=True, blank=True)
    tipo_donante = models.CharField(max_length=100, choices=TipoDonante.choices, null=True, blank=True)
    pais = models.CharField(max_length=100, null=True, blank=True)
    canal_origen = models.CharField(max_length=100, null=True, blank=True)
    consentimiento = models.BooleanField(null=True, blank=True)
    notas = models.TextField(null=True, blank=True)
    archivos = models.JSONField(null=True, blank=True, help_text="Metadatos de archivos adjuntos")

    class Meta:
        db_table = 'donantes'
        verbose_name = _('Donante')
        verbose_name_plural = _('Donantes')

    def __str__(self):
        return str(self.donante)

class Donacion(TimeStampedModel):
    """
    Registra una donación financiera recibida por la fundación.
    """
    class EstadoDonacion(models.TextChoices):
        APROBADA = 'APROBADA', _('Aprobada')
        PENDIENTE = 'PENDIENTE', _('Pendiente')
        RECHAZADA = 'RECHAZADA', _('Rechazada')

    class MedioPago(models.TextChoices):
        EFECTIVO = 'EFECTIVO', _('Efectivo')
        TRANSFERENCIA = 'TRANSFERENCIA', _('Transferencia Bancaria')
        TARJETA = 'TARJETA', _('Tarjeta de Crédito/Débito')
        WOMPI = 'WOMPI', _('Wompi')
        PAYU = 'PAYU', _('PayU')
        NEQUI = 'NEQUI', _('Nequi')
        OTRO = 'OTRO', _('Otro')

    id_donacion = models.AutoField(primary_key=True)
    # FK interna
    id_donante = models.ForeignKey(Donante, on_delete=models.CASCADE, db_column='id_donante', null=True, blank=True, related_name='donaciones')
    # FK externa a Casos
    id_caso = models.ForeignKey('casos.Caso', on_delete=models.CASCADE, db_column='id_caso', null=True, blank=True, related_name='donaciones')
    
    fecha_donacion = models.DateField(null=True, blank=True)
    monto = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    medio_pago = models.CharField(max_length=100, choices=MedioPago.choices, null=True, blank=True)
    estado = models.CharField(max_length=50, choices=EstadoDonacion.choices, null=True, blank=True)
    comprobante = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'donaciones'
        verbose_name = _('Donación')
        verbose_name_plural = _('Donaciones')

    def __str__(self):
        return f"Donacion {self.id_donacion}"
