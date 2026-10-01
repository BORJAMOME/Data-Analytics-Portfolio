# Hábitos de vida y rendimiento académico

**Caso de negocio:** el servicio de orientación de una universidad quiere saber qué hábitos
(estudio, sueño, redes sociales, ejercicio, café) predicen mejor la nota del examen. Con eso
quiere montar tutorías para los estudiantes con más riesgo de suspender.

## Qué se aprende

- Diagnóstico inicial: duplicados, nulos y `describe()`.
- Creación de categorías con `pd.cut()` y verificación con boxplots.
- Comparación de grupos por mediana (`np.where`) y por percentiles (perfil alto vs. bajo
  rendimiento).
- Panel de 6 visualizaciones: histogramas, scatter plots, heatmap de correlación, boxplot y
  `pairplot` de Seaborn.

## Hallazgo clave

`study_hours` (r=0,98) y `social_media_hours` (r=-0,98) son, con diferencia, los hábitos que
más se relacionan con la nota. Quien estudia por encima de la mediana saca de media 22 puntos
más en el examen. Son correlaciones tan altas que huelen a datos sintéticos; lo comento en
las limitaciones del notebook.

## Archivos

- `notebook.ipynb`: el análisis
- `habitos_estudiantes.csv`: 50 estudiantes y 9 variables de hábitos y rendimiento

**Stack:** pandas, NumPy, Matplotlib, Seaborn
