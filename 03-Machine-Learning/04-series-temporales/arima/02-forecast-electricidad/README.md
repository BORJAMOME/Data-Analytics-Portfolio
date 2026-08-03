# SARIMA — Forecast de Consumo Eléctrico Horario

## Contexto de negocio

Una empresa energética necesita predecir el consumo eléctrico hora a hora para optimizar la contratación de potencia y planificar los recursos energéticos.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Archivo | `electricidad.xlsx` |
| Registros | 719 horas |
| Periodo | 1–30 Enero 2025 |
| Variable | Consumo eléctrico en kWh |

## Técnicas aplicadas

- Análisis del patrón diario.
- Test ADF — estacionariedad confirmada (`d=0`).
- ACF / PACF para identificar la estacionalidad diaria.
- SARIMA(1,0,0)(1,0,1,24).
- Diagnóstico de residuos y test de Ljung-Box.
- Evaluación con MAE, RMSE y MAPE.
- Forecast con intervalos de confianza.
- Comparación entre valores reales y predichos.

## Hallazgo clave

El modelo consigue un **MAPE inferior al 3%**, capturando correctamente los patrones diarios de consumo, incluidos los picos y valles horarios. El resultado muestra que SARIMA es capaz de generar predicciones precisas para apoyar la planificación energética.

## Cómo ejecutar

```bash
pip install pandas numpy matplotlib statsmodels scikit-learn openpyxl scipy
jupyter notebook notebook.ipynb
```

---

[Volver al índice](../../README.md)
