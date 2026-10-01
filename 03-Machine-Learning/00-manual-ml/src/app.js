/* ══════════════════════════════════════════════════════════════
   FUENTE ÚNICA DE VERDAD
   Un solo array MODELS alimenta: fichas, tabla comparativa,
   chips del wizard y contadores. Para añadir un modelo nuevo,
   añade un objeto aquí y aparece en los cuatro sitios.
   ══════════════════════════════════════════════════════════════ */

var REPO = "https://github.com/BORJAMOME/Data-Analytics-Portfolio/blob/main/";

/* Escala de los atributos: [texto, símbolo, puntuación]
   símbolo: f=● muy favorable · m=◑ intermedio · p=○ poco favorable · na=— */
var SC = {
  max:["Máxima","f",5], muyalta:["Muy Alta","f",4], alta:["Alta","f",3],
  mediaalta:["Media-Alta","m",2.5], media:["Media","m",2],
  baja:["Baja","p",1], muybaja:["Muy Baja","p",.5], nula:["Nula","p",0],
  na:["N/A","na",-1]
};

/* La familia ya no se distingue por color (gobernanza de marca: el morado
   es el único color de datos) — se distingue por icono + etiqueta, siempre
   los dos juntos para no depender nunca de un solo canal visual. */
var FAM = {
  sup   : {l:"Supervisado",         ic:"📐"},
  dl    : {l:"Deep Learning",       ic:"🧠"},
  unsup : {l:"No Supervisado",      ic:"🧩"},
  ts    : {l:"Series Temporales",   ic:"📈"},
  prob  : {l:"Probabilístico",      ic:"🎲"},
  rl    : {l:"Refuerzo",            ic:"🕹️"},
  asoc  : {l:"Reglas de Asociación",ic:"🛒"},
  tool  : {l:"Acelerador",          ic:"⚡"}
};

var SECS = [
  {b:"num", ic:"📊", t:"Supervisado — Regresión",                       s:"Predecir un número continuo"},
  {b:"cat", ic:"🎯", t:"Supervisado — Clasificación",                   s:"Predecir una categoría o un sí/no"},
  {b:"sup", ic:"⏳", t:"Supervisado — Análisis de supervivencia",       s:"No si ocurre, sino cuándo ocurre"},
  {b:"cau", ic:"🧪", t:"Inferencia causal — Uplift",                    s:"Medir el efecto real de una acción"},
  {b:"net", ic:"🧠", t:"Deep Learning y redes neuronales",              s:"Patrones complejos y datos no estructurados"},
  {b:"grp", ic:"👥", t:"No Supervisado — Clustering",                   s:"Agrupar casos parecidos"},
  {b:"dim", ic:"🗜️", t:"No Supervisado — Reducción de dimensionalidad", s:"Resumir o visualizar muchas variables"},
  {b:"ano", ic:"🚨", t:"No Supervisado — Detección de anomalías",       s:"Encontrar lo raro"},
  {b:"aso", ic:"🛒", t:"Reglas de asociación",                          s:"Qué se compra junto con qué"},
  {b:"rec", ic:"⭐", t:"Sistemas de recomendación",                     s:"Qué ofrecer a cada cliente"},
  {b:"txt", ic:"📝", t:"Texto — Topic modeling",                        s:"De qué hablan mis documentos"},
  {b:"prb", ic:"🎲", t:"Modelos probabilísticos",                       s:"Dependencias, secuencias y estados ocultos"},
  {b:"rl",  ic:"🕹️", t:"Aprendizaje por Refuerzo",                      s:"Un agente decide y aprende de la recompensa"},
  {b:"fut", ic:"📈", t:"Series temporales — Forecasting",               s:"Prever la evolución en el tiempo"},
  {b:"aut", ic:"⚡", t:"Aceleradores — AutoML",                         s:"Prototipar un baseline muy rápido"}
];

/* st: nb = notebook propio · std = estudiado sin notebook · pend = pendiente
   a : [precisión, velocidad de entrenamiento, alta dimensionalidad, interpretabilidad]
   est: true → los 4 atributos son estimación propia, no vienen del temario */
var MODELS = [

/* ── SUPERVISADO · REGRESIÓN ─────────────────────────────────── */
{id:"linsimple",n:"Regresión Lineal Simple",f:"sup",b:"num",st:"nb",cx:1,
 q:"¿Cómo cambia un valor cuando cambia UNA variable?",
 e:"Traza <b>la recta que minimiza el error</b> entre lo predicho y lo real. La pendiente te dice, literalmente, cuánto sube Y por cada unidad que sube X.",
 ex:"Ventas según gasto en publicidad.",k:"Una recta; la pendiente ES el impacto directo.",
 m:"RMSE · MAE · R²",no:"La relación no es lineal o intervienen varias causas.",
 biz:"Cuánto invertir en ads → ROI.",
 a:[SC.media,SC.muyalta,SC.baja,SC.muyalta],
 nb:[["Inmobiliaria","03-Machine-Learning/01-supervisado/regresion/01-regresion-lineal-simple/01-precio-viviendas"],
     ["Salud","03-Machine-Learning/01-supervisado/regresion/01-regresion-lineal-simple/02-colesterol-bmi"]]},

{id:"linmult",n:"Regresión Lineal Múltiple",f:"sup",b:"num",st:"nb",cx:1,
 q:"¿Cómo influyen VARIAS variables a la vez sobre un valor?",
 e:"La misma idea que la simple pero con varios ejes: cada coeficiente mide el efecto de su variable <b>manteniendo constantes las demás</b>. Ese «a igualdad de todo lo demás» es lo que la hace tan útil en negocio.",
 ex:"Precio de vivienda (m², habitaciones, zona).",k:"Cada coeficiente = peso de un driver.",
 m:"RMSE · MAE · R² ajustado",no:"Relaciones muy no lineales o multicolinealidad alta.",
 biz:"Fijar precio de venta → margen.",
 a:[SC.media,SC.muyalta,SC.baja,SC.muyalta],
 nb:[["Publicidad","03-Machine-Learning/01-supervisado/regresion/02-regresion-lineal-multiple/01-ventas-publicidad"],
     ["Gimnasio","03-Machine-Learning/01-supervisado/regresion/02-regresion-lineal-multiple/02-gasto-extra-gimnasio"],
     ["Preferencias de vuelos (Conjoint)","03-Machine-Learning/01-supervisado/regresion/02-regresion-lineal-multiple/03-preferencias-vuelos-conjoint","avion.ipynb"]]},

{id:"ridge",n:"Ridge Regression (L2)",f:"sup",b:"num",st:"nb",cx:2,
 q:"¿Muchas variables correlacionadas y quiero evitar sobreajuste?",
 e:"Una lineal que <b>penaliza los coeficientes grandes</b> (suma de cuadrados). Los encoge hacia cero sin llegar a eliminarlos: estabiliza el modelo cuando las variables van de la mano.",
 ex:"Marketing mix con decenas de canales correlacionados.",k:"Encoge coeficientes, no los elimina.",
 m:"RMSE · MAE · R²",no:"Quieres selección de variables (usa Lasso).",
 biz:"Repartir presupuesto entre canales → eficiencia.",
 a:[SC.mediaalta,SC.muyalta,SC.alta,SC.alta],
 nb:[["Regularización Ridge/Lasso","03-Machine-Learning/01-supervisado/regresion/03-ridge-lasso/01-comparativa-regularizacion"]]},

{id:"lasso",n:"Lasso Regression (L1)",f:"sup",b:"num",st:"nb",cx:2,
 q:"¿Cuáles de mis muchas variables importan de verdad?",
 e:"Como Ridge, pero la penalización (valor absoluto) puede <b>poner coeficientes exactamente a cero</b>. Es decir: hace selección de variables automáticamente y te devuelve un modelo corto y legible.",
 ex:"Quedarte con 6 drivers de ingresos de entre 80 candidatos.",k:"Selecciona variables poniendo pesos a cero.",
 m:"RMSE · R² · nº de variables retenidas",no:"Variables muy correlacionadas entre sí (elige una al azar del grupo).",
 biz:"Simplificar el cuadro de mando → foco.",
 a:[SC.mediaalta,SC.muyalta,SC.alta,SC.muyalta],
 nb:[["Regularización Ridge/Lasso","03-Machine-Learning/01-supervisado/regresion/03-ridge-lasso/01-comparativa-regularizacion"]]},

{id:"elastic",n:"Elastic Net",f:"sup",b:"num",st:"pend",cx:2,
 q:"¿Muchos predictores correlacionados y quiero lo mejor de Ridge y Lasso?",
 e:"Mezcla las dos penalizaciones con un mando (<code>l1_ratio</code>). Lasso, ante un grupo de variables correlacionadas, se queda con una y descarta el resto de forma arbitraria; Elastic Net <b>selecciona igual que Lasso pero conserva el grupo entero</b>, que es lo que hace Ridge.",
 ex:"Priorizar drivers de ingresos con datos anchos (más columnas que filas).",k:"El compromiso entre selección y estabilidad.",
 m:"RMSE · MAE · R²",no:"Pocas variables y ninguna correlación: la lineal simple basta.",
 biz:"Priorizar palancas de ingreso → asignación de recursos.",
 a:[SC.alta,SC.alta,SC.alta,SC.alta],nb:[]},

{id:"poisson",n:"Regresión de Poisson / GLM",f:"sup",b:"num",st:"pend",cx:2,
 q:"¿Predecir un conteo o una tasa de eventos?",
 e:"Una lineal cuya salida pasa por una exponencial, así que <b>nunca predice negativos</b> y asume que la varianza es igual a la media (crece con ella) — que es justo cómo se comportan muchos conteos.",
 ex:"Nº de pedidos por hora, visitas, incidencias, siniestros.",k:"Modela conteos con la distribución correcta.",
 m:"Deviance · MAE · Pseudo-R²",no:"La varianza es mucho mayor que la media (sobredispersión → Binomial Negativa).",
 biz:"Dimensionar turnos y stock → nivel de servicio.",
 a:[SC.mediaalta,SC.muyalta,SC.baja,SC.alta],nb:[]},

{id:"quantile",n:"Regresión Cuantílica",f:"sup",b:"num",st:"pend",cx:3,
 q:"¿Y si no me interesa la media, sino el peor caso?",
 e:"En vez de predecir el valor medio, predice <b>un percentil concreto</b> (el 10, el 50, el 90). Te da un rango en lugar de un número, que es lo que de verdad necesitas para planificar.",
 ex:"Demanda del percentil 90 para dimensionar stock de seguridad.",k:"Predice rangos, no medias. Robusta a outliers.",
 m:"Pinball loss · cobertura del intervalo",no:"Solo necesitas una estimación central y tienes datos limpios.",
 biz:"Stock de seguridad y SLA → riesgo de rotura.",
 a:[SC.alta,SC.alta,SC.media,SC.alta],nb:[]},

{id:"bayesridge",n:"Bayesian Ridge",f:"sup",b:"num",st:"pend",cx:3,
 q:"¿Cuánta confianza tengo en cada predicción?",
 e:"Una Ridge en la que los coeficientes no son números fijos sino <b>distribuciones de probabilidad</b>. Resultado: cada predicción viene con su propia barra de error, y la regularización se ajusta sola.",
 ex:"Previsión con pocos datos donde la incertidumbre importa tanto como el valor.",k:"Devuelve intervalo de credibilidad, no solo el punto.",
 m:"RMSE · log-verosimilitud · calibración del intervalo",no:"Tienes muchos datos y solo te importa el punto: Ridge normal es más simple.",
 biz:"Decidir con datos escasos → gestión del riesgo.",
 a:[SC.mediaalta,SC.muyalta,SC.alta,SC.alta],nb:[]},

{id:"gp",n:"Proceso Gaussiano (GP)",f:"sup",b:"num",st:"pend",cx:5,
 q:"¿Máxima precisión con MUY pocos datos y con incertidumbre?",
 e:"En vez de ajustar una función, define una <b>distribución sobre todas las funciones posibles</b> y se queda con las compatibles con tus datos. Muy potente con pocas observaciones, pero escala fatal (coste cúbico).",
 ex:"Optimización de un experimento caro con 40 mediciones.",k:"Precisión e incertidumbre con datasets diminutos.",
 m:"RMSE · log-verosimilitud marginal",no:"Más de unos pocos miles de filas: se vuelve inviable.",
 biz:"Diseño de experimentos → coste por prueba.",
 a:[SC.muyalta,SC.baja,SC.baja,SC.baja],nb:[]},

{id:"svr",n:"Support Vector Regression (SVR)",f:"sup",b:"num",st:"pend",cx:4,
 q:"¿Regresión no lineal en un espacio de muchas variables?",
 e:"Es el SVM aplicado a números: busca una <b>«banda» de tolerancia ε</b> que contenga la mayoría de los puntos y solo penaliza lo que se sale. El truco del kernel le permite curvarse.",
 ex:"Predecir una métrica de proceso industrial con decenas de sensores.",k:"Ignora el error pequeño; solo pelea con lo que se sale de la banda.",
 m:"RMSE · MAE",no:"Datasets grandes (entrena lento) o necesitas explicar el porqué.",
 biz:"Control de calidad → mermas.",
 a:[SC.alta,SC.baja,SC.muyalta,SC.baja],nb:[]},

{id:"gbr",n:"Gradient Boosting Regressor",f:"sup",b:"num",st:"nb",cx:4,
 q:"¿Máxima precisión numérica en datos tabulares?",
 e:"Encadena árboles pequeños donde <b>cada uno corrige el error que dejó el anterior</b>. Cientos de correcciones sucesivas producen una precisión muy difícil de batir en datos tabulares.",
 ex:"Precio de vivienda y tiempo de carrera 5K.",k:"Cada árbol aprende del error del anterior.",
 m:"RMSE · MAE · R²",no:"Necesitas explicar coeficientes o entrenar en segundos.",
 biz:"Tarificación y estimación fina → margen.",
 a:[SC.muyalta,SC.baja,SC.media,SC.baja],
 nb:[["Inmobiliaria","03-Machine-Learning/01-supervisado/regresion/04-gradient-boosting/01-tasacion-viviendas"],
     ["Tiempo carrera 5K","03-Machine-Learning/01-supervisado/regresion/04-gradient-boosting/02-tiempo-carrera-5k"]]},

/* ── SUPERVISADO · CLASIFICACIÓN ─────────────────────────────── */
{id:"logistica",n:"Regresión Logística",f:"sup",b:"cat",st:"nb",cx:1,
 q:"¿Cuál es la PROBABILIDAD de que ocurra un sí/no?",
 e:"Una lineal cuya salida se aplasta entre 0 y 1 con una sigmoide, así que <b>devuelve una probabilidad</b>, no solo una etiqueta (y suele estar bien calibrada mientras no fuerces pesos de clase). Puedes mover el umbral según lo que te cueste cada tipo de error.",
 ex:"Probabilidad de abandono de un socio del gimnasio; admisión universitaria.",k:"Probabilidad interpretable + umbral ajustable a negocio.",
 m:"ROC-AUC · PR-AUC · Recall · Log loss",no:"La frontera entre clases es claramente no lineal.",
 biz:"A quién llamar antes de que se vaya → retención.",
 a:[SC.media,SC.muyalta,SC.mediaalta,SC.muyalta],
 nb:[["Gimnasio","03-Machine-Learning/01-supervisado/clasificacion/05-regresion-logistica/01-satisfaccion-gimnasio"],
     ["Universidad","03-Machine-Learning/01-supervisado/clasificacion/05-regresion-logistica/02-admision-universidad"],
     ["Comparativa · Predicción de impagos","03-Machine-Learning/01-supervisado/clasificacion/04-comparativa-modelos/03-prediccion-impagos","impago_final.ipynb"],
     ["Comparativa · Segmentación aerolínea","03-Machine-Learning/01-supervisado/clasificacion/04-comparativa-modelos/04-segmentacion-aerolinea","aerolinea.ipynb"]]},

{id:"arbol",n:"Árbol de Decisión",f:"sup",b:"cat",st:"nb",cx:2,
 q:"¿Qué reglas explican la decisión, paso a paso?",
 e:"Va partiendo los datos por la pregunta que <b>mejor separa las clases</b> en cada nodo. El resultado se lee como un diagrama de flujo: es el modelo que puedes enseñar a negocio sin traducir nada.",
 ex:"Reglas de aprobación de un crédito o de una incidencia.",k:"Se lee como un organigrama; explicabilidad total.",
 m:"F1 · ROC-AUC · Accuracy",no:"Solo: sobreajusta con facilidad. Úsalo dentro de un ensemble.",
 biz:"Escribir la política de decisión → cumplimiento.",
 a:[SC.media,SC.alta,SC.media,SC.muyalta],
 nb:[["Árbol de decisión","03-Machine-Learning/01-supervisado/clasificacion/01-arbol-decision"]]},

{id:"rf",n:"Random Forest",f:"sup",b:"cat",st:"nb",cx:3,
 q:"¿Buena precisión sin complicarme con el ajuste?",
 e:"Entrena cientos de árboles, cada uno con <b>una muestra distinta de filas y de columnas</b>, y vota. La diversidad entre árboles cancela sus errores individuales: es el caballo de batalla más fiable que existe.",
 ex:"Clasificación general tabular y comparativa de modelos de churn.",k:"Robusto por defecto; da importancia de variables.",
 m:"ROC-AUC · F1 · OOB score",no:"Necesitas la última décima de precisión (usa boosting) o latencia mínima.",
 biz:"Priorizar cartera de clientes → esfuerzo comercial.",
 a:[SC.alta,SC.alta,SC.media,SC.media],
 nb:[["Random Forest","03-Machine-Learning/01-supervisado/clasificacion/02-random-forest"],
     ["Comparativa · Gimnasio","03-Machine-Learning/01-supervisado/clasificacion/04-comparativa-modelos/01-satisfaccion-gimnasio","comparativa_modelos_clasificacion.ipynb"],
     ["Comparativa · Churn","03-Machine-Learning/01-supervisado/clasificacion/04-comparativa-modelos/02-churn-clientes","comparativa_modelos_churn.ipynb"],
     ["Comparativa · Predicción de impagos","03-Machine-Learning/01-supervisado/clasificacion/04-comparativa-modelos/03-prediccion-impagos","impago_final.ipynb"],
     ["Comparativa · Segmentación aerolínea","03-Machine-Learning/01-supervisado/clasificacion/04-comparativa-modelos/04-segmentacion-aerolinea","aerolinea.ipynb"]]},

{id:"extratrees",n:"Extra Trees",f:"sup",b:"cat",st:"pend",cx:3,
 q:"¿Random Forest pero más rápido y con menos varianza?",
 e:"Igual que Random Forest, pero además <b>elige los puntos de corte al azar</b> en vez de buscar el óptimo (y, por defecto, entrena cada árbol con todas las filas, sin bootstrap). Suena peor y a menudo funciona igual o mejor, entrenando bastante más rápido.",
 ex:"Baseline potente cuando Random Forest tarda demasiado.",k:"Cortes aleatorios: más rápido y menos sobreajuste.",
 m:"ROC-AUC · F1",no:"Datasets pequeños con señal muy sutil (el azar te penaliza).",
 biz:"Iterar rápido en fase exploratoria → time-to-insight.",
 a:[SC.alta,SC.alta,SC.media,SC.media],nb:[]},

{id:"xgboost",n:"XGBoost",f:"sup",b:"cat",st:"nb",cx:4,
 q:"¿La máxima precisión posible en una tabla?",
 e:"Boosting con regularización incorporada y un motor muy optimizado. <b>Es el estándar de facto en datos tabulares</b> y el que gana casi todas las competiciones que no son de imágenes ni texto.",
 ex:"Scoring binario de riesgo y clasificación multiclase de perfiles.",k:"El referente en tabular; maneja bien nulos y desbalanceo.",
 m:"ROC-AUC · PR-AUC · F1 · Log loss",no:"Dataset diminuto, o necesitas explicar cada decisión sin SHAP.",
 biz:"Aprobar / denegar automáticamente → pérdida esperada.",
 a:[SC.muyalta,SC.media,SC.alta,SC.media],
 nb:[["XGBoost","03-Machine-Learning/01-supervisado/clasificacion/03-xgboost"],
     ["Comparativa · Churn","03-Machine-Learning/01-supervisado/clasificacion/04-comparativa-modelos/02-churn-clientes","comparativa_modelos_churn.ipynb"],
     ["Comparativa · Predicción de impagos","03-Machine-Learning/01-supervisado/clasificacion/04-comparativa-modelos/03-prediccion-impagos","impago_final.ipynb"]]},

{id:"lightgbm",n:"LightGBM",f:"sup",b:"cat",st:"pend",cx:4,
 q:"¿XGBoost pero mucho más rápido en datasets grandes?",
 e:"Mismo boosting, pero crece los árboles <b>por hoja en vez de por nivel</b> y agrupa los valores continuos en histogramas. Traducción: entrena varias veces más rápido con la misma precisión.",
 ex:"Scoring de riesgo con millones de filas.",k:"El más rápido de la familia boosting.",
 m:"ROC-AUC · PR-AUC · Log loss",no:"Pocos miles de filas: sobreajusta si no limitas las hojas.",
 biz:"Scoring diario a gran escala → coste de cómputo.",
 a:[SC.muyalta,SC.muyalta,SC.alta,SC.media],nb:[]},

{id:"catboost",n:"CatBoost",f:"sup",b:"cat",st:"pend",cx:4,
 q:"¿Boosting con muchas categóricas y sin preprocesar apenas?",
 e:"Boosting que <b>trata las variables categóricas de forma nativa</b>, sin one-hot ni encoding manual, usando un esquema ordenado que evita el leakage típico del target encoding.",
 ex:"Churn con datos de CRM llenos de categorías (provincia, plan, canal).",k:"Categóricas sin encoding manual y sin leakage.",
 m:"ROC-AUC · F1 · Log loss",no:"Todo numérico y buscas la máxima velocidad: LightGBM gana.",
 biz:"Modelar sobre el CRM tal cual → menos ETL.",
 a:[SC.muyalta,SC.media,SC.alta,SC.media],nb:[]},

{id:"adaboost",n:"AdaBoost",f:"sup",b:"cat",st:"pend",cx:3,
 q:"¿Cómo convierto modelos flojos en uno bueno?",
 e:"El boosting original: entrena un modelo débil, <b>sube el peso de los casos que falló</b> y entrena el siguiente sobre ellos. Es el abuelo conceptual de XGBoost y sigue siendo didáctico.",
 ex:"Clasificación binaria sencilla con datos limpios.",k:"Repondera los errores; el boosting en su forma más pura.",
 m:"ROC-AUC · F1 · Accuracy",no:"Datos con ruido o outliers: les da peso y se obsesiona con ellos.",
 biz:"Baseline de ensemble → punto de comparación.",
 a:[SC.alta,SC.media,SC.media,SC.media],nb:[]},

{id:"svmlin",n:"SVM (kernel lineal)",f:"sup",b:"cat",st:"nb",cx:3,
 q:"¿Dónde está la frontera más segura entre dos clases?",
 e:"Busca el hiperplano que deja <b>el mayor margen posible</b> a ambos lados. Solo importan los puntos del borde (los vectores de soporte); el resto del dataset es irrelevante para la frontera.",
 ex:"Compra de iPhone según edad y salario.",k:"Margen máximo; excelente con muchas variables y pocas filas.",
 m:"ROC-AUC · F1 · Recall",no:"Millones de filas con SVC clásico (ahí usa LinearSVC o SGDClassifier) o necesitas probabilidades bien calibradas.",
 biz:"Segmentar targets de campaña → conversión.",
 a:[SC.alta,SC.media,SC.muyalta,SC.alta],
 nb:[["iPhone","03-Machine-Learning/01-supervisado/clasificacion/06-svm/01-compra-iphone"],
     ["Baterías","03-Machine-Learning/01-supervisado/clasificacion/06-svm/02-reemplazo-baterias"]]},

{id:"svmker",n:"SVM (kernel RBF / polinómico)",f:"sup",b:"cat",st:"nb",cx:4,
 q:"¿Y si la frontera entre clases es curva?",
 e:"El <b>truco del kernel</b>: proyecta los datos a un espacio de más dimensiones donde SÍ se pueden separar con una recta, sin calcular nunca ese espacio explícitamente. Muy potente, muy caja negra.",
 ex:"Mantenimiento predictivo de baterías (kernel polinómico grado 2).",k:"Fronteras no lineales sin construir las variables a mano.",
 m:"Recall · F1 · ROC-AUC",no:"Datasets grandes: el coste crece de forma cuadrática/cúbica.",
 biz:"Detectar equipos a punto de fallar → paradas evitadas.",
 a:[SC.alta,SC.baja,SC.muyalta,SC.baja],
 nb:[["Baterías","03-Machine-Learning/01-supervisado/clasificacion/06-svm/02-reemplazo-baterias"]]},

{id:"knn",n:"K-Nearest Neighbors (KNN)",f:"sup",b:"cat",st:"pend",cx:1,
 q:"¿A qué casos conocidos se parece más este caso nuevo?",
 e:"No entrena nada: guarda todos los datos y, cuando llega un caso nuevo, <b>mira sus K vecinos más cercanos y copia lo que hagan la mayoría</b>. Simple, intuitivo y sorprendentemente competitivo con pocos datos.",
 ex:"Recomendación por «clientes similares».",k:"Cero entrenamiento; todo el coste está en predecir.",
 m:"F1 · ROC-AUC · Accuracy",no:"Muchas dimensiones (maldición de la dimensionalidad) o predicción en tiempo real.",
 biz:"Sugerir el siguiente producto → cross-sell.",
 a:[SC.mediaalta,SC.alta,SC.baja,SC.alta],nb:[]},

{id:"nb",n:"Naive Bayes",f:"sup",b:"cat",st:"nb",cx:1,
 q:"¿Clasificación rapidísima por probabilidades, sobre todo con texto?",
 e:"Aplica el teorema de Bayes asumiendo (ingenuamente) que <b>todas las variables son independientes entre sí</b>. El supuesto es falso casi siempre y aun así funciona muy bien en texto, entrenando en milisegundos.",
 ex:"Filtro de spam, análisis de sentimiento, clasificación de tickets.",k:"Baseline instantáneo e imbatible en coste para texto.",
 m:"Precision · F1 · ROC-AUC",no:"Las variables están fuertemente correlacionadas y quieres probabilidades fiables.",
 biz:"Enrutar tickets automáticamente → tiempo de respuesta.",
 a:[SC.mediaalta,SC.muyalta,SC.muyalta,SC.alta],
 nb:[["Naive Bayes","03-Machine-Learning/01-supervisado/clasificacion/07-naive-bayes"]]},

{id:"lda",n:"Análisis Discriminante Lineal (LDA)",f:"sup",b:"cat",st:"pend",cx:2,
 q:"¿Qué combinación de variables separa mejor mis grupos?",
 e:"Busca los ejes que <b>maximizan la distancia entre clases y minimizan la dispersión dentro de cada una</b>. Clasifica y reduce dimensionalidad a la vez, y es de los modelos más interpretables que hay.",
 ex:"Clasificar perfiles clínicos o financieros con muchas variables numéricas.",k:"Clasifica y proyecta a la vez; muy interpretable.",
 m:"F1 · ROC-AUC · varianza explicada por eje",no:"Las clases tienen dispersiones muy distintas (usa QDA).",
 biz:"Perfilar segmentos → argumentario comercial.",
 a:[SC.alta,SC.alta,SC.media,SC.muyalta],nb:[]},

{id:"qda",n:"Análisis Discriminante Cuadrático (QDA)",f:"sup",b:"cat",st:"pend",cx:3,
 q:"¿Y si cada clase tiene una forma y una dispersión distintas?",
 e:"Como LDA pero <b>sin obligar a que todas las clases compartan la misma matriz de covarianza</b>. Gana flexibilidad (frontera curva) a costa de necesitar más datos por clase.",
 ex:"Dos grupos que se solapan pero con dispersiones muy diferentes.",k:"Frontera curva; una covarianza por clase.",
 m:"ROC-AUC · F1 · Accuracy",no:"Pocas observaciones por clase: estima mal las covarianzas.",
 biz:"Detectar perfiles atípicos dentro de un segmento → riesgo.",
 a:[SC.alta,SC.alta,SC.baja,SC.media],nb:[]},

/* ── SUPERVIVENCIA ───────────────────────────────────────────── */
{id:"cox",n:"Supervivencia (Cox / Kaplan-Meier)",f:"sup",b:"sup",st:"pend",cx:4,est:1,
 q:"¿CUÁNDO ocurrirá el evento, no solo si ocurre?",
 e:"Modela el <b>tiempo hasta un evento</b> aprovechando también a los que todavía no lo han sufrido (datos censurados) — información que una clasificación normal tiraría a la basura. Cox devuelve un <i>hazard ratio</i>: cuánto acelera cada variable la llegada del evento.",
 ex:"Tiempo hasta que un cliente se da de baja o una máquina falla.",k:"Usa a los que aún no han fallado; devuelve curvas de riesgo.",
 m:"C-index · curvas de Kaplan-Meier · hazard ratio",no:"Solo te importa el sí/no y todos los casos están cerrados.",
 biz:"Cuándo actuar sobre cada cliente → timing de retención.",
 a:[SC.alta,SC.alta,SC.baja,SC.alta],nb:[]},

/* ── CAUSAL ──────────────────────────────────────────────────── */
{id:"uplift",n:"Uplift Modeling",f:"sup",b:"cau",st:"pend",cx:5,est:1,
 q:"¿A quién CAMBIA de verdad la campaña, no solo quién compra?",
 e:"Con un experimento (tratamiento vs control), estima el <b>efecto incremental por persona</b>: separa a quien iba a comprar igualmente de quien compra solo si le impactas. Es la diferencia entre predecir y decidir.",
 ex:"A quién enviar la promoción para maximizar el efecto neto.",k:"Optimiza el incremento, no la conversión bruta.",
 m:"Curva de Qini · uplift@k",no:"No tienes grupo de control aleatorio: sin él necesitas supuestos fuertes (ver Propensity Score) y el resultado es mucho menos fiable.",
 biz:"Dónde gastar el presupuesto de promoción → ROI incremental.",
 a:[SC.mediaalta,SC.media,SC.media,SC.media],nb:[]},

{id:"propensity",n:"Propensity Score / Diff-in-Diff",f:"sup",b:"cau",st:"pend",cx:5,est:1,
 q:"¿Puedo medir el efecto de algo sin haber hecho un experimento?",
 e:"Construye un grupo de control «sintético» emparejando cada tratado con un no-tratado de características equivalentes (propensity), o <b>compara la evolución antes/después entre grupos</b> (diff-in-diff) para descontar la tendencia general.",
 ex:"Medir el impacto de una subida de precio ya aplicada.",k:"Efecto causal a partir de datos observacionales.",
 m:"ATE / ATT · balance de covariables · test de tendencias paralelas",no:"Existe una variable de confusión no observada: el resultado será sesgado.",
 biz:"Justificar si la acción funcionó → decisión de repetirla.",
 a:[SC.media,SC.alta,SC.media,SC.alta],nb:[]},

/* ── DEEP LEARNING ───────────────────────────────────────────── */
{id:"mlp",n:"Redes Neuronales (MLP)",f:"dl",b:"net",st:"nb",cx:4,
 q:"¿Hay un patrón complejo que ningún modelo lineal capta?",
 e:"Capas de neuronas donde cada una combina las salidas de la anterior y les aplica una función no lineal. Apilando capas, la red <b>construye sus propias variables intermedias</b> en vez de que se las des tú.",
 ex:"Clasificación fintech, forecast de consumo eléctrico, sentimiento IMDB.",k:"Aprende las interacciones que no sabes formular.",
 m:"ROC-AUC · F1 · curva de pérdida train/val",no:"Datos tabulares con pocas filas: el boosting casi siempre gana y explica mejor.",
 biz:"Automatizar decisiones complejas → escala.",
 a:[SC.muyalta,SC.baja,SC.alta,SC.nula],
 nb:[["Fundamentos · capas ocultas","03-Machine-Learning/03-redes-neuronales/mlp/00-fundamentos-capas-ocultas"],
     ["Clasificación fintech","03-Machine-Learning/03-redes-neuronales/mlp/01-clasificacion-fintech"],
     ["Forecast eléctrico","03-Machine-Learning/03-redes-neuronales/mlp/02-forecast-consumo-electrico"],
     ["Sentimiento IMDB","03-Machine-Learning/03-redes-neuronales/mlp/03-clasificacion-sentimiento-imdb"]]},

{id:"cnn",n:"Redes Convolucionales (CNN)",f:"dl",b:"net",st:"std",cx:5,
 q:"¿Qué hay en esta imagen y dónde está?",
 e:"Filtros que recorren la imagen detectando patrones locales y se van componiendo por capas: <b>bordes → texturas → formas → objetos</b>. Aprovecha que un píxel solo tiene sentido junto a sus vecinos.",
 ex:"Detección de objetos en catálogo y conteo de vehículos (YOLOv8 preentrenado; la versión actual de la familia es YOLO26, enero de 2026).",
 k:"Convolución + pooling; la arquitectura estándar de visión.",
 m:"mAP · IoU · Accuracy top-1",no:"Datos tabulares, o no tienes ni GPU ni miles de imágenes etiquetadas.",
 biz:"Automatizar inspección visual → coste por revisión.",
 a:[SC.max,SC.baja,SC.max,SC.nula],
 nb:[["Detección de objetos (YOLOv8)","04-IA-BigData/06-vision-artificial/01-deteccion-objetos-imagenes"],
     ["Conteo de vehículos (YOLOv8+ByteTrack)","04-IA-BigData/06-vision-artificial/02-conteo-vehiculos-video"]],
 warn:"Tus notebooks aplican una CNN <b>preentrenada</b> (YOLOv8), no entrenas una desde cero. Por eso figura como «estudiado» y no como notebook propio de CNN."},

{id:"rnn",n:"RNN / LSTM",f:"dl",b:"net",st:"pend",cx:5,
 q:"¿El orden de los datos importa (texto, series, secuencias)?",
 e:"Redes con memoria: cada paso recibe la entrada actual <b>más el resumen de todo lo anterior</b>. La LSTM añade unas «puertas» que deciden qué recordar y qué olvidar, resolviendo el olvido de las RNN clásicas.",
 ex:"Predicción de demanda con dependencias largas, generación de texto.",k:"Estado oculto que arrastra el contexto de la secuencia.",
 m:"RMSE (series) · Accuracy/F1 (texto)",no:"Secuencias largas y GPU disponible: los Transformers las superan.",
 biz:"Anticipar demanda con patrones largos → inventario.",
 a:[SC.muyalta,SC.muybaja,SC.alta,SC.nula],nb:[]},

{id:"transformer",n:"Transformers",f:"dl",b:"net",st:"pend",cx:5,
 q:"¿Cómo entiendo texto de verdad, y no solo palabras sueltas?",
 e:"El mecanismo de <b>atención</b>: cada elemento de la secuencia mira a todos los demás a la vez y decide cuáles son relevantes. Al no procesar en orden (la posición se le añade aparte), paraleliza y escala: es la base de prácticamente todos los LLM.",
 ex:"Clasificación semántica, extracción de información, RAG, LLMs.",k:"Atención: contexto global en paralelo.",
 m:"F1 · Accuracy · perplejidad",no:"Un problema tabular o un dataset pequeño: es matar moscas a cañonazos.",
 biz:"Explotar texto libre (reseñas, tickets) → conocimiento de cliente.",
 a:[SC.max,SC.muybaja,SC.max,SC.nula],nb:[]},

{id:"autoenc",n:"Autoencoders",f:"unsup",b:"ano",st:"pend",cx:5,
 q:"¿Puedo comprimir mis datos y detectar lo que no encaja?",
 e:"Una red que aprende a <b>reconstruir su propia entrada</b> pasando por un cuello de botella. Lo que consigue reconstruir bien es «normal»; lo que reconstruye mal es una anomalía. PCA no lineal, en esencia.",
 ex:"Detección de fraude o de defectos sin ejemplos etiquetados.",k:"Comprime y reconstruye; el error de reconstrucción es la señal.",
 m:"Error de reconstrucción · Precision@k",no:"Un Isolation Forest te resuelve el caso con una fracción del esfuerzo.",
 biz:"Alertar de casos anómalos → pérdidas evitadas.",
 a:[SC.na,SC.baja,SC.max,SC.nula],nb:[]},

{id:"rbm",n:"Máquinas de Boltzmann Restringidas (RBM)",f:"dl",b:"net",st:"pend",cx:5,
 q:"¿Qué factores latentes generan lo que observo?",
 e:"Red generativa de dos capas que aprende una <b>distribución de probabilidad sobre los datos</b> mediante variables ocultas. Históricamente importante (preentrenamiento, recomendadores de Netflix), hoy poco usada.",
 ex:"Filtrado colaborativo clásico y preentrenamiento de redes profundas.",k:"Generativa y probabilística; sobre todo valor histórico.",
 m:"Error de reconstrucción · log-verosimilitud",no:"Casi siempre: un autoencoder o un modelo matricial es más simple y mejor.",
 biz:"Descubrir factores latentes de preferencia → recomendación.",
 a:[SC.alta,SC.baja,SC.alta,SC.baja],nb:[]},

{id:"som",n:"Mapas Autoorganizados (SOM)",f:"unsup",b:"net",st:"nb",cx:4,est:1,
 q:"¿Puedo ver mis segmentos como un mapa en 2D?",
 e:"Red neuronal <b>no supervisada</b> de una sola capa (no es deep learning, aunque viva en esta sección) que proyecta datos de muchas dimensiones sobre una rejilla 2D conservando la vecindad: los perfiles parecidos caen en celdas contiguas. Clustering y visualización en el mismo objeto.",
 ex:"Segmentación de clientes y perfilado de jugadores de fútbol.",k:"Rejilla topológica: clusteriza y dibuja el mapa a la vez.",
 m:"Error de cuantización · error topográfico",no:"Solo quieres K grupos y ninguna visualización: K-Means es más directo.",
 biz:"Explicar los segmentos visualmente → alineación de negocio.",
 a:[SC.na,SC.media,SC.media,SC.alta],
 nb:[["Segmentación de clientes","03-Machine-Learning/03-redes-neuronales/som/01-segmentacion-clientes"],
     ["Jugadores de fútbol","03-Machine-Learning/03-redes-neuronales/som/02-jugadores-futbol"]]},

/* ── CLUSTERING ──────────────────────────────────────────────── */
{id:"kmeans",n:"K-Means",f:"unsup",b:"grp",st:"nb",cx:2,
 q:"¿En qué grupos naturales se dividen mis clientes?",
 e:"Coloca K centros y repite dos pasos: <b>asigna cada punto a su centro más cercano y recoloca cada centro en la media de los suyos</b>. Converge rápido y es el clustering por defecto de la industria.",
 ex:"Segmentación retail, socios de gimnasio, perfiles políticos.",k:"Rápido y directo; tú decides K (codo / silueta).",
 m:"Silueta · inercia · Davies-Bouldin",no:"Grupos alargados o de densidad muy distinta; hay outliers fuertes.",
 biz:"Diseñar ofertas por segmento → conversión.",
 a:[SC.na,SC.alta,SC.baja,SC.media],
 nb:[["Clientes retail","03-Machine-Learning/02-no-supervisado/clustering/kmeans/01-segmentacion-clientes-retail"],
     ["Gimnasio","03-Machine-Learning/02-no-supervisado/clustering/kmeans/02-segmentacion-gimnasio"],
     ["Segmentación política","03-Machine-Learning/02-no-supervisado/clustering/kmeans/03-segmentacion-votantes"],
     ["Retail + t-SNE","03-Machine-Learning/02-no-supervisado/clustering/kmeans/04-segmentacion-retail-tsne"],
     ["Usuarios LinkedIn","03-Machine-Learning/02-no-supervisado/clustering/kmeans/05-segmentacion-usuarios-linkedin"]]},

{id:"kmedoids",n:"K-Medoids (PAM)",f:"unsup",b:"grp",st:"pend",cx:3,
 q:"¿Y si quiero que el centro de cada grupo sea un cliente REAL?",
 e:"Como K-Means, pero el centro no es una media inventada sino <b>un caso concreto del dataset</b> (el medoide). Más robusto a outliers y mucho más fácil de explicar: «este cliente representa al segmento».",
 ex:"Segmentación donde necesitas un caso-tipo tangible por grupo.",k:"El centro es un dato real, no un promedio.",
 m:"Silueta · coste total de disimilitud",no:"Datasets grandes: escala peor que K-Means.",
 biz:"Presentar un «cliente tipo» por segmento → storytelling comercial.",
 a:[SC.na,SC.media,SC.baja,SC.alta],nb:[]},

{id:"jerarquico",n:"Clustering Jerárquico",f:"unsup",b:"grp",st:"nb",cx:3,
 q:"¿Cómo se anidan mis grupos, sin fijar cuántos hay?",
 e:"Empieza con cada punto en su propio grupo y <b>va fusionando los dos más cercanos</b> hasta que queda uno solo. El dendrograma resultante te deja cortar a la altura que quieras y ver la jerarquía completa.",
 ex:"Exploración de segmentos en 4 casos progresivos (hasta 4 variables).",k:"Dendrograma: eliges el número de grupos DESPUÉS de verlo.",
 m:"Silueta · distancia de fusión · coeficiente cofenético",no:"Muchos miles de filas: el coste es cuadrático o peor.",
 biz:"Explorar la estructura de la cartera → diseño de segmentación.",
 a:[SC.na,SC.baja,SC.baja,SC.alta],
 nb:[["Caso introductorio","03-Machine-Learning/02-no-supervisado/clustering/jerarquico/01-segmentacion-ecommerce"],
     ["Caso avanzado","03-Machine-Learning/02-no-supervisado/clustering/jerarquico/02-perfiles-gimnasio"],
     ["Caso completo","03-Machine-Learning/02-no-supervisado/clustering/jerarquico/03-segmentacion-banca"],
     ["Gimnasio · 4 variables (radar)","03-Machine-Learning/02-no-supervisado/clustering/jerarquico/04-perfiles-gimnasio-radar"]]},

{id:"dbscan",n:"DBSCAN",f:"unsup",b:"grp",st:"pend",cx:3,
 q:"¿Grupos de forma irregular, y además quiero detectar el ruido?",
 e:"Agrupa por <b>densidad</b>: un punto pertenece a un cluster si tiene suficientes vecinos cerca. Lo que queda aislado se etiqueta como ruido — así que clusteriza y detecta outliers en la misma pasada.",
 ex:"Zonas de densidad geográfica, rutas, patrones espaciales.",k:"No fijas K y devuelve una etiqueta «ruido» explícita.",
 m:"Silueta · nº de clusters · % de ruido",no:"Los grupos tienen densidades muy distintas entre sí (mira HDBSCAN).",
 biz:"Localizar zonas calientes → ubicación de recursos.",
 a:[SC.na,SC.alta,SC.media,SC.alta],nb:[]},

{id:"gmm",n:"Gaussian Mixture (GMM)",f:"unsup",b:"grp",st:"pend",cx:4,
 q:"¿Y si un cliente pertenece a varios grupos a la vez?",
 e:"Asume que los datos vienen de una mezcla de campanas de Gauss y estima cuáles. Cada punto recibe una <b>probabilidad de pertenencia a cada grupo</b> en lugar de una etiqueta dura: clustering «blando».",
 ex:"Segmentación donde los perfiles se solapan (cliente 70% A, 30% B).",k:"Clustering probabilístico; admite grupos elípticos.",
 m:"BIC / AIC · log-verosimilitud · silueta",no:"Los grupos no son ni de lejos gaussianos.",
 biz:"Personalizar mensajes con matices → relevancia.",
 a:[SC.na,SC.media,SC.media,SC.media],nb:[]},

/* ── REDUCCIÓN DE DIMENSIONALIDAD ────────────────────────────── */
{id:"pca",n:"PCA",f:"unsup",b:"dim",st:"nb",cx:2,
 q:"¿Puedo resumir 40 variables en 3 sin perder lo importante?",
 e:"Encuentra los ejes (componentes) <b>a lo largo de los cuales tus datos más varían</b> y los usa como nuevas variables. Los primeros componentes suelen concentrar la mayor parte de la información.",
 ex:"Análisis de emails y segmentación de empleados.",k:"Ejes ortogonales ordenados por varianza explicada.",
 m:"% de varianza explicada · scree plot",no:"Necesitas conservar el significado literal de cada variable original.",
 biz:"Simplificar el cuadro de mando → legibilidad.",
 a:[SC.na,SC.muyalta,SC.muyalta,SC.alta],
 nb:[["Análisis de emails","03-Machine-Learning/02-no-supervisado/reduccion-dimensionalidad/pca/01-comportamiento-clientes-email"],
     ["Segmentación de empleados","03-Machine-Learning/02-no-supervisado/reduccion-dimensionalidad/pca/02-segmentacion-empleados"]]},

{id:"tsne",n:"t-SNE",f:"unsup",b:"dim",st:"nb",cx:3,
 q:"¿Cómo veo en un plano datos de 30 dimensiones?",
 e:"Proyecta a 2D intentando que <b>los puntos cercanos en el espacio original queden cercanos en el mapa</b>. Es una herramienta de visualización, no de modelado: las distancias globales del mapa no significan nada.",
 ex:"Mapa visual de los segmentos de cliente retail.",k:"Preserva la vecindad local; ideal para presentar clusters.",
 m:"Inspección visual · divergencia KL",no:"Como paso previo a un modelo: no uses sus coordenadas como features.",
 biz:"Enseñar los segmentos a negocio → aceptación del modelo.",
 a:[SC.na,SC.baja,SC.media,SC.baja],
 nb:[["Segmentación retail + t-SNE","03-Machine-Learning/02-no-supervisado/clustering/kmeans/04-segmentacion-retail-tsne"]]},

{id:"umap",n:"UMAP",f:"unsup",b:"dim",st:"pend",cx:3,
 q:"¿Visualización 2D rápida que además respete la estructura global?",
 e:"Como t-SNE pero basado en topología: es <b>bastante más rápido y conserva mejor las distancias entre clusters</b>, no solo dentro de ellos. Y, a diferencia de t-SNE, sí se puede usar como reducción previa a un modelo.",
 ex:"Explorar embeddings de texto o segmentos con muchas filas.",k:"Más rápido que t-SNE y con estructura global más fiable.",
 m:"Inspección visual · métricas de vecindad preservada",no:"Necesitas la interpretabilidad de componentes que sí da PCA.",
 biz:"Explorar grandes volúmenes → detección de nichos.",
 a:[SC.na,SC.alta,SC.alta,SC.baja],nb:[]},

/* ── ANOMALÍAS ───────────────────────────────────────────────── */
{id:"iforest",n:"Isolation Forest",f:"unsup",b:"ano",st:"pend",cx:3,
 q:"¿Qué casos son raros o sospechosos frente al patrón normal?",
 e:"Le da la vuelta al problema: en vez de modelar lo normal, <b>parte los datos al azar y mide cuántos cortes hacen falta para aislar cada punto</b>. Lo anómalo se aísla enseguida. Rapidísimo y escala muy bien.",
 ex:"Fraude, transacciones atípicas, errores de proceso.",k:"Aísla lo raro con pocos cortes; sin etiquetas.",
 m:"Precision@k · Recall@k · ROC-AUC (si hay etiquetas)",no:"Tienes etiquetas de fraude suficientes: un clasificador supervisado gana.",
 biz:"Priorizar qué revisar → pérdidas evitadas.",
 a:[SC.na,SC.alta,SC.alta,SC.media],nb:[]},

{id:"lof",n:"Local Outlier Factor (LOF)",f:"unsup",b:"ano",st:"pend",cx:3,est:1,
 q:"¿Qué puntos son anómalos respecto a SU vecindario?",
 e:"Compara la densidad de cada punto con la de sus vecinos. Detecta el outlier <b>relativo</b>: un valor que sería normal en otra zona del dataset pero es raro donde está. Ve sutilezas que un método global no capta.",
 ex:"Anomalías en sensores o control de calidad por lote.",k:"Rareza local, no global.",
 m:"Precision@k · AUC si hay etiquetas",no:"Volúmenes muy grandes: es costoso. Y recuerda que por defecto (novelty=False) solo puntúa el propio conjunto; para datos nuevos hay que activar novelty=True.",
 biz:"Detectar desviaciones por línea o turno → calidad.",
 a:[SC.na,SC.media,SC.baja,SC.media],nb:[]},

/* ── ASOCIACIÓN ──────────────────────────────────────────────── */
{id:"apriori",n:"Apriori / Market Basket",f:"asoc",b:"aso",st:"nb",cx:2,
 q:"¿Qué productos se compran juntos?",
 e:"Busca combinaciones frecuentes en los tickets y las convierte en reglas <b>«si compra A → compra B»</b> con tres números: soporte (cuántas veces pasa), confianza (cuán fiable es) y lift (cuánto mejora frente al azar).",
 ex:"Análisis de la cesta de la compra sobre tickets de supermercado.",k:"Soporte · confianza · lift. Reglas legibles sin modelo negro.",
 m:"Soporte · Confianza · Lift (>1 = asociación real)",no:"Quieres recomendación personalizada por cliente (usa filtrado colaborativo).",
 biz:"Colocación en tienda y packs → ticket medio.",
 a:[SC.media,SC.alta,SC.media,SC.alta],
 nb:[["Cesta de la compra (Apriori)","04-IA-BigData/04-mineria-datos/01-cesta-compra-apriori"]]},

/* ── RECOMENDADORES ──────────────────────────────────────────── */
{id:"reco",n:"Filtrado Colaborativo",f:"unsup",b:"rec",st:"pend",cx:4,est:1,
 q:"¿Qué le gustará a ESTE cliente según clientes parecidos?",
 e:"No mira el producto, mira el <b>patrón de comportamiento</b>: si tú y otro cliente coincidís en 20 compras, lo que él compró y tú no es tu recomendación. Factoriza la matriz cliente×producto para descubrir gustos latentes.",
 ex:"«Quien compró esto también compró…».",k:"Personalizado por usuario; no necesita atributos del producto.",
 m:"Precision@k · Recall@k · NDCG",no:"Arranque en frío: usuario o producto nuevos sin histórico.",
 biz:"Recomendaciones en ficha y email → cross-sell.",
 a:[SC.mediaalta,SC.media,SC.alta,SC.baja],nb:[]},

{id:"contentbased",n:"Recomendador basado en contenido (TF-IDF + Similitud)",f:"unsup",b:"rec",st:"nb",cx:3,est:1,
 q:"¿Qué recomiendo si NO tengo histórico de otros usuarios, solo la ficha del producto?",
 e:"Vectoriza el texto de cada producto (género, sinopsis…) con <b>TF-IDF</b> y mide el parecido entre productos con <b>similitud coseno</b>. Recomienda lo más parecido en contenido, sin mirar qué hicieron otros usuarios.",
 ex:"Recomendador de películas por género y sinopsis.",k:"No sufre arranque en frío de usuario: solo necesita la ficha del producto nuevo.",
 m:"Similitud coseno media de lo recomendado · revisión cualitativa de vecinos",no:"El catálogo es muy grande y el vocabulario se solapa entre categorías: pasa a embeddings semánticos.",
 biz:"«Películas parecidas a esta» sin depender del histórico de la comunidad → cross-sell desde el día uno.",
 a:[SC.media,SC.alta,SC.media,SC.alta],
 nb:[["Películas (género + sinopsis)","04-IA-BigData/02-sistemas-recomendacion/01-recomendador-peliculas-contenido","peliculas.ipynb"]]},

/* ── TEXTO ───────────────────────────────────────────────────── */
{id:"topic",n:"Topic Modeling (LDA)",f:"unsup",b:"txt",st:"pend",cx:4,est:1,
 q:"¿De qué hablan mis textos sin leerlos uno a uno?",
 e:"Asume que cada documento es una <b>mezcla de temas</b> y cada tema una mezcla de palabras, y estima ambas cosas a la vez. Te devuelve los temas latentes de miles de reseñas sin que tú los definas.",
 ex:"Reseñas, encuestas abiertas y tickets de soporte.",k:"Descubre los temas; no los defines tú de antemano.",
 m:"Coherencia (c_v) · perplejidad · revisión humana",no:"Textos muy cortos (tweets) o ya sabes qué categorías buscas (clasifica).",
 biz:"Saber de qué se queja el cliente → hoja de ruta de producto.",
 a:[SC.na,SC.media,SC.muyalta,SC.media],nb:[],
 warn:"Ojo con el nombre: este LDA (<i>Latent Dirichlet Allocation</i>) no tiene nada que ver con el LDA discriminante de clasificación."},

/* ── PROBABILÍSTICOS ─────────────────────────────────────────── */
{id:"bayesnet",n:"Redes Bayesianas",f:"prob",b:"prb",st:"pend",cx:5,
 q:"¿Cómo se influyen mis variables entre sí?",
 e:"Un grafo donde cada nodo es una variable y cada flecha una dependencia probabilística. Permite <b>preguntar «¿y si…?»</b> propagando evidencia por la red — y, si el grafo es causal, razonar sobre intervenciones.",
 ex:"Diagnóstico de causas raíz en un proceso con muchos factores.",k:"Grafo explícito de dependencias; admite conocimiento experto.",
 m:"Log-verosimilitud · BIC · precisión de la inferencia",no:"Solo quieres predecir: un boosting es más preciso y más barato.",
 biz:"Entender la cadena de causas → dónde intervenir.",
 a:[SC.mediaalta,SC.media,SC.alta,SC.media],nb:[]},

{id:"hmm",n:"Modelos Ocultos de Markov (HMM)",f:"prob",b:"prb",st:"pend",cx:5,
 q:"¿En qué estado invisible está el sistema en cada momento?",
 e:"Supone que hay una <b>secuencia de estados que no ves</b> (régimen de mercado, fase de una máquina, intención de un usuario) y que solo observas sus efectos. Reconstruye la secuencia de estados más probable.",
 ex:"Detectar cambios de régimen en una serie o fases de una sesión de usuario.",k:"Infiere estados latentes a partir de observaciones secuenciales.",
 m:"Log-verosimilitud · BIC · coherencia de los estados",no:"No hay estructura secuencial: un clustering normal basta.",
 biz:"Detectar el cambio de régimen a tiempo → reacción temprana.",
 a:[SC.mediaalta,SC.media,SC.media,SC.media],nb:[]},

/* ── SERIES TEMPORALES ───────────────────────────────────────── */
{id:"arima",n:"ARIMA",f:"ts",b:"fut",st:"nb",cx:3,est:1,
 q:"¿Cómo evolucionará esta métrica sin patrón estacional?",
 e:"Combina tres piezas: <b>AR</b> (el valor de hoy depende de los anteriores), <b>I</b> (diferenciar para quitar la tendencia) y <b>MA</b> (corregir con los errores pasados). El modelo base de toda serie temporal.",
 ex:"Ventas retail y consumo eléctrico.",k:"El baseline obligatorio antes de cualquier cosa más compleja.",
 m:"RMSE · MAE · MAPE · AIC · residuos ruido blanco",no:"La serie tiene estacionalidad marcada: pasa a SARIMA.",
 biz:"Planificar el próximo trimestre → presupuesto.",
 a:[SC.mediaalta,SC.alta,SC.baja,SC.alta],
 nb:[["Caso retail","03-Machine-Learning/04-series-temporales/arima/01-ventas-semanales-retail"],
     ["Forecast electricidad","03-Machine-Learning/04-series-temporales/arima/02-forecast-electricidad"]]},

{id:"sarima",n:"SARIMA",f:"ts",b:"fut",st:"nb",cx:4,est:1,
 q:"¿Y si mi serie repite un patrón cada semana o cada año?",
 e:"ARIMA más un bloque estacional (<code>seasonal_order</code>) que repite la misma lógica <b>con desfase de un ciclo completo</b>: compara este diciembre con el diciembre anterior, no con noviembre.",
 ex:"Ventas con estacionalidad anual y demanda eléctrica semanal.",k:"Captura el ciclo que se repite; la (s) del nombre.",
 m:"RMSE · MAPE · AIC · ACF de residuos",no:"No hay ciclo real: estás añadiendo parámetros que no aportan.",
 biz:"Anticipar picos de campaña → dimensionar equipo y stock.",
 a:[SC.alta,SC.media,SC.baja,SC.alta],
 nb:[["Caso retail","03-Machine-Learning/04-series-temporales/arima/01-ventas-semanales-retail"],
     ["Forecast electricidad","03-Machine-Learning/04-series-temporales/arima/02-forecast-electricidad"]]},

{id:"sarimax",n:"SARIMAX",f:"ts",b:"fut",st:"nb",cx:4,est:1,
 q:"¿Y si además influyen el precio, el clima o los festivos?",
 e:"SARIMA más <b>variables exógenas</b> (la X): metes drivers externos como regresores y el modelo separa lo que explica el pasado de la serie de lo que explican esas palancas.",
 ex:"Ventas retail con eventos externos (promociones, huelgas, crisis logísticas).",k:"Permite simular escenarios cambiando la exógena.",
 m:"RMSE · MAPE · significatividad de los exógenos",no:"No podrás conocer el valor futuro del exógeno: no te sirve para predecir.",
 biz:"Simular «¿y si subo el precio un 5%?» → pricing.",
 a:[SC.alta,SC.media,SC.media,SC.alta],
 nb:[["Ventas retail con variables exógenas (SARIMA vs SARIMAX)","03-Machine-Learning/04-series-temporales/arima/03-forecast-ventas-retail","forecasting_ventas_retail.ipynb"]]},

{id:"prophet",n:"Prophet",f:"ts",b:"fut",st:"pend",cx:2,est:1,
 q:"¿Forecasting rápido, automático y con festivos?",
 e:"Descompone la serie en <b>tendencia + estacionalidades + festivos</b> y ajusta cada pieza por separado. Tolera huecos y outliers, apenas requiere ajuste y produce gráficos que negocio entiende a la primera.",
 ex:"Previsión de tráfico web o ventas con calendario de festivos.",k:"Automático, robusto a huecos y con festivos integrados.",
 m:"RMSE · MAPE · validación con horizonte deslizante",no:"Series cortas o con dinámica compleja: ARIMA bien ajustado suele ganar.",
 biz:"Previsión operativa rápida → planificación semanal.",
 a:[SC.alta,SC.alta,SC.baja,SC.alta],nb:[]},

{id:"hw",n:"Holt-Winters (suavizado exponencial)",f:"ts",b:"fut",st:"pend",cx:2,est:1,
 q:"¿Un forecast sencillo con tendencia y estacionalidad?",
 e:"Da <b>más peso al pasado reciente</b> y va suavizando por separado nivel, tendencia y estacionalidad. Tres parámetros, cero teoría pesada, y un baseline sorprendentemente difícil de batir.",
 ex:"Previsión de inventario y reposición.",k:"Simple, rápido y muy competitivo como baseline.",
 m:"RMSE · MAE · MAPE",no:"Hay drivers externos importantes: necesitas SARIMAX o regresión.",
 biz:"Reponer inventario → disponibilidad.",
 a:[SC.media,SC.muyalta,SC.baja,SC.alta],nb:[]},

/* ── APRENDIZAJE POR REFUERZO ────────────────────────────────── */
{id:"bandit",n:"Multi-Armed Bandit",f:"rl",b:"rl",st:"pend",cx:3,est:1,
 q:"¿Cómo reparto el tráfico entre opciones mientras aún estoy aprendiendo cuál gana?",
 e:"Un A/B test que <b>se corrige solo mientras corre</b>: en vez de repartir 50/50 hasta el final, va enviando más tráfico a la variante que mejor funciona. Resuelve el dilema explorar vs. explotar y te ahorra el coste de seguir mostrando la opción perdedora.",
 ex:"Qué creatividad, precio o titular mostrar en una web con tráfico continuo.",
 k:"Es la puerta de entrada al refuerzo y la única que casi siempre justifica su coste en negocio.",
 m:"Regret acumulado · recompensa media · % de tráfico al mejor brazo",
 no:"Tienes un experimento cerrado con hipótesis fija y necesitas un p-valor limpio: usa un A/B test clásico.",
 biz:"Dejar de quemar tráfico en la variante perdedora → ingreso incremental.",
 a:[SC.alta,SC.muyalta,SC.baja,SC.alta],nb:[]},

{id:"qlearning",n:"Q-Learning",f:"rl",b:"rl",st:"pend",cx:4,est:1,
 q:"¿Cómo aprende un agente la mejor acción a base de prueba y error?",
 e:"Construye una tabla que estima <b>cuánta recompensa total esperas si haces la acción A estando en el estado S</b>. Cada intento actualiza esa tabla. No necesita saber cómo funciona el entorno: lo descubre chocándose.",
 ex:"Política de reposición de stock o de descuentos en un entorno simulado.",
 k:"Tabla Q legible: puedes leer literalmente qué haría el agente en cada situación.",
 m:"Recompensa acumulada por episodio · convergencia de la Q-table",
 no:"El espacio de estados es grande o continuo: la tabla no cabe (pasa a DQN).",
 biz:"Automatizar una política operativa repetitiva → coste por decisión.",
 a:[SC.media,SC.media,SC.baja,SC.alta],nb:[]},

{id:"sarsa",n:"SARSA",f:"rl",b:"rl",st:"nb",cx:4,est:1,
 q:"¿Cómo aprende un agente si quiero que sea prudente con la política que de verdad sigue?",
 e:"Como Q-Learning, pero <b>actualiza con la acción que realmente va a tomar</b> (on-policy), no con la mejor acción teórica. Aprende una política algo más conservadora porque tiene en cuenta su propia exploración.",
 ex:"Política de marketing personalizado por ciclo de vida del cliente.",
 k:"On-policy: aprende de lo que hace, no de lo que idealmente haría.",
 m:"Recompensa acumulada por episodio · convergencia de la Q-table frente a la solución óptima",
 no:"El entorno es determinista y sin riesgo real en la exploración: Q-Learning converge a una política igual de buena y más simple de explicar.",
 biz:"Automatizar una política operativa con exploración controlada → coste por decisión.",
 a:[SC.media,SC.media,SC.baja,SC.alta],
 nb:[["Marketing e-commerce","03-Machine-Learning/05-aprendizaje-por-refuerzo/sarsa/01-marketing-ecommerce"]]},

{id:"dqn",n:"Deep Q-Network (DQN)",f:"rl",b:"rl",st:"pend",cx:5,est:1,
 q:"¿Y si el agente tiene demasiados estados posibles para una tabla?",
 e:"Sustituye la tabla Q por <b>una red neuronal que la aproxima</b>. Así el agente puede generalizar a situaciones que nunca vio exactamente. Es lo que hizo posible jugar a videojuegos directamente desde los píxeles.",
 ex:"Control con muchas variables de estado o entrada visual.",
 k:"Red neuronal + repetición de experiencias para estabilizar el aprendizaje.",
 m:"Recompensa media por episodio · estabilidad frente a la semilla",
 no:"Acciones continuas (no discretas) o no tienes simulador: DQN necesita millones de interacciones.",
 biz:"Optimizar un proceso complejo simulable → eficiencia operativa.",
 a:[SC.alta,SC.muybaja,SC.alta,SC.nula],nb:[]},

{id:"ppo",n:"PPO (Proximal Policy Optimization)",f:"rl",b:"rl",st:"pend",cx:5,est:1,
 q:"¿Cuál es el algoritmo de refuerzo que se usa hoy de verdad?",
 e:"En vez de estimar el valor de cada acción, <b>aprende directamente la política</b> (qué hacer) y limita cuánto puede cambiar en cada paso para no desestabilizarse. Es el estándar en robótica y control, y fue el algoritmo del RLHF original de los asistentes (InstructGPT / ChatGPT). En LLMs, desde 2025 mandan variantes más baratas como <b>GRPO</b> y los métodos de preferencias directas (<b>DPO</b>).",
 ex:"Robótica, control continuo y ajuste fino de modelos de lenguaje.",
 k:"Aprende la política, no el valor; acciones continuas y entrenamiento estable.",
 m:"Recompensa media · divergencia KL respecto a la política anterior",
 no:"Tu problema se resuelve con un bandit o con una regla: el refuerzo es la opción más cara de todas.",
 biz:"Control continuo y alineamiento de modelos → capacidades nuevas.",
 a:[SC.muyalta,SC.muybaja,SC.alta,SC.nula],nb:[],
 warn:"El refuerzo necesita un <b>simulador o un entorno donde equivocarse salga barato</b>. Si cada error del agente cuesta dinero real, no es tu herramienta."},

/* ── ACELERADORES ────────────────────────────────────────────── */
{id:"automl",n:"AutoML (AutoGluon / FLAML / PyCaret)",f:"tool",b:"aut",st:"pend",cx:2,est:1,
 q:"¿Un buen modelo base rápido sin ajustar a mano?",
 e:"Automatiza preprocesado, comparación de modelos y tuning. <b>No sustituye tu criterio</b>: te da en minutos el ranking de qué familia funciona, para que tú profundices donde toca.",
 ex:"Comparar 15 modelos en minutos para un primer baseline.",k:"Explora el espacio de modelos por ti; tú decides después.",
 m:"La de la tarea (compara en el mismo split)",no:"Necesitas control total del pipeline o justificar cada paso ante auditoría.",
 biz:"Prototipar baseline → time-to-insight.",
 a:[SC.alta,SC.baja,SC.media,SC.baja],nb:[]},

{id:"pyspark",n:"PySpark / Spark SQL",f:"tool",b:"aut",st:"nb",cx:3,est:1,
 q:"¿Y si el dataset ya no cabe en pandas?",
 e:"Motor de computación <b>distribuida</b>: reparte el dataset en particiones y ejecuta las mismas transformaciones (filtros, agregaciones, joins, ventanas) en paralelo sobre varios nodos, sin cambiar la forma de pensar el problema tabular.",
 ex:"Validar en local un pipeline de ventas de 200K+ filas antes de moverlo a un lakehouse (Databricks / Fabric).",
 k:"Mismo álgebra relacional que pandas/SQL, pero paralelizado y perezoso (lazy evaluation).",
 m:"Tiempo de ejecución · shuffle/exchange en el plan físico · coste por optimización (partición, caché, formato)",
 no:"El dataset cabe cómodo en memoria: pandas es más simple y no paga el overhead de la JVM.",
 biz:"Que el pipeline siga funcionando cuando el dato crece 1000x → escalabilidad del análisis.",
 a:[SC.alta,SC.alta,SC.max,SC.media],
 nb:[["Pipeline de ventas distribuido","04-IA-BigData/07-big-data-distribuido/01-pipeline-ventas-pyspark"]]}
];

/* ══════════════════════════════════════════════════════════════
   CONTENIDO DE ESTUDIO (nivel 3 — vista de detalle)
   Completa los 3 escalones didácticos que faltaban en MODELS:
     fx  = cómo funciona por dentro (mecanismo / fórmula)
     cod = el mismo modelo en código, mínimo ejecutable
     rel = con qué se confunde y qué lo distingue  [id, distinción]
     chk = autochequeo — de criterio, no de definición
   Se fusiona dentro de MODELS antes de renderizar: la fuente
   única de verdad sigue siendo MODELS.
   ══════════════════════════════════════════════════════════════ */
var STUDY = {

linsimple:{
 fx:"<code>ŷ = β₀ + β₁x</code>. Se estima por mínimos cuadrados: la recta que minimiza <code>Σ(yᵢ − ŷᵢ)²</code>. La solución sale cerrada: <code>β₁ = cov(x,y) / var(x)</code>.",
 cod:"from sklearn.linear_model import LinearRegression\n\nm = LinearRegression().fit(X[['gasto_ads']], y)\nprint(f'Por cada euro extra: {m.coef_[0]:.2f} € de ventas')",
 rel:[["linmult","La simple usa una variable; la múltiple, varias — y ahí aparece el «a igualdad de todo lo demás»."]],
 chk:{q:"Añades una variable irrelevante y el R² sube de 0,62 a 0,64. ¿Qué está pasando?",
      a:"El R² <b>nunca baja</b> al añadir variables, aporten o no: siempre encuentra algo de ruido que ajustar. Por eso en múltiple se mira el <b>R² ajustado</b>, que sí penaliza meter variables inútiles."}},

linmult:{
 fx:"<code>ŷ = β₀ + β₁x₁ + … + βₚxₚ</code>. En forma matricial, <code>β = (XᵀX)⁻¹Xᵀy</code>. Cada βⱼ mide el efecto de su variable <b>manteniendo constantes las demás</b>.",
 cod:"import pandas as pd\nfrom sklearn.linear_model import LinearRegression\n\nm = LinearRegression().fit(X, y)\npd.Series(m.coef_, index=X.columns).sort_values(key=abs, ascending=False)",
 rel:[["linsimple","Misma idea con un solo eje."],
      ["ridge","Si XᵀX es casi singular por multicolinealidad, los coeficientes se disparan. Ridge lo estabiliza."]],
 chk:{q:"Dos variables correlacionadas a 0,95. El R² es alto, pero un coeficiente sale negativo cuando negocio dice que debería ser positivo. ¿Por qué?",
      a:"<b>Multicolinealidad.</b> Con XᵀX casi singular los coeficientes se vuelven inestables y pueden cambiar de signo sin que el R² se resienta: el modelo predice bien pero los β dejan de ser interpretables. Solución: Ridge, o quitar una de las dos."}},

ridge:{
 fx:"Minimiza <code>Σ(yᵢ − ŷᵢ)² + α·Σβⱼ²</code> — el término L2. Al subir α los coeficientes se encogen hacia cero, pero <b>nunca llegan a cero</b>.",
 cod:"import numpy as np\nfrom sklearn.linear_model import RidgeCV\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\n\nm = make_pipeline(StandardScaler(),\n                  RidgeCV(alphas=np.logspace(-3, 3, 50))).fit(X, y)",
 rel:[["lasso","L2 encoge todos los coeficientes; L1 puede anularlos. Ridge conserva, Lasso selecciona."],
      ["elastic","Elastic Net mezcla las dos penalizaciones."]],
 chk:{q:"¿Por qué hay que estandarizar antes de Ridge y no hace falta en una lineal normal?",
      a:"Porque la penalización castiga el <b>tamaño</b> del coeficiente. Si una variable va en euros y otra en miles de euros, sus coeficientes tienen escalas distintas y la penalización golpea mucho más a una que a otra por un motivo puramente de unidades, no de importancia."}},

lasso:{
 fx:"Minimiza <code>Σ(yᵢ − ŷᵢ)² + α·Σ|βⱼ|</code> — el término L1. El valor absoluto tiene un pico en cero, y ese pico es lo que permite que un coeficiente caiga <b>exactamente</b> a cero.",
 cod:"from sklearn.linear_model import LassoCV\n\nm = LassoCV(cv=5, random_state=42).fit(X_scaled, y)\nprint('Variables retenidas:', (m.coef_ != 0).sum(), 'de', len(m.coef_))",
 rel:[["ridge","Ridge encoge, Lasso elimina."],
      ["elastic","Elastic Net evita que Lasso descarte de forma arbitraria grupos correlacionados."]],
 chk:{q:"Tienes 5 variables casi idénticas (el mismo fenómeno medido de 5 maneras). Lasso deja una y anula las otras 4. ¿Acierto o problema?",
      a:"<b>Depende de para qué.</b> Como modelo predictivo, correcto: la información ya está dentro. Como lectura de negocio, engañoso: la superviviente no es «la importante», es <b>arbitraria</b> dentro del grupo — cambias la semilla y sale otra. Si vas a explicar drivers, Elastic Net."}},

elastic:{
 fx:"<code>Σ(y−ŷ)² + α·[ρ·Σ|βⱼ| + ((1−ρ)/2)·Σβⱼ²]</code>, donde ρ es <code>l1_ratio</code>. Un mando entre selección (L1) y estabilidad (L2).",
 cod:"from sklearn.linear_model import ElasticNetCV\n\nm = ElasticNetCV(l1_ratio=[.1, .5, .7, .9, .95, 1], cv=5).fit(X_scaled, y)\nprint('l1_ratio elegido:', m.l1_ratio_)",
 rel:[["ridge","l1_ratio = 0 lo convierte en Ridge puro."],
      ["lasso","l1_ratio = 1 lo convierte en Lasso puro."]],
 chk:{q:"Sin mirar arriba: ¿en qué se convierte Elastic Net con l1_ratio = 1 y con l1_ratio = 0?",
      a:"1 = <b>Lasso</b> puro (solo L1). 0 = <b>Ridge</b> puro (solo L2). Los valores intermedios mezclan ambas."}},

poisson:{
 fx:"Modela el logaritmo de la tasa: <code>log(λ) = β₀ + βx</code>, es decir <code>λ = e^(β₀+βx)</code>. Como la exponencial siempre es positiva, <b>nunca predice conteos negativos</b>. Asume media = varianza.",
 cod:"from sklearn.linear_model import PoissonRegressor\n\nm = PoissonRegressor(alpha=1e-4).fit(X, y_conteos)\n# Con statsmodels, si quieres p-valores:\n# sm.GLM(y, sm.add_constant(X), family=sm.families.Poisson()).fit().summary()",
 rel:[["linmult","Una lineal normal puede predecirte «−3 pedidos», que no significa nada."],
      ["quantile","Ambas se salen de la media, por motivos distintos: Poisson por la distribución, Cuantílica por el percentil."]],
 chk:{q:"Tus siniestros tienen media 2 y varianza 9. ¿Es válido Poisson?",
      a:"<b>No: hay sobredispersión</b> (varianza muy por encima de la media). Los coeficientes salen aproximadamente bien, pero los errores estándar salen demasiado pequeños, así que verás variables «significativas» que no lo son. Usa Binomial Negativa."}},

quantile:{
 fx:"Minimiza la <b>pinball loss</b>, asimétrica: para el cuantil τ penaliza <code>τ·(y−ŷ)</code> si te quedas corto y <code>(1−τ)·(ŷ−y)</code> si te pasas. Con τ = 0,9 quedarse corto duele 9 veces más.",
 cod:"from sklearn.linear_model import QuantileRegressor\n\np90 = QuantileRegressor(quantile=0.9, alpha=0).fit(X, y)\np50 = QuantileRegressor(quantile=0.5, alpha=0).fit(X, y)",
 rel:[["linmult","La lineal predice la media; ésta, el percentil que le pidas."],
      ["bayesridge","Otra vía para obtener rango: intervalo de credibilidad en vez de cuantiles."]],
 chk:{q:"Predices el P90 de demanda y la demanda real queda por debajo el 90% de las veces. ¿Va bien o va mal?",
      a:"<b>Va bien.</b> Eso es exactamente un P90 bien calibrado. Si solo cubriera el 70% de los casos estaría mal calibrado y tu stock de seguridad se quedaría corto."}},

bayesridge:{
 fx:"Pone un prior gaussiano sobre los coeficientes y estima su <b>distribución posterior</b> en vez de un número fijo. Los hiperparámetros de regularización se ajustan solos maximizando la evidencia.",
 cod:"from sklearn.linear_model import BayesianRidge\n\nm = BayesianRidge().fit(X, y)\ny_pred, y_std = m.predict(X_new, return_std=True)   # barra de error por predicción",
 rel:[["ridge","Misma penalización de fondo, pero Ridge da un punto y ésta una distribución."],
      ["gp","El GP lleva la misma idea bayesiana al espacio de funciones enteras."]],
 chk:{q:"¿Qué te da Bayesian Ridge que no te da un RidgeCV normal?",
      a:"Una <b>desviación típica por cada predicción individual</b> (no un intervalo global), y la regularización ajustada sin montar un bucle de validación cruzada."}},

gp:{
 fx:"En vez de ajustar una función, define una distribución <b>sobre todas las funciones posibles</b> mediante un kernel <code>k(x,x′)</code> y se queda con las compatibles con los datos. Coste O(n³): por eso no escala.",
 cod:"from sklearn.gaussian_process import GaussianProcessRegressor\nfrom sklearn.gaussian_process.kernels import RBF, WhiteKernel\n\nm = GaussianProcessRegressor(kernel=RBF() + WhiteKernel()).fit(X, y)\ny_pred, y_std = m.predict(X_new, return_std=True)",
 rel:[["bayesridge","Bayesian Ridge escala mejor; el GP es más flexible con muy pocos datos."],
      ["svr","Ambos usan kernels, pero solo el GP cuantifica incertidumbre."]],
 chk:{q:"40 observaciones y cada medición nueva cuesta 3.000 €. ¿GP o XGBoost?",
      a:"<b>GP.</b> Con 40 filas el boosting sobreajusta sin remedio. Y hay un extra decisivo: el GP te dice <b>dónde</b> tiene más incertidumbre, que es justo dónde conviene gastar los siguientes 3.000 €."}},

svr:{
 fx:"Define una banda de tolerancia ε alrededor de la predicción y <b>solo penaliza lo que se sale</b> de ella: <code>min ½‖w‖² + C·Σξᵢ</code>. El truco del kernel le permite curvarse.",
 cod:"from sklearn.svm import SVR\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\n\nm = make_pipeline(StandardScaler(),\n                  SVR(kernel='rbf', C=10, epsilon=0.1)).fit(X, y)",
 rel:[["svmker","Es el mismo SVM, prediciendo un número en vez de una clase."],
      ["gp","Alternativa con kernel que además da incertidumbre."]],
 chk:{q:"¿Qué controla exactamente el parámetro epsilon?",
      a:"El <b>ancho de la banda donde el error no cuenta</b>. Un ε grande da un modelo más plano y con menos vectores de soporte; un ε pequeño lo hace pegarse más a los datos."}},

gbr:{
 fx:"<code>F_m(x) = F_{m−1}(x) + ν·h_m(x)</code>, donde cada árbol h_m se ajusta al <b>gradiente negativo del error</b> que dejó el anterior. ν es el learning_rate.",
 cod:"from sklearn.ensemble import GradientBoostingRegressor\n\nm = GradientBoostingRegressor(n_estimators=500, learning_rate=0.05,\n                              max_depth=3, subsample=0.8).fit(X_tr, y_tr)",
 rel:[["xgboost","XGBoost es esta misma idea con regularización explícita y mucho más rápido."],
      ["rf","<b>Bagging vs boosting:</b> Random Forest entrena árboles en paralelo e independientes; el boosting los encadena para corregirse."]],
 chk:{q:"Bajas learning_rate de 0,1 a 0,01 y el modelo empeora. ¿Qué se te ha olvidado?",
      a:"<b>Subir n_estimators.</b> Learning rate y número de árboles son inversos: si cada paso es 10 veces más pequeño, necesitas del orden de 10 veces más pasos para recorrer la misma distancia."}},

logistica:{
 fx:"<code>p = 1 / (1 + e^−(β₀+βx))</code>, ajustada por máxima verosimilitud. Reordenando: <code>log(p/(1−p)) = β₀ + βx</code>, así que cada β es un <b>log-odds</b>.",
 cod:"from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\nm = make_pipeline(StandardScaler(),\n                  LogisticRegression(max_iter=1000)).fit(X_tr, y_tr)\nproba = m.predict_proba(X_te)[:, 1]    # probabilidad de la clase 1\npred  = (proba >= 0.30).astype(int)    # el umbral sale del coste de negocio, no de la librería\n# class_weight='balanced' ayuda a ordenar con desbalanceo,\n# pero infla las probabilidades: si las usas como tales, recalibra",
 rel:[["arbol","La logística da una probabilidad continua; el árbol, una regla legible."],
      ["lda","LDA asume normalidad y misma covarianza; la logística no asume distribución."],
      ["mlp","Un MLP sin capa oculta ES una regresión logística."]],
 chk:{q:"Accuracy del 97% con un 3% de churn. ¿Buen modelo?",
      a:"<b>Probablemente inútil.</b> Predecir «no se va nadie» ya da 97%. Con clases desbalanceadas la accuracy engaña: mira <b>PR-AUC</b> y el <b>recall de la clase minoritaria</b>, que es la que te cuesta dinero."}},

arbol:{
 fx:"En cada nodo elige el corte que más reduce la impureza — Gini <code>1 − Σpᵢ²</code> o entropía. Repite hasta un criterio de parada. Sin poda, memoriza.",
 cod:"from sklearn.tree import DecisionTreeClassifier, export_text\n\nm = DecisionTreeClassifier(max_depth=4, min_samples_leaf=20).fit(X_tr, y_tr)\nprint(export_text(m, feature_names=list(X.columns)))",
 rel:[["rf","Un bosque son cientos de estos árboles promediados: gana precisión, pierde legibilidad."],
      ["adaboost","AdaBoost encadena árboles de profundidad 1 en vez de hacer uno grande."]],
 chk:{q:"Árbol sin podar: 100% en train, 62% en test. ¿Qué haces?",
      a:"Sobreajuste de manual: ha memorizado. Limita <code>max_depth</code> y <code>min_samples_leaf</code>, o pasa directamente a Random Forest, que promedia el ruido de muchos árboles."}},

rf:{
 fx:"Entrena N árboles, cada uno sobre una muestra <b>bootstrap</b> y considerando solo un <b>subconjunto aleatorio de variables</b> en cada corte. Luego vota. La diversidad entre árboles es lo que cancela el error.",
 cod:"from sklearn.ensemble import RandomForestClassifier\n\nm = RandomForestClassifier(n_estimators=500, oob_score=True,\n                           n_jobs=-1, random_state=42).fit(X_tr, y_tr)\nprint('OOB:', m.oob_score_)",
 rel:[["extratrees","Extra Trees sortea también el punto de corte, no solo las variables."],
      ["gbr","Bagging (paralelo) frente a boosting (secuencial)."],
      ["arbol","Un solo árbol es el componente básico."]],
 chk:{q:"¿Por qué se limita max_features en vez de dejar que cada árbol mire todas las variables?",
      a:"Porque si todos pueden usar la variable más predictiva, <b>todos los árboles se parecen</b> y promediarlos no cancela nada. La aleatoriedad en columnas es precisamente lo que crea la diversidad que hace funcionar al bosque."}},

extratrees:{
 fx:"Como Random Forest, pero el umbral de corte se <b>sortea al azar</b> en lugar de buscarse el óptimo. Menos varianza, algo más de sesgo, y bastante más rápido.",
 cod:"from sklearn.ensemble import ExtraTreesClassifier\n\nm = ExtraTreesClassifier(n_estimators=500, n_jobs=-1,\n                         random_state=42).fit(X_tr, y_tr)",
 rel:[["rf","La única diferencia real: RF optimiza el corte, Extra Trees lo sortea."]],
 chk:{q:"¿Cómo puede ir mejor un corte aleatorio que el óptimo?",
      a:"Porque el corte «óptimo» se optimiza sobre el <b>ruido de esta muestra concreta</b>, no sobre la realidad. Sortearlo reduce la varianza, y con suficientes árboles esa reducción suele compensar el sesgo extra."}},

xgboost:{
 fx:"Boosting con expansión de <b>segundo orden</b> (usa gradiente y hessiana) y regularización metida en el propio objetivo: <code>γ·T + ½λ‖w‖²</code>, que penaliza número de hojas y magnitud de pesos.",
 cod:"from xgboost import XGBClassifier\n\nm = XGBClassifier(n_estimators=600, learning_rate=0.05, max_depth=5,\n                  subsample=0.8, colsample_bytree=0.8,\n                  eval_metric='aucpr').fit(X_tr, y_tr)",
 rel:[["lightgbm","Misma familia; LightGBM crece por hoja y va más rápido."],
      ["catboost","CatBoost gana cuando hay muchas categóricas."],
      ["gbr","El Gradient Boosting clásico, sin regularización explícita."]],
 chk:{q:"¿Para qué sirve scale_pos_weight y qué valor se le suele dar?",
      a:"Para compensar clases desbalanceadas: da más peso a los positivos. La regla habitual es <code>n_negativos / n_positivos</code>."}},

lightgbm:{
 fx:"Dos trucos: crece el árbol <b>por hoja</b> (leaf-wise, escogiendo la de mayor ganancia) en vez de por nivel, y agrupa las variables continuas en <b>histogramas</b> de bins. De ahí la velocidad.",
 cod:"from lightgbm import LGBMClassifier\n\nm = LGBMClassifier(n_estimators=600, learning_rate=0.05,\n                   num_leaves=31, min_child_samples=20).fit(X_tr, y_tr)",
 rel:[["xgboost","XGBoost crece por nivel; LightGBM, por hoja."],
      ["catboost","Alternativa cuando pesan más las categóricas que la velocidad."]],
 chk:{q:"3.000 filas y LightGBM sobreajusta. ¿Qué parámetro tocas primero?",
      a:"<code>num_leaves</code> (y de paso <code>min_child_samples</code>). El crecimiento leaf-wise con pocos datos fabrica hojas hiperespecíficas: hay que limitarle el número de hojas."}},

catboost:{
 fx:"<b>Ordered target statistics</b> para categóricas y <b>ordered boosting</b>: procesa las filas en un orden aleatorio y codifica cada una usando solo las anteriores, lo que evita el leakage del target encoding clásico.",
 cod:"from catboost import CatBoostClassifier\n\nm = CatBoostClassifier(iterations=800, learning_rate=0.05,\n                       cat_features=['provincia', 'plan', 'canal'],\n                       verbose=0).fit(X_tr, y_tr)",
 rel:[["xgboost","XGBoost necesita que le hagas tú el encoding."],
      ["lightgbm","LightGBM es más rápido si todo es numérico."]],
 chk:{q:"¿Por qué el target encoding hecho a mano suele filtrar información?",
      a:"Porque para codificar una fila calcula la media del target de su categoría <b>incluyendo esa misma fila</b>. El modelo acaba viendo su propia respuesta. CatBoost lo evita usando únicamente filas previas."}},

adaboost:{
 fx:"Reponderación: entrena un modelo débil, <b>sube el peso de los ejemplos que ha fallado</b> y entrena el siguiente sobre ellos. Cada modelo vota con peso <code>α = ½·ln((1−ε)/ε)</code>.",
 cod:"from sklearn.ensemble import AdaBoostClassifier\nfrom sklearn.tree import DecisionTreeClassifier\n\nm = AdaBoostClassifier(estimator=DecisionTreeClassifier(max_depth=1),\n                       n_estimators=200, learning_rate=0.5).fit(X_tr, y_tr)",
 rel:[["gbr","<b>La distinción clave:</b> AdaBoost repondera muestras; Gradient Boosting ajusta residuos siguiendo el gradiente."],
      ["arbol","Sus modelos débiles suelen ser árboles de profundidad 1 («tocones»)."]],
 chk:{q:"Un 2% de tus etiquetas está mal puesta. ¿Por qué AdaBoost sufre especialmente?",
      a:"Porque falla esos ejemplos una y otra vez (son imposibles: la etiqueta es errónea) y en cada ronda <b>les sube el peso</b>. Acaba dedicando el modelo entero a ajustar ruido."}},

svmlin:{
 fx:"Maximiza el margen <code>2/‖w‖</code> sujeto a <code>yᵢ(w·xᵢ + b) ≥ 1 − ξᵢ</code>. Solo los puntos del borde (los <b>vectores de soporte</b>) determinan la frontera; el resto del dataset da igual.",
 cod:"from sklearn.svm import SVC\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\n\nm = make_pipeline(StandardScaler(),\n                  SVC(kernel='linear', C=1)).fit(X_tr, y_tr)",
 rel:[["svmker","Mismo algoritmo con kernel no lineal."],
      ["logistica","La logística da probabilidad calibrada; el SVM, distancia al margen."]],
 chk:{q:"Pones C muy alto. ¿Qué le pasa al modelo?",
      a:"Margen estrecho: casi no tolera violaciones, así que la frontera se retuerce para clasificar bien cada punto de entrenamiento. Es decir, <b>sobreajuste</b>. C bajo = margen ancho y más tolerante."}},

svmker:{
 fx:"El <b>truco del kernel</b>: <code>K(x,x′)</code> calcula el producto escalar en un espacio de mayor dimensión <b>sin construirlo nunca</b>. El RBF es <code>exp(−γ‖x−x′‖²)</code>.",
 cod:"from sklearn.svm import SVC\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\n\nm = make_pipeline(StandardScaler(),\n                  SVC(kernel='rbf', C=10, gamma='scale')).fit(X_tr, y_tr)",
 rel:[["svmlin","Si los datos ya son separables linealmente, el kernel solo añade coste."],
      ["svr","La versión del mismo algoritmo para predecir números."]],
 chk:{q:"Subes gamma muchísimo en un kernel RBF. ¿Qué ocurre?",
      a:"Cada punto pasa a influir <b>solo en su entorno inmediato</b>, así que la frontera se convierte en islas alrededor de cada muestra de entrenamiento. Sobreajuste en estado puro."}},

knn:{
 fx:"No entrena nada: guarda los datos. Al predecir, calcula la distancia (normalmente euclídea) a todos, coge los K más cercanos y <b>vota por mayoría</b>. Todo el coste está en la predicción.",
 cod:"from sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\n\nm = make_pipeline(StandardScaler(),\n                  KNeighborsClassifier(n_neighbors=15)).fit(X_tr, y_tr)",
 rel:[["kmeans","<b>Cuidado con la K:</b> KNN es supervisado y clasifica; K-Means es no supervisado y agrupa. No tienen nada que ver."],
      ["svmlin","Otra opción cuando hay pocos datos."]],
 chk:{q:"¿Por qué KNN se degrada tanto con 200 variables?",
      a:"<b>Maldición de la dimensionalidad:</b> en alta dimensión todas las distancias tienden a igualarse, así que «el vecino más cercano» deja de ser significativamente más cercano que el resto. El voto se vuelve casi aleatorio."}},

nb:{
 fx:"Teorema de Bayes con un atajo: <code>P(y|x) ∝ P(y)·Π P(xⱼ|y)</code>, asumiendo que todas las variables son <b>independientes entre sí</b> dado y. El supuesto es falso casi siempre, y aun así funciona.",
 cod:"from sklearn.pipeline import make_pipeline\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.naive_bayes import MultinomialNB\n\nm = make_pipeline(TfidfVectorizer(ngram_range=(1,2)), MultinomialNB()).fit(textos, y)",
 rel:[["logistica","Ambos dan probabilidad; la logística no asume independencia."],
      ["topic","Naive Bayes clasifica en categorías que tú defines; LDA descubre los temas."]],
 chk:{q:"En texto el supuesto de independencia es evidentemente falso («nueva» y «york» van juntas). ¿Por qué funciona igualmente?",
      a:"Porque para clasificar solo importa <b>qué clase gana</b>, no que la probabilidad sea numéricamente correcta. La independencia distorsiona las magnitudes pero suele conservar el orden entre clases."}},

lda:{
 fx:"Busca los ejes que <b>maximizan la separación entre clases</b> respecto a la dispersión dentro de cada una (ratio de Fisher <code>S_B / S_W</code>: dispersión entre clases / dentro de cada clase). Asume normalidad y misma covarianza por clase, de ahí la frontera lineal.",
 cod:"from sklearn.discriminant_analysis import LinearDiscriminantAnalysis\n\nm = LinearDiscriminantAnalysis(n_components=2).fit(X_tr, y_tr)\nX_proy = m.transform(X_tr)   # clasifica y reduce dimensión a la vez",
 rel:[["qda","QDA levanta el supuesto de covarianza común y gana frontera curva."],
      ["topic","<b>Choque de siglas:</b> este LDA es Linear Discriminant Analysis. El otro es Latent Dirichlet Allocation, de temas en texto. Nada que ver."],
      ["pca","PCA maximiza varianza total sin mirar la etiqueta; LDA maximiza separación entre clases usándola."]],
 chk:{q:"PCA y LDA reducen dimensiones. Si el objetivo final es clasificar, ¿cuál usarías y por qué?",
      a:"<b>LDA.</b> PCA busca la dirección de mayor varianza, que puede perfectamente no separar las clases (la varianza puede venir de otra cosa). LDA usa la etiqueta y busca justo la dirección que las distingue."}},

qda:{
 fx:"Como LDA, pero <b>cada clase tiene su propia matriz de covarianza</b>. Eso convierte la frontera en cuadrática y le da flexibilidad, a costa de estimar muchos más parámetros.",
 cod:"from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis\n\nm = QuadraticDiscriminantAnalysis(reg_param=0.1).fit(X_tr, y_tr)",
 rel:[["lda","LDA comparte covarianza entre clases; QDA no."]],
 chk:{q:"30 muestras por clase y 40 variables. ¿Usarías QDA?",
      a:"<b>No.</b> Habría que estimar una matriz de covarianza 40×40 <b>por clase</b> con solo 30 muestras: matemáticamente imposible de estimar bien. LDA (que comparte una sola matriz) o QDA con <code>reg_param</code> alto."}},

cox:{
 fx:"<code>h(t|x) = h₀(t)·e^(βx)</code>. Lo elegante: <b>h₀(t) se deja sin especificar</b> (por eso es semiparamétrico), así que no hay que asumir forma de la curva. <code>e^β</code> es el hazard ratio.",
 cod:"from lifelines import CoxPHFitter\n\ncph = CoxPHFitter().fit(df, duration_col='meses_activo', event_col='se_dio_baja')\ncph.print_summary()   # exp(coef) = hazard ratio",
 rel:[["logistica","La logística tira los casos aún no ocurridos; Cox los aprovecha como censurados."]],
 chk:{q:"Un cliente sigue activo el día que cierras el estudio. ¿Lo descartas del análisis?",
      a:"<b>No.</b> Es un <b>dato censurado</b> y aporta información real: «sobrevivió al menos hasta t». Descartarlo sesga el modelo hacia las bajas tempranas y te hará creer que la gente se va antes de lo que se va."}},

uplift:{
 fx:"Estima el efecto incremental por persona: <code>τ(x) = P(y|x, T=1) − P(y|x, T=0)</code>. Lo ideal es partir de un experimento con <b>aleatorización</b>: sin grupo de control aleatorio solo se puede estimar asumiendo que has medido todos los factores que influyen a la vez en quién recibe la acción y en el resultado.",
 cod:"# T-learner: un modelo por grupo\nm_trat = LGBMClassifier().fit(X[T==1], y[T==1])\nm_ctrl = LGBMClassifier().fit(X[T==0], y[T==0])\nuplift = m_trat.predict_proba(X)[:,1] - m_ctrl.predict_proba(X)[:,1]",
 rel:[["propensity","Uplift necesita experimento; propensity/DiD se apañan con datos observacionales."],
      ["logistica","Un modelo de propensión predice quién compra, no a quién cambias."]],
 chk:{q:"Tu modelo de propensión dice que Ana comprará con un 95% de probabilidad. ¿Le mandas el descuento?",
      a:"<b>Probablemente no.</b> Si va a comprar igualmente, el descuento es margen regalado. El uplift busca a quien <b>cambia de decisión</b> gracias al impacto, no a quien ya estaba convencido."}},

propensity:{
 fx:"Propensity score <code>e(x) = P(T=1|x)</code>: se emparejan tratados y no tratados con e(x) parecido para simular un experimento. DiD compara <code>(post_T − pre_T) − (post_C − pre_C)</code>.",
 cod:"# Propensity score con logística y emparejamiento 1:1\nps = LogisticRegression().fit(X, T).predict_proba(X)[:, 1]\n# DiD con statsmodels: interacción tratamiento x periodo\n# smf.ols('y ~ tratado * post', data=df).fit().summary()",
 rel:[["uplift","Con experimento disponible, uplift es más limpio."],
      ["bayesnet","Otra vía para razonar sobre causas, con grafo explícito."]],
 chk:{q:"¿Cuál es el supuesto crítico de Diff-in-Diff y cómo lo compruebas?",
      a:"<b>Tendencias paralelas:</b> sin la intervención, ambos grupos habrían evolucionado igual. Se comprueba mirando <b>varios periodos previos</b>: si ya divergían antes, el método no vale."}},

mlp:{
 fx:"Capas de <code>a = σ(Wx + b)</code> encadenadas. Se entrena por <b>retropropagación</b>: la regla de la cadena reparte el error desde la salida hacia atrás para ajustar cada peso.",
 cod:"from tensorflow import keras\n\nmodel = keras.Sequential([\n    keras.layers.Dense(64, activation='relu'),\n    keras.layers.Dropout(0.3),\n    keras.layers.Dense(1, activation='sigmoid')])\nmodel.compile(optimizer='adam', loss='binary_crossentropy', metrics=['AUC'])",
 rel:[["logistica","<b>Un MLP sin capa oculta es literalmente una regresión logística.</b>"],
      ["cnn","La CNN añade la noción de vecindad espacial que el MLP no tiene."]],
 chk:{q:"Quitas todas las activaciones no lineales de un MLP de 5 capas. ¿Qué te queda?",
      a:"Una <b>regresión lineal</b>. Componer funciones lineales da otra función lineal, por muchas capas que pongas. La no linealidad es lo único que hace que la profundidad aporte algo."}},

cnn:{
 fx:"Filtros que se deslizan por la imagen <b>compartiendo pesos</b>, más pooling para reducir resolución. Los pesos compartidos dan invariancia a traslación: un gato es un gato esté donde esté.",
 cod:"from ultralytics import YOLO\n\nmodel = YOLO('yolov8n.pt')          # CNN preentrenada\nres = model('foto.jpg', conf=0.35)\nres[0].boxes.cls                    # clases detectadas",
 rel:[["mlp","El MLP no sabe que dos píxeles vecinos están relacionados; la CNN lo asume por diseño."],
      ["transformer","Los Vision Transformers compiten hoy con las CNN en visión."]],
 chk:{q:"¿Por qué no usar simplemente un MLP con la imagen aplanada en un vector?",
      a:"Por dos motivos. Pierdes la <b>estructura espacial</b> (qué píxel está al lado de cuál) y explotan los parámetros: una imagen 224×224×3 son 150.528 entradas, multiplicadas por cada neurona de la primera capa."}},

rnn:{
 fx:"<code>hₜ = f(Wx·xₜ + Wh·hₜ₋₁)</code>: cada paso recibe la entrada actual más el resumen del pasado. La LSTM añade <b>puertas</b> (olvido, entrada, salida) que deciden qué conservar.",
 cod:"from tensorflow import keras\n\nmodel = keras.Sequential([\n    keras.layers.LSTM(64, return_sequences=False),\n    keras.layers.Dense(1)])\nmodel.compile(optimizer='adam', loss='mse')",
 rel:[["transformer","Con secuencias largas y GPU, el Transformer la supera."],
      ["sarima","Para una serie univariante con estacionalidad clara, SARIMA suele ganar y es mucho más barato."]],
 chk:{q:"¿Qué problema concreto resuelven las puertas de la LSTM?",
      a:"El <b>gradiente desvanecido</b>. En una RNN simple el error apenas llega a los pasos lejanos tras multiplicarse muchas veces, así que no puede aprender dependencias largas. Las puertas crean un camino por el que el gradiente fluye sin degradarse."}},

transformer:{
 fx:"Atención: <code>softmax(QKᵀ/√d)·V</code>. Cada elemento mira a <b>todos los demás a la vez</b> y decide a cuáles atender. Sin recurrencia, así que paraleliza — de ahí que escale.",
 cod:"from transformers import pipeline\n\nclf = pipeline('sentiment-analysis',\n               model='nlptown/bert-base-multilingual-uncased-sentiment')\nclf('El pedido llegó tarde pero el producto es excelente')",
 rel:[["rnn","La RNN procesa en orden; el Transformer, todo a la vez."],
      ["cnn","Ambos dominan su terreno: CNN en visión clásica, Transformer en lenguaje."]],
 chk:{q:"¿Por qué el Transformer necesita positional encoding y la RNN no?",
      a:"Porque la RNN procesa <b>en orden</b>, así que la posición es implícita. La atención mira todo simultáneamente y, sin codificación posicional, «perro muerde a hombre» y «hombre muerde a perro» serían exactamente el mismo conjunto de tokens."}},

autoenc:{
 fx:"Un encoder comprime la entrada a un vector <b>z</b> mucho más pequeño (el cuello de botella) y un decoder intenta reconstruirla. Se minimiza <code>‖x − x̂‖²</code>. Lo que reconstruye mal es lo que no encaja con el patrón aprendido.",
 cod:"from tensorflow import keras\n\nenc = keras.Sequential([keras.layers.Dense(32, activation='relu'),\n                        keras.layers.Dense(8, activation='relu')])\ndec = keras.Sequential([keras.layers.Dense(32, activation='relu'),\n                        keras.layers.Dense(n_vars)])\nae = keras.Sequential([enc, dec])\nae.compile(optimizer='adam', loss='mse')\nae.fit(X_normal, X_normal, epochs=50)   # solo datos normales",
 rel:[["pca","Un autoencoder <b>lineal</b> converge al mismo subespacio que PCA; la gracia está en las capas no lineales."],
      ["iforest","Isolation Forest resuelve muchos casos de anomalías con una fracción del esfuerzo."],
      ["rbm","La RBM es su antecesora generativa, hoy casi solo de interés histórico."]],
 chk:{q:"Entrenas el autoencoder con el histórico completo, que incluye las transacciones fraudulentas. ¿Qué falla?",
      a:"Que <b>aprende a reconstruir también el fraude</b>, así que deja de destacar por error de reconstrucción. Un detector de anomalías por reconstrucción hay que entrenarlo <b>solo con lo normal</b>."}},

rbm:{
 fx:"Red bipartita visible/oculta con función de energía <code>E(v,h) = −aᵀv − bᵀh − vᵀWh</code>. Se entrena por <b>divergencia contrastiva</b>, aproximando el gradiente con pocos pasos de Gibbs.",
 cod:"from sklearn.neural_network import BernoulliRBM\n\nrbm = BernoulliRBM(n_components=64, learning_rate=0.05, n_iter=20)\nfeatures = rbm.fit_transform(X_binaria)",
 rel:[["autoenc","El autoencoder hace lo mismo (representación latente) de forma más simple y estable."]],
 chk:{q:"¿Por qué apenas se usa hoy?",
      a:"Porque el entrenamiento es <b>lento e inestable</b> (la divergencia contrastiva es una aproximación) y los autoencoders y los modelos de factorización matricial consiguen lo mismo mejor y con menos dolor."}},

som:{
 fx:"Rejilla de neuronas con vector de pesos. Para cada dato se busca la <b>BMU</b> (neurona más parecida) y se acercan a él tanto ella como sus <b>vecinas en la rejilla</b>. El radio de vecindad se reduce con el tiempo.",
 cod:"from minisom import MiniSom\n\nsom = MiniSom(10, 10, X.shape[1], sigma=1.0, learning_rate=0.5)\nsom.train_random(X_scaled, 5000)\nsom.distance_map()   # U-matrix: zonas claras = clusters",
 rel:[["kmeans","K-Means da K etiquetas sin relación entre sí; el SOM las coloca en un mapa donde <b>cercanía significa parecido</b>."],
      ["tsne","Ambos proyectan a 2D, pero el SOM además da prototipos interpretables por celda."]],
 chk:{q:"¿En qué se parece un SOM a K-Means y en qué se diferencia?",
      a:"Se parecen en que ambos asignan cada dato a un prototipo. Se diferencian en que en el SOM los prototipos <b>viven en una rejilla</b> y al actualizar uno se actualizan también sus vecinos, de modo que el mapa final conserva la topología del espacio original."}},

kmeans:{
 fx:"Alterna dos pasos hasta converger: asignar cada punto al centro más cercano, y recolocar cada centro en la media de los suyos. Minimiza la inercia <code>Σ‖xᵢ − μ_c‖²</code>.",
 cod:"from sklearn.cluster import KMeans\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\n\nm = make_pipeline(StandardScaler(),\n                  KMeans(n_clusters=4, n_init=10, random_state=42)).fit(X)",
 rel:[["kmedoids","El medoide es un caso real; el centroide, una media que puede no existir."],
      ["gmm","K-Means es el caso límite de un GMM con covarianza esférica y asignación dura."],
      ["knn","<b>Misma letra K, problemas opuestos:</b> KNN es supervisado."]],
 chk:{q:"¿Por qué hay que estandarizar antes de K-Means?",
      a:"Porque usa distancia euclídea. Una variable en euros (0–50.000) aplasta por completo a otra en años (0–80): los clusters los acabaría decidiendo <b>la unidad de medida</b>, no el comportamiento."}},

kmedoids:{
 fx:"Igual que K-Means, pero el centro es <b>un punto real del dataset</b> (el medoide) y se minimiza la suma de disimilitudes. Al no calcular medias, admite cualquier métrica de distancia.",
 cod:"import kmedoids                      # pip install kmedoids (FasterPAM)\nfrom sklearn.metrics import pairwise_distances\n\nD = pairwise_distances(X_scaled, metric='manhattan')\nres = kmedoids.fasterpam(D, 4, random_state=42)\nX.iloc[res.medoids]                  # los 4 clientes-tipo, reales\netiquetas = res.labels",
 rel:[["kmeans","La diferencia está en el centro: media inventada frente a caso real."]],
 chk:{q:"Tienes un outlier extremo. ¿A cuál le afecta más, a K-Means o a K-Medoids?",
      a:"<b>A K-Means.</b> La media se desplaza hacia el outlier y arrastra el centroide a una zona donde no hay nadie. El medoide es un punto real del dataset, así que no puede irse a un sitio vacío."}},

jerarquico:{
 fx:"Aglomerativo: empieza con cada punto en su propio grupo y va <b>fusionando los dos más cercanos</b> hasta que queda uno. El criterio de enlace (ward, average, complete) define qué es «cercano».",
 cod:"from scipy.cluster.hierarchy import linkage, dendrogram, fcluster\n\nZ = linkage(X_scaled, method='ward')\ndendrogram(Z, truncate_mode='lastp', p=12)\netiquetas = fcluster(Z, t=4, criterion='maxclust')",
 rel:[["kmeans","K-Means exige fijar K antes; aquí lo decides viendo el dendrograma."],
      ["dbscan","Ambos evitan fijar K, pero DBSCAN además detecta ruido."]],
 chk:{q:"¿Qué te da el dendrograma que K-Means no puede darte?",
      a:"La <b>estructura completa de anidamiento</b> y la posibilidad de elegir K <i>a posteriori</i>: cortas a la altura donde se produce el salto grande de distancia, que es evidencia visual de dónde están las agrupaciones naturales."}},

dbscan:{
 fx:"Un punto es <b>núcleo</b> si tiene al menos <code>min_samples</code> vecinos a distancia <code>eps</code> o menor. Los clusters crecen por conectividad entre núcleos, y lo que no es alcanzable se etiqueta como ruido (−1).",
 cod:"from sklearn.cluster import DBSCAN\nimport numpy as np\n\nm = DBSCAN(eps=0.5, min_samples=5).fit(X_scaled)\nprint('Clusters:', len(set(m.labels_)) - (1 if -1 in m.labels_ else 0))\nprint('Ruido:', np.mean(m.labels_ == -1).round(3))",
 rel:[["kmeans","K-Means obliga a asignar todos los puntos; DBSCAN puede decir «esto es ruido»."],
      ["lof","Ambos usan densidad local, pero LOF puntúa rareza en vez de agrupar."]],
 chk:{q:"Ejecutas DBSCAN y prácticamente todo sale como ruido (−1). ¿Qué ajustas?",
      a:"<code>eps</code> está demasiado pequeño (o <code>min_samples</code> demasiado alto). El método estándar para elegirlo: ordena la distancia al k-ésimo vecino de cada punto, grafícala y busca el <b>codo</b>."}},

gmm:{
 fx:"Asume que los datos salen de una <b>mezcla de gaussianas</b> y las estima por EM: el paso E reparte responsabilidades (probabilidad de pertenencia) y el paso M reestima medias, covarianzas y pesos.",
 cod:"from sklearn.mixture import GaussianMixture\n\nm = GaussianMixture(n_components=3, covariance_type='full',\n                    random_state=42).fit(X_scaled)\nproba = m.predict_proba(X_scaled)   # pertenencia blanda por cliente",
 rel:[["kmeans","K-Means asigna duro; GMM da probabilidades y admite grupos elípticos."],
      ["jerarquico","Alternativa si no quieres asumir forma gaussiana."]],
 chk:{q:"¿Cómo eliges el número de componentes de un GMM?",
      a:"Con <b>BIC o AIC</b> sobre un rango de valores, quedándote con el mínimo. La silueta no es buena aquí: asume clusters compactos y esféricos, justo lo que el GMM no impone."}},

pca:{
 fx:"Autovectores de la matriz de covarianza ordenados por autovalor. Cada componente es la <b>dirección de máxima varianza restante</b>, ortogonal a las anteriores. Es una rotación, no una selección.",
 cod:"from sklearn.decomposition import PCA\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\n\nm = make_pipeline(StandardScaler(), PCA(n_components=0.90)).fit(X)\nm[-1].explained_variance_ratio_.cumsum()",
 rel:[["lda","PCA ignora la etiqueta; LDA la usa para maximizar separación."],
      ["tsne","PCA conserva distancias globales y sirve para modelar; t-SNE solo para ver."],
      ["autoenc","Un autoencoder lineal converge al mismo subespacio que PCA."]],
 chk:{q:"Aplicas PCA sin estandarizar a variables en euros y en años. ¿Qué sale?",
      a:"El primer componente será prácticamente <b>la variable en euros</b>, solo por tener más varianza bruta. PCA maximiza varianza y la varianza depende de la unidad de medida: sin estandarizar, mides escalas, no estructura."}},

tsne:{
 fx:"Convierte distancias en <b>probabilidades de vecindad</b> y minimiza la divergencia KL entre las del espacio original y las del 2D. <code>perplexity</code> equivale al número efectivo de vecinos.",
 cod:"from sklearn.manifold import TSNE\n\nXe = TSNE(n_components=2, perplexity=30, init='pca',\n          random_state=42).fit_transform(X_scaled)",
 rel:[["umap","UMAP es más rápido, respeta mejor lo global y sí tiene transform()."],
      ["pca","PCA para modelar; t-SNE para mirar."]],
 chk:{q:"En tu mapa t-SNE hay dos clusters muy separados. ¿Significa que son muy distintos entre sí?",
      a:"<b>No.</b> t-SNE conserva la <b>vecindad local</b>, no las distancias globales. La separación entre grupos en el mapa no es interpretable, ni tampoco el tamaño relativo de los clusters."}},

umap:{
 fx:"Construye un grafo de vecindad difuso en alta dimensión y optimiza otro equivalente en 2D. <code>n_neighbors</code> regula el equilibrio local↔global; <code>min_dist</code>, cuánto se apelotonan los puntos.",
 cod:"import umap\n\nreducer = umap.UMAP(n_neighbors=15, min_dist=0.1, random_state=42)\nXe = reducer.fit_transform(X_scaled)\nXe_nuevo = reducer.transform(X_nuevo)   # t-SNE no puede hacer esto",
 rel:[["tsne","Mismo objetivo; UMAP escala mejor y conserva más estructura global."],
      ["pca","PCA sigue siendo el más interpretable de los tres."]],
 chk:{q:"¿Qué puede hacer UMAP que t-SNE no puede?",
      a:"Tiene <code>transform()</code>: puede <b>proyectar datos nuevos</b> sobre un embedding ya aprendido. Con el t-SNE de scikit-learn hay que recalcular todo el mapa desde cero (algunas librerías, como openTSNE, lo aproximan), así que no es práctico en producción."}},

iforest:{
 fx:"Le da la vuelta al problema: en vez de modelar lo normal, hace <b>cortes aleatorios</b> y mide cuántos hacen falta para aislar cada punto. Lo raro se aísla con pocos cortes, así que su profundidad media es menor.",
 cod:"from sklearn.ensemble import IsolationForest\n\nm = IsolationForest(contamination=0.02, random_state=42).fit(X)\nscores = m.score_samples(X)   # cuanto más negativo, más anómalo",
 rel:[["lof","Isolation Forest mide rareza global; LOF, relativa al vecindario."],
      ["autoenc","El autoencoder detecta lo raro por error de reconstrucción."]],
 chk:{q:"Pones contamination=0.05 sobre datos que en realidad no tienen anomalías. ¿Qué devuelve?",
      a:"Marcará un 5% igualmente: <code>contamination</code> es una <b>cuota, no una detección</b>. Si no sabes la tasa real, usa <code>score_samples</code> y decide tú el umbral mirando la distribución."}},

lof:{
 fx:"Compara la densidad local de un punto con la de sus vecinos. Un LOF cercano a 1 significa densidad similar a su entorno; muy por encima de 1, que el punto está <b>mucho más aislado que sus vecinos</b>.",
 cod:"from sklearn.neighbors import LocalOutlierFactor\n\nm = LocalOutlierFactor(n_neighbors=20, contamination=0.02)\netiquetas = m.fit_predict(X_scaled)   # -1 = anomalía\nm.negative_outlier_factor_",
 rel:[["iforest","LOF ve rarezas locales que un método global se pierde; a cambio, escala peor."],
      ["dbscan","Comparten la idea de densidad; DBSCAN agrupa, LOF puntúa."]],
 chk:{q:"Tu dataset tiene una zona muy densa y otra dispersa. Coges un punto perfectamente normal de la zona dispersa. ¿Isolation Forest o LOF?",
      a:"<b>LOF.</b> Al ser relativo a su propio vecindario, entiende que en esa zona lo normal es estar disperso. Isolation Forest, que es global, podría marcarlo como anómalo solo por vivir en la zona poco poblada."}},

apriori:{
 fx:"Tres números: soporte <code>P(A∩B)</code>, confianza <code>P(B|A)</code> y lift <code>P(A∩B)/(P(A)·P(B))</code>. La <b>propiedad apriori</b> poda el espacio: si un conjunto no es frecuente, ningún superconjunto suyo puede serlo.",
 cod:"from mlxtend.preprocessing import TransactionEncoder\nfrom mlxtend.frequent_patterns import apriori, association_rules\n\nte = TransactionEncoder()\ndf = pd.DataFrame(te.fit_transform(tickets), columns=te.columns_)\nfreq = apriori(df, min_support=0.08, use_colnames=True)\nreglas = association_rules(freq, metric='lift', min_threshold=1.15)",
 rel:[["reco","Apriori da reglas generales de catálogo; el filtrado colaborativo personaliza por cliente."]],
 chk:{q:"Lift(A→B) = 2,1 y Lift(B→A) = 2,1. ¿Por qué salen siempre iguales?",
      a:"Porque el lift es <b>simétrico por construcción</b>: mismo numerador P(A∩B) y mismo denominador P(A)·P(B). Lo que sí distingue la dirección es la <b>confianza</b>. Ordenar reglas solo por lift mezcla direcciones fuertes y débiles."}},

reco:{
 fx:"Factoriza la matriz cliente×producto: <code>R ≈ U·Vᵀ</code>, aprendiendo factores latentes de gusto. Se optimiza <b>solo sobre las celdas observadas</b>, y las vacías quedan como predicción.",
 cod:"from surprise import SVD, Dataset, Reader\nfrom surprise.model_selection import cross_validate\n\ndata = Dataset.load_from_df(df[['user', 'item', 'rating']], Reader())\ncross_validate(SVD(n_factors=50), data, measures=['RMSE'], cv=5)",
 rel:[["apriori","Apriori no necesita histórico por usuario; el colaborativo sí."],
      ["rbm","Las RBM se usaron históricamente para esto (Netflix Prize)."],
      ["contentbased","El colaborativo mira el comportamiento de otros usuarios; el basado en contenido mira solo la ficha del producto."]],
 chk:{q:"Sacas un producto nuevo, sin ninguna interacción todavía. ¿Qué recomienda el filtrado colaborativo?",
      a:"<b>Nada: es el problema del arranque en frío.</b> No tiene con quién compararlo porque nadie ha interactuado. Hay que tirar de atributos del producto (contenido) hasta acumular señal suficiente."}},

topic:{
 fx:"Modelo generativo: cada documento es una mezcla de temas (θ ~ Dirichlet) y cada tema una mezcla de palabras (φ ~ Dirichlet). Se infiere hacia atrás, por Gibbs o variacional.",
 cod:"from sklearn.decomposition import LatentDirichletAllocation\nfrom sklearn.feature_extraction.text import CountVectorizer\n\ndtm = CountVectorizer(max_df=0.9, min_df=5).fit_transform(textos)\nlda = LatentDirichletAllocation(n_components=8, random_state=42).fit(dtm)",
 rel:[["nb","Naive Bayes clasifica en categorías que defines tú; LDA las descubre."],
      ["lda","<b>Choque de siglas:</b> el otro LDA es Linear Discriminant Analysis, de clasificación. Sin relación."]],
 chk:{q:"¿Cómo eliges el número de temas?",
      a:"Coherencia (<code>c_v</code>) sobre un rango <b>más lectura humana</b> de las palabras principales de cada tema. La perplejidad correlaciona mal con lo interpretable que resulta el modelo, así que no basta."}},

bayesnet:{
 fx:"Grafo dirigido acíclico donde <code>P(X₁…Xₙ) = Π P(Xᵢ | padres(Xᵢ))</code>. Esa factorización permite hacer inferencia con <b>evidencia parcial y en cualquier dirección</b>.",
 cod:"from pgmpy.models import DiscreteBayesianNetwork   # BayesianNetwork ya no existe\nfrom pgmpy.inference import VariableElimination\n\nmodelo = DiscreteBayesianNetwork([('Lluvia','Trafico'), ('Obras','Trafico'),\n                                  ('Trafico','Retraso')])\nmodelo.fit(df)   # aprende las tablas de probabilidad de un DataFrame discreto\nVariableElimination(modelo).query(['Lluvia'], evidence={'Retraso': 1})",
 rel:[["hmm","Un HMM es una red bayesiana con estructura temporal repetida."],
      ["propensity","Ambos razonan sobre causas; la red lo hace con grafo explícito."]],
 chk:{q:"¿Qué puede hacer una red bayesiana que XGBoost no?",
      a:"Responder <b>«¿y si…?» en cualquier dirección y con evidencia parcial</b>. Puedes fijar el efecto y preguntar por la causa más probable. XGBoost solo va de X a y, y necesita todas las variables."}},

hmm:{
 fx:"Estados ocultos con matriz de transición A y de emisión B. <b>Viterbi</b> devuelve la secuencia de estados más probable; <b>Baum-Welch</b> estima A y B sin supervisión.",
 cod:"from hmmlearn.hmm import GaussianHMM\n\nm = GaussianHMM(n_components=3, covariance_type='diag',\n                n_iter=200).fit(serie.reshape(-1, 1))\nestados = m.predict(serie.reshape(-1, 1))   # régimen en cada momento",
 rel:[["bayesnet","El HMM es su versión secuencial."],
      ["rnn","La LSTM también modela secuencias, pero sin estados interpretables."],
      ["sarima","SARIMA modela el valor; el HMM, el régimen en el que está la serie."]],
 chk:{q:"¿Qué diferencia a un HMM de aplicar un clustering normal sobre los puntos de la serie?",
      a:"Que el HMM modela la <b>probabilidad de transición entre estados</b>. Sabe que es mucho más probable seguir en el mismo régimen que saltar, así que no produce los cambios erráticos punto a punto que daría un clustering ciego al orden."}},

arima:{
 fx:"<code>(1 − Σφᵢ Lⁱ)(1 − L)^d · yₜ = (1 + Σθⱼ Lʲ) · εₜ</code>. AR = el pasado de la serie, I = diferenciación para quitar tendencia, MA = los errores pasados.",
 cod:"from statsmodels.tsa.arima.model import ARIMA\nfrom statsmodels.tsa.stattools import adfuller\n\nprint('ADF p-valor:', adfuller(serie)[1])   # menor que 0,05 = estacionaria\nm = ARIMA(serie, order=(2, 1, 2)).fit()",
 rel:[["sarima","SARIMA le añade el bloque estacional."],
      ["hw","Holt-Winters es el baseline más simple con el que compararlo."]],
 chk:{q:"El test ADF te da p-valor 0,42. ¿Qué valor de d usas?",
      a:"No se rechaza la raíz unitaria, así que la serie <b>no es estacionaria</b>: al menos <code>d = 1</code>. Diferencia una vez y vuelve a testear; si sigue sin rechazar, prueba d = 2 (rara vez hace falta más)."}},

sarima:{
 fx:"ARIMA más un bloque estacional <code>(P, D, Q)ₛ</code> que aplica la misma lógica <b>con desfase de un ciclo completo</b>: compara este diciembre con el diciembre anterior, no con noviembre.",
 cod:"from statsmodels.tsa.statespace.sarimax import SARIMAX\n\nm = SARIMAX(serie, order=(1, 1, 1),\n            seasonal_order=(1, 1, 1, 12)).fit(disp=False)\nm.plot_diagnostics(figsize=(12, 8))",
 rel:[["arima","Sin ciclo, el bloque estacional solo añade parámetros que no aportan."],
      ["sarimax","SARIMAX añade además variables externas."]],
 chk:{q:"Datos mensuales con un pico cada diciembre. ¿Qué valor de s pones?",
      a:"<b>s = 12.</b> Es el número de periodos que dura un ciclo completo, no el número de ciclos que tienes. Con datos diarios y patrón semanal sería s = 7."}},

sarimax:{
 fx:"SARIMA con <b>regresores exógenos</b>: <code>yₜ = βXₜ + ARIMA(εₜ)</code>. Separa lo que explican tus palancas (precio, clima, festivos) de lo que explica la inercia de la serie.",
 cod:"from statsmodels.tsa.statespace.sarimax import SARIMAX\n\nm = SARIMAX(y_tr, exog=X_tr, order=(1,1,1),\n            seasonal_order=(1,1,1,12)).fit(disp=False)\npred = m.forecast(steps=12, exog=X_futuro)   # necesitas X_futuro",
 rel:[["sarima","Es SARIMA sin la X."],
      ["prophet","Prophet también admite regresores y es más fácil de manejar."]],
 chk:{q:"Quieres usar la temperatura como exógena para predecir a 6 meses vista. ¿Dónde está el problema?",
      a:"Que necesitas <b>la temperatura futura</b>. Si no la conoces, tendrías que predecirla primero y arrastras su error al modelo. Las exógenas solo sirven si son conocidas de antemano (calendario, precio que tú fijas) o muy fiables."}},

prophet:{
 fx:"Descomposición aditiva: <code>y(t) = g(t) + s(t) + h(t) + εₜ</code> — tendencia por tramos con puntos de cambio, estacionalidad en series de Fourier y efecto de festivos.",
 cod:"from prophet import Prophet\n\nm = Prophet(yearly_seasonality=True, weekly_seasonality=True)\nm.add_country_holidays(country_name='ES')\nm.fit(df[['ds', 'y']])\nfuturo = m.make_future_dataframe(periods=90)",
 rel:[["sarima","Con series cortas o dinámica compleja, un SARIMA bien ajustado suele ganar."],
      ["hw","Ambos descomponen la serie; Prophet es más automático."]],
 chk:{q:"¿Por qué Prophet aguanta huecos en los datos con total naturalidad y el ARIMA clásico no?",
      a:"Porque Prophet es en el fondo una <b>regresión sobre el tiempo</b>: cada fecha es una fila con sus regresores, y le da igual que falten. El ARIMA clásico asume observaciones <b>equiespaciadas y consecutivas</b>, porque modela la relación entre un punto y el anterior. Matiz: la implementación de statsmodels (espacio de estados) tolera valores NaN gracias al filtro de Kalman, pero la fecha tiene que existir en el índice."}},

hw:{
 fx:"Tres suavizados exponenciales encadenados: nivel (α), tendencia (β) y estacionalidad (γ). Cada uno pondera más lo reciente, con decaimiento geométrico hacia el pasado.",
 cod:"from statsmodels.tsa.holtwinters import ExponentialSmoothing\n\nm = ExponentialSmoothing(serie, trend='add', seasonal='add',\n                         seasonal_periods=12).fit()\npred = m.forecast(12)",
 rel:[["arima","Holt-Winters es el baseline que ARIMA tiene que superar para justificarse."],
      ["prophet","Misma filosofía de descomposición, con más automatismo."]],
 chk:{q:"¿Cuándo eliges estacionalidad aditiva y cuándo multiplicativa?",
      a:"<b>Aditiva</b> si el pico estacional es de tamaño constante (siempre +200 unidades en diciembre). <b>Multiplicativa</b> si crece con el nivel de la serie (siempre +20%, que en euros es cada año más). Míralo en el gráfico: ¿los picos crecen con la tendencia?"}},

bandit:{
 fx:"Equilibrio explorar/explotar. ε-greedy explora una fracción ε del tiempo; UCB elige <code>μ̂ᵢ + √(2·ln n / nᵢ)</code>; Thompson muestrea de la posterior de cada brazo y juega el ganador.",
 cod:"import numpy as np\n\n# Thompson sampling beta-bernoulli\nexitos, fallos = np.ones(3), np.ones(3)\nfor _ in range(10000):\n    brazo = np.argmax(np.random.beta(exitos, fallos))\n    r = servir_variante(brazo)\n    exitos[brazo] += r; fallos[brazo] += 1 - r",
 rel:[["propensity","Ambos miden efecto de una acción; el bandit además decide sobre la marcha."],
      ["qlearning","El bandit es el caso sin estado: una sola decisión repetida."]],
 chk:{q:"¿En qué se diferencia de un A/B test clásico?",
      a:"El A/B reparte <b>fijo</b> hasta el final y luego analiza; el bandit <b>reasigna tráfico sobre la marcha</b> hacia el ganador. Pierdes menos dinero durante el experimento, pero complicas el análisis estadístico: el reparto ya no es aleatorio."}},

qlearning:{
 fx:"<code>Q(s,a) ← Q(s,a) + α·[r + γ·max Q(s′,a′) − Q(s,a)]</code>. Estima la recompensa total esperada de hacer a en s. γ descuenta el futuro; α es el ritmo de aprendizaje.",
 cod:"import numpy as np\nimport gymnasium as gym\n\nenv = gym.make('FrozenLake-v1')\nQ = np.zeros((env.observation_space.n, env.action_space.n))\neps = 0.1\nfor ep in range(5000):\n    s, _ = env.reset()\n    fin = False\n    while not fin:\n        explora = np.random.rand() &lt; eps\n        a = env.action_space.sample() if explora else Q[s].argmax()\n        s2, r, terminated, truncated, _ = env.step(a)   # API de gymnasium\n        objetivo = r + (0 if terminated else 0.95 * Q[s2].max())\n        Q[s, a] += 0.1 * (objetivo - Q[s, a])\n        s, fin = s2, terminated or truncated",
 rel:[["dqn","DQN sustituye la tabla Q por una red neuronal."],
      ["bandit","El bandit es Q-Learning sin estado."],
      ["sarsa","Misma tabla y misma ecuación, pero SARSA actualiza on-policy (con la acción que de verdad toma) y Q-Learning off-policy (con la mejor acción teórica)."]],
 chk:{q:"Pones γ = 0. ¿Qué comportamiento produce el agente?",
      a:"<b>Totalmente miope:</b> solo maximiza la recompensa inmediata e ignora las consecuencias. Con γ cercano a 1 valora el largo plazo casi tanto como el presente."}},

sarsa:{
 fx:"<code>Q(s,a) ← Q(s,a) + α·[r + γ·Q(s′,a′) − Q(s,a)]</code>, donde a′ es la acción que la política <b>realmente</b> toma en s′ (on-policy), no la mejor teórica como en Q-Learning (off-policy).",
 cod:"import numpy as np\nimport gymnasium as gym\n\nenv = gym.make('CliffWalking-v1')   # el ejemplo clásico del acantilado\nQ = np.zeros((env.observation_space.n, env.action_space.n))\n\ndef eps_greedy(Q, s, eps=0.1):\n    return env.action_space.sample() if np.random.rand() &lt; eps else Q[s].argmax()\n\nfor ep in range(5000):\n    s, _ = env.reset()\n    a, fin = eps_greedy(Q, s), False\n    while not fin:\n        s2, r, terminated, truncated, _ = env.step(a)\n        a2 = eps_greedy(Q, s2)             # la acción que DE VERDAD tomará\n        objetivo = r + (0 if terminated else 0.95 * Q[s2, a2])\n        Q[s, a] += 0.1 * (objetivo - Q[s, a])\n        s, a, fin = s2, a2, terminated or truncated",
 rel:[["qlearning","Misma tabla y misma ecuación, pero SARSA actualiza con la acción que de verdad toma (on-policy); Q-Learning, con la mejor acción posible (off-policy)."]],
 chk:{q:"En un entorno con un 'acantilado' donde explorar de más puede salir muy caro, ¿qué política aprende SARSA frente a Q-Learning?",
      a:"<b>SARSA aprende una ruta más prudente</b>, alejada del acantilado, porque su actualización incluye el riesgo de su propia exploración ε-greedy. Q-Learning aprende la ruta óptima 'sobre el papel' (pegada al borde), que resulta peor en la práctica si el agente sigue explorando."}},

dqn:{
 fx:"Red neuronal que aproxima Q(s,a), más dos estabilizadores imprescindibles: <b>replay buffer</b> (rompe la correlación temporal) y <b>red objetivo congelada</b> (evita perseguir un blanco móvil).",
 cod:"from stable_baselines3 import DQN\nimport gymnasium as gym\n\nenv = gym.make('CartPole-v1')\nm = DQN('MlpPolicy', env, buffer_size=50000, verbose=0)\nm.learn(total_timesteps=100000)",
 rel:[["qlearning","Misma ecuación, pero con red en vez de tabla."],
      ["ppo","PPO admite acciones continuas; DQN solo discretas."]],
 chk:{q:"¿Para qué sirve exactamente el replay buffer?",
      a:"Las transiciones consecutivas están <b>muy correlacionadas</b> entre sí, y entrenar una red con lotes correlacionados la desestabiliza. El buffer almacena experiencias y las muestrea en desorden, acercándose al supuesto de independencia."}},

ppo:{
 fx:"Aprende la política directamente, limitando el ratio <code>r(θ) = π_θ/π_old</code> con <b>clipping</b> a [1−ε, 1+ε] para que no cambie demasiado en un solo paso.",
 cod:"from stable_baselines3 import PPO\nimport gymnasium as gym\n\nm = PPO('MlpPolicy', gym.make('Pendulum-v1'),\n        clip_range=0.2, verbose=0)\nm.learn(total_timesteps=200000)",
 rel:[["dqn","DQN estima valores; PPO optimiza la política directamente."],
      ["qlearning","Ambos son refuerzo, pero PPO no necesita discretizar acciones."]],
 chk:{q:"¿Por qué hay que recortar cuánto puede cambiar la política en cada paso?",
      a:"Porque en refuerzo <b>los datos siguientes los genera la propia política</b>. Si un paso demasiado grande la empeora, los datos que recoges a partir de ahí también son malos y no hay forma de recuperarse. El clipping evita ese colapso."}},

automl:{
 fx:"Busca sobre el espacio preprocesado × modelo × hiperparámetros, normalmente con optimización bayesiana o evolutiva, evaluando cada candidato por validación cruzada.",
 cod:"from pycaret.classification import setup, compare_models\n\nsetup(data=df, target='churn', session_id=42)\nmejor = compare_models(n_select=3, sort='AUC')",
 rel:[["xgboost","En tabular, el ganador de AutoML casi siempre acaba siendo un boosting."]],
 chk:{q:"AutoML te devuelve 0,91 de AUC en 4 minutos. ¿Ya has terminado?",
      a:"<b>No.</b> Comprueba que no haya <b>leakage</b>, que el split respete el tiempo o los grupos si aplica, y compara contra un baseline simple. AutoML optimiza a ciegas la métrica que le des, <b>incluida una mal planteada</b>."}},

contentbased:{
 fx:"TF-IDF pondera cada palabra por <b>frecuencia en el documento × rareza en el catálogo</b> (penaliza las palabras comunes a todos). Con esos vectores, la similitud coseno mide el ángulo entre dos productos: 1 si son idénticos en contenido, 0 si no comparten nada.",
 cod:"from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.metrics.pairwise import cosine_similarity\n\ntfidf = TfidfVectorizer(stop_words='english').fit_transform(df['sinopsis'])\nsim = cosine_similarity(tfidf)\nsimilares = sim[idx].argsort()[::-1][1:6]  # top 5, excluyendo el propio título",
 rel:[["reco","El colaborativo mira el comportamiento de otros usuarios; este mira solo la ficha del producto — por eso no sufre el arranque en frío de producto."],
      ["topic","Topic Modeling agrupa documentos en temas latentes; aquí no hay temas, solo similitud directa entre pares de vectores."]],
 chk:{q:"Recomiendas 'Up' (Pixar, familiar) y el sistema sugiere 'Get Out' (terror) como similar. ¿Qué está pasando?",
      a:"El contenido comparte <b>vocabulario</b> aunque no comparta tono — TF-IDF no entiende significado, solo cuenta palabras. Es la limitación típica de content-based con vocabulario reducido: la solución es pasar a embeddings semánticos."}}

};

/* ══════════════════════════════════════════════════════════════
   CAPA PROFESIONAL — bloque 1 · REGRESIÓN
     caso    = caso de negocio tipo, estructurado
     hp      = hiperparámetros que de verdad mueven la aguja
     trampas = fallos concretos de este modelo, no genéricos
     uso     = preprocesado exigido + qué implica en producción
     y2026   = estado a agosto de 2026 (solo donde hay algo real)
   ══════════════════════════════════════════════════════════════ */
var PRO1 = {

linsimple:{
 caso:{sector:"Retail · Marketing",
   sit:"Una cadena con 40 tiendas quiere saber si la inversión en radio local sigue teniendo retorno o está saturada.",
   datos:"104 semanas × tienda: inversión en radio (€) y ventas semanales (€).",
   target:"Ventas semanales de la tienda (€, continua).",
   metrica:"RMSE en euros — que negocio entienda el error en su moneda — y R² como control.",
   decision:"Mantener, subir o cortar el presupuesto de radio por tienda.",
   impacto:"La pendiente ES la respuesta: si sale 3,2 €/€ invertido, cada euro se asocia a 3,20 € de ventas (ojo: ventas, no margen; con un 30% de margen son 0,96 € de beneficio, es decir, se pierde dinero). Mira el intervalo de confianza de la pendiente antes de concluir nada."},
 hp:[["fit_intercept","Déjalo en True salvo que sepas que y=0 cuando x=0. Forzar el paso por el origen sesga la pendiente."]],
 trampas:["Extrapolar fuera del rango observado: si nunca invertiste más de 5.000 €, el modelo no sabe qué pasa en 20.000 € — la saturación es justo lo que no ha visto.",
   "Confundir la pendiente con causalidad. Si subes radio en Navidad, estás midiendo Navidad, no radio.",
   "Un R² alto con residuos en forma de U significa que la relación es curva y la recta es la herramienta equivocada."],
 uso:"Sin preprocesado. Entrena en milisegundos y el modelo son dos números: cabe en una hoja de cálculo. Reentrenar cada trimestre basta.",
 y2026:"Sigue siendo el primer modelo que debes probar. Si una lineal simple ya responde la pregunta, todo lo demás es coste añadido."},

linmult:{
 caso:{sector:"Inmobiliario · Valoración",
   sit:"Una agencia quiere una tasación orientativa automática para dar precio en la primera visita.",
   datos:"8.000 operaciones cerradas: m², habitaciones, baños, planta, año, código postal, estado.",
   target:"Precio de cierre (€).",
   metrica:"MAE en euros (más robusto a chalets atípicos que el RMSE) y % de tasaciones dentro de ±10%.",
   decision:"Precio de salida recomendado y detección de sobreprecio del vendedor.",
   impacto:"Cada coeficiente es un argumento comercial: «un baño extra en esta zona son 12.000 €» se puede defender delante del cliente."},
 hp:[["Selección de variables","No es un hiperparámetro pero es la decisión clave: mete solo lo que existe en el momento de tasar."],
   ["VIF","Vigila el factor de inflación de varianza: por encima de 10 tienes multicolinealidad seria."]],
 trampas:["Meter el código postal como número: el 28001 no es «menos» que el 28050. Necesita codificación categórica.",
   "Leakage temporal: si entrenas con operaciones de 2026 para predecir 2024, el modelo usa información del futuro.",
   "Interpretar coeficientes con variables correlacionadas. Con m² y habitaciones a 0,9 de correlación, repartir el crédito entre ambas es arbitrario."],
 uso:"Codifica categóricas (one-hot o target encoding) y revisa VIF. En producción es un producto escalar: latencia despreciable, cabe en SQL.",
 y2026:"El estándar cuando hay que justificar el número ante un cliente o un regulador. Un boosting predice mejor pero no te da la frase que convence."},

ridge:{
 caso:{sector:"Marketing Mix Modeling",
   sit:"Una marca de consumo reparte 4 M€ anuales entre 14 canales que se activan a la vez en campaña.",
   datos:"3 años semanales: inversión por canal, precio medio, distribución, estacionalidad, ventas.",
   target:"Ventas semanales (€).",
   metrica:"RMSE y, sobre todo, estabilidad de los coeficientes al remuestrear: si cambian de signo, no sirven.",
   decision:"Reasignación del presupuesto del año siguiente por canal.",
   impacto:"Sin regularizar, TV y digital (correlacionados a 0,85 porque se lanzan juntos) dan coeficientes disparatados. Ridge los estabiliza y hace defendible el reparto."},
 hp:[["alpha","El único que importa de verdad. Alto = más encogimiento y más sesgo; bajo = más varianza. Elígelo por validación cruzada, nunca a ojo."],
   ["solver","'auto' vale casi siempre. 'saga' si el dataset es enorme y disperso."]],
 trampas:["No estandarizar: la penalización castiga por unidad de medida, no por importancia. Es el error número uno.",
   "Interpretar los coeficientes de Ridge como los de una lineal normal: están encogidos a propósito, así que subestiman el efecto real.",
   "Regularizar el intercepto. sklearn no lo hace, pero si lo implementas a mano es un fallo clásico."],
 uso:"Estandarización obligatoria dentro de un Pipeline, nunca antes del split. Coste de entrenamiento y predicción casi nulo.",
 y2026:"En Marketing Mix Modeling la corriente actual es bayesiana (PyMC-Marketing, Meridian de Google), que además da incertidumbre y curvas de saturación. Ridge sigue siendo la línea base honesta con la que compararlos, y es el motor de Robyn, el MMM de código abierto de Meta."},

lasso:{
 caso:{sector:"Industria · Calidad",
   sit:"Una planta registra 180 sensores por lote y quiere saber cuáles predicen realmente el defecto para poner alarmas solo en esos.",
   datos:"2.400 lotes × 180 variables de proceso (temperatura, presión, caudal, tiempos).",
   target:"Índice de defecto del lote (continuo).",
   metrica:"RMSE y número de variables retenidas — el objetivo es un modelo corto.",
   decision:"Qué 8 sensores monitorizar en tiempo real en el panel de planta.",
   impacto:"Pasar de 180 señales a 8 accionables. El valor no es la predicción, es reducir el ruido operativo del turno."},
 hp:[["alpha","Controla cuántas variables sobreviven. Súbelo hasta que el modelo sea del tamaño que puede gestionar la operación."],
   ["max_iter","Súbelo si avisa de no convergencia; con muchas variables correlacionadas el descenso por coordenadas es lento."]],
 trampas:["Presentar las variables retenidas como «las importantes». En grupos correlacionados la elección es arbitraria: cambia la semilla y cambia la lista.",
   "Usarlo con menos filas que columnas y sacar conclusiones causales: Lasso selecciona por conveniencia predictiva, no por mecanismo físico.",
   "Olvidar estandarizar, igual que en Ridge."],
 uso:"Estandarización obligatoria. Para estabilizar la selección, ejecuta Lasso sobre muchos remuestreos y quédate con lo que aparece siempre (stability selection).",
 y2026:"Sigue siendo el atajo más rápido a un modelo corto y defendible. Cuando la selección importe de verdad, contrástalo con importancia por permutación sobre un boosting."},

elastic:{
 caso:{sector:"Banca · Riesgo",
   sit:"Un equipo de riesgos tiene 300 variables derivadas del comportamiento transaccional, muchas versiones del mismo concepto.",
   datos:"120.000 clientes × 300 variables muy correlacionadas por bloques.",
   target:"Pérdida esperada (€).",
   metrica:"RMSE y estabilidad del conjunto seleccionado entre trimestres.",
   decision:"Qué variables entran en el modelo regulatorio, que debe ser estable y auditable.",
   impacto:"Lasso elegiría una variable de cada bloque y en el siguiente trimestre otra distinta — inaceptable para un modelo que se audita. Elastic Net conserva el bloque completo y no baila."},
 hp:[["l1_ratio","El mando principal. Cerca de 1 selecciona agresivamente; cerca de 0 conserva grupos. Pruébalo en rejilla, no lo fijes por intuición."],
   ["alpha","La fuerza total de la penalización, conjunta para las dos."]],
 trampas:["Fijar l1_ratio=0,5 «porque es el punto medio». No lo es: la respuesta es muy poco lineal y hay que buscarla.",
   "Esperar que resuelva la interpretación causal. Sigue siendo un modelo predictivo con variables correlacionadas."],
 uso:"Estandarización obligatoria. ElasticNetCV explora alpha y l1_ratio a la vez; es lo que debes usar por defecto.",
 y2026:"La opción por defecto cuando hay datos anchos y el modelo debe sobrevivir a una auditoría. Ni Ridge ni Lasso puros suelen ganarle en ese escenario."},

poisson:{
 caso:{sector:"Seguros · Tarificación",
   sit:"Una aseguradora de auto necesita la frecuencia esperada de siniestros por póliza para tarificar.",
   datos:"800.000 pólizas-año: edad, antigüedad del carné, potencia, uso, zona, exposición en años.",
   target:"Número de siniestros en el periodo (conteo, 0/1/2/3…).",
   metrica:"Deviance de Poisson. El RMSE es engañoso cuando el 92% de las pólizas tiene cero siniestros.",
   decision:"Prima de riesgo por segmento. La prima final es frecuencia × coste medio.",
   impacto:"Es el modelo estándar del sector: la frecuencia se modela con Poisson y la severidad con Gamma. Una lineal normal predeciría siniestros negativos, lo que es literalmente imposible."},
 hp:[["alpha","Regularización L2 sobre los coeficientes. En tarificación se usa poca, para no distorsionar el precio."],
   ["exposure / offset","Crítico: si unas pólizas cubren 12 meses y otras 3, hay que meter la exposición como offset con log."]],
 trampas:["Ignorar la exposición: una póliza de 3 meses con 1 siniestro tiene el cuádruple de frecuencia que una de 12 meses con 1.",
   "No comprobar la sobredispersión. Con varianza mucho mayor que la media, los p-valores mienten y verás variables significativas que no lo son.",
   "Exceso de ceros estructural: si hay dos poblaciones (quien nunca reclama y quien puede reclamar), necesitas un modelo de ceros inflados."],
 uso:"Necesita exposición y categóricas codificadas (en statsmodels con <code>exposure=</code>; en sklearn, modela <code>y/exposición</code> y pasa la exposición como <code>sample_weight</code>). Es un GLM: rápido, interpretable en términos multiplicativos (e^β es un factor sobre la prima).",
 y2026:"Sigue siendo el estándar actuarial y el preferido por supervisores y auditores por su interpretabilidad. Los GBM se usan cada vez más para detectar interacciones que luego se incorporan al GLM, no para sustituirlo."},

quantile:{
 caso:{sector:"Logística · Cadena de suministro",
   sit:"Un e-commerce sufre roturas de stock en referencias de alta rotación mientras acumula inventario muerto en otras.",
   datos:"2 años de demanda diaria por SKU, con promociones, festivos y precio.",
   target:"Demanda diaria del SKU.",
   metrica:"Pinball loss al cuantil objetivo y cobertura real: si pides P90, comprueba que cubre el 90%.",
   decision:"Punto de pedido y stock de seguridad por SKU.",
   impacto:"El error de predecir la media es que aciertas el 50% de las veces por abajo, es decir, roturas la mitad de los días. El nivel de servicio ES un cuantil: un 95% de servicio se pide con un P95, no con la media más un margen inventado."},
 hp:[["quantile","Es la decisión de negocio, no técnica: sale del nivel de servicio comprometido."],
   ["alpha","Regularización L1. Con muchas variables, súbela."],
   ["solver","'highs' es el recomendado; los antiguos son mucho más lentos."]],
 trampas:["Cruce de cuantiles: si ajustas P10, P50 y P90 por separado, nada garantiza que P90 quede por encima de P50. Hay que comprobarlo.",
   "Confundir intervalo de predicción con intervalo de confianza de la media. Son cosas distintas y el stock depende del primero.",
   "Ajustar el cuantil hasta que «quede bonito» en vez de derivarlo del coste de romper stock frente al coste de inmovilizado."],
 uso:"Un modelo por cuantil. En producción se suelen servir tres (P10/P50/P90) para dar banda. Coste bajo.",
 y2026:"En forecasting moderno lo estándar ya es predecir la distribución completa, no un punto. LightGBM con objective='quantile' es la vía más usada en producción por velocidad."},

bayesridge:{
 caso:{sector:"Farmacéutico · I+D",
   sit:"Se quiere estimar el rendimiento de un proceso de síntesis con solo 60 experimentos, cada uno de una semana.",
   datos:"60 experimentos × 12 parámetros de proceso.",
   target:"Rendimiento (%).",
   metrica:"RMSE y calibración del intervalo: ¿el 90% de los reales cae dentro del intervalo al 90%?",
   decision:"Qué combinación de parámetros llevar a la siguiente ronda de laboratorio.",
   impacto:"Con 60 puntos, un modelo que da un número sin incertidumbre es peligroso. Aquí el intervalo decide si se pasa a producción o se hacen más pruebas."},
 hp:[["alpha_1 / alpha_2 · lambda_1 / lambda_2","Los priors sobre ruido y coeficientes. Los valores por defecto son poco informativos y funcionan bien; tócalos solo con conocimiento de dominio."]],
 trampas:["Leer el intervalo como si cubriera todo: solo refleja la incertidumbre del modelo, no la de que el modelo esté mal planteado.",
   "Usarlo con miles de filas esperando ventaja: con muchos datos converge a Ridge y solo añade complejidad."],
 uso:"Estandarizar. Devuelve media y desviación por predicción con return_std=True. Coste bajo.",
 y2026:"Para incertidumbre bien calibrada sin coste computacional, la alternativa que ha ganado terreno es la predicción conforme (conformal prediction), que da garantías de cobertura sin asumir distribución."},

gp:{
 caso:{sector:"Industria · Optimización de procesos",
   sit:"Ajustar 6 parámetros de una línea de producción donde cada prueba para la línea 4 horas y cuesta unos 3.000 €.",
   datos:"35 experimentos realizados hasta la fecha.",
   target:"Calidad de la pieza resultante.",
   metrica:"RMSE en validación dejando uno fuera, y utilidad de la función de adquisición.",
   decision:"Qué combinación probar en el siguiente experimento.",
   impacto:"Es optimización bayesiana: el GP no solo predice, dice dónde está más perdido. Se prueba donde más se aprende, no donde el modelo cree que va bien. Con pruebas a 3.000 €, esa diferencia es dinero directo."},
 hp:[["kernel","La decisión de verdad. RBF para funciones suaves; Matérn para menos suavidad; siempre suma WhiteKernel para el ruido."],
   ["alpha","Ruido añadido a la diagonal. Súbelo si la optimización falla numéricamente."],
   ["n_restarts_optimizer","Sube a 10 o más: la verosimilitud tiene mínimos locales."]],
 trampas:["Aplicarlo con más de unos pocos miles de filas: el coste es cúbico y se cae.",
   "Kernel por defecto sin WhiteKernel: si hay ruido de medición, el GP intentará pasar por todos los puntos y se vuelve inestable.",
   "No estandarizar la salida: los kernels asumen media cero."],
 uso:"Estandariza entradas y salida. En producción se usa dentro de un bucle de experimentación, no sirviendo predicciones masivas.",
 y2026:"Sigue siendo el motor clásico de la optimización bayesiana (Ax / BoTorch; Optuna usa TPE por defecto, aunque incluye un GPSampler) para hiperparámetros y diseño experimental. En su nicho de pocos datos caros no tiene sustituto."},

svr:{
 caso:{sector:"Química · Control de calidad",
   sit:"Predecir una propiedad del producto a partir del espectro infrarrojo, para no tener que hacer el ensayo destructivo.",
   datos:"400 muestras × 900 longitudes de onda — muchísimas más columnas que filas.",
   target:"Concentración del principio activo (%).",
   metrica:"RMSE en validación cruzada y error máximo, que es el que marca si vale para liberar lote.",
   decision:"Liberar el lote sin ensayo destructivo o mandarlo al laboratorio.",
   impacto:"Con 900 variables y 400 muestras, los modelos basados en árboles sufren. El SVM con kernel aguanta bien esa forma de datos, que es típica de espectroscopía."},
 hp:[["C","Coste de salirse de la banda. Alto = más ajuste, riesgo de sobreajuste."],
   ["epsilon","Ancho de la banda sin penalización. Ponlo en el orden del ruido de medición."],
   ["gamma","Solo en RBF: cuánto influye cada punto. 'scale' es un buen punto de partida."]],
 trampas:["No estandarizar: el SVM es puramente geométrico y sin escalar es inútil.",
   "Buscar C y gamma por separado: interactúan, hay que barrerlos en rejilla conjunta.",
   "Entrenar con decenas de miles de filas y esperar que termine: el coste crece de forma cuadrática o peor."],
 uso:"Estandarización obligatoria. Predicción rápida, entrenamiento lento. Reentrenar en batch, nunca en línea.",
 y2026:"Nicho claro: pocas filas y muchísimas columnas (espectros, ómicas). Fuera de ahí, el boosting lo supera casi siempre."},

gbr:{
 caso:{sector:"Energía · Previsión de demanda",
   sit:"Una comercializadora eléctrica necesita prever el consumo horario del día siguiente para comprar en el mercado diario.",
   datos:"3 años horarios: consumo, temperatura, hora, día de la semana, festivo, laborable.",
   target:"Consumo horario (MWh).",
   metrica:"MAE en MWh, traducido a € de desvío — que es lo que se paga en el mercado.",
   decision:"Volumen a comprar en el mercado diario por hora.",
   impacto:"El error se paga literalmente: cada MWh de desvío se liquida a precio de penalización. Bajar el MAE un 8% es margen directo, y aquí las no linealidades importan (la relación consumo-temperatura tiene forma de U)."},
 hp:[["n_estimators + learning_rate","Van juntos y son inversos. Baja el lr y sube los árboles hasta que la validación deje de mejorar."],
   ["max_depth","3 a 6 en tabular. Más profundidad memoriza."],
   ["subsample","0,8 introduce aleatoriedad y suele mejorar la generalización."]],
 trampas:["Validar una serie temporal con split aleatorio: el modelo ve el futuro y el resultado es una fantasía. Usa validación temporal.",
   "Usar la temperatura real del día a predecir: en producción solo tendrás la temperatura *prevista*, con su propio error.",
   "Confiar en feature_importances_ por impureza: está sesgada hacia variables con muchos valores distintos. Usa permutación o SHAP."],
 uso:"No necesita escalado. Sí necesita codificar categóricas. En producción: modelo de unos MB, predicción en milisegundos, reentrenamiento semanal o mensual.",
 y2026:"El GradientBoostingRegressor clásico de sklearn está superado en velocidad por HistGradientBoostingRegressor, LightGBM y XGBoost. Úsalo para aprender el mecanismo; en producción ve a los otros."}

};

/* ══ CAPA PROFESIONAL — bloque 2 · CLASIFICACIÓN ══════════════ */
var PRO2 = {

logistica:{
 caso:{sector:"SaaS · Retención",
   sit:"Una plataforma B2B con 18.000 cuentas pierde el 2,1% mensual y el equipo de Customer Success solo puede atender 300 cuentas al mes.",
   datos:"24 meses: uso del producto, tickets de soporte, adopción de funciones, antigüedad, plan, impagos.",
   target:"Baja en los próximos 60 días (binaria).",
   metrica:"PR-AUC, no ROC-AUC: con 2% de positivos la ROC se ve bien aunque el modelo sea inútil. Y recall@300, que son las cuentas que caben en la capacidad real.",
   decision:"Qué 300 cuentas llama el equipo este mes.",
   impacto:"El valor no es predecir la baja: es ordenar la lista. Y la logística da algo que el boosting no: el motivo en forma de odds ratio, que es lo que el gestor necesita para saber qué decir en la llamada."},
 hp:[["C","Inverso de la regularización. C bajo = más regularización. Búscalo por validación cruzada."],
   ["class_weight","'balanced' con clases desbalanceadas. Equivale a mover el umbral: ayuda a ordenar, pero infla la probabilidad de la clase rara. Si vas a usar la probabilidad como tal (pricing, pérdida esperada), no lo uses o recalibra después."],
   ["penalty + solver","L1 con 'liblinear'/'saga' si quieres selección; L2 con 'lbfgs' por defecto."]],
 trampas:["Usar el umbral 0,5 por defecto. Casi nunca es el óptimo de negocio: sale de la matriz de costes, no de la librería.",
   "Reportar accuracy con clases desbalanceadas: es el error más repetido y el más caro.",
   "Interpretar coeficientes sin estandarizar: un coeficiente grande puede serlo solo por la unidad de la variable."],
 uso:"Estandariza si vas a comparar coeficientes o usar regularización. Es un producto escalar más una sigmoide: se puede implementar en SQL y servir con latencia de microsegundos.",
 y2026:"Sigue siendo el modelo de referencia en scoring crediticio y seguros, precisamente porque es auditable. El AI Act clasifica el credit scoring como sistema de alto riesgo; tras el Digital Omnibus (Reglamento (UE) 2026/1744, en vigor desde julio de 2026) esas obligaciones se aplican desde el 2 de diciembre de 2027. La auditabilidad está pasando de virtud a requisito."},

arbol:{
 caso:{sector:"Banca · Operaciones",
   sit:"Un equipo de backoffice quiere automatizar la aprobación de reclamaciones pequeñas y necesita una política escrita que pueda auditar el regulador.",
   datos:"45.000 reclamaciones históricas con importe, canal, antigüedad del cliente, tipo de incidencia y resolución.",
   target:"Aprobar automáticamente sí/no.",
   metrica:"Precisión de la clase «aprobar» (un falso positivo es dinero pagado de más) y cobertura del automatismo.",
   decision:"Escribir las reglas del motor de decisión automática.",
   impacto:"Aquí el entregable no es un modelo, es un documento de política. El árbol se convierte literalmente en un diagrama de flujo que firma el responsable de cumplimiento."},
 hp:[["max_depth","El principal. 3-5 para que sea legible por un humano; más profundidad ya no es explicable."],
   ["min_samples_leaf","Evita hojas con 3 casos que son ruido. Ponlo en un mínimo operativo (p. ej. 50)."],
   ["class_weight","Para desbalanceo."],
   ["ccp_alpha","Poda por complejidad-coste, la forma correcta de podar tras entrenar."]],
 trampas:["Dejarlo crecer sin límite: memoriza el training y no generaliza nada.",
   "Presentar la importancia de variables de un solo árbol como verdad: es muy inestable, cambia con quitar 10 filas.",
   "Creer que «interpretable» significa «correcto». Un árbol puede ser perfectamente legible y estar aprendiendo un sesgo del histórico."],
 uso:"Sin escalado. Maneja categóricas si las codificas. Exporta a reglas con export_text y llévalas a producción como código, no como modelo.",
 y2026:"Como modelo predictivo está superado. Como generador de políticas auditables y como herramienta docente sigue siendo insustituible."},

rf:{
 caso:{sector:"Salud · Gestión hospitalaria",
   sit:"Un hospital quiere anticipar el reingreso a 30 días para reforzar el seguimiento al alta.",
   datos:"60.000 altas: diagnóstico, comorbilidades, estancia, edad, medicación, ingresos previos, indicadores sociales.",
   target:"Reingreso no programado en 30 días.",
   metrica:"ROC-AUC y recall en el decil superior; calibración, porque la probabilidad se usa para priorizar.",
   decision:"A qué pacientes asignar seguimiento telefónico al alta.",
   impacto:"Random Forest es la elección típica del sector porque funciona sin apenas ajuste, tolera nulos y outliers clínicos, y el score OOB da una estimación honesta sin gastar datos en validación — algo valioso cuando cada historia clínica cuesta conseguirla."},
 hp:[["n_estimators","Más siempre es mejor o igual, nunca peor: solo cuesta tiempo. 300-500 es razonable."],
   ["max_features","El que de verdad regula la diversidad. 'sqrt' en clasificación por defecto."],
   ["min_samples_leaf","Sube para reducir sobreajuste con datos ruidosos."],
   ["class_weight","'balanced_subsample' con desbalanceo."]],
 trampas:["Confiar en feature_importances_ por impureza: favorece variables continuas y de alta cardinalidad. Usa importancia por permutación.",
   "Asumir que sus probabilidades están calibradas: son medias de votos y suelen estar comprimidas hacia el centro. Calíbralas si vas a usar el valor.",
   "Meter identificadores de paciente o de episodio: el bosque los memoriza y el modelo parece perfecto en validación."],
 uso:"Sin escalado. Modelo grande (cientos de MB con muchos árboles) pero predicción paralelizable. Reentrenar trimestralmente.",
 y2026:"Sigue siendo la mejor relación resultado/esfuerzo sin tuning. Cuando importa la última décima, boosting; cuando importa tener algo sólido hoy, Random Forest."},

extratrees:{
 caso:{sector:"Ciberseguridad",
   sit:"Un SOC clasifica millones de eventos diarios y necesita reentrenar cada pocas horas conforme cambian los patrones de ataque.",
   datos:"Millones de eventos con centenares de variables derivadas del tráfico.",
   target:"Evento malicioso sí/no.",
   metrica:"Precisión en el top de alertas (la fatiga de alertas es el problema real) y tiempo de reentrenamiento.",
   decision:"Qué eventos escalan a analista humano.",
   impacto:"La ventaja aquí no es la precisión, es el reloj: Extra Trees entrena bastante más rápido que Random Forest con resultados equivalentes, y en un SOC que reentrena cada 4 horas eso es lo que hace viable el sistema."},
 hp:[["n_estimators","Igual que RF: más es mejor, solo cuesta tiempo."],
   ["max_features","Con cortes aleatorios suele convenir subirlo respecto a RF."],
   ["bootstrap","False por defecto en Extra Trees, al contrario que en RF. Es intencionado."]],
 trampas:["Esperar mejoras con datasets pequeños y señal sutil: ahí el corte aleatorio pierde información que RF sí aprovecha.",
   "Compararlo con RF sin igualar n_estimators: la comparación no significa nada."],
 uso:"Idéntico a Random Forest. Sin escalado, reentrenamiento rápido, predicción paralelizable.",
 y2026:"Alternativa infravalorada. Cuando el cuello de botella es el tiempo de entrenamiento y no la precisión, suele ser la respuesta correcta."},

xgboost:{
 caso:{sector:"Fintech · Riesgo de crédito",
   sit:"Una financiera de consumo decide en menos de 2 segundos si concede un préstamo en el punto de venta.",
   datos:"1,2 M de operaciones: bureau de crédito, ingresos declarados, comportamiento en la app, dispositivo, importe y plazo.",
   target:"Impago a 90 días.",
   metrica:"PR-AUC y coeficiente de Gini (el lenguaje del sector). Y la métrica de verdad: pérdida esperada en € a tasa de aprobación fija.",
   decision:"Conceder, denegar o pedir documentación adicional.",
   impacto:"Un punto de Gini se traduce en millones de € de pérdida evitada al año a igual volumen. Por eso el sector paga el coste de la caja negra… y por eso SHAP dejó de ser opcional: hay que explicar cada denegación."},
 hp:[["n_estimators + learning_rate","El par fundamental. Usa early_stopping_rounds y deja que pare solo."],
   ["max_depth","4-8 en tabular. Es el que más sobreajusta si te pasas."],
   ["subsample + colsample_bytree","0,8 ambos como punto de partida: aleatoriedad que regulariza."],
   ["scale_pos_weight","Para desbalanceo: n_negativos/n_positivos."],
   ["min_child_weight / gamma","Los frenos finos contra el sobreajuste."]],
 trampas:["Ajustar hiperparámetros mirando el test: acabas optimizando sobre él y el resultado real será peor. Usa validación y guarda el test para el final.",
   "Leakage de variables construidas después del evento (p. ej. «número de recobros»): el modelo saldrá espectacular y en producción fallará.",
   "Publicar sin comprobar sesgo por variables protegidas o sus proxies (código postal es un proxy de renta y a veces de origen).",
   "Usar predict_proba como probabilidad real sin calibrar."],
 uso:"Sin escalado. Codifica categóricas o pasa a CatBoost. Modelo de MB, latencia de milisegundos, ideal para decisión en tiempo real. Reentrenar mensual con monitorización de drift.",
 y2026:"Sigue siendo el estándar de facto en tabular a escala. La novedad relevante son los modelos fundacionales tabulares: TabPFN-2.5 (nov. 2025) admite hasta 50.000 filas y 2.000 variables, gana a XGBoost por defecto en el 100% de los datasets de clasificación de hasta 10.000 filas de su benchmark (87% hasta 100.000) y admite destilado a un modelo ligero. Con 1,2 M de filas, XGBoost sigue mandando."},

lightgbm:{
 caso:{sector:"Publicidad digital",
   sit:"Una plataforma predice la probabilidad de clic para pujar en subastas que se resuelven en menos de 100 ms.",
   datos:"400 M de impresiones diarias, cientos de variables de contexto, usuario y creatividad.",
   target:"Clic sí/no (con tasas de 0,1%-2%).",
   metrica:"Log loss y, sobre todo, calibración: la puja se calcula multiplicando por el valor, así que una probabilidad mal calibrada se paga en euros.",
   decision:"Cuánto pujar por esta impresión concreta.",
   impacto:"A este volumen, XGBoost no llega a tiempo de reentrenar. El crecimiento por hoja y los histogramas de LightGBM son lo que hace que el ciclo diario sea posible."},
 hp:[["num_leaves","El principal y el más peligroso. Regla práctica: menor que 2^max_depth."],
   ["min_child_samples","Sube con datos ruidosos o pocos datos: evita hojas hiperespecíficas."],
   ["learning_rate + n_estimators","Con early stopping."],
   ["feature_fraction / bagging_fraction","Regularización por muestreo."]],
 trampas:["Dejar num_leaves alto con pocos datos: el crecimiento leaf-wise sobreajusta más rápido que el level-wise de XGBoost.",
   "Categóricas nativas sin cuidado: LightGBM las soporta, pero con alta cardinalidad conviene comprobar que no está sobreajustando.",
   "Comparar con XGBoost sin igualar el número efectivo de hojas: no es una comparación justa."],
 uso:"Sin escalado. El más rápido de la familia en CPU. Modelo compacto, latencia sub-milisegundo, apto para servir en tiempo real.",
 y2026:"La opción por defecto cuando el volumen es grande y la ventana de reentrenamiento es corta. En benchmarks recientes, el boosting sigue dominando a escala frente a alternativas neuronales."},

catboost:{
 caso:{sector:"Telecomunicaciones · Churn",
   sit:"Una operadora quiere anticipar la portabilidad. Su CRM está lleno de campos categóricos de alta cardinalidad: tarifa, terminal, provincia, canal de alta, motivo del último contacto.",
   datos:"5 M de líneas con 40 variables, la mitad categóricas y algunas con miles de valores distintos.",
   target:"Portabilidad en 30 días.",
   metrica:"ROC-AUC y lift en el primer decil, que es donde actúa retención.",
   decision:"A quién ofrecer renovación anticipada y con qué agresividad.",
   impacto:"Con one-hot, 40 variables se convierten en miles de columnas y el modelo se degrada. CatBoost trata las categóricas de forma nativa y sin el leakage del target encoding manual: menos ETL, menos errores y mejor resultado."},
 hp:[["iterations + learning_rate","Con od_type='Iter' para parada temprana."],
   ["depth","6 por defecto y suele ser correcto; usa árboles simétricos."],
   ["l2_leaf_reg","La regularización principal."],
   ["cat_features","No es un hiperparámetro pero es LA decisión: declara bien qué columnas son categóricas."]],
 trampas:["No declarar cat_features y dejar que las trate como numéricas: pierdes toda la ventaja del modelo.",
   "Esperar la velocidad de LightGBM: CatBoost es más lento entrenando, esa es la contrapartida.",
   "Meter identificadores únicos como categóricas: aunque su codificación es más robusta, sigue siendo leakage."],
 uso:"Sin escalado ni encoding manual: es su razón de ser. Buen soporte GPU. Modelo algo más pesado.",
 y2026:"Referencia clara cuando dominan las categóricas, escenario típico de cualquier CRM. Es lo que hace que sea tan habitual en telco, banca y retail."},

adaboost:{
 caso:{sector:"Industria · Visión de línea",
   sit:"Clasificación binaria de piezas correctas o defectuosas con un conjunto pequeño y muy limpio de variables extraídas de imagen.",
   datos:"6.000 piezas × 30 descriptores geométricos.",
   target:"Pieza defectuosa sí/no.",
   metrica:"Recall del defecto: dejar pasar una pieza mala cuesta mucho más que revisar una buena de más.",
   decision:"Desviar la pieza a inspección manual.",
   impacto:"Con datos limpios y pocas variables, AdaBoost sobre tocones da un modelo muy compacto y rápido, que es lo que hace falta en un PLC de línea."},
 hp:[["n_estimators","Número de modelos débiles."],
   ["learning_rate","Compensa con n_estimators, igual que en el resto del boosting."],
   ["estimator","Normalmente un árbol de profundidad 1. Subir a 2-3 puede ayudar con interacciones."]],
 trampas:["Aplicarlo con etiquetas ruidosas: sube el peso de lo que falla, y si lo que falla es un error de etiquetado acaba modelando el ruido. Es su debilidad estructural.",
   "Usarlo donde XGBoost es viable: casi siempre pierde. Su valor hoy es didáctico y para modelos muy pequeños."],
 uso:"Sin escalado. Modelo minúsculo, predicción instantánea, embebible en hardware.",
 y2026:"Históricamente decisivo (fue el primer boosting práctico), hoy desplazado por el gradient boosting. Merece conocerse porque explica de dónde viene todo lo demás."},

svmlin:{
 caso:{sector:"Legal · Clasificación documental",
   sit:"Un despacho clasifica automáticamente contratos entrantes por tipo, a partir de su representación TF-IDF.",
   datos:"12.000 documentos × 50.000 términos — matriz dispersa y altísima dimensión.",
   target:"Tipo de contrato (multiclase).",
   metrica:"F1 macro, porque hay clases raras que importan tanto como las frecuentes.",
   decision:"Enrutado automático al equipo especialista.",
   impacto:"Con 50.000 columnas y 12.000 filas, el SVM lineal es de lo poco que funciona bien y rápido. Es el clasificador clásico de texto junto a Naive Bayes."},
 hp:[["C","El único importante. Con texto disperso, valores bajos suelen ir mejor."],
   ["class_weight","'balanced' para clases raras."],
   ["loss / dual","En LinearSVC, dual=False si hay más filas que columnas."]],
 trampas:["No estandarizar datos densos (con TF-IDF ya normalizado no hace falta, pero con variables numéricas crudas es obligatorio).",
   "Esperar probabilidades: el SVM da distancia al margen. Envuélvelo en calibración si necesitas probabilidad.",
   "Usar SVC(kernel='linear') con datos grandes: LinearSVC está optimizado y es mucho más rápido."],
 uso:"Con texto, normaliza TF-IDF. Predicción rapidísima (producto escalar). Entrenamiento manejable si usas LinearSVC.",
 y2026:"En clasificación de texto los transformers ganan en calidad, pero el SVM lineal sigue siendo la línea base honesta: entrena en segundos, sin GPU, y en dominios cerrados la diferencia suele ser pequeña frente a un coste muchísimo menor."},

svmker:{
 caso:{sector:"Mantenimiento predictivo",
   sit:"Detectar baterías industriales próximas al fallo a partir de edad e intensidad de uso, donde la frontera no es una recta.",
   datos:"119 baterías con edad, ciclos e intensidad de uso.",
   target:"Requiere reemplazo sí/no.",
   metrica:"Recall del fallo: una batería que falla en campo cuesta mucho más que una sustitución preventiva.",
   decision:"Programar sustitución preventiva en la próxima parada.",
   impacto:"Con pocos datos y frontera curva, el kernel polinómico o RBF encuentra la separación que una logística no ve. Es exactamente tu caso de notebook."},
 hp:[["C","Coste de violar el margen."],
   ["gamma","En RBF, el alcance de influencia de cada punto. El que más sobreajusta."],
   ["kernel + degree","'rbf' por defecto; 'poly' con degree 2-3 si sospechas interacción polinómica."]],
 trampas:["No estandarizar. Con SVM es fatal, no opcional.",
   "gamma alto: fronteras isla alrededor de cada muestra, sobreajuste puro.",
   "Escalar mal el problema: por encima de decenas de miles de filas el coste se dispara."],
 uso:"Estandarización obligatoria dentro del Pipeline. Guarda los vectores de soporte: si son casi todas las filas, el modelo está sobreajustando.",
 y2026:"Nicho: pocos datos, frontera no lineal, muchas variables. Fuera de ahí, el boosting gana en resultado y en velocidad."},

knn:{
 caso:{sector:"E-commerce · Catálogo",
   sit:"Asignar categoría a productos nuevos a partir de sus atributos, cuando el catálogo cambia constantemente.",
   datos:"80.000 productos con atributos estructurados y embeddings de descripción.",
   target:"Categoría del catálogo (cientos de clases).",
   metrica:"Accuracy top-1 y top-3, más cobertura con confianza.",
   decision:"Publicar la categoría automáticamente o mandar a revisión manual.",
   impacto:"Su ventaja aquí es que no hay que reentrenar: cuando entra una categoría nueva basta con añadir ejemplos al índice. Con un catálogo vivo, eso vale más que un punto de precisión."},
 hp:[["n_neighbors","El principal. K pequeño = frontera ruidosa; K grande = frontera plana. Por validación cruzada."],
   ["weights","'distance' pondera por cercanía y suele ganar a 'uniform'."],
   ["metric","Euclídea por defecto; coseno para embeddings de texto."]],
 trampas:["No estandarizar: la distancia la dominaría la variable de mayor rango.",
   "Alta dimensión sin reducir: con cientos de variables las distancias se igualan y el vecino deja de significar nada.",
   "Olvidar que el coste está en la predicción: con millones de filas y baja latencia, necesitas un índice aproximado (FAISS, HNSW), no sklearn."],
 uso:"Estandarización obligatoria. Sin entrenamiento, pero la predicción escala con el tamaño del dataset. Para producción real, índice ANN.",
 y2026:"El KNN clásico ha renacido como base de la búsqueda vectorial: los sistemas RAG y de recomendación semántica son, en el fondo, vecinos más próximos sobre embeddings a gran escala."},

nb:{
 caso:{sector:"Atención al cliente",
   sit:"Enrutar automáticamente 4.000 correos diarios a los equipos de facturación, incidencias, bajas o comercial.",
   datos:"250.000 correos históricos ya etiquetados por el equipo.",
   target:"Cola de destino (multiclase).",
   metrica:"Precisión por clase (enrutar mal genera un reenvío y molesta al cliente) y % automatizable con confianza alta.",
   decision:"Enrutar automáticamente o dejar en la cola general.",
   impacto:"Entrena en segundos sobre 250.000 correos, sin GPU, y da una línea base sólida el primer día. En proyectos de texto es el modelo con el que se mide si merece la pena el resto."},
 hp:[["alpha","Suavizado de Laplace. Evita que una palabra no vista anule la probabilidad. 1,0 por defecto."],
   ["fit_prior","Si las clases están desbalanceadas y no quieres que el prior domine, ponlo en False."],
   ["Variante","MultinomialNB para conteos, ComplementNB si hay desbalanceo fuerte, BernoulliNB para presencia/ausencia."]],
 trampas:["Usar GaussianNB con texto: la variante importa mucho más que el ajuste fino.",
   "Tomar sus probabilidades como reales: están muy mal calibradas (tiende a 0 o 1) por el supuesto de independencia.",
   "No limpiar el vocabulario: sin min_df y max_df, el ruido se lleva buena parte de la señal."],
 uso:"Solo necesita vectorización. Entrenamiento en segundos, modelo diminuto, latencia despreciable. Reentrenamiento trivial.",
 y2026:"Superado en calidad por los transformers, pero sigue siendo la línea base obligatoria en texto: si un modelo de 300 M de parámetros no le saca una diferencia clara, no compensa desplegarlo."},

lda:{
 caso:{sector:"Banca privada · Segmentación",
   sit:"Clasificar clientes en tres perfiles de riesgo inversor y, a la vez, poder dibujar en un plano por qué caen donde caen.",
   datos:"9.000 clientes × 25 variables financieras numéricas.",
   target:"Perfil (conservador / moderado / arriesgado).",
   metrica:"F1 macro y varianza explicada por los dos primeros ejes discriminantes.",
   decision:"Qué cartera modelo proponer y cómo justificarlo ante el cliente.",
   impacto:"Su valor diferencial: clasifica y proyecta a la vez. El gráfico en 2D de los ejes discriminantes es una herramienta comercial, no solo un diagnóstico técnico."},
 hp:[["solver","'svd' por defecto; 'lsqr' o 'eigen' si necesitas shrinkage."],
   ["shrinkage","Con pocas filas y muchas variables, 'auto' regulariza la covarianza y salva el modelo."],
   ["n_components","Como máximo nº de clases − 1. Es una limitación estructural, no una elección."]],
 trampas:["Aplicarlo con variables muy no gaussianas sin transformar: los supuestos importan más aquí que en un árbol.",
   "Confundirlo con el LDA de topic modeling. Mismo acrónimo, disciplinas distintas.",
   "Usar más componentes de los que permite el número de clases: con 3 clases el máximo es 2."],
 uso:"Estandariza. Muy rápido, modelo pequeño, transform() para proyectar. Ideal cuando hace falta visual y clasificación juntas.",
 y2026:"Poco de moda pero técnicamente vigente. En datos numéricos con clases razonablemente gaussianas sigue siendo competitivo y muchísimo más explicable que un ensemble."},

qda:{
 caso:{sector:"Diagnóstico clínico",
   sit:"Distinguir dos condiciones cuya dispersión biológica es claramente distinta: una es homogénea y la otra muy variable.",
   datos:"1.500 pacientes × 12 marcadores.",
   target:"Condición A o B.",
   metrica:"ROC-AUC y sensibilidad, con el umbral fijado por el coste clínico del falso negativo.",
   decision:"Derivar a prueba confirmatoria.",
   impacto:"LDA obliga a las dos clases a compartir forma. Cuando una condición es mucho más dispersa que la otra, ese supuesto es falso y la frontera sale mal colocada. QDA lo corrige."},
 hp:[["reg_param","La clave. Regulariza la covarianza por clase; imprescindible cuando hay pocas muestras por clase."],
   ["store_covariance","Útil para inspeccionar y explicar el modelo."]],
 trampas:["Pocas muestras por clase frente al número de variables: estimar una covarianza por clase se vuelve imposible y el modelo explota.",
   "No comprobar si LDA basta: si las covarianzas son parecidas, QDA solo añade varianza sin ganar nada."],
 uso:"Estandariza. Rápido. Compáralo siempre contra LDA: la diferencia entre ambos te dice si el supuesto de covarianza común se sostiene.",
 y2026:"Herramienta de diagnóstico estadístico más que de producción. Su mayor utilidad hoy es comprobar supuestos frente a LDA."}

};

/* ══ CAPA PROFESIONAL — bloque 3 · SUPERVIVENCIA, CAUSAL, DEEP LEARNING ══ */
var PRO3 = {

cox:{
 caso:{sector:"Suscripciones · Retención",
   sit:"Una plataforma sabe quién se va a dar de baja, pero no cuándo, así que gasta el presupuesto de retención demasiado pronto o demasiado tarde.",
   datos:"180.000 suscripciones, muchas todavía activas al cierre del análisis.",
   target:"Tiempo hasta la baja, con censura por la derecha en los clientes aún activos.",
   metrica:"C-index (concordancia) y curvas de Kaplan-Meier por segmento.",
   decision:"En qué mes de vida del cliente lanzar la acción de retención.",
   impacto:"Pasar de «este cliente se irá» a «este cliente se irá en el mes 7» cambia por completo la economía de la campaña. Y aprovecha a los clientes aún activos, que un clasificador binario tiraría a la basura o etiquetaría mal."},
 hp:[["penalizer","Regularización L2 en lifelines. Súbela con muchas variables correlacionadas."],
   ["strata","Para variables que violan el supuesto de riesgos proporcionales: se estratifica en vez de ajustar."]],
 trampas:["Ignorar el supuesto de riesgos proporcionales. Compruébalo con check_assumptions(); si no se cumple, los hazard ratios no significan lo que crees.",
   "Convertirlo en clasificación binaria «se va en 6 meses sí/no»: tiras la información de cuándo y sesgas por censura.",
   "Meter variables medidas después del inicio del seguimiento: es leakage temporal disfrazado."],
 uso:"lifelines o scikit-survival. Codifica categóricas. El modelo devuelve curvas, no un número: el consumo en BI es distinto y hay que diseñarlo.",
 y2026:"Cox sigue siendo el estándar interpretable. Para relaciones no lineales existen Random Survival Forests y variantes de boosting para supervivencia, que ganan en precisión a costa de los hazard ratios."},

uplift:{
 caso:{sector:"Retail · Promociones",
   sit:"Una cadena manda 2 M de cupones al trimestre. Sabe quién compra, pero no a quién le hace falta el cupón para comprar.",
   datos:"Campaña previa con grupo de control aleatorizado: 1,8 M tratados y 200.000 control.",
   target:"Compra en 30 días, más el indicador de tratamiento.",
   metrica:"Curva de Qini y uplift acumulado en los primeros deciles.",
   decision:"A qué 600.000 clientes mandar el cupón el próximo trimestre.",
   impacto:"El descubrimiento típico: un porcentaje relevante de los cupones va a gente que iba a comprar igualmente (margen regalado) y una parte pequeña va a «durmientes» a los que el cupón molesta y acelera su baja. Recortar el envío puede subir el beneficio incremental aunque baje la conversión total — y hay que saber explicar esa aparente contradicción."},
 hp:[["Meta-learner","T-learner (un modelo por grupo), S-learner (tratamiento como variable) o X-learner (mejor con grupos desbalanceados). La elección importa más que los hiperparámetros."],
   ["Modelo base","Normalmente LightGBM o XGBoost dentro del meta-learner."]],
 trampas:["Intentarlo con datos históricos sin aleatorizar y tratar el resultado como causal: si la campaña se mandó a quien ya iba a comprar, el modelo confunde selección con efecto. Sin experimento, necesitas el supuesto de «no confusión» y técnicas de la ficha de Propensity.",
   "Evaluarlo con AUC: mide predicción, no incremento. Necesitas Qini o uplift por decil.",
   "Grupo de control demasiado pequeño: la varianza del uplift estimado se dispara y las conclusiones son ruido.",
   "Olvidar los «sleeping dogs», el segmento al que la acción perjudica activamente."],
 uso:"causalml o scikit-uplift. Exige diseño experimental ANTES de modelar: es un proyecto de negocio, no solo de datos.",
 y2026:"Área en crecimiento claro dentro del marketing basado en causalidad. La evaluación a escala ya se hace sobre conjuntos como Criteo Uplift, con millones de registros y varios estimadores CATE comparados."},

propensity:{
 caso:{sector:"Precios",
   sit:"Se subió el precio un 6% en 40 tiendas hace seis meses y dirección quiere saber el efecto real sobre el volumen, sin haber diseñado un experimento.",
   datos:"3 años semanales de 400 tiendas, 40 tratadas y 360 no tratadas.",
   target:"Unidades vendidas por tienda y semana.",
   metrica:"ATT con intervalo de confianza, más el test visual de tendencias paralelas previas.",
   decision:"Extender la subida al resto de la red o revertirla.",
   impacto:"Comparar tratadas contra no tratadas sin más es engañoso: se subió precio donde la demanda era fuerte. Diff-in-Diff descuenta la tendencia común y el emparejamiento por propensión iguala las características; juntos aíslan el efecto del precio."},
 hp:[["Modelo de propensión","Normalmente logística. Lo importante no es su AUC sino el balance de covariables tras emparejar."],
   ["Método de emparejamiento","Vecino más próximo, radio o ponderación IPW; comprueba el solapamiento (common support)."]],
 trampas:["No comprobar las tendencias paralelas antes del tratamiento: es EL supuesto y se verifica mirando varios periodos previos.",
   "Confusión no observada: si algo que no mides explica a la vez el tratamiento y el resultado, el efecto sale sesgado y ninguna técnica lo arregla.",
   "Emparejar sobre variables posteriores al tratamiento: introduces sesgo en lugar de quitarlo.",
   "Reportar el ATT como si fuera el efecto para toda la red: es el efecto sobre los tratados."],
 uso:"statsmodels, DoWhy o EconML. El trabajo real está en el diseño y en los diagnósticos, no en ajustar el modelo.",
 y2026:"La causalidad aplicada se ha consolidado como competencia diferencial del analista senior: es lo que separa «sé predecir» de «sé decir si funcionó»."},

mlp:{
 caso:{sector:"Fintech · Scoring alternativo",
   sit:"Puntuar solicitantes sin histórico crediticio a partir de señales de comportamiento con interacciones complejas.",
   datos:"400.000 solicitudes × 120 variables de comportamiento.",
   target:"Impago a 12 meses.",
   metrica:"PR-AUC frente a la línea base de regresión logística. Sin esa comparación, el proyecto no está justificado.",
   decision:"Aprobar, denegar o escalar a revisión manual.",
   impacto:"El caso honesto: en tabular, el MLP muchas veces NO gana a una logística bien construida ni a un boosting. Merece la pena montar la comparación y aceptar el resultado, aunque sea que la red no aporta. Documentar eso es señal de criterio profesional."},
 hp:[["Arquitectura","Número y tamaño de capas. Empieza pequeño: 1-2 capas de 32-128 neuronas."],
   ["learning_rate","El más sensible. Con Adam, 1e-3 es el punto de partida."],
   ["Dropout / weight decay","La regularización que evita memorizar."],
   ["batch_size + early stopping","Vigila siempre la curva de validación, no la de entrenamiento."]],
 trampas:["No estandarizar: sin escalado la red no converge o converge mal.",
   "No comparar contra una línea base simple. Es el fallo profesional más habitual con redes.",
   "Mirar solo la pérdida de entrenamiento: si baja y la de validación sube, estás memorizando.",
   "Semilla no fijada: dos ejecuciones dan resultados distintos y no sabrás si mejoraste o tuviste suerte."],
 uso:"Estandarización obligatoria. Necesita GPU si el volumen es grande. En producción: versionado de pesos, control de dependencias y monitorización de drift más estricta que con árboles.",
 y2026:"En datos tabulares el consenso empírico se mantiene: el boosting iguala o supera a las redes en la mayoría de escenarios, y donde hay pocos datos los modelos fundacionales tabulares están ganando el hueco que ocupaban las redes a medida."},

cnn:{
 caso:{sector:"Retail · Inventario",
   sit:"Contar y clasificar producto en lineal a partir de fotos hechas por el equipo de tienda, para medir cumplimiento del planograma.",
   datos:"12.000 imágenes etiquetadas con cajas por producto.",
   target:"Detección y clase de cada objeto.",
   metrica:"mAP@0,5 e IoU; y la métrica de negocio: % de referencias contadas correctamente.",
   decision:"Alertar de rotura de lineal y de incumplimiento de planograma.",
   impacto:"Ningún equipo entrena hoy una CNN desde cero para esto: se parte de un modelo preentrenado y se hace fine-tuning con unos cientos de imágenes propias. Eso reduce el proyecto de meses a semanas."},
 hp:[["Modelo base","La decisión principal: tamaño del YOLO o backbone. Equilibrio entre precisión y latencia."],
   ["imgsz","Resolución de entrada. Subirla mejora objetos pequeños y encarece la inferencia."],
   ["conf / iou","Umbrales de confianza y de supresión de solapamiento. Se ajustan al coste del falso positivo."],
   ["epochs + augmentation","Con datasets pequeños, el aumento de datos importa más que la arquitectura."]],
 trampas:["Entrenar desde cero con pocos datos: siempre parte de pesos preentrenados.",
   "Conjunto de validación con imágenes de la misma tienda y hora que el de entrenamiento: el modelo parece perfecto y falla en campo.",
   "Ignorar el desplazamiento de dominio: cambia la iluminación de la tienda y la precisión cae.",
   "Etiquetado inconsistente entre anotadores: es la causa número uno de techo de rendimiento en visión."],
 uso:"Necesita GPU para entrenar; para inferencia hay versiones ligeras que corren en CPU o en el propio dispositivo. Vigila el tamaño del modelo si va a edge.",
 y2026:"El fine-tuning sobre preentrenado es el flujo estándar; en la familia YOLO la versión vigente es YOLO26 (enero de 2026, sin NMS y pensada para CPU y dispositivos edge). Los modelos de detección con vocabulario abierto (YOLOE, Grounding DINO) permiten además detectar clases descritas en texto sin reentrenar, lo que reduce mucho el coste de arranque."},

rnn:{
 caso:{sector:"Industria · Predicción de fallo",
   sit:"Anticipar el fallo de una máquina a partir de la secuencia de señales de sus sensores, donde importa el patrón temporal y no solo el valor puntual.",
   datos:"Series multivariante de 200 máquinas, muestreo por minuto, 18 meses.",
   target:"Fallo en las próximas 48 horas.",
   metrica:"Recall del fallo con antelación suficiente para actuar, y tasa de falsas alarmas por máquina y semana.",
   decision:"Programar parada preventiva.",
   impacto:"La clave es la ventana de aviso: predecir el fallo 10 minutos antes no sirve de nada; 48 horas antes permite planificar. La LSTM captura degradaciones lentas que un modelo sobre agregados pierde."},
 hp:[["units","Tamaño del estado oculto. Empieza en 32-64."],
   ["Longitud de secuencia","Cuánto pasado ve. Decisión de dominio, no técnica."],
   ["Dropout / recurrent_dropout","Regularización específica de recurrentes."],
   ["learning_rate + gradient clipping","El clipping evita que un gradiente enorme rompa el entrenamiento."]],
 trampas:["Normalizar usando estadísticas de toda la serie, incluido el futuro: leakage clásico en series temporales.",
   "Barajar aleatoriamente las ventanas entre train y test: hay solapamiento temporal y el resultado es falso.",
   "Desbalanceo extremo: los fallos son raros, y sin ponderar ni remuestrear la red aprende a decir siempre «no».",
   "No comparar contra una línea base simple sobre agregados: muchas veces basta."],
 uso:"Normaliza con estadísticas solo del pasado. GPU recomendable. En producción hay que gestionar el estado y la ventana deslizante.",
 y2026:"Para series, los modelos fundacionales preentrenados (Chronos, TimesFM, Moirai, TimeGPT) han desplazado a las LSTM entrenadas a medida en muchos casos: dan predicción sin entrenar nada. Las recurrentes conservan valor cuando la dinámica es muy específica y tienes datos de sobra."},

transformer:{
 caso:{sector:"Seguros · Tramitación",
   sit:"Extraer estructuradamente los datos de partes de siniestro escritos en texto libre por peritos.",
   datos:"90.000 partes históricos con su extracción validada.",
   target:"Campos estructurados: tipo de daño, causa, importe estimado, responsabilidad.",
   metrica:"F1 por campo y % de partes procesables sin intervención humana.",
   decision:"Tramitación automática o derivación a perito.",
   impacto:"El texto libre era hasta hace poco un dato inaccesible. La diferencia entre un modelo de bolsa de palabras y un transformer aquí no es marginal: es la diferencia entre entender «no se aprecia daño estructural» y contar la palabra «daño»."},
 hp:[["Modelo base","La decisión principal: tamaño y si es multilingüe. Para español, comprueba que el preentrenamiento lo cubra bien."],
   ["max_length","Ventana de contexto. Truncar mal pierde información crítica del final del documento."],
   ["learning_rate","En fine-tuning, muy bajo (1e-5 a 5e-5). Valores altos destruyen el preentrenamiento."],
   ["Épocas","Pocas: 2-4. Más suele degradar por olvido catastrófico."]],
 trampas:["Fine-tuning con learning rate de entrenamiento desde cero: arrasa lo aprendido.",
   "Ignorar el coste: un transformer en producción cuesta órdenes de magnitud más que una logística. Justifica la diferencia.",
   "Enviar datos personales a una API externa sin base legal: en seguros y banca es un problema de cumplimiento, no técnico.",
   "No evaluar en textos de un periodo posterior: el lenguaje y los formatos cambian."],
 uso:"GPU para entrenar y normalmente también para servir. Considera destilado o cuantización para bajar coste. Vigila latencia y privacidad del dato.",
 y2026:"Base de todo el NLP actual. Para muchos casos de extracción, un LLM con prompting bien diseñado ya compite con el fine-tuning y sale más barato de arrancar; el fine-tuning gana cuando el volumen es alto y hay que controlar coste y latencia."},

rbm:{
 caso:{sector:"Histórico · Recomendación",
   sit:"Fue una de las técnicas destacadas en el Netflix Prize para factorizar la matriz usuario-película.",
   datos:"Matriz dispersa de valoraciones.",
   target:"Valoración esperada.",
   metrica:"RMSE sobre valoraciones ocultas.",
   decision:"Qué recomendar.",
   impacto:"Hoy su interés es de contexto histórico: entender de dónde vienen los modelos generativos y el preentrenamiento no supervisado que después hizo posible el deep learning moderno."},
 hp:[["n_components","Número de unidades ocultas, es decir, factores latentes."],
   ["learning_rate + n_iter","Entrenamiento inestable; requiere paciencia."]],
 trampas:["Elegirlo para un problema real en 2026: casi siempre hay una opción mejor y más simple.",
   "Esperar entrenamiento estable: la divergencia contrastiva es una aproximación y se nota."],
 uso:"Requiere datos binarizados en su forma clásica. Poco soporte y poca documentación moderna.",
 y2026:"Prácticamente en desuso. Se mantiene en el manual para explicar la genealogía del campo, no como opción de proyecto."},

som:{
 caso:{sector:"Deporte profesional · Scouting",
   sit:"Un club quiere encontrar jugadores con perfil equivalente a uno objetivo pero de ligas más baratas.",
   datos:"4.000 jugadores × 60 métricas de rendimiento por 90 minutos.",
   target:"No hay: es exploratorio.",
   metrica:"Error de cuantización y error topográfico, más validación cualitativa del cuerpo técnico.",
   decision:"Lista corta de fichajes alternativos.",
   impacto:"El SOM produce un mapa donde la cercanía significa parecido. El ojeador puede señalar la celda del jugador objetivo y mirar quién cae al lado: es una herramienta que un no técnico usa directamente, cosa que un vector de clusters no permite."},
 hp:[["Tamaño de rejilla","Regla práctica: unas 5·√n neuronas. Más celdas, más detalle y menos generalización."],
   ["sigma","Radio de vecindad inicial. Decrece durante el entrenamiento."],
   ["learning_rate + iteraciones","Ajuste fino de la convergencia."]],
 trampas:["No estandarizar: igual que en cualquier método basado en distancia.",
   "Interpretar la posición absoluta en la rejilla: lo que significa algo es la vecindad, no las coordenadas.",
   "Rejilla demasiado grande para los datos: acabas con una neurona por jugador y no has agrupado nada."],
 uso:"Estandarización obligatoria. minisom es la librería habitual. El entregable es el mapa (U-matrix), pensado para consumo visual.",
 y2026:"Técnica de nicho pero muy vigente donde el entregable debe ser explorable por un experto de dominio: scouting deportivo, segmentación comercial, análisis de encuestas."}

};

/* ══ CAPA PROFESIONAL — bloque 4 · NO SUPERVISADO ══════════════ */
var PRO4 = {

kmeans:{
 caso:{sector:"Retail · Segmentación de clientes",
   sit:"Una cadena manda la misma comunicación a 900.000 clientes y quiere dejar de hacerlo.",
   datos:"Recencia, frecuencia, gasto medio, categorías compradas, canal, antigüedad.",
   target:"No hay: es descriptivo.",
   metrica:"Silueta y, sobre todo, estabilidad al remuestrear. Un segmento que desaparece al quitar el 10% de los datos no existe.",
   decision:"Cuántas comunicaciones distintas diseña marketing y con qué mensaje.",
   impacto:"El error clásico es medir el éxito por la silueta. El éxito real es: ¿marketing puede escribir un mensaje distinto para cada segmento? Si dos clusters comparten mensaje, sobra uno, por muy buena que sea la métrica técnica."},
 hp:[["n_clusters","La decisión clave y no es puramente técnica: codo, silueta y capacidad operativa real del equipo."],
   ["n_init","10 o más: K-Means depende de la inicialización y una sola ejecución puede caer en un mínimo malo."],
   ["init","'k-means++' por defecto, siempre."]],
 trampas:["No estandarizar: el cluster lo acabaría decidiendo la variable con más rango.",
   "Variables sesgadas sin transformar: el gasto suele tener cola larga; sin log, unos pocos clientes VIP dominan la geometría.",
   "Aplicarlo a variables categóricas codificadas en one-hot: la distancia euclídea sobre dummies no significa gran cosa (mira K-Prototypes).",
   "Presentar clusters sin comprobar su estabilidad temporal: si cambian cada mes, no se puede construir estrategia sobre ellos."],
 uso:"Estandarización y tratamiento de colas obligatorios. Escala a millones de filas con MiniBatchKMeans. El entregable es un perfil por segmento, no las etiquetas.",
 y2026:"Sigue siendo el caballo de batalla de la segmentación comercial. La práctica que ha ganado terreno es clusterizar sobre embeddings del comportamiento en vez de sobre variables agregadas a mano."},

kmedoids:{
 caso:{sector:"Banca · Comercial",
   sit:"Se quiere presentar la segmentación al comité con un cliente real que represente cada grupo, no un promedio abstracto.",
   datos:"120.000 clientes × 18 variables, algunas con outliers fuertes de patrimonio.",
   target:"No hay.",
   metrica:"Silueta y coste total de disimilitud.",
   decision:"Diseño de la oferta por segmento, ilustrada con un caso real.",
   impacto:"«El cliente tipo del segmento 3 es este señor concreto» tiene un poder de comunicación que un centroide no tiene. Y con patrimonios extremos, la media de K-Means se desplaza a zonas donde no hay nadie."},
 hp:[["n_clusters","Igual que K-Means."],
   ["metric","Su ventaja real: admite Manhattan, Gower o cualquier matriz de distancias, no solo euclídea."],
   ["Algoritmo","FasterPAM (paquete kmedoids) da la calidad de PAM a una fracción del coste; el PAM clásico es lento con muchas filas."]],
 trampas:["Aplicarlo a millones de filas: escala mucho peor que K-Means.",
   "Olvidar que sigue necesitando fijar K de antemano."],
 uso:"Estandariza. Usa el paquete kmedoids (FasterPAM): scikit-learn-extra no publica versiones desde 2023 y falla con las versiones actuales de NumPy y scikit-learn. Con datos mixtos, combínalo con una matriz de distancias de Gower.",
 y2026:"Infravalorado. Cuando hay outliers o los datos son mixtos, suele ser mejor elección que K-Means, y el medoide facilita muchísimo la comunicación."},

jerarquico:{
 caso:{sector:"Gran consumo · Arquitectura de categoría",
   sit:"Un fabricante quiere entender cómo se agrupan sus 400 referencias según patrones de compra conjunta, sin decidir de antemano cuántos grupos hay.",
   datos:"Matriz de similitud entre referencias construida sobre cestas.",
   target:"No hay.",
   metrica:"Coeficiente cofenético y lectura del dendrograma por el equipo de categoría.",
   decision:"Estructura del lineal y de la arquitectura de surtido.",
   impacto:"El dendrograma es el entregable: permite discutir con el equipo comercial a qué altura cortar. Esa conversación no se puede tener con K-Means, que obliga a llegar con el número decidido."},
 hp:[["linkage","La decisión de fondo. 'ward' tiende a grupos compactos y equilibrados; 'average' y 'complete' dan otras formas. Cámbialo y mira cómo cambia la historia."],
   ["metric","Euclídea con ward; con otras métricas usa average o complete."],
   ["n_clusters / distance_threshold","Corta por número o por altura."]],
 trampas:["Aplicarlo a decenas de miles de filas: el coste es cuadrático en memoria y se cae.",
   "Usar ward con una métrica que no sea euclídea: matemáticamente no procede.",
   "Leer el dendrograma sin mirar la escala del eje: la altura de fusión es la información, no el dibujo."],
 uso:"Estandariza. scipy para el dendrograma, sklearn para las etiquetas. Con muchas filas, agrupa antes con K-Means y aplica jerárquico sobre los centroides.",
 y2026:"Sigue siendo la mejor herramienta de exploración cuando el número de grupos es la pregunta y no el dato de partida."},

dbscan:{
 caso:{sector:"Movilidad · Operaciones",
   sit:"Una empresa de reparto quiere localizar zonas calientes de entrega para ubicar puntos de consolidación urbana.",
   datos:"2 M de coordenadas de entrega del último trimestre.",
   target:"No hay.",
   metrica:"Número de clusters, % de ruido y viabilidad logística de las zonas encontradas.",
   decision:"Dónde abrir microhubs.",
   impacto:"Las zonas de reparto no son circulares: siguen calles y ríos. K-Means impondría círculos artificiales; DBSCAN encuentra la forma real y además marca como ruido las entregas dispersas, que son precisamente las que no justifican un hub."},
 hp:[["eps","El parámetro crítico. Elígelo con el gráfico de distancia al k-ésimo vecino y busca el codo, no a ojo."],
   ["min_samples","Regla práctica: al menos el número de dimensiones más uno; con ruido, sube."],
   ["metric","Con coordenadas geográficas, usa haversine y pasa los datos en radianes."]],
 trampas:["Usar distancia euclídea sobre latitud y longitud: un grado de longitud no mide lo mismo en Madrid que en Oslo.",
   "Clusters con densidades muy distintas: DBSCAN usa un solo eps global y falla. Mira HDBSCAN.",
   "Interpretar el ruido como error: es información, son los casos que no forman patrón.",
   "No estandarizar cuando las variables no son geográficas."],
 uso:"Con geodatos, haversine y radianes. Escala razonablemente con índices espaciales. El % de ruido es un resultado, no un fallo.",
 y2026:"HDBSCAN se ha convertido en la opción por defecto en la práctica: no exige fijar eps y maneja densidades variables. Aprende DBSCAN para entender el mecanismo y usa HDBSCAN en producción."},

gmm:{
 caso:{sector:"Banca · Perfilado",
   sit:"Los clientes no encajan en un solo perfil: uno puede ser 70% ahorrador y 30% inversor, y forzar una etiqueta única pierde información.",
   datos:"200.000 clientes × 22 variables de comportamiento financiero.",
   target:"No hay.",
   metrica:"BIC para elegir componentes; entropía de la asignación para ver cuánto solapamiento hay.",
   decision:"Personalización del mensaje según la mezcla, no según una etiqueta dura.",
   impacto:"La asignación blanda permite decir «a este cliente, 70% mensaje de ahorro y 30% de inversión», que es más fiel a la realidad y funciona mejor en campaña que meterlo a la fuerza en una caja."},
 hp:[["n_components","Elígelo por BIC, no por silueta."],
   ["covariance_type","'full' es flexible pero caro; 'diag' escala mejor; 'spherical' se acerca a K-Means."],
   ["reg_covar","Súbelo si falla por matrices singulares."],
   ["n_init","Como en K-Means, depende de la inicialización."]],
 trampas:["Aplicarlo a datos claramente no gaussianos sin transformar.",
   "Usar silueta para elegir componentes: asume clusters compactos, justo lo que GMM no impone.",
   "Con covariance_type='full' y muchas variables, el número de parámetros explota y necesitas muchísimos datos."],
 uso:"Estandariza. Devuelve predict_proba, que es su valor real. Escala peor que K-Means.",
 y2026:"La opción natural cuando los segmentos se solapan de verdad, algo habitual en comportamiento humano. Infrautilizado frente a K-Means por inercia."},

pca:{
 caso:{sector:"RR.HH. · People Analytics",
   sit:"Una encuesta de clima con 60 preguntas es imposible de comunicar a dirección pregunta por pregunta.",
   datos:"8.000 respuestas × 60 ítems en escala Likert.",
   target:"No hay.",
   metrica:"% de varianza explicada acumulada y interpretabilidad de las cargas.",
   decision:"Sobre qué 4 dimensiones construir el plan de acción anual.",
   impacto:"Pasar de 60 preguntas a 4 componentes interpretables («reconocimiento», «carga de trabajo», «liderazgo», «desarrollo») convierte un informe ilegible en una agenda de comité de dirección."},
 hp:[["n_components","Por varianza acumulada (0,90) o por scree plot. Menos es más si hay que comunicarlo."],
   ["whiten","Solo si el siguiente paso lo necesita; normalmente False."],
   ["svd_solver","'randomized' con muchas variables."]],
 trampas:["No estandarizar cuando las variables tienen escalas distintas: el primer componente será la de mayor rango.",
   "Interpretar los componentes como si fueran variables reales: son combinaciones, y el signo es arbitrario.",
   "Aplicar PCA antes del split: las medias y varianzas se calculan con datos de test. Va dentro del Pipeline.",
   "Usar PCA para reducir y luego decir qué variable original importa: esa información se ha mezclado."],
 uso:"Estandarización obligatoria dentro del Pipeline. Rapidísimo y determinista. Guarda el objeto ajustado para transformar datos nuevos igual.",
 y2026:"Sigue siendo la reducción de dimensionalidad más usada porque es rápida, determinista y explicable. Para datos muy no lineales, UMAP o autoencoders; para comunicar, PCA."},

tsne:{
 caso:{sector:"Retail · Comunicación de segmentos",
   sit:"Marketing no se cree la segmentación porque no la puede ver, solo recibe una tabla con números de cluster.",
   datos:"Las mismas variables de la segmentación, proyectadas a 2D.",
   target:"No hay.",
   metrica:"Inspección visual y coherencia con las etiquetas del clustering.",
   decision:"Aprobar o no la segmentación en comité.",
   impacto:"Es una herramienta de comunicación, no de modelado. Ver los grupos separados en un plano hace que un comité apruebe un proyecto que con una tabla de silhouette rechazaría."},
 hp:[["perplexity","Nº efectivo de vecinos, 5-50. Cambia radicalmente el dibujo: prueba varios antes de enseñar uno."],
   ["init","'pca' da resultados más estables y reproducibles que 'random'."],
   ["learning_rate","'auto' en versiones recientes."],
   ["random_state","Fíjalo o el mapa cambia cada vez y perderás credibilidad."]],
 trampas:["Interpretar la distancia entre clusters: no significa nada. Solo la vecindad local es fiable.",
   "Interpretar el tamaño de los grupos: t-SNE los expande y contrae, no es proporcional.",
   "Usar las coordenadas como variables para un modelo: no es una transformación reutilizable.",
   "Enseñar un solo mapa sin decir con qué perplexity: es cherry-picking involuntario."],
 uso:"Estandariza y reduce antes con PCA a ~50 componentes: mejora velocidad y estabilidad. Solo para visualizar.",
 y2026:"UMAP le ha comido buena parte del terreno por velocidad y por conservar mejor la estructura global. t-SNE sigue vivo por inercia y por resultados visualmente atractivos."},

umap:{
 caso:{sector:"Soporte · Análisis de tickets",
   sit:"Explorar 500.000 tickets vectorizados con embeddings para descubrir problemas emergentes que nadie ha categorizado.",
   datos:"500.000 embeddings de 768 dimensiones.",
   target:"No hay.",
   metrica:"Inspección visual y coherencia de los grupos al leerlos.",
   decision:"Qué temas emergentes escalar a producto.",
   impacto:"Con medio millón de vectores, t-SNE es inviable. UMAP los proyecta en minutos, conserva mejor la estructura global que t-SNE (aunque la distancia entre grupos sigue siendo orientativa, no una medida) y, crucialmente, tiene transform(): los tickets nuevos caen en el mismo mapa sin recalcularlo."},
 hp:[["n_neighbors","Bajo (5-15) resalta estructura local; alto (50+) resalta la global. Es el mando principal."],
   ["min_dist","Cuánto se apelotonan los puntos. Bajo para clusters compactos."],
   ["metric","'cosine' para embeddings de texto, casi siempre."],
   ["random_state","Fíjalo para reproducibilidad (a costa de paralelismo)."]],
 trampas:["Tratar el mapa como si fuera un espacio métrico exacto: sigue siendo una proyección, con distorsión.",
   "Usar euclídea con embeddings normalizados en vez de coseno.",
   "Sobreinterpretar grupos pequeños: pueden ser artefactos de la proyección."],
 uso:"Estandariza o normaliza según el tipo de dato. Tiene transform() para datos nuevos, a diferencia de t-SNE. Escala a millones.",
 y2026:"Se ha consolidado como el estándar de visualización de embeddings, y es la pieza previa habitual antes de clusterizar con HDBSCAN en flujos de análisis de texto."},

iforest:{
 caso:{sector:"Banca · Fraude en medios de pago",
   sit:"Detectar operaciones anómalas cuando el fraude conocido es escasísimo y las técnicas cambian constantemente.",
   datos:"40 M de transacciones mensuales con importe, comercio, geolocalización, hora y patrón del titular.",
   target:"No hay etiqueta fiable: el fraude confirmado llega meses después.",
   metrica:"Precisión en el top-N revisado por el equipo, que es lo único medible a corto plazo.",
   decision:"Qué 500 operaciones diarias revisa el equipo antifraude.",
   impacto:"Su ventaja aquí es no necesitar etiquetas, algo decisivo cuando el fraude nuevo por definición no está etiquetado. Y escala a decenas de millones de filas, que es donde muchos métodos de anomalías se rinden."},
 hp:[["contamination","Ojo: es una cuota, no una detección. Si no sabes la tasa real, usa score_samples y pon el umbral por capacidad de revisión."],
   ["n_estimators","100-300 suele bastar."],
   ["max_samples","256 por defecto y funciona sorprendentemente bien; es parte del diseño del algoritmo."]],
 trampas:["Fijar contamination a ojo y creerse el número de anomalías resultante.",
   "Usarlo cuando SÍ tienes etiquetas suficientes: un clasificador supervisado gana con diferencia.",
   "No revisar el drift: lo que era anómalo en enero puede ser normal en julio (Black Friday, campañas).",
   "Meter variables muy correlacionadas: enmascaran la anomalía repartiéndola."],
 uso:"Sin escalado obligatorio (usa cortes, no distancias), aunque ayuda. Muy rápido y paralelizable. Reentrenamiento frecuente por drift.",
 y2026:"Sigue siendo la opción por defecto para anomalías tabulares a escala por su relación coste/resultado. Para datos de alta dimensión o secuenciales, los autoencoders siguen siendo la alternativa."},

lof:{
 caso:{sector:"Industria · Control de calidad multiplanta",
   sit:"Detectar lotes anómalos cuando cada planta tiene su propio régimen normal: lo aceptable en la planta A sería alarmante en la B.",
   datos:"90.000 lotes de 6 plantas con 25 variables de proceso.",
   target:"No hay.",
   metrica:"Precisión en el top revisado por calidad.",
   decision:"Qué lotes bloquear para análisis.",
   impacto:"Un método global marcaría como anómala toda la planta B por ser distinta. LOF compara cada lote con su propio vecindario, así que detecta lo raro *dentro* de cada régimen — que es la pregunta real."},
 hp:[["n_neighbors","El principal. 20 por defecto; súbelo con datos ruidosos."],
   ["contamination","Igual que en Isolation Forest: es una cuota."],
   ["novelty","True si quieres puntuar datos nuevos con predict(); False para detección sobre el propio conjunto."]],
 trampas:["Olvidar el parámetro novelty: con False no puedes puntuar datos nuevos, y es el error que más despista.",
   "Escalar mal: es un método de distancia, la estandarización es obligatoria.",
   "Aplicarlo a millones de filas: el coste de vecindad lo hace inviable sin índices aproximados."],
 uso:"Estandarización obligatoria. Decide desde el principio si es detección o novedad, porque cambia el uso.",
 y2026:"Complemento de Isolation Forest más que competidor. La práctica sólida es ejecutar ambos y mirar dónde coinciden y dónde no: la discrepancia es informativa."},

autoenc:{
 caso:{sector:"Industria · Monitorización de activos",
   sit:"Detectar comportamiento anómalo en una turbina a partir de 200 señales correlacionadas, sin ejemplos de fallo etiquetados.",
   datos:"18 meses de operación normal, muestreo por segundo.",
   target:"No hay: se entrena solo con normalidad.",
   metrica:"Error de reconstrucción y antelación del aviso frente a las paradas registradas.",
   decision:"Generar aviso de mantenimiento.",
   impacto:"Con 200 señales correlacionadas, mirar umbrales individuales no funciona: cada señal está en rango pero la *combinación* es imposible. El autoencoder aprende la relación entre señales y detecta cuando esa relación se rompe."},
 hp:[["Tamaño del cuello de botella","El hiperparámetro fundamental. Demasiado grande y reconstruye todo (incluida la anomalía); demasiado pequeño y no reconstruye nada."],
   ["Arquitectura","Simétrica encoder/decoder. Empieza simple."],
   ["Umbral de error","No es del modelo sino de negocio: sale del percentil del error en datos normales y de la capacidad de atención a avisos."]],
 trampas:["Entrenar con datos que contienen anomalías: aprende a reconstruirlas y dejan de destacar. Es EL error de este modelo.",
   "Cuello de botella demasiado ancho: se convierte en la función identidad y el error es cero para todo.",
   "No recalibrar el umbral tras un cambio de régimen operativo legítimo.",
   "Usarlo donde Isolation Forest ya resolvía: mucho más coste por poca ganancia."],
 uso:"Normaliza con estadísticas del periodo normal. GPU útil para entrenar. En producción, error de reconstrucción por ventana temporal más umbral revisable.",
 y2026:"Sigue siendo la referencia para anomalías en alta dimensión y señales correlacionadas. En series, las variantes con arquitectura temporal (LSTM o convolucional 1D) son la práctica habitual."},

apriori:{
 caso:{sector:"Supermercado · Surtido y promoción",
   sit:"Decidir qué productos colocar juntos y qué packs crear, con datos de 900.000 tickets.",
   datos:"Tickets con la lista de productos comprados en cada uno.",
   target:"No hay.",
   metrica:"Soporte, confianza y lift; y sobre todo el filtro de accionabilidad: ¿se puede hacer algo con esta regla?",
   decision:"Colocación en lineal, packs y recomendaciones de caja.",
   impacto:"Genera reglas que un jefe de categoría entiende y puede ejecutar mañana. El límite conocido: descubre asociaciones evidentes (pan y leche) que no aportan; el valor está en las combinaciones inesperadas con lift alto y soporte suficiente."},
 hp:[["min_support","El que controla la explosión combinatoria. Bájalo y el cálculo se dispara."],
   ["min_confidence","Filtro de fiabilidad de la regla."],
   ["min_lift","Por encima de 1 hay asociación real; por debajo, los productos se repelen."]],
 trampas:["Ordenar solo por lift: el lift es simétrico, así que mezcla direcciones fuertes y débiles del mismo par. La dirección la marca la confianza.",
   "Comparaciones múltiples: con cientos de pares evaluados, algunas reglas «significativas» son azar. Valida en otro periodo.",
   "Confundir asociación con causalidad: que se compren juntos no significa que uno provoque el otro; puede ser un tercer factor (la receta, la promoción).",
   "Soporte demasiado bajo: reglas basadas en 30 tickets de 900.000 no sostienen una decisión de lineal."],
 uso:"Requiere transformar a formato transaccional. El coste crece muy rápido al bajar el soporte: empieza alto y baja con cuidado.",
 y2026:"Técnica madura y estable. FP-Growth es más eficiente que Apriori para el mismo resultado y es lo que se usa a escala. El nicho se mantiene porque la salida es legible y accionable sin ciencia de datos de por medio."},

reco:{
 caso:{sector:"Streaming · Descubrimiento",
   sit:"Aumentar el consumo del catálogo largo, que hoy queda invisible frente a los 50 títulos más populares.",
   datos:"30 M de interacciones usuario-contenido, mayoritariamente implícitas (visto, abandonado, minuto de salida).",
   target:"Interacción futura.",
   metrica:"Recall@k y NDCG, más cobertura de catálogo y diversidad — que son objetivos de negocio contrapuestos a la precisión pura.",
   decision:"Qué se muestra en la portada de cada usuario.",
   impacto:"Optimizar solo precisión hunde la diversidad: el sistema recomienda lo popular y refuerza la burbuja. El diseño real siempre equilibra relevancia, diversidad y novedad, y eso es una decisión de producto, no de métrica."},
 hp:[["n_factors","Número de factores latentes. Más captura matices y sobreajusta antes."],
   ["Regularización","Imprescindible con matrices dispersas."],
   ["Feedback implícito vs explícito","Cambia el algoritmo: ALS con implícito, SVD con valoraciones."]],
 trampas:["Arranque en frío de usuario y de ítem: sin histórico no hay recomendación. Necesitas una estrategia de respaldo basada en contenido.",
   "Sesgo de popularidad: el sistema aprende que lo popular funciona y lo refuerza, matando el catálogo largo.",
   "Evaluar offline y asumir que se traslada online: la recomendación cambia el comportamiento que después mides. Solo un test A/B lo resuelve.",
   "Ignorar el bucle de retroalimentación: solo observas lo que ya recomendaste."],
 uso:"implicit, surprise o LightFM. Reentrenamiento frecuente. Servir requiere precalcular candidatos: no se computa en tiempo real desde cero.",
 y2026:"El estándar industrial es en dos fases: recuperación de candidatos con vectores (búsqueda por vecinos aproximados) y reordenación con un modelo más rico. La factorización matricial clásica sigue siendo una base sólida y una línea base obligatoria."},

topic:{
 caso:{sector:"Producto · Voz del cliente",
   sit:"120.000 respuestas abiertas de encuesta al año que nadie lee porque no hay capacidad humana.",
   datos:"Texto libre en español, longitud muy variable.",
   target:"No hay.",
   metrica:"Coherencia c_v y, sobre todo, validación humana: ¿los temas son nombrables?",
   decision:"Prioridades del roadmap de producto.",
   impacto:"Convierte texto muerto en agenda. El criterio de éxito no es la perplejidad: es si el equipo puede ponerle nombre a cada tema y reconocerlo. Un tema que nadie sabe nombrar es ruido estadístico."},
 hp:[["n_components","Número de temas. Barre un rango y elige por coherencia más lectura humana."],
   ["max_df / min_df","Limpieza de vocabulario: quita lo ubicuo y lo anecdótico. Impacta más que el ajuste del modelo."],
   ["learning_decay","Para el ajuste online."]],
 trampas:["Textos muy cortos: LDA necesita documentos con varias frases. Con tuits o respuestas de 5 palabras funciona mal.",
   "No preprocesar en español: sin lematización ni stopwords adecuadas, los temas salen dominados por partículas.",
   "Elegir el número de temas por perplejidad: correlaciona mal con lo interpretable que resulta.",
   "Confundirlo con el LDA discriminante de clasificación."],
 uso:"Preprocesado en español (spaCy) más vectorización por conteos. Reentrenamiento periódico. El entregable son los temas nombrados, no el modelo.",
 y2026:"Muy desplazado por enfoques basados en embeddings (agrupar vectores de frase y luego etiquetar los grupos, estilo BERTopic), que dan temas más coherentes y manejan textos cortos. LDA se mantiene por interpretabilidad probabilística y coste bajo."}

};

/* ══ CAPA PROFESIONAL — bloque 5 · PROBABILÍSTICO, SERIES, REFUERZO ══ */
var PRO5 = {

bayesnet:{
 caso:{sector:"Industria · Análisis de causa raíz",
   sit:"Una línea sufre paradas y nadie sabe si el problema es la materia prima, la humedad de nave, el turno o el mantenimiento.",
   datos:"3 años de registros de proceso, calidad, incidencias y condiciones ambientales.",
   target:"Parada no programada.",
   metrica:"Verosimilitud y BIC del grafo; validación del grafo por los ingenieros de planta.",
   decision:"Dónde intervenir para reducir paradas.",
   impacto:"Un boosting diría «la humedad predice la parada». La red bayesiana permite preguntar al revés: dada una parada con esta materia prima, ¿cuál es la causa más probable? Y permite simular: si controlo la humedad, ¿cuánto bajan las paradas? Ningún modelo puramente predictivo responde eso."},
 hp:[["Estructura del grafo","La decisión central. Puede aprenderse de datos (hill climbing, PC) o imponerse con conocimiento experto — normalmente lo segundo funciona mejor."],
   ["Estimador de parámetros","Máxima verosimilitud o bayesiano con priors; el bayesiano es más estable con pocos datos."],
   ["scoring","BIC o K2 para el aprendizaje de estructura."]],
 trampas:["Aprender la estructura solo de datos y presentarla como causal: la correlación no fija la dirección de las flechas. Hace falta conocimiento de dominio o intervención.",
   "Discretizar mal las variables continuas: los cortes cambian por completo las conclusiones.",
   "Explosión de tablas de probabilidad condicional: un nodo con 5 padres de 4 estados necesita 1.024 parámetros.",
   "Confundir la red con un diagrama causal validado: solo lo es si está construida con supuestos causales explícitos."],
 uso:"pgmpy o bnlearn. Suele requerir discretización. El valor está en la construcción conjunta con expertos, no en el ajuste automático.",
 y2026:"La IA causal ha ganado tracción en la industria precisamente por esta capacidad de responder «¿y si…?». Sigue siendo una competencia poco común y por eso muy diferencial."},

hmm:{
 caso:{sector:"Gestión de activos",
   sit:"Un fondo quiere detectar en qué régimen de mercado está (calma, transición, estrés) para ajustar la exposición.",
   datos:"15 años de retornos diarios y volatilidad de varios índices.",
   target:"No observable: el régimen es latente por definición.",
   metrica:"Verosimilitud, BIC, y coherencia de los regímenes detectados con episodios históricos conocidos.",
   decision:"Ajuste de exposición y de cobertura.",
   impacto:"Un clustering sobre los puntos daría saltos erráticos día a día. El HMM modela la probabilidad de transición, así que entiende que los regímenes persisten: eso produce señales estables sobre las que se puede operar sin rotar la cartera cada jornada."},
 hp:[["n_components","Número de regímenes. En mercados, 2-4; más se vuelve ininterpretable."],
   ["covariance_type","'diag' o 'full' según variables y datos disponibles."],
   ["n_iter","Baum-Welch necesita iteraciones suficientes para converger."],
   ["init_params","La inicialización importa: prueba varias semillas."]],
 trampas:["Sobreajustar el número de estados hasta que la historia encaje: siempre puedes explicar el pasado con más estados.",
   "Interpretar los estados sin validarlos contra eventos conocidos.",
   "Usarlo para predecir el futuro del mercado: detecta el régimen actual, que no es lo mismo que anticipar el siguiente.",
   "Ignorar que el etiquetado de estados no es identificable: el estado 0 de una ejecución puede ser el 2 de la siguiente."],
 uso:"hmmlearn. Estandariza. El entregable es la secuencia de regímenes, que suele consumirse como capa sobre un dashboard.",
 y2026:"Vigente en finanzas cuantitativas, biología computacional y análisis de comportamiento. Los modelos de espacio de estados bayesianos son la evolución natural cuando hace falta incertidumbre."},

arima:{
 caso:{sector:"Retail · Planificación financiera",
   sit:"Cerrar el presupuesto del próximo trimestre con una previsión de ventas defendible ante dirección.",
   datos:"6 años de ventas mensuales agregadas.",
   target:"Ventas mensuales (€).",
   metrica:"MAPE y MAE, más el análisis de residuos: si no son ruido blanco, queda estructura sin capturar.",
   decision:"Presupuesto y objetivos comerciales del trimestre.",
   impacto:"Su valor en un comité es que se puede explicar y auditar: cada componente tiene significado y los intervalos de predicción salen de la teoría, no de una simulación opaca. Sigue siendo la línea base obligatoria de cualquier proyecto de previsión."},
 hp:[["p, d, q","El orden. d por test de estacionariedad (ADF, KPSS); p y q por ACF/PACF o por búsqueda automática."],
   ["trend","Constante, tendencia o ninguna, según el comportamiento de la serie."]],
 trampas:["No comprobar la estacionariedad antes de fijar d: es el primer paso, no un detalle.",
   "No revisar los residuos. Si el test de Ljung-Box los rechaza como ruido blanco, el modelo está incompleto.",
   "Validar con split aleatorio: en series es siempre validación temporal hacia delante.",
   "Extrapolar muchos periodos: el intervalo se ensancha rápido y a partir de cierto horizonte la previsión no informa."],
 uso:"statsmodels, o statsforecast (Nixtla) con AutoARIMA si tienes muchas series: es órdenes de magnitud más rápido que pmdarima. Modelo minúsculo. Reentrenar con cada nueva observación es barato.",
 y2026:"Sigue siendo la referencia interpretable y la línea base contra la que se mide todo lo demás. Los modelos fundacionales de series le ganan en muchos casos sin entrenar, pero no dan la explicación que un comité financiero pide."},

sarima:{
 caso:{sector:"Turismo · Planificación de plantilla",
   sit:"Un grupo hotelero dimensiona plantilla con 3 meses de antelación y la ocupación tiene un patrón anual muy marcado.",
   datos:"8 años de ocupación mensual por establecimiento.",
   target:"Ocupación mensual (%).",
   metrica:"MAPE por temporada — el error en agosto y el error en febrero no cuestan lo mismo.",
   decision:"Contratación de temporada y calendario de cierres.",
   impacto:"En hostelería la estacionalidad no es ruido, es la señal principal. Un ARIMA sin componente estacional predice la media y falla justo en los picos, que es donde se gana o se pierde el año."},
 hp:[["P, D, Q, s","El bloque estacional. s es el número de periodos por ciclo: 12 mensual, 7 diario con patrón semanal."],
   ["D","Diferenciación estacional. Normalmente 0 o 1; más rara vez es correcto."]],
 trampas:["Confundir s con el número de ciclos disponibles. s es la longitud del ciclo.",
   "Sobrediferenciar: con d=1 y D=1 puedes estar quitando más estructura de la que hay.",
   "Necesitas al menos 2-3 ciclos completos para estimar la estacionalidad; con 18 meses de datos mensuales no hay base.",
   "Ignorar la Semana Santa, que es móvil y rompe el patrón mensual fijo."],
 uso:"SARIMAX con seasonal_order. Más lento que ARIMA. Revisa siempre plot_diagnostics.",
 y2026:"Vigente y suficiente para la mayoría de series de negocio con estacionalidad clara. Prophet es más cómodo con festivos móviles y múltiples estacionalidades."},

sarimax:{
 caso:{sector:"Energía · Comercialización",
   sit:"Prever la demanda eléctrica sabiendo que depende fuertemente de la temperatura y del calendario laboral.",
   datos:"5 años horarios de demanda, temperatura, festivos y laborabilidad.",
   target:"Demanda horaria (MWh).",
   metrica:"MAPE y significatividad de los regresores exógenos.",
   decision:"Compra en mercado y estrategia de cobertura.",
   impacto:"Permite simular escenarios: «si la ola de calor sube 3 °C la media, ¿cuánta demanda extra?». Esa capacidad de responder condicionalmente es lo que lo separa de una previsión ciega."},
 hp:[["exog","La decisión central: qué variables externas y, sobre todo, si estarán disponibles a futuro."],
   ["order + seasonal_order","Como en SARIMA."]],
 trampas:["Usar exógenas que no conocerás en el futuro. Si necesitas la temperatura de dentro de 6 meses, tendrás que predecirla y arrastrarás su error.",
   "Meter exógenas colineales entre sí: los coeficientes dejan de ser interpretables.",
   "Confundir exógena con variable dependiente rezagada: eso es autorregresión y ya está en el modelo.",
   "Olvidar que forecast() exige pasar exog para todo el horizonte."],
 uso:"Requiere alinear cuidadosamente las exógenas y garantizar su disponibilidad futura. Es lo que más proyectos rompe.",
 y2026:"El manejo de covariables es justamente donde los modelos fundacionales de series han avanzado en 2026 (Chronos-2 incorpora soporte multivariante y de covariables), lo que empieza a competir directamente con este nicho."},

prophet:{
 caso:{sector:"E-commerce · Operaciones",
   sit:"Prever tráfico y pedidos diarios para dimensionar atención al cliente y almacén, con campañas y festivos por medio.",
   datos:"4 años diarios con histórico de campañas y calendario de festivos de España.",
   target:"Pedidos diarios.",
   metrica:"MAPE con validación deslizante (cross_validation de Prophet).",
   decision:"Turnos de atención al cliente y refuerzo de almacén.",
   impacto:"Su ventaja operativa es que absorbe festivos móviles, múltiples estacionalidades (semanal y anual a la vez) y huecos de datos sin trabajo de preparación. Un equipo pequeño tiene previsión decente en un día, no en un mes."},
 hp:[["changepoint_prior_scale","El más influyente. Alto = tendencia más flexible y más riesgo de sobreajuste; bajo = más rígida."],
   ["seasonality_mode","'additive' o 'multiplicative' según si los picos crecen con el nivel."],
   ["holidays","Añade el calendario del país. En España, add_country_holidays('ES')."],
   ["seasonality_prior_scale","Regula cuánto se ajusta a la estacionalidad."]],
 trampas:["Dejar changepoint_prior_scale por defecto y aceptar la tendencia sin mirarla: es el parámetro que más cambia la previsión a futuro.",
   "Series muy cortas: necesita al menos un par de ciclos.",
   "Confiar en sus intervalos como si fueran exactos: son una aproximación, no una garantía de cobertura.",
   "No incluir campañas propias como regresores o festivos: el modelo interpretará picos de promoción como estacionalidad."],
 uso:"Formato ds/y obligatorio. Tolera huecos y outliers. Rápido de arrancar; el ajuste fino es donde está el trabajo.",
 y2026:"Sigue siendo muy usado en equipos pequeños por su relación resultado/esfuerzo. La competencia real ahora son los modelos fundacionales, que dan previsión sin ajuste ninguno."},

hw:{
 caso:{sector:"Distribución · Reposición",
   sit:"Prever la demanda de 12.000 referencias, donde no hay tiempo para ajustar un modelo por SKU.",
   datos:"3 años de ventas semanales por referencia.",
   target:"Unidades semanales por SKU.",
   metrica:"MAE agregado y % de SKU donde bate a la media móvil.",
   decision:"Cantidad de reposición semanal por referencia.",
   impacto:"A 12.000 series, lo que importa no es el mejor modelo por serie sino un método robusto que corra desatendido para todas. Holt-Winters ajusta en milisegundos por serie y es sorprendentemente difícil de batir en horizontes cortos."},
 hp:[["trend / seasonal","'add' o 'mul'. Multiplicativa si la amplitud crece con el nivel."],
   ["seasonal_periods","Longitud del ciclo."],
   ["damped_trend","Muy recomendable: evita que la tendencia se extrapole indefinidamente, que es un fallo clásico."]],
 trampas:["Tendencia sin amortiguar en horizontes largos: proyecta crecimiento infinito.",
   "Estacionalidad multiplicativa con ceros en la serie: matemáticamente falla.",
   "Aplicarlo a series intermitentes (muchas semanas a cero): ahí el método adecuado es Croston, no Holt-Winters."],
 uso:"statsmodels. Requiere serie regular sin huecos. Ligerísimo: miles de series en segundos.",
 y2026:"Sigue siendo la línea base que hay que batir en previsión a escala. En competiciones de forecasting, los métodos estadísticos simples bien aplicados siguen siendo competitivos frente a modelos mucho más complejos."},

bandit:{
 caso:{sector:"E-commerce · Optimización de conversión",
   sit:"Probar 5 versiones de la ficha de producto sin quemar tráfico durante semanas en las variantes perdedoras.",
   datos:"Tráfico en vivo, unos 40.000 visitantes diarios.",
   target:"Conversión.",
   metrica:"Regret acumulado y conversión total del periodo, no solo la de la ganadora.",
   decision:"Qué variante servir a cada visitante, ahora.",
   impacto:"Un A/B clásico con 5 variantes manda el 80% del tráfico a versiones que probablemente pierden, durante todo el test. El bandit desplaza tráfico hacia lo que funciona mientras aprende. En picos de campaña esa diferencia es dinero real."},
 hp:[["Algoritmo","Thompson sampling suele ser el mejor por defecto; UCB es más conservador; ε-greedy es el más simple de explicar."],
   ["epsilon","Solo en ε-greedy: fracción de exploración."],
   ["Ventana temporal","Si la conversión cambia con el tiempo, necesitas olvido o el bandit se queda anclado al pasado."]],
 trampas:["Usarlo cuando necesitas un p-valor limpio para un comité: la asignación adaptativa complica la inferencia clásica.",
   "Efectos con retardo: si la conversión ocurre días después, el bandit aprende con información incompleta y sesgada.",
   "No controlar el efecto novedad: una variante nueva puede subir solo por ser nueva.",
   "Olvidar que exige infraestructura en vivo: no es un análisis offline."],
 uso:"Requiere integración con el servidor de contenidos y registro fiable de recompensa. Empieza con Thompson beta-bernoulli, que son 10 líneas.",
 y2026:"Los bandits contextuales (que eligen según el perfil del visitante) son el estándar en personalización a escala. Es la puerta de entrada realista al refuerzo en una empresa normal."},

qlearning:{
 caso:{sector:"Formación · Simulación de inventario",
   sit:"Aprender una política de reposición en un entorno simulado con demanda estocástica, costes de almacenamiento y de rotura.",
   datos:"Simulador, no datos históricos.",
   target:"Recompensa acumulada (margen menos costes).",
   metrica:"Recompensa media por episodio frente a la política heurística actual.",
   decision:"Regla de reposición: cuánto pedir en cada nivel de stock.",
   impacto:"Su valor didáctico es enorme: la Q-table se puede imprimir y leer fila a fila, así que ves exactamente qué ha aprendido el agente. En refuerzo, esa transparencia desaparece en cuanto pasas a redes."},
 hp:[["alpha","Ritmo de aprendizaje."],
   ["gamma","Descuento del futuro. Alto valora el largo plazo; 0 lo ignora."],
   ["epsilon + decaimiento","Exploración inicial alta que baja con el tiempo."],
   ["Nº de episodios","Necesita muchísimos para converger."]],
 trampas:["Espacio de estados grande: la tabla no cabe y hay que discretizar, perdiendo información.",
   "Recompensa mal diseñada: el agente optimiza literalmente lo que le pides, no lo que querías pedirle. Es el fallo central del refuerzo.",
   "Epsilon fijo: sin decaimiento nunca deja de explorar y no converge.",
   "Aplicarlo sin simulador fiable: si el simulador no refleja la realidad, la política aprendida no sirve."],
 uso:"Necesita entorno simulado (gymnasium). Solo con estados discretos y pocos. En producción, se despliega la política, no el proceso de aprendizaje.",
 y2026:"Base conceptual imprescindible del refuerzo. En problemas reales de empresa, casi siempre hay que subir a aproximación por función."},

dqn:{
 caso:{sector:"Energía · Gestión de almacenamiento",
   sit:"Decidir cuándo cargar y descargar una batería industrial según el precio horario, la demanda y la generación renovable propia.",
   datos:"Simulador construido sobre 3 años de precios y generación reales.",
   target:"Beneficio acumulado.",
   metrica:"Beneficio por episodio frente a la regla heurística (cargar barato, descargar caro).",
   decision:"Acción horaria: cargar, descargar o mantener.",
   impacto:"Es un problema secuencial genuino: cargar ahora limita lo que puedes hacer después. Un modelo predictivo del precio no resuelve la decisión; hace falta optimizar la secuencia completa. Y la comparación obligatoria es contra la heurística: si no la bate claramente, no compensa la complejidad."},
 hp:[["buffer_size","Tamaño del replay. Grande estabiliza."],
   ["target_update_interval","Cada cuánto se sincroniza la red objetivo."],
   ["learning_rate","Muy sensible; el refuerzo es notoriamente inestable."],
   ["exploration_fraction","Cuánta parte del entrenamiento se dedica a explorar."]],
 trampas:["Alta varianza entre semillas: dos entrenamientos idénticos dan resultados distintos. Reporta siempre varias semillas, nunca la mejor.",
   "No comparar contra una heurística simple: en energía y logística, las reglas de negocio son competidoras muy duras.",
   "Simulador poco fiel: la política se explota los fallos del simulador, no la realidad.",
   "Acciones continuas: DQN solo maneja discretas. Discretizar mal degrada mucho."],
 uso:"stable-baselines3 más un entorno gymnasium propio. Requiere GPU y muchas horas. Despliegue: solo la política entrenada, con salvaguardas duras.",
 y2026:"Fuera de simuladores y videojuegos, la adopción industrial sigue siendo limitada por el coste de construir un simulador fiable. Donde existe (energía, logística, control), aporta valor real."},

ppo:{
 caso:{sector:"IA · Alineamiento de modelos",
   sit:"Ajustar un modelo de lenguaje para que sus respuestas se ajusten al tono y las políticas de la compañía.",
   datos:"Preferencias humanas comparando pares de respuestas.",
   target:"Recompensa según el modelo de preferencias.",
   metrica:"Recompensa media y divergencia KL respecto al modelo original — si se aleja demasiado, degenera.",
   decision:"Qué versión del modelo se despliega.",
   impacto:"Fue el mecanismo del RLHF que hizo utilizables a los primeros asistentes conversacionales (2022-2023). Hoy, en LLMs, se sustituye a menudo por GRPO (una variante de PPO sin red crítica, popularizada por DeepSeek-R1) o por DPO. Fuera de los LLMs, PPO sigue siendo el algoritmo por defecto en robótica y control continuo por su estabilidad."},
 hp:[["clip_range","El corazón del método. 0,2 es el estándar; más alto desestabiliza."],
   ["n_steps + batch_size","Cuánta experiencia se recoge antes de cada actualización."],
   ["gae_lambda","Compromiso entre sesgo y varianza en la estimación de ventaja."],
   ["ent_coef","Bonificación de entropía: mantiene exploración y evita colapso de política."]],
 trampas:["Colapso de política: si deja de explorar, se ancla en algo mediocre. Vigila la entropía.",
   "Recompensa mal especificada: el agente encuentra atajos que la maximizan sin resolver el problema (reward hacking).",
   "Comparar con una sola semilla.",
   "Aplicar refuerzo donde el problema no es secuencial: si cada decisión es independiente, sobra todo esto."],
 uso:"stable-baselines3. Necesita entorno vectorizado y GPU. Muchísima experiencia de entrenamiento.",
 y2026:"Estándar consolidado en control. En LLMs, el post-entrenamiento de 2025-2026 se apoya en GRPO y en refuerzo con recompensas verificables (RLVR: respuestas comprobables, como código que pasa tests o problemas con solución conocida), además de DPO para preferencias. Todos heredan la idea clave de PPO: limitar cuánto cambia la política en cada paso."},

automl:{
 caso:{sector:"Consultoría · Arranque de proyecto",
   sit:"Hay que decir en 48 horas si un problema de negocio es abordable con datos antes de comprometer un proyecto de 3 meses.",
   datos:"El dataset que el cliente tenga disponible.",
   target:"El que corresponda.",
   metrica:"La de la tarea, medida sobre un split honesto.",
   decision:"Seguir adelante con el proyecto o parar.",
   impacto:"Su valor no es el modelo final, es la respuesta rápida a «¿hay señal aquí?». Si el mejor modelo de 15 candidatos da un AUC de 0,55, la conversación con el cliente cambia por completo, y llegar a esa conclusión en un día en vez de en un mes vale mucho dinero."},
 hp:[["Presupuesto de tiempo","El principal: cuánto le dejas buscar."],
   ["Estrategia de validación","Crítico: si tus datos son temporales o por grupos, hay que configurarlo o el resultado es fantasía."],
   ["Espacio de modelos","Restringe a lo que puedas mantener en producción."]],
 trampas:["Aceptar el split por defecto con datos temporales o agrupados: el leakage es silencioso y el resultado, optimista.",
   "Confundir automatizar la búsqueda con automatizar el criterio: AutoML no sabe si tu target está bien definido ni si hay fuga de información.",
   "Llevar a producción un ensemble enorme e inexplicable solo porque ganó por 0,003 de AUC.",
   "No comparar con una línea base trivial: a veces la moda de la clase mayoritaria ya está cerca."],
 uso:"AutoGluon, FLAML o H2O. PyCaret 3.x da problemas con Python 3.12+ y NumPy 2 (la 4.0 está en reconstrucción) y auto-sklearn está prácticamente sin mantenimiento. Configura bien la validación antes de nada. Trátalo como brújula, no como destino.",
 y2026:"El AutoML clásico convive ahora con agentes de ciencia de datos basados en LLM que escriben y ejecutan el pipeline completo. En ambos casos el criterio profesional sigue siendo el cuello de botella: la herramienta optimiza la métrica que le des, incluida una mal planteada."}

};


/* ══════════════════════════════════════════════════════════════
   EN PALABRAS SENCILLAS — una analogía + un ejemplo con números
   por modelo. Es lo primero que se lee en la vista de estudio,
   antes de la idea técnica: primero intuición, luego mecanismo.
   ══════════════════════════════════════════════════════════════ */
var SIMPLE = {
linsimple:"Imagina que apuntas cada semana cuánto gastas en publicidad y cuánto vendes, y trazas con una regla la línea que mejor pasa entre los puntos. Eso es todo. Si la línea dice <b>ventas = 2.000 + 3 × publicidad</b>, cada euro extra en anuncios va asociado a 3 € más de ventas (asociado, que no es lo mismo que causado).",
linmult:"La misma regla, pero mirando varias cosas a la vez. Como un tasador que dice: «el piso parte de 50.000 €, cada m² suma 2.500 € y cada baño 12.000 €». Si comparas dos pisos iguales en todo salvo un baño, la diferencia que predice el modelo es exactamente ese coeficiente: <b>12.000 €</b>.",
ridge:"Una regresión lineal con freno de mano: no deja que ningún coeficiente se dispare. Sirve cuando dos variables cuentan casi la misma historia (TV y digital, que siempre se lanzan juntas): en vez de darle <b>+50 a una y −45 a la otra</b>, Ridge reparte algo razonable, por ejemplo <b>+3 y +2</b>.",
lasso:"Una regresión que hace limpieza: si una variable no aporta lo suficiente, le pone el coeficiente a <b>cero</b> y la saca del modelo. Como hacer la maleta con límite de peso: solo entra lo imprescindible. De 80 variables candidatas puede quedarse con 6.",
elastic:"Un mezclador entre Ridge (frenar) y Lasso (eliminar). Si tienes 5 variables que miden lo mismo, Lasso se queda con una casi al azar; Elastic Net tiende a quedarse con las 5 con pesos pequeños. Así tu lista de «variables importantes» no cambia cada vez que reentrenas.",
poisson:"Para <b>contar</b> cosas: pedidos por hora, siniestros al año, visitas al día. Un conteo nunca es negativo y, cuanto mayor es la media, más varía. Poisson respeta las dos cosas. Se lee en porcentajes: un coeficiente con e<sup>β</sup> = 1,20 significa «un 20% más de eventos».",
quantile:"En vez de preguntar «¿cuánto venderé de media?», pregunta «¿qué cifra no superaré el 90% de los días?». Si la media diaria es 100 unidades pero el percentil 90 es 140, para no quedarte sin stock 9 de cada 10 días necesitas <b>140</b>, no 100.",
bayesridge:"Una regresión que, además del número, te dice cuánto se fía de él. «Predigo un 72% de rendimiento <b>± 4 puntos</b>» si tiene muchos datos parecidos; «72% <b>± 15</b>» si tiene pocos. Esa barra de error es lo que te dice si puedes decidir ya o necesitas más pruebas.",
gp:"Imagina que dibujas todas las curvas posibles que pasan cerca de tus pocos puntos. Donde tienes datos, todas coinciden (poca duda); lejos de ellos, se abren en abanico (mucha duda). El GP te da la curva media y ese abanico, así que sabes <b>dónde conviene medir a continuación</b>. Pruébalo en su laboratorio: haz clic para añadir puntos.",
svr:"Pon un <b>tubo</b> alrededor de la línea de predicción: los puntos que caen dentro no cuentan como error, solo los que se salen. Con un tubo de ±0,5 °C, fallar por 0,3 da igual; fallar por 2 se penaliza. Con kernel, el tubo puede curvarse.",
gbr:"Un equipo trabajando en cadena: el primero hace una estimación burda, el segundo solo intenta corregir lo que falló el primero, el tercero corrige lo que queda… Ejemplo: árbol 1 predice 200.000 € (real: 230.000); árbol 2 aprende a sumar unos +25.000; árbol 3 afina los 5.000 restantes. Tras cientos de pasos pequeños, el conjunto afina muchísimo.",
logistica:"Coge una puntuación como la de la regresión lineal y la pasa por una <b>curva en S</b> que la convierte en probabilidad entre 0 y 1: «este socio tiene un <b>78%</b> de probabilidad de darse de baja». Después eres tú quien decide a partir de qué porcentaje le llamas (el umbral). Juega con ese umbral en su laboratorio.",
arbol:"Un «¿Quién es quién?» con preguntas de sí o no: «¿lleva menos de 6 meses? → ¿ha abierto más de 2 tickets? → probablemente se va». Cada pregunta se elige para separar lo mejor posible a los que se van de los que se quedan. Si le dejas hacer demasiadas preguntas, acaba memorizando a cada cliente.",
rf:"Preguntar a 500 expertos que han estudiado cosas un poco distintas y quedarte con lo que vota la mayoría. Cada árbol se equivoca a su manera y, al votar, los errores se compensan. Si 380 de 500 árboles dicen «impago», la probabilidad estimada ronda el <b>76%</b>.",
extratrees:"Como Random Forest, pero cada árbol, en vez de buscar el mejor corte («¿edad &lt; 37,5?»), elige un corte <b>al azar</b> dentro del rango. Parece peor, pero al promediar cientos de árboles el azar se compensa y ahorras mucho tiempo de cálculo.",
xgboost:"El «equipo en cadena» del gradient boosting, pero con un entrenador exigente: castiga los árboles demasiado complicados y está optimizado para ir muy rápido. Por eso es el primer candidato serio en casi cualquier tabla grande de datos (lo que en la empresa sería «un Excel enorme»).",
lightgbm:"El mismo boosting con dos atajos: agrupa los valores en «cajones» (en vez de probar 10.000 edades distintas, prueba unos 255 rangos) y hace crecer primero la rama que más mejora. Resultado: mucho más rápido con millones de filas, con la misma precisión.",
catboost:"Un boosting que entiende las categorías («Madrid», «Tarifa Plus», «Canal web») sin que tengas que convertirlas a números a mano, y lo hace sin «hacer trampa» mirando la respuesta. Ideal para datos de CRM llenos de columnas de texto categórico.",
adaboost:"Un profesor que, tras cada examen, dedica más atención a los ejercicios que los alumnos fallaron. Cada nuevo modelo se centra en los casos difíciles del anterior. Funciona bien con datos limpios; si hay ejercicios mal corregidos (etiquetas erróneas), se obsesiona con ellos.",
svmlin:"Separar dos grupos con la <b>carretera más ancha posible</b> entre ellos. Solo importan los puntos que están en el arcén (los vectores de soporte); los que están lejos no cambian nada. Una frontera con mucho margen se equivoca menos con casos nuevos.",
svmker:"Si en el suelo no puedes separar con una línea recta las canicas rojas del centro de las azules de alrededor, <b>levanta</b> las del centro en el aire: desde arriba, una lámina horizontal las separa. El kernel hace ese «levantar» con matemáticas, sin calcularlo de forma explícita. Míralo en el laboratorio 3D.",
knn:"«Dime con quién andas y te diré quién eres». Para clasificar a un cliente nuevo, busca los 15 clientes históricos más parecidos y mira qué hicieron: si 11 de los 15 compraron, predice «compra» con un <b>73%</b>.",
nb:"Un detector de spam que ha contado qué palabras aparecen más en el spam («gratis», «premio») y cuáles en el correo normal, y suma las pistas como si fueran independientes entre sí. Es una simplificación, pero para decidir «spam o no» funciona sorprendentemente bien y es instantáneo.",
lda:"Busca el ángulo desde el que mirar tus datos para que los grupos se vean <b>lo más separados posible</b>. Como buscar la foto en la que dos gemelos se distinguen mejor. Ese ángulo sirve a la vez para clasificar y para dibujar los datos en 2D.",
qda:"Como LDA, pero acepta que cada grupo tenga su propia «forma»: uno compacto y otro muy disperso. La frontera entre ellos puede ser entonces una curva en lugar de una recta. A cambio, necesita más datos por grupo para estimar bien esas formas.",
cox:"No pregunta «¿se irá el cliente?», sino «<b>¿cuándo</b> se irá y qué acelera o frena su salida?». Un hazard ratio de 1,8 para «sin permanencia» significa que, en cualquier mes, esos clientes se van a un ritmo 1,8 veces mayor. Y aprovecha a los que siguen activos: sabemos que han aguantado al menos hasta hoy.",
uplift:"No busca a quién le gusta la oferta, sino a quién le hace <b>cambiar de opinión</b>. Hay cuatro tipos de cliente: los que compran siempre (no gastes), los que nunca compran (no gastes), los persuadibles (¡a por ellos!) y los que se molestan y se van (evítalos).",
propensity:"Si no hiciste un experimento, intentas fabricarlo a posteriori: para cada tienda donde subiste el precio buscas una «gemela» donde no lo subiste, y comparas. Diff-in-Diff compara cuánto cambió cada grupo antes y después, para descontar lo que habría pasado igualmente.",
mlp:"Una cadena de capas de pequeñas calculadoras: cada una combina lo que le llega y decide cuánto «activarse». Las primeras capas detectan patrones simples y las siguientes los combinan en otros más complejos. Aprende ajustando miles de diales poco a poco hasta que el error baja (descenso de gradiente: míralo en su laboratorio).",
cnn:"Una lupa que recorre la foto buscando patrones pequeños (bordes, esquinas); luego otra lupa sobre esos patrones buscando formas (ruedas, ojos), y así hasta reconocer objetos. La misma lupa sirve para toda la foto: un gato es un gato esté arriba o abajo.",
rnn:"Lee los datos en orden, como tú lees una frase, y lleva una <b>libreta de notas</b> que actualiza en cada paso. La LSTM añade reglas para decidir qué apuntar, qué borrar y qué consultar de la libreta, para no olvidar lo importante de hace muchos pasos.",
transformer:"En vez de leer palabra por palabra, mira toda la frase a la vez y, para cada palabra, decide a cuáles otras <b>prestar atención</b>. En «el banco estaba lleno de peces», «banco» presta atención a «peces» y entiende que es el del río, no el del dinero.",
autoenc:"Como resumir un libro en una página y luego intentar reescribir el libro solo con ese resumen. Si ha aprendido a resumir transacciones normales, una fraudulenta se reconstruye mal: ese «no me sale» es la alarma.",
rbm:"Una red de dos capas que intenta descubrir qué «gustos ocultos» explican lo que observas (por ejemplo, qué películas ve alguien). Hoy casi no se usa: su interés es entender de dónde vienen los modelos generativos modernos.",
som:"Un tablero de casillas donde cada casilla representa un perfil tipo, y los perfiles parecidos quedan en casillas vecinas. Como colocar a los jugadores en un tablero de ajedrez de forma que los que juegan parecido queden al lado.",
kmeans:"Clavas K chinchetas al azar en el mapa, cada cliente se apunta a la más cercana, cada chincheta se mueve al centro de sus clientes, y repites hasta que nadie cambia de chincheta. Tú decides K; el algoritmo decide quién va con quién. Míralo paso a paso en 3D en su laboratorio.",
kmedoids:"Como K-Means, pero la chincheta tiene que clavarse siempre <b>encima de un cliente real</b>. Así el representante de cada grupo es una persona concreta que puedes enseñar en una reunión, y un millonario atípico no arrastra el centro a un sitio vacío.",
jerarquico:"Construye un árbol genealógico de tus datos: primero junta a los dos más parecidos, luego a los siguientes, y así hasta tener una única familia. Después decides a qué altura «cortar» el árbol para quedarte con 3, 4 o 7 grupos.",
dbscan:"Agrupa por <b>multitudes</b>: si un punto tiene al menos 5 vecinos cerca, está en una multitud, y la multitud crece contagiando a sus vecinos. Los puntos solitarios no son de nadie: son ruido. No hace falta decirle cuántos grupos hay.",
gmm:"Supone que los datos son la mezcla de varias «campanas» (distribuciones normales) y averigua dónde está cada una. A cada cliente le da un porcentaje de pertenencia: «<b>70% ahorrador, 30% inversor</b>», en lugar de una etiqueta única.",
pca:"Buscar la mejor foto en 2D de un objeto en 3D: el ángulo que más información conserva. Con 40 variables, PCA encuentra 3 o 4 direcciones nuevas que resumen casi todo; por ejemplo, un «tamaño de cliente» que combina gasto, frecuencia y antigüedad.",
tsne:"Un mapa para <b>mirar</b>, no para medir: coloca juntos en 2D los puntos que eran vecinos en 40 dimensiones. Sirve para enseñar que los segmentos existen, pero las distancias entre grupos y sus tamaños en el mapa no significan nada.",
umap:"Como t-SNE, pero más rápido, algo más fiel a la estructura general y capaz de colocar datos nuevos en el mapa ya hecho. Es el estándar para visualizar embeddings (vectores que representan textos o clientes).",
iforest:"Juega a <b>aislar</b> cada punto con cortes al azar. A un punto normal, rodeado de otros, le cuesta muchos cortes quedarse solo; a uno raro, apartado, le bastan 2 o 3. Pocos cortes = sospechoso. Pruébalo haciendo clic en su laboratorio.",
lof:"Compara lo aislado que está un punto con lo aislados que están sus vecinos. Tener pocos vecinos en el campo es normal; tenerlos en el centro de Madrid es raro. Detecta lo raro <b>en su contexto</b>.",
apriori:"Lee miles de tickets y encuentra reglas como «quien compra nachos, compra salsa». Tres números: <b>soporte</b> (en qué % de tickets pasa), <b>confianza</b> (de los que compran nachos, qué % compra salsa) y <b>lift</b> (cuántas veces más de lo que pasaría por casualidad).",
reco:"Si tú y Ana habéis visto 20 series en común y a Ana le encantó una que tú aún no has visto, esa es tu recomendación. No necesita saber de qué trata la serie: solo el patrón de quién ve qué.",
contentbased:"Recomienda por parecido de ficha: si te gustó una película de «espacio, astronautas, supervivencia», te recomienda otras cuyas descripciones compartan esas palabras. Funciona desde el primer día con un producto nuevo, porque solo necesita su descripción.",
topic:"Lee miles de reseñas y descubre por sí solo de qué temas se habla («envío», «precio», «atención al cliente») sin que tú se los digas. Cada reseña queda como una mezcla: <b>60% envío, 30% precio, 10% otros</b>.",
bayesnet:"Un diagrama de flechas «qué influye en qué» (lluvia → tráfico → retraso) con probabilidades en cada flecha. Permite razonar en los dos sentidos: si hay retraso, ¿qué probabilidad hay de que haya llovido?",
hmm:"Como adivinar el humor de alguien (oculto) solo por lo que hace (visible). El mercado está en «calma» o en «estrés» (no lo ves) y solo ves cómo se mueven los precios. El modelo deduce el estado más probable en cada momento, sabiendo que los estados tienden a durar.",
arima:"Predice una serie con su propio pasado: lo de hoy se parece a lo de ayer (AR), se corrige con los errores recientes (MA) y, antes de nada, se quita la tendencia restando valores consecutivos (I). Algo como: <b>ventas de hoy ≈ 0,7 × ventas de ayer + ajuste por el error de ayer</b>.",
sarima:"ARIMA con memoria de calendario: para predecir diciembre mira también el <b>diciembre del año pasado</b>, no solo noviembre. Imprescindible cuando hay picos que se repiten cada semana o cada año.",
sarimax:"SARIMA más «palancas» externas: precio, promociones, temperatura, festivos. Permite preguntar «¿y si hago promoción esa semana?». La condición: tienes que conocer (o fijar tú) el valor futuro de esas palancas.",
prophet:"Descompone la serie como un Lego: <b>tendencia</b> (hacia dónde va) + patrón semanal + patrón anual + efecto de los festivos. Ajusta cada pieza y luego las suma. Muy cómodo para negocio porque cada pieza se puede enseñar en un gráfico.",
hw:"Una media que da más peso a lo reciente: lo de la semana pasada pesa mucho y lo de hace 6 meses casi nada. Lo hace por separado para el nivel, la tendencia y la estacionalidad. Rápido y difícil de batir a corto plazo.",
bandit:"Tienes 3 tragaperras y no sabes cuál paga más. Juegas un poco en todas y, a medida que ves cuál va mejor, juegas más en esa, sin dejar del todo de probar las otras. Así pierdes menos dinero aprendiendo que repartiendo 33/33/33 hasta el final. Míralo en su laboratorio.",
qlearning:"Un agente que rellena una tabla «situación × acción → cuánto ganaré a la larga» a base de probar. Como aprender el camino más rápido al trabajo: cada día actualizas la nota de cada ruta con lo que has tardado.",
sarsa:"Como Q-Learning, pero el agente aprende teniendo en cuenta sus propios despistes: si sabe que a veces explora al azar, evita caminar <b>pegado al borde del acantilado</b> aunque sobre el papel sea el camino más corto.",
dqn:"Q-Learning cuando la tabla sería gigantesca (millones de situaciones): en vez de una tabla, una red neuronal estima el valor de cada acción. Así generaliza a situaciones parecidas que nunca vio exactamente.",
ppo:"En vez de puntuar acciones, aprende directamente la estrategia («en esta situación, 70% acelerar y 30% frenar»), pero con una regla de prudencia: en cada actualización <b>no puede cambiar demasiado</b> respecto a la anterior, para no estropear lo ya aprendido.",
automl:"Un asistente que prueba por ti 15 modelos y cientos de configuraciones y te devuelve un ranking. Te ahorra días de prueba y error, pero no sabe si tu pregunta está bien planteada ni si los datos tienen trampas.",
pyspark:"Cuando los datos no caben en tu ordenador, Spark los reparte en trozos entre muchos ordenadores; cada uno procesa su trozo y luego se juntan los resultados. Tú escribes algo muy parecido a SQL o a pandas y Spark se encarga de repartir el trabajo."
};

/* Fichas de estudio que faltaban */
var STUDY6 = {
pyspark:{
 fx:"Divide el DataFrame en <b>particiones</b> repartidas entre ejecutores. Las transformaciones (<code>filter</code>, <code>select</code>, <code>groupBy</code>) son <b>perezosas</b>: solo construyen un plan, y nada se ejecuta hasta una <b>acción</b> (<code>count</code>, <code>show</code>, <code>write</code>). El optimizador Catalyst reescribe el plan; las operaciones que mueven datos entre nodos (<i>shuffle</i>: groupBy, join) son las caras.",
 cod:"from pyspark.sql import SparkSession, functions as F\n\nspark = SparkSession.builder.appName('ventas').getOrCreate()\ndf = spark.read.parquet('ventas/')\nres = (df.filter(F.col('importe') > 0)\n         .groupBy('tienda', F.month('fecha').alias('mes'))\n         .agg(F.sum('importe').alias('ventas')))\nres.explain()          # lee el plan: 'Exchange' = shuffle\nres.write.mode('overwrite').parquet('ventas_mes/')   # aquí se ejecuta todo",
 rel:[["automl","Otro «acelerador», pero del modelado; Spark acelera el procesado de datos."],
      ["kmeans","Spark MLlib incluye un K-Means distribuido: la misma idea, repartida entre nodos."]],
 chk:{q:"Encadenas 5 transformaciones sobre 50 M de filas y la celda termina en 0,2 segundos. ¿Ya está calculado?",
      a:"<b>No.</b> Las transformaciones son perezosas: solo has construido el plan. El cálculo real ocurre al lanzar una <b>acción</b> (count, show, write). Por eso el tiempo se mide en las acciones, y por eso <code>cache()</code> solo tiene sentido si vas a reutilizar el resultado en varias acciones."}}
};

/* Capa profesional de los modelos que no la tenían */
var PRO6 = {
sarsa:{
 caso:{sector:"E-commerce · Marketing de ciclo de vida",
   sit:"Decidir cada semana qué acción aplicar a cada cliente (nada, email, cupón pequeño o cupón grande) según su etapa, sabiendo que un exceso de cupones erosiona el margen y cansa al cliente.",
   datos:"Simulador construido con el histórico: transiciones entre etapas (nuevo, activo, en riesgo, dormido) y respuesta media a cada acción.",
   target:"Margen acumulado por cliente en 52 semanas.",
   metrica:"Recompensa media por episodio frente a la política actual (reglas fijas) y frente a Q-Learning.",
   decision:"Política de acciones por etapa del cliente.",
   impacto:"Mientras la política sigue explorando con clientes reales, SARSA aprende una estrategia que ya descuenta el coste de sus propios experimentos: menos cupones agresivos «por si acaso». Es el planteamiento de tu notebook de marketing e-commerce."},
 hp:[["alpha","Ritmo de aprendizaje de la tabla."],
   ["gamma","Cuánto valora el futuro. Con 52 semanas de horizonte, alto (0,9-0,99)."],
   ["epsilon + decaimiento","La exploración. En SARSA importa doblemente: la política aprendida la tiene en cuenta."],
   ["Nº de episodios","Como en Q-Learning, muchos."]],
 trampas:["Comparar SARSA y Q-Learning con distinto epsilon: la diferencia entre ambos depende precisamente de la exploración.",
   "Dejar epsilon fijo y alto: la política sale demasiado conservadora, porque descuenta una exploración que en producción ya no harás.",
   "Construir el simulador con datos sesgados por la política histórica: solo conoces la respuesta a las acciones que ya se tomaban."],
 uso:"Mismo entorno que Q-Learning (gymnasium). En producción se despliega la tabla de política con reglas de seguridad (máximo de cupones por cliente y mes).",
 y2026:"Material didáctico esencial para entender on-policy frente a off-policy, una distinción que reaparece en los algoritmos modernos (PPO es on-policy; DQN, off-policy). En marketing real, los bandits contextuales cubren la mayoría de casos con mucho menos coste."},

contentbased:{
 caso:{sector:"Streaming · Catálogo",
   sit:"Una plataforma estrena 40 títulos al mes y el filtrado colaborativo no puede recomendarlos hasta que acumulan visionados.",
   datos:"Ficha de 6.000 títulos: sinopsis, género, reparto, director y palabras clave.",
   target:"No hay etiqueta directa; se valida con clics posteriores.",
   metrica:"Revisión cualitativa de vecinos + CTR de la fila «Porque viste…» en un test A/B.",
   decision:"Qué títulos mostrar en «Similares» desde el día del estreno.",
   impacto:"Resuelve el arranque en frío del producto: el título nuevo es recomendable desde el minuto uno porque solo necesita su ficha. En la práctica se combina con el colaborativo (sistema híbrido)."},
 hp:[["ngram_range","(1,2) captura expresiones de dos palabras como «ciencia ficción»."],
   ["min_df / max_df","Quita las palabras rarísimas y las que aparecen en todas partes."],
   ["Peso de cada campo","Dar más peso al género o al director que a la sinopsis cambia mucho el resultado."]],
 trampas:["Usar stop_words='english' con textos en español: no quita nada y las partículas dominan la similitud.",
   "Burbuja de contenido: solo recomienda «más de lo mismo». Hay que inyectar diversidad.",
   "Calcular la matriz de similitud completa con cientos de miles de productos: n² no cabe en memoria; usa vecinos aproximados."],
 uso:"TF-IDF y similitud se precalculan offline y se sirve el top-k de cada producto. Con catálogos grandes, índice vectorial (FAISS).",
 y2026:"El estándar ha pasado a <b>embeddings semánticos</b> (sentence-transformers o embeddings de LLM), que entienden sinónimos y tono, más un índice vectorial. TF-IDF sigue siendo la línea base honesta y explicable."},

pyspark:{
 caso:{sector:"Retail · Ingeniería de datos analítica",
   sit:"El histórico de tickets de 5 años (1.200 M de líneas) ya no cabe en pandas y el informe mensual tarda 9 horas en una máquina virtual.",
   datos:"Ficheros Parquet particionados por fecha en un lakehouse (Databricks o Microsoft Fabric).",
   target:"No aplica: es procesamiento de datos, no un modelo predictivo.",
   metrica:"Tiempo y coste por ejecución; volumen de shuffle en el plan físico.",
   decision:"Migrar el pipeline de pandas a Spark y decidir cómo particionar.",
   impacto:"Con particionado por fecha, lectura en Parquet y un join de broadcast para la tabla de tiendas, el informe pasa de horas a minutos. El valor para un analista no es «saber Spark», es saber leer el plan y evitar shuffles innecesarios."},
 hp:[["spark.sql.shuffle.partitions","Particiones tras un shuffle (200 por defecto). Con AQE, activado por defecto, se ajusta solo; revísalo si ves miles de tareas diminutas."],
   ["partitionBy al escribir","Particionar por año/mes permite leer solo lo necesario (partition pruning)."],
   ["broadcast()","Para joins con una tabla pequeña: la copia a todos los nodos y evita el shuffle."],
   ["cache() / persist()","Solo si reutilizas el mismo DataFrame en varias acciones."]],
 trampas:["Hacer .collect() o .toPandas() sobre millones de filas: traes todo al driver y lo tumbas.",
   "UDFs de Python fila a fila: mucho más lentas que las funciones nativas de pyspark.sql.functions. Último recurso (o pandas_udf).",
   "Particionar por una columna de cardinalidad altísima (id de cliente): millones de ficheros diminutos.",
   "Cronometrar una transformación: por la evaluación perezosa, el tiempo real está en la acción."],
 uso:"En local (pip install pyspark) para aprender; en producción, Databricks, Microsoft Fabric o EMR, con almacenamiento columnar (Parquet / Delta Lake). Para 2-50 GB en una sola máquina, prueba antes Polars o DuckDB.",
 y2026:"Spark 4 (2025) consolidó Spark Connect y el modo ANSI SQL por defecto. Para el analista, Polars y DuckDB se han quedado el tramo intermedio (datos que no caben en pandas pero sí en una máquina); Spark sigue siendo la referencia cuando el dato es realmente distribuido y en lakehouses como Databricks y Fabric."}
};

var PRO = Object.assign({}, PRO1, PRO2, PRO3, PRO4, PRO5, PRO6);
Object.assign(STUDY, STUDY6);

/* Fusión: STUDY y PRO entran DENTRO de MODELS, que sigue siendo la fuente
   única de verdad. Va aquí, después de que ambos estén definidos. */
MODELS.forEach(function(m){
  var s = STUDY[m.id];
  if(s){ m.fx=s.fx; m.cod=s.cod; m.rel=s.rel; m.chk=s.chk; }
  var p = PRO[m.id];
  if(p){ m.caso=p.caso; m.hp=p.hp; m.trampas=p.trampas; m.uso=p.uso; m.y2026=p.y2026; }
  if(SIMPLE[m.id]) m.sim = SIMPLE[m.id];
});

/* ══════════════════════════════════════════════════════════════
   MACROVERSO (diapositiva 5)
   ══════════════════════════════════════════════════════════════ */
var MACRO = [
 {t:"Aprendizaje Supervisado", d:"Aprende de datos <b>etiquetados</b> (X) para predecir salidas conocidas (Y). Tú le enseñas la respuesta correcta y él generaliza.", e:"Detección de spam · Predicción de precios", f:"sup"},
 {t:"Aprendizaje No Supervisado", d:"Encuentra <b>estructuras y patrones ocultos</b> en datos sin etiquetar. Nadie le dice qué buscar.", e:"Segmentación de clientes · Anomalías", f:"unsup"},
 {t:"Aprendizaje por Refuerzo", d:"Un agente aprende a tomar <b>decisiones secuenciales</b> maximizando una recompensa (ciclo acción → recompensa/estado).", e:"Robótica · Control · Pricing dinámico", f:"rl"},
 {t:"Deep Learning", d:"Arquitecturas profundas que procesan <b>datos no estructurados</b> construyendo sus propias representaciones por capas.", e:"Visión por computador · NLP", f:"dl"}
];

/* ══════════════════════════════════════════════════════════════
   RENDER
   ══════════════════════════════════════════════════════════════ */
var ST = {
  nb  : {l:"● Notebook",     c:"nb",   dot:"var(--positive)", txt:"Con notebook propio"},
  std : {l:"◐ Estudiado",    c:"std",  dot:"var(--navy-3)", txt:"Estudiado, sin notebook"},
  pend: {l:"○ Pendiente",    c:"pend", dot:"var(--navy-4)", txt:"Pendiente"}
};
var SYM = {f:"●",m:"◑",p:"○",na:"—"};
var ALAB = ["Precisión","Velocidad","Alta dim.","Interpret."];
var byId = {}; MODELS.forEach(function(m){byId[m.id]=m;});

function plain(s){return String(s).replace(/<[^>]*>/g,"");}
function nbUrl(x){return REPO + x[1] + "/" + (x[2]||"notebook.ipynb");}
function symHtml(v,est){return '<span class="sym s-'+v[1]+'">'+SYM[v[1]]+'</span>'+v[0]+(est?'*':'');}
function ibClass(v){return v[1]==="f"?"ib-alta":v[1]==="m"?"ib-media":v[1]==="p"?"ib-baja":"ib-na";}
function dots(n){var h="";for(var i=1;i<=5;i++)h+='<i class="d '+(i<=n?"f":"e")+'"></i>';return h;}
var ICO='<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>';

/* ── índice de búsqueda ──────────────────────────────────────
   Incluye TODO, también el contenido de estudio (mecanismo,
   código, autochequeo): si algo está escrito en la web, se puede
   encontrar buscándolo. Además, sinónimos ES/EN y variantes, para
   que "overfitting" encuentre lo que está escrito "sobreajuste". */
var SINONIMOS = {
  sobreajuste:"overfitting sobreajustar sobreajusta",
  overfitting:"sobreajuste",
  subajuste:"underfitting",
  arbol:"tree arboles",
  bosque:"forest",
  "no supervisado":"unsupervised",
  supervisado:"supervised",
  clasificacion:"classification clasificar",
  regresion:"regression regresor",
  agrupar:"clustering cluster clusters segmentacion",
  clustering:"agrupar segmentacion cluster",
  anomalia:"anomalias outlier outliers atipico fraude",
  outlier:"anomalia atipico",
  desbalanceo:"desbalanceadas imbalance desequilibrio",
  refuerzo:"reinforcement rl agente",
  serie:"series temporal temporales forecasting prevision",
  forecasting:"prevision serie temporal pronostico",
  incertidumbre:"intervalo confianza credibilidad",
  interpretabilidad:"explicabilidad explicable interpretable",
  fuga:"leakage filtracion",
  leakage:"fuga filtracion",
  gradiente:"gradient boosting",
  kernel:"nucleo truco",
  dimensionalidad:"dimensiones reduccion"
};
function sinAcentos(s){
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}
MODELS.forEach(function(m){
  m.nb  = m.nb  || [];
  m.rel = m.rel || [];
  var c = m.caso;
  var base = [m.n, m.q, plain(m.sim || ""), plain(m.e), m.ex, m.k, m.m, m.no, m.biz, FAM[m.f].l,
              plain(m.fx || ""), m.cod || "", plain(m.warn || ""),
              plain(m.uso || ""), plain(m.y2026 || ""),
              c ? [c.sector, c.sit, c.datos, c.target, c.metrica, c.decision, c.impacto].join(" ") : "",
              (m.hp || []).map(function(x){ return x[0] + " " + plain(x[1]); }).join(" "),
              (m.trampas || []).map(plain).join(" "),
              m.chk ? plain(m.chk.q) + " " + plain(m.chk.a) : "",
              m.a.map(function(x){ return x[0]; }).join(" "),
              m.nb.map(function(x){ return x[0]; }).join(" "),
              m.rel.map(function(x){ return plain(x[1]) + " " + (byId[x[0]] ? byId[x[0]].n : ""); }).join(" ")
             ].join(" ").toLowerCase();
  base = sinAcentos(base);
  /* añade los sinónimos de los términos que el modelo ya menciona */
  var extra = "";
  Object.keys(SINONIMOS).forEach(function(k){
    if(base.indexOf(sinAcentos(k)) > -1) extra += " " + SINONIMOS[k];
  });
  m._txt = base + " " + sinAcentos(extra.toLowerCase());
});

/* El macroverso (MACRO) ya no se pinta aquí de forma estática: ahora
   vive dentro de renderRutas() como introducción de "Rutas de
   aprendizaje", construido bajo demanda cada vez que se entra a ese modo. */

/* ── branch buttons ── */
document.getElementById("branches").innerHTML = SECS.map(function(s){
  return '<button class="branch" data-filter="'+s.b+'">'+s.ic+' '+s.s+'</button>';
}).join("");

/* ── filter buttons — familia y estado son dos dimensiones distintas,
   así que se pintan en dos grupos separados en vez de una fila mixta ── */
var FILTERS_FAM=[["all","Todos"],["sup","Supervisado"],["dl","Deep Learning"],["unsup","No Supervisado"],
              ["ts","Series"],["prob","Probabilístico"],["rl","Refuerzo"],["asoc","Asociación"],["tool","Acelerador"]];
var FILTERS_ST=[["nb","● Con notebook"],["std","◐ Estudiado"],["pend","○ Pendiente"]];
var FILTERS = FILTERS_FAM.concat(FILTERS_ST);
document.getElementById("filtersFam").innerHTML = FILTERS_FAM.map(function(f,i){
  return '<button class="fb'+(i===0?" active":"")+'" data-filter="'+f[0]+'">'+f[1]+'</button>';
}).join("");
document.getElementById("filtersStatus").innerHTML = FILTERS_ST.map(function(f){
  return '<button class="fb" data-filter="'+f[0]+'">'+f[1]+'</button>';
}).join("");

/* ── cards ── */
function cardHtml(m){
  var cls = m.st==="pend" ? " pending" : m.st==="std" ? " studied" : "";
  var h = '<article class="card'+cls+'" data-id="'+m.id+'">';
  h += '<div class="ctop"><span class="tb">'+FAM[m.f].ic+' '+FAM[m.f].l+'</span><span class="st '+ST[m.st].c+'">'+ST[m.st].l+'</span></div>';
  h += '<h3 class="mn">'+m.n+'</h3>';
  h += '<div class="qbox"><span class="qmark">?</span>'+m.q+'</div>';
  h += '<div class="exp">'+m.e+'</div>';
  h += '<div class="attrs">'+m.a.map(function(v,i){
        return '<div class="at"><span class="al">'+ALAB[i]+'</span><span class="av"><span class="sym s-'+v[1]+'">'+SYM[v[1]]+'</span>'+v[0]+(m.est?'*':'')+'</span></div>';
      }).join("")+'</div>';
  if(m.nb.length) h += '<div class="nbs">'+m.nb.map(function(x){
        return '<a class="nbl" href="'+nbUrl(x)+'" target="_blank" rel="noopener">'+ICO+x[0]+'</a>';
      }).join("")+'</div>';
  h += '<dl class="fs">';
  h += '<div class="f"><dt>Ejemplo de uso</dt><dd>'+m.ex+'</dd></div>';
  h += '<div class="f"><dt>Lo más característico</dt><dd>'+m.k+'</dd></div>';
  h += '<div class="f h"><dt>Métrica</dt><dd>'+m.m+'</dd></div>';
  h += '<div class="f h"><dt>Interpretabilidad</dt><dd><span class="ib '+ibClass(m.a[3])+'">'+m.a[3][0]+'</span></dd></div>';
  h += '<div class="f"><dt>Cuándo NO usarlo</dt><dd>'+m.no+'</dd></div>';
  h += '<div class="f"><dt>Decisión de negocio · KPI</dt><dd>'+m.biz+'</dd></div>';
  if(m.warn) h += '<div class="f"><dt>⚠ Matiz importante</dt><dd>'+m.warn+'</dd></div>';
  h += '</dl>';
  h += '<div class="cfoot"><span class="cxl">Complejidad</span><div class="cx">'+dots(m.cx)+'</div></div>';
  return h+'</article>';
}
document.getElementById("sections").innerHTML = SECS.map(function(s){
  var ms = MODELS.filter(function(m){return m.b===s.b;});
  if(!ms.length) return "";
  return '<section class="sec" data-branch="'+s.b+'">'+
    '<h2 class="sh"><span class="shi">'+s.ic+'</span>'+s.t+
    '<span class="shs">· '+s.s+' · '+ms.length+' modelos</span></h2>'+
    '<div class="grid">'+ms.map(cardHtml).join("")+'</div></section>';
}).join("");

/* ── tabla comparativa ── */
var COLS=[["n","Modelo"],["f","Familia"],["st","Estado"],["a0","Precisión"],["a1","Velocidad entren."],
          ["a2","Alta dimensión"],["a3","Interpretabilidad"],["cx","Complejidad"],["nb","Notebook"]];
var sortKey="n", sortDir=1;
document.getElementById("thr").innerHTML = COLS.map(function(c){
  return '<th data-k="'+c[0]+'" tabindex="0" role="columnheader" aria-sort="none">'+c[1]+'<span class="ar">▲</span></th>';
}).join("");

function tval(m,k){
  if(k==="n") return m.n.toLowerCase();
  if(k==="f") return FAM[m.f].l;
  if(k==="st") return m.st==="nb"?0:m.st==="std"?1:2;
  if(k==="cx") return m.cx;
  if(k==="nb") return m.nb.length?0:1;
  if(k[0]==="a") return m.a[+k[1]][2];
  return "";
}
function renderTable(list){
  var arr = list.slice().sort(function(x,y){
    var a=tval(x,sortKey), b=tval(y,sortKey);
    if(a<b) return -1*sortDir; if(a>b) return 1*sortDir;
    return x.n.localeCompare(y.n);
  });
  document.getElementById("tbody").innerHTML = arr.map(function(m){
    return '<tr class="'+(m.st==="pend"?"pend":"")+'">'+
      '<td class="tm">'+m.n+'</td>'+
      '<td class="tf">'+FAM[m.f].ic+' '+FAM[m.f].l+'</td>'+
      '<td class="tf"><span class="tdot" style="background:'+ST[m.st].dot+'"></span>'+ST[m.st].l.slice(2)+'</td>'+
      m.a.map(function(v){return '<td>'+symHtml(v,m.est)+'</td>';}).join("")+
      '<td class="tf">'+m.cx+'/5</td>'+
      '<td>'+(m.nb.length
        ? m.nb.map(function(x){return '<a class="tlink" href="'+nbUrl(x)+'" target="_blank" rel="noopener">'+x[0]+'</a>';}).join('<br>')
        : '<span class="tnone">—</span>')+'</td></tr>';
  }).join("");
  [].forEach.call(document.querySelectorAll("thead th"),function(th){
    var isSorted = th.dataset.k===sortKey;
    th.classList.toggle("sorted", isSorted);
    var ar=th.querySelector(".ar"); if(ar) ar.textContent = isSorted ? (sortDir===1?"▲":"▼") : "▲";
    th.setAttribute("aria-sort", isSorted ? (sortDir===1?"ascending":"descending") : "none");
  });
}
function sortBy(th){
  if(sortKey===th.dataset.k) sortDir*=-1; else {sortKey=th.dataset.k; sortDir=1;}
  apply();
}
[].forEach.call(document.querySelectorAll("thead th"),function(th){
  th.addEventListener("click",function(){ sortBy(th); });
  th.addEventListener("keydown",function(e){
    if(e.key==="Enter" || e.key===" "){ e.preventDefault(); sortBy(th); }
  });
});

/* ── filtros ── */
var cards=[].slice.call(document.querySelectorAll(".card"));
var secsEl=[].slice.call(document.querySelectorAll(".sec"));
var fbs=[].slice.call(document.querySelectorAll(".fb"));
var brs=[].slice.call(document.querySelectorAll(".branch"));
var flt="all", q="", pick=null;   /* pick = lista de ids concreta (la fija el wizard) */

function match(m){
  var mf = pick ? pick.indexOf(m.id)>-1
                : (flt==="all" || m.f===flt || m.b===flt || m.st===flt);
  var ms = q==="" || m._txt.indexOf(q)>-1;
  return mf && ms;
}
/* muestra exactamente los modelos que ha recomendado el wizard, aunque vivan
   en secciones distintas (el filtro por sección se dejaba la mitad fuera) */
function showOnly(ids){
  pick = ids.slice();
  fbs.forEach(function(b){b.classList.remove("active");});
  brs.forEach(function(b){b.classList.remove("active");});
  apply();
}
function apply(){
  var vis = MODELS.filter(match);
  var ok = {}; vis.forEach(function(m){ok[m.id]=1;});
  cards.forEach(function(c){c.classList.toggle("hidden", !ok[c.dataset.id]);});
  var any=false;
  secsEl.forEach(function(s){
    var v = [].slice.call(s.querySelectorAll(".card")).some(function(c){return !c.classList.contains("hidden");});
    s.classList.toggle("hidden",!v); if(v) any=true;
  });
  document.getElementById("nm").classList.toggle("hidden", vis.length > 0);
  document.getElementById("count").textContent =
    (pick ? "Recomendados por el árbol: "+vis.length : vis.length+" de "+MODELS.length+" modelos");
  renderTable(vis);
  renderIndex(vis);
}
function setF(v,el){
  flt=v; pick=null;
  fbs.forEach(function(b){b.classList.remove("active");});
  brs.forEach(function(b){b.classList.remove("active");});
  if(el){ el.classList.add("active"); }
  else {
    /* sin botón concreto: activa el chip que corresponda al filtro (o «Todos») */
    var t  = fbs.filter(function(b){return b.dataset.filter===v;})[0];
    var br = brs.filter(function(b){return b.dataset.filter===v;})[0];
    if(t) t.classList.add("active");
    if(br) br.classList.add("active");
    if(!t && !br) fbs[0].classList.add("active");   /* solo «Todos» si nada más encaja */
  }
  apply();
}
fbs.forEach(function(b){b.addEventListener("click",function(){setF(b.dataset.filter,b);});});
brs.forEach(function(b){b.addEventListener("click",function(){
  if(flt===b.dataset.filter) setF("all",null); else setF(b.dataset.filter,b);
  document.getElementById("sections").scrollIntoView({behavior:"smooth",block:"start"});
});});
var qInput = document.getElementById("q");
qInput.addEventListener("input",function(e){
  q = sinAcentos(e.target.value.trim().toLowerCase()); apply();
});
qInput.addEventListener("keydown",function(e){
  if(e.key==="Escape"){ qInput.value=""; q=""; apply(); qInput.blur(); }
});
/* atajo "/" para saltar directo a la búsqueda, patrón de GitHub/Notion */
document.addEventListener("keydown",function(e){
  if(e.key==="/" && document.activeElement!==qInput &&
     !/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement||{}).tagName||"")){
    e.preventDefault(); qInput.focus();
  }
});

/* ── stats ── */
(function(){
  var n=function(s){return MODELS.filter(function(m){return m.st===s;}).length;};
  var links=MODELS.reduce(function(a,m){return a+m.nb.length;},0);
  var S=[["g",n("nb"),"Con notebook"],["b",n("std"),"Estudiados sin notebook"],["gr",n("pend"),"Pendientes"],
         ["i",MODELS.length,"Modelos en el mapa"],["w",links,"Enlaces a GitHub"]];
  document.getElementById("stats").innerHTML = S.map(function(x){
    return '<div class="sc '+x[0]+'"><div class="n">'+x[1]+'</div><div class="l">'+x[2]+'</div></div>';
  }).join("");
})();

/* ══════════════════════════════════════════════════════════════
   PROGRESO DEL ALUMNO (localStorage)
   Independiente del estado de contenido (m.st, metadato del autor:
   ¿existe notebook?). Cuatro estados de APRENDIZAJE:
     pend → estudio: automático al abrir la ficha por primera vez
     estudio → entendido → dominado: gesto explícito y sobrio del
     usuario junto al autochequeo (nunca automático: que el sistema
     no mienta sobre lo que de verdad sabes).
   ══════════════════════════════════════════════════════════════ */
var LS_PROGRESS = "mllab_progress", LS_LAST = "mllab_last";
var keepChkOpen = false;   /* conserva abierto el <details> del autochequeo al re-renderizar tras marcar progreso */
var PSTATE = {
  pend:      {l:"○ Pendiente"},
  estudio:   {l:"◐ En estudio"},
  entendido: {l:"✓ Entendido"},
  dominado:  {l:"★ Dominado"}
};
var PCOLOR = {pend:"var(--navy-4)", estudio:"var(--navy-3)", entendido:"var(--positive)", dominado:"var(--positive)"};
function loadProgress(){ try{ return JSON.parse(localStorage.getItem(LS_PROGRESS)) || {}; }catch(e){ return {}; } }
function saveProgress(p){ try{ localStorage.setItem(LS_PROGRESS, JSON.stringify(p)); }catch(e){} }
function getProg(id){
  var p = loadProgress();
  return p[id] || {status:"pend", leido:false, practicado:false, comprobado:false};
}
function setProg(id, patch){
  var p = loadProgress();
  var cur = p[id] || {status:"pend", leido:false, practicado:false, comprobado:false};
  p[id] = Object.assign({}, cur, patch);
  saveProgress(p);
  return p[id];
}
function markLast(id){ try{ localStorage.setItem(LS_LAST, JSON.stringify({id:id, ts:Date.now()})); }catch(e){} }
function getLast(){ try{ return JSON.parse(localStorage.getItem(LS_LAST)); }catch(e){ return null; } }
function isDone(id){ var s=getProg(id).status; return s==="entendido"||s==="dominado"; }
function progressCounts(){
  var c = {pend:0, estudio:0, entendido:0, dominado:0};
  MODELS.forEach(function(m){ var s=getProg(m.id).status; c[s]=(c[s]||0)+1; });
  return c;
}

/* ══════════════════════════════════════════════════════════════
   RUTAS DE APRENDIZAJE
   Los bloques progresivos se derivan del campo cx (complejidad,
   ya existente en MODELS) dentro de cada sección de negocio (SECS):
   nada de taxonomía nueva que mantener a mano para 63 modelos.
   ══════════════════════════════════════════════════════════════ */
var TIERS = [
  {l:"Fundamentos", test:function(cx){return cx<=2;}},
  {l:"Intermedio",  test:function(cx){return cx===3;}},
  {l:"Avanzado",    test:function(cx){return cx>=4;}}
];
function routeBlocks(){
  return SECS.map(function(s){
    var ms = MODELS.filter(function(m){return m.b===s.b;});
    if(!ms.length) return null;
    var blocks = TIERS.map(function(t){
      return {label:t.l, models:ms.filter(function(m){return t.test(m.cx);}).sort(function(a,b){return a.cx-b.cx;})};
    }).filter(function(b){return b.models.length;});
    return {sec:s, blocks:blocks, total:ms.length};
  }).filter(Boolean);
}
function routeRow(m){
  var s = PSTATE[getProg(m.id).status];
  return '<button class="idxrow" data-go="'+m.id+'">'+
    '<span class="i">'+FAM[m.f].ic+'</span><span class="nm2">'+m.n+'</span>'+
    '<span class="qq">'+m.q+'</span>'+
    '<span class="stt" style="color:'+PCOLOR[getProg(m.id).status]+'">'+s.l+'</span>'+
    '<span class="go">Estudiar →</span></button>';
}
function renderRutas(){
  var intro = '<div class="macro" id="rutaMacro">' + MACRO.map(function(x){
    return '<div class="mc"><div class="mt">'+FAM[x.f].ic+' '+x.t+'</div><div class="md">'+x.d+'</div><div class="me">'+x.e+'</div></div>';
  }).join("") + '</div>';
  var data = routeBlocks();
  var body = data.map(function(d){
    var s = d.sec;
    var done = d.blocks.reduce(function(a,b){return a+b.models.filter(function(m){return isDone(m.id);}).length;},0);
    return '<div class="route-sec"><div class="idxh"><span>'+s.ic+' '+s.t+'</span>'+
      '<span class="c">· '+s.s+' · '+done+'/'+d.total+' entendidos</span></div>'+
      d.blocks.map(function(b){
        return '<div class="route-block"><div class="rb-label">'+b.label+'</div>'+
          '<div class="idxlist">'+b.models.map(routeRow).join("")+'</div></div>';
      }).join("") + '</div>';
  }).join("");
  document.getElementById("rutaBlocks").innerHTML = intro + body;
}
function renderRutaMap(){
  var data = routeBlocks();
  document.getElementById("rutaMap").innerHTML = '<div class="kmap">' + data.map(function(d){
    var s = d.sec;
    var pct = Math.round(d.blocks.reduce(function(a,b){return a+b.models.filter(function(m){return isDone(m.id);}).length;},0) / d.total * 100);
    return '<details class="kmnode"><summary>'+s.ic+' <b>'+s.t+'</b><span class="kmpct">'+pct+'%</span></summary>'+
      '<div class="kmbody">'+ d.blocks.map(function(b){
        return '<details class="kmnode2"><summary>'+b.label+' <span class="kmn">('+b.models.length+')</span></summary>'+
          '<div class="kmleaf">'+b.models.map(function(m){
            return '<button class="kmleafitem" data-go="'+m.id+'">'+m.n+'</button>';
          }).join("")+'</div></details>';
      }).join("") + '</div></details>';
  }).join("") + '</div>';
}
[].forEach.call(document.querySelectorAll("#rutaSw .vb"), function(b){
  b.addEventListener("click", function(){
    [].forEach.call(document.querySelectorAll("#rutaSw .vb"), function(x){
      var on = x===b; x.classList.toggle("active",on); x.setAttribute("aria-pressed", on?"true":"false");
    });
    var rv = b.dataset.rview;
    document.getElementById("rutaBlocks").classList.toggle("hidden", rv!=="blocks");
    document.getElementById("rutaMap").classList.toggle("hidden", rv!=="map");
    if(rv==="map") renderRutaMap();
  });
});

/* ══════════════════════════════════════════════════════════════
   HOME · «¿Qué quieres hacer hoy?»
   ══════════════════════════════════════════════════════════════ */
function renderHome(){
  var host = document.getElementById("homeContent");
  var last = getLast();
  var counts = progressCounts();
  var doneN = counts.entendido + counts.dominado;
  var nbCount = MODELS.filter(function(m){ return m.st==="nb"; }).length;
  var nCasos = MODELS.reduce(function(a, m){ return a + ((typeof CASOS !== "undefined" && CASOS[m.id]) ? CASOS[m.id].length : 0) + (m.caso ? 1 : 0); }, 0);
  var nViz = MODELS.filter(function(m){ return vizFor(m.id); }).length;
  var first = byId.linsimple || MODELS.slice().sort(function(a,b){ return a.cx-b.cx; })[0];

  var h = '<section class="hero"><div>'+
    '<div class="eyebrow">Manual visual · edición octubre 2026</div>'+
    '<h1>Machine Learning <em>explicado para humanos</em></h1>'+
    '<p class="lead">'+MODELS.length+' modelos contados como te los contaría un compañero senior: primero la intuición y un ejemplo con números, luego el visual interactivo, después el caso de negocio y, solo al final, la fórmula. Pensado para analistas de datos que quieren <b>entender</b>, no memorizar.</p>'+
    '<div class="hero-cta">'+
      (last && byId[last.id]
        ? '<button class="btn primary" data-go="'+last.id+'">Continuar: '+byId[last.id].n+' →</button>'
        : '<button class="btn primary" data-go="'+first.id+'">Empezar por el primer modelo →</button>')+
      '<button class="btn" data-mode="elegir">🌳 Tengo un problema: ¿qué modelo uso?</button></div>'+
    '<div class="hero-stats">'+
      '<div class="hs"><div class="n">'+MODELS.length+'</div><div class="l">modelos</div></div>'+
      '<div class="hs"><div class="n">'+(nViz + LABS.length)+'</div><div class="l">visuales 2D/3D</div></div>'+
      '<div class="hs"><div class="n">'+nCasos+'</div><div class="l">casos de negocio</div></div>'+
      '<div class="hs"><div class="n">'+GLOS.length+'</div><div class="l">términos de glosario</div></div>'+
    '</div></div>'+
    '<div class="hero-art" aria-hidden="true"><canvas id="heroCv"></canvas><div class="ha-cap"><span>K-Means encontrando <b>3 segmentos</b> en directo</span><span id="heroIt"></span></div></div>'+
    '</section>';

  if(last && byId[last.id]){
    var m = byId[last.id];
    h += '<div class="continue-card"><div><div class="cc-eyebrow">Continúa donde lo dejaste</div>'+
      '<div class="cc-name">'+FAM[m.f].ic+' '+m.n+'</div><div class="cc-q">'+m.q+'</div>'+
      '<div class="cc-bar"><div class="cc-fill" style="width:'+Math.round(doneN/MODELS.length*100)+'%"></div></div>'+
      '<div class="cc-meta">'+doneN+' de '+MODELS.length+' modelos entendidos o dominados</div></div>'+
      '<button class="wbtn solid" data-go="'+m.id+'">Seguir estudiando →</button></div>';
  }

  h += '<div class="section-h"><h2>Cómo está pensado cada modelo</h2><p>La misma secuencia en las '+MODELS.length+' fichas, de lo intuitivo a lo técnico.</p></div>'+
    '<div class="how-grid">'+
    '<div class="how"><h3>1 · Entiéndelo</h3><p>Una frase, una analogía, los pasos como si lo hicieras a mano y un ejemplo pequeño con números.</p></div>'+
    '<div class="how"><h3>2 · Míralo</h3><p>Un visual interactivo propio del modelo (2D o 3D): toca los controles y mira qué cambia.</p></div>'+
    '<div class="how"><h3>3 · Úsalo</h3><p>Casos reales de negocio, cuándo sí y cuándo no, y cómo se mide si funciona.</p></div>'+
    '<div class="how"><h3>4 · Ponte a prueba</h3><p>Lo que tienes que recordar, una pregunta de criterio y, si quieres, el nivel profesional.</p></div>'+
    '</div>';

  var modes = [
    {mode:"fundamentos", ic:"📚", t:"Fundamentos", d:"Lo que necesitas ANTES de los modelos: sobreajuste, métricas, fugas de información, validación… en sencillo.", stat:FUND_COUNT()+" conceptos · plan de 12 semanas"},
    {mode:"explorar", ic:"🧠", t:"Catálogo de modelos", d:"Busca, filtra por familia y compara en tabla los "+MODELS.length+" modelos.", stat:nbCount+" con notebook propio en el portfolio"},
    {mode:"rutas", ic:"🗺️", t:"Rutas de aprendizaje", d:"Cada bloque de negocio, de lo básico a lo avanzado, en el orden en que conviene estudiarlo.", stat:"Progreso guardado en tu navegador"},
    {mode:"lab", ic:"🧪", t:"Laboratorio visual", d:"Todos los experimentos interactivos juntos: el kernel en 3D, el umbral, K-Means paso a paso…", stat:(nViz + LABS.length)+" visuales"},
    {mode:"elegir", ic:"🌳", t:"Elegir un modelo", d:"Responde preguntas sobre tu problema y llega a los modelos recomendados, con el porqué.", stat:"Árbol de "+(window.WIZ_STATS?WIZ_STATS.q:"")+" preguntas"},
    {mode:"auditoria", ic:"✅", t:"Auditoría y mejoras", d:"Qué se revisó y corrigió en esta edición y qué mejoras se proponen para la siguiente.", stat:"Revisión técnica de octubre de 2026"}
  ];
  h += '<div class="section-h"><h2>¿Qué quieres hacer hoy?</h2></div><div class="mode-grid">' + modes.map(function(x){
    return '<button class="mode-card" data-mode="'+x.mode+'"><div class="mc-ic">'+x.ic+'</div><div class="mc-t">'+x.t+'</div>'+
      '<div class="mc-d">'+x.d+'</div><div class="mc-stat">'+x.stat+' →</div></button>';
  }).join("") + '</div>';

  h += '<div class="section-h"><h2>Empieza por tu pregunta de negocio</h2><p>Cada familia de modelos responde a un tipo de pregunta.</p></div><div class="fam-strip">'+
    SECS.map(function(s){
      var n = MODELS.filter(function(m){ return m.b === s.b; }).length;
      var firstM = MODELS.filter(function(m){ return m.b === s.b; }).sort(function(a,b){ return a.cx-b.cx; })[0];
      return '<button class="fam" data-go="'+firstM.id+'"><span class="fi">'+s.ic+'</span><span class="fn">'+s.s+'</span><span class="fc">'+s.t.replace(/^.*— /,"")+' · '+n+' modelos</span></button>';
    }).join("")+'</div>';

  h += '<footer class="sitefoot"><span>Manual ML para dummies · Borja Mora Méndez · 2026</span><span>Notebooks: <a href="https://github.com/BORJAMOME/Data-Analytics-Portfolio" target="_blank" rel="noopener">BORJAMOME/Data-Analytics-Portfolio</a></span></footer>';
  host.innerHTML = h;
  heroAnim();
}

/* animación del hero: K-Means de verdad sobre 3 nubes de clientes, en bucle */
var HERO_RAF = 0;
function heroAnim(){
  cancelAnimationFrame(HERO_RAF);
  var cv = document.getElementById("heroCv"); if(!cv) return;
  var C = labColors(), dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = cv.clientWidth || 480, H = cv.clientHeight || 440;
  cv.width = W * dpr; cv.height = H * dpr;
  var ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  var r = mulberry(42), P = [], centers = [[0.28,0.32],[0.72,0.36],[0.5,0.74]];
  centers.forEach(function(c){ for(var i = 0; i < 70; i++) P.push([c[0] + 0.075*gauss(r), c[1] + 0.07*gauss(r)]); });
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var K, lab, it, t0 = 0, phase = 0, cur;
  function reset(){ var rr = mulberry(Math.floor(Math.random()*1e6)); K = [0,1,2].map(function(){ return [0.15 + 0.7*rr(), 0.15 + 0.7*rr()]; }); cur = K.map(function(k){ return k.slice(); }); lab = P.map(function(){ return -1; }); it = 0; }
  function step(){
    lab = P.map(function(p){ var b = 0, bd = 9; K.forEach(function(k, j){ var d = (p[0]-k[0])*(p[0]-k[0]) + (p[1]-k[1])*(p[1]-k[1]); if(d < bd){ bd = d; b = j; } }); return b; });
    K = K.map(function(k, j){ var s = [0,0], n = 0; P.forEach(function(p, i){ if(lab[i] === j){ s[0] += p[0]; s[1] += p[1]; n++; } }); return n ? [s[0]/n, s[1]/n] : k; });
    it++;
  }
  function draw(){
    ctx.clearRect(0, 0, W, H);
    var pad = 30, sx = function(x){ return pad + x*(W - 2*pad); }, sy = function(y){ return pad + y*(H - 2*pad - 30); };
    ctx.strokeStyle = hexA(C.muted, 0.12); ctx.lineWidth = 1;
    for(var g = 0; g <= 6; g++){ var x = pad + g*(W-2*pad)/6; ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, H - pad - 30); ctx.stroke(); }
    for(g = 0; g <= 5; g++){ var y = pad + g*(H-2*pad-30)/5; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke(); }
    P.forEach(function(p, i){
      var col = lab[i] < 0 ? hexA(C.muted, 0.45) : C.c[[0,1,2][lab[i]]];
      if(lab[i] >= 0){ ctx.strokeStyle = hexA(col, 0.10); ctx.beginPath(); ctx.moveTo(sx(p[0]), sy(p[1])); ctx.lineTo(sx(cur[lab[i]][0]), sy(cur[lab[i]][1])); ctx.stroke(); }
      dot(ctx, sx(p[0]), sy(p[1]), 4, col, C.card);
    });
    cur.forEach(function(k, j){
      ctx.beginPath(); ctx.arc(sx(k[0]), sy(k[1]), 13, 0, 7); ctx.fillStyle = hexA(C.c[j], 0.18); ctx.fill();
      dot(ctx, sx(k[0]), sy(k[1]), 7, C.ink, C.card); dot(ctx, sx(k[0]), sy(k[1]), 3.5, C.c[j]);
    });
    var itEl = document.getElementById("heroIt"); if(itEl) itEl.textContent = it ? "iteración " + it : "centros al azar";
  }
  reset(); draw();
  if(reduce){ for(var q = 0; q < 6; q++) step(); cur = K; draw(); return; }
  function loop(t){
    var hv = document.getElementById("view-home");
    if(!document.getElementById("heroCv") || (hv && hv.classList.contains("hidden")) || document.body.classList.contains("detail-open")) return;
    HERO_RAF = requestAnimationFrame(loop);
    if(!t0) t0 = t;
    var dt = t - t0;
    if(dt > 1300){ t0 = t; if(it >= 6){ reset(); } else step(); }
    cur = cur.map(function(c, j){ return [c[0] + (K[j][0]-c[0])*0.08, c[1] + (K[j][1]-c[1])*0.08]; });
    draw();
  }
  HERO_RAF = requestAnimationFrame(loop);
}

/* ══════════════════════════════════════════════════════════════
   NIVEL 1 · ÍNDICE  y  NIVEL 3 · VISTA DE ESTUDIO
   El nivel 2 (fichas) ya existía. Estos dos completan la
   profundidad: escanear los 60 de un vistazo, o entrar a fondo
   en uno solo. La vista de estudio va enrutada por hash, así que
   es enlazable y el botón atrás del navegador funciona.
   ══════════════════════════════════════════════════════════════ */

var view = "idx";                    /* idx | cards */
var lastFocusedId = null;            /* para devolver el foco al cerrar */

/* Cerrar la vista de estudio. Ojo: NO es history.back().
   Si has encadenado Ridge -> Lasso -> Elastic Net, "atrás" te devuelve
   a Lasso, pero Escape y el botón Volver significan "sácame de aquí",
   así que limpian el hash y salen del todo. El botón atrás del
   navegador sigue funcionando aparte, recorriendo los modelos vistos. */
function closeView(){
  if(!location.hash) return;
  history.pushState("", document.title, location.pathname + location.search);
  route();
}

/* ── nivel 1: índice ────────────────────────────────────────── */
function renderIndex(list){
  var host = document.getElementById("indexView");
  var html = "";
  SECS.forEach(function(s){
    var ms = list.filter(function(m){ return m.b === s.b; });
    if(!ms.length) return;
    html += '<div class="idxsec"><div class="idxh"><span>'+s.ic+' '+s.t+'</span>'+
            '<span class="c">· '+s.s+' · '+ms.length+'</span></div><div class="idxlist">';
    html += ms.map(function(m){
      return '<button class="idxrow'+(m.st==="pend"?" pend":"")+'" data-go="'+m.id+'">'+
        '<span class="i">'+FAM[m.f].ic+'</span>'+
        '<span class="nm2">'+m.n+'</span>'+
        '<span class="qq">'+m.q+'</span>'+
        '<span class="stt '+ST[m.st].c+'" style="color:'+(m.st==="nb"?"var(--positive)":m.st==="std"?"var(--navy-3)":"var(--navy-4)")+'">'+ST[m.st].l+'</span>'+
        '<span class="go">Estudiar →</span></button>';
    }).join("");
    html += '</div></div>';
  });
  host.innerHTML = html;
}

/* ── nivel 3: vista de estudio ──────────────────────────────── */
/* cls = "dwide" para los pasos que deben ocupar todo el ancho (visualizaciones) */
function step(n, titulo, cuerpo, cls){
  return '<section class="dstep'+(cls ? ' '+cls : '')+'"><div class="dnum"><b>'+n+'</b><span>'+titulo+'</span></div><div class="dcont">'+cuerpo+'</div></section>';
}

/* ── visual propio de cada modelo ───────────────────────────── */
/* Si un laboratorio existente ya es el visual canónico del modelo,
   se usa como alias en vez de duplicarlo. */
var VIZ_ALIAS = {gp:"gp", bandit:"bandit", svmker:"kernel", linmult:"plano", pca:"pca3d",
  iforest:"aislamiento", kmeans:"kmeans3d", dbscan:"densidad", arbol:"arbol2d", hw:"serie"};
function vizFor(id){
  var v = VIZ.filter(function(x){ return x.model === id; })[0];
  if(v) return v;
  return VIZ_ALIAS[id] ? labById(VIZ_ALIAS[id]) : null;
}
var TOC_OBS = null;
function tocStop(){ if(TOC_OBS){ TOC_OBS.disconnect(); TOC_OBS = null; } }

/* escalón de la ficha: capítulo (chap) y bloque (blk) con ancla para el índice lateral */
function chap(id, n, k, titulo){
  return '<section class="chap" id="'+id+'" data-toc-ch="'+titulo+'"><div class="chap-h"><span class="chap-n">'+n+'</span>'+
    '<div><div class="k">'+k+'</div><h2>'+titulo+'</h2></div></div>';
}
function blk(id, ic, titulo, cuerpo, opt){
  opt = opt || {};
  return '<div class="blk'+(opt.wide ? " wide" : "")+'" id="'+id+'" data-toc="'+titulo+'">'+
    '<h3><span class="hi" aria-hidden="true">'+ic+'</span>'+titulo+(opt.hs ? '<span class="hs">'+opt.hs+'</span>' : '')+'</h3>'+cuerpo+'</div>';
}
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function renderDetail(id){
  var m = byId[id];
  if(!m){ closeDetail(); return; }
  labCleanupAll(); tocStop();

  /* Progreso: pendiente -> en estudio es automático al abrir la ficha.
     Entendido/dominado exigen un gesto explícito (autochequeo o índice lateral). */
  setProg(id, getProg(id).status === "pend" ? {status:"estudio", leido:true} : {leido:true});
  markLast(id);
  var pg = getProg(id);
  var E = (typeof EASY !== "undefined" && EASY[id]) || {};
  var CS = (typeof CASOS !== "undefined" && CASOS[id]) || [];

  var sec = SECS.filter(function(s){ return s.b === m.b; })[0];
  /* Hermanos ordenados por complejidad (cx): prev/next sigue la misma ruta que «Rutas». */
  var hermanos = MODELS.filter(function(x){ return x.b === m.b; }).sort(function(a,b){ return a.cx - b.cx; });
  var i = hermanos.indexOf(m), prev = hermanos[i-1], next = hermanos[i+1];
  var h = "";

  /* ── cabecera ── */
  h += '<div class="dcrumb"><button class="dback" id="dback">← Volver</button><span class="sep">/</span><span>'+FAM[m.f].ic+' '+FAM[m.f].l+'</span><span class="sep">/</span><span>'+sec.t+'</span></div>';
  h += '<header class="dhero"><div>';
  h += '<h1>'+m.n+'</h1>';
  h += '<div class="dmeta"><span class="tb">'+FAM[m.f].ic+' '+FAM[m.f].l+'</span>'+
       '<span class="st '+ST[m.st].c+'">'+ST[m.st].l+'</span>'+
       '<span class="pg chip" style="color:'+PCOLOR[pg.status]+'">'+PSTATE[pg.status].l+'</span>'+
       '<span class="cxbox"><span class="cxl">Dificultad</span><span class="cx">'+dots(m.cx)+'</span></span></div>';
  h += '<p class="dhero-q">'+m.q+'</p></div>';
  h += '<aside class="dfacts" aria-label="Ficha rápida"><h4>Ficha rápida</h4><div class="attrs">'+m.a.map(function(v,k){
         return '<div class="at"><span class="al">'+ALAB[k]+'</span><span class="av"><span class="sym s-'+v[1]+'">'+SYM[v[1]]+'</span>'+v[0]+(m.est?'*':'')+'</span></div>';
       }).join("")+'</div>'+
       (m.est ? '<p class="est">* Estimación razonada: el temario no da estos atributos para este modelo.</p>' : '<p class="est">● muy favorable · ◑ intermedio · ○ poco favorable</p>')+
       '</aside></header>';

  /* ── cuerpo: índice lateral + lectura ── */
  var b = "";

  /* 1 · ENTIÉNDELO */
  b += chap("ch1", 1, "Capítulo 1", "Entiéndelo");
  if(E.frase) b += blk("b-frase", "🎯", "En una frase", '<p class="oneliner">'+E.frase+'</p>');
  if(m.sim) b += blk("b-sencillo", "💡", "Explicado como a un amigo",
      '<div class="call analog"><div class="cb"><div class="ck">Analogía y ejemplo</div><div class="dbody">'+m.sim+'</div></div></div>');
  if(E.pasos && E.pasos.length) b += blk("b-pasos", "🪜", "Cómo funciona, paso a paso",
      '<ol class="pasos">'+E.pasos.map(function(p){ return '<li>'+p+'</li>'; }).join("")+'</ol>');
  if(E.ej) b += blk("b-ejemplo", "🔢", "Un ejemplo con números", '<div class="mini"><div class="dbody">'+E.ej+'</div></div>');
  b += blk("b-idea", "🔑", "La idea clave (versión técnica corta)", '<div class="dbody">'+m.e+'</div>');
  b += '</section>';

  /* 2 · MÍRALO */
  var own = vizFor(m.id);
  var labsFor = LABS.filter(function(L){ return L.models.indexOf(m.id) > -1 && (!own || L.id !== own.id); })
                    .sort(function(a, c){ return a.models.indexOf(m.id) - c.models.indexOf(m.id); });
  var tabs = (own ? [own] : []).concat(labsFor);
  if(tabs.length){
    b += chap("ch2", 2, "Capítulo 2", "Míralo en acción");
    b += blk("b-visual", "👀", "Visualízalo e interactúa",
      '<p class="dbody" style="margin-bottom:18px;max-width:var(--read)">Toca los controles y fíjate en «Qué debes notar». Ver el modelo moverse vale más que diez definiciones.</p>'+
      (tabs.length > 1 ? '<div class="labpick">'+tabs.map(function(L,k){
        return '<button class="labtab'+(k===0?" on":"")+'" data-labtab="'+L.id+'">'+(k===0 && own ? '<span class="own">Visual</span>' : '')+L.ic+' '+L.t+' <span class="labdim">'+L.dim+'</span></button>';
      }).join("")+'</div>' : '')+
      '<div class="vizframe"><div class="labinline" id="labInline"></div></div>', {wide:true, hs: own ? own.dim : ""});
    b += '</section>';
  }

  /* 3 · ÚSALO */
  b += chap("ch3", 3, "Capítulo 3", "Úsalo en una empresa");
  var casosHtml = CS.map(function(c){
    return '<article class="caso"><div class="cs1"><span class="cico" aria-hidden="true">'+c[0]+'</span><span class="csec">'+c[1]+'</span></div>'+
      '<div class="cq">'+c[2]+'</div><div><div class="ck2">Cómo ayuda el modelo</div><div class="cd">'+c[3]+'</div></div>'+
      '<div class="ckpi">'+c[4]+'</div></article>';
  }).join("");
  if(m.caso){
    casosHtml = '<article class="caso main"><div class="cs1"><span class="cico" aria-hidden="true">⭐</span><span class="csec">Caso a fondo · '+m.caso.sector+'</span></div>'+
      '<div class="cq">'+m.caso.sit+'</div><div class="cd"><b>Decisión:</b> '+m.caso.decision+' · <b>Métrica:</b> '+m.caso.metrica+'</div>'+
      '<div class="ckpi">'+m.caso.impacto+'</div></article>' + casosHtml;
  }
  if(casosHtml) b += blk("b-casos", "🏢", "Casos reales de negocio", '<div class="casos">'+casosHtml+'</div>', {wide:true, hs: (CS.length + (m.caso ? 1 : 0))+' casos'});
  b += blk("b-cuando", "🧭", "¿Cuándo sí y cuándo no?",
    '<div class="yesno"><div class="y"><div class="ck">✓ Úsalo cuando…</div><div class="dbody">'+m.k+'<br><br><b>Decisión que habilita:</b> '+m.biz+'</div></div>'+
    '<div class="n"><div class="ck">✕ Mejor no si…</div><div class="dbody">'+m.no+'</div></div></div>'+
    (m.warn ? '<div class="call warn" style="margin-top:12px"><div class="cb"><div class="ck">⚠ Ojo</div><div class="dbody">'+m.warn+'</div></div></div>' : ''));
  b += blk("b-metricas", "📏", "Cómo se mide si funciona",
    '<div class="metrics">'+String(m.m).split("·").map(function(x){ return '<span>'+x.trim()+'</span>'; }).join("")+'</div>'+
    '<p class="dbody" style="margin-top:14px;font-size:15px;color:var(--muted)">Ejemplo típico: '+m.ex+'</p>');
  if(m.nb && m.nb.length) b += blk("b-practica", "🧑‍💻", "Practícalo con tus notebooks",
    '<div class="nbs">'+m.nb.map(function(x){ return '<a class="nbl" href="'+nbUrl(x)+'" target="_blank" rel="noopener">'+ICO+x[0]+'</a>'; }).join("")+'</div>');
  b += '</section>';

  /* 4 · POR DENTRO */
  if(m.fx || (m.rel && m.rel.length)){
    b += chap("ch4", 4, "Capítulo 4", "Por dentro");
    if(m.fx){
      var fxBody = '<div class="fx"><div class="dbody">'+m.fx+'</div>';
      if(m.cod) fxBody += '<details class="codebox"><summary>Ver el código en Python</summary><pre class="dcode">'+m.cod
          .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
          .replace(/&amp;lt;/g,"&lt;").replace(/&amp;gt;/g,"&gt;")+'</pre></details>';
      b += blk("b-fx", "⚙️", "La fórmula y el código", fxBody + '</div>');
    }
    if(m.rel && m.rel.length) b += blk("b-rel", "🔗", "Con qué se confunde (y en qué se diferencia)",
      '<div class="drel">'+m.rel.map(function(r){
        var o = byId[r[0]];
        return '<button class="drelb" data-go="'+r[0]+'"><div class="rn">'+FAM[o.f].ic+' '+o.n+' →</div><div class="rd">'+r[1]+'</div></button>';
      }).join("")+'</div>', {wide:true});
    b += '</section>';
  }

  /* 5 · PONTE A PRUEBA */
  b += chap("ch5", 5, "Capítulo 5", "Ponte a prueba");
  if(E.rec && E.rec.length) b += blk("b-recuerda", "🧠", "Lo que tienes que recordar",
    '<div class="recall"><div class="ck">Si mañana te lo preguntan en una entrevista</div><ul>'+E.rec.map(function(x){ return '<li><span>'+x+'</span></li>'; }).join("")+'</ul></div>');
  if(m.chk){
    var canMaster = pg.status==="entendido" || pg.status==="dominado";
    b += blk("b-chk", "❓", "Comprueba si lo has entendido",
      '<div class="dchk"><div class="cq">'+m.chk.q+'</div>'+
      '<details id="chkDetails"><summary>Ver la respuesta</summary><div class="ca">'+m.chk.a+'</div>'+
      '<div class="progress-actions">'+
        '<button class="pbtn'+(canMaster?" on":"")+'" data-prog="entendido">✓ Lo entiendo</button>'+
        (canMaster ? '<button class="pbtn'+(pg.status==="dominado"?" on":"")+'" data-prog="dominado">★ Lo domino</button>' : '')+
      '</div></details></div>');
  }
  b += '</section>';

  /* 6 · NIVEL PRO (opcional) */
  var deep = "";
  if(m.caso){
    var c = m.caso;
    deep += '<div class="dsub">Caso de negocio completo</div><div class="dcaso"><span class="cs">'+c.sector+'</span>'+
      '<div class="csit">'+c.sit+'</div><dl>'+
      '<div class="dcrow"><dt>Datos</dt><dd>'+c.datos+'</dd></div>'+
      '<div class="dcrow"><dt>Target</dt><dd>'+c.target+'</dd></div>'+
      '<div class="dcrow"><dt>Métrica</dt><dd>'+c.metrica+'</dd></div>'+
      '<div class="dcrow"><dt>Decisión</dt><dd>'+c.decision+'</dd></div></dl>'+
      '<div class="cimp"><b>Por qué este modelo y no otro:</b> '+c.impacto+'</div></div>';
  }
  if(m.hp && m.hp.length) deep += '<div class="dsub">Hiperparámetros que mueven la aguja</div><div class="dhp">'+m.hp.map(function(x){
      return '<div class="dhpi"><code>'+x[0]+'</code><div class="hd">'+x[1]+'</div></div>'; }).join("")+'</div>';
  if(m.trampas && m.trampas.length) deep += '<div class="dsub">Trampas concretas de este modelo</div><ul class="dtr">'+m.trampas.map(function(t){ return '<li>'+t+'</li>'; }).join("")+'</ul>';
  if(m.uso) deep += '<div class="dsub">Puesta en producción</div><div class="duso">'+m.uso+'</div>';
  if(m.y2026) deep += '<div class="dsub">Estado del arte · octubre de 2026</div><div class="d26"><span class="lb">Dónde está hoy</span>'+m.y2026+'</div>';
  if(deep){
    b += chap("ch6", 6, "Capítulo 6 · opcional", "Nivel profesional");
    b += blk("b-pro", "🔍", "Para cuando ya lo tengas claro",
      '<details class="deepen"><summary>Caso completo, hiperparámetros, trampas y estado del arte</summary><div class="deepen-body">'+deep+'</div></details>', {wide:true});
    b += '</section>';
  }

  b += '<nav class="dnav">'+
    (prev ? '<button class="dnavb" data-go="'+prev.id+'"><span class="l">← Anterior en la ruta</span><span class="n2">'+prev.n+'</span></button>'
          : '<button class="dnavb" disabled><span class="l">← Anterior en la ruta</span><span class="n2">—</span></button>')+
    (next ? '<button class="dnavb next" data-go="'+next.id+'"><span class="l">Siguiente en la ruta →</span><span class="n2">'+next.n+'</span></button>'
          : '<button class="dnavb next" disabled><span class="l">Siguiente en la ruta →</span><span class="n2">—</span></button>')+
    '</nav>';

  h += '<div class="study"><aside class="stoc" id="stoc" aria-label="Índice de la ficha"></aside><div class="smain">'+b+'</div></div>';

  var d = document.getElementById("detail");
  d.innerHTML = h;
  d.classList.remove("hidden");
  document.body.classList.add("detail-open");
  document.getElementById("dback").addEventListener("click", closeView);

  /* índice lateral con seguimiento de lectura */
  var toc = '<div class="tt">En esta ficha</div><ol>';
  [].forEach.call(d.querySelectorAll(".chap"), function(ch){
    toc += '<li class="ch">'+ch.dataset.tocCh+'</li>';
    [].forEach.call(ch.querySelectorAll(".blk"), function(bk){ toc += '<li><a href="#'+bk.id+'" data-tocl="'+bk.id+'">'+bk.dataset.toc+'</a></li>'; });
  });
  toc += '</ol><div class="tprog"><div class="l">Tu progreso: <b style="color:'+PCOLOR[pg.status]+'">'+PSTATE[pg.status].l+'</b></div>'+
    '<button class="pbtn'+(pg.status==="entendido"||pg.status==="dominado"?" on":"")+'" data-prog="entendido">✓ Lo entiendo</button></div>';
  var stoc = document.getElementById("stoc"); stoc.innerHTML = toc;
  [].forEach.call(stoc.querySelectorAll("a[data-tocl]"), function(a){
    a.addEventListener("click", function(e){ e.preventDefault(); var t = document.getElementById(a.dataset.tocl); if(t) t.scrollIntoView({behavior:"smooth", block:"start"}); });
  });
  if("IntersectionObserver" in window){
    var links = {}; [].forEach.call(stoc.querySelectorAll("a[data-tocl]"), function(a){ links[a.dataset.tocl] = a; });
    TOC_OBS = new IntersectionObserver(function(ents){
      ents.forEach(function(en){
        if(en.isIntersecting){
          [].forEach.call(stoc.querySelectorAll("a.on"), function(x){ x.classList.remove("on"); });
          if(links[en.target.id]) links[en.target.id].classList.add("on");
        }
      });
    }, {rootMargin:"-90px 0px -65% 0px"});
    [].forEach.call(d.querySelectorAll(".blk"), function(bk){ TOC_OBS.observe(bk); });
  }

  var chkD = document.getElementById("chkDetails");
  if(chkD){
    if(keepChkOpen){ chkD.open = true; keepChkOpen = false; }
    chkD.addEventListener("toggle", function(){ if(chkD.open) setProg(id, {comprobado:true}); });
  }
  [].forEach.call(d.querySelectorAll("[data-prog]"), function(bt){
    bt.addEventListener("click", function(){
      setProg(id, {status:bt.dataset.prog});
      keepChkOpen = !!bt.closest(".dchk");
      var y = window.scrollY; renderDetail(id); window.scrollTo(0, y);
    });
  });
  [].forEach.call(d.querySelectorAll(".nbl"), function(a){
    a.addEventListener("click", function(){ setProg(id, {practicado:true}); });
  });
  var li = document.getElementById("labInline");
  if(li){
    var ltabs = [].slice.call(d.querySelectorAll("[data-labtab]"));
    var showLab = function(lid){
      ltabs.forEach(function(t){ t.classList.toggle("on", t.dataset.labtab===lid); });
      labCleanupAll(); mountLab(lid, li, {compact:true, from:id});
    };
    ltabs.forEach(function(t){ t.addEventListener("click", function(){ showLab(t.dataset.labtab); }); });
    /* el visual se monta cuando se acerca a la pantalla: la ficha abre al instante */
    var first = tabs[0].id, mounted = false;
    var mountOnce = function(){ if(!mounted){ mounted = true; showLab(first); } };
    if("IntersectionObserver" in window){
      var lo = new IntersectionObserver(function(ents){ if(ents[0].isIntersecting){ lo.disconnect(); mountOnce(); } }, {rootMargin:"400px 0px"});
      lo.observe(li); LAB_ACTIVE.push(function(){ lo.disconnect(); });
    } else mountOnce();
  }
  glossLink(d);
  d.focus({preventScroll:true});
  window.scrollTo(0, 0);
}

function closeDetail(){
  labCleanupAll(); tocStop();
  document.getElementById("detail").classList.add("hidden");
  document.body.classList.remove("detail-open");
  if(lastFocusedId){
    var el = document.querySelector('[data-go="'+lastFocusedId+'"]');
    if(el) el.focus();
    lastFocusedId = null;
  }
}

/* ── modos de nivel superior: home | rutas | elegir | explorar ── */
var TOPVIEWS = ["home","fundamentos","rutas","lab","elegir","explorar","auditoria"];
var PENDING_PICK = null;   /* lista de ids que el asistente manda al catálogo */
function setTopview(tv){
  if(TOPVIEWS.indexOf(tv)===-1) tv = "home";
  TOPVIEWS.forEach(function(v){
    document.getElementById("view-"+v).classList.toggle("hidden", v!==tv);
  });
  [].forEach.call(document.querySelectorAll("#topnav .tnb"), function(b){
    var on = (b.dataset.mode || "home") === tv;
    b.classList.toggle("active", on);
    if(on) b.setAttribute("aria-current","page"); else b.removeAttribute("aria-current");
  });
  labCleanupAll();
  if(tv==="home") renderHome();
  if(tv==="rutas") renderRutas();
  if(tv==="fundamentos") renderFund();
  if(tv==="lab") renderLabHub();
  if(tv==="auditoria" && typeof renderAudit === "function") renderAudit();
  if(tv==="explorar" && PENDING_PICK){
    var ids = PENDING_PICK; PENDING_PICK = null;
    var cardsBtn = document.querySelector('#viewsw .vb[data-view="cards"]'); if(cardsBtn) cardsBtn.click();
    showOnly(ids);
  }
  window.scrollTo(0,0);
}

/* ── enrutado por hash: enlazable y con botón atrás ─────────── */
function route(){
  var m = /^#modelo\/([a-z0-9]+)$/.exec(location.hash || "");
  if(m){ renderDetail(m[1]); return; }
  var lb = /^#lab\/([a-z0-9-]+)$/.exec(location.hash || "");
  if(lb){ renderLabPage(lb[1]); return; }
  var fu = /^#fundamentos\/([a-z0-9]+)$/.exec(location.hash || "");
  if(fu){ closeDetail(); setTopview("fundamentos"); openFund(fu[1]); return; }
  closeDetail();
  setTopview((location.hash || "").replace(/^#/,"") || "home");
}
window.addEventListener("hashchange", route);

/* un solo manejador para todo lo que abre un modelo */
document.addEventListener("click", function(e){
  var b = e.target.closest ? e.target.closest("[data-go]") : null;
  if(!b) return;
  lastFocusedId = lastFocusedId || b.dataset.go;
  location.hash = "modelo/" + b.dataset.go;
});
/* manejador para los modos de nivel superior (topnav + mode-cards del home) */
document.addEventListener("click", function(e){
  var b = e.target.closest ? e.target.closest("[data-mode]") : null;
  if(!b) return;
  location.hash = b.dataset.mode;
});
document.addEventListener("keydown", function(e){
  if(e.key === "Escape" && document.body.classList.contains("detail-open")) closeView();
});

/* ── conmutador índice / fichas ─────────────────────────────── */
[].forEach.call(document.querySelectorAll("#viewsw .vb"), function(b){
  b.addEventListener("click", function(){
    view = b.dataset.view;
    [].forEach.call(document.querySelectorAll("#viewsw .vb"), function(x){
      var on = x === b;
      x.classList.toggle("active", on);
      x.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.getElementById("indexView").classList.toggle("hidden", view !== "idx");
    document.getElementById("sections").classList.toggle("hidden", view !== "cards");
    apply();
  });
});

/* ══════════════════════════════════════════════════════════════
   WIZARD — árbol de decisión
   ══════════════════════════════════════════════════════════════ */
(function(){
  var T={
    root:{q:"¿Necesito Machine Learning para esto?",opts:[
      {l:"Se resuelve con una regla, SQL o un cálculo estadístico simple",to:"end_noml"},
      {l:"No: hay que aprender patrones de los datos",to:"q1"},
      {l:"Aún no lo sé; quiero un baseline rápido que me oriente",to:"end_automl"}]},
    q1:{q:"¿Cuál es tu objetivo de negocio?",opts:[
      {l:"Predecir un número o una categoría a partir de características",to:"sup"},
      {l:"Descubrir grupos o patrones sin una respuesta conocida",to:"unsup"},
      {l:"Prever la evolución de una métrica en el tiempo",to:"ts"},
      {l:"Saber CUÁNDO ocurrirá un evento, no solo si ocurre",to:"end_cox"},
      {l:"Medir el efecto real de una acción o decisión",to:"cau"},
      {l:"Entender cómo se influyen mis variables entre sí",to:"prob"},
      {l:"Decidir una y otra vez en un entorno y aprender de la recompensa",to:"rlq"}]},
    rlq:{q:"En tu problema de decisión secuencial, ¿qué escenario tienes?",opts:[
      {l:"Elegir entre pocas opciones fijas y aprender cuál gana sobre la marcha",to:"end_bandit"},
      {l:"Pocos estados discretos y quiero poder leer la política aprendida",to:"end_qlearning"},
      {l:"Muchos estados o entrada compleja, con acciones discretas",to:"end_dqn"},
      {l:"Pocos estados, pero la exploración es arriesgada y quiero una política prudente",to:"end_sarsa"},
      {l:"Acciones continuas, o quiero directamente el estándar actual",to:"end_ppo"}]},
    sup:{q:"¿Qué tipo de respuesta necesitas?",opts:[
      {l:"Un número continuo (cuánto)",to:"reg"},
      {l:"Una categoría o un sí/no (cuál)",to:"clf"}]},
    reg:{q:"En tu predicción numérica, ¿qué prioriza tu caso?",opts:[
      {l:"Explicar el porqué; relación lineal o pocos datos",to:"end_lin"},
      {l:"Muchas variables correlacionadas / quiero seleccionar",to:"end_reg"},
      {l:"El objetivo es un conteo o una tasa de eventos",to:"end_poisson"},
      {l:"Necesito un rango o el peor caso, no la media",to:"end_quant"},
      {l:"Necesito medir la incertidumbre de cada predicción",to:"end_bayes"},
      {l:"No lineal y con muchísimas variables respecto a las filas",to:"end_svr"},
      {l:"Máxima precisión con relaciones no lineales",to:"end_gbr"}]},
    clf:{q:"¿Qué naturaleza tienen tus datos?",opts:[
      {l:"Imágenes o datos con estructura espacial",to:"end_cnn"},
      {l:"Texto libre",to:"txt"},
      {l:"Secuencias donde el orden importa",to:"end_rnn"},
      {l:"Una tabla de variables (tabular)",to:"clftab"}]},
    txt:{q:"Con texto, ¿qué necesitas exactamente?",opts:[
      {l:"Clasificar rápido y barato (spam, sentimiento)",to:"end_text"},
      {l:"Comprensión semántica profunda",to:"end_transformer"},
      {l:"Descubrir de qué hablan sin etiquetas",to:"end_lda"}]},
    clftab:{q:"En datos tabulares, ¿qué prioriza tu caso?",opts:[
      {l:"Explicar cada decisión a negocio",to:"end_expl"},
      {l:"Máxima precisión predictiva",to:"end_boost"},
      {l:"Pocos datos o clasificar por similitud",to:"end_knn"},
      {l:"Muchas variables numéricas y quiero proyectar y clasificar",to:"end_disc"}]},
    unsup:{q:"¿Qué quieres descubrir?",opts:[
      {l:"Agrupar clientes o casos parecidos",to:"clust"},
      {l:"Reducir o visualizar muchas variables",to:"dim"},
      {l:"Detectar casos raros o anómalos",to:"anom"},
      {l:"Qué cosas van juntas o qué recomendar",to:"assoc"},
      {l:"Entender de qué habla un texto",to:"end_lda"}]},
    clust:{q:"¿Cómo son tus grupos?",opts:[
      {l:"Sé cuántos quiero y son formas regulares",to:"end_kmeans"},
      {l:"Quiero ver la jerarquía sin fijar el número",to:"end_hier"},
      {l:"Formas irregulares y hay ruido u outliers",to:"end_dbscan"},
      {l:"Un caso puede pertenecer a varios grupos",to:"end_gmm"},
      {l:"Quiero además un mapa visual del espacio",to:"end_som"},
      {l:"Necesito que el centro sea un caso real",to:"end_kmedoids"}]},
    dim:{q:"¿Para qué reduces las variables?",opts:[
      {l:"Resumir conservando información (para modelar)",to:"end_pca"},
      {l:"Solo para visualizar en 2D",to:"end_tsne"},
      {l:"Comprimir de forma no lineal con una red",to:"end_autoenc"}]},
    anom:{q:"¿Qué tipo de rareza buscas?",opts:[
      {l:"Rareza global, con gran volumen de datos",to:"end_iforest"},
      {l:"Rareza respecto al vecindario local",to:"end_lof"},
      {l:"Datos complejos y quiero aprender qué es 'normal'",to:"end_autoenc"}]},
    assoc:{q:"¿Qué necesitas exactamente?",opts:[
      {l:"Reglas del tipo 'si compra A → compra B'",to:"end_apriori"},
      {l:"Recomendaciones personalizadas por cliente",to:"end_reco"},
      {l:"Recomendar sin histórico de usuarios, solo con la ficha del producto",to:"end_content"}]},
    ts:{q:"¿Qué caracteriza tu serie temporal?",opts:[
      {l:"Sin estacionalidad",to:"end_arima"},
      {l:"Con estacionalidad (patrón que se repite)",to:"end_sarima"},
      {l:"Estacional y además influyen variables externas",to:"end_sarimax"},
      {l:"Quiero algo rápido y automático (con festivos)",to:"end_prophet"},
      {l:"Sencillo, con tendencia y estacionalidad",to:"end_hw"},
      {l:"Dependencias largas y tengo muchos datos",to:"end_rnn"}]},
    cau:{q:"¿Dispones de grupo de tratamiento vs control (experimento)?",opts:[
      {l:"Sí; quiero saber a quién cambia la acción",to:"end_uplift"},
      {l:"No; solo tengo datos observacionales",to:"end_propensity"}]},
    prob:{q:"¿Cómo son tus variables?",opts:[
      {l:"Un conjunto de factores que se influyen entre sí",to:"end_bayesnet"},
      {l:"Una secuencia con estados que no observo",to:"end_hmm"}]}
  };
  var E={
    end_noml:{fam:"No uses Machine Learning",filter:null,ids:[],
      why:"Si una regla de negocio, una consulta SQL o un KPI estadístico responden a la pregunta, el ML solo añade coste, mantenimiento y opacidad. Empieza siempre por aquí: un modelo solo vale si mejora una decisión mejor que la alternativa más simple.",
      extra:'<a href="'+REPO+'04-IA-BigData/01-agentes-ia/01-chatbot-reglas-restaurante/notebook.ipynb" target="_blank" rel="noopener">Ejemplo real: chatbot de reservas — motor de reglas, Nivel 0 sin IA ↗</a>'},
    end_lin:{fam:"Regresión Lineal",filter:"num",ids:["linsimple","linmult"],
      why:"Relación lineal e interpretable: cada coeficiente es el impacto de una variable manteniendo el resto constante. Es el baseline obligatorio antes de cualquier cosa más compleja."},
    end_reg:{fam:"Regresión regularizada",filter:"num",ids:["ridge","lasso","elastic"],
      why:"Con muchas variables correlacionadas, la lineal se vuelve inestable. Ridge estabiliza, Lasso selecciona y Elastic Net combina ambas cosas."},
    end_poisson:{fam:"Regresión de Poisson / GLM",filter:"num",ids:["poisson"],
      why:"El objetivo es un conteo o una tasa (valores no negativos, p. ej. nº de pedidos): la familia GLM lo modela con la distribución correcta y nunca predice negativos."},
    end_quant:{fam:"Regresión Cuantílica",filter:"num",ids:["quantile"],
      why:"Cuando planificas no te sirve la media, te sirve el peor caso razonable. La cuantílica predice el percentil que le pidas y te devuelve un rango accionable."},
    end_bayes:{fam:"Modelos bayesianos",filter:"num",ids:["bayesridge","gp"],
      why:"Cuando la incertidumbre importa tanto como el valor predicho: devuelven un intervalo de credibilidad por predicción. El Proceso Gaussiano brilla con pocos datos; Bayesian Ridge escala mejor."},
    end_gbr:{fam:"Gradient Boosting",filter:"num",ids:["gbr","xgboost","lightgbm"],
      why:"Captura relaciones no lineales con la máxima precisión numérica. XGBoost y LightGBM son la misma idea, más rápidos y regularizados."},
    end_cnn:{fam:"Redes Convolucionales (CNN)",filter:"net",ids:["cnn","mlp"],
      why:"Para imágenes o datos con estructura espacial: los filtros convolucionales detectan patrones locales (bordes → formas → objetos) por capas. En la práctica casi siempre partirás de un modelo preentrenado."},
    end_rnn:{fam:"RNN / LSTM",filter:"net",ids:["rnn","transformer"],
      why:"Cuando el ORDEN de los datos lleva información: la LSTM arrastra un estado que resume el pasado. Con secuencias largas y GPU disponible, los Transformers la superan."},
    end_transformer:{fam:"Transformers",filter:"net",ids:["transformer"],
      why:"El mecanismo de atención permite que cada palabra mire a todas las demás a la vez. Es la base de los LLM y el estándar actual para comprensión de texto."},
    end_text:{fam:"Clasificación de texto",filter:"cat",ids:["nb","topic"],
      why:"Con texto libre, Naive Bayes da un baseline rapidísimo que funciona sorprendentemente bien; si además quieres los temas de fondo, combínalo con Topic Modeling."},
    end_expl:{fam:"Modelos explicables",filter:"cat",ids:["logistica","arbol"],
      why:"Cuando debes justificar cada decisión a negocio o a un regulador: la Logística da una probabilidad interpretable y el Árbol se lee como un diagrama de flujo."},
    end_boost:{fam:"Boosting / Ensembles",filter:"cat",ids:["xgboost","lightgbm","catboost","adaboost","rf","extratrees"],
      why:"Máxima precisión en datos tabulares. XGBoost es el estándar; LightGBM escala mejor; CatBoost brilla con muchas categóricas; AdaBoost es el original y el más didáctico; Random Forest es el más robusto sin tuning."},
    end_svr:{fam:"Support Vector Regression (SVR)",filter:"num",ids:["svr","gp"],
      why:"Cuando la relación es no lineal y tienes muchas más columnas que filas, el truco del kernel suele aguantar la alta dimensionalidad mejor que los ensembles de árboles. El precio es entrenamiento lento y cero interpretabilidad."},
    end_knn:{fam:"KNN / SVM",filter:"cat",ids:["knn","svmlin","svmker","nb"],
      why:"Con pocos datos o cuando la clase depende de la similitud entre casos: KNN clasifica por vecinos; SVM traza la frontera de margen máximo y aguanta muy bien la alta dimensionalidad."},
    end_disc:{fam:"Análisis Discriminante (LDA / QDA)",filter:"cat",ids:["lda","qda"],
      why:"Clasifican y reducen dimensionalidad a la vez, buscando los ejes que mejor separan tus grupos. LDA si las clases comparten dispersión; QDA si cada una tiene la suya."},
    end_lda:{fam:"Topic Modeling (LDA)",filter:"txt",ids:["topic"],
      why:"Descubre los temas latentes en grandes volúmenes de texto sin leerlos uno a uno (reseñas, encuestas abiertas, tickets de soporte)."},
    end_kmeans:{fam:"K-Means",filter:"grp",ids:["kmeans"],
      why:"El clustering más usado: rápido y directo cuando sabes cuántos grupos quieres y estos son razonablemente esféricos. Estandariza siempre antes."},
    end_kmedoids:{fam:"K-Medoids (PAM)",filter:"grp",ids:["kmedoids"],
      why:"Como K-Means pero el centro de cada grupo es un caso real del dataset. Más robusto a outliers y mucho más fácil de contar en una reunión."},
    end_hier:{fam:"Clustering Jerárquico",filter:"grp",ids:["jerarquico"],
      why:"Construye un dendrograma para ver la estructura de grupos sin decidir el número de antemano. Ideal para la fase de exploración."},
    end_dbscan:{fam:"DBSCAN",filter:"grp",ids:["dbscan"],
      why:"Agrupa por densidad: encuentra clusters de forma irregular y marca los outliers como ruido, sin fijar el número de grupos."},
    end_gmm:{fam:"Gaussian Mixture (GMM)",filter:"grp",ids:["gmm"],
      why:"Clustering blando: asigna a cada caso una probabilidad de pertenecer a cada grupo, no una etiqueta dura. Útil cuando los perfiles se solapan."},
    end_som:{fam:"Mapas Autoorganizados (SOM)",filter:"net",ids:["som"],
      why:"Red no supervisada que proyecta el espacio sobre una rejilla 2D conservando la vecindad: clusteriza y te da el mapa visual en el mismo objeto."},
    end_pca:{fam:"PCA",filter:"dim",ids:["pca"],
      why:"Resume muchas variables en pocos componentes que capturan la máxima varianza. Perfecto para simplificar modelos e informes."},
    end_tsne:{fam:"t-SNE / UMAP",filter:"dim",ids:["tsne","umap"],
      why:"Proyectan datos de muchas dimensiones a un mapa 2D para visualizar. UMAP es más rápido y respeta mejor la estructura global. t-SNE, solo para ver, nunca como features."},
    end_autoenc:{fam:"Autoencoders",filter:"ano",ids:["autoenc","rbm"],
      why:"Aprenden a reconstruir su propia entrada pasando por un cuello de botella: sirven como PCA no lineal y como detector de anomalías vía error de reconstrucción. La RBM es su antecesora generativa — hoy casi solo tiene interés histórico."},
    end_iforest:{fam:"Isolation Forest",filter:"ano",ids:["iforest"],
      why:"Aísla los casos raros con muy pocos cortes y escala muy bien: la opción por defecto para detección de anomalías global (fraude, transacciones)."},
    end_lof:{fam:"Local Outlier Factor (LOF)",filter:"ano",ids:["lof"],
      why:"Detecta anomalías respecto a la densidad de su vecindario local: ve outliers sutiles que un método global no capta."},
    end_apriori:{fam:"Apriori / Market Basket",filter:"aso",ids:["apriori"],
      why:"Extrae reglas legibles 'si A → entonces B' con soporte, confianza y lift. El clásico del cross-selling en retail — y cuidado con la dirección de la regla: el lift es simétrico, la confianza no."},
    end_reco:{fam:"Filtrado Colaborativo",filter:"rec",ids:["reco"],
      why:"Recomienda a cada cliente según lo que gustó a clientes parecidos ('quien compró esto también compró…'). Ojo al arranque en frío."},
    end_arima:{fam:"ARIMA",filter:"fut",ids:["arima"],
      why:"El modelo base para series estacionarias sin componente estacional: combina autorregresión, diferenciación y media móvil."},
    end_sarima:{fam:"SARIMA",filter:"fut",ids:["sarima"],
      why:"ARIMA más un componente estacional (s): para series con un patrón que se repite (semanal, anual…)."},
    end_sarimax:{fam:"SARIMAX",filter:"fut",ids:["sarimax"],
      why:"SARIMA más variables exógenas (la X): cuando la serie también depende de drivers externos como precio, festivos o clima. Solo sirve para predecir si podrás conocer el exógeno futuro."},
    end_prophet:{fam:"Prophet",filter:"fut",ids:["prophet"],
      why:"Forecasting automático y robusto a huecos, con festivos y tendencias integrados. Creado por Meta; muy práctico en negocio."},
    end_hw:{fam:"Holt-Winters",filter:"fut",ids:["hw"],
      why:"Sencillo y sorprendentemente efectivo: pondera más el pasado reciente y captura tendencia y estacionalidad. Baseline difícil de batir."},
    end_cox:{fam:"Análisis de Supervivencia",filter:"sup",ids:["cox"],
      why:"Modela el TIEMPO hasta el evento aprovechando también los casos que aún no lo han sufrido. Pasas de 'quién se irá' a 'cuándo se irá', que es lo que permite actuar a tiempo."},
    end_uplift:{fam:"Uplift Modeling",filter:"cau",ids:["uplift"],
      why:"Con un experimento (tratamiento vs control), estima a quién CAMBIA de verdad la acción, no solo quién convierte. Maximiza el ROI incremental."},
    end_propensity:{fam:"Propensity Score / Diff-in-Diff",filter:"cau",ids:["propensity"],
      why:"Sin experimento, estima el efecto causal a partir de datos observacionales corrigiendo el sesgo de selección. Siempre queda el riesgo de una confusión no observada."},
    end_bayesnet:{fam:"Redes Bayesianas",filter:"prb",ids:["bayesnet"],
      why:"Un grafo de dependencias probabilísticas entre variables. Permite preguntar '¿y si…?' propagando evidencia, algo que un modelo predictivo normal no puede hacer."},
    end_hmm:{fam:"Modelos Ocultos de Markov (HMM)",filter:"prb",ids:["hmm"],
      why:"Cuando hay estados que no observas directamente (régimen de mercado, fase de una máquina) y solo ves sus efectos: reconstruye la secuencia de estados más probable."},
    end_automl:{fam:"AutoML — empieza por aquí",filter:"aut",ids:["automl"],
      why:"Si aún no sabes qué familia encaja, AutoML te da en minutos el ranking de qué funciona sobre TUS datos. Trátalo como una brújula, no como el modelo final: después vuelve al árbol y profundiza en la familia que haya ganado."},
    end_bandit:{fam:"Multi-Armed Bandit",filter:"rl",ids:["bandit"],
      why:"El refuerzo en su versión más barata y más rentable: reparte el tráfico entre opciones y va desplazándolo solo hacia la que gana. Antes de montar un agente completo, comprueba si esto te resuelve el problema."},
    end_qlearning:{fam:"Q-Learning",filter:"rl",ids:["qlearning"],
      why:"Aprende por prueba y error una tabla de «qué acción conviene en cada estado». Con pocos estados discretos es transparente: puedes leer la política aprendida fila a fila."},
    end_dqn:{fam:"Deep Q-Network (DQN)",filter:"rl",ids:["dqn","ppo"],
      why:"Cuando los estados no caben en una tabla, una red neuronal la aproxima. Necesita un simulador y muchísimas interacciones: comprueba antes que el problema justifica el coste."},
    end_sarsa:{fam:"SARSA",filter:"rl",ids:["sarsa","qlearning"],
      why:"Como Q-Learning, pero aprende teniendo en cuenta su propia exploración (on-policy): si equivocarse mientras aprende es caro, aprende una política más prudente."},
    end_content:{fam:"Recomendador basado en contenido",filter:"rec",ids:["contentbased","reco"],
      why:"Recomienda por parecido entre fichas de producto (texto, género, atributos), así que funciona desde el primer día con productos nuevos. Cuando acumules interacciones, combínalo con filtrado colaborativo."},
    end_ppo:{fam:"PPO",filter:"rl",ids:["ppo","dqn"],
      why:"El estándar actual de refuerzo: aprende la política directamente y limita cuánto cambia en cada paso para no desestabilizarse. Su familia (PPO → GRPO) es también la base del post-entrenamiento de los LLM."}
  };

  window.WIZ_STATS = {q:Object.keys(T).length, e:Object.keys(E).length};
  var wizPath=document.getElementById("wizPath"), wizCard=document.getElementById("wizCard");
  var back=document.getElementById("wizBack"), reset=document.getElementById("wizReset");
  if(!wizCard) return;
  var visited=[], current="root";

  function chip(id){
    var m=byId[id]; if(!m) return '<i class="wm off">'+id+'</i>';
    var cl = m.st==="nb" ? "on" : m.st==="std" ? "mid" : "off";
    return '<button class="wm '+cl+'" data-go="'+id+'">'+FAM[m.f].ic+' '+m.n+(m.st==="nb" ? ' · notebook' : '')+' →</button>';
  }
  function renderPath(){
    var html='<span class="pchip pc0">¿Necesito ML?</span>';
    visited.forEach(function(v){html+='<span class="parr">→</span><span class="pchip">'+v.label+'</span>';});
    wizPath.innerHTML=html;
  }
  function render(id){
    renderPath(); back.disabled=(visited.length===0);
    if(T[id]){
      var node=T[id];
      wizCard.innerHTML='<div class="wq">'+node.q+'</div><div class="wopts">'+
        node.opts.map(function(o,i){return '<button class="wopt" data-i="'+i+'">'+o.l+'<span class="wa">→</span></button>';}).join("")+'</div>';
      [].forEach.call(wizCard.querySelectorAll(".wopt"),function(b){
        b.addEventListener("click",function(){
          var o=node.opts[+b.dataset.i];
          visited.push({id:id,label:o.l}); current=o.to; render(current);
        });
      });
    } else {
      var e=E[id];
      var chips = e.ids.length ? e.ids.map(chip).join("") : '<i class="wm off">'+(e.extra||"")+'</i>';
      wizCard.innerHTML='<div class="wend">'+
        '<div class="wend-badge">'+(e.filter?"Modelo recomendado":"Recomendación")+'</div>'+
        '<div class="wend-fam">'+e.fam+'</div><p class="wend-why">'+e.why+'</p>'+
        '<div class="wend-models">'+chips+'</div>'+
        (e.filter?'<button class="wbtn solid" id="wizSee">Comparar estas fichas en el catálogo →</button>':'')+'</div>';
      var see=document.getElementById("wizSee");
      if(see) see.addEventListener("click",function(){
        /* antes hacía scroll a una sección oculta en otra vista: ahora navega al catálogo filtrado */
        PENDING_PICK = e.ids.slice(); location.hash = "explorar";
      });
    }
  }
  back.addEventListener("click",function(){if(visited.length){current=visited.pop().id;render(current);}});
  reset.addEventListener("click",function(){visited=[];current="root";render(current);});
  render(current);
})();


/* ══════════════════════════════════════════════════════════════
   BUSCADOR RÁPIDO (Ctrl/⌘ + K): modelos, fundamentos y laboratorios
   ══════════════════════════════════════════════════════════════ */
(function(){
  var items = null, box = null, sel = 0, res = [];
  function build(){
    items = MODELS.map(function(m){ return {ic:FAM[m.f].ic, n:m.n, d:plain(m.q), h:"modelo/"+m.id,
        k:sinAcentos((m.n+" "+plain(m.q)+" "+plain(m.e)+" "+(SINONIMOS[m.id]||"")).toLowerCase())}; })
      .concat([].concat.apply([], FUND.map(function(B){ return B.items.map(function(c){
        return {ic:c.ic, n:c.t, d:"Fundamentos · "+c.f, h:"fundamentos/"+c.id, k:sinAcentos((c.t+" "+c.f).toLowerCase())}; }); })))
      .concat(LABS.map(function(L){ return {ic:L.ic, n:L.t, d:"Laboratorio · "+plain(L.q), h:"lab/"+L.id, k:sinAcentos((L.t+" "+L.q).toLowerCase())}; }))
      .concat([{ic:"✅", n:"Auditoría y propuestas de mejora", d:"Qué se corrigió en esta edición", h:"auditoria", k:"auditoria errores correcciones mejoras propuestas"}]);
  }
  function close(){ if(box){ box.remove(); box = null; } }
  function go(it){ close(); location.hash = it.h; }
  function paint(q){
    var v = sinAcentos(q.trim().toLowerCase());
    res = !v ? items.slice(0, 9) : items.filter(function(it){ return v.split(/\s+/).every(function(t){ return it.k.indexOf(t) > -1; }); }).slice(0, 30);
    sel = 0;
    var host = box.querySelector(".qk-res");
    host.innerHTML = res.length ? res.map(function(it, i){
      return '<button class="qk-it'+(i===0?" on":"")+'" data-i="'+i+'"><span class="qi">'+it.ic+'</span><span class="qt"><span class="qn">'+it.n+'</span><span class="qd">'+it.d+'</span></span></button>';
    }).join("") : '<div class="qk-empty">Nada con «'+esc(q)+'». Prueba con otra palabra (p. ej. «churn», «clusters», «previsión»).</div>';
  }
  function open(){
    if(!items) build();
    close();
    box = document.createElement("div"); box.className = "qk"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Buscador rápido");
    box.innerHTML = '<div class="qk-box"><input type="text" placeholder="Busca un modelo, un concepto o un problema de negocio…" aria-label="Buscar"><div class="qk-res"></div>'+
      '<div class="qk-foot"><span>↑↓ moverte</span><span>↵ abrir</span><span>Esc cerrar</span></div></div>';
    document.body.appendChild(box);
    var inp = box.querySelector("input");
    inp.addEventListener("input", function(){ paint(inp.value); });
    inp.addEventListener("keydown", function(e){
      var bs = box.querySelectorAll(".qk-it");
      if(e.key === "ArrowDown" || e.key === "ArrowUp"){
        e.preventDefault(); if(!bs.length) return;
        bs[sel].classList.remove("on"); sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + bs.length) % bs.length;
        bs[sel].classList.add("on"); bs[sel].scrollIntoView({block:"nearest"});
      } else if(e.key === "Enter" && res[sel]){ go(res[sel]); }
      else if(e.key === "Escape"){ close(); }
    });
    box.addEventListener("click", function(e){
      var b = e.target.closest(".qk-it"); if(b){ go(res[+b.dataset.i]); return; }
      if(!e.target.closest(".qk-box")) close();
    });
    paint(""); inp.focus();
  }
  var btn = document.getElementById("qkBtn"); if(btn) btn.addEventListener("click", open);
  document.addEventListener("keydown", function(e){
    if((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")){ e.preventDefault(); open(); }
  });
})();

apply();
initTheme();
route();   /* si la URL trae #modelo/xxx, abre la vista de estudio directamente */
