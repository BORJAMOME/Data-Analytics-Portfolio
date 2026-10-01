/* ── SUPERVISADO · REGRESIÓN ─────────────────────────────────── */

EASY.linsimple = {
 frase:"Dibuja la <b>recta que mejor pasa entre tus puntos</b> para saber cuánto sube una cosa cuando sube otra.",
 pasos:[
  "Pones en un gráfico tus datos: cada punto es una semana con su <b>gasto en publicidad</b> (eje X) y sus <b>ventas</b> (eje Y).",
  "El modelo prueba rectas y, para cada una, mide la distancia vertical de cada punto a la recta (el <b>residuo</b>: lo que falla).",
  "Eleva cada fallo al cuadrado (así los grandes pesan más y los negativos no restan) y los suma.",
  "Se queda con la recta cuya suma es <b>la más pequeña posible</b>: por eso se llama «mínimos cuadrados».",
  "La recta tiene dos números: el <b>punto de partida</b> (intercepto) y la <b>pendiente</b>, que es tu respuesta de negocio."],
 ej:'<p>Cinco semanas de una tienda online:</p><div class="wrapt"><table><tr><th>Semana</th><th>Publicidad (k€)</th><th>Ventas (k€)</th></tr>'+
  '<tr><td>1</td><td>1</td><td>12</td></tr><tr><td>2</td><td>2</td><td>15</td></tr><tr><td>3</td><td>3</td><td>19</td></tr><tr><td>4</td><td>4</td><td>20</td></tr><tr><td>5</td><td>5</td><td>24</td></tr></table></div>'+
  '<p>Media de publicidad = 3; media de ventas = 18. Pendiente = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)² = 29 / 10 = <b>2,9</b>. Intercepto = 18 − 2,9 × 3 = <b>9,3</b>.</p>'+
  '<p class="res">Recta: <b>ventas = 9,3 + 2,9 × publicidad</b>. Cada 1.000 € más de publicidad se asocian a unos 2.900 € más de ventas. Si la semana que viene inviertes 6 k€, la recta predice 9,3 + 17,4 = <b>26,7 k€</b> (ojo: 6 está fuera de lo que has visto, extrapolas).</p>',
 rec:["La <b>pendiente</b> es la respuesta: cuánto cambia Y por cada unidad de X.",
  "Mide <b>asociación, no causa</b>: si subiste la publicidad en Navidad, la recta mezcla publicidad y Navidad.",
  "Mira siempre el gráfico de residuos: si dibujan una curva, una recta no es la herramienta."]};
CASOS.linsimple = [
 ["🏪","Retail","¿Cuánto vende de más una tienda por cada metro cuadrado extra de sala?","Una recta ventas ~ m² sobre 120 tiendas da el «valor por metro» con su intervalo de confianza.","Priorizar ampliaciones donde el metro extra se paga en menos de 3 años."],
 ["⚡","Energía","Relación entre temperatura y consumo de climatización en oficinas.","Con datos diarios de verano, la pendiente dice cuántos kWh cuesta cada grado por encima de 24 °C.","Fijar la consigna de temperatura y estimar el ahorro de subirla 1 °C."],
 ["📞","Atención al cliente","¿Cuánto aumenta el tiempo de espera por cada 100 llamadas extra?","La recta espera ~ volumen permite traducir previsiones de volumen a minutos de espera.","Dimensionar cuántos agentes hacen falta para no superar 2 minutos."]];

EASY.linmult = {
 frase:"La misma recta, pero con <b>varias causas a la vez</b>: cada variable recibe su propio «precio».",
 pasos:[
  "Juntas en una tabla todas las variables que pueden influir (m², baños, zona, antigüedad…).",
  "El modelo busca a la vez un peso (coeficiente) para cada variable que minimiza la suma de errores al cuadrado.",
  "Cada coeficiente se interpreta <b>«a igualdad de todo lo demás»</b>: cuánto cambia la predicción si sube esa variable y el resto se queda quieto.",
  "Revisas que las variables no se repitan entre sí (multicolinealidad) y que los residuos no tengan patrón.",
  "Usas el R² <b>ajustado</b>, que penaliza meter variables que no aportan."],
 ej:'<p>Tasador automático: <b>precio = 50.000 + 2.500 × m² + 12.000 × baños</b>.</p><div class="wrapt"><table><tr><th>Piso</th><th>m²</th><th>Baños</th><th>Cálculo</th><th class="hl">Precio</th></tr>'+
  '<tr><td>A</td><td>80</td><td>1</td><td>50.000 + 200.000 + 12.000</td><td class="hl">262.000 €</td></tr>'+
  '<tr><td>B</td><td>80</td><td>2</td><td>50.000 + 200.000 + 24.000</td><td class="hl">274.000 €</td></tr>'+
  '<tr><td>C</td><td>100</td><td>2</td><td>50.000 + 250.000 + 24.000</td><td class="hl">324.000 €</td></tr></table></div>'+
  '<p class="res">A y B solo se diferencian en un baño: la diferencia es exactamente el coeficiente, <b>12.000 €</b>. B y C solo en 20 m²: 20 × 2.500 = <b>50.000 €</b>. Eso es «a igualdad de todo lo demás».</p>',
 rec:["Cada coeficiente es el efecto de su variable <b>con las demás congeladas</b>.",
  "Si dos variables cuentan lo mismo (m² y habitaciones), los coeficientes se vuelven inestables: revisa el VIF.",
  "R² siempre sube al añadir variables; compara modelos con el <b>R² ajustado</b> o con validación."]};
CASOS.linmult = [
 ["📣","Marketing","¿Qué parte de las ventas se debe a TV, a buscadores y a redes, si se mueven a la vez?","Una regresión con los tres canales y la estacionalidad separa el efecto de cada uno «a igualdad de lo demás».","Reasignar presupuesto hacia el canal con más ventas por euro."],
 ["🏨","Hostelería","Fijar la tarifa de una habitación según día, antelación, ocupación y eventos.","Los coeficientes cuantifican cuánto suma cada factor (un congreso en la ciudad: +38 € por noche).","Tabla de precios dinámica explicable al equipo de recepción."],
 ["👥","RR. HH.","¿Existe brecha salarial una vez descontados puesto, antigüedad y formación?","El coeficiente de «género» con el resto de variables fijas mide la brecha ajustada.","Informe de igualdad retributiva con una cifra defendible."]];

EASY.ridge = {
 frase:"Una regresión lineal con <b>freno de mano</b>: no deja que ningún coeficiente se dispare.",
 pasos:[
  "Empieza igual que la lineal: busca coeficientes que reduzcan el error.",
  "Pero suma un castigo: <b>α × (suma de los coeficientes al cuadrado)</b>. Coeficientes enormes salen caros.",
  "Cuando dos variables cuentan casi lo mismo, en vez de darle +50 a una y −45 a la otra, reparte algo razonable entre las dos.",
  "Tú eliges α con validación cruzada: α = 0 es la lineal normal; α muy grande lo aplana todo hacia cero.",
  "Antes hay que <b>estandarizar</b> las variables, para que el castigo no dependa de si mides en euros o en miles."],
 ej:'<p>TV y digital se lanzan siempre juntas (correlación 0,95). Coeficientes según la fuerza del freno α (ilustrativo):</p><div class="wrapt"><table><tr><th>α</th><th>β TV</th><th>β Digital</th><th>Lectura</th></tr>'+
  '<tr><td>0 (lineal)</td><td>+50</td><td>−45</td><td>«La digital resta ventas»: absurdo</td></tr>'+
  '<tr><td>1</td><td>+4,1</td><td>+1,2</td><td>Ya tiene sentido</td></tr>'+
  '<tr class="hl"><td class="hl">10</td><td class="hl">+2,6</td><td class="hl">+2,3</td><td class="hl">Reparto estable (elegido por validación)</td></tr>'+
  '<tr><td>1.000</td><td>+0,2</td><td>+0,2</td><td>Demasiado freno: ya no explica nada</td></tr></table></div>'+
  '<p class="res">La suma (≈ efecto conjunto de la campaña) apenas cambia entre α = 1 y α = 10; lo que se arregla es el <b>reparto</b>, que deja de bailar.</p>',
 rec:["Ridge <b>encoge</b> coeficientes pero <b>nunca los pone a cero</b> (no selecciona variables).",
  "Imprescindible cuando hay variables muy correlacionadas: estabiliza la interpretación.",
  "Estandariza siempre antes y elige α con validación cruzada, nunca a ojo."]};
CASOS.ridge = [
 ["📺","Marketing Mix","14 canales que se activan a la vez en campaña dan coeficientes absurdos con la lineal.","Ridge estabiliza el reparto de ventas entre canales correlacionados.","Plan de medios anual con un reparto que no cambia al añadir una semana de datos."],
 ["🏠","Inmobiliaria","Tasación con decenas de variables del barrio muy relacionadas (renta, paro, educación).","El freno L2 evita que el modelo sobrerreaccione a variables redundantes.","Error de tasación más estable en barrios con pocas ventas."],
 ["🧪","Industria química","Predecir la calidad de un lote con 50 sensores que se mueven juntos.","Ridge usa la información de todos los sensores sin que ninguno domine por casualidad.","Ajustes de proceso con menos falsas alarmas."]];

EASY.lasso = {
 frase:"Una regresión que <b>hace limpieza</b>: las variables que no aportan reciben un cero y desaparecen.",
 pasos:[
  "Como Ridge, añade un castigo a la regresión, pero con el <b>valor absoluto</b> de los coeficientes: α × Σ|β|.",
  "Ese castigo tiene una «esquina» en cero: para muchas variables, lo más barato es poner su coeficiente <b>exactamente a 0</b>.",
  "Cuanto más subes α, más variables se quedan fuera; con α pequeño entran casi todas.",
  "Eliges α con validación cruzada (LassoCV) o según el tamaño de modelo que puede gestionar el negocio.",
  "Resultado: un modelo <b>corto y legible</b> con las pocas variables que de verdad predicen."],
 ej:'<p>Seis candidatas para predecir ingresos mensuales (variables estandarizadas):</p><div class="wrapt"><table><tr><th>Variable</th><th>α pequeño</th><th class="hl">α medio</th><th>α grande</th></tr>'+
  '<tr><td>Visitas web</td><td>3,1</td><td class="hl">2,8</td><td>1,9</td></tr><tr><td>Leads</td><td>2,4</td><td class="hl">2,1</td><td>1,2</td></tr><tr><td>Precio medio</td><td>−1,5</td><td class="hl">−1,2</td><td>0</td></tr>'+
  '<tr><td>Día de la semana</td><td>0,4</td><td class="hl">0</td><td>0</td></tr><tr><td>Nº de posts</td><td>0,2</td><td class="hl">0</td><td>0</td></tr><tr><td>Temperatura</td><td>0,1</td><td class="hl">0</td><td>0</td></tr></table></div>'+
  '<p class="res">Con α medio quedan <b>3 de 6</b> variables: el resto vale cero exacto. Ridge, en cambio, las dejaría todas con valores pequeños.</p>',
 rec:["Lasso <b>selecciona variables</b>: pone coeficientes exactamente a cero.",
  "Si varias variables son casi iguales, se queda con una <b>casi al azar</b>: no la presentes como «la importante».",
  "Estandariza antes; para grupos correlacionados, prueba Elastic Net."]};
CASOS.lasso = [
 ["🏭","Industria","180 sensores por lote y el equipo de planta solo puede vigilar unos pocos.","Lasso deja 8 sensores con coeficiente distinto de cero.","Panel de planta con 8 alarmas en vez de 180."],
 ["📊","Finanzas","De 80 indicadores candidatos, ¿cuáles predicen el cobro a 90 días?","La regularización L1 se queda con un puñado de indicadores legibles.","Modelo de previsión de caja que cabe en una hoja de Excel."],
 ["🛒","E-commerce","¿Qué atributos de la ficha de producto mueven la conversión?","Con cientos de atributos codificados, Lasso aísla los pocos con efecto.","Lista corta de mejoras de ficha para el equipo de contenido."]];

EASY.elastic = {
 frase:"Un <b>mezclador entre Ridge y Lasso</b>: limpia variables como Lasso, pero sin abandonar a las que van en grupo.",
 pasos:[
  "Suma los dos castigos a la vez: una parte en valor absoluto (L1, selecciona) y otra al cuadrado (L2, estabiliza).",
  "El mando <code>l1_ratio</code> decide la mezcla: 1 = Lasso puro, 0 = Ridge puro, valores intermedios = mezcla.",
  "Ante 5 variables casi iguales, en vez de quedarse con una, tiende a quedarse con <b>las 5 con pesos pequeños</b>.",
  "Eliges α y l1_ratio a la vez con validación cruzada (ElasticNetCV).",
  "Resultado: un modelo con selección de variables que <b>no cambia de lista</b> cada vez que reentrenas."],
 ej:'<p>Tres variables que miden casi lo mismo (ingresos declarados, nómina media, renta del barrio) y dos semillas de entrenamiento:</p><div class="wrapt"><table><tr><th>Variable</th><th>Lasso (semilla 1)</th><th>Lasso (semilla 2)</th><th class="hl">Elastic Net</th></tr>'+
  '<tr><td>Ingresos declarados</td><td>3,0</td><td>0</td><td class="hl">1,1</td></tr><tr><td>Nómina media</td><td>0</td><td>2,9</td><td class="hl">0,9</td></tr><tr><td>Renta del barrio</td><td>0</td><td>0</td><td class="hl">1,0</td></tr></table></div>'+
  '<p class="res">Lasso cambia de «favorita» según la muestra; Elastic Net reparte el peso dentro del grupo y da la <b>misma lectura</b> en las dos semillas.</p>',
 rec:["l1_ratio = 1 → Lasso; l1_ratio = 0 → Ridge.",
  "Brilla con <b>grupos de variables correlacionadas</b> y con más columnas que filas.",
  "Busca α y l1_ratio con validación cruzada: 0,5 no es «el término medio» automático."]};
CASOS.elastic = [
 ["🏦","Banca","Modelo de pérdida esperada con 300 variables derivadas, muchas versiones del mismo concepto.","Conserva bloques completos de variables y la lista seleccionada no baila entre trimestres.","Modelo regulatorio estable que supera la auditoría."],
 ["🧬","Salud","Predecir respuesta a un fármaco con miles de marcadores genéticos y 200 pacientes.","Selecciona grupos de genes relacionados en lugar de uno al azar de cada grupo.","Lista de marcadores candidatos reproducible para el laboratorio."],
 ["📈","Marketing","Previsión de ventas con decenas de indicadores de búsqueda correlacionados (Google Trends).","Usa la familia de términos de búsqueda sin depender de uno concreto.","Previsión semanal más robusta ante cambios en un término."]];

EASY.poisson = {
 frase:"La regresión para <b>contar cosas</b>: pedidos por hora, siniestros al año, visitas al día.",
 pasos:[
  "Fíjate en que tu objetivo es un conteo: 0, 1, 2, 3… nunca negativo y casi siempre con muchos ceros o valores bajos.",
  "El modelo calcula una puntuación lineal (β₀ + β₁x…) y la pasa por una <b>exponencial</b>: el resultado siempre es positivo.",
  "Ese resultado es la <b>tasa media λ</b> (p. ej., 3,3 pedidos por hora); a partir de ella sabe la probabilidad de 0, 1, 2… eventos.",
  "Los coeficientes se leen en porcentaje: e<sup>β</sup> = 1,20 significa «un 20% más de eventos».",
  "Compruebas la sobredispersión: si la varianza es mucho mayor que la media, pasa a Binomial Negativa."],
 ej:'<p>Pedidos por hora en una tienda: <b>λ = e<sup>1,2 + 0,4·promo</sup></b>.</p><div class="wrapt"><table><tr><th>Situación</th><th>Cálculo</th><th class="hl">Pedidos/hora esperados</th><th>P(0 pedidos)</th></tr>'+
  '<tr><td>Sin promoción</td><td>e<sup>1,2</sup></td><td class="hl">3,3</td><td>e<sup>−3,3</sup> = 3,7%</td></tr>'+
  '<tr><td>Con promoción</td><td>e<sup>1,6</sup></td><td class="hl">5,0</td><td>e<sup>−5,0</sup> = 0,7%</td></tr></table></div>'+
  '<p class="res">e<sup>0,4</sup> = 1,49: la promoción multiplica los pedidos por 1,49, es decir, <b>+49%</b>. Una lineal normal podría predecir «−0,8 pedidos» a las 4 de la madrugada; Poisson, nunca.</p>',
 rec:["Para <b>conteos</b>: nunca predice negativos y modela bien muchos ceros moderados.",
  "Coeficientes multiplicativos: e<sup>β</sup> − 1 = % de cambio.",
  "Si cada caso tiene distinta exposición (3 vs 12 meses), mete la exposición como <b>offset</b>."]};
CASOS.poisson = [
 ["🚗","Seguros","¿Cuántos siniestros esperar por póliza para fijar la prima?","Frecuencia por Poisson con la exposición en años como offset (el estándar actuarial).","Prima = frecuencia × coste medio, explicable al supervisor."],
 ["🛵","Delivery","¿Cuántos pedidos entrarán cada hora en cada zona?","Poisson con hora, día, lluvia y partidos de fútbol como variables.","Número de repartidores por franja sin sobredimensionar."],
 ["🏥","Urgencias","¿Cuántos pacientes llegarán cada turno?","La tasa esperada por turno alimenta la planificación de personal.","Cuadrante de enfermería ajustado a la demanda real."]];

EASY.quantile = {
 frase:"En vez de predecir la media, predice <b>«la cifra que no superaré el 90% de los días»</b>.",
 pasos:[
  "Eliges qué percentil te interesa según el negocio: P50 (lo típico), P90 o P95 (el peor caso razonable).",
  "El modelo usa una pérdida <b>asimétrica</b>: si pides P90, quedarse corto cuesta 9 veces más que pasarse.",
  "Por eso la predicción se coloca por encima de la mayoría de los puntos: exactamente por encima del 90%.",
  "Ajustas varios (P10, P50, P90) y obtienes una <b>banda</b>: lo que esperas y el margen de error realista.",
  "Compruebas la cobertura: si pediste P90, el 90% de los días reales debe caer por debajo."],
 ej:'<p>Demanda de 10 días de un producto, ordenada: 80, 85, 90, 95, 100, 100, 105, 110, 130, 150 unidades.</p><div class="wrapt"><table><tr><th>Si pones en stock…</th><th>Unidades</th><th>Días con rotura</th></tr>'+
  '<tr><td>La media</td><td>104,5</td><td>3 de 10 (110, 130 y 150)</td></tr><tr><td>El P50 (mediana)</td><td>100</td><td>4 de 10</td></tr><tr class="hl"><td class="hl">El P90</td><td class="hl">130</td><td class="hl">1 de 10 (150)</td></tr></table></div>'+
  '<p class="res">Un nivel de servicio del 90% <b>es</b> un P90. Planificar con la media te deja sin stock 3 de cada 10 días.</p>',
 rec:["Predice <b>percentiles</b>, no medias: perfecto para stock de seguridad, SLA y riesgos.",
  "La pérdida es asimétrica (pinball loss): el τ que eliges sale del coste de quedarse corto.",
  "Comprueba la <b>cobertura real</b> y que P90 quede siempre por encima de P50."]};
CASOS.quantile = [
 ["📦","Logística","Roturas de stock en productos de alta rotación y exceso en otros.","P95 de demanda por SKU para fijar el stock de seguridad.","Nivel de servicio del 95% con menos inventario inmovilizado."],
 ["🚚","Última milla","Prometer una hora de entrega que se cumpla de verdad.","P90 del tiempo de entrega según zona, hora y tráfico.","Ventana «llega antes de las 14:00» cumplida 9 de cada 10 veces."],
 ["☁️","Tecnología","¿Cuántos servidores reservar para los picos?","P99 de carga por hora en lugar de la carga media.","Capacidad suficiente sin pagar el doble «por si acaso»."]];

EASY.bayesridge = {
 frase:"Una regresión que además del número te dice <b>cuánto se fía de él</b>.",
 pasos:[
  "Parte de una creencia previa razonable (prior): «los coeficientes probablemente son pequeños».",
  "Con cada dato actualiza esa creencia; el resultado no es un número por coeficiente, sino una <b>distribución</b> (un rango de valores plausibles).",
  "Al predecir, propaga esa duda: cada predicción sale con su <b>barra de error</b> (media ± desviación).",
  "Con pocos datos la barra es ancha; con muchos, estrecha. Y la fuerza de la regularización la estima sola.",
  "Decides con la barra: si es demasiado ancha, toca recoger más datos antes de actuar."],
 ej:'<p>Rendimiento previsto de un proceso de laboratorio según cuántos experimentos parecidos hay:</p><div class="wrapt"><table><tr><th>Experimentos similares</th><th>Predicción</th><th class="hl">Incertidumbre</th><th>Decisión</th></tr>'+
  '<tr><td>5</td><td>72%</td><td class="hl">± 15 puntos</td><td>Hacer más pruebas</td></tr><tr><td>20</td><td>72%</td><td class="hl">± 8 puntos</td><td>Dudoso</td></tr><tr><td>80</td><td>72%</td><td class="hl">± 4 puntos</td><td>Pasar a producción</td></tr></table></div>'+
  '<p class="res">La predicción central no cambia, pero la decisión sí: la incertidumbre baja más o menos con la raíz del nº de datos (4 veces más datos → la mitad de duda).</p>',
 rec:["Da <b>media y desviación</b> para cada predicción (<code>return_std=True</code>).",
  "Brilla con <b>pocos datos</b>, cuando decidir con un número sin rango es peligroso.",
  "La barra solo refleja la duda del modelo, no la de que el modelo esté mal planteado."]};
CASOS.bayesridge = [
 ["💊","Farmacia","Estimar el rendimiento de una síntesis con 60 experimentos de una semana cada uno.","Cada predicción viene con su intervalo; se priorizan pruebas donde la duda es mayor.","Menos semanas de laboratorio para llegar a producción."],
 ["🏬","Retail","Previsión de ventas para una tienda recién abierta con 8 semanas de historia.","El prior (tiendas parecidas) estabiliza la previsión y el intervalo comunica la duda.","Objetivos comerciales realistas para la nueva tienda."],
 ["📣","Marketing","Medir el retorno de un canal nuevo con pocas semanas de datos.","El intervalo de credibilidad dice si el retorno es claramente positivo o aún incierto.","Decidir si escalar el canal o seguir probando."]];

EASY.gp = {
 frase:"Un modelo que dibuja <b>todas las curvas posibles</b> que encajan con tus pocos puntos y te dice dónde duda.",
 pasos:[
  "Asume que puntos cercanos tienen valores parecidos; el <b>kernel</b> dice cuánto se parecen según la distancia.",
  "Considera infinitas curvas compatibles con esa idea y descarta las que no pasan cerca de tus mediciones.",
  "Promedia las supervivientes: obtiene una <b>curva media</b> y un <b>abanico</b> de incertidumbre.",
  "Donde mediste, el abanico es estrecho; lejos de tus datos, se abre.",
  "Si cada medición es cara, mides donde el abanico es más ancho (o donde puede estar el óptimo): eso es la <b>optimización bayesiana</b>."],
 ej:'<p>Calidad de una pieza según la temperatura del horno, con 3 mediciones (en 200, 230 y 260 °C):</p><div class="wrapt"><table><tr><th>Temperatura</th><th>Predicción</th><th class="hl">Incertidumbre (±)</th></tr>'+
  '<tr><td>230 °C (medido)</td><td>8,1</td><td class="hl">0,1</td></tr><tr><td>245 °C (entre dos medidas)</td><td>8,4</td><td class="hl">0,6</td></tr><tr><td>290 °C (lejos)</td><td>7,0</td><td class="hl">1,8</td></tr></table></div>'+
  '<p class="res">El siguiente experimento conviene hacerlo donde la duda es grande y el resultado podría ser mejor: ahí cada prueba de 3.000 € <b>aprende más</b>.</p>',
 rec:["Precisión <b>e incertidumbre</b> con muy pocos datos.",
  "No escala: el coste crece con el cubo del nº de filas (miles como máximo).",
  "Es el motor clásico de la optimización bayesiana de experimentos e hiperparámetros."]};
CASOS.gp = [
 ["🏭","Industria","Ajustar 6 parámetros de una línea donde cada prueba para 4 horas.","Optimización bayesiana: el GP propone la siguiente prueba más informativa.","Óptimo encontrado en 25 pruebas en vez de 100."],
 ["🤖","Ciencia de datos","Elegir hiperparámetros de un modelo caro de entrenar.","El GP modela el AUC según los hiperparámetros y sugiere la siguiente combinación.","Mejor modelo con un tercio de las horas de GPU."],
 ["🌱","Agricultura","Mapa de humedad del suelo a partir de 30 sondas en una finca.","Interpola entre sondas (kriging) y marca las zonas con más incertidumbre.","Dónde instalar las siguientes sondas y dónde regar."]];

EASY.svr = {
 frase:"Una regresión que pone un <b>tubo de tolerancia</b> alrededor de la predicción y solo se preocupa de lo que se sale.",
 pasos:[
  "Fijas el ancho del tubo, ε: los errores más pequeños que ε se consideran «aceptables» y no cuentan.",
  "El modelo busca la función más plana posible que deje la mayoría de puntos dentro del tubo.",
  "Los puntos que se salen (los <b>vectores de soporte</b>) son los únicos que mueven la solución; el parámetro C dice cuánto castigarlos.",
  "Con un <b>kernel</b> (RBF, polinómico) el tubo puede curvarse para seguir relaciones no lineales.",
  "Estandarizas los datos y buscas C, ε y γ juntos con validación cruzada."],
 ej:'<p>Tubo de ε = 0,5 °C prediciendo la temperatura de un proceso:</p><div class="wrapt"><table><tr><th>Lote</th><th>Error</th><th>¿Dentro del tubo?</th><th class="hl">Lo que cuenta</th></tr>'+
  '<tr><td>1</td><td>+0,3</td><td>Sí</td><td class="hl">0</td></tr><tr><td>2</td><td>−0,4</td><td>Sí</td><td class="hl">0</td></tr><tr><td>3</td><td>+1,2</td><td>No</td><td class="hl">0,7</td></tr><tr><td>4</td><td>−2,0</td><td>No</td><td class="hl">1,5</td></tr></table></div>'+
  '<p class="res">Solo cuentan los lotes 3 y 4, y solo por lo que sobresalen del tubo (1,2 − 0,5 y 2,0 − 0,5). Los errores pequeños se ignoran: el modelo no persigue el ruido.</p>',
 rec:["Ignora errores menores que ε; solo los que se salen del tubo influyen.",
  "Buen nicho: <b>pocas filas y muchísimas columnas</b> (espectros, sensores).",
  "Estandariza siempre y no lo uses con decenas de miles de filas: entrena lento."]};
CASOS.svr = [
 ["🔬","Química","Predecir la concentración de un principio activo a partir de 900 longitudes de onda.","SVR con kernel aguanta muchas más columnas que filas.","Liberar lotes sin ensayo destructivo."],
 ["🍷","Alimentación","Estimar el grado de maduración de la uva con un espectrómetro de mano.","El tubo ε ignora el ruido del aparato y se centra en desviaciones relevantes.","Fecha de vendimia por parcela."],
 ["⚙️","Mantenimiento","Vida útil restante de un rodamiento a partir de vibraciones.","Regresión no lineal robusta con pocas curvas de degradación históricas.","Planificar cambios antes de la avería."]];

EASY.gbr = {
 frase:"Un <b>equipo en cadena</b> de árboles pequeños: cada uno corrige lo que falló el anterior.",
 pasos:[
  "Empieza con una predicción sencilla para todos (por ejemplo, la media de precios).",
  "Calcula cuánto falla en cada caso (los <b>residuos</b>).",
  "Entrena un árbol pequeño que aprende a predecir esos fallos.",
  "Suma a la predicción una fracción de lo que dice ese árbol (el <b>learning rate</b>, p. ej. 0,1): pasos cortos para no pasarse.",
  "Repite cientos de veces. Para cuando la validación deja de mejorar (early stopping)."],
 ej:'<p>Precio real de una vivienda: <b>230.000 €</b>. Learning rate = 0,5 (alto, para verlo rápido):</p><div class="wrapt"><table><tr><th>Paso</th><th>Predicción</th><th>Residuo</th><th>El árbol aprende</th><th>Se suma (× 0,5)</th></tr>'+
  '<tr><td>0 (media)</td><td>200.000</td><td>30.000</td><td>+30.000</td><td>+15.000</td></tr><tr><td>1</td><td>215.000</td><td>15.000</td><td>+15.000</td><td>+7.500</td></tr><tr><td>2</td><td>222.500</td><td>7.500</td><td>+7.500</td><td>+3.750</td></tr><tr><td>3</td><td class="hl">226.250</td><td>3.750</td><td>…</td><td>…</td></tr></table></div>'+
  '<p class="res">Cada paso recorre la mitad de lo que queda. Con learning rate 0,05 harían falta muchos más pasos, pero el resultado generaliza mejor: <b>lr y nº de árboles van juntos</b>.</p>',
 rec:["Boosting = árboles en <b>serie</b>; cada uno corrige el error del anterior.",
  "Learning rate pequeño + muchos árboles + early stopping = la receta estable.",
  "Máxima precisión en tablas; para explicar el porqué, usa SHAP."]};
CASOS.gbr = [
 ["⚡","Energía","Prever el consumo horario de mañana para comprar en el mercado eléctrico.","Captura la forma en U consumo-temperatura y los efectos de festivos.","Menos desvíos pagados a precio de penalización."],
 ["🏠","Inmobiliaria","Tasación automática con relaciones no lineales (planta, vistas, ascensor).","Cada árbol corrige errores en los segmentos donde la lineal fallaba.","Error mediano de tasación por debajo del 8%."],
 ["🛍️","Retail","Estimar las ventas de un producto nuevo según atributos y tienda.","Aprende interacciones (talla × clima × región) sin especificarlas a mano.","Reparto inicial de stock por tienda más ajustado."]];
