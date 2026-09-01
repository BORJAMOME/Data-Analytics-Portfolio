# Chatbot de reservas basado en reglas — Nivel 0

## Contexto
Un restaurante necesita un sistema básico para gestionar reservas: comprobar aforo
disponible, registrar, consultar y cancelar reservas por consola.

## Cómo funciona
Menú de opciones numérico (1-5) sobre un motor de reglas de negocio explícitas:
- **Hacer reserva:** valida que la suma de personas ya reservadas para esa fecha/hora
  más la nueva reserva no supere el aforo máximo.
- **Consultar disponibilidad:** calcula plazas libres para una fecha/hora dadas.
- **Cancelar / Mostrar reservas:** operaciones directas sobre el registro en memoria.

No hay NLP, similitud semántica ni ningún modelo de lenguaje: la intención del usuario
se resuelve por selección explícita de menú, no por interpretación de texto libre.

## Por qué está aquí
Este caso es deliberadamente el **Nivel 0** de la categoría `01-agentes-ia`: la línea base
de "cero inteligencia" frente a la que se comparan los siguientes casos, donde el mismo
tipo de problema (interpretar qué quiere el usuario) se resuelve primero con similitud
semántica (sin LLM) y después con un LLM local — mostrando qué aporta realmente cada capa
de sofisticación, en vez de dar por hecho que "más IA" siempre es mejor.

## Técnicas aplicadas
- Reglas de negocio explícitas (control de aforo por fecha/hora).
- Estado en memoria con `pandas.DataFrame` (altas, bajas y consultas).
- Interfaz conversacional por consola basada en menú, no en lenguaje natural.

## Stack
`pandas`

## Notas
Es un script interactivo (`input()`/`print()`): la función `chatbot()` se deja definida
pero sin ejecutar automáticamente, porque una celda con `input()` no tiene sentido en una
ejecución no interactiva del notebook. Descomentar la última línea para probarlo en local.
