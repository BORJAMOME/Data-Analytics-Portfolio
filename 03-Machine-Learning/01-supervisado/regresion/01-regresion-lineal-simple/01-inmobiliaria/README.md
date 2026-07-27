# Regresion Lineal Simple — Precio de viviendas

El modelo mas simple de ML: una recta que predice precios inmobiliarios con diagnostico completo de supuestos estadisticos.

---

## Contexto de negocio

Una inmobiliaria necesita tasar viviendas rapidamente. Este modelo estima el precio a partir de la superficie como primer filtro antes de la tasacion formal.

## Dataset

`datos_regresion_casas.xlsx` — 100 viviendas con Metros_Cuadrados, Distancia_Centro_KM, Numero_Habitaciones y Precio_Miles_USD.

## Tecnicas aplicadas

- Seleccion de variable por correlacion
- Regresion lineal simple (sklearn)
- Diagnostico de 4 supuestos: linealidad, normalidad (Shapiro-Wilk), homocedasticidad, independencia
- QQ-plot, residuos vs predichos, distribucion de residuos
- Predicciones de ejemplo

## Hallazgo clave

> Cada metro cuadrado adicional anade ~2.500 USD al precio. El modelo explica mas del 75% de la variabilidad solo con la superficie.

## Notebooks relacionados

- [Regresion Simple — Salud](../02-gimnasio/) — mismo algoritmo, caso donde R2 es bajo (hallazgo negativo valido)
- [Regresion Multiple — Publicidad](../../02-regresion-lineal-multiple/01-publicidad/) — anadir mas variables para mejorar R2

## Como ejecutar

```bash
pip install pandas matplotlib seaborn scikit-learn scipy openpyxl jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al indice](../../../../README.md)
