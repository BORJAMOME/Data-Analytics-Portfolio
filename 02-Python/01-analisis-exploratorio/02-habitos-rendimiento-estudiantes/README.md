# Hábitos de vida y rendimiento académico

**Caso de negocio:** el servicio de orientación de una universidad quiere identificar qué
hábitos (estudio, sueño, redes sociales, ejercicio, café) predicen mejor la nota de examen,
para diseñar un programa de tutorías dirigido a estudiantes en riesgo.

## Qué se aprende

- Diagnóstico inicial completo: duplicados, nulos, `describe()`.
- Creación de categorías con `pd.cut()` y verificación con boxplots.
- Comparación de grupos por mediana (`np.where`) y por percentiles (perfil alto vs. bajo
  rendimiento).
- Panel de 6 visualizaciones: histogramas, scatter plots, heatmap de correlación, boxplot y
  `pairplot` de Seaborn.

## Hallazgo clave

`study_hours` (r=0.98) y `social_media_hours` (r=-0.98) son, con diferencia, los hábitos más
relacionados con la nota. Estudiar por encima de la mediana supone, de media, **22 puntos
más** en el examen.

## Archivos

- `notebook.ipynb` — análisis completo
- `habitos_estudiantes.csv` — 50 estudiantes, 9 variables de hábitos y rendimiento

**Stack:** pandas, NumPy, Matplotlib, Seaborn
