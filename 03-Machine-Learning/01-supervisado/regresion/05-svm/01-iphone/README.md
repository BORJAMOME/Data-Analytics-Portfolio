# SVR — Prediccion del gasto de clientes

Support Vector Regression con kernels linear, RBF y polynomial: cuando la relacion no es una recta.

---

## Contexto de negocio

Un e-commerce quiere predecir el gasto anual de cada cliente. La relacion fidelidad-gasto es curvilinea — SVR con kernel RBF la captura.

## Dataset

Sintetico (120 clientes): Score_Fidelidad, Ingresos_Mensuales y Gasto_Anual con relacion no lineal (parabolica).

## Tecnicas aplicadas

- SVR con 3 kernels (linear, RBF, poly) + comparativa
- GridSearchCV para tuning de C, gamma, epsilon
- Estandarizacion obligatoria para SVM
- Comparativa con regresion lineal baseline

## Hallazgo clave

> SVR con kernel RBF supera a la regresion lineal en relaciones curvilineas. El kernel trick transforma el espacio sin definir la transformacion explicitamente.

## Notebooks relacionados

- [SVR — Baterias](../02-baterias/) — SVR aplicado a mantenimiento predictivo
- [Gradient Boosting](../../04-gradient-boosting/) — modelo ensemble como alternativa

## Como ejecutar

```bash
pip install pandas numpy matplotlib scikit-learn jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al indice](../../../../README.md)
