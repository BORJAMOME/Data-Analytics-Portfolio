/* ── SUPERVIVENCIA, CAUSALIDAD Y REDES NEURONALES ─────────────── */

EASY.cox = {
 frase:"No pregunta «¿se irá?», sino <b>«¿cuándo se irá y qué lo acelera?»</b>.",
 pasos:[
  "Para cada cliente anotas cuánto tiempo lleva y si ya se fue (evento) o sigue activo (<b>censurado</b>: sabes que aguantó al menos hasta hoy).",
  "<b>Kaplan-Meier</b> dibuja la curva de supervivencia: qué % sigue activo en cada mes, usando también a los censurados.",
  "<b>Cox</b> añade variables: cada una multiplica el «ritmo de bajas» por un <b>hazard ratio</b> (HR).",
  "HR = 1,8 significa que, en cualquier mes, ese grupo se va a un ritmo 1,8 veces mayor.",
  "Compruebas que ese efecto sea estable en el tiempo (riesgos proporcionales) antes de fiarte."],
 ej:'<p>Kaplan-Meier con 10 clientes (× = baja, ○ = sigue activo):</p><div class="wrapt"><table><tr><th>Mes</th><th>Qué pasa</th><th>En riesgo</th><th class="hl">Supervivencia</th></tr>'+
  '<tr><td>2</td><td>× 1 baja</td><td>10</td><td class="hl">1 × 9/10 = 90%</td></tr><tr><td>3</td><td>○ 1 censurado (alta reciente)</td><td>9</td><td class="hl">90% (no cambia)</td></tr><tr><td>5</td><td>× 1 baja</td><td>8</td><td class="hl">90% × 7/8 = 78,8%</td></tr><tr><td>6</td><td>× 1 baja</td><td>7</td><td class="hl">78,8% × 6/7 = 67,5%</td></tr><tr><td>8</td><td>○ 1 censurado</td><td>6</td><td class="hl">67,5% (no cambia)</td></tr><tr><td>9</td><td>× 1 baja</td><td>5</td><td class="hl">67,5% × 4/5 = 54,0%</td></tr></table></div>'+
  '<p class="res">El censurado del mes 3 no se tira: cuenta como «en riesgo» mientras le vimos y luego sale sin restar supervivencia. Tirarlo haría creer que la gente se va <b>antes</b> de lo que se va.</p>',
 rec:["Modela el <b>tiempo hasta el evento</b> y aprovecha los casos censurados.",
  "HR &gt; 1 acelera el evento; HR &lt; 1 lo retrasa.",
  "Comprueba el supuesto de <b>riesgos proporcionales</b> (check_assumptions)."]};
CASOS.cox = [
 ["📺","Suscripciones","Saber en qué mes de vida conviene lanzar la acción de retención.","Curvas de supervivencia por segmento y HR de cada factor (sin permanencia, pago con tarjeta…).","Campaña en el mes 6, justo antes del pico de bajas."],
 ["⚙️","Industria","¿Cuándo fallará cada máquina? Muchas aún no han fallado nunca.","Usa las máquinas sin fallo como censuradas; HR por condiciones de uso.","Calendario de mantenimiento por riesgo, no por fecha fija."],
 ["👔","RR. HH.","¿Cuánto tiempo se quedan los nuevos empleados y qué alarga su permanencia?","HR de factores como teletrabajo, mentor o salario relativo.","Política de onboarding que reduce la rotación del primer año."]];

EASY.uplift = {
 frase:"No busca a quién le gusta la oferta, sino a quién <b>le hace cambiar de opinión</b>.",
 pasos:[
  "Haces un experimento: a un grupo aleatorio le envías la acción (tratamiento) y a otro no (control).",
  "Entrenas un modelo que estima, para cada persona, su probabilidad de comprar <b>con</b> y <b>sin</b> la acción.",
  "La diferencia es su <b>uplift</b>: el efecto incremental que causa la acción en esa persona.",
  "Ordenas a los clientes por uplift (no por probabilidad de compra) y actúas sobre los de arriba.",
  "Evalúas con la curva de Qini o el uplift por decil, nunca con AUC."],
 ej:'<p>Los cuatro tipos de cliente ante un cupón (probabilidad de compra en 30 días):</p><div class="wrapt"><table><tr><th>Tipo</th><th>Con cupón</th><th>Sin cupón</th><th class="hl">Uplift</th><th>¿Enviar?</th></tr>'+
  '<tr><td>Persuadible</td><td>60%</td><td>10%</td><td class="hl">+50 pp</td><td>Sí</td></tr><tr><td>Seguro (compra igual)</td><td>90%</td><td>90%</td><td class="hl">0</td><td>No: margen regalado</td></tr><tr><td>Perdido</td><td>5%</td><td>5%</td><td class="hl">0</td><td>No</td></tr><tr><td>«Perro dormido»</td><td>20%</td><td>50%</td><td class="hl">−30 pp</td><td>¡Nunca!</td></tr></table></div>'+
  '<p class="res">Un modelo de propensión mandaría el cupón a los «seguros» (90% de compra): parece un éxito y no aporta nada. El uplift lo manda a los <b>persuadibles</b>.</p>',
 rec:["Mide el <b>efecto incremental</b> por persona: compra con acción − compra sin acción.",
  "Necesita un <b>grupo de control aleatorio</b>.",
  "Ojo a los «perros dormidos»: la acción les perjudica."]};
CASOS.uplift = [
 ["🎟️","Retail","2 millones de cupones al trimestre: ¿a quién le hacen falta de verdad?","Modelo T-learner con la campaña anterior (tratados vs control aleatorio).","Mismas ventas incrementales con un 40% menos de cupones."],
 ["📞","Telecomunicaciones","Llamadas de retención que a algunos clientes les recuerdan que pueden irse.","Detecta los «perros dormidos» y los excluye de la lista.","Menos bajas provocadas por la propia campaña."],
 ["💊","Farmacia","¿Qué médicos cambian su prescripción tras la visita del delegado?","Uplift por médico estimado con un piloto aleatorizado.","Rutas de visita centradas en quien sí cambia."]];

EASY.propensity = {
 frase:"Si no hiciste un experimento, <b>fabricas uno a posteriori</b> comparando con «gemelos» o con la evolución de otros.",
 pasos:[
  "<b>Propensity score</b>: estimas la probabilidad de que cada unidad recibiera la acción según sus características.",
  "Emparejas cada tratado con un no tratado de probabilidad parecida: son «gemelos» comparables.",
  "<b>Diff-in-Diff</b>: comparas cuánto cambió el grupo tratado antes/después y le restas cuánto cambió el de control en el mismo periodo.",
  "Así descuentas lo que habría pasado igualmente (la tendencia general).",
  "Validas los supuestos: balance de variables tras emparejar y <b>tendencias paralelas</b> antes de la acción."],
 ej:'<p>Subida de precio en 40 tiendas. Unidades vendidas por semana:</p><div class="wrapt"><table><tr><th>Grupo</th><th>Antes</th><th>Después</th><th>Cambio</th></tr>'+
  '<tr><td>Tiendas con subida</td><td>1.000</td><td>900</td><td>−100</td></tr><tr><td>Tiendas de control</td><td>800</td><td>760</td><td>−40</td></tr><tr class="hl"><td class="hl">Diferencia de diferencias</td><td></td><td></td><td class="hl">−60</td></tr></table></div>'+
  '<p class="res">Comparar solo las tratadas (−100) exageraría el daño: −40 lo habrían perdido igualmente (verano, competencia…). El efecto atribuible al precio es <b>−60 unidades/semana</b>, si las tendencias eran paralelas antes.</p>',
 rec:["Efecto causal con datos <b>observacionales</b>, a cambio de supuestos.",
  "DiD exige <b>tendencias paralelas</b> previas: compruébalo con varios periodos.",
  "Si hay un factor no medido que influye en tratamiento y resultado, el efecto sale sesgado."]};
CASOS.propensity = [
 ["🏷️","Precios","¿Cuánto volumen hizo perder la subida de precio aplicada en 40 tiendas?","Diff-in-Diff contra tiendas comparables emparejadas por propensión.","Decisión de extender o revertir la subida al resto de la red."],
 ["🎓","Formación interna","¿Rinden más los comerciales que hicieron el curso (voluntario)?","Emparejamiento por propensión para comparar con «gemelos» que no lo hicieron.","Saber si el curso merece hacerse obligatorio."],
 ["🏙️","Sector público","Efecto de una zona de bajas emisiones sobre las ventas del comercio local.","DiD frente a barrios similares sin restricción.","Evaluación de impacto con cifras para el pleno municipal."]];

EASY.mlp = {
 frase:"Capas de <b>pequeñas calculadoras conectadas</b> que aprenden solas qué combinaciones de datos importan.",
 pasos:[
  "Cada neurona hace una suma ponderada de lo que le llega (pesos × entradas + sesgo).",
  "Pasa el resultado por una <b>función de activación</b> no lineal (ReLU: si es negativo, 0).",
  "Las neuronas de una capa alimentan a las de la siguiente; la última da la predicción.",
  "Compara la predicción con la realidad (función de pérdida) y la <b>retropropagación</b> calcula cuánto culpa a cada peso.",
  "Ajusta todos los pesos un poquito (descenso de gradiente) y repite durante varias épocas, vigilando la validación."],
 ej:'<p>Red mínima con 2 entradas (x₁ = 1, x₂ = 0,5), 2 neuronas ocultas ReLU y salida sigmoide:</p><div class="wrapt"><table><tr><th>Neurona</th><th>Suma ponderada</th><th class="hl">Activación</th></tr>'+
  '<tr><td>Oculta 1</td><td>0,8·1 − 0,4·0,5 + 0,1 = 0,70</td><td class="hl">ReLU → 0,70</td></tr><tr><td>Oculta 2</td><td>−0,5·1 + 0,9·0,5 − 0,2 = −0,25</td><td class="hl">ReLU → 0 (apagada)</td></tr><tr><td>Salida</td><td>1,5·0,70 − 1,0·0 − 0,3 = 0,75</td><td class="hl">sigmoide → 0,68</td></tr></table></div>'+
  '<p class="res">Probabilidad = <b>68%</b>. Entrenar es ajustar esos 9 números (pesos y sesgos) para que, sobre miles de casos, las salidas se parezcan a la realidad. Sin ReLU, toda la red sería una simple regresión lineal.</p>',
 rec:["Aprende <b>interacciones no lineales</b> que no sabes formular.",
  "Estandariza, empieza pequeño y vigila la curva de <b>validación</b> (no la de train).",
  "En tablas, compara siempre con logística y boosting: muchas veces no gana."]};
CASOS.mlp = [
 ["💳","Fintech","Scoring de solicitantes sin historial con 120 señales de comportamiento.","Captura interacciones complejas entre señales.","Solo se despliega si bate a la logística en PR-AUC (comparación documentada)."],
 ["⚡","Energía","Previsión de consumo eléctrico horario (tu notebook).","Aprende la relación no lineal con hora, temperatura y laborable.","Compra de energía ajustada al día siguiente."],
 ["🎬","Opiniones","Sentimiento de reseñas IMDB (tu notebook).","Red sobre vectores de texto que aprende combinaciones de palabras.","Panel de satisfacción actualizado a diario."]];

EASY.cnn = {
 frase:"Una <b>lupa que recorre la imagen</b> buscando patrones pequeños y los va combinando en otros más grandes.",
 pasos:[
  "Un <b>filtro</b> (una cuadrícula 3×3 de números) se desliza por toda la imagen.",
  "En cada posición multiplica sus números por los píxeles que tapa y suma: si el patrón coincide, sale un número grande.",
  "El resultado es un <b>mapa de características</b>: dónde aparece ese patrón (bordes, esquinas…).",
  "El <b>pooling</b> resume cada zona (por ejemplo, el máximo de cada 2×2) para reducir tamaño.",
  "Capa a capa: bordes → texturas → formas → objetos. Los filtros no se diseñan: se aprenden."],
 ej:'<p>Filtro de borde vertical [−1 0 +1] (repetido en 3 filas) sobre dos trozos de imagen 3×3:</p><div class="wrapt"><table><tr><th>Trozo de imagen</th><th>Cálculo</th><th class="hl">Respuesta</th></tr>'+
  '<tr><td>Oscuro a la izquierda, claro a la derecha: [0 0 9] × 3 filas</td><td>3 × (−1·0 + 0·0 + 1·9)</td><td class="hl">27 (¡borde!)</td></tr><tr><td>Uniforme: [5 5 5] × 3 filas</td><td>3 × (−5 + 0 + 5)</td><td class="hl">0 (nada)</td></tr></table></div>'+
  '<p class="res">El mismo filtro se usa en toda la imagen (pesos compartidos): por eso una CNN reconoce un borde, o un gato, <b>esté donde esté</b>.</p>',
 rec:["Filtros que se deslizan + pooling = la arquitectura clásica de <b>visión</b>.",
  "En empresa casi nunca se entrena desde cero: <b>fine-tuning</b> de un modelo preentrenado.",
  "Valida con imágenes de otras tiendas, horas y cámaras: si no, el modelo engaña."]};
CASOS.cnn = [
 ["🛒","Retail","Contar producto en el lineal con fotos del equipo de tienda.","Detector preentrenado (familia YOLO) ajustado con unos cientos de imágenes propias.","Alertas de rotura de lineal y de incumplimiento de planograma."],
 ["🚗","Movilidad","Contar vehículos en vídeo de autopista (tu notebook).","Detección + seguimiento de objetos fotograma a fotograma.","Datos de aforo sin sensores físicos."],
 ["🏭","Calidad","Detectar arañazos en piezas al final de la línea.","Clasificador de imágenes ajustado con ejemplos de defectos.","Inspección del 100% de piezas en lugar de un muestreo."]];

EASY.rnn = {
 frase:"Lee los datos <b>en orden</b> y lleva una libreta de notas que actualiza a cada paso.",
 pasos:[
  "En cada paso recibe el dato actual y su «libreta» (estado oculto) del paso anterior.",
  "Combina ambos y escribe una libreta nueva que resume todo lo visto hasta ahora.",
  "Problema: en una RNN simple las notas antiguas se <b>borran poco a poco</b> (gradiente desvanecido).",
  "La <b>LSTM</b> añade puertas que deciden qué olvidar, qué apuntar y qué consultar, y conserva lo importante muchos pasos.",
  "Al final (o en cada paso) la libreta se usa para predecir."],
 ej:'<p>¿Cuánto queda de la información del primer paso después de t pasos?</p><div class="wrapt"><table><tr><th>Pasos</th><th>RNN simple (factor 0,5 por paso)</th><th class="hl">LSTM (puerta de olvido 0,95)</th></tr>'+
  '<tr><td>5</td><td>3,1%</td><td class="hl">77%</td></tr><tr><td>12</td><td>0,02%</td><td class="hl">54%</td></tr><tr><td>52 (un año de semanas)</td><td>≈ 0</td><td class="hl">7%</td></tr></table></div>'+
  '<p class="res">Con la RNN simple, la semana 1 no influye nada en la semana 12; la LSTM sí puede recordar el efecto de una campaña de hace tres meses.</p>',
 rec:["Para datos donde el <b>orden importa</b> (secuencias, series, texto).",
  "La LSTM resuelve el <b>olvido</b> de la RNN simple con puertas.",
  "Hoy compite con Transformers y modelos fundacionales de series; compara con una línea base simple."]};
CASOS.rnn = [
 ["⚙️","Industria","Anticipar fallos con 48 h de antelación a partir de la secuencia de sensores.","La LSTM capta degradaciones lentas que los agregados pierden.","Paradas preventivas planificadas."],
 ["🛍️","E-commerce","Predecir el siguiente producto que verá un usuario en su sesión.","Modela la secuencia de clics de la sesión.","Recomendaciones en tiempo real dentro de la visita."],
 ["🏦","Banca","Detectar fraude por la secuencia de operaciones de una tarjeta.","Aprende patrones temporales (pequeños cargos de prueba antes de uno grande).","Bloqueo antes del cargo grande."]];

EASY.transformer = {
 frase:"Lee toda la frase a la vez y, para cada palabra, decide <b>a qué otras palabras prestar atención</b>.",
 pasos:[
  "Convierte cada palabra en un vector y le suma información de su posición.",
  "Cada palabra genera una «pregunta» (Q), una «etiqueta» (K) y un «contenido» (V).",
  "Compara su pregunta con las etiquetas de todas las demás: cuanto más encajan, más <b>atención</b> (softmax de QKᵀ/√d).",
  "Su nueva representación es la mezcla de los contenidos de las palabras a las que atiende.",
  "Se repite en muchas capas y cabezas en paralelo: así se construyen los LLM."],
 ej:'<p>«El banco estaba lleno de peces»: atención de la palabra <b>banco</b> hacia las demás (softmax de puntuaciones ilustrativas).</p><div class="wrapt"><table><tr><th>Palabra</th><th>Puntuación</th><th class="hl">Atención</th></tr>'+
  '<tr><td>El</td><td>0,1</td><td class="hl">6%</td></tr><tr><td>banco</td><td>1,0</td><td class="hl">16%</td></tr><tr><td>estaba</td><td>0,3</td><td class="hl">8%</td></tr><tr><td>lleno</td><td>0,8</td><td class="hl">13%</td></tr><tr><td>de</td><td>0,0</td><td class="hl">6%</td></tr><tr><td>peces</td><td>2,2</td><td class="hl">52%</td></tr></table></div>'+
  '<p class="res">«banco» atiende sobre todo a «peces» y su representación se acerca a «orilla del río», no a «entidad financiera». Eso es <b>entender por contexto</b>.</p>',
 rec:["La <b>atención</b> deja que cada elemento mire a todos los demás en paralelo.",
  "Base de los LLM; en empresa se usa preentrenado (prompting o fine-tuning).",
  "Caro de servir: justifica la mejora frente a modelos simples."]};
CASOS.transformer = [
 ["🧾","Seguros","Extraer campos estructurados de partes de siniestro escritos en texto libre.","Entiende «no se aprecia daño estructural» en vez de contar la palabra «daño».","Tramitación automática del 60% de partes."],
 ["💬","Atención al cliente","Clasificar la intención y el sentimiento de miles de chats.","Comprensión semántica real, incluso con ironía y faltas.","Priorización de conversaciones de clientes enfadados."],
 ["📚","Conocimiento interno","Asistente que responde con la documentación de la empresa (RAG).","Busca fragmentos relevantes y redacta la respuesta citándolos.","Menos consultas repetidas al equipo experto."]];

EASY.autoenc = {
 frase:"Aprende a <b>resumir y reconstruir</b> lo normal; lo que no sabe reconstruir es sospechoso.",
 pasos:[
  "Una red «encoder» comprime cada caso en un vector pequeño (el <b>cuello de botella</b>).",
  "Otra red «decoder» intenta reconstruir el caso original a partir de ese resumen.",
  "Se entrena <b>solo con casos normales</b>, para que aprenda cómo es lo normal.",
  "Para un caso nuevo, mides el <b>error de reconstrucción</b>: cuánto difiere lo reconstruido del original.",
  "Si el error supera un umbral (p. ej., el percentil 99 de los normales), salta la alerta."],
 ej:'<p>Error de reconstrucción en transacciones (umbral = P99 de las normales = 0,08):</p><div class="wrapt"><table><tr><th>Transacción</th><th>Tipo real</th><th class="hl">Error</th><th>Alerta</th></tr>'+
  '<tr><td>Compra en supermercado</td><td>Normal</td><td class="hl">0,02</td><td>No</td></tr><tr><td>Gasolina de madrugada</td><td>Normal</td><td class="hl">0,05</td><td>No</td></tr><tr><td>5 compras online en 2 min en otro país</td><td>Fraude</td><td class="hl">0,41</td><td>Sí</td></tr></table></div>'+
  '<p class="res">El modelo nunca vio fraude: simplemente no sabe reconstruir algo tan raro. Por eso detecta <b>tipos nuevos</b> de anomalía sin etiquetas.</p>',
 rec:["Detecta anomalías por <b>error de reconstrucción</b>, sin etiquetas.",
  "Entrénalo <b>solo con datos normales</b>.",
  "Cuello de botella demasiado ancho = lo reconstruye todo (y no detecta nada)."]};
CASOS.autoenc = [
 ["🌀","Energía","Comportamiento anómalo de una turbina con 200 señales correlacionadas.","Detecta combinaciones imposibles aunque cada señal esté en rango.","Avisos de mantenimiento con días de antelación."],
 ["💳","Pagos","Fraude de tipos nunca vistos, sin etiquetas.","Error de reconstrucción alto = operación que no se parece a nada normal.","Revisión de las 300 operaciones más raras del día."],
 ["🌐","Ciberseguridad","Tráfico de red anómalo en un servidor.","Aprende el patrón normal de cada servidor.","Alerta temprana de intrusiones."]];

EASY.rbm = {
 frase:"Una red de dos capas que descubre los <b>«gustos ocultos»</b> que explican lo que observas.",
 pasos:[
  "Capa visible: lo que observas (qué películas ha visto alguien). Capa oculta: factores latentes («le gusta la acción»).",
  "Cada visible está conectada con cada oculta (y nada más: por eso es «restringida»).",
  "Desde lo visible calcula la probabilidad de activar cada factor oculto.",
  "Desde los factores reconstruye lo visible: así sugiere películas que encajan con los gustos inferidos.",
  "Se entrena con divergencia contrastiva (ida y vuelta varias veces). Hoy casi no se usa: tiene interés histórico."],
 ej:'<p>Un usuario ha visto dos películas de acción. P(gusto acción) = σ(2,0 + 2,0 − 1,0) = σ(3,0):</p><div class="wrapt"><table><tr><th>Paso</th><th>Cálculo</th><th class="hl">Probabilidad</th></tr>'+
  '<tr><td>Activar «gusto acción»</td><td>σ(3,0)</td><td class="hl">95%</td></tr><tr><td>Reconstruir «Jungla de cristal» (no vista)</td><td>σ(2,5 − 1,0)</td><td class="hl">82%</td></tr><tr><td>Reconstruir «Notting Hill» (no vista)</td><td>σ(−0,5 − 1,0)</td><td class="hl">18%</td></tr></table></div>'+
  '<p class="res">Recomienda «Jungla de cristal». La misma idea (factores latentes) hoy se resuelve mejor con factorización matricial o autoencoders.</p>',
 rec:["Modelo <b>generativo</b> con capa visible y capa oculta.",
  "Fue clave en el Netflix Prize y en el preentrenamiento de redes profundas.",
  "Hoy está en desuso: entiéndela como historia del campo."]};
CASOS.rbm = [
 ["🎬","Streaming (histórico)","Netflix Prize (2006-2009): predecir valoraciones de películas.","Las RBM fueron uno de los modelos del ensemble ganador.","Mejora del RMSE sobre el sistema de Netflix."],
 ["🧠","Investigación","Preentrenar redes profundas capa a capa (Deep Belief Networks, 2006).","Inicializaba pesos cuando entrenar redes profundas desde cero fallaba.","Abrió la puerta al deep learning moderno."],
 ["🎓","Docencia","Explicar modelos generativos y de energía.","Ejemplo pequeño y visual de variables latentes.","Base para entender modelos generativos actuales."]];

EASY.som = {
 frase:"Un <b>tablero de casillas</b> donde los perfiles parecidos acaban en casillas vecinas.",
 pasos:[
  "Crea una rejilla (por ejemplo, 10×10) de neuronas; cada una tiene un perfil al azar.",
  "Toma un dato y busca la neurona más parecida: la <b>BMU</b> (best matching unit).",
  "Acerca el perfil de la BMU al dato, y también (un poco menos) el de sus <b>vecinas</b> en la rejilla.",
  "Repite miles de veces reduciendo poco a poco el radio de vecindad y el ritmo de aprendizaje.",
  "Resultado: un mapa 2D ordenado, donde cerca significa parecido. Puedes colorearlo por variable o agrupar casillas."],
 ej:'<p>Un paso de entrenamiento (ritmo 0,5), con perfiles de 2 variables (gasto, frecuencia) estandarizadas a 0-1:</p><div class="wrapt"><table><tr><th>Neurona</th><th>Antes</th><th>Influencia</th><th class="hl">Después</th></tr>'+
  '<tr><td>BMU</td><td>(0,20; 0,80)</td><td>100% → 0,5</td><td class="hl">(0,40; 0,60)</td></tr><tr><td>Vecina</td><td>(0,10; 0,90)</td><td>30% → 0,15</td><td class="hl">(0,175; 0,825)</td></tr><tr><td>Lejana</td><td>(0,90; 0,10)</td><td>0%</td><td class="hl">sin cambios</td></tr></table></div>'+
  '<p class="res">Dato presentado: (0,60; 0,40). La BMU se acerca mucho, la vecina un poco: por eso las zonas del mapa quedan <b>ordenadas</b>.</p>',
 rec:["Clusteriza y <b>dibuja el mapa</b> a la vez; cercanía = parecido.",
  "Es una red <b>no supervisada de una capa</b> (no es deep learning).",
  "Estandariza; mira la U-Matrix para ver las fronteras entre grupos."]};
CASOS.som = [
 ["⚽","Deporte","Encontrar jugadores con perfil parecido al objetivo en ligas más baratas (tu notebook).","El ojeador señala la casilla del jugador y mira quién cae al lado.","Lista corta de fichajes alternativos."],
 ["🛒","Retail","Segmentación de clientes que el equipo comercial pueda explorar (tu notebook).","Mapa con zonas de clientes coloreadas por gasto, frecuencia y canal.","Segmentos con fronteras visibles y fáciles de explicar."],
 ["📋","Encuestas","Agrupar miles de respuestas de satisfacción con 40 preguntas.","Mapa de perfiles de opinión con transiciones suaves entre zonas.","Plan de acción por zona del mapa."]];
