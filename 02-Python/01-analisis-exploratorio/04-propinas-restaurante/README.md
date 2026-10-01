# Consumo y propinas en un restaurante

**Caso de negocio:** una cadena de restaurantes quiere facturar más y organizar mejor los
turnos a partir de cómo consumen y cuánta propina dejan sus clientes.

## Qué se aprende

- Crear una métrica derivada (`tip_pct`) para comparar propinas entre tickets de distinto
  importe.
- Distinguir el ticket medio (sirve para precios) del número de tickets (sirve para decidir
  cuánta gente poner). La misma tabla responde a preguntas distintas según qué columna
  agregues.
- Heatmap de facturación por día y franja horaria, que se entiende de un vistazo.

## Hallazgo clave

Las mesas de 1 o 2 personas dejan más propina en porcentaje, pero las que más facturan son
las mesas grandes en las cenas del fin de semana. Son dos cosas distintas y conviene no
mezclarlas al tomar decisiones.

## Archivos

- `notebook.ipynb`: el análisis (usa el dataset `tips` de Seaborn, no necesita CSV)

**Stack:** pandas, NumPy, Matplotlib, Seaborn
