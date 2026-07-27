# MLP Regressor — Forecast de Consumo Electrico

## Contexto de negocio

Una empresa de distribucion electrica necesita predecir el consumo
hora a hora para optimizar la compra de energia en el mercado mayorista.
Las desviaciones generan penalizaciones economicas directas.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Archivo | electricidad.xlsx (hoja: consumo_electrico) |
| Registros | 719 horas (~30 dias) |
| Periodo | Enero 2025 |
| Features | hora, dia_semana, es_fin_semana, hora_sin/cos, lag1, lag24 |

## Tecnicas aplicadas

- Feature engineering temporal (ciclico, lags)
- MLPRegressor (128, 64, 32) con early stopping
- Comparativa con Regresion Lineal y Random Forest Regressor
- Scatter real vs predicho, barras de MAE, feature importance

## Hallazgo clave

Los lag features (consumo_lag1, consumo_lag24) capturan la mayor parte
de la senal predictiva. La inercia termica y el patron diario explican
la variabilidad mas que la hora o el dia de la semana por si solos.

## Notebooks relacionados

- [01-caso-completo](../01-caso-completo/) — MLP clasificacion (churn)
- [02-clasificacion-fintech](../02-clasificacion-fintech/) — MLP clasificacion (credito)

## Como ejecutar

```bash
pip install pandas numpy matplotlib seaborn scikit-learn openpyxl
jupyter notebook notebook.ipynb
```
