# Chatbot de reservas basado en reglas — Nivel 0

## Contexto
Un restaurante quiere un sistema sencillo para gestionar reservas por consola: ver si
hay sitio, apuntar, consultar y cancelar.

## Cómo funciona
Menú de opciones numérico (1-5) sobre un motor de reglas de negocio explícitas:
- **Hacer reserva:** valida que la suma de personas ya reservadas para esa fecha/hora
  más la nueva reserva no supere el aforo máximo.
- **Consultar disponibilidad:** calcula plazas libres para una fecha/hora dadas.
- **Cancelar / Mostrar reservas:** operaciones directas sobre el registro en memoria.

No hay NLP, ni similitud semántica, ni modelo de lenguaje. El usuario dice lo que quiere
eligiendo una opción del menú; el sistema no interpreta texto libre.

## Por qué está aquí
Es a propósito el **nivel 0** de `01-agentes-ia`: la referencia sin nada de inteligencia.
Los siguientes niveles, que todavía tengo pendientes, resolverán el mismo problema
(entender qué quiere el usuario) primero con similitud semántica, sin LLM, y después con
un LLM local. La idea es medir qué aporta cada paso en vez de dar por hecho que más IA
siempre es mejor.

## Técnicas aplicadas
- Reglas de negocio explícitas (control de aforo por fecha/hora).
- Estado en memoria con `pandas.DataFrame` (altas, bajas y consultas).
- Interfaz conversacional por consola basada en menú, no en lenguaje natural.

## Stack
`pandas`

## Notas
Es un script interactivo (`input()`/`print()`). La función `chatbot()` está definida pero no
se ejecuta sola, porque una celda con `input()` bloquearía la ejecución del notebook. Para
probarlo en local, descomenta la última línea.
