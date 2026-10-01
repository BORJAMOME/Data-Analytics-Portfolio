# Regresión Lineal Simple — Precio de viviendas

El modelo más sencillo del ML: una recta que predice el precio de una vivienda, revisando uno a uno los supuestos estadísticos.

---

## Contexto de negocio

Una inmobiliaria quiere tasar viviendas rápido. El modelo estima el precio a partir de la superficie y sirve como primer filtro antes de la tasación formal.

## Dataset

`datos_regresion_casas.xlsx`: 100 viviendas con Metros_Cuadrados, Distancia_Centro_KM, Numero_Habitaciones y Precio_Miles_USD.

## Técnicas aplicadas

- Selección de variable por correlación
- Regresión lineal simple (statsmodels) como modelo de partida, ampliada a regresión múltiple (2 y 3 variables) para comparar
- Comparación de modelos por R² ajustado, AIC/BIC y significancia (p-valor)
- Detección de multicolinealidad con VIF
- Diagnóstico visual de 4 supuestos del modelo ganador: linealidad y homocedasticidad (residuos vs predichos), normalidad (histograma de residuos y QQ-plot), independencia (residuos vs orden)
- Validación final con train/test split y regresión lineal (sklearn)
- Predicciones de ejemplo con intervalo aproximado

## Hallazgo clave

> Solo con los metros cuadrados el modelo ya explica cerca del 90% de la variación del precio (R² = 0,899). Si se añade la distancia al centro, sube a R² = 0,980. Con la otra variable fija, cada m² más suma unos 2.500 USD y cada km más lejos del centro resta unos 4.000 USD.

