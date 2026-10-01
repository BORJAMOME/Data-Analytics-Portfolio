# Naive Bayes — Detección de SMS spam

## Contexto de negocio

Un operador de telefonía quiere filtrar SMS de phishing y publicidad no deseada antes de que lleguen al usuario, sin bloquear mensajes legítimos.

## Dataset

`sms_spam.xlsx`: 5.572 SMS reales en inglés (dataset público SMS Spam Collection), etiquetados como `ham` (4.825, 86,6%) o `spam` (747, 13,4%).

## Técnicas aplicadas

- Eliminación de mensajes duplicados antes de dividir en train y test, para evitar fuga de datos
- `CountVectorizer` + `MultinomialNB`, con matriz de confusión
- Comparación con `TfidfVectorizer`, probándolo en vez de darlo por mejor
- Interpretabilidad: palabras que más delatan el spam y el ham, con `feature_log_prob_`

## Hallazgo clave

Con `CountVectorizer` el modelo llega a un 98,16% de accuracy y un F1 de 0,92 en spam. Lo curioso es que TF-IDF lo empeora (95,26% de accuracy y F1 de 0,77 en spam), porque penaliza justo las palabras que más se repiten en el spam ("claim", "prize", "150p"), que son la mejor pista que hay.

Un SMS en español da una predicción de casi 50/50. El modelo no está fallando: se ha entrenado solo en inglés y ese mensaje queda fuera de lo que conoce.

## Dos decisiones que cambian el resultado

- Hay 403 mensajes duplicados (7,2% del dataset). Si no se quitan antes de dividir en train y test, se cuelan en los dos lados y la accuracy sube al 98,74%. Sin ellos se queda en 98,16%, que es la cifra buena.
- Para probar el modelo con mensajes nuevos uso ejemplos en inglés. El de español lo mantengo solo para enseñar qué pasa fuera del idioma de entrenamiento.

## Stack

scikit-learn (MultinomialNB, CountVectorizer, TfidfVectorizer), pandas, Matplotlib, Seaborn

