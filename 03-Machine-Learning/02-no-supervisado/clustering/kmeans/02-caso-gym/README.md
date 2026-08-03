# K-Means — Segmentación avanzada de miembros de gimnasio

## Contexto de negocio
Un gimnasio quiere identificar perfiles de riesgo de abandono para lanzar campañas de retención proactivas antes de perder miembros.

## Dataset
`gym_clientes.xlsx` — 300 registros, 7 variables.

## Técnicas aplicadas
- 4 features de comportamiento (Antigüedad, Asistencias, Horas_Pico, Gasto_Extra)
- Método del codo + silhouette score
- Análisis de estabilidad: 10 random_state diferentes
- Silhouette plot detallado por cluster
- Cross-check con Abandono y Satisfecho
- Boxplots multivariable

## Hallazgo clave
Los clusters son estables a través de múltiples inicializaciones (baja varianza en silhouette), confirmando que los segmentos son reales y no artefactos de la semilla.

## Notebooks relacionados
- [Jerárquico 4 variables](../../jerarquico/04-gimnasio-4variables/) — misma fuente con clustering jerárquico
- [01-caso-introductorio](../01-caso-clientes-retail/) — fundamentos K-Means

## Cómo ejecutar
```bash
pip install pandas numpy matplotlib seaborn scikit-learn openpyxl
jupyter notebook notebook.ipynb
```
