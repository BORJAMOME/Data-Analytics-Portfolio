/* =========================================================
   PROYECTO: Análisis de Accidentes Madrid 2023
   AUTOR: Borja
   STACK: MySQL 8.0+
   ========================================================= */

-- =========================================================
-- 0️⃣ Creación y selección de base de datos
-- =========================================================

CREATE DATABASE IF NOT EXISTS accidentes;
USE accidentes;


-- =========================================================
-- 1️⃣ ANÁLISIS GEOGRÁFICO
-- =========================================================

-- 1. Número total de accidentes por distrito
SELECT distrito, COUNT(*) AS numero_accidentes
FROM accidentes_madrid
GROUP BY distrito
ORDER BY numero_accidentes DESC;

-- 2. Porcentaje de accidentes por distrito
SELECT 
    distrito,
    COUNT(*) AS total_accidentes,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM accidentes_madrid), 2) AS porcentaje_total
FROM accidentes_madrid
GROUP BY distrito
ORDER BY total_accidentes DESC;

-- 7. Accidentes con fallecidos en 24 horas por distrito
SELECT distrito, COUNT(*) AS numero_fallecidos
FROM accidentes_madrid
WHERE lesividad = 'Fallecido 24 horas'
GROUP BY distrito
ORDER BY numero_fallecidos DESC;

-- 21. Top 5 distritos con condiciones meteorológicas adversas
SELECT distrito, COUNT(*) AS numero_accidentes
FROM accidentes_madrid
WHERE estado_meteorologico <> 'Despejado'
GROUP BY distrito
ORDER BY numero_accidentes DESC
LIMIT 5;


-- =========================================================
-- 2️⃣ TIPO DE ACCIDENTE Y METEOROLOGÍA
-- =========================================================

-- 3. Accidentes por tipo de accidente
SELECT tipo_accidente, COUNT(*) AS numero_accidentes
FROM accidentes_madrid
GROUP BY tipo_accidente
ORDER BY numero_accidentes DESC;

-- 4. Porcentaje por tipo de accidente
SELECT 
    tipo_accidente,
    COUNT(*) AS total_accidentes,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM accidentes_madrid), 2) AS porcentaje_total
FROM accidentes_madrid
GROUP BY tipo_accidente
ORDER BY tipo_accidente;

-- 5. Accidentes por estado meteorológico
SELECT estado_meteorologico, COUNT(*) AS numero_accidentes
FROM accidentes_madrid
GROUP BY estado_meteorologico
ORDER BY numero_accidentes DESC;

-- 6. Porcentaje por estado meteorológico
SELECT 
    estado_meteorologico,
    COUNT(*) AS total_accidentes,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM accidentes_madrid), 2) AS porcentaje_total
FROM accidentes_madrid
GROUP BY estado_meteorologico
ORDER BY estado_meteorologico;


-- =========================================================
-- 3️⃣ ANÁLISIS POR TIPO DE VEHÍCULO
-- =========================================================

-- 8. Accidentes por tipo de vehículo
SELECT tipo_vehiculo, COUNT(*) AS numero_accidentes
FROM accidentes_madrid
GROUP BY tipo_vehiculo
ORDER BY numero_accidentes DESC;

-- 9. Porcentaje por tipo de vehículo
SELECT 
    tipo_vehiculo,
    COUNT(*) AS total_accidentes,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM accidentes_madrid), 2) AS porcentaje_total
FROM accidentes_madrid
GROUP BY tipo_vehiculo
ORDER BY tipo_vehiculo;

-- 23. Vehículo y nivel de lesividad
SELECT tipo_vehiculo, lesividad, COUNT(*) AS numero_accidentes
FROM accidentes_madrid
GROUP BY tipo_vehiculo, lesividad
ORDER BY numero_accidentes DESC;


-- =========================================================
-- 4️⃣ ANÁLISIS DEMOGRÁFICO
-- =========================================================

-- 11. Accidentes por rango de edad
SELECT rango_edad, COUNT(*) AS numero_accidentes
FROM accidentes_madrid
GROUP BY rango_edad
ORDER BY numero_accidentes DESC;

-- 12. Porcentaje por rango de edad
SELECT 
    rango_edad,
    COUNT(*) AS total_accidentes,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM accidentes_madrid), 2) AS porcentaje_total
FROM accidentes_madrid
GROUP BY rango_edad
ORDER BY rango_edad;

-- 13. Accidentes por sexo
SELECT sexo, COUNT(*) AS numero_accidentes
FROM accidentes_madrid
GROUP BY sexo
ORDER BY numero_accidentes DESC;

-- 14. Porcentaje por distrito y sexo (función de ventana)
SELECT 
    distrito,
    sexo,
    COUNT(*) AS total_accidentes,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY distrito), 2) AS porcentaje_por_distrito
FROM accidentes_madrid
GROUP BY distrito, sexo
ORDER BY distrito, sexo;

-- 19. Accidentes por tipo de persona
SELECT tipo_persona, COUNT(*) AS numero_tipo_persona
FROM accidentes_madrid
GROUP BY tipo_persona
ORDER BY tipo_persona;

-- 20. Porcentaje por tipo de persona
SELECT 
    tipo_persona,
    COUNT(*) AS total_accidentes,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM accidentes_madrid), 2) AS porcentaje_total
FROM accidentes_madrid
GROUP BY tipo_persona
ORDER BY tipo_persona;


-- =========================================================
-- 5️⃣ ANÁLISIS TEMPORAL
-- =========================================================

-- 15. Accidentes por hora exacta
SELECT HOUR(hora) AS hora, COUNT(*) AS total_accidentes
FROM accidentes_madrid
GROUP BY HOUR(hora)
ORDER BY total_accidentes DESC;

-- 16. Probabilidad por periodo del día
SELECT
    CASE
        WHEN HOUR(hora) BETWEEN 6 AND 11 THEN 'Mañana'
        WHEN HOUR(hora) BETWEEN 12 AND 13 THEN 'Mediodía'
        WHEN HOUR(hora) BETWEEN 14 AND 19 THEN 'Tarde'
        WHEN HOUR(hora) BETWEEN 20 AND 23 THEN 'Noche'
        ELSE 'Madrugada'
    END AS periodo_del_dia,
    COUNT(*) AS total_accidentes,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM accidentes_madrid), 2) AS probabilidad
FROM accidentes_madrid
GROUP BY periodo_del_dia
ORDER BY FIELD(periodo_del_dia, 'Mañana', 'Mediodía', 'Tarde', 'Noche', 'Madrugada');

-- 17. Accidentes por fecha
SELECT fecha, COUNT(*) AS numero_accidentes
FROM accidentes_madrid
GROUP BY fecha
ORDER BY STR_TO_DATE(fecha, '%d/%m/%Y') ASC;

-- 18. Accidentes por estación del año
SELECT estacion,
    COUNT(*) AS total_accidentes,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM accidentes_madrid), 2) AS probabilidad
FROM (
    SELECT
        CASE
            WHEN STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '2023-03-01' AND '2023-05-31' THEN 'Primavera'
            WHEN STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '2023-06-01' AND '2023-08-31' THEN 'Verano'
            WHEN STR_TO_DATE(fecha, '%d/%m/%Y') BETWEEN '2023-09-01' AND '2023-11-30' THEN 'Otoño'
            ELSE 'Invierno'
        END AS estacion
    FROM accidentes_madrid
) AS estaciones
GROUP BY estacion;


-- =========================================================
-- 6️⃣ ALCOHOL Y FACTORES DE RIESGO
-- =========================================================

-- 10. Alcohol y drogas por distrito
SELECT 
    distrito,
    COUNT(*) AS total_accidentes,
    SUM(CASE WHEN UPPER(positiva_alcohol) = 'SI' THEN 1 ELSE 0 END) AS accidentes_positiva_alcohol,
    SUM(CASE WHEN UPPER(positiva_droga) = 'SI' THEN 1 ELSE 0 END) AS accidentes_positiva_droga,
    ROUND(SUM(CASE WHEN UPPER(positiva_alcohol) = 'SI' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS porcentaje_alcohol,
    ROUND(SUM(CASE WHEN UPPER(positiva_droga) = 'SI' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS porcentaje_droga
FROM accidentes_madrid
GROUP BY distrito
ORDER BY total_accidentes DESC;

-- 24. Alcohol por rango de edad
SELECT rango_edad, COUNT(*) AS numero_accidentes
FROM accidentes_madrid
WHERE UPPER(positiva_alcohol) = 'SI'
GROUP BY rango_edad
ORDER BY numero_accidentes DESC;

-- 25. Alcohol por sexo
SELECT sexo, COUNT(*) AS numero_accidentes
FROM accidentes_madrid
WHERE UPPER(positiva_alcohol) = 'SI'
GROUP BY sexo
ORDER BY numero_accidentes DESC;
