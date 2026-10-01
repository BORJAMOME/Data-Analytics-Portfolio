/* ══════════════════════════════════════════════════════════════
   AUDITORÍA DE CONTENIDO Y PROPUESTAS DE MEJORA (octubre 2026)
   sev: alta | media | baja | ok (verificado sin cambios)
   ══════════════════════════════════════════════════════════════ */
var AUDIT = [
 {sev:"alta", t:"El botón del asistente «Ver fichas de estos modelos» no hacía nada",
  d:"Hacía scroll a la sección de fichas, que vive en otra vista oculta («Explorar»). <span class='now'>Ahora navega al catálogo filtrado con los modelos recomendados</span>, y los modelos del resultado abren su ficha (antes enlazaban directamente al notebook).", w:"Elegir modelo"},
 {sev:"alta", t:"QDA aparecía como «Muy alta» en alta dimensionalidad",
  d:"Contradecía su propio autochequeo (con 40 variables y 30 filas por clase no se puede estimar una covarianza por clase). <span class='was'>Muy alta</span> → <span class='now'>Baja</span>.", w:"Ficha QDA · tabla comparativa"},
 {sev:"alta", t:"Cálculo erróneo del RMSE en Fundamentos",
  d:"Errores de 10, 10, 10 y 100 €: <span class='was'>RMSE = 51,2 €</span> → <span class='now'>RMSE = 50,7 € (√2.575)</span>. Se añade el cálculo para que se pueda comprobar.", w:"Fundamentos · Métricas de regresión"},
 {sev:"media", t:"Atributos de la tabla incoherentes con el texto de la ficha",
  d:"<b>LDA</b> alta dimensionalidad <span class='was'>Muy alta</span> → <span class='now'>Media</span> (sin <i>shrinkage</i> falla cuando hay casi tantas variables como filas). <b>Proceso Gaussiano</b> <span class='was'>Alta</span> → <span class='now'>Baja</span> (los kernels habituales pierden eficacia con muchas dimensiones). <b>Apriori</b> <span class='was'>Muy alta</span> → <span class='now'>Media</span> (explosión combinatoria con muchos productos). <b>CatBoost</b> velocidad <span class='was'>Alta</span> → <span class='now'>Media</span> (su propia ficha dice que entrena más lento que LightGBM). <b>Árbol de decisión</b> precisión <span class='was'>Alta</span> → <span class='now'>Media</span> (igual que Random Forest, cuando la ficha dice que está superado como predictor). <b>Regresión logística</b> alta dimensionalidad <span class='was'>Baja</span> → <span class='now'>Media-Alta</span> (regularizada es estándar en texto).", w:"Tabla comparativa · 6 fichas"},
 {sev:"media", t:"SOM clasificado como «Deep Learning»",
  d:"Es una red neuronal <b>no supervisada de una sola capa</b>. <span class='now'>Familia corregida a No supervisado</span>, manteniéndolo en la sección de redes neuronales y explicándolo en la ficha.", w:"Ficha SOM · filtros"},
 {sev:"media", t:"El ejemplo del umbral asumía que llamar al cliente lo retiene siempre",
  d:"Se mantiene el cálculo (umbral 1,7%) y <span class='now'>se añade el caso realista: si la llamada solo retiene a 1 de cada 3, el umbral sube al 5%</span>. El umbral sale de la economía de la acción, no del modelo.", w:"Fundamentos · Umbral de decisión"},
 {sev:"media", t:"«SVM lineal: no usar con millones de filas»",
  d:"Contradecía la capa profesional (LinearSVC escala bien). <span class='now'>Matizado: el problema es SVC clásico; con millones de filas usa LinearSVC o SGDClassifier</span>.", w:"Ficha SVM lineal"},
 {sev:"baja", t:"Poisson: «la varianza crece con la media»",
  d:"Impreciso: <span class='now'>Poisson asume varianza igual a la media</span> (por eso hay que vigilar la sobredispersión).", w:"Ficha Poisson"},
 {sev:"baja", t:"Notación del ratio de Fisher en LDA",
  d:"<span class='was'>Sᵦ/Sᵥ</span> → <span class='now'>S_B / S_W (dispersión entre clases / dentro de cada clase)</span>.", w:"Ficha LDA"},
 {sev:"baja", t:"Extra Trees: faltaba un matiz clave",
  d:"<span class='now'>Por defecto no usa bootstrap</span> (entrena cada árbol con todas las filas), al contrario que Random Forest.", w:"Ficha Extra Trees"},
 {sev:"baja", t:"«t-SNE no puede proyectar datos nuevos»",
  d:"Cierto en scikit-learn; <span class='now'>se matiza que librerías como openTSNE lo aproximan</span>.", w:"Ficha UMAP"},
 {sev:"baja", t:"Sobreafirmación en el asistente (SVR)",
  d:"<span class='was'>«mejor que cualquier ensemble»</span> → <span class='now'>«suele aguantar mejor que los ensembles de árboles» con muchas más columnas que filas</span>.", w:"Elegir modelo"},
 {sev:"baja", t:"Plazos de transparencia del AI Act",
  d:"<span class='now'>Precisado: art. 50 desde el 2 de agosto de 2026, con margen hasta el 2 de diciembre de 2026 para marcar contenido generado por IA de sistemas ya en el mercado</span> (Reglamento (UE) 2026/1744).", w:"Fundamentos · Qué ha cambiado"},
 {sev:"baja", t:"Leyendas de color de los laboratorios",
  d:"<span class='now'>Los textos de las leyendas nombran ahora el color real de cada visual</span> (umbral, árbol, kernel, plano 3D), tras adoptar la paleta azul del portfolio.", w:"Laboratorios"},
 {sev:"ok", t:"Afirmaciones con fecha verificadas en fuentes actuales",
  d:"Digital Omnibus = Reglamento (UE) 2026/1744 (en vigor el 27 de julio de 2026; alto riesgo desde el 2 de diciembre de 2027). TabPFN-2.5 (nov. 2025): hasta 50.000 filas y 2.000 variables, 100% de victorias frente a XGBoost por defecto hasta 10.000 filas y 87% hasta 100.000. YOLO26: 14 de enero de 2026, sin NMS. scikit-learn 1.9: junio de 2026. Gymnasium CliffWalking-v1, pgmpy DiscreteBayesianNetwork y Spark 4 con ANSI por defecto: correctos.", w:"Varias fichas"},
 {sev:"ok", t:"Fórmulas y ejemplos numéricos recalculados",
  d:"Mínimos cuadrados, Ridge/Lasso/Elastic Net, Gini, α de AdaBoost, peso de hoja de XGBoost, Q-Learning, SARSA, recorte de PPO, ARIMA, lift, Kaplan-Meier, matriz de confusión, validación cruzada y distancias: correctos. Todos los ejemplos nuevos de la capa de explicación sencilla se calcularon y comprobaron a mano.", w:"63 fichas · 24 fundamentos"}
];
var PROPUESTAS = [
 {k:"Hecho en esta edición", t:"Capa de explicación sencilla en las 63 fichas", d:"Una frase, pasos como si lo hicieras a mano, un ejemplo con números y «lo que tienes que recordar».", done:1},
 {k:"Hecho en esta edición", t:"Un visual interactivo propio por modelo", d:"2D y 3D (three.js), con cálculos reales siempre que es razonable y la simulación declarada cuando no.", done:1},
 {k:"Hecho en esta edición", t:"Casos de negocio ampliados", d:"Cada ficha: el caso a fondo + 3 casos reales nuevos de sectores distintos.", done:1},
 {k:"Hecho en esta edición", t:"Rediseño para estudiar", d:"Lectura a 760 px, índice lateral con seguimiento, capítulos, más aire, tema oscuro y marca personal.", done:1},
 {k:"Hecho en esta edición", t:"Buscador rápido (Ctrl + K)", d:"Modelos, fundamentos y laboratorios desde cualquier pantalla.", done:1},
 {k:"Siguiente paso", t:"Modo repaso con tarjetas", d:"Flashcards con repetición espaciada a partir de «lo que tienes que recordar» y los autochequeos."},
 {k:"Siguiente paso", t:"Notebooks pendientes de más valor", d:"Para el portfolio: LightGBM, Isolation Forest, Prophet, KNN y Elastic Net (pendientes en el portfolio y muy útiles para un perfil de analista)."},
 {k:"Siguiente paso", t:"Calculadora de coste de errores", d:"Introduce el coste de un falso positivo y de un falso negativo y obtén el umbral óptimo y el beneficio esperado."},
 {k:"Siguiente paso", t:"Laboratorio de explicabilidad (SHAP)", d:"Ver cómo se reparte una predicción entre variables y por qué SHAP no es causalidad."},
 {k:"Siguiente paso", t:"Publicarlo en GitHub Pages", d:"Una URL pública del manual enlazada desde el README del portfolio y desde LinkedIn."},
 {k:"Siguiente paso", t:"Comprobación automática de enlaces", d:"Un test en el build que verifique que cada enlace a notebook existe en el repositorio."}
];
function renderAudit(){
  var host = document.getElementById("audContent"); if(!host) return;
  var n = function(s){ return AUDIT.filter(function(a){ return a.sev === s; }).length; };
  var lab = {alta:"Alta", media:"Media", baja:"Baja", ok:"Verificado"};
  host.innerHTML = '<div class="modehead"><div class="eyebrow">Auditoría · octubre 2026</div><h2 class="th-title">Qué se revisó, qué se corrigió y qué viene después</h2>'+
    '<p class="th-sub">Revisión técnica completa de las 63 fichas, los 24 fundamentos, el glosario, el asistente y los laboratorios: fórmulas recalculadas, afirmaciones con fecha contrastadas con fuentes actuales y coherencia entre la tabla comparativa y el texto de cada ficha. El contenido de partida era <b>muy sólido</b>: no había errores conceptuales graves, sí incoherencias y un fallo de navegación.</p></div>'+
    '<div class="aud-grid">'+
      '<div class="aud-k"><div class="n">'+(n("alta")+n("media")+n("baja"))+'</div><div class="l">Correcciones aplicadas</div></div>'+
      '<div class="aud-k"><div class="n" style="color:var(--negative)">'+n("alta")+'</div><div class="l">Severidad alta</div></div>'+
      '<div class="aud-k"><div class="n" style="color:var(--support)">'+n("media")+'</div><div class="l">Severidad media</div></div>'+
      '<div class="aud-k"><div class="n" style="color:var(--accent)">'+n("baja")+'</div><div class="l">Matices</div></div>'+
    '</div>'+
    '<div class="aud-list">'+AUDIT.map(function(a){
      return '<div class="aud"><span class="sev '+a.sev+'">'+lab[a.sev]+'</span><div><div class="at2">'+a.t+'</div><div class="ad">'+a.d+'</div><div class="where">Dónde: '+a.w+'</div></div></div>';
    }).join("")+'</div>'+
    '<div class="section-h"><h2>Propuestas de mejora</h2><p>Lo que ya incorpora esta edición y lo que propongo para la siguiente.</p></div>'+
    '<div class="prop-grid">'+PROPUESTAS.map(function(p){
      return '<div class="prop"><div class="pk">'+p.k+'</div><h4>'+p.t+'</h4><p>'+p.d+'</p>'+(p.done ? '<span class="done">✓ Hecho</span>' : '<span class="todo">Propuesta</span>')+'</div>';
    }).join("")+'</div>';
}
