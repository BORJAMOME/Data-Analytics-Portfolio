# Clustering Jerárquico — Caso avanzado (gimnasio, 2 variables)

## Contexto de negocio
Un gimnasio quiere encontrar perfiles de socio a partir de dos variables, la antigüedad y el gasto en extras, para diseñar ofertas de retención.

## Dataset
`gym_clientes.xlsx`: 300 registros y 7 variables.

## Técnicas aplicadas
- StandardScaler antes de clustering
- Dendrograma con linkage Ward
- Boxplots por cluster
- Cross-check con variables Abandono y Satisfecho

## Hallazgo clave
Con solo 2 variables los clusters ya muestran tasas de abandono distintas, así que el gasto en extras dice algo sobre el riesgo de baja.


