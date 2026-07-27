# Clustering Jerarquico — Gimnasio con 4 variables y radar charts

## Contexto de negocio
Un gimnasio quiere crear personas accionables de sus miembros usando 4 metricas de comportamiento, visualizadas con radar charts para comunicar a stakeholders no tecnicos.

## Dataset
`gym_clientes.xlsx` — 300 registros, 7 variables.

## Tecnicas aplicadas
- 4 features: Antiguedad, Asistencias, Horas_Pico, Gasto_Extra
- StandardScaler + dendrograma Ward
- PCA 2D para visualizar clusters en alta dimension
- Radar chart por cluster (matplotlib polar)
- Boxplots multivariable
- Cross-check con Abandono y Satisfecho

## Hallazgo clave
Los radar charts revelan que cada cluster tiene un "shape" distinto — no solo difieren en una metrica sino en la combinacion. Esto permite crear personas de marketing matizadas.

## Notebooks relacionados
- [02-caso-avanzado](../02-caso-avanzado/) — misma fuente, solo 2 variables
- [K-Means avanzado](../../kmeans/02-caso-avanzado/) — misma fuente con K-Means

## Como ejecutar
```bash
pip install pandas numpy matplotlib seaborn scikit-learn openpyxl
jupyter notebook notebook.ipynb
```
