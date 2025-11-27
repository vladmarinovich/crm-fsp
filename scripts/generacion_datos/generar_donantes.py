import pandas as pd
import random
from faker import Faker
from datetime import datetime

# Faker en español (es_ES es el más estable)
fake = Faker("es_ES")

# Cantidad de donantes
N = 15000

# Distribuciones
TIPOS_ID = ["CC", "CE", "PAS"]
TIPOS_DONANTE = ["mensual", "ocasional", "empresarial"]
CANALES = ["Instagram", "Facebook", "Tiktok", "Recomendado", "Evento", "Página Web"]
PAISES = ["Colombia", "Venezuela", "Perú", "Ecuador", "Chile", "México"]

# Función para crear fechas aleatorias
def fecha_aleatoria():
    start = datetime(2023, 1, 1)
    end = datetime.now()
    delta = end - start
    return start + random.random() * delta

# Teléfonos colombianos realistas
def telefono_colombia():
    return "3" + "".join(str(random.randint(0, 9)) for _ in range(9))

# Generador por cada donante
def generar_donante(i):
    return {
        "donante": fake.name(),
        "tipo_id": random.choice(TIPOS_ID),
        "identificacion": str(fake.random_number(9)),
        "fecha_creacion": fecha_aleatoria().strftime("%Y-%m-%d %H:%M:%S"),
        "correo": fake.unique.email(),
        "telefono": telefono_colombia(),
        "ciudad": fake.city(),
        "tipo_donante": random.choices(TIPOS_DONANTE, weights=[60, 35, 5], k=1)[0],
        "pais": random.choices(PAISES, weights=[75, 10, 5, 4, 3, 3], k=1)[0],
        "canal_origen": random.choice(CANALES),
        "consentimiento": random.choices([True, False], weights=[90, 10], k=1)[0],
        "notas": "",
        "archivos": ""
    }

# Generar los registros
donantes = [generar_donante(i) for i in range(1, N + 1)]

# Crear DataFrame
df = pd.DataFrame(donantes)

# Exportar a CSV
df.to_csv("donantes_10000.csv", index=False)

print("✅ LISTO: Se generó donantes_10000.csv con 10.000 registros.")