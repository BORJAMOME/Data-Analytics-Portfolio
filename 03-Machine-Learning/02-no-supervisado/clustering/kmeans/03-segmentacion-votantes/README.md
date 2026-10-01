# K-Means — Segmentación de votantes por posiciones políticas

## Contexto de negocio
Un partido político quiere saber cómo piensa de verdad su electorado para ajustar el mensaje de campaña a cada grupo.

## Dataset
`politicos.xlsx`: 3.689 votantes, 9 variables (edad, ingresos, estudios, estado_civil, seguridad, impuestos, servicios_públicos, inmigración, voto).

## Técnicas aplicadas
- One-Hot Encoding para convertir estudios y estado_civil a numérico (`drop='first'`)
- StandardScaler para poner todas las variables en la misma escala
- Método del codo + silhouette score para elegir cuántos grupos crear
- Dos enfoques de clustering: con las 11 variables vs. solo las 4 de opinión
- Heatmap de perfiles y cruce de clusters con el voto real

## Hallazgo clave
Con todas las variables, K-Means agrupa a la gente por estado civil y estudios, no por ideología, y los 4 clusters votan exactamente igual (~67% PP). Con solo las opiniones políticas sí salen perfiles: el votante de servicios públicos (PSOE), el conservador fiscal (PP) y el de seguridad e inmigración (VOX). Meter más variables no siempre ayuda; elegir bien cuáles importa tanto como el algoritmo.


