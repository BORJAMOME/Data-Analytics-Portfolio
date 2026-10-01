# IA & Big Data

Agentes de IA, sistemas de recomendación, APIs externas con mapas interactivos, minería de datos,
visión artificial y procesamiento distribuido con Spark: casos que van más allá del modelado clásico
de `03-Machine-Learning`.

> Los gráficos de este bloque usan el mismo sistema de color que `03-Machine-Learning`. Está en [`../03-Machine-Learning/DISENO-VISUAL.md`](../03-Machine-Learning/DISENO-VISUAL.md) y conviene leerlo antes de crear o tocar cualquier gráfico.

**Stack implementado:** scikit-learn (TF-IDF, similitud coseno) · ipyleaflet · mlxtend · ultralytics (YOLOv8) · ByteTrack · PySpark (Spark SQL, MLlib)
**Stack previsto** (para LLMs/chatbots y `05-Apps-Interactivas`, aún sin casos): LangChain · OpenAI API · Anthropic API · Groq · Ollama · Streamlit

---

## Estructura

Hay 7 categorías; la `05` todavía no tiene casos:

```
04-IA-BigData/
├── 01-agentes-ia/               Agentes: reglas → similitud semántica → LLM local
│   └── 01-chatbot-reglas-restaurante/   Nivel 0 — motor de reglas, sin IA
├── 02-sistemas-recomendacion/   Recomendación basada en contenido, colaborativa
│   └── 01-recomendador-peliculas-contenido/   TF-IDF + similitud coseno sobre sinopsis
├── 03-apis-visualizacion/       APIs externas + visualización interactiva
│   └── 01-simulador-rutas-osrm/     Rutas reales con OSRM + mapa animado (ipyleaflet)
├── 04-mineria-datos/            Reglas de asociación, patrones de comportamiento
│   └── 01-cesta-compra-apriori/     Market basket analysis con Apriori (mlxtend)
├── 05-Apps-Interactivas/        Dashboards y apps con Streamlit
├── 06-vision-artificial/        Detección y tracking de objetos con modelos preentrenados
│   ├── 01-deteccion-objetos-imagenes/   YOLOv8 sobre fotos de catálogo
│   └── 02-conteo-vehiculos-video/       YOLOv8 + ByteTrack, conteo de tráfico en vídeo
└── 07-big-data-distribuido/     Procesamiento distribuido con Apache Spark
    └── 01-pipeline-ventas-pyspark/      Pipeline completo en PySpark sobre 203.533 ventas
```

## Proyectos

| Categoría | Caso | Qué se aprende |
|-----------|------|-----------------|
| [01 · Agentes IA](01-agentes-ia/) | [Chatbot de reservas — Nivel 0](01-agentes-ia/01-chatbot-reglas-restaurante/) | Motor de reglas de negocio, menú conversacional, línea base para medir el aporte real de la IA |
| [02 · Sistemas de Recomendación](02-sistemas-recomendacion/) | [Recomendador de películas por contenido](02-sistemas-recomendacion/01-recomendador-peliculas-contenido/) | Filtrado basado en contenido (TF-IDF + similitud coseno), visualización PCA del espacio de películas, cuándo preferirlo frente al filtrado colaborativo |
| [03 · APIs & Visualización](03-apis-visualizacion/) | [Simulador de rutas reales — OSRM](03-apis-visualizacion/01-simulador-rutas-osrm/) | Consumo de API REST, fórmula de Haversine, interpolación de rutas, mapas interactivos con ipyleaflet |
| [04 · Minería de Datos](04-mineria-datos/) | [Cesta de la compra — Apriori](04-mineria-datos/01-cesta-compra-apriori/) | Support/confidence/lift manual, algoritmo Apriori (mlxtend), reglas de asociación de 3+ productos |
| [06 · Visión Artificial](06-vision-artificial/) | [Detección de objetos en imágenes](06-vision-artificial/01-deteccion-objetos-imagenes/) | YOLOv8 preentrenado, límites de un modelo genérico frente a clases no vistas |
| [06 · Visión Artificial](06-vision-artificial/) | [Conteo de vehículos en vídeo](06-vision-artificial/02-conteo-vehiculos-video/) | YOLOv8 + ByteTrack, tracking de identidad entre frames, conteo por cruce de línea |
| [07 · Big Data Distribuido](07-big-data-distribuido/) | [Pipeline de ventas distribuido con PySpark](07-big-data-distribuido/01-pipeline-ventas-pyspark/) | Esquema como contrato, Spark SQL, funciones de ventana, broadcast joins, planes de ejecución, particiones y caché, UDF vs nativo, Parquet, MLlib |

La categoría `05-Apps-Interactivas` todavía está vacía.

---

[Volver al portfolio principal](../README.md)
