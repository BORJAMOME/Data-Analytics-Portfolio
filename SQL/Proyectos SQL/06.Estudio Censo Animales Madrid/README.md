[![SQL](https://img.shields.io/badge/MySQL-8.0+-f29221?style=for-the-badge&logo=mysql&logoColor=white&labelColor=101010)](https://mysql.com)

# Análisis del Censo de Perros y Gatos en Madrid (SQL)

Este repositorio contiene consultas SQL utilizadas para analizar el censo de perros y gatos en la ciudad de Madrid. Los datos utilizados para este análisis provienen del portal de datos abiertos de la ciudad de Madrid y abarcan el período entre los años 2014 y 2023.

## Funcionalidades Principales:
- Total de perros y gatos censados.
- Distribución por distrito y por fecha.
- Evolución anual de la población animal.
- Análisis de crecimiento y diferencias entre distritos.

## Estructura de la Base de Datos

La base de datos utilizada para este análisis se llama `censo_animal` y contiene una tabla llamada `censo_animales`. La estructura de la tabla es la siguiente:

- `fecha`: Año del censo.
- `distrito`: Distrito de Madrid.
- `perros`: Número de perros censados.
- `gatos`: Número de gatos censados.

## Consultas Realizadas

A continuación se detallan las consultas SQL realizadas para el análisis del censo de perros y gatos:

- **Total de perros y gatos censados en todos los distritos**

```sql
SELECT SUM(perros) AS total_perros, SUM(gatos) AS total_gatos
FROM censo_animales;
```
<img width="256" alt="Screenshot 2024-05-17 at 15 39 56" src="https://github.com/BORJAMOME/censo_animales_madrid/assets/19588053/2e19b444-da55-4fca-83c2-ea7d82b26bde">


- **Total de perros y gatos censados por distrito**
```sql
SELECT distrito, SUM(perros) AS total_perros, SUM(gatos) AS total_gatos
FROM censo_animales
GROUP BY distrito
ORDER BY distrito;
```
<img width="346" alt="Screenshot 2024-05-17 at 15 40 29" src="https://github.com/BORJAMOME/censo_animales_madrid/assets/19588053/dbbea7ae-4a54-4d60-a4fe-46a9c5739e16">


- **Total de perros y gatos censados por fecha**
```sql
SELECT fecha, SUM(perros) AS total_perros, SUM(gatos) AS total_gatos
FROM censo_animales
GROUP BY fecha
ORDER BY fecha;
```
<img width="319" alt="Screenshot 2024-05-17 at 15 42 27" src="https://github.com/BORJAMOME/censo_animales_madrid/assets/19588053/e8548389-f489-4abf-aad6-3ed9b76e30be">


- **Promedio de perros y gatos censados por distrito**
```sql
SELECT distrito, AVG(perros) AS promedio_perros, AVG(gatos) AS promedio_gatos
FROM censo_animales
GROUP BY distrito
ORDER BY distrito;
```
<img width="413" alt="Screenshot 2024-05-17 at 15 44 10" src="https://github.com/BORJAMOME/censo_animales_madrid/assets/19588053/b1f02446-5065-4698-86a6-9df7dab38c70">


- **Evolución del número de perros censados a lo largo del tiempo**
```sql
SELECT fecha, SUM(perros) AS total_perros
FROM censo_animales
GROUP BY fecha
ORDER BY fecha;
```
<img width="296" alt="Screenshot 2024-05-17 at 15 45 18" src="https://github.com/BORJAMOME/censo_animales_madrid/assets/19588053/def5a0bb-115a-4696-9e1e-d5e84fdf87f1">


- **Evolución del número de gatos censados a lo largo del tiempo**
```sql
SELECT fecha, SUM(gatos) AS total_gatos
FROM censo_animales
GROUP BY fecha
ORDER BY fecha;
```
<img width="266" alt="Screenshot 2024-05-17 at 15 46 18" src="https://github.com/BORJAMOME/censo_animales_madrid/assets/19588053/28b2d7ec-aef0-4999-80e1-01ac56e0614d">


- **Evolución del número de gatos censados a lo largo del tiempo**
```sql
SELECT fecha AS año, SUM(gatos) AS total_gatos
FROM censo_animales
GROUP BY fecha
ORDER BY total_gatos DESC
LIMIT 1;
```
<img width="320" alt="Screenshot 2024-05-17 at 15 46 59" src="https://github.com/BORJAMOME/censo_animales_madrid/assets/19588053/83a7ce51-8aaa-40fc-bab0-6ac434d659aa">


- **Tasa de crecimiento anual del número de perros y gatos**
```sql
SELECT 
    fecha AS año, 
    (SUM(perros) - LAG(SUM(perros)) OVER (ORDER BY fecha)) / LAG(SUM(perros)) OVER (ORDER BY fecha) * 100 AS tasa_crecimiento_perros,
    (SUM(gatos) - LAG(SUM(gatos)) OVER (ORDER BY fecha)) / LAG(SUM(gatos)) OVER (ORDER BY fecha) * 100 AS tasa_crecimiento_gatos
FROM censo_animales
GROUP BY fecha
ORDER BY fecha;
```
<img width="385" alt="Screenshot 2024-05-17 at 15 48 55" src="https://github.com/BORJAMOME/censo_animales_madrid/assets/19588053/23c4e67c-7828-4ecf-a6a4-9eb0b8169809">


- **Distribución porcentual de perros y gatos por distrito en un año específico**
```sql
SELECT distrito, 
    SUM(perros) * 100.0 / (SELECT SUM(perros) FROM censo_animales WHERE fecha = '2023') AS porcentaje_perros,
    SUM(gatos) * 100.0 / (SELECT SUM(gatos) FROM censo_animales WHERE fecha = '2023') AS porcentaje_gatos
FROM censo_animales
WHERE fecha = '2023'
GROUP BY distrito;
```
<img width="391" alt="Screenshot 2024-05-17 at 15 50 10" src="https://github.com/BORJAMOME/censo_animales_madrid/assets/19588053/04507843-1c64-4a4a-b6ca-1a754b0fa51e">


- **Porcentaje de crecimiento de perros y gatos por distrito entre 2014 y 2023**
```sql
SELECT 
    distrito, 
    SUM(CASE WHEN fecha = '2014' THEN perros ELSE 0 END) AS perros_2014,
    SUM(CASE WHEN fecha = '2023' THEN perros ELSE 0 END) AS perros_2023,
    ((SUM(CASE WHEN fecha = '2023' THEN perros ELSE 0 END) - SUM(CASE WHEN fecha = '2014' THEN perros ELSE 0 END)) / SUM(CASE WHEN fecha = '2014' THEN perros ELSE 0 END)) * 100 AS porcentaje_crecimiento_perros,
    SUM(CASE WHEN fecha = '2014' THEN gatos ELSE 0 END) AS gatos_2014,
    SUM(CASE WHEN fecha = '2023' THEN gatos ELSE 0 END) AS gatos_2023,
    ((SUM(CASE WHEN fecha = '2023' THEN gatos ELSE 0 END) - SUM(CASE WHEN fecha = '2014' THEN gatos ELSE 0 END)) / SUM(CASE WHEN fecha = '2014' THEN gatos ELSE 0 END)) * 100 AS porcentaje_crecimiento_gatos
FROM censo_animales
WHERE fecha IN ('2014', '2023')
GROUP BY distrito
ORDER BY distrito;
```
<img width="721" alt="Screenshot 2024-05-17 at 15 51 48" src="https://github.com/BORJAMOME/censo_animales_madrid/assets/19588053/b7f98547-bbaa-462d-8194-d5b9847e96df">


- **Distritos con la mayor diferencia entre el número de perros y gatos en un año específico**

```sql
SELECT
    fecha,
    distrito,
    ABS(SUM(perros) - SUM(gatos)) AS diferencia_perros_gatos
FROM
    censo_animales
WHERE
    fecha = '2023'
GROUP BY
    fecha, distrito
ORDER BY
    diferencia_perros_gatos DESC
LIMIT 10;
```
<img width="383" alt="Screenshot 2024-05-17 at 15 53 06" src="https://github.com/BORJAMOME/censo_animales_madrid/assets/19588053/6aac4ae0-c727-449e-9b63-33e691f27b9f">


- **Total de perros y gatos en un año específico según la zona(Norte, Sur, Este, Oeste y Centro) del distrito en Madrid**
```sql
SELECT
    fecha,
    CASE 
        WHEN distrito IN ('Fuencarral-El Pardo', 'Hortaleza') THEN 'Zona Norte'
        WHEN distrito IN ('Carabanchel', 'Moratalaz', 'Puente De Vallecas', 'Usera', 'Villaverde', 'Villa De Vallecas') THEN 'Zona Sur'
        WHEN distrito IN ('Ciudad Lineal', 'Barajas', 'San Blas-Canillejas','Vicalvaro') THEN 'Zona Este'
        WHEN distrito IN ('Latina', 'Moncloa-Aravaca') THEN 'Zona Oeste'
        WHEN distrito IN ('Chamberi','Tetuan','Chamartin','Salamanca','Centro', 'Retiro','Arganzuela') THEN 'Zona Centro'
        ELSE 'Otra Zona'
    END AS zona,
    SUM(perros) AS total_perros,
    SUM(gatos) AS total_gatos
FROM
    censo_animales
WHERE
    fecha = '2023'
GROUP BY
    fecha, zona
ORDER BY
    fecha, zona;
```
<img width="338" alt="Screenshot 2024-05-17 at 15 56 36" src="https://github.com/BORJAMOME/censo_animales_madrid/assets/19588053/a5d173a0-1e98-437f-ac40-e8127cb6a520">
