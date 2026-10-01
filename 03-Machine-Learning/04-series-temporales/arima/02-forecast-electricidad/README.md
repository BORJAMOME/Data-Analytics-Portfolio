# SARIMA — Forecast de Consumo Eléctrico Horario

## Contexto de negocio

Una empresa energética quiere predecir el consumo hora a hora para contratar la potencia justa y organizar sus recursos.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Archivo | `electricidad.xlsx` |
| Registros | 719 horas |
| Periodo | 1–30 Enero 2025 |
| Variable | Consumo eléctrico en kWh |

## Técnicas aplicadas

- Análisis del patrón diario.
- Test ADF: la serie ya es estacionaria (`d=0`).
- ACF / PACF para identificar la estacionalidad diaria.
- SARIMA(1,0,0)(1,0,1,24).
- Diagnóstico de residuos y test de Ljung-Box.
- Evaluación con MAE, RMSE y MAPE.
- Forecast con intervalos de confianza.
- Comparación entre valores reales y predichos.

## Hallazgo clave

El modelo se equivoca de media menos de un 3% (MAPE) y recoge bien el patrón diario, picos y valles incluidos. Para planificar la energía es suficiente, aunque con solo un mes de datos no ha visto ni festivos ni cambios de estación.

