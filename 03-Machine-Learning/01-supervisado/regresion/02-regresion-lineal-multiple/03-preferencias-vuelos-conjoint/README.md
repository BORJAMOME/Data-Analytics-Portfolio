# Análisis Conjoint — Preferencias de Vuelos

En este notebook está el caso completo. Si prefieres recorrerlo sin tocar código, he hecho una app en Streamlit que lo explica de principio a fin y te deja diseñar un vuelo para ver cómo lo valoraría cada segmento de cliente: **[conjoint-vuelos-app](https://github.com/BORJAMOME/conjoint-vuelos-app)**.

¿Cuánto vale para el cliente cada cosa de un vuelo (precio, equipaje, escalas, flexibilidad), y vale lo mismo para todos? Con un análisis conjoint separo 24.000 valoraciones de vuelos en lo que aporta cada atributo, y comparo esas prioridades entre tres segmentos de cliente.

---

## Contexto de negocio

Una aerolínea puede combinar precio, equipaje, selección de asiento, escalas, flexibilidad y horario de cientos de maneras. Si no sabe cuánto pesa cada cosa en la decisión del cliente, cualquier cambio de producto o de precio va a ciegas.

## Dataset

**Conjoint_Flight.xlsx**: 1.000 clientes valoraron (rating 1-10) las mismas 24 combinaciones de vuelo, un diseño ortogonal (fractional factorial) sobre 6 atributos: Precio (50€/100€/150€), Equipaje, Selección de asiento, Escalas, Flexibilidad y Horario de salida. 24.000 valoraciones en total, repartidas en 3 segmentos de cliente (Business, Leisure, Low Cost).

## Técnicas aplicadas

- Diseño experimental conjoint: verificación de que el diseño ortogonal es idéntico para todos los clientes
- EDA: distribución del rating, comparación de rating por segmento
- Codificación dummy (one-hot) de los 6 atributos categóricos
- **Regresión lineal OLS** (`statsmodels`) para estimar las utilidades parciales (*part-worths*) de cada nivel
- Cálculo de importancia relativa de atributos (rango de utilidad normalizado)
- Modelos OLS independientes por segmento de cliente, para comparar prioridades

## Hallazgo clave

> El precio y las escalas se llevan el 69% de la importancia media, pero esa media mezcla tres formas muy distintas de decidir. El cliente **Business** valora más volar directo (37,9%) que el precio (24,4%). El **Low Cost** decide casi solo por precio (59,7%, el triple que las escalas). Por eso un modelo por segmento explica mucho mejor lo que pasa (R² entre 0,87 y 0,96) que un único modelo con todos mezclados (R² = 0,747). Si la aerolínea diseña un solo producto para el cliente medio, no acierta con ninguno de los tres.

## Librerías principales

`pandas`, `numpy`, `matplotlib`, `seaborn`, `statsmodels`
