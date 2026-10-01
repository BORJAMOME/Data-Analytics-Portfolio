/* ── NO SUPERVISADO · CLUSTERING, DIMENSIONES, ANOMALÍAS, ASOCIACIÓN, RECOMENDACIÓN, TEXTO ── */

EASY.kmeans = {
 frase:"Clava <b>K chinchetas</b> en el mapa de clientes y deja que cada cliente se apunte a la más cercana.",
 pasos:[
  "Eliges cuántos grupos quieres (K) y colocas K centros al azar (mejor con k-means++).",
  "<b>Asignar</b>: cada cliente se une al centro más cercano.",
  "<b>Mover</b>: cada centro se desplaza a la media de sus clientes.",
  "Repites asignar-mover hasta que nadie cambia de grupo.",
  "Eliges K con el método del codo, la silueta y, sobre todo, con si negocio puede actuar sobre cada grupo."],
 ej:'<p>6 clientes (gasto en k€, visitas al mes), K = 2, centros iniciales en A y C:</p><div class="wrapt"><table><tr><th>Cliente</th><th>(gasto, visitas)</th><th>Centro más cercano</th></tr>'+
  '<tr><td>A</td><td>(1,0; 2,0)</td><td>1</td></tr><tr><td>B</td><td>(1,5; 1,8)</td><td>1</td></tr><tr><td>E</td><td>(1,2; 2,2)</td><td>1</td></tr><tr><td>C</td><td>(5,0; 8,0)</td><td>2</td></tr><tr><td>D</td><td>(6,0; 9,0)</td><td>2</td></tr><tr><td>F</td><td>(5,5; 8,5)</td><td>2</td></tr></table></div>'+
  '<p class="res">Nuevos centros: grupo 1 = (1,23; 2,0) y grupo 2 = (5,5; 8,5). En la siguiente vuelta nadie cambia: <b>convergido</b>. Lectura: «ocasionales» frente a «habituales de alto gasto».</p>',
 rec:["Tú eliges <b>K</b>; el algoritmo decide quién va con quién.",
  "<b>Estandariza</b> antes: si no, manda la variable con más rango.",
  "Supone grupos más o menos redondos y sufre con outliers."]};
CASOS.kmeans = [
 ["","Retail","900.000 clientes reciben la misma comunicación.","Segmentos por recencia, frecuencia, gasto y categorías.","5 mensajes distintos, uno por segmento accionable."],
 ["","Gimnasios","Entender los tipos de socio (tu notebook).","Grupos por horario, frecuencia y servicios usados.","Oferta de horarios y clases adaptada a cada perfil."],
 ["","Investigación social","Perfiles de votantes por actitudes (tu notebook).","Agrupa respuestas de encuesta en perfiles ideológicos.","Mensajes de campaña adaptados a cada perfil."]];

EASY.kmedoids = {
 frase:"Como K-Means, pero el centro de cada grupo es siempre <b>un cliente real</b>.",
 pasos:[
  "Elige K clientes reales como representantes iniciales (medoides).",
  "Asigna cada cliente al representante más parecido.",
  "Prueba a cambiar cada representante por otro cliente de su grupo y se queda con el cambio si la <b>suma de distancias</b> baja.",
  "Repite hasta que ningún cambio mejora.",
  "Admite cualquier distancia (Manhattan, Gower para datos mixtos), no solo la euclídea."],
 ej:'<p>Ingresos anuales (k€) de un grupo con un millonario: 20, 22, 25, 27, 300.</p><div class="wrapt"><table><tr><th>Centro</th><th>Valor</th><th>¿Existe ese cliente?</th></tr>'+
  '<tr><td>Media (K-Means)</td><td>78,8 k€</td><td>No: nadie gana eso, está en tierra de nadie</td></tr><tr class="hl"><td class="hl">Medoide (K-Medoids)</td><td class="hl">25 k€</td><td class="hl">Sí: suma de distancias 285, la mínima</td></tr></table></div>'+
  '<p class="res">Probando 22 o 27 como centro la suma sube a 288 y 287. El medoide es una <b>persona concreta</b> que puedes enseñar en el comité.</p>',
 rec:["El centro es un <b>caso real</b> (medoide), no una media inventada.",
  "Más <b>robusto a outliers</b> y admite cualquier distancia.",
  "Escala peor que K-Means; usa FasterPAM (paquete kmedoids)."]};
CASOS.kmedoids = [
 ["","Banca","Presentar la segmentación al comité con un cliente real por grupo.","El medoide es «el cliente tipo», sin medias distorsionadas por patrimonios extremos.","Storytelling comercial con casos concretos."],
 ["","Logística","Elegir dónde ubicar 5 almacenes entre 60 ubicaciones posibles.","Los medoides son ubicaciones reales que minimizan la distancia a los clientes.","Red de almacenes sin proponer sitios que no existen."],
 ["","Seguros","Segmentar pólizas con variables mixtas (numéricas y categóricas).","K-Medoids sobre distancia de Gower.","Grupos coherentes sin forzar codificaciones raras."]];

EASY.jerarquico = {
 frase:"Construye el <b>árbol genealógico</b> de tus datos y luego decides a qué altura cortarlo.",
 pasos:[
  "Empieza con cada caso como un grupo propio.",
  "Junta los dos grupos más parecidos (según el <b>enlace</b>: ward, average, complete…).",
  "Repite hasta que todo es un único grupo, anotando a qué distancia se produjo cada fusión.",
  "Dibuja el <b>dendrograma</b>: la altura de cada unión es la distancia de fusión.",
  "Corta donde hay un salto grande de altura: ahí están los grupos naturales."],
 ej:'<p>Cinco valores (1, 2, 6, 7 y 15) con enlace simple:</p><div class="wrapt"><table><tr><th>Fusión</th><th>Grupos que se unen</th><th class="hl">Distancia</th></tr>'+
  '<tr><td>1</td><td>{1} + {2}</td><td class="hl">1</td></tr><tr><td>2</td><td>{6} + {7}</td><td class="hl">1</td></tr><tr><td>3</td><td>{1, 2} + {6, 7}</td><td class="hl">4</td></tr><tr><td>4</td><td>{1, 2, 6, 7} + {15}</td><td class="hl">8</td></tr></table></div>'+
  '<p class="res">Si cortas a altura 3 obtienes 3 grupos: {1, 2}, {6, 7} y {15}. El salto más grande (de 4 a 8) sugiere separar el 15 del resto: 2 grupos.</p>',
 rec:["No fijas K antes: lo eliges <b>viendo el dendrograma</b>.",
  "El tipo de <b>enlace</b> cambia la historia (ward = grupos compactos).",
  "Coste cuadrático: para muchos datos, agrupa antes con K-Means."]};
CASOS.jerarquico = [
 ["","Gran consumo","¿Cómo se agrupan 400 referencias según la compra conjunta?","El dendrograma muestra familias y subfamilias naturales de producto.","Arquitectura de surtido discutida a distintos niveles de corte."],
 ["","E-commerce","Explorar segmentos sin saber cuántos hay (tu notebook).","Ver la estructura completa antes de fijar el número de grupos.","Segmentación con un K justificado por el dendrograma."],
 ["","Banca","Agrupar oficinas por su perfil de negocio (tu notebook).","Jerarquía de oficinas parecidas con distintas granularidades.","Objetivos comerciales por grupo de oficinas."]];

EASY.dbscan = {
 frase:"Agrupa por <b>multitudes</b>: donde hay mucha gente junta hay un grupo; los solitarios son ruido.",
 pasos:[
  "Fijas un radio (<b>eps</b>) y un mínimo de vecinos (<b>min_samples</b>).",
  "Un punto es <b>núcleo</b> si dentro de su radio hay al menos min_samples puntos (contándose a sí mismo).",
  "Los núcleos cercanos se contagian y forman un grupo; los puntos de borde se unen a él.",
  "Lo que no alcanza ningún grupo se etiqueta como <b>ruido</b> (−1).",
  "No le dices cuántos grupos hay y encuentra formas irregulares."],
 ej:'<p>Ocho valores: 1; 1,5; 2; 2,4; 8; 8,6; 9 y 20, con eps = 1 y min_samples = 3:</p><div class="wrapt"><table><tr><th>Punto</th><th>Vecinos a ≤ 1 (incluido él)</th><th class="hl">Papel</th></tr>'+
  '<tr><td>1 / 1,5 / 2 / 2,4</td><td>3-4 cada uno</td><td class="hl">Núcleos → grupo A</td></tr><tr><td>8 / 8,6 / 9</td><td>3 cada uno</td><td class="hl">Núcleos → grupo B</td></tr><tr><td>20</td><td>1 (solo él)</td><td class="hl">Ruido</td></tr></table></div>'+
  '<p class="res">Resultado: <b>2 grupos y 1 punto de ruido</b>, sin haber dicho K. K-Means con K = 2 habría metido el 20 a la fuerza en un grupo.</p>',
 rec:["Grupos por <b>densidad</b>, de forma libre, y marca el <b>ruido</b>.",
  "Lo difícil es elegir <b>eps</b>: usa el gráfico de distancia al k-ésimo vecino.",
  "Con densidades muy distintas falla: usa HDBSCAN."]};
CASOS.dbscan = [
 ["","Reparto","Localizar zonas calientes de entrega para abrir microhubs.","Grupos con la forma real de las calles y entregas dispersas como ruido.","Ubicación de 6 microhubs donde se concentra la demanda."],
 ["","Turismo","Detectar puntos de interés a partir de fotos geolocalizadas.","Zonas densas de fotos = lugares de interés; fotos sueltas = ruido.","Mapa de atracciones y rutas recomendadas."],
 ["","Seguridad","Patrones espaciales de incidencias en una ciudad.","Focos de incidencias de forma irregular.","Rutas de patrulla priorizadas."]];

EASY.gmm = {
 frase:"Supone que los datos son una <b>mezcla de campanas</b> y da a cada caso un % de pertenencia a cada una.",
 pasos:[
  "Coloca K campanas (gaussianas) con un centro, una forma (elipse) y un peso.",
  "<b>Paso E</b>: para cada caso calcula la probabilidad de que venga de cada campana (responsabilidades).",
  "<b>Paso M</b>: recoloca cada campana con los casos ponderados por esas probabilidades.",
  "Repite E y M hasta que la verosimilitud deja de subir.",
  "Eliges K con el BIC; cada cliente queda como «70% A, 30% B»."],
 ej:'<p>Un cliente con valor 4 entre dos campanas de igual peso: A centrada en 2 (σ = 1) y B en 7 (σ = 1,5).</p><div class="wrapt"><table><tr><th>Campana</th><th>Densidad en x = 4</th><th class="hl">Pertenencia</th></tr>'+
  '<tr><td>A (ahorrador)</td><td>0,054</td><td class="hl">60%</td></tr><tr><td>B (inversor)</td><td>0,036</td><td class="hl">40%</td></tr></table></div>'+
  '<p class="res">K-Means lo metería al 100% en el grupo más cercano. GMM dice que está <b>a caballo</b>, y eso permite un mensaje mixto (60% ahorro, 40% inversión).</p>',
 rec:["Clustering <b>blando</b>: probabilidades de pertenencia.",
  "Admite grupos <b>elípticos</b> y de distinto tamaño.",
  "Elige K con <b>BIC</b>, no con la silueta."]};
CASOS.gmm = [
 ["","Banca","Clientes que son a la vez ahorradores e inversores.","% de pertenencia a cada perfil en lugar de una etiqueta dura.","Mensajes de campaña mezclados según el perfil."],
 ["","Riesgos","Modelar la distribución de pérdidas como mezcla de «días normales» y «días de crisis».","Dos campanas con medias y dispersiones distintas.","Cálculo de riesgo extremo más realista."],
 ["","Audio","Separar hablantes en grabaciones de un centro de llamadas.","Cada hablante es una campana en el espacio de características de voz.","Transcripción con quién dijo qué."]];

EASY.pca = {
 frase:"Busca la <b>mejor foto</b> de tus datos: pocas direcciones nuevas que resumen casi toda la información.",
 pasos:[
  "Estandariza las variables (si no, gana la de mayor escala).",
  "Busca la dirección en la que los datos <b>más varían</b>: es el componente principal 1.",
  "Busca la siguiente dirección de máxima variación, perpendicular a la anterior (PC2), y así sucesivamente.",
  "Mira cuánta información (varianza explicada) conserva cada componente y quédate con los primeros.",
  "Interpreta cada componente por sus <b>cargas</b>: qué variables originales lo forman."],
 ej:'<p>Tres variables de clientes (gasto, frecuencia, antigüedad):</p><div class="wrapt"><table><tr><th>Componente</th><th>Varianza explicada</th><th>Cargas (gasto / frecuencia / antigüedad)</th><th class="hl">Nombre de negocio</th></tr>'+
  '<tr><td>PC1</td><td>62%</td><td>0,60 / 0,58 / 0,55</td><td class="hl">«Tamaño del cliente»</td></tr><tr><td>PC2</td><td>25%</td><td>0,45 / 0,35 / −0,82</td><td class="hl">«Nuevo e intenso»</td></tr><tr><td>PC3</td><td>13%</td><td>…</td><td class="hl">Resto</td></tr></table></div>'+
  '<p class="res">Con PC1 y PC2 conservas el <b>87%</b> de la información en un gráfico 2D. El signo de un componente es arbitrario: lo que importa son las proporciones.</p>',
 rec:["Ejes nuevos ordenados por <b>varianza explicada</b>; es una rotación.",
  "<b>Estandariza</b> y ajústalo dentro del Pipeline (solo con train).",
  "Sirve para modelar y para comunicar; los componentes mezclan variables."]};
CASOS.pca = [
 ["","People Analytics","Encuesta de clima de 60 preguntas imposible de presentar.","PCA reduce a 4 dimensiones interpretables (reconocimiento, carga, liderazgo, desarrollo).","Plan anual sobre 4 ejes en lugar de 60 ítems."],
 ["","Marketing","Comportamiento de clientes ante emails con muchas métricas (tu notebook).","Resume aperturas, clics y tiempos en pocos componentes.","Segmentación más estable sobre los componentes."],
 ["","Finanzas","Movimiento de la curva de tipos de interés.","Tres componentes explican casi todo: nivel, pendiente y curvatura.","Coberturas diseñadas sobre 3 factores."]];

EASY.tsne = {
 frase:"Un mapa 2D para <b>mirar</b> datos de muchas dimensiones: junta lo que era vecino.",
 pasos:[
  "En el espacio original mide, para cada punto, qué puntos son sus vecinos y con qué probabilidad.",
  "Coloca los puntos al azar en 2D.",
  "Los mueve poco a poco para que las vecindades en 2D se parezcan a las originales (minimiza la divergencia KL).",
  "La <b>perplexity</b> dice cuántos vecinos tener en cuenta (5-50): cambia mucho el dibujo.",
  "Resultado: grupos visibles; pero las distancias entre grupos y sus tamaños <b>no significan nada</b>."],
 ej:'<p>Qué puedes y qué no puedes leer en un mapa t-SNE de 4 segmentos:</p><div class="wrapt"><table><tr><th>En el mapa ves…</th><th class="hl">¿Es fiable?</th></tr>'+
  '<tr><td>Que un cliente está rodeado de otros parecidos</td><td class="hl">Sí (vecindad local)</td></tr><tr><td>Que el grupo A está muy lejos del B</td><td class="hl">No</td></tr><tr><td>Que el grupo C es el doble de grande que el D</td><td class="hl">No</td></tr><tr><td>Que hay 4 islas con perplexity 30 y 6 con perplexity 5</td><td class="hl">Depende del parámetro: prueba varios</td></tr></table></div>'+
  '<p class="res">t-SNE es una herramienta de <b>comunicación</b>: no uses sus coordenadas como variables de un modelo.</p>',
 rec:["Conserva la <b>vecindad local</b>; nada más.",
  "Prueba varias <b>perplexity</b> y fija random_state.",
  "Solo para visualizar; para modelar, PCA o UMAP."]};
CASOS.tsne = [
 ["","Retail","Marketing no se cree la segmentación porque solo ve una tabla (tu notebook).","Mapa 2D donde los segmentos se ven como islas.","Comité que aprueba la segmentación al verla."],
 ["","Biología","Visualizar tipos de células a partir de miles de genes.","Agrupa células parecidas en el mapa.","Identificación visual de poblaciones raras."],
 ["","Calidad de datos","Revisar si los embeddings de productos tienen sentido.","Los productos parecidos deberían quedar juntos.","Detectar productos mal categorizados."]];

EASY.umap = {
 frase:"Como t-SNE, pero <b>más rápido</b>, algo más fiel a la estructura global y capaz de colocar datos nuevos.",
 pasos:[
  "Para cada punto busca sus <b>n_neighbors</b> vecinos más cercanos y construye un grafo de vecindad.",
  "Busca una disposición en 2D cuyo grafo se parezca al original.",
  "<b>n_neighbors</b> bajo resalta lo local; alto, la estructura global. <b>min_dist</b> decide cuánto se apelotonan.",
  "Guarda lo aprendido: con <code>transform()</code> coloca puntos nuevos en el mismo mapa sin recalcularlo.",
  "Muy usado antes de clusterizar con HDBSCAN en análisis de texto."],
 ej:'<p>500.000 tickets de soporte convertidos en embeddings de 768 números:</p><div class="wrapt"><table><tr><th>Método</th><th>Tiempo orientativo</th><th>¿Datos nuevos?</th></tr>'+
  '<tr><td>t-SNE exacto</td><td>Inviable</td><td>No</td></tr><tr><td>t-SNE aproximado</td><td>Horas</td><td>No (en scikit-learn)</td></tr><tr class="hl"><td class="hl">UMAP</td><td class="hl">Minutos</td><td class="hl">Sí, con transform()</td></tr></table></div>'+
  '<p class="res">Cada mañana, los tickets nuevos caen en el mapa de ayer: si aparece una isla nueva, hay un <b>problema emergente</b>.</p>',
 rec:["Rápido, escala a millones y tiene <b>transform()</b>.",
  "<b>n_neighbors</b> es el mando local ↔ global.",
  "Sigue siendo una proyección: distancias orientativas, no exactas."]};
CASOS.umap = [
 ["","Soporte","Descubrir problemas emergentes en 500.000 tickets.","Mapa de embeddings + HDBSCAN para detectar temas nuevos.","Escalado a producto de un fallo antes de que se haga viral."],
 ["","E-commerce","Explorar el catálogo para encontrar huecos de surtido.","Mapa de productos por similitud de descripción e imagen.","Zonas del mapa sin oferta propia = oportunidades."],
 ["","RR. HH.","Mapa de habilidades de la plantilla a partir de CV y proyectos.","Agrupa perfiles parecidos y muestra perfiles puente.","Movilidad interna basada en habilidades."]];

EASY.iforest = {
 frase:"Juega a <b>aislar cada punto con cortes al azar</b>: lo raro se queda solo enseguida.",
 pasos:[
  "Elige una variable al azar y un corte al azar dentro de su rango.",
  "Repite dentro del trozo donde está tu punto hasta que se queda solo.",
  "Cuenta cuántos cortes han hecho falta: un punto normal (rodeado de otros) necesita muchos; uno raro, pocos.",
  "Repite con cientos de árboles y promedia: menos cortes de media = <b>más anómalo</b>.",
  "Ordena por puntuación y revisa los primeros según tu capacidad."],
 ej:'<p>Con muestras de 256 puntos, la profundidad media esperada es ≈ 10,2. Puntuación: s = 2<sup>−profundidad media / 10,2</sup>.</p><div class="wrapt"><table><tr><th>Operación</th><th>Cortes medios para aislarla</th><th class="hl">Puntuación</th></tr>'+
  '<tr><td>Compra habitual</td><td>10</td><td class="hl">0,51 (normal)</td></tr><tr><td>Importe raro de madrugada</td><td>3</td><td class="hl">0,82 (anómala)</td></tr></table></div>'+
  '<p class="res">Cerca de 1 = muy anómalo; en torno a 0,5 = normal. No necesita etiquetas y escala a decenas de millones de filas.</p>',
 rec:["Detecta anomalías <b>sin etiquetas</b> y escala muy bien.",
  "<b>contamination</b> es una cuota, no una detección: mejor ordena por puntuación.",
  "Mide rareza <b>global</b>; para rareza local, LOF."]};
CASOS.iforest = [
 ["","Banca","Fraude nuevo que aún no está etiquetado en 40 M de transacciones al mes.","Puntuación de rareza para cada operación, sin etiquetas.","Revisión de las 500 operaciones más raras del día."],
 ["","Contabilidad","Detectar asientos contables inusuales antes del cierre.","Importe, cuenta, usuario y hora poco habituales.","Auditoría centrada en el 1% más extraño."],
 ["","IoT","Sensores de frigoríficos industriales con lecturas raras.","Rareza por combinación de temperatura, consumo y aperturas.","Aviso antes de perder la mercancía."]];

EASY.lof = {
 frase:"Compara lo aislado que está un punto <b>con lo aislados que están sus vecinos</b>.",
 pasos:[
  "Para cada punto, busca sus k vecinos más cercanos.",
  "Calcula su <b>densidad local</b>: cuánto le cuesta llegar a sus vecinos.",
  "Compara su densidad con la de sus vecinos: LOF = densidad de los vecinos / densidad propia.",
  "LOF ≈ 1: tan denso como su entorno (normal). LOF ≫ 1: mucho más aislado que sus vecinos (anómalo).",
  "Usa <code>novelty=True</code> si quieres puntuar datos nuevos."],
 ej:'<p>Distancia media a sus vecinos de tres puntos y de sus propios vecinos:</p><div class="wrapt"><table><tr><th>Punto</th><th>Su distancia</th><th>La de sus vecinos</th><th class="hl">LOF ≈</th></tr>'+
  '<tr><td>En el centro (zona densa)</td><td>0,1</td><td>0,1</td><td class="hl">1 (normal)</td></tr><tr><td>En las afueras (zona dispersa)</td><td>2,0</td><td>2,0</td><td class="hl">1 (normal ahí)</td></tr><tr><td>Junto al centro pero apartado</td><td>0,5</td><td>0,1</td><td class="hl">5 (anómalo)</td></tr></table></div>'+
  '<p class="res">Un método global marcaría al de las afueras (está lejos de todo) y no vería el tercero (está cerca del centro). LOF juzga a cada uno <b>en su contexto</b>.</p>',
 rec:["Rareza <b>local</b>: relativa a la densidad de su vecindario.",
  "Estandariza y elige k (n_neighbors) con cuidado.",
  "Complementa a Isolation Forest: donde discrepan, mira con lupa."]};
CASOS.lof = [
 ["","Calidad multiplanta","Lotes anómalos cuando cada planta tiene su propio «normal».","Cada lote se compara con su vecindario, no con la media global.","Bloqueo de lotes raros dentro de cada planta."],
 ["","Retail","Tiendas con ventas raras para su tipo (centro comercial vs barrio).","Detecta la tienda de barrio que vende como una de centro comercial (o al revés).","Revisión de datos o de posibles fraudes en caja."],
 ["","Redes","Equipos con tráfico extraño respecto a su grupo de trabajo.","El tráfico de un servidor se compara con el de servidores similares.","Alerta de equipo comprometido."]];

EASY.apriori = {
 frase:"Lee miles de tickets y encuentra reglas como <b>«quien compra nachos, compra salsa»</b>.",
 pasos:[
  "Cuenta en qué % de tickets aparece cada producto y cada combinación (<b>soporte</b>).",
  "Descarta lo poco frecuente: si un producto no llega al soporte mínimo, ninguna combinación que lo contenga puede llegar (<b>propiedad apriori</b>): ahorra muchísimo cálculo.",
  "Con las combinaciones frecuentes, crea reglas A → B.",
  "<b>Confianza</b>: de los tickets con A, qué % tiene B. <b>Lift</b>: cuántas veces más de lo esperable por azar.",
  "Filtra por lift &gt; 1, soporte suficiente y, sobre todo, ¿se puede hacer algo con la regla?"],
 ej:'<p>10 tickets: nachos en 4, salsa en 5 y ambos en 3.</p><div class="wrapt"><table><tr><th>Medida</th><th>Cálculo</th><th class="hl">Valor</th></tr>'+
  '<tr><td>Soporte(nachos y salsa)</td><td>3 / 10</td><td class="hl">30%</td></tr><tr><td>Confianza(nachos → salsa)</td><td>3 / 4</td><td class="hl">75%</td></tr><tr><td>Confianza(salsa → nachos)</td><td>3 / 5</td><td class="hl">60%</td></tr><tr><td>Lift</td><td>0,30 / (0,40 × 0,50)</td><td class="hl">1,5</td></tr></table></div>'+
  '<p class="res">Quien compra nachos compra salsa <b>1,5 veces más</b> de lo que pasaría por casualidad. El lift es el mismo en las dos direcciones; la confianza no.</p>',
 rec:["Tres números: <b>soporte, confianza y lift</b> (&gt; 1 = asociación real).",
  "El lift es <b>simétrico</b>; la dirección la da la confianza.",
  "Asociación no es causalidad; valida las reglas en otro periodo."]};
CASOS.apriori = [
 ["","Supermercado","Qué productos colocar juntos y qué packs crear (tu notebook).","Reglas legibles con soporte, confianza y lift.","Packs y colocación que suben el ticket medio."],
 ["","Restauración","Qué sugerir en caja según lo que ya pidió el cliente.","Reglas «hamburguesa doble → patatas grandes».","Sugerencias de venta cruzada del TPV."],
 ["","Salud","Combinaciones de diagnósticos que aparecen juntas más de lo esperable.","Detecta comorbilidades frecuentes en historiales.","Protocolos de cribado conjunto."]];

EASY.reco = {
 frase:"Si tú y Ana coincidís en 20 series, <b>lo que Ana vio y tú no</b> es tu recomendación.",
 pasos:[
  "Pon en una matriz a los usuarios (filas) y los productos (columnas); casi todas las celdas están vacías.",
  "La <b>factorización matricial</b> describe a cada usuario y a cada producto con pocos números ocultos (factores de gusto).",
  "La valoración prevista es el producto de ambos vectores: si encajan, valoración alta.",
  "Aprende esos factores ajustándose solo a las celdas conocidas; las vacías quedan como predicción.",
  "Recomienda los productos no vistos con mayor valoración prevista."],
 ej:'<p>Factores aprendidos (k = 2: «gusto por intriga», «gusto por comedia»):</p><div class="wrapt"><table><tr><th>Quién / qué</th><th>Intriga</th><th>Comedia</th></tr>'+
  '<tr><td>Ana</td><td>2,0</td><td>0,2</td></tr><tr><td>Serie «Dark»</td><td>2,1</td><td>0,3</td></tr><tr><td>Serie «Friends»</td><td>0,2</td><td>2,3</td></tr></table></div>'+
  '<p class="res">Previsión Ana-Dark = 2,0·2,1 + 0,2·0,3 = <b>4,3 estrellas</b>; Ana-Friends = 0,4 + 0,46 = <b>0,9</b>. Nadie le dijo al modelo qué es «intriga»: lo descubre del comportamiento.</p>',
 rec:["Recomienda por <b>comportamiento parecido</b>, sin mirar el producto.",
  "Problema del <b>arranque en frío</b>: usuarios o productos nuevos sin historial.",
  "Vigila el sesgo de popularidad y valida con test A/B."]};
CASOS.reco = [
 ["","Streaming","Dar visibilidad al catálogo largo, oculto tras los 50 títulos más populares.","Factores latentes con objetivo de relevancia y diversidad.","Más horas vistas de títulos fuera del top."],
 ["","E-commerce","«Quien compró esto también compró…» personalizado por usuario.","Recomendaciones según patrones de compra de clientes parecidos.","Más venta cruzada en ficha y email."],
 ["","Formación online","Qué curso recomendar al terminar uno.","Patrones de usuarios con trayectorias similares.","Más alumnos que encadenan un segundo curso."]];

EASY.contentbased = {
 frase:"Recomienda <b>por parecido de ficha</b>: si te gustó una película de espacio y astronautas, otras con esas palabras.",
 pasos:[
  "Convierte la descripción de cada producto en un vector con <b>TF-IDF</b>: pesa más las palabras frecuentes en esa ficha y raras en el catálogo.",
  "Mide el parecido entre dos productos con la <b>similitud coseno</b>: el ángulo entre sus vectores (1 = idénticos, 0 = nada en común).",
  "Para un producto, ordena los demás por similitud.",
  "Recomienda los más parecidos (excluyendo el propio).",
  "Funciona desde el primer día con productos nuevos: solo necesita su ficha."],
 ej:'<p>Pesos TF-IDF simplificados en 4 palabras (espacio, astronauta, amor, guerra):</p><div class="wrapt"><table><tr><th>Película</th><th>Vector</th><th class="hl">Coseno con «Interstellar»</th></tr>'+
  '<tr><td>Interstellar</td><td>(0,70; 0,70; 0; 0)</td><td class="hl">1</td></tr><tr><td>Gravity</td><td>(0,60; 0,50; 0; 0,62)</td><td class="hl">0,78</td></tr><tr><td>Notting Hill</td><td>(0; 0; 0,90; 0,44)</td><td class="hl">0</td></tr></table></div>'+
  '<p class="res">Gravity comparte «espacio» y «astronauta»: similitud alta. Notting Hill no comparte nada: cero. Ojo: compartir palabras no garantiza compartir <b>tono</b>.</p>',
 rec:["Solo necesita la <b>ficha del producto</b>: sin arranque en frío de producto.",
  "TF-IDF + coseno: sencillo y explicable; los embeddings entienden mejor el significado.",
  "Riesgo de burbuja: «más de lo mismo»; inyecta diversidad."]};
CASOS.contentbased = [
 ["","Streaming","40 estrenos al mes que el colaborativo no puede recomendar aún (tu notebook).","Similitud por sinopsis, género y reparto desde el día del estreno.","Fila «Similares» útil desde el primer minuto."],
 ["","Medios","Noticias relacionadas al final de cada artículo.","Similitud entre textos de artículos.","Más páginas vistas por visita."],
 ["","Empleo","Ofertas parecidas a la que el candidato está mirando.","Similitud entre descripciones de puestos.","Más candidaturas por sesión."]];

EASY.topic = {
 frase:"Lee miles de textos y descubre <b>de qué temas se habla</b> sin que se los digas.",
 pasos:[
  "Supone que cada documento es una mezcla de temas y cada tema una mezcla de palabras.",
  "Empieza asignando cada palabra a un tema al azar.",
  "Reasigna cada palabra al tema que mejor encaja con su documento y con el resto de palabras de ese tema (muestreo de Gibbs o variacional).",
  "Tras muchas pasadas, cada tema tiene sus palabras típicas y cada documento sus % de temas.",
  "Tú pones nombre a los temas mirando sus palabras (y validas que tengan sentido)."],
 ej:'<p>Reseña: «El envío tardó una semana, pero el precio era imbatible y la caja llegó perfecta».</p><div class="wrapt"><table><tr><th>Tema descubierto</th><th>Palabras típicas</th><th class="hl">% en esta reseña</th></tr>'+
  '<tr><td>Envío</td><td>envío, tardó, llegó, caja, semana</td><td class="hl">60%</td></tr><tr><td>Precio</td><td>precio, barato, imbatible, oferta</td><td class="hl">35%</td></tr><tr><td>Atención</td><td>atención, respuesta, amable</td><td class="hl">5%</td></tr></table></div>'+
  '<p class="res">Sumando las mezclas de 120.000 reseñas sabes <b>de qué se habla</b> y cómo cambia mes a mes, sin leerlas.</p>',
 rec:["Descubre <b>temas latentes</b>: documento = mezcla de temas.",
  "Necesita textos con varias frases y buen preprocesado en español.",
  "Elige el nº de temas por coherencia + lectura humana; hoy compite con BERTopic."]};
CASOS.topic = [
 ["","Producto","120.000 respuestas abiertas de encuesta que nadie lee.","Temas nombrables y su evolución trimestral.","Prioridades del roadmap basadas en lo que dicen los clientes."],
 ["","Soporte","¿Por qué contactan los clientes este mes?","Temas de tickets y su peso semanal.","Artículos de ayuda para los 3 temas que más crecen."],
 ["","Legal","Clasificar miles de sentencias por temática sin etiquetas.","Temas jurídicos descubiertos en el corpus.","Buscador temático del archivo."]];
