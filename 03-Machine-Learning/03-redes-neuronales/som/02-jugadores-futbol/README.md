# SOM — Segmentación jugadores de fútbol

Encontrar perfiles similares de jugadores profesionales de fútbol (Messi, Ronaldo, Modric, Ramos...) usando sus estadísticas.

---

## Dataset

`jugadores_futbol.xlsx` — estadísticas de jugadores.

## Técnica aplicada

SOM (Self-Organizing Maps) con `minisom`. Visualización del mapa con etiquetas de jugadores.

## Librerías principales

- `minisom`
- `pandas`
- `matplotlib`
- `seaborn`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/03-redes-neuronales/som/02-jugadores-futbol

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install minisom pandas matplotlib seaborn jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```



---

[Volver al índice de Machine Learning](../../../README.md)
