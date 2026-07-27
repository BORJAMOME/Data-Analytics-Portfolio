# SARIMA — Prediccion de Ventas Semanales en Retail

## Contexto de negocio

Una cadena de supermercados necesita anticipar las ventas semanales para
optimizar inventario, personal y promociones. El modelo reemplaza las
previsiones manuales basadas en promedios historicos.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Archivo | `arima.xlsx` |
| Registros | 260 semanas (5 anios) |
| Periodo | Enero 2020 - Diciembre 2024 |
| Variable | Ventas semanales en euros |

## Tecnicas aplicadas

- Descomposicion estacional aditiva (periodo 52 semanas)
- Test de Dickey-Fuller Aumentado (ADF) para estacionariedad
- Diferenciacion (d=1) para lograr estacionariedad
- ACF / PACF para identificacion de parametros
- SARIMA(0,1,1)(0,1,1,52) con statsmodels
- Diagnostico de residuos (QQ-plot, ACF, histograma)
- Forecast a 20 semanas con intervalos de confianza al 95%

## Hallazgo clave

El modelo SARIMA captura la estacionalidad anual y consigue un MAPE inferior
al 5% sobre test, cumpliendo el requisito operativo para automatizar la
prevision de compras y planificacion de turnos.

## Notebooks relacionados

- [02-forecast-electricidad](../02-forecast-electricidad/) — SARIMA horario (s=24)

## Como ejecutar

```bash
pip install pandas numpy matplotlib statsmodels scikit-learn openpyxl
jupyter notebook notebook.ipynb
```
