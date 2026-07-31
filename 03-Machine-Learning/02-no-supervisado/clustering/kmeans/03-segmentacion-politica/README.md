# K-Means — Segmentacion de votantes por posiciones politicas

## Contexto de negocio
Un partido politico quiere entender como piensa realmente su electorado para poder lanzar mensajes de campana que conecten con cada grupo.

## Dataset
`politicos.xlsx` — 3.689 votantes, 9 variables (edad, ingresos, estudios, estado_civil, seguridad, impuestos, servicios_publicos, inmigracion, voto).

## Tecnicas aplicadas
- One-Hot Encoding para convertir estudios y estado_civil a numerico (`drop='first'`)
- StandardScaler para poner todas las variables en la misma escala
- Metodo del codo + silhouette score para elegir cuantos grupos crear
- Dos enfoques de clustering: con las 11 variables vs. solo las 4 de opinion
- Heatmap de perfiles y cruce de clusters con el voto real

## Hallazgo clave
Cuando metes todas las variables, K-Means agrupa a la gente por estado civil y estudios — no por ideologia. Los 4 clusters votan exactamente igual (~67% PP). Pero si usas solo las opiniones politicas, ahi si aparecen perfiles reales: el votante pro-servicios publicos (PSOE), el conservador fiscal (PP) y el de seguridad + inmigracion (VOX). Moraleja: meter mas variables no siempre mejora el modelo. Elegir bien las features importa tanto como el algoritmo.

## Notebooks relacionados
- [PCA analisis emails](../../reduccion-dimensionalidad/pca/01-analisis-emails/) — PCA standalone
- [PCA + K-Means empleados](../../reduccion-dimensionalidad/pca/02-segmentacion-empleados/) — pipeline combinado

## Como ejecutar
```bash
pip install pandas numpy matplotlib seaborn scikit-learn openpyxl
jupyter notebook kmeans_votantes_espana.ipynb
```
