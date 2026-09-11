# Gradient Boosting — Tiempo de carrera de 5K

Predicción del tiempo de una carrera popular de 5K a partir de volumen de entrenamiento, frecuencia cardíaca en reposo y tipo de entrenamiento.

---

## Contexto de negocio

Una app de running quiere dar a cada corredor una estimación de tiempo de carrera antes del día de la prueba, a partir de datos que ya registra habitualmente.

## Dataset

120 corredores (datos sintéticos embebidos en el propio notebook): `Km_Semanales`, `FC_Reposo`, `Tipo_Entrenamiento` (1 = con series, 2 = solo rodaje continuo), `Tiempo_5k` (minutos).

## Técnicas aplicadas

- GradientBoostingRegressor con selección de hiperparámetros por `GridSearchCV` (validación cruzada de 5 folds sobre train; grid: `n_estimators` [30,60,100,150], `learning_rate` [0.01,0.05,0.1], `max_depth` [2,3,4], `min_samples_leaf` [3,5,10])
- Comprobación de calidad del dato: detección de filas duplicadas/casi duplicadas antes de dividir train/test
- Re-evaluación del modelo (con los hiperparámetros óptimos) tras eliminar duplicados, para comprobar si el resultado depende de una fuga de datos entre train y test

## Hallazgo clave

MAE de 0,91 minutos y R²=0,8110 (81% de varianza explicada) con solo 3 variables, tras optimizar los hiperparámetros con `GridSearchCV` (`n_estimators=150`, `learning_rate=0.1`, `max_depth=2`, `min_samples_leaf=5`). El dataset contiene 16 filas con las mismas variables de entrada y un `Tiempo_5k` ligeramente distinto — compatible con una generación sintética por plantillas repetidas. Al eliminarlas, el modelo **mejora** (R²=0,8647, MAE=0,81 min): esas filas actuaban como ruido de etiqueta, no como fuga de información, así que el resultado original es honesto.

**Overfitting reducido, pero no resuelto:** con los hiperparámetros originales fijados a mano (`n_estimators=60`, `learning_rate=0.1`, `max_depth=3`, sin CV) el modelo alcanzaba en train R²≈0,997 (MAE≈0,18 min) frente a R²=0,797 (MAE=0,90 min) en test — un gap de 20,1 puntos de R². Tras aplicar `GridSearchCV`, el gap train/test se reduce a 18,4 puntos (R² train≈0,995, MAE≈0,22 min vs. R² test=0,811, MAE=0,91 min) — una mejora real pero modesta (~8% de reducción relativa del gap), verificada de forma aislada antes de aplicarla al notebook. Con solo 96 filas de train (16 de ellas casi-duplicadas por plantillas sintéticas), la validación cruzada tiene un margen limitado para regularizar más: ampliar el dataset con corredores genuinamente distintos sería más efectivo que seguir ajustando hiperparámetros sobre este mismo conjunto.

## Notas sobre el notebook original

El notebook de origen incluía una referencia a un "modelo estratificado" de comparación que no llegaba a mostrarse en el código. Se sustituyó por una explicación autocontenida de por qué el split aleatorio simple es la elección correcta aquí (`Tiempo_5k` es continua, no aplica muestreo estratificado salvo por `Tipo_Entrenamiento`, que está razonablemente balanceado).

## Stack

scikit-learn (GradientBoostingRegressor), pandas, Matplotlib, Seaborn
