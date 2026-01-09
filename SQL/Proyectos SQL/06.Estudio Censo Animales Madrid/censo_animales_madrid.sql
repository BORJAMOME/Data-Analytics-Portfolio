-- Crear la base de datos
CREATE DATABASE censo_animal;

-- Usar la base de datos creada
USE censo_animal;

-- Total de perros y gatos censados en todos los distritos:
SELECT SUM(perros) AS total_perros, SUM(gatos) AS total_gatos
FROM censo_animales;

-- Total de perros y gatos censados por distrito:
SELECT distrito, SUM(perros) AS total_perros, SUM(gatos) AS total_gatos
FROM censo_animales
GROUP BY distrito
ORDER BY distrito;

-- Total de perros y gatos censados por fecha:
SELECT fecha, SUM(perros) AS total_perros, SUM(gatos) AS total_gatos
FROM censo_animales
GROUP BY fecha
ORDER BY fecha;

-- Promedio de perros y gatos censados por distrito:
SELECT distrito, AVG(perros) AS promedio_perros, AVG(gatos) AS promedio_gatos
FROM censo_animales
GROUP BY distrito
ORDER BY distrito;


-- Evolución del número de perros censados a lo largo del tiempo:
SELECT fecha, SUM(perros) AS total_perros
FROM censo_animales
GROUP BY fecha
ORDER BY fecha;


-- Evolución del número de gatos censados a lo largo del tiempo:
SELECT fecha, SUM(gatos) AS total_gatos
FROM censo_animales
GROUP BY fecha
ORDER BY fecha;

-- Año con el mayor número de perros censados:

SELECT fecha AS año, SUM(perros) AS total_perros
FROM censo_animales
GROUP BY fecha
ORDER BY total_perros DESC
LIMIT 1;

-- Año con el mayor número de gatos censados:
SELECT fecha AS año, SUM(gatos) AS total_gatos
FROM censo_animales
GROUP BY fecha
ORDER BY total_gatos DESC
LIMIT 1;

-- Tasa de crecimiento anual del número de perros y gatos:
SELECT 
    fecha AS año, 
    (SUM(perros) - LAG(SUM(perros)) OVER (ORDER BY fecha)) / LAG(SUM(perros)) OVER (ORDER BY fecha) * 100 AS tasa_crecimiento_perros,
    (SUM(gatos) - LAG(SUM(gatos)) OVER (ORDER BY fecha)) / LAG(SUM(gatos)) OVER (ORDER BY fecha) * 100 AS tasa_crecimiento_gatos
FROM censo_animales
GROUP BY fecha
ORDER BY fecha;

-- Distribución porcentual de perros y gatos por distrito en un año específico:
SELECT distrito, 
    SUM(perros) * 100.0 / (SELECT SUM(perros) FROM censo_animales WHERE fecha = '2023') AS porcentaje_perros,
    SUM(gatos) * 100.0 / (SELECT SUM(gatos) FROM censo_animales WHERE fecha = '2023') AS porcentaje_gatos
FROM censo_animales
WHERE fecha = '2023'
GROUP BY distrito;



--  Porcentaje de crecimiento de perros y gatos por distrito entre 2014 y 2023 
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

-- Distritos con la mayor diferencia entre el número de perros y gatos en un año específico:
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

-- Total de perros y gato en un año especifico segun la zona(norte,Sur,Este y Oeste)del distrito en Madrid

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
