# Análisis de ventas de una red de concesionarios con SQL

Proyecto de análisis de ventas de una red ficticia de 50 concesionarios en España, con 500 transacciones registradas entre enero y junio de 2025.

Mediante **SQL Server**, analizo la facturación, los modelos más vendidos y el rendimiento de los concesionarios. Para ello, utilizo consultas SQL, CTEs, subconsultas y funciones de ventana como `LAG()`, `RANK()` y `PERCENT_RANK()`.

### Principales hallazgos

- **Rendimiento comercial:** identificación de los concesionarios con mejores resultados y comparación de sus ventas con la media de la red.
- **Modelos más vendidos:** análisis de las unidades vendidas y de los modelos que más facturación generan.
- **Evolución mensual:** comparación de las ventas entre meses para detectar aumentos y descensos.
- **Diferencias entre concesionarios:** identificación de los puntos de venta con ingresos por encima del percentil 75.

### Tecnologías y técnicas

- SQL Server (T-SQL)
- CTEs y subconsultas
- Funciones de ventana: `LAG()`, `RANK()` y `PERCENT_RANK()`
- Agregaciones, rankings y percentiles
