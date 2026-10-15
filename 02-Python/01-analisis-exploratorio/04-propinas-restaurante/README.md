# ¿Cuándo factura más un restaurante y qué clientes dejan más propina?

**Caso de negocio:** una cadena de restaurantes quiere facturar más y organizar mejor los
turnos a partir de cómo consumen y cuánta propina dejan sus clientes.

## Qué he aprendido

- Creé una métrica derivada (`tip_pct`) para comparar propinas entre tickets de distinto
  importe.
- Separé el ticket medio (sirve para precios) del número de tickets (sirve para decidir
  cuánta gente poner): la misma tabla responde a preguntas distintas según la columna que
  agregue.
- Resumí la facturación por día y franja horaria en un heatmap.
- Contar tickets por día y franja cambia la lectura de la plantilla: el jueves pesa más
  que el viernes.

## Hallazgo clave

Las mesas de 1 o 2 personas dejan más propina en porcentaje, pero las que más facturan son
las mesas grandes en las cenas del fin de semana. Son dos cosas distintas y conviene no
mezclarlas al tomar decisiones. En plantilla, el sábado y el domingo por la noche y las
comidas del jueves concentran las mesas; el viernes es el día con menos (19 tickets). El
dataset no indica la moneda, así que uso € por convención.


**Stack:** pandas, NumPy, Matplotlib, Seaborn
