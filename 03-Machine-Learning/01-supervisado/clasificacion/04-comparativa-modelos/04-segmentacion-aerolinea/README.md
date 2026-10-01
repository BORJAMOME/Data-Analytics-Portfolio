# Comparativa de 3 modelos — Segmentación de clientes de aerolínea

Este notebook es el análisis completo. Si prefieres recorrer el caso sin tocar código, hay una app en Streamlit que compara los 3 modelos y te deja inventar un cliente para ver si los modelos se ponen de acuerdo sobre su segmento: **[comparativa-modelos-aerolinea-app](https://github.com/BORJAMOME/comparativa-modelos-aerolinea-app)**.

Una aerolínea quiere clasificar a sus clientes en tres segmentos (Básico, Frecuente y Premium) para hacer campañas distintas en cada uno. Comparo tres algoritmos sobre 1.500 clientes y 20 variables, y Gradient Boosting llega a un F1-macro del 78,4 %, frente al 17,6 % del baseline y el 66,2 % de la regresión logística.

---

## Contexto de negocio

La aerolínea tiene de cada cliente datos demográficos, de cómo viaja, de lo que gasta, de incidencias, equipaje, satisfacción y fidelización, pero ningún criterio automático para asignarle un segmento. Sin él, las campañas de marketing y retención son las mismas para todos.

## Objetivo

Comparar tres algoritmos de clasificación multiclase (regresión logística, Random Forest y Gradient Boosting) y decidir con validación cruzada estratificada de 5 folds cuál pondría en producción.

## Dataset

`dataset_linea_aerea_multiclase_v2.xlsx`: 1.500 clientes con 20 variables agrupadas en datos demográficos, comportamiento de viaje, valor económico, incidencias, equipaje/satisfacción y fidelización. Variable objetivo: `segmento_cliente` (Básico ~34 %, Frecuente ~33 %, Premium ~33 %).

## Técnicas aplicadas

- **EDA:** análisis univariante y bivariante, outliers (IQR, Z-score, percentiles) e Isolation Forest.
- **Feature engineering:** codificación ordinal y one-hot, escalado, imputación, multicolinealidad (VIF), ANOVA F para elegir variables y comprobación de data leakage (eta cuadrado).
- **Regresión logística multinomial**, como referencia lineal e interpretable.
- **Random Forest** (100 estimadores), un ensemble con bagging.
- **Gradient Boosting** (`GradientBoostingClassifier`), boosting secuencial, que suele ser el techo en datos tabulares.

Evaluación con accuracy, F1-macro, matriz de confusión, classification report y feature importance.

## Resultados (validación cruzada 5-fold)

| Modelo | Accuracy | F1-macro |
|--------|----------|----------|
| Gradient Boosting | 0.780 | **0.784** |
| Random Forest | 0.765 | 0.769 |
| Regresión Logística | 0.658 | 0.662 |
| Baseline (DummyClassifier) | 0.360 | 0.176 |

Confirmación en test (hold-out 20 %): Gradient Boosting 79,3 % accuracy / 79,9 % F1-macro.

## Hallazgo clave

> Gana Gradient Boosting, con un F1-macro de 0,784 en validación cruzada, un 18 % por encima de la regresión logística, y 0,799 en test. El orden de los modelos es el mismo en validación cruzada y en test, y eso me da confianza para desplegarlo.
>
> La importancia de variables muestra qué datos demográficos y de viaje pesan más en el segmento, que es por donde empezaría a diseñar las campañas.

## Librerías principales

- `pandas`, `numpy`, `matplotlib`, `seaborn`, `scikit-learn`, `statsmodels`, `scipy`
