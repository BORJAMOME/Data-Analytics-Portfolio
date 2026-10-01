/* ══════════════════════════════════════════════════════════════
   GLOSARIO — [término, variantes que se detectan en el texto, definición]
   glossLink() subraya la primera aparición de cada término dentro
   de la vista de estudio y de Fundamentos; al pasar el ratón,
   enfocar con el teclado o tocar, aparece la definición.
   ══════════════════════════════════════════════════════════════ */
var GLOS = [
["Sobreajuste",["sobreajuste","sobreajusta","sobreajustar","sobreajustando","overfitting"],"El modelo memoriza los datos de entrenamiento (incluido su ruido) en vez de aprender el patrón general. Síntoma: va genial en train y mal en test. Como el alumno que se aprende de memoria el examen del año pasado."],
["Subajuste",["subajuste","underfitting"],"El modelo es demasiado simple para el patrón: falla tanto en train como en test. Como resumir la temperatura de todo el año con una sola cifra."],
["Regularización",["regularización","regularizar","regularizada"],"Castigo que se suma al error para que el modelo no se complique más de lo necesario (coeficientes enormes, árboles profundos). Es la herramienta principal contra el sobreajuste."],
["Hiperparámetro",["hiperparámetro","hiperparámetros"],"Ajuste que decides tú ANTES de entrenar (profundidad del árbol, K, learning rate). Los parámetros, en cambio, los aprende el modelo. Se eligen con validación cruzada."],
["Validación cruzada",["validación cruzada","cross-validation","k-fold"],"Partir los datos en k trozos, entrenar con k−1 y evaluar con el restante, rotando k veces. La media de los k resultados es más fiable que un único split."],
["Data leakage (fuga)",["leakage","fuga de información","fugas"],"El modelo ve al entrenar información que no tendrá al predecir de verdad (una variable posterior al evento, estadísticas calculadas con el test). Da resultados espectaculares en validación y desastrosos en producción."],
["Estandarizar",["estandarizar","estandarización","estandarizada","estandariza","StandardScaler"],"Transformar cada variable para que tenga media 0 y desviación típica 1: (x − media) / desviación. Imprescindible en modelos que usan distancias o penalizaciones (KNN, SVM, K-Means, Ridge, redes)."],
["One-hot encoding",["one-hot"],"Convertir una categoría en columnas de 0/1: «color = rojo/verde/azul» pasa a tres columnas es_rojo, es_verde y es_azul."],
["Target encoding",["target encoding"],"Sustituir cada categoría por la media del target en esa categoría (p. ej., tasa de baja por provincia). Potente, pero si no se hace con cuidado filtra la respuesta al modelo."],
["Descenso de gradiente",["gradiente","descenso de gradiente"],"El gradiente indica hacia dónde sube más rápido el error; avanzar en sentido contrario, paso a paso, va bajando el error. Así aprenden las redes y el boosting."],
["Learning rate",["learning rate","learning_rate","tasa de aprendizaje","ritmo de aprendizaje"],"Tamaño de cada paso al corregir el modelo. Pequeño: aprende despacio pero seguro. Grande: rápido, pero puede pasarse de largo y no converger nunca."],
["Función de pérdida",["función de pérdida","función de coste","log loss","pinball loss"],"La fórmula que mide cuánto se equivoca el modelo y que el entrenamiento intenta minimizar (error cuadrático, log loss, pinball loss…)."],
["Residuo",["residuo","residuos"],"Diferencia entre el valor real y el predicho (y − ŷ). Si los residuos muestran un patrón (forma de U, crecen con el tiempo), el modelo se está dejando algo."],
["Coeficiente",["coeficiente","coeficientes"],"Peso que el modelo asigna a una variable. En una regresión lineal: cuánto cambia la predicción cuando esa variable sube una unidad y las demás no cambian."],
["R²",["R²","R² ajustado"],"Proporción de la variación del target que explica el modelo (0 = nada, 1 = todo). R² = 0,70 → explica el 70%. Siempre sube al añadir variables; el R² ajustado corrige eso."],
["RMSE",["RMSE"],"Raíz del error cuadrático medio. Está en las unidades del target y castiga mucho los errores grandes."],
["MAE",["MAE"],"Error absoluto medio: de media, cuánto te equivocas, en las unidades del target. Más robusto a valores extremos que el RMSE y más fácil de explicar."],
["MAPE",["MAPE"],"Error porcentual medio. Fácil de comunicar («nos equivocamos un 8%»), pero explota cuando los valores reales son cercanos a cero."],
["Precision",["precision","precision@k"],"De todo lo que el modelo marca como positivo, qué % lo es de verdad. Precision alta = pocas falsas alarmas."],
["Recall (sensibilidad)",["recall","recall@k","recall@300","sensibilidad"],"De todos los positivos reales, qué % encuentra el modelo. Recall alto = se le escapan pocos. Precision y recall compiten: al subir uno suele bajar el otro."],
["F1",["F1","F1 macro"],"Media armónica de precision y recall: solo es alta si las dos lo son. «Macro» = media de la F1 de cada clase, dando el mismo peso a las clases raras."],
["Accuracy",["accuracy"],"% de aciertos totales. Engañosa con clases desbalanceadas: con un 3% de bajas, decir «nadie se va» da un 97% de accuracy y no sirve para nada."],
["ROC-AUC",["ROC-AUC","curva ROC"],"Probabilidad de que el modelo puntúe más alto a un positivo al azar que a un negativo al azar. 0,5 = moneda al aire; 1 = perfecto. Con clases muy desbalanceadas puede parecer buena sin serlo."],
["PR-AUC",["PR-AUC","aucpr"],"Área bajo la curva precision-recall. Más honesta que la ROC cuando los positivos son raros: su línea base es la tasa de positivos, no 0,5."],
["Matriz de confusión",["matriz de confusión","matriz de costes"],"Tabla que cruza lo real con lo predicho: verdaderos positivos, falsos positivos, falsos negativos y verdaderos negativos. De ella salen todas las métricas de clasificación."],
["Umbral",["umbral"],"Probabilidad a partir de la cual decides «sí». Por defecto 0,5, pero el correcto sale del coste de cada error."],
["Odds y log-odds",["log-odds","odds ratio","odds"],"Odds = p/(1−p): un 80% equivale a odds de 4 a 1. La logística trabaja en log-odds; e^β es el odds ratio: cuánto se multiplican las odds cuando la variable sube una unidad."],
["Calibración",["calibración","calibrada","calibradas","calibrado","calibrar","calíbralas","recalibra"],"Una probabilidad está calibrada si, de todos los casos a los que el modelo da un 70%, el evento ocurre en torno al 70%. Se corrige con CalibratedClassifierCV."],
["Bootstrap",["bootstrap"],"Sacar una muestra del mismo tamaño que los datos, con reemplazo: algunas filas se repiten y ~37% se quedan fuera. Es la base del bagging."],
["OOB (out-of-bag)",["OOB"],"Las filas que un árbol no vio por el bootstrap sirven para evaluarlo. Random Forest te da así una validación «gratis»."],
["Bagging",["bagging"],"Entrenar muchos modelos en paralelo, cada uno con una muestra distinta, y promediarlos. Reduce la varianza (Random Forest)."],
["Boosting",["boosting"],"Entrenar modelos en cadena, cada uno corrigiendo los errores del anterior. Suele dar la máxima precisión en tablas (XGBoost, LightGBM, CatBoost)."],
["Ensemble",["ensemble","ensembles"],"Combinación de varios modelos cuya predicción conjunta es mejor que la de cada uno (votación, media, stacking)."],
["Kernel",["kernel","truco del kernel"],"Función que mide el parecido entre dos puntos como si vivieran en un espacio de más dimensiones, sin calcular ese espacio. Permite a SVM y a los procesos gaussianos trazar fronteras curvas."],
["Hiperplano",["hiperplano"],"La generalización de una recta: en 2D es una recta, en 3D un plano y en más dimensiones un «hiperplano». Divide el espacio en dos lados."],
["Vectores de soporte",["vectores de soporte"],"Los puntos más cercanos a la frontera de un SVM. Son los únicos que la determinan: si borras cualquier otro punto, la frontera no cambia."],
["Maldición de la dimensionalidad",["maldición de la dimensionalidad"],"Con muchas variables, los datos quedan dispersos y todas las distancias se parecen. Los métodos basados en vecinos pierden sentido."],
["Embedding",["embedding","embeddings"],"Vector de números que representa algo (una palabra, un producto, un cliente) de forma que lo parecido queda cerca. Como las coordenadas GPS del significado."],
["Centroide",["centroide","centroides"],"El punto medio de un grupo: la media de cada variable de sus miembros. En K-Means es el centro del cluster y puede no coincidir con ningún dato real."],
["Inercia",["inercia"],"Suma de las distancias al cuadrado de cada punto a su centroide. Cuanto menor, más compactos los grupos. Siempre baja al subir K; por eso se busca el «codo»."],
["Silueta",["silueta"],"Mide si cada punto está más cerca de su grupo que del grupo vecino. Va de −1 a 1; por encima de 0,5, grupos bien separados."],
["Componente principal",["componente principal","componentes principales"],"Variable nueva que crea PCA combinando las originales, en la dirección en la que los datos más varían."],
["Varianza explicada",["varianza explicada"],"% de la variación total de los datos que conserva cada componente. Si PC1 y PC2 explican el 85%, un gráfico 2D cuenta casi toda la historia."],
["Estacionariedad",["estacionaria","estacionariedad","estacionarias"],"Una serie es estacionaria si su media y su variabilidad no cambian con el tiempo. ARIMA la necesita; si hay tendencia, se diferencia (restar el valor anterior)."],
["Estacionalidad",["estacionalidad"],"Patrón que se repite con un periodo fijo: más ventas cada diciembre, menos tráfico cada domingo."],
["Autocorrelación (ACF/PACF)",["autocorrelación","ACF","PACF"],"Correlación de una serie consigo misma desplazada en el tiempo. La ACF y la PACF ayudan a elegir los órdenes p y q de ARIMA."],
["Ruido blanco",["ruido blanco"],"Errores sin ningún patrón: media cero, variabilidad constante y sin correlación en el tiempo. Si los residuos lo son, ya no queda nada que exprimir."],
["Variable exógena",["exógena","exógenas","exógeno","exógenos"],"Variable externa a la serie que ayuda a predecirla (precio, clima, festivos). Para usarla al predecir necesitas conocer su valor futuro."],
["Dato censurado",["censurado","censurados","censura"],"En supervivencia, un caso cuyo evento aún no ha ocurrido al cerrar el estudio: no sabes cuándo se irá el cliente, pero sí que ha aguantado al menos hasta hoy."],
["Hazard ratio",["hazard ratio","hazard"],"Ritmo relativo al que ocurre el evento. Un hazard ratio de 2 significa que, en cualquier momento, ese grupo sufre el evento al doble de ritmo."],
["Efecto causal",["efecto causal","efecto incremental","contrafactual"],"La diferencia entre lo que pasó con la acción y lo que habría pasado sin ella. Lo segundo nunca se observa: por eso hacen falta grupos de control o supuestos."],
["ATE / ATT",["ATE","ATT"],"ATE: efecto medio de la acción en toda la población. ATT: efecto medio en quienes la recibieron. No coinciden si la acción se aplicó a quien más le convenía."],
["Grupo de control",["grupo de control","control aleatorizado"],"Grupo que no recibe la acción, elegido al azar, para saber qué habría pasado sin ella."],
["Aleatorización",["aleatorización","aleatorizado","aleatorizar"],"Asignar el tratamiento al azar. Garantiza que tratados y control solo se diferencien (en promedio) en el tratamiento."],
["Prior y posterior",["prior","priors","distribución posterior"],"En estadística bayesiana, el prior es lo que crees antes de ver los datos y la posterior lo que crees después. Con pocos datos pesa el prior; con muchos, mandan los datos."],
["Verosimilitud",["verosimilitud","máxima verosimilitud","log-verosimilitud"],"Lo probables que son tus datos si el modelo fuera cierto. Entrenar por máxima verosimilitud = elegir los parámetros que hacen más creíbles los datos observados."],
["Retropropagación",["retropropagación","backpropagation"],"Algoritmo que calcula cuánto contribuyó cada peso de una red al error, recorriéndola de la salida hacia la entrada, para saber cómo ajustarlo."],
["Función de activación",["función de activación","activaciones","ReLU","sigmoide"],"Transformación no lineal que aplica cada neurona (ReLU, sigmoide). Sin ella, una red de 100 capas sería una simple regresión lineal."],
["Época",["época","épocas","epochs"],"Una pasada completa por todos los datos de entrenamiento. Las redes suelen necesitar varias; demasiadas llevan al sobreajuste."],
["Dropout",["dropout"],"Durante el entrenamiento, «apagar» al azar un % de neuronas en cada paso. Obliga a la red a no depender de ninguna en concreto y reduce el sobreajuste."],
["Atención",["atención","mecanismo de atención"],"Mecanismo por el que cada elemento de una secuencia decide a qué otros mirar y cuánto. Es el corazón de los Transformers."],
["Fine-tuning",["fine-tuning"],"Reentrenar ligeramente un modelo ya preentrenado con tus propios datos para adaptarlo a tu tarea. Mucho más barato que entrenar desde cero."],
["Preentrenado",["preentrenado","preentrenada","preentrenamiento","preentrenados"],"Modelo ya entrenado por otros con enormes cantidades de datos, que puedes usar tal cual o adaptar."],
["Política",["política"],"En refuerzo, la regla que dice qué acción tomar en cada situación. Es lo que aprende el agente."],
["Recompensa",["recompensa"],"Señal numérica que recibe el agente tras cada acción (margen, puntos). El agente aprende a maximizar la suma a largo plazo."],
["Explorar vs. explotar",["explorar vs. explotar","explorar/explotar","exploración"],"Dilema del refuerzo: probar opciones nuevas para aprender (explorar) o usar la mejor conocida para ganar ya (explotar)."],
["Drift",["drift"],"Cambio con el tiempo en los datos o en la relación entre variables y target. Un modelo de 2024 puede degradarse en 2026 sin que nadie toque el código."],
["SHAP",["SHAP"],"Método que reparte cada predicción entre las variables: «esta denegación se debe +0,12 a los ingresos, +0,08 a impagos previos…». El estándar para explicar modelos de caja negra."],
["Importancia por permutación",["importancia por permutación","permutación"],"Mide cuánto empeora el modelo al desordenar al azar una variable. Si empeora mucho, la variable importa. Más fiable que feature_importances_ de los árboles."],
["Pipeline",["Pipeline"],"Objeto de scikit-learn que encadena preprocesado y modelo. Garantiza que el escalado o el encoding se aprendan solo con train: evita fugas."],
["Multicolinealidad",["multicolinealidad","VIF"],"Varias variables explicativas muy correlacionadas entre sí. El modelo predice bien pero no sabe repartir el efecto y los coeficientes se vuelven inestables."],
["Desbalanceo de clases",["desbalanceo","desbalanceadas","desbalanceados"],"Una clase es mucho más rara que otra (2% de fraude). Hace que la accuracy engañe y obliga a usar PR-AUC, recall, pesos o a mover el umbral."],
["Línea base (baseline)",["baseline","línea base"],"Modelo o regla muy simple (la media, la clase más frecuente, el valor de la semana pasada) con la que te comparas. Si tu modelo no la bate claramente, no aporta."],
["Intervalo",["intervalo de confianza","intervalo de predicción","intervalo de credibilidad"],"Rango con una probabilidad asociada. El de confianza habla de la incertidumbre sobre la media; el de predicción, de dónde caerá un caso concreto (siempre más ancho)."],
["p-valor",["p-valor","p-valores"],"Probabilidad de ver un resultado al menos tan extremo si en realidad no hubiera efecto. Por debajo de 0,05 suele leerse como evidencia de efecto, pero no mide su tamaño."],
["Lift",["lift"],"Cuántas veces más ocurre algo respecto al azar. Lift 2,1 en «nachos → salsa»: quien compra nachos compra salsa 2,1 veces más de lo esperable."],
["Densidad",["densidad"],"Cuántos puntos hay en una zona del espacio. DBSCAN y LOF definen grupos y rarezas según la densidad."],
["Cuantil / percentil",["cuantil","percentil","P90"],"Valor por debajo del cual cae un % de los datos. El P90 es la cifra que no se supera el 90% de las veces."],
["Feature (variable)",["features","variable explicativa"],"Cada columna de entrada que usa el modelo para predecir (edad, gasto, antigüedad). También llamada variable predictora o X."],
["Target",["target"],"La columna que quieres predecir (la «y»): baja sí/no, precio, demanda."],
["Shuffle (Spark)",["shuffle"],"Mover datos entre nodos para agruparlos o cruzarlos (groupBy, join). Es la operación más cara de Spark."]
];

/* ── enlazado automático ── */
var GL_RE = null, GL_MAP = {};
function glBuild(){
  var pats = [];
  GLOS.forEach(function(g, i){ g[1].forEach(function(p){ GL_MAP[p.toLowerCase()] = i; pats.push(p); }); });
  pats.sort(function(a, b){ return b.length - a.length; });
  var esc = pats.map(function(p){ return p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
  GL_RE = new RegExp("(?<![\\p{L}\\p{N}_@-])(" + esc.join("|") + ")(?![\\p{L}\\p{N}_])", "giu");
}
var GL_SCOPE = ".dbody, .dsimple, .dcaso, .duso, .d26, .dtr li, .dhpi .hd, .ca, .cq, .fsec p, .labintro, .labnote li, .pasos li, .caso .cd, .recall li";
function glossLink(root){
  if(!root) return;
  if(!GL_RE) glBuild();
  var used = {};
  [].forEach.call(root.querySelectorAll(GL_SCOPE), function(scope){
    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: function(n){
        var p = n.parentNode;
        while(p && p !== scope){
          if(/^(CODE|PRE|A|BUTTON|SUMMARY|H1|H2|H3)$/.test(p.nodeName) || (p.classList && p.classList.contains("gl"))) return NodeFilter.FILTER_REJECT;
          p = p.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      }});
    var nodes = []; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function(node){
      var txt = node.nodeValue, last = 0, frag = null, mm;
      GL_RE.lastIndex = 0;
      while((mm = GL_RE.exec(txt))){
        var gi = GL_MAP[mm[1].toLowerCase()];
        if(gi === undefined || used[gi]) continue;
        used[gi] = 1;
        frag = frag || document.createDocumentFragment();
        frag.appendChild(document.createTextNode(txt.slice(last, mm.index)));
        var s = document.createElement("span");
        s.className = "gl"; s.tabIndex = 0; s.dataset.gl = gi; s.textContent = mm[1];
        s.setAttribute("aria-describedby", "glpop");
        frag.appendChild(s);
        last = mm.index + mm[1].length;
      }
      if(frag){ frag.appendChild(document.createTextNode(txt.slice(last))); node.parentNode.replaceChild(frag, node); }
    });
  });
}

/* ── definición emergente: una sola, reutilizada ── */
(function(){
  var pop = null, cur = null, hideT = null;
  function ensure(){
    if(pop) return pop;
    pop = document.createElement("div"); pop.id = "glpop"; pop.setAttribute("role", "tooltip"); pop.className = "glpop";
    pop.addEventListener("mouseenter", function(){ clearTimeout(hideT); });
    pop.addEventListener("mouseleave", function(){ hide(); });
    document.body.appendChild(pop); return pop;
  }
  function show(el){
    clearTimeout(hideT); ensure();
    var g = GLOS[+el.dataset.gl]; if(!g) return;
    cur = el;
    pop.innerHTML = '<div class="glt">' + g[0] + '</div><div class="gld">' + g[2] + '</div>';
    pop.classList.add("on");
    var r = el.getBoundingClientRect(), pw = Math.min(320, window.innerWidth - 24);
    pop.style.width = pw + "px";
    var left = Math.max(12, Math.min(r.left + r.width/2 - pw/2, window.innerWidth - pw - 12));
    var ph = pop.offsetHeight, top = r.bottom + 8;
    if(top + ph > window.innerHeight - 8) top = Math.max(8, r.top - ph - 8);
    pop.style.left = left + "px"; pop.style.top = top + "px";
  }
  function hide(){ hideT = setTimeout(function(){ if(pop) pop.classList.remove("on"); cur = null; }, 120); }
  document.addEventListener("mouseover", function(e){ var t = e.target.closest && e.target.closest(".gl"); if(t) show(t); });
  document.addEventListener("mouseout", function(e){ var t = e.target.closest && e.target.closest(".gl"); if(t) hide(); });
  document.addEventListener("focusin", function(e){ if(e.target.classList && e.target.classList.contains("gl")) show(e.target); });
  document.addEventListener("focusout", function(e){ if(e.target.classList && e.target.classList.contains("gl")) hide(); });
  document.addEventListener("click", function(e){
    var t = e.target.closest && e.target.closest(".gl");
    if(t){ if(cur === t && pop && pop.classList.contains("on")){ pop.classList.remove("on"); cur = null; } else show(t); }
    else if(pop && !e.target.closest(".glpop")){ pop.classList.remove("on"); cur = null; }
  });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape" && pop){ pop.classList.remove("on"); } });
  window.addEventListener("scroll", function(){ if(pop && pop.classList.contains("on")){ pop.classList.remove("on"); cur = null; } }, {passive:true});
})();

/* ══════════════════════════════════════════════════════════════
   VISTA FUNDAMENTOS
   ══════════════════════════════════════════════════════════════ */
function fundChip(id){
  var m = byId[id]; if(!m) return "";
  return '<button class="fchip" data-go="'+id+'">'+FAM[m.f].ic+' '+m.n+'</button>';
}
function fundCard(c){
  var lab = c.lab ? LABS.filter(function(L){ return L.id === c.lab; })[0] : null;
  return '<details class="fcard" id="fund-'+c.id+'"><summary><span class="fic" aria-hidden="true">'+c.ic+'</span>'+
    '<span class="fst"><span class="ft">'+c.t+'</span><span class="ff">'+c.f+'</span></span><span class="fchev" aria-hidden="true">▾</span></summary>'+
    '<div class="fbody">'+
      '<div class="fsec"><div class="dsub">Explicado en sencillo</div><p>'+c.s+'</p></div>'+
      '<div class="fgrid">'+
        '<div class="fsec fan"><div class="dsub">💡 Analogía</div><p>'+c.an+'</p></div>'+
        '<div class="fsec fej"><div class="dsub">🔢 Ejemplo</div><p>'+c.ej+'</p></div>'+
      '</div>'+
      '<div class="fsec ferr"><div class="dsub">⚠ Error típico</div><p>'+c.err+'</p></div>'+
      (c.cod ? '<details class="codebox"><summary>Ver el código</summary><pre class="dcode">'+c.cod.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")+'</pre></details>' : '')+
      (lab ? '<a class="flab" href="#lab/'+lab.id+'">'+lab.ic+' Abrir laboratorio: '+lab.t+' →</a>' : '')+
      (c.rel && c.rel.length ? '<div class="frel"><span class="dsub">Lo vas a usar en</span><div>'+c.rel.map(fundChip).join("")+'</div></div>' : '')+
    '</div></details>';
}
function renderFund(){
  var host = document.getElementById("fundContent");
  if(host.dataset.done){ return; }
  var h = '<div class="modehead"><div class="eyebrow">Fundamentos</div><h2 class="th-title">Lo que necesitas antes de los modelos</h2>'+
    '<p class="th-sub">Cada modelo del catálogo se apoya en estas mismas ideas. Si las dominas, aprender un modelo nuevo es aprender <b>una pieza</b>, no empezar de cero. Cada concepto tiene explicación en sencillo, analogía, ejemplo con números y el error típico de junior. Las palabras <span class="gl-demo">subrayadas</span> tienen definición: pasa el ratón o tócalas.</p></div>';
  h += '<section class="plan"><div class="plan-h"><div><div class="dsub">Plan de estudio · 12 semanas</div><div class="plan-t">De octubre de 2026 a enero de 2027, a unas 6-8 horas por semana</div></div></div><ol class="plan-l">'+
    PLAN.map(function(p){ return '<li><span class="pw">'+p[0]+'</span><span class="pc"><b>'+p[1]+'</b><span>'+p[2]+'</span></span></li>'; }).join("")+'</ol></section>';
  FUND.forEach(function(B){
    h += '<section class="fblock"><h3 class="fbh">'+B.b+'</h3><div class="fcards">'+B.items.map(fundCard).join("")+'</div></section>';
  });
  h += '<section class="fblock" id="fund-glosario"><h3 class="fbh">📖 Glosario · '+GLOS.length+' términos</h3>'+
    '<div class="search gsearch"><input id="glq" type="text" placeholder="Filtrar el glosario… (p. ej. «recall», «kernel»)" aria-label="Filtrar glosario"></div>'+
    '<dl class="glist" id="glist">'+GLOS.slice().sort(function(a,b){ return a[0].localeCompare(b[0], "es"); }).map(function(g){
      return '<div class="gi" data-k="'+sinAcentos((g[0]+" "+g[1].join(" ")+" "+g[2]).toLowerCase()).replace(/"/g,"")+'"><dt>'+g[0]+'</dt><dd>'+g[2]+'</dd></div>';
    }).join("")+'</dl></section>';
  h += '<section class="fblock"><h3 class="fbh">📚 Lecturas recomendadas</h3><ul class="lect">'+
    LECTURAS.map(function(l){ return '<li><b>'+l[0]+'</b><span>'+l[1]+'</span></li>'; }).join("")+'</ul></section>';
  host.innerHTML = h;
  host.dataset.done = "1";
  var glq = document.getElementById("glq");
  glq.addEventListener("input", function(){
    var v = sinAcentos(glq.value.trim().toLowerCase());
    [].forEach.call(document.querySelectorAll("#glist .gi"), function(g){ g.classList.toggle("hidden", v !== "" && g.dataset.k.indexOf(v) === -1); });
  });
  [].forEach.call(host.querySelectorAll("details.fcard"), function(d){
    d.addEventListener("toggle", function(){ if(d.open && !d.dataset.gl){ d.dataset.gl = 1; glossLink(d); } });
  });
}
function openFund(id){
  var d = document.getElementById("fund-" + id);
  if(!d) return;
  if(d.tagName === "DETAILS") d.open = true;
  setTimeout(function(){ d.scrollIntoView({block:"start"}); d.querySelector("summary").focus({preventScroll:true}); }, 120);
}

/* ══════════════════════════════════════════════════════════════
   TEMA CLARO / OSCURO
   ══════════════════════════════════════════════════════════════ */
function currentTheme(){
  var a = document.documentElement.getAttribute("data-theme");
  if(a) return a;
  return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function initTheme(){
  var b = document.getElementById("themeBtn"); if(!b) return;
  var paint = function(){ var d = currentTheme() === "dark"; b.textContent = d ? "☀️" : "🌙"; b.setAttribute("aria-pressed", d ? "true" : "false"); };
  b.addEventListener("click", function(){
    var n = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", n);
    try{ localStorage.setItem("mllab_theme", n); }catch(e){}
    paint(); labRemount();
  });
  paint();
}


/* ══════════════════════════════════════════════════════════════
   FUNDAMENTOS — los conceptos que sostienen a TODOS los modelos.
   Cada concepto: s = explicación sencilla · an = analogía ·
   ej = ejemplo con números · err = el error típico de junior ·
   cod = código mínimo (opcional) · lab = laboratorio · rel = modelos
   ══════════════════════════════════════════════════════════════ */
var FUND = [
{b:"1 · La base: qué es aprender de datos", items:[
 {id:"modelo",ic:"🧩",t:"Qué es un modelo",f:"Una función que aprende de ejemplos a convertir entradas en una salida.",
  s:"Un modelo es una fórmula que no escribes tú: la <b>aprende</b> a partir de ejemplos. Le das filas con las <b>variables de entrada</b> (features, la X: edad, gasto, antigüedad) y, en supervisado, la <b>respuesta</b> (target, la y: se dio de baja sí/no). El entrenamiento ajusta los parámetros del modelo para que sus predicciones se parezcan lo máximo posible a las respuestas reales.",
  an:"Como un aprendiz de tasador que ve 8.000 pisos ya vendidos con su precio y, a fuerza de ver ejemplos, aprende a poner precio a un piso que no ha visto nunca.",
  ej:"Tabla de 10.000 clientes × 12 columnas (X) + una columna «baja» (y). El modelo aprende y, para un cliente nuevo, devuelve: «probabilidad de baja = 0,23».",
  err:"Pensar que el modelo «entiende» el negocio. Solo ha visto patrones en tus datos: si los datos están sesgados o no contienen la señal, el modelo tampoco la tendrá.",
  rel:["linsimple","logistica","arbol"]},
 {id:"tipos",ic:"🧭",t:"Supervisado, no supervisado y refuerzo",f:"Con respuesta conocida, sin respuesta, o aprendiendo de recompensas.",
  s:"<b>Supervisado</b>: tienes la respuesta en el histórico y quieres predecirla (regresión si es un número, clasificación si es una categoría). <b>No supervisado</b>: no hay respuesta; buscas estructura (grupos, anomalías, resúmenes). <b>Refuerzo</b>: un agente toma decisiones una tras otra y aprende de la recompensa que recibe.",
  an:"Supervisado = estudiar con el solucionario. No supervisado = ordenar una caja de fotos sin que nadie te diga las categorías. Refuerzo = aprender a montar en bici a base de caerte.",
  ej:"«¿Cuánto venderé?» → regresión. «¿Se irá este cliente?» → clasificación. «¿Qué tipos de cliente tengo?» → clustering. «¿Qué precio pongo hoy para maximizar el margen del mes?» → refuerzo (o un bandit).",
  err:"Elegir el algoritmo antes de definir la pregunta. Primero el tipo de problema; el modelo viene después (el árbol de «Elegir modelo» te guía).",
  rel:["kmeans","bandit"]},
 {id:"baseline",ic:"📏",t:"La línea base (baseline)",f:"La regla tonta que tu modelo tiene que batir.",
  s:"Antes de entrenar nada, calcula qué resultado da la solución más simple posible: predecir siempre la media, la clase más frecuente o «lo mismo que la semana pasada». Tu modelo solo aporta valor si mejora esa cifra <b>de forma clara</b>.",
  an:"Si un adivino acierta el tiempo de mañana el 70% de las veces, pero decir «mañana hará lo mismo que hoy» acierta el 68%, el adivino casi no aporta nada.",
  ej:"Churn del 3%: decir «nadie se va» da un 97% de accuracy. Un modelo con 96,5% de accuracy es PEOR que no hacer nada. En series: el pronóstico ingenuo estacional (mismo valor que hace un año) es la línea base obligatoria.",
  err:"Presentar «el modelo tiene un 85% de acierto» sin decir cuánto acertaba la regla trivial.",
  cod:"from sklearn.dummy import DummyClassifier, DummyRegressor\n\nbase = DummyClassifier(strategy='most_frequent').fit(X_tr, y_tr)\nprint('Baseline:', base.score(X_te, y_te))",
  rel:["automl","hw"]}
]},
{b:"2 · Entrenar sin hacerse trampas", items:[
 {id:"split",ic:"✂️",t:"Train, validación y test",f:"Nunca evalúes con los mismos datos con los que aprendes.",
  s:"Divide los datos en tres: <b>train</b> (para aprender), <b>validación</b> (para elegir ajustes y comparar modelos) y <b>test</b> (se mira una sola vez, al final, para saber cómo irá en la vida real). Si usas el test para decidir cosas, deja de ser una estimación honesta.",
  an:"Train = los ejercicios del libro. Validación = los exámenes de prueba. Test = el examen final, que no ves hasta el día del examen.",
  ej:"10.000 filas → 6.000 train, 2.000 validación, 2.000 test. Con datos temporales, NO al azar: train = 2022-2024, validación = primer semestre de 2025, test = segundo semestre de 2025.",
  err:"Partir al azar datos que tienen orden temporal o grupos (el mismo cliente en train y en test). El modelo «ve el futuro» o reconoce al cliente y el resultado es una fantasía.",
  cod:"from sklearn.model_selection import train_test_split\n\nX_tr, X_te, y_tr, y_te = train_test_split(\n    X, y, test_size=0.2, stratify=y, random_state=42)   # stratify: misma % de cada clase",
  rel:["xgboost","arima"]},
 {id:"overfit",ic:"🎯",t:"Sobreajuste y subajuste",f:"Memorizar el ruido frente a no captar el patrón.",
  s:"Un modelo <b>sobreajusta</b> cuando memoriza los datos de entrenamiento, incluido su ruido: va de maravilla en train y mal en test. <b>Subajusta</b> cuando es demasiado simple: falla en los dos. El objetivo es el punto intermedio. Esta tensión se llama <b>compromiso sesgo-varianza</b>: los modelos simples tienen sesgo (se equivocan siempre de la misma forma) y los complejos, varianza (cambian mucho con cada muestra).",
  an:"El alumno que se aprende de memoria las respuestas del examen del año pasado saca un 10 en ese examen y un 3 en el nuevo. El que no ha estudiado saca un 3 en los dos.",
  ej:"Árbol sin límite de profundidad: 100% de acierto en train, 62% en test → sobreajuste. Regresión lineal sobre una relación en forma de U: 55% en train y 54% en test → subajuste. Árbol de profundidad 5: 81% y 79% → bien.",
  err:"Mirar solo el resultado de entrenamiento. La pregunta siempre es: ¿cuánto empeora en datos que no ha visto?",
  lab:"sobreajuste",rel:["arbol","ridge","knn"]},
 {id:"cv",ic:"🔁",t:"Validación cruzada",f:"Evaluar varias veces rotando el trozo de prueba.",
  s:"En vez de un único split, divides los datos en k trozos (normalmente 5): entrenas con 4 y evalúas con el quinto, y repites rotando. Obtienes 5 resultados: su media es más fiable y su dispersión te dice lo estable que es el modelo.",
  an:"No juzgas a un jugador por un solo partido: miras su media en la temporada y si es regular o irregular.",
  ej:"AUC por fold: 0,81 · 0,83 · 0,80 · 0,82 · 0,79 → media 0,81 ± 0,015. Si otro modelo da 0,815 ± 0,04, la diferencia es ruido.",
  err:"Usar KFold normal en series temporales (usa TimeSeriesSplit) o cuando hay varias filas por cliente (usa GroupKFold).",
  cod:"from sklearn.model_selection import cross_val_score, TimeSeriesSplit\n\nscores = cross_val_score(modelo, X, y, cv=5, scoring='roc_auc')\nprint(scores.mean().round(3), '±', scores.std().round(3))\n# series temporales: cv=TimeSeriesSplit(n_splits=5)",
  rel:["lasso","xgboost"]},
 {id:"leakage",ic:"🕳️",t:"Data leakage (fuga de información)",f:"El error que hace que un modelo perfecto falle en producción.",
  s:"Hay fuga cuando el modelo usa, al entrenar, información que <b>no tendrá</b> en el momento real de predecir. Dos formas típicas: variables que se generan después del evento (p. ej., «nº de llamadas de recobro» para predecir el impago) y preprocesado calculado con todos los datos antes de partir (medias, escalados, encodings).",
  an:"Es como predecir quién ganará la carrera mirando la foto del podio.",
  ej:"Modelo de churn con AUC 0,99 en validación. Causa: la variable «motivo_de_baja» solo está rellena en los que ya se han ido. En producción, AUC 0,60.",
  err:"Celebrar un resultado demasiado bueno. Regla práctica: si algo parece demasiado bueno para ser verdad, busca la fuga antes de enseñarlo.",
  cod:"from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\n# El Pipeline aprende el escalado SOLO con train en cada fold: sin fugas\nmodelo = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))",
  rel:["catboost","automl"]},
 {id:"prepro",ic:"🧼",t:"Preprocesado: escalar, codificar, nulos",f:"Dejar los datos en el idioma que entiende cada modelo.",
  s:"<b>Escalar</b>: poner las variables en escalas comparables (media 0, desviación 1). Imprescindible en modelos que usan distancias o penalizaciones (KNN, SVM, K-Means, Ridge, redes); los árboles no lo necesitan. <b>Codificar</b>: convertir categorías en números (one-hot, ordinal o target encoding). <b>Nulos</b>: imputar (media, mediana, «desconocido») o usar modelos que los toleran (XGBoost, LightGBM).",
  an:"Si una variable va en euros (0-50.000) y otra en años (0-80), para un modelo de distancias la de euros «grita» y la de años «susurra», aunque importe más.",
  ej:"Gasto 1.200 € y edad 35 → tras estandarizar: gasto 0,4 y edad −0,2. Ahora pesan por su información, no por su unidad.",
  err:"Escalar o imputar antes del split (fuga) y meter un código postal como número (28050 no es «mayor» que 28001).",
  cod:"from sklearn.compose import ColumnTransformer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.pipeline import make_pipeline\n\nprep = ColumnTransformer([\n    ('num', make_pipeline(SimpleImputer(strategy='median'), StandardScaler()), num_cols),\n    ('cat', OneHotEncoder(handle_unknown='ignore'), cat_cols)])",
  rel:["kmeans","svmker","catboost"]}
]},
{b:"3 · Cómo aprende un modelo", items:[
 {id:"loss",ic:"⛰️",t:"Función de pérdida y descenso de gradiente",f:"Medir el error y bajarlo paso a paso.",
  s:"La <b>función de pérdida</b> es una fórmula que mide cuánto se equivoca el modelo (por ejemplo, la media del error al cuadrado). Entrenar es buscar los parámetros que la hacen mínima. El <b>descenso de gradiente</b> lo hace como quien baja una montaña con niebla: mira hacia dónde baja el terreno y da un paso en esa dirección. El tamaño del paso es el <b>learning rate</b>.",
  an:"Bajar una montaña de noche con linterna: no ves el valle, pero sí la pendiente bajo tus pies. Pasos muy cortos: tardas una eternidad. Pasos enormes: saltas de una ladera a otra y no llegas nunca.",
  ej:"Learning rate 0,01: 400 pasos para converger. 0,1: 40 pasos. 0,3: la pérdida sube en cada paso → diverge. Pruébalo en el laboratorio 3D.",
  err:"Bajar el learning rate en boosting o redes sin subir el número de iteraciones: el modelo se queda a medio camino.",
  lab:"descenso",rel:["mlp","gbr","xgboost","logistica"]},
 {id:"regul",ic:"🧲",t:"Regularización",f:"Penalizar la complejidad para que el modelo generalice.",
  s:"Consiste en añadir a la pérdida un castigo por complejidad: coeficientes grandes (Ridge, Lasso), árboles profundos (max_depth), demasiadas hojas, neuronas «apagadas» al azar (dropout). El modelo pierde un poco de ajuste en train a cambio de funcionar mejor con datos nuevos.",
  an:"Un presupuesto limitado para explicar los datos: no puedes gastar en detalles irrelevantes, así que te centras en lo que importa.",
  ej:"Regresión con 80 variables y 500 filas: sin regularizar, R² = 0,92 en train y 0,41 en test. Con Lasso: 0,78 y 0,74, y solo 9 variables con peso.",
  err:"Regularizar sin estandarizar (castigas por unidades, no por importancia) y fijar la fuerza a ojo en vez de con validación cruzada.",
  lab:"regul",rel:["ridge","lasso","elastic","xgboost"]},
 {id:"hiper",ic:"🎛️",t:"Parámetros e hiperparámetros",f:"Lo que aprende el modelo frente a lo que decides tú.",
  s:"Los <b>parámetros</b> los aprende el modelo (los coeficientes de una regresión, los cortes de un árbol). Los <b>hiperparámetros</b> los fijas tú antes de entrenar (profundidad máxima, número de árboles, K, learning rate). Se eligen probando combinaciones con validación cruzada: búsqueda en rejilla, aleatoria u optimización bayesiana (Optuna).",
  an:"Una receta: la cantidad de sal que «aprende» el cocinero probando es un parámetro; la temperatura del horno que eliges antes de empezar es un hiperparámetro.",
  ej:"Random Forest: probar max_depth ∈ {4, 8, 12, None} × min_samples_leaf ∈ {1, 5, 20} = 12 combinaciones × 5 folds = 60 entrenamientos.",
  err:"Elegir hiperparámetros mirando el test. Para eso está la validación.",
  cod:"from sklearn.model_selection import RandomizedSearchCV\n\nbusca = RandomizedSearchCV(modelo, {'max_depth': [4, 8, 12, None],\n                                   'min_samples_leaf': [1, 5, 20]},\n                           n_iter=10, cv=5, scoring='roc_auc', random_state=42)\nbusca.fit(X_tr, y_tr); print(busca.best_params_)",
  rel:["rf","lightgbm"]},
 {id:"ensemble",ic:"🌲",t:"Ensembles: bagging y boosting",f:"Muchos modelos mediocres que juntos son excelentes.",
  s:"<b>Bagging</b>: entrenas muchos modelos en paralelo, cada uno con una muestra distinta de los datos, y promedias (Random Forest). Reduce la varianza: los errores individuales se compensan. <b>Boosting</b>: entrenas modelos en cadena y cada uno corrige el error del anterior (XGBoost, LightGBM, CatBoost). Reduce el sesgo. En datos tabulares, el boosting es el rey de la precisión.",
  an:"Bagging = la media de 500 opiniones independientes. Boosting = un equipo en cadena donde cada persona revisa y corrige lo que hizo la anterior.",
  ej:"Árbol solo: 74% en test. Random Forest de 300 árboles: 81%. XGBoost ajustado: 83%.",
  err:"Pensar que más árboles en boosting siempre es mejor: sin parada temprana (early stopping) acaba sobreajustando. En Random Forest, en cambio, más árboles nunca empeora.",
  lab:"arbol2d",rel:["rf","xgboost","adaboost","gbr"]},
 {id:"distancia",ic:"📐",t:"Distancias y maldición de la dimensionalidad",f:"«Parecido» es una distancia, y en muchas dimensiones se estropea.",
  s:"Muchos modelos deciden por <b>parecido</b>: KNN, K-Means, DBSCAN, SVM con kernel RBF. El parecido se mide con una distancia (euclídea, Manhattan, coseno). Con muchas variables, el espacio es tan enorme que todos los puntos acaban casi igual de lejos unos de otros, y «el vecino más cercano» deja de significar algo.",
  an:"En una habitación, encontrar a la persona más cercana es fácil. Reparte a esas 50 personas por todo el planeta y todas quedan «lejísimos», casi a la misma distancia de ti.",
  ej:"Con 2 variables, el vecino más cercano está a 0,1 y el más lejano a 1,4. Con 500 variables aleatorias, el más cercano queda a unas 8,6 unidades y el más lejano a unas 9,8: casi lo mismo.",
  err:"Usar KNN o K-Means con cientos de columnas sin reducir antes (PCA) o sin escalar.",
  lab:"pca3d",rel:["knn","kmeans","pca","umap"]}
]},
{b:"4 · Medir bien", items:[
 {id:"metreg",ic:"📊",t:"Métricas de regresión",f:"MAE, RMSE, R² y MAPE: qué dice cada una.",
  s:"<b>MAE</b>: cuánto te equivocas de media, en las unidades del target (euros, unidades). <b>RMSE</b>: parecido, pero castiga mucho más los errores grandes. <b>R²</b>: qué parte de la variación explica el modelo (de 0 a 1). <b>MAPE</b>: error en porcentaje; fácil de comunicar pero explota cuando el valor real es cercano a cero.",
  an:"MAE = «de media me equivoco en 12 €». RMSE = lo mismo, pero si un día te equivocas en 500 €, te lo recuerda mucho.",
  ej:"Errores de 10, 10, 10 y 100 €: MAE = 32,5 € · RMSE = 50,7 € (raíz de (3·10² + 100²)/4 = √2.575). El RMSE delata el error grande; el MAE lo diluye.",
  err:"Comparar el RMSE entre problemas con escalas distintas, o reportar MAPE con ventas cercanas a cero (un error de 2 unidades sobre 1 es un 200%).",
  rel:["linmult","gbr","quantile"]},
 {id:"metclf",ic:"🧮",t:"Matriz de confusión, precision y recall",f:"Contar bien los aciertos y los dos tipos de error.",
  s:"La <b>matriz de confusión</b> cruza lo real con lo predicho: verdaderos positivos (TP), falsos positivos (FP, falsas alarmas), falsos negativos (FN, casos que se te escapan) y verdaderos negativos (TN). <b>Precision</b> = TP / (TP + FP): de lo que marco, cuánto es verdad. <b>Recall</b> = TP / (TP + FN): de lo que existe, cuánto encuentro. <b>F1</b> combina las dos.",
  an:"Una red de pesca. Precision: de lo que saco, qué parte son peces y no botas. Recall: de todos los peces del lago, cuántos he pescado. Una red más grande pesca más peces (recall ↑) pero también más botas (precision ↓).",
  ej:"100 fraudes entre 10.000 operaciones. El modelo marca 200: 80 fraudes reales. Precision = 80/200 = 40% · Recall = 80/100 = 80% · Accuracy = (80 + 9.780)/10.000 = 98,6%, que no dice nada útil.",
  err:"Reportar accuracy con clases desbalanceadas. Y olvidar que precision y recall dependen del umbral que elijas.",
  lab:"umbral",rel:["logistica","xgboost","nb"]},
 {id:"auc",ic:"📈",t:"ROC-AUC y PR-AUC",f:"Medir lo bien que ordena el modelo, sin fijar umbral.",
  s:"<b>ROC-AUC</b>: probabilidad de que el modelo dé más puntuación a un positivo al azar que a un negativo al azar (0,5 = moneda al aire; 1 = perfecto). <b>PR-AUC</b>: área bajo la curva precision-recall; es mucho más exigente y honesta cuando los positivos son raros, porque su línea base es la tasa de positivos (p. ej., 0,02) y no 0,5.",
  an:"La ROC-AUC pregunta: «si cojo un culpable y un inocente al azar, ¿cuántas veces pone el modelo al culpable por delante?».",
  ej:"Fraude con un 1% de positivos: ROC-AUC = 0,95 (parece genial) pero PR-AUC = 0,30. Traducción: en el top de alertas, 7 de cada 10 siguen siendo falsas alarmas.",
  err:"Elegir modelo por ROC-AUC en un problema muy desbalanceado. Usa PR-AUC y, sobre todo, la métrica en la capacidad real (recall@300 si tu equipo revisa 300 casos).",
  lab:"umbral",rel:["logistica","xgboost","lightgbm"]},
 {id:"umbral",ic:"🎚️",t:"El umbral de decisión",f:"El 0,5 por defecto casi nunca es el correcto.",
  s:"Un clasificador devuelve una probabilidad; el <b>umbral</b> la convierte en decisión. El umbral correcto sale de los costes de negocio: cuánto cuesta un falso positivo (llamar a un cliente que no se iba) frente a un falso negativo (perder a uno que sí se iba).",
  an:"Una alarma antiincendios: si es muy sensible, salta con las tostadas; si es poco sensible, no salta con el fuego. Dónde la pones depende de lo que cuesta cada error.",
  ej:"Llamar cuesta 5 €; perder un cliente, 300 €. Si la llamada lo retiene siempre, compensa llamar cuando p × 300 > 5, es decir, si p > 1,7%: tu umbral no es 0,5, es 0,017. Si la llamada solo retiene a 1 de cada 3, compensa cuando p × 300 × ⅓ > 5 → p > 5%. El umbral sale de la economía de la acción, no del modelo.",
  err:"Dejar predict() con el 0,5 implícito. Usa predict_proba() y decide tú el corte.",
  lab:"umbral",rel:["logistica","rf","xgboost"]},
 {id:"desbalanceo",ic:"⚖️",t:"Clases desbalanceadas",f:"Cuando lo importante es lo raro.",
  s:"Pasa cuando una clase es mucho más rara que otra (2% de fraude, 3% de bajas). Soluciones, de más a menos recomendable: usar métricas adecuadas (PR-AUC, recall), <b>ajustar el umbral</b>, dar más peso a la clase rara (class_weight, scale_pos_weight) y, con cuidado, remuestrear (SMOTE). Rebalancear distorsiona las probabilidades: si las usas como tales, recalibra.",
  an:"Buscar 20 agujas en un pajar de 1.000 pajas: decir «todo es paja» acierta el 98%, pero no encuentra ni una aguja.",
  ej:"Con 2% de positivos, un modelo con recall 0,70 y precision 0,25 puede ser excelente para negocio si revisar un caso es barato y perderlo, caro.",
  err:"Aplicar SMOTE antes del split (fuga: los sintéticos se basan en filas de test) o evaluar sobre datos rebalanceados.",
  lab:"umbral",rel:["xgboost","logistica","iforest"]},
 {id:"calibracion",ic:"🎯",t:"Calibración de probabilidades",f:"Que un 70% signifique de verdad un 70%.",
  s:"Un modelo está <b>calibrado</b> si, de todos los casos a los que da un 70%, el evento ocurre en torno al 70%. Muchos modelos ordenan bien pero dan probabilidades descalibradas (Naive Bayes, Random Forest, SVM, modelos con class_weight). Importa cuando la probabilidad se usa como número: pricing, pérdida esperada, pujas.",
  an:"El hombre del tiempo que dice «70% de lluvia» está calibrado si llueve 7 de cada 10 días en que lo dice.",
  ej:"Random Forest dice «0,60» a 1.000 clientes y solo se van 420 (42%). Ordena bien, pero el 0,60 no es una probabilidad real. Calibrado con isotónica, pasa a decir 0,42.",
  err:"Multiplicar una probabilidad sin calibrar por un importe para calcular la pérdida esperada.",
  cod:"from sklearn.calibration import CalibratedClassifierCV\n\ncal = CalibratedClassifierCV(modelo, method='isotonic', cv=5).fit(X_tr, y_tr)\nproba = cal.predict_proba(X_te)[:, 1]",
  rel:["rf","nb","lightgbm"]}
]},
{b:"5 · Explicar y decidir", items:[
 {id:"explicar",ic:"🔍",t:"Explicabilidad: importancia, SHAP y PDP",f:"Abrir la caja negra para que negocio confíe.",
  s:"<b>Importancia por permutación</b>: desordenas una variable y mides cuánto empeora el modelo. <b>SHAP</b>: reparte cada predicción entre las variables («esta denegación: +0,12 por ingresos bajos, +0,08 por impagos previos»). <b>PDP / ICE</b>: cómo cambia la predicción al mover una variable. Responden a «qué usa el modelo», no a «qué causa el resultado».",
  an:"El informe del árbitro tras el partido: no cambia el resultado, pero explica qué jugadas lo decidieron.",
  ej:"SHAP de un cliente: base 0,05 · +0,09 por «sin permanencia» · +0,06 por «3 tickets este mes» · −0,02 por «antigüedad 4 años» → probabilidad 0,18.",
  err:"Leer SHAP como causalidad («si bajo los tickets, bajará el churn») y usar feature_importances_ por impureza, que favorece las variables con muchos valores distintos.",
  cod:"import shap\n\nexplainer = shap.TreeExplainer(modelo_xgb)\nsv = explainer(X_te)\nshap.plots.beeswarm(sv)          # visión global\nshap.plots.waterfall(sv[0])      # un cliente concreto",
  rel:["xgboost","rf","logistica"]},
 {id:"causal",ic:"🧪",t:"Correlación no es causalidad",f:"Predecir quién compra no es saber qué le hace comprar.",
  s:"Un modelo predictivo encuentra asociaciones: qué va junto con qué. Para saber si una acción <b>causa</b> un efecto necesitas comparar con lo que habría pasado sin ella (el contrafactual). La forma más limpia es un experimento aleatorizado (test A/B); sin él, técnicas como Diff-in-Diff o el emparejamiento por propensión, con supuestos que hay que defender.",
  an:"En verano se venden más helados y hay más ahogamientos. Prohibir los helados no salvará a nadie: el calor causa las dos cosas.",
  ej:"Los clientes que reciben más emails compran más. ¿Funcionan los emails? Puede que marketing ya mandara más emails a los mejores clientes. Solo un grupo de control aleatorio lo aclara.",
  err:"Recomendar «sube la variable X» porque el modelo dice que X es importante.",
  rel:["uplift","propensity","bayesnet"]},
 {id:"series",ic:"⏱️",t:"Particularidades de las series temporales",f:"El orden importa: nunca mezcles pasado y futuro.",
  s:"En series temporales cada dato depende de los anteriores. Tres reglas: valida siempre <b>hacia delante</b> (entrena con el pasado, evalúa con el futuro), crea variables solo con información disponible en el momento de predecir (retardos, medias móviles del pasado) y compara siempre con el pronóstico ingenuo (mismo valor de la semana o del año anterior).",
  an:"Para evaluar a un meteorólogo no le das el tiempo de mañana para que «prediga» el de hoy.",
  ej:"Ventas diarias de 2022 a 2025: entrena hasta junio de 2025, predice julio; luego entrena hasta julio y predice agosto… (backtesting con ventana deslizante).",
  err:"Usar train_test_split aleatorio en una serie, o calcular una media móvil centrada que usa días futuros.",
  lab:"serie",rel:["arima","sarima","prophet","hw"]}
]},
{b:"6 · Del notebook a la realidad", items:[
 {id:"mlops",ic:"🚀",t:"Producción, drift y monitorización",f:"Un modelo desplegado empieza a envejecer el primer día.",
  s:"En producción, el mundo cambia: nuevos clientes, nuevos productos, crisis, cambios de precio. Esto es el <b>drift</b>: cambian los datos de entrada (data drift) o la relación entre las variables y el target (concept drift). Un modelo vivo necesita monitorizar sus entradas y su rendimiento, versionar datos y modelos, y un plan de reentrenamiento.",
  an:"Un mapa de carreteras de 2019 sigue siendo útil, pero cada año acierta un poco menos.",
  ej:"Modelo de fraude con recall 0,80 en enero. En noviembre (Black Friday y nuevos patrones de ataque) cae a 0,55 sin que nadie toque el código.",
  err:"Considerar el proyecto terminado cuando el notebook funciona. El 80% del trabajo real viene después.",
  rel:["iforest","xgboost","pyspark"]},
 {id:"y2026",ic:"🛰️",t:"Qué ha cambiado en 2025-2026",f:"Modelos fundacionales, LLMs y agentes: qué significa para un analista.",
  s:"<b>Modelos fundacionales tabulares</b>: TabPFN-2.5 (nov. 2025) predice sin entrenar en datasets de hasta 50.000 filas y gana a XGBoost por defecto en tablas pequeñas y medianas. <b>Series temporales</b>: Chronos-2 (con covariables), TimesFM 2.5 o Moirai dan pronósticos sin ajuste («zero-shot»). <b>LLMs</b>: extracción de texto, clasificación con prompts y agentes que escriben pipelines. <b>Post-entrenamiento de LLMs</b>: GRPO y recompensas verificables desplazan al RLHF clásico con PPO. <b>Regulación</b>: el Digital Omnibus aplaza al 2 de diciembre de 2027 las obligaciones de alto riesgo del AI Act (incluido el credit scoring); las de transparencia (art. 50) rigen desde el 2 de agosto de 2026, con margen hasta el 2 de diciembre de 2026 para marcar el contenido generado por IA de sistemas ya en el mercado.",
  an:"Las herramientas nuevas son calculadoras más potentes; tu criterio (qué pregunta, qué métrica, qué fuga, qué decisión) sigue siendo lo que te hace valioso.",
  ej:"Flujo realista hoy: baseline simple → boosting → probar TabPFN si hay pocas filas → comparar con validación honesta → explicar con SHAP → decidir con el coste de negocio.",
  err:"Saltarte los fundamentos porque «la IA lo hace sola». La IA optimiza la métrica que le des, también una mal planteada.",
  rel:["xgboost","transformer","ppo","automl"]}
]}
];

function FUND_COUNT(){ return FUND.reduce(function(a,b){ return a + b.items.length; }, 0); }

/* Plan de estudio: 12 semanas, octubre 2026 → enero 2027 */
var PLAN = [
 ["Semanas 1-2","Fundamentos 1-2 + regresión lineal simple y múltiple","Haz el laboratorio de sobreajuste y repite el notebook de precio de viviendas explicando cada coeficiente en voz alta."],
 ["Semanas 3-4","Métricas (bloque 4) + regresión logística, árbol y KNN","Laboratorio del umbral: calcula a mano precision y recall para tres umbrales. Notebook de churn."],
 ["Semanas 5-6","Regularización y ensembles: Ridge, Lasso, Random Forest, XGBoost, LightGBM","Laboratorios de regularización y del árbol frente al bosque. Compara 4 modelos con validación cruzada y SHAP."],
 ["Semanas 7-8","No supervisado: K-Means, jerárquico, DBSCAN, PCA, Isolation Forest","Laboratorios 3D de K-Means y PCA. Segmenta clientes y presenta 1 diapositiva por segmento."],
 ["Semanas 9-10","Series temporales: Holt-Winters, ARIMA/SARIMA, Prophet, backtesting","Laboratorio de series: entiende por qué el ingenuo estacional es tan difícil de batir. Después, tu notebook de ventas con validación hacia delante."],
 ["Semanas 11-12","Causalidad, supervivencia y un vistazo a deep learning","Proyecto final de portfolio: pregunta de negocio → baseline → modelo → métrica de negocio → decisión."]
];

var LECTURAS = [
 ["<i>An Introduction to Statistical Learning with Python</i> (James, Witten, Hastie, Tibshirani, Taylor, 2023)","El mejor libro para entender cada modelo sin ahogarte en matemáticas. Gratis en statlearning.com."],
 ["<i>Hands-On Machine Learning with Scikit-Learn and PyTorch</i> (Aurélien Géron)","La referencia práctica con código. La edición más reciente sustituye TensorFlow por PyTorch."],
 ["Guía de usuario de scikit-learn (versión 1.9, junio de 2026)","Cada modelo con su explicación, parámetros y ejemplos ejecutables. Úsala como diccionario."],
 ["<i>Forecasting: Principles and Practice</i> (Hyndman y Athanasopoulos, 3.ª ed.)","La biblia de las series temporales, gratis en otexts.com/fpp3."],
 ["<i>Causal Inference for the Brave and True</i> (Matheus Facure)","Causalidad aplicada con Python y humor. Gratis en línea."],
 ["StatQuest (Josh Starmer, YouTube)","Vídeos cortos que explican cada algoritmo con dibujos. Ideal antes de leer la ficha."],
 ["Grinsztajn et al., «Why do tree-based models still outperform deep learning on tabular data?» (NeurIPS 2022)","El paper que explica por qué el boosting sigue mandando en tablas."],
 ["Hollmann et al., TabPFN (<i>Nature</i>, 2025) y el informe técnico TabPFN-2.5 (arXiv 2511.08667)","El estado del arte de los modelos fundacionales tabulares."],
 ["Sutton y Barto, <i>Reinforcement Learning: An Introduction</i> (2.ª ed.)","El libro de referencia del refuerzo. Gratis en línea."]
];


/* ══════════════════════════════════════════════════════════════
   LABORATORIO VISUAL — motor común
   Cada laboratorio: {id, ic, t, q, dim, intro, notice[], models[],
   build(stage, ctl, read, C) → función de limpieza}.
   Los 2D usan <canvas>; los 3D cargan three.js bajo demanda
   (solo cuando se abre uno), así el manual sigue siendo ligero.
   ══════════════════════════════════════════════════════════════ */
var LABS = [];
/* VIZ: un visual propio por modelo. Mismo contrato que un laboratorio
   {id, model, ic, dim, t, q, intro, notice[], models[], build(stage, ctl, read, C)}.
   alias: id de un laboratorio existente que ya es el visual canónico del modelo. */
var VIZ = [];
function labById(id){ return LABS.filter(function(x){ return x.id === id; })[0] || VIZ.filter(function(x){ return x.id === id; })[0]; }
var LAB_ACTIVE = [];
var LAB_CUR = null;

function labCleanupAll(){
  LAB_ACTIVE.forEach(function(f){ try{ f(); }catch(e){} });
  LAB_ACTIVE = [];
}
function labRemount(){
  if(!LAB_CUR || !document.body.contains(LAB_CUR.host)) return;
  labCleanupAll(); mountLab(LAB_CUR.id, LAB_CUR.host, LAB_CUR.opts);
}
function cssv(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
var LABFONT = "'Segoe UI', system-ui, -apple-system, sans-serif";
function labColors(){
  return {c:[cssv("--lab1"),cssv("--lab2"),cssv("--lab3"),cssv("--lab4"),cssv("--lab5"),cssv("--lab6")],
          ink:cssv("--ink"), text:cssv("--text"), muted:cssv("--muted"), line:cssv("--line"),
          bg:cssv("--bg"), card:cssv("--card"), soft:cssv("--accent-soft"),
          pos:cssv("--positive"), neg:cssv("--negative"), accent:cssv("--accent"), font:LABFONT};
}
function hexA(hex, a){
  var h = hex.replace("#","");
  if(h.length === 3) h = h.split("").map(function(x){ return x + x; }).join("");
  var n = parseInt(h, 16);
  return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
}
function mulberry(seed){
  return function(){
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function gauss(r){ var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function fmt(x, d){ return (d === undefined ? x.toFixed(2) : x.toFixed(d)).replace(".", ","); }
function pct(x, d){ return fmt(100 * x, d === undefined ? 1 : d) + "%"; }

/* ── controles reutilizables ── */
function ctlSlider(host, label, min, max, step, val, show, onInput){
  var w = document.createElement("label"); w.className = "lctl";
  w.innerHTML = '<span class="lcl">' + label + '</span><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"><output></output>';
  var inp = w.querySelector("input"), out = w.querySelector("output");
  var paint = function(){ out.textContent = show(+inp.value); };
  inp.addEventListener("input", function(){ paint(); onInput(+inp.value); });
  paint(); host.appendChild(w);
  return {input:inp, set:function(v){ inp.value = v; paint(); }};
}
function ctlBtn(host, label, onClick, solid){
  var b = document.createElement("button"); b.type = "button";
  b.className = "lbtn" + (solid ? " solid" : ""); b.innerHTML = label;
  b.addEventListener("click", onClick); host.appendChild(b); return b;
}
function ctlSeg(host, label, opts, val, onChange){
  var w = document.createElement("div"); w.className = "lctl lseg";
  w.innerHTML = '<span class="lcl">' + label + '</span><div class="segs" role="group" aria-label="' + label + '">' +
    opts.map(function(o){ return '<button type="button" data-v="' + o[0] + '" aria-pressed="' + (o[0] == val) + '" class="' + (o[0] == val ? "on" : "") + '">' + o[1] + '</button>'; }).join("") + '</div>';
  [].forEach.call(w.querySelectorAll("button"), function(b){
    b.addEventListener("click", function(){
      [].forEach.call(w.querySelectorAll("button"), function(x){ var on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on); });
      onChange(b.dataset.v);
    });
  });
  host.appendChild(w); return w;
}
function ctlCheck(host, label, val, onChange){
  var w = document.createElement("label"); w.className = "lctl lchk";
  w.innerHTML = '<input type="checkbox"' + (val ? " checked" : "") + '><span>' + label + '</span>';
  var i = w.querySelector("input"); i.addEventListener("change", function(){ onChange(i.checked); });
  host.appendChild(w); return i;
}
function makeCanvas(stage, W, H, label){
  var cv = document.createElement("canvas"); cv.className = "labcv";
  cv.setAttribute("role", "img"); cv.setAttribute("aria-label", label || "Visualización interactiva");
  /* resolución interna 2× (como mínimo): el canvas puede crecer hasta el ancho del contenedor
     sin pixelarse, y el CSS lo limita por ancho y por alto conservando la proporción */
  var dpr = Math.max(2, Math.min(window.devicePixelRatio || 1, 3));
  cv.width = W * dpr; cv.height = H * dpr; cv.style.aspectRatio = W + " / " + H;
  var ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  stage.appendChild(cv);
  /* gráficos apaisados: en móvil conservan un ancho mínimo legible y se deslizan en horizontal */
  if(W >= 700){
    cv.classList.add("labcv-wide");
    var hint = document.createElement("div"); hint.className = "labswipe"; hint.textContent = "Desliza el gráfico en horizontal para verlo entero →";
    if(stage.parentNode) stage.parentNode.insertBefore(hint, stage);
  }
  return {cv:cv, ctx:ctx, W:W, H:H,
    pos:function(e){ var r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; },
    clear:function(){ ctx.clearRect(0, 0, W, H); }};
}
/* ejes simples: devuelve las funciones de escala */
function axes(ctx, box, xr, yr, C, opt){
  opt = opt || {};
  var sx = function(x){ return box[0] + (x - xr[0]) / (xr[1] - xr[0]) * box[2]; };
  var sy = function(y){ return box[1] + box[3] - (y - yr[0]) / (yr[1] - yr[0]) * box[3]; };
  ctx.save(); ctx.strokeStyle = C.line; ctx.lineWidth = 1;
  ctx.strokeRect(box[0] + .5, box[1] + .5, box[2], box[3]);
  ctx.fillStyle = C.muted; ctx.font = "11px "+LABFONT;
  if(opt.xl){ ctx.textAlign = "center"; ctx.fillText(opt.xl, box[0] + box[2] / 2, box[1] + box[3] + 26); }
  if(opt.yl){ ctx.save(); ctx.translate(box[0] - 30, box[1] + box[3] / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.fillText(opt.yl, 0, 0); ctx.restore(); }
  (opt.xt || []).forEach(function(t){ ctx.textAlign = "center"; ctx.fillText(String(t).replace(".", ","), sx(t), box[1] + box[3] + 13); });
  (opt.yt || []).forEach(function(t){ ctx.textAlign = "right"; ctx.fillText(String(t).replace(".", ","), box[0] - 5, sy(t) + 4); });
  ctx.restore();
  return {sx:sx, sy:sy};
}
function dot(ctx, x, y, r, fill, stroke){
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  if(fill){ ctx.fillStyle = fill; ctx.fill(); }
  if(stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 1.2; ctx.stroke(); }
}

/* ── montaje ── */
function mountLab(id, host, opts){
  opts = opts || {};
  var L = labById(id);
  if(!L){ host.innerHTML = ""; return; }
  LAB_CUR = {id:id, host:host, opts:opts};
  var chips = L.models.map(function(mid){
    var m = byId[mid]; if(!m) return "";
    return '<button class="fchip" data-go="' + mid + '">' + FAM[m.f].ic + ' ' + m.n + '</button>';
  }).join("");
  host.innerHTML = '<div class="lab' + (opts.compact ? " compact" : "") + '">' +
    (opts.compact ? '' : '<p class="dq labq">' + L.q + '</p>') +
    '<p class="labintro">' + L.intro + '</p>' +
    '<div class="labstage"></div><div class="labctl"></div><div class="labread" aria-live="polite"></div>' +
    '<div class="labnote"><div class="dsub">Qué debes notar</div><ul>' + L.notice.map(function(n){ return "<li>" + n + "</li>"; }).join("") + '</ul></div>' +
    (opts.compact ? '<a class="lablink" href="#lab/' + id + '">Abrir a pantalla completa →</a>'
                  : '<div class="frel"><span class="dsub">Modelos que ilustra</span><div>' + chips + '</div></div>') +
    '</div>';
  var stage = host.querySelector(".labstage"), ctl = host.querySelector(".labctl"), read = host.querySelector(".labread");
  try{
    var stop = L.build(stage, ctl, read, labColors());
    if(typeof stop === "function") LAB_ACTIVE.push(stop);
  }catch(e){
    console.error(e);
    stage.innerHTML = '<p class="laberr">No se ha podido cargar este laboratorio.</p>';
  }
  if(!opts.compact) glossLink(host);
}

/* ── vista Laboratorio (índice) y página de un laboratorio ── */
function renderLabHub(){
  var host = document.getElementById("labContent");
  var card = function(L){
    return '<a class="labcard" href="#lab/' + L.id + '"><span class="lcic" aria-hidden="true">' + L.ic + '</span>' +
      '<span class="lct">' + L.t + ' <span class="labdim">' + L.dim + '</span></span>' +
      '<span class="lcq">' + L.q + '</span>' +
      '<span class="lcm">' + L.models.slice(0, 4).map(function(m){ return byId[m] ? byId[m].n : ""; }).filter(Boolean).join(" · ") + '</span></a>';
  };
  var h = '<div class="modehead"><div class="eyebrow">Laboratorio visual</div><h2 class="th-title">Aprende mirando: ' + (LABS.length + VIZ.length) + ' visuales interactivos</h2>' +
    '<p class="th-sub">Cada visual tiene controles, una lectura en directo y una lista de «Qué debes notar». Los <b>3D</b> se giran arrastrando y se acercan con la rueda o pellizcando. Arriba, los laboratorios de <b>conceptos</b>; debajo, <b>un visual por modelo</b> (también aparecen dentro de cada ficha).</p></div>';
  h += LAB_GROUPS.map(function(g){
    var ls = LABS.filter(function(L){ return L.g === g[0]; });
    return '<section class="fblock"><h3 class="fbh">' + g[1] + '</h3><div class="labgrid">' + ls.map(card).join("") + '</div></section>';
  }).join("");
  if(VIZ.length && typeof SECS !== "undefined"){
    h += '<div class="section-h"><h2>Un visual por modelo</h2><p>Ordenados como el catálogo. Cada uno muestra la mecánica propia de su modelo.</p></div>';
    SECS.forEach(function(s){
      var vs = VIZ.filter(function(v){ return byId[v.model] && byId[v.model].b === s.b; });
      if(!vs.length) return;
      h += '<section class="fblock"><h3 class="fbh">' + s.ic + ' ' + s.t + '</h3><div class="labgrid">' + vs.map(card).join("") + '</div></section>';
    });
  }
  host.innerHTML = h;
}
var LAB_GROUPS = [["fund","Fundamentos: cómo aprende y cómo se mide"],["sup","Supervisado"],["unsup","No supervisado"],["dec","Incertidumbre y decisión"]];

function renderLabPage(id){
  var L = labById(id);
  if(!L){ location.hash = "lab"; return; }
  labCleanupAll();
  var d = document.getElementById("detail");
  var LIST = LABS.indexOf(L) > -1 ? LABS : VIZ;
  var i = LIST.indexOf(L), prev = LIST[i - 1], next = LIST[i + 1];
  d.innerHTML = '<button class="dback" data-mode="lab">← Todos los laboratorios</button>' +
    '<div class="dcrumb">🧪 Laboratorio visual · ' + L.dim + '</div><h1>' + L.ic + ' ' + L.t + '</h1><div id="labPageHost"></div>' +
    '<nav class="dnav">' +
    (prev ? '<a class="dnavb" href="#lab/' + prev.id + '"><span class="l">← Anterior</span><span class="n2">' + prev.t + '</span></a>' : '<span></span>') +
    (next ? '<a class="dnavb next" href="#lab/' + next.id + '"><span class="l">Siguiente →</span><span class="n2">' + next.t + '</span></a>' : '<span></span>') +
    '</nav>';
  d.classList.remove("hidden");
  document.body.classList.add("detail-open");
  mountLab(id, document.getElementById("labPageHost"), {});
  d.focus(); window.scrollTo(0, 0);
}

/* ── three.js bajo demanda ── */
var THREE_P = null;
function loadThree(){
  if(!THREE_P){
    THREE_P = Promise.all([import("three"), import("three/addons/controls/OrbitControls.js")])
      .then(function(a){ return {T:a[0], Orbit:a[1].OrbitControls}; })
      .catch(function(e){ THREE_P = null; throw e; });
  }
  return THREE_P;
}
/* escena 3D estándar: cámara orbital, luces, bucle y limpieza */
function scene3d(stage, K, opt){
  opt = opt || {};
  var T = K.T, C = labColors();
  var wrap = document.createElement("div"); wrap.className = "lab3d"; stage.appendChild(wrap);
  var hint = document.createElement("div"); hint.className = "lab3dhint"; hint.textContent = "Arrastra para girar · rueda o pellizco para acercar"; wrap.appendChild(hint);
  /* alto proporcional al ancho, pero sin pasar del 72% de la ventana: la escena entera cabe en pantalla */
  var hFor = function(wd){ return Math.max(300, Math.min(Math.round(wd * 0.56), Math.round(window.innerHeight * 0.72), 780)); };
  var w = wrap.clientWidth || 640, h = hFor(w);
  var renderer = new T.WebGLRenderer({antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h); wrap.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("role", "img");
  renderer.domElement.setAttribute("aria-label", opt.label || "Escena 3D interactiva");
  var scene = new T.Scene();
  var cam = new T.PerspectiveCamera(42, w / h, 0.1, 100);
  cam.position.set.apply(cam.position, opt.cam || [6, 4.5, 6.5]);
  var ctr = new K.Orbit(cam, renderer.domElement);
  ctr.enableDamping = true; ctr.dampingFactor = 0.08;
  ctr.target.set.apply(ctr.target, opt.target || [0, 0.6, 0]);
  ctr.autoRotate = !!opt.auto; ctr.autoRotateSpeed = 0.6;
  ctr.addEventListener("start", function(){ ctr.autoRotate = false; hint.style.opacity = 0; });
  scene.add(new T.HemisphereLight(0xffffff, 0x8899aa, 1.6));
  var dl = new T.DirectionalLight(0xffffff, 1.4); dl.position.set(5, 9, 6); scene.add(dl);
  var frames = [], raf = 0, alive = true;
  function loop(t){ if(!alive) return; raf = requestAnimationFrame(loop); frames.forEach(function(f){ f(t); }); ctr.update(); renderer.render(scene, cam); }
  raf = requestAnimationFrame(loop);
  var ro = new ResizeObserver(function(){
    var nw = wrap.clientWidth; if(!nw) return;
    var nh = hFor(nw);
    renderer.setSize(nw, nh); cam.aspect = nw / nh; cam.updateProjectionMatrix();
  });
  ro.observe(wrap);
  function label(text, pos, color){
    var c = document.createElement("canvas"), g = c.getContext("2d");
    g.font = "bold 44px "+LABFONT; var tw = g.measureText(text).width;
    c.width = Math.ceil(tw + 24); c.height = 64;
    g.font = "bold 44px "+LABFONT; g.fillStyle = color || C.text; g.textBaseline = "middle"; g.fillText(text, 12, 34);
    var tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace;
    var sp = new T.Sprite(new T.SpriteMaterial({map:tex, depthTest:false, transparent:true}));
    sp.scale.set(c.width / 64 * 0.32, 0.32, 1); sp.position.set(pos[0], pos[1], pos[2]); sp.renderOrder = 10;
    scene.add(sp); return sp;
  }
  function points(n, radius){
    var geo = new T.SphereGeometry(radius || 0.06, 12, 8);
    var mat = new T.MeshStandardMaterial({roughness:0.55, metalness:0.05});
    var mesh = new T.InstancedMesh(geo, mat, n);
    mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
    var col = new T.Color(); for(var i = 0; i < n; i++) mesh.setColorAt(i, col.set(C.text));
    scene.add(mesh);
    var m4 = new T.Matrix4();
    return {mesh:mesh,
      set:function(i, x, y, z, s){ m4.makeScale(s || 1, s || 1, s || 1); m4.setPosition(x, y, z); mesh.setMatrixAt(i, m4); },
      color:function(i, c){ mesh.setColorAt(i, col.set(c)); },
      done:function(){ mesh.instanceMatrix.needsUpdate = true; if(mesh.instanceColor) mesh.instanceColor.needsUpdate = true; }};
  }
  function floor(size, div){
    var g = new T.GridHelper(size, div, new T.Color(C.line), new T.Color(C.line));
    g.material.transparent = true; g.material.opacity = 0.7; scene.add(g); return g;
  }
  function dispose(){
    alive = false; cancelAnimationFrame(raf); ro.disconnect(); ctr.dispose();
    scene.traverse(function(o){
      if(o.geometry) o.geometry.dispose();
      if(o.material){ [].concat(o.material).forEach(function(m){ if(m.map) m.map.dispose(); m.dispose(); }); }
    });
    renderer.dispose(); if(renderer.forceContextLoss) renderer.forceContextLoss();
    wrap.remove();
  }
  return {T:T, C:C, scene:scene, cam:cam, ctr:ctr, renderer:renderer, onFrame:function(f){ frames.push(f); },
          label:label, points:points, floor:floor, dispose:dispose};
}
/* envoltorio para los laboratorios 3D: carga perezosa + aviso si no hay red */
function lab3d(stage, read, buildScene){
  var dead = false, stop = null;
  var wait = document.createElement("div"); wait.className = "labwait"; wait.textContent = "Cargando motor 3D (three.js)…";
  stage.appendChild(wait);
  loadThree().then(function(K){
    if(dead) return; wait.remove();
    try{ stop = buildScene(K); }catch(e){ console.error(e); stage.innerHTML = '<p class="laberr">Error al crear la escena 3D.</p>'; }
  }).catch(function(){
    if(dead) return;
    wait.className = "laberr";
    wait.innerHTML = "No se ha podido descargar three.js (¿sin conexión?). Los laboratorios 3D necesitan internet la primera vez; los 2D funcionan sin conexión.";
  });
  return function(){ dead = true; if(stop) stop(); };
}
/* álgebra mínima */
function solveLin(A, b){
  var n = b.length, M = A.map(function(r, i){ return r.slice().concat([b[i]]); });
  for(var c = 0; c < n; c++){
    var p = c; for(var r = c + 1; r < n; r++) if(Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    var tmp = M[c]; M[c] = M[p]; M[p] = tmp;
    if(Math.abs(M[c][c]) < 1e-14) M[c][c] = 1e-14;
    for(var r2 = c + 1; r2 < n; r2++){ var f = M[r2][c] / M[c][c]; for(var k = c; k <= n; k++) M[r2][k] -= f * M[c][k]; }
  }
  var x = new Array(n);
  for(var i = n - 1; i >= 0; i--){ var s = M[i][n]; for(var j = i + 1; j < n; j++) s -= M[i][j] * x[j]; x[i] = s / M[i][i]; }
  return x;
}
function jacobiEig(S){
  var n = S.length, A = S.map(function(r){ return r.slice(); }), V = [];
  for(var i = 0; i < n; i++){ V.push([]); for(var j = 0; j < n; j++) V[i].push(i === j ? 1 : 0); }
  for(var sweep = 0; sweep < 60; sweep++){
    var off = 0; for(var p = 0; p < n; p++) for(var q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if(off < 1e-18) break;
    for(p = 0; p < n; p++) for(q = p + 1; q < n; q++){
      if(Math.abs(A[p][q]) < 1e-15) continue;
      var th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
      var t = (th >= 0 ? 1 : -1) / (Math.abs(th) + Math.sqrt(th * th + 1));
      var c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for(var k = 0; k < n; k++){ var akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for(k = 0; k < n; k++){ var apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      for(k = 0; k < n; k++){ var vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  var out = [];
  for(i = 0; i < n; i++) out.push({val:A[i][i], vec:V.map(function(r){ return r[i]; })});
  return out.sort(function(a, b){ return b.val - a.val; });
}


/* ══════════════════════════════════════════════════════════════
   LABORATORIOS 2D (canvas, funcionan sin conexión)
   ══════════════════════════════════════════════════════════════ */

/* ── 1. SOBREAJUSTE: grado del polinomio ─────────────────────── */
LABS.push({id:"sobreajuste", g:"fund", ic:"🎯", dim:"2D", t:"Sobreajuste en directo",
 q:"¿Por qué un modelo más complejo puede predecir PEOR?",
 intro:"Los puntos son datos reales con ruido; la línea discontinua es la verdad que no conocemos. Ajustamos un polinomio y subimos su <b>grado</b> (su complejidad). A la derecha, el error en <b>entrenamiento</b> y en <b>test</b> (datos que el modelo no ha visto) para cada grado.",
 notice:["El error de entrenamiento <b>siempre baja</b> al subir el grado: el modelo se ciñe cada vez más a los puntos.",
   "El error de test baja, toca fondo y <b>vuelve a subir</b>: esa curva en U es el sobreajuste. El mejor modelo está en el fondo de la U, no a la derecha.",
   "Con grado alto, sube la regularización (λ): la curva se calma y el error de test baja otra vez. Eso es Ridge."],
 models:["linmult","ridge","lasso","gbr","knn","mlp"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 360, K = makeCanvas(stage, W, H, "Ajuste polinómico y curvas de error de entrenamiento y test"), ctx = K.ctx;
   var deg = 3, lam = -9, seed = 7, tr = [], te = [];
   var truth = function(x){ return Math.sin(2 * Math.PI * x); };
   function gen(){
     var r = mulberry(seed); tr = []; te = [];
     for(var i = 0; i < 14; i++){ var x = (i + 0.2 + 0.6 * r()) / 14; tr.push([x, truth(x) + 0.28 * gauss(r)]); }
     for(i = 0; i < 200; i++){ x = r(); te.push([x, truth(x) + 0.28 * gauss(r)]); }
   }
   function fit(d, l){
     var n = d + 1, A = [], b = [];
     for(var i = 0; i < n; i++){ A.push(new Array(n).fill(0)); b.push(0); }
     tr.forEach(function(p){
       var t = 2 * p[0] - 1, phi = [1]; for(var k = 1; k < n; k++) phi.push(phi[k - 1] * t);
       for(var i2 = 0; i2 < n; i2++){ b[i2] += phi[i2] * p[1]; for(var j = 0; j < n; j++) A[i2][j] += phi[i2] * phi[j]; }
     });
     for(i = 1; i < n; i++) A[i][i] += Math.pow(10, l);
     return solveLin(A, b);
   }
   function pred(w, x){ var t = 2 * x - 1, s = 0, p = 1; for(var k = 0; k < w.length; k++){ s += w[k] * p; p *= t; } return s; }
   function rmse(w, set){ return Math.sqrt(set.reduce(function(a, p){ var e = pred(w, p[0]) - p[1]; return a + e * e; }, 0) / set.length); }
   function draw(){
     K.clear();
     var A = axes(ctx, [44, 16, 420, 300], [0, 1], [-2, 2], C, {xl:"x", yl:"y", xt:[0, 0.5, 1], yt:[-2, 0, 2]});
     ctx.save(); ctx.beginPath(); ctx.rect(44, 16, 420, 300); ctx.clip();
     ctx.setLineDash([5, 5]); ctx.strokeStyle = C.muted; ctx.lineWidth = 1.5; ctx.beginPath();
     for(var i = 0; i <= 200; i++){ var x = i / 200; i ? ctx.lineTo(A.sx(x), A.sy(truth(x))) : ctx.moveTo(A.sx(x), A.sy(truth(x))); }
     ctx.stroke(); ctx.setLineDash([]);
     var w = fit(deg, lam);
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 2.6; ctx.beginPath();
     for(i = 0; i <= 400; i++){ x = i / 400; var y = Math.max(-5, Math.min(5, pred(w, x))); i ? ctx.lineTo(A.sx(x), A.sy(y)) : ctx.moveTo(A.sx(x), A.sy(y)); }
     ctx.stroke(); ctx.restore();
     tr.forEach(function(p){ dot(ctx, A.sx(p[0]), A.sy(p[1]), 4.5, C.c[1], C.bg); });
     /* curvas de error */
     var errs = []; for(var d = 1; d <= 12; d++){ var wd = fit(d, lam); errs.push([d, rmse(wd, tr), rmse(wd, te)]); }
     var B = axes(ctx, [530, 16, 210, 300], [1, 12], [0, 1.2], C, {xl:"grado del polinomio", yl:"error (RMSE)", xt:[1, 4, 8, 12], yt:[0, 0.6, 1.2]});
     [[1, C.c[0], "train"], [2, C.c[1], "test"]].forEach(function(s){
       ctx.strokeStyle = s[1]; ctx.lineWidth = 2; ctx.beginPath();
       errs.forEach(function(e, k){ var yy = B.sy(Math.min(1.2, e[s[0]])); k ? ctx.lineTo(B.sx(e[0]), yy) : ctx.moveTo(B.sx(e[0]), yy); });
       ctx.stroke();
       errs.forEach(function(e){ dot(ctx, B.sx(e[0]), B.sy(Math.min(1.2, e[s[0]])), 2.5, s[1]); });
     });
     ctx.strokeStyle = C.ink; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(B.sx(deg), 16); ctx.lineTo(B.sx(deg), 316); ctx.stroke(); ctx.setLineDash([]);
     ctx.font = "bold 11px "+LABFONT; ctx.fillStyle = C.c[0]; ctx.fillText("● train", 540, 32); ctx.fillStyle = C.c[1]; ctx.fillText("● test", 600, 32);
     var cur = errs[deg - 1], best = errs.reduce(function(a, e){ return e[2] < a[2] ? e : a; });
     var diag = cur[2] > cur[1] * 1.6 && deg > best[0] ? "<b class='lbad'>Sobreajuste</b>: memoriza el ruido; el test empeora aunque el train mejore."
       : deg < best[0] && cur[1] > 0.35 ? "<b class='lwarn'>Subajuste</b>: demasiado simple para la forma de los datos."
       : "<b class='lgood'>Buen equilibrio</b>: cerca del fondo de la U.";
     read.innerHTML = '<span>Grado <b>' + deg + '</b></span><span>Error train <b>' + fmt(cur[1]) + '</b></span><span>Error test <b>' + fmt(cur[2]) + '</b></span><span>Mejor grado en test: <b>' + best[0] + '</b></span><span class="ldiag">' + diag + '</span>';
   }
   gen();
   ctlSlider(ctl, "Grado (complejidad)", 1, 12, 1, deg, function(v){ return v; }, function(v){ deg = v; draw(); });
   ctlSlider(ctl, "Regularización λ", -9, 1, 1, lam, function(v){ return v <= -9 ? "sin regularizar" : "10^" + v; }, function(v){ lam = v; draw(); });
   ctlBtn(ctl, "🎲 Otra muestra", function(){ seed++; gen(); draw(); });
   draw();
 }});

/* ── 2. REGULARIZACIÓN: geometría de Ridge y Lasso ────────────── */
LABS.push({id:"regul", g:"fund", ic:"🧲", dim:"2D", t:"Ridge frente a Lasso",
 q:"¿Por qué Lasso pone coeficientes exactamente a cero y Ridge no?",
 intro:"Cada punto del plano es una pareja de coeficientes (β₁, β₂). Las <b>elipses</b> son curvas de igual error: el centro (✕) es la regresión sin regularizar. La zona sombreada es el «presupuesto» que permite la regularización: un <b>círculo</b> en Ridge y un <b>rombo</b> en Lasso. La solución es el primer punto donde una elipse toca la zona.",
 notice:["Con Lasso, para presupuestos pequeños la elipse toca el rombo <b>en una esquina</b>: ahí β₂ vale exactamente 0. Esa variable queda eliminada.",
   "Con Ridge el círculo no tiene esquinas: β₂ se encoge pero <b>nunca llega a cero</b>.",
   "Si el presupuesto es lo bastante grande para contener el ✕, la regularización deja de actuar: obtienes la regresión normal.",
   "Elastic Net es una forma intermedia: conserva las esquinas (selecciona) pero redondeada (estabiliza)."],
 models:["ridge","lasso","elastic","bayesridge"],
 build:function(stage, ctl, read, C){
   var W = 640, H = 420, K = makeCanvas(stage, W, H, "Elipses de error y región de regularización"), ctx = K.ctx;
   var kind = "l1", tb = 1.0, bh = [2.0, 0.7], Am = [[1.0, 0.55], [0.55, 0.9]];
   var Q = function(b){ var d0 = b[0] - bh[0], d1 = b[1] - bh[1]; return Am[0][0] * d0 * d0 + 2 * Am[0][1] * d0 * d1 + Am[1][1] * d1 * d1; };
   var E = jacobiEig(Am);
   function radius(c, s){
     if(kind === "l2") return tb;
     if(kind === "l1") return tb / (Math.abs(c) + Math.abs(s));
     return tb / (0.5 * (Math.abs(c) + Math.abs(s)) + 0.5);
   }
   function inside(b){
     var n1 = Math.abs(b[0]) + Math.abs(b[1]), n2 = Math.hypot(b[0], b[1]);
     return kind === "l1" ? n1 <= tb : kind === "l2" ? n2 <= tb : 0.5 * n1 + 0.5 * n2 <= tb;
   }
   function solve(){
     if(inside(bh)) return bh.slice();
     var best = null, bq = Infinity, N = 7200;
     for(var i = 0; i < N; i++){
       var th = i / N * 2 * Math.PI, c = Math.cos(th), s = Math.sin(th), r = radius(c, s), b = [r * c, r * s], q = Q(b);
       if(q < bq){ bq = q; best = b; }
     }
     if(Math.abs(best[1]) < 1e-9) best[1] = 0;
     return best;
   }
   function draw(){
     K.clear();
     var A = axes(ctx, [48, 14, 560, 370], [-1.2, 3.2], [-1.4, 2.0], C, {xl:"β₁ (coeficiente de la variable 1)", yl:"β₂ (coeficiente de la variable 2)", xt:[-1, 0, 1, 2, 3], yt:[-1, 0, 1, 2]});
     ctx.save(); ctx.beginPath(); ctx.rect(48, 14, 560, 370); ctx.clip();
     ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(A.sx(0), 14); ctx.lineTo(A.sx(0), 384); ctx.moveTo(48, A.sy(0)); ctx.lineTo(608, A.sy(0)); ctx.stroke();
     /* región */
     ctx.beginPath();
     for(var i = 0; i <= 720; i++){ var th = i / 720 * 2 * Math.PI, c = Math.cos(th), s = Math.sin(th), r = radius(c, s);
       i ? ctx.lineTo(A.sx(r * c), A.sy(r * s)) : ctx.moveTo(A.sx(r * c), A.sy(r * s)); }
     ctx.closePath(); ctx.fillStyle = hexA(C.c[2], 0.22); ctx.fill(); ctx.strokeStyle = C.c[2]; ctx.lineWidth = 2; ctx.stroke();
     /* elipses */
     var sol = solve(), qs = Q(sol);
     var levels = [0.05, 0.25, 0.6, 1.1, 1.8, 2.7, 3.8].filter(function(l){ return Math.abs(l - qs) > 0.04; });
     function ell(level, col, lw){
       ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
       for(var k = 0; k <= 160; k++){
         var a = k / 160 * 2 * Math.PI, u = Math.sqrt(level / E[0].val) * Math.cos(a), v = Math.sqrt(level / E[1].val) * Math.sin(a);
         var x = bh[0] + u * E[0].vec[0] + v * E[1].vec[0], y = bh[1] + u * E[0].vec[1] + v * E[1].vec[1];
         k ? ctx.lineTo(A.sx(x), A.sy(y)) : ctx.moveTo(A.sx(x), A.sy(y));
       }
       ctx.stroke();
     }
     levels.forEach(function(l){ ell(l, hexA(C.c[0], 0.35), 1.2); });
     if(qs > 1e-6) ell(qs, C.c[0], 2.4);
     ctx.restore();
     ctx.strokeStyle = C.ink; ctx.lineWidth = 2; var hx = A.sx(bh[0]), hy = A.sy(bh[1]);
     ctx.beginPath(); ctx.moveTo(hx - 6, hy - 6); ctx.lineTo(hx + 6, hy + 6); ctx.moveTo(hx + 6, hy - 6); ctx.lineTo(hx - 6, hy + 6); ctx.stroke();
     ctx.font = "11px "+LABFONT; ctx.fillStyle = C.text; ctx.fillText("sin regularizar", hx + 9, hy - 6);
     dot(ctx, A.sx(sol[0]), A.sy(sol[1]), 7, C.c[1], C.bg);
     var zero = sol[1] === 0;
     read.innerHTML = '<span>β₁ = <b>' + fmt(sol[0]) + '</b></span><span>β₂ = <b>' + (zero ? "0 exacto" : fmt(sol[1])) + '</b></span>' +
       '<span class="ldiag">' + (inside(bh) ? "El presupuesto contiene la solución sin regularizar: <b>no hay encogimiento</b>."
        : zero ? "<b class='lgood'>La variable 2 queda eliminada.</b> Esto es selección de variables: solo pasa con esquinas (Lasso, Elastic Net)."
        : kind === "l2" ? "Ridge <b>encoge</b> los dos coeficientes, pero ninguno llega a cero." : "Presupuesto suficiente para que entren las dos variables.") + '</span>';
   }
   ctlSeg(ctl, "Penalización", [["l2", "Ridge (L2)"], ["l1", "Lasso (L1)"], ["en", "Elastic Net"]], kind, function(v){ kind = v; draw(); });
   ctlSlider(ctl, "Presupuesto t (menos = más regularización)", 0.2, 3.2, 0.05, tb, function(v){ return fmt(v); }, function(v){ tb = v; draw(); });
   draw();
 }});

/* ── 3. UMBRAL Y MATRIZ DE CONFUSIÓN ──────────────────────────── */
LABS.push({id:"umbral", g:"fund", ic:"🎚️", dim:"2D", t:"El umbral y la matriz de confusión",
 q:"¿Dónde pongo el corte para decir «sí», y por qué la accuracy engaña?",
 intro:"Un clasificador da a cada cliente una puntuación entre 0 y 1. Las barras muestran cuántos clientes reales <b>se quedan</b> (morado) y <b>se van</b> (naranja) en cada tramo de puntuación. Mueve el <b>umbral</b>: todo lo que queda a su derecha se predice como «se va».",
 notice:["Al bajar el umbral, el <b>recall</b> sube (encuentras más bajas) pero la <b>precision</b> baja (más falsas alarmas). No hay umbral gratis.",
   "Pon el desbalanceo en 3%: casi no se ven las barras naranjas. La accuracy de «decir siempre que no» es del 97%… y no detecta a nadie.",
   "Con un modelo peor (menos separación), las dos montañas se solapan y ningún umbral consigue a la vez buena precision y buen recall."],
 models:["logistica","xgboost","rf","nb","lightgbm","catboost","svmlin"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 300, K = makeCanvas(stage, W, H, "Histograma de puntuaciones por clase con umbral"), ctx = K.ctx;
   var thr = 0.5, sep = 2.2, prev = 0.2, view = "n", neg = [], pos = [];
   var r0 = mulberry(11), baseN = [], baseP = [];
   for(var i = 0; i < 4000; i++){ baseN.push(gauss(r0)); baseP.push(gauss(r0)); }
   function gen(){
     var nP = Math.round(4000 * prev), nN = 4000 - nP;
     var sc = function(z){ return 1 / (1 + Math.exp(-1.7 * z)); };
     neg = baseN.slice(0, nN).map(function(z){ return sc(z - sep / 2); });
     pos = baseP.slice(0, nP).map(function(z){ return sc(z + sep / 2); });
   }
   var box = [50, 14, 680, 236];
   function draw(){
     K.clear();
     var bins = 40, hn = new Array(bins).fill(0), hp = new Array(bins).fill(0);
     neg.forEach(function(s){ hn[Math.min(bins - 1, Math.floor(s * bins))]++; });
     pos.forEach(function(s){ hp[Math.min(bins - 1, Math.floor(s * bins))]++; });
     if(view === "p"){ hn = hn.map(function(v){ return v / neg.length; }); hp = hp.map(function(v){ return v / Math.max(1, pos.length); }); }
     var mx = Math.max.apply(null, hn.concat(hp)) * 1.08;
     var A = axes(ctx, box, [0, 1], [0, mx], C, {xl:"puntuación del modelo (probabilidad estimada de baja)", yl:view === "n" ? "nº de clientes" : "% de su clase", xt:[0, 0.25, 0.5, 0.75, 1]});
     var bw = box[2] / bins;
     for(var b = 0; b < bins; b++){
       var x = box[0] + b * bw;
       ctx.fillStyle = hexA(C.c[0], 0.55); ctx.fillRect(x + 1, A.sy(hn[b]), bw - 2, box[1] + box[3] - A.sy(hn[b]));
       ctx.fillStyle = hexA(C.c[1], 0.75); ctx.fillRect(x + 1, A.sy(hp[b]), bw - 2, box[1] + box[3] - A.sy(hp[b]));
     }
     var tx = A.sx(thr);
     ctx.fillStyle = hexA(C.ink, 0.05); ctx.fillRect(tx, box[1], box[0] + box[2] - tx, box[3]);
     ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(tx, box[1]); ctx.lineTo(tx, box[1] + box[3]); ctx.stroke();
     ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(tx - 7, box[1]); ctx.lineTo(tx + 7, box[1]); ctx.lineTo(tx, box[1] + 10); ctx.fill();
     ctx.font = "bold 11px "+LABFONT; ctx.textAlign = "left"; ctx.fillText("predice «se va» →", Math.min(tx + 8, 620), box[1] + 22);
     ctx.textAlign = "right"; ctx.fillText("← predice «se queda»", Math.max(tx - 8, 160), box[1] + 22); ctx.textAlign = "left";
     ctx.textAlign = "right";
     ctx.fillStyle = C.c[0]; ctx.fillText("■ se quedan (" + neg.length + ")", box[0] + box[2] - 10, box[1] + 46);
     ctx.fillStyle = C.c[1]; ctx.fillText("■ se van (" + pos.length + ")", box[0] + box[2] - 10, box[1] + 62);
     ctx.textAlign = "left";
     var TP = pos.filter(function(s){ return s >= thr; }).length, FN = pos.length - TP;
     var FP = neg.filter(function(s){ return s >= thr; }).length, TN = neg.length - FP;
     var acc = (TP + TN) / 4000, P = TP / Math.max(1, TP + FP), R = TP / Math.max(1, pos.length), F1 = 2 * P * R / Math.max(1e-9, P + R);
     read.innerHTML = '<table class="cmx" aria-label="Matriz de confusión"><tr><td></td><th>Predice «se va»</th><th>Predice «se queda»</th></tr>' +
       '<tr><th>Se va de verdad</th><td class="ok">' + TP + '<small>aciertos (TP)</small></td><td class="ko">' + FN + '<small>se escapan (FN)</small></td></tr>' +
       '<tr><th>Se queda de verdad</th><td class="ko">' + FP + '<small>falsas alarmas (FP)</small></td><td class="ok">' + TN + '<small>bien descartados (TN)</small></td></tr></table>' +
       '<div class="lmets"><span>Accuracy <b>' + pct(acc) + '</b></span><span>Precision <b>' + pct(P) + '</b></span><span>Recall <b>' + pct(R) + '</b></span><span>F1 <b>' + fmt(F1) + '</b></span>' +
       '<span>«Decir siempre que no» <b>' + pct(1 - prev) + '</b> de accuracy</span><span>Falsas alarmas por acierto <b>' + (TP ? fmt(FP / TP, 1) : "—") + '</b></span></div>';
   }
   var sl;
   function setThr(v){ thr = Math.max(0.01, Math.min(0.99, v)); sl.set(thr); draw(); }
   var drag = false;
   K.cv.addEventListener("pointerdown", function(e){ drag = true; K.cv.setPointerCapture(e.pointerId); setThr((K.pos(e)[0] - box[0]) / box[2]); });
   K.cv.addEventListener("pointermove", function(e){ if(drag) setThr((K.pos(e)[0] - box[0]) / box[2]); });
   K.cv.addEventListener("pointerup", function(){ drag = false; });
   K.cv.style.cursor = "ew-resize";
   /* en móvil el gráfico se desliza en horizontal: allí el umbral se mueve con el deslizador */
   K.cv.style.touchAction = window.matchMedia("(max-width:640px)").matches ? "pan-x pan-y" : "pan-y";
   sl = ctlSlider(ctl, "Umbral (también puedes arrastrar en el gráfico)", 0.01, 0.99, 0.01, thr, function(v){ return fmt(v); }, function(v){ thr = v; draw(); });
   ctlSeg(ctl, "Desbalanceo (% que se va)", [["0.5", "50%"], ["0.2", "20%"], ["0.03", "3%"]], "0.2", function(v){ prev = +v; gen(); draw(); });
   ctlSlider(ctl, "Calidad del modelo (separación)", 0.4, 4, 0.1, sep, function(v){ return v < 1.2 ? "floja" : v < 2.6 ? "buena" : "excelente"; }, function(v){ sep = v; gen(); draw(); });
   ctlSeg(ctl, "Eje vertical", [["n", "Recuentos reales"], ["p", "Cada clase al 100%"]], view, function(v){ view = v; draw(); });
   gen(); draw();
 }});

/* ── 4. ÁRBOL FRENTE A BOSQUE ─────────────────────────────────── */
function cartFit(X, Y, idx, depth, maxD, minLeaf, rng, randF){
  var n = idx.length, s = 0; idx.forEach(function(i){ s += Y[i]; }); var p = s / n;
  if(depth >= maxD || n < 2 * minLeaf || p === 0 || p === 1) return {p:p};
  var best = null, feats = randF ? [rng() < 0.5 ? 0 : 1] : [0, 1];
  feats.forEach(function(f){
    var srt = idx.slice().sort(function(a, b){ return X[a][f] - X[b][f]; }), lp = 0;
    for(var k = 1; k < n; k++){
      lp += Y[srt[k - 1]];
      if(k < minLeaf || n - k < minLeaf || X[srt[k - 1]][f] === X[srt[k]][f]) continue;
      var pl = lp / k, pr = (s - lp) / (n - k);
      var g = k * (1 - pl * pl - (1 - pl) * (1 - pl)) + (n - k) * (1 - pr * pr - (1 - pr) * (1 - pr));
      if(!best || g < best.g) best = {g:g, f:f, t:(X[srt[k - 1]][f] + X[srt[k]][f]) / 2};
    }
  });
  if(!best) return {p:p};
  var L = [], R = []; idx.forEach(function(i){ (X[i][best.f] <= best.t ? L : R).push(i); });
  return {f:best.f, t:best.t, l:cartFit(X, Y, L, depth + 1, maxD, minLeaf, rng, randF), r:cartFit(X, Y, R, depth + 1, maxD, minLeaf, rng, randF)};
}
function cartPred(nd, x){ while(nd.l) nd = x[nd.f] <= nd.t ? nd.l : nd.r; return nd.p; }
function cartLeaves(nd){ return nd.l ? cartLeaves(nd.l) + cartLeaves(nd.r) : 1; }

LABS.push({id:"arbol2d", g:"sup", ic:"🌳", dim:"2D", t:"Un árbol frente a un bosque",
 q:"¿Cómo parte el espacio un árbol de decisión y por qué un bosque generaliza mejor?",
 intro:"Dos clases (morado y naranja) separadas por una frontera curva, con un 10% de etiquetas erróneas a propósito. El color de fondo es lo que predice el modelo en cada zona. Sube la <b>profundidad máxima</b> y compara el acierto en entrenamiento y en test.",
 notice:["Un árbol solo corta con líneas <b>horizontales y verticales</b>: aproxima la curva con escalones.",
   "Con mucha profundidad, el árbol dibuja islitas alrededor de los puntos mal etiquetados: <b>100% en train y peor en test</b>. Es sobreajuste.",
   "El bosque (40 árboles con muestras y variables al azar) <b>suaviza</b> la frontera: los caprichos de cada árbol se compensan al votar."],
 models:["arbol","rf","extratrees","gbr","xgboost","adaboost","catboost","lightgbm"],
 build:function(stage, ctl, read, C){
   var W = 640, H = 400, K = makeCanvas(stage, W, H, "Regiones de decisión de un árbol o un bosque"), ctx = K.ctx;
   var depth = 3, mode = "tree", seed = 3, showTest = false, X = [], Y = [], Xt = [], Yt = [];
   var bound = function(x){ return 0.5 + 0.22 * Math.sin(2 * Math.PI * x * 1.1); };
   function gen(){
     var r = mulberry(seed); X = []; Y = []; Xt = []; Yt = [];
     for(var i = 0; i < 560; i++){
       var p = [r(), r()], y = p[1] > bound(p[0]) ? 1 : 0;
       if(r() < 0.1) y = 1 - y;
       if(i < 160){ X.push(p); Y.push(y); } else { Xt.push(p); Yt.push(y); }
     }
   }
   var model;
   function train(){
     var rng = mulberry(seed * 7 + depth), all = X.map(function(_, i){ return i; });
     if(mode === "tree"){ var t = cartFit(X, Y, all, 0, depth, 1, rng, false); model = {pred:function(x){ return cartPred(t, x); }, leaves:cartLeaves(t)}; }
     else {
       var trees = [];
       for(var k = 0; k < 40; k++){ var bs = all.map(function(){ return Math.floor(rng() * X.length); }); trees.push(cartFit(X, Y, bs, 0, depth, 1, rng, true)); }
       model = {pred:function(x){ var s = 0; trees.forEach(function(t){ s += cartPred(t, x); }); return s / trees.length; }, leaves:null};
     }
   }
   function accOn(A, B){ var ok = 0; A.forEach(function(x, i){ if((model.pred(x) >= 0.5 ? 1 : 0) === B[i]) ok++; }); return ok / A.length; }
   var box = [20, 10, 600, 380];
   function draw(){
     K.clear();
     var gx = 100, gy = 64, cw = box[2] / gx, ch = box[3] / gy;
     for(var i = 0; i < gx; i++) for(var j = 0; j < gy; j++){
       var p = model.pred([(i + 0.5) / gx, 1 - (j + 0.5) / gy]);
       ctx.fillStyle = p >= 0.5 ? hexA(C.c[1], 0.08 + 0.32 * (p - 0.5) * 2) : hexA(C.c[0], 0.08 + 0.32 * (0.5 - p) * 2);
       var x0 = Math.round(box[0] + i * cw), y0 = Math.round(box[1] + j * ch);
       ctx.fillRect(x0, y0, Math.round(box[0] + (i + 1) * cw) - x0, Math.round(box[1] + (j + 1) * ch) - y0);
     }
     ctx.strokeStyle = C.line; ctx.strokeRect(box[0] + .5, box[1] + .5, box[2], box[3]);
     ctx.setLineDash([4, 4]); ctx.strokeStyle = C.muted; ctx.beginPath();
     for(i = 0; i <= 200; i++){ var x = i / 200; var px = box[0] + x * box[2], py = box[1] + (1 - bound(x)) * box[3]; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
     ctx.stroke(); ctx.setLineDash([]);
     (showTest ? Xt : X).forEach(function(p, k){
       var y = (showTest ? Yt : Y)[k];
       dot(ctx, box[0] + p[0] * box[2], box[1] + (1 - p[1]) * box[3], showTest ? 2.6 : 4, y ? C.c[1] : C.c[0], showTest ? null : C.bg);
     });
     var a1 = accOn(X, Y), a2 = accOn(Xt, Yt), gap = a1 - a2, diag;
     if(mode === "rf"){
       var all = X.map(function(_, i){ return i; }), t1 = cartFit(X, Y, all, 0, depth, 1, mulberry(1), false), ok = 0;
       Xt.forEach(function(x, i){ if((cartPred(t1, x) >= 0.5 ? 1 : 0) === Yt[i]) ok++; });
       var at = ok / Xt.length;
       diag = "En un bosque, un acierto en train cercano al 100% es normal: cada árbol memoriza su muestra. Lo que cuenta es el test: <b>" + pct(a2) + "</b> frente a <b>" + pct(at) + "</b> de un solo árbol con la misma profundidad" +
         (a2 > at + 0.01 ? " → <b class='lgood'>votar compensa los errores</b>." : ".");
     } else {
       diag = gap > 0.1 ? "<b class='lbad'>Sobreajuste</b>: " + pct(gap, 0) + " de diferencia entre train y test." : a2 < 0.75 ? "<b class='lwarn'>Subajuste</b>: aún no capta la curva." : "<b class='lgood'>Generaliza bien</b>: train y test van de la mano.";
     }
     read.innerHTML = '<span>Acierto en train <b>' + pct(a1) + '</b></span><span>Acierto en test <b>' + pct(a2) + '</b></span>' +
       (model.leaves ? '<span>Hojas del árbol <b>' + model.leaves + '</b></span>' : '<span>Árboles <b>40</b></span>') +
       '<span class="ldiag">' + diag + '</span>';
   }
   function redo(){ train(); draw(); }
   ctlSeg(ctl, "Modelo", [["tree", "Un árbol"], ["rf", "Random Forest (40)"]], mode, function(v){ mode = v; redo(); });
   ctlSlider(ctl, "Profundidad máxima", 1, 12, 1, depth, function(v){ return v; }, function(v){ depth = v; redo(); });
   ctlCheck(ctl, "Ver los puntos de test", showTest, function(v){ showTest = v; draw(); });
   ctlBtn(ctl, "🎲 Otros datos", function(){ seed++; gen(); redo(); });
   gen(); redo();
 }});

/* ── 5. K-MEANS FRENTE A DBSCAN ───────────────────────────────── */
LABS.push({id:"densidad", g:"unsup", ic:"🫧", dim:"2D", t:"K-Means frente a DBSCAN",
 q:"¿Qué pasa cuando los grupos no son redondos o hay ruido?",
 intro:"Dos «medias lunas», un grupo compacto y algunos puntos sueltos. <b>K-Means</b> agrupa por distancia al centro más cercano; <b>DBSCAN</b> agrupa por densidad (puntos con suficientes vecinos cerca). Cambia de algoritmo y de parámetros.",
 notice:["K-Means corta las lunas <b>por la mitad</b>: solo sabe hacer grupos más o menos redondos, y además obliga a asignar los puntos sueltos a algún grupo.",
   "DBSCAN sigue la forma de las lunas y marca los puntos sueltos como <b>ruido</b> (✕), sin decirle cuántos grupos hay.",
   "Con un eps demasiado pequeño, casi todo es ruido; demasiado grande, todo se funde en un único grupo. Elegir eps es la parte difícil."],
 models:["dbscan","kmeans","gmm","jerarquico","lof"],
 build:function(stage, ctl, read, C){
   var W = 640, H = 400, K = makeCanvas(stage, W, H, "Clustering de K-Means o DBSCAN sobre lunas y ruido"), ctx = K.ctx;
   var alg = "km", k = 3, eps = 0.18, minPts = 5, P = [], lab = [];
   (function(){
     var r = mulberry(5);
     for(var i = 0; i < 140; i++){ var a = Math.PI * r(); P.push([Math.cos(a) + 0.07 * gauss(r), Math.sin(a) + 0.07 * gauss(r)]); }
     for(i = 0; i < 140; i++){ a = Math.PI * r(); P.push([1 - Math.cos(a) + 0.07 * gauss(r), 0.45 - Math.sin(a) + 0.07 * gauss(r)]); }
     for(i = 0; i < 60; i++) P.push([2.75 + 0.12 * gauss(r), 0.95 + 0.12 * gauss(r)]);
     for(i = 0; i < 22; i++) P.push([-1.3 + 4.6 * r(), -0.7 + 2.0 * r()]);
   })();
   function d2(a, b){ var x = a[0] - b[0], y = a[1] - b[1]; return x * x + y * y; }
   function kmeans(){
     var r = mulberry(17 + k), c = [P[Math.floor(r() * P.length)]];
     while(c.length < k){
       var ds = P.map(function(p){ return Math.min.apply(null, c.map(function(q){ return d2(p, q); })); });
       var tot = ds.reduce(function(a, b){ return a + b; }), u = r() * tot, acc = 0;
       for(var i = 0; i < P.length; i++){ acc += ds[i]; if(acc >= u){ c.push(P[i]); break; } }
     }
     for(var it = 0; it < 60; it++){
       lab = P.map(function(p){ var b = 0; c.forEach(function(q, j){ if(d2(p, q) < d2(p, c[b])) b = j; }); return b; });
       c = c.map(function(q, j){ var s = [0, 0], n = 0; P.forEach(function(p, i){ if(lab[i] === j){ s[0] += p[0]; s[1] += p[1]; n++; } }); return n ? [s[0] / n, s[1] / n] : q; });
     }
     return c;
   }
   function dbscan(){
     var e2 = eps * eps, n = P.length; lab = new Array(n).fill(-2); var cid = 0;
     var nb = function(i){ var o = []; for(var j = 0; j < n; j++) if(d2(P[i], P[j]) <= e2) o.push(j); return o; };
     for(var i = 0; i < n; i++){
       if(lab[i] !== -2) continue;
       var N = nb(i); if(N.length < minPts){ lab[i] = -1; continue; }
       lab[i] = cid; var q = N.slice();
       while(q.length){
         var j = q.pop();
         if(lab[j] === -1) lab[j] = cid;
         if(lab[j] !== -2) continue;
         lab[j] = cid; var Nj = nb(j); if(Nj.length >= minPts) q = q.concat(Nj);
       }
       cid++;
     }
     return cid;
   }
   function draw(){
     K.clear();
     var cent = null, ncl;
     if(alg === "km"){ cent = kmeans(); ncl = k; } else ncl = dbscan();
     var sx = function(x){ return 30 + (x + 1.4) / 4.8 * 580; }, sy = function(y){ return 370 - (y + 0.8) / 2.3 * 340; };
     ctx.strokeStyle = C.line; ctx.strokeRect(10.5, 10.5, 620, 380);
     if(alg === "db"){ ctx.strokeStyle = hexA(C.muted, 0.5); ctx.beginPath(); ctx.arc(sx(P[300][0]), sy(P[300][1]), eps / 4.8 * 580, 0, 7); ctx.stroke();
       ctx.fillStyle = C.muted; ctx.font = "11px "+LABFONT; ctx.fillText("radio eps", sx(P[300][0]) + eps / 4.8 * 580 + 4, sy(P[300][1])); }
     var noise = 0;
     P.forEach(function(p, i){
       var l = lab[i], x = sx(p[0]), y = sy(p[1]);
       if(l < 0){ noise++; ctx.strokeStyle = C.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - 3, y - 3); ctx.lineTo(x + 3, y + 3); ctx.moveTo(x + 3, y - 3); ctx.lineTo(x - 3, y + 3); ctx.stroke(); }
       else dot(ctx, x, y, 4, C.c[l % 6], C.bg);
     });
     if(cent) cent.forEach(function(q, j){ ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(sx(q[0]), sy(q[1]), 8, 0, 7); ctx.fill(); dot(ctx, sx(q[0]), sy(q[1]), 5, C.c[j % 6]); });
     read.innerHTML = '<span>Grupos encontrados <b>' + ncl + '</b></span><span>Ruido <b>' + pct(noise / P.length) + '</b></span>' +
       '<span class="ldiag">' + (alg === "km" ? "K-Means: cada punto va al <b>centro más cercano</b> (círculos negros). No existe la opción «ruido»." : "DBSCAN: un punto es «núcleo» si tiene al menos " + minPts + " vecinos dentro del radio eps.") + '</span>';
   }
   var kS, eS, mS;
   ctlSeg(ctl, "Algoritmo", [["km", "K-Means"], ["db", "DBSCAN"]], alg, function(v){ alg = v; kS.style.display = v === "km" ? "" : "none"; eS.style.display = mS.style.display = v === "db" ? "" : "none"; draw(); });
   kS = ctlSlider(ctl, "K (nº de grupos)", 2, 6, 1, k, function(v){ return v; }, function(v){ k = v; draw(); }).input.parentNode;
   eS = ctlSlider(ctl, "eps (radio de vecindad)", 0.05, 0.5, 0.01, eps, function(v){ return fmt(v); }, function(v){ eps = v; draw(); }).input.parentNode;
   mS = ctlSlider(ctl, "Vecinos mínimos", 3, 12, 1, minPts, function(v){ return v; }, function(v){ minPts = v; draw(); }).input.parentNode;
   eS.style.display = mS.style.display = "none";
   draw();
 }});

/* ── 6. ISOLATION FOREST ─────────────────────────────────────── */
LABS.push({id:"aislamiento", g:"unsup", ic:"🚨", dim:"2D", t:"Aislar lo raro (Isolation Forest)",
 q:"¿Por qué un punto anómalo se aísla con muy pocos cortes al azar?",
 intro:"Haz clic en cualquier punto (o usa los botones). El algoritmo hace <b>cortes al azar</b>, horizontales o verticales, y en cada corte se queda con el trozo que contiene tu punto, hasta dejarlo solo. Cuenta los cortes.",
 notice:["Un punto del centro de la nube necesita <b>muchos cortes</b> (suelen ser 9-12): siempre tiene vecinos dentro del trozo.",
   "Un punto apartado se queda solo en <b>2-4 cortes</b>: está lejos de todo, así que casi cualquier corte lo separa.",
   "Como cada ronda es aleatoria, el algoritmo real repite cientos de veces (cientos de árboles) y usa la <b>media</b>. Pulsa «Repetir 300 veces»."],
 models:["iforest","lof","autoenc"],
 build:function(stage, ctl, read, C){
   var W = 640, H = 400, K = makeCanvas(stage, W, H, "Cortes aleatorios aislando un punto"), ctx = K.ctx;
   var P = [], r = mulberry(21);
   for(var i = 0; i < 230; i++) P.push([0.45 + 0.1 * gauss(r), 0.5 + 0.09 * gauss(r)]);
   [[0.9, 0.85], [0.1, 0.12], [0.85, 0.2], [0.15, 0.85], [0.72, 0.5], [0.5, 0.05], [0.95, 0.55]].forEach(function(p){ P.push(p); });
   var target = 230, cuts = [], box = null, timer = null, avg = null, avgNormal = null;
   var bx = [20, 10, 600, 380], sx = function(x){ return bx[0] + x * bx[2]; }, sy = function(y){ return bx[1] + (1 - y) * bx[3]; };
   function isolate(rng, record){
     var b = [[0, 1], [0, 1]], idx = P.map(function(_, i){ return i; }), n = 0, cs = [];
     while(idx.length > 1 && n < 60){
       var f = rng() < 0.5 ? 0 : 1, lo = Infinity, hi = -Infinity;
       idx.forEach(function(i){ lo = Math.min(lo, P[i][f]); hi = Math.max(hi, P[i][f]); });
       if(hi - lo < 1e-9) break;
       var s = lo + rng() * (hi - lo), left = P[target][f] <= s;
       if(record) cs.push({f:f, s:s, b:[b[0].slice(), b[1].slice()]});
       if(left) b[f][1] = s; else b[f][0] = s;
       idx = idx.filter(function(i){ return (P[i][f] <= s) === left; }); n++;
     }
     return {n:n, cuts:cs, box:b};
   }
   function draw(){
     K.clear(); ctx.strokeStyle = C.line; ctx.strokeRect(bx[0] + .5, bx[1] + .5, bx[2], bx[3]);
     if(box){ ctx.fillStyle = hexA(C.c[2], 0.16); ctx.fillRect(sx(box[0][0]), sy(box[1][1]), sx(box[0][1]) - sx(box[0][0]), sy(box[1][0]) - sy(box[1][1])); }
     cuts.forEach(function(c, k){
       ctx.strokeStyle = k === cuts.length - 1 ? C.c[1] : hexA(C.c[1], 0.45); ctx.lineWidth = k === cuts.length - 1 ? 2.5 : 1.3; ctx.beginPath();
       if(c.f === 0){ ctx.moveTo(sx(c.s), sy(c.b[1][0])); ctx.lineTo(sx(c.s), sy(c.b[1][1])); }
       else { ctx.moveTo(sx(c.b[0][0]), sy(c.s)); ctx.lineTo(sx(c.b[0][1]), sy(c.s)); }
       ctx.stroke();
     });
     P.forEach(function(p, i){ if(i !== target) dot(ctx, sx(p[0]), sy(p[1]), 3.2, hexA(C.c[0], 0.75)); });
     dot(ctx, sx(P[target][0]), sy(P[target][1]), 7, C.c[5], C.bg);
     read.innerHTML = '<span>Cortes en esta ronda <b>' + cuts.length + '</b></span>' +
       (avg !== null ? '<span>Media en 300 rondas <b>' + fmt(avg, 1) + '</b></span><span>Media de un punto típico <b>' + fmt(avgNormal, 1) + '</b></span><span class="ldiag">' +
         (avg < avgNormal * 0.6 ? "<b class='lbad'>Se aísla muy rápido → anómalo.</b>" : "<b class='lgood'>Cuesta aislarlo → normal.</b>") + '</span>' : '<span class="ldiag">Pulsa «Repetir 300 veces» para la puntuación estable.</span>');
   }
   function run(){
     clearInterval(timer); avg = null;
     var res = isolate(mulberry(Date.now() % 100000), true), k = 0; cuts = []; box = [[0, 1], [0, 1]];
     timer = setInterval(function(){
       if(k >= res.cuts.length){ clearInterval(timer); box = res.box; draw(); return; }
       var c = res.cuts[k++]; cuts.push(c); box = [c.b[0].slice(), c.b[1].slice()];
       if(c.f === 0){ if(P[target][0] <= c.s) box[0][1] = c.s; else box[0][0] = c.s; } else { if(P[target][1] <= c.s) box[1][1] = c.s; else box[1][0] = c.s; }
       draw();
     }, 380);
   }
   function many(){
     var rg = mulberry(99), s = 0; for(var i = 0; i < 300; i++) s += isolate(rg, false).n; avg = s / 300;
     var keep = target; target = 0; s = 0; for(i = 0; i < 300; i++) s += isolate(rg, false).n; avgNormal = s / 300; target = keep;
     draw();
   }
   K.cv.addEventListener("click", function(e){
     var p = K.pos(e), best = 0, bd = Infinity;
     P.forEach(function(q, i){ var d = Math.hypot(sx(q[0]) - p[0], sy(q[1]) - p[1]); if(d < bd){ bd = d; best = i; } });
     target = best; cuts = []; box = null; avg = null; run();
   });
   K.cv.style.cursor = "crosshair";
   ctlBtn(ctl, "▶ Aislar un punto raro", function(){ target = 230 + Math.floor(Math.random() * 7); run(); }, true);
   ctlBtn(ctl, "▶ Aislar un punto normal", function(){ target = Math.floor(Math.random() * 230); run(); });
   ctlBtn(ctl, "⟲ Repetir 300 veces (media)", function(){ clearInterval(timer); many(); });
   draw(); run();
   return function(){ clearInterval(timer); };
 }});

/* ── 7. PROCESO GAUSSIANO ────────────────────────────────────── */
LABS.push({id:"gp", g:"dec", ic:"🌫️", dim:"2D", t:"Incertidumbre con un proceso gaussiano",
 q:"¿Cómo sabe un modelo dónde no sabe?",
 intro:"Haz <b>clic en el gráfico</b> para medir la función oculta en ese punto. La línea es la predicción y la banda, el rango donde el modelo cree que está la verdad (95%). El botón «Medir donde más dudas» hace lo que hace la optimización bayesiana.",
 notice:["Junto a los puntos medidos la banda es <b>estrecha</b>: ahí el modelo sabe. Lejos, se <b>abre</b>: ahí no sabe, y lo dice.",
   "La «longitud de escala» es cuánto influye un punto en sus vecinos: corta = curva nerviosa y bandas que se abren enseguida; larga = curva suave y confiada (a veces demasiado).",
   "Midiendo siempre donde la banda es más ancha, con 6-8 puntos el modelo ya reproduce la función. Así se ahorran experimentos caros."],
 models:["gp","bayesridge","quantile","svr"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 340, K = makeCanvas(stage, W, H, "Media y banda de incertidumbre de un proceso gaussiano"), ctx = K.ctx;
   var f = function(x){ return Math.sin(x) + 0.35 * Math.sin(2.7 * x) + 0.15 * x - 0.7; };
   var obs = [], ell = 1.0, sf = 1.1, sn = 0.06, showTrue = false, r = mulberry(4);
   function reset(){ obs = [[1.5, f(1.5)], [4.2, f(4.2)], [7.8, f(7.8)]]; }
   var kf = function(a, b){ return sf * sf * Math.exp(-(a - b) * (a - b) / (2 * ell * ell)); };
   function post(){
     var n = obs.length, Kx = [];
     for(var i = 0; i < n; i++){ Kx.push([]); for(var j = 0; j < n; j++) Kx[i].push(kf(obs[i][0], obs[j][0]) + (i === j ? sn * sn : 0)); }
     var L = []; for(i = 0; i < n; i++){ L.push(new Array(n).fill(0));
       for(j = 0; j <= i; j++){ var s = Kx[i][j]; for(var k = 0; k < j; k++) s -= L[i][k] * L[j][k]; L[i][j] = i === j ? Math.sqrt(Math.max(s, 1e-12)) : s / L[j][j]; } }
     var fw = function(b){ var z = []; for(var i2 = 0; i2 < n; i2++){ var s2 = b[i2]; for(var k2 = 0; k2 < i2; k2++) s2 -= L[i2][k2] * z[k2]; z.push(s2 / L[i2][i2]); } return z; };
     var bw = function(z){ var x = new Array(n); for(var i3 = n - 1; i3 >= 0; i3--){ var s3 = z[i3]; for(var k3 = i3 + 1; k3 < n; k3++) s3 -= L[k3][i3] * x[k3]; x[i3] = s3 / L[i3][i3]; } return x; };
     var alpha = bw(fw(obs.map(function(o){ return o[1]; }))), out = [];
     for(var g = 0; g <= 300; g++){
       var x = g / 30, ks = obs.map(function(o){ return kf(x, o[0]); });
       var mu = ks.reduce(function(a, v, q){ return a + v * alpha[q]; }, 0), v = fw(ks);
       var va = sf * sf - v.reduce(function(a, q){ return a + q * q; }, 0);
       out.push([x, mu, Math.sqrt(Math.max(va, 0))]);
     }
     return out;
   }
   var box = [44, 12, 690, 290], A;
   function draw(){
     K.clear();
     A = axes(ctx, box, [0, 10], [-3, 3], C, {xl:"x (p. ej., temperatura del proceso)", yl:"resultado", xt:[0, 2, 4, 6, 8, 10], yt:[-3, 0, 3]});
     var P = post();
     ctx.save(); ctx.beginPath(); ctx.rect(box[0], box[1], box[2], box[3]); ctx.clip();
     ctx.beginPath(); P.forEach(function(p, i){ i ? ctx.lineTo(A.sx(p[0]), A.sy(p[1] + 2 * p[2])) : ctx.moveTo(A.sx(p[0]), A.sy(p[1] + 2 * p[2])); });
     for(var i = P.length - 1; i >= 0; i--) ctx.lineTo(A.sx(P[i][0]), A.sy(P[i][1] - 2 * P[i][2]));
     ctx.closePath(); ctx.fillStyle = hexA(C.c[0], 0.2); ctx.fill();
     if(showTrue){ ctx.setLineDash([5, 5]); ctx.strokeStyle = C.muted; ctx.lineWidth = 1.5; ctx.beginPath();
       for(i = 0; i <= 300; i++){ var x = i / 30; i ? ctx.lineTo(A.sx(x), A.sy(f(x))) : ctx.moveTo(A.sx(x), A.sy(f(x))); } ctx.stroke(); ctx.setLineDash([]); }
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 2.5; ctx.beginPath(); P.forEach(function(p, i){ i ? ctx.lineTo(A.sx(p[0]), A.sy(p[1])) : ctx.moveTo(A.sx(p[0]), A.sy(p[1])); }); ctx.stroke();
     ctx.restore();
     obs.forEach(function(o){ dot(ctx, A.sx(o[0]), A.sy(o[1]), 5.5, C.c[1], C.bg); });
     var mx = P.reduce(function(a, p){ return p[2] > a[2] ? p : a; });
     ctx.strokeStyle = C.c[5]; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(A.sx(mx[0]), box[1]); ctx.lineTo(A.sx(mx[0]), box[1] + box[3]); ctx.stroke(); ctx.setLineDash([]);
     read.innerHTML = '<span>Puntos medidos <b>' + obs.length + '</b></span><span>Mayor duda en x ≈ <b>' + fmt(mx[0], 1) + '</b> (±' + fmt(2 * mx[2]) + ')</span><span class="ldiag">La línea roja punteada marca dónde convendría medir a continuación.</span>';
     return mx;
   }
   K.cv.addEventListener("click", function(e){
     var p = K.pos(e); if(p[0] < box[0] || p[0] > box[0] + box[2]) return;
     var x = (p[0] - box[0]) / box[2] * 10; obs.push([x, f(x) + sn * gauss(r)]); draw();
   });
   K.cv.style.cursor = "crosshair";
   ctlBtn(ctl, "🎯 Medir donde más dudas", function(){ var mx = draw(); obs.push([mx[0], f(mx[0]) + sn * gauss(r)]); draw(); }, true);
   ctlSlider(ctl, "Longitud de escala ℓ", 0.3, 3, 0.1, ell, function(v){ return fmt(v, 1); }, function(v){ ell = v; draw(); });
   ctlCheck(ctl, "Mostrar la función real (oculta)", showTrue, function(v){ showTrue = v; draw(); });
   ctlBtn(ctl, "↺ Empezar de nuevo", function(){ reset(); draw(); });
   reset(); draw();
 }});

/* ── 8. SERIES: PRONÓSTICO CONTRA LÍNEAS BASE ────────────────── */
LABS.push({id:"serie", g:"dec", ic:"📈", dim:"2D", t:"Pronosticar una serie (y batir al ingenuo)",
 q:"¿Qué método de previsión gana cuando hay tendencia y estacionalidad?",
 intro:"Cinco años de ventas mensuales inventadas. Entrenamos con los <b>4 primeros años</b> y pronosticamos los <b>12 meses siguientes</b>, que el modelo no ha visto (validación hacia delante). Cambia la forma de la serie y compara el error (MAE) de cuatro métodos.",
 notice:["El <b>ingenuo estacional</b> («lo mismo que el mismo mes del año pasado») es una línea base muy difícil de batir cuando la estacionalidad es fuerte. Cualquier modelo tiene que ganarle.",
   "La <b>tendencia lineal</b> sola no ve los picos de cada año; el ingenuo simple (repetir el último mes) no ve ni la tendencia ni los picos.",
   "<b>Holt-Winters</b> combina nivel + tendencia + estacionalidad y suele ganar. Pero sube mucho el ruido: las diferencias entre métodos se encogen, porque lo que queda es impredecible."],
 models:["hw","sarima","arima","prophet","sarimax","rnn"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 340, K = makeCanvas(stage, W, H, "Serie mensual con pronóstico a 12 meses"), ctx = K.ctx;
   var trend = 0.8, amp = 18, noise = 4, seed = 3, meth = "hw", y = [];
   var NAMES = {naive:"Ingenuo (último mes)", snaive:"Ingenuo estacional", lin:"Tendencia lineal", hw:"Holt-Winters"};
   function gen(){
     var r = mulberry(seed); y = [];
     for(var t = 0; t < 60; t++) y.push(100 + trend * t + amp * Math.sin(2 * Math.PI * (t % 12) / 12 - 1.2) + (t % 12 === 11 ? amp * 0.8 : 0) + noise * gauss(r));
   }
   function fc(m, tr){
     var n = tr.length, out = [];
     if(m === "naive") for(var h = 1; h <= 12; h++) out.push(tr[n - 1]);
     if(m === "snaive") for(h = 1; h <= 12; h++) out.push(tr[n - 12 + h - 1]);
     if(m === "lin"){ var sx = 0, sy = 0, sxy = 0, sxx = 0; tr.forEach(function(v, t){ sx += t; sy += v; sxy += t * v; sxx += t * t; });
       var b = (n * sxy - sx * sy) / (n * sxx - sx * sx), a = (sy - b * sx) / n; for(h = 1; h <= 12; h++) out.push(a + b * (n - 1 + h)); }
     if(m === "hw"){
       var al = 0.35, be = 0.08, ga = 0.3, m0 = 12, mean = function(a2){ return a2.reduce(function(s, v){ return s + v; }, 0) / a2.length; };
       var L = mean(tr.slice(0, 12)), T = (mean(tr.slice(12, 24)) - L) / 12, S = tr.slice(0, 12).map(function(v){ return v - L; });
       for(var t = 12; t < n; t++){
         var Lp = L; L = al * (tr[t] - S[t - m0]) + (1 - al) * (L + T); T = be * (L - Lp) + (1 - be) * T; S.push(ga * (tr[t] - L) + (1 - ga) * S[t - m0]);
       }
       for(h = 1; h <= 12; h++) out.push(L + h * T + S[n - m0 + (h - 1) % m0]);
     }
     return out;
   }
   function draw(){
     K.clear();
     var tr = y.slice(0, 48), te = y.slice(48), lo = Math.min.apply(null, y) - 10, hi = Math.max.apply(null, y) + 10;
     var A = axes(ctx, [52, 14, 690, 286], [0, 59], [lo, hi], C, {xl:"mes", yl:"ventas", xt:[0, 12, 24, 36, 48, 59], yt:[Math.round(lo), Math.round(hi)]});
     ctx.fillStyle = hexA(C.c[2], 0.08); ctx.fillRect(A.sx(47.5), 14, A.sx(59) - A.sx(47.5), 286);
     ctx.fillStyle = C.muted; ctx.font = "11px "+LABFONT; ctx.fillText("entrenamiento (48 meses)", 60, 30); ctx.fillText("test: 12 meses no vistos", A.sx(48) + 6, 30);
     var line = function(arr, off, col, lw, dash){ ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.beginPath(); arr.forEach(function(v, i){ i ? ctx.lineTo(A.sx(i + off), A.sy(v)) : ctx.moveTo(A.sx(i + off), A.sy(v)); }); ctx.stroke(); ctx.setLineDash([]); };
     line(tr, 0, C.c[0], 2);
     line([tr[47]].concat(te), 47, C.muted, 2, [5, 4]);
     var f = fc(meth, tr); line([tr[47]].concat(f), 47, C.c[1], 2.8);
     ctx.fillStyle = C.c[1]; ctx.font = "bold 11px "+LABFONT; ctx.fillText("pronóstico: " + NAMES[meth], A.sx(48) + 6, 46);
     var res = Object.keys(NAMES).map(function(k){ var p = fc(k, tr); return [k, te.reduce(function(s, v, i){ return s + Math.abs(v - p[i]); }, 0) / 12]; });
     var best = res.reduce(function(a, b){ return b[1] < a[1] ? b : a; });
     read.innerHTML = '<table class="cmx"><tr><th>Método</th><th>MAE en test</th></tr>' + res.map(function(r){
       return '<tr><th>' + NAMES[r[0]] + (r[0] === meth ? " ◀" : "") + '</th><td class="' + (r[0] === best[0] ? "ok" : "") + '">' + fmt(r[1], 1) + '</td></tr>'; }).join("") + '</table>' +
       '<span class="ldiag" style="flex-basis:auto;flex:1 1 240px">Gana <b>' + NAMES[best[0]] + '</b>. El MAE está en las mismas unidades que las ventas: «de media, el pronóstico se desvía ' + fmt(best[1], 1) + ' unidades al mes».</span>';
   }
   ctlSeg(ctl, "Método dibujado", [["naive", "Ingenuo"], ["snaive", "Ing. estacional"], ["lin", "Tendencia"], ["hw", "Holt-Winters"]], meth, function(v){ meth = v; draw(); });
   ctlSlider(ctl, "Tendencia (crecimiento mensual)", -0.5, 2, 0.1, trend, function(v){ return fmt(v, 1); }, function(v){ trend = v; gen(); draw(); });
   ctlSlider(ctl, "Estacionalidad (amplitud)", 0, 30, 1, amp, function(v){ return v; }, function(v){ amp = v; gen(); draw(); });
   ctlSlider(ctl, "Ruido", 0, 15, 0.5, noise, function(v){ return fmt(v, 1); }, function(v){ noise = v; gen(); draw(); });
   ctlBtn(ctl, "🎲 Otra muestra", function(){ seed++; gen(); draw(); });
   gen(); draw();
 }});

/* ── 9. BANDIT FRENTE A A/B ──────────────────────────────────── */
LABS.push({id:"bandit", g:"dec", ic:"🎰", dim:"2D", t:"Bandit frente a test A/B",
 q:"¿Cuánto cuesta aprender cuál es la mejor variante?",
 intro:"Tres versiones de una página con conversión real del 4%, 5% y 6,5% (que nadie conoce). Simulamos 30.000 visitas con dos estrategias: <b>A/B clásico</b> (un tercio para cada una hasta el final) y <b>Thompson sampling</b> (va desplazando el tráfico hacia la que parece ganar).",
 notice:["El bandit manda cada vez más tráfico a la variante C (la mejor) mientras aprende. El A/B sigue regalando 2/3 del tráfico a las peores hasta el final.",
   "El «regret» es la conversión perdida frente a haber sabido desde el principio cuál era la mejor. El del A/B crece en línea recta; el del bandit se aplana.",
   "Con diferencias pequeñas entre variantes, al bandit le cuesta más decidirse: la exploración nunca es gratis."],
 models:["bandit","qlearning","sarsa","uplift"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 320, K = makeCanvas(stage, W, H, "Reparto de tráfico y regret acumulado"), ctx = K.ctx;
   var rates, gapMode = "g", timer = null, st;
   function init(){
     rates = gapMode === "g" ? [0.04, 0.05, 0.065] : [0.05, 0.052, 0.055];
     st = {t:0, ab:{n:[0, 0, 0], c:0, reg:[]}, ts:{n:[0, 0, 0], a:[1, 1, 1], b:[1, 1, 1], c:0, reg:[]}, r:mulberry(8)};
   }
   function betaS(r, a, b){ var x = gammaS(r, a), y = gammaS(r, b); return x / (x + y); }
   function gammaS(r, k){
     if(k < 1) return gammaS(r, k + 1) * Math.pow(r(), 1 / k);
     var d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
     for(;;){ var x = gauss(r), v = Math.pow(1 + c * x, 3); if(v <= 0) continue; var u = r(); if(Math.log(u) < 0.5 * x * x + d - d * v + d * Math.log(v)) return d * v; }
   }
   var best = function(){ return Math.max.apply(null, rates); };
   function step(nv){
     var r = st.r;
     for(var i = 0; i < nv; i++){
       var a = st.t % 3; st.ab.n[a]++; if(r() < rates[a]) st.ab.c++;
       var s = [0, 1, 2].map(function(j){ return betaS(r, st.ts.a[j], st.ts.b[j]); }), j = s.indexOf(Math.max.apply(null, s));
       st.ts.n[j]++; if(r() < rates[j]){ st.ts.c++; st.ts.a[j]++; } else st.ts.b[j]++;
       st.t++;
     }
     var exp = function(n){ return n[0] * rates[0] + n[1] * rates[1] + n[2] * rates[2]; };
     st.ab.reg.push(st.t * best() - exp(st.ab.n)); st.ts.reg.push(st.t * best() - exp(st.ts.n));
   }
   function draw(){
     K.clear();
     ctx.font = "bold 12px "+LABFONT; ctx.fillStyle = C.ink; ctx.fillText("Reparto del tráfico", 20, 22);
     [["A/B clásico", st.ab.n], ["Thompson (bandit)", st.ts.n]].forEach(function(row, k){
       var y = 44 + k * 70, tot = Math.max(1, row[1][0] + row[1][1] + row[1][2]), x = 20;
       ctx.fillStyle = C.text; ctx.font = "12px "+LABFONT; ctx.fillText(row[0], 20, y);
       row[1].forEach(function(n, j){ var w = n / tot * 300; ctx.fillStyle = C.c[j]; ctx.fillRect(x, y + 8, w, 26);
         if(w > 34){ ctx.fillStyle = C.bg; ctx.font = "bold 11px "+LABFONT; ctx.fillText("ABC"[j] + " " + Math.round(100 * n / tot) + "%", x + 5, y + 25); } x += w; });
     });
     ctx.font = "11px "+LABFONT; [0, 1, 2].forEach(function(j){ ctx.fillStyle = C.c[j]; ctx.fillText("■ " + "ABC"[j] + ": conversión real " + fmt(100 * rates[j], 1) + "%", 20, 200 + j * 16); });
     var mx = Math.max(10, st.ab.reg[st.ab.reg.length - 1] || 0);
     var A = axes(ctx, [400, 20, 340, 250], [0, 30000], [0, mx * 1.1], C, {xl:"visitas", yl:"conversiones perdidas", xt:[0, 15000, 30000], yt:[0, Math.round(mx)]});
     [["ab", C.c[3], "A/B"], ["ts", C.c[2], "Bandit"]].forEach(function(s){
       var arr = st[s[0]].reg; ctx.strokeStyle = s[1]; ctx.lineWidth = 2.5; ctx.beginPath();
       arr.forEach(function(v, i){ var x = A.sx((i + 1) * 500), y = A.sy(v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
       if(arr.length){ ctx.fillStyle = s[1]; ctx.font = "bold 11px "+LABFONT; ctx.fillText(s[2], A.sx(arr.length * 500) - 40, A.sy(arr[arr.length - 1]) - 6); }
     });
     read.innerHTML = '<span>Visitas <b>' + st.t.toLocaleString("es-ES") + '</b></span><span>Conversiones A/B <b>' + st.ab.c + '</b></span><span>Conversiones bandit <b>' + st.ts.c + '</b></span><span>Ventaja del bandit <b>' + (st.ts.c - st.ab.c >= 0 ? "+" : "") + (st.ts.c - st.ab.c) + '</b></span>';
   }
   function play(){
     clearInterval(timer);
     timer = setInterval(function(){ if(st.t >= 30000){ clearInterval(timer); return; } step(500); draw(); }, 70);
   }
   ctlBtn(ctl, "▶ Simular", play, true);
   ctlBtn(ctl, "⏸ Pausa", function(){ clearInterval(timer); });
   ctlBtn(ctl, "↺ Reiniciar", function(){ clearInterval(timer); init(); draw(); });
   ctlSeg(ctl, "Diferencia entre variantes", [["g", "Grande"], ["p", "Pequeña"]], gapMode, function(v){ gapMode = v; clearInterval(timer); init(); draw(); });
   init(); draw();
   return function(){ clearInterval(timer); };
 }});


/* ══════════════════════════════════════════════════════════════
   LABORATORIOS 3D (three.js, carga bajo demanda)
   Convención: eje Y de three.js = vertical (la «y» del modelo o
   la altura); X y Z = variables de entrada.
   ══════════════════════════════════════════════════════════════ */

/* ── 1. DESCENSO DE GRADIENTE ─────────────────────────────────── */
LABS.splice(1, 0, {id:"descenso", g:"fund", ic:"⛰️", dim:"3D", t:"Descenso de gradiente",
 q:"¿Cómo «aprende» un modelo bajando por la superficie del error?",
 intro:"La superficie es el <b>error del modelo</b> para cada combinación de dos parámetros (w₁, w₂): cuanto más alto, peor. La bola empieza en un punto malo y en cada paso baja en la dirección de mayor pendiente. El tamaño del paso es el <b>learning rate</b>.",
 notice:["Learning rate pequeño: baja seguro pero <b>muy despacio</b> (muchos pasos).",
   "Learning rate grande: la bola <b>rebota</b> de una ladera a otra del valle; demasiado grande y sale disparada (diverge).",
   "El valle es estrecho y alargado: la bola hace zigzag. El <b>momentum</b> (el impulso que arrastra de los pasos anteriores) lo corrige y llega antes. Por eso optimizadores como Adam lo incorporan."],
 models:["mlp","gbr","xgboost","logistica","lightgbm","rnn","transformer"],
 build:function(stage, ctl, read){
   var lr = 0.06, mom = false, timer = null;
   return lab3d(stage, read, function(K){
     var S = scene3d(stage, K, {cam:[5.5, 5.2, 6.5], target:[0, 0.8, 0], label:"Superficie de error con una bola que desciende"}), T = S.T, C = S.C;
     var a = 1, b = 9, ang = Math.PI / 6, ca = Math.cos(ang), sa = Math.sin(ang);
     var loss = function(w1, w2){ var u = ca * w1 + sa * w2, v = -sa * w1 + ca * w2; return 0.5 * (a * u * u + b * v * v); };
     var grad = function(w1, w2){ var u = ca * w1 + sa * w2, v = -sa * w1 + ca * w2, gu = a * u, gv = b * v; return [ca * gu - sa * gv, sa * gu + ca * gv]; };
     var H = function(L){ return 0.75 * Math.log(1 + L); };   /* escala logarítmica: se ve todo el valle sin recortar */
     var N = 70, geo = new T.PlaneGeometry(6, 6, N, N); geo.rotateX(-Math.PI / 2);
     var pos = geo.attributes.position, cols = [], c1 = new T.Color(C.c[0]), c2 = new T.Color(C.c[1]), tmp = new T.Color();
     for(var i = 0; i < pos.count; i++){ var x = pos.getX(i), z = pos.getZ(i), y = H(loss(x, z)); pos.setY(i, y); tmp.copy(c1).lerp(c2, Math.min(1, y / 3.2)); cols.push(tmp.r, tmp.g, tmp.b); }
     geo.setAttribute("color", new T.Float32BufferAttribute(cols, 3)); geo.computeVertexNormals();
     S.scene.add(new T.Mesh(geo, new T.MeshStandardMaterial({vertexColors:true, roughness:0.85, side:T.DoubleSide, transparent:true, opacity:0.9})));
     var wire = new T.LineSegments(new T.WireframeGeometry(new T.PlaneGeometry(6, 6, 24, 24).rotateX(-Math.PI / 2)), new T.LineBasicMaterial({color:C.line, transparent:true, opacity:0.25}));
     var wp = wire.geometry.attributes.position; for(i = 0; i < wp.count; i++) wp.setY(i, H(loss(wp.getX(i), wp.getZ(i))) + 0.01);
     S.scene.add(wire);
     var ball = new T.Mesh(new T.SphereGeometry(0.13, 24, 16), new T.MeshStandardMaterial({color:C.c[5], roughness:0.3})); S.scene.add(ball);
     var minM = new T.Mesh(new T.SphereGeometry(0.07, 16, 10), new T.MeshStandardMaterial({color:C.c[2]})); minM.position.set(0, 0.02, 0); S.scene.add(minM);
     S.label("mínimo", [0, 0.35, 0], C.c[2]); S.label("w₁", [3.4, 0, 0]); S.label("w₂", [0, 0, 3.4]); S.label("error (escala log)", [-3.1, 3.6, -3.1]);
     var pathGeo = new T.BufferGeometry(), pathMat = new T.LineBasicMaterial({color:C.c[5]}), path = new T.Line(pathGeo, pathMat); S.scene.add(path);
     var w, vel, steps, hist, state;
     function reset(){ clearInterval(timer); w = [-2.6, 1.9]; vel = [0, 0]; steps = 0; hist = [w.slice()]; state = "listo"; paint(); }
     function paint(){
       var L = loss(w[0], w[1]), cw = [Math.max(-3, Math.min(3, w[0])), Math.max(-3, Math.min(3, w[1]))];
       ball.position.set(cw[0], H(loss(cw[0], cw[1])) + 0.13, cw[1]);
       var pts = []; hist.forEach(function(h){ var x = Math.max(-3, Math.min(3, h[0])), z = Math.max(-3, Math.min(3, h[1])); pts.push(new T.Vector3(x, H(loss(x, z)) + 0.05, z)); });
       pathGeo.setFromPoints(pts);
       read.innerHTML = '<span>Paso <b>' + steps + '</b></span><span>Error <b>' + (L > 999 ? "∞" : fmt(L, 3)) + '</b></span><span class="ldiag">' +
         (state === "diverge" ? "<b class='lbad'>Diverge</b>: el paso es tan grande que cada salto empeora el error." :
          state === "ok" ? "<b class='lgood'>Ha llegado al mínimo</b> en " + steps + " pasos." :
          state === "lento" ? "<b class='lwarn'>Muy lento</b>: tras 150 pasos aún no ha llegado." :
          state === "corriendo" ? "Bajando… fíjate en la forma de la trayectoria (recta, en zigzag o rebotando)." : "Pulsa «Descender».") + '</span>';
     }
     function go(){
       clearInterval(timer); if(state !== "listo") reset();
       timer = setInterval(function(){
         var g = grad(w[0], w[1]);
         if(mom){ vel = [0.85 * vel[0] - lr * g[0], 0.85 * vel[1] - lr * g[1]]; w = [w[0] + vel[0], w[1] + vel[1]]; }
         else w = [w[0] - lr * g[0], w[1] - lr * g[1]];
         steps++; hist.push(w.slice()); state = "corriendo";
         var L = loss(w[0], w[1]);
         if(L > 200 || !isFinite(L)){ state = "diverge"; clearInterval(timer); }
         else if(L < 1e-3){ state = "ok"; clearInterval(timer); }
         else if(steps >= 150){ state = "lento"; clearInterval(timer); }
         paint();
       }, 90);
     }
     ctlBtn(ctl, "▶ Descender", go, true);
     ctlBtn(ctl, "↺ Volver a empezar", reset);
     ctlSlider(ctl, "Learning rate (tamaño del paso)", 0.01, 0.26, 0.01, lr, function(v){ return fmt(v); }, function(v){ lr = v; reset(); });
     ctlCheck(ctl, "Momentum (impulso)", mom, function(v){ mom = v; reset(); });
     reset();
     return function(){ clearInterval(timer); S.dispose(); };
   });
 }});

/* ── 2. PLANO DE REGRESIÓN ────────────────────────────────────── */
LABS.push({id:"plano", g:"sup", ic:"📐", dim:"3D", t:"El plano de la regresión múltiple",
 q:"¿Qué dibuja de verdad una regresión con dos variables?",
 intro:"Cada esfera es una vivienda: <b>superficie</b> (eje rosa), <b>habitaciones</b> (eje morado) y <b>precio</b> (altura). La regresión lineal múltiple busca el <b>plano</b> que deja la menor suma de errores al cuadrado. Las líneas verticales son los <b>residuos</b>: lo que el plano no explica.",
 notice:["La pendiente del plano en cada dirección <b>es</b> el coeficiente: cuánto sube el precio por cada unidad de esa variable, con la otra fija.",
   "Con más ruido, los residuos crecen y el R² baja, pero el plano apenas cambia: la tendencia sigue ahí.",
   "Sube la «curvatura real»: los residuos dejan de ser aleatorios (los extremos quedan por encima y el centro por debajo). Ese patrón te dice que una relación lineal no basta."],
 models:["linmult","linsimple","ridge","lasso","poisson"],
 build:function(stage, ctl, read){
   var noise = 0.25, curv = 0, seed = 2, showRes = true;
   return lab3d(stage, read, function(K){
     var S = scene3d(stage, K, {cam:[5.4, 3.6, 5.8], target:[0, 0.9, 0], auto:true, label:"Nube de puntos con plano de regresión"}), T = S.T, C = S.C;
     S.floor(4, 8);
     var axM = function(col){ return new T.LineBasicMaterial({color:col}); };
     [[[-2, 0, -2], [2.3, 0, -2], C.c[5]], [[-2, 0, -2], [-2, 0, 2.3], C.c[0]], [[-2, 0, -2], [-2, 2.8, -2], C.c[2]]].forEach(function(a){
       S.scene.add(new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3().fromArray(a[0]), new T.Vector3().fromArray(a[1])]), axM(a[2])));
     });
     S.label("superficie (m²)", [2.5, 0.1, -2.1], C.c[5]); S.label("habitaciones", [-2.1, 0.1, 2.6], C.c[0]); S.label("precio", [-2, 3.0, -2], C.c[2]);
     var n = 70, P = S.points(n, 0.07);
     var planeGeo = new T.BufferGeometry(), plane = new T.Mesh(planeGeo, new T.MeshStandardMaterial({color:C.c[0], transparent:true, opacity:0.32, side:T.DoubleSide, depthWrite:false}));
     var edge = new T.LineLoop(new T.BufferGeometry(), new T.LineBasicMaterial({color:C.c[0]}));
     S.scene.add(plane); S.scene.add(edge);
     var resL = new T.LineSegments(new T.BufferGeometry(), new T.LineBasicMaterial({color:C.c[1]})); S.scene.add(resL);
     function rebuild(){
       var r = mulberry(seed), X = [], Y = [];
       for(var i = 0; i < n; i++){
         var x1 = -1 + 2 * r(), x2 = -1 + 2 * r();
         var y = 1.3 + 0.55 * x1 + 0.3 * x2 + curv * (x1 * x1 + x2 * x2 - 0.66) * 0.9 + noise * gauss(r);
         X.push([x1, x2]); Y.push(y);
       }
       var A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], bb = [0, 0, 0];
       X.forEach(function(x, i){ var f = [1, x[0], x[1]]; for(var p = 0; p < 3; p++){ bb[p] += f[p] * Y[i]; for(var q = 0; q < 3; q++) A[p][q] += f[p] * f[q]; } });
       var B = solveLin(A, bb), ym = Y.reduce(function(s, v){ return s + v; }, 0) / n, ssr = 0, sst = 0, segs = [];
       X.forEach(function(x, i){
         var yh = B[0] + B[1] * x[0] + B[2] * x[1]; ssr += (Y[i] - yh) * (Y[i] - yh); sst += (Y[i] - ym) * (Y[i] - ym);
         P.set(i, x[0] * 2, Y[i], x[1] * 2); P.color(i, Y[i] >= yh ? C.c[1] : C.c[3]);
         segs.push(x[0] * 2, Y[i], x[1] * 2, x[0] * 2, yh, x[1] * 2);
       });
       P.done();
       var cn = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(function(c){ return new T.Vector3(c[0] * 2, B[0] + B[1] * c[0] + B[2] * c[1], c[1] * 2); });
       planeGeo.setFromPoints([cn[0], cn[1], cn[2], cn[0], cn[2], cn[3]]); planeGeo.computeVertexNormals();
       edge.geometry.setFromPoints(cn);
       resL.geometry.setAttribute("position", new T.Float32BufferAttribute(segs, 3)); resL.visible = showRes;
       var R2 = 1 - ssr / sst;
       read.innerHTML = '<span class="leq">precio ≈ <b>' + fmt(B[0]) + '</b> + <b>' + fmt(B[1]) + '</b>·superficie + <b>' + fmt(B[2]) + '</b>·habitaciones</span><span>R² <b>' + fmt(R2) + '</b></span>' +
         '<span class="ldiag">' + (curv > 0.35 ? "<b class='lwarn'>Residuos con patrón</b>: la relación real es curva y el plano no la recoge." : "Esferas naranjas: por encima del plano · rojas: por debajo.") + '</span>';
     }
     ctlSlider(ctl, "Ruido en los datos", 0, 0.7, 0.05, noise, function(v){ return fmt(v); }, function(v){ noise = v; rebuild(); });
     ctlSlider(ctl, "Curvatura real (no lineal)", 0, 1, 0.05, curv, function(v){ return fmt(v); }, function(v){ curv = v; rebuild(); });
     ctlCheck(ctl, "Mostrar residuos", showRes, function(v){ showRes = v; resL.visible = v; });
     ctlBtn(ctl, "🎲 Otra muestra", function(){ seed++; rebuild(); });
     rebuild();
     return S.dispose;
   });
 }});

/* ── 3. EL TRUCO DEL KERNEL ───────────────────────────────────── */
LABS.push({id:"kernel", g:"sup", ic:"🪄", dim:"3D", t:"El truco del kernel",
 q:"¿Cómo separa un SVM con una recta lo que no se puede separar con una recta?",
 intro:"Dos clases en el suelo: un círculo (naranja) rodeado por un anillo (morado). Ninguna línea recta las separa. Pulsa <b>«Levantar»</b>: cada punto sube a una altura igual a su distancia al centro al cuadrado, <b>x² + z²</b>. Ahora un simple plano horizontal las separa.",
 notice:["En 2D la frontera tendría que ser un círculo. En 3D basta un <b>plano plano</b>: el problema se ha vuelto lineal.",
   "Si proyectas ese plano de vuelta al suelo, aparece el <b>círculo</b>: así obtiene el SVM fronteras curvas.",
   "El «truco» es que el kernel calcula el parecido entre puntos como si estuvieran en ese espacio elevado <b>sin construirlo nunca</b>; con el kernel RBF, ese espacio tiene infinitas dimensiones."],
 models:["svmker","svmlin","svr","gp"],
 build:function(stage, ctl, read){
   var lifted = false, showPlane = true, showRing = true;
   return lab3d(stage, read, function(K){
     var S = scene3d(stage, K, {cam:[5.2, 2.1, 5.4], target:[0, 0.8, 0], label:"Puntos elevados sobre un paraboloide y plano separador"}), T = S.T, C = S.C;
     S.floor(6, 12);
     var r = mulberry(9), pts = [], k = 0.42, rCut = 1.2;
     for(var i = 0; i < 110; i++){ var a = 2 * Math.PI * r(), rr = 0.95 * Math.sqrt(r()); pts.push([rr * Math.cos(a), rr * Math.sin(a), 1]); }
     for(i = 0; i < 170; i++){ a = 2 * Math.PI * r(); rr = 1.5 + 0.8 * r(); pts.push([rr * Math.cos(a), rr * Math.sin(a), 0]); }
     var P = S.points(pts.length, 0.065);
     pts.forEach(function(p, j){ P.color(j, p[2] ? C.c[1] : C.c[0]); });
     var prof = []; for(i = 0; i <= 30; i++){ var x = i / 30 * 2.4; prof.push(new T.Vector2(x, k * x * x)); }
     var bowl = new T.Mesh(new T.LatheGeometry(prof, 48), new T.MeshBasicMaterial({color:C.muted, wireframe:true, transparent:true, opacity:0}));
     S.scene.add(bowl);
     var plane = new T.Mesh(new T.PlaneGeometry(5.2, 5.2).rotateX(-Math.PI / 2), new T.MeshStandardMaterial({color:C.c[2], transparent:true, opacity:0, side:T.DoubleSide, depthWrite:false}));
     plane.position.y = k * rCut * rCut; S.scene.add(plane);
     var cpts = []; for(i = 0; i <= 96; i++){ a = i / 96 * 2 * Math.PI; cpts.push(new T.Vector3(rCut * Math.cos(a), 0.01, rCut * Math.sin(a))); }
     var ring = new T.Line(new T.BufferGeometry().setFromPoints(cpts), new T.LineBasicMaterial({color:C.c[2], transparent:true, opacity:0})); S.scene.add(ring);
     S.label("x", [3.2, 0, 0]); S.label("z", [0, 0, 3.2]); var hl = S.label("altura = x² + z²", [-2.4, 2.6, -2.4], C.c[2]); hl.visible = false;
     var prog = 0;
     S.onFrame(function(){
       var tgt = lifted ? 1 : 0; prog += (tgt - prog) * 0.06; if(Math.abs(tgt - prog) < 0.002) prog = tgt;
       var e = prog * prog * (3 - 2 * prog);
       pts.forEach(function(p, j){ P.set(j, p[0], 0.07 + e * k * (p[0] * p[0] + p[1] * p[1]), p[1]); }); P.done();
       bowl.material.opacity = 0.18 * e;
       plane.material.opacity = (showPlane ? 0.35 : 0) * (e > 0.95 ? (e - 0.95) * 20 : 0);
       ring.material.opacity = showRing && e > 0.95 ? 1 : 0;
       hl.visible = e > 0.5;
     });
     function paint(){
       read.innerHTML = '<span class="ldiag">' + (lifted ? "<b class='lgood'>Separable con un plano.</b> En el suelo, ese mismo plano equivale al círculo verde: la frontera curva del SVM." : "En el suelo, <b>ninguna recta</b> separa el círculo naranja del anillo morado.") + '</span>';
       btn.innerHTML = lifted ? "⤓ Volver al suelo" : "⤒ Levantar con φ(x, z) = x² + z²";
     }
     var btn = ctlBtn(ctl, "", function(){ lifted = !lifted; paint(); }, true);
     ctlCheck(ctl, "Plano separador", showPlane, function(v){ showPlane = v; });
     ctlCheck(ctl, "Frontera proyectada en el suelo", showRing, function(v){ showRing = v; });
     paint();
     return S.dispose;
   });
 }});

/* ── 4. K-MEANS PASO A PASO ───────────────────────────────────── */
LABS.push({id:"kmeans3d", g:"unsup", ic:"📍", dim:"3D", t:"K-Means paso a paso",
 q:"¿Cómo encuentra K-Means los grupos, y por qué a veces se equivoca?",
 intro:"Clientes en 3 variables (por ejemplo, recencia, frecuencia y gasto, ya estandarizadas). Los octaedros son los <b>centroides</b>. Avanza paso a paso: <b>asignar</b> (cada punto toma el color del centro más cercano) y <b>mover</b> (cada centro va a la media de sus puntos).",
 notice:["La <b>inercia</b> (suma de distancias al cuadrado) baja en cada paso hasta que nada cambia: el algoritmo ha convergido.",
   "Con inicialización aleatoria, a veces dos centros caen en el mismo grupo y otro grupo se queda partido: converge a una solución <b>peor</b> (inercia más alta). Por eso se usa k-means++ y n_init = 10.",
   "Si pones un K distinto del número real de grupos, K-Means obedece igualmente: trocea o fusiona grupos. Elegir K es decisión tuya (codo, silueta, negocio)."],
 models:["kmeans","kmedoids","gmm","som"],
 build:function(stage, ctl, read){
   var k = 4, init = "pp", seed = 1, timer = null;
   return lab3d(stage, read, function(K){
     var S = scene3d(stage, K, {cam:[5.5, 4.2, 6], target:[0, 0, 0], label:"Puntos en 3D agrupados por K-Means"}), T = S.T, C = S.C;
     var r = mulberry(31), X = [], centers = [[-1.5, -1, -1], [1.4, 1.2, -1.2], [1.2, -1.3, 1.4], [-1.2, 1.3, 1.3]];
     centers.forEach(function(c){ for(var i = 0; i < 60; i++) X.push([c[0] + 0.42 * gauss(r), c[1] + 0.42 * gauss(r), c[2] + 0.42 * gauss(r)]); });
     var P = S.points(X.length, 0.055); X.forEach(function(x, i){ P.set(i, x[0], x[1], x[2]); }); P.done();
     var box = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(5, 5, 5)), new T.LineBasicMaterial({color:C.line})); S.scene.add(box);
     var cms = [], cen = [], tgt = [], lab = [], it = 0, phase = "assign", conv = false;
     var d2 = function(a, b){ return (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]) + (a[2] - b[2]) * (a[2] - b[2]); };
     function start(){
       clearInterval(timer); cms.forEach(function(m){ S.scene.remove(m); m.geometry.dispose(); m.material.dispose(); }); cms = [];
       var rg = mulberry(seed * 13 + k); cen = [];
       if(init === "pp"){
         cen.push(X[Math.floor(rg() * X.length)].slice());
         while(cen.length < k){
           var ds = X.map(function(x){ return Math.min.apply(null, cen.map(function(c){ return d2(x, c); })); }), tot = ds.reduce(function(a, b){ return a + b; }), u = rg() * tot, acc = 0;
           for(var i = 0; i < X.length; i++){ acc += ds[i]; if(acc >= u){ cen.push(X[i].slice()); break; } }
         }
       } else {
         var blob = Math.floor(rg() * 4);
         for(var j = 0; j < k; j++) cen.push(X[(j < 2 ? blob * 60 : Math.floor(rg() * X.length)) + (j < 2 ? Math.floor(rg() * 60) : 0)].slice());
       }
       tgt = cen.map(function(c){ return c.slice(); });
       for(j = 0; j < k; j++){
         var m = new T.Mesh(new T.OctahedronGeometry(0.2), new T.MeshStandardMaterial({color:C.c[j % 6], roughness:0.3, emissive:C.c[j % 6], emissiveIntensity:0.25}));
         S.scene.add(m); cms.push(m);
       }
       lab = X.map(function(){ return -1; }); it = 0; phase = "assign"; conv = false;
       X.forEach(function(_, i){ P.color(i, C.muted); }); P.done(); paint();
     }
     S.onFrame(function(){ cms.forEach(function(m, j){ for(var a = 0; a < 3; a++) cen[j][a] += (tgt[j][a] - cen[j][a]) * 0.12; m.position.set(cen[j][0], cen[j][1], cen[j][2]); m.rotation.y += 0.02; }); });
     function inertia(){ return X.reduce(function(s, x, i){ return s + (lab[i] >= 0 ? d2(x, tgt[lab[i]]) : 0); }, 0); }
     function stepOnce(){
       if(conv) return;
       if(phase === "assign"){
         var changed = 0;
         X.forEach(function(x, i){ var b = 0; tgt.forEach(function(c, j){ if(d2(x, c) < d2(x, tgt[b])) b = j; }); if(b !== lab[i]){ changed++; lab[i] = b; } P.color(i, C.c[b % 6]); });
         P.done(); it++; phase = "move"; if(changed === 0 && it > 1) conv = true;
       } else {
         tgt = tgt.map(function(c, j){ var s = [0, 0, 0], n = 0; X.forEach(function(x, i){ if(lab[i] === j){ s[0] += x[0]; s[1] += x[1]; s[2] += x[2]; n++; } }); return n ? [s[0] / n, s[1] / n, s[2] / n] : c; });
         phase = "assign";
       }
       paint();
     }
     function paint(){
       read.innerHTML = '<span>Iteración <b>' + it + '</b></span><span>Próximo paso <b>' + (conv ? "—" : phase === "assign" ? "asignar" : "mover centros") + '</b></span><span>Inercia <b>' + (it ? fmt(inertia(), 1) : "—") + '</b></span>' +
         '<span class="ldiag">' + (conv ? "<b class='lgood'>Convergido</b>: ningún punto cambia de grupo. Prueba otra inicialización y compara la inercia." : "Cada «asignar» colorea; cada «mover» desplaza los centros a la media.") + '</span>';
     }
     ctlBtn(ctl, "⏭ Siguiente paso", function(){ clearInterval(timer); stepOnce(); }, true);
     ctlBtn(ctl, "▶ Hasta el final", function(){ clearInterval(timer); timer = setInterval(function(){ if(conv){ clearInterval(timer); return; } stepOnce(); }, 650); });
     ctlBtn(ctl, "🎲 Nueva inicialización", function(){ seed++; start(); });
     ctlSeg(ctl, "Inicialización", [["pp", "k-means++"], ["bad", "Al azar (mala suerte)"]], init, function(v){ init = v; start(); });
     ctlSlider(ctl, "K", 2, 6, 1, k, function(v){ return v; }, function(v){ k = v; start(); });
     start();
     return function(){ clearInterval(timer); S.dispose(); };
   });
 }});

/* ── 5. PCA EN 3D ─────────────────────────────────────────────── */
LABS.push({id:"pca3d", g:"unsup", ic:"🧭", dim:"3D", t:"PCA: la mejor foto de los datos",
 q:"¿Cómo resume PCA tres variables en dos sin perder casi nada?",
 intro:"Una nube de datos con forma de «tabla alargada». Las flechas son los <b>componentes principales</b>: PC1 apunta hacia donde los datos más varían; PC2, hacia donde más varían de lo que queda, en perpendicular; PC3 recoge el resto. Pulsa <b>«Aplastar a 2D»</b> para proyectar sobre el plano PC1-PC2.",
 notice:["Si la nube es delgada (poco grosor), al aplastarla casi no cambia: PC3 tenía muy poca información y la <b>varianza explicada</b> por PC1 + PC2 es casi el 100%.",
   "Sube el grosor: ahora PC3 importa y aplastar a 2D <b>pierde</b> información de verdad.",
   "Los componentes son <b>combinaciones</b> de las variables originales, no variables escogidas: PC1 puede ser «un poco de todo»."],
 models:["pca","lda","tsne","umap","autoenc","qda"],
 build:function(stage, ctl, read){
   var thick = 0.2, mode = 3;
   return lab3d(stage, read, function(K){
     var S = scene3d(stage, K, {cam:[5, 3.8, 5.6], target:[0, 0, 0], auto:true, label:"Nube 3D con ejes de componentes principales"}), T = S.T, C = S.C;
     var n = 260, P = S.points(n, 0.05), base = [], r = mulberry(12);
     for(var i = 0; i < n; i++) base.push([gauss(r), gauss(r), gauss(r)]);
     var R = (function(){ var a = 0.6, b = -0.45, c = 0.35, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c);
       return [[cb * cc, -cb * sc, sb], [sa * sb * cc + ca * sc, -sa * sb * sc + ca * cc, -sa * cb], [-ca * sb * cc + sa * sc, ca * sb * sc + sa * cc, ca * cb]]; })();
     var X = [], E = [], cur = [], arrows = [], plane = null, labels = [];
     function compute(){
       X = base.map(function(s){ var v = [1.5 * s[0], 0.65 * s[1], thick * s[2]]; return [0, 1, 2].map(function(i2){ return R[i2][0] * v[0] + R[i2][1] * v[1] + R[i2][2] * v[2]; }); });
       var m = [0, 0, 0]; X.forEach(function(x){ for(var a = 0; a < 3; a++) m[a] += x[a] / n; }); X = X.map(function(x){ return [x[0] - m[0], x[1] - m[1], x[2] - m[2]]; });
       var Cv = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; X.forEach(function(x){ for(var a = 0; a < 3; a++) for(var b2 = 0; b2 < 3; b2++) Cv[a][b2] += x[a] * x[b2] / (n - 1); });
       E = jacobiEig(Cv);
       arrows.forEach(function(a){ S.scene.remove(a); }); labels.forEach(function(l){ S.scene.remove(l); l.material.map.dispose(); l.material.dispose(); }); arrows = []; labels = [];
       E.forEach(function(e, j){
         var dir = new T.Vector3(e.vec[0], e.vec[1], e.vec[2]).normalize(), len = Math.max(0.35, 2.2 * Math.sqrt(e.val));
         var ar = new T.ArrowHelper(dir, new T.Vector3(0, 0, 0), len, new T.Color(C.c[j]).getHex(), 0.2, 0.12); S.scene.add(ar); arrows.push(ar);
         labels.push(S.label("PC" + (j + 1), [dir.x * (len + 0.3), dir.y * (len + 0.3), dir.z * (len + 0.3)], C.c[j]));
       });
       if(plane){ S.scene.remove(plane); plane.geometry.dispose(); }
       var u = new T.Vector3().fromArray(E[0].vec), v = new T.Vector3().fromArray(E[1].vec), q = [];
       [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]].forEach(function(c){ q.push(u.clone().multiplyScalar(c[0] * 3.4).add(v.clone().multiplyScalar(c[1] * 1.8))); });
       plane = new T.Mesh(new T.BufferGeometry().setFromPoints(q), new T.MeshBasicMaterial({color:C.c[0], transparent:true, opacity:0, side:T.DoubleSide, depthWrite:false}));
       S.scene.add(plane);
       if(!cur.length) cur = X.map(function(x){ return x.slice(); });
       var tot = E[0].val + E[1].val + E[2].val;
       read.innerHTML = '<div class="lvar">' + E.map(function(e, j){ var p = e.val / tot; return '<div class="lvr"><span>PC' + (j + 1) + '</span><span class="lvb"><i style="width:' + (100 * p) + '%;background:' + C.c[j] + '"></i></span><b>' + pct(p) + '</b></div>'; }).join("") + '</div>' +
         '<span class="ldiag">' + (mode === 3 ? "Varianza que conservarías con 2 componentes: <b>" + pct((E[0].val + E[1].val) / tot) + "</b>." : mode === 2 ? "Proyectado a 2D: has perdido el <b>" + pct(E[2].val / tot) + "</b> de la información." : "Solo PC1: conservas el <b>" + pct(E[0].val / tot) + "</b>.") + '</span>';
     }
     function target(x){
       if(mode === 3) return x;
       var e1 = E[0].vec, e2 = E[1].vec, a = x[0] * e1[0] + x[1] * e1[1] + x[2] * e1[2], b = x[0] * e2[0] + x[1] * e2[1] + x[2] * e2[2];
       return mode === 2 ? [a * e1[0] + b * e2[0], a * e1[1] + b * e2[1], a * e1[2] + b * e2[2]] : [a * e1[0], a * e1[1], a * e1[2]];
     }
     S.onFrame(function(){
       X.forEach(function(x, i){ var t = target(x); for(var a = 0; a < 3; a++) cur[i][a] += (t[a] - cur[i][a]) * 0.08; P.set(i, cur[i][0], cur[i][1], cur[i][2]); P.color(i, C.text); });
       P.done(); if(plane) plane.material.opacity += ((mode === 2 ? 0.18 : 0) - plane.material.opacity) * 0.1;
     });
     ctlSeg(ctl, "Vista", [["3", "Datos en 3D"], ["2", "Aplastar a 2D (PC1-PC2)"], ["1", "Solo PC1 (1D)"]], "3", function(v){ mode = +v; compute(); });
     ctlSlider(ctl, "Grosor de la nube (información en la 3.ª dirección)", 0.05, 1.2, 0.05, thick, function(v){ return fmt(v); }, function(v){ thick = v; compute(); });
     compute();
     return S.dispose;
   });
 }});


LABS.sort(function(a,b){ return ["sobreajuste","descenso","regul","umbral","plano","arbol2d","kernel","kmeans3d","densidad","pca3d","aislamiento","serie","gp","bandit"].indexOf(a.id) - ["sobreajuste","descenso","regul","umbral","plano","arbol2d","kernel","kmeans3d","densidad","pca3d","aislamiento","serie","gp","bandit"].indexOf(b.id); });
