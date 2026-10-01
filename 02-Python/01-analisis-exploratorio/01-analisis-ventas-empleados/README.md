# Rendimiento comercial por departamento

**Caso de negocio:** una empresa de servicios con tres departamentos (Ventas, Marketing y
Soporte) tiene que decidir dónde contratar, y antes quiere saber si sus datos de ventas son
lo bastante fiables para basar esa decisión en ellos.

## Qué se aprende

- Tratamiento de nulos: comparar `dropna()` con imputar variable a variable (media en las
  continuas, 0 cuando el hueco quiere decir "sin actividad").
- Cálculo de ratios de productividad evitando división por cero (`replace(0, np.nan)`).
- Detección de top performers con percentiles (`np.percentile`).
- Lectura de una matriz de correlación para descartar una variable como criterio de gestión.

## Hallazgo clave

La edad del empleado no tiene relación con lo que vende (correlación de -0,1). Si alguien
quiere usar la edad para asignar cuentas o contratar, estos datos no le dan la razón.

## Archivos

- `notebook.ipynb`: el análisis
- `ventas_empleados.csv`: 500 empleados con nombre, edad, departamento, ventas y clientes

**Stack:** pandas, NumPy, Matplotlib, Seaborn
