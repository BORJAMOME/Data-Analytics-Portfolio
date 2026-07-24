# MLP — Clasificación de imágenes gatos/perros

Clasificar imágenes en gatos o perros usando una red MLP (no convolucional) como baseline antes de una CNN.

---

## Dataset

Dataset de imágenes gatos/perros. Descargar de [Kaggle: Dogs vs. Cats](https://www.kaggle.com/c/dogs-vs-cats).

## Técnica aplicada

MLP con TensorFlow/Keras. Preprocesado de imágenes (flattening), normalización, entrenamiento.

## Librerías principales

- `tensorflow`
- `keras`
- `numpy`
- `matplotlib`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/03-redes-neuronales/mlp/04-clasificacion-imagenes-gatos

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install tensorflow keras numpy matplotlib jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```

## Notas

Dataset externo: descargar de Kaggle y colocar en `dataset/training_set/` y `dataset/test_set/` con subcarpetas `cats/` y `dogs/`.


---

[Volver al índice de Machine Learning](../../../README.md)
