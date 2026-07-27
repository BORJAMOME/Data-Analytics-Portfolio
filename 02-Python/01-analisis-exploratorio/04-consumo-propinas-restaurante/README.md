# Consumo y propinas en un restaurante

**Caso de negocio:** una cadena de restaurantes quiere optimizar ingresos y planificar
turnos de personal a partir del patrón de consumo y propinas de sus clientes.

## Qué se aprende

- Creación de una métrica derivada clave (`tip_pct`) para comparar propinas de forma justa
  entre tickets de distinto importe.
- Diferencia entre analizar el **ticket medio** (para pricing) y el **volumen de tickets**
  (para dotación de personal) — la misma tabla responde preguntas distintas según qué
  columna se agregue.
- Heatmap de facturación cruzando día × franja horaria para una lectura ejecutiva rápida.

## Hallazgo clave

Las mesas pequeñas (1-2 personas) dejan mayor % de propina, pero las mesas grandes en la cena
del fin de semana son las que más facturan — son palancas de negocio distintas y no deben
confundirse.

## Archivos

- `notebook.ipynb` — análisis completo (dataset `tips` de Seaborn, no requiere CSV externo)

**Stack:** pandas, NumPy, Matplotlib, Seaborn
