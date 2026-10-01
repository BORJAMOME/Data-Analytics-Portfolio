# SARIMA vs SARIMAX — Forecasting de Ventas en Retail con Variables Exógenas

Una cadena retail quiere prever sus ventas semanales teniendo en cuenta lo que pasa fuera: promociones, huelgas, guerras o problemas logísticos. Comparo un SARIMA que solo mira el histórico con un SARIMAX que incorpora esos eventos, y el segundo se equivoca un **31 % menos**: el MAPE baja del 7,78 % al 5,31 %.

Este notebook es el análisis completo. Si prefieres recorrer el caso sin tocar código, hay una app en Streamlit que lo explica de principio a fin y te deja simular escenarios: **[forecast-ventas-retail-app](https://github.com/BORJAMOME/forecast-ventas-retail-app)**.

---

## Contexto de negocio

Con la previsión de ventas se decide el stock, el personal y las promociones. El problema es que un modelo que solo mira el pasado no puede ver venir una huelga de transporte, un conflicto internacional o una promoción agresiva. El negocio quiere saber cuánto pesa cada uno de esos eventos.

## Objetivo

Comparar dos modelos de series temporales, SARIMA (solo histórico) y SARIMAX (con variables exógenas), para ver si saber qué eventos hay mejora de verdad la predicción. Y, con el SARIMAX, simular escenarios para prepararse ante distintos imprevistos.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Archivo | `SALES_FORECASTING_VARIABLES_EXOGENAS.xlsx` |
| Granularidad | Semanal |
| Variable objetivo | Ventas semanales en euros |
| Variables exógenas | `promotion` (intensidad del descuento), `strike`, `war`, `logistics`, `other_incident` |

## Metodología

1. **EDA de la serie:** tendencia, estacionalidad y efecto de los eventos a simple vista
2. **Estacionariedad:** test ADF sobre la serie original y la transformada (log y diferenciación)
3. **ACF / PACF** para elegir los órdenes AR y MA
4. **SARIMA(1,1,1)(1,1,1,52)** como referencia, solo con el histórico
5. **SARIMAX(1,1,1)(1,1,1,52)** con las 5 variables exógenas
6. **Evaluación** con MAE, MAPE y RMSE en las últimas semanas
7. **Residuos:** ACF, Ljung-Box y Shapiro-Wilk
8. **Backtesting** con ventanas que avanzan en el tiempo
9. **Modelo final** reentrenado con todos los datos
10. **Escenarios** sueltos y combinados (promoción, guerra, huelga, logística)

## Resultados

| Métrica | SARIMA | SARIMAX | Mejora |
|---------|--------|---------|--------|
| MAE | 9.282 € | **6.409 €** | 31,0 % |
| MAPE | 7,78 % | **5,31 %** | 31,7 % |
| RMSE | 10.613 € | **7.493 €** | 29,4 % |

## Hallazgo clave

> Con las variables exógenas el error baja cerca de un 31 % en las tres métricas. Además de predecir mejor, el SARIMAX sirve para **simular escenarios**: cuánto costaría una huelga, cuánto traería una promoción agresiva o qué pasaría si coinciden una crisis internacional y problemas logísticos.
>
> El backtesting muestra que la mejora se mantiene en varias ventanas de tiempo, así que no depende de que el periodo de test haya caído bien.

## Decisiones de negocio que habilita

- **Stock:** ajustar pedidos según la previsión base o el escenario más probable
- **Riesgo:** poner cifra a lo que costarían los escenarios malos
- **Promociones:** estimar qué devuelve cada nivel de descuento
- **Contingencia:** tener un plan para escenarios combinados (crisis internacional más problemas logísticos)

## Librerías principales

- `pandas`, `numpy`, `matplotlib`, `seaborn`, `statsmodels`, `scikit-learn`, `scipy`
