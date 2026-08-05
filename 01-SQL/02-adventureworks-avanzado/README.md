# AdventureWorks Avanzado — Window Functions

**Caso de negocio:** una empresa de fabricación y distribución (AdventureWorks) necesita
analizar el comportamiento de compra de sus clientes, crear rankings de productos por precio,
calcular acumulados de ventas y medir el crecimiento interanual por cliente para identificar
a los 10 con mayor progresión.

## Qué se aprende

- Window Functions completas: `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE`.
- Agregaciones con ventana: `SUM() OVER`, `AVG() OVER`, `COUNT() OVER`.
- `PARTITION BY` para segmentar cálculos por cliente, cargo o subcategoría.
- Sumas acumuladas con `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.
- `LAG()` y `LEAD()` para comparar filas consecutivas.
- CTE + `LAG()` para calcular crecimiento interanual (YoY) de clientes.
- Ejercicio tipo entrevista técnica: ranking de clientes por crecimiento promedio.

## Hallazgo clave

El archivo combina dos bloques complementarios: una batería de 11 ejercicios progresivos
sobre Window Functions (desde agregaciones básicas hasta sumas acumuladas) y un examen
final tipo entrevista que encadena CTE + LAG + agregación + TOP para resolver un problema
real de análisis de crecimiento.

## Archivos

- `adventureworks_avanzado.sql` — 11 ejercicios de Window Functions + ejercicios 
  con CTE y LAG (crecimiento YoY)

