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

## Notebooks relacionados
- [01-caso-introductorio](../01-caso-introductorio/) — fundamentos con datos sintéticos
- [04-gimnasio-4variables](../04-gimnasio-4variables/) — misma fuente, 4 variables, radar charts

