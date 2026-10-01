# Ridge y Lasso — Estimación del precio de viviendas

Comparo Ridge y Lasso para estimar el precio de viviendas y ver qué hace la regularización con los coeficientes.

---

## Contexto de negocio

Una inmobiliaria quiere estimar el precio de una vivienda a partir de sus características. Ridge y Lasso frenan la complejidad del modelo para que generalice mejor.

## Dataset

Dataset sintético de 200 viviendas, inspirado en Vigo.

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
| Ridge | 37.195 € | 49.161 € | 11,23 % | 0,872 |
| Lasso | **36.974 €** | **48.812 €** | **11,13 %** | **0,874** |

### Hallazgo clave

> Lasso gana por muy poco: la diferencia con Ridge es de 0,2 puntos de R², que en la práctica es un empate. Los metros son, con diferencia, lo que más pesa en el precio. Lasso no elimina ninguna de las 6 variables; solo reduce sus coeficientes.
>
> Con 6 variables y 200 viviendas, la regularización tiene poco que hacer. Donde se nota de verdad es con decenas de variables correlacionadas.
