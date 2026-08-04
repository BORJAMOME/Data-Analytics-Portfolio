# MLP Regressor — Forecast de Consumo Eléctrico

## Contexto de negocio

Una empresa de distribución eléctrica necesita predecir el consumo
hora a hora para optimizar la compra de energía en el mercado mayorista.
Las desviaciones generan penalizaciones económicas directas.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Archivo | electricidad.xlsx (hoja: consumo_electrico) |
| Registros | 719 horas (~30 días) |
| Periodo | Enero 2025 |
| Features | hora, dia_semana, es_fin_semana, hora_sin/cos, lag1, lag24 |

## Técnicas aplicadas

- Feature engineering temporal (cíclico, lags)
- MLPRegressor (128, 64, 32) con early stopping
- Comparativa con Regresión Lineal y Random Forest Regressor
- Scatter real vs predicho, barras de MAE, feature importance

## Hallazgo clave

Los lag features (consumo_lag1, consumo_lag24) capturan la mayor parte
de la señal predictiva. La inercia térmica y el patrón diario explican
la variabilidad más que la hora o el día de la semana por sí solos.

