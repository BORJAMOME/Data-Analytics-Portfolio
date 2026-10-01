/* ── SUPERVISADO · CLASIFICACIÓN ─────────────────────────────── */

EASY.logistica = {
 frase:"Convierte una puntuación en una <b>probabilidad entre 0 y 1</b> de que algo pase (sí/no).",
 pasos:[
  "Calcula una puntuación como una regresión lineal: z = β₀ + β₁·x₁ + β₂·x₂…",
  "Pasa esa puntuación por una <b>curva en S</b> (sigmoide): 1 / (1 + e<sup>−z</sup>). Todo lo que entra sale entre 0 y 1.",
  "Aprende los β buscando los que hacen <b>más probables</b> los sí y no que realmente pasaron (máxima verosimilitud).",
  "Cada coeficiente se lee como <b>odds ratio</b>: e<sup>β</sup> = cuántas veces se multiplican las probabilidades a favor por cada unidad extra.",
  "Tú decides el <b>umbral</b>: a partir de qué probabilidad actúas, según lo que cuesta cada error."],
 ej:'<p>Probabilidad de baja según los tickets de soporte del último mes: <b>z = −3 + 0,8 × tickets</b>.</p><div class="wrapt"><table><tr><th>Tickets</th><th>z</th><th class="hl">P(baja) = 1/(1+e<sup>−z</sup>)</th></tr>'+
  '<tr><td>0</td><td>−3,0</td><td class="hl">4,7%</td></tr><tr><td>2</td><td>−1,4</td><td class="hl">19,8%</td></tr><tr><td>5</td><td>+1,0</td><td class="hl">73,1%</td></tr></table></div>'+
  '<p class="res">e<sup>0,8</sup> = 2,23: cada ticket extra <b>multiplica por 2,2 las odds</b> (probabilidades a favor) de irse. Con umbral 0,5 llamarías al cliente de 5 tickets; con umbral 0,15, también al de 2.</p>',
 rec:["Devuelve una <b>probabilidad</b>, no solo una etiqueta; el umbral lo pones tú.",
  "Coeficientes interpretables: e<sup>β</sup> es el <b>odds ratio</b>.",
  "Con clases desbalanceadas, olvídate de la accuracy: mira PR-AUC y recall."]};
CASOS.logistica = [
 ["🏦","Banca","¿Concedo este préstamo? El regulador exige poder explicar cada denegación.","Scoring con probabilidad de impago y motivos legibles (odds ratio por variable).","Política de riesgo auditable y umbral ligado a la pérdida esperada."],
 ["📧","Marketing","¿Quién abrirá la newsletter de mañana?","Probabilidad de apertura por suscriptor según historial y hora de envío.","Enviar solo al top 40%: misma conversión con menos bajas por saturación."],
 ["🏥","Salud","Riesgo de reingreso a 30 días tras el alta.","Probabilidad por paciente con factores interpretables para el equipo médico.","Seguimiento telefónico a los pacientes por encima del umbral clínico."]];

EASY.arbol = {
 frase:"Un juego de <b>«¿Quién es quién?»</b>: preguntas de sí o no que acaban en una decisión.",
 pasos:[
  "Mira todas las preguntas posibles («¿antigüedad &lt; 6 meses?», «¿tickets &gt; 2?») y elige la que <b>mejor separa</b> a los que se van de los que se quedan.",
  "Mide «mejor separa» con la <b>impureza de Gini</b>: 0 si un grupo es puro (todos iguales), 0,5 si está mezclado al 50%.",
  "Divide los datos con esa pregunta y repite dentro de cada rama.",
  "Para cuando llega a la profundidad máxima o las hojas tienen muy pocos casos.",
  "Para predecir un caso nuevo, lo bajas por el árbol respondiendo las preguntas hasta llegar a una hoja."],
 ej:'<p>10 clientes, 5 se van (Gini inicial = 1 − 0,5² − 0,5² = <b>0,50</b>). Pregunta candidata: «¿antigüedad &lt; 6 meses?»</p><div class="wrapt"><table><tr><th>Rama</th><th>Clientes</th><th>Se van</th><th>Gini</th></tr>'+
  '<tr><td>Sí (&lt; 6 meses)</td><td>4</td><td>4</td><td>0 (pura)</td></tr><tr><td>No</td><td>6</td><td>1</td><td>1 − (1/6)² − (5/6)² = 0,28</td></tr></table></div>'+
  '<p class="res">Gini medio tras el corte = 0,4 × 0 + 0,6 × 0,28 = <b>0,17</b> (antes 0,50). Es una gran pregunta: el árbol la pondrá arriba del todo.</p>',
 rec:["Se lee como un <b>diagrama de flujo</b>: el modelo más fácil de explicar a negocio.",
  "Sin límites <b>memoriza</b>: controla max_depth y min_samples_leaf.",
  "Solo corta en horizontal/vertical y es inestable: en producción suele ir dentro de un bosque."]};
CASOS.arbol = [
 ["🧾","Backoffice","Automatizar la aprobación de reclamaciones pequeñas con reglas auditables.","Un árbol de profundidad 4 se convierte en la política escrita del motor de decisión.","El 60% de las reclamaciones se resuelve sin intervención humana."],
 ["📞","Telecomunicaciones","Guion para el equipo de retención: ¿qué cliente está en riesgo y por qué?","Las ramas («sin permanencia y más de 2 incidencias») son el argumentario.","Guion de llamada distinto por rama de riesgo."],
 ["🏪","Retail","¿Qué tiendas necesitarán refuerzo de personal el sábado?","Reglas simples sobre previsión de tráfico, eventos y clima.","Regla de refuerzo que el jefe de zona entiende y aplica."]];

EASY.rf = {
 frase:"Pregunta a <b>cientos de árboles distintos</b> y quédate con lo que vota la mayoría.",
 pasos:[
  "Crea muchas muestras de tus datos sacando filas al azar con reemplazo (<b>bootstrap</b>): cada árbol ve una versión distinta.",
  "Entrena un árbol con cada muestra; en cada corte solo le dejas mirar un <b>subconjunto aleatorio de variables</b>.",
  "Así los árboles se equivocan de formas diferentes.",
  "Para predecir, todos votan; la proporción de votos es la probabilidad.",
  "Las filas que un árbol no vio (out-of-bag, ~37%) sirven para evaluarlo «gratis»."],
 ej:'<p>Un cliente nuevo y cinco árboles del bosque:</p><div class="wrapt"><table><tr><th>Árbol</th><th>Vio…</th><th>Su voto</th></tr>'+
  '<tr><td>1</td><td>muestra A, variables {edad, saldo}</td><td>Impago</td></tr><tr><td>2</td><td>muestra B, {saldo, retrasos}</td><td>Impago</td></tr><tr><td>3</td><td>muestra C, {edad, ingresos}</td><td>Paga</td></tr><tr><td>4</td><td>muestra D, {retrasos, ingresos}</td><td>Impago</td></tr><tr><td>5</td><td>muestra E, {edad, retrasos}</td><td>Paga</td></tr></table></div>'+
  '<p class="res">3 de 5 votan impago → probabilidad ≈ <b>60%</b>. Con 500 árboles, si 380 votan impago → <b>76%</b>. Cada árbol falla a su manera; al votar, los errores se compensan.</p>',
 rec:["Bagging: muchos árboles <b>en paralelo</b> con datos y variables al azar.",
  "Robusto <b>sin apenas ajuste</b>; más árboles nunca empeora (solo tarda más).",
  "Para importancia de variables, usa permutación, no feature_importances_ por impureza."]};
CASOS.rf = [
 ["🏥","Salud","Anticipar reingresos hospitalarios con historiales llenos de nulos y outliers.","Funciona bien sin apenas ajuste y el OOB da una evaluación honesta.","Seguimiento al alta para el 10% de mayor riesgo."],
 ["🌾","Agroseguros","Clasificar parcelas con riesgo de granizo a partir de clima y satélite.","Combina cientos de variables heterogéneas sin preprocesado pesado.","Tarifa por parcela y no por comarca."],
 ["💳","Medios de pago","Primer modelo de fraude mientras el equipo construye el definitivo.","Baseline sólido en días, con importancia de variables para entender el fraude.","Bloqueo de las operaciones con más de 0,8 de probabilidad."]];

EASY.extratrees = {
 frase:"Un Random Forest todavía <b>más aleatorio</b>: en vez de buscar el mejor corte, lo sortea.",
 pasos:[
  "Como en Random Forest, cada nodo mira un subconjunto aleatorio de variables.",
  "Pero en vez de probar todos los umbrales posibles, <b>sortea un umbral al azar</b> por variable.",
  "De esos pocos cortes aleatorios, se queda con el mejor.",
  "Por defecto cada árbol usa todas las filas (sin bootstrap).",
  "Al promediar cientos de árboles, el azar se compensa: menos varianza y entrenamiento mucho más rápido."],
 ej:'<p>Variable «edad» con 52 valores distintos en un nodo:</p><div class="wrapt"><table><tr><th>Método</th><th>Cortes evaluados</th><th>Corte elegido</th></tr>'+
  '<tr><td>Random Forest</td><td>51 (todos los posibles)</td><td>37,5 años (el óptimo en esta muestra)</td></tr><tr class="hl"><td class="hl">Extra Trees</td><td class="hl">1 (sorteado entre 18 y 70)</td><td class="hl">41,3 años</td></tr></table></div>'+
  '<p class="res">El «óptimo» de 37,5 está optimizado sobre el ruido de esta muestra; el corte sorteado es peor en un árbol, pero al promediar 500 árboles el resultado suele ser <b>igual de bueno y bastante más rápido</b>.</p>',
 rec:["Cortes <b>aleatorios</b>: más rápido y menos varianza que Random Forest.",
  "Suele igualarlo en precisión; pierde con pocos datos y señal muy sutil.",
  "Ideal cuando el cuello de botella es el <b>tiempo de reentrenamiento</b>."]};
CASOS.extratrees = [
 ["🛡️","Ciberseguridad","Reentrenar cada 4 horas un clasificador de eventos maliciosos.","Entrena mucho más rápido que Random Forest con resultados equivalentes.","Modelo siempre al día frente a ataques nuevos."],
 ["🎮","Videojuegos","Detectar trampas en partidas con cientos de métricas por jugador.","Rápido de iterar mientras el equipo prueba nuevas variables.","Revisión manual solo del 1% más sospechoso."],
 ["📡","Telecomunicaciones","Clasificar incidencias de red en tiempo casi real.","Buen equilibrio precisión/coste de cómputo con datos ruidosos.","Enrutado automático de la incidencia al equipo técnico correcto."]];

EASY.xgboost = {
 frase:"El boosting <b>más afinado y rápido</b>: el primer candidato serio en cualquier tabla grande.",
 pasos:[
  "Como el gradient boosting: árboles en cadena, cada uno corrige el error del anterior.",
  "Para decidir cada corte usa el gradiente (hacia dónde corregir) y la <b>curvatura</b> del error (cuánto corregir).",
  "Añade un <b>castigo</b> por complejidad: penaliza tener muchas hojas (γ) y pesos grandes en las hojas (λ).",
  "Maneja nulos solo: aprende hacia qué rama mandar los valores que faltan.",
  "Usa early stopping: deja de añadir árboles cuando la validación deja de mejorar."],
 ej:'<p>Peso de una hoja con 4 clientes (3 impagan, 1 paga), todos con probabilidad actual 0,5. Fórmula: <b>w = −G / (H + λ)</b>, con G = Σ(p − y) = −1,0 y H = Σ p(1−p) = 1,0.</p><div class="wrapt"><table><tr><th>λ (regularización)</th><th>Peso de la hoja w</th><th>Lectura</th></tr>'+
  '<tr><td>0</td><td>+1,00</td><td>Corrige a tope hacia «impago»</td></tr><tr class="hl"><td class="hl">1</td><td class="hl">+0,50</td><td class="hl">Corrige con prudencia (valor por defecto)</td></tr><tr><td>3</td><td>+0,25</td><td>Muy conservador</td></tr></table></div>'+
  '<p class="res">Con solo 4 casos en la hoja, λ evita que el modelo se crea demasiado ese pequeño grupo: es regularización <b>dentro de la propia fórmula</b>.</p>',
 rec:["Estándar de facto en <b>datos tabulares</b>: precisión máxima y rápido.",
  "Lo que más sobreajusta: <b>max_depth</b>; usa early_stopping_rounds.",
  "Desbalanceo: scale_pos_weight ≈ n_negativos / n_positivos. Explica con SHAP."]};
CASOS.xgboost = [
 ["💳","Fintech","Decidir en 2 segundos si se concede un préstamo en el punto de venta.","Scoring de impago con máxima precisión y explicación SHAP por denegación.","Menos pérdida esperada a igual tasa de aprobación."],
 ["🏋️","Gimnasios","¿Qué socios se darán de baja el próximo mes?","Combina uso, pagos y quejas con interacciones no lineales.","Campaña de retención para el top 10% de riesgo."],
 ["🏷️","Pricing","Probabilidad de que un cliente acepte una oferta según precio y contexto.","Curva de aceptación por segmento aprendida del histórico de ofertas.","Precio que maximiza el margen esperado por oferta."]];

EASY.lightgbm = {
 frase:"Un XGBoost <b>con atajos</b>: mismo boosting, varias veces más rápido con millones de filas.",
 pasos:[
  "Agrupa cada variable continua en <b>«cajones»</b> (histogramas de hasta 255 intervalos): solo prueba cortes entre cajones.",
  "Hace crecer el árbol <b>por hojas</b>: siempre divide la hoja que más mejora, aunque el árbol quede asimétrico.",
  "Además, puede descartar filas «fáciles» (GOSS) y juntar variables que nunca coinciden (EFB) para ir aún más rápido.",
  "Controla el sobreajuste con <b>num_leaves</b> y min_child_samples.",
  "Igual que XGBoost: learning rate pequeño y early stopping."],
 ej:'<p>Variable «importe» con 50.000 valores distintos en 1 millón de filas:</p><div class="wrapt"><table><tr><th>Método</th><th>Cortes candidatos por variable</th></tr>'+
  '<tr><td>Búsqueda exacta</td><td>49.999</td></tr><tr class="hl"><td class="hl">LightGBM (255 cajones)</td><td class="hl">254</td></tr></table></div>'+
  '<p class="res">~200 veces menos cortes que evaluar en esa variable, con una pérdida de precisión casi nula: el mejor corte entre cajones casi siempre está muy cerca del exacto.</p>',
 rec:["El más rápido de la familia boosting; ideal con <b>millones de filas</b>.",
  "Crece por hojas: con pocos datos sobreajusta si no limitas <b>num_leaves</b>.",
  "Mismas buenas prácticas que XGBoost: validación, early stopping, SHAP."]};
CASOS.lightgbm = [
 ["📱","Publicidad digital","Probabilidad de clic para pujar en subastas de menos de 100 ms.","Reentrena cada día sobre cientos de millones de impresiones.","Puja más ajustada: menos gasto por clic."],
 ["🛒","Supermercados","Previsión de demanda diaria para 30.000 productos × 800 tiendas.","Un único modelo global con variables de producto, tienda y calendario.","Pedidos automáticos con menos roturas y menos merma."],
 ["🏦","Banca","Scoring diario de toda la cartera de clientes.","Procesa millones de filas en minutos con hardware modesto.","Alertas tempranas de riesgo cada mañana."]];

EASY.catboost = {
 frase:"El boosting que <b>entiende categorías</b> («Madrid», «Tarifa Plus») sin que las conviertas a mano.",
 pasos:[
  "Le dices qué columnas son categóricas; no necesitas one-hot ni encodings manuales.",
  "Baraja las filas y codifica cada categoría con la media del target de las filas <b>anteriores</b> (ordered target statistics).",
  "Así ninguna fila usa su propia respuesta para codificarse: <b>sin fuga</b> de información.",
  "Usa árboles simétricos (la misma pregunta en todo un nivel): rápidos al predecir y difíciles de sobreajustar.",
  "Funciona muy bien con los valores por defecto."],
 ej:'<p>Codificación de «provincia = Madrid» fila a fila, con prior 0,3 y peso 1: <b>(bajas previas + 0,3) / (filas previas + 1)</b>.</p><div class="wrapt"><table><tr><th>Orden</th><th>¿Se va?</th><th>Filas previas de Madrid</th><th class="hl">Valor codificado</th></tr>'+
  '<tr><td>1</td><td>Sí</td><td>ninguna</td><td class="hl">(0 + 0,3)/1 = 0,30</td></tr><tr><td>2</td><td>No</td><td>1 (1 baja)</td><td class="hl">(1 + 0,3)/2 = 0,65</td></tr><tr><td>3</td><td>Sí</td><td>2 (1 baja)</td><td class="hl">(1 + 0,3)/3 = 0,43</td></tr><tr><td>4</td><td>Sí</td><td>3 (2 bajas)</td><td class="hl">(2 + 0,3)/4 = 0,58</td></tr></table></div>'+
  '<p class="res">Ninguna fila mira su propia respuesta. Con el target encoding ingenuo, la fila 1 se codificaría usando su propio «sí»: el modelo vería la solución y en producción fallaría.</p>',
 rec:["Categóricas <b>nativas y sin fuga</b> gracias a la codificación ordenada.",
  "Ideal para datos de <b>CRM</b> llenos de columnas de texto categórico.",
  "Declara bien <code>cat_features</code>; es algo más lento que LightGBM."]};
CASOS.catboost = [
 ["📶","Telecomunicaciones","Anticipar portabilidades con un CRM lleno de categorías (tarifa, terminal, canal).","Usa categorías de alta cardinalidad sin explotar en miles de columnas.","Ofertas de retención en el primer decil de riesgo."],
 ["✈️","Turismo","Probabilidad de cancelación de una reserva hotelera.","Aprovecha país, agencia, tipo de habitación y canal tal cual vienen.","Overbooking calibrado por tipo de reserva."],
 ["🚘","Seguros","Probabilidad de fraude en un parte de siniestro.","Taller, marca, modelo y provincia como categóricas nativas.","Derivación automática de partes sospechosos a peritaje."]];

EASY.adaboost = {
 frase:"Un profesor que, tras cada examen, <b>dedica más atención a los ejercicios que se fallaron</b>.",
 pasos:[
  "Todos los casos empiezan con el mismo peso.",
  "Entrena un modelo muy simple (normalmente un árbol de una sola pregunta, un «tocón»).",
  "Calcula su error ponderado ε y su voto: <b>α = ½ · ln((1 − ε) / ε)</b>. Mejor modelo → más voto.",
  "<b>Sube el peso</b> de los casos que falló y baja el de los que acertó.",
  "Repite; la predicción final es la votación ponderada de todos los tocones."],
 ej:'<p>10 casos con peso 0,1 cada uno. El primer tocón falla 2 → ε = 0,2 → α = ½ ln(0,8/0,2) = <b>0,69</b>.</p><div class="wrapt"><table><tr><th>Casos</th><th>Antes</th><th>× e<sup>±α</sup></th><th class="hl">Después (normalizado)</th></tr>'+
  '<tr><td>2 fallados</td><td>0,10 c/u</td><td>× 2 → 0,20</td><td class="hl">0,25 c/u (50% del total)</td></tr><tr><td>8 acertados</td><td>0,10 c/u</td><td>× 0,5 → 0,05</td><td class="hl">0,0625 c/u (50% del total)</td></tr></table></div>'+
  '<p class="res">Los 2 casos difíciles pasan a pesar tanto como los otros 8 juntos: el siguiente tocón está obligado a fijarse en ellos.</p>',
 rec:["El boosting original: <b>repondera casos</b> (el gradient boosting ajusta residuos).",
  "Sensible a <b>etiquetas erróneas</b>: se obsesiona con ellas.",
  "Hoy es más didáctico que práctico; útil para modelos minúsculos."]};
CASOS.adaboost = [
 ["🏭","Visión industrial","Clasificar piezas defectuosas con 30 descriptores limpios.","Modelo minúsculo de tocones que corre en el PLC de la línea.","Desvío automático de piezas dudosas a inspección manual."],
 ["📷","Cámaras","Detección de caras en tiempo real en dispositivos antiguos (Viola-Jones).","Cascada de clasificadores débiles muy rápida.","Enfoque automático en cámaras de bajo coste."],
 ["🎓","Formación","Baseline didáctico en un proyecto de clasificación.","Punto de comparación sencillo antes de pasar a XGBoost.","Medir cuánto aporta realmente el boosting moderno."]];

EASY.svmlin = {
 frase:"Separa dos grupos con la <b>carretera más ancha posible</b> entre ellos.",
 pasos:[
  "Busca una recta (o plano, o hiperplano) que deje a cada clase a un lado.",
  "De todas las que lo consiguen, elige la que deja el <b>margen más ancho</b> hasta los puntos más cercanos.",
  "Esos puntos del borde son los <b>vectores de soporte</b>: los únicos que determinan la frontera.",
  "Como los datos reales se solapan, el parámetro <b>C</b> permite algunas violaciones: C bajo = margen ancho y tolerante; C alto = estricto.",
  "Para predecir, mira a qué lado de la frontera cae el caso nuevo (y a qué distancia)."],
 ej:'<p>Frontera aprendida con datos estandarizados de edad (x₁) y salario (x₂): <b>2·x₁ + 1·x₂ − 1 = 0</b>.</p><div class="wrapt"><table><tr><th>Cliente</th><th>2·x₁ + x₂ − 1</th><th>Predicción</th></tr>'+
  '<tr><td>(1,0; 0,5)</td><td>+1,5</td><td>Compra (lado positivo, fuera del margen)</td></tr><tr><td>(0,2; 0,4)</td><td>−0,2</td><td>No compra, pero dentro del margen: dudoso</td></tr><tr><td>(−1,0; 0)</td><td>−3,0</td><td>No compra, con mucha seguridad</td></tr></table></div>'+
  '<p class="res">Anchura del margen = 2 / ‖w‖ = 2 / √(2² + 1²) = <b>0,89</b> unidades estandarizadas. Los puntos con valor entre −1 y +1 están en la «carretera».</p>',
 rec:["Maximiza el <b>margen</b>; solo importan los vectores de soporte.",
  "Excelente con <b>muchas variables y pocas filas</b> (texto).",
  "Estandariza; C alto sobreajusta. No da probabilidades calibradas (calibra si las necesitas)."]};
CASOS.svmlin = [
 ["⚖️","Legal","Clasificar contratos entrantes por tipo a partir de su texto (50.000 términos).","SVM lineal sobre TF-IDF: rápido y preciso con matrices enormes y dispersas.","Enrutado automático al equipo especialista."],
 ["📱","Retail electrónico","¿Comprará el nuevo iPhone según edad y salario? (tu notebook)","Frontera de margen máximo interpretable por sus coeficientes.","Segmento objetivo para la campaña de lanzamiento."],
 ["📰","Medios","Detectar si una noticia es de opinión o informativa.","Clasificación de texto ligera, sin GPU.","Etiquetado automático del archivo histórico."]];

EASY.svmker = {
 frase:"Si una línea recta no puede separar los grupos, <b>los levanta a otra dimensión</b> donde sí puede.",
 pasos:[
  "Imagina canicas rojas en el centro y azules alrededor: ninguna recta las separa en el suelo.",
  "Si levantas cada canica a una altura igual a su distancia al centro al cuadrado, las rojas quedan abajo y las azules arriba.",
  "Ahora una lámina plana las separa; al proyectarla al suelo se ve como un <b>círculo</b>.",
  "El <b>truco del kernel</b> hace ese «levantar» sin calcularlo: solo mide el parecido entre pares de puntos.",
  "Con el kernel RBF, <b>γ</b> controla el alcance de cada punto: γ alto = fronteras en islas (sobreajuste)."],
 ej:'<p>Elevar con z = x² + y²:</p><div class="wrapt"><table><tr><th>Punto</th><th>Clase</th><th>Distancia al centro</th><th class="hl">Altura z</th></tr>'+
  '<tr><td>(0,5; 0,3)</td><td>Centro</td><td>0,58</td><td class="hl">0,34</td></tr><tr><td>(−0,6; 0,2)</td><td>Centro</td><td>0,63</td><td class="hl">0,40</td></tr><tr><td>(1,8; 0,6)</td><td>Anillo</td><td>1,90</td><td class="hl">3,60</td></tr><tr><td>(−1,2; −1,5)</td><td>Anillo</td><td>1,92</td><td class="hl">3,69</td></tr></table></div>'+
  '<p class="res">El plano z = 2 separa perfectamente: abajo el centro, arriba el anillo. En el suelo, z = 2 es el círculo de radio √2 ≈ 1,41.</p>',
 rec:["El kernel crea fronteras <b>curvas</b> sin construir variables a mano.",
  "Los dos mandos: <b>C</b> y <b>γ</b>, que se buscan juntos.",
  "Escala mal: por encima de decenas de miles de filas, pasa a boosting."]};
CASOS.svmker = [
 ["🔋","Mantenimiento","Baterías industriales próximas al fallo: la frontera edad × uso es curva (tu notebook).","Kernel polinómico/RBF que captura la frontera no lineal con pocos datos.","Sustitución preventiva en la siguiente parada."],
 ["🩺","Diagnóstico","Clasificar muestras con decenas de biomarcadores y pocos pacientes.","Frontera no lineal robusta en alta dimensión con pocas filas.","Derivación a prueba confirmatoria."],
 ["✍️","Documentos","Reconocer dígitos manuscritos en formularios escaneados.","Clásico histórico del SVM RBF sobre píxeles.","Lectura automática de importes y fechas."]];

EASY.knn = {
 frase:"«Dime con quién andas y te diré quién eres»: copia lo que hicieron los <b>casos más parecidos</b>.",
 pasos:[
  "No entrena nada: simplemente guarda todos los casos históricos.",
  "Cuando llega uno nuevo, calcula su distancia a todos (por eso hay que <b>estandarizar</b>).",
  "Se queda con los <b>K más cercanos</b>.",
  "Predice lo que haga la mayoría (o la media, en regresión); la proporción de votos es la probabilidad.",
  "Eliges K con validación: K pequeño = frontera nerviosa; K grande = demasiado suave."],
 ej:'<p>Cliente nuevo y sus 5 vecinos más cercanos (variables estandarizadas):</p><div class="wrapt"><table><tr><th>Vecino</th><th>Distancia</th><th>¿Compró?</th></tr>'+
  '<tr><td>1</td><td>0,21</td><td>Sí</td></tr><tr><td>2</td><td>0,34</td><td>Sí</td></tr><tr><td>3</td><td>0,40</td><td>No</td></tr><tr><td>4</td><td>0,47</td><td>Sí</td></tr><tr><td>5</td><td>0,52</td><td>No</td></tr></table></div>'+
  '<p class="res">Con K = 5: 3 sí y 2 no → <b>60%</b> de probabilidad de compra. Con K = 1 diría «sí» al 100%, fiándose de un solo vecino.</p>',
 rec:["Cero entrenamiento; todo el coste está en <b>predecir</b>.",
  "Imprescindible <b>estandarizar</b>; sufre con cientos de variables.",
  "Hoy vive en la <b>búsqueda vectorial</b> (RAG, recomendadores) con índices aproximados."]};
CASOS.knn = [
 ["🛍️","E-commerce","Asignar categoría a productos nuevos de un catálogo que cambia cada día.","Busca los productos más parecidos (por atributos o embeddings) y copia su categoría.","Publicación automática sin reentrenar nada."],
 ["🏠","Inmobiliaria","Tasación por comparables: «pisos parecidos en la zona».","El precio medio de los K comparables más cercanos, con los comparables a la vista.","Informe de tasación que el cliente entiende."],
 ["🎧","Streaming","«Usuarios parecidos a ti escuchan…».","Vecinos más cercanos en el espacio de gustos.","Lista de recomendaciones personalizada."]];

EASY.nb = {
 frase:"Suma <b>pistas independientes</b> (palabras) para decidir: ¿spam o no?",
 pasos:[
  "Cuenta en el histórico cuántas veces aparece cada palabra en el spam y en el correo normal.",
  "Para cada palabra calcula cuánto más probable es en spam que en normal (su <b>razón de verosimilitudes</b>).",
  "Parte de la proporción base de spam (el <b>prior</b>).",
  "Multiplica el prior por las razones de todas las palabras del correo, <b>como si fueran independientes</b> (de ahí lo de «ingenuo»).",
  "Convierte el resultado en probabilidad y decide. Entrena en segundos incluso con millones de correos."],
 ej:'<p>Prior: 30% de los correos son spam → odds = 0,3/0,7 = <b>0,43</b>.</p><div class="wrapt"><table><tr><th>Palabra</th><th>P(palabra | spam)</th><th>P(palabra | normal)</th><th class="hl">Razón</th></tr>'+
  '<tr><td>«gratis»</td><td>0,40</td><td>0,02</td><td class="hl">× 20</td></tr><tr><td>«premio»</td><td>0,25</td><td>0,01</td><td class="hl">× 25</td></tr><tr><td>«reunión»</td><td>0,01</td><td>0,10</td><td class="hl">× 0,1</td></tr></table></div>'+
  '<p class="res">Correo con «gratis» y «premio»: 0,43 × 20 × 25 = 214 → <b>99,5% spam</b>. Correo con «gratis» y «reunión»: 0,43 × 20 × 0,1 = 0,86 → <b>46%</b>, a revisar.</p>',
 rec:["Rapidísimo y muy bueno como <b>baseline en texto</b>.",
  "Asume independencia (falso), pero suele acertar <b>qué clase gana</b>.",
  "Sus probabilidades están mal calibradas: no las uses como números exactos."]};
CASOS.nb = [
 ["✉️","Atención al cliente","Enrutar 4.000 correos diarios a facturación, incidencias, bajas o comercial.","Clasificación por palabras entrenada en segundos con el histórico etiquetado.","Respuesta un 30% más rápida por menos reenvíos."],
 ["📱","Telecomunicaciones","Filtrar SMS de spam (tu notebook).","Bolsa de palabras + Naive Bayes como filtro ligero.","Bloqueo de mensajes fraudulentos antes de llegar al cliente."],
 ["⭐","Reseñas","Clasificar opiniones en positivas o negativas.","Baseline instantáneo antes de probar un transformer.","Medir si el modelo grande compensa su coste."]];

EASY.lda = {
 frase:"Busca el <b>ángulo desde el que mirar</b> tus datos para que los grupos se vean lo más separados posible.",
 pasos:[
  "Calcula el centro de cada grupo y cuánto se dispersa cada grupo por dentro.",
  "Busca la dirección que <b>aleja los centros</b> y a la vez <b>compacta</b> cada grupo (ratio de Fisher).",
  "Proyecta los datos sobre esa dirección: queda un eje (o varios, hasta nº de clases − 1).",
  "Clasifica cada caso según de qué centro queda más cerca en ese eje.",
  "Asume que cada grupo es una campana con la <b>misma forma</b> (misma covarianza): de ahí la frontera recta."],
 ej:'<p>Clientes conservadores frente a arriesgados, proyectados sobre dos ejes posibles:</p><div class="wrapt"><table><tr><th>Eje</th><th>Media conservador</th><th>Media arriesgado</th><th>Dispersión de cada grupo</th><th class="hl">¿Se separan?</th></tr>'+
  '<tr><td>PCA (máxima varianza)</td><td>−0,3</td><td>+0,3</td><td>1,2</td><td class="hl">No: se solapan casi del todo</td></tr><tr><td>LDA (máxima separación)</td><td>−1,5</td><td>+1,5</td><td>0,6</td><td class="hl">Sí: distancia de 5 desviaciones</td></tr></table></div>'+
  '<p class="res">PCA mira dónde hay más variación, que puede no tener nada que ver con el grupo; LDA usa la etiqueta y busca justo la dirección que <b>distingue</b>.</p>',
 rec:["Clasifica y <b>reduce dimensión</b> a la vez; muy interpretable.",
  "Supone grupos gaussianos con la <b>misma covarianza</b>.",
  "No lo confundas con el LDA de temas (Latent Dirichlet Allocation)."]};
CASOS.lda = [
 ["💼","Banca privada","Perfilar clientes en conservador / moderado / arriesgado y enseñarlo en un gráfico.","Los ejes discriminantes son a la vez clasificador y mapa comercial.","Cartera modelo propuesta con un gráfico que el cliente entiende."],
 ["🧪","Laboratorio","Distinguir variedades de un producto por su composición química.","Eje que mejor separa variedades con decenas de medidas.","Control de autenticidad del producto."],
 ["🎓","Educación","Identificar qué combinación de notas separa a quienes terminan el grado de quienes abandonan.","Coeficientes discriminantes interpretables.","Tutorías dirigidas desde el primer cuatrimestre."]];

EASY.qda = {
 frase:"Como LDA, pero <b>cada grupo tiene su propia forma</b>; la frontera puede ser curva.",
 pasos:[
  "Calcula para cada grupo su centro y su <b>propia</b> dispersión (covarianza).",
  "Modela cada grupo como una campana con esa forma (estrecha, ancha, alargada…).",
  "Para un caso nuevo, calcula lo probable que es bajo cada campana (con el prior de cada grupo).",
  "Asigna el grupo más probable: la frontera resultante es una curva (parábola, elipse…).",
  "Necesita más datos que LDA: estima una covarianza por grupo. Con pocos, usa <code>reg_param</code>."],
 ej:'<p>Dos condiciones con el mismo centro (0) pero distinta dispersión: A muy concentrada (σ = 0,5) y B muy dispersa (σ = 2). Densidad de cada una:</p><div class="wrapt"><table><tr><th>Valor del marcador</th><th>Densidad A</th><th>Densidad B</th><th class="hl">Clase</th></tr>'+
  '<tr><td>0,3</td><td>0,67</td><td>0,20</td><td class="hl">A</td></tr><tr><td>1,5</td><td>0,009</td><td>0,15</td><td class="hl">B</td></tr><tr><td>−1,5</td><td>0,009</td><td>0,15</td><td class="hl">B</td></tr></table></div>'+
  '<p class="res">A ocupa el centro y B los dos lados: hacen falta <b>dos cortes</b> (≈ ±0,9). LDA, con una sola recta, no puede dibujar esa frontera.</p>',
 rec:["Una covarianza <b>por clase</b> → frontera cuadrática (curva).",
  "Necesita bastantes datos por clase; regulariza con <code>reg_param</code>.",
  "Compáralo con LDA: si ganan igual, quédate con LDA (más simple)."]};
CASOS.qda = [
 ["🩸","Diagnóstico clínico","Una condición homogénea frente a otra muy variable en los mismos marcadores.","La frontera curva respeta que cada grupo tiene su dispersión.","Derivación a prueba confirmatoria con menos falsos negativos."],
 ["🏭","Calidad","Lotes correctos (muy estables) frente a defectuosos (dispersos).","Detecta defectuosos a ambos lados del rango normal.","Bloqueo automático de lotes fuera de la región normal."],
 ["💹","Finanzas","Distinguir días de mercado «normales» de días de estrés por rentabilidad y volatilidad.","El grupo de estrés tiene mucha más dispersión: la frontera es una elipse.","Señal de alerta para el comité de riesgos."]];
