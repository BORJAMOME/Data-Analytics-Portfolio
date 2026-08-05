-- ============================================================================
-- ADVENTUREWORKS AVANZADO — WINDOW FUNCTIONS + EXAMEN DE ENTREVISTA
-- ============================================================================
-- Caso de negocio: análisis del comportamiento de compra de clientes,
-- rankings de productos, acumulados de ventas y crecimiento interanual
-- usando la base de datos AdventureWorks2025.
--
-- Técnicas: ROW_NUMBER, RANK, DENSE_RANK, NTILE, SUM/AVG/COUNT OVER,
--           PARTITION BY, ROWS BETWEEN, LAG, LEAD, CTE + TOP.
--
-- Autor: Borja Mora Méndez
-- Stack: T-SQL · SQL Server · AdventureWorks2025
-- ============================================================================

USE AdventureWorks2025;
GO


-- ============================================================================
-- PARTE 1: WINDOW FUNCTIONS — 11 EJERCICIOS PROGRESIVOS
-- ============================================================================


-- ----------------------------------------------------------------------------
-- Ejercicio 1: Gasto por pedido + total acumulado por cliente
-- Ver el gasto de cada pedido junto al total que se ha gastado cada cliente.
-- Técnica: SUM() OVER (PARTITION BY) + AVG() OVER
-- ----------------------------------------------------------------------------
SELECT
    CustomerID,
    SalesOrderID,
    TotalDue,
    SUM(TotalDue) OVER (PARTITION BY CustomerID)   AS TotalPorCliente,
    SUM(TotalDue) OVER ()                           AS TotalGeneral,
    AVG(TotalDue) OVER (PARTITION BY CustomerID)    AS AvgPorCliente,
    AVG(TotalDue) OVER ()                           AS AvgGeneral
FROM Sales.SalesOrderHeader;


-- ----------------------------------------------------------------------------
-- Ejercicio 2: Ranking de pedidos dentro de cada cliente
-- Si un cliente tiene varios pedidos, numerarlos del más caro al más barato.
-- Técnica: ROW_NUMBER() OVER (PARTITION BY … ORDER BY)
-- ----------------------------------------------------------------------------

SELECT
    CustomerID,
    SalesOrderID,
    TotalDue,
    ROW_NUMBER() OVER (
        PARTITION BY CustomerID
        ORDER BY TotalDue DESC
    ) AS RankingDentroCliente
FROM Sales.SalesOrderHeader;


-- ----------------------------------------------------------------------------
-- Ejercicio 3: Comparativa ROW_NUMBER vs RANK vs DENSE_RANK
-- Ranking de productos por precio: observar cómo cada función gestiona
-- los empates de forma diferente.
-- Técnica: ROW_NUMBER, RANK, DENSE_RANK sobre la misma columna
-- ----------------------------------------------------------------------------
SELECT
    ProductID,
    ListPrice,
    ROW_NUMBER() OVER (ORDER BY ListPrice)  AS NumeroFila,
    RANK()       OVER (ORDER BY ListPrice)  AS Ranking,
    DENSE_RANK() OVER (ORDER BY ListPrice)  AS RankingDenso
FROM Production.Product;


-- ----------------------------------------------------------------------------
-- Ejercicio 4: Segmentación de clientes en deciles por gasto
-- Dividir los pedidos en 10 grupos iguales según el subtotal.
-- Técnica: NTILE(10)
-- ----------------------------------------------------------------------------

SELECT
    CustomerID,
    SubTotal,
    NTILE(10) OVER (ORDER BY SubTotal) AS Grupo
FROM Sales.SalesOrderHeader;


-- ----------------------------------------------------------------------------
-- Ejercicio 5: Ranking global de clientes por gasto total
-- Clasificar clientes según su gasto acumulado en toda la base de datos.
-- Técnica: ROW_NUMBER + GROUP BY + SUM
-- ----------------------------------------------------------------------------
SELECT
    CustomerID,
    SUM(TotalDue)                                       AS TotalCliente,
    ROW_NUMBER() OVER (ORDER BY SUM(TotalDue) DESC)     AS RankingClientes
FROM Sales.SalesOrderHeader
GROUP BY CustomerID;


-- ----------------------------------------------------------------------------
-- Ejercicio 6: Numerar productos del más caro al más barato
-- Técnica: ROW_NUMBER() OVER (ORDER BY DESC)
-- ----------------------------------------------------------------------------

SELECT
    ProductID,
    Name,
    ListPrice,
    ROW_NUMBER() OVER (ORDER BY ListPrice DESC) AS Numero_Precio
FROM Production.Product
WHERE ListPrice > 0
ORDER BY ListPrice DESC;


-- ----------------------------------------------------------------------------
-- Ejercicio 7: Total de productos registrados junto a cada fila
-- Técnica: COUNT(*) OVER () — ventana sin partición
-- ----------------------------------------------------------------------------
SELECT
    ProductID,
    Name,
    ListPrice,
    COUNT(*) OVER () AS Total_Productos
FROM Production.Product
WHERE ListPrice > 0
ORDER BY ListPrice DESC;


-- ----------------------------------------------------------------------------
-- Ejercicio 8: Precio promedio general junto a cada producto
-- Técnica: AVG() OVER () con CAST para precisión decimal
-- ----------------------------------------------------------------------------

SELECT
    ProductID,
    Name,
    ListPrice,
    ROUND(AVG(CAST(ListPrice AS DECIMAL(10,2))) OVER (), 2) AS Precio_Promedio
FROM Production.Product
WHERE ListPrice > 0
ORDER BY ListPrice DESC;


-- ----------------------------------------------------------------------------
-- Ejercicio 9: Empleados con la cantidad de colegas del mismo cargo
-- Técnica: COUNT(*) OVER (PARTITION BY JobTitle)
-- ----------------------------------------------------------------------------
SELECT
    BusinessEntityID,
    JobTitle,
    COUNT(*) OVER (PARTITION BY JobTitle) AS Empleados_Mismo_Cargo
FROM HumanResources.Employee
ORDER BY JobTitle;


-- ----------------------------------------------------------------------------
-- Ejercicio 10: Acumulado de ventas (running total)
-- Suma progresiva de ventas ordenada cronológicamente.
-- Técnica: SUM() OVER (ORDER BY … ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
-- ----------------------------------------------------------------------------

SELECT
    SalesOrderID,
    OrderDate,
    TotalDue,
    SUM(TotalDue) OVER (
        ORDER BY OrderDate
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS Acumulado_Ventas
FROM Sales.SalesOrderHeader
ORDER BY OrderDate;


-- ----------------------------------------------------------------------------
-- Ejercicio 11: LAG y LEAD — precio del producto anterior y siguiente
-- Comparar cada producto con el inmediatamente más caro y más barato.
-- Técnica: LAG() y LEAD() sin partición
-- ----------------------------------------------------------------------------
-- LAG: precio del producto anterior (más caro)
SELECT
    ProductID,
    Name,
    ListPrice,
    LAG(ListPrice) OVER (ORDER BY ListPrice DESC) AS Precio_Anterior
FROM Production.Product
WHERE ListPrice > 0
ORDER BY ListPrice DESC;

-- LEAD: precio del producto siguiente (más barato)
SELECT
    ProductID,
    Name,
    ListPrice,
    LEAD(ListPrice) OVER (ORDER BY ListPrice DESC) AS Precio_Siguiente
FROM Production.Product
WHERE ListPrice > 0
ORDER BY ListPrice DESC;


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
-- ----------------------------------------------------------------------------

-- Paso 1: CTE con ventas anuales + ventas del año anterior (LAG)

WITH ventas_anuales AS (
    SELECT
        CustomerID,
        YEAR(OrderDate)     AS Anio,
        SUM(TotalDue)       AS TotalVentas,
        LAG(SUM(TotalDue)) OVER (
            PARTITION BY CustomerID
            ORDER BY YEAR(OrderDate)
        )                   AS Ventas_Anio_Anterior
    FROM Sales.SalesOrderHeader
    GROUP BY CustomerID, YEAR(OrderDate)
),

-- Paso 2: Calcular crecimiento promedio y ventas totales por cliente

crecimiento_cliente AS (
    SELECT
        CustomerID,
        AVG(
            CASE
                WHEN Ventas_Anio_Anterior IS NOT NULL AND Ventas_Anio_Anterior > 0
                THEN (TotalVentas - Ventas_Anio_Anterior) * 100.0 / Ventas_Anio_Anterior
            END
        )                   AS Crecimiento_Promedio,
        SUM(TotalVentas)    AS Ventas_Totales_Acumuladas
    FROM ventas_anuales
    GROUP BY CustomerID    HAVING AVG(
        CASE
            WHEN Ventas_Anio_Anterior IS NOT NULL AND Ventas_Anio_Anterior > 0
            THEN (TotalVentas - Ventas_Anio_Anterior) * 100.0 / Ventas_Anio_Anterior
        END
    ) IS NOT NULL
)

-- Paso 3: Top 10 con ranking

SELECT TOP 10
    CustomerID,
    ROUND(Crecimiento_Promedio, 2)  AS Crecimiento_Promedio_Pct,
    Ventas_Totales_Acumuladas,
    RANK() OVER (ORDER BY Crecimiento_Promedio DESC) AS Ranking
FROM crecimiento_cliente
ORDER BY Crecimiento_Promedio DESC;
