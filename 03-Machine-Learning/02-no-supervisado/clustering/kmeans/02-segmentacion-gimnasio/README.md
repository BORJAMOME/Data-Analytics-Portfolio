# K-Means — Segmentación avanzada de miembros de gimnasio

## Contexto de negocio
Un gimnasio quiere encontrar los perfiles con más riesgo de baja para lanzar campañas de retención antes de perder a esos socios.

## Dataset
`gym_clientes.xlsx`: 300 registros y 7 variables.

## Técnicas aplicadas
- 4 features de comportamiento (Antigüedad, Asistencias, Horas_Pico, Gasto_Extra)
- Método del codo + silhouette score
- Análisis de estabilidad: 10 random_state diferentes
- Silhouette plot detallado por cluster
- Cross-check con Abandono y Satisfecho
- Boxplots multivariable

## Hallazgo clave
Los clusters salen iguales con 10 semillas distintas (el silhouette apenas varía). Los segmentos están en los datos y no dependen de la inicialización.


