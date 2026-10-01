/* ══════════════════════════════════════════════════════════════
   VIZ · lote C — redes neuronales, modelos gráficos y refuerzo
   mlp · cnn · rnn · transformer · autoenc · rbm · som · bayesnet ·
   hmm · qlearning · sarsa · dqn · ppo
   ══════════════════════════════════════════════════════════════ */
(function(){

/* ── utilidades locales ── */
function rgbOf(c){
  c = String(c).trim();
  if(c.charAt(0) === "#"){
    var h = c.slice(1); if(h.length === 3) h = h.split("").map(function(x){ return x + x; }).join("");
    var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255];
  }
  var m = c.match(/[\d.]+/g) || [0, 0, 0]; return [+m[0], +m[1], +m[2]];
}
function mixc(a, b, t){
  var A = rgbOf(a), B = rgbOf(b); t = Math.max(0, Math.min(1, t));
  return "rgb(" + Math.round(A[0] + (B[0] - A[0]) * t) + "," + Math.round(A[1] + (B[1] - A[1]) * t) + "," + Math.round(A[2] + (B[2] - A[2]) * t) + ")";
}
function rr(ctx, x, y, w, h, r){
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function tx(ctx, s, x, y, o){
  o = o || {};
  ctx.font = (o.w ? o.w + " " : "") + (o.s || 12) + "px " + LABFONT;
  ctx.fillStyle = o.c || "#000"; ctx.textAlign = o.a || "left"; ctx.textBaseline = o.b || "alphabetic";
  ctx.fillText(s, x, y); ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
}
function loop(fn){
  var on = true, id = requestAnimationFrame(function f(t){ if(!on) return; id = requestAnimationFrame(f); fn(t); });
  return function(){ on = false; cancelAnimationFrame(id); };
}
function arrowHead(ctx, x, y, ang, s, col){
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y);
  ctx.lineTo(x - s * Math.cos(ang - 0.45), y - s * Math.sin(ang - 0.45));
  ctx.lineTo(x - s * Math.cos(ang + 0.45), y - s * Math.sin(ang + 0.45)); ctx.closePath(); ctx.fill();
}
/* botón/que alterna */
function playToggle(ctl, labelOn, onChange){
  var on = false, b = ctlBtn(ctl, "" + labelOn, function(){ set(!on); onChange(on); }, true);
  function set(v){ on = v; b.innerHTML = on ? "Pausa" : "" + labelOn; b.setAttribute("aria-pressed", on); }
  return {set:set, get:function(){ return on; }};
}
function sigm(z){ return 1 / (1 + Math.exp(-z)); }
function movAvg(a, k){ var o = [], s = 0; for(var i = 0; i < a.length; i++){ s += a[i]; if(i >= k) s -= a[i - k]; o.push(s / Math.min(i + 1, k)); } return o; }
function hatch(ctx, x, y, w, h, col, gap){
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = 1;
  for(var d = -h; d < w; d += (gap || 6)){ ctx.beginPath(); ctx.moveTo(x + d, y + h); ctx.lineTo(x + d + h, y); ctx.stroke(); }
  ctx.restore();
}
function fmtN(n){ return Math.round(n).toLocaleString("es-ES"); }

/* ══ 1. MLP — PLAYGROUND ════════════════════════════════════════ */
VIZ.push({id:"v-mlp", model:"mlp", g:"model", ic:"", dim:"2D",
 t:"Playground de una red neuronal",
 q:"¿Por qué una red con capas ocultas separa lo que una recta no puede separar?",
 intro:"Una red neuronal pequeña (un <b>perceptrón multicapa</b>) se entrena <b>de verdad</b> aquí mismo para separar dos tipos de clientes (● azul y ● naranja) en un plano. Elige los datos, el número de capas y neuronas y la <b>activación</b> (la función que «dobla» la señal dentro de cada neurona) y pulsa. Cada cuadradito de la red muestra lo que «ve» esa neurona en todo el plano.",
 notice:["Con activación <b>lineal</b> la red, tenga las capas que tenga, equivale a una regresión logística: la frontera es <b>una recta</b> y el círculo no se separa nunca (la accuracy se queda cerca del 50-65%).",
   "Cambia a <b>ReLU</b> o <b>tanh</b> y la frontera se curva hasta encerrar el círculo: cada neurona oculta aporta un trozo de frontera (mira sus cuadraditos) y la salida los combina.",
   "En la <b>espiral</b>, 1 capa con 2-3 neuronas se queda corta; con <b>2 capas de 6-8</b> lo consigue. Si la pérdida de <b>test</b> sube mientras la de train baja, está memorizando (sobreajuste)."],
 models:["mlp","logistica","cnn"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 420, K = makeCanvas(stage, W, H, "Frontera de decisión de una red neuronal, diagrama de la red y curva de pérdida"), ctx = K.ctx;
   var ds = "circle", act = "relu", nL = 1, nH = 4, lr = 0.03, data, net, adam, ep, hist, stopPlay = null, maxEp = 3000;
   var PB = [28, 56, 316, 316], R0 = 1.25;
   function genData(){
     var r = mulberry(ds === "circle" ? 3 : ds === "xor" ? 5 : 9), pts = [];
     if(ds === "circle"){
       for(var i = 0; i < 220; i++){ var inner = i % 2 === 0, a = r() * 6.283, rad = inner ? Math.sqrt(r()) * 0.45 : 0.68 + r() * 0.34;
         pts.push([rad * Math.cos(a) + gauss(r) * 0.04, rad * Math.sin(a) + gauss(r) * 0.04, inner ? 1 : 0]); }
     } else if(ds === "xor"){
       for(var j = 0; j < 220; j++){ var x = r() * 2 - 1, y = r() * 2 - 1; x += (x > 0 ? 1 : -1) * 0.07; y += (y > 0 ? 1 : -1) * 0.07;
         pts.push([x * 0.95, y * 0.95, x * y > 0 ? 1 : 0]); }
     } else {
       for(var k = 0; k < 110; k++){ var t = k / 110, ang = t * 1.6 * Math.PI, rad2 = 0.12 + 0.95 * t;
         pts.push([rad2 * Math.cos(ang) + gauss(r) * 0.035, rad2 * Math.sin(ang) + gauss(r) * 0.035, 1]);
         pts.push([-rad2 * Math.cos(ang) + gauss(r) * 0.035, -rad2 * Math.sin(ang) + gauss(r) * 0.035, 0]); }
     }
     /* barajado determinista y separación 160 train / 60 test */
     for(var s = pts.length - 1; s > 0; s--){ var q = Math.floor(r() * (s + 1)), tmp = pts[s]; pts[s] = pts[q]; pts[q] = tmp; }
     data = {tr:pts.slice(0, 160), te:pts.slice(160)};
   }
   function initNet(){
     var r = mulberry(21), sizes = [2].concat(nL === 2 ? [nH, nH] : [nH]).concat([1]);
     net = {sizes:sizes, W:[], b:[]}; adam = {mW:[], vW:[], mb:[], vb:[], t:0};
     for(var l = 1; l < sizes.length; l++){
       var nin = sizes[l - 1], nout = sizes[l], lim = Math.sqrt(6 / (nin + nout)), Wl = new Float64Array(nin * nout);
       for(var i = 0; i < Wl.length; i++) Wl[i] = (r() * 2 - 1) * lim;
       var bl = new Float64Array(nout); for(var j = 0; j < nout; j++) bl[j] = act === "relu" ? 0.1 : 0;
       net.W.push(Wl); net.b.push(bl);
       adam.mW.push(new Float64Array(Wl.length)); adam.vW.push(new Float64Array(Wl.length));
       adam.mb.push(new Float64Array(nout)); adam.vb.push(new Float64Array(nout));
     }
     ep = 0; hist = [];
   }
   function f(z){ return act === "relu" ? (z > 0 ? z : 0) : act === "tanh" ? Math.tanh(z) : z; }
   function df(a, z){ return act === "relu" ? (z > 0 ? 1 : 0) : act === "tanh" ? 1 - a * a : 1; }
   function forward(x, y){
     var A = [[x, y]], Z = [null];
     for(var l = 0; l < net.W.length; l++){
       var nin = net.sizes[l], nout = net.sizes[l + 1], prev = A[l], z = new Array(nout), a = new Array(nout), last = l === net.W.length - 1;
       for(var j = 0; j < nout; j++){ var s = net.b[l][j]; for(var i = 0; i < nin; i++) s += net.W[l][j * nin + i] * prev[i]; z[j] = s; a[j] = last ? sigm(s) : f(s); }
       A.push(a); Z.push(z);
     }
     return {A:A, Z:Z};
   }
   function lossOf(set){
     var L = 0, ok = 0;
     set.forEach(function(p){ var o = forward(p[0], p[1]).A, y = o[o.length - 1][0]; y = Math.min(1 - 1e-7, Math.max(1e-7, y));
       L += -(p[2] * Math.log(y) + (1 - p[2]) * Math.log(1 - y)); if((y > 0.5 ? 1 : 0) === p[2]) ok++; });
     return {L:L / set.length, acc:ok / set.length};
   }
   function epoch(){
     var gW = net.W.map(function(w){ return new Float64Array(w.length); }), gb = net.b.map(function(b){ return new Float64Array(b.length); });
     var nl = net.W.length;
     data.tr.forEach(function(p){
       var o = forward(p[0], p[1]), A = o.A, Z = o.Z, delta = [A[nl][0] - p[2]];
       for(var l = nl - 1; l >= 0; l--){
         var nin = net.sizes[l], nout = net.sizes[l + 1], nd = new Array(nin).fill(0);
         for(var j = 0; j < nout; j++){ gb[l][j] += delta[j];
           for(var i = 0; i < nin; i++){ gW[l][j * nin + i] += delta[j] * A[l][i]; nd[i] += delta[j] * net.W[l][j * nin + i]; } }
         if(l > 0) delta = nd.map(function(v, i){ return v * df(A[l][i], Z[l][i]); });
       }
     });
     adam.t++; var b1 = 0.9, b2 = 0.999, n = data.tr.length, c1 = 1 - Math.pow(b1, adam.t), c2 = 1 - Math.pow(b2, adam.t);
     function upd(P, G, M, V){ for(var i = 0; i < P.length; i++){ var g = G[i] / n; M[i] = b1 * M[i] + (1 - b1) * g; V[i] = b2 * V[i] + (1 - b2) * g * g; P[i] -= lr * (M[i] / c1) / (Math.sqrt(V[i] / c2) + 1e-8); } }
     for(var l = 0; l < nl; l++){ upd(net.W[l], gW[l], adam.mW[l], adam.vW[l]); upd(net.b[l], gb[l], adam.mb[l], adam.vb[l]); }
     ep++;
   }
   function record(){ var a = lossOf(data.tr), b = lossOf(data.te); hist.push({ep:ep, tr:a.L, te:b.L, acc:b.acc, accTr:a.acc}); }
   /* lienzos auxiliares para los mapas de calor */
   var G = 56, off = document.createElement("canvas"); off.width = G; off.height = G; var octx = off.getContext("2d");
   var TG = 18, toff = document.createElement("canvas"); toff.width = TG; toff.height = TG; var tctx = toff.getContext("2d");
   var cA = rgbOf(C.c[0]), cB = rgbOf(C.c[1]), cCard = rgbOf(C.card);
   function shadePix(img, k, v, strength){ /* v en [-1,1]: + azul, − naranja */
     var col = v >= 0 ? cA : cB, t = Math.min(1, Math.abs(v)) * strength;
     img.data[k] = cCard[0] + (col[0] - cCard[0]) * t; img.data[k + 1] = cCard[1] + (col[1] - cCard[1]) * t;
     img.data[k + 2] = cCard[2] + (col[2] - cCard[2]) * t; img.data[k + 3] = 255;
   }
   function neuronMaps(){
     /* evalúa la red en una rejilla pequeña y devuelve, por capa y neurona, sus activaciones */
     var maps = net.sizes.map(function(n){ var a = []; for(var j = 0; j < n; j++) a.push(new Float64Array(TG * TG)); return a; });
     for(var gy = 0; gy < TG; gy++) for(var gx = 0; gx < TG; gx++){
       var x = -R0 + (gx + 0.5) / TG * 2 * R0, y = R0 - (gy + 0.5) / TG * 2 * R0, A = forward(x, y).A;
       for(var l = 0; l < A.length; l++) for(var j = 0; j < A[l].length; j++) maps[l][j][gy * TG + gx] = A[l][j];
     }
     return maps;
   }
   function drawThumb(arr, x, y, s, isOut){
     var mx = 1e-9; if(!isOut) for(var i = 0; i < arr.length; i++) mx = Math.max(mx, Math.abs(arr[i]));
     var img = tctx.createImageData(TG, TG);
     for(var k = 0; k < arr.length; k++) shadePix(img, k * 4, isOut ? (arr[k] - 0.5) * 2 : arr[k] / mx, 0.9);
     tctx.putImageData(img, 0, 0);
     ctx.save(); rr(ctx, x, y, s, s, 4); ctx.clip(); ctx.imageSmoothingEnabled = true; ctx.drawImage(toff, x, y, s, s); ctx.restore();
     rr(ctx, x + 0.5, y + 0.5, s - 1, s - 1, 4); ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.stroke();
   }
   function draw(){
     K.clear();
     /* ── frontera ── */
     tx(ctx, "Frontera de decisión", PB[0], 30, {s:13, w:700, c:C.ink});
     tx(ctx, "fondo = lo que predice la red", PB[0], 46, {s:11, c:C.muted});
     var img = octx.createImageData(G, G);
     for(var gy = 0; gy < G; gy++) for(var gx = 0; gx < G; gx++){
       var x = -R0 + (gx + 0.5) / G * 2 * R0, y = R0 - (gy + 0.5) / G * 2 * R0, A = forward(x, y).A, p = A[A.length - 1][0];
       shadePix(img, (gy * G + gx) * 4, (p - 0.5) * 2, 0.42);
     }
     octx.putImageData(img, 0, 0);
     ctx.save(); rr(ctx, PB[0], PB[1], PB[2], PB[3], 10); ctx.clip(); ctx.imageSmoothingEnabled = true; ctx.drawImage(off, PB[0], PB[1], PB[2], PB[3]);
     /* contorno p = 0,5 aproximado con la rejilla */
     ctx.restore();
     rr(ctx, PB[0] + .5, PB[1] + .5, PB[2], PB[3], 10); ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.stroke();
     var sx = function(x){ return PB[0] + (x + R0) / (2 * R0) * PB[2]; }, sy = function(y){ return PB[1] + (R0 - y) / (2 * R0) * PB[3]; };
     data.tr.forEach(function(p){ dot(ctx, sx(p[0]), sy(p[1]), 3.6, p[2] ? C.c[0] : C.c[1], C.card); });
     data.te.forEach(function(p){ ctx.beginPath(); ctx.arc(sx(p[0]), sy(p[1]), 3.6, 0, 6.283); ctx.strokeStyle = p[2] ? C.c[0] : C.c[1]; ctx.lineWidth = 1.8; ctx.stroke(); });
     ctx.font = "11px " + LABFONT; var ly = PB[1] + PB[3] + 22;
     dot(ctx, PB[0] + 5, ly - 4, 4, C.c[0]); tx(ctx, "clase A", PB[0] + 14, ly, {s:11, c:C.text});
     dot(ctx, PB[0] + 72, ly - 4, 4, C.c[1]); tx(ctx, "clase B", PB[0] + 81, ly, {s:11, c:C.text});
     ctx.beginPath(); ctx.arc(PB[0] + 144, ly - 4, 4, 0, 6.283); ctx.strokeStyle = C.muted; ctx.lineWidth = 1.6; ctx.stroke();
     tx(ctx, "hueco = test (no entrena)", PB[0] + 153, ly, {s:11, c:C.text});
     /* ── red ── */
     var NX0 = 384, NX1 = 742, NY0 = 52, NY1 = 262;
     tx(ctx, "La red", NX0, 30, {s:13, w:700, c:C.ink});
     tx(ctx, "cada cuadradito = activación de la neurona en todo el plano", NX0, 46, {s:11, c:C.muted});
     var maps = neuronMaps(), cols = net.sizes.length, pos = [];
     net.sizes.forEach(function(n, l){
       var cx = NX0 + 16 + l * (NX1 - NX0 - 52) / (cols - 1), s = l === cols - 1 ? 40 : n > 6 ? 21 : n > 4 ? 25 : 30;
       var sp = Math.min(46, (NY1 - NY0 - 8) / n), y0 = (NY0 + NY1) / 2 - sp * (n - 1) / 2, col = [];
       for(var j = 0; j < n; j++) col.push({x:cx, y:y0 + j * sp, s:s});
       pos.push(col);
     });
     /* conexiones */
     for(var l = 0; l < net.W.length; l++){
       var nin = net.sizes[l], nout = net.sizes[l + 1];
       for(var j = 0; j < nout; j++) for(var i = 0; i < nin; i++){
         var w = net.W[l][j * nin + i], a = pos[l][i], b = pos[l + 1][j];
         ctx.strokeStyle = hexA(w >= 0 ? C.pos : C.neg, 0.25 + Math.min(0.6, Math.abs(w) * 0.25));
         ctx.lineWidth = 0.6 + Math.min(5, Math.abs(w) * 1.5); ctx.setLineDash(w >= 0 ? [] : [4, 3]);
         ctx.beginPath(); ctx.moveTo(a.x + a.s / 2, a.y); ctx.bezierCurveTo(a.x + a.s / 2 + 30, a.y, b.x - b.s / 2 - 30, b.y, b.x - b.s / 2, b.y); ctx.stroke();
       }
     }
     ctx.setLineDash([]);
     pos.forEach(function(col, l){ col.forEach(function(nd, j){ drawThumb(maps[l][j], nd.x - nd.s / 2, nd.y - nd.s / 2, nd.s, l === cols - 1); }); });
     tx(ctx, "x₁", pos[0][0].x - pos[0][0].s / 2 - 6, pos[0][0].y + 4, {s:12, w:600, c:C.muted, a:"right"});
     tx(ctx, "x₂", pos[0][1].x - pos[0][1].s / 2 - 6, pos[0][1].y + 4, {s:12, w:600, c:C.muted, a:"right"});
     var on = pos[cols - 1][0]; tx(ctx, "salida", on.x, on.y + on.s / 2 + 15, {s:11, w:600, c:C.muted, a:"center"});
     for(var lh = 1; lh < cols - 1; lh++) tx(ctx, "oculta " + lh, pos[lh][0].x, NY1 + 6, {s:11, c:C.muted, a:"center"});
     /* leyenda de pesos */
     var lgy = 290; ctx.lineWidth = 3;
     ctx.strokeStyle = C.pos; ctx.beginPath(); ctx.moveTo(NX0, lgy - 4); ctx.lineTo(NX0 + 24, lgy - 4); ctx.stroke();
     tx(ctx, "▲ peso positivo", NX0 + 30, lgy, {s:11, c:C.text});
     ctx.strokeStyle = C.neg; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(NX0 + 128, lgy - 4); ctx.lineTo(NX0 + 152, lgy - 4); ctx.stroke(); ctx.setLineDash([]);
     tx(ctx, "▼ peso negativo", NX0 + 158, lgy, {s:11, c:C.text});
     tx(ctx, "grosor = |peso|", NX0 + 262, lgy, {s:11, c:C.muted});
     /* ── pérdida ── */
     var LB = [426, 324, 314, 68], mx = 0.8;
     hist.forEach(function(h){ mx = Math.max(mx, Math.min(1.5, h.tr), Math.min(1.5, h.te)); });
     tx(ctx, "Pérdida (entropía cruzada)", NX0, 306, {s:12, w:700, c:C.ink});
     var xm = Math.max(500, ep);
     var Ax = axes(ctx, LB, [0, xm], [0, mx], C, {xl:"épocas (pasadas por los datos)", yt:[0, +mx.toFixed(1)], xt:[0, Math.round(xm)]});
     [["tr", C.c[0], [], "train"], ["te", C.c[1], [5, 3], "test"]].forEach(function(s){
       if(!hist.length) return;
       ctx.strokeStyle = s[1]; ctx.lineWidth = 2; ctx.setLineDash(s[2]); ctx.beginPath();
       hist.forEach(function(h, i){ var X = Ax.sx(h.ep), Y = Ax.sy(Math.min(mx, h[s[0]])); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); ctx.setLineDash([]);
     });
     tx(ctx, "— train", LB[0] + LB[2] - 96, LB[1] + 14, {s:11, w:600, c:C.c[0]});
     tx(ctx, "- - test", LB[0] + LB[2] - 46, LB[1] + 14, {s:11, w:600, c:C.c[1]});
     /* lectura */
     var h = hist[hist.length - 1] || {tr:NaN, te:NaN, acc:0, accTr:0}, msg;
     if(ep < 60) msg = "Pulsa y mira cómo la frontera se va doblando época a época.";
     else if(act === "lin" && h.acc < 0.85) msg = "<b>Activación lineal:</b> apilar capas lineales sigue siendo una función lineal, así que la red entera es una <b>regresión logística</b> y su frontera es una recta. Por eso se atasca: cambia a ReLU o tanh.";
     else if(h.acc >= 0.95 && h.te > h.tr * 1.8 && h.te > 0.15) msg = "Acierta en test, pero la pérdida de test es bastante peor que la de train: empieza a memorizar los puntos de entrenamiento.";
     else if(h.acc >= 0.95) msg = "<b>Separado.</b> Las neuronas ocultas trazan trozos de frontera y la salida los combina en una forma curva que encierra cada clase.";
     else if(h.acc >= 0.8) msg = "Va bien, pero la frontera aún no sigue la forma. Dale más épocas o más neuronas.";
     else msg = "La red no tiene forma suficiente para estos datos (o el ritmo de aprendizaje es poco adecuado). Prueba más neuronas, 2 capas u otra activación.";
     read.innerHTML = '<span>Época <b>' + fmtN(ep) + '</b></span><span>Pérdida train <b>' + (isNaN(h.tr) ? "—" : fmt(h.tr, 3)) + '</b></span><span>Pérdida test <b>' + (isNaN(h.te) ? "—" : fmt(h.te, 3)) + '</b></span>' +
       '<span>Accuracy test <b>' + pct(h.acc, 0) + '</b></span><span>Parámetros <b>' + net.W.reduce(function(s, w, i){ return s + w.length + net.b[i].length; }, 0) + '</b></span><span class="ldiag">' + msg + '</span>';
   }
   function reset(){ genData(); initNet(); record(); draw(); }
   var pt = playToggle(ctl, "Entrenar", function(on){ if(on) start(); else stop(); });
   function start(){ stop(); if(ep >= maxEp){ initNet(); record(); } stopPlay = loop(function(){
       for(var i = 0; i < 3; i++) epoch(); if(ep % 15 === 0) record(); draw();
       if(ep >= maxEp){ stop(); pt.set(false); } }); }
   function stop(){ if(stopPlay){ stopPlay(); stopPlay = null; } }
   ctlBtn(ctl, "↺ Reiniciar pesos", function(){ initNet(); record(); draw(); });
   function rebuild(){ var was = pt.get(); stop(); initNet(); record(); draw(); if(was) start(); }
   ctlSeg(ctl, "Datos", [["circle", "Círculo"], ["xor", "XOR"], ["spiral", "Espiral"]], ds, function(v){ ds = v; genData(); rebuild(); });
   ctlSeg(ctl, "Activación", [["relu", "ReLU"], ["tanh", "tanh"], ["lin", "Lineal"]], act, function(v){ act = v; rebuild(); });
   ctlSeg(ctl, "Capas ocultas", [["1", "1"], ["2", "2"]], "1", function(v){ nL = +v; rebuild(); });
   ctlSlider(ctl, "Neuronas por capa", 2, 8, 1, nH, function(v){ return v + " neuronas"; }, function(v){ nH = v; rebuild(); });
   var LRS = [0.003, 0.01, 0.03, 0.1, 0.3];
   ctlSlider(ctl, "Ritmo de aprendizaje (learning rate)", 0, 4, 1, 2, function(v){ return fmt(LRS[v], 3).replace(/0+$/, ""); }, function(v){ lr = LRS[v]; });
   reset(); pt.set(true); start();
   return function(){ stop(); };
 }});

/* ══ 2. CNN — CONVOLUCIÓN ANIMADA ═══════════════════════════════ */
VIZ.push({id:"v-cnn", model:"cnn", g:"model", ic:"", dim:"2D",
 t:"Una convolución, celda a celda",
 q:"¿Qué hace exactamente un filtro de una red convolucional sobre una imagen?",
 intro:"A la izquierda, una imagen de 14×14 píxeles (0 = vacío, 1 = trazo; los grises valen 0,5). Un <b>filtro</b> de 3×3 números se desliza por ella: en cada posición multiplica sus 9 números por los 9 píxeles de debajo y <b>suma</b>. Ese número rellena una celda del <b>mapa de características</b> (12×12). Después el <b>max-pooling</b> resume cada bloque 2×2 en su máximo (6×6). Todo se calcula de verdad. Pulsa o arrastra sobre la imagen.",
 notice:["Con el filtro de <b>borde vertical</b> el mapa solo se «enciende» en el <b>lado izquierdo</b> de cada trazo, donde se pasa de vacío a tinta al avanzar hacia la derecha; en mitad del trazo (todo tinta) la respuesta es 0. Desmarca la ReLU y verás el lado derecho en negativo.",
   "El <b>borde horizontal</b> hace lo contrario: resalta el palo de arriba del 7. Cada filtro es un «detector» distinto; una CNN aprende cientos de ellos solos.",
   "El <b>max-pooling</b> reduce el mapa a la cuarta parte conservando «¿hay borde por aquí?»: por eso a la red le da igual que el 7 se mueva un píxel."],
 models:["cnn","mlp","transformer"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 345, K = makeCanvas(stage, W, H, "Convolución de una imagen 14 por 14 con un filtro 3 por 3, mapa de características y max-pooling"), ctx = K.ctx;
   var SHAPES = {
     "7":["..............","..............","..##########..","..##########..","..........##+.",".........+##..","........+##...",".......+##....","......+##.....","......##+.....",".....+##......",".....##+......","..............",".............."],
     "sq":["..............","..............","..##########..","..##########..","..##......##..","..##......##..","..##......##..","..##......##..","..##......##..","..##......##..","..##########..","..##########..","..............",".............."],
     "x":["..............",".#+........+#.",".+#+......+#+.","..+#+....+#+..","...+#+..+#+...","....+#++#+....",".....+##+.....",".....+##+.....","....+#++#+....","...+#+..+#+...","..+#+....+#+..",".+#+......+#+.",".#+........+#.",".............."]};
   var FIL = {
     v:{n:"borde vertical", k:[[-1,0,1],[-1,0,1],[-1,0,1]]},
     h:{n:"borde horizontal", k:[[-1,-1,-1],[0,0,0],[1,1,1]]},
     b:{n:"desenfoque", k:[[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]]},
     s:{n:"realzar", k:[[0,-1,0],[-1,5,-1],[0,-1,0]]}};
   var shape = "7", fk = "v", relu = true, img, fm, pool, k = 0, playing = false, stopL = null, acc = 0;
   function compute(){
     img = SHAPES[shape].map(function(r){ return r.split("").map(function(ch){ return ch === "#" ? 1 : ch === "+" ? 0.5 : 0; }); });
     var F = FIL[fk].k; fm = [];
     for(var i = 0; i < 12; i++){ fm.push([]); for(var j = 0; j < 12; j++){ var s = 0; for(var a = 0; a < 3; a++) for(var b = 0; b < 3; b++) s += F[a][b] * img[i + a][j + b]; fm[i].push(relu ? Math.max(0, s) : s); } }
     pool = []; for(var p = 0; p < 6; p++){ pool.push([]); for(var q = 0; q < 6; q++) pool[p].push(Math.max(fm[2 * p][2 * q], fm[2 * p][2 * q + 1], fm[2 * p + 1][2 * q], fm[2 * p + 1][2 * q + 1])); }
   }
   var IX = 24, IY = 60, IC = 18, FX = 300, FY = 60, FC = 32, MX = 426, MY = 60, MC = 14, PX = 618, PY = 60, PC = 20;
   function valCol(v, mx){ if(Math.abs(v) < 1e-9) return C.card; return mixc(C.card, v > 0 ? C.pos : C.neg, 0.15 + 0.85 * Math.min(1, Math.abs(v) / mx)); }
   function fnum(v){ var s = Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : Math.abs(v * 10 - Math.round(v * 10)) < 1e-9 ? fmt(v, 1) : fmt(v, 2); return s.replace(".", ",").replace("-", "−"); }
   function draw(){
     K.clear();
     var i0 = Math.floor(k / 12), j0 = k % 12, F = FIL[fk].k, mx = 1e-9;
     fm.forEach(function(r){ r.forEach(function(v){ mx = Math.max(mx, Math.abs(v)); }); });
     tx(ctx, "Imagen 14×14", IX, 30, {s:13, w:700, c:C.ink}); tx(ctx, "más tinta = valor más alto", IX, 46, {s:11, c:C.muted});
     tx(ctx, "Filtro 3×3", FX, 30, {s:13, w:700, c:C.ink}); tx(ctx, FIL[fk].n, FX, 46, {s:11, c:C.muted});
     tx(ctx, "Mapa de características", MX, 30, {s:13, w:700, c:C.ink}); tx(ctx, "12×12 · " + (relu ? "con ReLU" : "sin ReLU"), MX, 46, {s:11, c:C.muted});
     tx(ctx, "Max-pooling 2×2", PX, 30, {s:13, w:700, c:C.ink}); tx(ctx, "6×6 · máx. de cada 2×2", PX, 46, {s:11, c:C.muted});
     /* imagen */
     for(var r = 0; r < 14; r++) for(var c = 0; c < 14; c++){ ctx.fillStyle = mixc(C.bg, C.ink, img[r][c] * 0.92); ctx.fillRect(IX + c * IC, IY + r * IC, IC - 1, IC - 1); }
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 3; rr(ctx, IX + j0 * IC - 2, IY + i0 * IC - 2, 3 * IC + 3, 3 * IC + 3, 4); ctx.stroke();
     ctx.fillStyle = hexA(C.c[0], 0.16); ctx.fillRect(IX + j0 * IC, IY + i0 * IC, 3 * IC - 1, 3 * IC - 1);
     /* filtro */
     for(var a = 0; a < 3; a++) for(var b = 0; b < 3; b++){
       var v = F[a][b], x = FX + b * FC, y = FY + a * FC;
       ctx.fillStyle = v > 0 ? hexA(C.pos, 0.18) : v < 0 ? hexA(C.neg, 0.18) : C.card; ctx.fillRect(x, y, FC - 2, FC - 2);
       ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(x + .5, y + .5, FC - 3, FC - 3);
       tx(ctx, fk === "b" ? "1/9" : (v > 0 ? "+" : "") + fnum(v), x + FC / 2 - 1, y + FC / 2 + 4, {s:12, w:700, c:C.ink, a:"center"});
     }
     /* productos de la posición actual */
     tx(ctx, "filtro × ventana", FX, FY + 3 * FC + 22, {s:11, c:C.muted});
     var sum = 0, PY2 = FY + 3 * FC + 32;
     for(a = 0; a < 3; a++) for(b = 0; b < 3; b++){
       var pv = F[a][b] * img[i0 + a][j0 + b]; sum += pv; x = FX + b * FC; y = PY2 + a * FC;
       ctx.fillStyle = Math.abs(pv) < 1e-9 ? C.card : hexA(pv > 0 ? C.pos : C.neg, 0.22); ctx.fillRect(x, y, FC - 2, FC - 2);
       ctx.strokeStyle = C.line; ctx.strokeRect(x + .5, y + .5, FC - 3, FC - 3);
       tx(ctx, fnum(pv), x + FC / 2 - 1, y + FC / 2 + 4, {s:11, w:600, c:Math.abs(pv) < 1e-9 ? C.muted : C.ink, a:"center"});
     }
     var outV = relu ? Math.max(0, sum) : sum;
     tx(ctx, "Σ = " + fnum(sum) + (relu && sum < 0 ? "  → ReLU → 0" : ""), FX, PY2 + 3 * FC + 18, {s:13, w:700, c:C.ink});
     /* mapa */
     for(r = 0; r < 12; r++) for(c = 0; c < 12; c++){
       var done = r * 12 + c <= k;
       ctx.fillStyle = done ? valCol(fm[r][c], mx) : C.bg; ctx.fillRect(MX + c * MC, MY + r * MC, MC - 1, MC - 1);
       if(!done){ ctx.strokeStyle = hexA(C.line, 0.9); ctx.strokeRect(MX + c * MC + .5, MY + r * MC + .5, MC - 2, MC - 2); }
     }
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 2.5; ctx.strokeRect(MX + j0 * MC - 1, MY + i0 * MC - 1, MC + 1, MC + 1);
     var pi = Math.floor(i0 / 2), pj = Math.floor(j0 / 2);
     ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; ctx.setLineDash([3, 2]); ctx.strokeRect(MX + pj * 2 * MC - 2, MY + pi * 2 * MC - 2, 2 * MC + 3, 2 * MC + 3); ctx.setLineDash([]);
     /* pooling */
     for(var p = 0; p < 6; p++) for(var q = 0; q < 6; q++){
       var dn = (2 * p + 1) * 12 + 2 * q + 1 <= k;
       ctx.fillStyle = dn ? valCol(pool[p][q], mx) : C.bg; ctx.fillRect(PX + q * PC, PY + p * PC, PC - 1, PC - 1);
       if(!dn){ ctx.strokeStyle = hexA(C.line, 0.9); ctx.lineWidth = 1; ctx.strokeRect(PX + q * PC + .5, PY + p * PC + .5, PC - 2, PC - 2); }
     }
     ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; ctx.setLineDash([3, 2]); ctx.strokeRect(PX + pj * PC - 1.5, PY + pi * PC - 1.5, PC + 2, PC + 2); ctx.setLineDash([]);
     /* leyenda */
     var ly = 252;
     ctx.fillStyle = mixc(C.card, C.pos, 0.8); ctx.fillRect(MX, ly - 10, 12, 12); tx(ctx, "▲ respuesta positiva", MX + 18, ly, {s:11, c:C.text});
     ctx.fillStyle = mixc(C.card, C.neg, 0.8); ctx.fillRect(MX + 150, ly - 10, 12, 12); tx(ctx, "▼ negativa", MX + 168, ly, {s:11, c:C.text});
     tx(ctx, "más intenso = respuesta más fuerte", MX, ly + 18, {s:11, c:C.muted}); tx(ctx, "celdas vacías = aún sin calcular", MX, ly + 34, {s:11, c:C.muted});
     tx(ctx, "- - bloque 2×2 que resume el pooling", MX, ly + 50, {s:11, c:C.muted});
     tx(ctx, "↔ Arrastra sobre la imagen", IX, IY + 14 * IC + 20, {s:11, c:C.muted});
     /* lectura */
     var terms = [];
     for(a = 0; a < 3; a++) for(b = 0; b < 3; b++) if(Math.abs(F[a][b] * img[i0 + a][j0 + b]) > 1e-9) terms.push((fk === "b" ? "1/9" : fnum(F[a][b])) + "×" + fnum(img[i0 + a][j0 + b]));
     var nOn = 0; fm.forEach(function(rw){ rw.forEach(function(v){ if(v > mx * 0.5) nOn++; }); });
     read.innerHTML = '<span>Posición <b>fila ' + (i0 + 1) + ', columna ' + (j0 + 1) + '</b></span><span>Suma de productos <b>' + fnum(sum) + '</b></span><span>Celda del mapa <b>' + fnum(outV) + '</b></span><span>Celdas «encendidas» (&gt; 50% del máximo) <b>' + nOn + ' de 144</b></span>' +
       '<span class="leq">Σ = ' + (terms.length ? terms.join(" + ") : "0 (todos los productos son 0)") + ' = ' + fnum(sum) + '</span>' +
       '<span class="ldiag">' + (Math.abs(sum) < 1e-9 ? "En esta posición el filtro no ve nada que le interese: la ventana es uniforme (o vacía) y los números positivos y negativos se cancelan." :
         fk === "b" ? "El desenfoque solo promedia: el mapa es una versión borrosa de la imagen (un poco más pequeña, 12×12, porque el filtro no puede salirse del borde)." :
         sum > 0 ? "Respuesta <b>positiva</b>: debajo de la ventana hay justo el patrón que busca el filtro (" + FIL[fk].n + ")." : "Respuesta <b>negativa</b>: el patrón está, pero al revés (claro→oscuro en lugar de oscuro→claro)." + (relu ? " La ReLU la recorta a 0." : "")) + '</span>';
   }
   var pt = playToggle(ctl, "Deslizar", function(on){ playing = on; if(on){ if(k >= 143) k = 0; startL(); } else stopIt(); });
   function startL(){ stopIt(); var last = 0; stopL = loop(function(t){ if(t - last < 110) return; last = t; if(k >= 143){ stopIt(); pt.set(false); return; } k++; sl.set(k); draw(); }); }
   function stopIt(){ if(stopL){ stopL(); stopL = null; } }
   ctlBtn(ctl, "Completar", function(){ stopIt(); pt.set(false); k = 143; sl.set(k); draw(); });
   var sl = ctlSlider(ctl, "Posición de la ventana", 0, 143, 1, 0, function(v){ return "fila " + (Math.floor(v / 12) + 1) + " · col. " + (v % 12 + 1); }, function(v){ stopIt(); pt.set(false); k = v; draw(); });
   ctlSeg(ctl, "Imagen", [["7", "Un 7"], ["sq", "Cuadrado"], ["x", "Una X"]], shape, function(v){ shape = v; compute(); draw(); });
   ctlSeg(ctl, "Filtro", [["v", "Borde vertical"], ["h", "Borde horizontal"], ["b", "Desenfoque"], ["s", "Realzar"]], fk, function(v){ fk = v; compute(); draw(); });
   ctlCheck(ctl, "Aplicar ReLU (negativos → 0)", relu, function(v){ relu = v; compute(); draw(); });
   var drag = false;
   function fromPtr(e){ var p = K.pos(e), c = Math.floor((p[0] - IX) / IC) - 1, r = Math.floor((p[1] - IY) / IC) - 1;
     if(p[0] < IX - 10 || p[0] > IX + 14 * IC + 10 || p[1] < IY - 10 || p[1] > IY + 14 * IC + 10) return false;
     k = Math.max(0, Math.min(11, r)) * 12 + Math.max(0, Math.min(11, c)); sl.set(k); stopIt(); pt.set(false); draw(); return true; }
   function pd(e){ if(fromPtr(e)){ drag = true; K.cv.setPointerCapture(e.pointerId); } }
   function pm(e){ if(drag) fromPtr(e); }
   function pu(){ drag = false; }
   K.cv.addEventListener("pointerdown", pd); K.cv.addEventListener("pointermove", pm); K.cv.addEventListener("pointerup", pu);
   K.cv.style.touchAction = window.matchMedia("(max-width:640px)").matches ? "pan-x pan-y" : "pan-y";
   compute(); k = 40; sl.set(k); draw(); pt.set(true); startL();
   return function(){ stopIt(); };
 }});

/* ══ 3. RNN frente a LSTM — MEMORIA ═════════════════════════════ */
VIZ.push({id:"v-rnn", model:"rnn", g:"model", ic:"", dim:"2D",
 t:"La memoria de una RNN frente a una LSTM",
 q:"¿Por qué una red recurrente simple «olvida» lo que pasó hace muchos pasos y una LSTM no?",
 intro:"Doce semanas de ventas entran en la red de una en una. La semana 1 tuvo una <b>promoción</b>: ¿cuánto de esa señal llega a la semana 12? Calculamos de verdad la sensibilidad |∂h<sub>t</sub>/∂h<sub>1</sub>| (cuánto cambiaría el estado de la semana t si cambiara el de la semana 1) para una <b>RNN</b> de una neurona (h<sub>t</sub> = tanh(w·h<sub>t−1</sub> + u·x<sub>t</sub>)) y para la celda de una <b>LSTM</b>, cuya puerta de olvido f decide qué fracción se conserva en cada paso.",
 notice:["En la RNN, cada paso multiplica la señal por w·(1 − h²), un número menor que 1: tras 12 pasos queda una fracción minúscula. Es el <b>gradiente desvanecido</b>: la red no puede aprender relaciones lejanas.",
   "En la LSTM la señal solo se multiplica por la puerta de olvido f. Con f = 0,95 tras 11 multiplicaciones queda más de la mitad (0,95¹¹ ≈ 57%): la memoria aguanta.",
   "El gráfico está en <b>escala logarítmica</b>: una recta descendente es un decaimiento exponencial. Mueve w: si es pequeño la señal muere enseguida; si es grande la neurona se satura (h ≈ ±1), la derivada de tanh se hunde y la señal muere igual. Ningún w la conserva 12 pasos: por eso se inventó la LSTM."],
 models:["rnn","transformer","arima"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 396, K = makeCanvas(stage, W, H, "Secuencia de 12 semanas con la memoria que queda de la primera y gráfico logarítmico de la sensibilidad"), ctx = K.ctx;
   var mode = "rnn", w = 0.6, fg = 0.95, u = 0.9, cur = 1, stopL = null;
   var sales = [18.5, 10.2, 9.1, 11.4, 10.8, 8.9, 9.7, 11.9, 10.4, 9.3, 10.9, 11.6];
   function series(){
     var h = 0, g = [], hs = [], prod = 1;
     sales.forEach(function(s, t){ var x = (s - 10.5) / 3; h = Math.tanh(w * h + u * x); hs.push(h);
       if(t > 0) prod *= w * (1 - h * h); g.push(Math.abs(prod)); });
     var l = sales.map(function(_, t){ return Math.pow(fg, t); });
     return {rnn:g, lstm:l, h:hs};
   }
   var X0 = 36, CW = 50, GP = 8;
   function cx(t){ return X0 + t * (CW + GP); }
   function draw(){
     K.clear(); var S = series(), g = S[mode], col = mode === "rnn" ? C.c[1] : C.c[0];
     tx(ctx, "Ventas semanales (miles de €) — entran una por paso", X0, 24, {s:13, w:700, c:C.ink});
     for(var t = 0; t < 12; t++){
       var x = cx(t), y = 36, on = t < cur, a = on ? 1 : 0.35;
       ctx.globalAlpha = a;
       rr(ctx, x, y, CW, 66, 9); ctx.fillStyle = t === cur - 1 ? C.soft : C.card; ctx.fill(); ctx.strokeStyle = t === cur - 1 ? C.c[0] : C.line; ctx.lineWidth = t === cur - 1 ? 2 : 1; ctx.stroke();
       tx(ctx, "S" + (t + 1) + (t === 0 ? " ★" : ""), x + 7, y + 15, {s:11, w:600, c:t === 0 ? C.c[4] : C.muted});
       var bh = sales[t] / 20 * 34; ctx.fillStyle = t === 0 ? C.c[4] : hexA(C.muted, 0.55); ctx.fillRect(x + 7, y + 60 - bh, 8, bh);
       tx(ctx, fmt(sales[t], 1), x + CW - 6, y + 58, {s:11, w:600, c:C.ink, a:"right"});
       if(t < 11){ var lw = Math.max(0.8, 6 * Math.min(1, g[t + 1] || 0)); ctx.strokeStyle = on && t + 1 < cur ? col : C.line; ctx.lineWidth = lw;
         ctx.beginPath(); ctx.moveTo(x + CW + 1, y + 33); ctx.lineTo(x + CW + GP - 2, y + 33); ctx.stroke(); }
       ctx.globalAlpha = 1;
     }
     tx(ctx, "Cuánto queda en cada paso de la señal de la semana 1 (★ promo)", X0, 124, {s:12, w:700, c:C.ink});
     for(t = 0; t < 12; t++){
       x = cx(t) + 14; var top = 132, hh = 64;
       rr(ctx, x, top, 22, hh, 5); ctx.fillStyle = hexA(C.line, 0.7); ctx.fill();
       if(t < cur){ var v = Math.min(1, g[t]), fh = Math.max(v > 0 ? 1.5 : 0, v * hh); rr(ctx, x, top + hh - fh, 22, fh, Math.min(5, fh / 2)); ctx.fillStyle = col; ctx.fill();
         var lab = g[t] >= 0.995 ? (g[t] > 1.005 ? "×" + fmt(g[t], 1) : "100%") : g[t] >= 0.1 ? pct(g[t], 0) : g[t] >= 0.001 ? pct(g[t], 1) : "<0,1%";
         tx(ctx, lab, x + 11, top + hh + 15, {s:11, w:600, c:C.ink, a:"center"}); }
     }
     /* gráfico logarítmico */
     var B = [86, 244, 628, 112], ymin = -4, ymax = 1;
     var A = axes(ctx, B, [1, 12], [ymin, ymax], C, {xl:"paso t (semana)", xt:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]});
     [[0, "1"], [-1, "0,1"], [-2, "0,01"], [-3, "0,001"], [-4, "0,0001"], [1, "10"]].forEach(function(p){
       var yy = A.sy(p[0]); tx(ctx, p[1], B[0] - 6, yy + 4, {s:11, c:C.muted, a:"right"});
       ctx.strokeStyle = hexA(C.line, 0.8); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(B[0], yy); ctx.lineTo(B[0] + B[2], yy); ctx.stroke(); });
     ctx.save(); ctx.translate(26, B[1] + B[3] / 2); ctx.rotate(-Math.PI / 2); tx(ctx, "|∂hₜ/∂h₁| (log)", 0, 0, {s:11, c:C.muted, a:"center"}); ctx.restore();
     ctx.strokeStyle = C.ink; ctx.setLineDash([4, 3]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(B[0], A.sy(0)); ctx.lineTo(B[0] + B[2], A.sy(0)); ctx.stroke(); ctx.setLineDash([]);
     [["rnn", C.c[1], "RNN simple"], ["lstm", C.c[0], "LSTM"]].forEach(function(s){
       var arr = S[s[0]], sel = s[0] === mode, n = sel ? cur : 12;
       ctx.save(); ctx.beginPath(); ctx.rect(B[0], B[1], B[2], B[3]); ctx.clip();
       ctx.strokeStyle = sel ? s[1] : hexA(s[1], 0.45); ctx.lineWidth = sel ? 2.6 : 1.4; ctx.setLineDash(sel ? [] : [5, 4]); ctx.beginPath();
       for(var i = 0; i < n; i++){ var X = A.sx(i + 1), Y = A.sy(Math.max(ymin - 1, Math.log10(Math.max(1e-12, arr[i])))); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
       ctx.stroke(); ctx.setLineDash([]);
       if(sel) for(i = 0; i < n; i++) dot(ctx, A.sx(i + 1), A.sy(Math.max(ymin - 1, Math.log10(Math.max(1e-12, arr[i])))), 3.5, s[1], C.card);
       ctx.restore();
       var ly = Math.log10(Math.max(1e-12, arr[n - 1])), yy = Math.max(B[1] + 10, Math.min(B[1] + B[3] - 4, A.sy(Math.max(ymin, Math.min(ymax, ly)))));
       if(n === 12) tx(ctx, s[2], B[0] + B[2] + 6, yy + 4, {s:11, w:700, c:sel ? s[1] : hexA(s[1], 0.7)});
     });
     /* lectura */
     var last = g[cur - 1], r12 = S.rnn[11], l12 = S.lstm[11];
     var fac = S.rnn.length > 1 ? Math.pow(S.rnn[11], 1 / 11) : 0;
     var p = function(v){ return v >= 0.995 && v <= 1.005 ? "100%" : v > 1 ? "×" + fmt(v, 1) : v >= 0.01 ? pct(v, v >= 0.1 ? 0 : 1) : v >= 1e-4 ? pct(v, 3) : "menos del 0,01%"; };
     var pe = function(v){ return v < 1e-4 ? "menos del 0,01%" : "el " + p(v); };
     read.innerHTML = '<span>Paso <b>' + cur + ' de 12</b></span><span>Queda ahora (' + (mode === "rnn" ? "RNN" : "LSTM") + ') <b>' + p(last) + '</b></span>' +
       '<span>Tras 12 pasos · RNN <b>' + p(r12) + '</b></span><span>Tras 12 pasos · LSTM <b>' + p(l12) + '</b></span><span>Factor medio por paso RNN <b>' + fmt(fac, 2) + '</b></span>' +
       '<span class="ldiag">' + (mode === "rnn" ? (r12 > 1.5 ? "Con w tan alto el factor por paso supera 1 y la señal <b>crece</b> en cada paso: es el gradiente que explota (el entrenamiento se vuelve inestable)." :
         "Tras 12 pasos queda <b>" + pe(r12) + "</b> de la señal de la promo en la RNN: el factor por paso (≈ " + fmt(fac, 2) + ") se multiplica 11 veces. Lo que pasó hace 3 meses ya no puede influir en lo que aprende.") :
         "Tras 12 pasos queda <b>" + pe(l12) + "</b> de la señal en la LSTM (" + fmt(fg, 2) + "¹¹). La puerta de olvido abierta deja pasar la memoria casi intacta por la «cinta» de la celda.") + '</span>';
   }
   var pt = playToggle(ctl, "Animar", function(on){ if(on){ if(cur >= 12) cur = 1; startL(); } else stopIt(); });
   function startL(){ stopIt(); var last = 0; stopL = loop(function(t){ if(t - last < 520) return; last = t; if(cur >= 12){ stopIt(); pt.set(false); return; } cur++; draw(); }); }
   function stopIt(){ if(stopL){ stopL(); stopL = null; } }
   ctlBtn(ctl, "Paso +1", function(){ stopIt(); pt.set(false); cur = cur >= 12 ? 1 : cur + 1; draw(); });
   ctlBtn(ctl, "↺", function(){ stopIt(); pt.set(false); cur = 1; draw(); });
   ctlSeg(ctl, "Tipo de red", [["rnn", "RNN simple"], ["lstm", "LSTM"]], mode, function(v){ mode = v; draw(); });
   ctlSlider(ctl, "RNN: peso recurrente w (factor por paso)", 0.3, 1.6, 0.05, w, function(v){ return fmt(v, 2); }, function(v){ w = v; draw(); });
   ctlSlider(ctl, "LSTM: puerta de olvido f", 0.5, 1, 0.01, fg, function(v){ return fmt(v, 2) + " (conserva el " + Math.round(v * 100) + "%)"; }, function(v){ fg = v; draw(); });
   draw(); pt.set(true); startL();
   return function(){ stopIt(); };
 }});

/* ══ 4. TRANSFORMER — ATENCIÓN ══════════════════════════════════ */
VIZ.push({id:"v-transformer", model:"transformer", g:"model", ic:"", dim:"2D",
 t:"Atención: a quién mira cada palabra",
 q:"¿Cómo decide un transformer qué significa «banco» según la frase?",
 intro:"Cada palabra lleva una <b>pregunta</b> (q) y una <b>etiqueta</b> (k), dos vectores de 4 números. La atención compara la pregunta de una palabra con la etiqueta de todas las demás (producto escalar), divide por √d y aplica <b>softmax</b> para convertirlo en porcentajes que suman 100%. <b>Pasa el ratón o toca una palabra.</b> Los vectores los hemos diseñado a mano (pesos ilustrativos, en un modelo real se aprenden); el cálculo del softmax es real.",
 notice:["«banco» lleva la <b>misma pregunta</b> en las dos frases, pero en la primera dedica más de la mitad de su atención a «peces» y en la segunda a «préstamo»: el contexto decide el significado.",
   "Cada fila de la matriz suma 100%: la atención es un <b>reparto</b>. Si una palabra recibe más, las demás reciben menos.",
   "Desmarca «dividir por √d»: las puntuaciones son el doble de grandes y el softmax se vuelve más «picudo» (casi todo a una palabra). Por eso se escala: para que el reparto no sea extremo y se pueda aprender."],
 models:["transformer","rnn","topic"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 410, K = makeCanvas(stage, W, H, "Arcos de atención entre palabras y matriz de atención"), ctx = K.ctx;
   var SENT = {
     a:{toks:["El","banco","estaba","lleno","de","peces"], ctx:"acuático",
        q:[[1.6,0,0,0.2],[0.3,2.0,2.0,0.4],[0.6,0,0,1.0],[0.2,1.2,0,0.6],[0.8,0,0,0.3],[0.4,1.4,0,0.6]],
        k:[[0.6,0,0,0],[1.6,0.4,0.4,0.4],[0,0,0,1.4],[0,0.6,0,1.0],[0.5,0,0,0],[0.3,2.4,0,0.3]]},
     b:{toks:["El","banco","me","concedió","el","préstamo"], ctx:"financiero",
        q:[[1.6,0,0,0.2],[0.3,2.0,2.0,0.4],[0.6,0,0.3,0.6],[0.4,0,1.2,1.0],[1.6,0,0,0.2],[0.4,0,1.4,0.6]],
        k:[[0.6,0,0,0],[1.6,0.4,0.4,0.4],[0.2,0,0.3,0.6],[0,0,0.8,1.4],[0.6,0,0,0],[0.3,0,2.4,0.3]]}};
   var sk = "a", sel = 1, hov = -1, scale = true, chips = [], M, Sc;
   function compute(){
     var S = SENT[sk], d = 4; M = []; Sc = [];
     S.q.forEach(function(q){
       var sc = S.k.map(function(k){ var s = 0; for(var j = 0; j < d; j++) s += q[j] * k[j]; return scale ? s / Math.sqrt(d) : s; });
       var mx = Math.max.apply(null, sc), e = sc.map(function(v){ return Math.exp(v - mx); }), t = e.reduce(function(a, b){ return a + b; }, 0);
       Sc.push(sc); M.push(e.map(function(v){ return v / t; }));
     });
   }
   var CY = 236, CH = 34, BASE = 352, BH = 62, HX = 566, HY = 112, HC = 29;
   function layout(){
     var S = SENT[sk]; ctx.font = "600 14px " + LABFONT;
     var ws = S.toks.map(function(t){ return ctx.measureText(t).width + 24; }), tot = ws.reduce(function(a, b){ return a + b; }, 0) + 10 * (ws.length - 1);
     var x = 24 + (436 - tot) / 2; chips = [];
     ws.forEach(function(w){ chips.push({x:x, w:w, c:x + w / 2}); x += w + 10; });
   }
   function draw(){
     K.clear(); var S = SENT[sk], cur = hov >= 0 ? hov : sel, row = M[cur];
     tx(ctx, "Pasa el ratón o toca una palabra", 24, 26, {s:13, w:700, c:C.ink});
     tx(ctx, "grosor del arco = peso de atención de «" + S.toks[cur] + "»", 24, 43, {s:11, c:C.muted});
     /* arcos */
     row.forEach(function(wt, j){
       var a = chips[cur], b = chips[j];
       ctx.strokeStyle = hexA(C.c[0], 0.25 + 0.7 * Math.min(1, wt * 1.6)); ctx.lineWidth = 1 + 16 * wt;
       if(j === cur){ ctx.beginPath(); ctx.ellipse(a.c, CY - 22, 14, 18, 0, Math.PI * 0.15, Math.PI * 2.85); ctx.stroke();
 return; }
       var hgt = Math.min(150, 34 + Math.abs(b.c - a.c) * 0.42), mx = (a.c + b.c) / 2;
       ctx.beginPath(); ctx.moveTo(a.c, CY - 2); ctx.quadraticCurveTo(mx, CY - 2 - 2 * hgt, b.c, CY - 2); ctx.stroke();
       arrowHead(ctx, b.c, CY - 1, Math.atan2(CY - (CY - 2 - 2 * hgt), b.c - mx) , 6 + 6 * wt, hexA(C.c[0], 0.9));
     });
     /* fichas */
     S.toks.forEach(function(t, j){
       var c = chips[j], on = j === cur;
       rr(ctx, c.x, CY, c.w, CH, 17); ctx.fillStyle = on ? C.c[0] : C.card; ctx.fill(); ctx.strokeStyle = on ? C.c[0] : C.line; ctx.lineWidth = 1.2; ctx.stroke();
       tx(ctx, t, c.c, CY + 22, {s:14, w:600, c:on ? C.card : C.ink, a:"center"});
       var bh = row[j] * BH / Math.max.apply(null, row);
       rr(ctx, c.c - 12, BASE - bh, 24, Math.max(2, bh), 4); ctx.fillStyle = hexA(C.c[0], 0.35 + 0.6 * row[j] / Math.max.apply(null, row)); ctx.fill();
       tx(ctx, pct(row[j], 0), c.c, BASE - bh - 5, {s:11, w:600, c:C.ink, a:"center"});
     });
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(24, BASE + 0.5); ctx.lineTo(460, BASE + 0.5); ctx.stroke();
     tx(ctx, "Fila de «" + S.toks[cur] + "» en la matriz (suma 100%)", 24, BASE + 20, {s:11, w:600, c:C.muted});
     tx(ctx, "pesos = softmax(q·kᵀ" + (scale ? " / √d" : "") + "),  d = 4", 24, BASE + 38, {s:11, c:C.muted});
     /* matriz */
     tx(ctx, "Matriz de atención", 492, 26, {s:13, w:700, c:C.ink});
     var mxAll = 0; M.forEach(function(r){ r.forEach(function(v){ mxAll = Math.max(mxAll, v); }); });
     S.toks.forEach(function(t, j){
       ctx.save(); ctx.translate(HX + j * HC + HC / 2 + 3, HY - 7); ctx.rotate(-Math.PI / 4); tx(ctx, t, 0, 0, {s:11, w:j === cur ? 700 : 500, c:j === cur ? C.ink : C.muted}); ctx.restore();
       tx(ctx, t, HX - 7, HY + j * HC + HC / 2 + 4, {s:11, w:j === cur ? 700 : 500, c:j === cur ? C.ink : C.muted, a:"right"});
       for(var i = 0; i < M.length; i++){
         var v = M[j][i], tt = v / mxAll;
         ctx.fillStyle = mixc(C.card, C.c[0], 0.06 + 0.94 * tt); ctx.fillRect(HX + i * HC, HY + j * HC, HC - 2, HC - 2);
         tx(ctx, Math.round(v * 100), HX + i * HC + HC / 2 - 1, HY + j * HC + HC / 2 + 3, {s:11, w:600, c:tt > 0.55 ? C.card : C.ink, a:"center"});
       }
     });
     ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.strokeRect(HX - 1, HY + cur * HC - 1, 6 * HC, HC);
     tx(ctx, "filas: palabra que mira", HX - 74, HY + 6 * HC + 20, {s:11, c:C.muted});
     tx(ctx, "columnas: palabra mirada (%)", HX - 74, HY + 6 * HC + 36, {s:11, c:C.muted});
     /* lectura */
     var srt = row.map(function(v, j){ return [v, j]; }).sort(function(a, b){ return b[0] - a[0]; });
     var top = srt[0][1] === cur ? srt[1] : srt[0];
     read.innerHTML = '<span>Palabra <b>«' + S.toks[cur] + '»</b></span><span>Más atendida (sin contarse a sí misma) <b>«' + S.toks[top[1]] + '» ' + pct(top[0], 0) + '</b></span>' +
       '<span class="leq">puntuaciones q·k' + (scale ? '/√4' : '') + ' = [' + Sc[cur].map(function(v){ return fmt(v, 2); }).join("; ") + ']</span>' +
       '<span class="leq">softmax → [' + row.map(function(v){ return fmt(v, 3); }).join("; ") + ']  (suma 1)</span>' +
       '<span class="ldiag">' + (S.toks[cur] === "banco" ? "«banco» busca pistas de agua <i>y</i> de dinero; en esta frase solo encuentra la de <b>«" + S.toks[top[1]] + "»</b>, así que su nueva representación se mezcla sobre todo con ella: queda «teñida» de significado " + S.ctx + "." :
         "Cada palabra construye su nueva representación como una media de las demás ponderada por estos porcentajes. Prueba con «banco» para ver la desambiguación.") + '</span>';
   }
   function hit(p){
     for(var j = 0; j < chips.length; j++) if(p[0] >= chips[j].x && p[0] <= chips[j].x + chips[j].w && p[1] >= CY - 4 && p[1] <= CY + CH + 4) return j;
     if(p[0] >= HX - 70 && p[0] <= HX + 6 * HC && p[1] >= HY && p[1] < HY + 6 * HC) return Math.floor((p[1] - HY) / HC);
     return -1;
   }
   function pm(e){ var h = hit(K.pos(e)); K.cv.style.cursor = h >= 0 ? "pointer" : "default"; if(h !== hov){ hov = h; draw(); } }
   function pl(){ if(hov !== -1){ hov = -1; draw(); } }
   function pc(e){ var h = hit(K.pos(e)); if(h >= 0){ sel = h; hov = -1; draw(); } }
   K.cv.addEventListener("pointermove", pm); K.cv.addEventListener("pointerleave", pl); K.cv.addEventListener("click", pc);
   ctlSeg(ctl, "Frase", [["a", "El banco estaba lleno de peces"], ["b", "El banco me concedió el préstamo"]], sk, function(v){ sk = v; sel = 1; hov = -1; compute(); layout(); draw(); });
   ctlCheck(ctl, "Dividir por √d (escalado)", scale, function(v){ scale = v; compute(); draw(); });
   compute(); layout(); draw();
   return function(){};
 }});

/* ══ 5. AUTOENCODER — ANOMALÍAS POR ERROR DE RECONSTRUCCIÓN ═════ */
VIZ.push({id:"v-autoenc", model:"autoenc", g:"model", ic:"", dim:"2D",
 t:"Autoencoder: lo que no sabe reconstruir es raro",
 q:"¿Cómo detecta anomalías una red que solo aprende a copiar su entrada?",
 intro:"Cada punto es una transacción descrita por 2 variables. Las normales (●) siguen un patrón: viven sobre una <b>curva</b>. Unas pocas (▲) no. Entrenamos <b>de verdad</b> un autoencoder 2→8→<b>1</b>→8→2: tiene que comprimir cada punto en <b>un solo número</b> y reconstruirlo. Solo puede aprender la curva, así que cada punto se «proyecta» sobre ella (segmento gris) y la longitud de ese segmento es el <b>error de reconstrucción</b>. Mueve el umbral para decidir qué se marca como anomalía.",
 notice:["Con cuello de <b>1 neurona</b>, las normales quedan pegadas a la curva aprendida (error pequeño) y las ▲ tienen segmentos largos: el histograma separa dos montañas.",
   "Cambia el cuello a <b>2 neuronas</b>: la red ya puede copiar el plano entero, reconstruye también las anomalías y todo el error se aplasta junto a 0. <b>El cuello de botella es lo que hace útil al autoencoder.</b>",
   "Bajar el umbral sube el <b>recall</b> (cazas más anomalías) pero baja la <b>precision</b> (más transacciones normales bloqueadas por error)."],
 models:["autoenc","iforest","pca","lof"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 380, K = makeCanvas(stage, W, H, "Puntos, curva aprendida por el autoencoder e histograma del error de reconstrucción"), ctx = K.ctx;
   var nb = 1, thr = 0.2, net, adam, ep = 0, maxEp = 3000, stopL = null, errs = [], recon = [];
   var r = mulberry(4), P = [];
   for(var i = 0; i < 170; i++){ var t = -1 + 2 * r(); P.push([1.25 * t, 0.55 * Math.sin(2.4 * t) + gauss(r) * 0.035, 0]); }
   [[-0.9,0.7],[-0.6,0.55],[-0.3,-0.45],[0.0,0.45],[0.12,-0.5],[0.35,-0.5],[0.55,0.4],[0.72,-0.6],[0.9,0.45],[-0.12,-0.45]].forEach(function(a){
     P.push([1.25 * a[0], 0.55 * Math.sin(2.4 * a[0]) + a[1], 1]); });
   var sizes, ACT = [1, 0, 1, 0];
   function init(){
     sizes = [2, 8, nb, 8, 2]; var rw = mulberry(1); net = {W:[], b:[]}; adam = {m:[], v:[], mb:[], vb:[], t:0};
     for(var l = 1; l < 5; l++){ var ni = sizes[l - 1], no = sizes[l], lim = Math.sqrt(6 / (ni + no)), w = new Float64Array(ni * no);
       for(var k = 0; k < w.length; k++) w[k] = (rw() * 2 - 1) * lim;
       net.W.push(w); net.b.push(new Float64Array(no)); adam.m.push(new Float64Array(w.length)); adam.v.push(new Float64Array(w.length)); adam.mb.push(new Float64Array(no)); adam.vb.push(new Float64Array(no)); }
     ep = 0; evalAll();
   }
   function fwd(x, from){
     var A = [x];
     for(var l = from || 0; l < 4; l++){ var ni = sizes[l], no = sizes[l + 1], prev = A[A.length - 1], a = new Array(no);
       for(var j = 0; j < no; j++){ var s = net.b[l][j]; for(var q = 0; q < ni; q++) s += net.W[l][j * ni + q] * prev[q]; a[j] = ACT[l] ? Math.tanh(s) : s; }
       A.push(a); }
     return A;
   }
   function epoch(){
     var gW = net.W.map(function(w){ return new Float64Array(w.length); }), gb = net.b.map(function(b){ return new Float64Array(b.length); });
     P.forEach(function(p){
       var A = fwd([p[0], p[1]]), d = [A[4][0] - p[0], A[4][1] - p[1]];
       for(var l = 3; l >= 0; l--){ var ni = sizes[l], no = sizes[l + 1], nd = new Array(ni).fill(0);
         for(var j = 0; j < no; j++){ gb[l][j] += d[j]; for(var q = 0; q < ni; q++){ gW[l][j * ni + q] += d[j] * A[l][q]; nd[q] += d[j] * net.W[l][j * ni + q]; } }
         if(l > 0) d = nd.map(function(x, q){ return ACT[l - 1] ? x * (1 - A[l][q] * A[l][q]) : x; }); }
     });
     adam.t++; var c1 = 1 - Math.pow(0.9, adam.t), c2 = 1 - Math.pow(0.999, adam.t), n = P.length, lr = 0.01;
     function up(Pp, G, M, V){ for(var k = 0; k < Pp.length; k++){ var g = G[k] / n; M[k] = 0.9 * M[k] + 0.1 * g; V[k] = 0.999 * V[k] + 0.001 * g * g; Pp[k] -= lr * (M[k] / c1) / (Math.sqrt(V[k] / c2) + 1e-8); } }
     for(var l = 0; l < 4; l++){ up(net.W[l], gW[l], adam.m[l], adam.v[l]); up(net.b[l], gb[l], adam.mb[l], adam.vb[l]); }
     ep++;
   }
   function evalAll(){ recon = []; errs = []; P.forEach(function(p){ var A = fwd([p[0], p[1]]), o = A[4]; recon.push(o); errs.push(Math.hypot(o[0] - p[0], o[1] - p[1])); }); }
   var SB = [44, 46, 400, 300], HB = [508, 46, 228, 250], XM = 0.7, YM = 24;
   function sx(x){ return SB[0] + (x + 1.6) / 3.2 * SB[2]; } function sy(y){ return SB[1] + (1.2 - y) / 2.4 * SB[3]; }
   function draw(){
     K.clear();
     tx(ctx, "Transacciones y su reconstrucción", SB[0], 22, {s:13, w:700, c:C.ink});
     tx(ctx, "cuello de " + nb + (nb === 1 ? " neurona" : " neuronas"), SB[0] + SB[2], 22, {s:11, w:600, c:C.muted, a:"right"});
     rr(ctx, SB[0] + .5, SB[1] + .5, SB[2], SB[3], 10); ctx.fillStyle = C.card; ctx.fill(); ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.stroke();
     ctx.save(); rr(ctx, SB[0], SB[1], SB[2], SB[3], 10); ctx.clip();
     /* curva aprendida (decodificando z) */
     if(nb === 1){
       var zs = P.map(function(p){ return fwd([p[0], p[1]])[2][0]; }), z0 = Math.min.apply(null, zs), z1 = Math.max.apply(null, zs), pad = (z1 - z0) * 0.08;
       ctx.strokeStyle = hexA(C.c[0], 0.55); ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.beginPath();
       for(var k = 0; k <= 160; k++){ var z = z0 - pad + (z1 - z0 + 2 * pad) * k / 160, o = fwd([z], 2)[2]; k ? ctx.lineTo(sx(o[0]), sy(o[1])) : ctx.moveTo(sx(o[0]), sy(o[1])); }
       ctx.stroke(); ctx.lineCap = "butt";
     }
     P.forEach(function(p, i){
       var o = recon[i]; ctx.strokeStyle = errs[i] > thr ? hexA(C.ink, 0.7) : hexA(C.muted, 0.6); ctx.lineWidth = errs[i] > thr ? 1.4 : 1;
       ctx.beginPath(); ctx.moveTo(sx(p[0]), sy(p[1])); ctx.lineTo(sx(o[0]), sy(o[1])); ctx.stroke();
     });
     P.forEach(function(p, i){
       var X = sx(p[0]), Y = sy(p[1]);
       if(p[2]){ ctx.fillStyle = C.c[1]; ctx.beginPath(); ctx.moveTo(X, Y - 6); ctx.lineTo(X + 5.5, Y + 4); ctx.lineTo(X - 5.5, Y + 4); ctx.closePath(); ctx.fill(); ctx.strokeStyle = C.card; ctx.lineWidth = 1; ctx.stroke(); }
       else dot(ctx, X, Y, 3, C.c[0], C.card);
       if(errs[i] > thr){ ctx.beginPath(); ctx.arc(X, Y, 9, 0, 6.283); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4; ctx.stroke(); }
     });
     ctx.restore();
     var ly = SB[1] + SB[3] + 22;
     dot(ctx, SB[0] + 5, ly - 4, 3.5, C.c[0]); tx(ctx, "normal", SB[0] + 13, ly, {s:11, c:C.text});
     ctx.fillStyle = C.c[1]; ctx.beginPath(); ctx.moveTo(SB[0] + 70, ly - 10); ctx.lineTo(SB[0] + 75, ly - 1); ctx.lineTo(SB[0] + 65, ly - 1); ctx.closePath(); ctx.fill();
     tx(ctx, "anómala (real)", SB[0] + 81, ly, {s:11, c:C.text});
     if(nb === 1){ ctx.strokeStyle = hexA(C.c[0], 0.55); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(SB[0] + 172, ly - 4); ctx.lineTo(SB[0] + 194, ly - 4); ctx.stroke(); tx(ctx, "curva aprendida", SB[0] + 200, ly, {s:11, c:C.text}); }
     ctx.beginPath(); ctx.arc(SB[0] + 304, ly - 4, 6, 0, 6.283); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.4; ctx.stroke(); tx(ctx, "marcada", SB[0] + 314, ly, {s:11, c:C.text});
     /* histograma */
     tx(ctx, "Error de reconstrucción", HB[0] - 30, 22, {s:13, w:700, c:C.ink});
     var A = axes(ctx, HB, [0, XM], [0, YM], C, {xl:"distancia punto → reconstrucción", yl:"nº de puntos", xt:[0, 0.2, 0.4, 0.6], yt:[0, 10, 20]});
     var clip = 0, nbins = 28, bw = HB[2] / nbins, hn = new Array(nbins).fill(0), ha = new Array(nbins).fill(0);
     errs.forEach(function(e, i){ var b = Math.min(nbins - 1, Math.floor(e / XM * nbins)); (P[i][2] ? ha : hn)[b]++; });
     for(var b = 0; b < nbins; b++){
       var x = HB[0] + b * bw, top = HB[1] + HB[3];
       if(hn[b]){ var h1 = Math.min(YM, hn[b]) / YM * HB[3]; ctx.fillStyle = hexA(C.c[0], 0.6); ctx.fillRect(x + 1, top - h1, bw - 2, h1);
         if(hn[b] > YM){ clip = Math.max(clip, hn[b]); ctx.fillStyle = C.card; ctx.fillRect(x + 1, HB[1] + 6, bw - 2, 3); } }
       if(ha[b]){ var h2 = Math.min(YM, ha[b]) / YM * HB[3]; ctx.fillStyle = C.c[1]; ctx.fillRect(x + bw * 0.22, top - h2, bw * 0.56, h2); }
     }
     if(clip) tx(ctx, "↑ eje recortado: la barra más alta llega a " + clip, HB[0] + HB[2], HB[1] - 8, {s:11, w:600, c:C.muted, a:"right"});
     var tX = A.sx(thr); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(tX, HB[1]); ctx.lineTo(tX, HB[1] + HB[3]); ctx.stroke(); ctx.setLineDash([]);
     tx(ctx, "umbral", tX + (tX > HB[0] + HB[2] - 50 ? -5 : 5), HB[1] + 44, {s:11, w:700, c:C.ink, a:tX > HB[0] + HB[2] - 50 ? "right" : "left"});
     ctx.fillStyle = hexA(C.c[0], 0.6); ctx.fillRect(HB[0], HB[1] + HB[3] + 35, 10, 10); tx(ctx, "normales", HB[0] + 15, HB[1] + HB[3] + 44, {s:11, c:C.text});
     ctx.fillStyle = C.c[1]; ctx.fillRect(HB[0] + 80, HB[1] + HB[3] + 35, 10, 10); tx(ctx, "anómalas (delante)", HB[0] + 95, HB[1] + HB[3] + 44, {s:11, c:C.text});
     /* lectura */
     var TP = 0, FP = 0, FN = 0, mn = 0, ma = 0;
     errs.forEach(function(e, i){ var flag = e > thr; if(P[i][2]){ ma += e; if(flag) TP++; else FN++; } else { mn += e; if(flag) FP++; } });
     mn /= 170; ma /= 10; var prec = TP / Math.max(1, TP + FP), rec = TP / 10;
     read.innerHTML = '<span>Época <b>' + fmtN(ep) + '</b></span><span>Error medio normales <b>' + fmt(mn, 3) + '</b></span><span>Error medio anómalas <b>' + fmt(ma, 3) + '</b></span>' +
       '<span>Marcadas <b>' + (TP + FP) + '</b></span><span>Precision <b>' + (TP + FP ? pct(prec, 0) : "—") + '</b></span><span>Recall <b>' + pct(rec, 0) + '</b> (' + TP + ' de 10)</span>' +
       '<span class="ldiag">' + (ep < 400 ? "Entrenando: la red aún está aprendiendo la forma de los datos…" :
         nb === 2 ? "Con <b>2 neuronas</b> en el cuello la red no necesita entender el patrón: copia cualquier punto, incluidas las anomalías (error medio de las ▲: " + fmt(ma, 3) + "). Sin cuello de botella el error ya no distingue lo raro." :
         "Las anómalas se reconstruyen " + fmt(ma / Math.max(1e-6, mn), 0) + " veces peor que las normales: el cuello de 1 neurona solo «sabe» dibujar la curva. " + (rec === 1 && prec === 1 ? "Con este umbral las cazas todas sin falsas alarmas." : rec < 1 ? "Con este umbral se te escapan " + FN + "." : "Con este umbral bloqueas también " + FP + " normales.")) + '</span>';
   }
   function start(){ stop(); if(ep >= maxEp) init(); stopL = loop(function(){ for(var k = 0; k < 30; k++) epoch(); evalAll(); draw(); if(ep >= maxEp){ stop(); pt.set(false); } }); }
   function stop(){ if(stopL){ stopL(); stopL = null; } }
   var pt = playToggle(ctl, "Entrenar", function(on){ if(on) start(); else stop(); });
   ctlBtn(ctl, "↺ Reiniciar", function(){ init(); draw(); pt.set(true); start(); });
   ctlSeg(ctl, "Cuello de botella", [["1", "1 neurona"], ["2", "2 neuronas"]], "1", function(v){ nb = +v; init(); draw(); pt.set(true); start(); });
   var sl = ctlSlider(ctl, "Umbral de error (también arrastrando en el histograma)", 0.02, 0.6, 0.01, thr, function(v){ return fmt(v, 2); }, function(v){ thr = v; draw(); });
   var drag = false;
   function setT(e){ var p = K.pos(e); thr = Math.max(0.02, Math.min(0.6, (p[0] - HB[0]) / HB[2] * XM)); sl.set(thr); draw(); }
   K.cv.addEventListener("pointerdown", function(e){ var p = K.pos(e); if(p[0] > HB[0] - 8 && p[1] > HB[1] && p[1] < HB[1] + HB[3]){ drag = true; K.cv.setPointerCapture(e.pointerId); setT(e); } });
   K.cv.addEventListener("pointermove", function(e){ if(drag) setT(e); });
   K.cv.addEventListener("pointerup", function(){ drag = false; });
   K.cv.style.touchAction = window.matchMedia("(max-width:640px)").matches ? "pan-x pan-y" : "pan-y";
   init(); draw(); pt.set(true); start();
   return function(){ stop(); };
 }});

/* ══ 6. RBM — RECOMENDADOR DE PELÍCULAS ═════════════════════════ */
VIZ.push({id:"v-rbm", model:"rbm", g:"model", ic:"", dim:"2D",
 t:"Una RBM que recomienda películas",
 q:"¿Cómo «adivina» una máquina de Boltzmann restringida qué más te gustará?",
 intro:"Abajo, 6 películas (unidades <b>visibles</b>); arriba, 2 unidades <b>ocultas</b> que representan gustos. <b>Toca una película</b> para marcarla como «vista y me gustó». Cada oculta calcula P(h=1|v) = sigmoide(sesgo + suma de pesos de lo marcado). Con «Reconstruir» la red baja de los gustos a las películas, P(v=1|h), y sugiere las no vistas con probabilidad alta. Los pesos son fijos e ilustrativos (en una RBM real se aprenden); las probabilidades se calculan de verdad. Es una técnica <b>histórica</b>: hoy se usan factorización de matrices o redes más modernas.",
 notice:["Marca una película de acción: «Gusto acción» se enciende (≈ 69%). Marca dos y pasa del 95%. «Gusto romance» baja porque los pesos acción→romance son <b>negativos</b>.",
   "Pulsa <b>Reconstruir</b>: las películas de acción que no has visto salen con probabilidad alta (★ sugeridas) y las románticas con baja. Eso es filtrado colaborativo.",
   "El <b>paso de Gibbs</b> no calcula probabilidades: <b>sortea</b> 0/1 con ellas. Púlsalo varias veces y verás que la cadena casi siempre «imagina» perfiles coherentes (acción con acción)."],
 models:["rbm","reco","autoenc"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 390, K = makeCanvas(stage, W, H, "Grafo bipartito de una máquina de Boltzmann restringida con 6 películas y 2 gustos ocultos"), ctx = K.ctx;
   var MOV = [["", "Fuga a medianoche", 0], ["", "Operación Halcón", 0], ["", "Al límite", 0], ["", "Cartas a Oporto", 1], ["", "Un verano en Cádiz", 1], ["", "Baila conmigo", 1]];
   var Wt = [[3.0, -1.4], [2.6, -1.0], [2.8, -1.2], [-1.2, 2.9], [-1.0, 2.7], [-1.4, 2.6]], bh = [-2.2, -2.2], av = [-1.0, -1.0, -1.0, -1.1, -0.9, -1.0];
   var HN = ["Gusto acción", "Gusto romance"], HC = [C.c[1], C.c[5]];
   var v = [1, 0, 0, 0, 0, 0], showRec = true, chain = null, steps = 0, rng = mulberry(17), last = "";
   function ph(vv){ return [0, 1].map(function(j){ var s = bh[j]; vv.forEach(function(x, i){ s += x * Wt[i][j]; }); return sigm(s); }); }
   function pv(hh){ return Wt.map(function(w, i){ return sigm(av[i] + hh[0] * w[0] + hh[1] * w[1]); }); }
   var CX0 = 34, CW = 106, CG = 14, CY = 252, CHt = 84, HY = 92, HXs = [250, 510], HR = 36;
   function cardX(i){ return CX0 + i * (CW + CG); }
   function wrap(s, maxW){ ctx.font = "600 12px " + LABFONT; var words = s.split(" "), lines = [""];
     words.forEach(function(w){ var t = lines[lines.length - 1] ? lines[lines.length - 1] + " " + w : w; if(ctx.measureText(t).width > maxW && lines[lines.length - 1]) lines.push(w); else lines[lines.length - 1] = t; }); return lines; }
   function draw(){
     K.clear(); var H1 = ph(v), V1 = pv(H1);
     tx(ctx, "Unidades ocultas (gustos)", 24, 26, {s:13, w:700, c:C.ink});
     /* aristas */
     MOV.forEach(function(m, i){ [0, 1].forEach(function(j){
       var w = Wt[i][j], x1 = cardX(i) + CW / 2, y1 = CY, x2 = HXs[j], y2 = HY + HR;
       ctx.strokeStyle = hexA(w > 0 ? C.pos : C.neg, v[i] ? 0.85 : 0.35); ctx.lineWidth = Math.abs(w) * (v[i] ? 1.3 : 0.8); ctx.setLineDash(w > 0 ? [] : [5, 4]);
       ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]);
     }); });
     ctx.font = "700 13px " + LABFONT; var vtw = ctx.measureText("Unidades visibles (películas) · toca para marcar").width;
     rr(ctx, 18, CY - 32, vtw + 12, 22, 6); ctx.fillStyle = C.card; ctx.fill();
     tx(ctx, "Unidades visibles (películas) · toca para marcar", 24, CY - 16, {s:13, w:700, c:C.ink});
     /* ocultas */
     [0, 1].forEach(function(j){
       var x = HXs[j], p = H1[j];
       dot(ctx, x, HY, HR, C.card, C.line);
       ctx.strokeStyle = hexA(HC[j], 0.2); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(x, HY, HR - 5, 0, 6.283); ctx.stroke();
       ctx.strokeStyle = HC[j]; ctx.beginPath(); ctx.arc(x, HY, HR - 5, -Math.PI / 2, -Math.PI / 2 + 6.283 * p); ctx.stroke();
       tx(ctx, pct(p, 0), x, HY + 6, {s:16, w:700, c:C.ink, a:"center"});
       tx(ctx, HN[j], x + (j ? 1 : -1) * (HR + 12), HY - 4, {s:12, w:700, c:HC[j], a:j ? "left" : "right"});
       tx(ctx, "P(h=1 | películas)", x + (j ? 1 : -1) * (HR + 12), HY + 12, {s:11, c:C.muted, a:j ? "left" : "right"});
       if(chain){ var on = chain.h[j]; rr(ctx, x - 26, HY - HR - 26, 52, 18, 9); ctx.fillStyle = on ? HC[j] : C.card; ctx.fill(); ctx.strokeStyle = HC[j]; ctx.lineWidth = 1; ctx.stroke();
         tx(ctx, "h = " + on, x, HY - HR - 13, {s:11, w:700, c:on ? C.card : HC[j], a:"center"}); }
     });
     /* películas */
     MOV.forEach(function(m, i){
       var x = cardX(i), on = v[i] === 1, sug = showRec && !on && V1[i] > 0.5;
       rr(ctx, x, CY, CW, CHt, 12); ctx.fillStyle = on ? C.soft : C.card; ctx.fill();
       ctx.strokeStyle = on ? C.c[0] : sug ? C.c[4] : C.line; ctx.lineWidth = on || sug ? 2 : 1; ctx.setLineDash(sug ? [5, 3] : []); ctx.stroke(); ctx.setLineDash([]);
       ctx.fillStyle = HC[m[2]]; ctx.fillRect(x + 12, CY + 10, 12, 4);
       tx(ctx, m[0], x + 12, CY + 37, {s:16});
       if(on) tx(ctx, "✓ vista", x + CW - 10, CY + 17, {s:11, w:700, c:C.c[0], a:"right"});
       else if(sug) tx(ctx, "★ sugerida", x + CW - 6, CY + 17, {s:11, w:700, c:C.c[4], a:"right"});
       wrap(m[1], CW - 20).forEach(function(l, k){ tx(ctx, l, x + 12, CY + 54 + k * 15, {s:12, w:600, c:C.ink}); });
       if(showRec){
         var by = CY + CHt + 12; rr(ctx, x, by, CW, 8, 4); ctx.fillStyle = hexA(C.line, 0.9); ctx.fill();
         rr(ctx, x, by, Math.max(4, CW * V1[i]), 8, 4); ctx.fillStyle = C.c[0]; ctx.fill();
         tx(ctx, "P(v=1|h) " + pct(V1[i], 0), x, by + 22, {s:11, c:C.text});
       }
       if(chain){ var s = chain.v[i]; tx(ctx, "Gibbs: " + (s ? "1 ●" : "0 ○"), x + CW, CY - 4, {s:11, w:600, c:s ? C.c[0] : C.muted, a:"right"}); }
     });
     /* leyenda aristas */
     var lx = 560, ly = 26; ctx.lineWidth = 3; ctx.strokeStyle = C.pos; ctx.beginPath(); ctx.moveTo(lx, ly - 4); ctx.lineTo(lx + 22, ly - 4); ctx.stroke();
     tx(ctx, "▲ peso +", lx + 28, ly, {s:11, c:C.text});
     ctx.strokeStyle = C.neg; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(lx + 92, ly - 4); ctx.lineTo(lx + 114, ly - 4); ctx.stroke(); ctx.setLineDash([]);
     tx(ctx, "▼ peso −", lx + 120, ly, {s:11, c:C.text});
     tx(ctx, "grosor = |peso|", lx, ly + 16, {s:11, c:C.muted});
     /* lectura */
     var sugs = MOV.map(function(m, i){ return [V1[i], i]; }).filter(function(a){ return !v[a[1]]; }).sort(function(a, b){ return b[0] - a[0]; });
     var nOn = v.reduce(function(a, b){ return a + b; }, 0);
     read.innerHTML = '<span>P(gusto acción) <b>' + pct(H1[0], 0) + '</b></span><span>P(gusto romance) <b>' + pct(H1[1], 0) + '</b></span>' +
       (sugs.length ? '<span>Mejor sugerencia <b>' + MOV[sugs[0][1]][1] + ' (' + pct(sugs[0][0], 0) + ')</b></span>' : '') +
       (chain ? '<span>Pasos de Gibbs <b>' + steps + '</b></span>' : '') +
       '<span class="ldiag">' + (last || (nOn === 0 ? "No has marcado nada: los dos gustos se quedan en el " + pct(H1[0], 0) + " (solo el sesgo). Toca alguna película." :
         H1[0] > 0.6 && H1[1] > 0.6 ? "Has marcado de los dos estilos: la RBM activa ambos gustos y te sugiere un poco de todo." :
         "Tu perfil activa sobre todo «" + (H1[0] > H1[1] ? HN[0] : HN[1]) + "» (" + pct(Math.max(H1[0], H1[1]), 0) + "). " + (showRec ? "Al reconstruir, sube la probabilidad de las películas de ese estilo que aún no has visto." : "Pulsa «Reconstruir» para ver qué te sugiere."))) + '</span>';
     last = "";
   }
   K.cv.addEventListener("click", function(e){
     var p = K.pos(e);
     for(var i = 0; i < 6; i++) if(p[0] >= cardX(i) && p[0] <= cardX(i) + CW && p[1] >= CY && p[1] <= CY + CHt){ v[i] = 1 - v[i]; chain = null; steps = 0; draw(); return; }
   });
   K.cv.addEventListener("pointermove", function(e){ var p = K.pos(e), on = false;
     for(var i = 0; i < 6; i++) if(p[0] >= cardX(i) && p[0] <= cardX(i) + CW && p[1] >= CY && p[1] <= CY + CHt) on = true;
     K.cv.style.cursor = on ? "pointer" : "default"; });
   ctlBtn(ctl, "Reconstruir (sugerir)", function(){ showRec = true; draw(); }, true);
   ctlBtn(ctl, "Paso de Gibbs (muestrear)", function(){
     var start = chain ? chain.v : v, P1 = ph(start), h = P1.map(function(p){ return rng() < p ? 1 : 0; });
     var P2 = pv(h), vs = P2.map(function(p){ return rng() < p ? 1 : 0; });
     chain = {h:h, v:vs}; steps++;
     last = "Paso " + steps + ": se sortean los gustos con P(h|v) → h = (" + h.join(", ") + "), y con ellos las películas con P(v|h) → «imagina» que te gustan: " +
       (vs.some(function(x){ return x; }) ? MOV.filter(function(m, i){ return vs[i]; }).map(function(m){ return m[1]; }).join(", ") : "ninguna") + ". El siguiente paso parte de esta muestra.";
     draw(); });
   ctlBtn(ctl, "Ocultar reconstrucción", function(){ showRec = false; draw(); });
   ctlBtn(ctl, "↺ Limpiar", function(){ v = [0, 0, 0, 0, 0, 0]; chain = null; steps = 0; draw(); });
   draw();
   return function(){};
 }});

/* ══ 7. SOM — MAPA AUTOORGANIZADO DE COLORES ════════════════════ */
VIZ.push({id:"v-som", model:"som", g:"model", ic:"", dim:"2D",
 t:"Un mapa autoorganizado de colores",
 q:"¿Cómo ordena un SOM datos de 3 dimensiones en un mapa plano?",
 intro:"Cada casilla de la rejilla 14×14 es una <b>neurona</b> con un color (3 números: rojo, verde, azul), al principio al azar. En cada iteración se elige un color de muestra, se busca la neurona más parecida (<b>BMU</b>, la ganadora) y se acerca ese color a ella <b>y a sus vecinas</b> dentro de un radio σ que se va encogiendo. Todo se calcula de verdad. Pulsa.",
 notice:["Al principio σ es grande y toda la rejilla se mueve a la vez (orden global); al final σ es pequeño y solo se afinan detalles locales.",
   "Colores parecidos acaban en <b>zonas vecinas</b> del mapa (los rojos junto a naranjas y rosas): el SOM conserva la «topología», qué está cerca de qué.",
   "En modo <b>U-Matrix</b> cada casilla muestra la distancia con sus vecinas: las zonas azules intensas son <b>fronteras</b> entre grupos y las zonas tenues, el interior de cada grupo. Así se leen clusters en un SOM."],
 models:["som","kmeans","umap","tsne"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 398, K = makeCanvas(stage, W, H, "Rejilla de neuronas de un mapa autoorganizado entrenándose con colores"), ctx = K.ctx;
   var N = 14, T = 4000, sig0 = 6, lr0 = 0.4, view = "w", grid, it, qeHist, lastB = null, stopL = null;
   var SAMP = [[230,40,40],[240,130,30],[245,210,40],[60,180,75],[30,120,60],[40,190,200],[40,80,220],[20,30,110],[140,60,200],[235,90,170],[250,250,250],[130,130,130],[25,25,25],[140,80,40]];
   var NAMES = ["rojo","naranja","amarillo","verde","v. oscuro","cian","azul","marino","violeta","rosa","blanco","gris","negro","marrón"];
   function init(){ var r = mulberry(5); grid = []; for(var i = 0; i < N * N; i++) grid.push([r() * 255, r() * 255, r() * 255]); it = 0; qeHist = []; lastB = null; qeHist.push({it:0, qe:qe()}); }
   function d2(a, b){ var x = a[0] - b[0], y = a[1] - b[1], z = a[2] - b[2]; return x * x + y * y + z * z; }
   function bmu(s){ var bi = 0, bd = 1e18; for(var i = 0; i < grid.length; i++){ var d = d2(grid[i], s); if(d < bd){ bd = d; bi = i; } } return bi; }
   function sig(){ return sig0 * Math.pow(0.5 / sig0, it / T); }
   function lrt(){ return lr0 * Math.pow(0.02 / lr0, it / T); }
   function qe(){ var s = 0; SAMP.forEach(function(c){ s += Math.sqrt(d2(grid[bmu(c)], c)); }); return s / SAMP.length; }
   var rs = mulberry(9);
   function step(){
     var si = Math.floor(rs() * SAMP.length), s = SAMP[si], b = bmu(s), br = Math.floor(b / N), bc = b % N, sg = sig(), l = lrt();
     for(var i = 0; i < grid.length; i++){ var r = Math.floor(i / N), c = i % N, dd = (r - br) * (r - br) + (c - bc) * (c - bc);
       if(dd > 9 * sg * sg) continue; var h = Math.exp(-dd / (2 * sg * sg)) * l, g = grid[i];
       g[0] += h * (s[0] - g[0]); g[1] += h * (s[1] - g[1]); g[2] += h * (s[2] - g[2]); }
     lastB = {r:br, c:bc, si:si}; it++;
   }
   var GX = 26, GY = 44, CS = 23;
   function umat(){ var u = [], mx = 1e-9; for(var i = 0; i < grid.length; i++){ var r = Math.floor(i / N), c = i % N, s = 0, n = 0;
       [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){ var rr2 = r + d[0], cc = c + d[1]; if(rr2 >= 0 && rr2 < N && cc >= 0 && cc < N){ s += Math.sqrt(d2(grid[i], grid[rr2 * N + cc])); n++; } });
       u.push(s / n); mx = Math.max(mx, s / n); } return u.map(function(x){ return x / mx; }); }
   function draw(){
     K.clear();
     tx(ctx, view === "w" ? "Pesos de cada neurona (su color)" : "U-Matrix: distancia a las vecinas", GX, 26, {s:13, w:700, c:C.ink});
     var U = view === "u" ? umat() : null;
     for(var i = 0; i < grid.length; i++){ var r = Math.floor(i / N), c = i % N, g = grid[i];
       ctx.fillStyle = U ? mixc(C.card, C.c[0], 0.04 + 0.96 * U[i]) : "rgb(" + (g[0] | 0) + "," + (g[1] | 0) + "," + (g[2] | 0) + ")";
       rr(ctx, GX + c * CS + 1, GY + r * CS + 1, CS - 2, CS - 2, 4); ctx.fill(); }
     /* BMU de cada muestra */
     SAMP.forEach(function(s){ var b = bmu(s), r = Math.floor(b / N), c = b % N, x = GX + c * CS + CS / 2, y = GY + r * CS + CS / 2;
       dot(ctx, x, y, 5.5, "rgb(" + s.join(",") + ")"); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.stroke(); });
     /* radio de vecindad */
     if(lastB && it < T){ var sg = sig(), x0 = GX + lastB.c * CS + CS / 2, y0 = GY + lastB.r * CS + CS / 2;
       ctx.save(); ctx.beginPath(); ctx.rect(GX, GY, N * CS, N * CS); ctx.clip();
       ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.arc(x0, y0, sg * CS, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
       ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.strokeRect(GX + lastB.c * CS, GY + lastB.r * CS, CS, CS); ctx.restore(); }
     var ly = GY + N * CS + 20;
     tx(ctx, view === "w" ? "● = neurona ganadora (BMU) de cada color de muestra · - - radio σ" : "azul intenso = frontera (vecinas muy distintas) · tenue = dentro de un grupo", GX, ly, {s:11, c:C.muted});
     /* panel derecho */
     var RX = 380;
     tx(ctx, "Colores de entrenamiento", RX, 26, {s:13, w:700, c:C.ink});
     SAMP.forEach(function(s, k){ var x = RX + (k % 7) * 50, y = 40 + Math.floor(k / 7) * 46, act = lastB && lastB.si === k && it < T;
       rr(ctx, x, y, 40, 24, 6); ctx.fillStyle = "rgb(" + s.join(",") + ")"; ctx.fill(); ctx.strokeStyle = act ? C.ink : C.line; ctx.lineWidth = act ? 2.5 : 1; ctx.stroke();
       tx(ctx, NAMES[k], x + 20, y + 37, {s:11, c:act ? C.ink : C.muted, w:act ? 700 : 400, a:"center"}); });
     var B = [RX + 34, 186, 318, 150];
     tx(ctx, "Error de cuantización", RX, 150, {s:12, w:700, c:C.ink});
     tx(ctx, "distancia media de cada color a su neurona ganadora", RX, 166, {s:11, c:C.muted});
     var mxq = 10; qeHist.forEach(function(h){ mxq = Math.max(mxq, h.qe * 1.1); }); mxq = Math.ceil(mxq / 10) * 10;
     var A = axes(ctx, B, [0, T], [0, mxq], C, {xl:"iteración", xt:[0, 2000, 4000], yt:[0, Math.round(mxq)]});
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 2.2; ctx.beginPath(); qeHist.forEach(function(h, k){ var X = A.sx(h.it), Y = A.sy(h.qe); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke();
     var q = qeHist[qeHist.length - 1].qe;
     read.innerHTML = '<span>Iteración <b>' + fmtN(it) + ' / ' + fmtN(T) + '</b></span><span>Radio σ <b>' + fmt(sig(), 2) + ' casillas</b></span><span>Learning rate <b>' + fmt(lrt(), 3) + '</b></span><span>Error de cuantización <b>' + fmt(q, 1) + '</b> (en unidades RGB, 0-441)</span>' +
       '<span class="ldiag">' + (it === 0 ? "Neuronas al azar: un mapa de ruido. Pulsa para entrenar." : it < T * 0.25 ? "Fase de <b>ordenación</b>: con σ grande, cada actualización arrastra media rejilla y aparecen grandes zonas de color." :
         it < T ? "Fase de <b>ajuste fino</b>: σ ya es pequeño y cada neurona se especializa en su color sin desordenar el mapa." :
         "Entrenado: cada color tiene su zona y los parecidos son vecinos. Error de cuantización final: " + fmt(q, 1) + " (cada color de muestra tiene una neurona casi idéntica). Fíjate en la curva: al principio el error <b>sube</b>, porque σ grande arrastra a todas las neuronas hacia el color medio; después baja al ordenarse.") + '</span>';
   }
   function start(){ stop(); if(it >= T) init(); stopL = loop(function(){ for(var k = 0; k < 12 && it < T; k++) step(); if(it % 48 === 0) qeHist.push({it:it, qe:qe()}); draw(); if(it >= T){ qeHist.push({it:it, qe:qe()}); stop(); pt.set(false); draw(); } }); }
   function stop(){ if(stopL){ stopL(); stopL = null; } }
   var pt = playToggle(ctl, "Entrenar", function(on){ if(on) start(); else stop(); });
   ctlBtn(ctl, "↺ Reiniciar", function(){ stop(); pt.set(false); init(); draw(); });
   ctlSeg(ctl, "Vista", [["w", "Colores (pesos)"], ["u", "U-Matrix"]], view, function(v){ view = v; draw(); });
   ctlSlider(ctl, "<span style=\"text-transform:none\">σ</span> inicial (radio de vecindad)", 2, 8, 0.5, sig0, function(v){ return fmt(v, 1) + " casillas"; }, function(v){ sig0 = v; stop(); pt.set(false); init(); draw(); });
   ctlSlider(ctl, "Learning rate inicial", 0.05, 0.8, 0.05, lr0, function(v){ return fmt(v, 2); }, function(v){ lr0 = v; stop(); pt.set(false); init(); draw(); });
   init(); draw(); pt.set(true); start();
   return function(){ stop(); };
 }});

/* ══ 8. RED BAYESIANA — «EXPLAINING AWAY» ══════════════════════ */
VIZ.push({id:"v-bayesnet", model:"bayesnet", g:"model", ic:"", dim:"2D",
 t:"Una red bayesiana que razona hacia atrás",
 q:"¿Cómo cambia lo que creemos sobre una causa cuando aparece otra explicación?",
 intro:"Cinco variables de sí/no unidas por flechas causa → efecto: la <b>lluvia</b> y las <b>obras</b> provocan <b>tráfico</b>, el tráfico provoca <b>retraso</b>, y la lluvia hace que se vendan <b>paraguas</b>. Cada tarjeta muestra P(sí) dada la evidencia. <b>Toca una tarjeta</b> para fijarla: desconocido → sí → no. La inferencia es <b>exacta</b>: se suman las 32 combinaciones posibles (enumeración).",
 notice:["Fija <b>Retraso = sí</b>: P(Lluvia) sube del 20% al 41%. La red razona «hacia atrás», del efecto a sus posibles causas.",
   "Ahora fija además <b>Obras = sí</b>: P(Lluvia) <b>baja</b> al 22%. Las obras ya explican el retraso, así que la lluvia deja de hacer falta. Es el «<b>explaining away</b>» (una causa «descarta» a la otra).",
   "Fija <b>Paraguas = sí</b> sin nada más: sube P(Lluvia) y, a través de ella, P(Tráfico) y P(Retraso). La evidencia viaja en cualquier dirección por las flechas."],
 models:["bayesnet","nb","hmm"],
 build:function(stage, ctl, read, C){
   var st = document.createElement("style");
   st.textContent = ".vbn{position:relative;width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:52px 22px;padding:26px;background:var(--card);border:.5px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--shadow-1)}" +
     ".vbn svg{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:visible}" +
     ".vbn-n{position:relative;z-index:1;background:var(--card-2);border:1.5px solid var(--line-2);border-radius:14px;padding:12px 14px;cursor:pointer;text-align:left;font:inherit;color:var(--text);display:flex;flex-direction:column;gap:7px;transition:border-color .2s,background .2s}" +
     ".vbn-n:hover{border-color:var(--accent)}.vbn-n:focus-visible{outline:2px solid var(--accent);outline-offset:2px}" +
     ".vbn-n.ev1{border-color:var(--accent);background:var(--accent-soft)}.vbn-n.ev0{border-style:dashed;border-color:var(--ink)}" +
     ".vbn-h{font-weight:700;color:var(--ink);font-size:14.5px;line-height:1.25}" +
     ".vbn-tag{align-self:flex-start;white-space:nowrap;font-size:11px;font-weight:700;padding:2px 8px;border-radius:99px;background:var(--card);border:.5px solid var(--line-2);color:var(--muted)}" +
     ".vbn-n.ev1 .vbn-tag{background:var(--accent);border-color:var(--accent);color:#fff}.vbn-n.ev0 .vbn-tag{background:var(--ink);border-color:var(--ink);color:var(--on-ink)}" +
     ".vbn-p{font-size:22px;font-weight:700;color:var(--ink);font-variant-numeric:tabular-nums}.vbn-p small{font-size:12px;font-weight:500;color:var(--muted);margin-left:4px}" +
     ".vbn-bar{height:8px;border-radius:4px;background:var(--line);overflow:hidden}.vbn-bar i{display:block;height:100%;background:var(--accent);border-radius:4px;transition:width .45s ease}" +
     ".vbn-d{font-size:12px;font-weight:600;min-height:16px;color:var(--muted)}.vbn-d.up{color:var(--ink)}.vbn-d.dn{color:var(--ink)}" +
     ".vbn-cpt{display:none;font-size:11.5px;line-height:1.5;color:var(--muted);border-top:.5px solid var(--line);padding-top:6px}.vbn.cpt .vbn-cpt{display:block}" +
     ".vbn-hint{align-self:center;font-size:12.5px;line-height:1.5;color:var(--muted)}" +
     "@media(max-width:640px){.vbn{gap:40px 8px;padding:12px}.vbn-n{padding:9px 9px;gap:5px}.vbn-h{font-size:12.5px}.vbn-p{font-size:17px}.vbn-tag{font-size:10px;padding:1px 6px}.vbn-p small{display:none}.vbn-hint{font-size:11.5px}}";
   stage.appendChild(st);
   var box = document.createElement("div"); box.className = "vbn"; stage.appendChild(box);
   var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); box.appendChild(svg);
   /* nodos: L lluvia, O obras, T tráfico, R retraso, U paraguas */
   var N = [
     {k:"L", n:"Lluvia", pos:[1, 1], cpt:"P(sí) = 20%"},
     {k:"O", n:"Obras", pos:[1, 3], cpt:"P(sí) = 10%"},
     {k:"U", n:"Paraguas vendidos", pos:[2, 1], cpt:"Si llueve 90% · si no 20%"},
     {k:"T", n:"Tráfico", pos:[2, 2], cpt:"Lluvia y obras 95% · solo lluvia 70% · solo obras 80% · ninguna 10%"},
     {k:"R", n:"Retraso", pos:[3, 2], cpt:"Con tráfico 80% · sin tráfico 10%"}];
   var E = [["L", "U"], ["L", "T"], ["O", "T"], ["T", "R"]];
   var ev = {L:null, O:null, U:null, T:null, R:null}, prev = null, prevEv = null, post = null;
   var el = {};
   N.forEach(function(nd){
     var b = document.createElement("button"); b.type = "button"; b.className = "vbn-n";
     b.style.gridRow = nd.pos[0]; b.style.gridColumn = nd.pos[1];
     b.innerHTML = '<span class="vbn-h">' + nd.n + '</span><span class="vbn-tag"></span><span class="vbn-p"></span><span class="vbn-bar"><i></i></span><span class="vbn-d"></span><span class="vbn-cpt">' + nd.cpt + '</span>';
     b.addEventListener("click", function(){ ev[nd.k] = ev[nd.k] === null ? 1 : ev[nd.k] === 1 ? 0 : null; update(); });
     box.appendChild(b); el[nd.k] = b;
   });
   var hint = document.createElement("div"); hint.className = "vbn-hint"; hint.style.gridRow = 3; hint.style.gridColumn = 1;
   hint.innerHTML = "Toca una tarjeta para fijar evidencia:<br><b>?</b> desconocido → <b>sí</b> → <b>no</b>"; box.appendChild(hint);
   function joint(a){ /* a = {L,O,U,T,R} 0/1 */
     var pL = a.L ? 0.2 : 0.8, pO = a.O ? 0.1 : 0.9, pU = (a.L ? 0.9 : 0.2), pt = a.L && a.O ? 0.95 : a.L ? 0.7 : a.O ? 0.8 : 0.1, pR = a.T ? 0.8 : 0.1;
     return pL * pO * (a.U ? pU : 1 - pU) * (a.T ? pt : 1 - pt) * (a.R ? pR : 1 - pR);
   }
   function infer(e){
     var tot = 0, m = {L:0, O:0, U:0, T:0, R:0};
     for(var c = 0; c < 32; c++){
       var a = {L:c & 1, O:c >> 1 & 1, U:c >> 2 & 1, T:c >> 3 & 1, R:c >> 4 & 1}, ok = true;
       for(var k in e) if(e[k] !== null && a[k] !== e[k]) ok = false;
       if(!ok) continue; var p = joint(a); tot += p; for(k in m) if(a[k]) m[k] += p;
     }
     for(k in m) m[k] /= tot; return m;
   }
   var NAME = {L:"Lluvia", O:"Obras", U:"Paraguas", T:"Tráfico", R:"Retraso"};
   function drawArrows(){
     var R0 = box.getBoundingClientRect(); if(!R0.width) return;
     svg.setAttribute("viewBox", "0 0 " + R0.width + " " + R0.height);
     var html = '<defs><marker id="vbnArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--muted)"/></marker></defs>';
     E.forEach(function(e){
       var a = el[e[0]].getBoundingClientRect(), b = el[e[1]].getBoundingClientRect();
       var x1 = a.left + a.width / 2 - R0.left, y1 = a.bottom - R0.top, x2 = b.left + b.width / 2 - R0.left, y2 = b.top - R0.top - 3;
       if(Math.abs(x1 - x2) > 4){ x1 = x1 + (x2 > x1 ? 1 : -1) * a.width * 0.25; x2 = x2 + (x2 > x1 ? -1 : 1) * b.width * 0.25; }
       html += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" style="stroke:var(--muted);stroke-width:1.8" marker-end="url(#vbnArr)"/>';
     });
     svg.innerHTML = html;
   }
   function update(){
     var p = infer(ev);
     N.forEach(function(nd){
       var b = el[nd.k], v = p[nd.k], e = ev[nd.k];
       b.className = "vbn-n" + (e === 1 ? " ev1" : e === 0 ? " ev0" : "");
       b.querySelector(".vbn-tag").textContent = e === null ? "? desconocido" : e ? "evidencia: sí" : "evidencia: no";
       b.querySelector(".vbn-p").innerHTML = pct(v, 0) + '<small>P(sí)</small>';
       b.querySelector(".vbn-bar i").style.width = (v * 100).toFixed(1) + "%";
       var d = post ? (v - post[nd.k]) * 100 : 0, dd = b.querySelector(".vbn-d");
       dd.className = "vbn-d" + (Math.abs(d) >= 0.5 && e === null ? (d > 0 ? " up" : " dn") : "");
       dd.textContent = e !== null ? "fijado por ti" : Math.abs(d) >= 0.5 ? (d > 0 ? "▲ +" : "▼ −") + fmt(Math.abs(d), 0) + " pp" : "sin cambios";
       b.setAttribute("aria-label", NAME[nd.k] + ": probabilidad de sí " + pct(v, 0) + (e === null ? "" : ", evidencia " + (e ? "sí" : "no")) + ". Pulsa para cambiar la evidencia.");
     });
     /* narrativa */
     var msg, pL0 = infer({L:null, O:null, U:null, T:null, R:null}).L;
     var only = function(k, v){ for(var q in ev) if(q !== k && ev[q] !== null) return false; return ev[k] === v; };
     if(ev.R === 1 && ev.O === 1 && ev.L === null){
       var pR = infer({L:null, O:null, U:ev.U, T:ev.T, R:1}).L;
       msg = "<b>Explaining away.</b> Con solo el retraso, P(Lluvia) era " + pct(pR, 0) + ". Al saber que hay obras, baja a <b>" + pct(p.L, 0) + "</b>: las obras ya explican el retraso, así que la lluvia «sobra» como explicación. Las dos causas compiten por explicar el mismo efecto.";
     } else if(only("R", 1)) msg = "Llegas tarde: la red razona del efecto a las causas. P(Tráfico) sube a " + pct(p.T, 0) + " y P(Lluvia) pasa de " + pct(pL0, 0) + " a <b>" + pct(p.L, 0) + "</b>. Ahora fija <b>Obras = sí</b> y mira qué le pasa a la lluvia.";
     else if(only("U", 1)) msg = "Se venden muchos paraguas: pista de que llueve (P(Lluvia) = " + pct(p.L, 0) + "), y la lluvia propaga la sospecha hacia el tráfico (" + pct(p.T, 0) + ") y el retraso (" + pct(p.R, 0) + ").";
     else if(ev.T !== null && ev.R === 1) msg = "Al fijar el <b>tráfico</b>, el retraso ya no aporta nada sobre la lluvia ni las obras: el tráfico «bloquea» el camino. Es la independencia condicional que codifican las flechas.";
     else if(ev.L === null && ev.O === null && ev.U === null && ev.T === null && ev.R === null) msg = "Sin evidencia, cada tarjeta muestra la probabilidad a priori. Pulsa «Llego tarde» o toca la tarjeta de Retraso.";
     else msg = "P(Lluvia) = " + pct(p.L, 0) + ", P(Obras) = " + pct(p.O, 0) + ", P(Tráfico) = " + pct(p.T, 0) + ". Cada cambio de evidencia recalcula todo el resto sumando las combinaciones compatibles.";
     read.innerHTML = '<span>P(Lluvia | evidencia) <b>' + pct(p.L, 1) + '</b></span><span>P(Obras | evidencia) <b>' + pct(p.O, 1) + '</b></span><span>P(Tráfico) <b>' + pct(p.T, 1) + '</b></span><span>P(Retraso) <b>' + pct(p.R, 1) + '</b></span><span class="ldiag">' + msg + '</span>';
     post = p;
     drawArrows();
   }
   ctlBtn(ctl, "Llego tarde (Retraso = sí)", function(){ ev = {L:null, O:null, U:null, T:null, R:1}; update(); }, true);
   ctlBtn(ctl, "…y además hay obras", function(){ ev = {L:null, O:1, U:null, T:null, R:1}; update(); });
   ctlBtn(ctl, "↺ Limpiar evidencia", function(){ ev = {L:null, O:null, U:null, T:null, R:null}; update(); });
   ctlCheck(ctl, "Mostrar tablas de probabilidad", false, function(v){ box.classList.toggle("cpt", v); drawArrows(); });
   var ro = new ResizeObserver(function(){ drawArrows(); }); ro.observe(box);
   update();
   return function(){ ro.disconnect(); };
 }});

/* ══ 9. HMM — REGÍMENES DE MERCADO CON VITERBI ═════════════════ */
VIZ.push({id:"v-hmm", model:"hmm", g:"model", ic:"", dim:"2D",
 t:"Regímenes ocultos: calma y estrés",
 q:"¿Cómo separa un modelo oculto de Markov los periodos tranquilos de los de crisis?",
 intro:"250 días de rendimientos de una cartera simulada. Por detrás hay un estado oculto: <b>calma</b> (volatilidad 0,7%) o <b>estrés</b> (2,2%), y cada día se sigue en el mismo estado con alta probabilidad. El algoritmo de <b>Viterbi</b> calcula de verdad la secuencia de estados más probable, combinando lo que dice cada día con la <b>persistencia</b> (probabilidad de seguir en el mismo estado). Las volatilidades se suponen conocidas (en la práctica las estima el algoritmo de Baum-Welch).",
 notice:["Con persistencia alta (0,95-0,99) Viterbi produce <b>bloques estables</b>: un día tranquilo dentro de una crisis no le hace cambiar de opinión.",
   "Cambia a <b>«punto a punto»</b> (cada día por separado, sin memoria): salta de régimen continuamente y los cambios se disparan. Es lo que hace un clustering que ignora el orden.",
   "Baja la persistencia a 0,5 y Viterbi se vuelve igual de errático: <b>la memoria del modelo de Markov</b> es lo que limpia el ruido."],
 models:["hmm","gmm","kmeans","arima"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 348, K = makeCanvas(stage, W, H, "Rendimientos diarios con el régimen real y el estimado por Viterbi"), ctx = K.ctx;
   var SIG = [0.7, 2.2], seed = 3, pStay = 0.97, method = "vit", showReal = true, X, Z, E;
   function gen(){
     var r = mulberry(seed * 7 + 1), z = 0; X = []; Z = [];
     for(var t = 0; t < 250; t++){ if(t > 0 && r() > (z ? 0.95 : 0.975)) z = 1 - z; Z.push(z); X.push(gauss(r) * SIG[z]); }
   }
   function lN(x, s){ return -Math.log(s) - 0.5 * x * x / (s * s); }
   function viterbi(p){
     var n = X.length, lp = Math.log(p), lq = Math.log(1 - p), D = [[Math.log(0.5) + lN(X[0], SIG[0]), Math.log(0.5) + lN(X[0], SIG[1])]], B = [[0, 0]];
     for(var t = 1; t < n; t++){ var d = [], b = [];
       for(var k = 0; k < 2; k++){ var a0 = D[t - 1][0] + (k === 0 ? lp : lq), a1 = D[t - 1][1] + (k === 1 ? lp : lq); d.push(Math.max(a0, a1) + lN(X[t], SIG[k])); b.push(a0 >= a1 ? 0 : 1); }
       D.push(d); B.push(b); }
     var s = [D[n - 1][0] >= D[n - 1][1] ? 0 : 1]; for(t = n - 1; t > 0; t--) s.unshift(B[t][s[0]]);
     return s;
   }
   function estimate(){ E = method === "vit" ? viterbi(pStay) : X.map(function(x){ return lN(x, SIG[1]) > lN(x, SIG[0]) ? 1 : 0; }); }
   var B0 = [76, 30, 662, 190];
   function runs(s){ var o = [], a = 0; for(var i = 1; i <= s.length; i++) if(i === s.length || s[i] !== s[a]){ o.push([a, i, s[a]]); a = i; } return o; }
   function draw(){
     K.clear();
     var A = axes(ctx, B0, [0, 250], [-7, 7], C, {yl:"rendimiento diario (%)", yt:[-6, -3, 0, 3, 6]});
     /* bandas del régimen estimado */
     var cw = B0[2] / 250;
     runs(E).forEach(function(rn){ if(rn[2]){ ctx.fillStyle = hexA(C.c[1], 0.16); ctx.fillRect(B0[0] + rn[0] * cw, B0[1] + 1, (rn[1] - rn[0]) * cw, B0[3] - 1); } });
     ctx.strokeStyle = C.ink; ctx.setLineDash([3, 3]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(B0[0], A.sy(0)); ctx.lineTo(B0[0] + B0[2], A.sy(0)); ctx.stroke(); ctx.setLineDash([]);
     for(t = 0; t < 250; t++){ var x = B0[0] + (t + 0.5) * cw, y = A.sy(Math.max(-7, Math.min(7, X[t])));
       ctx.strokeStyle = hexA(C.c[0], 0.85); ctx.lineWidth = Math.max(1.2, cw - 0.6); ctx.beginPath(); ctx.moveTo(x, A.sy(0)); ctx.lineTo(x, y); ctx.stroke(); }
     tx(ctx, "fondo naranja = días que el modelo etiqueta como «estrés»", B0[0] + 8, B0[1] + 16, {s:11, w:600, c:C.muted});
     /* tiras */
     var rows = [["Real", Z, showReal], ["Estimado", E, true]], sy0 = B0[1] + B0[3] + 16;
     rows.forEach(function(rw, k){
       var y = sy0 + k * 24; tx(ctx, rw[0], B0[0] - 8, y + 12, {s:11, w:600, c:C.text, a:"right"});
       if(!rw[2]){ rr(ctx, B0[0], y, B0[2], 16, 4); ctx.fillStyle = hexA(C.line, 0.6); ctx.fill(); tx(ctx, "oculto (actívalo abajo)", B0[0] + 8, y + 12, {s:11, c:C.muted}); return; }
       runs(rw[1]).forEach(function(rn){ ctx.fillStyle = rn[2] ? C.c[1] : hexA(C.c[0], 0.45); ctx.fillRect(B0[0] + rn[0] * cw, y, (rn[1] - rn[0]) * cw, 16); });
     });
     var ey = sy0 + 48; tx(ctx, "Errores", B0[0] - 8, ey + 12, {s:11, w:600, c:C.text, a:"right"});
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(B0[0], ey + 8); ctx.lineTo(B0[0] + B0[2], ey + 8); ctx.stroke();
     var ok = 0; for(t = 0; t < 250; t++){ if(E[t] === Z[t]) ok++; else if(showReal){ ctx.fillStyle = C.neg; ctx.fillRect(B0[0] + t * cw, ey, Math.max(2, cw), 16); } }
     if(!showReal) tx(ctx, "(se ven al mostrar el régimen real)", B0[0] + 8, ey + 12, {s:11, c:C.muted});
     [0, 50, 100, 150, 200, 250].forEach(function(d){ tx(ctx, d, A.sx(d), ey + 32, {s:11, c:C.muted, a:"center"}); });
     tx(ctx, "día", B0[0] + B0[2] / 2, ey + 48, {s:11, c:C.muted, a:"center"});
     var lx = B0[0] + B0[2] - 250, ly = ey + 48;
     ctx.fillStyle = hexA(C.c[0], 0.45); ctx.fillRect(lx, ly - 9, 12, 10); tx(ctx, "calma", lx + 16, ly, {s:11, c:C.text});
     ctx.fillStyle = C.c[1]; ctx.fillRect(lx + 66, ly - 9, 12, 10); tx(ctx, "estrés", lx + 82, ly, {s:11, c:C.text});
     ctx.fillStyle = C.neg; ctx.fillRect(lx + 136, ly - 9, 4, 10); tx(ctx, "✕ día mal etiquetado", lx + 144, ly, {s:11, c:C.text});
     /* lectura */
     var sw = function(s){ var n = 0; for(var i = 1; i < s.length; i++) if(s[i] !== s[i - 1]) n++; return n; };
     var nE = sw(E), nZ = sw(Z), acc = ok / 250;
     read.innerHTML = '<span>Días bien etiquetados <b>' + pct(acc, 0) + '</b></span><span>Cambios de régimen estimados <b>' + nE + '</b></span><span>Cambios reales <b>' + nZ + '</b></span><span>Días en estrés (estimado) <b>' + E.reduce(function(a, b){ return a + b; }, 0) + '</b></span>' +
       '<span class="ldiag">' + (method === "pp" ? "<b>Punto a punto</b>: cada día se clasifica solo por su tamaño. Un día tranquilo en plena crisis se etiqueta «calma» y viceversa: " + nE + " cambios frente a " + nZ + " reales. Para un gestor de riesgos esta señal es inservible." :
         pStay < 0.8 ? "Con persistencia " + fmt(pStay, 2) + " el modelo apenas tiene memoria: se comporta casi como el punto a punto y cambia de régimen " + nE + " veces." :
         "Viterbi con persistencia " + fmt(pStay, 3) + ": " + nE + " cambios (reales: " + nZ + ") y el " + pct(acc, 0) + " de días bien etiquetados. La persistencia exige pruebas sólidas (varios días agitados seguidos) antes de declarar un cambio de régimen.") + '</span>';
   }
   function all(){ estimate(); draw(); }
   ctlSeg(ctl, "Método", [["vit", "Viterbi (HMM)"], ["pp", "Punto a punto"]], method, function(v){ method = v; all(); });
   ctlSlider(ctl, "Persistencia: P(seguir en el mismo estado)", 0.5, 0.995, 0.005, pStay, function(v){ return fmt(v, 3); }, function(v){ pStay = v; all(); });
   ctlCheck(ctl, "Mostrar régimen real", showReal, function(v){ showReal = v; draw(); });
   ctlBtn(ctl, "Otra serie", function(){ seed++; gen(); all(); });
   gen(); all();
   return function(){};
 }});

/* ══ 10. Q-LEARNING — ROBOT DE ALMACÉN ══════════════════════════ */
VIZ.push({id:"v-qlearning", model:"qlearning", g:"model", ic:"", dim:"2D",
 t:"Q-Learning: un robot aprende el almacén",
 q:"¿Cómo aprende un agente la mejor ruta solo a base de premios y castigos?",
 intro:"Un robot debe llegar a la estantería del pedido (+10) sin pisar las zonas de carretillas (−10, fin del episodio); cada paso cuesta −1. No conoce el mapa: prueba, recibe recompensas y actualiza una tabla Q(estado, acción) con la regla de <b>Q-Learning</b>: Q ← Q + α·(r + γ·max Q(siguiente) − Q). Se ejecuta <b>de verdad</b>. La flecha de cada casilla es la mejor acción aprendida y el azul, su valor V = max Q.",
 notice:["Los primeros episodios son paseos largos y caóticos (recompensa muy negativa). El valor se propaga <b>hacia atrás</b> desde el, casilla a casilla, episodio a episodio.",
   "Sube <b>ε</b> (exploración) y el robot sigue tropezando con las carretillas aunque ya sepa el camino: la curva se queda más abajo. Con ε muy bajo puede quedarse con una ruta peor por no explorar.",
   "Con <b>γ</b> bajo el robot es «cortoplacista»: la recompensa lejana casi no cuenta y las casillas lejanas al objetivo apenas cogen valor."],
 models:["qlearning","sarsa","dqn","bandit"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 380, K = makeCanvas(stage, W, H, "Rejilla del almacén con la política aprendida y la curva de recompensa"), ctx = K.ctx;
   var MAP = [".......G", ".R..F.R.", ".R....R.", ".R.F..R.", "...F....", "S....F.."];
   var NR = 6, NC = 8, start = [5, 0], alpha = 0.5, gamma = 0.95, eps = 0.15, Q, eps_n, rewards, ep, stopL = null, mode = null, rng = mulberry(31);
   var DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];
   function cell(r, c){ return MAP[r].charAt(c); }
   function init(){ Q = []; for(var i = 0; i < NR * NC; i++) Q.push([0, 0, 0, 0]); rewards = []; eps_n = 0; ep = newEp(); }
   function newEp(){ return {s:start.slice(), ret:0, n:0, trail:[start.slice()], done:false}; }
   function greedy(q){ var m = Math.max.apply(null, q), b = []; q.forEach(function(v, a){ if(v === m) b.push(a); }); return b[Math.floor(rng() * b.length)]; }
   function envStep(s, a){
     var r = s[0] + DR[a], c = s[1] + DC[a];
     if(r < 0 || r >= NR || c < 0 || c >= NC || cell(r, c) === "R") return {s:s.slice(), r:-1, done:false};
     var ch = cell(r, c); if(ch === "G") return {s:[r, c], r:10, done:true}; if(ch === "F") return {s:[r, c], r:-10, done:true};
     return {s:[r, c], r:-1, done:false};
   }
   function step(e){
     var si = e.s[0] * NC + e.s[1], a = rng() < eps ? Math.floor(rng() * 4) : greedy(Q[si]), o = envStep(e.s, a), sj = o.s[0] * NC + o.s[1];
     var target = o.r + (o.done ? 0 : gamma * Math.max.apply(null, Q[sj]));
     Q[si][a] += alpha * (target - Q[si][a]);
     e.s = o.s; e.ret += o.r; e.n++; e.trail.push(o.s.slice());
     if(o.done || e.n >= 80){ e.done = true; rewards.push(e.ret); eps_n++; }
   }
   function runEpisode(){ var e = newEp(); while(!e.done) step(e); }
   function route(){ var s = start.slice(), path = [s.slice()], seen = {};
     for(var k = 0; k < 40; k++){ var si = s[0] * NC + s[1]; if(seen[si]) return {path:path, ok:false}; seen[si] = 1;
       var q = Q[si], m = Math.max.apply(null, q); if(q.every(function(v){ return v === 0; })) return {path:path, ok:false};
       var a = q.indexOf(m), o = envStep(s, a); s = o.s; path.push(s.slice()); if(o.done) return {path:path, ok:cell(s[0], s[1]) === "G"}; }
     return {path:path, ok:false}; }
   var GX = 24, GY = 40, CS = 48, RB = [478, 40, 258, 230];
   function draw(){
     K.clear();
     tx(ctx, "Almacén (6×8) · política aprendida", GX, 26, {s:13, w:700, c:C.ink});
     var vis = [], vmin = 1e9, vmax = -1e9;
     Q.forEach(function(q, i){ var v = q.some(function(x){ return x !== 0; }); vis.push(v); if(v){ var m = Math.max.apply(null, q); vmin = Math.min(vmin, m); vmax = Math.max(vmax, m); } });
     for(var r = 0; r < NR; r++) for(var c = 0; c < NC; c++){
       var x = GX + c * CS, y = GY + r * CS, ch = cell(r, c), i = r * NC + c;
       rr(ctx, x + 1.5, y + 1.5, CS - 3, CS - 3, 7);
       if(ch === "R"){ ctx.fillStyle = hexA(C.muted, 0.28); ctx.fill(); hatch(ctx, x + 4, y + 4, CS - 8, CS - 8, hexA(C.muted, 0.5), 7); continue; }
       if(ch === "F"){ ctx.fillStyle = hexA(C.neg, 0.12); ctx.fill(); hatch(ctx, x + 3, y + 3, CS - 6, CS - 6, hexA(C.neg, 0.45), 6); tx(ctx, "−10", x + CS / 2, y + CS / 2 + 5, {s:13, w:700, c:C.neg, a:"center"}); continue; }
       var t = vis[i] ? (Math.max.apply(null, Q[i]) - vmin) / Math.max(1e-9, vmax - vmin) : 0;
       ctx.fillStyle = vis[i] ? mixc(C.card, C.c[0], 0.08 + 0.72 * t) : C.card; ctx.fill(); ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.stroke();
       if(ch === "G"){ tx(ctx, "", x + CS / 2, y + CS / 2 + 2, {s:20, a:"center"}); tx(ctx, "+10", x + CS / 2, y + CS - 5, {s:11, w:700, c:t > 0.6 ? C.card : C.ink, a:"center"}); continue; }
       if(vis[i]){ var a = Q[i].indexOf(Math.max.apply(null, Q[i])), cx = x + CS / 2, cy = y + CS / 2, L = 11;
         var col = t > 0.6 ? C.card : hexA(C.ink, 0.75);
         ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - DC[a] * L, cy - DR[a] * L); ctx.lineTo(cx + DC[a] * L, cy + DR[a] * L); ctx.stroke();
         arrowHead(ctx, cx + DC[a] * (L + 3), cy + DR[a] * (L + 3), Math.atan2(DR[a], DC[a]), 8, col); }
     }
     /* ruta greedy */
     var rt = route();
     if(rt.ok){ ctx.strokeStyle = C.c[1]; ctx.lineWidth = 3.5; ctx.setLineDash([7, 5]); ctx.lineJoin = "round"; ctx.beginPath();
       rt.path.forEach(function(p, k){ var X = GX + p[1] * CS + CS / 2, Y = GY + p[0] * CS + CS / 2; k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); ctx.setLineDash([]); }
     /* rastro del episodio en curso */
     if(ep && ep.trail.length > 1){ ctx.strokeStyle = hexA(C.ink, 0.25); ctx.lineWidth = 2; ctx.beginPath();
       ep.trail.slice(-30).forEach(function(p, k){ var X = GX + p[1] * CS + CS / 2, Y = GY + p[0] * CS + CS / 2; k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); }
     tx(ctx, "S", GX + start[1] * CS + 6, GY + start[0] * CS + 14, {s:11, w:700, c:C.muted});
     var rp = ep && !ep.done ? ep.s : start; tx(ctx, "", GX + rp[1] * CS + CS / 2, GY + rp[0] * CS + CS / 2 + 8, {s:22, a:"center"});
     var ly = GY + NR * CS + 22;
     rr(ctx, GX, ly - 10, 12, 12, 3); ctx.fillStyle = C.c[0]; ctx.fill(); tx(ctx, "más valor (V = max Q)", GX + 17, ly, {s:11, c:C.text});
     ctx.strokeStyle = C.c[1]; ctx.lineWidth = 3; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(GX + 150, ly - 4); ctx.lineTo(GX + 176, ly - 4); ctx.stroke(); ctx.setLineDash([]);
     tx(ctx, "ruta aprendida", GX + 182, ly, {s:11, c:C.text});
     ctx.fillStyle = hexA(C.muted, 0.35); ctx.fillRect(GX + 276, ly - 10, 12, 12); tx(ctx, "estantería", GX + 293, ly, {s:11, c:C.text});
     /* curva */
     tx(ctx, "Recompensa por episodio", RB[0] - 24, 26, {s:13, w:700, c:C.ink});
     var n = rewards.length, xm = Math.max(50, n);
     var A = axes(ctx, RB, [0, xm], [-60, 5], C, {xl:"episodio", yt:[-60, -40, -20, 0], xt:[0, xm]});
     if(n){ ctx.save(); ctx.beginPath(); ctx.rect(RB[0], RB[1], RB[2], RB[3]); ctx.clip();
       ctx.strokeStyle = hexA(C.muted, 0.45); ctx.lineWidth = 1; ctx.beginPath(); rewards.forEach(function(v, k){ var X = A.sx(k + 1), Y = A.sy(Math.max(-62, v)); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke();
       var ma = movAvg(rewards, 20); ctx.strokeStyle = C.c[0]; ctx.lineWidth = 2.5; ctx.beginPath(); ma.forEach(function(v, k){ var X = A.sx(k + 1), Y = A.sy(Math.max(-62, v)); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke();
       ctx.restore(); }
     ctx.strokeStyle = C.ink; ctx.setLineDash([4, 3]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(RB[0], A.sy(-1)); ctx.lineTo(RB[0] + RB[2], A.sy(-1)); ctx.stroke(); ctx.setLineDash([]);
     tx(ctx, "óptimo (−1)", RB[0] + RB[2] - 4, A.sy(-1) - 5, {s:11, c:C.ink, a:"right"});
     tx(ctx, "— media de 20", RB[0] + 8, RB[1] + RB[3] - 22, {s:11, w:600, c:C.c[0]}); tx(ctx, "— cada episodio", RB[0] + 8, RB[1] + RB[3] - 8, {s:11, c:C.muted});
     /* lectura */
     var last = rewards.slice(-20), mean = last.length ? last.reduce(function(a, b){ return a + b; }, 0) / last.length : NaN;
     read.innerHTML = '<span>Episodios <b>' + n + '</b></span><span>Recompensa media (últimos 20) <b>' + (isNaN(mean) ? "—" : fmt(mean, 1)) + '</b></span><span>Ruta aprendida <b>' + (rt.ok ? (rt.path.length - 1) + " pasos" : "aún no llega") + '</b></span><span>Casillas exploradas <b>' + vis.filter(Boolean).length + '</b></span>' +
       '<span class="ldiag">' + (n === 0 ? "El robot aún no sabe nada: todas las Q valen 0. Pulsa «1 episodio» para verle dar tumbos o para entrenar." :
         !rt.ok ? "Todavía no hay una ruta completa: el valor del se está propagando hacia atrás. Sigue entrenando." :
         rt.path.length - 1 <= 12 ? "La política voraz (seguir siempre la flecha) ya lleva al por una ruta mínima de " + (rt.path.length - 1) + " pasos esquivando las carretillas. " + (eps > 0.05 ? "La media no llega al óptimo porque con ε = " + fmt(eps, 2) + " el robot sigue explorando a veces." : "") :
         "Llega, pero por una ruta de " + (rt.path.length - 1) + " pasos (la mínima es 12). Más episodios la irán acortando.") + '</span>';
   }
   function stopIt(){ if(stopL){ stopL(); stopL = null; } mode = null; }
   function animate(kind){ stopIt(); mode = kind; if(!ep || ep.done) ep = newEp(); var acc = 0;
     stopL = loop(function(){ var k = mode === "play" ? 2 : 1; acc++; if(mode === "one" && acc % 3) return;
       for(var j = 0; j < k; j++){ step(ep); if(ep.done){ if(mode === "one"){ stopIt(); pt.set(false); draw(); return; } ep = newEp(); } }
       if(mode === "play" && rewards.length >= 400){ stopIt(); pt.set(false); }
       draw(); }); }
   ctlBtn(ctl, "1 episodio", function(){ pt.set(false); animate("one"); });
   var pt = playToggle(ctl, "Entrenar", function(on){ if(on) animate("play"); else { stopIt(); draw(); } });
   ctlBtn(ctl, "100 episodios", function(){ stopIt(); pt.set(false); if(ep && !ep.done){ while(!ep.done) step(ep); } for(var k = 0; k < 100; k++) runEpisode(); ep = newEp(); draw(); });
   ctlBtn(ctl, "↺", function(){ stopIt(); pt.set(false); init(); draw(); });
   ctlSlider(ctl, "<span style=\"text-transform:none\">α</span> (ritmo de aprendizaje)", 0.05, 1, 0.05, alpha, function(v){ return fmt(v, 2); }, function(v){ alpha = v; });
   ctlSlider(ctl, "<span style=\"text-transform:none\">γ</span> (cuánto pesa el futuro)", 0.5, 0.99, 0.01, gamma, function(v){ return fmt(v, 2); }, function(v){ gamma = v; draw(); });
   ctlSlider(ctl, "<span style=\"text-transform:none\">ε</span> (probabilidad de explorar)", 0, 0.5, 0.01, eps, function(v){ return fmt(v, 2); }, function(v){ eps = v; draw(); });
   init(); draw();
   return function(){ stopIt(); };
 }});

/* ══ 11. SARSA frente a Q-LEARNING — EL ACANTILADO ═════════════ */
VIZ.push({id:"v-sarsa", model:"sarsa", g:"model", ic:"", dim:"2D",
 t:"SARSA frente a Q-Learning en el acantilado",
 q:"¿Por qué SARSA aprende un camino más prudente que Q-Learning?",
 intro:"El clásico de Sutton y Barto: ir de S a G en una rejilla 4×12; cada paso cuesta −1 y caer al <b>acantilado</b> cuesta −100 (y vuelves a S). Los dos agentes exploran igual (ε-voraz: con probabilidad ε hacen algo al azar), pero aprenden distinto: <b>Q-Learning</b> actualiza pensando en la mejor acción siguiente (aunque luego explore) y <b>SARSA</b> en la acción que de verdad va a tomar. Se entrenan <b>de verdad</b> 8 veces cada uno (α = 0,5) y se promedian las curvas.",
 notice:["<b>Q-Learning</b> aprende la ruta más corta, pegada al borde (13 pasos). Pero mientras explora, a veces da un paso en falso y cae: su recompensa media durante el aprendizaje es <b>peor</b>.",
   "<b>SARSA</b> «sabe» que va a seguir explorando, así que el borde le parece peligroso y aprende un camino por arriba, más largo pero seguro: <b>cobra más</b> mientras aprende.",
   "Baja ε a 0: sin exploración no hay pasos en falso y los dos acaban en la misma ruta óptima. La diferencia entre ambos es cómo tratan su propia exploración."],
 models:["sarsa","qlearning","dqn"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 416, K = makeCanvas(stage, W, H, "Rejilla del acantilado con las rutas aprendidas por SARSA y Q-Learning y sus curvas de recompensa"), ctx = K.ctx;
   var NR = 4, NC = 12, eps = 0.1, alpha = 0.5, RUNS = 8, MAXE = 500, agents, ep, stopL = null;
   var DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];
   function init(){
     agents = {q:[], s:[]}; ep = 0;
     ["q", "s"].forEach(function(k){ for(var i = 0; i < RUNS; i++){ var Q = []; for(var j = 0; j < NR * NC; j++) Q.push([0, 0, 0, 0]); agents[k].push({Q:Q, rw:[], rng:mulberry(100 + i * 7 + (k === "s" ? 3 : 0))}); } });
   }
   function envStep(r, c, a){ var nr = Math.max(0, Math.min(NR - 1, r + DR[a])), nc = Math.max(0, Math.min(NC - 1, c + DC[a]));
     if(nr === 3 && nc > 0 && nc < 11) return {r:3, c:0, rew:-100, done:false};
     return {r:nr, c:nc, rew:-1, done:nr === 3 && nc === 11}; }
   function pick(ag, s){ if(ag.rng() < eps) return Math.floor(ag.rng() * 4); var q = ag.Q[s], m = Math.max.apply(null, q), b = []; q.forEach(function(v, a){ if(v === m) b.push(a); }); return b[Math.floor(ag.rng() * b.length)]; }
   function episode(ag, sarsa){
     var r = 3, c = 0, s = 36, a = pick(ag, s), ret = 0;
     for(var n = 0; n < 2000; n++){
       var o = envStep(r, c, a), s2 = o.r * NC + o.c; ret += o.rew;
       var a2 = pick(ag, s2), next = o.done ? 0 : sarsa ? ag.Q[s2][a2] : Math.max.apply(null, ag.Q[s2]);
       ag.Q[s][a] += alpha * (o.rew + next - ag.Q[s][a]);
       r = o.r; c = o.c; s = s2; a = a2; if(o.done) break;
     }
     ag.rw.push(ret);
   }
   function route(ag){ var r = 3, c = 0, p = [[3, 0]], seen = {};
     for(var k = 0; k < 40; k++){ var s = r * NC + c; if(seen[s]) break; seen[s] = 1; var q = ag.Q[s], a = q.indexOf(Math.max.apply(null, q)), o = envStep(r, c, a);
       if(o.rew === -100){ p.push([3, Math.max(1, c)]); return {p:p, ok:false, fall:true}; }
       r = o.r; c = o.c; p.push([r, c]); if(o.done) return {p:p, ok:true}; }
     return {p:p, ok:false}; }
   function curve(k){ var out = []; for(var e = 0; e < ep; e++){ var s = 0; agents[k].forEach(function(ag){ s += Math.max(-100, ag.rw[e]); }); out.push(s / RUNS); } return movAvg(out, 20); }
   var GX = 68, GY = 40, CS = 52;
   function draw(){
     K.clear();
     tx(ctx, "El acantilado (4×12) · ruta voraz aprendida por cada agente", GX, 26, {s:13, w:700, c:C.ink});
     for(var r = 0; r < NR; r++) for(var c = 0; c < NC; c++){ var x = GX + c * CS, y = GY + r * CS;
       rr(ctx, x + 1.5, y + 1.5, CS - 3, CS - 3, 7);
       if(r === 3 && c > 0 && c < 11){ ctx.fillStyle = hexA(C.neg, 0.1); ctx.fill(); hatch(ctx, x + 3, y + 3, CS - 6, CS - 6, hexA(C.neg, 0.4), 7); }
       else { ctx.fillStyle = C.card; ctx.fill(); ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.stroke(); } }
     ctx.font = "700 12px " + LABFONT; var lab = "acantilado: −100 y vuelta a S", lw = ctx.measureText(lab).width + 14;
     rr(ctx, GX + 6 * CS - lw / 2, GY + 3 * CS + CS / 2 - 11, lw, 22, 6); ctx.fillStyle = C.card; ctx.fill();
     tx(ctx, lab, GX + 6 * CS, GY + 3 * CS + CS / 2 + 4, {s:12, w:700, c:C.neg, a:"center"});
     var R = {};
     [["q", C.c[0], -5], ["s", C.c[1], 5]].forEach(function(d){
       if(!ep) return; var rt = route(agents[d[0]][0]); R[d[0]] = rt;
       ctx.strokeStyle = d[1]; ctx.lineWidth = 4; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.beginPath();
       rt.p.forEach(function(p, k){ var X = GX + p[1] * CS + CS / 2 + d[2], Y = GY + p[0] * CS + CS / 2 + d[2]; k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); ctx.lineCap = "butt";
       var e = rt.p[rt.p.length - 1]; dot(ctx, GX + e[1] * CS + CS / 2 + d[2], GY + e[0] * CS + CS / 2 + d[2], 5, d[1], C.card);
     });
     tx(ctx, "S", GX + 8, GY + 3 * CS + 18, {s:14, w:700, c:C.ink});
     tx(ctx, "G", GX + 11 * CS + CS - 8, GY + 3 * CS + 18, {s:14, w:700, c:C.ink, a:"right"});
     /* curvas */
     var B = [GX, 292, NC * CS, 88];
     tx(ctx, "Recompensa por episodio (media de 8 ejecuciones, suavizada)", GX, 280, {s:12, w:700, c:C.ink});
     var A = axes(ctx, B, [0, MAXE], [-100, 0], C, {xl:"episodio", yl:"recompensa", xt:[0, 100, 200, 300, 400, 500], yt:[-100, -50, 0]});
     var cq = curve("q"), cs = curve("s");
     [[cq, C.c[0], "Q-Learning"], [cs, C.c[1], "SARSA"]].forEach(function(s, k){
       if(!s[0].length) return; ctx.strokeStyle = s[1]; ctx.lineWidth = 2.4; ctx.beginPath();
       s[0].forEach(function(v, i){ var X = A.sx(i + 1), Y = A.sy(v); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); });
     var lx = GX + NC * CS - 180;
     ctx.fillStyle = C.c[0]; ctx.fillRect(lx, 274, 18, 4); tx(ctx, "Q-Learning", lx + 24, 280, {s:11, w:700, c:C.c[0]});
     ctx.fillStyle = C.c[1]; ctx.fillRect(lx + 110, 274, 18, 4); tx(ctx, "SARSA", lx + 134, 280, {s:11, w:700, c:C.c[1]});
     /* lectura */
     function last(k){ var s = 0, n = 0; agents[k].forEach(function(ag){ ag.rw.slice(-50).forEach(function(v){ s += v; n++; }); }); return n ? s / n : NaN; }
     var mq = last("q"), ms = last("s"), lq = R.q && R.q.ok ? R.q.p.length - 1 : null, ls = R.s && R.s.ok ? R.s.p.length - 1 : null;
     read.innerHTML = '<span>Episodios <b>' + ep + ' / ' + MAXE + '</b></span><span>Recompensa media (últimos 50) · Q-Learning <b>' + (isNaN(mq) ? "—" : fmt(mq, 1)) + '</b></span><span>· SARSA <b>' + (isNaN(ms) ? "—" : fmt(ms, 1)) + '</b></span>' +
       '<span>Ruta Q-Learning <b>' + (lq ? lq + " pasos" : "—") + '</b></span><span>Ruta SARSA <b>' + (ls ? ls + " pasos" : "—") + '</b></span>' +
       '<span class="ldiag">' + (ep < 40 ? "Aprendiendo: al principio los dos caen mucho por el acantilado." :
         eps === 0 ? "Sin exploración (ε = 0) ninguno da pasos al azar: los dos convergen a rutas igual de buenas y cobran lo mismo." :
         "Q-Learning ha aprendido la ruta " + (lq && ls && lq < ls ? "más corta (" + lq + " pasos, por el borde)" : "por el borde") + ", pero con ε = " + fmt(eps, 2) + " cobra de media " + fmt(mq, 1) + " porque sus pasos al azar lo tiran al vacío. SARSA va por arriba" + (ls ? " (" + ls + " pasos)" : "") + " y cobra " + fmt(ms, 1) + ": aprende la política que mejor funciona <b>explorando</b>.") + '</span>';
   }
   function start(){ stop(); if(ep >= MAXE) init(); stopL = loop(function(){ for(var k = 0; k < 4 && ep < MAXE; k++){ agents.q.forEach(function(ag){ episode(ag, false); }); agents.s.forEach(function(ag){ episode(ag, true); }); ep++; } draw(); if(ep >= MAXE){ stop(); pt.set(false); } }); }
   function stop(){ if(stopL){ stopL(); stopL = null; } }
   var pt = playToggle(ctl, "Entrenar", function(on){ if(on) start(); else stop(); });
   ctlBtn(ctl, "↺ Reiniciar", function(){ init(); draw(); pt.set(true); start(); });
   ctlSlider(ctl, '<span style="text-transform:none">ε</span> (probabilidad de explorar) · reinicia', 0, 0.3, 0.01, eps, function(v){ return fmt(v, 2); }, function(v){ eps = v; init(); draw(); pt.set(true); start(); });
   init(); draw(); pt.set(true); start();
   return function(){ stop(); };
 }});

/* ══ 12. DQN — TABLA FRENTE A RED, REPLAY BUFFER Y RED OBJETIVO ═ */
VIZ.push({id:"v-dqn", model:"dqn", g:"model", ic:"", dim:"2D",
 t:"DQN: de la tabla a la función que generaliza",
 q:"¿Por qué una red neuronal sustituye a la tabla Q cuando los estados son continuos?",
 intro:"Un carrito en un valle (el clásico <i>Mountain Car</i>, con su física real) tiene un estado <b>continuo</b>: posición y velocidad. A la izquierda, una tabla que trocea ese estado en 12×12 casillas: solo sabe algo de las casillas visitadas. A la derecha, un aproximador (una regresión con 49 funciones de base radial, el papel que hace la red en DQN) que <b>rellena todo el mapa</b>. Ambos aprenden de verdad del mismo <b>replay buffer</b> con minibatches al azar y una <b>red objetivo</b> congelada. Simplificación didáctica: aprendemos el valor V(s) de la conducta exploradora en vez de Q(s, a) para cada acción.",
 notice:["La tabla tiene <b>huecos</b> (casillas rayadas): estados que el carrito nunca ha pisado y de los que no sabe nada. El aproximador da un valor en todas partes porque estados parecidos tienen valores parecidos: <b>generaliza</b>.",
   "El <b>replay buffer</b> guarda miles de transiciones y el minibatch (▼) se sortea por toda la cinta: así el modelo no aprende solo de los últimos pasos, que están muy correlacionados entre sí.",
   "La <b>red objetivo</b> calcula los objetivos r + γ·V(s′) con una copia congelada que solo se sincroniza cada 100 actualizaciones: sin ella el modelo perseguiría su propia cola y el aprendizaje sería inestable."],
 models:["dqn","qlearning","mlp"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 396, K = makeCanvas(stage, W, H, "Tabla Q discretizada con huecos frente a mapa continuo aproximado, replay buffer y red objetivo"), ctx = K.ctx;
   var XR = [-1.2, 0.6], VR = [-0.07, 0.07], G = 0.95, CAP = 3000, BATCH = 32, SYNC = 100, NB = 7, total = 0;
   var rng, car, buf, wpos, w, wT, tab, tabN, upd, syncs, lastBatch, recent, stopL = null, epN;
   function feat(x, v){ var u = (x - XR[0]) / (XR[1] - XR[0]), q = (v - VR[0]) / (VR[1] - VR[0]), f = [1];
     for(var i = 0; i < NB; i++) for(var j = 0; j < NB; j++){ var du = u - i / (NB - 1), dq = q - j / (NB - 1); f.push(Math.exp(-(du * du + dq * dq) / (2 * 0.1 * 0.1))); } return f; }
   function V(wv, x, v){ var f = feat(x, v), s = 0; for(var i = 0; i < f.length; i++) s += wv[i] * f[i]; return s; }
   function cellOf(x, v){ return Math.min(11, Math.floor((x - XR[0]) / (XR[1] - XR[0]) * 12)) * 12 + Math.min(11, Math.floor((v - VR[0]) / (VR[1] - VR[0]) * 12)); }
   function init(){ rng = mulberry(42); buf = []; wpos = 0; w = new Array(NB * NB + 1).fill(0); w[0] = -20; wT = w.slice(); tab = new Array(144).fill(-20); total = 0; tabN = new Array(144).fill(0); upd = 0; syncs = 0; lastBatch = []; recent = []; epN = 0; reset(); }
   function reset(){ car = {x:-0.6 + rng() * 0.2, v:0, n:0}; epN++; }
   function envStep(){
     var a = rng() < 0.35 ? Math.floor(rng() * 3) : (car.v >= 0 ? 2 : 0);
     var v = Math.max(VR[0], Math.min(VR[1], car.v + 0.001 * (a - 1) - 0.0025 * Math.cos(3 * car.x))), x = car.x + v;
     if(x < XR[0]){ x = XR[0]; v = 0; } var done = x >= 0.5; if(done) x = 0.5;
     var tr = [car.x, car.v, -1, x, v, done]; if(buf.length < CAP) buf.push(tr); else buf[wpos] = tr; wpos = (wpos + 1) % CAP;
     total++; recent.push([car.x, car.v]); if(recent.length > 80) recent.shift();
     car.x = x; car.v = v; car.n++; if(done || car.n > 400) reset();
   }
   function train(){
     if(buf.length < 200) return; lastBatch = [];
     for(var b = 0; b < BATCH; b++){ var i = Math.floor(rng() * buf.length), t = buf[i]; lastBatch.push(i);
       var target = t[2] + (t[5] ? 0 : G * V(wT, t[3], t[4])), f = feat(t[0], t[1]), pred = 0;
       for(var k = 0; k < f.length; k++) pred += w[k] * f[k];
       var err = target - pred; for(k = 0; k < f.length; k++) w[k] += 0.08 * err * f[k];
       var c = cellOf(t[0], t[1]), tt = t[2] + (t[5] ? 0 : G * tab[cellOf(t[3], t[4])]); tab[c] += 0.2 * (tt - tab[c]); tabN[c]++; }
     upd++; if(upd % SYNC === 0){ wT = w.slice(); syncs++; }
   }
   var LB = [62, 46, 300, 190], RB = [432, 46, 300, 190], VMIN = -20;
   var off = document.createElement("canvas"); off.width = 60; off.height = 38; var octx = off.getContext("2d");
   var cBg = rgbOf(C.card), cP = rgbOf(C.c[0]);
   function colV(v){ var t = Math.max(0, Math.min(1, (v - VMIN) / -VMIN)); return mixc(C.card, C.c[0], 0.06 + 0.88 * t); }
   function frame(B, title, sub){
     tx(ctx, title, B[0], 22, {s:13, w:700, c:C.ink}); tx(ctx, sub, B[0], 38, {s:11, c:C.muted});
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(B[0] + .5, B[1] + .5, B[2], B[3]);
     tx(ctx, "posición →", B[0] + B[2], B[1] + B[3] + 15, {s:11, c:C.muted, a:"right"}); tx(ctx, "−1,2", B[0], B[1] + B[3] + 15, {s:11, c:C.muted});
     ctx.save(); ctx.translate(B[0] - 10, B[1] + B[3] / 2); ctx.rotate(-Math.PI / 2); tx(ctx, "velocidad →", 0, 0, {s:11, c:C.muted, a:"center"}); ctx.restore();
   }
   function draw(){
     K.clear();
     frame(LB, "Tabla discretizada (12×12)", "solo sabe de las casillas visitadas");
     var cw = LB[2] / 12, ch = LB[3] / 12, empty = 0;
     for(var i = 0; i < 12; i++) for(var j = 0; j < 12; j++){ var c = i * 12 + j, X = LB[0] + i * cw, Y = LB[1] + LB[3] - (j + 1) * ch;
       if(!tabN[c]){ empty++; hatch(ctx, X + 1, Y + 1, cw - 2, ch - 2, hexA(C.muted, 0.35), 5); }
       else { ctx.fillStyle = colV(tab[c]); ctx.fillRect(X + 0.5, Y + 0.5, cw - 1, ch - 1); } }
     ctx.fillStyle = hexA(C.ink, 0.6); recent.forEach(function(p){ ctx.fillRect(LB[0] + (p[0] - XR[0]) / (XR[1] - XR[0]) * LB[2] - 1, LB[1] + LB[3] - (p[1] - VR[0]) / (VR[1] - VR[0]) * LB[3] - 1, 2, 2); });
     frame(RB, "Aproximador (el papel de la red)", "da un valor en todo el espacio de estados");
     var img = octx.createImageData(60, 38);
     for(var gy = 0; gy < 38; gy++) for(var gx = 0; gx < 60; gx++){ var x = XR[0] + (gx + 0.5) / 60 * (XR[1] - XR[0]), v = VR[1] - (gy + 0.5) / 38 * (VR[1] - VR[0]);
       var t = 0.06 + 0.88 * Math.max(0, Math.min(1, (V(w, x, v) - VMIN) / -VMIN)), k = (gy * 60 + gx) * 4;
       img.data[k] = cBg[0] + (cP[0] - cBg[0]) * t; img.data[k + 1] = cBg[1] + (cP[1] - cBg[1]) * t; img.data[k + 2] = cBg[2] + (cP[2] - cBg[2]) * t; img.data[k + 3] = 255; }
     octx.putImageData(img, 0, 0); ctx.imageSmoothingEnabled = true; ctx.drawImage(off, RB[0] + 1, RB[1] + 1, RB[2] - 1, RB[3] - 1);
     /* coche actual */
     [LB, RB].forEach(function(B){ dot(ctx, B[0] + (car.x - XR[0]) / (XR[1] - XR[0]) * B[2], B[1] + B[3] - (car.v - VR[0]) / (VR[1] - VR[0]) * B[3], 5, C.c[1], C.card); });
     /* leyenda de color */
     var gx0 = RB[0] + RB[2] - 150, gy0 = 262;
     for(var s = 0; s < 60; s++){ ctx.fillStyle = colV(VMIN - VMIN * s / 59); ctx.fillRect(gx0 + s * 2, gy0, 2, 8); }
     tx(ctx, "lejos de la meta", gx0 - 6, gy0 + 8, {s:11, c:C.muted, a:"right"}); tx(ctx, "cerca", gx0 + 126, gy0 + 8, {s:11, c:C.muted});
     dot(ctx, LB[0] + 5, gy0 + 4, 4.5, C.c[1], C.card); tx(ctx, "estado actual del carrito · puntos = últimos 80 estados", LB[0] + 14, gy0 + 8, {s:11, c:C.text});
     /* cinta del replay buffer */
     var TB = [62, 308, 670, 22], bins = 134, bw = TB[2] / bins;
     tx(ctx, "Replay buffer: " + fmtN(buf.length) + " / " + fmtN(CAP) + " transiciones (s, a, r, s′)", TB[0], 296, {s:12, w:700, c:C.ink});
     for(var b2 = 0; b2 < bins; b2++){ var full = b2 * CAP / bins < buf.length; ctx.fillStyle = full ? hexA(C.c[0], 0.38) : hexA(C.line, 0.7); ctx.fillRect(TB[0] + b2 * bw, TB[1], bw - 0.6, TB[3]); }
     var wp = TB[0] + (buf.length < CAP ? buf.length : wpos) / CAP * TB[2]; ctx.fillStyle = C.ink; ctx.fillRect(wp - 1, TB[1] - 4, 2, TB[3] + 8);
     tx(ctx, "escribe aquí", Math.min(wp + 4, TB[0] + TB[2] - 60), TB[1] + TB[3] + 14, {s:11, c:C.muted});
     lastBatch.forEach(function(i){ var X = TB[0] + i / CAP * TB[2]; ctx.fillStyle = C.c[1]; ctx.beginPath(); ctx.moveTo(X - 4, TB[1] - 9); ctx.lineTo(X + 4, TB[1] - 9); ctx.lineTo(X, TB[1] - 2); ctx.closePath(); ctx.fill(); });
     tx(ctx, "▼ minibatch de " + BATCH + " sorteadas", TB[0] + TB[2], 296, {s:11, w:600, c:C.c[1], a:"right"});
     /* red objetivo */
     var since = upd % SYNC, PB = [62, 374, 260, 8];
     tx(ctx, "Red objetivo: sincronizada " + syncs + (syncs === 1 ? " vez" : " veces") + " · próxima en " + (SYNC - since) + " actualizaciones", PB[0], 366, {s:12, w:700, c:C.ink});
     rr(ctx, PB[0], PB[1], PB[2], PB[3], 4); ctx.fillStyle = hexA(C.line, 0.9); ctx.fill();
     rr(ctx, PB[0], PB[1], Math.max(4, PB[2] * since / SYNC), PB[3], 4); ctx.fillStyle = C.c[0]; ctx.fill();
     tx(ctx, "objetivo = r + γ·V_objetivo(s′), con γ = 0,95", PB[0] + PB[2] + 16, PB[1] + 8, {s:11, c:C.muted});
     read.innerHTML = '<span>Transiciones vistas <b>' + fmtN(total) + '</b></span><span>Episodios <b>' + (epN - 1) + '</b></span><span>Actualizaciones <b>' + fmtN(upd) + '</b></span>' +
       '<span>Casillas de la tabla vacías <b>' + empty + ' de 144 (' + pct(empty / 144, 0) + ')</b></span><span>Sincronizaciones <b>' + syncs + '</b></span>' +
       '<span class="ldiag">' + (buf.length < 200 ? "Llenando el buffer: el aprendizaje empieza cuando hay al menos 200 transiciones guardadas." :
         "La tabla sigue sin saber nada del " + pct(empty / 144, 0) + " de las casillas (rayadas); el aproximador da un valor en todo el mapa con solo " + (NB * NB + 1) + " parámetros. Con un estado de cientos de variables (por ejemplo, los píxeles de una pantalla) la tabla sería imposible: por eso DQN usa una red.") + '</span>';
   }
   function start(){ stop(); stopL = loop(function(){ for(var k = 0; k < 24; k++){ envStep(); train(); } draw(); if(upd >= 12000){ stop(); pt.set(false); } }); }
   function stop(){ if(stopL){ stopL(); stopL = null; } }
   var pt = playToggle(ctl, "Simular", function(on){ if(on) start(); else stop(); });
   ctlBtn(ctl, "+2.000 pasos", function(){ for(var k = 0; k < 2000; k++){ envStep(); train(); } draw(); });
   ctlBtn(ctl, "↺ Reiniciar", function(){ init(); draw(); });
   init(); draw(); pt.set(true); start();
   return function(){ stop(); };
 }});

/* ══ 13. PPO — EL OBJETIVO RECORTADO ═══════════════════════════ */
VIZ.push({id:"v-ppo", model:"ppo", g:"model", ic:"", dim:"2D",
 t:"PPO: aprender sin dar saltos",
 q:"¿Para qué sirve el «recorte» del objetivo de PPO?",
 intro:"PPO mejora una política (probabilidades de cada acción) mirando el <b>ratio</b> r = π<sub>nuevo</sub>/π<sub>viejo</sub>: cuánto más (o menos) probable es ahora una acción que antes. Su objetivo L<sup>CLIP</sup> = mín(r·A, recorte(r, 1−ε, 1+ε)·A) deja de premiar los cambios en cuanto r sale de la franja [1−ε, 1+ε]. A la derecha, una política de 3 acciones para un cliente; la acción «Descuento» tuvo una <b>ventaja</b> A grande. Cada iteración hace 10 pasos de gradiente reales sobre el mismo lote, <b>con</b> y <b>sin</b> recorte en paralelo.",
 notice:["Con A &gt; 0 la curva con recorte se vuelve <b>plana</b> a partir de r = 1+ε: ahí el gradiente es 0 y no hay incentivo para cambiar más. Sin recorte la recompensa crece sin límite con r.",
   "Con A &gt; 0, pulsa «Aplicar 5 actualizaciones»: <b>sin recorte</b> la política salta de golpe y casi colapsa en «Descuento» desde la primera iteración; <b>con recorte</b> avanza a pasos acotados (cada iteración multiplica su probabilidad por ≈ 1+ε).",
   "Sube ε: los pasos con recorte son más grandes (aprende más rápido pero con más riesgo). ε ≈ 0,1-0,2 es el valor habitual."],
 models:["ppo","dqn","qlearning"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 404, K = makeCanvas(stage, W, H, "Objetivo recortado de PPO en función del ratio y política de tres acciones con y sin recorte"), ctx = K.ctx;
   var eps = 0.2, sgn = 1, AMAG = 2, LR = 0.1, KSTEP = 10, ACT = ["Descuento", "Envío gratis", "Nada"];
   var th0 = [0, 0.2, 0.4], P, hist, iter, queue = 0, stopL = null;
   function soft(t){ var m = Math.max.apply(null, t), e = t.map(function(v){ return Math.exp(v - m); }), s = e.reduce(function(a, b){ return a + b; }, 0); return e.map(function(v){ return v / s; }); }
   function init(){ P = {c:{th:th0.slice(), old:soft(th0), r:1}, u:{th:th0.slice(), old:soft(th0), r:1}}; hist = {c:[soft(th0)[0]], u:[soft(th0)[0]]}; iter = 0; }
   function iterate(k, clip){
     var p = P[k], A = sgn * AMAG; p.old = soft(p.th); var po = p.old[0];
     for(var s = 0; s < KSTEP; s++){ var pi = soft(p.th), r = pi[0] / po;
       var active = !clip || !((A > 0 && r > 1 + eps) || (A < 0 && r < 1 - eps));
       if(active) for(var j = 0; j < 3; j++) p.th[j] += LR * A * r * ((j === 0 ? 1 : 0) - pi[j]); }
     p.r = soft(p.th)[0] / po; hist[k].push(soft(p.th)[0]);
   }
   var LB = [64, 46, 290, 250];
   function draw(){
     K.clear(); var A = sgn;
     tx(ctx, "Objetivo L(r) para una ventaja A " + (sgn > 0 ? "> 0" : "< 0"), LB[0] - 30, 24, {s:13, w:700, c:C.ink});
     var yr = sgn > 0 ? [-0.1, 2.1] : [-2.1, 0.1];
     var Ax = axes(ctx, LB, [0, 2], yr, C, {xl:"r = π nuevo / π viejo", yl:"L (en unidades de |A|)", xt:[0, 0.5, 1, 1.5, 2], yt:sgn > 0 ? [0, 1, 2] : [-2, -1, 0]});
     ctx.fillStyle = hexA(C.c[0], 0.1); ctx.fillRect(Ax.sx(1 - eps), LB[1] + 1, Ax.sx(1 + eps) - Ax.sx(1 - eps), LB[3] - 1);
     var fx0 = sgn > 0 ? Ax.sx(1 + eps) : LB[0] + 1, fx1 = sgn > 0 ? LB[0] + LB[2] - 1 : Ax.sx(1 - eps);
     hatch(ctx, fx0, LB[1] + 1, fx1 - fx0, LB[3] - 1, hexA(C.muted, 0.18), 8);
     ctx.strokeStyle = C.ink; ctx.setLineDash([3, 3]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Ax.sx(1), LB[1]); ctx.lineTo(Ax.sx(1), LB[1] + LB[3]); ctx.stroke(); ctx.setLineDash([]);
     var lab = "zona plana: gradiente 0", lx = (fx0 + fx1) / 2;
     ctx.font = "600 11px " + LABFONT; var lw = ctx.measureText(lab).width + 10, ly = LB[1] + LB[3] - 30;
     rr(ctx, lx - lw / 2, ly - 12, lw, 17, 5); ctx.fillStyle = C.card; ctx.fill(); tx(ctx, lab, lx, ly, {s:11, w:600, c:C.muted, a:"center"});
     tx(ctx, "1−ε", Ax.sx(1 - eps), LB[1] - 4, {s:11, c:C.muted, a:"center"}); tx(ctx, "1+ε", Ax.sx(1 + eps), LB[1] - 4, {s:11, c:C.muted, a:"center"});
     ctx.save(); ctx.beginPath(); ctx.rect(LB[0], LB[1], LB[2], LB[3]); ctx.clip();
     ctx.strokeStyle = C.c[1]; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(Ax.sx(0), Ax.sy(0)); ctx.lineTo(Ax.sx(2), Ax.sy(2 * A)); ctx.stroke(); ctx.setLineDash([]);
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 3.2; ctx.beginPath();
     for(var i = 0; i <= 200; i++){ var r = i / 100, L = Math.min(r * A, Math.max(1 - eps, Math.min(1 + eps, r)) * A); i ? ctx.lineTo(Ax.sx(r), Ax.sy(L)) : ctx.moveTo(Ax.sx(r), Ax.sy(L)); }
     ctx.stroke();
     [["u", C.c[1]], ["c", C.c[0]]].forEach(function(d){ if(!iter) return; var r = P[d[0]].r, L = d[0] === "c" ? Math.min(r * A, Math.max(1 - eps, Math.min(1 + eps, r)) * A) : r * A;
       var X = Ax.sx(Math.min(2, r)), Y = Ax.sy(Math.max(yr[0], Math.min(yr[1], L))); dot(ctx, X, Y, 6, d[1], C.card); if(r > 2) tx(ctx, "r = " + fmt(r, 1) + " →", X - 8, Y + (sgn > 0 ? 18 : -10), {s:11, w:700, c:d[1], a:"right"}); });
     ctx.restore();
     var gy = LB[1] + LB[3] + 46;
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(LB[0] - 30, gy - 4); ctx.lineTo(LB[0] - 8, gy - 4); ctx.stroke(); tx(ctx, "con recorte (Lᶜˡⁱᵖ)", LB[0] - 2, gy, {s:11, c:C.text});
     ctx.strokeStyle = C.c[1]; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(LB[0] + 130, gy - 4); ctx.lineTo(LB[0] + 152, gy - 4); ctx.stroke(); ctx.setLineDash([]); tx(ctx, "sin recorte (r·A)", LB[0] + 158, gy, {s:11, c:C.text});
     tx(ctx, "● = r tras la última iteración · banda = [1−ε, 1+ε]", LB[0] - 30, gy + 18, {s:11, c:C.muted});
     /* política */
     var RX = 430;
     tx(ctx, "Política: P(acción) para un cliente", RX, 24, {s:13, w:700, c:C.ink});
     [["c", "Con recorte", C.c[0], 50], ["u", "Sin recorte", C.c[1], 158]].forEach(function(g){
       var p = soft(P[g[0]].th), old = P[g[0]].old;
       tx(ctx, g[1], RX, g[3] + 4, {s:12, w:700, c:g[2]});
       if(iter) tx(ctx, "r(Descuento) = " + fmt(P[g[0]].r, 2), RX + 300, g[3] + 4, {s:11, w:600, c:C.text, a:"right"});
       p.forEach(function(v, j){ var y = g[3] + 14 + j * 28, bx = RX + 92, bw = 170;
         tx(ctx, ACT[j], RX, y + 13, {s:11, c:C.text});
         rr(ctx, bx, y + 2, bw, 16, 4); ctx.fillStyle = hexA(C.line, 0.8); ctx.fill();
         rr(ctx, bx, y + 2, Math.max(3, bw * v), 16, 4); ctx.fillStyle = hexA(g[2], j === 0 ? 1 : 0.55); ctx.fill();
         ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.setLineDash([3, 2]); ctx.beginPath(); ctx.moveTo(bx + bw * old[j], y - 1); ctx.lineTo(bx + bw * old[j], y + 21); ctx.stroke(); ctx.setLineDash([]);
         tx(ctx, pct(v, 0), bx + bw + 8, y + 15, {s:12, w:700, c:C.ink}); });
     });
     tx(ctx, "- - = probabilidad antes de la última iteración (π viejo)", RX, 262, {s:11, c:C.muted});
     var HB = [RX + 34, 290, 276, 62], n = Math.max(5, hist.c.length - 1);
     tx(ctx, "P(Descuento) por iteración", RX, 282, {s:11, w:700, c:C.ink});
     var Ah = axes(ctx, HB, [0, n], [0, 1], C, {xl:"iteración", yt:[0, 1], xt:[0, n]});
     [["u", C.c[1], [5, 3]], ["c", C.c[0], []]].forEach(function(d){ ctx.strokeStyle = d[1]; ctx.lineWidth = 2.2; ctx.setLineDash(d[2]); ctx.beginPath();
       hist[d[0]].forEach(function(v, k){ var X = Ah.sx(k), Y = Ah.sy(v); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); ctx.setLineDash([]);
       hist[d[0]].forEach(function(v, k){ dot(ctx, Ah.sx(k), Ah.sy(v), 2.8, d[1]); }); });
     /* lectura */
     var pc = soft(P.c.th)[0], pu = soft(P.u.th)[0];
     read.innerHTML = '<span>Iteraciones <b>' + iter + '</b></span><span>Ventaja de «Descuento» <b>A = ' + (sgn > 0 ? "+" : "−") + AMAG + '</b></span><span>P(Descuento) con recorte <b>' + pct(pc, 0) + '</b> (r último ' + fmt(P.c.r, 2) + ')</span><span>sin recorte <b>' + pct(pu, 0) + '</b> (r último ' + fmt(P.u.r, 2) + ')</span>' +
       '<span class="ldiag">' + (iter === 0 ? "Política inicial: " + pct(hist.c[0], 0) + " de probabilidad para «Descuento». Pulsa «Aplicar 5 actualizaciones»." :
         sgn > 0 ? "Sin recorte, la primera iteración ya multiplicó la probabilidad por " + fmt(hist.u[1] / hist.u[0], 1) + ": un solo lote con una ventaja grande (quizá por suerte) basta para que la política colapse en una acción. Con recorte, cada iteración la multiplica por " + hist.c.slice(1).map(function(v, k){ return "×" + fmt(v / hist.c[k], 2); }).join(", ") + " (≈ 1+ε = " + fmt(1 + eps, 2) + "): avanza en la buena dirección, pero sin jugárselo todo a un lote." :
         "Con ventaja negativa, sin recorte «Descuento» se hunde al " + pct(pu, 0) + "; con recorte baja en cada iteración solo hasta que r ≈ 1−ε = " + fmt(1 - eps, 2) + " (multiplicadores " + hist.c.slice(1).map(function(v, k){ return "×" + fmt(v / hist.c[k], 2); }).join(", ") + "): el cambio es prudente y reversible.") + '</span>';
   }
   function stop(){ if(stopL){ stopL(); stopL = null; } }
   function run(){ stop(); queue = 5; var last = 0; stopL = loop(function(t){ if(t - last < 380) return; last = t; if(queue <= 0){ stop(); return; } iterate("c", true); iterate("u", false); iter++; queue--; draw(); }); }
   ctlBtn(ctl, "Aplicar 5 actualizaciones", run, true);
   ctlBtn(ctl, "↺ Reiniciar política", function(){ stop(); init(); draw(); });
   ctlSeg(ctl, "Ventaja de «Descuento»", [["1", "A > 0 (salió mejor)"], ["-1", "A < 0 (salió peor)"]], "1", function(v){ sgn = +v; stop(); init(); draw(); });
   ctlSlider(ctl, '<span style="text-transform:none">ε</span> del recorte', 0.05, 0.5, 0.05, eps, function(v){ return fmt(v, 2) + " (franja " + fmt(1 - v, 2) + " – " + fmt(1 + v, 2) + ")"; }, function(v){ eps = v; stop(); init(); draw(); });
   init(); draw();
   return function(){ stop(); };
 }});

/* @@END@@ */
})();
