# Random Forest — Predicción de la satisfacción de clientes en un gimnasio

Un **Random Forest de 100 árboles** confirma el mismo patrón identificado por el Árbol de Decisión: la **frecuencia de asistencia** es el principal factor que explica la satisfacción de los clientes. Más que mejorar la precisión, este modelo aporta una mayor robustez al validar el resultado mediante un conjunto de árboles entrenados sobre muestras diferentes.

---

## Contexto de negocio

La dirección de una cadena de gimnasios quiere identificar de forma anticipada a los clientes con riesgo de insatisfacción utilizando únicamente los datos operativos disponibles.

Tras construir un Árbol de Decisión sencillo e interpretable, se evalúa si un modelo de tipo **Random Forest** es capaz de encontrar patrones adicionales o confirmar las conclusiones obtenidas con un único árbol.

## Objetivo

Entrenar un **Random Forest Classifier**, seleccionar un número adecuado de árboles mediante validación cruzada, analizar la importancia de las variables utilizando dos métodos diferentes y evaluar el rendimiento del modelo.

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

La variable `Abandono` se excluye para evitar **data leakage**.

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

> La **frecuencia de asistencia** vuelve a ser la variable más importante del modelo. Según la importancia Gini representa **el 51,9%** del poder predictivo y, mediante **Permutation Importance**, es la única variable cuya alteración reduce significativamente el rendimiento del modelo.

> La validación cruzada muestra que el rendimiento se estabiliza alrededor de **100 árboles**, por lo que aumentar el tamaño del bosque apenas aporta mejoras.

**Rendimiento del modelo**

- Accuracy: **90,0%**
- AUC-ROC: **0,917**

## Insight de negocio

El Random Forest confirma que la satisfacción de los clientes depende principalmente de la **regularidad con la que utilizan el gimnasio**.

Aunque el modelo incorpora cuatro variables, únicamente **Asistencias_Mes** demuestra tener una influencia realmente determinante sobre la predicción. Esto permite simplificar el seguimiento operativo y centrar las acciones de fidelización en promover una mayor frecuencia de asistencia.

Además, la estabilidad observada en la curva de validación indica que **100 árboles ofrecen un equilibrio óptimo entre rendimiento y coste computacional**, sin necesidad de incrementar la complejidad del modelo.


## Librerías principales

- `pandas`
- `matplotlib`
- `seaborn`
- `scikit-learn`


---

[Volver al índice de Machine Learning](../../../README.md)
