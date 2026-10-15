# Riesgo cardiovascular: ¿qué hábitos y factores se relacionan con la salud de los pacientes?

**Caso de negocio:** una aseguradora de salud quiere detectar pronto a los pacientes con
riesgo cardiovascular alto para gastar menos en el futuro. También quiere decidir si es
justo cobrar primas distintas según el riesgo.

## Qué he aprendido

- Convertí el nivel de riesgo (Low, Medium, High) en 0, 1 y 2 con `map` para poder
  correlacionarlo con el resto de variables.
- Ordené los factores de riesgo con una matriz de correlación y vi que, con 50 pacientes, las
  correlaciones son tan parecidas (0,90 a 0,94) que el ranking no es fiable.
- Segmenté a los pacientes con `groupby().agg()` y varias métricas a la vez.
- Descubrí que los 20 fumadores son los 20 pacientes de riesgo alto, así que no puedo separar
  el efecto del tabaco.


## Hallazgo clave

`steps_per_day` es la variable que más se relaciona con el riesgo (-0,94). Los pacientes de
riesgo alto caminan de media 2.780 pasos al día; los de riesgo bajo, 8.844. Con 50 pacientes
y datos de aspecto sintético lo trato como ilustración del método, no como un resultado
trasladable.


**Stack:** pandas, NumPy, Matplotlib, Seaborn
