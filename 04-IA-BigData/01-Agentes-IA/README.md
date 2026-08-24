# Agentes IA

Progresión deliberada de un mismo tipo de problema — interpretar qué quiere el usuario y
ejecutar la acción correcta — resuelto con niveles crecientes de sofisticación: reglas
explícitas, similitud semántica sin LLM, y finalmente un LLM local como motor de decisión.

## Proyectos

| # | Caso | Nivel | Qué se aprende |
|---|------|-------|-----------------|
| 1 | [Chatbot de reservas — Nivel 0](01-chatbot-reglas-restaurante/) | Reglas puras (sin IA) | Motor de reglas de negocio, menú conversacional por consola, línea base para medir el aporte real de la IA |

Próximos niveles de la misma progresión (similitud semántica y agente con LLM local vía
Ollama) se añadirán como casos 2 y 3.

## Stack
`pandas` · `difflib` · `ollama`

---

[Volver a IA & Big Data](../README.md)
