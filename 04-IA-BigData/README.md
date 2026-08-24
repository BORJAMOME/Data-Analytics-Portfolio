# IA & Big Data

Agentes de IA, integración con Large Language Models (LLMs), APIs externas con visualización
interactiva, minería de datos, visión artificial y aplicaciones interactivas — casos prácticos
más allá del modelado clásico de `03-Machine-Learning`.

**Stack:** Transformers · spaCy · LangChain · OpenAI API · Anthropic API · Groq · Ollama · ipyleaflet · Streamlit · PySpark · DuckDB · ultralytics (YOLOv8) · ByteTrack

---

## Estructura

Los proyectos están organizados en 5 categorías:

```
04-IA-BigData/
├── 01-Agentes-IA/               Agentes: reglas → similitud semántica → LLM local
│   └── 01-chatbot-reglas-restaurante/   Nivel 0 — motor de reglas, sin IA
├── 02-LLMs-Chatbots/            Integración con LLMs vía API (LangChain, Groq, OpenAI, Anthropic)
├── 03-APIs-Visualizacion/       APIs externas + visualización interactiva
│   └── 01-simulador-rutas-osrm/     Rutas reales con OSRM + mapa animado (ipyleaflet)
├── 04-Mineria-Datos/            Reglas de asociación, patrones de comportamiento
│   └── 01-cesta-compra-apriori/     Market basket analysis con Apriori (mlxtend)
├── 05-Apps-Interactivas/        Dashboards y apps con Streamlit
└── 06-Vision-Artificial/        Detección y tracking de objetos con modelos preentrenados
    ├── 01-deteccion-objetos-imagenes/   YOLOv8 sobre fotos de catálogo
    └── 02-conteo-vehiculos-video/       YOLOv8 + ByteTrack, conteo de tráfico en vídeo
```

## Proyectos

| Categoría | Caso | Qué se aprende |
|-----------|------|-----------------|
| [01 · Agentes IA](01-Agentes-IA/) | [Chatbot de reservas — Nivel 0](01-Agentes-IA/01-chatbot-reglas-restaurante/) | Motor de reglas de negocio, menú conversacional, línea base para medir el aporte real de la IA |
| [03 · APIs & Visualización](03-APIs-Visualizacion/) | [Simulador de rutas reales — OSRM](03-APIs-Visualizacion/01-simulador-rutas-osrm/) | Consumo de API REST, fórmula de Haversine, interpolación de rutas, mapas interactivos con ipyleaflet |
| [04 · Minería de Datos](04-Mineria-Datos/) | [Cesta de la compra — Apriori](04-Mineria-Datos/01-cesta-compra-apriori/) | Support/confidence/lift manual, algoritmo Apriori (mlxtend), reglas de asociación de 3+ productos |
| [06 · Visión Artificial](06-Vision-Artificial/) | [Detección de objetos en imágenes](06-Vision-Artificial/01-deteccion-objetos-imagenes/) | YOLOv8 preentrenado, límites de un modelo genérico frente a clases no vistas |
| [06 · Visión Artificial](06-Vision-Artificial/) | [Conteo de vehículos en vídeo](06-Vision-Artificial/02-conteo-vehiculos-video/) | YOLOv8 + ByteTrack, tracking de identidad entre frames, conteo por cruce de línea |

Las demás categorías (`02-LLMs-Chatbots`, `05-Apps-Interactivas`) se irán completando próximamente.

---

[Volver al portfolio principal](../README.md)
