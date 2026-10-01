# Por qué las redes neuronales necesitan capas ocultas

## Contexto de negocio
Antes de defender un MLP frente a un modelo lineal, como hago en los casos siguientes de esta sección, conviene enseñar qué tipo de estructura no lineal resuelve el MLP y el modelo lineal no.

## Dataset
Sintético: círculos concéntricos (`sklearn.datasets.make_circles`, 500 puntos) y XOR (4 puntos), los dos ejemplos clásicos de datos que no se pueden separar con una recta.

## Técnicas aplicadas
- Baseline con Regresión Logística en ambos problemas, antes de entrenar ninguna red
- MLP con una sola capa oculta (ReLU) para cada caso
- Matriz de confusión, curva ROC/AUC (círculos) y comparación predicción vs. esperado (XOR)

## Hallazgo clave
La regresión logística saca un **40,8% de accuracy** en los círculos, peor que tirar una moneda, y en XOR predice la misma clase para los 4 puntos (50%, no distingue nada). Con una sola capa oculta, el MLP separa los círculos y clasifica XOR con margen (0,05 / 0,96 / 0,96 / 0,04 frente a 0 / 1 / 1 / 0). El problema no es de datos ni de entrenamiento: un modelo lineal no puede dibujar una frontera curva o partida, por mucho que se entrene.

## Stack
TensorFlow/Keras, scikit-learn (LogisticRegression, make_circles), Matplotlib, Seaborn

