# Gradient Boosting — Tiempo de carrera de 5K

Predigo el tiempo en una carrera popular de 5K a partir de los kilómetros de entrenamiento, las pulsaciones en reposo y el tipo de entrenamiento.

---

## Contexto de negocio

Una app de running quiere decirle a cada corredor qué tiempo puede esperar antes del día de la carrera, con datos que ya registra.

## Dataset

120 corredores (datos sintéticos embebidos en el propio notebook): `Km_Semanales`, `FC_Reposo`, `Tipo_Entrenamiento` (1 = con series, 2 = solo rodaje continuo), `Tiempo_5k` (minutos).

## Técnicas aplicadas

- GradientBoostingRegressor con selección de hiperparámetros por `GridSearchCV` (validación cruzada de 5 folds sobre train; grid: `n_estimators` [30,60,100,150], `learning_rate` [0.01,0.05,0.1], `max_depth` [2,3,4], `min_samples_leaf` [3,5,10])
- Calidad del dato: búsqueda de filas duplicadas o casi duplicadas antes de dividir en train y test
- Reevaluación del modelo sin esos duplicados, para ver si el resultado dependía de una fuga de datos

## Hallazgo clave

Con solo 3 variables, el modelo se equivoca de media en 0,91 minutos y explica el 81% de la variación del tiempo (R² = 0,8110). Los hiperparámetros salen de `GridSearchCV`: `n_estimators=150`, `learning_rate=0.1`, `max_depth=2`, `min_samples_leaf=5`.

Hay 16 filas con las mismas variables de entrada y un `Tiempo_5k` algo distinto, que huele a datos sintéticos generados desde una plantilla. Al quitarlas el modelo mejora (R² = 0,8647, MAE = 0,81 min). No estaban regalando aciertos por fuga de datos; al contrario, metían ruido en la etiqueta.

**El overfitting baja un poco, pero sigue ahí.** Con hiperparámetros puestos a mano (`n_estimators=60`, `learning_rate=0.1`, `max_depth=3`), el R² era de 0,997 en train y 0,797 en test: 20,1 puntos de distancia. Con `GridSearchCV` baja a 18,4 puntos (0,995 en train, 0,811 en test). Es una mejora pequeña. Con 96 filas de train, y 16 casi repetidas, no hay mucho más que rascar ajustando hiperparámetros. Haría más falta tener corredores de verdad distintos.

## Stack

scikit-learn (GradientBoostingRegressor), pandas, Matplotlib, Seaborn
