# XGBoost — Predicción de la satisfacción de clientes en un gimnasio

XGBoost, uno de los algoritmos de clasificación más usados en la industria, llega a lo mismo que el árbol de decisión y el Random Forest: lo que más explica la satisfacción de los clientes es la frecuencia de asistencia.

---

## Contexto de negocio

El árbol de decisión y el Random Forest funcionaron bien. Ahora toca ver si un modelo de gradient boosting encuentra relaciones más complejas y predice mejor.

Más que exprimir la precisión, quiero saber si un modelo más sofisticado cambia en algo las decisiones.

## Objetivo

Entrenar un XGBoost, ajustar sus hiperparámetros con Grid Search, ver la importancia de las variables y comprobar si la complejidad extra mejora algo frente a los modelos anteriores.

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

- XGBoost (`XGBClassifier`)
- Optimización de hiperparámetros mediante `GridSearchCV`
- Evaluación de:
  - `n_estimators`
  - `max_depth`
  - `learning_rate`
- Importancia de variables (Gain)
- Curva ROC
- Evaluación mediante:
  - Accuracy
  - Recall
  - Curva ROC y AUC
  - Matriz de confusión

## Hallazgo clave

> La mejor configuración (100 árboles, profundidad 4 y learning rate de 0,05) llega a un 91,7% de accuracy y un AUC-ROC de 0,917. `Asistencias_Mes` vuelve a mandar, con el 80,8% de la importancia.

## Lectura de negocio

Árbol de decisión, Random Forest y XGBoost dicen lo mismo. La frecuencia de asistencia es el mejor indicador de satisfacción y el resto de variables pesan mucho menos. Complicar el modelo no cambia la decisión de negocio; solo da más confianza en ella.

Con tres modelos distintos de acuerdo, tiene sentido que la fidelización se centre en conseguir que la gente vaya más al gimnasio.


## Librerías principales

- `pandas`
- `matplotlib`
- `seaborn`
- `scikit-learn`
- `xgboost`
