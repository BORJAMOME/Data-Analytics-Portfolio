# SARIMA vs SARIMAX — Forecasting de Ventas en Retail con Variables Exógenas

Caso de negocio: una cadena retail quiere estimar ventas semanales incorporando eventos externos (promociones, huelgas, guerras, problemas logísticos). La comparación entre un SARIMA baseline y un SARIMAX con variables exógenas demuestra que **los eventos externos reducen el error de predicción un 31 %**, bajando el MAPE del 7,78 % al 5,31 %.

---

## Contexto de negocio

La previsión de ventas es crítica para planificar inventario, asignar personal y diseñar promociones. Sin embargo, un modelo puramente histórico no puede anticipar el impacto de eventos externos como huelgas de transporte, conflictos geopolíticos o campañas promocionales agresivas. El negocio necesita cuantificar ese impacto para tomar decisiones informadas.

## Objetivo

Construir y comparar dos modelos de series temporales — SARIMA (solo datos históricos) y SARIMAX (con variables exógenas) — para determinar si la información de eventos externos mejora significativamente la predicción, y simular escenarios futuros que permitan planificar ante distintas contingencias.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Archivo | `SALES_FORECASTING_VARIABLES_EXOGENAS.xlsx` |
| Granularidad | Semanal |
| Variable objetivo | Ventas semanales en euros |
| Variables exógenas | `is_promotion`, `is_strike`, `is_war`, `is_logistics_issue`, `promotion_intensity` |

## Metodología

1. **EDA de la serie temporal** — tendencia, estacionalidad, impacto visual de eventos exógenos
2. **Estacionariedad** — test ADF sobre serie original y transformada (log + diferenciación)
3. **ACF / PACF** — identificación de órdenes AR y MA
4. **Modelo SARIMA(1,1,1)(1,1,1,52) baseline** — solo información histórica
5. **Modelo SARIMAX(1,1,1)(1,1,1,52)** — incorpora las 5 variables exógenas
6. **Evaluación** — MAE, MAPE, RMSE sobre hold-out temporal
7. **Diagnóstico de residuos** — ACF de residuos, test de Ljung-Box, test de Shapiro-Wilk
8. **Backtesting temporal** — validación cruzada con ventanas deslizantes
9. **Modelo final** — reentrenamiento con todos los datos
10. **Simulación de escenarios** — individuales y combinados (promoción, guerra, huelga, logística)

## Resultados

| Métrica | SARIMA | SARIMAX | Mejora |
|---------|--------|---------|--------|
| MAE | 9.282 € | **6.409 €** | 31,0 % |
| MAPE | 7,78 % | **5,31 %** | 31,7 % |
| RMSE | 10.613 € | **7.493 €** | 29,4 % |

## Hallazgo clave

> Las variables exógenas reducen el error en un ~31 % en las tres métricas. El modelo SARIMAX no solo predice mejor en condiciones normales, sino que permite **simular escenarios**: cuantificar cuánto costaría una huelga, cuánto generaría una promoción agresiva, o cuál sería el impacto combinado de una crisis geopolítica con problemas logísticos.
>
> El backtesting temporal confirma que el modelo generaliza bien a lo largo de múltiples ventanas, no depende de un periodo de test favorable.

## Decisiones de negocio que habilita

- **Inventario** — ajustar pedidos según predicción base o escenario más probable
- **Gestión de riesgo** — cuantificar impacto financiero de escenarios adversos
- **Optimización de promociones** — estimar retorno de inversión de diferentes niveles de descuento
- **Contingencia** — planes de acción para escenarios combinados (crisis geopolítica + logística)

## Librerías principales

- `pandas`, `numpy`, `matplotlib`, `seaborn`, `statsmodels`, `scikit-learn`, `scipy`
