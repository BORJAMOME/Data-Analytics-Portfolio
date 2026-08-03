# Gradient Boosting Regressor — Tasación de viviendas

Modelo no lineal vs regresión lineal: comparativa directa sobre el mismo dataset inmobiliario con feature importance y curva de aprendizaje.

---

## Contexto de negocio

Una plataforma de tasación online necesita estimaciones precisas. La regresión lineal falla cuando el precio depende de interacciones complejas entre variables.

## Dataset

`Datos_Tasacion_Viviendas_Gradient_Boosting_regressor.xlsx` — 100 inmuebles con m², habitaciones, lat/lon, año de construcción, servicios cercanos y precio comercial.

## Técnicas aplicadas

- GradientBoostingRegressor vs LinearRegression (baseline)
- Cross-validation 5-fold
- Feature importance
- Curva de aprendizaje (detección de sobreajuste)

## Hallazgo clave

> Gradient Boosting captura relaciones no lineales que la regresión lineal pierde. La feature importance revela qué variables importan realmente en la tasación.

## Notebooks relacionados

- [Regresión Lineal Simple — Inmobiliaria](../../01-regresion-lineal-simple/01-inmobiliaria/) — misma pregunta, una sola variable

## Cómo ejecutar

```bash
pip install pandas numpy matplotlib seaborn scikit-learn openpyxl jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al índice](../../../../README.md)
