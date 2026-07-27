# Machine Learning

Modelos supervisados, no supervisados, redes neuronales y series temporales.
35 casos prácticos con Python, scikit-learn, TensorFlow/Keras y statsmodels.

**Stack:** Python 3.10 · scikit-learn · TensorFlow · Keras · pandas · NumPy · minisom · statsmodels · pmdarima · xgboost

---

## Estructura

Los proyectos están organizados en tres niveles para facilitar la navegación:

**Categoría** (supervisado, no supervisado, redes neuronales, series temporales) → **Familia de modelo** (regresión lineal, K-means, MLP, ARIMA…) → **Caso práctico** individual.

```
03-Machine-Learning/
├── 01-supervisado/
│   ├── regresion/                         Predecir un valor numérico continuo
│   │   ├── 01-regresion-lineal-simple/    (3 casos)
│   │   ├── 02-regresion-lineal-multiple/  (2 casos)
│   │   ├── 03-ridge-lasso/                (1 caso)
│   │   ├── 04-gradient-boosting/          (2 casos)
│   │   └── 05-svm/                        (2 casos)
│   └── clasificacion/                     Predecir una categoría
│       ├── 01-arbol-decision/             (1 caso)
│       ├── 02-random-forest/              (1 caso)
│       ├── 03-xgboost/                    (1 caso)
│       ├── 04-comparativa-modelos/        (2 casos)
│       └── 05-regresion-logistica/        (2 casos)
├── 02-no-supervisado/
│   ├── clustering/                        Agrupar por similitud
│   │   ├── kmeans/                        (3 casos)
│   │   └── jerarquico/                    (4 casos)
│   └── reduccion-dimensionalidad/
│       └── pca/                           (2 casos)
├── 03-redes-neuronales/
│   ├── mlp/                               Multilayer Perceptron (4 casos)
│   ├── cnn/                               Convolutional Neural Network (1 caso)
│   └── som/                               Self-Organizing Maps (2 casos)
└── 04-series-temporales/
    └── arima/                             (2 casos)
```

---

## 01. Aprendizaje Supervisado

Modelos que aprenden a partir de datos etiquetados. Dos grandes familias: predecir un número (regresión) o predecir una categoría (clasificación).

### Regresión — predecir un número continuo

**Regresión Lineal Simple** · [`01-supervisado/regresion/01-regresion-lineal-simple/`](01-supervisado/regresion/01-regresion-lineal-simple/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Precios inmobiliarios](01-supervisado/regresion/01-regresion-lineal-simple/01-inmobiliaria/) | `datos_regresion_casas.xlsx` |
| 02 | [Colesterol y hábitos de salud](01-supervisado/regresion/01-regresion-lineal-simple/02-salud/) | `Patient_Health_ALUMNOS.csv` |
| 03 | [Regresión en datos de gimnasio](01-supervisado/regresion/01-regresion-lineal-simple/03-gym/) | Clientes gym |

**Regresión Lineal Múltiple** · [`01-supervisado/regresion/02-regresion-lineal-multiple/`](01-supervisado/regresion/02-regresion-lineal-multiple/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [ROI publicitario](01-supervisado/regresion/02-regresion-lineal-multiple/01-publicidad/) | `Advertising.csv` |
| 02 | [Retención clientes gimnasio](01-supervisado/regresion/02-regresion-lineal-multiple/02-gimnasio/) | Clientes gym |

**Regularización — Ridge y Lasso** · [`01-supervisado/regresion/03-ridge-lasso/`](01-supervisado/regresion/03-ridge-lasso/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Ridge y Lasso con validación cruzada](01-supervisado/regresion/03-ridge-lasso/01-regularizacion/) | scikit-learn |

**Gradient Boosting** · [`01-supervisado/regresion/04-gradient-boosting/`](01-supervisado/regresion/04-gradient-boosting/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Precios inmobiliarios](01-supervisado/regresion/04-gradient-boosting/01-inmobiliaria/) | Tasación viviendas |
| 02 | [Tasación de viviendas](01-supervisado/regresion/04-gradient-boosting/02-tasacion-viviendas/) | Tasación viviendas |

**Support Vector Machine (SVR)** · [`01-supervisado/regresion/05-svm/`](01-supervisado/regresion/05-svm/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Predicción gasto e-commerce](01-supervisado/regresion/05-svm/01-iphone/) | Clientes e-commerce |
| 02 | [Degradación de baterías](01-supervisado/regresion/05-svm/02-baterias/) | Baterías |

### Clasificación — predecir una categoría

**Árbol de Decisión** · [`01-supervisado/clasificacion/01-arbol-decision/`](01-supervisado/clasificacion/01-arbol-decision/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Perfilado clientes gimnasio](01-supervisado/clasificacion/01-arbol-decision/) | Clientes gym |

**Random Forest** · [`01-supervisado/clasificacion/02-random-forest/`](01-supervisado/clasificacion/02-random-forest/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Satisfacción clientes gimnasio](01-supervisado/clasificacion/02-random-forest/) | Clientes gym |

**XGBoost** · [`01-supervisado/clasificacion/03-xgboost/`](01-supervisado/clasificacion/03-xgboost/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Satisfacción clientes gimnasio](01-supervisado/clasificacion/03-xgboost/) | Clientes gym |

**Comparativa de modelos** · [`01-supervisado/clasificacion/04-comparativa-modelos/`](01-supervisado/clasificacion/04-comparativa-modelos/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Gimnasio — comparativa 3 modelos](01-supervisado/clasificacion/04-comparativa-modelos/01-gimnasio/) | Clientes gym |
| 02 | [Churn de clientes — comparativa 3 modelos](01-supervisado/clasificacion/04-comparativa-modelos/02-churn-clientes/) | `customer churn.xlsx` |

**Regresión Logística** · [`01-supervisado/clasificacion/05-regresion-logistica/`](01-supervisado/clasificacion/05-regresion-logistica/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Churn gimnasio](01-supervisado/clasificacion/05-regresion-logistica/01-gimnasio/) | Clientes gym |
| 02 | [Admisión universitaria](01-supervisado/clasificacion/05-regresion-logistica/02-universidad/) | `admitidos.xlsx` |

---

## 02. Aprendizaje No Supervisado

Modelos que descubren patrones sin etiquetas previas. Se aplican en segmentación de clientes, reducción de dimensionalidad y análisis exploratorio.

### Clustering

**K-Means** · [`02-no-supervisado/clustering/kmeans/`](02-no-supervisado/clustering/kmeans/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Caso introductorio](02-no-supervisado/clustering/kmeans/01-caso-introductorio/) | Mall Customers (Kaggle) |
| 02 | [Caso avanzado gimnasio](02-no-supervisado/clustering/kmeans/02-caso-avanzado/) | Clientes gym |
| 03 | [Segmentación política](02-no-supervisado/clustering/kmeans/03-segmentacion-politica/) | `politicos.xlsx` |

**Clustering Jerárquico** · [`02-no-supervisado/clustering/jerarquico/`](02-no-supervisado/clustering/jerarquico/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Caso introductorio](02-no-supervisado/clustering/jerarquico/01-caso-introductorio/) | Sintético |
| 02 | [Caso avanzado gimnasio](02-no-supervisado/clustering/jerarquico/02-caso-avanzado/) | Clientes gym |
| 03 | [Caso completo con dendrograma](02-no-supervisado/clustering/jerarquico/03-caso-completo/) | make_blobs |
| 04 | [Gimnasio con 4 variables](02-no-supervisado/clustering/jerarquico/04-gimnasio-4variables/) | Clientes gym |

### Reducción de dimensionalidad

**PCA — Principal Component Analysis** · [`02-no-supervisado/reduccion-dimensionalidad/pca/`](02-no-supervisado/reduccion-dimensionalidad/pca/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Análisis de emails](02-no-supervisado/reduccion-dimensionalidad/pca/01-analisis-emails/) | `PCA.xlsx` |
| 02 | [Segmentación de empleados](02-no-supervisado/reduccion-dimensionalidad/pca/02-segmentacion-empleados/) | `employees.xlsx` |

---

## 03. Redes Neuronales

Modelos inspirados en el cerebro humano. Desde el clásico Perceptrón Multicapa hasta convolucionales para visión artificial y Self-Organizing Maps para clustering visual.

**MLP — Multilayer Perceptron** · [`03-redes-neuronales/mlp/`](03-redes-neuronales/mlp/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Caso completo](03-redes-neuronales/mlp/01-caso-completo/) | scikit-learn |
| 02 | [Clasificación Fintech](03-redes-neuronales/mlp/02-clasificacion-fintech/) | Fintech |
| 03 | [Forecast consumo eléctrico](03-redes-neuronales/mlp/03-forecast-consumo-electrico/) | `electricidad.xlsx` |
| 04 | [Clasificación imágenes gatos/perros](03-redes-neuronales/mlp/04-clasificacion-imagenes-gatos/) | Dogs vs. Cats (Kaggle) |

**CNN — Convolutional Neural Network** · [`03-redes-neuronales/cnn/`](03-redes-neuronales/cnn/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Visión artificial gatos/perros](03-redes-neuronales/cnn/01-vision-artificial/) | Dogs vs. Cats (Kaggle) |

**SOM — Self-Organizing Maps** · [`03-redes-neuronales/som/`](03-redes-neuronales/som/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Casos introductorios](03-redes-neuronales/som/01-casos-introductorios/) | `dataset_SOM.xlsx` |
| 02 | [Segmentación jugadores de fútbol](03-redes-neuronales/som/02-jugadores-futbol/) | `jugadores_futbol.xlsx` |

---

## 04. Series Temporales

Modelos para predecir valores futuros a partir de datos históricos secuenciales.

**ARIMA** · [`04-series-temporales/arima/`](04-series-temporales/arima/)

| # | Caso | Dataset |
|---|---|---|
| 01 | [Caso completo](04-series-temporales/arima/01-caso-completo/) | `arima.xlsx` |
| 02 | [Forecast consumo eléctrico](04-series-temporales/arima/02-forecast-electricidad/) | `electricidad.xlsx` |

---

## Cómo ejecutar los notebooks

```bash
# 1. Clonar el repositorio
git clone https://github.com/borja-mora/Data-Analytics-Portfolio.git
cd Data-Analytics-Portfolio/03-Machine-Learning

# 2. Crear entorno virtual (recomendado)
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # Linux/Mac

# 3. Instalar dependencias
pip install pandas numpy matplotlib seaborn scikit-learn tensorflow minisom statsmodels pmdarima xgboost jupyter

# 4. Navegar al proyecto y abrir Jupyter
cd 01-supervisado/regresion/01-regresion-lineal-simple/01-inmobiliaria/
jupyter notebook notebook.ipynb
```

Cada notebook está diseñado para ser autónomo: dentro de su carpeta encontrarás el código y (cuando el peso lo permite) el dataset asociado. Todas las rutas son relativas al notebook — no es necesario editar nada.

---

[Volver al portfolio principal](../README.md)
