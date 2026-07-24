# MLP — Forecast consumo eléctrico

Predecir el consumo eléctrico a partir de variables ambientales y temporales usando una red neuronal.

---

## Dataset

`electricidad.xlsx` — histórico de consumo.

## Técnica aplicada

`MLPRegressor`. Feature engineering temporal, escalado, validación temporal.

## Librerías principales

- `pandas`
- `matplotlib`
- `scikit-learn`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/03-redes-neuronales/mlp/03-forecast-consumo-electrico

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install pandas matplotlib scikit-learn jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```



---

[Volver al índice de Machine Learning](../../../README.md)
