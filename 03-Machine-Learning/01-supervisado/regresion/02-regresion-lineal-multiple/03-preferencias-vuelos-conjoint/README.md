# Análisis Conjoint — Preferencias de Vuelos

Este notebook es el análisis completo. Si prefieres recorrer el caso como una historia interactiva — sin necesidad de tocar código — hay una aplicación en Streamlit que lo explica de principio a fin y deja diseñar un vuelo hipotético para ver cómo lo valoraría cada segmento de cliente: **[conjoint-vuelos-app](https://github.com/BORJAMOME/conjoint-vuelos-app)**.

¿Cuánto vale realmente cada característica de un vuelo — precio, equipaje, escalas, flexibilidad — para el cliente, y es el mismo valor para todo el mundo? Un análisis conjoint descompone la valoración global de 24.000 valoraciones de vuelo en la contribución individual de cada atributo, y compara esa prioridad entre tres segmentos de cliente.

---

## Contexto de negocio

Una aerolínea puede combinar precio, equipaje, selección de asiento, escalas, flexibilidad y horario en cientos de configuraciones de vuelo. Sin saber cuánto pesa cada atributo en la decisión del cliente, cada decisión de producto o de precio es una apuesta.

## Dataset

**Conjoint_Flight.xlsx** — 1.000 clientes valoraron (rating 1-10) las mismas 24 combinaciones de vuelo, un diseño ortogonal (fractional factorial) sobre 6 atributos: Precio (50€/100€/150€), Equipaje, Selección de asiento, Escalas, Flexibilidad y Horario de salida. 24.000 valoraciones en total, repartidas en 3 segmentos de cliente (Business, Leisure, Low Cost).

## Técnicas aplicadas

- Diseño experimental conjoint: verificación de que el diseño ortogonal es idéntico para todos los clientes
- EDA: distribución del rating, comparación de rating por segmento
- Codificación dummy (one-hot) de los 6 atributos categóricos
- **Regresión lineal OLS** (`statsmodels`) para estimar las utilidades parciales (*part-worths*) de cada nivel
- Cálculo de importancia relativa de atributos (rango de utilidad normalizado)
- Modelos OLS independientes por segmento de cliente, para comparar prioridades

## Hallazgo clave

> El precio y las escalas concentran el 69% de la importancia media, pero esa media esconde tres lógicas de decisión distintas: el segmento **Business** valora volar directo (37,9%) incluso por encima del precio (24,4%), mientras que **Low Cost** decide casi exclusivamente por precio (59,7%, el triple que las escalas). Ajustar un modelo por segmento explica mucho mejor el comportamiento real (R² entre 0,87 y 0,96) que el modelo único con todos los clientes mezclados (R²=0,747).

## Librerías principales

`pandas`, `numpy`, `matplotlib`, `seaborn`, `statsmodels`
