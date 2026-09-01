# Clustering Jerárquico — Caso avanzado (gimnasio, 2 variables)

## Contexto de negocio
Un gimnasio quiere identificar perfiles de miembros usando Antigüedad y Gasto Extra para diseñar ofertas de retención.

## Dataset
`gym_clientes.xlsx` — 300 registros, 7 variables.

## Técnicas aplicadas
- StandardScaler antes de clustering
- Dendrograma con linkage Ward
- Boxplots por cluster
- Cross-check con variables Abandono y Satisfecho

## Hallazgo clave
Los clusters de 2 variables ya capturan diferencias en tasas de abandono, validando que el comportamiento de gasto predice el riesgo.


