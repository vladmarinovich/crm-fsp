import os
import django
import random
from faker import Faker
from datetime import datetime

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.apps.donaciones.models import Donante

fake = Faker("es_CO")

def populate_donantes(n=50):
    print(f"Generando {n} donantes...")
    
    tipos_id = [x[0] for x in Donante.TipoId.choices]
    tipos_donante = [x[0] for x in Donante.TipoDonante.choices]
    paises = ["Colombia", "Venezuela", "Perú", "Ecuador", "Chile", "México"]
    canales = ["Instagram", "Facebook", "Tiktok", "Recomendado", "Evento", "Página Web"]

    donantes_batch = []
    for _ in range(n):
        donante = Donante(
            donante=fake.name(),
            tipo_id=random.choice(tipos_id),
            identificacion=str(fake.random_number(digits=10)),
            correo=fake.unique.email(),
            telefono=fake.phone_number(),
            ciudad=fake.city(),
            tipo_donante=random.choice(tipos_donante),
            pais=random.choice(paises),
            canal_origen=random.choice(canales),
            consentimiento=random.choice([True, False]),
            notas=fake.text(max_nb_chars=50)
        )
        donantes_batch.append(donante)

    Donante.objects.bulk_create(donantes_batch)
    print(f"✅ {n} donantes insertados exitosamente.")

if __name__ == "__main__":
    populate_donantes(50)
