# Regresión Lineal Múltiple — ROI publicitario

Modelar el impacto de la inversión publicitaria en TV, radio y prensa sobre las ventas.

---

## Dataset

`Advertising.csv` — inversión por canal y ventas resultantes (dataset clásico de ISLR).

## Técnica aplicada

Regresión Lineal Múltiple. Interpretación de coeficientes, multicolinealidad (VIF) y selección de variables.

## Librerías principales

- `pandas`
- `seaborn`
- `scikit-learn`
- `statsmodels`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/01-supervisado/regresion/regresion-lineal-multiple/01-publicidad

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install pandas seaborn scikit-learn statsmodels jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```



---

[Volver al índice de Machine Learning](../../../../README.md)
