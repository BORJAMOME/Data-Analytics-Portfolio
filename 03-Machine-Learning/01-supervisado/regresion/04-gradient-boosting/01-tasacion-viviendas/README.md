# Gradient Boosting Regressor — Tasación de viviendas

Gradient Boosting para estimar el precio de viviendas en Madrid, con hiperparámetros elegidos por GridSearchCV, importancia de variables y curva de aprendizaje.

---

## Contexto de negocio

Una agencia inmobiliaria del centro de Madrid quiere estimar precios rápido y de forma coherente, sin depender solo del ojo del tasador.

## Dataset

`Datos_Tasacion_Viviendas_Gradient_Boosting_regressor.xlsx`: 100 inmuebles con m², habitaciones, lat/lon, año de construcción, servicios cercanos y precio comercial.

## Técnicas aplicadas

- GradientBoostingRegressor con búsqueda de hiperparámetros (GridSearchCV, 5-fold)
- Curva de aprendizaje (train vs CV) para detectar sobreajuste
- Feature importance
- Simulador interactivo de tasación (ipywidgets)

## Resultados (test)

| Métrica | Valor |
|---|---:|
| MAE | 59.686 € |
| RMSE | 72.091 € |
| R² | 0,925 |
| MAPE | 9,96 % |

## Hallazgo clave

> Con solo 6 variables, el modelo explica cerca del 92,5% de la variación del precio en test, con un MAPE de alrededor del 10%. Lo que más pesa son los metros cuadrados y la latitud. Hay algo de overfitting (R² de ~99,4% en train frente a ~92,5% en test), así que la cifra que cuenta es la de test. Con 100 viviendas no esperaba mucho más.

