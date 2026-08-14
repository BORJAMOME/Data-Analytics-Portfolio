# Regresión Logística — Admisión universitaria

Con solo **dos variables** es posible construir un modelo que clasifica correctamente el **99% de los candidatos** y visualizar su frontera de decisión. Este proyecto muestra cómo la Regresión Logística combina capacidad predictiva e interpretabilidad en un problema de clasificación binaria.

---

## Contexto de negocio

Un departamento de admisiones universitarias recibe miles de solicitudes cada ciclo. El objetivo es construir un sistema de **scoring** que estime la probabilidad de admisión utilizando únicamente las **horas de estudio** y la **nota del examen de acceso**.

## Objetivo

Entrenar un modelo de **Regresión Logística**, interpretar sus coeficientes mediante **Odds Ratio**, visualizar la frontera de decisión en dos dimensiones y evaluar su capacidad predictiva.

## Dataset

`admitidos.xlsx`

1.140 candidatos con las siguientes variables:

**Variables predictoras**

- `Horas_estudio`
- `Nota_examen`

**Variable objetivo**

- `Admitido` (clasificación binaria)

## Técnicas aplicadas

- **statsmodels.Logit** para inferencia estadística
- **scikit-learn LogisticRegression** para predicción
- Interpretación mediante **Odds Ratio** e intervalos de confianza
- Visualización de la frontera de decisión en 2D
- Mapa continuo de probabilidades
- Curva ROC
- Matriz de confusión
- Evaluación mediante Accuracy, Recall, F1-score y AUC-ROC

## Hallazgo clave

El modelo alcanza una **accuracy del 99%** y un **AUC-ROC de 0.999**, mostrando una capacidad prácticamente perfecta para distinguir entre candidatos admitidos y no admitidos. La **nota del examen** es la variable con mayor impacto sobre la probabilidad de admisión, mientras que las horas de estudio pierden significación estadística al estar fuertemente correlacionadas con la nota obtenida.

## Lectura de negocio

La probabilidad de admisión depende principalmente del **rendimiento en el examen**, que multiplica por **2,14** las probabilidades de ser admitido por cada punto adicional. Esto permite construir un sistema de scoring transparente, interpretable y fácilmente integrable en el proceso de admisiones.

## Librerías principales

- `pandas`
- `matplotlib`
- `seaborn`
- `scikit-learn`
- `statsmodels`


---

[Volver al índice de Machine Learning](../../../../README.md)
