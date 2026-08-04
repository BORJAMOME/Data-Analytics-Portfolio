# Árbol de Decisión — Predicción de la satisfacción de clientes en un gimnasio

Un Árbol de Decisión de solo **2 niveles** predice la satisfacción de los clientes de una cadena de gimnasios con un **90% de accuracy**, utilizando reglas simples e interpretables que pueden aplicarse directamente en el negocio.

---

## Contexto de negocio

La dirección quiere identificar de forma anticipada a los clientes con riesgo de insatisfacción para actuar antes de que decidan abandonar el gimnasio.

En lugar de depender únicamente de encuestas, el objetivo es aprovechar los datos operativos que ya genera el negocio (antigüedad, frecuencia de asistencia, uso del gimnasio y gasto en servicios adicionales) para obtener reglas de decisión fácilmente interpretables por el equipo de operaciones.

## Objetivo

Entrenar un **Árbol de Decisión** cuya profundidad óptima se seleccione mediante validación cruzada y transformar el modelo obtenido en reglas de negocio sencillas, explicables y fáciles de implementar.

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

La variable `Abandono` se excluye del entrenamiento para evitar **data leakage**.

## Técnicas aplicadas

- Árbol de Decisión (`DecisionTreeClassifier`)
- Selección de la profundidad óptima mediante validación cruzada (5-fold)
- Visualización e interpretación del árbol
- Importancia de variables (Gini Importance)
- Evaluación mediante:
  - Accuracy
  - Recall
  - Matriz de confusión

## Hallazgo clave

> La **frecuencia de asistencia** explica prácticamente toda la capacidad predictiva del modelo (**98,9% de importancia**). Los clientes que realizan **más de 13 asistencias al mes** son clasificados mayoritariamente como satisfechos y, si además llevan **más de 2,5 meses** en el gimnasio, el árbol acierta en **98 de 102 casos**.

**Rendimiento del modelo**

- Accuracy: **90,0%**

## Insight de negocio

El modelo demuestra que la satisfacción depende principalmente de la **regularidad con la que el cliente utiliza el gimnasio**, mucho más que de su antigüedad o de su gasto adicional.

Esto permite definir reglas muy sencillas para el negocio:

- Detectar automáticamente a clientes con **13 asistencias mensuales o menos**.
- Reforzar el acompañamiento durante los primeros meses.
- Utilizar la frecuencia de asistencia como un KPI adelantado de satisfacción.
- Implementar las reglas del modelo mediante simples condiciones (`IF-ELSE`), sin necesidad de desplegar una infraestructura de Machine Learning.

## Librerías principales

- `pandas`
- `matplotlib`
- `seaborn`
- `scikit-learn`


---

[Volver al índice de Machine Learning](../../../../README.md)

