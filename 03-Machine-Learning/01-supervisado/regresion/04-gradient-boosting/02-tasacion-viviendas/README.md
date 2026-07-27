# Gradient Boosting — Tuning de hiperparametros

El mismo dataset, mejor modelo: RandomizedSearchCV + Partial Dependence Plots para interpretabilidad.

---

## Contexto de negocio

Mismo dataset de tasacion. La pregunta cambia: no es si GB puede predecir, sino como encontrar la mejor configuracion y hacer el modelo explicable.

## Dataset

Mismo que [01-inmobiliaria](../01-inmobiliaria/) — 100 inmuebles, 6 features.

## Tecnicas aplicadas

- RandomizedSearchCV (80 iteraciones, 5-fold CV)
- Analisis de sensibilidad a cada hiperparametro
- Partial Dependence Plots (efecto marginal de cada variable)
- Comparativa GB default vs GB tuneado

## Hallazgo clave

> Los Partial Dependence Plots son la herramienta mas valiosa: hacen que un modelo de ensemble sea explicable para stakeholders no tecnicos. El tuning no siempre mejora — documentarlo es profesional.

## Notebooks relacionados

- [GB base](../01-inmobiliaria/) — modelo con parametros por defecto
- [Ridge/Lasso](../../03-ridge-lasso/01-regularizacion/) — seleccion de variables como paso previo

## Como ejecutar

```bash
pip install pandas numpy matplotlib scikit-learn openpyxl jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al indice](../../../../README.md)
