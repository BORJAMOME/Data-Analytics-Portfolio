# MLP en Vision — Clasificacion de Prendas (Fashion-MNIST)

## Contexto de negocio

Un marketplace de moda online necesita clasificar automaticamente
las fotos de productos. Este notebook demuestra por que el MLP
no es adecuado para vision: pierde la estructura espacial de la imagen.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Nombre | Fashion-MNIST (Zalando Research) |
| Registros | 70.000 imagenes (60k train, 10k test) |
| Tamano | 28x28 pixeles, escala de grises |
| Clases | 10 (T-shirt, Trouser, Pullover, Dress, Coat, Sandal, Shirt, Sneaker, Bag, Ankle boot) |

## Tecnicas aplicadas

- MLP sklearn (256, 128) sobre imagenes aplanadas (784 features)
- CNN Keras (2 Conv2D + MaxPooling) como referencia
- Random Forest como baseline
- Visualizacion de errores del MLP que la CNN acierta

## Hallazgo clave

La CNN supera al MLP porque los filtros convolucionales detectan patrones
locales (bordes, texturas) que el MLP no puede aprender al tratar cada
pixel de forma independiente. Las confusiones tipicas (pullover/coat,
shirt/t-shirt) involucran diferencias de forma.

## Notebooks relacionados

- [CNN 01 - Vision Artificial](../../cnn/01-vision-artificial/) — CNN completa sobre CIFAR-10

## Como ejecutar

```bash
pip install pandas numpy matplotlib tensorflow scikit-learn
jupyter notebook notebook.ipynb
```
