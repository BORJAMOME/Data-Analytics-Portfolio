-- ============================================================================
-- ADVENTUREWORKS AVANZADO: WINDOW FUNCTIONS
-- ============================================================================
-- Caso de negocio: análisis del comportamiento de compra de clientes,
-- rankings de productos, acumulados de ventas y crecimiento interanual
-- usando la base de datos AdventureWorks2025.
--
-- Técnicas: ROW_NUMBER, RANK, DENSE_RANK, NTILE, SUM/AVG/COUNT OVER,
--           PARTITION BY, ROWS BETWEEN, LAG, LEAD, CTE + TOP.
--
-- Datos: AdventureWorks2025 (base de ejemplo oficial de Microsoft):
-- https://github.com/microsoft/sql-server-samples/releases/tag/adventureworks
-- Pedidos entre el 30/05/2022 y el 29/06/2025: 2022 y 2025 son años
-- incompletos, así que las comparativas interanuales usan solo 2023 y 2024.
--
-- Métrica de venta: SubTotal (venta neta, sin impuestos ni portes). Se usa
-- la misma en todo el script para que las cifras se puedan comparar.
--
-- Autor: Borja Mora Méndez
-- Stack: T-SQL · SQL Server · AdventureWorks2025
-- ============================================================================

USE AdventureWorks2025;
GO


-- ============================================================================
-- PARTE 1: WINDOW FUNCTIONS: 11 EJERCICIOS PROGRESIVOS
-- ============================================================================
-- Bajo cada consulta se indica el resultado obtenido en AdventureWorks2025.


-- ----------------------------------------------------------------------------
-- Ejercicio 1: Gasto por pedido junto al total y la media de su cliente
-- SUM() OVER (PARTITION BY) sin ORDER BY devuelve el total del cliente en
-- cada fila (no un acumulado progresivo: eso es el ejercicio 10).
-- Técnica: SUM() OVER (PARTITION BY) + AVG() OVER
-- ----------------------------------------------------------------------------
SELECT TOP 20
    CustomerID,
    SalesOrderID,
    SubTotal,
    SUM(SubTotal) OVER (PARTITION BY CustomerID)   AS TotalPorCliente,
    SUM(SubTotal) OVER ()                           AS TotalGeneral,
    AVG(SubTotal) OVER (PARTITION BY CustomerID)    AS AvgPorCliente,
    AVG(SubTotal) OVER ()                           AS AvgGeneral
FROM Sales.SalesOrderHeader
ORDER BY TotalPorCliente DESC, CustomerID, SalesOrderID;
-- Resultado: el cliente 29818 lidera con 877.107 € en 12 pedidos (media de
--            73.092 € por pedido, frente a 3.491 € de media general).


-- ----------------------------------------------------------------------------
-- Ejercicio 2: Pedido más caro de cada cliente
-- Se numeran los pedidos de cada cliente del más caro al más barato y se
-- conserva el primero. SalesOrderID desempata para que sea determinista.
-- Técnica: ROW_NUMBER() OVER (PARTITION BY … ORDER BY) + CTE
-- ----------------------------------------------------------------------------

WITH pedidos_numerados AS (
    SELECT
        CustomerID,
        SalesOrderID,
        SubTotal,
        ROW_NUMBER() OVER (
            PARTITION BY CustomerID
            ORDER BY SubTotal DESC, SalesOrderID
        ) AS RankingDentroCliente
    FROM Sales.SalesOrderHeader
)
SELECT TOP 10
    CustomerID,
    SalesOrderID,
    SubTotal AS Pedido_Mas_Caro
FROM pedidos_numerados
WHERE RankingDentroCliente = 1
ORDER BY SubTotal DESC;
-- Resultado: el pedido individual más caro es de 163.930 € (cliente 29641).


-- ----------------------------------------------------------------------------
-- Ejercicio 3: Comparativa ROW_NUMBER vs RANK vs DENSE_RANK
-- Ranking de productos por precio: observar cómo cada función gestiona
-- los empates de forma diferente.
-- Técnica: ROW_NUMBER, RANK, DENSE_RANK sobre la misma columna
-- ----------------------------------------------------------------------------
SELECT
    ProductID,
    ListPrice,
    ROW_NUMBER() OVER (ORDER BY ListPrice, ProductID)  AS NumeroFila,
    RANK()       OVER (ORDER BY ListPrice)             AS Ranking,
    DENSE_RANK() OVER (ORDER BY ListPrice)             AS RankingDenso
FROM Production.Product
WHERE ListPrice > 0
ORDER BY ListPrice, ProductID;
-- Resultado: 304 productos con precio y solo 102 precios distintos. Con los
--            empates, RANK salta posiciones (3, 3, 3, 6) y DENSE_RANK no
--            (3, 3, 3, 4).


-- ----------------------------------------------------------------------------
-- Ejercicio 4: Segmentación de clientes en deciles por gasto
-- Primero se agrega el gasto por cliente; después se reparten los clientes
-- en 10 grupos y se mide qué parte de la venta aporta cada decil.
-- Técnica: CTE + NTILE(10) + SUM() OVER () como denominador
-- ----------------------------------------------------------------------------

WITH gasto_cliente AS (
    SELECT
        CustomerID,
        SUM(SubTotal) AS Gasto
    FROM Sales.SalesOrderHeader
    GROUP BY CustomerID
),
deciles AS (
    SELECT
        CustomerID,
        Gasto,
        NTILE(10) OVER (ORDER BY Gasto DESC, CustomerID) AS Decil
    FROM gasto_cliente
)
SELECT
    Decil,
    COUNT(*)                                                        AS Clientes,
    CAST(SUM(Gasto) AS DECIMAL(14,2))                               AS Venta,
    CAST(SUM(Gasto) * 100.0 / SUM(SUM(Gasto)) OVER () AS DECIMAL(5,2)) AS Pct_Venta,
    CAST(MIN(Gasto) AS DECIMAL(14,2))                               AS Gasto_Minimo_Decil
FROM deciles
GROUP BY Decil
ORDER BY Decil;
-- Resultado: el decil 1 (1.912 clientes) concentra el 81,64 % de la venta; los
--            deciles 6 a 10 juntos no llegan al 0,7 %. Para entrar en el
--            decil 1 hace falta un gasto mínimo de 5.873 €.


-- ----------------------------------------------------------------------------
-- Ejercicio 5: Ranking global de clientes por gasto total
-- Técnica: RANK + GROUP BY + SUM (RANK conserva los empates)
-- ----------------------------------------------------------------------------
SELECT TOP 10
    CustomerID,
    SUM(SubTotal)                                   AS TotalCliente,
    RANK() OVER (ORDER BY SUM(SubTotal) DESC)       AS RankingClientes
FROM Sales.SalesOrderHeader
GROUP BY CustomerID
ORDER BY RankingClientes;
-- Resultado: los 10 primeros superan los 727.000 € cada uno; lidera el 29818.


-- ----------------------------------------------------------------------------
-- Ejercicio 6: Numerar productos del más caro al más barato
-- Técnica: ROW_NUMBER() OVER (ORDER BY DESC)
-- ----------------------------------------------------------------------------

SELECT
    ProductID,
    Name,
    ListPrice,
    ROW_NUMBER() OVER (ORDER BY ListPrice DESC, ProductID) AS Numero_Precio
FROM Production.Product
WHERE ListPrice > 0
ORDER BY Numero_Precio;
-- Resultado: el más caro es el Road-150 Red (3.578,27 €) y el más barato, el
--            Patch Kit (2,29 €).


-- ----------------------------------------------------------------------------
-- Ejercicio 7: Total de productos registrados junto a cada fila
-- Técnica: COUNT(*) OVER (): ventana sin partición
-- ----------------------------------------------------------------------------
SELECT
    ProductID,
    Name,
    ListPrice,
    COUNT(*) OVER () AS Total_Productos
FROM Production.Product
WHERE ListPrice > 0
ORDER BY ListPrice DESC, ProductID;
-- Resultado: 304 productos con precio de catálogo mayor que 0.


-- ----------------------------------------------------------------------------
-- Ejercicio 8: Precio promedio general junto a cada producto
-- ListPrice es de tipo money (4 decimales): AVG no trunca. El CAST se
-- aplica al resultado solo para presentarlo con 2 decimales.
-- Técnica: AVG() OVER ()
-- ----------------------------------------------------------------------------

SELECT
    ProductID,
    Name,
    ListPrice,
    CAST(AVG(ListPrice) OVER () AS DECIMAL(10,2)) AS Precio_Promedio
FROM Production.Product
WHERE ListPrice > 0
ORDER BY ListPrice DESC, ProductID;
-- Resultado: precio medio de catálogo de 727,26 €.


-- ----------------------------------------------------------------------------
-- Ejercicio 9: Empleados con la cantidad de colegas del mismo cargo
-- Técnica: COUNT(*) OVER (PARTITION BY JobTitle)
-- ----------------------------------------------------------------------------
SELECT
    BusinessEntityID,
    JobTitle,
    COUNT(*) OVER (PARTITION BY JobTitle) AS Empleados_Mismo_Cargo
FROM HumanResources.Employee
ORDER BY Empleados_Mismo_Cargo DESC, JobTitle, BusinessEntityID;
-- Resultado: 290 empleados en 67 cargos. El más numeroso, Production
--            Technician - WC40, tiene 26 personas.


-- ----------------------------------------------------------------------------
-- Ejercicio 10: Venta mensual y acumulado (running total)
-- Se agrega primero por mes para que la serie se pueda leer. El marco ROWS
-- se declara explícito: sin él, SQL Server usa RANGE, que asigna el mismo
-- acumulado a las filas empatadas en el ORDER BY.
-- Técnica: CTE + SUM() OVER (ORDER BY … ROWS BETWEEN UNBOUNDED PRECEDING
--          AND CURRENT ROW)
-- ----------------------------------------------------------------------------

WITH venta_mensual AS (
    SELECT
        DATEFROMPARTS(YEAR(OrderDate), MONTH(OrderDate), 1)    AS Mes,
        SUM(SubTotal)                                           AS Venta
    FROM Sales.SalesOrderHeader
    GROUP BY DATEFROMPARTS(YEAR(OrderDate), MONTH(OrderDate), 1)
)
SELECT
    Mes,
    CAST(Venta AS DECIMAL(14,2))    AS Venta,
    CAST(SUM(Venta) OVER (
        ORDER BY Mes
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS DECIMAL(14,2))             AS Acumulado_Ventas
FROM venta_mensual
ORDER BY Mes;
-- Resultado: 38 meses, de mayo de 2022 a junio de 2025, con un acumulado de
--            109,8 M€. Junio de 2025 solo suma 47.492 €: el mes está
--            incompleto y no debe leerse como una caída.

-- 10.b Venta por año completo y variación interanual
SELECT
    YEAR(OrderDate)                                          AS Anio,
    CAST(SUM(SubTotal) AS DECIMAL(14,2))                     AS Venta,
    CAST((SUM(SubTotal) - LAG(SUM(SubTotal)) OVER (ORDER BY YEAR(OrderDate))) * 100.0
         / LAG(SUM(SubTotal)) OVER (ORDER BY YEAR(OrderDate)) AS DECIMAL(6,2)) AS Variacion_Pct
FROM Sales.SalesOrderHeader
WHERE OrderDate >= '2023-01-01' AND OrderDate < '2025-01-01'
GROUP BY YEAR(OrderDate)
ORDER BY Anio;
-- Resultado: la venta neta pasa de 31,6 M€ en 2023 a 43,7 M€ en 2024 (+38,18 %).


-- ----------------------------------------------------------------------------
-- Ejercicio 11: LAG y LEAD: precio del producto anterior y siguiente
-- Cada producto se compara con el inmediatamente más caro y más barato de
-- su misma subcategoría (comparar una bici con un culote no dice nada).
-- ProductID desempata los productos con el mismo precio.
-- Técnica: LAG() y LEAD() con PARTITION BY
-- ----------------------------------------------------------------------------
SELECT
    ps.Name                                                         AS Subcategoria,
    p.ProductID,
    p.Name,
    p.ListPrice,
    LAG(p.ListPrice)  OVER (PARTITION BY p.ProductSubcategoryID
                            ORDER BY p.ListPrice DESC, p.ProductID) AS Precio_Anterior,
    LEAD(p.ListPrice) OVER (PARTITION BY p.ProductSubcategoryID
                            ORDER BY p.ListPrice DESC, p.ProductID) AS Precio_Siguiente
FROM Production.Product p
JOIN Production.ProductSubcategory ps ON p.ProductSubcategoryID = ps.ProductSubcategoryID
WHERE p.ListPrice > 0
ORDER BY ps.Name, p.ListPrice DESC, p.ProductID;
-- Resultado: 295 productos con subcategoría. Muchos comparten precio (las
--            tallas de una misma bici o prenda), así que la diferencia con el
--            anterior suele ser 0.

-- 11.b Mayor salto de precio entre dos productos consecutivos por subcategoría
WITH saltos AS (
    SELECT
        p.ProductSubcategoryID,
        p.ListPrice,
        LAG(p.ListPrice) OVER (PARTITION BY p.ProductSubcategoryID
                               ORDER BY p.ListPrice DESC, p.ProductID)  AS Precio_Anterior
    FROM Production.Product p
    WHERE p.ListPrice > 0
      AND p.ProductSubcategoryID IS NOT NULL
)
SELECT TOP 5
    ps.Name                                                     AS Subcategoria,
    MAX(s.Precio_Anterior - s.ListPrice)                        AS Mayor_Salto_Precio,
    COUNT(DISTINCT s.ListPrice)                                 AS Precios_Distintos
FROM saltos s
JOIN Production.ProductSubcategory ps ON s.ProductSubcategoryID = ps.ProductSubcategoryID
GROUP BY ps.Name
ORDER BY Mayor_Salto_Precio DESC;
-- Resultado: los mayores saltos están en bicis de montaña (1.215 €), de paseo
--            (1.169 €) y de carretera (1.135 €).


-- ============================================================================
-- PARTE 2: EXAMEN TIPO ENTREVISTA TÉCNICA
-- ============================================================================
-- Enunciado:
-- Usando Sales.SalesOrderHeader, obtener para cada cliente y año:
--   1. El total de ventas realizadas.
--   2. El porcentaje de crecimiento respecto al año anterior.
-- Después, identificar los 10 clientes con mayor crecimiento promedio.
--
-- Requisitos: CTE obligatoria, LAG() para ventas del año anterior.
-- Mostrar: CustomerID, Crecimiento promedio (%), Ventas totales, Ranking.
--
-- Decisiones:
--   - Solo años completos (2023 y 2024): comparar con un 2025 de seis meses
--     daría caídas que no existen.
--   - LAG devuelve la fila anterior que exista, no el año anterior. Solo se
--     usa cuando el año previo es consecutivo (Anio - 1).
--   - Un porcentaje sobre una base pequeña se dispara (de 5 € a 3.000 € es
--     un +59.900 %). Se exige una venta mínima de 1.000 € en el año base.
-- ----------------------------------------------------------------------------

-- Paso 1: ventas anuales por cliente
WITH ventas_anuales AS (
    SELECT
        CustomerID,
        YEAR(OrderDate)     AS Anio,
        SUM(SubTotal)       AS TotalVentas
    FROM Sales.SalesOrderHeader
    WHERE OrderDate >= '2023-01-01' AND OrderDate < '2025-01-01'
    GROUP BY CustomerID, YEAR(OrderDate)
),

-- Paso 2: venta del año anterior solo si el año es consecutivo
con_anterior AS (
    SELECT
        CustomerID,
        Anio,
        TotalVentas,
        CASE
            WHEN LAG(Anio) OVER (PARTITION BY CustomerID ORDER BY Anio) = Anio - 1
            THEN LAG(TotalVentas) OVER (PARTITION BY CustomerID ORDER BY Anio)
        END                 AS Ventas_Anio_Anterior
    FROM ventas_anuales
),

-- Paso 3: crecimiento por fila, solo con base suficiente
crecimiento_anual AS (
    SELECT
        CustomerID,
        TotalVentas,
        CASE
            WHEN Ventas_Anio_Anterior >= 1000
            THEN (TotalVentas - Ventas_Anio_Anterior) * 100.0 / Ventas_Anio_Anterior
        END                 AS Crecimiento_Pct
    FROM con_anterior
),

-- Paso 4: crecimiento promedio y ventas totales por cliente
crecimiento_cliente AS (
    SELECT
        CustomerID,
        AVG(Crecimiento_Pct)    AS Crecimiento_Promedio,
        SUM(TotalVentas)        AS Ventas_Totales_Acumuladas
    FROM crecimiento_anual
    GROUP BY CustomerID
)

-- Paso 5: top 10 con ranking (WITH TIES conserva los empates del puesto 10)
SELECT TOP 10 WITH TIES
    CustomerID,
    CAST(Crecimiento_Promedio AS DECIMAL(10,2))         AS Crecimiento_Promedio_Pct,
    CAST(Ventas_Totales_Acumuladas AS DECIMAL(14,2))    AS Ventas_Totales_Acumuladas,
    RANK() OVER (ORDER BY Crecimiento_Promedio DESC)    AS Ranking
FROM crecimiento_cliente
WHERE Crecimiento_Promedio IS NOT NULL
ORDER BY Crecimiento_Promedio DESC;
-- Resultado: 1.703 clientes compran en 2023 y 2024 con una base de al menos
--            1.000 €: 597 crecen y 1.106 caen. El top 10 crece entre un 297 %
--            y un 4.092 %, y ninguno está en el top 10 por gasto (ej. 5): el
--            mayor acumula 233.718 €, frente a más de 727.000 € del top 10.

-- Parte 2.b: ¿de dónde sale el crecimiento de 2024?
-- Venta de 2024 según el año de primera compra del cliente.
WITH primera_compra AS (
    SELECT
        CustomerID,
        MIN(YEAR(OrderDate)) AS Anio_Primera_Compra
    FROM Sales.SalesOrderHeader
    GROUP BY CustomerID
)
SELECT
    CASE WHEN pc.Anio_Primera_Compra = 2024 THEN 'Nuevo en 2024'
         ELSE 'Cliente previo' END                          AS Tipo_Cliente,
    COUNT(DISTINCT h.CustomerID)                            AS Clientes,
    CAST(SUM(h.SubTotal) AS DECIMAL(14,2))                  AS Venta_2024,
    CAST(SUM(h.SubTotal) * 100.0
         / SUM(SUM(h.SubTotal)) OVER () AS DECIMAL(5,2))    AS Pct_Venta_2024
FROM Sales.SalesOrderHeader h
JOIN primera_compra pc ON pc.CustomerID = h.CustomerID
WHERE h.OrderDate >= '2024-01-01' AND h.OrderDate < '2025-01-01'
GROUP BY CASE WHEN pc.Anio_Primera_Compra = 2024 THEN 'Nuevo en 2024'
              ELSE 'Cliente previo' END;
-- Resultado: 8.767 clientes nuevos aportan 16,29 M€ (37,3 % de la venta de
--            2024).

-- Venta de los clientes recurrentes (compran en 2023 y en 2024)
WITH ventas_anuales AS (
    SELECT
        CustomerID,
        YEAR(OrderDate)     AS Anio,
        SUM(SubTotal)       AS TotalVentas
    FROM Sales.SalesOrderHeader
    WHERE OrderDate >= '2023-01-01' AND OrderDate < '2025-01-01'
    GROUP BY CustomerID, YEAR(OrderDate)
),
recurrentes AS (
    SELECT CustomerID
    FROM ventas_anuales
    GROUP BY CustomerID
    HAVING COUNT(*) = 2
)
SELECT
    COUNT(DISTINCT va.CustomerID)                                       AS Clientes,
    CAST(SUM(CASE WHEN va.Anio = 2023 THEN va.TotalVentas END) AS DECIMAL(14,2)) AS Venta_2023,
    CAST(SUM(CASE WHEN va.Anio = 2024 THEN va.TotalVentas END) AS DECIMAL(14,2)) AS Venta_2024,
    CAST((SUM(CASE WHEN va.Anio = 2024 THEN va.TotalVentas END)
          - SUM(CASE WHEN va.Anio = 2023 THEN va.TotalVentas END)) * 100.0
         / SUM(CASE WHEN va.Anio = 2023 THEN va.TotalVentas END) AS DECIMAL(6,2)) AS Variacion_Pct
FROM ventas_anuales va
JOIN recurrentes r ON r.CustomerID = va.CustomerID;
-- Resultado: los 1.806 clientes que compran en ambos años pasan de
--            27,23 M€ a 26,06 M€ (-4,29 %): el crecimiento de 2024 viene de
--            la captación, no de los clientes recurrentes.

-- ============================================================================
-- INSIGHTS DE NEGOCIO
-- ============================================================================
-- 1. Concentración extrema (ej. 4): el 10 % de los clientes genera el
--    81,6 % de la venta neta y la mitad inferior no llega al 0,7 %. La
--    retención del decil 1 (gasto a partir de 5.873 €) pesa mucho más que
--    cualquier acción sobre el resto de la base.
--
-- 2. Crecimiento del negocio (ej. 10 y 10.b): la venta neta crece un
--    38,2 % de 2023 a 2024. 2022 y 2025 son años incompletos, así que no
--    se comparan; el último mes (junio de 2025) también está incompleto.
--
-- 3. El crecimiento viene de la captación (Parte 2 y 2.b): los clientes
--    que compran en 2023 y 2024 gastan un 4,3 % menos en 2024, y 1.106 de
--    los 1.703 con una base de al menos 1.000 € caen. Los 8.767 clientes
--    nuevos aportan el 37,3 % de la venta de 2024. La señal de alerta es la
--    retención de la base existente, no la captación. Los que más crecen en
--    porcentaje son cuentas medianas, no las que más facturan.
--
-- 4. Precios por subcategoría (ej. 11 y 11.b): los mayores saltos entre
--    dos precios consecutivos están en las bicis de montaña (1.215 €), de
--    paseo y de carretera. Son los huecos de la gama donde cabría un
--    producto intermedio; habría que cruzarlo con la demanda antes de
--    proponerlo.
-- ============================================================================
