# AdventureWorks Avanzado — Window Functions

**Caso de negocio:** AdventureWorks, una empresa de fabricación y distribución, quiere
entender cómo compran sus clientes, ordenar sus productos por precio, llevar acumulados de
ventas y encontrar a los 10 clientes que más han crecido de un año a otro.

## Qué se aprende

- Window Functions completas: `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `NTILE`.
- Agregaciones con ventana: `SUM() OVER`, `AVG() OVER`, `COUNT() OVER`.
- `PARTITION BY` para segmentar cálculos por cliente, cargo o subcategoría.
- Sumas acumuladas con `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.
- `LAG()` y `LEAD()` para comparar filas consecutivas.
- CTE + `LAG()` para calcular crecimiento interanual (YoY) de clientes.
- Ejercicio tipo entrevista técnica: ranking de clientes por crecimiento promedio.

## Qué incluye

Dos partes. La primera son 11 ejercicios de Window Functions que van de agregaciones básicas
a sumas acumuladas. La segunda es un examen tipo entrevista: encadenar CTE, LAG, agregación
y TOP para sacar el ranking de clientes por crecimiento.

## Archivos

- `adventureworks_avanzado.sql`: 11 ejercicios de Window Functions y el examen
  con CTE y LAG (crecimiento YoY)

