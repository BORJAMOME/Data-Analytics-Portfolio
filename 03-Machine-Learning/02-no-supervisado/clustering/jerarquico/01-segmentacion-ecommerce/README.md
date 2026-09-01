# Clustering Jerárquico — Caso introductorio

## Contexto de negocio
Un e-commerce quiere segmentar 30 usuarios por su comportamiento digital (clics y compras) para diseñar campañas de marketing diferenciadas.

## Dataset
Sintético: 30 usuarios con 3 grupos naturales generados vía `make_blobs`.

## Técnicas aplicadas
- Dendrograma con 4 métodos de linkage (ward, complete, average, single)
- Comparación visual de métodos
- Corte del dendrograma y asignación de clusters
- Scatter plot coloreado por cluster

## Hallazgo clave
Ward produce los clusters más compactos y equilibrados — recomendado como default para datos bien separados.

