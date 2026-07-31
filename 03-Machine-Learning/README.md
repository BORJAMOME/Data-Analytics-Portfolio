# Machine Learning — 35 Casos Prácticos

> Colección completa de proyectos de Machine Learning desarrollados durante el **Bootcamp de Data Analytics en [Neoland](https://www.neoland.es/)** (mayo – julio 2026). Desde regresión lineal simple hasta redes neuronales convolucionales, cada notebook sigue una estructura profesional: contexto de negocio, exploración, modelado, evaluación y conclusión accionable.

**Autor:** [Borja Mora Méndez](https://www.linkedin.com/in/borja-mora-mendez/) · Madrid, 2026

---

Cada notebook está construido como un **caso de consultoría**: empieza con una pregunta de negocio, elige el modelo adecuado (no el más complejo), evalúa con métricas relevantes y termina con una recomendación clara. Cuando un modelo no funciona, se documenta por qué — porque saber cuándo **no** usar un algoritmo es tan valioso como saber usarlo.

**Lo que encontrarás aquí:**

- **35 notebooks** organizados por tipo de aprendizaje y familia de modelo
- **15 datasets** reales y didácticos de sectores como fitness, inmobiliaria, e-commerce, fintech, energía y deporte
- **Comparativas rigurosas** entre modelos (DT vs RF vs XGBoost) con recomendación de despliegue
- **Progresión deliberada** de lo simple a lo complejo: cada técnica nueva se justifica frente a la anterior

---

## Stack técnico

```
Python 3.10 · scikit-learn · TensorFlow/Keras · XGBoost · statsmodels · pmdarima · minisom
pandas · NumPy · Matplotlib · Seaborn · SciPy · openpyxl
```

---

## Highlights — 5 notebooks que recomiendo leer primero

Si tienes poco tiempo, estos cinco casos muestran el rango completo de técnicas y pensamiento analítico:

| # | Notebook | Por qué destaca |
|---|---|---|
| 1 | [Comparativa DT vs RF vs XGBoost — Gimnasio](01-supervisado/clasificacion/04-comparativa-modelos/01-gimnasio/) | 3 algoritmos sobre el mismo dataset. Conclusión contraintuitiva: el árbol simple gana. Demuestra criterio para elegir modelo. |
| 2 | [CNN — Visión artificial gatos/perros](03-redes-neuronales/cnn/01-vision-artificial/) | Deep learning aplicado: Conv2D, MaxPooling, data augmentation. El salto de MLP a CNN con el mismo dataset. |
| 3 | [Forecast eléctrico — ARIMA](04-series-temporales/arima/02-forecast-electricidad/) | Series temporales reales: estacionariedad, diferenciación, auto_arima, predicción a futuro. |
| 4 | [PCA — Segmentación de empleados](02-no-supervisado/reduccion-dimensionalidad/pca/02-segmentacion-empleados/) | Reducción de 6 variables a 2 componentes principales. Clustering sobre el espacio reducido. |
| 5 | [SVR — Degradación de baterías](01-supervisado/regresion/05-svm/02-baterias/) | SVM aplicado a regresión con kernel RBF. Problema de ingeniería real con datos no lineales. |

---

## Estructura del repositorio

Los proyectos están organizados en tres niveles: **Categoría** → **Familia de modelo** → **Caso práctico**.

```
03-Machine-Learning/
│
├── 01-supervisado/                          17 notebooks
│   ├── regresion/                           Predecir un valor numérico continuo
│   │   ├── 01-regresion-lineal-simple/      3 casos · R² desde 0.65 hasta 0.97
│   │   ├── 02-regresion-lineal-multiple/    2 casos · Colinealidad, VIF, selección de variables
│   │   ├── 03-ridge-lasso/                  1 caso  · Regularización L1/L2, validación cruzada
│   │   ├── 04-gradient-boosting/            2 casos · Ensemble secuencial, hiperparámetros
│   │   └── 05-svm/                          2 casos · Kernels RBF, regresión no lineal
│   │
│   └── clasificacion/                       Predecir una categoría
│       ├── 01-arbol-decision/               1 caso  · Interpretabilidad, feature importance
│       ├── 02-random-forest/                1 caso  · Ensemble bagging, OOB score
│       ├── 03-xgboost/                      1 caso  · GridSearchCV, gradient boosting
│       ├── 04-comparativa-modelos/          2 casos · Benchmark DT vs RF vs XGBoost
│       └── 05-regresion-logistica/          2 casos · Clasificación probabilística, curva ROC
│
├── 02-no-supervisado/                       9 notebooks
│   ├── clustering/                          Agrupar por similitud
│   │   ├── kmeans/                          3 casos · Método del codo, silueta, inercia
│   │   └── jerarquico/                      4 casos · Dendrogramas, linkage, distancias
│   │
│   └── reduccion-dimensionalidad/
│       └── pca/                             2 casos · Varianza explicada, biplot
│
├── 03-redes-neuronales/                     7 notebooks
│   ├── mlp/                                 4 casos · Clasificación, forecast, imágenes
│   ├── cnn/                                 1 caso  · Conv2D, MaxPooling, data augmentation
│   └── som/                                 2 casos · Mapas autoorganizados, clustering visual
│
└── 04-series-temporales/                    2 notebooks
    └── arima/                               2 casos · Estacionariedad, auto_arima, forecast
```

---

## 01 · Aprendizaje Supervisado

Modelos que aprenden a partir de datos etiquetados. Dos grandes familias: predecir un número (regresión) o predecir una categoría (clasificación).

### Regresión — predecir un valor numérico continuo

**Regresión Lineal Simple** · [`regresion/01-regresion-lineal-simple/`](01-supervisado/regresion/01-regresion-lineal-simple/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Precios inmobiliarios](01-supervisado/regresion/01-regresion-lineal-simple/01-inmobiliaria/) | OLS, supuestos, residuos | `datos_regresion_casas.xlsx` |
| 02 | [Colesterol y salud](01-supervisado/regresion/01-regresion-lineal-simple/02-salud/) | R² alto en datos sintéticos: por qué no fiarse | `patient_health.csv` |
| 03 | [Gasto extra gimnasio](01-supervisado/regresion/01-regresion-lineal-simple/03-gym/) | Simple vs múltiple: cuándo añadir variables mejora | `gym_clientes.xlsx` |

**Regresión Lineal Múltiple** · [`regresion/02-regresion-lineal-multiple/`](01-supervisado/regresion/02-regresion-lineal-multiple/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [ROI publicitario](01-supervisado/regresion/02-regresion-lineal-multiple/01-publicidad/) | Selección de variables, p-valores, R² ajustado | `Advertising.csv` |
| 02 | [Retención clientes gimnasio](01-supervisado/regresion/02-regresion-lineal-multiple/02-gimnasio/) | Colinealidad, VIF, diagnóstico de modelo | `gym_clientes.xlsx` |

**Regularización — Ridge y Lasso** · [`regresion/03-ridge-lasso/`](01-supervisado/regresion/03-ridge-lasso/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Ridge y Lasso con validación cruzada](01-supervisado/regresion/03-ridge-lasso/01-regularizacion/) | L1 vs L2, alpha óptimo, selección automática de variables | scikit-learn |

**Gradient Boosting** · [`regresion/04-gradient-boosting/`](01-supervisado/regresion/04-gradient-boosting/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Precios inmobiliarios](01-supervisado/regresion/04-gradient-boosting/01-inmobiliaria/) | Ensemble secuencial, learning rate, n_estimators | Tasación viviendas |
| 02 | [Tasación de viviendas](01-supervisado/regresion/04-gradient-boosting/02-tasacion-viviendas/) | Feature importance, comparativa con regresión lineal | Tasación viviendas |

**Support Vector Machine (SVR)** · [`regresion/05-svm/`](01-supervisado/regresion/05-svm/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Predicción gasto e-commerce](01-supervisado/regresion/05-svm/01-iphone/) | Kernel lineal vs RBF, escalado de features | Clientes e-commerce |
| 02 | [Degradación de baterías](01-supervisado/regresion/05-svm/02-baterias/) | SVM en problemas de ingeniería con relaciones no lineales | Baterías |

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
| 01 | [Gimnasio — DT vs RF vs XGBoost](01-supervisado/clasificacion/04-comparativa-modelos/01-gimnasio/) | Benchmark riguroso, recomendación de despliegue | `gym_clientes.xlsx` |
| 02 | [Churn — DT vs RF vs XGBoost](01-supervisado/clasificacion/04-comparativa-modelos/02-churn-clientes/) | Churn prediction, datos reales con ruido | `customer churn.xlsx` |

**Regresión Logística** · [`clasificacion/05-regresion-logistica/`](01-supervisado/clasificacion/05-regresion-logistica/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Churn gimnasio](01-supervisado/clasificacion/05-regresion-logistica/01-gimnasio/) | Clasificación probabilística, umbral de decisión | `gym_clientes.xlsx` |
| 02 | [Admisión universitaria](01-supervisado/clasificacion/05-regresion-logistica/02-universidad/) | Curva ROC, AUC, interpretación de coeficientes | `admitidos.xlsx` |

---

## 02 · Aprendizaje No Supervisado

Modelos que descubren patrones sin etiquetas previas. Segmentación de clientes, reducción de dimensionalidad y análisis exploratorio.

### Clustering

**K-Means** · [`clustering/kmeans/`](02-no-supervisado/clustering/kmeans/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Caso introductorio](02-no-supervisado/clustering/kmeans/01-caso-introductorio/) | Método del codo, silueta, visualización 2D | Mall Customers (Kaggle) |
| 02 | [Caso avanzado gimnasio](02-no-supervisado/clustering/kmeans/02-caso-avanzado/) | Escalado, StandardScaler, perfiles de segmento | `gym_clientes.xlsx` |
| 03 | [Segmentación política](02-no-supervisado/clustering/kmeans/03-segmentacion-politica/) | Clustering en datos categóricos transformados | `politicos.xlsx` |

**Clustering Jerárquico** · [`clustering/jerarquico/`](02-no-supervisado/clustering/jerarquico/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Caso introductorio](02-no-supervisado/clustering/jerarquico/01-caso-introductorio/) | Dendrograma, linkage, distancia de corte | Sintético |
| 02 | [Caso avanzado gimnasio](02-no-supervisado/clustering/jerarquico/02-caso-avanzado/) | Ward vs complete linkage, comparativa con K-Means | `gym_clientes.xlsx` |
| 03 | [Caso completo con dendrograma](02-no-supervisado/clustering/jerarquico/03-caso-completo/) | Pipeline completo de clustering jerárquico | make_blobs |
| 04 | [Gimnasio con 4 variables](02-no-supervisado/clustering/jerarquico/04-gimnasio-4variables/) | Efecto de añadir dimensiones al clustering | `gym_clientes.xlsx` |

### Reducción de dimensionalidad

**PCA — Principal Component Analysis** · [`reduccion-dimensionalidad/pca/`](02-no-supervisado/reduccion-dimensionalidad/pca/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Análisis de emails](02-no-supervisado/reduccion-dimensionalidad/pca/01-analisis-emails/) | Varianza explicada, scree plot, loadings | `PCA.xlsx` |
| 02 | [Segmentación de empleados](02-no-supervisado/reduccion-dimensionalidad/pca/02-segmentacion-empleados/) | PCA + clustering: reducir para segmentar | `employees.xlsx` |

---

## 03 · Redes Neuronales

Desde el Perceptrón Multicapa clásico hasta convolucionales para visión artificial y Self-Organizing Maps para clustering visual.

**MLP — Multilayer Perceptron** · [`mlp/`](03-redes-neuronales/mlp/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Caso completo](03-redes-neuronales/mlp/01-caso-completo/) | Arquitectura, activaciones, epochs, early stopping | scikit-learn |
| 02 | [Clasificación Fintech](03-redes-neuronales/mlp/02-clasificacion-fintech/) | MLP en datos tabulares financieros | Fintech |
| 03 | [Forecast consumo eléctrico](03-redes-neuronales/mlp/03-forecast-consumo-electrico/) | RRNN para series temporales: ventanas deslizantes | `electricidad.xlsx` |
| 04 | [Clasificación imágenes gatos/perros](03-redes-neuronales/mlp/04-clasificacion-imagenes-gatos/) | MLP en imágenes: limitaciones sin convolución | Dogs vs. Cats (Kaggle) |

**CNN — Convolutional Neural Network** · [`cnn/`](03-redes-neuronales/cnn/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Visión artificial gatos/perros](03-redes-neuronales/cnn/01-vision-artificial/) | Conv2D, MaxPooling, data augmentation, transfer learning | Dogs vs. Cats (Kaggle) |

**SOM — Self-Organizing Maps** · [`som/`](03-redes-neuronales/som/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Casos introductorios](03-redes-neuronales/som/01-casos-introductorios/) | Topología 2D, mapeo de alta dimensión | `dataset_SOM.xlsx` |
| 02 | [Segmentación jugadores de fútbol](03-redes-neuronales/som/02-jugadores-futbol/) | SOM para perfilado deportivo multivariable | `jugadores_futbol.xlsx` |

---

## 04 · Series Temporales

Modelos para predecir valores futuros a partir de datos históricos secuenciales.

**ARIMA** · [`arima/`](04-series-temporales/arima/)

| # | Caso | Qué se aprende | Dataset |
|---|---|---|---|
| 01 | [Caso completo](04-series-temporales/arima/01-caso-completo/) | Estacionariedad, ACF/PACF, selección de (p,d,q) | `arima.xlsx` |
| 02 | [Forecast consumo eléctrico](04-series-temporales/arima/02-forecast-electricidad/) | auto_arima, predicción a futuro, intervalos de confianza | `electricidad.xlsx` |

---

## Cómo ejecutar los notebooks

```bash
# 1. Clonar el repositorio
git clone https://github.com/BORJAMOME/Data-Analytics-Portfolio.git
cd Data-Analytics-Portfolio/03-Machine-Learning

# 2. Crear entorno virtual (recomendado)
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # Linux/Mac

# 3. Instalar dependencias
pip install pandas numpy matplotlib seaborn scikit-learn tensorflow minisom statsmodels pmdarima xgboost scipy openpyxl jupyter

# 4. Navegar al proyecto y abrir Jupyter
cd 01-supervisado/regresion/01-regresion-lineal-simple/01-inmobiliaria/
jupyter notebook notebook.ipynb
```

Cada notebook es autónomo: dentro de su carpeta encontrarás el código y el dataset asociado. Todas las rutas son relativas — no es necesario editar nada.

---

## Contacto

- **LinkedIn:** [linkedin.com/in/borja-mora-mendez](https://www.linkedin.com/in/borja-mora-mendez/)
- **Email:** [borja.mora.mendez@gmail.com](mailto:borja.mora.mendez@gmail.com)
- **GitHub:** [@BORJAMOME](https://github.com/BORJAMOME)

---

[← Volver al portfolio principal](../README.md)
