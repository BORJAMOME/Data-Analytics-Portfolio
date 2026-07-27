# SARIMA — Forecast de Consumo Electrico Horario

## Contexto de negocio

Una empresa energetica necesita predecir el consumo electrico hora a hora
para optimizar la contratacion de potencia, programar el arranque de
generadores de respaldo y detectar anomalias de consumo.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Archivo | `electricidad.xlsx` (hoja: consumo_electrico) |
| Registros | 719 horas (~30 dias) |
| Periodo | 1-30 Enero 2025 |
| Variable | Consumo electrico en kWh |

## Tecnicas aplicadas

- Analisis de patron diario (heatmap hora x dia)
- Test de Dickey-Fuller Aumentado (ADF) — estacionariedad confirmada (d=0)
- ACF / PACF con marcadores en lag 24 y 48 (estacionalidad diaria)
- SARIMA(1,0,0)(1,0,1,24) con ciclo de 24 horas
- Diagnostico de residuos (QQ-plot, ACF, histograma)
- Evaluacion con MAE, RMSE y MAPE
- Zoom horario al periodo de test

## Hallazgo clave

El modelo alcanza un MAPE inferior al 3%, capturando con precision tanto
los picos diurnos (~65-80 kWh) como los valles nocturnos (~38-45 kWh).
Suficiente para optimizar la contratacion de potencia en tiempo real.

## Notebooks relacionados

- [01-caso-completo](../01-caso-completo/) — SARIMA semanal (s=52, ventas retail)

## Como ejecutar

```bash
pip install pandas numpy matplotlib statsmodels scikit-learn openpyxl scipy
jupyter notebook notebook.ipynb
```
