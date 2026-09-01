# Por qué las redes neuronales necesitan capas ocultas

## Contexto de negocio
Antes de justificar un MLP frente a un modelo lineal (como en los dos casos siguientes de esta sección), hace falta demostrar que existe una estructura no lineal real en los datos que el MLP sí resuelve y el modelo lineal no.

## Dataset
Sintético: círculos concéntricos (`sklearn.datasets.make_circles`, 500 puntos) y XOR (4 puntos) — los dos ejemplos clásicos de no-separabilidad lineal.

## Técnicas aplicadas
- Baseline con Regresión Logística en ambos problemas, antes de entrenar ninguna red
- MLP con una sola capa oculta (ReLU) para cada caso
- Matriz de confusión, curva ROC/AUC (círculos) y comparación predicción vs. esperado (XOR)

## Hallazgo clave
La Regresión Logística obtiene **40,8% de accuracy** en los círculos concéntricos (peor que el azar) y predice la misma clase para los 4 puntos de XOR (50% de accuracy, no distingue nada). Con una sola capa oculta, el MLP alcanza **99,2% de accuracy y AUC=1.0** en los círculos y clasifica XOR con margen amplio (0.05/0.97/0.97/0.03 frente a 0/1/1/0). La causa no es falta de datos ni de entrenamiento: es que un modelo lineal no puede representar una frontera de decisión curva o no contigua, por diseño.

## Stack
TensorFlow/Keras, scikit-learn (LogisticRegression, make_circles), Matplotlib, Seaborn

