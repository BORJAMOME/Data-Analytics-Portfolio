# CNN — Visión artificial gatos/perros

Mismo problema que la clasificación MLP pero usando una Convolutional Neural Network, el modelo apropiado para imágenes.

---

## Dataset

Dataset de imágenes gatos/perros. Descargar de [Kaggle: Dogs vs. Cats](https://www.kaggle.com/c/dogs-vs-cats).

## Técnica aplicada

CNN con capas convolucionales + max pooling + capas densas. Data augmentation con `ImageDataGenerator`.

## Librerías principales

- `tensorflow`
- `keras`
- `matplotlib`

## Cómo ejecutar

```bash
# Desde la raíz del repositorio
cd 03-Machine-Learning/03-redes-neuronales/cnn/01-vision-artificial

# Activar entorno virtual
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate    # Linux/Mac

# Instalar dependencias
pip install tensorflow keras matplotlib jupyter

# Abrir el notebook
jupyter notebook notebook.ipynb
```

## Notas

Dataset externo: descargar de Kaggle y colocar en `dataset/training_set/` y `dataset/test_set/`.


---

[Volver al índice de Machine Learning](../../../README.md)
