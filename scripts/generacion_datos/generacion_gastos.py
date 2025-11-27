import random
import datetime
import uuid
import csv

# Cantidad de registros a generar
N = 5000


# Medios de pago disponibles
medios_pago = [
    "PSW",
    "tarjeta_credito",
    "tarjeta_debito",
    "nequi",
    "transferencia_bancaria",
    "efectivo"
]

# Categorías REALISTAS de gastos
categorias_gasto = [
    "Alimento",
    "Veterinaria",
    "Medicina",
    "Transporte",
    "Aseo",
    "Mantenimiento",
    "Equipamiento",
    "Servicios",
    "Otros"
]

# Estado del pago
estados = ["pagado", "pendiente", "rechazado"]

def random_date(start_year=2022, end_year=2025):
    """Genera una fecha aleatoria entre los años especificados."""
    start = datetime.date(start_year, 1, 1)
    end = datetime.date(end_year, 12, 31)
    delta = end - start
    random_days = random.randrange(delta.days)
    return start + datetime.timedelta(days=random_days)

# --- Generar registros ---
gastos = []

for i in range(N):
    gasto = {
        
        "nombre_gasto": random.choice(categorias_gasto),  # <-- Aquí la categoría real
        "fecha_pago": random_date(),
        "id_caso": random.randint(271, 540),  # FK permitido
        "medio_pago": random.choice(medios_pago),
        "monto": round(random.uniform(20000, 450000), 2),
        "estado": random.choice(estados),
        "comprobante": f"https://comprobantes.fake/{uuid.uuid4()}.pdf",
        "id_proveedor": random.randint(1, 60)  # FK permitido
    }
    gastos.append(gasto)

# --- Exportar a CSV ---
with open("gastos_simulados.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=gastos[0].keys())
    writer.writeheader()
    writer.writerows(gastos)

print("Archivo CSV generado: gastos_simulados.csv")