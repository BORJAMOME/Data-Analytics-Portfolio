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

El MLP con embedding propio alcanza **87,55% de accuracy en test**, pero **TF-IDF + Regresión Logística llega a 88,39%** sin entrenar ninguna red neuronal. La arquitectura de embedding no aporta ventaja real aquí: promedia los vectores de palabras ignorando su orden (igual que TF-IDF) y trunca reseñas largas (longitud media 238,7 tokens, frente a un límite de 200), sin datos suficientes para que el embedding aprendido compense.

## Notas sobre el notebook original

- No fijaba semilla de aleatoriedad en TensorFlow (`tf.random.set_seed`), así que la accuracy variaba ligeramente en cada ejecución.
- Mostraba el texto de una reseña de **entrenamiento** (`x_train[21]`) en una celda, y en otra celda posterior la predicción sobre `x_test[21]` — una reseña de **test** distinta, presentada como si fuera una continuación del mismo ejemplo. Se corrigió mostrando el texto real de la reseña de test junto a su predicción.
- Aplicaba `pad_sequences` dos veces sobre los mismos datos (la segunda vez, sobre datos ya paddeados) — código muerto, eliminado.
- No comparaba con ningún modelo más simple ni mostraba curvas de aprendizaje — ambas cosas añadidas.

## Stack

TensorFlow/Keras (Embedding, GlobalAveragePooling1D), scikit-learn (TfidfVectorizer, LogisticRegression), Matplotlib, Seaborn

## Notebooks relacionados

- [Por qué las redes neuronales necesitan capas ocultas](../00-fundamentos-capas-ocultas/)
- [Clasificación Fintech](../01-clasificacion-fintech/) — mismo patrón: el MLP no siempre gana al modelo simple
