[![SQL](https://img.shields.io/badge/MySQL-8.0+-f29221?style=for-the-badge&logo=mysql&logoColor=white&labelColor=101010)](https://mysql.com)

# Análisis de Accidentes de Tráfico | Madrid 2023 

Los accidentes de tráfico no son solo cifras.  
Reflejan patrones de comportamiento, riesgo, condiciones urbanas y posibles áreas de mejora en seguridad vial.

En este proyecto analizo datos reales de accidentes ocurridos en Madrid durante 2023 utilizando SQL, con el objetivo de transformar datos en información estructurada y útil.

## Preguntas de negocio que respondo

Este análisis permite responder a cuestiones como:

- ¿Qué distritos concentran mayor número de accidentes?
- ¿Existen franjas horarias con mayor riesgo?
- ¿Influye el estado meteorológico en la frecuencia de accidentes?
- ¿Qué tipos de vehículos están más implicados?
- ¿Existe relación entre accidentes y consumo de alcohol?
- ¿Qué perfiles demográficos aparecen con mayor frecuencia?
- ¿Dónde se concentran los accidentes más graves?

## Tecnologías y habilidades aplicadas

- MySQL 8.0+
- GROUP BY y agregaciones
- Subconsultas
- CASE para segmentación
- Funciones de ventana
- Transformación de fechas y horas
- Cálculo de porcentajes
- Lógica condicional


## Dataset utilizado

Tabla: `accidentes_madrid`

Variables analizadas:

- Distrito
- Tipo de accidente
- Estado meteorológico
- Tipo de vehículo
- Rango de edad
- Sexo
- Tipo de persona implicada
- Nivel de lesividad
- Resultado de alcoholemia y drogas
- Fecha y hora

## Estructura del análisis

Las 25 consultas SQL están organizadas en 6 bloques analíticos:


### 1️⃣ Análisis Geográfico

- Total de accidentes por distrito  
- Porcentaje por distrito  
- Accidentes con fallecidos en 24h  
- Top 5 distritos con condiciones meteorológicas adversas  

**Objetivo:** Identificar zonas de mayor riesgo.

### 2️⃣ Tipo de Accidente y Meteorología

- Accidentes por tipo  
- Porcentaje por tipo  
- Accidentes por estado meteorológico  
- Porcentaje por estado meteorológico  

**Objetivo:** Detectar factores situacionales asociados a los accidentes.

### 3️⃣ Análisis por Tipo de Vehículo

- Accidentes por tipo de vehículo  
- Porcentaje por tipo de vehículo  
- Tipo de vehículo vs nivel de lesividad  

**Objetivo:** Entender qué vehículos aparecen con mayor frecuencia y gravedad.

### 4️⃣ Análisis Demográfico

- Accidentes por rango de edad  
- Porcentaje por rango de edad  
- Accidentes por sexo  
- Distribución por distrito y sexo  
- Accidentes por tipo de persona (conductor, pasajero, peatón)  
- Porcentaje por tipo de persona  

**Objetivo:** Identificar perfiles más afectados.

### 5️⃣ Análisis Temporal

- Accidentes por hora  
- Accidentes por periodo del día  
- Accidentes por fecha  
- Accidentes por estación del año  

**Objetivo:** Detectar patrones temporales y momentos de mayor exposición al riesgo.

### 6️⃣ Alcohol y Factores de Riesgo

- Positivos en alcohol y drogas por distrito  
- Accidentes con alcohol por rango de edad  
- Accidentes con alcohol por sexo  

**Objetivo:** Analizar posibles factores de comportamiento asociados al riesgo.


## Posibles mejoras futuras

- Integración con Power BI para visualización interactiva
- Comparativa con años anteriores
- Modelado de base de datos más optimizado
- Análisis de tendencias
- Construcción de un modelo simple de predicción de riesgo


Este proyecto forma parte de mi portfolio práctico enfocado en análisis estructurado y orientación a negocio.
