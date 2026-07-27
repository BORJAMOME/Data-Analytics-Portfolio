# Rendimiento comercial por departamento

**Caso de negocio:** una empresa de servicios con tres departamentos (Ventas, Marketing,
Soporte) necesita decidir dónde reforzar plantilla y si la calidad del dato de ventas es
suficiente para tomar esa decisión.

## Qué se aprende

- Diagnóstico y tratamiento de nulos: comparar `dropna()` frente a imputación por variable,
  justificando la decisión (media para variables continuas, 0 cuando el hueco significa
  "sin actividad").
- Cálculo de ratios de productividad evitando división por cero (`replace(0, np.nan)`).
- Detección de top performers con percentiles (`np.percentile`).
- Lectura de una matriz de correlación para descartar una variable como palanca de gestión.

## Hallazgo clave

La edad del empleado no tiene relación con su nivel de ventas (correlación ≈ -0.1): cualquier
criterio de gestión basado en la edad no tiene respaldo en los datos.

## Archivos

- `notebook.ipynb` — análisis completo
- `ventas_empleados.csv` — 500 empleados, columnas: nombre, edad, departamento, ventas, clientes

**Stack:** pandas, NumPy, Matplotlib, Seaborn
