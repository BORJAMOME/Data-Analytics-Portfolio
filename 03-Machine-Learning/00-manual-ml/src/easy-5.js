/* ── PROBABILÍSTICOS, SERIES TEMPORALES, REFUERZO Y ACELERADORES ── */

EASY.bayesnet = {
 frase:"Un <b>diagrama de flechas</b> («qué influye en qué») con probabilidades, que razona en los dos sentidos.",
 pasos:[
  "Dibujas las variables como nodos y las influencias como flechas (lluvia → tráfico → retraso), idealmente con expertos.",
  "Cada nodo tiene una tabla: su probabilidad según el valor de sus padres.",
  "Fijas lo que sabes (<b>evidencia</b>): «hay retraso».",
  "La red propaga la evidencia en todas las direcciones y actualiza el resto de probabilidades.",
  "Puedes preguntar hacia delante («si llueve, ¿retraso?») y hacia atrás («hay retraso: ¿habrá llovido?»)."],
 ej:'<p>P(lluvia) = 20%; P(retraso | lluvia) = 80%; P(retraso | sin lluvia) = 20%. Observas un retraso:</p><div class="wrapt"><table><tr><th>Escenario</th><th>Cálculo</th><th class="hl">Probabilidad</th></tr>'+
  '<tr><td>Llueve y hay retraso</td><td>0,2 × 0,8</td><td class="hl">0,16</td></tr><tr><td>No llueve y hay retraso</td><td>0,8 × 0,2</td><td class="hl">0,16</td></tr><tr><td>P(lluvia | retraso)</td><td>0,16 / (0,16 + 0,16)</td><td class="hl">50%</td></tr></table></div>'+
  '<p class="res">Ver el retraso sube la probabilidad de lluvia del 20% al <b>50%</b>. Si además sabes que hay obras (otra causa del retraso), la lluvia vuelve a bajar: la otra causa «explica» el retraso (<i>explaining away</i>).</p>',
 rec:["Grafo explícito de dependencias: admite <b>conocimiento experto</b>.",
  "Responde «¿y si…?» en cualquier dirección y con evidencia parcial.",
  "Que la red esté aprendida de datos no la convierte en causal: las flechas hay que justificarlas."]};
CASOS.bayesnet = [
 ["","Industria","Paradas de línea sin causa clara: materia prima, humedad, turno o mantenimiento.","Red construida con ingenieros; dada una parada, causa más probable.","Intervenir en la humedad, la causa con más peso."],
 ["","Salud","Apoyo al diagnóstico con síntomas, pruebas y factores de riesgo.","Probabilidad de cada diagnóstico con la evidencia disponible, aunque falten pruebas.","Qué prueba pedir a continuación."],
 ["","Soporte técnico","Diagnosticar por qué falla el router de un cliente.","Red de síntomas y causas para guiar al agente.","Menos visitas técnicas innecesarias."]];

EASY.hmm = {
 frase:"Deduce un <b>estado oculto</b> (calma o estrés, sano o averiado) a partir de lo que sí ves.",
 pasos:[
  "Supones unos pocos estados que no observas (por ejemplo, mercado en calma o en estrés).",
  "Cada estado produce observaciones con su propio patrón (en estrés, movimientos más grandes).",
  "Los estados tienden a durar: hay una probabilidad de <b>transición</b> de un estado a otro.",
  "<b>Baum-Welch</b> aprende esas probabilidades; <b>Viterbi</b> reconstruye la secuencia de estados más probable.",
  "Resultado: el régimen de cada día, estable y sin saltos erráticos."],
 ej:'<p>Persistencia de los regímenes (probabilidad de seguir en el mismo estado mañana):</p><div class="wrapt"><table><tr><th>P(seguir)</th><th class="hl">Duración media del régimen</th><th>Lectura</th></tr>'+
  '<tr><td>0,50</td><td class="hl">2 días</td><td>Cambios casi diarios: señal ruidosa</td></tr><tr><td>0,95</td><td class="hl">20 días</td><td>Régimen típico de un mes de mercado</td></tr><tr><td>0,99</td><td class="hl">100 días</td><td>Cambios de ciclo</td></tr></table></div>'+
  '<p class="res">Duración media = 1 / (1 − P(seguir)). Un clustering normal ignora esta inercia y salta de estado cada día; el HMM sabe que los estados <b>duran</b>.</p>',
 rec:["Infiere <b>estados ocultos</b> en secuencias.",
  "La matriz de transición aporta la <b>persistencia</b>.",
  "Detecta el régimen actual; no adivina el siguiente."]};
CASOS.hmm = [
 ["","Gestión de activos","Saber si el mercado está en calma, transición o estrés.","Regímenes estimados con rendimientos y volatilidad.","Reducir exposición al entrar en régimen de estrés."],
 ["","Mantenimiento","Fase de desgaste de una máquina a partir de vibraciones.","Estados «sano», «desgaste» y «crítico» inferidos de la señal.","Intervenir al entrar en «desgaste»."],
 ["","Analítica web","Intención oculta del usuario en su sesión (curiosear, comparar, comprar).","Estados de intención a partir de la secuencia de páginas.","Mostrar el chat de ayuda en la fase «comparar»."]];

EASY.arima = {
 frase:"Predice una serie con <b>su propio pasado</b>: lo de hoy se parece a lo de ayer, corregido por errores recientes.",
 pasos:[
  "<b>I</b> (integrado): si la serie tiene tendencia, la «diferencias» (restas cada valor menos el anterior) hasta que sea estable.",
  "<b>AR</b> (autorregresivo, p): el valor de hoy depende de los de días anteriores.",
  "<b>MA</b> (media móvil, q): se corrige con los errores que cometió en los últimos días.",
  "Eliges p, d, q con tests (ADF), los gráficos ACF/PACF o búsqueda automática (AIC).",
  "Compruebas que los residuos sean ruido blanco y validas siempre hacia delante."],
 ej:'<p>AR(1) sobre las desviaciones respecto a la media de 100: <b>ŷ<sub>t+1</sub> = 100 + 0,7 × (y<sub>t</sub> − 100)</b>. Último valor: 120.</p><div class="wrapt"><table><tr><th>Horizonte</th><th>Cálculo</th><th class="hl">Previsión</th></tr>'+
  '<tr><td>+1</td><td>100 + 0,7 × 20</td><td class="hl">114,0</td></tr><tr><td>+2</td><td>100 + 0,7 × 14</td><td class="hl">109,8</td></tr><tr><td>+3</td><td>100 + 0,7 × 9,8</td><td class="hl">106,9</td></tr></table></div>'+
  '<p class="res">La previsión vuelve poco a poco a la media: ARIMA sabe que el efecto de un pico se <b>desvanece</b>, y su intervalo de confianza se ensancha con el horizonte.</p>',
 rec:["AR = pasado de la serie · I = diferenciar · MA = errores pasados.",
  "Necesita serie <b>estacionaria</b> (test ADF); diferencia si hay tendencia.",
  "Línea base obligatoria; valida siempre hacia delante."]};
CASOS.arima = [
 ["","Finanzas","Previsión de ventas del próximo trimestre defendible ante dirección.","Modelo explicable con intervalos de predicción.","Presupuesto con un rango realista, no un número mágico."],
 ["","Energía","Previsión de consumo eléctrico (tu notebook).","ARIMA como línea base antes de modelos más complejos.","Referencia para medir si los modelos complejos aportan."],
 ["","Banca","Efectivo necesario en cada cajero.","Previsión de retiradas por cajero a corto plazo.","Menos cajeros vacíos y menos efectivo inmovilizado."]];

EASY.sarima = {
 frase:"ARIMA con <b>memoria de calendario</b>: para predecir diciembre mira también el diciembre pasado.",
 pasos:[
  "Detecta el ciclo que se repite: <b>s</b> = 12 en datos mensuales con patrón anual, 7 en diarios con patrón semanal.",
  "Añade al ARIMA un segundo bloque (P, D, Q)ₛ que funciona igual pero con saltos de s periodos.",
  "La diferenciación estacional (D) resta el valor del mismo mes del año anterior.",
  "Ajusta y comprueba en el gráfico de autocorrelación que ya no queda pico en el lag s.",
  "Necesitas al menos 2-3 ciclos completos de historia."],
 ej:'<p>Ventas mensuales (k€) con pico navideño. Previsión para diciembre:</p><div class="wrapt"><table><tr><th>Mes</th><th>Año pasado</th><th>Este año</th></tr>'+
  '<tr><td>Noviembre</td><td>115</td><td>120</td></tr><tr><td>Diciembre</td><td>180</td><td class="hl">¿?</td></tr></table></div>'+
  '<p>ARIMA sin estacionalidad, mirando a noviembre: ≈ <b>122</b>. SARIMA, mirando también al diciembre anterior y al crecimiento de este año (+4%): ≈ <b>187</b>.</p>'+
  '<p class="res">Diciembre real: 189. El modelo sin estacionalidad falla justo en el mes en que se gana el año.</p>',
 rec:["<b>s</b> = longitud del ciclo (12 mensual, 7 diario-semanal).",
  "Necesitas varios ciclos de historia.",
  "Comprueba el pico de la ACF en el lag s antes y después."]};
CASOS.sarima = [
 ["","Turismo","Dimensionar la plantilla de hoteles con 3 meses de antelación.","Captura el patrón anual de ocupación.","Contratación de temporada ajustada al pico real."],
 ["","Retail","Ventas semanales con estacionalidad anual (tu notebook).","Bloque estacional que reproduce campañas y verano.","Pedidos a proveedores con el pico ya incorporado."],
 ["","Transporte","Viajeros diarios de metro con patrón semanal.","s = 7: lunes a viernes frente a fines de semana.","Frecuencia de trenes por día de la semana."]];

EASY.sarimax = {
 frase:"SARIMA más <b>palancas externas</b> (precio, promociones, clima) para simular escenarios.",
 pasos:[
  "Partes de un SARIMA que captura la inercia y la estacionalidad.",
  "Añades variables exógenas (la X): promociones, precio, temperatura, festivos.",
  "El modelo estima cuánto aporta cada palanca y deja al SARIMA lo que queda.",
  "Para predecir necesitas el <b>valor futuro</b> de cada exógena: conocido (calendario), decidido por ti (precio) o previsto.",
  "Cambiando esos valores futuros simulas escenarios «¿y si…?»."],
 ej:'<p>Ventas semanales = base del SARIMA + 35 por semana de promoción − 2 por cada °C por encima de lo normal:</p><div class="wrapt"><table><tr><th>Escenario próxima semana</th><th>Cálculo</th><th class="hl">Ventas previstas</th></tr>'+
  '<tr><td>Sin promo, temperatura normal</td><td>400</td><td class="hl">400</td></tr><tr><td>Con promo</td><td>400 + 35</td><td class="hl">435</td></tr><tr><td>Con promo y ola de calor (+5 °C)</td><td>400 + 35 − 10</td><td class="hl">425</td></tr></table></div>'+
  '<p class="res">La promo aporta <b>+35</b> aunque haga calor. Si no sabes la temperatura de dentro de 6 meses, tendrás que preverla y arrastrarás su error.</p>',
 rec:["Separa la <b>inercia</b> de la serie del efecto de tus <b>palancas</b>.",
  "Las exógenas futuras tienen que ser conocidas o fijadas por ti.",
  "Permite simular escenarios: su gran valor para negocio."]};
CASOS.sarimax = [
 ["","Retail","Ventas con huelgas, promociones y crisis logísticas (tu notebook).","Cuantifica cuánto aporta cada evento y cuánto es inercia.","Calendario promocional optimizado para el año siguiente."],
 ["","Energía","Demanda eléctrica que depende de temperatura y laborables.","Escenarios «ola de calor de +3 °C» para la compra de energía.","Estrategia de cobertura ante picos de demanda."],
 ["","Gran consumo","Ventas de helado según previsión meteorológica y precio.","El precio que fija la empresa entra como exógena conocida.","Precio de verano que maximiza el margen."]];

EASY.prophet = {
 frase:"Descompone la serie <b>como un Lego</b>: tendencia + patrón semanal + patrón anual + festivos.",
 pasos:[
  "Ajusta una <b>tendencia</b> a tramos, con puntos de cambio donde el crecimiento se acelera o frena.",
  "Ajusta los patrones que se repiten: semanal y anual (con curvas suaves de Fourier).",
  "Añade el efecto de cada <b>festivo</b> y de tus campañas como eventos.",
  "Suma las piezas para predecir; cada pieza se puede enseñar por separado en un gráfico.",
  "Valida con <code>cross_validation</code> (ventanas que avanzan en el tiempo)."],
 ej:'<p>Pedidos previstos para el lunes de Black Friday:</p><div class="wrapt"><table><tr><th>Pieza</th><th class="hl">Aporte</th></tr>'+
  '<tr><td>Tendencia (nivel actual)</td><td class="hl">1.000</td></tr><tr><td>Efecto lunes</td><td class="hl">+80</td></tr><tr><td>Efecto noviembre (anual)</td><td class="hl">+150</td></tr><tr><td>Festivo/campaña «Black Friday»</td><td class="hl">+600</td></tr><tr><td><b>Total</b></td><td class="hl"><b>1.830</b></td></tr></table></div>'+
  '<p class="res">Cada número tiene una explicación de negocio. Si no marcas tus campañas como eventos, Prophet confundirá sus picos con estacionalidad.</p>',
 rec:["Tendencia + estacionalidades + festivos: <b>automático y explicable</b>.",
  "Tolera huecos y outliers; el mando clave es <code>changepoint_prior_scale</code>.",
  "Con series cortas o dinámicas complejas, un ARIMA bien hecho puede ganarle."]};
CASOS.prophet = [
 ["","E-commerce","Prever pedidos diarios para dimensionar almacén y atención al cliente.","Absorbe festivos móviles y estacionalidad semanal y anual.","Turnos ajustados con una semana de antelación."],
 ["","Producto digital","Tráfico web diario con lanzamientos y campañas.","Campañas como eventos para separar su efecto.","Capacidad de servidores sin sobresaltos."],
 ["","Restauración","Pedidos de delivery por día con partidos y festivos.","Eventos deportivos como regresores.","Compra de ingredientes ajustada a la demanda."]];

EASY.hw = {
 frase:"Una media que da <b>más peso a lo reciente</b>, por separado para el nivel, la tendencia y la estacionalidad.",
 pasos:[
  "<b>Nivel</b>: nuevo nivel = α × dato de hoy + (1 − α) × nivel anterior.",
  "<b>Tendencia</b>: igual, con β, sobre el cambio del nivel.",
  "<b>Estacionalidad</b>: igual, con γ, sobre el patrón de cada mes o día de la semana.",
  "Previsión = nivel + tendencia × horizonte + estacionalidad del periodo.",
  "Amortigua la tendencia (damped) para no proyectar crecimientos infinitos."],
 ej:'<p>Solo el nivel, con α = 0,3 y nivel inicial 100:</p><div class="wrapt"><table><tr><th>Semana</th><th>Ventas reales</th><th>Cálculo</th><th class="hl">Nuevo nivel</th></tr>'+
  '<tr><td>1</td><td>120</td><td>0,3·120 + 0,7·100</td><td class="hl">106,0</td></tr><tr><td>2</td><td>90</td><td>0,3·90 + 0,7·106</td><td class="hl">101,2</td></tr><tr><td>3</td><td>110</td><td>0,3·110 + 0,7·101,2</td><td class="hl">103,8</td></tr></table></div>'+
  '<p class="res">El nivel sigue a las ventas sin dejarse arrastrar por cada pico. α alto = reacciona rápido; α bajo = muy suave. Rápido, sencillo y difícil de batir a corto plazo.</p>',
 rec:["Suavizado exponencial de <b>nivel, tendencia y estacionalidad</b>.",
  "Aditiva si los picos son constantes; multiplicativa si crecen con el nivel.",
  "Línea base a escala: miles de series en segundos."]};
CASOS.hw = [
 ["","Distribución","Prever 12.000 referencias sin ajustar un modelo por SKU.","Ajuste automático en milisegundos por serie.","Reposición semanal desatendida."],
 ["","Hospitales","Consumo semanal de material sanitario por planta.","Captura tendencia y estacionalidad (gripe en invierno).","Pedidos de almacén sin roturas."],
 ["","Cafeterías","Ventas diarias por producto para preparar la producción.","Patrón semanal y tendencia reciente.","Menos merma de bollería al final del día."]];

EASY.bandit = {
 frase:"Un test A/B que <b>se corrige solo</b>: manda más tráfico a lo que funciona mientras aprende.",
 pasos:[
  "Tienes varias opciones («brazos»): creatividades, precios, titulares.",
  "Para cada una llevas la cuenta de éxitos y fracasos.",
  "En cada visita, <b>Thompson sampling</b> sortea un valor plausible de conversión para cada opción y muestra la ganadora del sorteo.",
  "Las opciones que van bien ganan más sorteos y reciben más tráfico; las dudosas siguen recibiendo algo (exploración).",
  "Pierdes menos conversiones que repartiendo a partes iguales hasta el final."],
 ej:'<p>Tras 3.000 visitas (1.000 por variante en el arranque):</p><div class="wrapt"><table><tr><th>Variante</th><th>Conversiones</th><th>Tasa</th><th class="hl">Tráfico siguiente (aprox.)</th></tr>'+
  '<tr><td>A</td><td>40</td><td>4,0%</td><td class="hl">~3%</td></tr><tr><td>B</td><td>52</td><td>5,2%</td><td class="hl">~10%</td></tr><tr><td>C</td><td>70</td><td>7,0%</td><td class="hl">~87%</td></tr></table></div>'+
  '<p class="res">Un A/B clásico seguiría dando 2/3 del tráfico a A y B hasta el final. El bandit ya explota C sin dejar de comprobar del todo a las otras.</p>',
 rec:["Equilibra <b>explorar</b> (aprender) y <b>explotar</b> (ganar).",
  "Thompson sampling es la opción por defecto: sencilla y eficaz.",
  "Complica la inferencia estadística: si necesitas un p-valor limpio, A/B clásico."]};
CASOS.bandit = [
 ["","E-commerce","Probar 5 versiones de ficha de producto en plena campaña.","Desplaza tráfico a la mejor versión mientras aprende.","Más conversiones durante el propio test."],
 ["","Medios","Elegir entre 4 titulares para una noticia que caduca en horas.","Bandit sobre la tasa de clic.","El titular ganador se impone en minutos."],
 ["","Marketing","Qué asunto de email enviar a cada tanda de la base.","Envíos por tandas que favorecen el asunto ganador.","Más aperturas totales en la campaña."]];

EASY.qlearning = {
 frase:"Un agente que rellena una tabla <b>«situación × acción → cuánto ganaré a la larga»</b> a base de probar.",
 pasos:[
  "Empieza con la tabla Q a cero: no sabe nada.",
  "En cada situación elige una acción: casi siempre la mejor según la tabla, a veces una al azar (ε, exploración).",
  "Recibe una recompensa y llega a una nueva situación.",
  "Actualiza la celda: Q ← Q + α × (recompensa + γ × <b>mejor valor de la nueva situación</b> − Q).",
  "Tras muchos episodios, la acción con mayor Q en cada situación es la política aprendida."],
 ej:'<p>Actualización de una celda con α = 0,5 y γ = 0,9. Valor actual Q(s, a) = 2; recompensa = −1; mejor Q de la nueva situación = 10.</p><div class="wrapt"><table><tr><th>Paso</th><th>Cálculo</th><th class="hl">Valor</th></tr>'+
  '<tr><td>Objetivo</td><td>−1 + 0,9 × 10</td><td class="hl">8</td></tr><tr><td>Error</td><td>8 − 2</td><td class="hl">6</td></tr><tr><td>Nuevo Q(s, a)</td><td>2 + 0,5 × 6</td><td class="hl">5</td></tr></table></div>'+
  '<p class="res">La celda se acerca a lo que de verdad parece valer esa acción. Repetido miles de veces, la tabla converge. γ = 0 haría al agente miope.</p>',
 rec:["Aprende por <b>prueba y error</b>, sin conocer el entorno.",
  "Off-policy: aprende de la <b>mejor acción posible</b>, aunque esté explorando.",
  "Solo con pocos estados discretos; si no caben en tabla, DQN."]};
CASOS.qlearning = [
 ["","Inventario (simulado)","Política de reposición con demanda aleatoria y costes de rotura.","La tabla dice cuánto pedir en cada nivel de stock.","Regla de reposición que se puede imprimir y auditar."],
 ["","Robótica de almacén","Ruta de un robot en una rejilla con zonas prohibidas.","Aprende la ruta más corta evitando obstáculos.","Rutas sin programarlas a mano."],
 ["","Docencia","Entender los fundamentos del refuerzo.","Tabla legible fila a fila.","Base para pasar a DQN y PPO."]];

EASY.sarsa = {
 frase:"Como Q-Learning, pero aprende <b>con sus propios despistes</b>: evita caminar pegado al acantilado.",
 pasos:[
  "Misma tabla Q y misma forma de elegir acciones (ε-greedy).",
  "Tras actuar y llegar a la nueva situación, elige ya la <b>siguiente acción que de verdad tomará</b> (a veces exploratoria).",
  "Actualiza con el valor de esa acción real, no con el de la mejor posible.",
  "Así la tabla incorpora el riesgo de sus propios errores de exploración (<b>on-policy</b>).",
  "Aprende políticas más prudentes cuando equivocarse es caro."],
 ej:'<p>Misma situación que en Q-Learning (Q = 2, r = −1, α = 0,5, γ = 0,9), pero la acción siguiente elegida es exploratoria y vale 4 (la mejor valía 10):</p><div class="wrapt"><table><tr><th>Algoritmo</th><th>Objetivo</th><th class="hl">Nuevo Q</th></tr>'+
  '<tr><td>Q-Learning</td><td>−1 + 0,9 × 10 = 8</td><td class="hl">5,0</td></tr><tr><td>SARSA</td><td>−1 + 0,9 × 4 = 2,6</td><td class="hl">2,3</td></tr></table></div>'+
  '<p class="res">SARSA valora menos esa situación porque sabe que, explorando, a veces hará algo peor. Junto a un acantilado (−100), eso le lleva a elegir el <b>camino seguro</b>.</p>',
 rec:["On-policy: aprende de la acción que <b>realmente</b> toma.",
  "Más prudente que Q-Learning mientras explora.",
  "Con exploración → 0, ambos convergen a la misma política."]};
CASOS.sarsa = [
 ["","E-commerce","Qué acción aplicar cada semana a cada cliente (nada, email, cupón) (tu notebook).","Política que descuenta el coste de sus propios experimentos.","Menos cupones agresivos «por si acaso»."],
 ["","Robótica","Robot que aprende cerca de zonas peligrosas.","Rutas que mantienen distancia de seguridad mientras explora.","Menos accidentes durante el aprendizaje."],
 ["","Docencia","Entender on-policy frente a off-policy.","El ejemplo clásico del acantilado.","Base para entender PPO (on-policy) y DQN (off-policy)."]];

EASY.dqn = {
 frase:"Q-Learning cuando la tabla sería gigantesca: una <b>red neuronal estima</b> el valor de cada acción.",
 pasos:[
  "La red recibe la situación (estado) y devuelve un valor Q por cada acción posible.",
  "El agente juega y guarda cada experiencia (estado, acción, recompensa, siguiente estado) en un <b>replay buffer</b>.",
  "Entrena la red con lotes <b>al azar</b> del buffer (rompe la correlación entre pasos seguidos).",
  "Usa una <b>red objetivo</b> congelada que se actualiza cada cierto tiempo, para no perseguir un blanco móvil.",
  "La red generaliza: situaciones parecidas tienen valores parecidos aunque nunca las viera."],
 ej:'<p>¿Cuántas celdas necesitaría una tabla Q discretizando cada variable en 10 tramos?</p><div class="wrapt"><table><tr><th>Variables de estado</th><th class="hl">Celdas de la tabla</th></tr>'+
  '<tr><td>2 (posición, velocidad)</td><td class="hl">100</td></tr><tr><td>6 (precio, demanda, stock…)</td><td class="hl">1.000.000</td></tr><tr><td>Imagen de 84 × 84 píxeles</td><td class="hl">Imposible</td></tr></table></div>'+
  '<p class="res">Con millones de celdas casi todas quedarían sin visitar. Una red con unos miles de pesos <b>generaliza</b> entre estados parecidos.</p>',
 rec:["Red neuronal en lugar de tabla Q; acciones <b>discretas</b>.",
  "Dos estabilizadores: <b>replay buffer</b> y <b>red objetivo</b>.",
  "Necesita simulador y muchísimas interacciones; compara con heurísticas."]};
CASOS.dqn = [
 ["","Energía","Cuándo cargar y descargar una batería según precio, demanda y renovables.","Optimiza la secuencia completa de decisiones en un simulador con datos reales.","Más beneficio que la regla «cargar barato, descargar caro»."],
 ["","Videojuegos","Agentes que juegan desde los píxeles (Atari).","La red aprende el valor de cada acción a partir de la imagen.","El hito que popularizó el deep reinforcement learning."],
 ["","Movilidad","Control de semáforos en un cruce simulado.","Estado = colas en cada carril; acción = fase del semáforo.","Menos tiempo de espera medio en simulación."]];

EASY.ppo = {
 frase:"Aprende directamente <b>la estrategia</b>, con una regla de prudencia: no cambiar demasiado de golpe.",
 pasos:[
  "La política es una red que da probabilidades a cada acción (p. ej., 70% acelerar, 30% frenar).",
  "Juega un rato y mide qué acciones salieron mejor de lo esperado (<b>ventaja</b>).",
  "Sube la probabilidad de esas acciones y baja la de las peores…",
  "…pero <b>recorta</b> el cambio: el ratio nueva/vieja probabilidad no puede salir de [1 − ε, 1 + ε] (ε ≈ 0,2).",
  "Repite: avances estables sin destrozar lo aprendido. Fue la base del RLHF de los primeros asistentes."],
 ej:'<p>Una acción con ventaja positiva. El nuevo entrenamiento querría multiplicar su probabilidad por r = 1,5. Con ε = 0,2:</p><div class="wrapt"><table><tr><th>Objetivo</th><th>Cálculo</th><th class="hl">Ratio efectivo</th></tr>'+
  '<tr><td>Sin recorte</td><td>r × A</td><td class="hl">1,5</td></tr><tr><td>PPO (recortado)</td><td>min(1,5 × A; 1,2 × A)</td><td class="hl">1,2</td></tr></table></div>'+
  '<p class="res">PPO solo deja subir esa probabilidad un <b>20%</b> por actualización. Si el paso fuera demasiado grande y empeorara la política, los datos siguientes también serían malos y no habría vuelta atrás.</p>',
 rec:["Optimiza la <b>política</b> directamente; admite acciones continuas.",
  "El <b>clipping</b> limita cuánto cambia en cada paso.",
  "Base del RLHF original; hoy en LLMs dominan variantes como GRPO o DPO."]};
CASOS.ppo = [
 ["","IA conversacional","Ajustar un modelo de lenguaje al tono y las políticas de la empresa.","Optimiza con un modelo de preferencias sin alejarse demasiado del original (KL).","Respuestas alineadas sin perder capacidades."],
 ["","Robótica","Control continuo de un brazo robótico.","Política que produce fuerzas continuas, estable al entrenar.","Agarre de piezas sin programar trayectorias."],
 ["","Procesos","Control de temperatura de un horno industrial en simulación.","Acciones continuas (potencia) con entrenamiento estable.","Menos consumo con la misma calidad."]];

EASY.automl = {
 frase:"Un asistente que <b>prueba por ti</b> decenas de modelos y configuraciones y te devuelve un ranking.",
 pasos:[
  "Le das el dataset, el target y la métrica.",
  "Prepara los datos (nulos, categorías, escalado) automáticamente.",
  "Entrena muchos modelos y combinaciones de hiperparámetros con validación cruzada.",
  "Te devuelve un <b>ranking</b> (y a menudo un ensemble de los mejores).",
  "Tú revisas lo importante: fugas de información, split temporal, línea base y si el ganador es mantenible."],
 ej:'<p>Ranking tras 10 minutos (AUC en validación cruzada, media ± desviación):</p><div class="wrapt"><table><tr><th>Modelo</th><th class="hl">AUC</th></tr>'+
  '<tr><td>LightGBM</td><td class="hl">0,842 ± 0,010</td></tr><tr><td>XGBoost</td><td class="hl">0,839 ± 0,011</td></tr><tr><td>Random Forest</td><td class="hl">0,826 ± 0,012</td></tr><tr><td>Regresión logística</td><td class="hl">0,811 ± 0,009</td></tr><tr><td>Baseline (clase mayoritaria)</td><td class="hl">0,500</td></tr></table></div>'+
  '<p class="res">Los dos primeros están dentro del ruido (0,003 de diferencia frente a ±0,01): elige el más fácil de mantener. Y si alguno saliera con 0,99, <b>busca la fuga</b> antes de celebrarlo.</p>',
 rec:["Brújula rápida: <b>qué familia funciona</b> en tus datos.",
  "No sustituye tu criterio: fugas, split temporal, línea base.",
  "Diferencias dentro del ruido no justifican un modelo más complejo."]};
CASOS.automl = [
 ["","Consultoría","Decir en 48 h si un problema es abordable con datos.","Ranking rápido de modelos sobre el dataset del cliente.","Seguir adelante o parar antes de comprometer 3 meses."],
 ["","Pyme","Primer modelo de churn sin equipo de ciencia de datos.","Un baseline sólido sin escribir cientos de líneas.","Lista mensual de clientes en riesgo."],
 ["","BI","Validar si añadir una variable nueva aporta algo.","Comparar rankings con y sin la variable en minutos.","Decidir si compensa integrar esa fuente de datos."]];

EASY.pyspark = {
 frase:"Cuando los datos no caben en tu ordenador, Spark los <b>reparte entre muchos</b> y trabaja en paralelo.",
 pasos:[
  "Divide el DataFrame en <b>particiones</b> repartidas entre varios ejecutores.",
  "Escribes transformaciones (filter, select, groupBy, join) muy parecidas a SQL o pandas.",
  "Son <b>perezosas</b>: solo construyen un plan; nada se calcula todavía.",
  "Al lanzar una <b>acción</b> (count, show, write), el optimizador reescribe el plan y lo ejecuta en paralelo.",
  "Las operaciones que mueven datos entre máquinas (<b>shuffle</b>: groupBy, join) son las caras: minimízalas."],
 ej:'<p>Informe mensual sobre 1.200 millones de líneas de ticket:</p><div class="wrapt"><table><tr><th>Versión</th><th class="hl">Tiempo</th></tr>'+
  '<tr><td>pandas en una máquina virtual</td><td class="hl">9 horas (cuando no se queda sin memoria)</td></tr><tr><td>Spark, sin cuidado (join con shuffle completo)</td><td class="hl">40 min</td></tr><tr><td>Spark con Parquet particionado por fecha + broadcast de la tabla de tiendas</td><td class="hl">6 min</td></tr></table></div>'+
  '<p class="res">El salto no viene de «usar Spark», sino de <b>leer el plan</b> (<code>explain()</code>) y evitar shuffles innecesarios.</p>',
 rec:["Mismo pensamiento tabular que SQL/pandas, pero <b>distribuido</b>.",
  "Transformaciones perezosas; el tiempo real está en las <b>acciones</b>.",
  "Si cabe en una máquina, prueba antes Polars o DuckDB."]};
CASOS.pyspark = [
 ["","Retail","Histórico de 5 años de tickets que ya no cabe en pandas (tu notebook).","Pipeline distribuido con particionado por fecha.","Informe mensual de horas a minutos."],
 ["","Telecomunicaciones","Procesar miles de millones de registros de llamadas al día.","Agregaciones por cliente y antena en paralelo.","Variables diarias para el modelo de churn."],
 ["","Banca","Preparar variables de comportamiento para scoring de toda la cartera.","Ventanas temporales sobre años de transacciones en Spark.","Tabla de features lista cada noche."]];
