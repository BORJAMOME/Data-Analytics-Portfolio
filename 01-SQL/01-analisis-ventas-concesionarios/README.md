# Análisis de ventas — Red de concesionarios

**Caso de negocio:** una red de 50 concesionarios del Grupo Volkswagen quiere saber quiénes
son sus mejores vendedores, cómo rinde cada marca, cómo evolucionan las ventas mes a mes y
cómo se reparten los concesionarios por facturación.

## Qué se aprende

- CTEs simples y encadenadas para separar los cálculos intermedios.
- Subqueries escalares y correlacionadas para comparar cada fila con la media de su grupo.
- `LAG()` para calcular la variación mensual de ventas.
- `PERCENTILE_CONT` y `PERCENT_RANK` para análisis de distribución.
- `RANK()` para rankings de concesionarios por facturación.
- Resolver el mismo problema de dos formas cuando hay más de un camino razonable.

## Qué incluye

Todo está en un solo archivo: el CREATE DATABASE, tres tablas con datos realistas
(50 concesionarios, 50 vehículos y 500 ventas) y 10 ejercicios resueltos de dos maneras.
Se ejecuta tal cual en cualquier SQL Server, sin nada más que instalar.

## Archivos

- `analisis_concesionarios.sql`: base de datos y 10 ejercicios resueltos
  con varios enfoques (CTEs, subqueries, LAG, PERCENTILE_CONT)
