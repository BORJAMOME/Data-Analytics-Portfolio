# Reglas de asociación — Market Basket Analysis (Apriori)

## Contexto de negocio
Un supermercado quiere saber qué productos se compran juntos para decidir qué colocar
cerca en el lineal, qué combos promocionar y qué recomendar en caja o en la app.

## Dataset
10.000 transacciones simuladas (`transaction_id`, `items`, `n_items`), 25 productos.

## Técnicas aplicadas
- Cálculo manual de **support, confidence y lift** para pares de productos, para entender
  la matemática antes de usar una librería.
- Algoritmo **Apriori** (`mlxtend`) sobre codificación one-hot (`TransactionEncoder`) para
  encontrar conjuntos frecuentes de 3 o más productos — inabordable a mano por el número
  de combinaciones posibles.
- Visualización interactiva de las reglas filtradas (Support vs Confidence, tamaño = Lift)
  con Plotly.

## Bugs corregidos del notebook original
El notebook de partida tenía dos errores reales que invalidaban los resultados, no solo
problemas de formato:
- **Conteo de pares silenciosamente incompleto:** el bucle que genera las combinaciones de
  productos estaba desindentado fuera del bucle que recorre las transacciones, así que solo
  se ejecutaba una vez con la última transacción procesada (devolvía 28 pares en vez de los
  300 reales — todas las combinaciones de los 25 productos).
- **Construcción rota del DataFrame de reglas:** `pd.DataFrame(rules.append)` pasaba el
  propio método `.append` como dato en vez de la lista de reglas ya construida, lo que
  lanzaba `ValueError: DataFrame constructor not properly called!`.

Corregido, el conteo real da 300 pares y 6 reglas por encima de los umbrales de negocio
(support ≥ 0.08, confidence ≥ 0.35, lift ≥ 1.15) — con **Pasta → Salsa de Tomate** (lift 1.94)
como la asociación más fuerte del catálogo.

## Hallazgo clave
Con Apriori aparecen 118 reglas que combinan 3 o más productos, algo que el enfoque manual
de pares nunca podría detectar (p. ej. `{Pan, Pan_Tostado} → {Mantequilla}`, lift 2.16):
el valor de Apriori está precisamente en escalar a combinaciones que a mano son inviables.

## Stack
`pandas` · `numpy` · `matplotlib` · `plotly` · `mlxtend`

## Archivos
- `notebook.ipynb` — análisis completo (manual + Apriori), ejecutado y verificado de extremo a extremo.
- `transacciones_supermercado.xlsx` — dataset de transacciones.
