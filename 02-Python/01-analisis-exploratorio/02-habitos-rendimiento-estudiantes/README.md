# ¿Qué hábitos se relacionan con las notas? Análisis de estudio, redes sociales y rendimiento académico

**Caso de negocio:** una universidad quiere saber qué hábitos (estudio, sueño, redes sociales, ejercicio, café) predicen mejor la nota del examen. Con eso quiere montar tutorías para los estudiantes con más riesgo de suspender.

## Qué he aprendido

- Empecé revisando duplicados, nulos y `describe()` antes de sacar ninguna conclusión.
- Agrupé la nota en categorías con `pd.cut()` y comprobé con boxplots que quedaban bien
  separadas.
- Comparé grupos por la mediana de horas de estudio (`np.where`) y por percentiles (perfil
  de alto y de bajo rendimiento).
- Construí un panel de 6 visualizaciones (histogramas, scatter, heatmap, boxplot y
  `pairplot` de Seaborn).


## Hallazgo clave

`study_hours` (r=0,98) y `social_media_hours` (r=-0,98) son, con diferencia, los hábitos que
más se relacionan con la nota. Quien estudia por encima de la mediana saca de media 22 puntos
más en el examen. Son correlaciones tan altas que huelen a datos sintéticos; lo comento en
las limitaciones del notebook. El dataset tampoco indica la unidad de `study_hours` ni de
`social_media_hours`, así que hablo de "horas" sin más.


**Stack:** pandas, NumPy, Matplotlib, Seaborn
