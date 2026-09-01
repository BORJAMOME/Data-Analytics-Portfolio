# MLP — Clasificación de sentimiento en reseñas de películas (IMDB)

## Contexto de negocio

Una plataforma de streaming o un agregador de críticas necesita clasificar automáticamente el sentimiento de miles de reseñas de usuarios, sin moderación manual.

## Dataset

IMDB Movie Reviews (incluido en `tensorflow.keras.datasets`) — 25.000 reseñas de entrenamiento y 25.000 de test, perfectamente balanceadas (12.500/12.500 en cada split).

## Técnicas aplicadas

- Embedding propio (no preentrenado) + `GlobalAveragePooling1D` + capas densas — arquitectura de "bolsa de embeddings"
- Padding/truncado a longitud fija (`pad_sequences`), con verificación de cuánto texto se pierde
- Curvas de aprendizaje (train vs. validación) para detectar sobreajuste
- Baseline honesto: TF-IDF + Regresión Logística, sin ninguna red neuronal

## Hallazgo clave

El MLP con embedding propio alcanza **87,44% de accuracy en test**, pero **TF-IDF + Regresión Logística llega a 88,39%** sin entrenar ninguna red neuronal. La arquitectura de embedding no aporta ventaja real aquí: promedia los vectores de palabras ignorando su orden (igual que TF-IDF) y trunca reseñas largas (longitud media 238,7 tokens, frente a un límite de 200), sin datos suficientes para que el embedding aprendido compense.

## Stack

TensorFlow/Keras (Embedding, GlobalAveragePooling1D), scikit-learn (TfidfVectorizer, LogisticRegression), Matplotlib, Seaborn

