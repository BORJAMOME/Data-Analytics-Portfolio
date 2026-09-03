# Comparativa de 3 modelos — Segmentación de clientes de aerolínea

Este notebook es el análisis completo. Si prefieres recorrer el caso como una historia interactiva — sin necesidad de tocar código — hay una aplicación en Streamlit que compara los 3 modelos y deja construir un cliente hipotético para ver si los modelos están de acuerdo sobre su segmento: **[comparativa-modelos-aerolinea-app](https://github.com/BORJAMOME/comparativa-modelos-aerolinea-app)**.

Caso de negocio: una aerolínea quiere clasificar automáticamente a sus clientes en tres segmentos (Básico, Frecuente, Premium) para diseñar acciones comerciales diferenciadas. La comparativa de tres algoritmos sobre 1 500 clientes y 20 variables revela que **Gradient Boosting alcanza un F1-macro del 78,4 %**, superando al baseline aleatorio (17,6 %) y a la Regresión Logística (66,2 %).

---

## Contexto de negocio

La aerolínea dispone de datos demográficos, de comportamiento de viaje, valor económico, incidencias, equipaje, satisfacción y fidelización de cada cliente, pero no tiene un criterio automatizado para asignar segmentos. Sin esa clasificación, las campañas de marketing y retención son genéricas e ineficientes.

## Objetivo

Comparar tres algoritmos de clasificación multiclase (Regresión Logística, Random Forest, Gradient Boosting) y decidir, con métricas robustas (validación cruzada estratificada 5-fold), cuál merece pasar a producción para asignar segmentos automáticamente.

## Dataset

`dataset_linea_aerea_multiclase_v2.xlsx` — 1 500 clientes con 20 variables agrupadas en datos demográficos, comportamiento de viaje, valor económico, incidencias, equipaje/satisfacción y fidelización. Variable objetivo: `segmento_cliente` (Básico ~34 %, Frecuente ~33 %, Premium ~33 %).

## Técnicas aplicadas

- **EDA exhaustivo** — análisis univariante, bivariante, detección de outliers (IQR, Z-score, percentiles), tratamiento con Isolation Forest
- **Feature engineering** — codificación ordinal/one-hot, escalado, imputación, detección de multicolinealidad (VIF), test ANOVA F para selección de variables, chequeo de data leakage (eta-cuadrado)
- **Regresión Logística multinomial** — modelo lineal interpretable como referencia
- **Random Forest** (100 estimadores) — modelo de ensamble con bagging
- **Gradient Boosting** (`GradientBoostingClassifier`) — boosting secuencial, techo habitual en tabulares

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

> Gradient Boosting es el modelo ganador con un F1-macro de 0,784 en validación cruzada — un 18 % mejor que la Regresión Logística y consistente con el resultado en test (0,799). El ranking coincide en CV y hold-out, lo que da confianza para desplegarlo.
>
> El análisis de feature importance revela qué variables demográficas y de comportamiento de viaje pesan más en la segmentación, abriendo la puerta a acciones comerciales dirigidas por segmento.

## Librerías principales

- `pandas`, `numpy`, `matplotlib`, `seaborn`, `scikit-learn`, `statsmodels`, `scipy`
