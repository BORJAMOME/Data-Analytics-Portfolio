# Regresión Lineal Simple — Precio de viviendas

El modelo más simple de ML: una recta que predice precios inmobiliarios con diagnóstico completo de supuestos estadísticos.

---

## Contexto de negocio

Una inmobiliaria necesita tasar viviendas rápidamente. Este modelo estima el precio a partir de la superficie como primer filtro antes de la tasación formal.

## Dataset

`datos_regresion_casas.xlsx` — 100 viviendas con Metros_Cuadrados, Distancia_Centro_KM, Numero_Habitaciones y Precio_Miles_USD.

## Técnicas aplicadas

- Selección de variable por correlación
- Regresión lineal simple (sklearn)
- Diagnóstico de 4 supuestos: linealidad, normalidad (Shapiro-Wilk), homocedasticidad, independencia
- QQ-plot, residuos vs predichos, distribución de residuos
- Predicciones de ejemplo

## Hallazgo clave

> Cada metro cuadrado adicional añade ~2.500 USD al precio. El modelo explica más del 75% de la variabilidad solo con la superficie.

## Notebooks relacionados

- [Regresión Simple — Colesterol](../02-colesterol-bmi/) — mismo algoritmo, caso donde R² es bajo (hallazgo negativo válido)
- [Regresión Múltiple — Publicidad](../../02-regresion-lineal-multiple/01-ventas-publicidad/) — añadir más variables para mejorar R²


---

[Volver al índice de Machine Learning](../../../../README.md)
