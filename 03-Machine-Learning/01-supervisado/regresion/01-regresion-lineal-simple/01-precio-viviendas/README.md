# Regresión Lineal Simple — Precio de viviendas

El modelo más simple de ML: una recta que predice precios inmobiliarios con diagnóstico completo de supuestos estadísticos.

---

## Contexto de negocio

Una inmobiliaria necesita tasar viviendas rápidamente. Este modelo estima el precio a partir de la superficie como primer filtro antes de la tasación formal.

## Dataset

`datos_regresion_casas.xlsx` — 100 viviendas con Metros_Cuadrados, Distancia_Centro_KM, Numero_Habitaciones y Precio_Miles_USD.

## Técnicas aplicadas

- Selección de variable por correlación
- Regresión lineal simple (statsmodels) como modelo de partida, ampliada a regresión múltiple (2 y 3 variables) para comparar
- Comparación de modelos por R² ajustado, AIC/BIC y significancia (p-valor)
- Detección de multicolinealidad con VIF
- Diagnóstico visual de 4 supuestos del modelo ganador: linealidad y homocedasticidad (residuos vs predichos), normalidad (histograma de residuos y QQ-plot), independencia (residuos vs orden)
- Validación final con train/test split y regresión lineal (sklearn)
- Predicciones de ejemplo con intervalo aproximado

## Hallazgo clave

> Con solo los metros cuadrados el modelo ya explica ~90% de la variabilidad del precio (R² = 0.899). Añadiendo la distancia al centro como segunda variable, el modelo ganador sube a R² = 0.980: cada m² adicional añade ~2.500 USD y cada km de distancia al centro resta ~4.000 USD, manteniendo la otra variable constante.

