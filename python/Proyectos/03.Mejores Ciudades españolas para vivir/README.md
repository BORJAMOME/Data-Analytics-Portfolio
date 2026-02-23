# Análisis de Calidad de Vida Urbana y Conectividad en Ciudades Españolas


Este proyecto analiza municipios españoles de más de 75.000 habitantes con el objetivo de entender:

- ¿Influye la conectividad en el precio de la vivienda?
- ¿La proximidad a grandes núcleos urbanos encarece los municipios?
- ¿Qué ciudades presentan mejor equilibrio entre clima, calidad ambiental y coste inmobiliario?
- ¿Existen municipios infravalorados en términos de calidad-precio?

El análisis combina variables de conectividad, mercado inmobiliario, clima y calidad del aire para extraer insights estratégicos.



## Dataset

El dataset incluye municipios españoles de más de 75.000 habitantes e integra información procedente de múltiples fuentes oficiales y abiertas.

### Identificación y Demografía
- Nombre del municipio  
- Provincia  
- Comunidad Autónoma  
- Población (INE, 2022)

### Movilidad y Conectividad
- Kilómetros de carril bici por cada 100.000 habitantes (El País, La Sexta, ayuntamientos)
- Distancia a Madrid en km (Google Maps)
- Tiempo medio de viaje en coche a Madrid (Google Maps)
- Tiempo medio de viaje en tren o autobús a Madrid (Google Maps)
- Distancia a Barcelona en km (Google Maps)
- Tiempo medio de viaje en coche a Barcelona (Google Maps)
- Tiempo medio de viaje en tren o autobús a Barcelona (Google Maps)
- Aeropuerto internacional más cercano (AENA, Google Maps)
- Número de conexiones del aeropuerto internacional más cercano (AENA)
- Distancia en km al aeropuerto internacional más cercano (Google Maps)

### Mercado Inmobiliario
- Precio de alquiler por metro cuadrado (Idealista, marzo 2023)
- Precio medio de venta por metro cuadrado (Idealista, marzo 2023)

### Turismo y Patrimonio
- Número de visitantes internacionales anuales (pendiente de completar)
- Patrimonio de la Humanidad (Wikipedia)

### Medioambiente y Clima
- Porcentaje de días con calidad de aire:
  - Buena
  - Razonablemente Buena
  - Regular
  - Desfavorable
  - Muy Desfavorable
  - Extremadamente Desfavorable  
  (Ministerio para la Transición Ecológica y Reto Demográfico)

- Ponderación calidad del aire (cálculo propio a partir de los seis indicadores anteriores)
- Temperatura máxima media (Weatherspark)
- Temperatura mínima media (Weatherspark)
- Horas de sol medias anuales (AEMET)

---

## Tecnologías Utilizadas

- Python
- Pandas
- NumPy
- Matplotlib
- Seaborn
- Google Colab

---

## Metodología

1. Limpieza y transformación de datos (valores nulos, formatos inconsistentes, conversión numérica).
2. Construcción de un índice exploratorio de calidad de vida.
3. Análisis de correlaciones entre conectividad, proximidad urbana y precio de vivienda.
4. Visualización de relaciones clave.
5. Identificación de municipios con alto valor relativo.


## Principales Insights

- La conectividad aérea muestra relación con el precio de vivienda, pero no lo explica completamente.
- La proximidad a Madrid y Barcelona es uno de los factores más influyentes en el coste inmobiliario.
- Existen municipios con buena calidad ambiental y precios relativamente accesibles.
- La calidad de vida urbana depende del equilibrio entre múltiples factores, no exclusivamente de infraestructura.




Borja — Data Analyst  
