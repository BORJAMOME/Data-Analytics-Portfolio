# K-Means — Segmentación de votantes por posiciones políticas

## Contexto de negocio
Un partido político quiere entender cómo piensa realmente su electorado para poder lanzar mensajes de campaña que conecten con cada grupo.

## Dataset
`politicos.xlsx` — 3.689 votantes, 9 variables (edad, ingresos, estudios, estado_civil, seguridad, impuestos, servicios_públicos, inmigración, voto).

## Técnicas aplicadas
- One-Hot Encoding para convertir estudios y estado_civil a numérico (`drop='first'`)
- StandardScaler para poner todas las variables en la misma escala
- Método del codo + silhouette score para elegir cuántos grupos crear
- Dos enfoques de clustering: con las 11 variables vs. solo las 4 de opinión
- Heatmap de perfiles y cruce de clusters con el voto real

## Hallazgo clave
Cuando metes todas las variables, K-Means agrupa a la gente por estado civil y estudios — no por ideología. Los 4 clusters votan exactamente igual (~67% PP). Pero si usas solo las opiniones políticas, ahí sí aparecen perfiles reales: el votante pro-servicios públicos (PSOE), el conservador fiscal (PP) y el de seguridad + inmigración (VOX). Moraleja: meter más variables no siempre mejora el modelo. Elegir bien las features importa tanto como el algoritmo.

## Notebooks relacionados
- [PCA análisis emails](../../reduccion-dimensionalidad/pca/01-analisis-emails/) — PCA standalone
- [PCA + K-Means empleados](../../reduccion-dimensionalidad/pca/02-segmentacion-empleados/) — pipeline combinado

## Cómo ejecutar
```bash
pip install pandas numpy matplotlib seaborn scikit-learn openpyxl
jupyter notebook notebook.ipynb
```
