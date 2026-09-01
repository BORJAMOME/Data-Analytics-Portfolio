# Ridge y Lasso — Estimación del precio de viviendas

Comparación de **Ridge y Lasso** para estimar el precio de viviendas y analizar cómo la regularización afecta a los coeficientes del modelo.

---

## Contexto de negocio

Una inmobiliaria necesita estimar el precio de una vivienda a partir de sus características. Ridge y Lasso permiten controlar la complejidad del modelo y mejorar su capacidad de generalización.

## Dataset

Dataset sintético inspirado en viviendas de una ciudad mediana española.

**Variables:** metros, habitaciones, baños, edad, distancia al centro y garaje.

**Objetivo:** precio de la vivienda.

## Técnicas aplicadas

- Ridge (L2) y Lasso (L1)
- StandardScaler
- RidgeCV y LassoCV para encontrar el `alpha` óptimo
- MAE, RMSE, MAPE y R²
- Comparación de coeficientes y predicciones

## Resultados

| Modelo | MAE | RMSE | MAPE | R² |
|---|---:|---:|---:|---:|
| Ridge | 38.239 € | 50.230 € | 11,39 % | 0,867 |
| Lasso | **36.974 €** | **48.812 €** | **11,13 %** | **0,874** |

### Hallazgo clave

> **Lasso obtiene el mejor resultado**, aunque la diferencia respecto a Ridge es pequeña. Los metros son, con diferencia, la variable con mayor peso en el precio. Lasso mantiene las 6 variables, pero reduce y estabiliza sus coeficientes.

## Notebooks relacionados

- [Regresión Lineal Múltiple — Publicidad](../../02-regresion-lineal-multiple/01-publicidad/)
- [Gradient Boosting — Inmobiliaria](../../04-gradient-boosting/01-inmobiliaria/)


---

[Volver al índice de Machine Learning](../../../../README.md)
