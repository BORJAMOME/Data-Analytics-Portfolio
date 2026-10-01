# Clustering Jerárquico — Caso introductorio

## Contexto de negocio
Un e-commerce quiere agrupar a 30 usuarios según sus clics y sus compras para hacer una campaña distinta para cada grupo.

## Dataset
Sintético: 30 usuarios con 3 grupos naturales generados vía `make_blobs`.

## Técnicas aplicadas
- Dendrograma con 4 métodos de linkage (ward, complete, average, single)
- Comparación visual de métodos
- Corte del dendrograma y asignación de clusters
- Scatter plot coloreado por cluster

## Hallazgo clave
Ward da los clusters más compactos y equilibrados. Como los datos están generados con 3 grupos claros, aquí lo interesante es ver cómo cambia el dendrograma según el método de enlace, más que el resultado en sí.

