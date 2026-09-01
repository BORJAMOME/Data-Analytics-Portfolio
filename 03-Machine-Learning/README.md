# Machine Learning — 35 Casos Prácticos

> Colección completa de proyectos de Machine Learning desarrollados durante el **Bootcamp de Data Analytics en [Neoland](https://www.neoland.es/)** (mayo – julio 2026). Desde regresión lineal simple hasta redes neuronales y series temporales, cada notebook sigue una estructura profesional: contexto de negocio, exploración, modelado, evaluación y conclusión accionable.

**Autor:** [Borja Mora Méndez](https://www.linkedin.com/in/borjamoramendez/) · Madrid, 2026

---

Cada notebook está construido como un **caso de consultoría**: empieza con una pregunta de negocio, elige el modelo adecuado (no el más complejo), evalúa con métricas relevantes y termina con una recomendación clara. Cuando un modelo no funciona, se documenta por qué — porque saber cuándo **no** usar un algoritmo es tan valioso como saber usarlo.

**Lo que encontrarás aquí:**

- **35 notebooks** organizados por tipo de aprendizaje y familia de modelo
- **16 datasets** reales y didácticos de sectores como fitness, inmobiliaria, e-commerce, fintech, energía, retail y deporte
- **Comparativas rigurosas** entre modelos (DT vs RF vs XGBoost) con recomendación de despliegue
- **Progresión deliberada** de lo simple a lo complejo: cada técnica nueva se justifica frente a la anterior

---

## Estructura del repositorio

Los proyectos están organizados en tres niveles: **Categoría** → **Familia de modelo** → **Caso práctico**.

```
03-Machine-Learning/
│
├── 01-supervisado/                          17 notebooks
│   ├── regresion/                           Predecir un valor numérico continuo
│   │   ├── 01-regresion-lineal-simple/      2 casos · R² desde 0.75 hasta 0.97
│   │   ├── 02-regresion-lineal-multiple/    2 casos · Colinealidad, VIF, selección de variables
│   │   ├── 03-ridge-lasso/                  1 caso  · Regularización L1/L2, validación cruzada
│   │   └── 04-gradient-boosting/            2 casos · Ensemble secuencial, hiperparámetros
│   │
│   └── clasificacion/                       Predecir una categoría
│       ├── 01-arbol-decision/               1 caso  · Interpretabilidad, feature importance
│       ├── 02-random-forest/                1 caso  · Ensemble bagging, OOB score
│       ├── 03-xgboost/                      1 caso  · GridSearchCV, gradient boosting
│       ├── 04-comparativa-modelos/          2 casos · Benchmark DT vs RF vs XGBoost
│       ├── 05-regresion-logistica/          2 casos · Clasificación probabilística, curva ROC
│       ├── 06-svm/                          2 casos · Kernels polinómico y RBF, clasificación
│       └── 07-naive-bayes/                  1 caso  · Clasificación de texto, CountVectorizer vs TF-IDF
│
├── 02-no-supervisado/                       10 notebooks
│   ├── clustering/                          Agrupar por similitud
│   │   ├── kmeans/                          4 casos · Método del codo, silueta, inercia, t-SNE
│   │   └── jerarquico/                      4 casos · Dendrogramas, linkage, distancias
│   │
│   └── reduccion-dimensionalidad/
│       └── pca/                             2 casos · Varianza explicada, biplot
│
├── 03-redes-neuronales/                     6 notebooks
│   ├── mlp/                                 4 casos · Fundamentos, fintech, forecast eléctrico, sentimiento IMDB
│   └── som/                                 2 casos · Mapas autoorganizados, clustering visual
│
└── 04-series-temporales/                    2 notebooks
    └── arima/                               2 casos · Estacionariedad, SARIMA, forecast
```

---

## 01 · Aprendizaje Supervisado

Modelos que aprenden a partir de datos etiquetados. Dos grandes familias: predecir un número (regresión) o predecir una categoría (clasificación).

### Regresión — predecir un valor numérico continuo

**Regresión Lineal Simple** · [`regresion/01-regresion-lineal-simple/`](01-supervisado/regresion/01-regresion-lineal-simple/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Precios inmobiliarios](01-supervisado/regresion/01-regresion-lineal-simple/01-precio-viviendas/) | OLS, supuestos, residuos | `datos_regresion_casas.xlsx` |
| 02 | [Colesterol y salud](01-supervisado/regresion/01-regresion-lineal-simple/02-colesterol-bmi/) | R² alto en datos sintéticos: por qué no fiarse | `patient_health.csv` |

**Regresión Lineal Múltiple** · [`regresion/02-regresion-lineal-multiple/`](01-supervisado/regresion/02-regresion-lineal-multiple/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [ROI publicitario](01-supervisado/regresion/02-regresion-lineal-multiple/01-ventas-publicidad/) | Selección de variables, p-valores, R² ajustado | `Advertising.csv` |
| 02 | [Gasto extra gimnasio](01-supervisado/regresion/02-regresion-lineal-multiple/02-gasto-extra-gimnasio/) | Colinealidad, VIF, diagnóstico de modelo | `gym_clientes.xlsx` |

**Regularización — Ridge y Lasso** · [`regresion/03-ridge-lasso/`](01-supervisado/regresion/03-ridge-lasso/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Ridge y Lasso con validación cruzada](01-supervisado/regresion/03-ridge-lasso/01-comparativa-regularizacion/) | L1 vs L2, alpha óptimo, selección automática de variables | `viviendas_vigo.xlsx` |

**Gradient Boosting** · [`regresion/04-gradient-boosting/`](01-supervisado/regresion/04-gradient-boosting/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Tasación de viviendas](01-supervisado/regresion/04-gradient-boosting/01-tasacion-viviendas/) | Ensemble secuencial, feature importance, comparativa con regresión lineal | Tasación viviendas |
| 02 | [Tiempo de carrera de 5K](01-supervisado/regresion/04-gradient-boosting/02-tiempo-carrera-5k/) | Detección de filas casi duplicadas, evaluación honesta sin fuga de datos | Corredores (sintético) |

### Clasificación — predecir una categoría

**Árbol de Decisión** · [`clasificacion/01-arbol-decision/`](01-supervisado/clasificacion/01-arbol-decision/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Perfilado clientes gimnasio](01-supervisado/clasificacion/01-arbol-decision/) | Interpretabilidad, Gini, poda, profundidad óptima | `gym_clientes.xlsx` |

**Random Forest** · [`clasificacion/02-random-forest/`](01-supervisado/clasificacion/02-random-forest/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Satisfacción clientes gimnasio](01-supervisado/clasificacion/02-random-forest/) | Bagging, OOB score, importancia Gini vs Permutación | `gym_clientes.xlsx` |

**XGBoost** · [`clasificacion/03-xgboost/`](01-supervisado/clasificacion/03-xgboost/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Satisfacción clientes gimnasio](01-supervisado/clasificacion/03-xgboost/) | GridSearchCV, gradient boosting, cuándo NO escalar complejidad | `gym_clientes.xlsx` |

**Comparativa de modelos** · [`clasificacion/04-comparativa-modelos/`](01-supervisado/clasificacion/04-comparativa-modelos/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Gimnasio — DT vs RF vs XGBoost](01-supervisado/clasificacion/04-comparativa-modelos/01-satisfaccion-gimnasio/) | Benchmark riguroso, recomendación de despliegue | `gym_clientes.xlsx` |
| 02 | [Churn — DT vs RF vs XGBoost](01-supervisado/clasificacion/04-comparativa-modelos/02-churn-clientes/) | Churn prediction, resultado negativo documentado | `customer churn.xlsx` |

**Regresión Logística** · [`clasificacion/05-regresion-logistica/`](01-supervisado/clasificacion/05-regresion-logistica/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Abandono gimnasio](01-supervisado/clasificacion/05-regresion-logistica/01-satisfaccion-gimnasio/) | Odds ratios, VIF, inferencia estadística con statsmodels | `gym_clientes.xlsx` |
| 02 | [Admisión universitaria](01-supervisado/clasificacion/05-regresion-logistica/02-admision-universidad/) | Curva ROC, AUC, frontera de decisión 2D | `admitidos.xlsx` |

**Support Vector Machine** · [`clasificacion/06-svm/`](01-supervisado/clasificacion/06-svm/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Propensión de compra iPhone](01-supervisado/clasificacion/06-svm/01-compra-iphone/) | SVC con kernel lineal, polinómico y RBF, escalado de features | Clientes e-commerce |
| 02 | [Reemplazo de baterías](01-supervisado/clasificacion/06-svm/02-reemplazo-baterias/) | SVC con kernel lineal y polinómico, mantenimiento predictivo | Baterías |

**Naive Bayes** · [`clasificacion/07-naive-bayes/`](01-supervisado/clasificacion/07-naive-bayes/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Detección de SMS spam](01-supervisado/clasificacion/07-naive-bayes/) | CountVectorizer vs TF-IDF (no siempre gana el más sofisticado), interpretabilidad, límite de dominio | `sms_spam.xlsx` |

---

## 02 · Aprendizaje No Supervisado

Modelos que descubren patrones sin etiquetas previas. Segmentación de clientes, reducción de dimensionalidad y análisis exploratorio.

### Clustering

**K-Means** · [`clustering/kmeans/`](02-no-supervisado/clustering/kmeans/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Segmentación clientes retail](02-no-supervisado/clustering/kmeans/01-segmentacion-clientes-retail/) | Método del codo, silueta, visualización 2D | Sintético (200 clientes) |
| 02 | [Segmentación gimnasio](02-no-supervisado/clustering/kmeans/02-segmentacion-gimnasio/) | Escalado, estabilidad de clusters, cross-check con abandono | `gym_clientes.xlsx` |
| 03 | [Segmentación votantes](02-no-supervisado/clustering/kmeans/03-segmentacion-votantes/) | Feature selection: elegir bien las variables importa más que el algoritmo | `politicos.xlsx` |
| 04 | [Segmentación retail con t-SNE](02-no-supervisado/clustering/kmeans/04-segmentacion-retail-tsne/) | t-SNE para visualizar en 2D, elección honesta de k, evaluación contra perfil ya asignado | Clientes retail (6.457 filas) |

**Clustering Jerárquico** · [`clustering/jerarquico/`](02-no-supervisado/clustering/jerarquico/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Segmentación e-commerce](02-no-supervisado/clustering/jerarquico/01-segmentacion-ecommerce/) | Dendrograma, 4 métodos de linkage, comparación visual | Sintético (30 usuarios) |
| 02 | [Perfiles gimnasio](02-no-supervisado/clustering/jerarquico/02-perfiles-gimnasio/) | Ward + StandardScaler, cross-check con abandono | `gym_clientes.xlsx` |
| 03 | [Segmentación banca](02-no-supervisado/clustering/jerarquico/03-segmentacion-banca/) | Coeficiente cofenético, silhouette plot, heatmap de perfiles | Sintético (300 clientes) |
| 04 | [Perfiles gimnasio con radar](02-no-supervisado/clustering/jerarquico/04-perfiles-gimnasio-radar/) | Radar charts, PCA 2D, personas de marketing | `gym_clientes.xlsx` |

### Reducción de dimensionalidad

**PCA — Principal Component Analysis** · [`reduccion-dimensionalidad/pca/`](02-no-supervisado/reduccion-dimensionalidad/pca/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Análisis de comportamiento de clientes](02-no-supervisado/reduccion-dimensionalidad/pca/01-comportamiento-clientes-email/) | Varianza explicada, scree plot, biplot, loadings | `PCA.xlsx` |
| 02 | [Segmentación de empleados](02-no-supervisado/reduccion-dimensionalidad/pca/02-segmentacion-empleados/) | PCA + K-Means: reducir para segmentar | `employees.xlsx` |

---

## 03 · Redes Neuronales

Desde el Perceptrón Multicapa para clasificación y forecast hasta Self-Organizing Maps para clustering visual.

**MLP — Multilayer Perceptron** · [`mlp/`](03-redes-neuronales/mlp/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 00 | [Fundamentos: capas ocultas](03-redes-neuronales/mlp/00-fundamentos-capas-ocultas/) | Por qué un modelo lineal no resuelve círculos concéntricos ni XOR, y un MLP sí | Sintético (círculos, XOR) |
| 01 | [Clasificación Fintech](03-redes-neuronales/mlp/01-clasificacion-fintech/) | MLP vs Regresión Logística vs Random Forest en credit scoring | Sintético (100 solicitantes) |
| 02 | [Forecast consumo eléctrico](03-redes-neuronales/mlp/02-forecast-consumo-electrico/) | Feature engineering temporal, lag features, comparativa con RF | `electricidad.xlsx` |
| 03 | [Sentimiento en reseñas IMDB](03-redes-neuronales/mlp/03-clasificacion-sentimiento-imdb/) | Embedding + pooling en NLP, TF-IDF+LogReg supera al MLP | IMDB (25.000 reseñas) |

**SOM — Self-Organizing Maps** · [`som/`](03-redes-neuronales/som/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Segmentación de clientes](03-redes-neuronales/som/01-segmentacion-clientes/) | SOM 10×10, U-matrix, hit map, perfiles de cluster | Sintético (200 clientes) |
| 02 | [Jugadores de fútbol](03-redes-neuronales/som/02-jugadores-futbol/) | SOM para scouting deportivo, component planes, radar charts | `jugadores_futbol.xlsx` |

---

## 04 · Series Temporales

Modelos clásicos de forecasting aplicados a demanda y consumo.

**ARIMA** · [`arima/`](04-series-temporales/arima/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Ventas semanales retail](04-series-temporales/arima/01-ventas-semanales-retail/) | ACF/PACF, estacionariedad, ADF test, SARIMA con estacionalidad anual | `arima.xlsx` |
| 02 | [Forecast electricidad](04-series-temporales/arima/02-forecast-electricidad/) | Descomposición estacional, SARIMAX, validación walk-forward | `electricidad.xlsx` |

---
