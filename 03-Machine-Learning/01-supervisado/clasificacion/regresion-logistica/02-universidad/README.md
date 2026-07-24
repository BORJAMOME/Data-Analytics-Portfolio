# Regresión Logística — Admisión universitaria

Predecir si un candidato será admitido en una universidad basándose en sus notas, GRE, GPA y ranking del colegio.

---

## Dataset

`admitidos.xlsx` — histórico de admisiones.

## Técnica aplicada

Regresión Logística. Interpretación de odds ratios y umbral de clasificación óptimo.

## Librerías principales

- `pandas`
- `seaborn`
- `scikit-learn`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/01-supervisado/clasificacion/regresion-logistica/02-universidad

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install pandas seaborn scikit-learn jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```



---

[Volver al índice de Machine Learning](../../../../README.md)
