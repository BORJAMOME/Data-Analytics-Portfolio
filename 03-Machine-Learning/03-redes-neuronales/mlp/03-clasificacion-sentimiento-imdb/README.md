# MLP — Clasificación de sentimiento en reseñas de películas (IMDB)

## Contexto de negocio

Una plataforma de streaming o un agregador de críticas quiere saber si miles de reseñas de usuarios son positivas o negativas sin tener que leerlas a mano.

## Dataset

IMDB Movie Reviews (incluido en `tensorflow.keras.datasets`): 25.000 reseñas de entrenamiento y 25.000 de test, perfectamente balanceadas (12.500/12.500 en cada split).

## Técnicas aplicadas

- Embedding propio (no preentrenado) + `GlobalAveragePooling1D` + capas densas, lo que se conoce como "bolsa de embeddings"
- Padding y truncado a longitud fija (`pad_sequences`), midiendo cuánto texto se pierde
- Curvas de aprendizaje (train frente a validación) para ver si hay sobreajuste
- Como referencia, TF-IDF + regresión logística, sin ninguna red neuronal

## Hallazgo clave

El MLP con embedding propio llega a un **87,44% de accuracy en test**. TF-IDF con regresión logística llega a un **88,39%** sin entrenar ninguna red. El embedding no aporta nada aquí: promedia los vectores de las palabras sin tener en cuenta el orden, igual que TF-IDF, recorta las reseñas largas (la media es de 238,7 tokens y el límite, 200) y no tiene datos suficientes para que lo aprendido compense.

## Stack

TensorFlow/Keras (Embedding, GlobalAveragePooling1D), scikit-learn (TfidfVectorizer, LogisticRegression), Matplotlib, Seaborn

