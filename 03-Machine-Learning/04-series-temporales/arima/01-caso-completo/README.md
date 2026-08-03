# SARIMA — Predicción de Ventas Semanales en Retail

## Contexto de negocio

Una cadena de supermercados necesita anticipar las ventas semanales para optimizar inventario, personal y promociones.

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

El modelo captura la **tendencia y estacionalidad anual** de las ventas con un **MAPE del 2,21%** sobre el conjunto de test, mostrando un buen nivel de precisión para apoyar la planificación de inventario y recursos.

## Cómo ejecutar

```bash
pip install pandas numpy matplotlib statsmodels scikit-learn openpyxl
jupyter notebook notebook.ipynb
