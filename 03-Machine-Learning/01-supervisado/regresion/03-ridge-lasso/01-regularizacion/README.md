# Ridge y Lasso — Regularizacion en regresion lineal

15 variables, solo 5 importan. Lasso las encuentra automaticamente. Ridge las reduce sin eliminarlas. ElasticNet combina ambos.

---

## Contexto de negocio

En datasets con muchas variables, la regresion lineal sobreajusta. La regularizacion penaliza coeficientes grandes, forzando al modelo a ser parsimonioso.

## Dataset

Sintetico (make_regression): 200 registros, 15 features (5 informativas + 10 ruido). Se conoce la verdad para verificar la seleccion.

## Tecnicas aplicadas

- Ridge (L2), Lasso (L1), ElasticNet con GridSearchCV
- Estandarizacion (StandardScaler) — imprescindible para regularizacion
- Lasso Path (evolucion de coeficientes segun alpha)
- Verificacion de seleccion de variables (TP, FP, FN)
- Comparativa de 4 modelos con R2 y coeficientes

## Hallazgo clave

> Lasso identifica correctamente las 5 variables informativas y elimina el ruido. Ridge mantiene todos los coeficientes pero los reduce. La eleccion depende de si se busca seleccion (Lasso) o estabilidad (Ridge).

## Notebooks relacionados

- [Regresion Multiple — Publicidad](../../02-regresion-lineal-multiple/01-publicidad/) — sin regularizacion, 3 variables
- [Gradient Boosting](../../04-gradient-boosting/01-inmobiliaria/) — modelo no lineal como siguiente paso

## Como ejecutar

```bash
pip install pandas numpy matplotlib scikit-learn jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al indice](../../../../README.md)
