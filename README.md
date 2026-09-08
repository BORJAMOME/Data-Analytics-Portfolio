# Data Analytics Portfolio

Portfolio de proyectos de datos desarrollados durante el bootcamp de Data Analytics.
SQL, Python, Machine Learning e Inteligencia Artificial aplicados a casos reales de negocio.

**Autor:** Borja Mora Méndez · **Email:** borja.mora.mendez@gmail.com · **LinkedIn:** [linkedin.com/in/borjamoramendez](https://www.linkedin.com/in/borjamoramendez/)

---

## Estructura del portfolio

```
Data-Analytics-Portfolio/
├── 01-SQL/                     Consultas, modelado dimensional, ETL en T-SQL
├── 02-Python/                  4 casos de negocio EDA + 4 manuales de referencia
├── 03-Machine-Learning/        36 casos: supervisado, no supervisado, RRNN, series, refuerzo
└── 04-IA-BigData/              Agentes IA, LLMs, APIs, minería de datos, Big Data
```

Cada carpeta principal tiene su propio README con la lista de proyectos, técnicas aplicadas y accesos directos.

---

## Categorías

### [01 · SQL](01-SQL/)

**3 proyectos analíticos** con T-SQL y SQL Server: CTEs, Window Functions (ROW_NUMBER, RANK, DENSE_RANK, NTILE, LAG, LEAD), subqueries correlacionadas, PERCENTILE_CONT, sumas acumuladas y ejercicio tipo entrevista técnica.

**Stack:** T-SQL, SQL Server Management Studio, AdventureWorks2025.

| Proyecto | Qué se aprende |
|----------|---------------|
| [Análisis de ventas — Red de concesionarios](01-SQL/01-analisis-ventas-concesionarios/) | CTEs, subqueries correlacionadas, LAG, PERCENTILE_CONT, PERCENT_RANK |
| [AdventureWorks Avanzado — Window Functions](01-SQL/02-adventureworks-avanzado/) | ROW_NUMBER, RANK, DENSE_RANK, NTILE, LAG, LEAD, sumas acumuladas, examen tipo entrevista |
| [Análisis de clientes — Tienda](01-SQL/03-analisis-clientes-tienda/) | LEFT JOIN, subqueries IN/NOT IN, CASE, CTEs, Window Functions, PARTITION BY |

**[Ver la sección completa →](01-SQL/)**

### [02 · Python](02-Python/)

**4 casos de negocio + 4 manuales de referencia.** Análisis exploratorio con storytelling completo (comercial, educación, seguros, restauración) y manuales pedagógicos de Pandas, NumPy y Matplotlib.

**Stack:** pandas, numpy, matplotlib, seaborn.

**[Ver la sección completa →](02-Python/)**

### [03 · Machine Learning](03-Machine-Learning/)

**36 casos prácticos** de ML organizados por tipo de aprendizaje y familia de modelo: regresión, clasificación, clustering, PCA, t-SNE, redes neuronales (MLP, SOM), series temporales (ARIMA) y aprendizaje por refuerzo (SARSA).

**Stack:** scikit-learn, TensorFlow/Keras, XGBoost, minisom, statsmodels, pmdarima.

Los 3 casos con más recorrido — negocio, modelo y despliegue — tienen además una app interactiva en producción:

| Proyecto | Qué se aprende | App en vivo |
|----------|---------------|--------------|
| [Segmentación de clientes retail (K-Means + t-SNE)](03-Machine-Learning/02-no-supervisado/clustering/kmeans/04-segmentacion-retail-tsne/) | t-SNE para visualizar en 2D, elección honesta de *k*, validación contra el perfil que el negocio ya intuía | [Abrir app](https://segmentacion-retail.streamlit.app) |
| [Comparativa de modelos — Segmentación de aerolínea](03-Machine-Learning/01-supervisado/clasificacion/04-comparativa-modelos/04-segmentacion-aerolinea/) | Regresión Logística vs Random Forest vs Gradient Boosting, mismo split y validación cruzada, explicabilidad | [Abrir app](https://comparativa-modelos-aerolinea.streamlit.app) |
| [Previsión de ventas retail (SARIMA vs SARIMAX)](03-Machine-Learning/04-series-temporales/arima/03-forecast-ventas-retail/) | Series temporales con variables exógenas (huelgas, promociones), backtesting, cuánto aporta el contexto frente al histórico puro | [Abrir app](https://forecast-ventas-retail-app-w5msdvcsbuxas94qjcdore.streamlit.app) |

**[Ver los 36 proyectos →](03-Machine-Learning/)**

### [04 · IA & Big Data](04-IA-BigData/)
Agentes de IA, sistemas de recomendación, APIs externas con visualización interactiva, minería de datos, visión artificial y procesamiento distribuido con Apache Spark. La integración con LLMs (OpenAI, Anthropic, Groq, Ollama vía LangChain) está planificada como próxima incorporación.

**Stack:** scikit-learn (TF-IDF, similitud coseno), ipyleaflet, mlxtend, ultralytics (YOLOv8), ByteTrack, PySpark (Spark SQL, MLlib).

| Proyecto | Qué se aprende |
|----------|---------------|
| [Chatbot de reservas — Nivel 0](04-IA-BigData/01-agentes-ia/01-chatbot-reglas-restaurante/) | Motor de reglas de negocio, menú conversacional, línea base de la progresión hacia agentes con IA |
| [Recomendador de películas por contenido](04-IA-BigData/02-sistemas-recomendacion/01-recomendador-peliculas-contenido/) | Filtrado basado en contenido (TF-IDF + similitud coseno), visualización PCA del espacio de películas, cuándo usarlo frente al filtrado colaborativo |
| [Simulador de rutas reales — OSRM](04-IA-BigData/03-apis-visualizacion/01-simulador-rutas-osrm/) | Consumo de API REST, fórmula de Haversine, interpolación de rutas, mapas interactivos con ipyleaflet |
| [Cesta de la compra — Apriori](04-IA-BigData/04-mineria-datos/01-cesta-compra-apriori/) | Support/confidence/lift manual, algoritmo Apriori (mlxtend), reglas de asociación de 3+ productos |
| [Detección de objetos en imágenes](04-IA-BigData/06-vision-artificial/01-deteccion-objetos-imagenes/) | YOLOv8 preentrenado, límites de un modelo genérico frente a clases no vistas |
| [Conteo de vehículos en vídeo](04-IA-BigData/06-vision-artificial/02-conteo-vehiculos-video/) | YOLOv8 + ByteTrack, tracking de identidad entre frames, conteo por cruce de línea |
| [Pipeline de ventas distribuido con PySpark](04-IA-BigData/07-big-data-distribuido/01-pipeline-ventas-pyspark/) | Spark SQL, funciones de ventana, broadcast joins, planes de ejecución, particiones y caché, UDF vs nativo, Parquet, MLlib |

**[Ver la sección completa →](04-IA-BigData/)**

---

## Stack técnico

| Ámbito | Tecnologías |
|---|---|
| **Análisis y modelado** | Python, SQL Server (T-SQL), pandas, NumPy |
| **Machine Learning e IA** | scikit-learn, TensorFlow, Keras, statsmodels |
| **Big Data** | Apache Spark (PySpark), Spark SQL, MLlib, Parquet |
| **Business Intelligence** | Power BI, DAX, Power Query, Tabular Editor |
| **Visualización** | Matplotlib, Seaborn|
| **Entorno de desarrollo** | Jupyter, Visual Studio Code, Git, GitHub |

---

## Contacto

- **LinkedIn:** [linkedin.com/in/borjamoramendez](https://www.linkedin.com/in/borjamoramendez/)
- **Email:** [borja.mora.mendez@gmail.com](mailto:borja.mora.mendez@gmail.com)
- **GitHub:** [@BORJAMOME](https://github.com/BORJAMOME)

---
