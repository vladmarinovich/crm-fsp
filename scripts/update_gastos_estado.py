#!/usr/bin/env python
"""
Script para actualizar gastos con estado RECHAZADO a PAGADO
"""
import os
import sys
import django

# Setup Django
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_path = os.path.join(project_root, 'backend')
sys.path.insert(0, backend_path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from apps.gastos.models import Gasto

def main():
    print("🔍 Buscando gastos con estado RECHAZADO...")
    
    # Buscar gastos rechazados
    rechazados = Gasto.objects.filter(estado='RECHAZADO')
    count = rechazados.count()
    
    print(f"📊 Encontrados: {count} gastos con estado RECHAZADO")
    
    if count == 0:
        print("✅ No hay gastos para actualizar")
        return
    
    # Mostrar ejemplos
    print("\n📋 Ejemplos de gastos a actualizar:")
    for gasto in rechazados[:5]:
        print(f"  - ID: {gasto.id_gasto}, Monto: ${gasto.monto:,.0f}, Estado: {gasto.estado}")
    
    # Confirmar
    print(f"\n⚠️  Se actualizarán {count} gastos de RECHAZADO → PAGADO")
    
    # Actualizar
    updated = rechazados.update(estado='PAGADO')
    
    print(f"\n✅ Actualización completada: {updated} gastos actualizados a PAGADO")
    
    # Verificar
    verificacion = Gasto.objects.filter(estado='RECHAZADO').count()
    print(f"🔍 Verificación: {verificacion} gastos con estado RECHAZADO (debería ser 0)")
    
    pagados = Gasto.objects.filter(estado='PAGADO').count()
    print(f"✅ Total gastos PAGADO: {pagados}")

if __name__ == '__main__':
    main()
