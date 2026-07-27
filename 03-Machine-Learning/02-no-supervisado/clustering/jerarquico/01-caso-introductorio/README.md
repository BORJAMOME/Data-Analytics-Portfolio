# Clustering Jerarquico — Caso introductorio

## Contexto de negocio
Un e-commerce quiere segmentar 30 usuarios por su comportamiento digital (clics y compras) para disenar campanas de marketing diferenciadas.

## Dataset
Sintetico: 30 usuarios con 3 grupos naturales generados via `make_blobs`.

## Tecnicas aplicadas
- Dendrograma con 4 metodos de linkage (ward, complete, average, single)
- Comparacion visual de metodos
- Corte del dendrograma y asignacion de clusters
- Scatter plot coloreado por cluster

## Hallazgo clave
Ward produce los clusters mas compactos y equilibrados — recomendado como default para datos bien separados.

## Notebooks relacionados
- [02-caso-avanzado](../02-caso-avanzado/) — 2 variables reales (gimnasio)
- [03-caso-completo](../03-caso-completo/) — coeficiente cofenetico + silhouette
- [04-gimnasio-4variables](../04-gimnasio-4variables/) — radar charts con 4 features

## Como ejecutar
```bash
pip install pandas numpy matplotlib seaborn scikit-learn
jupyter notebook notebook.ipynb
```
