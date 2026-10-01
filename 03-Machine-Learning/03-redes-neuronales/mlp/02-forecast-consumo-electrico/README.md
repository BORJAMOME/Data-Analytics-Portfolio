# MLP Regressor — Forecast de Consumo Eléctrico

## Contexto de negocio

Una distribuidora eléctrica tiene que predecir el consumo hora a hora
para comprar la energía justa en el mercado mayorista. Cada desviación
se paga con penalizaciones.

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

Casi toda la señal está en los retardos: el consumo de la hora anterior
(`consumo_lag1`) y el de la misma hora del día anterior (`consumo_lag24`).
Lo que acaba de pasar y el patrón diario explican más que la hora o el día
de la semana por sí solos.

Y la red neuronal no compensa: el Random Forest (R² = 0,974) y hasta la
regresión lineal (0,964) se equivocan menos que el MLP (0,957).

