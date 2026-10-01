# Clustering Jerárquico — Gimnasio con 4 variables y radar charts

## Contexto de negocio
Un gimnasio quiere perfiles de socio que se puedan usar en marketing, a partir de 4 métricas de comportamiento, y enseñarlos con radar charts para que los entienda alguien sin formación técnica.

## Dataset
`gym_clientes.xlsx`: 300 registros y 7 variables.

## Técnicas aplicadas
- 4 features: Antigüedad, Asistencias, Horas_Pico, Gasto_Extra
- StandardScaler + dendrograma Ward
- PCA 2D para visualizar clusters en alta dimensión
- Radar chart por cluster (matplotlib polar)
- Boxplots multivariable
- Cross-check con Abandono y Satisfecho

## Hallazgo clave
En los radar charts cada cluster tiene una forma propia. No se distinguen por una sola métrica sino por cómo se combinan las cuatro, y eso da para perfiles de marketing con más matices que "gasta mucho" o "gasta poco".


