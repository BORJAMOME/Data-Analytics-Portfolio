# ¿Qué departamento necesita más recursos? Análisis de ventas y productividad por empleado

**Caso de negocio:** empresa de servicios con tres departamentos (Ventas, Marketing y
Soporte) tiene que decidir dónde contratar, y antes quiere saber si sus datos de ventas son
lo bastante fiables para basar esa decisión en ellos.

## Qué he aprendido

- Comparé `dropna()` con imputar variable a variable.
- Calculé ratios de productividad evitando la división por cero (`replace(0, np.nan)`).
- Localicé a los mejores vendedores con percentiles (`np.percentile`).
- Usé la matriz de correlación para descartar la edad como criterio de gestión.

## Hallazgo clave

La edad del empleado no tiene relación con lo que vende.

Marketing es el departamento que más vende en total, pero también el que más empleados
tiene. Por empleado, Soporte queda ligeramente por delante, pero la diferencia es pequeña y
no basta para decidir dónde contratar.


**Stack:** pandas, NumPy, Matplotlib, Seaborn
