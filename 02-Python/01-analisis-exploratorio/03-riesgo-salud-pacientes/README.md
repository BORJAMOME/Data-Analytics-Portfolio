# Salud preventiva en una aseguradora

**Caso de negocio:** una aseguradora de salud quiere reducir costes futuros identificando
tempranamente a los pacientes de riesgo cardiovascular alto, y decidir si es justo ajustar
primas según perfil de riesgo.

## Qué se aprende

- Conversión de variables categóricas a numéricas para poder correlacionarlas (`map`).
- Ranking de factores de riesgo con matriz de correlación ordenada.
- Segmentación de clientes con `groupby().agg()` multi-métrica.
- Argumentación de negocio razonada (no solo cálculo) sobre si una política de precios es
  defendible, y con qué variables.

## Hallazgo clave

`steps_per_day` es la variable con mayor correlación con el riesgo (-0.94): los pacientes de
riesgo alto caminan de media 2.780 pasos/día frente a 8.844 en los de riesgo bajo.

## Archivos

- `notebook.ipynb` — análisis completo
- `salud_pacientes.csv` — 50 pacientes, variables clínicas y de estilo de vida

**Stack:** pandas, NumPy, Matplotlib, Seaborn
