[![SQL](https://img.shields.io/badge/MySQL-8.0+-f29221?style=for-the-badge&logo=mysql&logoColor=white&labelColor=101010)](https://mysql.com)

# Análisis de Datos Airbnb | Menorca 2022


El mercado de alquiler vacacional ha transformado la industria turística.  
Airbnb no solo refleja oferta y demanda, sino también patrones de precios, disponibilidad y concentración de anfitriones.

En este proyecto analizo datos reales de Airbnb en Menorca (2022) utilizando SQL para entender:

- Tendencias de precios
- Distribución por zonas
- Actividad de anfitriones
- Tipología de alojamientos
- Disponibilidad anual
- Relación entre reseñas y precio


## 🎯 Preguntas de negocio

Este análisis responde a cuestiones como:

- ¿Qué zonas concentran mayor número de alojamientos?
- ¿Qué tipo de habitación es más frecuente?
- ¿Existen anfitriones con alta concentración de propiedades?
- ¿Cómo varía el precio según tipo de alojamiento?
- ¿Influye el número de reseñas en el precio?
- ¿Qué nivel de disponibilidad tienen los alojamientos?
- ¿Se observan patrones en la estancia mínima requerida?


## Dataset utilizado

Tabla: `airbnb_menorca`

Variables analizadas:

- host_id
- neighbourhood
- room_type
- price
- minimum_nights
- number_of_reviews
- calculated_host_listings_count
- availability_365
- number_of_reviews_ltm


# Estructura del análisis

El proyecto está dividido en 5 bloques analíticos:


## 1️⃣ Distribución General

- Top 10 alojamientos con más reseñas  
- Número de alojamientos por barrio  
- Top 10 anfitriones con más propiedades  

**Objetivo:** Identificar concentración de oferta y actividad.


## 2️⃣ Segmentación por Ubicación

- Número de propiedades por barrio  
- Precio medio por barrio  
- Precio medio por tipo de habitación y barrio  

**Objetivo:** Analizar diferencias geográficas.


## 3️⃣ Análisis por Tipo de Alojamiento

- Número de alojamientos por tipo  
- Disponibilidad media por tipo  
- Precio medio por tipo  

**Objetivo:** Entender comportamiento por categoría de producto.


## 4️⃣ Análisis Temporal y Disponibilidad

- Disponibilidad media anual  
- Máximo y mínimo de disponibilidad  
- Disponibilidad media por barrio  

**Objetivo:** Evaluar nivel de ocupación potencial.


## 5️⃣ Factores de Precio y Demanda

- Precio medio según estancia mínima  
- Precio medio según rango de reseñas  
- Reseñas anuales por barrio  

**Objetivo:** Detectar patrones entre precio, demanda y requisitos de reserva.


## Posibles mejoras futuras

- Integración con Power BI para visualización
- Comparativa por año
- Análisis de estacionalidad
- Segmentación por tipo de anfitrión
- Modelo simple de predicción de precio




Este proyecto forma parte de mi portfolio práctico orientado al análisis estructurado y toma de decisiones basada en datos.
