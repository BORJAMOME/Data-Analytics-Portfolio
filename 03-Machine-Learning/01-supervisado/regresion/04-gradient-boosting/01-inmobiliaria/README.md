# Gradient Boosting Regressor — Tasacion de viviendas

Modelo no lineal vs regresion lineal: comparativa directa sobre el mismo dataset inmobiliario con feature importance y curva de aprendizaje.

---

## Contexto de negocio

Una plataforma de tasacion online necesita estimaciones precisas. La regresion lineal falla cuando el precio depende de interacciones complejas entre variables.

## Dataset

`Datos_Tasacion_Viviendas_Gradient_Boosting_regressor.xlsx` — 100 inmuebles con m2, habitaciones, lat/lon, ano de construccion, servicios cercanos y precio comercial.

## Tecnicas aplicadas

- GradientBoostingRegressor vs LinearRegression (baseline)
- Cross-validation 5-fold
- Feature importance
- Curva de aprendizaje (deteccion de sobreajuste)

## Hallazgo clave

> Gradient Boosting captura relaciones no lineales que la regresion lineal pierde. La feature importance revela que variables importan realmente en la tasacion.

## Notebooks relacionados

- [GB Tuning avanzado](../02-tasacion-viviendas/) — mismo dataset con RandomizedSearchCV y Partial Dependence
- [Regresion Lineal Simple — Inmobiliaria](../../01-regresion-lineal-simple/01-inmobiliaria/) — misma pregunta, una sola variable

## Como ejecutar

```bash
pip install pandas numpy matplotlib seaborn scikit-learn openpyxl jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al indice](../../../../README.md)
