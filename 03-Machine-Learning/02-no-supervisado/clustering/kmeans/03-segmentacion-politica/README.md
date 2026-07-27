# K-Means — Segmentacion de votantes por posiciones politicas

## Contexto de negocio
Un partido politico quiere segmentar a su electorado por posiciones reales en temas clave para disenar mensajes de campana diferenciados por segmento.

## Dataset
`politicos.xlsx` — 3.689 votantes, 9 variables (edad, ingresos, estudios, estado_civil, seguridad, impuestos, servicios_publicos, inmigracion, voto).

## Tecnicas aplicadas
- 4 variables de opinion politica (escala 1-10)
- Metodo del codo + silhouette score
- Heatmap normalizado de perfiles
- Radar chart por segmento
- Proyeccion PCA 2D
- Cross-check demografico (edad, ingresos, voto)

## Hallazgo clave
Los segmentos ideologicos no se alinean en un eje unico izquierda-derecha. Existen combinaciones mixtas (ej. pro-seguridad + pro-servicios publicos) que representan swing voters con alto valor de campana.

## Notebooks relacionados
- [PCA analisis emails](../../reduccion-dimensionalidad/pca/01-analisis-emails/) — PCA standalone
- [PCA + K-Means empleados](../../reduccion-dimensionalidad/pca/02-segmentacion-empleados/) — pipeline combinado

## Como ejecutar
```bash
pip install pandas numpy matplotlib seaborn scikit-learn openpyxl
jupyter notebook notebook.ipynb
```
