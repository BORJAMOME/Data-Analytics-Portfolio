# Gradient Boosting — Tiempo de carrera de 5K

Predicción del tiempo de una carrera popular de 5K a partir de volumen de entrenamiento, frecuencia cardíaca en reposo y tipo de entrenamiento.

---

## Contexto de negocio

Una app de running quiere dar a cada corredor una estimación de tiempo de carrera antes del día de la prueba, a partir de datos que ya registra habitualmente.

## Dataset

120 corredores (datos sintéticos embebidos en el propio notebook): `Km_Semanales`, `FC_Reposo`, `Tipo_Entrenamiento` (1 = con series, 2 = solo rodaje continuo), `Tiempo_5k` (minutos).

## Técnicas aplicadas

- GradientBoostingRegressor (60 estimadores, profundidad 3)
- Comprobación de calidad del dato: detección de filas duplicadas/casi duplicadas antes de dividir train/test
- Re-evaluación del modelo tras eliminar duplicados, para comprobar si el resultado depende de una fuga de datos entre train y test

## Hallazgo clave

MAE de 0,90 minutos y R²=0,7966 (80% de varianza explicada) con solo 3 variables. El dataset contiene 16 filas con las mismas variables de entrada y un `Tiempo_5k` ligeramente distinto — compatible con una generación sintética por plantillas repetidas. Al eliminarlas, el modelo **mejora** (R²=0,877, MAE=0,74 min): esas filas actuaban como ruido de etiqueta, no como fuga de información, así que el resultado original es honesto.

## Notas sobre el notebook original

El notebook de origen incluía una referencia a un "modelo estratificado" de comparación que no llegaba a mostrarse en el código. Se sustituyó por una explicación autocontenida de por qué el split aleatorio simple es la elección correcta aquí (`Tiempo_5k` es continua, no aplica muestreo estratificado salvo por `Tipo_Entrenamiento`, que está razonablemente balanceado).

## Stack

scikit-learn (GradientBoostingRegressor), pandas, Matplotlib, Seaborn

## Notebooks relacionados

- [Gradient Boosting — Tasación de viviendas](../01-tasacion-viviendas/) — mismo algoritmo, comparativa directa con regresión lineal

---

[Volver al índice de Machine Learning](../../../../README.md)
