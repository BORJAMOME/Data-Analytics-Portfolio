# SARIMA — Predicción de Ventas Semanales en Retail

**[Ver la app interactiva](https://sarima-ventas-retail.streamlit.app/)**: el caso contado paso a paso a partir de este notebook, con una zona para jugar con el modelo ([código](https://github.com/BORJAMOME/sarima-ventas-retail-app)).

## Contexto de negocio

Una cadena de supermercados quiere saber qué va a vender cada semana para ajustar el stock, el personal y las promociones.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Archivo | `arima.xlsx` |
| Registros | 260 semanas (5 años) |
| Periodo | Enero 2020 - Diciembre 2024 |
| Variable | Ventas semanales en euros |

## Técnicas aplicadas

- Descomposición estacional aditiva (52 semanas)
- Test ADF de estacionariedad
- Diferenciación (`d=1`, `D=1`)
- ACF / PACF
- SARIMA(0,1,1)(0,1,1,52)
- Diagnóstico de residuos
- Evaluación con MAE, RMSE y MAPE
- Forecast a 20 semanas con intervalos de confianza del 95%

## Hallazgo clave

El modelo recoge la tendencia y la estacionalidad anual de las ventas y se equivoca de media un **2,21%** (MAPE) en el año de test. Para planificar stock y personal es más que suficiente.

