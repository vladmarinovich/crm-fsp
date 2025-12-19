#!/usr/bin/env python
"""
Script para actualizar gastos de RECHAZADO a PAGADO
Ejecutar desde la raíz del proyecto: python update_gastos.py
"""

if __name__ == '__main__':
    import os
    import sys
    import django
    
    # Configurar Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    
    # Agregar backend al path
    backend_path = os.path.join(os.path.dirname(__file__), 'backend')
    sys.path.insert(0, backend_path)
    
    # Setup Django
    django.setup()
    
    # Importar modelo
    from apps.finanzas.models import Gasto
    
    print("🔍 Buscando gastos con estado RECHAZADO...")
    
    # Buscar gastos rechazados
    rechazados = Gasto.objects.filter(estado='RECHAZADO')
    count = rechazados.count()
    
    print(f"📊 Encontrados: {count} gastos con estado RECHAZADO")
    
    if count == 0:
        print("✅ No hay gastos para actualizar")
        sys.exit(0)
    
    # Mostrar ejemplos
    print("\n📋 Ejemplos de gastos a actualizar:")
    for gasto in rechazados[:5]:
        print(f"  - ID: {gasto.id_gasto}, Monto: ${gasto.monto:,.0f}, Estado: {gasto.estado}")
    
    print(f"\n⚠️  Se actualizarán {count} gastos de RECHAZADO → PAGADO")
    
    # Actualizar
    updated = rechazados.update(estado='PAGADO')
    
    print(f"\n✅ Actualización completada: {updated} gastos actualizados a PAGADO")
    
    # Verificar
    verificacion = Gasto.objects.filter(estado='RECHAZADO').count()
    print(f"🔍 Verificación: {verificacion} gastos con estado RECHAZADO (debería ser 0)")
    
    pagados = Gasto.objects.filter(estado='PAGADO').count()
    print(f"✅ Total gastos PAGADO: {pagados}")
    
    print("\n🎯 RECORDATORIO: Volver a agregar .env al .gitignore")
