import pandas as pd
import random
from datetime import datetime, timedelta

# ============================
# CONFIGURACIONES
# ============================

N = 270  # Cantidad de casos a generar

ESTADOS = ["activo", "en tratamiento", "adoptado", "fallecido", "cerrado"]

VETERINARIAS = [
    "Garras y Patas",
    "Huella Animal",
    "Clínica Vet Plus",
    "Veterinaria Mi Mascota",
    "Centro Vet Salvando Patitas"
]

DIAGNOSTICOS = [
    "Parvovirus", "Moquillo", "Fractura de miembro posterior",
    "Desnutrición severa", "Dermatitis alérgica", "Enfermedad respiratoria",
    "Control post operatorio", "Intoxicación", "Heridas múltiples"
]

HOGARES_IDS = [1, 2, 3, 4]

# ============================
# 100 NOMBRES + 100 APELLIDOS
# ============================

NOMBRES_MASCOTAS = [
    "Firalu", "Michingo", "Pulgoso", "Pelusa", "Tigrillo", "Manchas", "Sombra", "Nucita",
    "Tizón", "Pompi", "Chispa", "Rufino", "Copito", "Ragnar", "Canelo", "Tobías",
    "Pulgarcito", "Trueno", "Cholo", "Galleta", "Gizmo", "Bongo", "Frodo", "Yako",
    "Nimbo", "Tango", "Cachorro", "Boby", "Floky", "Samy", "Kira", "Misha",
    "Lumi", "Nala", "Runa", "Bimba", "Kalú", "Odin", "Kronos", "Mamba",
    "Milo", "Kiwi", "Panda", "Golfo", "Cholo", "Pistacho", "Galletín", "Mapache",
    "Fideo", "Tacho", "Lolo", "Tito", "Mimi", "Tina", "Tuna", "Mansa",
    "Brisa", "Rayo", "Nimbo", "Trompita", "Atenea", "Duna", "Rocco", "Bali",
    "Kongo", "Bora", "Musa", "Vico", "Kiko", "Baco", "Coco", "Nico",
    "Kuki", "Rocco", "Lupo", "Roma", "Lía", "Lana", "Pipo", "Kero",
    "Tono", "Vito", "Gigi", "Rufián", "Taco", "Pachi", "Nori", "Mora",
    "Yumi", "Floki", "Psiqui", "Taru", "Mambo", "Polo", "Nano", "Kiwi",
    "Bongo", "Rubi", "Maxi", "Pepa"
]

APELLIDOS_MASCOTAS = [
    "Pancracio", "Paolo", "Mancuso", "Ventisca", "Montoya", "Del Monte", "Serenatti",
    "Cortázar", "De Luna", "Forelli", "Toscano", "Márquez", "Del Bosque", "Verano",
    "Riaño", "Camposanto", "Cardona", "Rosales", "Vallejo", "Santini", "Trianero",
    "Noriega", "Benavides", "Calderón", "Valverde", "Tristán", "Altamirano",
    "Montero", "Casasola", "Zambrano", "Del Solar", "Valenciano", "Monteverde",
    "Resplandor", "Del Mar", "Venturi", "Ferrari", "Galetto", "Perugini", "Dalmasso",
    "Cremona", "Rondón", "Lozano", "Morenatti", "Cervetto", "Barceló", "Casiraghi",
    "Alvarenga", "Durango", "Peñalosa", "Cortés", "Arango", "Sebastiani", "Rivieri",
    "Cervantes", "Vidal", "Herrera", "Quirós", "Santoro", "Morales", "Estrada",
    "Mendoza", "Gómez", "Ramella", "Perdomo", "Cuadrado", "Revueltas", "Arias",
    "Castelli", "Lucchetti", "Serrano", "Velázquez", "Páez", "Ordoñez", "Ramos",
    "Llanos", "Coronado", "Arismendi", "Villalobos", "Marengo", "Betancur",
    "Correa", "Fajardo", "Almeida", "Panicci", "Fontana", "Del Castillo",
    "Medina", "Pachelli", "Contreras", "Rosetti", "Blessi", "Armenteros",
    "Fratini", "Del Toro", "Mancini", "Fiorini"
]

# ============================
# FUNCIONES
# ============================

def generar_nombre_mascota():
    return random.choice(NOMBRES_MASCOTAS) + " " + random.choice(APELLIDOS_MASCOTAS)

def fecha_ingreso_aleatoria():
    start = datetime(2023, 1, 1)
    end = datetime.now()
    delta = end - start
    return start + timedelta(seconds=random.randint(0, int(delta.total_seconds())))

def fecha_salida_aleatoria(fecha_ing, estado):
    if estado in ["adoptado", "fallecido", "cerrado"]:
        dias = random.randint(1, 90)
        return (fecha_ing + timedelta(days=dias)).date().isoformat()
    return ""

def presupuesto_estimado():
    return random.randint(50_000, 2_000_000)

def generar_caso():
    estado = random.choice(ESTADOS)
    fecha_ing = fecha_ingreso_aleatoria()

    return {
        "nombre_caso": generar_nombre_mascota(),
        "estado": estado,
        "fecha_ingreso": fecha_ing.date().isoformat(),
        "fecha_salida": fecha_salida_aleatoria(fecha_ing, estado),
        "veterinaria": random.choice(VETERINARIAS),
        "diagnostico": random.choice(DIAGNOSTICOS),
        "archivo": "",
        "id_hogar_de_paso": random.choice(HOGARES_IDS + [""]),   # nunca float
        "presupuesto_estimado": presupuesto_estimado()
    }

# ============================
# GENERACIÓN DE CSV
# ============================

df = pd.DataFrame([generar_caso() for _ in range(N)])

df.to_csv("casos_270.csv", index=False, encoding="utf-8")

print("✅ LISTO: casos_270.csv generado correctamente con nombres únicos de mascotas.")