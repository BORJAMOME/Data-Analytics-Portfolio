# Chatbot de reservas basado en reglas

Un sistema de reservas para restaurantes desarrollado en Python que permite gestionar la disponibilidad, registrar nuevas reservas, consultar las existentes y cancelarlas desde la consola.

## Contexto

Un restaurante necesita una herramienta sencilla para gestionar las reservas y controlar el aforo disponible en cada fecha y hora. El objetivo es resolver estas operaciones mediante una lógica de negocio clara, sin depender de servicios externos ni de modelos de IA.

## Cómo funciona

El sistema presenta un menú interactivo con cinco opciones que permiten gestionar las operaciones principales:

- **Hacer una reserva:** registra una nueva reserva si el aforo disponible permite acomodar al grupo solicitado.
- **Consultar disponibilidad:** calcula cuántas plazas quedan libres para una fecha y hora determinadas.
- **Mostrar reservas:** consulta las reservas registradas en el sistema.
- **Cancelar una reserva:** elimina una reserva existente.
- **Salir:** finaliza la interacción con el programa.

La lógica de negocio comprueba que el número de personas ya reservadas, sumado al de la nueva solicitud, no supere el aforo máximo establecido para esa fecha y hora.

Las operaciones se realizan sobre un registro almacenado en memoria mediante un `pandas.DataFrame`.

## Técnicas aplicadas

- **Reglas de negocio:** validación del aforo y control de las reservas por fecha y hora.
- **Gestión del estado:** almacenamiento temporal de las reservas en un `pandas.DataFrame`.
- **Operaciones sobre datos:** altas, consultas y cancelaciones de registros.
- **Interacción por consola:** menú numérico mediante `input()` y `print()`.
- **Separación entre interfaz y lógica:** organización de las operaciones dentro de la función `chatbot()`.

## Tecnologías

- pandas

