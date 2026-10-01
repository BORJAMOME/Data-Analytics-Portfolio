# Reglas de asociación — Market Basket Analysis (Apriori)

## Contexto de negocio
Un supermercado quiere saber qué productos se compran juntos para decidir qué colocar
cerca en el lineal, qué combos promocionar y qué recomendar en caja o en la app.

## Dataset
10.000 transacciones simuladas (`transaction_id`, `items`, `n_items`), 25 productos.

## Técnicas aplicadas
- **Support, confidence y lift** calculados a mano para pares de productos, para entender
  la matemática antes de usar una librería.
- **Apriori** (`mlxtend`) sobre codificación one-hot (`TransactionEncoder`) para encontrar
  conjuntos frecuentes de 3 o más productos, que a mano serían imposibles por la cantidad
  de combinaciones.
- Gráfico interactivo de las reglas filtradas con Plotly (support frente a confidence, con
  el tamaño según el lift).

## Dos errores del notebook de partida
El notebook del que partí tenía dos fallos que invalidaban los resultados:
- **El conteo de pares se quedaba corto sin avisar.** El bucle que genera las combinaciones
  estaba fuera del bucle que recorre las transacciones por un problema de sangría, así que
  solo se ejecutaba con la última transacción. Salían 28 pares en vez de los 300 que hay
  (todas las combinaciones de 25 productos).
- **El DataFrame de reglas no se construía.** `pd.DataFrame(rules.append)` pasaba el método
  `.append` en vez de la lista de reglas, y saltaba
  `ValueError: DataFrame constructor not properly called!`.

## Hallazgo clave
De los 300 pares posibles, 8 pasan los umbrales de negocio (support ≥ 0,08, confidence ≥ 0,35,
lift ≥ 1,15). La asociación más fuerte es **Pasta → Salsa de Tomate** (lift 1,94).

Hay que mirar la dirección de cada regla. Si solo se comprueba en orden alfabético, se pierden
dos reglas buenas, **Yogur → Fruta** y **Galletas → Café**.

Con Apriori salen 118 reglas de 3 o más productos, y 49 superan el mismo umbral de confianza.
La más fuerte es `{Pan, Pan_Tostado} → {Mantequilla}` (lift 2,16), que con pares nunca habría
aparecido. Para eso sirve Apriori: para combinaciones que a mano no se pueden revisar.

## Stack
`pandas` · `numpy` · `matplotlib` · `plotly` · `mlxtend`


