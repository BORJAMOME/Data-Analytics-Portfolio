# XGBoost — Predicción de la satisfacción de clientes en un gimnasio

XGBoost, uno de los algoritmos de clasificación más utilizados en problemas industriales, confirma el mismo hallazgo obtenido por el Árbol de Decisión y el Random Forest: **la frecuencia de asistencia es el principal factor que explica la satisfacción de los clientes**.

---

## Contexto de negocio

Tras obtener buenos resultados con un Árbol de Decisión y un Random Forest, se evalúa si un modelo de **Gradient Boosting** es capaz de capturar relaciones más complejas entre las variables y mejorar la capacidad predictiva.

El objetivo no es únicamente obtener la mejor precisión posible, sino comprobar si un modelo más sofisticado aporta información adicional para la toma de decisiones.

## Objetivo

Entrenar un **XGBoost Classifier**, optimizar sus hiperparámetros mediante **Grid Search**, analizar la importancia de las variables y evaluar si el incremento de complejidad del modelo aporta una mejora significativa respecto a los algoritmos anteriores.

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

> La mejor configuración del modelo (**100 árboles, profundidad 4 y learning rate de 0,05**) alcanza una **accuracy del 91,7%** y un **AUC-ROC de 0,917**. XGBoost vuelve a identificar **Asistencias_Mes** como la variable claramente dominante, concentrando el **80,8% de la importancia** del modelo.

## Insight de negocio

Los tres algoritmos desarrollados durante el proyecto (**Árbol de Decisión, Random Forest y XGBoost**) llegan a la misma conclusión:

- La **frecuencia de asistencia** es el principal indicador de satisfacción.
- El resto de variables aportan información complementaria, pero su influencia es considerablemente menor.
- Incrementar la complejidad del modelo no cambia la decisión de negocio, sino que refuerza la confianza en el hallazgo obtenido.

Esta convergencia entre modelos proporciona una base sólida para diseñar estrategias de fidelización centradas en aumentar la frecuencia de uso del gimnasio.


## Librerías principales

- `pandas`
- `matplotlib`
- `seaborn`
- `scikit-learn`
- `xgboost`


---

[Volver al índice de Machine Learning](../../../../README.md)