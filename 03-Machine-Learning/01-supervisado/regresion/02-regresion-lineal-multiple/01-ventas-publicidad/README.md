# Regresión Lineal Múltiple — Predicción de ventas mediante inversión publicitaria

¿Cuánto venden de más los euros que se meten en publicidad? Uso el conocido dataset **Advertising** para ver qué canales mueven de verdad las ventas, con una regresión lineal múltiple que sirve tanto para predecir como para leer el efecto de cada canal.

---

## Contexto de negocio

Una empresa quiere repartir mejor su presupuesto de marketing y saber qué canal le devuelve más ventas.

Se trata de ver qué inversiones tienen un efecto significativo y de tener un modelo que estime las ventas según lo que se ponga en cada canal.

---

## Dataset

**Advertising.csv**

200 campañas publicitarias con la inversión en:

- **TV**
- **Radio**
- **Newspaper**
- **Sales** (ventas obtenidas)

---

## Técnicas aplicadas

- Análisis exploratorio de datos (EDA)
- Estadística descriptiva
- Matriz de correlación de Pearson
- Regresión lineal simple
- Regresión lineal múltiple
- Selección de variables mediante significancia estadística (p-valores)
- Evaluación de multicolinealidad mediante VIF
- Evaluación del modelo (R², MAE, RMSE y MAPE)
- Validación con conjunto de entrenamiento y prueba
- Diagnóstico de los supuestos de la regresión

---

## Hallazgo principal

> TV y radio explican cerca del 90 % de la variación de las ventas. La prensa (Newspaper) no aporta nada significativo una vez tenidas en cuenta las otras dos, así que el modelo final se queda solo con TV y radio.

---

## Resultados

- **Variables predictoras:** TV y Radio
- **R² (train):** 0,8966
- **R² (test):** 0,8945
- **MAE (test):** 1,39 unidades de ventas
- **RMSE (test):** 1,69 unidades de ventas
- **MAPE (test):** 14,39 %

---

## Conclusiones

- La TV es lo que más influye en las ventas.
- La radio también aporta y mejora la predicción.
- La prensa no explica nada una vez se tienen en cuenta TV y radio.
- El modelo rinde casi igual en train y en test, así que no hay señales de sobreajuste.
- Sirve para estimar ventas y para discutir con datos dónde poner el presupuesto. Una cosa: por euro, la radio rinde unas cuatro veces más que la TV (0,19 frente a 0,045), así que yo miraría si tiene margen para crecer antes de meter más en TV.
