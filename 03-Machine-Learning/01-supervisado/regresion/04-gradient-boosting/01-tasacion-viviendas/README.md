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

- [Regresión Lineal Simple — Precio viviendas](../../01-regresion-lineal-simple/01-precio-viviendas/) — misma pregunta, una sola variable
- [Gradient Boosting — Tiempo de carrera de 5K](../02-tiempo-carrera-5k/) — mismo algoritmo, otro dominio


---

[Volver al índice de Machine Learning](../../../../README.md)
