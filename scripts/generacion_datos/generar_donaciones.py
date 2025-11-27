import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# ---------------------------
# CONFIGURACIÓN DE LA SIMULACIÓN
# ---------------------------

n_registros = 15000  # cantidad de filas a generar

donante_min = 1
donante_max = 10000

caso_min = 271
caso_max = 540

fecha_inicio = datetime(2023, 1, 1)
fecha_fin = datetime(2025, 11, 27)

# ---------------------------
# FUNCIÓN PARA GENERAR FECHAS ALEATORIAS
# ---------------------------

def fecha_random(start, end):
    """Devuelve una fecha aleatoria entre start y end"""
    delta = end - start
    random_days = random.randint(0, delta.days)
    return start + timedelta(days=random_days)

# ---------------------------
# SIMULACIÓN DE LA TABLA
# ---------------------------

data = {
    
    "id_donante": np.random.randint(donante_min, donante_max + 1, n_registros),
    "id_caso": np.random.randint(caso_min, caso_max + 1, n_registros),
    "fecha_donacion": [fecha_random(fecha_inicio, fecha_fin) for _ in range(n_registros)],
    "monto": np.round(np.random.uniform(5, 500, n_registros), 2),

    "medio_pago": np.random.choice(
        ["Tarjeta", "PayPal", "Transferencia", "Efectivo"],
        size=n_registros,
        p=[0.50, 0.20, 0.25, 0.05]  # probabilidades realistas
    ),
    "estado": np.random.choice(
        ["Completada", "Pendiente", "Fallida"],
        size=n_registros,
        p=[0.85, 0.10, 0.05]
    )
}

df_simulado = pd.DataFrame(data)

# ---------------------------
# RESULTADO
# ---------------------------

print(df_simulado.head())
print("\nTotal de filas:", len(df_simulado))

# Si quieres guardarlo como CSV:
df_simulado.to_csv("donaciones_simuladas.csv", index=False)