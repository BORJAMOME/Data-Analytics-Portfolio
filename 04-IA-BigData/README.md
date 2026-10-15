# IA & Big Data

Una selección de proyectos en los que exploro distintas aplicaciones de la inteligencia artificial y el procesamiento de datos: sistemas de recomendación, agentes conversacionales, APIs y mapas interactivos, minería de datos, visión artificial y procesamiento distribuido.

Cada proyecto aborda un problema desde una perspectiva diferente, combinando fundamentos técnicos, experimentación y aplicación práctica. El objetivo es entender cómo funcionan estas soluciones, qué aportan y cuáles son sus limitaciones.

---


## Proyectos

| Categoría | Caso | Qué se aprende |
|-----------|------|-----------------|
| [01 · Agentes IA](01-agentes-ia/) | [Chatbot de reservas: Nivel 0](01-agentes-ia/01-chatbot-reglas-restaurante/) | Motor de reglas de negocio, menú conversacional, línea base para medir el aporte real de la IA |
| [02 · Sistemas de Recomendación](02-sistemas-recomendacion/) | [Recomendador de películas por contenido](02-sistemas-recomendacion/01-recomendador-peliculas-contenido/) | Filtrado basado en contenido (TF-IDF + similitud coseno), visualización PCA del espacio de películas, cuándo preferirlo frente al filtrado colaborativo |
| [03 · APIs & Visualización](03-apis-visualizacion/) | [Simulador de rutas reales: OSRM](03-apis-visualizacion/01-simulador-rutas-osrm/) | Consumo de API REST, fórmula de Haversine, interpolación de rutas, mapas interactivos con ipyleaflet |
| [04 · Minería de Datos](04-mineria-datos/) | [Cesta de la compra: Apriori](04-mineria-datos/01-cesta-compra-apriori/) | Support/confidence/lift manual, algoritmo Apriori (mlxtend), reglas de asociación de 3+ productos |
| [06 · Visión Artificial](06-vision-artificial/) | [Detección de objetos en imágenes](06-vision-artificial/01-deteccion-objetos-imagenes/) | YOLOv8 preentrenado, límites de un modelo genérico frente a clases no vistas |
| [06 · Visión Artificial](06-vision-artificial/) | [Conteo de vehículos en vídeo](06-vision-artificial/02-conteo-vehiculos-video/) | YOLOv8 + ByteTrack, tracking de identidad entre frames, conteo por cruce de línea |
| [07 · Big Data Distribuido](07-big-data-distribuido/) | [Pipeline de ventas distribuido con PySpark](07-big-data-distribuido/01-pipeline-ventas-pyspark/) | Esquema como contrato, Spark SQL, funciones de ventana, broadcast joins, planes de ejecución, particiones y caché, UDF vs nativo, Parquet, MLlib |

