# Regresion Lineal Multiple — ROI publicitario

Cuanto vende cada euro invertido en TV, Radio y Prensa? El dataset clasico Advertising con inferencia estadistica, VIF y simulacion de escenarios de presupuesto.

---

## Contexto de negocio

Un director de marketing necesita justificar su presupuesto ante el CFO. Este modelo cuantifica el retorno de cada canal y simula redistribuciones optimas.

## Dataset

`Advertising.csv` — 200 mercados con inversion en TV, Radio, Newspaper y Sales resultantes.

## Tecnicas aplicadas

- statsmodels OLS con p-valores e intervalos de confianza
- VIF (Variance Inflation Factor) para multicolinealidad
- sklearn LinearRegression con R2 ajustado
- Simulacion de redistribucion de presupuesto (3 escenarios)
- Diagnostico completo de supuestos

## Hallazgo clave

> TV y Radio generan retorno real. Prensa no tiene efecto significativo una vez controlada por los otros canales. Mover presupuesto de Prensa a TV/Radio aumenta ventas sin incrementar gasto.

## Notebooks relacionados

- [Regresion Multiple — Gimnasio](../02-gimnasio/) — mismo algoritmo, dataset del gimnasio
- [Ridge/Lasso](../../03-ridge-lasso/01-regularizacion/) — que hacer cuando hay demasiadas variables

## Como ejecutar

```bash
pip install pandas matplotlib seaborn scikit-learn statsmodels scipy jupyter
jupyter notebook notebook.ipynb
```

---

[Volver al indice](../../../../README.md)
