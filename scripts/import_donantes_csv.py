import os
import django
import pandas as pd
from datetime import datetime

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.apps.donaciones.models import Donante

def import_donantes():
    csv_file = 'donantes_10000.csv'
    if not os.path.exists(csv_file):
        print(f"❌ No se encontró el archivo {csv_file}")
        return

    print(f"📖 Leyendo {csv_file}...")
    df = pd.read_csv(csv_file)
    
    print(f"🚀 Iniciando importación de {len(df)} registros...")
    
    donantes_batch = []
    batch_size = 1000
    
    for index, row in df.iterrows():
        # Convertir fecha string a objeto datetime aware o naive según config
        # El formato en el script era "%Y-%m-%d %H:%M:%S"
        try:
            fecha = datetime.strptime(row['fecha_creacion'], "%Y-%m-%d %H:%M:%S")
        except:
            fecha = datetime.now()

        donante = Donante(
            # id_donante=row['id_donante'], # Dejamos que la DB maneje el ID autoincremental para evitar conflictos
            donante=row['donante'],
            tipo_id=row['tipo_id'],
            identificacion=str(row['identificacion']),
            fecha_creacion=fecha,
            correo=row['correo'],
            telefono=row['telefono'],
            ciudad=row['ciudad'],
            tipo_donante=row['tipo_donante'],
            pais=row['pais'],
            canal_origen=row['canal_origen'],
            consentimiento=bool(row['consentimiento']),
            notas=row['notas'] if pd.notna(row['notas']) else "",
        )
        donantes_batch.append(donante)
        
        if len(donantes_batch) >= batch_size:
            Donante.objects.bulk_create(donantes_batch)
            print(f"✅ Lote de {batch_size} insertado (Progreso: {index + 1}/{len(df)})")
            donantes_batch = []

    if donantes_batch:
        Donante.objects.bulk_create(donantes_batch)
        print(f"✅ Último lote insertado.")

    print("🎉 Importación completada exitosamente.")

if __name__ == "__main__":
    import_donantes()
