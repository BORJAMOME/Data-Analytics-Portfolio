# K-Means — Segmentacion avanzada de miembros de gimnasio

## Contexto de negocio
Un gimnasio quiere identificar perfiles de riesgo de abandono para lanzar campanas de retencion proactivas antes de perder miembros.

## Dataset
`dataset_didactico_machine_learning - ALUMNOS - copia.xlsx` — 300 registros, 7 variables.

## Tecnicas aplicadas
- 4 features de comportamiento (Antiguedad, Asistencias, Horas_Pico, Gasto_Extra)
- Metodo del codo + silhouette score
- Analisis de estabilidad: 10 random_state diferentes
- Silhouette plot detallado por cluster
- Cross-check con Abandono y Satisfecho
- Boxplots multivariable

## Hallazgo clave
Los clusters son estables a traves de multiples inicializaciones (baja varianza en silhouette), confirmando que los segmentos son reales y no artefactos de la semilla.

## Notebooks relacionados
- [Jerarquico 4 variables](../../jerarquico/04-gimnasio-4variables/) — misma fuente con clustering jerarquico
- [01-caso-introductorio](../01-caso-introductorio/) — fundamentos K-Means

## Como ejecutar
```bash
pip install pandas numpy matplotlib seaborn scikit-learn openpyxl
jupyter notebook notebook.ipynb
```
