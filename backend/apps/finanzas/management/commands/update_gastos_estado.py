"""
Comando de Django para actualizar gastos de RECHAZADO a PAGADO
"""
from django.core.management.base import BaseCommand
from apps.gastos.models import Gasto


class Command(BaseCommand):
    help = 'Actualiza gastos con estado RECHAZADO a PAGADO'

    def handle(self, *args, **options):
        self.stdout.write("🔍 Buscando gastos con estado RECHAZADO...")
        
        # Buscar gastos rechazados
        rechazados = Gasto.objects.filter(estado='RECHAZADO')
        count = rechazados.count()
        
        self.stdout.write(f"📊 Encontrados: {count} gastos con estado RECHAZADO")
        
        if count == 0:
            self.stdout.write(self.style.SUCCESS("✅ No hay gastos para actualizar"))
            return
        
        # Mostrar ejemplos
        self.stdout.write("\n📋 Ejemplos de gastos a actualizar:")
        for gasto in rechazados[:5]:
            self.stdout.write(f"  - ID: {gasto.id_gasto}, Monto: ${gasto.monto:,.0f}, Estado: {gasto.estado}")
        
        self.stdout.write(f"\n⚠️  Se actualizarán {count} gastos de RECHAZADO → PAGADO")
        
        # Actualizar
        updated = rechazados.update(estado='PAGADO')
        
        self.stdout.write(self.style.SUCCESS(f"\n✅ Actualización completada: {updated} gastos actualizados a PAGADO"))
        
        # Verificar
        verificacion = Gasto.objects.filter(estado='RECHAZADO').count()
        self.stdout.write(f"🔍 Verificación: {verificacion} gastos con estado RECHAZADO (debería ser 0)")
        
        pagados = Gasto.objects.filter(estado='PAGADO').count()
        self.stdout.write(self.style.SUCCESS(f"✅ Total gastos PAGADO: {pagados}"))
