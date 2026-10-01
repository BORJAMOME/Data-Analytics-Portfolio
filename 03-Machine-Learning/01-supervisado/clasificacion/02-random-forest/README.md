# Random Forest - Predicción de la satisfacción de clientes en un gimnasio

Un Random Forest de 100 árboles llega a lo mismo que el árbol de decisión: lo que más explica la satisfacción es la frecuencia de asistencia. No acierta más. Lo que aporta es confianza, porque el mismo resultado sale de 100 árboles entrenados con muestras distintas.

---

## Contexto de negocio

La dirección de una cadena de gimnasios quiere detectar a tiempo a los clientes descontentos usando solo los datos que ya tiene.

Después del árbol de decisión, la pregunta es si un Random Forest encuentra algo más o si confirma lo que dijo un único árbol.

## Objetivo

Entrenar un Random Forest, elegir el número de árboles con validación cruzada, medir la importancia de las variables con dos métodos distintos y evaluar el modelo.

## Dataset

**gym_clientes.xlsx**

300 clientes con las siguientes variables:

**Variables predictoras**

- `Antiguedad_Meses`
- `Asistencias_Mes`
- `Horas_Pico_Mes`
- `Gasto_Mensual_Extra`

**Variable objetivo**

- `Satisfecho` (clasificación binaria)

`Abandono` se deja fuera para evitar data leakage.

## Técnicas aplicadas

- Random Forest (`RandomForestClassifier`)
- Selección del número de árboles mediante validación cruzada (5-fold)
- Curva de validación (`n_estimators`)
- Importancia de variables mediante:
  - Gini Importance
  - Permutation Importance
- Evaluación mediante:
  - Accuracy
  - Recall
  - Curva ROC y AUC
  - Matriz de confusión

## Hallazgo clave

> La frecuencia de asistencia vuelve a ser la variable más importante: el 51,9% según Gini. Con permutation importance es la única que, al desordenarla, hace caer el rendimiento de forma clara.

> En validación cruzada el rendimiento se estabiliza hacia los 100 árboles. Poner más apenas mejora nada.

**Rendimiento del modelo**

- Accuracy: **90,0%**
- AUC-ROC: **0,917**

## Lectura de negocio

El Random Forest confirma que la satisfacción depende sobre todo de lo a menudo que el cliente va al gimnasio.

El modelo usa cuatro variables, pero solo `Asistencias_Mes` pesa de verdad en la predicción. Para operaciones, eso simplifica el seguimiento: basta con vigilar la asistencia y centrar la fidelización en que la gente vaya más.

Con 100 árboles el modelo ya está estable, así que no compensa hacerlo más grande.


## Librerías principales

- `pandas`
- `matplotlib`
- `seaborn`
- `scikit-learn`

