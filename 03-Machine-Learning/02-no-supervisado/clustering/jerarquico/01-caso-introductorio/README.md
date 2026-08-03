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

## Notebooks relacionados
- [02-caso-avanzado](../02-caso-avanzado/) — 2 variables reales (gimnasio)
- [03-caso-completo](../03-caso-completo/) — coeficiente cofenético + silhouette
- [04-gimnasio-4variables](../04-gimnasio-4variables/) — radar charts con 4 features

## Cómo ejecutar
```bash
pip install pandas numpy matplotlib seaborn scikit-learn
jupyter notebook notebook.ipynb
```
