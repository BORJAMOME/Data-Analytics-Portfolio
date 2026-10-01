/* ══════════════════════════════════════════════════════════════
   VIZ · lote B — un visual propio por modelo:
   rf, extratrees, xgboost, lightgbm, catboost, adaboost, svmlin,
   cox, uplift, propensity, automl, pyspark.
   Todo dentro de un IIFE: solo se exponen los VIZ.push.
   ══════════════════════════════════════════════════════════════ */
(function(){
"use strict";
var TAU = Math.PI * 2;
/* texto en canvas con opciones {s:tamaño, w:peso, c:color, a:align, b:baseline} */
function T(ctx, s, x, y, o){
  o = o || {};
  ctx.font = (o.w ? o.w + " " : "") + (o.s || 12) + "px " + LABFONT;
  ctx.fillStyle = o.c || "#888"; ctx.textAlign = o.a || "left"; ctx.textBaseline = o.b || "alphabetic";
  ctx.fillText(s, x, y);
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
}
function TW(ctx, s, size, w){ ctx.font = (w ? w + " " : "") + (size || 12) + "px " + LABFONT; return ctx.measureText(s).width; }
/* rótulo de panel: versalitas discretas */
function head(ctx, s, x, y, C, a){ T(ctx, s.toUpperCase(), x, y, {s:11, w:"600", c:C.muted, a:a}); }
function rr(ctx, x, y, w, h, r){
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function rgb(hex){ var h = hex.replace("#", ""); if(h.length === 3) h = h.split("").map(function(x){ return x + x; }).join(""); var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function mixC(a, b, t){ var A = rgb(a), B = rgb(b); return "rgb(" + [0, 1, 2].map(function(i){ return Math.round(A[i] + (B[i] - A[i]) * t); }).join(",") + ")"; }
function clamp(x, a, b){ return x < a ? a : x > b ? b : x; }
function lerp(a, b, t){ return a + (b - a) * t; }
function ease(t){ t = clamp(t, 0, 1); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function sig(z){ return 1 / (1 + Math.exp(-z)); }
function miles(n){ return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
function eur(n){ return (n < 0 ? "−" : "") + miles(Math.abs(n)) + " €"; }
function sgn(x, d){ return (x > 0 ? "▲ +" : x < 0 ? "▼ −" : "") + fmt(Math.abs(x), d); }
/* AUC por rangos (con empates) */
function auc(s, y){
  var idx = s.map(function(_, i){ return i; }).sort(function(a, b){ return s[a] - s[b]; });
  var r = new Array(s.length), i = 0;
  while(i < idx.length){ var j = i; while(j + 1 < idx.length && s[idx[j + 1]] === s[idx[i]]) j++; for(var k = i; k <= j; k++) r[idx[k]] = (i + j) / 2 + 1; i = j + 1; }
  var np = 0, sr = 0; y.forEach(function(v, k){ if(v){ np++; sr += r[k]; } });
  var nn = y.length - np; if(!np || !nn) return 0.5;
  return (sr - np * (np + 1) / 2) / (np * nn);
}
/* bucle de animación con limpieza: fn(t) devuelve false para parar */
function loop(fn){
  var on = true, id = 0;
  function f(t){ if(!on) return; if(fn(t) === false){ on = false; return; } id = requestAnimationFrame(f); }
  id = requestAnimationFrame(f);
  return function(){ on = false; cancelAnimationFrame(id); };
}
/* mapa de probabilidad en imagen (rápido): pf(i,j) → p en [0,1]; lo pinta en un canvas fuera de pantalla */
function probImage(G, pf, C, aMax){
  var off = document.createElement("canvas"); off.width = G; off.height = G;
  var o = off.getContext("2d"), im = o.createImageData(G, G), A = rgb(C.c[0]), B = rgb(C.c[1]);
  for(var j = 0; j < G; j++) for(var i = 0; i < G; i++){
    var p = pf(i, j), q = (j * G + i) * 4, col = p >= 0.5 ? B : A, a = 0.06 + (aMax || 0.5) * Math.abs(p - 0.5) * 2;
    im.data[q] = col[0]; im.data[q + 1] = col[1]; im.data[q + 2] = col[2]; im.data[q + 3] = Math.round(255 * a);
  }
  o.putImageData(im, 0, 0); return off;
}
function drawImg(ctx, img, box, smooth){
  ctx.save(); ctx.imageSmoothingEnabled = !!smooth; if(smooth) ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, box[0], box[1], box[2], box[3]); ctx.restore();
}
function frame(ctx, box, C){ ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(box[0] + .5, box[1] + .5, box[2] - 1, box[3] - 1); }
function dashLine(ctx, x1, y1, x2, y2, col, w, dash){
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 1.2; ctx.setLineDash(dash || [5, 4]);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
}
function path(ctx, pts, col, w, dash){
  if(!pts.length) return;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w || 2; ctx.lineJoin = "round"; if(dash) ctx.setLineDash(dash);
  ctx.beginPath(); pts.forEach(function(p, i){ i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.stroke(); ctx.restore();
}
/* marcador con forma (para no depender solo del color): 0 círculo, 1 cuadrado, 2 triángulo, 3 rombo */
function mark(ctx, x, y, r, shape, fill, stroke){
  ctx.beginPath();
  if(shape === 1) ctx.rect(x - r * .88, y - r * .88, r * 1.76, r * 1.76);
  else if(shape === 2){ ctx.moveTo(x, y - r * 1.15); ctx.lineTo(x + r * 1.05, y + r * .75); ctx.lineTo(x - r * 1.05, y + r * .75); ctx.closePath(); }
  else if(shape === 3){ ctx.moveTo(x, y - r * 1.2); ctx.lineTo(x + r * 1.05, y); ctx.lineTo(x, y + r * 1.2); ctx.lineTo(x - r * 1.05, y); ctx.closePath(); }
  else ctx.arc(x, y, r, 0, TAU);
  if(fill){ ctx.fillStyle = fill; ctx.fill(); }
  if(stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 1.1; ctx.stroke(); }
}
function arrow(ctx, x1, y1, x2, y2, col, w, hd){
  var a = Math.atan2(y2 - y1, x2 - x1); hd = hd || 7;
  ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w || 1.6;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * hd * .6, y2 - Math.sin(a) * hd * .6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - hd * Math.cos(a - .42), y2 - hd * Math.sin(a - .42)); ctx.lineTo(x2 - hd * Math.cos(a + .42), y2 - hd * Math.sin(a + .42)); ctx.closePath(); ctx.fill();
  ctx.restore();
}
/* pastilla de texto (etiqueta con fondo) */
function pill(ctx, s, x, y, C, o){
  o = o || {}; var sz = o.s || 11, w = TW(ctx, s, sz, o.w || "600") + 14, h = sz + 9, x0 = o.a === "center" ? x - w / 2 : o.a === "right" ? x - w : x;
  ctx.save(); rr(ctx, x0, y - h / 2, w, h, h / 2); ctx.fillStyle = o.bg || C.card; ctx.fill();
  if(o.bd !== false){ ctx.strokeStyle = o.bd || C.line; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.restore(); T(ctx, s, x0 + 7, y + .5, {s:sz, w:o.w || "600", c:o.c || C.ink, b:"middle"}); return w;
}

/* ── 1. RANDOM FOREST · la votación del bosque ─────────────────── */
VIZ.push({id:"v-rf", model:"rf", g:"model", ic:"🌲", dim:"2D",
 t:"La votación del bosque",
 q:"¿Por qué muchos árboles mediocres votando aciertan más que uno solo?",
 intro:"Cada punto es un cliente de un banco: <b>ratio deuda/ingresos</b> (horizontal) y <b>antigüedad</b> (vertical). Naranja = impagó; morado = pagó. A la derecha ves 12 de los árboles: cada uno se entrena con una <b>muestra bootstrap</b> (sorteo con reemplazo) y en cada corte elige variable al azar. El panel grande es la <b>votación</b> de todos. Haz clic en él para colocar un cliente y mueve el número de árboles.",
 notice:["Cada miniatura es un árbol <b>caprichoso</b>: fronteras en escalera, distintas entre sí, con islas que en los demás no aparecen.",
   "La probabilidad del bosque es literalmente el <b>% de árboles que votan «impago»</b>: cerca de la frontera los votos se reparten (≈50%); lejos, son casi unánimes.",
   "La curva de acierto en test <b>sube deprisa y luego se aplana</b>: de 1 a 30 árboles se gana mucho; de 100 a 150, casi nada. Y añadir árboles no provoca sobreajuste."],
 models:["rf","arbol","extratrees","xgboost"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 440, K = makeCanvas(stage, W, H, "Bosque aleatorio: votación de árboles, miniaturas de 12 árboles y curva de acierto"), ctx = K.ctx;
   var NT = 150, G = 64, seed = 11, nUse = 60, built = 0, X, Y, Xt, Yt, trees, grids, testV, accN, accTree, client = [0.6, 0.3];
   var box = [40, 40, 326, 326], stopB = null;
   var bound = function(x){ return 0.07 + 0.8 * x * x + 0.09 * Math.sin(7 * x); };
   function gen(){
     var r = mulberry(seed); X = []; Y = []; Xt = []; Yt = [];
     for(var i = 0; i < 840; i++){
       var p = [r(), r()], y = r() < sig((bound(p[0]) - p[1]) * 13) ? 1 : 0;
       if(i < 240){ X.push(p); Y.push(y); } else { Xt.push(p); Yt.push(y); }
     }
     trees = []; grids = []; testV = []; built = 0; accN = []; accTree = 0;
   }
   function growChunk(){
     var rng = mulberry(seed * 31 + built), n = X.length;
     for(var c = 0; c < 6 && built < NT; c++, built++){
       var bs = []; for(var i = 0; i < n; i++) bs.push(Math.floor(rng() * n));
       var t = cartFit(X, Y, bs, 0, 9, 2, rng, true); trees.push(t);
       var g = new Uint8Array(G * G);
       for(var j = 0; j < G; j++) for(i = 0; i < G; i++) g[j * G + i] = cartPred(t, [(i + .5) / G, 1 - (j + .5) / G]) >= .5 ? 1 : 0;
       grids.push(g);
       testV.push(Xt.map(function(x){ return cartPred(t, x) >= .5 ? 1 : 0; }));
     }
     /* acierto del voto mayoritario con los n primeros árboles */
     var sum = new Array(Xt.length).fill(0), sAcc = 0; accN = [];
     testV.forEach(function(v, k){
       var ok = 0, okT = 0;
       for(var i = 0; i < Xt.length; i++){ sum[i] += v[i]; if(((sum[i] / (k + 1)) >= .5 ? 1 : 0) === Yt[i]) ok++; if(v[i] === Yt[i]) okT++; }
       accN.push(ok / Xt.length); sAcc += okT / Xt.length;
     });
     accTree = sAcc / testV.length;
   }
   var miniImg = [];
   function minis(){
     miniImg = grids.slice(0, 12).map(function(g){ return probImage(G, function(i, j){ return g[j * G + i] ? 1 : 0; }, C, 0.36); });
   }
   function votesAt(p, n){
     var i = clamp(Math.floor(p[0] * G), 0, G - 1), j = clamp(Math.floor((1 - p[1]) * G), 0, G - 1), v = 0;
     for(var k = 0; k < n; k++) v += grids[k][j * G + i];
     return v;
   }
   function draw(){
     K.clear();
     var n = Math.min(nUse, built), sx = function(x){ return box[0] + x * box[2]; }, sy = function(y){ return box[1] + (1 - y) * box[3]; };
     /* panel principal: proporción de votos */
     head(ctx, "Votación de " + n + (n === 1 ? " árbol" : " árboles"), box[0], 26, C);
     if(n){
       var sum = new Uint16Array(G * G);
       for(var k = 0; k < n; k++){ var g = grids[k]; for(var q = 0; q < G * G; q++) sum[q] += g[q]; }
       drawImg(ctx, probImage(G, function(i, j){ return sum[j * G + i] / n; }, C, 0.55), box, true);
     }
     frame(ctx, box, C);
     ctx.save(); ctx.beginPath(); ctx.rect(box[0], box[1], box[2], box[3]); ctx.clip();
     var pts = []; for(var s = 0; s <= 120; s++){ var xx = s / 120; pts.push([sx(xx), sy(bound(xx))]); }
     path(ctx, pts, C.ink, 1.2, [4, 4]);
     X.forEach(function(p, i){ dot(ctx, sx(p[0]), sy(p[1]), 3.4, Y[i] ? C.c[1] : C.c[0], C.card); });
     ctx.restore();
     T(ctx, "frontera real", sx(0.93), sy(bound(0.93)) - 8, {s:11, c:C.ink, a:"right"});
     T(ctx, "ratio deuda / ingresos →", box[0] + box[2] / 2, box[1] + box[3] + 16, {s:11, c:C.muted, a:"center"});
     ctx.save(); ctx.translate(box[0] - 14, box[1] + box[3] / 2); ctx.rotate(-Math.PI / 2); T(ctx, "antigüedad como cliente →", 0, 0, {s:11, c:C.muted, a:"center"}); ctx.restore();
     /* cliente elegido */
     var cx = sx(client[0]), cy = sy(client[1]);
     ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 9, 0, TAU); ctx.stroke();
     ctx.beginPath(); ctx.moveTo(cx - 14, cy); ctx.lineTo(cx - 5, cy); ctx.moveTo(cx + 5, cy); ctx.lineTo(cx + 14, cy); ctx.moveTo(cx, cy - 14); ctx.lineTo(cx, cy - 5); ctx.moveTo(cx, cy + 5); ctx.lineTo(cx, cy + 14); ctx.stroke();
     /* barra de votos */
     var v = n ? votesAt(client, n) : 0, by = box[1] + box[3] + 32, bw = box[2];
     T(ctx, "Votos para este cliente", box[0], by + 2, {s:11, w:"600", c:C.ink});
     T(ctx, "▲ " + v + " impago · " + (n - v) + " paga", box[0] + bw, by + 2, {s:11, w:"600", c:C.ink, a:"right"});
     rr(ctx, box[0], by + 9, bw, 14, 7); ctx.fillStyle = hexA(C.c[0], 0.75); ctx.fill();
     if(n && v){ ctx.save(); rr(ctx, box[0], by + 9, bw, 14, 7); ctx.clip(); ctx.fillStyle = C.c[1]; ctx.fillRect(box[0], by + 9, bw * v / n, 14); ctx.restore(); }
     dashLine(ctx, box[0] + bw / 2, by + 6, box[0] + bw / 2, by + 26, C.ink, 1.2, [3, 3]);
     /* miniaturas */
     var mx0 = 410, mw = 70, gap = 16;
     head(ctx, "12 de los árboles · cada uno ve otra muestra", mx0, 26, C);
     for(var m = 0; m < 12; m++){
       var col = m % 4, row = Math.floor(m / 4), x0 = mx0 + col * (mw + gap), y0 = 40 + row * 92;
       var on = m < n && miniImg[m];
       ctx.save(); ctx.globalAlpha = on ? 1 : 0.25;
       if(miniImg[m]) drawImg(ctx, miniImg[m], [x0, y0, mw, mw], false);
       frame(ctx, [x0, y0, mw, mw], C);
       if(m < built){
         var tv = cartPred(trees[m], client) >= .5;
         dot(ctx, x0 + client[0] * mw, y0 + (1 - client[1]) * mw, 3.2, C.ink, C.card);
         T(ctx, on ? (tv ? "▲ impago" : "● paga") : "sin votar", x0 + mw / 2, y0 + mw + 14, {s:11, w:on ? "600" : "400", c:on ? (tv ? C.c[1] : C.c[0]) : C.muted, a:"center"});
       }
       ctx.restore();
     }
     /* curva de acierto en test */
     var cb = [450, 340, 280, 58];
     head(ctx, "Acierto en test según nº de árboles", mx0, 326, C);
     if(accN.length){
       var lo = Math.min(accTree, Math.min.apply(null, accN)) - 0.02, hi = Math.max.apply(null, accN) + 0.01;
       var cx2 = function(k){ return cb[0] + (k - 1) / (NT - 1) * cb[2]; }, cy2 = function(a){ return cb[1] + cb[3] - (a - lo) / (hi - lo) * cb[3]; };
       ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(cb[0], cb[1] + cb[3] + .5); ctx.lineTo(cb[0] + cb[2], cb[1] + cb[3] + .5); ctx.stroke();
       dashLine(ctx, cb[0], cy2(accTree), cb[0] + cb[2], cy2(accTree), C.muted, 1, [3, 4]);
       T(ctx, "árbol medio " + pct(accTree, 0), cb[0] + cb[2], cy2(accTree) - 5, {s:11, c:C.muted, a:"right"});
       path(ctx, accN.map(function(a, k){ return [cx2(k + 1), cy2(a)]; }), C.c[0], 2.2);
       var an = accN[n - 1];
       dashLine(ctx, cx2(n), cb[1] - 2, cx2(n), cb[1] + cb[3], C.ink, 1, [2, 3]);
       dot(ctx, cx2(n), cy2(an), 4.5, C.c[0], C.card);
       T(ctx, pct(an, 1), cx2(n) + (n > 120 ? -8 : 8), cy2(an) - 8, {s:11, w:"700", c:C.ink, a:n > 120 ? "right" : "left"});
       T(ctx, "1", cb[0], cb[1] + cb[3] + 14, {s:11, c:C.muted, a:"center"});
       T(ctx, "150 árboles", cb[0] + cb[2], cb[1] + cb[3] + 14, {s:11, c:C.muted, a:"right"});
       T(ctx, pct(hi, 0), cb[0] - 6, cb[1] + 8, {s:11, c:C.muted, a:"right"});
       T(ctx, pct(lo, 0), cb[0] - 6, cb[1] + cb[3], {s:11, c:C.muted, a:"right"});
     }
     if(built < NT) pill(ctx, "🌱 plantando árboles… " + built + "/" + NT, box[0] + box[2] / 2, box[1] + 18, C, {a:"center"});
     /* lectura */
     if(n){
       var p = v / n, aF = accN[n - 1];
       var diag = n === 1 ? "Un solo árbol vota «a todo o nada»: su probabilidad solo puede ser 0% o 100%. Sube el número de árboles." :
         (p > .35 && p < .65 ? "Cliente <b>dudoso</b>: el bosque está dividido (" + v + " contra " + (n - v) + "). Esa división es información: no es un caso claro." :
         "Cliente <b>claro</b>: " + Math.round(100 * Math.max(p, 1 - p)) + "% de los árboles coinciden.") +
         " En test, el bosque acierta <b>" + pct(aF) + "</b> frente al <b>" + pct(accTree) + "</b> de un árbol medio" + (aF > accTree + .01 ? " → <b class='lgood'>▲ " + fmt(100 * (aF - accTree), 1) + " puntos gracias a votar</b>." : ".");
       read.innerHTML = '<span>Árboles <b>' + n + '</b></span><span>Votos «impago» <b>' + v + ' de ' + n + '</b></span><span>Probabilidad de impago <b>' + pct(p, 0) + '</b></span>' +
         '<span>Acierto test · árbol medio <b>' + pct(accTree) + '</b> · bosque <b>' + pct(aF) + '</b></span><span class="ldiag">' + diag + '</span>';
     }
   }
   function grow(){
     if(stopB) stopB();
     stopB = loop(function(){ growChunk(); if(built >= 12 && miniImg.length < 12) minis(); draw(); return built < NT; });
   }
   K.cv.style.cursor = "crosshair";
   K.cv.addEventListener("click", function(e){
     var p = K.pos(e), x = (p[0] - box[0]) / box[2], y = 1 - (p[1] - box[1]) / box[3];
     if(x >= 0 && x <= 1 && y >= 0 && y <= 1){ client = [x, y]; draw(); }
   });
   ctlSlider(ctl, "Número de árboles", 1, NT, 1, nUse, function(v){ return v + (v === 1 ? " árbol" : " árboles"); }, function(v){ nUse = v; draw(); });
   ctlBtn(ctl, "🎲 Otros datos", function(){ seed++; gen(); miniImg = []; grow(); });
   gen(); grow();
   return function(){ if(stopB) stopB(); };
 }});

/* ── 2. EXTRA TREES · cortes al azar ──────────────────────────── */
VIZ.push({id:"v-extratrees", model:"extratrees", g:"model", ic:"🎲", dim:"2D",
 t:"Cortes exhaustivos frente a cortes al azar",
 q:"¿Qué gana Extra Trees al sortear los cortes en vez de buscar el mejor?",
 intro:"<b>Arriba</b>, una sola variable (antigüedad del cliente) y la impureza Gini que quedaría tras <b>cada corte posible</b> (cuanto más baja, mejor separa «se va» de «se queda»). Random Forest prueba todos y se queda con el mínimo; Extra Trees <b>sortea</b> unos pocos umbrales y elige el mejor de ellos (en la realidad sortea uno por variable candidata; aquí, con una sola variable, sorteamos k). <b>Abajo</b>, dos bosques de 60 árboles entrenados de verdad sobre los mismos datos 2D, contando cuántos umbrales evalúa cada uno.",
 notice:["El corte de Extra Trees casi nunca es el óptimo, pero suele caer <b>cerca del valle</b> de la curva: un corte «bastante bueno» separa casi igual.",
   "Random Forest evalúa <b>unas 10 veces más</b> umbrales que Extra Trees con solo 300 filas (con millones de filas la diferencia se dispara), y aun así el acierto en test de ambos es muy parecido.",
   "La frontera de Extra Trees es <b>más suave</b>: al promediar cortes aleatorios, los escalones de cada árbol se difuminan (más sesgo, menos varianza)."],
 models:["extratrees","rf","arbol"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 440, K = makeCanvas(stage, W, H, "Curva de impureza Gini con cortes aleatorios y fronteras de Random Forest frente a Extra Trees"), ctx = K.ctx;
   var k = 3, cutSeed = 1, dataSeed = 4, U = [], UY = [], curve = [], best, cuts = [];
   var X, Y, Xt, Yt, rf = [], et = [], cntRF = {n:0}, cntET = {n:0}, msRF = 0, msET = 0, NT = 60, G = 56, gRF, gET, stopB = null;
   /* ── (a) una variable ── */
   function gen1(){
     var r = mulberry(21); U = []; UY = [];
     for(var i = 0; i < 120; i++){ var x = Math.round(1 + 59 * r()); U.push(x); UY.push(r() < sig((22 - x) / 6) * 0.85 + 0.05 ? 1 : 0); }
     var srt = U.map(function(_, i){ return i; }).sort(function(a, b){ return U[a] - U[b]; }), n = U.length, s = 0, lp = 0;
     UY.forEach(function(y){ s += y; });
     curve = []; best = null;
     for(var q = 1; q < n; q++){
       lp += UY[srt[q - 1]];
       if(U[srt[q - 1]] === U[srt[q]]) continue;
       var t = (U[srt[q - 1]] + U[srt[q]]) / 2, g = giniAt(q, lp, n, s) / n;
       curve.push([t, g]); if(!best || g < best[1]) best = [t, g];
     }
   }
   function giniAt(nl, sl, n, s){ var nr = n - nl, pl = sl / nl, pr = (s - sl) / nr; return nl * 2 * pl * (1 - pl) + nr * 2 * pr * (1 - pr); }
   function giniCut(t){ var nl = 0, sl = 0, s = 0; U.forEach(function(x, i){ s += UY[i]; if(x <= t){ nl++; sl += UY[i]; } }); return nl && nl < U.length ? giniAt(nl, sl, U.length, s) / U.length : null; }
   function draw1(){
     var r = mulberry(cutSeed * 97 + 3), lo = Math.min.apply(null, U), hi = Math.max.apply(null, U); cuts = [];
     while(cuts.length < k){ var t = lo + r() * (hi - lo), g = giniCut(t); if(g !== null) cuts.push([t, g]); }
   }
   /* ── (b) dos bosques ── */
   function gen2(){
     var r = mulberry(dataSeed); X = []; Y = []; Xt = []; Yt = [];
     for(var i = 0; i < 900; i++){
       var p = [r(), r()], d = Math.hypot(p[0] - 0.4, (p[1] - 0.45) * 1.25), y = r() < sig((0.3 - d) * 16) ? 1 : 0;
       if(i < 300){ X.push(p); Y.push(y); } else { Xt.push(p); Yt.push(y); }
     }
     rf = []; et = []; cntRF = {n:0}; cntET = {n:0}; msRF = 0; msET = 0; gRF = new Float32Array(G * G); gET = new Float32Array(G * G);
   }
   function leaf(Yv, idx){ var s = 0; idx.forEach(function(i){ s += Yv[i]; }); return s / idx.length; }
   /* Random Forest: variable al azar y TODOS sus umbrales */
   function rfFit(idx, depth, rng){
     var n = idx.length, s = 0; idx.forEach(function(i){ s += Y[i]; }); var p = s / n;
     if(depth >= 12 || n < 4 || p === 0 || p === 1) return {p:p};
     var f = rng() < .5 ? 0 : 1, srt = idx.slice().sort(function(a, b){ return X[a][f] - X[b][f]; }), lp = 0, bst = null;
     for(var q = 1; q < n; q++){
       lp += Y[srt[q - 1]];
       if(q < 2 || n - q < 2 || X[srt[q - 1]][f] === X[srt[q]][f]) continue;
       cntRF.n++;
       var g = giniAt(q, lp, n, s);
       if(!bst || g < bst.g) bst = {g:g, t:(X[srt[q - 1]][f] + X[srt[q]][f]) / 2};
     }
     if(!bst) return {p:p};
     var L = [], R = []; idx.forEach(function(i){ (X[i][f] <= bst.t ? L : R).push(i); });
     return {f:f, t:bst.t, l:rfFit(L, depth + 1, rng), r:rfFit(R, depth + 1, rng)};
   }
   /* Extra Trees: variable al azar y UN umbral sorteado entre su mínimo y su máximo */
   function etFit(idx, depth, rng){
     var n = idx.length, s = 0; idx.forEach(function(i){ s += Y[i]; }); var p = s / n;
     if(depth >= 12 || n < 4 || p === 0 || p === 1) return {p:p};
     var f = rng() < .5 ? 0 : 1, lo = 1e9, hi = -1e9;
     idx.forEach(function(i){ lo = Math.min(lo, X[i][f]); hi = Math.max(hi, X[i][f]); });
     if(hi - lo < 1e-9){ f = 1 - f; lo = 1e9; hi = -1e9; idx.forEach(function(i){ lo = Math.min(lo, X[i][f]); hi = Math.max(hi, X[i][f]); }); if(hi - lo < 1e-9) return {p:p}; }
     var t = lo + rng() * (hi - lo); cntET.n++;
     var L = [], R = []; idx.forEach(function(i){ (X[i][f] <= t ? L : R).push(i); });
     if(!L.length || !R.length) return {p:p};
     return {f:f, t:t, l:etFit(L, depth + 1, rng), r:etFit(R, depth + 1, rng)};
   }
   function addToGrid(g, t){ for(var j = 0; j < G; j++) for(var i = 0; i < G; i++) g[j * G + i] += cartPred(t, [(i + .5) / G, 1 - (j + .5) / G]); }
   function chunk(){
     for(var c = 0; c < 6 && rf.length < NT; c++){
       var rng = mulberry(dataSeed * 1000 + rf.length), n = X.length, all = X.map(function(_, i){ return i; });
       var bs = all.map(function(){ return Math.floor(rng() * n); });
       var t0 = performance.now(), a = rfFit(bs, 0, rng); msRF += performance.now() - t0;
       t0 = performance.now(); var b = etFit(all, 0, rng); msET += performance.now() - t0;
       rf.push(a); et.push(b); addToGrid(gRF, a); addToGrid(gET, b);
     }
   }
   function accOf(ts){ var ok = 0; Xt.forEach(function(x, i){ var s = 0; ts.forEach(function(t){ s += cartPred(t, x); }); if(((s / ts.length) >= .5 ? 1 : 0) === Yt[i]) ok++; }); return ok / Xt.length; }
   var accR = 0, accE = 0;
   function draw(){
     K.clear();
     /* (a) */
     var bx = [100, 36, 620, 132], xr = [0, 62], gmax = Math.max.apply(null, curve.map(function(c){ return c[1]; })) * 1.06, gmin = best[1] * 0.9;
     var sx = function(x){ return bx[0] + (x - xr[0]) / (xr[1] - xr[0]) * bx[2]; }, sy = function(g){ return bx[1] + (1 - (g - gmin) / (gmax - gmin)) * (bx[3] - 44); };
     head(ctx, "(a) Una variable · impureza Gini tras cada corte posible", bx[0], 24, C);
     ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(bx[0], bx[1] + bx[3] + .5); ctx.lineTo(bx[0] + bx[2], bx[1] + bx[3] + .5); ctx.stroke();
     /* puntos en una franja */
     var jr = mulberry(5);
     U.forEach(function(x, i){ dot(ctx, sx(x) + (jr() - .5) * 4, bx[1] + bx[3] - 13 + (jr() - .5) * 12, 2.6, UY[i] ? C.c[1] : C.c[0], null); });
     path(ctx, curve.map(function(c){ return [sx(c[0]), sy(c[1])]; }), C.c[0], 2.2);
     T(ctx, "↑ más mezcla", bx[0] - 10, sy(gmax) + 4, {s:11, c:C.muted, a:"right"});
     T(ctx, "↓ mejor corte", bx[0] - 10, sy(gmin) + 4, {s:11, c:C.muted, a:"right"});
     T(ctx, "clientes", bx[0] - 10, bx[1] + bx[3] - 9, {s:11, c:C.muted, a:"right"});
     [0, 12, 24, 36, 48, 60].forEach(function(t){ T(ctx, String(t), sx(t), bx[1] + bx[3] + 14, {s:11, c:C.muted, a:"center"}); });
     T(ctx, "antigüedad (meses) · ● se queda  ● se va", bx[0] + bx[2], bx[1] + bx[3] + 28, {s:11, c:C.muted, a:"right"});
     T(ctx, "●", bx[0] + bx[2] - TW(ctx, "se queda  ● se va", 11) - 4, bx[1] + bx[3] + 28, {s:11, c:C.c[0], a:"right"});
     T(ctx, "●", bx[0] + bx[2] - TW(ctx, "se va", 11) - 4, bx[1] + bx[3] + 28, {s:11, c:C.c[1], a:"right"});
     /* cortes aleatorios */
     var bE = cuts.reduce(function(a, c){ return !a || c[1] < a[1] ? c : a; }, null);
     cuts.forEach(function(c){
       dashLine(ctx, sx(c[0]), bx[1], sx(c[0]), bx[1] + bx[3], hexA(C.c[4], c === bE ? 1 : .6), c === bE ? 1.8 : 1.1, [4, 3]);
       dot(ctx, sx(c[0]), sy(c[1]), c === bE ? 5.5 : 3.6, C.c[4], C.card);
     });
     /* óptimo de RF */
     var ox = sx(best[0]), oy = sy(best[1]);
     ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(ox, oy + 2); ctx.lineTo(ox - 6, oy + 12); ctx.lineTo(ox + 6, oy + 12); ctx.closePath(); ctx.fill();
     var lr = ox < bx[0] + bx[2] - 200, ex = sx(bE[0]), el = ex < bx[0] + bx[2] - 200;
     dashLine(ctx, ox, bx[1] + 4, ox, oy, C.ink, 1, [2, 3]);
     pill(ctx, "RF: el mínimo de " + curve.length + " cortes", ox + (lr ? -12 : 12), bx[1] + 4, C, {a:lr ? "left" : "right"});
     pill(ctx, "ET: el mejor de " + k + (k === 1 ? " sorteado" : " sorteados"), ex + (el ? -12 : 12), bx[1] + 29, C, {a:el ? "left" : "right", c:C.ink, bd:C.c[4]});
     /* (b) */
     var bR = [40, 248, 318, 176], bT = [420, 248, 318, 176];
     [[bR, gRF, rf.length, "Random Forest", cntRF.n, msRF, accR], [bT, gET, et.length, "Extra Trees", cntET.n, msET, accE]].forEach(function(P){
       var b = P[0], g = P[1], n = P[2];
       head(ctx, "(b) " + P[3] + " · " + n + " árboles", b[0], 236, C);
       if(n) drawImg(ctx, probImage(G, function(i, j){ return g[j * G + i] / n; }, C, 0.55), b, true);
       frame(ctx, b, C);
       ctx.save(); ctx.beginPath(); ctx.rect(b[0], b[1], b[2], b[3]); ctx.clip();
       X.forEach(function(p, i){ dot(ctx, b[0] + p[0] * b[2], b[1] + (1 - p[1]) * b[3], 2.4, Y[i] ? C.c[1] : C.c[0], null); });
       ctx.restore();
       pill(ctx, miles(P[4]) + " umbrales evaluados", b[0] + 8, b[1] + 16, C, {});
       if(n === NT) pill(ctx, "test " + pct(P[6], 1), b[0] + b[2] - 8, b[1] + b[3] - 16, C, {a:"right"});
     });
     var gap = (bE[1] - best[1]) / best[1];
     var ratio = cntET.n ? cntRF.n / cntET.n : 0;
     read.innerHTML = '<span>Corte RF <b>' + fmt(best[0], 1) + ' meses</b> (Gini ' + fmt(best[1], 3) + ')</span><span>Corte ET <b>' + fmt(bE[0], 1) + ' meses</b> (Gini ' + fmt(bE[1], 3) + ')</span>' +
       '<span>Umbrales evaluados · RF <b>' + miles(cntRF.n) + '</b> · ET <b>' + miles(cntET.n) + '</b></span>' +
       '<span>Tiempo de ajuste medido · RF <b>' + fmt(msRF, 0) + ' ms</b> · ET <b>' + fmt(msET, 0) + ' ms</b></span>' +
       (rf.length === NT ? '<span>Acierto test · RF <b>' + pct(accR) + '</b> · ET <b>' + pct(accE) + '</b></span>' : '') +
       '<span class="ldiag">En este nodo, el corte sorteado deja una impureza <b>' + (gap < 0.005 ? "prácticamente igual" : pct(gap, 0) + " peor") + '</b> que el óptimo. ' +
       (rf.length === NT ? 'En el bosque completo, RF evaluó <b>' + fmt(ratio, 0) + ' veces más umbrales</b> que ET y la diferencia de acierto en test es de solo <b>' + fmt(100 * Math.abs(accR - accE), 1) + ' puntos</b>.' : 'Entrenando los bosques…') + '</span>';
   }
   function grow(){
     if(stopB) stopB();
     stopB = loop(function(){ chunk(); if(rf.length === NT){ accR = accOf(rf); accE = accOf(et); } draw(); return rf.length < NT; });
   }
   ctlSlider(ctl, "Umbrales sorteados por Extra Trees (k)", 1, 10, 1, k, function(v){ return v; }, function(v){ k = v; draw1(); draw(); });
   ctlBtn(ctl, "🎲 Sortear cortes", function(){ cutSeed++; draw1(); draw(); }, true);
   ctlBtn(ctl, "↺ Otros datos 2D", function(){ dataSeed++; gen2(); grow(); });
   gen1(); draw1(); gen2(); grow();
   return function(){ if(stopB) stopB(); };
 }});

/* ── 3. XGBOOST · early stopping y la fórmula de la hoja ─────── */
VIZ.push({id:"v-xgboost", model:"xgboost", g:"model", ic:"🚀", dim:"2D",
 t:"Early stopping y la fórmula de cada hoja",
 q:"¿Cuándo hay que dejar de añadir árboles y qué hacen λ y γ dentro de cada uno?",
 intro:"Boosting real con pérdida logística (la de clasificación): cada árbol nuevo se ajusta con el <b>gradiente G</b> (cuánto y hacia dónde se equivoca el modelo) y la <b>hessiana H</b> (cuánta seguridad tiene) de cada cliente. <b>Izquierda</b>: error en entrenamiento y en validación ronda a ronda; mueve el learning rate y la profundidad. <b>Derecha</b>: un árbol pequeño sobre 30 clientes con la fórmula de XGBoost; mueve <b>λ</b> y <b>γ</b>.",
 notice:["El error de entrenamiento baja siempre; el de validación baja, toca fondo y <b>vuelve a subir</b>. El early stopping se queda con la ronda del mínimo y deja de entrenar 25 rondas después sin mejora.",
   "Con learning rate alto el mínimo llega <b>antes</b> y es peor; con uno bajo hacen falta muchas más rondas, pero el valle suele ser más profundo.",
   "Subir <b>λ</b> encoge todos los pesos hacia 0 (sumar λ al denominador de −G/(H+λ)). Subir <b>γ</b> exige una ganancia mínima: los cortes que no la alcanzan se <b>podan</b> y sus hojas se funden."],
 models:["xgboost","lightgbm","catboost","gbr","adaboost"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 430, K = makeCanvas(stage, W, H, "Curvas de error con early stopping y árbol con pesos y poda de XGBoost"), ctx = K.ctx;
   var eta = 0.1, depth = 3, lam = 1, gam = 0, R = 300, PAT = 25, NF = 5;
   var NAMES = ["visitas", "recencia", "ruido A", "ruido B", "ruido C"];
   var X = [], Y = [], Xv = [], Yv = [], r = mulberry(42);
   for(var i = 0; i < 800; i++){
     var x = []; for(var f = 0; f < NF; f++) x.push(r());
     var y = r() < sig(4.5 * (x[0] - 0.45) + 3.2 * Math.sin(5 * x[1]) - 1.2) ? 1 : 0;
     if(i < 400){ X.push(x); Y.push(y); } else { Xv.push(x); Yv.push(y); }
   }
   var COL = []; for(f = 0; f < NF; f++) COL.push(Float64Array.from(X.map(function(x){ return x[f]; })));
   var SORT = []; for(f = 0; f < NF; f++) SORT.push(X.map(function(_, i){ return i; }).sort(function(a, b){ return X[a][f] - X[b][f]; }));
   /* árbol de 2.º orden, construido por niveles (una pasada por variable y nivel):
      ganancia = ½[GL²/(HL+λ) + GR²/(HR+λ) − G²/(H+λ)], hoja w = −G/(H+λ), min_child_weight = 1 */
   var NMAX = 256, GLa = new Float64Array(NMAX), HLa = new Float64Array(NMAX), PVa = new Int32Array(NMAX), ACT = new Uint8Array(NMAX);
   var BG = new Float64Array(NMAX), BF = new Int32Array(NMAX), BT = new Float64Array(NMAX);
   function grow(g, h, maxD, lm){
     var n = X.length, nodeOf = new Int32Array(n), nodes = [{G:0, H:0}];
     for(var i = 0; i < n; i++){ nodes[0].G += g[i]; nodes[0].H += h[i]; }
     var level = [0];
     for(var d = 0; d < maxD && level.length; d++){
       ACT.fill(0); level.forEach(function(id){ ACT[id] = 1; BG[id] = 0; BF[id] = -1; });
       for(var f = 0; f < NF; f++){
         var srt = SORT[f], col = COL[f];
         level.forEach(function(id){ GLa[id] = 0; HLa[id] = 0; PVa[id] = -1; });
         for(var q = 0; q < n; q++){
           var k = srt[q], id = nodeOf[k]; if(!ACT[id]) continue;
           var pv = PVa[id], hl = HLa[id];
           if(pv >= 0 && col[k] !== col[pv] && hl >= 1){
             var nd = nodes[id];
             if(nd.H - hl >= 1){
               var gl = GLa[id], gr = nd.G - gl, gn = .5 * (gl * gl / (hl + lm) + gr * gr / (nd.H - hl + lm) - nd.G * nd.G / (nd.H + lm));
               if(gn > BG[id]){ BG[id] = gn; BF[id] = f; BT[id] = (col[k] + col[pv]) / 2; }
             }
           }
           GLa[id] += g[k]; HLa[id] = hl + h[k]; PVa[id] = k;
         }
       }
       var next = [];
       level.forEach(function(id){
         if(BF[id] < 0) return;
         var nd = nodes[id]; nd.f = BF[id]; nd.t = BT[id]; nd.l = nodes.length; nd.r = nodes.length + 1;
         nodes.push({G:0, H:0}, {G:0, H:0}); next.push(nd.l, nd.r);
       });
       for(i = 0; i < n; i++){ var nd2 = nodes[nodeOf[i]]; if(nd2.l !== undefined){ nodeOf[i] = COL[nd2.f][i] <= nd2.t ? nd2.l : nd2.r; nodes[nodeOf[i]].G += g[i]; nodes[nodeOf[i]].H += h[i]; } }
       level = next;
     }
     nodes.forEach(function(nd){ nd.w = -nd.G / (nd.H + lm); });
     return nodes;
   }
   function pred(T, x){ var nd = T[0]; while(nd.l !== undefined) nd = T[x[nd.f] <= nd.t ? nd.l : nd.r]; return nd.w; }
   function ll(F, Yy){ var s = 0; for(var i = 0; i < F.length; i++){ var p = clamp(sig(F[i]), 1e-9, 1 - 1e-9); s -= Yy[i] ? Math.log(p) : Math.log(1 - p); } return s / F.length; }
   var trL = [], vaL = [], bestR = 0, stopR = R;
   var BS = null, stopA = null;
   function boost(){
     var pm = Y.reduce(function(a, b){ return a + b; }) / Y.length, f0 = Math.log(pm / (1 - pm));
     BS = {F:new Float64Array(X.length).fill(f0), Fv:new Float64Array(Xv.length).fill(f0), m:0};
     trL = [ll(BS.F, Y)]; vaL = [ll(BS.Fv, Yv)];
     if(stopA) stopA();
     stopA = loop(function(){
       var t0 = performance.now();
       while(BS.m < R && performance.now() - t0 < 14){
         var F = BS.F, Fv = BS.Fv, g = new Float64Array(F.length), h = new Float64Array(F.length);
         for(var i = 0; i < F.length; i++){ var p = sig(F[i]); g[i] = p - Y[i]; h[i] = Math.max(p * (1 - p), 1e-6); }
         var t = grow(g, h, depth, 1);
         for(i = 0; i < F.length; i++) F[i] += eta * pred(t, X[i]);
         for(i = 0; i < Fv.length; i++) Fv[i] += eta * pred(t, Xv[i]);
         trL.push(ll(F, Y)); vaL.push(ll(Fv, Yv)); BS.m++;
       }
       bestR = 0; stopR = R;
       for(var m = 1; m < vaL.length; m++){ if(vaL[m] < vaL[bestR]) bestR = m; if(m - bestR >= PAT){ stopR = m; break; } }
       draw();
       return BS.m < R;
     });
   }
   /* ── (b) árbol fijo de 30 clientes con p = 0,5 al inicio ── */
   var S, g0, h0, sp0, spL, spR, all30;
   function gainRaw(sp, parent, lm){ var a = statsOf(sp.L), b = statsOf(sp.R), p = statsOf(parent); return .5 * (a.G * a.G / (a.H + lm) + b.G * b.G / (b.H + lm) - p.G * p.G / (p.H + lm)); }
   for(var sd = 1; sd < 400; sd++){
     var rs = mulberry(sd * 13 + 1); S = [];
     while(S.length < 30){ var c = Math.floor(rs() * X.length); if(S.indexOf(c) < 0) S.push(c); }
     g0 = S.map(function(i){ return 0.5 - Y[i]; }); h0 = S.map(function(){ return 0.25; });
     all30 = S.map(function(_, k){ return k; }); sp0 = bestSplit(all30); if(!sp0) continue; spL = bestSplit(sp0.L); spR = bestSplit(sp0.R); if(!spL || !spR) continue;
     var ga = gainRaw(sp0, all30, 1), gb = gainRaw(spL, sp0.L, 1), gc = gainRaw(spR, sp0.R, 1);
     if(ga > 2.2 && gb > 0.5 && gc > 0.5 && Math.abs(gb - gc) > 0.6 && Math.max(gb, gc) < 2) break;
   }
   function statsOf(set){ var G = 0, Hh = 0; set.forEach(function(k){ G += g0[k]; Hh += h0[k]; }); return {G:G, H:Hh, n:set.length}; }
   function bestSplit(set){
     var st = statsOf(set), best = null;
     for(var f = 0; f < 2; f++){
       var srt = set.slice().sort(function(a, b){ return X[S[a]][f] - X[S[b]][f]; }), GL = 0, HL = 0;
       for(var q = 0; q < srt.length - 1; q++){
         GL += g0[srt[q]]; HL += h0[srt[q]];
         if(q < 2 || srt.length - q - 1 < 3) continue;
         var gn = .5 * (GL * GL / (HL + 1) + (st.G - GL) * (st.G - GL) / (st.H - HL + 1) - st.G * st.G / (st.H + 1));
         if(!best || gn > best.gn) best = {gn:gn, f:f, t:(X[S[srt[q]]][f] + X[S[srt[q + 1]]][f]) / 2};
       }
     }
     if(!best) return null;
     var L = [], Rr = []; set.forEach(function(k){ (X[S[k]][best.f] <= best.t ? L : Rr).push(k); });
     best.L = L; best.R = Rr; return best;
   }
   function gainOf(sp, parent){ return gainRaw(sp, parent, lam) - gam; }
   var wOf = function(set){ var s = statsOf(set); return -s.G / (s.H + lam); };
   function drawTree(){
     var x0 = 418, x1 = 744;
     head(ctx, "(b) Pesos y poda en un árbol (30 clientes)", x0, 24, C);
     var gR = gainOf(sp0, all30), gL1 = gainOf(spL, sp0.L), gR1 = gainOf(spR, sp0.R);
     var pruneL = gL1 < 0, pruneR = gR1 < 0, pruneRoot = pruneL && pruneR && gR < 0;
     var cxR = (x0 + x1) / 2, yR = 64, yC = 160, yLf = 268, cL = x0 + 82, cRr = x1 - 82;
     var leafX = [x0 + 38, x0 + 122, x1 - 122, x1 - 38];
     function edge(xa, ya, xb, yb, cut){
       ctx.save(); ctx.strokeStyle = cut ? hexA(C.muted, .5) : C.muted; ctx.lineWidth = 1.3; if(cut) ctx.setLineDash([3, 4]);
       ctx.beginPath(); ctx.moveTo(xa, ya); ctx.bezierCurveTo(xa, (ya + yb) / 2, xb, (ya + yb) / 2, xb, yb); ctx.stroke(); ctx.restore();
     }
     function splitBox(x, y, sp, gain, cut){
       var w = 132, h = 40;
       ctx.save(); if(cut) ctx.globalAlpha = .55;
       rr(ctx, x - w / 2, y - h / 2, w, h, 9); ctx.fillStyle = C.card; ctx.fill(); ctx.strokeStyle = cut ? C.neg : C.line; ctx.lineWidth = 1.2; if(cut) ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
       T(ctx, NAMES[sp.f] + " ≤ " + fmt(sp.t, 2), x, y - 4, {s:12, w:"600", c:C.ink, a:"center"});
       T(ctx, "ganancia " + (gain + gam < 0 ? "−" : "") + fmt(Math.abs(gain + gam), 2) + (cut ? " < γ" : gam ? " ≥ γ" : ""), x, y + 12, {s:11, c:C.muted, a:"center"});
       ctx.restore();
       if(cut){ ctx.strokeStyle = C.neg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - w / 2 + 6, y); ctx.lineTo(x + w / 2 - 6, y); ctx.stroke(); }
     }
     function leafBox(x, y, set, faded){
       var s = statsOf(set), w = -s.G / (s.H + lam), bw = 74, bh = 62;
       ctx.save(); if(faded) ctx.globalAlpha = .28;
       rr(ctx, x - bw / 2, y - bh / 2, bw, bh, 9); ctx.fillStyle = C.soft; ctx.fill();
       var z0 = Math.abs(w) < .005; T(ctx, z0 ? "0,00" : (w >= 0 ? "▲ +" : "▼ −") + fmt(Math.abs(w), 2), x, y - 10, {s:13, w:"700", c:z0 ? C.ink : w >= 0 ? C.pos : C.neg, a:"center"});
       T(ctx, "G " + (s.G < 0 ? "−" : "") + fmt(Math.abs(s.G), 1), x, y + 7, {s:11, c:C.text, a:"center"});
       T(ctx, "H " + fmt(s.H, 2) + " · n " + s.n, x, y + 21, {s:11, c:C.text, a:"center"});
       /* barra del peso: escala fija para ver cómo encoge */
       var bl = clamp(Math.abs(w) / 3, 0, 1) * (bw / 2 - 6);
       ctx.fillStyle = w >= 0 ? C.pos : C.neg; ctx.fillRect(w >= 0 ? x : x - bl, y + bh / 2 + 4, bl, 4);
       ctx.fillStyle = C.line; ctx.fillRect(x - .5, y + bh / 2 + 2, 1, 8);
       ctx.restore();
     }
     edge(cxR, yR + 20, cL, yC - 20, pruneRoot); edge(cxR, yR + 20, cRr, yC - 20, pruneRoot);
     edge(cL, yC + 20, leafX[0], yLf - 31, pruneL); edge(cL, yC + 20, leafX[1], yLf - 31, pruneL);
     edge(cRr, yC + 20, leafX[2], yLf - 31, pruneR); edge(cRr, yC + 20, leafX[3], yLf - 31, pruneR);
     leafBox(leafX[0], yLf, spL.L, pruneL); leafBox(leafX[1], yLf, spL.R, pruneL);
     leafBox(leafX[2], yLf, spR.L, pruneR); leafBox(leafX[3], yLf, spR.R, pruneR);
     /* si se poda un hijo, su nodo pasa a ser hoja (peso de todo el grupo) */
     if(pruneRoot){ leafBox(cxR, yR + 2, all30, false); }
     else splitBox(cxR, yR, sp0, gR, false);
     [[cL, spL, gL1, pruneL, sp0.L], [cRr, spR, gR1, pruneR, sp0.R]].forEach(function(o){
       if(pruneRoot){ splitBox(o[0], yC, o[1], o[2], true); return; }
       splitBox(o[0], yC, o[1], o[2], o[3]);
       if(o[3]){ var wm = wOf(o[4]); pill(ctx, "✕ podado → w* " + (wm >= 0 ? "▲ +" : "▼ −") + fmt(Math.abs(wm), 2), o[0], yC + 34, C, {a:"center", c:C.neg, bd:C.neg}); }
     });
     /* fórmulas */
     var fy = 326;
     rr(ctx, x0, fy, x1 - x0, 96, 10); ctx.fillStyle = C.soft; ctx.fill();
     T(ctx, "w* = − G / (H + λ)", x0 + 12, fy + 20, {s:12, w:"700", c:C.ink});
     T(ctx, "peso de cada hoja", x1 - 12, fy + 20, {s:11, c:C.muted, a:"right"});
     T(ctx, "ganancia = ½ [ G_L²/(H_L+λ) + G_R²/(H_R+λ)", x0 + 12, fy + 42, {s:11.5, w:"600", c:C.ink});
     T(ctx, "− G²/(H+λ) ] − γ   → si sale < 0, se poda", x0 + 66, fy + 59, {s:11.5, w:"600", c:C.ink});
     T(ctx, "G = Σ(p − y) · H = Σ p(1 − p) · aquí p = 0,5", x0 + 12, fy + 82, {s:11, c:C.muted});
     return {pruned:(pruneRoot ? 3 : (pruneL ? 1 : 0) + (pruneR ? 1 : 0))};
   }
   function draw(){
     K.clear();
     var b = [62, 44, 322, 290], ymax = Math.max(vaL[0], trL[0]) * 1.05, ymin = 0;
     var lo = Math.min.apply(null, trL), vmin = vaL[bestR];
     ymin = Math.max(0, Math.min(lo, vmin) - 0.05);
     head(ctx, "(a) Error (log-loss) ronda a ronda", b[0] - 40, 24, C);
     var A = axes(ctx, b, [0, R], [ymin, ymax], C, {xl:"rondas (árboles añadidos)", xt:[0, 100, 200, 300]});
     [ymin, (ymin + ymax) / 2, ymax].forEach(function(v){ T(ctx, fmt(v, 2), b[0] - 6, A.sy(v) + 4, {s:11, c:C.muted, a:"right"}); });
     var sxs = A.sx(stopR);
     ctx.fillStyle = hexA(C.muted, .1); ctx.fillRect(sxs, b[1] + 1, b[0] + b[2] - sxs, b[3] - 2);
     if(stopR < R) T(ctx, "no se entrena", (sxs + b[0] + b[2]) / 2, b[1] + b[3] * .55, {s:11, c:C.muted, a:"center"});
     path(ctx, trL.map(function(v, m){ return [A.sx(m), A.sy(Math.max(v, ymin))]; }), C.c[0], 2.2);
     path(ctx, vaL.map(function(v, m){ return [A.sx(m), A.sy(v)]; }), C.c[1], 2.2);
     var bx = A.sx(bestR), by = A.sy(vmin);
     dashLine(ctx, bx, b[1], bx, b[1] + b[3], C.ink, 1.2, [4, 3]);
     dot(ctx, bx, by, 5, C.c[1], C.card);
     var right = bx < b[0] + b[2] - 150;
     pill(ctx, "⏹ mejor ronda: " + bestR, bx + (right ? 8 : -8), b[1] + 38, C, {a:right ? "left" : "right"});
     var L = trL.length - 1, lx = Math.max(A.sx(L), b[0] + 110) - 6;
     T(ctx, "entrenamiento", lx, Math.min(A.sy(trL[L]) + 17, b[1] + b[3] - 5), {s:11, w:"600", c:C.c[0], a:"right"});
     T(ctx, "validación", lx, Math.min(A.sy(vaL[L]) - 8, b[1] + b[3] - 6), {s:11, w:"600", c:C.c[1], a:"right"});
     var tr = drawTree();
     var over = vaL[L] - vmin;
     read.innerHTML = '<span>Mejor ronda <b>' + bestR + '</b></span><span>Parada temprana en <b>' + (stopR < R ? stopR : "—") + '</b></span>' +
       '<span>Log-loss validación · mínimo <b>' + fmt(vmin, 3) + '</b> · a ' + L + ' rondas <b>' + fmt(vaL[L], 3) + '</b></span>' +
       '<span>Cortes podados <b>' + tr.pruned + ' de 3</b></span>' +
       '<span class="ldiag">' + (over > 0.02 ? "Seguir hasta " + L + " rondas empeora la validación <b class='lbad'>▼ " + fmt(over, 3) + "</b>: el modelo empieza a memorizar ruido. El early stopping te ahorra " + (R - bestR) + " árboles inútiles." :
         "Con este learning rate la validación apenas empeora en 300 rondas: el early stopping aún así detecta dónde deja de mejorar.") +
       (tr.pruned ? " En el árbol de la derecha, γ = " + fmt(gam, 1) + " poda " + tr.pruned + (tr.pruned === 1 ? " corte" : " cortes") + " que no compensan." : " Sube γ para ver qué cortes no superan la ganancia mínima.") + '</span>';
   }
   ctlSlider(ctl, "Learning rate (eta)", 0.02, 1, 0.01, eta, function(v){ return fmt(v, 2); }, function(v){ eta = v; boost(); });
   ctlSlider(ctl, "Profundidad de cada árbol", 1, 6, 1, depth, function(v){ return v; }, function(v){ depth = v; boost(); });
   ctlSlider(ctl, "lambda: regularización L2 de los pesos", 0, 20, 0.5, lam, function(v){ return fmt(v, 1); }, function(v){ lam = v; draw(); });
   ctlSlider(ctl, "gamma: ganancia mínima para cortar", 0, 4, 0.1, gam, function(v){ return fmt(v, 1); }, function(v){ gam = v; draw(); });
   boost();
   return function(){ if(stopA) stopA(); };
 }});

/* ── 4. LIGHTGBM · crecer por hojas e histogramas ─────────────── */
VIZ.push({id:"v-lightgbm", model:"lightgbm", g:"model", ic:"⚡", dim:"2D",
 t:"Crecer por hojas y cortar por histogramas",
 q:"¿De dónde saca LightGBM su velocidad sin perder precisión?",
 intro:"<b>Arriba</b>, el mismo árbol crece de dos formas sobre 600 ventas sintéticas: <b>por niveles</b> (como XGBoost por defecto: completa cada piso antes de bajar) y <b>por hojas</b> (LightGBM: parte siempre la hoja con más <b>ganancia</b>, es decir, la que más reduce el error). Pulsa <b>▶ Paso</b>. <b>Abajo</b>, una variable con 1.000 valores agrupada en N cajas (bins): solo se prueban cortes entre cajas.",
 notice:["Con el <b>mismo número de hojas</b>, el árbol por hojas explica más error: no gasta cortes en ramas donde ya no hay nada que ganar.",
   "El árbol por hojas sale <b>profundo y asimétrico</b>. Por eso en LightGBM se limita con num_leaves (y min_data_in_leaf), no solo con la profundidad.",
   "Con 255 cajas (el valor por defecto) evalúas ~4 veces menos cortes que con los 1.000 valores y el mejor corte es <b>prácticamente el mismo</b>; incluso con 16 cajas la pérdida es pequeña."],
 models:["lightgbm","xgboost","catboost","gbr"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 440, K = makeCanvas(stage, W, H, "Crecimiento por niveles frente a por hojas y búsqueda de cortes con histogramas"), ctx = K.ctx;
   var MAXS = 9, step = 0, bins = 32, timer = null;
   /* ── datos de regresión: ventas con interacciones anidadas ── */
   var r = mulberry(7), X = [], Y = [];
   for(var i = 0; i < 600; i++){
     var a = r(), b = r(), y = 1.1 * (a > .5) + 1.5 * (a > .5 && b > .55) + 1.6 * (a > .5 && b > .55 && a > .78) + 1.5 * (a > .78 && b > .55 && b > .82) + .2 * (b > .3) + .35 * gauss(r);
     X.push([a, b]); Y.push(y);
   }
   function bestSplit(idx){
     var n = idx.length, s = 0; idx.forEach(function(i){ s += Y[i]; });
     var best = null;
     for(var f = 0; f < 2; f++){
       var srt = idx.slice().sort(function(p, q){ return X[p][f] - X[q][f]; }), sl = 0;
       for(var k = 1; k < n; k++){
         sl += Y[srt[k - 1]];
         if(k < 15 || n - k < 15) continue;
         var g = sl * sl / k + (s - sl) * (s - sl) / (n - k) - s * s / n;
         if(!best || g > best.g) best = {g:g, f:f, t:(X[srt[k - 1]][f] + X[srt[k]][f]) / 2};
       }
     }
     if(best){ best.L = []; best.R = []; idx.forEach(function(i){ (X[i][best.f] <= best.t ? best.L : best.R).push(i); }); }
     return best;
   }
   var all = X.map(function(_, i){ return i; }), mean = Y.reduce(function(p, q){ return p + q; }) / Y.length, SST = 0;
   Y.forEach(function(y){ SST += (y - mean) * (y - mean); });
   function mk(idx, d){ return {idx:idx, d:d, sp:bestSplit(idx), l:null, r:null}; }
   function treeAt(mode, steps){
     var root = mk(all, 0), leaves = [root], gain = 0, last = null, queue = [root];
     for(var s = 0; s < steps; s++){
       var nd = null;
       if(mode === "leaf"){ leaves.forEach(function(l){ if(l.sp && (!nd || l.sp.g > nd.sp.g)) nd = l; }); }
       else { while(queue.length && !queue[0].sp) queue.shift(); nd = queue.shift(); }
       if(!nd) break;
       nd.l = mk(nd.sp.L, nd.d + 1); nd.r = mk(nd.sp.R, nd.d + 1); gain += nd.sp.g; last = nd;
       leaves.splice(leaves.indexOf(nd), 1, nd.l, nd.r); queue.push(nd.l, nd.r);
     }
     var depth = 0; leaves.forEach(function(l){ depth = Math.max(depth, l.d); });
     return {root:root, gain:gain, last:last, leaves:leaves.length, depth:depth};
   }
   function drawTree(tr, box, title, col){
     head(ctx, title, box[0], box[1] - 10, C);
     var order = [], dy = Math.min(26, (box[3] - 30) / Math.max(4, tr.depth));
     (function walk(n){ if(n.l) walk(n.l); order.push(n); if(n.r) walk(n.r); })(tr.root);
     var sp = box[2] / (order.length + 1), pos = new Map();
     order.forEach(function(n, k){ pos.set(n, [box[0] + sp * (k + 1), box[1] + 16 + n.d * dy]); });
     ctx.lineWidth = 1.4; ctx.strokeStyle = C.muted;
     order.forEach(function(n){ if(n.l){ var p = pos.get(n); [n.l, n.r].forEach(function(c){ var q = pos.get(c); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }); } });
     order.forEach(function(n){
       var p = pos.get(n);
       if(n.l){ dot(ctx, p[0], p[1], n === tr.last ? 7 : 5.5, n === tr.last ? col : C.card, col); }
       else { ctx.fillStyle = hexA(col, .25); ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.fillRect(p[0] - 5, p[1] - 5, 10, 10); ctx.strokeRect(p[0] - 5, p[1] - 5, 10, 10); }
     });
     if(tr.last){
       var p = pos.get(tr.last), right = p[0] < box[0] + box[2] - 130;
       pill(ctx, "nuevo corte: +" + pct(tr.last.sp.g / SST, 1), p[0] + (right ? 12 : -12), p[1], C, {a:right ? "left" : "right", bd:col});
     }
     /* barra: % de error explicado */
     var by = box[1] + box[3] + 6, frac = tr.gain / SST;
     T(ctx, "error explicado", box[0], by + 4, {s:11, c:C.muted});
     var bx0 = box[0] + 96, bw = box[2] - 150;
     rr(ctx, bx0, by - 4, bw, 10, 5); ctx.fillStyle = C.line; ctx.fill();
     if(frac > 0){ rr(ctx, bx0, by - 4, Math.max(10, bw * frac), 10, 5); ctx.fillStyle = col; ctx.fill(); }
     T(ctx, pct(frac, 1), box[0] + box[2], by + 5, {s:12, w:"700", c:C.ink, a:"right"});
     T(ctx, tr.leaves + " hojas · profundidad " + tr.depth, box[0] + box[2], box[1] - 10, {s:11, c:C.muted, a:"right"});
   }
   /* ── (b) histograma: importe de ticket con 1.000 valores ── */
   var r2 = mulberry(24), V = [], VY = [];
   while(V.length < 1000){ var v = Math.exp(3.6 + .62 * gauss(r2)); if(v > 149 || v < 3) continue; V.push(v); VY.push(r2() < sig((v - 55) / 6) * .8 + .1 ? 1 : 0); }
   var vs = V.map(function(_, i){ return i; }).sort(function(a, b){ return V[a] - V[b]; }), sY = 0; VY.forEach(function(y){ sY += y; });
   function gainAt(k, sl){ var n = V.length, pl = sl / k, pr = (sY - sl) / (n - k), p = sY / n; return n * p * (1 - p) - (k * pl * (1 - pl) + (n - k) * pr * (1 - pr)); }
   var exact = null, nExact = 0, cumY = [0];
   vs.forEach(function(i){ cumY.push(cumY[cumY.length - 1] + VY[i]); });
   for(var k = 1; k < V.length; k++){ if(V[vs[k - 1]] === V[vs[k]]) continue; nExact++; var g = gainAt(k, cumY[k]); if(!exact || g > exact.g) exact = {g:g, t:(V[vs[k - 1]] + V[vs[k]]) / 2}; }
   function binned(){
     var edges = [], cand = [];
     for(var b = 1; b < bins; b++){ var k = Math.round(b * V.length / bins); if(k > 0 && k < V.length && (!edges.length || edges[edges.length - 1] !== k)) edges.push(k); }
     var best = null;
     edges.forEach(function(k){ var g = gainAt(k, cumY[k]); cand.push((V[vs[k - 1]] + V[vs[k]]) / 2); if(!best || g > best.g) best = {g:g, t:(V[vs[k - 1]] + V[vs[k]]) / 2}; });
     return {best:best, edges:edges, cuts:cand};
   }
   function draw(){
     K.clear();
     var tl = treeAt("level", step), tf = treeAt("leaf", step);
     drawTree(tl, [24, 40, 340, 180], "Por niveles (XGBoost)", C.c[1]);
     drawTree(tf, [400, 40, 340, 180], "Por hojas (LightGBM)", C.c[0]);
     ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(382, 30); ctx.lineTo(382, 236); ctx.stroke();
     /* (b) */
     var B = binned(), bx = [40, 296, 696, 104], xmax = 150, sx = function(v){ return bx[0] + v / xmax * bx[2]; };
     head(ctx, "Histograma: 1.000 importes de ticket agrupados en " + bins + " cajas", bx[0], 270, C);
     var lo = 0, bars = [], dmax = 0;
     var ed = [0].concat(B.edges, [V.length]);
     for(var q = 0; q < ed.length - 1; q++){
       var a = ed[q], c = ed[q + 1], x0 = q ? B.cuts[q - 1] : 0, x1 = q < B.cuts.length ? B.cuts[q] : xmax, w = Math.max(x1 - x0, 1e-6), pos = cumY[c] - cumY[a];
       var dens = (c - a) / Math.max(w, 1.5); bars.push([x0, x1, dens, pos / Math.max(1, c - a)]); dmax = Math.max(dmax, dens);
     }
     bars.forEach(function(br){
       var X0 = sx(br[0]), X1 = sx(br[1]), h = Math.min(1, br[2] / dmax) * bx[3], yb = bx[1] + bx[3];
       ctx.fillStyle = hexA(C.c[0], .3); ctx.fillRect(X0 + .5, yb - h, Math.max(1, X1 - X0 - 1), h);
       ctx.fillStyle = hexA(C.c[1], .75); ctx.fillRect(X0 + .5, yb - h * br[3], Math.max(1, X1 - X0 - 1), h * br[3]);
     });
     ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(bx[0], bx[1] + bx[3] + .5); ctx.lineTo(bx[0] + bx[2], bx[1] + bx[3] + .5); ctx.stroke();
     if(bins <= 64) B.cuts.forEach(function(t){ ctx.fillStyle = C.muted; ctx.fillRect(sx(t) - .5, bx[1] + bx[3], 1, 4); });
     [0, 25, 50, 75, 100, 125, 150].forEach(function(t){ T(ctx, t + " €", sx(t), bx[1] + bx[3] + 16, {s:11, c:C.muted, a:"center"}); });
     dashLine(ctx, sx(exact.t), bx[1] - 4, sx(exact.t), bx[1] + bx[3], C.ink, 1.4, [4, 3]);
     dashLine(ctx, sx(B.best.t), bx[1] + 18, sx(B.best.t), bx[1] + bx[3], C.c[0], 2.2, [2, 0]);
     var lt = Math.abs(sx(B.best.t) - sx(exact.t)) < 4;
     pill(ctx, "corte exacto " + fmt(exact.t, 1) + " €", sx(exact.t) + 8, bx[1] + 2, C, {});
     pill(ctx, "corte con cajas " + fmt(B.best.t, 1) + " €", sx(B.best.t) + 8, bx[1] + 26, C, {c:C.ink, bd:C.c[0]});
     T(ctx, "■ compra repetida  ■ no repite", bx[0] + bx[2], 270, {s:11, c:C.muted, a:"right"});
     T(ctx, "■", bx[0] + bx[2] - TW(ctx, "compra repetida  ■ no repite", 11) - 3, 270, {s:11, c:C.c[1], a:"right"});
     T(ctx, "■", bx[0] + bx[2] - TW(ctx, "no repite", 11) - 3, 270, {s:11, c:hexA(C.c[0], .6), a:"right"});
     var loss = (exact.g - B.best.g) / exact.g;
     read.innerHTML = '<span>Hojas <b>' + tf.leaves + '</b></span><span>Error explicado · por niveles <b>' + pct(tl.gain / SST, 1) + '</b> · por hojas <b>' + pct(tf.gain / SST, 1) + '</b></span>' +
       '<span>Profundidad · niveles <b>' + tl.depth + '</b> · hojas <b>' + tf.depth + '</b></span>' +
       '<span>Cortes a evaluar <b>' + B.cuts.length + '</b> en vez de <b>' + miles(nExact) + '</b></span><span>Ganancia perdida <b>' + (loss < 0.0005 ? "0%" : pct(loss, 2)) + '</b></span>' +
       '<span class="ldiag">' + (step ? (tf.gain > tl.gain + 1e-9 ? "Con " + tf.leaves + " hojas, crecer por hojas explica <b class='lgood'>▲ " + fmt(100 * (tf.gain - tl.gain) / SST, 1) + " puntos más</b> de error. " : "Con tan pocas hojas, los dos árboles aún coinciden. ") : "Pulsa ▶ Paso para hacer crecer los árboles. ") +
       'Con ' + bins + ' cajas evalúas <b>' + B.cuts.length + ' cortes en vez de ' + miles(nExact) + '</b> (' + fmt(nExact / B.cuts.length, 0) + ' veces menos) y el corte elegido ' + (loss < 0.01 ? 'es <b>casi idéntico</b>.' : 'pierde un <b>' + pct(loss, 1) + '</b> de ganancia.') + '</span>';
   }
   function stop(){ clearInterval(timer); timer = null; }
   ctlBtn(ctl, "▶ Paso", function(){ stop(); if(step < MAXS){ step++; draw(); } }, true);
   ctlBtn(ctl, "⏵ Reproducir", function(){ stop(); step = 0; draw(); timer = setInterval(function(){ if(step >= MAXS){ stop(); return; } step++; draw(); }, 900); });
   ctlBtn(ctl, "↺ Reiniciar", function(){ stop(); step = 0; draw(); });
   ctlSlider(ctl, "Número de cajas (bins)", 4, 255, 1, bins, function(v){ return v + " cajas → " + (v - 1) + " cortes"; }, function(v){ bins = v; draw(); });
   draw();
   return stop;
 }});

/* ── 5. CATBOOST · ordered target statistics ──────────────────── */
VIZ.push({id:"v-catboost", model:"catboost", g:"model", ic:"🐱", dim:"2D",
 t:"Codificar categorías sin hacer trampa",
 q:"¿Cómo convierte CatBoost una categoría en número sin «chivarle» la respuesta al modelo?",
 intro:"La tabla son 14 clientes en un <b>orden al azar</b>. Para cada uno, CatBoost calcula la tasa de bajas de su provincia usando <b>solo las filas anteriores</b> (más un valor previo para no partir de cero). La versión <b>ingenua</b> usa todas las filas, <b>incluida la suya</b>: así la respuesta se cuela en la variable. Pulsa ▶ y mira qué filas consulta cada cliente. A la derecha, un experimento real con 4.000 clientes.",
 notice:["Cada cliente solo «mira» a los de su provincia que están <b>por encima</b> en la tabla. El primero de cada provincia recibe el valor previo (la media global).",
   "Soria aparece una sola vez: la codificación ingenua es (su propio target + previo) / 2, así que <b>delata si se fue o no</b>. La ordenada le da solo el previo.",
   "Con una columna de IDs que es puro ruido, la codificación ingenua da un AUC de entrenamiento <b>altísimo</b> y en test ≈ 0,5: el modelo ha aprendido una fuga. La ordenada se queda en ≈ 0,5 en los dos, que es la verdad."],
 models:["catboost","xgboost","lightgbm","logistica"],
 build:function(stage, ctl, read, C){
   var PROV = ["Madrid", "Sevilla", "Valencia", "Bilbao", "Soria"];
   var BASE = [[0, 1], [1, 0], [0, 0], [2, 1], [1, 1], [0, 0], [3, 0], [2, 0], [0, 1], [1, 1], [3, 1], [2, 0], [4, 1], [1, 0]];
   var A = 1, order, cur = -1, timer = null, expSeed = 3, shufSeed = 5;
   var wrap = document.createElement("div"); wrap.className = "vbc";
   wrap.innerHTML = '<style>' +
     '.vbc{width:100%;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:14px}' +
     '@media(max-width:860px){.vbc{grid-template-columns:1fr}}' +
     '.vbc-card{background:var(--card);border:.5px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--shadow-1);padding:16px 16px 14px;min-width:0}' +
     '.vbc-h{font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--muted);margin-bottom:10px}' +
     '.vbc table{width:100%;min-width:0;border-collapse:collapse;font-size:13px;font-variant-numeric:tabular-nums}' +
     '.vbc th{font-size:10.5px;font-weight:600;letter-spacing:.4px;text-transform:uppercase;color:var(--label);text-align:left;padding:6px 6px;border-bottom:.5px solid var(--line);background:none;position:static;cursor:default;white-space:normal}' +
     '.vbc td{padding:5px 6px;border-bottom:.5px solid var(--line);color:var(--text);transition:background .25s,opacity .25s}' +
     '.vbc td.n{text-align:right}.vbc th.n{text-align:right}' +
     '.vbc tr.cur td{background:color-mix(in srgb,var(--lab1) 22%,transparent);color:var(--ink);font-weight:600}' +
     '.vbc tr.look td{background:color-mix(in srgb,var(--lab1) 9%,transparent)}' +
     '.vbc tr.look td:first-child::before{content:"👁 ";font-size:11px}' +
     '.vbc tr.after td{opacity:.42}' +
     '.vbc .pv{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}.vbc .pv i{width:9px;height:9px;border-radius:3px;display:inline-block}' +
     '.vbc .yv{font-weight:600}.vbc .ord{color:var(--ink);font-weight:600}.vbc .warn{color:var(--negative);font-weight:600}' +
     '.vbc-form{margin-top:12px;font-size:13.5px;line-height:1.6;color:var(--text);background:var(--card-2);border-radius:var(--r);padding:10px 12px;min-height:66px}' +
     '.vbc-form b{color:var(--ink)}.vbc-form code{font-family:var(--mono);font-size:12.5px}' +
     '.vbc-bars{display:flex;flex-direction:column;gap:12px;margin-top:4px}' +
     '.vbc-grp{font-size:13px;font-weight:600;color:var(--ink);margin-top:4px}' +
     '.vbc-row{display:grid;grid-template-columns:96px 1fr 46px;gap:8px;align-items:center;font-size:12.5px;color:var(--text)}' +
     '.vbc-ax s:nth-child(2){transform:translateX(-10%)}.vbc-tr{position:relative;height:16px;background:var(--card-2);border-radius:8px;overflow:visible}' +
     '.vbc-tr span{position:absolute;left:0;top:0;bottom:0;border-radius:8px;transition:width .6s cubic-bezier(.2,.8,.2,1)}' +
     '.vbc-tr em{position:absolute;top:-4px;bottom:-4px;width:0;border-left:1.5px dashed var(--ink)}' +
     '.vbc-v{font-weight:700;color:var(--ink);text-align:right}' +
     '.vbc-ax{display:grid;grid-template-columns:96px 1fr 46px;gap:8px;font-size:11px;color:var(--muted)}.vbc-ax div{position:relative;height:14px}.vbc-ax s{position:absolute;text-decoration:none;transform:translateX(-50%)}' +
     '.vbc-note{font-size:12.5px;line-height:1.55;color:var(--muted);margin-top:12px}' +
     '</style>' +
     '<div class="vbc-card"><div class="vbc-h">Ordered target statistics · fila a fila</div><table><thead><tr><th>#</th><th>Provincia</th><th>¿Se va?</th><th class="n">Ordenada<br>(CatBoost)</th><th class="n">Ingenua<br>(con su fila)</th></tr></thead><tbody></tbody></table>' +
     '<div class="vbc-form"></div></div>' +
     '<div class="vbc-card"><div class="vbc-h">Experimento · columna «ID de cliente» que es puro ruido</div><div class="vbc-bars"></div>' +
     '<div class="vbc-note">4.000 clientes, 1.500 IDs distintos, target al azar (30% de bajas): el ID <b>no puede</b> predecir nada. Usamos la propia codificación como puntuación y medimos el AUC (0,5 = azar; 1 = perfecto). La mitad de las filas se usan para codificar y entrenar; la otra mitad es el test.</div></div>';
   stage.appendChild(wrap);
   var tbody = wrap.querySelector("tbody"), form = wrap.querySelector(".vbc-form"), bars = wrap.querySelector(".vbc-bars");
   var prior = BASE.reduce(function(s, b){ return s + b[1]; }, 0) / BASE.length;
   function shuffle(seed){ var r = mulberry(seed), o = BASE.map(function(_, i){ return i; }); for(var i = o.length - 1; i > 0; i--){ var j = Math.floor(r() * (i + 1)), t = o[i]; o[i] = o[j]; o[j] = t; } return o; }
   function enc(k){ /* codificación ordenada de la fila en la posición k */
     var c = BASE[order[k]][0], n = 0, s = 0, look = [];
     for(var j = 0; j < k; j++){ var b = BASE[order[j]]; if(b[0] === c){ n++; s += b[1]; look.push(j); } }
     return {v:(s + A * prior) / (n + A), n:n, s:s, look:look};
   }
   function naive(k){ var c = BASE[order[k]][0], n = 0, s = 0; BASE.forEach(function(b){ if(b[0] === c){ n++; s += b[1]; } }); return {v:(s + A * prior) / (n + A), n:n, s:s}; }
   function render(){
     var e = cur >= 0 ? enc(cur) : null;
     tbody.innerHTML = order.map(function(ix, k){
       var b = BASE[ix], nv = naive(k), cls = k === cur ? "cur" : e && e.look.indexOf(k) > -1 ? "look" : cur >= 0 && k > cur ? "after" : "";
       return '<tr class="' + cls + '"><td>' + (k + 1) + '</td><td><span class="pv"><i style="background:' + C.c[1 + b[0]] + '"></i>' + PROV[b[0]] + '</span></td>' +
         '<td class="yv">' + (b[1] ? "sí" : "no") + '</td><td class="n ord">' + (k <= cur ? fmt(enc(k).v, 2) : "·") + '</td>' +
         '<td class="n' + (nv.n === 1 ? ' warn' : '') + '">' + (nv.n === 1 ? "⚠ " : "") + fmt(nv.v, 2) + '</td></tr>';
     }).join("");
     if(e){
       var b = BASE[order[cur]], nv = naive(cur);
       form.innerHTML = '<b>Fila ' + (cur + 1) + ' · ' + PROV[b[0]] + '</b>: antes hay <b>' + e.n + '</b> ' + (e.n === 1 ? "fila" : "filas") + ' de ' + PROV[b[0]] + ' y <b>' + e.s + '</b> se ' + (e.s === 1 ? "fue" : "fueron") +
         ' → <code>(' + e.s + ' + ' + A + '×' + fmt(prior, 2) + ') / (' + e.n + ' + ' + A + ')</code> = <b>' + fmt(e.v, 2) + '</b>' + (e.n === 0 ? " (primera de su provincia: solo el previo)" : "") +
         '<br>La ingenua usa las ' + nv.n + ' filas de ' + PROV[b[0]] + ', <b>incluida esta</b>: <code>(' + nv.s + ' + ' + fmt(prior, 2) + ') / (' + nv.n + ' + 1)</code> = ' + fmt(nv.v, 2) + '.';
     } else form.innerHTML = 'Pulsa <b>▶ Reproducir</b> o <b>Paso</b>. Valor previo = media global de bajas = <b>' + fmt(prior, 2) + '</b>, con peso a = ' + A + '.';
   }
   /* ── experimento con IDs de alta cardinalidad ── */
   var res;
   function experiment(){
     var r = mulberry(expSeed * 101), N = 4000, NID = 1500, id = [], y = [];
     for(var i = 0; i < N; i++){ id.push(Math.floor(r() * NID)); y.push(r() < .3 ? 1 : 0); }
     var tr = [], te = []; for(i = 0; i < N; i++) (i % 2 ? te : tr).push(i);
     var P = tr.reduce(function(s, i){ return s + y[i]; }, 0) / tr.length;
     var cnt = {}, sum = {}; tr.forEach(function(i){ cnt[id[i]] = (cnt[id[i]] || 0) + 1; sum[id[i]] = (sum[id[i]] || 0) + y[i]; });
     var full = function(k){ return ((sum[k] || 0) + A * P) / ((cnt[k] || 0) + A); };
     var nTr = tr.map(function(i){ return full(id[i]); }), nTe = te.map(function(i){ return full(id[i]); });
     /* ordenada: permutación aleatoria y solo el historial anterior */
     var perm = tr.slice(); for(i = perm.length - 1; i > 0; i--){ var j = Math.floor(r() * (i + 1)), t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
     var c2 = {}, s2 = {}, oTr = [], yTr = [];
     perm.forEach(function(i){ var k = id[i]; oTr.push(((s2[k] || 0) + A * P) / ((c2[k] || 0) + A)); yTr.push(y[i]); c2[k] = (c2[k] || 0) + 1; s2[k] = (s2[k] || 0) + y[i]; });
     var yT = tr.map(function(i){ return y[i]; }), yE = te.map(function(i){ return y[i]; });
     res = {nTr:auc(nTr, yT), nTe:auc(nTe, yE), oTr:auc(oTr, yTr), oTe:auc(nTe, yE)};
     var pos = function(a){ return clamp((a - .4) / .6, 0, 1) * 100; };
     var row = function(lab, a, col){ return '<div class="vbc-row"><span>' + lab + '</span><div class="vbc-tr"><span style="width:' + pos(a) + '%;background:' + col + '"></span><em style="left:' + pos(.5) + '%"></em></div><span class="vbc-v">' + fmt(a, 2) + '</span></div>'; };
     bars.innerHTML = '<div class="vbc-grp">Codificación ingenua</div>' + row("entrenamiento", res.nTr, C.c[0]) + row("test", res.nTe, C.c[1]) +
       '<div class="vbc-grp">Codificación ordenada (CatBoost)</div>' + row("entrenamiento", res.oTr, C.c[0]) + row("test", res.oTe, C.c[1]) +
       '<div class="vbc-ax"><span></span><div><s style="left:0;transform:none">0,4</s><s style="left:' + pos(.5) + '%">0,5 azar</s><s style="left:' + pos(.75) + '%">0,75</s><s style="left:100%">1</s></div><span></span></div>';
   }
   function readout(){
     read.innerHTML = '<span>AUC ingenua · train <b>' + fmt(res.nTr, 3) + '</b> · test <b>' + fmt(res.nTe, 3) + '</b></span>' +
       '<span>AUC ordenada · train <b>' + fmt(res.oTr, 3) + '</b> · test <b>' + fmt(res.oTe, 3) + '</b></span>' +
       '<span class="ldiag">La codificación ingenua promete un AUC de <b class="lbad">' + fmt(res.nTr, 2) + '</b> en entrenamiento con una columna que es puro ruido: es <b>fuga de información</b> (el target de cada fila está dentro de su propia variable). En test se desploma a ' + fmt(res.nTe, 2) + '. La ordenada dice la verdad desde el principio: ≈ 0,5 en los dos.</span>';
   }
   function stop(){ clearInterval(timer); timer = null; if(playB) playB.innerHTML = "▶ Reproducir"; }
   function step(){ if(cur < order.length - 1){ cur++; render(); return true; } return false; }
   var playB = ctlBtn(ctl, "▶ Reproducir", function(){
     if(timer){ stop(); return; }
     if(cur >= order.length - 1) cur = -1;
     playB.innerHTML = "⏸ Pausa"; step();
     timer = setInterval(function(){ if(!step()) stop(); }, 1300);
   }, true);
   ctlBtn(ctl, "Paso →", function(){ stop(); step(); });
   ctlBtn(ctl, "🔀 Otro orden aleatorio", function(){ stop(); order = shuffle(++shufSeed); cur = -1; render(); });
   ctlBtn(ctl, "🎲 Repetir experimento", function(){ expSeed++; experiment(); readout(); });
   order = shuffle(shufSeed); render(); experiment(); readout();
   return stop;
 }});

/* ── 6. ADABOOST · los pesos que crecen ───────────────────────── */
VIZ.push({id:"v-adaboost", model:"adaboost", g:"model", ic:"🔁", dim:"2D",
 t:"Ronda a ronda: los errores pesan más",
 q:"¿Cómo consigue AdaBoost un buen modelo sumando reglas de un solo corte?",
 intro:"120 operaciones con tarjeta: naranja = fraude, morado = normal. Cada ronda, AdaBoost entrena un <b>tocón</b> (un árbol de un solo corte) dando más <b>peso</b> a los puntos que las rondas anteriores fallaron (el tamaño del punto es su peso). Cada tocón vota con fuerza <b>α</b>, mayor cuanto menos se equivoca. El fondo es el voto combinado. Mueve la ronda o pulsa ▶. Algoritmo real (AdaBoost discreto).",
 notice:["Los puntos que el tocón de la ronda falla (con aro) <b>crecen</b> en la siguiente: el próximo tocón se ve obligado a atenderlos.",
   "Ningún tocón por sí solo separa el círculo, pero la <b>suma ponderada</b> de muchos cortes rectos dibuja una frontera que lo rodea.",
   "Activa las etiquetas erróneas: AdaBoost se <b>obsesiona</b> con ellas. Unos pocos puntos (✕) acaban acaparando buena parte del peso total; por eso es sensible al ruido."],
 models:["adaboost","xgboost","gbr","arbol"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 430, K = makeCanvas(stage, W, H, "AdaBoost: pesos de los puntos, tocón de la ronda, alfas y error"), ctx = K.ctx;
   var RMAX = 40, t = 1, noise = false, P, Yb, flip, rounds, timer = null, G = 64;
   function gen(){
     var r = mulberry(9); P = []; Yb = []; flip = [];
     for(var i = 0; i < 120; i++){
       var p = [r(), r()], y = Math.hypot(p[0] - .52, p[1] - .48) < .28 ? 1 : -1;
       P.push(p); Yb.push(y); flip.push(false);
     }
     if(noise){ var r2 = mulberry(77), k = 0; while(k < 6){ var j = Math.floor(r2() * 120); if(!flip[j]){ flip[j] = true; Yb[j] = -Yb[j]; k++; } } }
   }
   function stump(w){
     var best = null, n = P.length;
     for(var f = 0; f < 2; f++){
       var srt = P.map(function(_, i){ return i; }).sort(function(a, b){ return P[a][f] - P[b][f]; });
       var wPosL = 0, wNegL = 0, wPos = 0, wNeg = 0;
       srt.forEach(function(i){ if(Yb[i] > 0) wPos += w[i]; else wNeg += w[i]; });
       for(var k = 0; k <= n; k++){
         if(k > 0){ var i = srt[k - 1]; if(Yb[i] > 0) wPosL += w[i]; else wNegL += w[i]; }
         if(k > 0 && k < n && P[srt[k - 1]][f] === P[srt[k]][f]) continue;
         var th = k === 0 ? P[srt[0]][f] - .01 : k === n ? P[srt[n - 1]][f] + .01 : (P[srt[k - 1]][f] + P[srt[k]][f]) / 2;
         /* polaridad s: predice s si x>th, −s si no */
         var eP = wPosL + (wNeg - wNegL), eN = wNegL + (wPos - wPosL);
         if(!best || eP < best.e) best = {e:eP, f:f, t:th, s:1};
         if(eN < best.e) best = {e:eN, f:f, t:th, s:-1};
       }
     }
     return best;
   }
   var hS = function(s, x){ return x[s.f] > s.t ? s.s : -s.s; };
   function train(){
     gen();
     var n = P.length, w = P.map(function(){ return 1 / n; }), F = P.map(function(){ return 0; });
     rounds = [];
     for(var m = 0; m < RMAX; m++){
       var s = stump(w), e = clamp(s.e, 1e-6, 1 - 1e-6), a = .5 * Math.log((1 - e) / e);
       var wBefore = w.slice(), wrong = P.map(function(x, i){ return hS(s, x) !== Yb[i]; });
       F = F.map(function(v, i){ return v + a * hS(s, P[i]); });
       var err = F.filter(function(v, i){ return (v >= 0 ? 1 : -1) !== Yb[i]; }).length / n;
       w = w.map(function(v, i){ return v * Math.exp(-a * Yb[i] * hS(s, P[i])); });
       var z = w.reduce(function(p, q){ return p + q; }); w = w.map(function(v){ return v / z; });
       rounds.push({s:s, a:a, e:e, w:wBefore, wrong:wrong, err:err});
     }
   }
   var box = [40, 36, 364, 364];
   function draw(){
     K.clear();
     var R = rounds[t - 1], sx = function(x){ return box[0] + x * box[2]; }, sy = function(y){ return box[1] + (1 - y) * box[3]; };
     head(ctx, "Ronda " + t + " · voto combinado de " + t + (t === 1 ? " tocón" : " tocones"), box[0], 22, C);
     drawImg(ctx, probImage(G, function(i, j){
       var x = [(i + .5) / G, 1 - (j + .5) / G], F = 0;
       for(var m = 0; m < t; m++) F += rounds[m].a * hS(rounds[m].s, x);
       return sig(2 * F);
     }, C, .5), box, false);
     frame(ctx, box, C);
     /* círculo real */
     ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = C.muted; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.arc(sx(.52), sy(.48), .28 * box[2], 0, TAU); ctx.stroke(); ctx.restore();
     /* tocón de la ronda */
     var s = R.s;
     ctx.save(); ctx.beginPath(); ctx.rect(box[0], box[1], box[2], box[3]); ctx.clip();
     if(s.f === 0) dashLine(ctx, sx(s.t), box[1], sx(s.t), box[1] + box[3], C.ink, 2.2, [7, 4]);
     else dashLine(ctx, box[0], sy(s.t), box[0] + box[2], sy(s.t), C.ink, 2.2, [7, 4]);
     ctx.restore();
     /* lado «fraude» del tocón */
     var lab = "tocón " + t + ": " + (s.f === 0 ? "x " : "y ") + (s.s > 0 ? ">" : "≤") + " " + fmt(s.t, 2) + " → fraude";
     if(s.f === 0) pill(ctx, lab, clamp(sx(s.t), box[0] + 90, box[0] + box[2] - 90), box[1] + box[3] - 16, C, {a:"center"});
     else pill(ctx, lab, box[0] + 10, clamp(sy(s.t) + (sy(s.t) > box[1] + 40 ? -16 : 16), box[1] + 14, box[1] + box[3] - 14), C, {});
     /* puntos: tamaño ∝ peso */
     var n = P.length, ordr = P.map(function(_, i){ return i; }).sort(function(a, b){ return R.w[b] - R.w[a]; });
     ordr.forEach(function(i){
       var rad = clamp(2.2 + Math.sqrt(R.w[i] * n) * 3.6, 2.2, 24), x = sx(P[i][0]), y = sy(P[i][1]);
       dot(ctx, x, y, rad, hexA(Yb[i] > 0 ? C.c[1] : C.c[0], .85), C.card);
       if(R.wrong[i]){ ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, rad + 3, 0, TAU); ctx.stroke(); }
       if(flip[i]){ ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; var d = Math.max(3, rad * .5); ctx.beginPath(); ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d); ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d); ctx.stroke(); }
     });
     T(ctx, "● fraude   ● normal   ◯ fallado por este tocón" + (noise ? "   ✕ etiqueta errónea" : ""), box[0], box[1] + box[3] + 18, {s:11, c:C.muted});
     T(ctx, "●", box[0], box[1] + box[3] + 18, {s:11, c:C.c[1]});
     T(ctx, "●", box[0] + TW(ctx, "● fraude   ", 11), box[1] + box[3] + 18, {s:11, c:C.c[0]});
     /* alfas */
     var ab = [452, 50, 288, 140], amax = Math.max.apply(null, rounds.map(function(q){ return q.a; })), bw = ab[2] / RMAX;
     head(ctx, "Fuerza del voto (alfa) de cada tocón", ab[0], 22, C);
     ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(ab[0], ab[1] + ab[3] + .5); ctx.lineTo(ab[0] + ab[2], ab[1] + ab[3] + .5); ctx.stroke();
     rounds.forEach(function(q, m){
       var h = q.a / amax * (ab[3] - 6);
       ctx.fillStyle = m === t - 1 ? C.c[0] : m < t ? hexA(C.c[0], .45) : hexA(C.muted, .15);
       rr(ctx, ab[0] + m * bw + 1, ab[1] + ab[3] - h, bw - 2, h, 2); ctx.fill();
     });
     var cx = ab[0] + (t - .5) * bw;
     pill(ctx, "α" + " = " + fmt(R.a, 2) + " · ε = " + pct(R.e, 1), clamp(cx, ab[0] + 70, ab[0] + ab[2] - 70), ab[1] - 8, C, {a:"center", bd:C.c[0]});
     T(ctx, "1", ab[0] + bw / 2, ab[1] + ab[3] + 14, {s:11, c:C.muted, a:"center"});
     T(ctx, "40 rondas", ab[0] + ab[2], ab[1] + ab[3] + 14, {s:11, c:C.muted, a:"right"});
     /* error de entrenamiento */
     var eb = [452, 250, 288, 120], emax = Math.max(.3, Math.max.apply(null, rounds.map(function(q){ return q.err; })));
     head(ctx, "Error de train del conjunto", ab[0], 232, C);
     var ex = function(m){ return eb[0] + (m - 1) / (RMAX - 1) * eb[2]; }, ey = function(v){ return eb[1] + eb[3] - v / emax * eb[3]; };
     ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(eb[0], eb[1] + eb[3] + .5); ctx.lineTo(eb[0] + eb[2], eb[1] + eb[3] + .5); ctx.stroke();
     path(ctx, rounds.map(function(q, m){ return [ex(m + 1), ey(q.err)]; }), hexA(C.c[0], .3), 2);
     path(ctx, rounds.slice(0, t).map(function(q, m){ return [ex(m + 1), ey(q.err)]; }), C.c[0], 2.4);
     dot(ctx, ex(t), ey(R.err), 4.5, C.c[0], C.card);
     T(ctx, pct(emax, 0), eb[0] - 6, eb[1] + 8, {s:11, c:C.muted, a:"right"});
     T(ctx, "0%", eb[0] - 6, eb[1] + eb[3], {s:11, c:C.muted, a:"right"});
     T(ctx, "1", eb[0], eb[1] + eb[3] + 14, {s:11, c:C.muted, a:"center"});
     T(ctx, "40 rondas", eb[0] + eb[2], eb[1] + eb[3] + 14, {s:11, c:C.muted, a:"right"});
     T(ctx, pct(R.err, 1), ex(t) + (t > 32 ? -8 : 8), ey(R.err) - 8, {s:11, w:"700", c:C.ink, a:t > 32 ? "right" : "left"});
     /* lectura */
     var wN = 0; flip.forEach(function(f, i){ if(f) wN += R.w[i]; });
     var mx = Math.max.apply(null, R.w) * n;
     read.innerHTML = '<span>Ronda <b>' + t + '</b></span><span>Error ponderado del tocón ε <b>' + pct(R.e, 1) + '</b></span><span>Su voto α <b>' + fmt(R.a, 2) + '</b></span>' +
       '<span>Error de train del conjunto <b>' + pct(R.err, 1) + '</b></span><span>Punto más pesado <b>' + fmt(mx, 1) + '×</b> el peso inicial</span>' +
       (noise ? '<span>Peso en las 6 etiquetas erróneas <b>' + pct(wN, 0) + '</b> del total (eran el ' + pct(6 / n, 0) + ')</span>' : '') +
       '<span class="ldiag">' + (noise && wN > .15 ? "<b class='lbad'>AdaBoost se ha obsesionado</b>: 6 puntos mal etiquetados (el " + pct(6 / n, 0) + " de los datos) acaparan el " + pct(wN, 0) + " del peso. Los siguientes tocones se dedican a ellos en vez de al patrón real." :
         t === 1 ? "Un tocón solo hace un corte recto: se equivoca mucho. Avanza rondas y mira cómo crecen los puntos fallados." :
         "α = ½·ln((1 − ε)/ε): con ε = " + pct(R.e, 0) + " el tocón vota con fuerza " + fmt(R.a, 2) + ". " + (R.err < .03 ? "El conjunto ya casi no falla en entrenamiento." : "La frontera combinada va rodeando el círculo poco a poco.")) + '</span>';
   }
   function stop(){ clearInterval(timer); timer = null; if(pb) pb.innerHTML = "▶ Reproducir"; }
   var sl = ctlSlider(ctl, "Ronda t", 1, RMAX, 1, t, function(v){ return v + " de " + RMAX; }, function(v){ stop(); t = v; draw(); });
   var pb = ctlBtn(ctl, "▶ Reproducir", function(){
     if(timer){ stop(); return; }
     if(t >= RMAX) t = 0;
     pb.innerHTML = "⏸ Pausa";
     timer = setInterval(function(){ if(t >= RMAX){ stop(); return; } t++; sl.set(t); draw(); }, 650);
   }, true);
   ctlCheck(ctl, "Añadir 5% de etiquetas erróneas", noise, function(v){ noise = v; train(); draw(); });
   train(); draw();
   return stop;
 }});

/* ── 7. SVM LINEAL · margen y vectores de soporte ─────────────── */
VIZ.push({id:"v-svmlin", model:"svmlin", g:"model", ic:"📏", dim:"2D",
 t:"El margen y sus vectores de soporte",
 q:"¿Por qué una SVM solo «escucha» a unos pocos puntos?",
 intro:"¿Compra el nuevo iPhone según <b>edad</b> y <b>salario</b>? La SVM busca la recta con el <b>margen</b> (la franja vacía entre las líneas discontinuas) más ancho posible. Los puntos rodeados son los <b>vectores de soporte</b>: los únicos que fijan la recta. Mueve <b>C</b> y <b>haz clic</b> en el gráfico para añadir clientes. Se resuelve de verdad (SVM de margen blando con el algoritmo SMO).",
 notice:["Añade un punto <b>lejos del margen</b> y en su lado correcto: la recta no se mueve ni un milímetro (su α vale 0).",
   "Añade uno <b>dentro del margen</b> o en el lado equivocado: se convierte en vector de soporte y la recta <b>se recoloca</b>.",
   "C pequeño = margen ancho y tolerante (muchos vectores de soporte, se permiten errores). C grande = margen estrecho que intenta no fallar ninguno."],
 models:["svmlin","svmker","logistica","svr"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 420, K = makeCanvas(stage, W, H, "SVM lineal con margen, vectores de soporte y pesos alfa"), ctx = K.ctx;
   var logC = 0, addCls = 1, base = [], extra = [], sol = null, shown = null, anim = null, msg = "";
   var r = mulberry(31);
   for(var i = 0; i < 44; i++){
     var a = gauss(r) * .95, s = gauss(r) * .95, sc = 1.1 * a + 1.4 * s + .28 * gauss(r);
     base.push({x:[a, s], y:sc > .15 ? 1 : -1});
   }
   var box = [64, 30, 420, 340], xr = [-2.6, 2.6], yr = [-2.6, 2.6];
   var sx = function(v){ return box[0] + (v - xr[0]) / (xr[1] - xr[0]) * box[2]; }, sy = function(v){ return box[1] + box[3] - (v - yr[0]) / (yr[1] - yr[0]) * box[3]; };
   var age = function(z){ return 41 + 11 * z; }, sal = function(z){ return 42 + 16 * z; };
   function solve(){
     var D = base.concat(extra), n = D.length, Cc = Math.pow(10, logC), al = new Float64Array(n), u = new Float64Array(n), w = [0, 0];
     var Kx = function(i, j){ return D[i].x[0] * D[j].x[0] + D[i].x[1] * D[j].x[1]; };
     for(var it = 0; it < 60000; it++){
       var iU = -1, iL = -1, mU = Infinity, mL = -Infinity;
       for(var t = 0; t < n; t++){
         var y = D[t].y, E = u[t] - y;
         var tl = 1e-9 * Cc, up = (y > 0 && al[t] < Cc - tl) || (y < 0 && al[t] > tl), low = (y < 0 && al[t] < Cc - tl) || (y > 0 && al[t] > tl);
         if(up && E < mU){ mU = E; iU = t; }
         if(low && E > mL){ mL = E; iL = t; }
       }
       if(iU < 0 || iL < 0 || mL - mU < 1e-5) break;
       var p = iU, q = iL, yp = D[p].y, yq = D[q].y, eta = Kx(p, p) + Kx(q, q) - 2 * Kx(p, q);
       if(eta < 1e-12) break;
       var Lo, Hi;
       if(yp !== yq){ Lo = Math.max(0, al[q] - al[p]); Hi = Math.min(Cc, Cc + al[q] - al[p]); }
       else { Lo = Math.max(0, al[p] + al[q] - Cc); Hi = Math.min(Cc, al[p] + al[q]); }
       var aq = clamp(al[q] + yq * ((u[p] - yp) - (u[q] - yq)) / eta, Lo, Hi), dq = aq - al[q], dp = -yp * yq * dq;
       if(Math.abs(dq) < 1e-14) break;
       al[q] = aq; al[p] = clamp(al[p] + dp, 0, Cc);
       w[0] += dp * yp * D[p].x[0] + dq * yq * D[q].x[0]; w[1] += dp * yp * D[p].x[1] + dq * yq * D[q].x[1];
       for(t = 0; t < n; t++) u[t] = w[0] * D[t].x[0] + w[1] * D[t].x[1];
     }
     /* sesgo b a partir de las condiciones KKT */
     var lo = -Infinity, hi = Infinity, fs = 0, nf = 0, eps = 1e-6 * Math.max(1, Cc);
     for(t = 0; t < n; t++){
       var yv = D[t].y, v = yv - u[t];
       if(al[t] > eps && al[t] < Cc - eps){ fs += v; nf++; }
       else if((al[t] <= eps) === (yv > 0)) lo = Math.max(lo, v); else hi = Math.min(hi, v);
     }
     var b = nf ? fs / nf : (isFinite(lo) && isFinite(hi) ? (lo + hi) / 2 : isFinite(lo) ? lo : hi);
     var sv = 0; for(t = 0; t < n; t++) if(al[t] > eps) sv++;
     return {w:w, b:b, al:al, D:D, sv:sv, C:Cc, eps:eps};
   }
   function line(w, b, off){ /* puntos extremos de w·x + b = off dentro de la caja */
     var pts = [];
     if(Math.abs(w[1]) > 1e-9){ [xr[0], xr[1]].forEach(function(x){ pts.push([x, (off - b - w[0] * x) / w[1]]); }); }
     else { var x0 = (off - b) / w[0]; pts.push([x0, yr[0]], [x0, yr[1]]); }
     return pts.map(function(p){ return [sx(p[0]), sy(p[1])]; });
   }
   function draw(){
     K.clear();
     var S = shown, w = S.w, b = S.b;
     head(ctx, "Salario frente a edad · " + sol.D.length + " clientes", box[0], 20, C);
     /* fondo: lado de la recta, suave */
     ctx.save(); ctx.beginPath(); ctx.rect(box[0], box[1], box[2], box[3]); ctx.clip();
     var G = 48, cw = box[2] / G, ch = box[3] / G;
     for(var i = 0; i < G; i++) for(var j = 0; j < G; j++){
       var x = xr[0] + (i + .5) / G * (xr[1] - xr[0]), y = yr[1] - (j + .5) / G * (yr[1] - yr[0]), f = w[0] * x + w[1] * y + b;
       ctx.fillStyle = hexA(f >= 0 ? C.c[1] : C.c[0], Math.abs(f) < 1 ? .2 : .1);
       ctx.fillRect(box[0] + i * cw, box[1] + j * ch, cw + .6, ch + .6);
     }
     /* franja del margen */
     var m1 = line(w, b, 1), m2 = line(w, b, -1);
     path(ctx, m1, C.ink, 1.3, [6, 5]); path(ctx, m2, C.ink, 1.3, [6, 5]);
     path(ctx, line(w, b, 0), C.ink, 2.6);
     /* puntos */
     sol.D.forEach(function(d, k){
       var X = sx(d.x[0]), Y = sy(d.x[1]), isSV = sol.al[k] > sol.eps, isNew = k >= base.length;
       mark(ctx, X, Y, isNew ? 5.5 : 4.4, d.y > 0 ? 2 : 0, d.y > 0 ? C.c[1] : C.c[0], C.card);
       if(isSV){ ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(X, Y, 9, 0, TAU); ctx.stroke(); }
       if(isNew){ ctx.strokeStyle = C.ink; ctx.lineWidth = 1; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.arc(X, Y, 13, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
     });
     ctx.restore();
     frame(ctx, box, C);
     [-2, -1, 0, 1, 2].forEach(function(z){
       T(ctx, Math.round(age(z)) + "", sx(z), box[1] + box[3] + 15, {s:11, c:C.muted, a:"center"});
       T(ctx, Math.round(sal(z)) + "k", box[0] - 7, sy(z) + 4, {s:11, c:C.muted, a:"right"});
     });
     T(ctx, "edad (años) →", box[0] + box[2] / 2, box[1] + box[3] + 32, {s:11, c:C.muted, a:"center"});
     ctx.save(); ctx.translate(box[0] - 44, box[1] + box[3] / 2); ctx.rotate(-Math.PI / 2); T(ctx, "salario (miles €) →", 0, 0, {s:11, c:C.muted, a:"center"}); ctx.restore();
     /* panel α */
     var ab = [530, 66, 206, 210], n = sol.D.length, srt = sol.D.map(function(_, k){ return k; }).sort(function(p, q){ return sol.al[q] - sol.al[p]; });
     head(ctx, "Peso alfa de cada cliente", ab[0], 20, C);
     T(ctx, "ordenados de mayor a menor", ab[0], 38, {s:11, c:C.muted});
     var bw = ab[2] / n;
     ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(ab[0], ab[1] + ab[3] + .5); ctx.lineTo(ab[0] + ab[2], ab[1] + ab[3] + .5); ctx.stroke();
     dashLine(ctx, ab[0], ab[1], ab[0] + ab[2], ab[1], C.ink, 1, [4, 3]);
     T(ctx, "C = " + (sol.C < .1 ? fmt(sol.C, 2) : sol.C < 10 ? fmt(sol.C, 1) : fmt(sol.C, 0)), ab[0] + ab[2], ab[1] - 6, {s:11, w:"600", c:C.ink, a:"right"});
     srt.forEach(function(k, m){
       var h = sol.al[k] / sol.C * ab[3]; if(h < .5) return;
       ctx.fillStyle = sol.D[k].y > 0 ? C.c[1] : C.c[0]; ctx.fillRect(ab[0] + m * bw + .5, ab[1] + ab[3] - h, Math.max(1, bw - 1), h);
     });
     var zx = ab[0] + sol.sv * bw;
     if(sol.sv < n){
       ctx.fillStyle = hexA(C.muted, .12); ctx.fillRect(zx, ab[1], ab[0] + ab[2] - zx, ab[3]);
       T(ctx, "α = 0", (zx + ab[0] + ab[2]) / 2, ab[1] + ab[3] - 26, {s:11, w:"600", c:C.muted, a:"center"});
       T(ctx, "no influyen", (zx + ab[0] + ab[2]) / 2, ab[1] + ab[3] - 11, {s:11, c:C.muted, a:"center"});
     }
     T(ctx, sol.sv + " vectores de soporte", ab[0], ab[1] + ab[3] + 16, {s:11, w:"600", c:C.ink});
     /* leyenda */
     var ly = 330;
     mark(ctx, ab[0] + 6, ly, 4.4, 2, C.c[1], C.card); T(ctx, "compra", ab[0] + 16, ly + 4, {s:11, c:C.text});
     mark(ctx, ab[0] + 86, ly, 4.4, 0, C.c[0], C.card); T(ctx, "no compra", ab[0] + 96, ly + 4, {s:11, c:C.text});
     ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(ab[0] + 6, ly + 22, 7, 0, TAU); ctx.stroke(); T(ctx, "vector de soporte", ab[0] + 18, ly + 26, {s:11, c:C.text});
     T(ctx, "Clic en el gráfico: añadir «" + (addCls > 0 ? "compra" : "no compra") + "»", ab[0], ly + 52, {s:11, w:"600", c:C.ink});
     /* lectura */
     var nw = Math.hypot(sol.w[0], sol.w[1]), err = 0;
     sol.D.forEach(function(d){ if(d.y * (sol.w[0] * d.x[0] + sol.w[1] * d.x[1] + sol.b) < 0) err++; });
     read.innerHTML = '<span>C <b>' + (sol.C < .1 ? fmt(sol.C, 2) : fmt(sol.C, 1)) + '</b></span><span>Anchura del margen 2/‖w‖ <b>' + fmt(2 / nw, 2) + '</b> (unidades estandarizadas)</span>' +
       '<span>Vectores de soporte <b>' + sol.sv + ' de ' + sol.D.length + '</b></span><span>Mal clasificados en train <b>' + err + '</b></span>' +
       '<span class="ldiag">' + (msg || (sol.C < .3 ? "C bajo: se aceptan puntos dentro del margen a cambio de una franja ancha y estable (más vectores de soporte)." : sol.C > 10 ? "C alto: cada error sale caro, el margen se estrecha para no fallar casi ninguno (pocos vectores de soporte, más riesgo de sobreajuste)." : "Haz clic lejos del margen y luego dentro de él para comparar.")) + '</span>';
   }
   function refit(animate){
     var old = sol; sol = solve();
     if(animate && old){
       var from = {w:shown.w.slice(), b:shown.b}, t0 = performance.now();
       if(anim) anim();
       anim = loop(function(now){
         var k = ease((now - t0) / 450);
         shown = {w:[lerp(from.w[0], sol.w[0], k), lerp(from.w[1], sol.w[1], k)], b:lerp(from.b, sol.b, k)};
         draw(); return k < 1;
       });
     } else { shown = {w:sol.w.slice(), b:sol.b}; draw(); }
   }
   K.cv.style.cursor = "crosshair";
   K.cv.addEventListener("click", function(e){
     var p = K.pos(e); if(p[0] < box[0] || p[0] > box[0] + box[2] || p[1] < box[1] || p[1] > box[1] + box[3]) return;
     var x = [xr[0] + (p[0] - box[0]) / box[2] * (xr[1] - xr[0]), yr[1] - (p[1] - box[1]) / box[3] * (yr[1] - yr[0])];
     var old = {w:sol.w.slice(), b:sol.b}, fOld = addCls * (old.w[0] * x[0] + old.w[1] * x[1] + old.b);
     extra.push({x:x, y:addCls});
     refit(true);
     var moved = Math.hypot(sol.w[0] - old.w[0], sol.w[1] - old.w[1]) + Math.abs(sol.b - old.b) > 2e-3;
     msg = fOld >= 1 ? (moved ? "El punto cayó fuera del margen, en su lado: α = 0 y la recta <b>apenas</b> cambia." : "El punto cayó <b>fuera del margen</b>, en su lado correcto: su α es 0 y la recta <b class='lgood'>no se ha movido</b>. Solo los vectores de soporte cuentan.") :
       "El punto cayó <b>" + (fOld >= 0 ? "dentro del margen" : "en el lado equivocado") + "</b>: se convierte en vector de soporte y la recta <b class='lwarn'>se recoloca</b>.";
     draw();
   });
   ctlSlider(ctl, "C (coste de cada error, escala log)", -2, 2, .05, logC, function(v){ var c = Math.pow(10, v); return c < .1 ? fmt(c, 2) : c < 10 ? fmt(c, 1) : fmt(c, 0); }, function(v){ logC = v; msg = ""; refit(false); });
   ctlSeg(ctl, "Clase del punto que añades", [["1", "▲ compra"], ["-1", "● no compra"]], "1", function(v){ addCls = +v; draw(); });
   ctlBtn(ctl, "↺ Quitar puntos añadidos", function(){ extra = []; msg = ""; refit(true); });
   refit(false);
   return function(){ if(anim) anim(); };
 }});

/* ── 8. COX / SUPERVIVENCIA · Kaplan–Meier y censura ──────────── */
VIZ.push({id:"v-cox", model:"cox", g:"model", ic:"⏳", dim:"2D",
 t:"Curvas de supervivencia y clientes censurados",
 q:"¿Cuánto tarda un cliente en darse de baja y qué pasa con los que todavía no se han ido?",
 intro:"300 clientes simulados de una operadora, la mitad <b>con permanencia</b> y la mitad <b>sin</b>. Cada curva de <b>Kaplan–Meier</b> dice qué % sigue activo a cada mes. Los <b>+</b> son clientes <b>censurados</b>: siguen activos (o dejamos de verlos), así que solo sabemos que aguantaron <i>al menos</i> hasta ahí. Elige el <b>hazard ratio</b> real (cuántas veces más riesgo tiene «sin permanencia») y el % de censura. A la derecha, 20 de esos clientes.",
 notice:["La curva solo baja cuando hay una <b>baja</b> (×); un censurado (+) no la hace bajar, pero sale del grupo «en riesgo» a partir de ese momento.",
   "Marca «tirar a los censurados»: las curvas caen <b>mucho más rápido</b> y la mediana se desploma. Es como calcular la vida media de una flota mirando solo los coches que ya se han roto.",
   "El modelo de Cox recupera el hazard ratio que has puesto (con ruido de muestreo): «sin permanencia» tiene ese múltiplo de riesgo <b>en cualquier mes</b>."],
 models:["cox","logistica","rf"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 440, K = makeCanvas(stage, W, H, "Curvas de Kaplan–Meier por segmento y swimmer plot de 20 clientes"), ctx = K.ctx;
   var HR = 2, cens = .35, wrong = false, FU = 60, D = [], realC = 0;
   var base = (function(){ var r = mulberry(12), o = []; for(var i = 0; i < 300; i++) o.push({g:i % 2, u:r(), e:-Math.log(1 - r())}); return o; })();
   function sim(){
     var k = 1.3, sc = 39.8;
     var T = base.map(function(b){ return sc * Math.pow(-Math.log(1 - b.u) / (b.g ? HR : 1), 1 / k); });
     function frac(mu){ var c = 0; base.forEach(function(b, i){ var ci = mu > 0 ? b.e / mu : Infinity; if(Math.min(ci, FU) < T[i]) c++; }); return c / base.length; }
     var lo = 0, hi = 5;
     if(frac(0) >= cens) hi = 0;
     else for(var it = 0; it < 40; it++){ var m = (lo + hi) / 2; if(frac(m) < cens) lo = m; else hi = m; }
     var mu = hi; realC = frac(mu);
     D = base.map(function(b, i){ var ci = mu > 0 ? b.e / mu : Infinity, c = Math.min(ci, FU); return {g:b.g, t:Math.min(T[i], c), ev:T[i] <= c ? 1 : 0}; });
   }
   function km(rows){
     var s = rows.slice().sort(function(a, b){ return a.t - b.t || b.ev - a.ev; }), n = s.length, S = 1, pts = [[0, 1]], cm = [], med = null;
     s.forEach(function(d){
       if(d.ev){ pts.push([d.t, S]); S *= 1 - 1 / n; pts.push([d.t, S]); if(med === null && S <= .5) med = d.t; }
       else cm.push([d.t, S]);
       n--;
     });
     pts.push([s.length ? Math.max(s[s.length - 1].t, pts[pts.length - 1][0]) : 0, S]);
     return {pts:pts, cm:cm, med:med};
   }
   function cox(rows){ /* Newton sobre la verosimilitud parcial (1 covariable binaria, Breslow) */
     var s = rows.slice().sort(function(a, b){ return b.t - a.t; }), beta = 0;
     for(var it = 0; it < 30; it++){
       var S0 = 0, S1 = 0, g = 0, h = 0;
       s.forEach(function(d){ var e = Math.exp(beta * d.g); S0 += e; S1 += e * d.g; if(d.ev){ var m = S1 / S0; g += d.g - m; h += m * (1 - m); } });
       if(h < 1e-9) break; var st = g / h; beta += st; if(Math.abs(st) < 1e-8) break;
     }
     return Math.exp(beta);
   }
   function rateHR(rows){ var e = [0, 0], x = [0, 0]; rows.forEach(function(d){ e[d.g] += d.ev; x[d.g] += d.t; }); return (e[1] / x[1]) / (e[0] / x[0]); }
   var box = [62, 40, 400, 320];
   function draw(){
     K.clear();
     var sx = function(t){ return box[0] + t / FU * box[2]; }, sy = function(s){ return box[1] + (1 - s) * box[3]; };
     head(ctx, "Kaplan–Meier · % de clientes activos", box[0], 22, C);
     axes(ctx, box, [0, FU], [0, 1], C, {xl:"meses desde el alta", xt:[0, 12, 24, 36, 48, 60]});
     [0, .25, .5, .75, 1].forEach(function(v){ T(ctx, pct(v, 0), box[0] - 6, sy(v) + 4, {s:11, c:C.muted, a:"right"}); if(v > 0 && v < 1){ ctx.strokeStyle = hexA(C.line, .7); ctx.beginPath(); ctx.moveTo(box[0], sy(v) + .5); ctx.lineTo(box[0] + box[2], sy(v) + .5); ctx.stroke(); } });
     dashLine(ctx, box[0], sy(.5), box[0] + box[2], sy(.5), C.muted, 1, [3, 4]);
     var res = [0, 1].map(function(g){
       var rows = D.filter(function(d){ return d.g === g; });
       return {ok:km(rows), bad:km(rows.filter(function(d){ return d.ev; }))};
     });
     var names = ["con permanencia", "sin permanencia"];
     res.forEach(function(R, g){
       var col = C.c[g];
       if(wrong) path(ctx, R.bad.pts.map(function(p){ return [sx(p[0]), sy(p[1])]; }), col, 2.2, [6, 4]);
       path(ctx, R.ok.pts.map(function(p){ return [sx(p[0]), sy(p[1])]; }), wrong ? hexA(col, .45) : col, 2.4);
       ctx.strokeStyle = wrong ? hexA(col, .45) : col; ctx.lineWidth = 1.3;
       R.ok.cm.forEach(function(c){ var x = sx(c[0]), y = sy(c[1]); ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4); ctx.stroke(); });
       var m = wrong ? R.bad.med : R.ok.med;
       if(m !== null){ dashLine(ctx, sx(m), sy(.5), sx(m), box[1] + box[3], col, 1.2, [2, 3]); dot(ctx, sx(m), sy(.5), 4, col, C.card); }
     });
     /* leyenda */
     var lx = box[0] + box[2] - 186, ly = box[1] + 14;
     rr(ctx, lx - 10, ly - 12, 190, wrong ? 76 : 58, 8); ctx.fillStyle = hexA(C.card, .92); ctx.fill(); ctx.strokeStyle = C.line; ctx.stroke();
     names.forEach(function(nm, g){ ctx.fillStyle = C.c[g]; ctx.fillRect(lx, ly + g * 18 - 4, 16, 3); T(ctx, nm, lx + 22, ly + g * 18 + 1, {s:11, c:C.text}); });
     T(ctx, "+ censurado · ● mediana", lx, ly + 37, {s:11, c:C.muted});
     if(wrong) T(ctx, "- - - sin censurados (error)", lx, ly + 55, {s:11, w:"600", c:C.neg});
     /* swimmer plot */
     var sb = [536, 40, 200, 340], pick = [];
     for(var g = 0; g < 2; g++){ var c = 0; for(var i = 0; i < D.length && c < 10; i++) if(D[i].g === g && i % 7 === g){ pick.push(i); c++; } }
     pick.sort(function(a, b){ return D[a].g - D[b].g || D[b].t - D[a].t; });
     head(ctx, "20 clientes (swimmer plot)", sb[0] - 24, 22, C);
     var rh = sb[3] / 20, ssx = function(t){ return sb[0] + t / FU * sb[2]; };
     ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(sb[0] + .5, sb[1]); ctx.lineTo(sb[0] + .5, sb[1] + sb[3]); ctx.stroke();
     pick.forEach(function(ix, k){
       var d = D[ix], y = sb[1] + k * rh + rh / 2, x2 = ssx(d.t), dropped = wrong && !d.ev;
       ctx.save(); if(dropped) ctx.globalAlpha = .22;
       rr(ctx, sb[0] + 1, y - 4, Math.max(4, x2 - sb[0] - 1), 8, 4); ctx.fillStyle = hexA(C.c[d.g], .8); ctx.fill();
       if(d.ev){ ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x2 - 4, y - 4); ctx.lineTo(x2 + 4, y + 4); ctx.moveTo(x2 + 4, y - 4); ctx.lineTo(x2 - 4, y + 4); ctx.stroke(); }
       else { ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; ctx.fillStyle = C.card; ctx.beginPath(); ctx.arc(x2, y, 4.2, 0, TAU); ctx.fill(); ctx.stroke(); }
       ctx.restore();
       if(dropped){ dashLine(ctx, sb[0], y, x2, y, C.neg, 1.2, [0, 0]); }
       T(ctx, d.g ? "S" : "P", sb[0] - 8, y + 4, {s:11, w:"600", c:C.c[d.g], a:"right"});
     });
     [0, 30, 60].forEach(function(t){ T(ctx, String(t), ssx(t), sb[1] + sb[3] + 14, {s:11, c:C.muted, a:"center"}); });
     T(ctx, "× baja   ○ sigue activo (censurado)", sb[0] + sb[2], sb[1] + sb[3] + 30, {s:11, c:C.muted, a:"right"});
     T(ctx, "P = con permanencia · S = sin", sb[0] + sb[2], sb[1] + sb[3] + 46, {s:11, c:C.muted, a:"right"});
     /* lectura */
     var rows = wrong ? D.filter(function(d){ return d.ev; }) : D, hr = cox(rows), rr2 = rateHR(rows);
     var m0 = (wrong ? res[0].bad : res[0].ok).med, m1 = (wrong ? res[1].bad : res[1].ok).med;
     var mt = function(m){ return m === null ? "no se alcanza (> 60 meses)" : fmt(m, 1) + " meses"; };
     var mOk0 = res[0].ok.med, mBad0 = res[0].bad.med;
     read.innerHTML = '<span>Censura real <b>' + pct(realC, 0) + '</b>' + (realC > cens + .02 ? ' (mínimo: los que siguen a los 60 meses)' : '') + '</span>' +
       '<span>Mediana · con permanencia <b>' + mt(m0) + '</b></span><span>Mediana · sin permanencia <b>' + mt(m1) + '</b></span>' +
       '<span>HR de Cox <b>' + fmt(hr, 2) + '</b> (real ' + fmt(HR, 1) + ')</span><span>Ratio de tasas bajas/exposición <b>' + fmt(rr2, 2) + '</b></span>' +
       '<span class="ldiag">' + (wrong ? "<b class='lbad'>Error:</b> al tirar a los " + D.filter(function(d){ return !d.ev; }).length + " censurados solo quedan los que ya se fueron, así que la curva cae a 0. La mediana «con permanencia» pasa de " + mt(mOk0) + " a <b>" + mt(mBad0) + "</b>: subestimas cuánto duran tus clientes." :
         "En cualquier mes, un cliente sin permanencia tiene <b>" + fmt(hr, 1) + " veces</b> el riesgo de darse de baja que uno con permanencia (eso es el hazard ratio). " + (hr > 1.15 ? "La mitad de los clientes sin permanencia se ha ido a los " + mt(m1) + "." : "Con un HR ≈ 1 las dos curvas casi se solapan: la permanencia no cambia nada.")) + '</span>';
   }
   ctlSlider(ctl, "Hazard ratio real (sin vs con permanencia)", 1, 4, .1, HR, function(v){ return fmt(v, 1) + "×"; }, function(v){ HR = v; sim(); draw(); });
   ctlSlider(ctl, "% de clientes censurados (objetivo)", .1, .7, .01, cens, function(v){ return pct(v, 0); }, function(v){ cens = v; sim(); draw(); });
   ctlCheck(ctl, "Error: tirar a los censurados", wrong, function(v){ wrong = v; draw(); });
   sim(); draw();
 }});

})();
