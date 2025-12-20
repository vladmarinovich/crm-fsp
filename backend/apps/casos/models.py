from django.db import models
from django.utils.translation import gettext_lazy as _
from backend.apps.core.models import TimeStampedModel

class HogarDePaso(models.Model):
    """
    Representa un hogar de paso para los animales rescatados.
    """
    id_hogar_de_paso = models.AutoField(primary_key=True)
    nombre_hogar = models.CharField(max_length=255, db_index=True)
    tipo_hogar = models.CharField(max_length=100, null=True, blank=True)
    nombre_contacto = models.CharField(max_length=255, null=True, blank=True)
    correo = models.CharField(max_length=255, null=True, blank=True)
    telefono = models.CharField(max_length=50, null=True, blank=True)
    ciudad = models.CharField(max_length=100, null=True, blank=True, db_index=True)
    pais = models.CharField(max_length=100, null=True, blank=True)
    cupo_maximo = models.IntegerField(null=True, blank=True)
    tarifa_diaria = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    desempeno = models.TextField(null=True, blank=True)
    ultimo_contacto = models.DateField(null=True, blank=True)
    notas = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'hogar_de_paso'
        verbose_name = _('Hogar de Paso')
        verbose_name_plural = _('Hogares de Paso')

    def __str__(self):
        return str(self.nombre_hogar)

class Caso(TimeStampedModel):
    """
    Representa un caso de rescate o ayuda a un animal específico.
    """
    class EstadoCaso(models.TextChoices):
        ABIERTO = 'ABIERTO', _('Abierto')
        CERRADO = 'CERRADO', _('Cerrado')
        EN_TRATAMIENTO = 'EN_TRATAMIENTO', _('En Tratamiento')
        ADOPTADO = 'ADOPTADO', _('Adoptado')
        FALLECIDO = 'FALLECIDO', _('Fallecido')

    id_caso = models.AutoField(primary_key=True)
    nombre_caso = models.CharField(max_length=255, db_index=True)
    estado = models.CharField(max_length=50, choices=EstadoCaso.choices, null=True, blank=True)
    fecha_ingreso = models.DateField(null=True, blank=True)
    fecha_salida = models.DateField(null=True, blank=True)
    veterinaria = models.CharField(max_length=255, null=True, blank=True)
    diagnostico = models.TextField(null=True, blank=True)
    presupuesto_estimado = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="Presupuesto estimado")
    archivo = models.JSONField(null=True, blank=True, help_text="Historia clínica o archivos adjuntos")
    
    # FK interna
    id_hogar_de_paso = models.ForeignKey(HogarDePaso, on_delete=models.CASCADE, db_column='id_hogar_de_paso', null=True, blank=True, related_name='casos')

    class Meta:
        db_table = 'casos'
        verbose_name = _('Caso')
        verbose_name_plural = _('Casos')

    def __str__(self):
        return str(self.nombre_caso)
