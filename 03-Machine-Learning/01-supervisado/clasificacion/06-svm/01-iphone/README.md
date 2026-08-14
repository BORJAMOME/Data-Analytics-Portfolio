# SVR — Predicción del gasto de clientes

Support Vector Regression con kernels linear, RBF y polynomial: cuando la relación no es una recta.

---

## Contexto de negocio

Un e-commerce quiere predecir el gasto anual de cada cliente. La relación fidelidad-gasto es curvilínea — SVR con kernel RBF la captura.

## Dataset

Sintético (120 clientes): Score_Fidelidad, Ingresos_Mensuales y Gasto_Anual con relación no lineal (parabólica).

## Técnicas aplicadas

- SVR con 3 kernels (linear, RBF, poly) + comparativa
- GridSearchCV para tuning de C, gamma, epsilon
- Estandarización obligatoria para SVM
- Comparativa con regresión lineal baseline

## Hallazgo clave

> SVR con kernel RBF supera a la regresión lineal en relaciones curvilíneas. El kernel trick transforma el espacio sin definir la transformación explícitamente.

## Notebooks relacionados

- [SVR — Baterías](../02-baterias/) — SVR aplicado a mantenimiento predictivo
- [Gradient Boosting](../../04-gradient-boosting/) — modelo ensemble como alternativa


---

[Volver al índice de Machine Learning](../../../../README.md)
