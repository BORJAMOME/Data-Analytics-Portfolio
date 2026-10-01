# Salud preventiva en una aseguradora

**Caso de negocio:** una aseguradora de salud quiere detectar pronto a los pacientes con
riesgo cardiovascular alto para gastar menos en el futuro. También quiere decidir si es
justo cobrar primas distintas según el riesgo.

## Qué se aprende

- Conversión de variables categóricas a numéricas para poder correlacionarlas (`map`).
- Ranking de factores de riesgo con matriz de correlación ordenada.
- Segmentación de clientes con `groupby().agg()` multi-métrica.
- Argumentar si una política de precios se puede defender y con qué variables, que aquí
  pesa más que el cálculo.

## Hallazgo clave

`steps_per_day` es la variable que más se relaciona con el riesgo (-0,94). Los pacientes de
riesgo alto caminan de media 2.780 pasos al día; los de riesgo bajo, 8.844.

## Archivos

- `notebook.ipynb`: el análisis
- `salud_pacientes.csv`: 50 pacientes con variables clínicas y de estilo de vida

**Stack:** pandas, NumPy, Matplotlib, Seaborn
