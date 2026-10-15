# Análisis de clientes y ventas para supermercado con SQL

Proyecto de análisis de datos de una tienda de alimentación para estudiar el comportamiento de los clientes, las ventas de productos y el rendimiento por categoría, ciudad y proveedor.

Mediante **SQL Server**, desarrollo 40 ejercicios que combinan consultas SQL y técnicas de análisis para segmentar clientes, comparar resultados y detectar patrones de compra.

### Qué incluye

- **Análisis de clientes:** identificación de clientes sin pedidos, clasificación por gasto y comparación de sus compras.
- **Análisis de productos:** clasificación por precio, detección de productos sin ventas e identificación de los más vendidos por categoría.
- **Rendimiento comercial:** comparación de ventas e ingresos por ciudad, categoría y proveedor.
- **Rankings y comparativas:** clasificación de clientes y productos, tanto a nivel global como dentro de cada grupo.
- **Evolución de las compras:** cálculo de ventas acumuladas y comparación del gasto entre pedidos consecutivos.
- **Métricas de negocio:** cálculo del número de pedidos, gasto total y ticket medio por cliente, como base para un dashboard.

### Tecnologías y técnicas

- SQL Server (T-SQL)
- `JOIN`, subconsultas y CTEs
- `CASE` para clasificaciones de negocio
- Windows Functions: `RANK()`, `DENSE_RANK()`, `ROW_NUMBER()`, `NTILE()` y `LAG()`
- `PARTITION BY`, agregaciones y sumas acumuladas
