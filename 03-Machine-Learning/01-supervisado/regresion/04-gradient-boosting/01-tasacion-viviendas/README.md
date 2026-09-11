# Gradient Boosting Regressor — Tasación de viviendas

Modelo de Gradient Boosting para estimar el precio de viviendas en Madrid, con búsqueda de hiperparámetros por GridSearchCV, feature importance y curva de aprendizaje.

---

## Contexto de negocio

Una agencia inmobiliaria que opera en la zona centro de Madrid necesita estimaciones de precio rápidas y consistentes, sin depender únicamente del criterio manual del tasador.

## Dataset

`Datos_Tasacion_Viviendas_Gradient_Boosting_regressor.xlsx` — 100 inmuebles con m², habitaciones, lat/lon, año de construcción, servicios cercanos y precio comercial.

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

> Con solo 6 variables, el modelo explica ~92,5% de la variación del precio en test (MAPE ~10%). Los metros cuadrados y la latitud son las variables con más peso. El modelo muestra cierto overfitting (R² en train ~99,4% frente a ~92,5% en test): el resultado en test es la referencia real de rendimiento, no el de train.

