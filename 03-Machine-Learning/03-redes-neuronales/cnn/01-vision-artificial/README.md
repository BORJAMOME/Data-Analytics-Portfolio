# CNN — Vision Artificial para Clasificacion de Objetos (CIFAR-10)

## Contexto de negocio

Una empresa de seguridad vial desarrolla un sistema de deteccion automatica
de objetos en intersecciones urbanas. Las camaras capturan imagenes a color
que deben clasificarse en tiempo real.

## Dataset

| Campo | Detalle |
|:------|:--------|
| Nombre | CIFAR-10 |
| Registros | 60.000 imagenes (50k train, 10k test) |
| Tamano | 32x32 pixeles, RGB (3 canales) |
| Clases | 10 (airplane, automobile, bird, cat, deer, dog, frog, horse, ship, truck) |

## Tecnicas aplicadas

- 3 arquitecturas CNN de complejidad creciente:
  - CNN Simple (2 Conv2D)
  - CNN Media (4 Conv2D + Dropout 0.25/0.3)
  - CNN con BatchNormalization
- Learning curves comparativas
- Confusion matrix del mejor modelo
- Analisis de clasificaciones incorrectas

## Hallazgo clave

La progresion Simple < Media < BatchNorm demuestra que la regularizacion
(Dropout, BatchNorm) es tan importante como la profundidad. Las clases
mas confundidas (cat/dog, automobile/truck) reflejan similitud visual real.

## Notebooks relacionados

- [MLP 04 - Vision Fashion-MNIST](../../mlp/04-clasificacion-imagenes-gatos/) — MLP vs CNN en imagenes

## Como ejecutar

```bash
pip install pandas numpy matplotlib tensorflow scikit-learn
jupyter notebook notebook.ipynb
```
