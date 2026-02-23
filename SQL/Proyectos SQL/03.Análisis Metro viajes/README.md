[![SQL](https://img.shields.io/badge/MySQL-8.0+-f29221?style=for-the-badge&logo=mysql&logoColor=white&labelColor=101010)](https://mysql.com)

# Análisis de Pasajeros del Metro de Madrid

El transporte público es un indicador directo del comportamiento urbano, la movilidad ciudadana y la planificación de infraestructuras.

Analizar los datos de pasajeros del Metro de Madrid permite:

- Detectar líneas con mayor demanda
- Identificar estacionalidad mensual
- Comprender la distribución porcentual del uso
- Detectar picos y mínimos de tráfico
- Analizar patrones globales de movilidad

Este proyecto transforma datos básicos en información estructurada mediante SQL, aplicando un enfoque analítico orientado a negocio.

## Preguntas que responde este análisis

- ¿Qué línea transporta más pasajeros al año?
- ¿Cómo se distribuye la demanda mes a mes?
- ¿Qué línea tiene mayor carga promedio?
- ¿Cuál es el mes más fuerte y más débil por línea?
- ¿Qué porcentaje representa cada línea sobre el total anual?
- ¿Cuál es el mes con mayor tráfico en toda la red?
- ¿Cuál es el mes con menor tráfico global?

## Tecnologías y habilidades aplicadas

- MySQL 8.0+
- GROUP BY y agregaciones
- SUM() y AVG()
- Subconsultas
- ORDER BY y LIMIT
- Cálculo de porcentajes
- Organización estructurada del análisis

## Dataset utilizado

Base de datos: `metro`  
Tabla: `metro_madrid`

### Estructura

| Campo   | Tipo     | Descripción |
|----------|----------|-------------|
| Linea    | INTEGER  | Número de línea del metro |
| Mes      | TEXT     | Mes del año |
| Valores  | INTEGER  | Número de pasajeros |


### Creación de la Base de Datos y Tabla

```sql
CREATE DATABASE metro;

USE metro;

CREATE TABLE metro_madrid (
    Linea INTEGER,
    Mes TEXT,
    Valores INTEGER
);
```

### Estructura del Análisis

Las consultas están organizadas en 3 bloques analíticos:

- 1️⃣ Análisis por Línea
- 2️⃣ Análisis Mensual
- 3️⃣ Análisis Global



## 1️⃣ Análisis por Línea

### Total de Pasajeros por Línea Durante Todo el Año

```sql
SELECT Linea, SUM(Valores) AS Total_Pasajeros
FROM metro_madrid
GROUP BY Linea
ORDER BY Total_Pasajeros DESC;
```


### Promedio de Pasajeros por Línea Durante el Año

```sql
SELECT Linea, AVG(Valores) AS Promedio_Pasajeros
FROM metro_madrid
GROUP BY Linea
ORDER BY Promedio_Pasajeros DESC;
```


### Porcentaje de Pasajeros por Línea Respecto al Total Anual

```sql
SELECT Linea, 
       SUM(Valores) AS Total_Pasajeros, 
       (SUM(Valores) * 100.0 / (SELECT SUM(Valores) FROM metro_madrid)) AS Porcentaje_Total
FROM metro_madrid
GROUP BY Linea
ORDER BY Porcentaje_Total DESC;
```


### Mes con Mayor Número de Pasajeros para Cada Línea

```sql
SELECT Linea, Mes, Valores
FROM metro_madrid
WHERE (Linea, Valores) IN (
    SELECT Linea, MAX(Valores)
    FROM metro_madrid
    GROUP BY Linea
);
```


### Mes con Menor Número de Pasajeros para Cada Línea

```sql
SELECT Linea, Mes, Valores
FROM metro_madrid
WHERE (Linea, Valores) IN (
    SELECT Linea, MIN(Valores)
    FROM metro_madrid
    GROUP BY Linea
);
```


## 2️⃣ Análisis Mensual

### Pasajeros Mensuales por Línea

```sql
SELECT Linea, Mes, SUM(Valores) AS Total_Pasajeros
FROM metro_madrid
GROUP BY Linea, Mes
ORDER BY Linea, Mes;
```



## 3️⃣ Análisis Global de la Red

### Mes con Mayor Número de Pasajeros Global

```sql
SELECT Mes, SUM(Valores) AS Total_Pasajeros
FROM metro_madrid
GROUP BY Mes
ORDER BY Total_Pasajeros DESC
LIMIT 1;
```

### Mes con Menor Número de Pasajeros Global

```sql
SELECT Mes, SUM(Valores) AS Total_Pasajeros
FROM metro_madrid
GROUP BY Mes
ORDER BY Total_Pasajeros ASC
LIMIT 1;
```


### Posibles Mejoras Futuras

- Visualización en Power BI  
- Análisis de crecimiento mensual  
- Comparativa interanual  
- Ranking dinámico por línea  
- Incorporación de variables externas (eventos, turismo, festivos)  


Proyecto incluido dentro de mi portfolio de análisis de datos con SQL.
















