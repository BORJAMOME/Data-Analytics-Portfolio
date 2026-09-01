# Naive Bayes — Detección de SMS spam

## Contexto de negocio

Un operador de telefonía quiere filtrar SMS de phishing y publicidad no deseada antes de que lleguen al usuario, sin bloquear mensajes legítimos.

## Dataset

`sms_spam.xlsx` — 5.572 SMS reales en inglés (dataset público SMS Spam Collection), etiquetados como `ham` (4.825, 86,6%) o `spam` (747, 13,4%).

## Técnicas aplicadas

- Detección y eliminación de mensajes duplicados antes del split train/test (evita fuga de datos)
- `CountVectorizer` + `MultinomialNB`, con matriz de confusión
- Comparativa honesta contra `TfidfVectorizer` (no asumida, verificada)
- Interpretabilidad: palabras más indicativas de spam/ham vía `feature_log_prob_`

## Hallazgo clave

98,16% de accuracy y F1-score de 0,92 en spam con `CountVectorizer` — pero **TF-IDF empeora el modelo** (accuracy 95,26%, F1 spam 0,77): penaliza justo las palabras repetidas ("claim", "prize", "150p") que son la señal más fuerte de spam en este problema. El notebook original probaba el modelo con un SMS en español, que da una predicción prácticamente 50/50 — no porque el modelo falle, sino porque el vocabulario de entrenamiento es 100% inglés y esa entrada está fuera de su dominio de aplicación.

## Notas sobre el notebook original

- No eliminaba los 403 mensajes duplicados (7,2% del dataset) antes de dividir train/test — inflaba ligeramente la accuracy por fuga de datos. La cifra correcta tras deduplicar es 98,16%, no el 98,74% original.
- El ejemplo de demostración (SMS en español) no es una prueba válida del modelo, que solo fue entrenado en inglés — se sustituyó por dos ejemplos en inglés que sí demuestran el comportamiento real.

## Stack

scikit-learn (MultinomialNB, CountVectorizer, TfidfVectorizer), pandas, Matplotlib, Seaborn

