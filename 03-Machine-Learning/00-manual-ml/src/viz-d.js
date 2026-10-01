/* ══════════════════════════════════════════════════════════════
   VISUALES POR MODELO · lote «d»
   No supervisado (K-Medoids, jerárquico, GMM, t-SNE, UMAP, LOF),
   asociación y recomendación (Apriori, filtrado colaborativo,
   basado en contenido, LDA) y series temporales (ARIMA, SARIMA,
   SARIMAX, Prophet). Todo se calcula de verdad en el navegador
   con datos sintéticos deterministas, salvo donde se indica.
   ══════════════════════════════════════════════════════════════ */
(function(){
"use strict";

/* ── utilidades de dibujo ── */
function tx(ctx, s, x, y, o){
  o = o || {};
  ctx.font = (o.it ? "italic " : "") + (o.w ? o.w + " " : "") + (o.s || 12) + "px " + LABFONT;
  ctx.fillStyle = o.c || "#888"; ctx.textAlign = o.a || "left"; ctx.textBaseline = o.b || "alphabetic";
  ctx.fillText(s, x, y);
  return ctx.measureText(s).width;
}
function cap(ctx, s, x, y, C, a){ /* rótulo de panel: versalitas discretas */
  ctx.save(); try{ ctx.letterSpacing = "0.6px"; }catch(e){}
  tx(ctx, s.toUpperCase(), x, y, {s:11, w:600, c:C.muted, a:a || "left"});
  ctx.restore();
}
function rrect(ctx, x, y, w, h, r){
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}
function pathXY(ctx, xs, ys){ ctx.beginPath(); for(var i = 0; i < xs.length; i++){ if(i) ctx.lineTo(xs[i], ys[i]); else ctx.moveTo(xs[i], ys[i]); } }
function stroke(ctx, col, lw, dash){ ctx.strokeStyle = col; ctx.lineWidth = lw || 1; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]); }
function seg(ctx, x1, y1, x2, y2, col, lw, dash){ ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); stroke(ctx, col, lw, dash); }
function rgb(hex){
  var h = String(hex).replace("#", "");
  if(h.length === 3) h = h.split("").map(function(x){ return x + x; }).join("");
  var n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255];
}
function mixRGB(cols, w){ /* mezcla de colores ponderada (para pertenencias suaves) */
  var r = 0, g = 0, b = 0, s = 0;
  for(var i = 0; i < cols.length; i++){ var c = rgb(cols[i]); r += w[i] * c[0]; g += w[i] * c[1]; b += w[i] * c[2]; s += w[i]; }
  s = s || 1; return "rgb(" + Math.round(r / s) + "," + Math.round(g / s) + "," + Math.round(b / s) + ")";
}
function ramp(C, t){ /* escala continua morado → rosa → naranja → ámbar */
  var st = [C.c[0], C.c[5], C.c[1], C.c[4]], u = Math.max(0, Math.min(1, t)) * 3, i = Math.min(2, Math.floor(u)), f = u - i;
  var a = rgb(st[i]), b = rgb(st[i + 1]);
  return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * f) + "," + Math.round(a[1] + (b[1] - a[1]) * f) + "," + Math.round(a[2] + (b[2] - a[2]) * f) + ")";
}
/* marcadores por forma: 0 círculo, 1 cuadrado, 2 triángulo, 3 rombo */
function mark(ctx, shape, x, y, r, fill, strokeCol, lw){
  ctx.beginPath();
  if(shape === 1){ ctx.rect(x - r * .85, y - r * .85, r * 1.7, r * 1.7); }
  else if(shape === 2){ ctx.moveTo(x, y - r * 1.1); ctx.lineTo(x + r, y + r * .75); ctx.lineTo(x - r, y + r * .75); ctx.closePath(); }
  else if(shape === 3){ ctx.moveTo(x, y - r * 1.15); ctx.lineTo(x + r * 1.05, y); ctx.lineTo(x, y + r * 1.15); ctx.lineTo(x - r * 1.05, y); ctx.closePath(); }
  else ctx.arc(x, y, r, 0, Math.PI * 2);
  if(fill){ ctx.fillStyle = fill; ctx.fill(); }
  if(strokeCol){ ctx.strokeStyle = strokeCol; ctx.lineWidth = lw || 1.2; ctx.stroke(); }
}
function arrow(ctx, x1, y1, x2, y2, col, lw, head){
  var a = Math.atan2(y2 - y1, x2 - x1), h = head || 8;
  seg(ctx, x1, y1, x2 - Math.cos(a) * h * .6, y2 - Math.sin(a) * h * .6, col, lw || 1.6);
  ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(a - .42), y2 - h * Math.sin(a - .42)); ctx.lineTo(x2 - h * Math.cos(a + .42), y2 - h * Math.sin(a + .42)); ctx.closePath();
  ctx.fillStyle = col; ctx.fill();
}
function chip(text, col, C, strong){
  return '<span style="display:inline-block;padding:3px 9px;margin:2px 4px 2px 0;border-radius:999px;font-size:12.5px;font-weight:' + (strong ? 700 : 500) +
    ';background:' + hexA(col, strong ? 0.22 : 0.1) + ';color:' + C.ink + ';border:1px solid ' + hexA(col, strong ? 0.9 : 0.35) + '">' + text + '</span>';
}
function swatch(col, shape){
  var r = shape === 1 ? "2px" : "50%";
  return '<i style="display:inline-block;width:10px;height:10px;border-radius:' + r + ';background:' + col + ';margin-right:5px;vertical-align:-1px"></i>';
}
/* etiquetas sin solapes: prueba varias posiciones alrededor de cada punto */
function placeLabels(ctx, items, bounds){
  var placed = [], pts = items.map(function(it){ return [it.x - 6, it.y - 6, 12, 12]; });
  var hit = function(a, b){ return a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3]; };
  items.forEach(function(it, q){
    ctx.font = (it.w ? it.w + " " : "") + (it.s || 11) + "px " + LABFONT;
    var w = ctx.measureText(it.text).width, h = (it.s || 11) + 2;
    var cand = [[9, -h / 2], [-9 - w, -h / 2], [-w / 2, -h - 7], [-w / 2, 7], [9, -h - 4], [9, 4], [-9 - w, -h - 4], [-9 - w, 4]];
    var best = null, bestScore = Infinity;
    cand.forEach(function(c, ci){
      var rc = [it.x + c[0], it.y + c[1], w, h], sc = ci * 0.01;
      placed.forEach(function(p){ if(hit(rc, p)) sc += 10; });
      pts.forEach(function(p, pi){ if(pi !== q && hit(rc, p)) sc += 3; });
      if(bounds && (rc[0] < bounds[0] || rc[1] < bounds[1] || rc[0] + w > bounds[0] + bounds[2] || rc[1] + h > bounds[1] + bounds[3])) sc += 50;
      if(sc < bestScore){ bestScore = sc; best = rc; }
    });
    placed.push(best);
    if(it.halo){ ctx.save(); ctx.lineJoin = "round"; ctx.lineWidth = 4; ctx.strokeStyle = it.halo; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.strokeText(it.text, best[0], best[1] + h - 3); ctx.restore(); }
    tx(ctx, it.text, best[0], best[1] + h - 3, {s:it.s || 11, w:it.w, c:it.c});
  });
}
/* bucle de animación cancelable */
function animator(step){
  var raf = 0, on = false;
  function tick(t){ if(!on) return; if(step(t) === false){ on = false; return; } raf = requestAnimationFrame(tick); }
  return {start:function(){ if(on) return; on = true; raf = requestAnimationFrame(tick); },
          stop:function(){ on = false; cancelAnimationFrame(raf); }, get on(){ return on; }};
}
/* arrastre con ratón o dedo sobre un canvas */
function drag(K, onDown, onMove, onUp){
  var active = false;
  function down(e){ var p = K.pos(e); if(onDown(p, e) === true){ active = true; K.cv.setPointerCapture && K.cv.setPointerCapture(e.pointerId); e.preventDefault(); } }
  function move(e){ if(!active) return; onMove(K.pos(e), e); }
  function up(e){ if(!active) return; active = false; if(onUp) onUp(K.pos(e), e); }
  K.cv.addEventListener("pointerdown", down); K.cv.addEventListener("pointermove", move);
  K.cv.addEventListener("pointerup", up); K.cv.addEventListener("pointercancel", up);
}

/* ── estadística ── */
function mean(a){ var s = 0; for(var i = 0; i < a.length; i++) s += a[i]; return s / a.length; }
function sum(a){ var s = 0; for(var i = 0; i < a.length; i++) s += a[i]; return s; }
function acfOf(x, L){
  var n = x.length, m = mean(x), c0 = 0, out = [1];
  for(var i = 0; i < n; i++) c0 += (x[i] - m) * (x[i] - m);
  for(var k = 1; k <= L; k++){ var s = 0; for(i = k; i < n; i++) s += (x[i] - m) * (x[i - k] - m); out.push(s / c0); }
  return out;
}
function pacfOf(r, L){ /* Durbin-Levinson */
  var out = [1], phi = [], prev = [];
  for(var k = 1; k <= L; k++){
    var num = r[k], den = 1;
    for(var j = 1; j < k; j++){ num -= prev[j] * r[k - j]; den -= prev[j] * r[j]; }
    var pk = num / den; phi = [];
    for(j = 1; j < k; j++) phi[j] = prev[j] - pk * prev[k - j];
    phi[k] = pk; prev = phi; out.push(pk);
  }
  return out;
}
/* mínimos cuadrados con penalización diagonal opcional: (X'X + diag(pen)) b = X'y */
function lsq(X, y, pen){
  var p = X[0].length, A = [], b = [];
  for(var i = 0; i < p; i++){ A.push(new Array(p).fill(0)); b.push(0); }
  for(var r = 0; r < X.length; r++){
    var x = X[r];
    for(i = 0; i < p; i++){ if(!x[i]) continue; b[i] += x[i] * y[r]; for(var j = i; j < p; j++) A[i][j] += x[i] * x[j]; }
  }
  for(i = 0; i < p; i++){ for(j = 0; j < i; j++) A[i][j] = A[j][i]; if(pen) A[i][i] += pen[i] || 0; }
  return solveLin(A, b);
}
function shuffleIdx(n, rng){ var a = []; for(var i = 0; i < n; i++) a.push(i); for(i = n - 1; i > 0; i--){ var j = Math.floor(rng() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

/* ── 1. K-MEDOIDS FRENTE A K-MEANS ───────────────────────────── */
VIZ.push({id:"v-kmedoids", model:"kmedoids", g:"model", ic:"🎯", dim:"2D",
 t:"El centro que sí existe (K-Medoids)",
 q:"¿Por qué un solo cliente extremo arrastra el centro de K-Means y no el de K-Medoids?",
 intro:"Tres grupos de clientes según <b>gasto anual</b> y <b>visitas al mes</b>, más un <b>cliente millonario</b> muy atípico. <b>Arrástralo</b> (o usa el deslizador) para alejarlo. Se ejecutan de verdad K-Means (media de cada grupo, 10 arranques k-means++) y K-Medoids (algoritmo PAM: el centro debe ser un cliente real).",
 notice:["Al alejar al millonario, el <b>centroide de K-Means</b> (✕) del grupo premium se desplaza hacia él y acaba en una <b>zona vacía</b> donde no hay ningún cliente. En la lupa, la flecha sale del círculo discontinuo (dónde estaría sin el millonario) y muestra el tirón.",
   "El <b>medoide</b> (anillo doble) se queda encima de un cliente real del grupo premium: puedes describirlo como «cliente tipo» con nombre y apellidos.",
   "Mira la lectura: la distancia del centro a su cliente real más cercano <b>crece</b> con K-Means y se queda en <b>0</b> con K-Medoids."],
 models:["kmedoids","kmeans","dbscan","lof"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 420, K = makeCanvas(stage, W, H, "Clientes en tres grupos con un millonario atípico; centros de K-Means y K-Medoids"), ctx = K.ctx;
   var G = [["Ocasionales", 1.2, 2.0, .45, .55, 22], ["Habituales", 1.8, 7.6, .4, .6, 20], ["Premium", 4.8, 4.8, .28, .4, 7]];
   var r = mulberry(7), P = [], grp = [];
   G.forEach(function(g, j){ for(var i = 0; i < g[5]; i++){ P.push([g[1] + g[3] * gauss(r), g[2] + g[4] * gauss(r)]); grp.push(j); } });
   var NB = P.length, out = [11, 4.8], show = "both";
   var box = [60, 22, 444, 336], lupa = [540, 22, 206, 336], xr = [0, 16], yr = [0, 10];
   var sx = function(x){ return box[0] + (x - xr[0]) / (xr[1] - xr[0]) * box[2]; }, sy = function(y){ return box[1] + box[3] - (y - yr[0]) / (yr[1] - yr[0]) * box[3]; };
   var d2 = function(a, b){ var x = a[0] - b[0], y = a[1] - b[1]; return x * x + y * y; };
   function kmeans(X, k){
     var best = null, rg = mulberry(11);
     for(var s = 0; s < 10; s++){
       var c = [X[Math.floor(rg() * X.length)]];
       while(c.length < k){
         var ds = X.map(function(p){ return Math.min.apply(null, c.map(function(q){ return d2(p, q); })); });
         var tot = sum(ds), u = rg() * tot, acc = 0;
         for(var i = 0; i < X.length; i++){ acc += ds[i]; if(acc >= u){ c.push(X[i]); break; } }
       }
       var lab = [];
       for(var it = 0; it < 60; it++){
         lab = X.map(function(p){ var b = 0; for(var j = 1; j < k; j++) if(d2(p, c[j]) < d2(p, c[b])) b = j; return b; });
         c = c.map(function(q, j){ var a = 0, b2 = 0, n = 0; X.forEach(function(p, i){ if(lab[i] === j){ a += p[0]; b2 += p[1]; n++; } }); return n ? [a / n, b2 / n] : q; });
       }
       var I = 0; X.forEach(function(p, i){ I += d2(p, c[lab[i]]); });
       if(!best || I < best.I) best = {c:c, lab:lab, I:I};
     }
     return best;
   }
   function pam(X, k){ /* PAM: BUILD voraz + SWAP hasta que ningún intercambio mejora */
     var n = X.length, D = X.map(function(a){ return X.map(function(b){ return Math.sqrt(d2(a, b)); }); });
     var med = [], i, j;
     var cost = function(M){ var s = 0; for(var q = 0; q < n; q++){ var m = Infinity; for(var t = 0; t < M.length; t++) m = Math.min(m, D[q][M[t]]); s += m; } return s; };
     while(med.length < k){
       var bi = -1, bc = Infinity;
       for(i = 0; i < n; i++){ if(med.indexOf(i) > -1) continue; var c2 = cost(med.concat([i])); if(c2 < bc){ bc = c2; bi = i; } }
       med.push(bi);
     }
     var cur = cost(med), improved = true, guard = 0;
     while(improved && guard++ < 50){
       improved = false;
       for(var m = 0; m < k; m++) for(i = 0; i < n; i++){
         if(med.indexOf(i) > -1) continue;
         var M2 = med.slice(); M2[m] = i; var c3 = cost(M2);
         if(c3 < cur - 1e-9){ cur = c3; med = M2; improved = true; }
       }
     }
     var lab = X.map(function(p, q){ var b = 0; for(var t = 1; t < k; t++) if(D[q][med[t]] < D[q][med[b]]) b = t; return b; });
     return {med:med, lab:lab, cost:cur};
   }
   /* reordena los grupos para que cada color siga a su grupo real */
   function align(lab, k){
     var map = [], used = [];
     for(var j = 0; j < k; j++){
       var cnt = [0, 0, 0]; lab.forEach(function(l, i){ if(l === j && i < NB) cnt[grp[i]]++; });
       var best = -1; cnt.forEach(function(v, g){ if(used.indexOf(g) < 0 && (best < 0 || v > cnt[best])) best = g; });
       map[j] = best; used.push(best);
     }
     return map;
   }
   var KM, PM, kmMap, pmMap, ghost;
   function compute(){
     var X = P.concat([out]);
     KM = kmeans(X, 3); PM = pam(X, 3);
     kmMap = align(KM.lab, 3); pmMap = align(PM.lab, 3);
     var a = 0, b = 0, n = 0; P.forEach(function(p, i){ if(grp[i] === 2){ a += p[0]; b += p[1]; n++; } }); ghost = [a / n, b / n];
   }
   function nearestReal(c){ var b = Infinity, bi = 0; P.concat([out]).forEach(function(p, i){ var d = d2(p, c); if(d < b){ b = d; bi = i; } }); return [Math.sqrt(b), bi]; }
   function scene(T, big){ /* dibuja clientes y centros con la transformación T */
     var X = P.concat([out]), useKM = show === "km", lab = useKM ? KM.lab : PM.lab, map = useKM ? kmMap : pmMap;
     var CL = [C.c[1], C.c[2], C.c[3]], kmJ = KM.lab[NB], pmJ = PM.lab[NB], pr = big ? 6 : 4.4;
     X.forEach(function(p, i){ if(i < NB) dot(ctx, T.x(p[0]), T.y(p[1]), pr, hexA(CL[map[lab[i]]], 0.88), C.card); });
     var ox = T.x(out[0]), oy = T.y(out[1]), oc = CL[map[lab[NB]]];
     ctx.beginPath(); ctx.arc(ox, oy, big ? 18 : 15, 0, 7); ctx.fillStyle = hexA(oc, 0.13); ctx.fill();
     dot(ctx, ox, oy, big ? 9 : 7.5, oc, C.card);
     if(show !== "pm"){
       var c = KM.c[kmJ];
       if(big && Math.abs(c[0] - ghost[0]) > 0.12){
         ctx.beginPath(); ctx.arc(T.x(ghost[0]), T.y(ghost[1]), 7, 0, 7); stroke(ctx, C.muted, 1.4, [3, 3]);
         arrow(ctx, T.x(ghost[0]) + 8, T.y(ghost[1]), T.x(c[0]) - 12, T.y(c[1]), hexA(C.ink, 0.6), 1.5, 8);
       }
       if(big){ var nr = nearestReal(c); seg(ctx, T.x(c[0]), T.y(c[1]), T.x(X[nr[1]][0]), T.y(X[nr[1]][1]), C.ink, 1.3, [4, 4]); }
       KM.c.forEach(function(q, j){
         var x = T.x(q[0]), y = T.y(q[1]), s = big ? 9 : (j === kmJ ? 7 : 5.5);
         ctx.beginPath(); ctx.arc(x, y, s + 3, 0, 7); ctx.fillStyle = hexA(C.card, 0.8); ctx.fill();
         seg(ctx, x - s, y - s, x + s, y + s, C.ink, 3.4); seg(ctx, x - s, y + s, x + s, y - s, C.ink, 3.4);
         seg(ctx, x - s, y - s, x + s, y + s, CL[kmMap[j]], 1.4); seg(ctx, x - s, y + s, x + s, y - s, CL[kmMap[j]], 1.4);
       });
     }
     if(show !== "km"){
       PM.med.forEach(function(m, j){
         var p = X[m], x = T.x(p[0]), y = T.y(p[1]), s = big ? 1.25 : 1;
         ctx.beginPath(); ctx.arc(x, y, 8.5 * s, 0, 7); stroke(ctx, C.ink, 2.2);
         ctx.beginPath(); ctx.arc(x, y, 12.5 * s, 0, 7); stroke(ctx, CL[pmMap[j]], 1.6);
       });
     }
   }
   function draw(){
     K.clear();
     var A = axes(ctx, box, xr, yr, C, {xl:"gasto anual (miles de €)", yl:"visitas al mes", xt:[0, 4, 8, 12, 16], yt:[0, 2, 4, 6, 8, 10]});
     var X = P.concat([out]), kmJ = KM.lab[NB], pmJ = PM.lab[NB];
     /* zona ampliada en la lupa */
     var zx = [4.0, 6.6], zy = [3.0, 6.4];
     ctx.fillStyle = hexA(C.c[0], 0.05); ctx.fillRect(sx(zx[0]), sy(zy[1]), sx(zx[1]) - sx(zx[0]), sy(zy[0]) - sy(zy[1]));
     ctx.strokeStyle = hexA(C.c[0], 0.5); ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.strokeRect(sx(zx[0]) + .5, sy(zy[1]) + .5, sx(zx[1]) - sx(zx[0]), sy(zy[0]) - sy(zy[1])); ctx.setLineDash([]);
     ctx.save(); ctx.beginPath(); ctx.rect(box[0], box[1], box[2], box[3]); ctx.clip();
     scene({x:sx, y:sy}, false); ctx.restore();
     tx(ctx, "Millonario", sx(out[0]), sy(out[1]) - 22, {s:12, w:700, c:C.ink, a:"center"});
     tx(ctx, "↔ arrástrame", sx(out[0]), sy(out[1]) + 30, {s:11, c:C.muted, a:"center"});
     /* leyenda */
     var lgx = box[0] + box[2] - 168, lgy = box[1] + 12, CL = [C.c[1], C.c[2], C.c[3]];
     ctx.fillStyle = hexA(C.card, 0.94); rrect(ctx, lgx - 10, lgy - 4, 166, 60, 9); ctx.fill(); ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.stroke();
     G.forEach(function(g, j){ dot(ctx, lgx + 2, lgy + 8 + j * 16, 4.5, CL[j]); tx(ctx, g[0], lgx + 12, lgy + 12 + j * 16, {s:11.5, c:C.text}); });
     var kx = lgx + 100, ky = lgy + 8;
     seg(ctx, kx - 5, ky - 5, kx + 5, ky + 5, C.ink, 2.4); seg(ctx, kx - 5, ky + 5, kx + 5, ky - 5, C.ink, 2.4);
     tx(ctx, "centroide", kx + 11, ky + 4, {s:11.5, c:C.text});
     ctx.beginPath(); ctx.arc(kx, ky + 18, 4.5, 0, 7); stroke(ctx, C.ink, 2); ctx.beginPath(); ctx.arc(kx, ky + 18, 7.5, 0, 7); stroke(ctx, C.muted, 1.2);
     tx(ctx, "medoide", kx + 11, ky + 22, {s:11.5, c:C.text});
     /* lupa */
     var L = lupa;
     ctx.fillStyle = C.card; rrect(ctx, L[0], L[1], L[2], L[3], 12); ctx.fill(); ctx.strokeStyle = hexA(C.c[0], 0.55); ctx.lineWidth = 1; ctx.stroke();
     cap(ctx, "Lupa · grupo premium", L[0] + 12, L[1] + 20, C);
     var lb = [L[0] + 6, L[1] + 30, L[2] - 12, L[3] - 36];
     var T = {x:function(x){ return lb[0] + (x - zx[0]) / (zx[1] - zx[0]) * lb[2]; }, y:function(y){ return lb[1] + lb[3] - (y - zy[0]) / (zy[1] - zy[0]) * lb[3]; }};
     ctx.save(); ctx.beginPath(); ctx.rect(lb[0], lb[1], lb[2], lb[3]); ctx.clip();
     scene(T, true);
     ctx.restore();
     var lab2 = function(px, py, top, t1, t2){ /* etiqueta fija arriba o abajo con línea guía */
       var ly = top ? lb[1] + 22 : lb[1] + lb[3] - 22, lx = lb[0] + lb[2] / 2;
       seg(ctx, px, py + (top ? -14 : 14), lx, ly + (top ? 8 : -20), hexA(C.ink, 0.35), 1);
       tx(ctx, t1, lx, ly, {s:12, w:700, c:C.ink, a:"center"}); tx(ctx, t2, lx, ly + 14, {s:11, c:C.muted, a:"center"});
     };
     if(show !== "pm"){
       var c = KM.c[kmJ], nr = nearestReal(c);
       lab2(T.x(c[0]), T.y(c[1]), false, "centroide K-Means", "a " + fmt(nr[0], 2) + " del cliente más cercano");
     }
     if(show !== "km"){
       var pm = X[PM.med[pmJ]];
       lab2(T.x(pm[0]), T.y(pm[1]), true, "cliente tipo (medoide)", "es un cliente real");
     }
     if(out[0] > zx[1]){ var ay = Math.max(lb[1] + 10, Math.min(lb[1] + lb[3] - 10, T.y(out[1])));
       arrow(ctx, lb[0] + lb[2] - 30, ay, lb[0] + lb[2] - 2, ay, hexA(C.ink, 0.45), 1.2, 6);
       tx(ctx, "al millonario", lb[0] + lb[2] - 2, ay - 8, {s:11, c:C.muted, a:"right"}); }
     /* lectura */
     var dk = nearestReal(KM.c[kmJ])[0], shift = Math.sqrt(d2(KM.c[kmJ], ghost));
     var isolated = KM.lab.filter(function(l){ return l === kmJ; }).length === 1;
     read.innerHTML = '<table class="cmx"><tr><th>Método</th><th>Centro del grupo del millonario</th><th>Distancia a su cliente real más cercano</th></tr>' +
       '<tr><th>K-Means</th><td>' + (isolated ? "el millonario solo" : "(" + fmt(KM.c[kmJ][0], 1) + " ; " + fmt(KM.c[kmJ][1], 1) + ")<small>un punto calculado</small>") + '</td><td class="' + (dk > 0.5 ? "ko" : "") + '">' + fmt(dk, 2) + '</td></tr>' +
       '<tr><th>K-Medoids</th><td>cliente nº ' + (PM.med[pmJ] + 1) + '<small>un cliente real</small></td><td class="ok">' + fmt(0, 2) + '</td></tr></table>' +
       '<span class="ldiag" style="flex-basis:auto;flex:1 1 260px">' + (isolated
         ? "El millonario está tan lejos que K-Means le dedica <b>un grupo entero</b> a él solo y fusiona dos grupos reales."
         : dk > 0.5 ? "El millonario ha arrastrado el centroide <b>" + fmt(shift, 2) + " unidades</b>: ahora está en una zona sin clientes. Ese «cliente medio» <b>no existe</b>."
         : "Con el millonario cerca, los dos métodos dan centros parecidos (tirón de " + fmt(shift, 2) + "). Aléjalo para ver la diferencia.") +
       ' El medoide sigue siendo un cliente real.</span>';
   }
   var sl;
   function setOut(x){ out[0] = Math.max(5.5, Math.min(15.5, x)); compute(); draw(); if(sl) sl.set(out[0]); }
   drag(K, function(p){ if(Math.hypot(p[0] - sx(out[0]), p[1] - sy(out[1])) < 26){ K.cv.style.cursor = "grabbing"; return true; } },
     function(p){ out[1] = Math.max(1, Math.min(7.2, yr[0] + (box[1] + box[3] - p[1]) / box[3] * (yr[1] - yr[0]))); setOut(xr[0] + (p[0] - box[0]) / box[2] * (xr[1] - xr[0])); },
     function(){ K.cv.style.cursor = ""; });
   K.cv.addEventListener("pointermove", function(e){ var p = K.pos(e); if(!e.buttons) K.cv.style.cursor = Math.hypot(p[0] - sx(out[0]), p[1] - sy(out[1])) < 26 ? "grab" : ""; });
   ctlSeg(ctl, "Centros que se dibujan", [["km", "K-Means"], ["pm", "K-Medoids"], ["both", "Ambos"]], show, function(v){ show = v; draw(); });
   sl = ctlSlider(ctl, "Gasto del millonario (miles de €)", 5.5, 15.5, 0.1, out[0], function(v){ return fmt(v, 1); }, function(v){ setOut(v); });
   compute(); draw();
 }});

/* ── 2. CLUSTERING JERÁRQUICO Y DENDROGRAMA ──────────────────── */
VIZ.push({id:"v-jerarquico", model:"jerarquico", g:"model", ic:"🌳", dim:"2D",
 t:"El dendrograma: cortar el árbol de grupos",
 q:"¿Cómo se construye un árbol de grupos y dónde conviene cortarlo?",
 intro:"18 clientes (A…R) en un plano y, a la derecha, su <b>dendrograma</b>: el árbol de fusiones del clustering aglomerativo, calculado de verdad. Empieza con cada cliente solo y en cada paso une los dos grupos más cercanos; la altura de cada unión es la distancia a la que ocurrió. <b>Arrastra la línea de corte</b> y cambia el tipo de enlace.",
 notice:["Cada línea horizontal del dendrograma es una <b>fusión</b>; cuanto más alta, más distintos eran los grupos que se unieron. Cortar a una altura deja tantos grupos como ramas atraviesa la línea.",
   "El <b>salto más grande</b> entre dos fusiones consecutivas suele indicar un buen número de grupos: por debajo se unen cosas parecidas, por encima se fuerzan uniones lejanas.",
"Con enlace <b>single</b> (vecino más cercano) las fusiones altas se apelotonan y el árbol crece «en escalera»: basta un cliente puente como J para acercar grupos (efecto cadena). Con <b>ward</b> o <b>complete</b> los grupos quedan más compactos y el salto es más claro."],
 models:["jerarquico","kmeans","dbscan"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 400, K = makeCanvas(stage, W, H, "Plano de 18 clientes y su dendrograma con línea de corte"), ctx = K.ctx;
   var N = "ABCDEFGHIJKLMNOPQR".split("");
   var P = [[1.2, 8.2], [2.0, 9.0], [2.5, 7.6], [1.4, 7.0], [3.2, 8.5], [6.4, 8.6], [7.4, 9.1], [7.0, 7.8], [8.2, 8.3],
            [4.6, 5.5], [2.0, 3.0], [3.0, 2.2], [1.3, 2.0], [2.7, 3.7], [7.2, 3.2], [8.3, 2.5], [7.6, 1.6], [8.8, 3.8]];
   var n = P.length, link = "ward", merges = [], order = [], cut = 0, maxH = 1, step = -1, timer = null, tm2 = 0;
   var pb = [34, 34, 300, 344], db = [404, 34, 330, 330];
   var px = function(x){ return pb[0] + x / 10 * pb[2]; }, py = function(y){ return pb[1] + pb[3] - y / 10 * pb[3]; };
   function cluster(){
     var D = [], size = [], alive = [], id = [], i, j;
     for(i = 0; i < n; i++){ D.push([]); for(j = 0; j < n; j++) D[i].push(Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1])); size.push(1); alive.push(true); id.push(i); }
     merges = [];
     for(var s = 0; s < n - 1; s++){
       var bi = -1, bj = -1, bd = Infinity;
       for(i = 0; i < n; i++) if(alive[i]) for(j = i + 1; j < n; j++) if(alive[j] && D[i][j] < bd){ bd = D[i][j]; bi = i; bj = j; }
       merges.push({a:id[bi], b:id[bj], h:bd, size:size[bi] + size[bj]});
       for(var k = 0; k < n; k++){
         if(!alive[k] || k === bi || k === bj) continue;
         var dki = D[k][bi], dkj = D[k][bj], ni = size[bi], nj = size[bj], nk = size[k], v;
         if(link === "single") v = Math.min(dki, dkj);
         else if(link === "complete") v = Math.max(dki, dkj);
         else if(link === "average") v = (ni * dki + nj * dkj) / (ni + nj);
         else v = Math.sqrt(((nk + ni) * dki * dki + (nk + nj) * dkj * dkj - nk * bd * bd) / (nk + ni + nj));
         D[k][bi] = D[bi][k] = v;
       }
       size[bi] += size[bj]; alive[bj] = false; id[bi] = n + s;
     }
     maxH = merges[n - 2].h;
     order = [];
     (function walk(v){ if(v < n){ order.push(v); return; } var m = merges[v - n]; walk(m.a); walk(m.b); })(2 * n - 2);
   }
   function leavesOf(v){ if(v < n) return [v]; var m = merges[v - n]; return leavesOf(m.a).concat(leavesOf(m.b)); }
   /* grupos actuales: por la línea de corte o por el paso de la animación */
   function groups(){
     var limit = step >= 0 ? step : merges.filter(function(m){ return m.h <= cut; }).length;
     var root = []; for(var i = 0; i < n; i++) root.push(i);
     for(var s = 0; s < limit; s++){ var m = merges[s]; leavesOf(n + s).forEach(function(l){ root[l] = n + s; }); }
     var ids = []; order.forEach(function(l){ if(ids.indexOf(root[l]) < 0) ids.push(root[l]); });
     return {limit:limit, root:root, ids:ids};
   }
   function hull(pts){
     pts = pts.slice().sort(function(a, b){ return a[0] - b[0] || a[1] - b[1]; });
     if(pts.length < 3) return pts;
     var cr = function(o, a, b){ return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }, lo = [], up = [];
     pts.forEach(function(p){ while(lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); });
     for(var i = pts.length - 1; i >= 0; i--){ var p = pts[i]; while(up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
     up.pop(); lo.pop(); return lo.concat(up);
   }
   var offc = document.createElement("canvas"), dpr = K.cv.width / W; offc.width = K.cv.width; offc.height = K.cv.height;
   var octx = offc.getContext("2d");
   function blob(hp, col){
     octx.setTransform(1, 0, 0, 1, 0, 0); octx.clearRect(0, 0, offc.width, offc.height); octx.setTransform(dpr, 0, 0, dpr, 0, 0);
     octx.beginPath(); hp.forEach(function(p, i){ if(i) octx.lineTo(p[0], p[1]); else octx.moveTo(p[0], p[1]); }); octx.closePath();
     octx.lineJoin = "round"; octx.lineCap = "round"; octx.lineWidth = 30; octx.strokeStyle = octx.fillStyle = col; octx.stroke(); octx.fill();
     return offc;
   }
   var dy = function(h){ return db[1] + db[3] - h / (maxH * 1.08) * db[3]; };
   function draw(){
     K.clear();
     var g = groups(), CL = [C.c[1], C.c[2], C.c[3], C.c[4], C.c[5], C.c[0]];
     var colOf = {}, ci = 0;
     g.ids.forEach(function(v){ colOf[v] = v < n ? C.muted : CL[ci++ % CL.length]; });
     /* plano */
     cap(ctx, "Clientes (plano)", pb[0], 20, C);
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(pb[0] + .5, pb[1] + .5, pb[2], pb[3]);
     g.ids.forEach(function(v){
       if(v < n) return;
       var hp = hull(leavesOf(v).map(function(l){ return [px(P[l][0]), py(P[l][1])]; }));
       ctx.save(); ctx.globalAlpha = 0.17; ctx.fillStyle = ctx.strokeStyle = colOf[v];
       ctx.beginPath(); hp.forEach(function(p, i){ if(i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath();
       ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.lineWidth = 30;
       /* contorno y relleno en una sola pasada (sin doble transparencia) */
       ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
       var off = blob(hp, colOf[v]); ctx.globalAlpha = 0.17; ctx.drawImage(off, 0, 0, W, H); ctx.restore();
     });
     if(step >= 0 && step > 0){ /* última fusión: une los dos grupos */
       var m = merges[step - 1], ca = leavesOf(m.a), cb = leavesOf(m.b), best = [0, 0, Infinity];
       ca.forEach(function(a){ cb.forEach(function(b){ var d = Math.hypot(P[a][0] - P[b][0], P[a][1] - P[b][1]); if(d < best[2]) best = [a, b, d]; }); });
       seg(ctx, px(P[best[0]][0]), py(P[best[0]][1]), px(P[best[1]][0]), py(P[best[1]][1]), C.ink, 1.6, [4, 3]);
     }
     for(var i = 0; i < n; i++){
       var c = colOf[g.root[i]];
       dot(ctx, px(P[i][0]), py(P[i][1]), 5.5, c, C.card);
       tx(ctx, N[i], px(P[i][0]) + 8, py(P[i][1]) - 6, {s:12, w:700, c:C.ink});
     }
     /* dendrograma */
     cap(ctx, "Dendrograma · enlace " + link, db[0], 20, C);
     var lx = {}; order.forEach(function(l, k){ lx[l] = db[0] + 10 + k * (db[2] - 20) / (n - 1); });
     var xs = {}, hs = {};
     for(i = 0; i < n; i++){ xs[i] = lx[i]; hs[i] = 0; }
     var shown = step >= 0 ? step : n - 1;
     /* eje de alturas */
     var tk = maxH > 6 ? 2 : maxH > 3 ? 1 : 0.5;
     for(var t = 0; t <= maxH * 1.08; t += tk){
       seg(ctx, db[0], dy(t), db[0] + db[2], dy(t), hexA(C.line, 0.9), 1);
       tx(ctx, fmt(t, tk < 1 ? 1 : 0), db[0] - 6, dy(t) + 4, {s:11, c:C.muted, a:"right"});
     }
     ctx.save(); ctx.translate(db[0] - 30, db[1] + db[3] / 2); ctx.rotate(-Math.PI / 2); tx(ctx, "distancia de fusión", 0, 0, {s:11, c:C.muted, a:"center"}); ctx.restore();
     var nodeCol = function(v){ var l = leavesOf(v)[0]; var r = g.root[l]; return (v >= n && (v - n) < g.limit) ? colOf[r] : C.muted; };
     for(var s = 0; s < n - 1; s++){
       var M = merges[s], v = n + s;
       xs[v] = (xs[M.a] + xs[M.b]) / 2; hs[v] = M.h;
       if(s >= shown) continue;
       var col = s < g.limit ? colOf[g.root[leavesOf(v)[0]]] : hexA(C.ink, 0.7), lw = s < g.limit ? 2.2 : 1.5;
       ctx.beginPath(); ctx.moveTo(xs[M.a], dy(hs[M.a])); ctx.lineTo(xs[M.a], dy(M.h)); ctx.lineTo(xs[M.b], dy(M.h)); ctx.lineTo(xs[M.b], dy(hs[M.b]));
       ctx.lineJoin = "miter"; stroke(ctx, col, lw);
       if(step >= 0 && s === step - 1){ dot(ctx, xs[v], dy(M.h), 5, C.c[0], C.card); }
     }
     order.forEach(function(l){ tx(ctx, N[l], lx[l], db[1] + db[3] + 16, {s:12, w:700, c:g.root[l] < n ? C.muted : colOf[g.root[l]], a:"center"}); });
     if(step < 0){
       var yc = dy(cut);
       seg(ctx, db[0] - 2, yc, db[0] + db[2] + 4, yc, C.ink, 1.6, [6, 4]);
       var lbl = "corte · " + g.ids.length + " grupo" + (g.ids.length > 1 ? "s" : ""); ctx.font = "600 11px " + LABFONT; var lw2 = ctx.measureText(lbl).width + 16;
       ctx.fillStyle = C.ink; rrect(ctx, db[0] + db[2] + 4 - lw2, yc - 23, lw2, 18, 6); ctx.fill();
       tx(ctx, lbl, db[0] + db[2] + 4 - lw2 / 2, yc - 10, {s:11, w:600, c:C.card, a:"center"});
       tx(ctx, "⇕ arrastra", db[0] + 4, yc - 6, {s:11, c:C.muted});
     }
     /* lectura */
     var gaps = []; for(s = 0; s < n - 2; s++) gaps.push([merges[s + 1].h - merges[s].h, s]);
     var big = gaps.reduce(function(a, b){ return b[0] > a[0] ? b : a; }), kSug = n - 1 - big[1];
     var singles = g.ids.filter(function(v){ return v < n; }).length;
     read.innerHTML = '<span>Grupos ' + (step >= 0 ? "tras " + step + " fusiones" : "al corte") + ' <b>' + g.ids.length + '</b></span>' +
       (step < 0 ? '<span>Altura del corte <b>' + fmt(cut, 2) + '</b></span>' : '<span>Última fusión <b>' + (step ? leavesOf(merges[step - 1].a).map(function(l){ return N[l]; }).join("") + " + " + leavesOf(merges[step - 1].b).map(function(l){ return N[l]; }).join("") + " a " + fmt(merges[step - 1].h, 2) : "—") + '</b></span>') +
       '<span>Salto mayor <b>' + fmt(merges[big[1]].h, 2) + ' → ' + fmt(merges[big[1] + 1].h, 2) + '</b> (sugiere K = ' + kSug + ')</span>' +
       '<span class="ldiag">' + (singles ? "Hay <b>" + singles + " cliente" + (singles > 1 ? "s" : "") + " solo" + (singles > 1 ? "s" : "") + "</b> (en gris): a esa altura todavía no se ha unido a nadie. " : "") +
       (g.ids.length === kSug ? "<b class='lgood'>Estás cortando en el salto mayor</b>: los grupos de abajo son compactos y el siguiente paso uniría grupos lejanos." : "El salto más grande entre fusiones consecutivas sugiere <b>" + kSug + " grupos</b> con este enlace. Pulsa «Cortar en el salto mayor».") + '</span>';
   }
   function setCut(h){ cut = Math.max(0, Math.min(maxH * 1.06, h)); step = -1; clearInterval(timer); draw(); }
   function bestCut(){ var b = 0, bi = 0; for(var s = 0; s < n - 2; s++){ var gp = merges[s + 1].h - merges[s].h; if(gp > b){ b = gp; bi = s; } } return (merges[bi].h + merges[bi + 1].h) / 2; }
   drag(K, function(p){ if(p[0] > db[0] - 10 && p[0] < db[0] + db[2] + 10 && p[1] > db[1] - 10 && p[1] < db[1] + db[3] + 6){ setCut((db[1] + db[3] - p[1]) / db[3] * maxH * 1.08); return true; } },
     function(p){ setCut((db[1] + db[3] - p[1]) / db[3] * maxH * 1.08); });
   K.cv.addEventListener("pointermove", function(e){ var p = K.pos(e); K.cv.style.cursor = p[0] > db[0] - 10 && p[1] > db[1] - 10 && p[1] < db[1] + db[3] + 6 ? "ns-resize" : ""; });
   ctlSeg(ctl, "Enlace (cómo se mide la distancia entre grupos)", [["single", "single"], ["complete", "complete"], ["average", "average"], ["ward", "ward"]], link, function(v){ link = v; cluster(); setCut(bestCut()); });
   ctlBtn(ctl, "▶ Paso a paso", function(){
     clearInterval(timer); step = 0; draw();
     timer = setInterval(function(){ step++; draw(); if(step >= n - 1){ clearInterval(timer); tm2 = setTimeout(function(){ if(step >= n - 1){ step = -1; draw(); } }, 1400); } }, 650);
   }, true);
   ctlBtn(ctl, "✂ Cortar en el salto mayor", function(){ setCut(bestCut()); });
   cluster(); cut = bestCut(); draw();
   return function(){ clearInterval(timer); clearTimeout(tm2); };
 }});

/* ── 3. GAUSSIAN MIXTURE CON EM ──────────────────────────────── */
VIZ.push({id:"v-gmm", model:"gmm", g:"model", ic:"🫧", dim:"2D",
 t:"EM paso a paso: grupos con forma y con dudas",
 q:"¿Cómo encuentra una mezcla de gaussianas grupos elípticos y cuánto pertenece cada punto a cada uno?",
 intro:"Clientes descritos por dos variables (minutos en la web y ticket medio, ya escalados) que vienen de <b>tres grupos elípticos solapados</b>. El algoritmo <b>EM</b> se ejecuta de verdad alternando dos pasos: <b>E</b> (calcular qué probabilidad tiene cada punto de pertenecer a cada grupo) y <b>M</b> (recolocar media, forma y peso de cada grupo con esas probabilidades). Pulsa ▶ o avanza paso a paso y <b>haz clic en un punto</b>.",
 notice:["Las elipses (1σ y 2σ) empiezan redondas y mal colocadas y, en pocas iteraciones, se <b>estiran y giran</b> hasta encajar con la forma de cada grupo: eso no lo puede hacer K-Means, que solo dibuja grupos redondos.",
   "Los puntos de la zona de solape tienen un <b>color mezclado</b>: pertenecen un poco a cada grupo. Haz clic en uno y lee sus porcentajes.",
   "La <b>log-verosimilitud</b> sube en cada iteración hasta estabilizarse (EM nunca la empeora). Con «asignación dura» ves lo que haría K-Means: cada punto pierde sus matices."],
 models:["gmm","kmeans","qda","lda"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 420, K = makeCanvas(stage, W, H, "Mezcla de tres gaussianas ajustada con EM"), ctx = K.ctx;
   var CL = [C.c[1], C.c[2], C.c[0]], NM = ["A", "B", "C"];
   var r = mulberry(44), X = [];
   [[3.0, 6.3, 1.3, .42, .52, 95], [5.7, 4.4, 1.05, .5, -.9, 80], [6.9, 7.3, .75, .55, .3, 60]].forEach(function(g){
     var ca = Math.cos(g[4]), sa = Math.sin(g[4]);
     for(var i = 0; i < g[5]; i++){ var u = g[2] * gauss(r), v = g[3] * gauss(r); X.push([g[0] + ca * u - sa * v, g[1] + sa * u + ca * v]); }
   });
   var n = X.length, k = 3, mu, S, pi, R, it, phase, LL, hist, sel, hard = false, timer = null, conv = false;
   var box = [44, 18, 440, 384], xr = [0, 10], yr = [1.2, 1.2 + 384 / 44];
   var sc = box[2] / (xr[1] - xr[0]);
   var sx = function(x){ return box[0] + (x - xr[0]) * sc; }, sy = function(y){ return box[1] + box[3] - (y - yr[0]) * sc; };
   function pdf(x, m, s){
     var a = s[0], b = s[1], c = s[2], det = a * c - b * b, dx = x[0] - m[0], dy = x[1] - m[1];
     var q = (c * dx * dx - 2 * b * dx * dy + a * dy * dy) / det;
     return Math.exp(-0.5 * q) / (2 * Math.PI * Math.sqrt(det));
   }
   function reset(){
     mu = [[2.5, 8.5], [4.5, 2.5], [8.5, 6.0]]; S = [[1, 0, 1], [1, 0, 1], [1, 0, 1]]; pi = [1 / 3, 1 / 3, 1 / 3];
     it = 0; phase = "E"; hist = []; conv = false; estep(); LL = loglik(); hist.push(LL);
   }
   function loglik(){ var s = 0; X.forEach(function(x){ var t = 0; for(var j = 0; j < k; j++) t += pi[j] * pdf(x, mu[j], S[j]); s += Math.log(t); }); return s; }
   function estep(){
     R = X.map(function(x){ var w = []; for(var j = 0; j < k; j++) w.push(pi[j] * pdf(x, mu[j], S[j])); var t = sum(w); return w.map(function(v){ return v / t; }); });
   }
   function mstep(){
     for(var j = 0; j < k; j++){
       var Nk = 0, m0 = 0, m1 = 0;
       X.forEach(function(x, i){ Nk += R[i][j]; m0 += R[i][j] * x[0]; m1 += R[i][j] * x[1]; });
       m0 /= Nk; m1 /= Nk; var a = 0, b = 0, c = 0;
       X.forEach(function(x, i){ var dx = x[0] - m0, dy = x[1] - m1; a += R[i][j] * dx * dx; b += R[i][j] * dx * dy; c += R[i][j] * dy * dy; });
       mu[j] = [m0, m1]; S[j] = [a / Nk + 1e-4, b / Nk, c / Nk + 1e-4]; pi[j] = Nk / n;
     }
   }
   function half(){
     if(conv) return;
     if(phase === "E"){ estep(); phase = "M"; }
     else { mstep(); it++; var prev = LL; LL = loglik(); hist.push(LL); phase = "E"; if(Math.abs(LL - prev) < 1e-3) conv = true; }
     draw();
   }
   function ellipse(m, s, z, col, lw, dash){
     var a = s[0], b = s[1], c = s[2], tr = (a + c) / 2, d = Math.sqrt((a - c) * (a - c) / 4 + b * b);
     var l1 = tr + d, l2 = tr - d, ang = 0.5 * Math.atan2(2 * b, a - c);
     ctx.beginPath(); ctx.ellipse(sx(m[0]), sy(m[1]), z * Math.sqrt(l1) * sc, z * Math.sqrt(Math.max(l2, 1e-6)) * sc, -ang, 0, Math.PI * 2);
     stroke(ctx, col, lw, dash);
   }
   function draw(){
     K.clear();
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(box[0] + .5, box[1] + .5, box[2], box[3]);
     ctx.save(); ctx.beginPath(); ctx.rect(box[0], box[1], box[2], box[3]); ctx.clip();
     for(var j = 0; j < k; j++){
       ctx.save(); var a = S[j][0], b = S[j][1], c = S[j][2], tr = (a + c) / 2, d = Math.sqrt((a - c) * (a - c) / 4 + b * b), ang = 0.5 * Math.atan2(2 * b, a - c);
       ctx.beginPath(); ctx.ellipse(sx(mu[j][0]), sy(mu[j][1]), 2 * Math.sqrt(tr + d) * sc, 2 * Math.sqrt(Math.max(tr - d, 1e-6)) * sc, -ang, 0, 7);
       ctx.fillStyle = hexA(CL[j], 0.06); ctx.fill(); ctx.restore();
     }
     var doubt = 0;
     X.forEach(function(x, i){
       var w = R[i], mx = Math.max.apply(null, w), jm = w.indexOf(mx);
       if(mx < 0.8) doubt++;
       var col = hard ? CL[jm] : mixRGB(CL, w);
       dot(ctx, sx(x[0]), sy(x[1]), i === sel ? 6.5 : 3.6, col, i === sel ? C.ink : null);
     });
     for(j = 0; j < k; j++){
       ellipse(mu[j], S[j], 2, CL[j], 1.4, [5, 4]); ellipse(mu[j], S[j], 1, CL[j], 2.4);
       var mx2 = sx(mu[j][0]), my = sy(mu[j][1]);
       ctx.beginPath(); ctx.arc(mx2, my, 10, 0, 7); ctx.fillStyle = C.card; ctx.fill(); ctx.strokeStyle = CL[j]; ctx.lineWidth = 2; ctx.stroke();
       tx(ctx, NM[j], mx2, my + 4.5, {s:12, w:700, c:C.ink, a:"center"});
     }
     ctx.restore();
     tx(ctx, "elipses: 1σ (continua) y 2σ (discontinua)", box[0] + 10, box[1] + box[3] - 10, {s:11, c:C.muted});
     /* panel derecho: pertenencia del punto elegido */
     var px0 = 512, pw = 230;
     cap(ctx, "Pertenencia del punto elegido", px0, 32, C);
     var w = R[sel];
     for(j = 0; j < k; j++){
       var yb = 50 + j * 30;
       tx(ctx, "Grupo " + NM[j], px0, yb + 13, {s:12, w:600, c:C.text});
       ctx.fillStyle = hexA(C.line, 0.9); rrect(ctx, px0 + 62, yb + 2, pw - 112, 14, 7); ctx.fill();
       var vv = hard ? (w.indexOf(Math.max.apply(null, w)) === j ? 1 : 0) : w[j];
       if(vv > 0.002){ ctx.fillStyle = CL[j]; rrect(ctx, px0 + 62, yb + 2, Math.max(14, (pw - 112) * vv), 14, 7); ctx.fill(); }
       tx(ctx, pct(vv, 0), px0 + pw, yb + 14, {s:12, w:700, c:C.ink, a:"right"});
     }
     tx(ctx, hard ? "asignación dura: todo o nada" : "suma 100%: es una pertenencia suave", px0, 152, {s:11, c:C.muted});
     /* log-verosimilitud */
     var gb = [px0 + 34, 206, pw - 34, 150];
     cap(ctx, "Log-verosimilitud por iteración", px0, 188, C);
     var lo = Math.min.apply(null, hist), hi = Math.max.apply(null, hist); if(hi - lo < 1) lo = hi - 1;
     var gx = function(i){ return gb[0] + i / Math.max(10, hist.length - 1) * gb[2]; }, gy = function(v){ return gb[1] + gb[3] - (v - lo) / (hi - lo) * gb[3]; };
     ctx.strokeStyle = C.line; ctx.strokeRect(gb[0] + .5, gb[1] + .5, gb[2], gb[3]);
     tx(ctx, fmt(hi, 0), gb[0] - 4, gb[1] + 10, {s:11, c:C.muted, a:"right"}); tx(ctx, fmt(lo, 0), gb[0] - 4, gb[1] + gb[3], {s:11, c:C.muted, a:"right"});
     pathXY(ctx, hist.map(function(_, i){ return gx(i); }), hist.map(gy)); stroke(ctx, C.c[0], 2.2);
     hist.forEach(function(v, i){ dot(ctx, gx(i), gy(v), 2.6, C.c[0]); });
     tx(ctx, "iteración", gb[0] + gb[2] / 2, gb[1] + gb[3] + 16, {s:11, c:C.muted, a:"center"});
     /* lectura */
     var p = 3 * (2 + 3) + 2, bic = -2 * LL + p * Math.log(n);
     read.innerHTML = '<span>Iteración <b>' + it + '</b></span><span>Próximo paso <b>' + (conv ? "— (convergido)" : phase === "E" ? "E · repartir probabilidades" : "M · recolocar elipses") + '</b></span>' +
       '<span>Log-verosimilitud <b>' + fmt(LL, 1) + '</b></span><span>BIC <b>' + fmt(bic, 1) + '</b></span><span>Puntos dudosos (máx. &lt; 80%) <b>' + doubt + '</b></span>' +
       '<span class="ldiag">' + (conv ? "<b class='lgood'>Convergido</b>: la log-verosimilitud ya no sube. " : "") +
       (hard ? "En modo duro esos <b>" + doubt + " puntos dudosos</b> se pintan como si fueran seguros: se pierde la información de que están en tierra de nadie." :
        "El punto elegido es <b>" + NM[0] + " " + pct(w[0], 0) + " · " + NM[1] + " " + pct(w[1], 0) + " · " + NM[2] + " " + pct(w[2], 0) + "</b>. El BIC (cuanto más bajo, mejor) penaliza la complejidad: sirve para elegir el nº de componentes.") + '</span>';
   }
   function play(){
     clearInterval(timer);
     if(conv){ reset(); draw(); }
     timer = setInterval(function(){ if(conv){ clearInterval(timer); playB.innerHTML = "▶ Ejecutar EM"; return; } half(); }, 320);
     playB.innerHTML = "⏸ Pausa";
   }
   var playB = ctlBtn(ctl, "▶ Ejecutar EM", function(){ if(playB.innerHTML.indexOf("Pausa") > -1){ clearInterval(timer); playB.innerHTML = "▶ Ejecutar EM"; } else play(); }, true);
   ctlBtn(ctl, "⏭ Un paso (E o M)", function(){ clearInterval(timer); playB.innerHTML = "▶ Ejecutar EM"; half(); });
   ctlBtn(ctl, "↺ Reiniciar", function(){ clearInterval(timer); playB.innerHTML = "▶ Ejecutar EM"; reset(); draw(); });
   ctlSeg(ctl, "Asignación", [["soft", "Suave (GMM)"], ["hard", "Dura (como K-Means)"]], "soft", function(v){ hard = v === "hard"; draw(); });
   K.cv.addEventListener("click", function(e){
     var p = K.pos(e), b = -1, bd = 16;
     X.forEach(function(x, i){ var d = Math.hypot(sx(x[0]) - p[0], sy(x[1]) - p[1]); if(d < bd){ bd = d; b = i; } });
     if(b >= 0){ sel = b; draw(); }
   });
   K.cv.style.cursor = "pointer";
   /* punto elegido por defecto: el más dudoso de la solución final (EM ejecutado en silencio) */
   reset(); for(var g2 = 0; g2 < 400 && !conv; g2++){ if(phase === "E"){ estep(); phase = "M"; } else { mstep(); var pv = LL; LL = loglik(); phase = "E"; if(Math.abs(LL - pv) < 1e-3) conv = true; } }
   estep(); var be = -1; R.forEach(function(w, i){ var e = -sum(w.map(function(v){ return v > 0 ? v * Math.log(v) : 0; })); if(e > be){ be = e; sel = i; } });
   reset(); draw();
   return function(){ clearInterval(timer); };
 }});

/* ── 4. t-SNE EXACTO EN DIRECTO ──────────────────────────────── */
VIZ.push({id:"v-tsne", model:"tsne", g:"model", ic:"🗺️", dim:"2D",
 t:"t-SNE en directo: vecinos sí, tamaños no",
 q:"¿Qué conserva un mapa t-SNE y qué se inventa?",
 intro:"180 clientes descritos por <b>10 variables</b>, en 4 grupos de tamaños y dispersiones <b>muy distintos</b>. Aquí se ejecuta un <b>t-SNE exacto</b> de verdad: verás cómo los puntos, colocados al azar, se ordenan iteración a iteración. A la derecha, la dispersión real de cada grupo frente a la que aparenta en el mapa. Cambia la <b>perplexity</b> (cuántos vecinos «mira» cada punto) y se reinicia.",
 notice:["El grupo C es <b>muchísimo más disperso</b> que los demás en los datos reales, pero en el mapa ocupa un espacio parecido: t-SNE <b>no conserva tamaños</b>. Compara las dos barras de cada grupo.",
   "Los grupos C está <b>cuatro veces más lejos</b> de A que B en 10 dimensiones, pero en el mapa las distancias <b>entre</b> grupos no significan nada fiable. Lo que sí se conserva es quién es vecino de quién.",
   "Con perplexity muy baja (5) aparecen <b>grupitos falsos</b> dentro de los grupos reales; con perplexity alta, la estructura global se ordena algo mejor. Las primeras 250 iteraciones usan «exageración temprana» para separar grupos."],
 models:["tsne","umap","pca"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 420, K = makeCanvas(stage, W, H, "Mapa t-SNE de 180 puntos de 10 dimensiones en 4 grupos"), ctx = K.ctx;
   var D10 = 10, GR = [["A", 70, 0.35], ["B", 50, 1.0], ["C", 40, 3.2], ["D", 20, 0.5]];
   var r = mulberry(91), X = [], lab = [], cen = [];
   var ctrs = [[0, 0], [4.5, 0], [0, 18], [7.2, 1.5]]; /* B y D cerca; C lejísimos */
   GR.forEach(function(g, j){
     var c = []; for(var d = 0; d < D10; d++) c.push(d < 2 ? ctrs[j][d] : 0.4 * gauss(mulberry(7 + j * 13 + d)));
     cen.push(c);
     for(var i = 0; i < g[1]; i++){ var x = []; for(d = 0; d < D10; d++) x.push(c[d] + g[2] * gauss(r)); X.push(x); lab.push(j); }
   });
   var n = X.length, D2 = [];
   for(var i = 0; i < n; i++){ D2.push(new Float64Array(n)); }
   for(i = 0; i < n; i++) for(var j = i + 1; j < n; j++){ var s = 0; for(var d = 0; d < D10; d++){ var t = X[i][d] - X[j][d]; s += t * t; } D2[i][j] = D2[j][i] = s; }
   /* dispersión real (RMS de la distancia al centro de su grupo, en 10D) */
   var realDisp = GR.map(function(g, jj){ var m = new Array(D10).fill(0), c = 0; X.forEach(function(x, q){ if(lab[q] === jj){ c++; for(var d = 0; d < D10; d++) m[d] += x[d]; } }); m = m.map(function(v){ return v / c; });
     var ss = 0; X.forEach(function(x, q){ if(lab[q] === jj) for(var d = 0; d < D10; d++) ss += (x[d] - m[d]) * (x[d] - m[d]); }); return Math.sqrt(ss / c); });
   var perp = 30, P, Y, U, G, it = 0, KL = 0, view = null, anim, paused = false, MAXIT = 1000;
   function affinities(){
     var Pc = [], logU = Math.log(perp);
     for(var i = 0; i < n; i++){
       var lo = -Infinity, hi = Infinity, beta = 1, row = new Float64Array(n);
       for(var tries = 0; tries < 60; tries++){
         var sP = 0, sDP = 0;
         for(var j = 0; j < n; j++){ if(j === i){ row[j] = 0; continue; } var v = Math.exp(-D2[i][j] * beta); row[j] = v; sP += v; sDP += D2[i][j] * v; }
         sP = Math.max(sP, 1e-300); var Hh = Math.log(sP) + beta * sDP / sP, diff = Hh - logU;
         if(Math.abs(diff) < 1e-5) break;
         if(diff > 0){ lo = beta; beta = hi === Infinity ? beta * 2 : (beta + hi) / 2; } else { hi = beta; beta = lo === -Infinity ? beta / 2 : (beta + lo) / 2; }
       }
       for(j = 0; j < n; j++) row[j] /= sP;
       Pc.push(row);
     }
     P = []; for(i = 0; i < n; i++){ P.push(new Float64Array(n)); }
     for(i = 0; i < n; i++) for(j = 0; j < n; j++) P[i][j] = Math.max((Pc[i][j] + Pc[j][i]) / (2 * n), 1e-12);
   }
   function restart(){
     affinities();
     var rg = mulberry(5); Y = []; U = []; G = [];
     for(var i = 0; i < n; i++){ Y.push([1e-2 * gauss(rg), 1e-2 * gauss(rg)]); U.push([0, 0]); G.push([1, 1]); }
     it = 0; KL = 0; view = null;
   }
   var num = []; for(i = 0; i < n; i++) num.push(new Float64Array(n));
   function iterate(){
     var exag = it < 250 ? 12 : 1, mom = it < 250 ? 0.5 : 0.8, eta = 50, Z = 0, i, j;
     for(i = 0; i < n; i++) for(j = i + 1; j < n; j++){ var dx = Y[i][0] - Y[j][0], dy = Y[i][1] - Y[j][1], q = 1 / (1 + dx * dx + dy * dy); num[i][j] = num[j][i] = q; Z += 2 * q; }
     for(i = 0; i < n; i++){
       var gx = 0, gy = 0;
       for(j = 0; j < n; j++){ if(i === j) continue; var m = (exag * P[i][j] - num[i][j] / Z) * num[i][j]; gx += m * (Y[i][0] - Y[j][0]); gy += m * (Y[i][1] - Y[j][1]); }
       gx *= 4; gy *= 4;
       var gr = [gx, gy];
       for(var a = 0; a < 2; a++){
         G[i][a] = (Math.sign(gr[a]) !== Math.sign(U[i][a])) ? G[i][a] + 0.2 : Math.max(G[i][a] * 0.8, 0.01);
         U[i][a] = mom * U[i][a] - eta * G[i][a] * gr[a];
       }
     }
     var mx = 0, my = 0; for(i = 0; i < n; i++){ Y[i][0] += U[i][0]; Y[i][1] += U[i][1]; mx += Y[i][0]; my += Y[i][1]; }
     mx /= n; my /= n; for(i = 0; i < n; i++){ Y[i][0] -= mx; Y[i][1] -= my; }
     it++;
     if(it % 10 === 0 || it === MAXIT){
       var kl = 0; for(i = 0; i < n; i++) for(j = 0; j < n; j++) if(i !== j){ var qq = Math.max(num[i][j] / Z, 1e-12); kl += P[i][j] * Math.log(P[i][j] / qq); }
       KL = kl;
     }
   }
   var mb = [20, 34, 430, 366], CL = [C.c[1], C.c[2], C.c[3], C.c[4]];
   function draw(){
     K.clear();
     /* vista que sigue suavemente a la nube */
     var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
     Y.forEach(function(p){ x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
     var tv = [(x0 + x1) / 2, (y0 + y1) / 2, Math.max(x1 - x0, y1 - y0, 1e-3) * 1.12];
     if(!view) view = tv.slice(); else for(var a = 0; a < 3; a++) view[a] += (tv[a] - view[a]) * 0.18;
     var sc = Math.min(mb[2], mb[3]) / view[2], cx = mb[0] + mb[2] / 2, cy = mb[1] + mb[3] / 2;
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(mb[0] + .5, mb[1] + .5, mb[2], mb[3]);
     cap(ctx, "Mapa t-SNE (2D)", mb[0], 22, C);
     ctx.save(); ctx.beginPath(); ctx.rect(mb[0], mb[1], mb[2], mb[3]); ctx.clip();
     Y.forEach(function(p, q){ mark(ctx, lab[q], cx + (p[0] - view[0]) * sc, cy - (p[1] - view[1]) * sc, 3.6, hexA(CL[lab[q]], 0.85), C.card, 0.8); });
     /* etiqueta de cada grupo en su centro */
     if(it > 60) GR.forEach(function(g, jj){ var sx2 = 0, sy2 = 0, c = 0; Y.forEach(function(p, q){ if(lab[q] === jj){ sx2 += p[0]; sy2 += p[1]; c++; } });
       var top2 = -Infinity; Y.forEach(function(p, q){ if(lab[q] === jj) top2 = Math.max(top2, p[1]); });
       var lx = cx + (sx2 / c - view[0]) * sc, ly = Math.max(mb[1] + 14, cy - (top2 - view[1]) * sc - 16);
       ctx.beginPath(); ctx.arc(lx, ly, 10, 0, 7); ctx.fillStyle = hexA(C.card, 0.9); ctx.fill(); ctx.strokeStyle = CL[jj]; ctx.lineWidth = 1.6; ctx.stroke();
       tx(ctx, g[0], lx, ly + 4.5, {s:12, w:700, c:C.ink, a:"center"}); });
     ctx.restore();
     /* panel: tamaño real frente al del mapa */
     var px0 = 476, top = 26;
     cap(ctx, "¿Conserva los tamaños?", px0, top + 6, C);
     tx(ctx, "dispersión real (10D)", px0 + 60, top + 30, {s:11, c:C.muted});
     tx(ctx, "dispersión en el mapa", px0 + 60, top + 44, {s:11, c:C.muted});
     ctx.fillStyle = hexA(C.ink, 0.75); ctx.fillRect(px0 + 40, top + 24, 14, 6); ctx.fillStyle = hexA(C.c[0], 0.75); ctx.fillRect(px0 + 40, top + 38, 14, 6);
     var mapDisp = GR.map(function(g, jj){ var sx2 = 0, sy2 = 0, c = 0; Y.forEach(function(p, q){ if(lab[q] === jj){ sx2 += p[0]; sy2 += p[1]; c++; } }); sx2 /= c; sy2 /= c;
       var ss = 0; Y.forEach(function(p, q){ if(lab[q] === jj) ss += (p[0] - sx2) * (p[0] - sx2) + (p[1] - sy2) * (p[1] - sy2); }); return Math.sqrt(ss / c); });
     var mr = Math.max.apply(null, realDisp), mm = Math.max.apply(null, mapDisp), bw = 150;
     GR.forEach(function(g, jj){
       var y = top + 70 + jj * 56;
       mark(ctx, jj, px0 + 8, y + 2, 6, CL[jj], C.card, 1);
       tx(ctx, "Grupo " + g[0], px0 + 20, y + 6, {s:12, w:700, c:C.ink});
       tx(ctx, g[1] + " clientes", px0 + 20, y + 21, {s:11, c:C.muted});
       var bx = px0 + 100;
       ctx.fillStyle = hexA(C.ink, 0.75); rrect(ctx, bx, y - 4, Math.max(3, bw * realDisp[jj] / mr), 9, 3); ctx.fill();
       ctx.fillStyle = hexA(C.c[0], 0.75); rrect(ctx, bx, y + 10, Math.max(3, bw * mapDisp[jj] / mm), 9, 3); ctx.fill();
       tx(ctx, fmt(realDisp[jj] / realDisp[0], 1) + "×", bx + bw + 30, y + 5, {s:11, w:600, c:C.ink, a:"right"});
       tx(ctx, fmt(mapDisp[jj] / mapDisp[0], 1) + "×", bx + bw + 30, y + 19, {s:11, w:600, c:C.c[0], a:"right"});
     });
     tx(ctx, "× = veces el tamaño del grupo A", px0, top + 300, {s:11, c:C.muted});
     /* progreso */
     var pw = 250, py2 = top + 330;
     ctx.fillStyle = hexA(C.line, 0.9); rrect(ctx, px0, py2, pw, 6, 3); ctx.fill();
     ctx.fillStyle = C.c[0]; rrect(ctx, px0, py2, pw * it / MAXIT, 6, 3); ctx.fill();
     ctx.fillStyle = hexA(C.ink, 0.3); ctx.fillRect(px0 + pw * 250 / MAXIT, py2 - 3, 1.5, 12);
     tx(ctx, it < 250 ? "fase 1: exageración temprana" : it < MAXIT ? "fase 2: ajuste fino" : "terminado", px0, py2 + 22, {s:11, c:C.muted});
     /* lectura */
     var dist = function(a, b){ var sx2 = [0, 0], sy2 = [0, 0], c = [0, 0]; Y.forEach(function(p, q){ [a, b].forEach(function(g, k){ if(lab[q] === g){ sx2[k] += p[0]; sy2[k] += p[1]; c[k]++; } }); });
       return Math.hypot(sx2[0] / c[0] - sx2[1] / c[1], sy2[0] / c[0] - sy2[1] / c[1]); };
     var real = function(a, b){ var s2 = 0; for(var d = 0; d < D10; d++) s2 += (cen[a][d] - cen[b][d]) * (cen[a][d] - cen[b][d]); return Math.sqrt(s2); };
     read.innerHTML = '<span>Iteración <b>' + it + ' / ' + MAXIT + '</b></span><span>KL (desajuste) <b>' + (it >= 10 ? fmt(KL, 3) : "—") + '</b></span><span>Perplexity <b>' + perp + '</b></span>' +
       '<span class="ldiag">' + (it < 250 ? "Fase de <b>exageración temprana</b>: las atracciones se multiplican por 12 para que los grupos se separen pronto. La KL, que mide cuánto se parecen las vecindades del mapa a las reales, irá bajando." :
       "En los datos reales, C está <b>" + fmt(real(2, 0) / real(0, 1), 1) + " veces</b> más lejos de A que B; en el mapa, <b>" + fmt(dist(2, 0) / Math.max(dist(0, 1), 1e-9), 1) + " veces</b>. Y el grupo C es " + fmt(realDisp[2] / realDisp[0], 1) + " veces más disperso que A, pero en el mapa solo lo parece " + fmt(mapDisp[2] / mapDisp[0], 1) + " veces. <b>Interpreta vecindades, no tamaños ni distancias entre grupos.</b>") + '</span>';
   }
   var settle = 0;
   anim = animator(function(){
     if(paused){ draw(); return false; }
     if(it < MAXIT){ for(var s2 = 0; s2 < 4 && it < MAXIT; s2++) iterate(); settle = 0; }
     draw();
     if(it >= MAXIT && ++settle > 45){ pb.innerHTML = "↺ Repetir"; return false; }
   });
   function go(){ paused = false; pb.innerHTML = "⏸ Pausa"; anim.start(); }
   var pb = ctlBtn(ctl, "⏸ Pausa", function(){
     if(it >= MAXIT){ restart(); go(); return; }
     if(paused) go(); else { paused = true; pb.innerHTML = "▶ Seguir"; }
   }, true);
   ctlBtn(ctl, "↺ Reiniciar", function(){ restart(); go(); });
   var tmo = 0;
   ctlSlider(ctl, "Perplexity (vecinos efectivos)", 5, 50, 1, perp, function(v){ return v; }, function(v){ perp = v; clearTimeout(tmo); tmo = setTimeout(function(){ restart(); go(); }, 180); });
   restart(); anim.start();
   return function(){ anim.stop(); clearTimeout(tmo); };
 }});

/* ── 5. UMAP: DESENROLLAR EL ROLLO SUIZO ─────────────────────── */
VIZ.push({id:"v-umap", model:"umap", g:"model", ic:"🌀", dim:"3D",
 t:"Desenrollar un rollo suizo (la idea de UMAP)",
 q:"¿Cómo puede un mapa 2D «desenrollar» datos que en 3D están enrollados?",
 intro:"Un <b>rollo suizo</b>: 900 puntos sobre una lámina enrollada, coloreados según su posición a lo largo de la lámina. Las líneas grises son el <b>grafo de vecinos</b> (cada punto unido a sus n_neighbors más cercanos). El mapa de la derecha arranca de una inicialización espectral del grafo y luego coloca los puntos tirando de los vecinos unidos y empujando a los demás. Es una <b>simplificación didáctica</b> del principio de UMAP: grafo difuso, curva de atracción/repulsión y muestreo negativo como en UMAP, pero sin sus atajos de rendimiento (vecinos aproximados, etc.).",
 notice:["Con <b>pocos vecinos</b> (3-4) el grafo se rompe en trozos y el mapa sale <b>fragmentado</b>: cada trozo se coloca por su cuenta.",
   "Con <b>8-15 vecinos</b> el grafo sigue la lámina casi sin saltar entre capas y el mapa la <b>desenrolla</b>: los colores quedan en orden, como una alfombra extendida. Con 20 aparecen <b>atajos</b> entre capas y el mapa se retuerce.",
   "La «foto» de <b>PCA</b> solo puede proyectar en línea recta: <b>aplasta</b> las capas una encima de otra y mezcla colores. «Proyectar un punto nuevo» lo coloca en el mapa sin recalcularlo, como hace transform() en UMAP."],
 models:["umap","tsne","pca"],
 build:function(stage, ctl, read){
   var kNN = 10, view = "umap", fresh = null;
   return lab3d(stage, read, function(K3){
     var host = document.createElement("div"); host.style.cssText = "display:flex;flex-wrap:wrap;gap:12px;width:100%;align-items:stretch";
     stage.appendChild(host);
     var left = document.createElement("div"); left.style.cssText = "flex:1 1 340px;min-width:0";
     var right = document.createElement("div"); right.style.cssText = "flex:1 1 340px;min-width:0;display:flex;align-items:center";
     host.appendChild(left); host.appendChild(right);
     var S = scene3d(left, K3, {cam:[8.2, 1.8, 4.6], target:[0, 0, 0], auto:true, label:"Rollo suizo en 3D con su grafo de vecinos"}), T = S.T, C = S.C;
     var Kc = makeCanvas(right, 640, 440, "Mapa 2D obtenido del grafo de vecinos"), ctx = Kc.ctx, W = 640, H = 440;
     /* datos */
     var n = 900, r = mulberry(17), X = [], tt = [], hh = [];
     for(var i = 0; i < n; i++){
       var t = 1.5 * Math.PI + 2.5 * Math.PI * r(), h = 40 * r();
       X.push([t * Math.cos(t), h, t * Math.sin(t)]); tt.push(t); hh.push(h);
     }
     var tmin = 1.5 * Math.PI, tmax = 4 * Math.PI, col = tt.map(function(v){ return ramp(C, (v - tmin) / (tmax - tmin)); });
     var s3 = 0.16, P3 = S.points(n, 0.055);
     var p3 = function(x){ return [(x[1] - 20) * s3, x[2] * s3, x[0] * s3]; }; /* rollo tumbado: la altura va en horizontal */
     X.forEach(function(x, q){ var v = p3(x); P3.set(q, v[0], v[1], v[2]); P3.color(q, col[q]); }); P3.done();
     /* distancias y vecinos ordenados (una sola vez) */
     /* los k más cercanos sin ordenar todo (inserción en una lista corta) */
     function topK(i, k, pts, dim){
       var best = [];
       for(var j = 0; j < pts.length; j++){
         if(j === i) continue;
         var d = 0; for(var a = 0; a < dim; a++){ var u = pts[i][a] - pts[j][a]; d += u * u; }
         if(best.length < k || d < best[best.length - 1][0]){
           var q = best.length; best.push(null);
           while(q > 0 && best[q - 1][0] > d){ best[q] = best[q - 1]; q--; }
           best[q] = [d, j]; if(best.length > k) best.pop();
         }
       }
       return best;
     }
     var NB = [];
     for(i = 0; i < n; i++) NB.push(topK(i, 20, X, 3).map(function(d){ return [Math.sqrt(d[0]), d[1]]; }));
     var vw = null, freshMesh = null, freshLines = null, edgeObj = null, E = [], Y = [], epoch = 0, EPOCHS = 260, comps = 1, bad = 0, sig = [], rho = [];
     var A_ = 0.583, B_ = 1.334; /* curva de UMAP para min_dist = 0,5 */
     function graph(){
       /* grafo difuso de UMAP: rho = distancia al vecino más cercano, sigma por búsqueda binaria */
       var Wm = {}; sig = []; rho = [];
       for(var i = 0; i < n; i++){
         var nb = NB[i].slice(0, kNN), rh = nb[0][0], lo = 0, hi = Infinity, sg = 1, target = Math.log2(kNN);
         for(var it = 0; it < 64; it++){
           var s = 0; nb.forEach(function(d){ s += Math.exp(-Math.max(0, d[0] - rh) / sg); });
           if(Math.abs(s - target) < 1e-5) break;
           if(s > target){ hi = sg; sg = (lo + hi) / 2; } else { lo = sg; sg = hi === Infinity ? sg * 2 : (lo + hi) / 2; }
         }
         sig.push(sg); rho.push(rh);
         nb.forEach(function(d){ var key = Math.min(i, d[1]) + "_" + Math.max(i, d[1]), w = Math.exp(-Math.max(0, d[0] - rh) / sg);
           if(Wm[key] === undefined) Wm[key] = w; else Wm[key] = Wm[key] + w - Wm[key] * w; });
       }
       E = Object.keys(Wm).map(function(k){ var p = k.split("_"); return [+p[0], +p[1], Wm[k]]; });
       /* componentes conexas y aristas que saltan de capa */
       var par = []; for(i = 0; i < n; i++) par.push(i);
       var f = function(x){ while(par[x] !== x){ par[x] = par[par[x]]; x = par[x]; } return x; };
       bad = 0; E.forEach(function(e){ par[f(e[0])] = f(e[1]); if(Math.abs(tt[e[0]] - tt[e[1]]) > Math.PI) bad++; });
       var roots = {}; for(i = 0; i < n; i++) roots[f(i)] = 1; comps = Object.keys(roots).length;
       /* aristas en 3D */
       if(edgeObj){ S.scene.remove(edgeObj); edgeObj.geometry.dispose(); edgeObj.material.dispose(); }
       var pos = new Float32Array(E.length * 6);
       E.forEach(function(e, q){ var u = X[e[0]], v = X[e[1]]; pos.set(p3(u).concat(p3(v)), q * 6); });
       var g = new T.BufferGeometry(); g.setAttribute("position", new T.BufferAttribute(pos, 3));
       edgeObj = new T.LineSegments(g, new T.LineBasicMaterial({color:C.muted, transparent:true, opacity:0.22}));
       S.scene.add(edgeObj);
       /* reinicio del mapa: primero la inicialización espectral (por trozos, en varios fotogramas) */
       deg = new Float64Array(n); E.forEach(function(e){ deg[e[0]] += e[2]; deg[e[1]] += e[2]; });
       var nr = 0; v0 = []; for(i = 0; i < n; i++){ v0.push(Math.sqrt(deg[i])); nr += deg[i]; } nr = Math.sqrt(nr); v0 = v0.map(function(v){ return v / nr; });
       var rg = mulberry(2); V = [0, 1].map(function(){ var a = new Float64Array(n); for(var q = 0; q < n; q++) a[q] = rg() - 0.5; return a; });
       specIt = 0; Y = []; for(i = 0; i < n; i++) Y.push([0, 0]);
       epoch = 0; vw = null; clearFresh();
     }
     var rgN = mulberry(77), deg, v0, V, specIt = 0, SPEC = 2000;
     /* autovectores del laplaciano normalizado del grafo (iteración de potencias con deflación) */
     function mv(x){
       var y = new Float64Array(n); for(var i = 0; i < n; i++) y[i] = x[i];
       for(var q = 0; q < E.length; q++){ var e = E[q], w = e[2] / Math.sqrt(deg[e[0]] * deg[e[1]]); y[e[0]] += w * x[e[1]]; y[e[1]] += w * x[e[0]]; }
       return y;
     }
     function specStep(){
       for(var s = 0; s < 200 && specIt < SPEC; s++, specIt++){
         V = V.map(mv);
         V.forEach(function(v, k){
           var d = 0, i; for(i = 0; i < n; i++) d += v[i] * v0[i]; for(i = 0; i < n; i++) v[i] -= d * v0[i];
           for(var m = 0; m < k; m++){ d = 0; for(i = 0; i < n; i++) d += v[i] * V[m][i]; for(i = 0; i < n; i++) v[i] -= d * V[m][i]; }
           var nn = 0; for(i = 0; i < n; i++) nn += v[i] * v[i]; nn = Math.sqrt(nn) || 1; for(i = 0; i < n; i++) v[i] /= nn;
         });
       }
       var mx = 1e-12; Y = [];
       for(var i = 0; i < n; i++){ var p = [V[0][i] / Math.sqrt(deg[i] || 1), V[1][i] / Math.sqrt(deg[i] || 1)]; Y.push(p); mx = Math.max(mx, Math.abs(p[0]), Math.abs(p[1])); }
       Y = Y.map(function(p){ return [p[0] / mx * 10, p[1] / mx * 10]; });
     }
     function epochStep(){
       var alpha = 1 - epoch / EPOCHS;
       for(var q = 0; q < E.length; q++){
         var e = E[q]; if(rgN() > e[2]) continue; /* cada arista se muestrea según su peso */
         var i = e[0], j = e[1], dx = Y[i][0] - Y[j][0], dy = Y[i][1] - Y[j][1], d2 = dx * dx + dy * dy;
         if(d2 > 0){
           var gc = -2 * A_ * B_ * Math.pow(d2, B_ - 1) / (1 + A_ * Math.pow(d2, B_));
           var gx = Math.max(-4, Math.min(4, gc * dx)) * alpha, gy = Math.max(-4, Math.min(4, gc * dy)) * alpha;
           Y[i][0] += gx; Y[i][1] += gy; Y[j][0] -= gx; Y[j][1] -= gy;
         }
         for(var s = 0; s < 5; s++){ /* muestreo negativo: empuja puntos al azar */
           var k = Math.floor(rgN() * n); if(k === i) continue;
           dx = Y[i][0] - Y[k][0]; dy = Y[i][1] - Y[k][1]; d2 = dx * dx + dy * dy;
           var gr = 2 * B_ / ((0.001 + d2) * (1 + A_ * Math.pow(d2, B_)));
           Y[i][0] += Math.max(-4, Math.min(4, gr * dx)) * alpha; Y[i][1] += Math.max(-4, Math.min(4, gr * dy)) * alpha;
         }
       }
       epoch++;
     }
     /* PCA de los datos 3D (la «foto») */
     var mu = [0, 0, 0]; X.forEach(function(x){ for(var a = 0; a < 3; a++) mu[a] += x[a] / n; });
     var Cv = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; X.forEach(function(x){ for(var a = 0; a < 3; a++) for(var b = 0; b < 3; b++) Cv[a][b] += (x[a] - mu[a]) * (x[b] - mu[b]) / n; });
     var EG = jacobiEig(Cv).sort(function(a, b){ return b.val - a.val; });
     var PC = X.map(function(x){ var d = [x[0] - mu[0], x[1] - mu[1], x[2] - mu[2]]; return [0, 1].map(function(k){ return d[0] * EG[k].vec[0] + d[1] * EG[k].vec[1] + d[2] * EG[k].vec[2]; }); });
     
     function draw2d(){
       ctx.clearRect(0, 0, W, H);
       var pts = view === "pca" ? PC : Y;
       var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
       pts.forEach(function(p){ x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
       var tv = [(x0 + x1) / 2, (y0 + y1) / 2, Math.max(x1 - x0, (y1 - y0) * 1.5, 1e-3) * 1.08];
       if(!vw || view === "pca") vw = tv.slice(); else for(var a = 0; a < 3; a++) vw[a] += (tv[a] - vw[a]) * 0.2;
       var bx = [24, 44, 592, 352], sc = Math.min(bx[2] / vw[2], bx[3] / (vw[2] / 1.5));
       var mx = function(p){ return bx[0] + bx[2] / 2 + (p[0] - vw[0]) * sc; }, my = function(p){ return bx[1] + bx[3] / 2 - (p[1] - vw[1]) * sc; };
       tx(ctx, view === "pca" ? "Foto PCA (proyección lineal)" : "Mapa 2D desde el grafo de vecinos", 24, 28, {s:15, w:700, c:C.ink});
       ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(bx[0] + .5, bx[1] + .5, bx[2], bx[3]);
       ctx.save(); ctx.beginPath(); ctx.rect(bx[0], bx[1], bx[2], bx[3]); ctx.clip();
       pts.forEach(function(p, q){ ctx.fillStyle = col[q]; ctx.beginPath(); ctx.arc(mx(p), my(p), 3, 0, 7); ctx.fill(); });
       if(fresh && view !== "pca"){
         fresh.nb.forEach(function(j){ seg(ctx, mx(fresh.y), my(fresh.y), mx(Y[j]), my(Y[j]), hexA(C.ink, 0.5), 1); });
         ctx.beginPath(); ctx.arc(mx(fresh.y), my(fresh.y), 11, 0, 7); stroke(ctx, C.ink, 2.4);
         dot(ctx, mx(fresh.y), my(fresh.y), 5, fresh.col, C.card);
         tx(ctx, "punto nuevo", mx(fresh.y) + 15, my(fresh.y) - 10, {s:14, w:700, c:C.ink});
       }
       ctx.restore();
       /* leyenda de color */
       var lgx = 456, lgy = 27;
       for(var k = 0; k < 70; k++){ ctx.fillStyle = ramp(C, k / 69); ctx.fillRect(lgx + k, lgy - 9, 1.2, 9); }
       tx(ctx, "inicio", lgx - 6, lgy, {s:13, c:C.muted, a:"right"}); tx(ctx, "final", lgx + 76, lgy, {s:13, c:C.muted});
       if(view !== "pca"){
         ctx.fillStyle = hexA(C.line, 0.9); rrect(ctx, 24, 424, 592, 5, 2.5); ctx.fill();
         ctx.fillStyle = C.c[0]; rrect(ctx, 24, 424, Math.max(5, 592 * (specIt / SPEC * 0.2 + epoch / EPOCHS * 0.8)), 5, 2.5); ctx.fill();
         tx(ctx, specIt < SPEC ? "1 · inicialización espectral del grafo" : epoch < EPOCHS ? "2 · atraer vecinos, repeler al resto" : "listo", 616, 414, {s:13, c:C.muted, a:"right"});
       } else tx(ctx, "PCA solo proyecta en línea recta: no puede desenrollar", 24, 430, {s:13, c:C.muted});
     }
     /* calidad: ¿los vecinos en 2D están cerca a lo largo de la lámina? */
     function quality(pts){
       var ok = 0, tot = 0, rg = mulberry(9);
       for(var s = 0; s < 150; s++){
         var i = Math.floor(rg() * n), best = topK(i, 8, pts, 2);
         for(var q = 0; q < 8; q++){ tot++; if(Math.abs(tt[best[q][1]] - tt[i]) < 1.2 && Math.abs(hh[best[q][1]] - hh[i]) < 6) ok++; }
       }
       return ok / tot;
     }
     var qU = null, qP = quality(PC);
     function readout(){
       read.innerHTML = '<span>n_neighbors <b>' + kNN + '</b></span><span>Trozos del grafo <b>' + comps + '</b></span><span>Aristas que saltan de capa <b>' + bad + '</b></span>' +
         '<span>Época <b>' + epoch + ' / ' + EPOCHS + '</b></span>' +
         (qU !== null ? '<span>Vecinos 2D que son vecinos de verdad <b>' + pct(qU, 0) + '</b> (PCA: ' + pct(qP, 0) + ')</span>' : '') +
         '<span class="ldiag">' + (comps > 1 ? "Con tan pocos vecinos el grafo está <b>roto en " + comps + " trozos</b>: el mapa no sabe cómo se conectan entre sí y los coloca por separado." :
           bad > E.length * 0.004 ? "<b class='lwarn'>Ojo</b>: algunas aristas saltan entre capas del rollo; el mapa puede mezclar zonas que en la lámina están lejos." :
           "Grafo conectado y casi sin atajos entre capas: el mapa puede <b>desenrollar</b> la lámina. Los colores deberían quedar en orden.") +
         (fresh ? " El punto nuevo se ha colocado con la media ponderada de sus " + kNN + " vecinos en el mapa, sin reentrenar (así empieza transform())." : "") + '</span>';
     }
     var settle = 0;
     S.onFrame(function(){
       if(specIt < SPEC && view !== "pca"){ specStep(); draw2d(); settle = 0; return; }
       if(epoch < EPOCHS && view !== "pca"){ var t0 = performance.now(); do { epochStep(); } while(epoch < EPOCHS && performance.now() - t0 < 14); if(epoch >= EPOCHS){ qU = quality(Y); readout(); } else if(epoch % 15 === 0) readout(); draw2d(); settle = 0; }
       else if(settle++ < 30) draw2d();
     });
     function clearFresh(){
       fresh = null;
       if(freshMesh){ S.scene.remove(freshMesh); freshMesh.geometry.dispose(); freshMesh.material.dispose(); freshMesh = null; }
       if(freshLines){ S.scene.remove(freshLines); freshLines.geometry.dispose(); freshLines.material.dispose(); freshLines = null; }
     }
     function newPoint(){
       var rg = Math.random, t = 1.5 * Math.PI * (1 + 2 * rg()), h = 30 * rg(), x = [t * Math.cos(t), h, t * Math.sin(t)];
       var ds = X.map(function(p, j){ return [Math.hypot(p[0] - x[0], p[1] - x[1], p[2] - x[2]), j]; }).sort(function(a, b){ return a[0] - b[0]; }).slice(0, kNN);
       var rh = ds[0][0], sg = mean(sig), w = ds.map(function(d){ return Math.exp(-Math.max(0, d[0] - rh) / sg); }), sw = sum(w), y = [0, 0];
       ds.forEach(function(d, q){ y[0] += w[q] * Y[d[1]][0] / sw; y[1] += w[q] * Y[d[1]][1] / sw; });
       fresh = {x:x, y:y, nb:ds.map(function(d){ return d[1]; }), col:ramp(C, (t - tmin) / (tmax - tmin))};
       var keep = fresh; clearFresh(); fresh = keep;
       freshMesh = new T.Mesh(new T.SphereGeometry(0.16, 20, 14), new T.MeshStandardMaterial({color:fresh.col, emissive:fresh.col, emissiveIntensity:0.35}));
       var fp = p3(x); freshMesh.position.set(fp[0], fp[1], fp[2]); S.scene.add(freshMesh);
       var pos = []; fresh.nb.forEach(function(j){ pos.push.apply(pos, p3(x).concat(p3(X[j]))); });
       var g = new T.BufferGeometry(); g.setAttribute("position", new T.BufferAttribute(new Float32Array(pos), 3));
       freshLines = new T.LineSegments(g, new T.LineBasicMaterial({color:C.ink})); S.scene.add(freshLines);
       settle = 0; readout();
     }
     ctlSlider(ctl, "n_neighbors (vecinos en el grafo)", 3, 20, 1, kNN, function(v){ return v; }, function(v){ kNN = v; qU = null; graph(); readout(); settle = 0; });
     ctlSeg(ctl, "Mapa 2D", [["umap", "Grafo de vecinos (UMAP)"], ["pca", "Foto PCA"]], view, function(v){ view = v; vw = null; settle = 0; });
     ctlBtn(ctl, "✚ Proyectar un punto nuevo", function(){
       if(epoch < EPOCHS){ readout(); read.querySelector(".ldiag").innerHTML = "Espera a que termine el mapa (época " + epoch + " de " + EPOCHS + ") para proyectar un punto nuevo."; return; }
       if(view === "pca"){ view = "umap"; vw = null; [].forEach.call(ctl.querySelectorAll(".segs button"), function(b){ var on = b.dataset.v === "umap"; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); }); }
       newPoint(); }, true);
     ctlBtn(ctl, "↺ Recalcular mapa", function(){ graph(); qU = null; readout(); settle = 0; });
     graph(); readout();
     return function(){ S.dispose(); };
   });
 }});

/* ── 6. LOCAL OUTLIER FACTOR ─────────────────────────────────── */
VIZ.push({id:"v-lof", model:"lof", g:"model", ic:"🏙️", dim:"2D",
 t:"Raro para su barrio (LOF)",
 q:"¿Por qué un punto puede ser normal en las afueras pero anómalo en el centro?",
 intro:"Pedidos de reparto en un mapa: un <b>centro</b> muy denso, unas <b>afueras</b> dispersas y algunos casos raros. El tamaño de cada círculo es su puntuación de anomalía. <b>LOF</b> (Local Outlier Factor, calculado de verdad con k-distancia y distancia de alcance) compara la densidad de cada punto con la de <b>sus propios vecinos</b>. Haz clic en un punto para ver sus k vecinos y cambia de método.",
 notice:["El punto <b>★</b> está a poca distancia del centro, pero en una zona donde «lo normal» es estar pegado a los demás: su LOF es alto aunque, en distancia absoluta, no esté lejos de nada.",
   "Con «distancia al centro (global)», los pedidos normales de las <b>afueras</b> parecen anómalos (están lejos del centro de todos los datos) y el ★ <b>se escapa</b>.",
   "LOF ≈ 1 significa «tan denso como sus vecinos» (normal); LOF de 2 o más, «mucho menos denso que su barrio» (sospechoso). Con k muy pequeño las puntuaciones se vuelven ruidosas."],
 models:["lof","iforest","dbscan","knn"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 420, K = makeCanvas(stage, W, H, "Puntuación LOF frente a distancia global en un centro denso y unas afueras dispersas"), ctx = K.ctx;
   var r = mulberry(12), P = [], zone = [];
   for(var i = 0; i < 70; i++){ P.push([3.0 + 0.28 * gauss(r), 6.2 + 0.28 * gauss(r)]); zone.push(0); }
   for(i = 0; i < 48; i++){ P.push([7.4 + 1.15 * gauss(r), 3.0 + 1.0 * gauss(r)]); zone.push(1); }
   var STAR = P.length; P.push([4.05, 6.75]); zone.push(2);
   [[10.6, 8.7], [0.7, 1.3], [5.6, 9.4]].forEach(function(p){ P.push(p); zone.push(3); });
   var n = P.length, k = 8, mode = "lof", sel = STAR, lof = [], lrd = [], kd = [], NB = [], gsc = [], cen, MD = 1;
   var box = [46, 18, 520, 372], xr = [0, 12], yr = [0, 10];
   var sx = function(x){ return box[0] + (x - xr[0]) / (xr[1] - xr[0]) * box[2]; }, sy = function(y){ return box[1] + box[3] - (y - yr[0]) / (yr[1] - yr[0]) * box[3]; };
   var D = P.map(function(a){ return P.map(function(b){ return Math.hypot(a[0] - b[0], a[1] - b[1]); }); });
   function compute(){
     NB = []; kd = [];
     for(var i = 0; i < n; i++){
       var o = []; for(var j = 0; j < n; j++) if(j !== i) o.push(j);
       o.sort(function(a, b){ return D[i][a] - D[i][b]; });
       NB.push(o.slice(0, k)); kd.push(D[i][o[k - 1]]);
     }
     lrd = NB.map(function(nb, i){ var s = 0; nb.forEach(function(j){ s += Math.max(kd[j], D[i][j]); }); return 1 / (s / k); });
     lof = NB.map(function(nb, i){ var s = 0; nb.forEach(function(j){ s += lrd[j]; }); return s / k / lrd[i]; });
     cen = [mean(P.map(function(p){ return p[0]; })), mean(P.map(function(p){ return p[1]; }))];
     var dg = P.map(function(p){ return Math.hypot(p[0] - cen[0], p[1] - cen[1]); }); MD = mean(dg);
     gsc = dg.map(function(d){ return d / MD; }); /* distancia relativa a la media */
   }
   function rank(sc){ return sc.map(function(v, i){ return [v, i]; }).sort(function(a, b){ return b[0] - a[0]; }).slice(0, 5).map(function(x){ return x[1]; }); }
   function label(i){ return i === STAR ? "★ cerca del centro" : zone[i] === 0 ? "centro" : zone[i] === 1 ? "afueras" : "aislado"; }
   function draw(){
     K.clear();
     axes(ctx, box, xr, yr, C, {xl:"km (oeste → este)", yl:"km (sur → norte)", xt:[0, 2, 4, 6, 8, 10, 12], yt:[0, 2, 4, 6, 8, 10]});
     var sc = mode === "lof" ? lof : gsc, top = rank(sc);
     /* zonas */
     tx(ctx, "CENTRO", sx(3.0), sy(7.25), {s:11, w:700, c:C.muted, a:"center"});
     tx(ctx, "AFUERAS", sx(7.4), sy(5.65), {s:11, w:700, c:C.muted, a:"center"});
     if(mode === "glob"){
       var cx = sx(cen[0]), cy = sy(cen[1]);
       [1, 2].forEach(function(m){ ctx.beginPath(); ctx.ellipse(cx, cy, m * MD * box[2] / (xr[1] - xr[0]), m * MD * box[3] / (yr[1] - yr[0]), 0, 0, 7); stroke(ctx, hexA(C.ink, 0.22), 1, [3, 4]); });
       seg(ctx, cx - 8, cy, cx + 8, cy, C.ink, 2); seg(ctx, cx, cy - 8, cx, cy + 8, C.ink, 2);
       tx(ctx, "centro de todos los datos", cx + 10, cy - 8, {s:11, c:C.text});
     }
     /* vecinos del punto elegido */
     var nb = NB[sel];
     ctx.beginPath(); ctx.arc(sx(P[sel][0]), sy(P[sel][1]), kd[sel] / (xr[1] - xr[0]) * box[2], 0, 7); ctx.fillStyle = hexA(C.c[0], 0.07); ctx.fill(); stroke(ctx, hexA(C.c[0], 0.6), 1, [4, 3]);
     nb.forEach(function(j){ seg(ctx, sx(P[sel][0]), sy(P[sel][1]), sx(P[j][0]), sy(P[j][1]), hexA(C.c[0], 0.7), 1.2); });
     /* puntos y círculos de puntuación */
     for(var i = 0; i < n; i++){
       var v = sc[i], R = mode === "lof" ? Math.max(0, Math.min(26, (v - 1) * 13)) : Math.max(0, Math.min(26, (v - 0.9) * 11));
       var isTop = top.indexOf(i) > -1, x = sx(P[i][0]), y = sy(P[i][1]);
       if(R > 1){ ctx.beginPath(); ctx.arc(x, y, 3 + R, 0, 7); ctx.fillStyle = hexA(isTop ? C.neg : C.c[0], isTop ? 0.12 : 0.06); ctx.fill(); stroke(ctx, hexA(isTop ? C.neg : C.c[0], isTop ? 0.9 : 0.35), isTop ? 1.6 : 1); }
       if(i === STAR){ ctx.save(); ctx.font = "700 17px " + LABFONT; ctx.fillStyle = C.ink; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("★", x, y + 1); ctx.restore(); }
       else dot(ctx, x, y, nb.indexOf(i) > -1 ? 4.2 : 3.4, zone[i] === 3 ? C.ink : hexA(C.ink, 0.7), null);
       if(isTop){ var rk = top.indexOf(i) + 1; ctx.fillStyle = C.neg; rrect(ctx, x + 6 + R * 0.7, y - 18 - R * 0.7, 16, 15, 4); ctx.fill(); tx(ctx, String(rk), x + 14 + R * 0.7, y - 7 - R * 0.7, {s:11, w:700, c:C.card, a:"center"}); }
     }
     ctx.beginPath(); ctx.arc(sx(P[sel][0]), sy(P[sel][1]), 8, 0, 7); stroke(ctx, C.ink, 2);
     /* panel derecho: explicación del punto elegido */
     var px0 = 590, y0 = 40;
     cap(ctx, "Punto elegido", px0, y0, C);
     tx(ctx, label(sel), px0, y0 + 22, {s:14, w:700, c:C.ink});
     var lrdN = mean(nb.map(function(j){ return lrd[j]; }));
     var rows = [["k-distancia", fmt(kd[sel], 2) + " km"], ["densidad local (lrd)", fmt(lrd[sel], 2)], ["lrd media vecinos", fmt(lrdN, 2)], ["LOF = cociente", fmt(lof[sel], 2)], ["dist. global relativa", fmt(gsc[sel], 2)]];
     rows.forEach(function(rw, q){ var yy = y0 + 52 + q * 24; tx(ctx, rw[0], px0, yy, {s:12, c:C.muted}); tx(ctx, rw[1], px0 + 160, yy, {s:12, w:700, c:q === 3 && mode === "lof" ? C.c[0] : C.ink, a:"right"}); });
     /* barras: densidad propia frente a la de su barrio */
     var bb = y0 + 186, mxl = Math.max(lrd[sel], lrdN);
     cap(ctx, "Densidad local", px0, bb, C);
     ctx.fillStyle = hexA(C.ink, 0.65); rrect(ctx, px0, bb + 12, Math.max(3, 160 * lrd[sel] / mxl), 12, 4); ctx.fill();
     tx(ctx, "el punto", px0, bb + 40, {s:11, c:C.muted});
     ctx.fillStyle = C.c[0]; rrect(ctx, px0, bb + 50, Math.max(3, 160 * lrdN / mxl), 12, 4); ctx.fill();
     tx(ctx, "sus " + k + " vecinos", px0, bb + 78, {s:11, c:C.muted});
     tx(ctx, "Clic en un punto para", px0, 360, {s:11, c:C.muted}); tx(ctx, "ver sus vecinos", px0, 375, {s:11, c:C.muted});
     /* lectura */
     var tl = rank(lof), tg = rank(gsc);
     var li = function(arr, s2){ return arr.map(function(i, q){ return (q + 1) + ". " + (i === STAR ? "<b>★</b>" : label(i)) + " (" + fmt(s2[i], 2) + ")"; }).join("<br>"); };
     read.innerHTML = '<table class="cmx"><tr><th>Top-5 · LOF (local)</th><th>Top-5 · distancia al centro (global)</th></tr><tr>' +
       '<td style="font-size:13px;font-weight:500;text-align:left;line-height:1.7">' + li(tl, lof) + '</td><td style="font-size:13px;font-weight:500;text-align:left;line-height:1.7">' + li(tg, gsc) + '</td></tr></table>' +
       '<span class="ldiag" style="flex-basis:auto;flex:1 1 240px">' +
       (sel === STAR ? "El ★ tiene una densidad <b>" + fmt(lrdN / lrd[sel], 1) + " veces menor</b> que la de sus vecinos del centro: LOF = " + fmt(lof[sel], 2) + ". " : "Punto de «" + label(sel) + "»: LOF = " + fmt(lof[sel], 2) + (lof[sel] < 1.3 ? " (tan denso como su barrio: normal). " : " (menos denso que su barrio). ")) +
       (tl.indexOf(STAR) > -1 && tg.indexOf(STAR) < 0 ? "LOF detecta el ★; la distancia global <b>no</b> (su top-5 se llena de pedidos normales de las afueras)." : "") + '</span>';
   }
   K.cv.addEventListener("click", function(e){
     var p = K.pos(e), b = -1, bd = 18;
     P.forEach(function(q, i){ var d = Math.hypot(sx(q[0]) - p[0], sy(q[1]) - p[1]); if(d < bd){ bd = d; b = i; } });
     if(b >= 0){ sel = b; draw(); }
   });
   K.cv.style.cursor = "pointer";
   ctlSeg(ctl, "Puntuación", [["lof", "LOF (local)"], ["glob", "Distancia al centro (global)"]], mode, function(v){ mode = v; draw(); });
   ctlSlider(ctl, "k (vecinos)", 3, 20, 1, k, function(v){ return v; }, function(v){ k = v; compute(); draw(); });
   ctlBtn(ctl, "★ Elegir el punto ★", function(){ sel = STAR; draw(); });
   compute(); draw();
 }});

/* ── 7. APRIORI / MARKET BASKET ──────────────────────────────── */
VIZ.push({id:"v-apriori", model:"apriori", g:"model", ic:"🛒", dim:"2D",
 t:"Cesta de la compra: soporte, confianza y lift",
 q:"¿Cómo se mide si dos productos se compran juntos «de verdad» y cómo evita Apriori contar todas las combinaciones?",
 intro:"24 tickets de un supermercado y 8 productos. En <b>Reglas</b>, elige un antecedente A y un consecuente B: se resaltan los tickets con A y con A y B a la vez, y se calculan las métricas de la regla A → B. En <b>Retícula</b>, sube el soporte mínimo y mira cómo Apriori <b>poda</b> combinaciones sin llegar a contarlas. Todo se calcula de verdad sobre los tickets.",
 notice:["La <b>confianza no es simétrica</b>: «de los que compran nachos, cuántos compran salsa» no es lo mismo que «de los que compran salsa, cuántos compran nachos». El <b>lift</b> sí es simétrico: compara lo que se compran juntos con lo que cabría esperar por azar.",
   "Lift &gt; 1: se compran juntos <b>más</b> de lo esperable (asociación); ≈ 1: independientes; &lt; 1: se evitan. Una confianza alta con lift ≈ 1 solo dice que B es muy popular.",
   "En la retícula, si un producto no llega al soporte mínimo, <b>ninguna</b> combinación que lo contenga puede llegar (propiedad apriori): se tacha y se poda sin contarla. Así se ahorra la mayor parte del trabajo."],
 models:["apriori","reco"],
 build:function(stage, ctl, read, C){
   var PR = ["Pan", "Leche", "Nachos", "Salsa", "Cerveza", "Pañales", "Café", "Galletas"];
   var IC = ["🥖", "🥛", "🌽", "🌶️", "🍺", "👶", "☕", "🍪"];
   var TK = ["PLF", "NSC", "PL", "CÑ", "NSC", "FG", "PLG", "NS", "CÑN", "PFG", "LFG", "NSCÑ", "PLFG", "C", "PL", "NSC", "ÑCL", "FG", "PLF", "NC", "SNP", "LG", "CÑ", "PF"];
   var code = "PLNSCÑFG";
   var T = TK.map(function(s){ return PR.map(function(_, j){ return s.indexOf(code[j]) > -1 ? 1 : 0; }); });
   var NT = T.length, A = 2, B = 3, view = "rules", minsup = 6;
   var cnt = function(items){ return T.filter(function(t){ return items.every(function(j){ return t[j]; }); }).length; };
   /* vista 1: lienzo */
   var wrap1 = document.createElement("div"); wrap1.style.width = "100%"; stage.appendChild(wrap1);
   var K = makeCanvas(wrap1, 760, 440, "Matriz de tickets y productos, diagrama de Venn y métricas de la regla"), ctx = K.ctx, W = 760, H = 440;
   /* vista 2: retícula en HTML */
   var wrap2 = document.createElement("div"); wrap2.style.cssText = "width:100%;display:none"; stage.appendChild(wrap2);
   var mx0 = 92, cw = 26, rh = 22, my0 = 40;
   function drawRules(){
     K.clear();
     var nA = cnt([A]), nB = cnt([B]), nAB = cnt([A, B]);
     cap(ctx, "24 tickets (columnas) × 8 productos (filas)", 16, 20, C);
     /* columnas resaltadas */
     T.forEach(function(t, i){
       var x = mx0 + i * cw;
       if(t[A] && t[B]){ ctx.fillStyle = hexA(C.c[0], 0.22); rrect(ctx, x + 1, my0 - 4, cw - 2, rh * 8 + 8, 6); ctx.fill(); }
       else if(t[A]){ ctx.fillStyle = hexA(C.c[0], 0.08); rrect(ctx, x + 1, my0 - 4, cw - 2, rh * 8 + 8, 6); ctx.fill(); }
       tx(ctx, String(i + 1), x + cw / 2, my0 + rh * 8 + 18, {s:11, c:t[A] && t[B] ? C.ink : C.muted, w:t[A] && t[B] ? 700 : 400, a:"center"});
     });
     PR.forEach(function(p, j){
       var y = my0 + j * rh, on = j === A || j === B;
       tx(ctx, p, mx0 - 10, y + rh / 2 + 4, {s:12, w:on ? 700 : 400, c:on ? C.ink : C.text, a:"right"});
       if(on){ tx(ctx, j === A ? "A" : "B", 14, y + rh / 2 + 4, {s:11, w:700, c:j === A ? C.c[1] : C.c[2]}); }
       T.forEach(function(t, i){
         var x = mx0 + i * cw + cw / 2, yy = y + rh / 2;
         if(t[j]){ var cc = j === A ? C.c[1] : j === B ? C.c[2] : hexA(C.ink, 0.35); ctx.fillStyle = cc; rrect(ctx, x - 7, yy - 7, 14, 14, 4); ctx.fill(); }
         else { ctx.fillStyle = hexA(C.line, 0.9); ctx.fillRect(x - 1.5, yy - 1.5, 3, 3); }
       });
     });
     tx(ctx, "ticket nº", mx0 - 10, my0 + rh * 8 + 18, {s:11, c:C.muted, a:"right"});
     /* Venn proporcional */
     var vy = 256, vb = [16, vy + 22, 330, 150];
     cap(ctx, "Venn proporcional (área = nº de tickets)", 16, vy + 10, C);
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; rrect(ctx, vb[0] + .5, vb[1] + .5, vb[2], vb[3], 8); ctx.stroke();
     tx(ctx, "los 24 tickets", vb[0] + vb[2] - 8, vb[1] + 16, {s:11, c:C.muted, a:"right"});
     var unit = (vb[2] * vb[3]) / NT * 0.62, rA = Math.sqrt(nA * unit / Math.PI), rB = Math.sqrt(nB * unit / Math.PI);
     var inter = function(d){ if(d >= rA + rB) return 0; if(d <= Math.abs(rA - rB)) return Math.PI * Math.min(rA, rB) * Math.min(rA, rB);
       var a1 = rA * rA * Math.acos((d * d + rA * rA - rB * rB) / (2 * d * rA)), a2 = rB * rB * Math.acos((d * d + rB * rB - rA * rA) / (2 * d * rB));
       return a1 + a2 - 0.5 * Math.sqrt((-d + rA + rB) * (d + rA - rB) * (d - rA + rB) * (d + rA + rB)); };
     var target = nAB * unit, lo = Math.abs(rA - rB), hi = rA + rB;
     for(var it = 0; it < 50; it++){ var mid = (lo + hi) / 2; if(inter(mid) > target) lo = mid; else hi = mid; }
     var d = nAB === 0 ? rA + rB + 6 : (lo + hi) / 2, cx = vb[0] + vb[2] / 2 - 10, cy = vb[1] + vb[3] / 2 + 6;
     var xA = cx - d / 2, xB = cx + d / 2;
     ctx.beginPath(); ctx.arc(xA, cy, rA, 0, 7); ctx.fillStyle = hexA(C.c[1], 0.28); ctx.fill(); ctx.strokeStyle = C.c[1]; ctx.lineWidth = 1.6; ctx.stroke();
     ctx.beginPath(); ctx.arc(xB, cy, rB, 0, 7); ctx.fillStyle = hexA(C.c[2], 0.28); ctx.fill(); ctx.strokeStyle = C.c[2]; ctx.stroke();
     tx(ctx, PR[A] + " (" + nA + ")", xA - rA - 6, cy - rA * 0.6, {s:12, w:700, c:C.ink, a:"right"});
     tx(ctx, PR[B] + " (" + nB + ")", xB + rB + 6, cy - rB * 0.6, {s:12, w:700, c:C.ink});
     if(nAB) tx(ctx, String(nAB), (Math.max(xA - rA, xB - rB) + Math.min(xA + rA, xB + rB)) / 2, cy + 5, {s:13, w:700, c:C.ink, a:"center"});
     /* métricas */
     var supAB = nAB / NT, cAB = nA ? nAB / nA : 0, cBA = nB ? nAB / nB : 0, lift = nA && nB ? nAB * NT / (nA * nB) : 0;
     var mx = 400, mw = 230;
     cap(ctx, "Métricas de la regla", mx, vy + 10, C);
     var rows = [["Soporte(A y B)", supAB, nAB + "/" + NT], ["Confianza A → B", cAB, nAB + "/" + nA], ["Confianza B → A", cBA, nAB + "/" + nB]];
     rows.forEach(function(rw, q){
       var y = vy + 34 + q * 34;
       tx(ctx, rw[0], mx, y, {s:12, c:C.text});
       tx(ctx, pct(rw[1], 0) + "  (" + rw[2] + ")", mx + mw + 110, y, {s:12, w:700, c:C.ink, a:"right"});
       ctx.fillStyle = hexA(C.line, 0.9); rrect(ctx, mx, y + 6, mw + 110, 7, 3.5); ctx.fill();
       ctx.fillStyle = C.c[0]; rrect(ctx, mx, y + 6, Math.max(4, (mw + 110) * rw[1]), 7, 3.5); ctx.fill();
     });
     var y = vy + 34 + 3 * 34, lmax = 4, lx = function(v){ return mx + Math.min(v, lmax) / lmax * (mw + 110); };
     tx(ctx, "Lift (simétrico)", mx, y, {s:12, c:C.text});
     tx(ctx, fmt(lift, 2) + (lift > 1.15 ? "  ▲ asociados" : lift < 0.85 ? "  ▼ se evitan" : "  ≈ independientes"), mx + mw + 110, y, {s:12, w:700, c:lift > 1.15 ? C.pos : lift < 0.85 ? C.neg : C.ink, a:"right"});
     ctx.fillStyle = hexA(C.line, 0.9); rrect(ctx, mx, y + 6, mw + 110, 7, 3.5); ctx.fill();
     ctx.fillStyle = lift >= 1 ? C.pos : C.neg; var a1 = lx(Math.min(1, lift)), a2 = lx(Math.max(1, lift)); ctx.fillRect(a1, y + 6, Math.max(2, a2 - a1), 7);
     seg(ctx, lx(1), y + 1, lx(1), y + 18, C.ink, 1.4, [3, 2]); tx(ctx, "1 = azar", lx(1), y + 30, {s:11, c:C.muted, a:"center"});
     tx(ctx, "4+", mx + mw + 110, y + 30, {s:11, c:C.muted, a:"right"});
     read.innerHTML = '<span>Tickets con ' + PR[A] + ' <b>' + nA + '</b></span><span>con ' + PR[B] + ' <b>' + nB + '</b></span><span>con los dos <b>' + nAB + '</b></span>' +
       '<span>Confianza ' + PR[A] + ' → ' + PR[B] + ' <b>' + pct(cAB, 0) + '</b></span><span>' + PR[B] + ' → ' + PR[A] + ' <b>' + pct(cBA, 0) + '</b></span><span>Lift <b>' + fmt(lift, 2) + '</b></span>' +
       '<span class="ldiag">' + (A === B ? "Elige dos productos distintos." :
         "Si fueran independientes, esperaríamos " + fmt(nA * nB / NT, 1) + " tickets con los dos; hay <b>" + nAB + "</b>. Lift = " + nAB + " / " + fmt(nA * nB / NT, 1) + " = <b>" + fmt(lift, 2) + "</b>, " +
         (lift > 1.15 ? "<b class='lgood'>▲ se compran juntos más de lo esperable</b>: candidato a promoción cruzada o a colocarlos cerca." : lift < 0.85 ? "<b class='lbad'>▼ se compran juntos menos de lo esperable</b>." : "prácticamente lo que daría el azar.") +
         " Es el mismo número para A → B que para B → A; la confianza, no.") + '</span>';
   }
   /* retícula */
   function combos(k){ var out = []; (function rec(st, cur){ if(cur.length === k){ out.push(cur.slice()); return; } for(var j = st; j < 8; j++){ cur.push(j); rec(j + 1, cur); cur.pop(); } })(0, []); return out; }
   var LV = [combos(1), combos(2), combos(3)];
   function drawLattice(){
     var freq = {}, status = [], counted = 0, pruned = 0, key = function(c){ return c.join(","); };
     LV.forEach(function(level, k){
       status.push(level.map(function(c){
         var subsOk = k === 0 || c.every(function(_, q){ var sub = c.slice(0, q).concat(c.slice(q + 1)); return freq[key(sub)]; });
         if(!subsOk){ pruned++; return {c:c, st:"pruned"}; }
         counted++; var n = cnt(c);
         if(n >= minsup){ freq[key(c)] = true; return {c:c, st:"freq", n:n}; }
         return {c:c, st:"infreq", n:n};
       }));
     });
     var chipH = function(o){
       var label = o.c.map(function(j){ return IC[j]; }).join(""), title = o.c.map(function(j){ return PR[j]; }).join(" + ");
       var base = "display:inline-flex;align-items:center;gap:5px;padding:4px 9px;margin:3px;border-radius:9px;font-size:13px;line-height:1.3;";
       if(o.st === "freq") return '<span title="' + title + '" style="' + base + 'background:' + hexA(C.c[0], 0.16) + ';border:1px solid ' + hexA(C.c[0], 0.75) + ';color:' + C.ink + '">' + label + ' <b style="font-size:11.5px">' + o.n + '</b></span>';
       if(o.st === "infreq") return '<span title="' + title + ' (contado: no llega)" style="' + base + 'background:' + hexA(C.muted, 0.08) + ';border:1px solid ' + hexA(C.muted, 0.5) + ';color:' + C.muted + ';text-decoration:line-through">' + label + ' <span style="font-size:11.5px">' + o.n + '</span></span>';
       return '<span title="' + title + ' (podado sin contar)" style="' + base + 'border:1px dashed ' + hexA(C.muted, 0.45) + ';opacity:.38;color:' + C.muted + '">' + label + '</span>';
     };
     var leg = '<div style="display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12.5px;color:' + C.text + ';margin:2px 0 10px">' + PR.map(function(p, j){ return '<span>' + IC[j] + ' ' + p + '</span>'; }).join("") + '</div>';
     var key2 = '<div style="display:flex;flex-wrap:wrap;gap:4px 14px;font-size:12px;color:' + C.muted + ';margin-bottom:6px">' +
       chipH({c:[0], st:"freq", n:"n"}).replace("🥖", "frecuente") + chipH({c:[0], st:"infreq", n:"n"}).replace("🥖", "contado, no llega") + chipH({c:[0], st:"pruned"}).replace("🥖", "podado sin contar") + '</div>';
     wrap2.innerHTML = '<div style="background:' + C.card + ';border:.5px solid ' + C.line + ';border-radius:16px;padding:16px 18px;box-shadow:var(--shadow-1)">' + leg + key2 +
       ["1 producto", "2 productos", "3 productos"].map(function(t, k){
         var f = status[k].filter(function(o){ return o.st === "freq"; }).length;
         return '<div style="margin-top:10px"><div class="lcl" style="margin-bottom:4px">' + t + ' · ' + LV[k].length + ' combinaciones · <span style="color:' + C.ink + '">' + f + ' frecuente' + (f === 1 ? '' : 's') + '</span></div><div>' + status[k].map(chipH).join("") + '</div></div>';
       }).join("") + '</div>';
     var total = LV[0].length + LV[1].length + LV[2].length;
     read.innerHTML = '<span>Soporte mínimo <b>' + minsup + ' tickets (' + pct(minsup / NT, 0) + ')</b></span><span>Combinaciones posibles <b>' + total + '</b></span><span>Contadas <b>' + counted + '</b></span><span>Podadas sin contar <b>' + pruned + '</b></span>' +
       '<span class="ldiag">Apriori solo cuenta una combinación si <b>todas</b> sus partes ya eran frecuentes. Con este umbral se ahorra contar el <b>' + pct(pruned / total, 0) + '</b> de las combinaciones de 1 a 3 productos. En un supermercado real, con miles de productos, ese ahorro es lo que hace posible el cálculo.</span>';
   }
   function draw(){ if(view === "rules") drawRules(); else drawLattice(); }
   ctlSeg(ctl, "Vista", [["rules", "Reglas A → B"], ["lat", "Retícula de itemsets"]], view, function(v){
     view = v; wrap1.style.display = v === "rules" ? "" : "none"; wrap2.style.display = v === "rules" ? "none" : "";
     var sw = stage.parentNode.querySelector(".labswipe"); if(sw) sw.style.visibility = v === "rules" ? "" : "hidden";
     ruleCtl.forEach(function(e){ e.style.display = v === "rules" ? "" : "none"; }); supCtl.style.display = v === "rules" ? "none" : ""; draw(); });
   var ruleCtl = [
     ctlSeg(ctl, "Antecedente A (si compra…)", PR.map(function(p, j){ return [j, IC[j] + " " + p]; }), A, function(v){ A = +v; draw(); }),
     ctlSeg(ctl, "Consecuente B (…¿compra también?)", PR.map(function(p, j){ return [j, IC[j] + " " + p]; }), B, function(v){ B = +v; draw(); })];
   var supCtl = ctlSlider(ctl, "Soporte mínimo (nº de tickets)", 1, 10, 1, minsup, function(v){ return v + " de 24 · " + pct(v / NT, 0); }, function(v){ minsup = v; draw(); }).input.parentNode;
   supCtl.style.display = "none";
   draw();
 }});

/* ── 8. FILTRADO COLABORATIVO: FACTORIZACIÓN MATRICIAL ───────── */
VIZ.push({id:"v-reco", model:"reco", g:"model", ic:"🍿", dim:"2D",
 t:"Rellenar los huecos: factorización de matrices",
 q:"¿Cómo adivina un recomendador la nota que darías a una serie que no has visto?",
 intro:"Notas (1-5) de 8 usuarios a 8 series; los <b>?</b> son series que no han visto. Pulsa <b>▶ Factorizar</b>: se ejecuta de verdad una factorización matricial con 2 factores latentes (descenso de gradiente con regularización). El modelo aprende <b>2 números por usuario</b> (sus gustos) y <b>2 por serie</b> (su «perfil»), y su producto rellena los huecos. A la derecha, ese espacio de gustos. <b>Haz clic en un usuario</b> para ver sus 3 recomendaciones.",
 notice:["Las celdas con borde discontinuo y número en cursiva son <b>predicciones</b>; las sólidas, notas reales. El modelo nunca ha visto los huecos: los deduce de usuarios con gustos parecidos.",
   "En el espacio latente, las series de acción y las de drama acaban en <b>zonas distintas</b>, y cada usuario se coloca cerca de lo que le gusta. Nadie le ha dicho al modelo qué es «acción»: lo descubre de las notas.",
   "El <b>RMSE</b> en las celdas conocidas baja con las iteraciones, pero la regularización impide que llegue a 0: así el modelo no memoriza y predice mejor los huecos."],
 models:["reco","contentbased","pca","apriori"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 420, K = makeCanvas(stage, W, H, "Matriz de valoraciones con huecos y espacio latente de usuarios y series"), ctx = K.ctx;
   var US = ["Ana", "Luis", "Marta", "Pablo", "Sara", "Jorge", "Elena", "Raúl"];
   var SE = ["Galaxia 9", "Código Rojo", "Fuga", "Titanes", "Cartas", "La Huerta", "Abril", "Velas"];
   var gen = [[1, 0], [0.9, 0.1], [1, 0.1], [0.85, 0], [0, 1], [0.1, 0.9], [0.05, 1], [0.15, 0.85]]; /* acción, drama */
   var pref = [[1, 0.1], [0.9, 0.2], [0.1, 1], [0.2, 0.9], [0.8, 0.7], [1, 0], [0, 0.95], [0.55, 0.5]];
   var r = mulberry(8), R = [], M = [];
   for(var u = 0; u < 8; u++){ R.push([]); for(var i = 0; i < 8; i++){ var v = 1 + 4 * (pref[u][0] * gen[i][0] + pref[u][1] * gen[i][1]) / 1.1 + 0.35 * gauss(r); R[u].push(Math.max(1, Math.min(5, Math.round(v)))); } }
   var HOLES = [[1, 4, 6], [2, 5, 7], [0, 3, 6], [1, 2, 5, 7], [0, 6, 7], [3, 4, 6], [1, 3, 4], [0, 2, 5]];
   for(u = 0; u < 8; u++){ M.push([]); for(i = 0; i < 8; i++) M[u].push(HOLES[u].indexOf(i) < 0); }
   var mu = 0, nk = 0; for(u = 0; u < 8; u++) for(i = 0; i < 8; i++) if(M[u][i]){ mu += R[u][i]; nk++; } mu /= nk;
   var Pu, Qi, it, hist, sel = 0, anim, MAXI = 400, lam = 0.06, lr = 0.06;
   function reset(){ var g = mulberry(3); Pu = []; Qi = []; for(var q = 0; q < 8; q++){ Pu.push([0.1 * gauss(g), 0.1 * gauss(g)]); Qi.push([0.1 * gauss(g), 0.1 * gauss(g)]); } it = 0; hist = []; }
   var pred = function(u, i){ return mu + Pu[u][0] * Qi[i][0] + Pu[u][1] * Qi[i][1]; };
   function rmse(){ var s = 0; for(var u = 0; u < 8; u++) for(var i = 0; i < 8; i++) if(M[u][i]){ var e = R[u][i] - pred(u, i); s += e * e; } return Math.sqrt(s / nk); }
   function step(){ /* descenso de gradiente por lotes con regularización L2 */
     var gP = Pu.map(function(){ return [0, 0]; }), gQ = Qi.map(function(){ return [0, 0]; });
     for(var u = 0; u < 8; u++) for(var i = 0; i < 8; i++) if(M[u][i]){
       var e = R[u][i] - pred(u, i);
       for(var f = 0; f < 2; f++){ gP[u][f] += -e * Qi[i][f]; gQ[i][f] += -e * Pu[u][f]; }
     }
     for(u = 0; u < 8; u++) for(var f2 = 0; f2 < 2; f2++){ Pu[u][f2] -= lr * (gP[u][f2] + lam * Pu[u][f2]); Qi[u][f2] -= lr * (gQ[u][f2] + lam * Qi[u][f2]); }
     it++; hist.push(rmse());
   }
   var hx = 112, hy = 96, cw = 40, ch = 34;
   function recs(u){ return HOLES[u].map(function(i){ return [i, pred(u, i)]; }).sort(function(a, b){ return b[1] - a[1]; }).slice(0, 3); }
   function draw(){
     K.clear();
     var shown = it > 0;
     cap(ctx, "Notas de 1 a 5", 16, 20, C);
     tx(ctx, "← acción", hx + 2, hy - 74, {s:11, c:C.muted}); tx(ctx, "drama →", hx + 8 * cw, hy - 74, {s:11, c:C.muted, a:"right"});
     seg(ctx, hx + 4 * cw, hy - 84, hx + 4 * cw, hy - 4, hexA(C.line, 1), 1, [2, 3]);
     /* cabeceras de columna giradas */
     SE.forEach(function(s, i){ ctx.save(); ctx.translate(hx + i * cw + cw / 2 + 4, hy - 8); ctx.rotate(-Math.PI / 4); tx(ctx, s, 0, 0, {s:12, c:C.text}); ctx.restore(); });
     var rc = shown ? recs(sel).map(function(x){ return x[0]; }) : [];
     US.forEach(function(name, u){
       var y = hy + u * ch;
       if(u === sel){ ctx.fillStyle = hexA(C.c[0], 0.08); rrect(ctx, 8, y + 1, hx + 8 * cw - 2, ch - 2, 6); ctx.fill(); }
       tx(ctx, name, hx - 10, y + ch / 2 + 4, {s:12.5, w:u === sel ? 700 : 500, c:C.ink, a:"right"});
       for(var i = 0; i < 8; i++){
         var x = hx + i * cw, known = M[u][i], val = known ? R[u][i] : pred(u, i);
         var cx = x + 3, cy = y + 3, w = cw - 6, h = ch - 6;
         if(known){
           ctx.fillStyle = hexA(C.c[0], 0.1 + 0.8 * (val - 1) / 4); rrect(ctx, cx, cy, w, h, 6); ctx.fill();
           tx(ctx, String(val), x + cw / 2, y + ch / 2 + 5, {s:13, w:700, c:val >= 4 ? C.card : C.ink, a:"center"});
         } else if(!shown){
           rrect(ctx, cx, cy, w, h, 6); stroke(ctx, hexA(C.muted, 0.6), 1, [3, 3]);
           tx(ctx, "?", x + cw / 2, y + ch / 2 + 5, {s:13, w:600, c:C.muted, a:"center"});
         } else {
           var vv = Math.max(1, Math.min(5, val));
           ctx.fillStyle = hexA(C.c[0], 0.05 + 0.4 * (vv - 1) / 4); rrect(ctx, cx, cy, w, h, 6); ctx.fill();
           rrect(ctx, cx, cy, w, h, 6); stroke(ctx, hexA(C.c[0], 0.85), 1.3, [3, 3]);
           tx(ctx, fmt(vv, 1), x + cw / 2, y + ch / 2 + 5, {s:12, w:600, it:true, c:C.ink, a:"center"});
           if(u === sel && rc.indexOf(i) > -1){ rrect(ctx, cx - 2, cy - 2, w + 4, h + 4, 8); stroke(ctx, C.c[1], 2.2); }
         }
       }
     });
     var ly0 = hy + 8 * ch + 12;
     ctx.fillStyle = hexA(C.c[0], 0.55); rrect(ctx, hx, ly0, 14, 12, 3); ctx.fill(); tx(ctx, "nota real", hx + 20, ly0 + 10, {s:11, c:C.muted});
     rrect(ctx, hx + 90, ly0, 14, 12, 3); stroke(ctx, hexA(C.c[0], 0.85), 1.2, [3, 2]); tx(ctx, "predicción", hx + 110, ly0 + 10, {s:11, c:C.muted, it:true});
     if(shown){ rrect(ctx, hx + 196, ly0, 14, 12, 3); stroke(ctx, C.c[1], 2); tx(ctx, "recomendadas a " + US[sel], hx + 216, ly0 + 10, {s:11, c:C.ink, w:600}); }
     /* espacio latente */
     var lb = [478, 34, 264, 270];
     cap(ctx, "Espacio latente (2 factores)", lb[0], 20, C);
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(lb[0] + .5, lb[1] + .5, lb[2], lb[3]);
     var all = Pu.concat(Qi), m = 0.3; all.forEach(function(p){ m = Math.max(m, Math.abs(p[0]), Math.abs(p[1])); });
     var lx = function(v){ return lb[0] + lb[2] / 2 + v / (m * 1.25) * lb[2] / 2; }, ly = function(v){ return lb[1] + lb[3] / 2 - v / (m * 1.25) * lb[3] / 2; };
     seg(ctx, lb[0], ly(0), lb[0] + lb[2], ly(0), hexA(C.line, 1), 1); seg(ctx, lx(0), lb[1], lx(0), lb[1] + lb[3], hexA(C.line, 1), 1);
     ctx.save(); ctx.beginPath(); ctx.rect(lb[0], lb[1], lb[2], lb[3]); ctx.clip();
     var labs = [];
     Qi.forEach(function(q, i){ mark(ctx, 1, lx(q[0]), ly(q[1]), 5, C.c[1], C.card, 1); labs.push({x:lx(q[0]), y:ly(q[1]), text:SE[i], s:11, c:C.text}); });
     Pu.forEach(function(p, u){ dot(ctx, lx(p[0]), ly(p[1]), u === sel ? 7 : 5, C.c[0], u === sel ? C.ink : C.card); labs.push({x:lx(p[0]), y:ly(p[1]), text:US[u], s:11, w:u === sel ? 700 : 600, c:C.ink}); });
     ctx.restore();
     placeLabels(ctx, labs, lb);
     dot(ctx, lb[0] + 8, lb[1] + lb[3] + 16, 4.5, C.c[0]); tx(ctx, "usuario", lb[0] + 16, lb[1] + lb[3] + 20, {s:11, c:C.muted});
     mark(ctx, 1, lb[0] + 80, lb[1] + lb[3] + 16, 4.5, C.c[1]); tx(ctx, "serie", lb[0] + 88, lb[1] + lb[3] + 20, {s:11, c:C.muted});
     /* RMSE */
     var gb = [lb[0] + 30, 346, lb[2] - 30, 54];
     cap(ctx, "RMSE en celdas conocidas", lb[0], 336, C);
     ctx.strokeStyle = C.line; ctx.strokeRect(gb[0] + .5, gb[1] + .5, gb[2], gb[3]);
     if(hist.length > 1){
       var hm = Math.max.apply(null, hist);
       pathXY(ctx, hist.map(function(_, q){ return gb[0] + q / (MAXI - 1) * gb[2]; }), hist.map(function(v){ return gb[1] + gb[3] - v / hm * gb[3]; })); stroke(ctx, C.c[0], 2);
       tx(ctx, fmt(hm, 1), gb[0] - 4, gb[1] + 10, {s:11, c:C.muted, a:"right"}); tx(ctx, "0", gb[0] - 4, gb[1] + gb[3], {s:11, c:C.muted, a:"right"});
     }
     /* lectura */
     var rr = shown ? recs(sel) : [];
     read.innerHTML = '<span>Iteración <b>' + it + ' / ' + MAXI + '</b></span><span>RMSE (celdas conocidas) <b>' + (hist.length ? fmt(hist[hist.length - 1], 3) : "—") + '</b></span><span>Usuario <b>' + US[sel] + '</b></span>' +
       '<span class="ldiag">' + (shown ? "Recomendaciones para <b>" + US[sel] + "</b>: " + rr.map(function(x, q){ var v = Math.max(1, Math.min(5, x[1])); return (q + 1) + ". <b>" + SE[x[0]] + "</b> (" + fmt(v, 1) + (v >= 3.5 ? " ✓ le encajará" : v < 3 ? " ✗ poco probable" : " · quizá") + ")"; }).join(" · ") +
         ". El RMSE dice que, en las notas que sí conocemos, el modelo se equivoca de media unas " + fmt(hist[hist.length - 1], 2) + " estrellas." : "Pulsa <b>▶ Factorizar</b>: verás cómo los <b>?</b> se convierten en predicciones mientras el error baja.") + '</span>';
   }
   anim = animator(function(){
     for(var s = 0; s < 2 && it < MAXI; s++) step();
     draw();
     if(it >= MAXI){ pb.innerHTML = "↺ Repetir"; return false; }
   });
   var pb = ctlBtn(ctl, "▶ Factorizar", function(){
     if(anim.on){ anim.stop(); pb.innerHTML = "▶ Seguir"; return; }
     if(it >= MAXI){ reset(); }
     pb.innerHTML = "⏸ Pausa"; anim.start();
   }, true);
   ctlBtn(ctl, "↺ Empezar de nuevo", function(){ anim.stop(); reset(); pb.innerHTML = "▶ Factorizar"; draw(); });
   ctlSlider(ctl, "Regularización λ", 0, 0.5, 0.01, lam, function(v){ return fmt(v); }, function(v){ lam = v; if(it >= MAXI || !anim.on){ reset(); for(var q = 0; q < MAXI; q++) step(); pb.innerHTML = "↺ Repetir"; draw(); } });
   K.cv.addEventListener("click", function(e){
     var p = K.pos(e), b = -1;
     if(p[0] < hx + 8 * cw && p[1] > hy && p[1] < hy + 8 * ch) b = Math.floor((p[1] - hy) / ch);
     else {
       var all = Pu.concat(Qi), m = 0.3; all.forEach(function(q){ m = Math.max(m, Math.abs(q[0]), Math.abs(q[1])); });
       var bd = 16; Pu.forEach(function(q, u){ var d = Math.hypot(478 + 132 + q[0] / (m * 1.25) * 132 - p[0], 34 + 135 - q[1] / (m * 1.25) * 135 - p[1]); if(d < bd){ bd = d; b = u; } });
     }
     if(b >= 0){ sel = b; draw(); }
   });
   K.cv.style.cursor = "pointer";
   reset(); draw();
   return function(){ anim.stop(); };
 }});

/* ── 9. RECOMENDADOR BASADO EN CONTENIDO (TF-IDF + COSENO) ──── */
VIZ.push({id:"v-contentbased", model:"contentbased", g:"model", ic:"🎬", dim:"2D",
 t:"Parecidas por lo que cuentan (TF-IDF y coseno)",
 q:"¿Cómo decide un recomendador que dos películas se parecen solo leyendo su sinopsis?",
 intro:"10 películas inventadas con su sinopsis. Cada sinopsis se convierte en un vector <b>TF-IDF</b> (cuánto pesa cada palabra: mucho si es frecuente en esa sinopsis y rara en las demás) y se compara con las otras con la <b>similitud del coseno</b> (el ángulo entre vectores). Todo se calcula de verdad. Elige una película (o haz clic en una barra).",
 notice:["Las palabras de <b>mayor peso</b> son las raras y específicas («espacial», «detective»); las que salen en casi todas las sinopsis pesan poco aunque se repitan.",
   "En el plano, flechas que apuntan en direcciones <b>parecidas</b> = películas parecidas. Es una proyección 2D aproximada (PCA) de vectores con muchas más dimensiones: el ángulo real es el de las barras.",
   "Caso trampa: <b>Boda en Sevilla</b> (comedia) y <b>El velo negro</b> (drama oscuro) comparten «boda», «familiar», «Sevilla» y «novia», así que salen muy similares aunque el <b>tono</b> no tenga nada que ver. TF-IDF mide palabras, no intenciones."],
 models:["contentbased","reco","knn","pca"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 420, K = makeCanvas(stage, W, H, "Similitud del coseno entre sinopsis y flechas TF-IDF proyectadas"), ctx = K.ctx;
   var F = [
     ["Órbita roja", "Una astronauta queda atrapada en una estación espacial y lucha por volver a la Tierra mientras falla el oxígeno."],
     ["Planeta silencio", "Una tripulación espacial explora un planeta helado y descubre una señal que amenaza la nave y la Tierra."],
     ["La última misión", "Un piloto veterano acepta una misión espacial imposible para salvar la estación y a su tripulación."],
     ["Boda en Sevilla", "Una boda familiar en Sevilla se convierte en un caos divertido cuando la novia invita a su ex. Risas y enredos."],
     ["El velo negro", "Una boda familiar en Sevilla termina en tragedia: la novia desaparece y la familia guarda un secreto oscuro."],
     ["Cocina de abuela", "Una chef recupera las recetas de su abuela y abre un restaurante familiar en un pueblo. Comedia tierna y divertida."],
     ["Risas en la oficina", "Unos compañeros de oficina organizan una fiesta sorpresa para su jefa que acaba en enredos y muchas risas."],
     ["Sombras del puerto", "Una detective investiga una desaparición en el puerto y descubre un secreto oscuro que implica a su familia."],
     ["Caso cerrado", "Un detective retirado reabre un caso de desaparición y persigue a un asesino que guarda un secreto."],
     ["Mareas", "Un pescador y su hija luchan por salvar el negocio familiar mientras el pueblo cambia. Drama sobre familia y tradición."]];
   var STOP = "una un unos unas en y la el las los a de del al se que su sus por para con mientras cuando sobre es lo le ex".split(" ");
   var norm = function(w){ return w.normalize("NFD").replace(/[̀-ͯ]/g, ""); };
   var surface = {}, docs = F.map(function(f){
     return f[1].toLowerCase().replace(/[.,:;«»]/g, " ").split(/\s+/).filter(function(w){ return w && STOP.indexOf(norm(w)) < 0; })
       .map(function(w){ var k = norm(w); if(!surface[k]) surface[k] = w; return k; });
   });
   var vocab = []; docs.forEach(function(d){ d.forEach(function(w){ if(vocab.indexOf(w) < 0) vocab.push(w); }); });
   var N = F.length, V = vocab.length;
   var df = vocab.map(function(w){ return docs.filter(function(d){ return d.indexOf(w) > -1; }).length; });
   var idf = df.map(function(x){ return Math.log((1 + N) / (1 + x)) + 1; }); /* como scikit-learn (smooth_idf) */
   var X = docs.map(function(d){
     var v = vocab.map(function(w, j){ return d.filter(function(x){ return x === w; }).length * idf[j]; });
     var nr = Math.sqrt(sum(v.map(function(x){ return x * x; }))); return v.map(function(x){ return x / nr; });
   });
   var cos = function(a, b){ var s = 0; for(var j = 0; j < V; j++) s += X[a][j] * X[b][j]; return s; };
   /* proyección 2D sin centrar (vía la matriz de Gram 10×10) para que las flechas salgan del origen */
   var G = X.map(function(_, a){ return X.map(function(_, b){ return cos(a, b); }); });
   var EG = jacobiEig(G).sort(function(a, b){ return b.val - a.val; });
   var P2 = X.map(function(_, a){ return [EG[0].vec[a] * Math.sqrt(EG[0].val), EG[1].vec[a] * Math.sqrt(EG[1].val)]; });
   if(sum(P2.map(function(p){ return p[0]; })) < 0) P2 = P2.map(function(p){ return [-p[0], p[1]]; });
   var sel = 3;
   var bx0 = 16, by0 = 56, bw = 360, rowh = 31;
   var pb = [426, 40, 318, 340];
   var order = function(){ return F.map(function(_, b){ return b; }).filter(function(b){ return b !== sel; }).sort(function(a, b){ return cos(sel, b) - cos(sel, a); }); };
   function topWords(a, k){ return vocab.map(function(w, j){ return [w, X[a][j]]; }).filter(function(x){ return x[1] > 0; }).sort(function(p, q){ return q[1] - p[1]; }).slice(0, k); }
   function draw(){
     K.clear();
     var ord = order(), best = ord[0];
     cap(ctx, "Similitud con «" + F[sel][0] + "»", bx0, 22, C);
     tx(ctx, "coseno: 0 = nada en común · 1 = mismas palabras y pesos", bx0, 40, {s:11, c:C.muted});
     ord.forEach(function(b, q){
       var y = by0 + q * rowh, v = cos(sel, b), top = q < 5;
       tx(ctx, F[b][0], bx0, y + 15, {s:12, w:top ? 700 : 400, c:top ? C.ink : C.muted});
       ctx.fillStyle = hexA(C.line, 0.9); rrect(ctx, bx0 + 138, y + 5, bw - 186, 12, 6); ctx.fill();
       ctx.fillStyle = top ? C.c[0] : hexA(C.c[0], 0.35); rrect(ctx, bx0 + 138, y + 5, Math.max(4, (bw - 186) * v), 12, 6); ctx.fill();
       tx(ctx, fmt(v, 2), bx0 + bw, y + 15, {s:12, w:700, c:top ? C.ink : C.muted, a:"right"});
       if((sel === 3 && b === 4) || (sel === 4 && b === 3)) tx(ctx, "⚠ trampa", bx0 + 138 + (bw - 186) * v + 8, y + 15, {s:11, w:700, c:C.c[4]});
     });
     tx(ctx, "en negrita: top-5 recomendadas", bx0, by0 + 9 * rowh + 14, {s:11, c:C.muted});
     /* plano con flechas */
     cap(ctx, "Flechas TF-IDF (proyección 2D)", pb[0], 22, C);
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(pb[0] + .5, pb[1] + .5, pb[2], pb[3]);
     var mx = 1e-9, y0 = 0, y1 = 0; P2.forEach(function(p){ mx = Math.max(mx, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
     var sc = Math.min((pb[2] - 130) / mx, (pb[3] - 56) / (y1 - y0 || 1)), o = [pb[0] + 30, pb[1] + 28 + y1 * sc];
     var X0 = function(p){ return o[0] + p[0] * sc; }, Y0 = function(p){ return o[1] - p[1] * sc; };
     seg(ctx, pb[0], o[1], pb[0] + pb[2], o[1], hexA(C.line, 1), 1); seg(ctx, o[0], pb[1], o[0], pb[1] + pb[3], hexA(C.line, 1), 1);
     var labs = [];
     ord.slice().reverse().forEach(function(b){
       var top = ord.indexOf(b) < 5;
       arrow(ctx, o[0], o[1], X0(P2[b]), Y0(P2[b]), top ? hexA(C.c[0], 0.75) : hexA(C.muted, 0.45), top ? 1.8 : 1.2, 7);
     });
     arrow(ctx, o[0], o[1], X0(P2[sel]), Y0(P2[sel]), C.c[1], 3, 10);
     /* ángulo entre la elegida y la más parecida */
     var a1 = Math.atan2(-(Y0(P2[sel]) - o[1]), X0(P2[sel]) - o[0]), a2 = Math.atan2(-(Y0(P2[best]) - o[1]), X0(P2[best]) - o[0]);
     ctx.beginPath(); ctx.arc(o[0], o[1], 26, -Math.max(a1, a2), -Math.min(a1, a2)); stroke(ctx, C.c[1], 1.6);
     F.forEach(function(f, b){ labs.push({x:X0(P2[b]), y:Y0(P2[b]), text:f[0], s:11, w:b === sel ? 700 : ord.indexOf(b) < 5 ? 600 : 400, c:b === sel ? C.ink : ord.indexOf(b) < 5 ? C.text : C.muted}); });
     placeLabels(ctx, labs.map(function(l){ l.halo = C.card; return l; }), pb);
     /* lectura: palabras de mayor peso */
     var tw = topWords(sel, 6), tb = topWords(best, 6), shared = tw.map(function(x){ return x[0]; }).filter(function(w){ return X[best][vocab.indexOf(w)] > 0; });
     var ch = function(list){ return list.map(function(x){ var sh = shared.indexOf(x[0]) > -1 || (X[sel][vocab.indexOf(x[0])] > 0 && X[best][vocab.indexOf(x[0])] > 0); return chip(surface[x[0]] + " " + fmt(x[1], 2), sh ? C.c[1] : C.c[0], C, sh); }).join(""); };
     var trap = sel === 3 || sel === 4;
     read.innerHTML = '<span style="flex-basis:100%"><b>' + F[sel][0] + '</b>: «' + F[sel][1] + '»</span>' +
       '<span style="flex-basis:100%">Palabras con más peso: ' + ch(tw) + '</span>' +
       '<span style="flex-basis:100%">Más parecida, <b>' + F[best][0] + '</b> (coseno ' + fmt(cos(sel, best), 2) + '): ' + ch(tb) + '</span>' +
       '<span class="ldiag">' + (trap ? "<b class='lwarn'>⚠ Caso trampa</b>: comparten «boda», «familiar», «Sevilla» y «novia», pero una es una comedia de enredos y la otra un drama con desaparición. A un fan de la comedia le recomendaríamos un drama oscuro. Solución en la práctica: añadir género y tono como variables, o usar <i>embeddings</i> que capten el sentido de la frase." :
         "Las palabras resaltadas (borde naranja) aparecen en las dos sinopsis: son las que empujan la similitud hacia arriba. Una palabra que sale en casi todas tendría un IDF bajo y apenas contaría.") + '</span>';
   }
   ctlSeg(ctl, "Película elegida", F.map(function(f, b){ return [b, f[0]]; }), sel, function(v){ sel = +v; draw(); });
   K.cv.addEventListener("click", function(e){
     var p = K.pos(e);
     if(p[0] < bx0 + bw && p[1] > by0 && p[1] < by0 + 9 * rowh){ var q = Math.floor((p[1] - by0) / rowh), b = order()[q];
       sel = b; [].forEach.call(ctl.querySelectorAll(".segs button"), function(x){ var on = +x.dataset.v === sel; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on); }); draw(); }
   });
   K.cv.style.cursor = "pointer";
   draw();
 }});

/* ── 10. TOPIC MODELING: LDA CON MUESTREO DE GIBBS ───────────── */
VIZ.push({id:"v-topic", model:"topic", g:"model", ic:"🏷️", dim:"2D",
 t:"LDA: temas que emergen de las reseñas",
 q:"¿Cómo descubre LDA de qué hablan unas reseñas sin que nadie le diga los temas?",
 intro:"24 reseñas cortas de una tienda online. LDA supone que cada reseña es una <b>mezcla de temas</b> y cada tema, una <b>bolsa de palabras</b> con distintas probabilidades. Aquí se ejecuta de verdad con <b>muestreo de Gibbs colapsado</b>: cada palabra empieza con un tema al azar y, en cada iteración, se reasigna según lo que «dicen» su reseña y el resto de reseñas. Pulsa ▶ y haz clic en una reseña.",
 notice:["Al principio las barras de cada reseña son un <b>revoltijo</b> de colores; tras unas decenas de iteraciones casi todas quedan dominadas por un solo tema, y las reseñas mixtas («buen precio pero llegó tarde») conservan dos colores.",
   "Los temas no tienen nombre: el modelo solo da <b>listas de palabras</b>. Que uno sea «envío», otro «precio» y otro «atención al cliente» lo decides tú leyendo sus palabras top.",
   "Con 2 temas, dos de los asuntos reales se funden; con 4, uno se parte en dos o aparece un tema «cajón de sastre». Elegir el nº de temas es, como en clustering, una decisión con criterio de negocio."],
 models:["topic","contentbased","nb","gmm"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 420, K = makeCanvas(stage, W, H, "Mezcla de temas por reseña y palabras más probables de cada tema"), ctx = K.ctx;
   var REV = [
     "El paquete llegó tarde, con tres días de retraso, y el mensajero ni avisó.",
     "Envío rápido: la caja llegó en dos días y bien protegida.",
     "La entrega se retrasó una semana; el seguimiento del paquete no funcionaba.",
     "El mensajero dejó la caja abierta y el paquete llegó tarde.",
     "Entrega rapidísima, menos de dos días. Envío impecable.",
     "Retraso tras retraso: el envío tardó días y nadie sabía dónde estaba el paquete.",
     "La caja llegó aplastada y la entrega fue tarde.",
     "Buen precio, pero el envío tardó días y el paquete llegó con retraso.",
     "Precio caro para la calidad que tiene. No vale lo que cuesta.",
     "Muy barato y con descuento: calidad sorprendente por ese precio.",
     "Aproveché la oferta, buen descuento; merece la pena por el precio.",
     "Demasiado caro. En otras tiendas el mismo producto tiene mejor precio.",
     "Calidad baja; ni con la oferta vale el dinero que pagué.",
     "Precio justo y buena calidad. Un descuento más y sería perfecto.",
     "Barato, buena oferta, pero la calidad del material deja que desear.",
     "La atención fue amable, pero el producto es caro para su calidad.",
     "Atención al cliente excelente: respuesta rápida y muy amable.",
     "Tuve un problema con la devolución y el servicio de atención no daba respuesta.",
     "El chat de atención al cliente resolvió mi problema en minutos. Trato amable.",
     "Pedí una devolución y el servicio fue lento; nadie daba una solución.",
     "Servicio de atención impecable, trato cercano y solución inmediata.",
     "El chat no daba respuesta y el problema con el cliente sigue sin solución.",
     "Me atendieron con un trato amable y la devolución fue sencilla.",
     "La devolución tardó días, pero la atención del servicio fue amable."];
   var VOC = ["paquete", "llegó", "tarde", "días", "retraso", "mensajero", "envío", "caja", "entrega", "rápido",
              "precio", "caro", "barato", "oferta", "descuento", "calidad", "dinero", "vale", "pena", "tiendas",
              "atención", "cliente", "servicio", "amable", "respuesta", "devolución", "chat", "problema", "solución", "trato"];
   var ALIAS = {"retrasó":"retraso", "rapidísima":"rápido", "rápida":"rápido", "tardó":"tarde", "atendieron":"atención", "cuesta":"precio", "pagué":"dinero"};
   var norm = function(w){ return w.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); };
   var VN = VOC.map(norm);
   /* cada reseña: lista de piezas {txt, w (índice de vocabulario o -1)} */
   var D = REV.map(function(s){ return s.split(/(\s+)/).map(function(piece){
     var core = piece.replace(/[.,:;]/g, ""), k = norm(core), al = ALIAS[core.toLowerCase()];
     var w = VN.indexOf(al ? norm(al) : k), m = piece.match(/^(.*?)([.,:;]*)$/); return {txt:m[1], tail:m[2], w:w};
   }); });
   var docs = D.map(function(d){ return d.filter(function(p){ return p.w >= 0; }).map(function(p){ return p.w; }); });
   var V = VOC.length, ND = docs.length, Kt = 3, alpha = 0.3, beta = 0.05, Z, ndk, nkw, nk, it, seed = 1, sel = 7, timer = null, MAXI = 150;
   function reset(){
     var rg = mulberry(seed * 977); Z = []; ndk = []; nkw = []; nk = new Array(Kt).fill(0);
     for(var k = 0; k < Kt; k++) nkw.push(new Array(V).fill(0));
     docs.forEach(function(d, i){ ndk.push(new Array(Kt).fill(0)); Z.push(d.map(function(w){ var k = Math.floor(rg() * Kt); ndk[i][k]++; nkw[k][w]++; nk[k]++; return k; })); });
     it = 0; rgS = mulberry(seed * 31 + 7);
   }
   var rgS;
   function sweep(){
     var p = new Array(Kt);
     docs.forEach(function(d, i){ d.forEach(function(w, q){
       var k = Z[i][q]; ndk[i][k]--; nkw[k][w]--; nk[k]--;
       var tot = 0; for(var t = 0; t < Kt; t++){ p[t] = (ndk[i][t] + alpha) * (nkw[t][w] + beta) / (nk[t] + V * beta); tot += p[t]; }
       var u = rgS() * tot, acc = 0, nkk = Kt - 1; for(t = 0; t < Kt; t++){ acc += p[t]; if(u <= acc){ nkk = t; break; } }
       Z[i][q] = nkk; ndk[i][nkk]++; nkw[nkk][w]++; nk[nkk]++;
     }); });
     it++;
   }
   var theta = function(i){ var n = docs[i].length; return ndk[i].map(function(c){ return (c + alpha) / (n + Kt * alpha); }); };
   var phi = function(k){ return nkw[k].map(function(c){ return (c + beta) / (nk[k] + V * beta); }); };
   function topw(k, m){ var f = phi(k); return f.map(function(v, w){ return [w, v]; }).sort(function(a, b){ return b[1] - a[1]; }).slice(0, m); }
   var CL = [C.c[1], C.c[2], C.c[0], C.c[4]];
   var bx = 44, bw = 28, by = 44, bh = 150;
   function draw(){
     K.clear();
     cap(ctx, "Mezcla de temas de cada reseña", bx - 28, 22, C);
     for(var i = 0; i < ND; i++){
       var th = theta(i), y = by + bh, x = bx + i * bw;
       if(i === sel){ ctx.fillStyle = hexA(C.ink, 0.08); rrect(ctx, x - 2, by - 6, bw, bh + 30, 6); ctx.fill(); }
       for(var k = 0; k < Kt; k++){ var hgt = th[k] * bh; ctx.fillStyle = CL[k]; ctx.fillRect(x + 2, y - hgt, bw - 8, hgt); y -= hgt; }
       tx(ctx, String(i + 1), x + bw / 2 - 2, by + bh + 16, {s:11, w:i === sel ? 700 : 400, c:i === sel ? C.ink : C.muted, a:"center"});
     }
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; seg(ctx, bx - 4, by + bh + .5, bx + ND * bw - 2, by + bh + .5, C.line, 1);
     tx(ctx, "100%", bx - 8, by + 9, {s:11, c:C.muted, a:"right"}); tx(ctx, "0", bx - 8, by + bh, {s:11, c:C.muted, a:"right"});
     tx(ctx, "reseña nº (clic para leerla)", bx + ND * bw - 2, by + bh + 32, {s:11, c:C.muted, a:"right"});
     /* palabras top por tema */
     var cw = (W - 2 * 16 - (Kt - 1) * 14) / Kt, ty = 252;
     for(k = 0; k < Kt; k++){
       var x0 = 16 + k * (cw + 14), tw = topw(k, 6), mx = tw[0][1];
       ctx.fillStyle = CL[k]; rrect(ctx, x0, ty - 12, 12, 12, 3); ctx.fill();
       tx(ctx, "Tema " + (k + 1), x0 + 18, ty - 1, {s:12.5, w:700, c:C.ink});
       tx(ctx, Math.round(nk[k]) + " palabras", x0 + cw, ty - 1, {s:11, c:C.muted, a:"right"});
       tw.forEach(function(p, q){
         var yy = ty + 14 + q * 24;
         tx(ctx, VOC[p[0]], x0, yy + 11, {s:12, c:C.text});
         ctx.fillStyle = hexA(CL[k], 0.2); rrect(ctx, x0 + 82, yy + 2, cw - 120, 11, 4); ctx.fill();
         ctx.fillStyle = CL[k]; rrect(ctx, x0 + 82, yy + 2, Math.max(3, (cw - 120) * p[1] / mx), 11, 4); ctx.fill();
         tx(ctx, pct(p[1], 0), x0 + cw, yy + 11, {s:11, w:600, c:C.ink, a:"right"});
       });
     }
     /* lectura: la reseña coloreada */
     var q = 0, html = D[sel].map(function(p){
       if(p.w < 0) return p.txt + p.tail;
       var k = Z[sel][q++];
       return '<span style="background:' + hexA(CL[k], 0.22) + ';border-bottom:2px solid ' + CL[k] + ';border-radius:3px;padding:0 2px">' + p.txt + '<sub style="font-size:10px;color:' + C.muted + '">' + (k + 1) + '</sub></span>' + p.tail;
     }).join("");
     var th2 = theta(sel);
     read.innerHTML = '<span>Iteración <b>' + it + ' / ' + MAXI + '</b></span><span>Temas <b>' + Kt + '</b></span>' +
       '<span>Reseña ' + (sel + 1) + ' <b>' + th2.map(function(v, k){ return "T" + (k + 1) + " " + pct(v, 0); }).join(" · ") + '</b></span>' +
       '<span style="flex-basis:100%;font-size:15px;line-height:1.9">«' + html + '»</span>' +
       '<span class="ldiag">' + (it === 0 ? "Ahora cada palabra tiene un tema <b>al azar</b> (el subíndice). Pulsa ▶: en cada iteración, cada palabra se reasigna al tema que más abunda en su reseña y en el que esa palabra es más típica." :
         "Palabras top: " + Array.apply(null, {length:Kt}).map(function(_, k){ return "<b>T" + (k + 1) + "</b> " + topw(k, 3).map(function(p){ return VOC[p[0]]; }).join(", "); }).join(" · ") + ". Ponerles nombre (envío, precio, atención) es trabajo tuyo.") + '</span>';
   }
   function run(){
     clearInterval(timer); if(it >= MAXI){ seed++; reset(); }
     pbtn.innerHTML = "⏸ Pausa";
     timer = setInterval(function(){ sweep(); draw(); if(it >= MAXI){ clearInterval(timer); pbtn.innerHTML = "▶ Iterar"; } }, it < 40 ? 90 : 60);
   }
   var pbtn = ctlBtn(ctl, "▶ Iterar", function(){ if(pbtn.innerHTML.indexOf("Pausa") > -1){ clearInterval(timer); pbtn.innerHTML = "▶ Iterar"; } else run(); }, true);
   ctlBtn(ctl, "⏭ Una iteración", function(){ clearInterval(timer); pbtn.innerHTML = "▶ Iterar"; sweep(); draw(); });
   ctlBtn(ctl, "↺ Reiniciar al azar", function(){ clearInterval(timer); pbtn.innerHTML = "▶ Iterar"; seed++; reset(); draw(); });
   ctlSeg(ctl, "Nº de temas", [[2, "2"], [3, "3"], [4, "4"]], Kt, function(v){ clearInterval(timer); pbtn.innerHTML = "▶ Iterar"; Kt = +v; reset(); draw(); });
   K.cv.addEventListener("click", function(e){
     var p = K.pos(e); if(p[1] > by - 8 && p[1] < by + bh + 22 && p[0] > bx - 2 && p[0] < bx + ND * bw){ sel = Math.max(0, Math.min(ND - 1, Math.floor((p[0] - bx + 2) / bw))); draw(); }
   });
   K.cv.style.cursor = "pointer";
   reset(); draw();
   return function(){ clearInterval(timer); };
 }});

/* ── 11. ARIMA: SIMULADOR ARMA CON ACF Y PACF ────────────────── */
VIZ.push({id:"v-arima", model:"arima", g:"model", ic:"〰️", dim:"2D",
 t:"La huella de un ARIMA: ACF y PACF",
 q:"¿Cómo se reconoce en la ACF y la PACF si una serie es AR, MA o necesita diferenciarse?",
 intro:"Genera una serie con un proceso <b>ARMA</b>: φ (parte AR) dice cuánto se parece cada valor al anterior; θ (parte MA) cuánto arrastra el «golpe» aleatorio de ayer. Con <b>d = 1</b> se integra (suma acumulada): un paseo aleatorio con tendencia. Abajo, la <b>ACF</b> (correlación con el retardo k) y la <b>PACF</b> (la misma correlación descontando los retardos intermedios), con sus bandas ±1,96/√n calculadas de verdad.",
 notice:["<b>AR(1)</b> (θ = 0): la PACF tiene una sola barra fuera de la banda (lag 1) y la ACF <b>decae poco a poco</b>. Es la huella clásica para elegir p = 1.",
   "<b>MA(1)</b> (φ = 0): al revés, la <b>ACF se corta</b> tras el lag 1 y la PACF decae (alternando signo si θ &gt; 0). Así se elige q.",
   "Con <b>d = 1</b>, la ACF de la serie original baja <b>muy despacio</b> (casi 1 en todos los lags): no es estacionaria. Mira la de la serie diferenciada: vuelve a mostrar la huella ARMA."],
 models:["arima","sarima","sarimax","hw"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 420, K = makeCanvas(stage, W, H, "Serie ARMA simulada con su ACF y PACF"), ctx = K.ctx;
   var phi = 0.7, th = 0, d = 0, seed = 4, which = "orig", n = 200, L = 20, x = [], y = [];
   function gen(){
     var r = mulberry(seed * 101), e = [], z = [], prevE = 0, prevZ = 0;
     for(var t = 0; t < n + 60; t++){ var et = gauss(r), zt = phi * prevZ + et + th * prevE; prevE = et; prevZ = zt; if(t >= 60) z.push(zt); }
     x = z; y = [];
     if(d){ var acc = 0; z.forEach(function(v){ acc += v + 0.12; y.push(acc); }); } else y = z.slice();
   }
   function stems(box, vals, title, band, col){
     var x0 = box[0], w = box[2], yc = box[1] + box[3] / 2, hs = box[3] / 2 - 6;
     cap(ctx, title, x0, box[1] - 8, C);
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(x0 + .5, box[1] + .5, w, box[3]);
     ctx.fillStyle = hexA(C.c[0], 0.1); ctx.fillRect(x0 + 1, yc - band * hs, w - 2, 2 * band * hs);
     seg(ctx, x0, yc - band * hs, x0 + w, yc - band * hs, hexA(C.c[0], 0.6), 1, [4, 3]); seg(ctx, x0, yc + band * hs, x0 + w, yc + band * hs, hexA(C.c[0], 0.6), 1, [4, 3]);
     seg(ctx, x0, yc, x0 + w, yc, C.muted, 1);
     tx(ctx, "1", x0 - 5, yc - hs + 4, {s:11, c:C.muted, a:"right"}); tx(ctx, "0", x0 - 5, yc + 4, {s:11, c:C.muted, a:"right"}); tx(ctx, "−1", x0 - 5, yc + hs + 4, {s:11, c:C.muted, a:"right"});
     for(var k = 1; k <= L; k++){
       var xx = x0 + (k - 0.5) / L * w, v = vals[k], out = Math.abs(v) > band;
       seg(ctx, xx, yc, xx, yc - v * hs, out ? col : hexA(C.muted, 0.7), out ? 3 : 2);
       dot(ctx, xx, yc - v * hs, out ? 3.6 : 2.6, out ? col : C.muted);
       if(k === 1 || k % 5 === 0) tx(ctx, String(k), xx, box[1] + box[3] + 14, {s:11, c:C.muted, a:"center"});
     }
     tx(ctx, "retardo (lag)", x0 + w / 2, box[1] + box[3] + 28, {s:11, c:C.muted, a:"center"});
   }
   function line(box, arr, col, label){
     var lo = Math.min.apply(null, arr), hi = Math.max.apply(null, arr), pad = (hi - lo) * 0.08 || 1;
     lo -= pad; hi += pad;
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(box[0] + .5, box[1] + .5, box[2], box[3]);
     if(lo < 0 && hi > 0){ var y0 = box[1] + box[3] - (0 - lo) / (hi - lo) * box[3]; seg(ctx, box[0], y0, box[0] + box[2], y0, hexA(C.muted, 0.5), 1, [3, 3]); }
     pathXY(ctx, arr.map(function(_, t){ return box[0] + t / (arr.length - 1) * box[2]; }), arr.map(function(v){ return box[1] + box[3] - (v - lo) / (hi - lo) * box[3]; }));
     stroke(ctx, col, 1.6);
     tx(ctx, label, box[0] + 8, box[1] + 15, {s:11.5, w:600, c:C.text});
   }
   function cut(vals, band){ /* menor q tal que, después de q, como mucho 1 lag (de 10) se sale de la banda */
     for(var q = 0; q <= 6; q++){ var c = 0; for(var k = q + 1; k <= 10; k++) if(Math.abs(vals[k]) > band) c++; if(c <= 1 && Math.abs(vals[q + 1]) <= band) return q; }
     return 7;
   }
   function draw(){
     K.clear();
     var top = [52, 22, 690, 150];
     if(d){
       line([52, 22, 690, 70], y, C.c[0], "serie observada (integrada, d = 1)");
       line([52, 102, 690, 70], x, C.c[1], "serie diferenciada: y(t) − y(t−1)");
     } else line(top, y, C.c[0], "serie simulada (d = 0)");
     var s = d && which === "orig" ? y : x, a = acfOf(s, L), p = pacfOf(a, L), band = 1.96 / Math.sqrt(s.length);
     var lbl = d ? (which === "orig" ? " · serie original" : " · serie diferenciada") : "";
     stems([52, 216, 316, 160], a, "ACF" + lbl, band, C.c[0]);
     stems([424, 216, 316, 160], p, "PACF" + lbl, band, C.c[1]);
     /* diagnóstico */
     var qa = cut(a, band), qp = cut(p, band), msg;
     if(d && which === "orig" && a[10] > 0.5) msg = "La ACF <b>decae muy despacio</b> (lag 10 = " + fmt(a[10], 2) + "): la serie no es estacionaria, tiene tendencia o memoria infinita. <b>Diferénciala (d = 1)</b> y vuelve a mirar: elige «serie diferenciada».";
     else if(qa === 0 && qp === 0) msg = "Ninguna barra sale claramente de la banda: parece <b>ruido blanco</b>. No hay nada que modelar con AR ni MA (ARIMA(0," + d + ",0)).";
     else if(qp <= 3 && qa > qp + 1) msg = "La <b>PACF se corta en el lag " + qp + "</b> y la ACF decae poco a poco → <b>AR(" + qp + ")</b>. Propuesta: ARIMA(" + qp + "," + d + ",0).";
     else if(qa <= 3 && qp > qa + 1) msg = "La <b>ACF se corta en el lag " + qa + "</b> y la PACF decae poco a poco → <b>MA(" + qa + ")</b>. Propuesta: ARIMA(0," + d + "," + qa + ").";
     else if(qa === qp && qa <= 1) msg = "Solo el lag 1 destaca en ambas: es un efecto débil, compatible con <b>AR(1) o MA(1)</b>. Ajusta los dos y compara con AIC.";
     else msg = "Ni la ACF ni la PACF se cortan limpiamente: ambas decaen → <b>ARMA</b> (mezcla), por ejemplo ARIMA(1," + d + ",1). Aquí la ACF/PACF orientan y el AIC decide.";
     read.innerHTML = '<span>Verdad simulada <b>φ = ' + fmt(phi, 2) + ' · θ = ' + fmt(th, 2) + ' · d = ' + d + '</b></span><span>Banda ±1,96/√n <b>±' + fmt(band, 3) + '</b></span>' +
       '<span>Lags fuera de banda (1-10) <b>ACF ' + a.slice(1, 11).filter(function(v){ return Math.abs(v) > band; }).length + ' · PACF ' + p.slice(1, 11).filter(function(v){ return Math.abs(v) > band; }).length + '</b></span>' +
       '<span class="ldiag">' + msg + '</span>';
   }
   var sP, sT, segW;
   ctlSeg(ctl, "Ejemplo", [["ar", "AR(1)"], ["ma", "MA(1)"], ["arma", "ARMA(1,1)"], ["wn", "Ruido blanco"]], "ar", function(v){
     var pr = {ar:[0.7, 0], ma:[0, 0.8], arma:[0.6, 0.5], wn:[0, 0]}[v]; phi = pr[0]; th = pr[1]; sP.set(phi); sT.set(th); gen(); draw(); });
   sP = ctlSlider(ctl, "φ (parte AR)", -0.9, 0.9, 0.05, phi, function(v){ return fmt(v); }, function(v){ phi = v; gen(); draw(); });
   sT = ctlSlider(ctl, "θ (parte MA)", -0.9, 0.9, 0.05, th, function(v){ return fmt(v); }, function(v){ th = v; gen(); draw(); });
   ctlCheck(ctl, "d = 1 (integrar: paseo con tendencia)", false, function(v){ d = v ? 1 : 0; segW.style.display = d ? "" : "none"; gen(); draw(); });
   segW = ctlSeg(ctl, "ACF/PACF de", [["orig", "Serie original"], ["diff", "Serie diferenciada"]], which, function(v){ which = v; draw(); });
   segW.style.display = "none";
   ctlBtn(ctl, "🎲 Otra muestra", function(){ seed++; gen(); draw(); });
   gen(); draw();
 }});

/* ── 12. SARIMA: LA ESTACIONALIDAD ANUAL ─────────────────────── */
VIZ.push({id:"v-sarima", model:"sarima", g:"model", ic:"📅", dim:"2D",
 t:"La «S» de SARIMA: patrones que se repiten cada año",
 q:"¿Cómo se ve la estacionalidad y cuánto mejora el pronóstico un modelo que la tiene en cuenta?",
 intro:"Seis años de ventas mensuales (inventadas) con tendencia y un patrón anual. Tres vistas: el <b>gráfico estacional</b> (una línea por año), la <b>ACF</b> con su pico en el retardo 12 y un <b>pronóstico de 12 meses</b> que el modelo no ha visto (validación hacia delante), comparando un modelo <b>sin</b> parte estacional con otro <b>con</b> ella. Los dos se ajustan de verdad por mínimos cuadrados; son versiones simplificadas de ARIMA y SARIMA.",
 notice:["En el gráfico estacional, todas las líneas tienen la <b>misma forma</b> (meses flojos en invierno, subida hasta el verano y repunte en diciembre) y cada año va un poco más arriba: eso es estacionalidad más tendencia.",
   "En la ACF, la barra del <b>lag 12</b> (y la del 24) sobresale: lo que pasó hace exactamente un año es lo que más se parece a hoy.",
   "El modelo sin parte estacional (AR(1) sobre la serie diferenciada) pronostica casi una línea recta y no ve ni el verano ni diciembre; el que usa y(t−12) sigue la forma del año. Compara los <b>MAE</b>."],
 models:["sarima","arima","hw","prophet","sarimax"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 400, K = makeCanvas(stage, W, H, "Serie mensual con estacionalidad anual: gráfico estacional, ACF y pronóstico"), ctx = K.ctx;
   var MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"], Y0 = 2020;
   var view = "season", amp = 30, seed = 2, y = [];
   function gen(){
     var r = mulberry(seed * 37), e = 0; y = [];
     for(var t = 0; t < 72; t++){ var m = t % 12; e = 0.3 * e + 3.5 * gauss(r);
       y.push(220 + 1.1 * t + amp * Math.sin(2 * Math.PI * (m - 3) / 12) * 0.8 + (m === 11 ? amp * 1.1 : 0) + (m === 10 ? amp * 0.35 : 0) + e); }
   }
   function fits(){
     var tr = y.slice(0, 60), te = y.slice(60);
     /* A: AR(1) sobre la serie diferenciada: Δy(t) = c + φ·Δy(t−1) */
     var dy = []; for(var t = 1; t < 60; t++) dy.push(tr[t] - tr[t - 1]);
     var XA = [], yA = []; for(t = 1; t < dy.length; t++){ XA.push([1, dy[t - 1]]); yA.push(dy[t]); }
     var bA = lsq(XA, yA), fa = [], last = tr[59], ld = dy[dy.length - 1];
     for(var h = 0; h < 12; h++){ ld = bA[0] + bA[1] * ld; last += ld; fa.push(last); }
     /* B: AR estacional: y(t) = c + a·y(t−1) + b·y(t−12) */
     var XB = [], yB = []; for(t = 12; t < 60; t++){ XB.push([1, tr[t - 1], tr[t - 12]]); yB.push(tr[t]); }
     var bB = lsq(XB, yB), fb = [], ext = tr.slice();
     for(h = 0; h < 12; h++){ var tt = 60 + h, v = bB[0] + bB[1] * ext[tt - 1] + bB[2] * ext[tt - 12]; ext.push(v); fb.push(v); }
     var mae = function(f){ return mean(f.map(function(v, i){ return Math.abs(v - te[i]); })); };
     return {fa:fa, fb:fb, bA:bA, bB:bB, maeA:mae(fa), maeB:mae(fb)};
   }
   function draw(){
     K.clear();
     var F = fits(), lo = Math.min.apply(null, y.concat(F.fa, F.fb)) - 10, hi = Math.max.apply(null, y.concat(F.fa, F.fb)) + 10;
     if(view === "season"){
       var box = [60, 30, 600, 320];
       var A = axes(ctx, box, [0, 11], [lo, hi], C, {yl:"ventas (miles de €)", yt:[Math.ceil(lo / 50) * 50, Math.floor(hi / 50) * 50]});
       MES.forEach(function(m, i){ tx(ctx, m, A.sx(i), box[1] + box[3] + 16, {s:11, c:C.muted, a:"center"}); });
       cap(ctx, "Gráfico estacional · una línea por año", box[0], 18, C);
       var labs = [];
       for(var yr = 0; yr < 6; yr++){
         var seg12 = y.slice(yr * 12, yr * 12 + 12), al = 0.3 + 0.7 * yr / 5;
         pathXY(ctx, seg12.map(function(_, i){ return A.sx(i); }), seg12.map(A.sy)); stroke(ctx, hexA(C.c[0], al), yr === 5 ? 2.8 : 1.8);
         seg12.forEach(function(v, i){ dot(ctx, A.sx(i), A.sy(v), 2.4, hexA(C.c[0], al)); });
         labs.push([A.sy(seg12[11]), String(Y0 + yr), al]);
       }
       labs.sort(function(a, b){ return a[0] - b[0]; });
       for(var q = 1; q < labs.length; q++) if(labs[q][0] - labs[q - 1][0] < 14) labs[q][0] = labs[q - 1][0] + 14;
       labs.forEach(function(l){ tx(ctx, l[1], box[0] + box[2] + 10, l[0] + 4, {s:12, w:700, c:hexA(C.c[0], Math.max(0.55, l[2]))}); });
       var dec = mean([0, 1, 2, 3, 4, 5].map(function(k){ return y[k * 12 + 11] - mean(y.slice(k * 12, k * 12 + 12)); })), apr = mean([0, 1, 2, 3, 4, 5].map(function(k){ return y[k * 12 + 3] - mean(y.slice(k * 12, k * 12 + 12)); }));
       read.innerHTML = '<span>Diciembre frente a la media de su año <b>+' + fmt(dec, 0) + '</b></span><span>Abril frente a la media <b>' + fmt(apr, 0).replace("-", "−") + '</b></span><span>Crecimiento interanual medio <b>+' + fmt(mean([1, 2, 3, 4, 5].map(function(k){ return mean(y.slice(k * 12, k * 12 + 12)) - mean(y.slice(k * 12 - 12, k * 12)); })), 1) + '</b></span>' +
         '<span class="ldiag">Las seis líneas comparten forma: el patrón se repite cada <b>12 meses</b>. Un modelo que no mire «el mismo mes del año pasado» tendrá que adivinar ese pico cada diciembre.</span>';
     } else if(view === "acf"){
       var L = 36, a = acfOf(y, L), band = 1.96 / Math.sqrt(y.length), bx = [60, 34, 660, 300], yc = bx[1] + bx[3] / 2, hs = bx[3] / 2 - 8;
       cap(ctx, "ACF de la serie (72 meses)", bx[0], 18, C);
       ctx.strokeStyle = C.line; ctx.strokeRect(bx[0] + .5, bx[1] + .5, bx[2], bx[3]);
       ctx.fillStyle = hexA(C.c[0], 0.1); ctx.fillRect(bx[0] + 1, yc - band * hs, bx[2] - 2, 2 * band * hs);
       seg(ctx, bx[0], yc, bx[0] + bx[2], yc, C.muted, 1);
       tx(ctx, "1", bx[0] - 6, yc - hs + 4, {s:11, c:C.muted, a:"right"}); tx(ctx, "0", bx[0] - 6, yc + 4, {s:11, c:C.muted, a:"right"}); tx(ctx, "−1", bx[0] - 6, yc + hs + 4, {s:11, c:C.muted, a:"right"});
       for(var k = 1; k <= L; k++){
         var xx = bx[0] + (k - 0.5) / L * bx[2], v = a[k], s12 = k % 12 === 0;
         seg(ctx, xx, yc, xx, yc - v * hs, s12 ? C.c[1] : Math.abs(v) > band ? C.c[0] : hexA(C.muted, 0.7), s12 ? 4 : 2.4);
         dot(ctx, xx, yc - v * hs, s12 ? 4.5 : 2.8, s12 ? C.c[1] : Math.abs(v) > band ? C.c[0] : C.muted);
         if(s12) tx(ctx, "lag " + k, xx, yc - v * hs - 12, {s:12, w:700, c:C.ink, a:"center"});
         if(k % 6 === 0 || k === 1) tx(ctx, String(k), xx, bx[1] + bx[3] + 16, {s:11, c:C.muted, a:"center"});
       }
       tx(ctx, "retardo en meses (lag)", bx[0] + bx[2] / 2, bx[1] + bx[3] + 32, {s:11, c:C.muted, a:"center"});
       read.innerHTML = '<span>ACF lag 1 <b>' + fmt(a[1], 2) + '</b></span><span>lag 6 <b>' + fmt(a[6], 2) + '</b></span><span>lag 12 <b>' + fmt(a[12], 2) + '</b></span><span>lag 24 <b>' + fmt(a[24], 2) + '</b></span><span>Banda <b>±' + fmt(band, 2) + '</b></span>' +
         '<span class="ldiag">Picos en <b>12 y 24</b> (y valles en 6 y 18, medio año desfasado): la firma de una estacionalidad anual. En SARIMA eso se traduce en una parte estacional con periodo <b>s = 12</b>.</span>';
     } else {
       var box2 = [60, 30, 660, 300];
       var A2 = axes(ctx, box2, [0, 71], [lo, hi], C, {yl:"ventas (miles de €)", yt:[Math.ceil(lo / 50) * 50, Math.floor(hi / 50) * 50]});
       for(var yy = 0; yy < 6; yy++) tx(ctx, String(Y0 + yy), A2.sx(yy * 12 + 5.5), box2[1] + box2[3] + 16, {s:11, c:C.muted, a:"center"});
       ctx.fillStyle = hexA(C.c[2], 0.08); ctx.fillRect(A2.sx(59.5), box2[1], A2.sx(71) - A2.sx(59.5), box2[3]);
       tx(ctx, "test: 12 meses no vistos", A2.sx(60) + 6, box2[1] + 16, {s:11, c:C.muted});
       cap(ctx, "Pronóstico a 12 meses", box2[0], 18, C);
       var ln = function(arr, off, col, lw, dash){ pathXY(ctx, arr.map(function(_, i){ return A2.sx(i + off); }), arr.map(A2.sy)); stroke(ctx, col, lw, dash); };
       ln(y.slice(0, 60), 0, C.c[0], 2);
       ln(y.slice(59), 59, C.muted, 2, [5, 4]);
       if(show !== "b") ln([y[59]].concat(F.fa), 59, C.c[4], 2.4);
       if(show !== "a") ln([y[59]].concat(F.fb), 59, C.c[1], 2.8);
       var lg = [[C.c[0], "entrenamiento", []], [C.muted, "real (test)", [5, 4]], [C.c[4], "sin estacional · MAE " + fmt(F.maeA, 1), []], [C.c[1], "con estacional · MAE " + fmt(F.maeB, 1), []]];
       lg.forEach(function(l, q){ var lx = box2[0] + 14, ly = box2[1] + 38 + q * 18; seg(ctx, lx, ly - 4, lx + 22, ly - 4, l[0], 2.6, l[2]); tx(ctx, l[1], lx + 30, ly, {s:12, c:C.text}); });
       var gain = 1 - F.maeB / F.maeA;
       read.innerHTML = '<table class="cmx"><tr><th>Modelo</th><th>Ecuación ajustada</th><th>MAE último año</th></tr>' +
         '<tr><th>Sin estacional</th><td style="font-size:12.5px;font-weight:500">Δy(t) = ' + fmt(F.bA[0], 2) + ' + ' + fmt(F.bA[1], 2) + '·Δy(t−1)</td><td class="' + (F.maeA > F.maeB ? "ko" : "ok") + '">' + fmt(F.maeA, 1) + '</td></tr>' +
         '<tr><th>Con estacional</th><td style="font-size:12.5px;font-weight:500">y(t) = ' + fmt(F.bB[0], 1) + ' + ' + fmt(F.bB[1], 2) + '·y(t−1) + ' + fmt(F.bB[2], 2) + '·y(t−12)</td><td class="' + (F.maeB <= F.maeA ? "ok" : "ko") + '">' + fmt(F.maeB, 1) + '</td></tr></table>' +
         '<span class="ldiag" style="flex-basis:auto;flex:1 1 240px">' + (gain > 0 ? "Mirar «hace 12 meses» reduce el error un <b>" + pct(gain, 0) + "</b>. El coeficiente de y(t−12) es " + fmt(F.bB[2], 2) + ": buena parte de cada mes se explica por el mismo mes del año anterior." : "Con tan poca estacionalidad, el término y(t−12) no aporta: el modelo sencillo basta.") + ' MAE en miles de €: «de media, el pronóstico se desvía tanto al mes».</span>';
     }
   }
   var show = "both";
   var sv = ctlSeg(ctl, "Vista", [["season", "Gráfico estacional"], ["acf", "ACF (lag 12)"], ["fc", "Pronóstico"]], view, function(v){ view = v; showSeg.style.display = v === "fc" ? "" : "none"; draw(); });
   var showSeg = ctlSeg(ctl, "Pronósticos", [["both", "Los dos"], ["a", "Sin estacional"], ["b", "Con estacional"]], show, function(v){ show = v; draw(); });
   showSeg.style.display = "none";
   ctlSlider(ctl, "Fuerza de la estacionalidad", 0, 50, 1, amp, function(v){ return v; }, function(v){ amp = v; gen(); draw(); });
   ctlBtn(ctl, "🎲 Otra muestra", function(){ seed++; gen(); draw(); });
   gen(); draw();
 }});

/* ── 13. SARIMAX: VARIABLES EXTERNAS Y ESCENARIOS ────────────── */
VIZ.push({id:"v-sarimax", model:"sarimax", g:"model", ic:"🌡️", dim:"2D",
 t:"La «X» de SARIMAX: promociones y temperatura",
 q:"¿Cómo se usan variables externas (exógenas) para pronosticar, y qué pasa con su futuro?",
 intro:"Dos años de ventas semanales (se dibuja el último) de bebidas frías con dos variables externas: <b>semanas de promoción</b> y <b>temperatura</b>. Se ajusta de verdad una <b>regresión con errores AR(1)</b> (estimada por mínimos cuadrados con el método de Cochrane-Orcutt), que es una versión simplificada de SARIMAX. Mueve los deslizadores para plantear <b>escenarios</b> para las próximas 12 semanas: el pronóstico se recalcula y se descompone en base + efecto promo + efecto temperatura.",
 notice:["Cada semana de promoción suma lo que dice su coeficiente (≈ 80 unidades): en el pronóstico aparece como un <b>escalón naranja</b> justo en las semanas promocionadas.",
   "Unas semanas más calurosas de lo normal (+°C) <b>suben</b> la banda verde; más frescas la vuelven negativa (▼, se resta). El efecto temperatura es el coeficiente por °C multiplicado por la diferencia con la temperatura media.",
   "El modelo <b>no sabe</b> qué promociones harás ni qué tiempo hará: tú le das esos valores futuros. Si los inventas mal, el pronóstico estará mal aunque el modelo sea perfecto."],
 models:["sarimax","sarima","arima","linmult","prophet"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 420, K = makeCanvas(stage, W, H, "Ventas semanales con promociones y temperatura, y pronóstico por escenarios"), ctx = K.ctx;
   var NH = 104, NF = 12, r = mulberry(61), y = [], promo = [], temp = [], u = 0;
   for(var t = 0; t < NH; t++){
     var tc = 17 + 9 * Math.sin(2 * Math.PI * (t - 97) / 52) + 1.6 * gauss(r);
     var pr = (t % 9 === 3 || t % 13 === 7) ? 1 : 0;
     u = 0.6 * u + 14 * gauss(r);
     temp.push(tc); promo.push(pr); y.push(420 + 1.1 * t + 82 * pr + 7 * (tc - 17) + u);
   }
   /* Cochrane-Orcutt: OLS → rho de los residuos → cuasi-diferencias → OLS … */
   var X = y.map(function(_, t){ return [1, t, promo[t], temp[t]]; }), beta = lsq(X, y), rho = 0;
   for(var it = 0; it < 15; it++){
     var e = y.map(function(v, t){ return v - (beta[0] + beta[1] * t + beta[2] * promo[t] + beta[3] * temp[t]); });
     var a = 0, b = 0; for(t = 1; t < NH; t++){ a += e[t] * e[t - 1]; b += e[t - 1] * e[t - 1]; } rho = a / b;
     var Xs = [], ys = []; for(t = 1; t < NH; t++){ Xs.push(X[t].map(function(v, j){ return v - rho * X[t - 1][j]; })); ys.push(y[t] - rho * y[t - 1]); }
     beta = lsq(Xs, ys); /* la columna constante también se cuasi-diferencia (1 − ρ): beta[0] ya es el intercepto original */
   }
   var eT = y[NH - 1] - (beta[0] + beta[1] * (NH - 1) + beta[2] * promo[NH - 1] + beta[3] * temp[NH - 1]);
   var Tbar = mean(temp);
   /* temperatura «normal» para las semanas futuras: armónico anual ajustado al histórico */
   var XT = temp.map(function(_, t){ return [1, Math.sin(2 * Math.PI * t / 52), Math.cos(2 * Math.PI * t / 52)]; }), bT = lsq(XT, temp);
   var climT = function(t){ return bT[0] + bT[1] * Math.sin(2 * Math.PI * t / 52) + bT[2] * Math.cos(2 * Math.PI * t / 52); };
   var nP = 3, dT = 0;
   function scenario(){
     var pf = new Array(NF).fill(0); for(var q = 0; q < nP; q++) pf[Math.min(NF - 1, Math.round((q + 0.5) * NF / nP - 0.5))] = 1;
     var out = [];
     for(var h = 1; h <= NF; h++){
       var t = NH - 1 + h, Tf = climT(t) + dT;
       var base = beta[0] + beta[1] * t + beta[3] * Tbar + Math.pow(rho, h) * eT;
       out.push({t:t, base:base, pe:beta[2] * pf[h - 1], te:beta[3] * (Tf - Tbar), T:Tf, p:pf[h - 1]});
     }
     return out;
   }
   function draw(){
     K.clear();
     var S = scenario(), all = y.concat(S.map(function(s){ return s.base + s.pe + Math.max(0, s.te); }), S.map(function(s){ return s.base + Math.min(0, s.te); }));
     var lo = Math.floor((Math.min.apply(null, all) - 20) / 50) * 50, hi = Math.ceil((Math.max.apply(null, all) + 20) / 50) * 50;
     var mb = [62, 50, 676, 220], tb = [62, 316, 676, 70], xr = [NH - 52, NH + NF - 1], H0 = NH - 52;
     var A = axes(ctx, mb, xr, [lo, hi], C, {yl:"unidades/semana", yt:[lo, (lo + hi) / 2, hi]});
     var sx = A.sx, sy = A.sy;
     cap(ctx, "Ventas semanales (último año) y pronóstico de 12 semanas", mb[0], 16, C);
     ctx.fillStyle = hexA(C.c[0], 0.06); ctx.fillRect(sx(NH - 0.5), mb[1], sx(xr[1]) - sx(NH - 0.5), mb[3]);
     tx(ctx, "escenario (12 semanas)", (sx(NH - 0.5) + sx(xr[1])) / 2, mb[1] + mb[3] - 10, {s:11, w:600, c:C.muted, a:"center"});
     /* histórico */
     var hs = y.slice(H0); pathXY(ctx, hs.map(function(_, q){ return sx(q + H0); }), hs.map(sy)); stroke(ctx, hexA(C.c[0], 0.85), 1.8);
     promo.forEach(function(p, t){ if(p && t >= H0) mark(ctx, 2, sx(t), sy(y[t]) - 9, 3.6, C.c[1]); });
     /* pronóstico apilado */
     var xs = [sx(NH - 1)].concat(S.map(function(s){ return sx(s.t); }));
     var b0 = [y[NH - 1]].concat(S.map(function(s){ return s.base; }));
     var b1 = [y[NH - 1]].concat(S.map(function(s){ return s.base + s.pe; }));
     var b2 = [y[NH - 1]].concat(S.map(function(s){ return s.base + s.pe + s.te; }));
     var band = function(lo2, hi2, col){ ctx.beginPath(); xs.forEach(function(x, i){ if(i) ctx.lineTo(x, sy(hi2[i])); else ctx.moveTo(x, sy(hi2[i])); }); for(var i = xs.length - 1; i >= 0; i--) ctx.lineTo(xs[i], sy(lo2[i])); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
     band(b0.map(function(){ return lo; }), b0, hexA(C.c[0], 0.16));
     band(b0, b1, hexA(C.c[1], 0.55));
     band(b1, b2, hexA(C.c[2], dT >= 0 ? 0.55 : 0.3));
     pathXY(ctx, xs, b0.map(sy)); stroke(ctx, C.c[0], 1.6, [4, 3]);
     pathXY(ctx, xs, b2.map(sy)); stroke(ctx, C.ink, 2.4);
     /* leyenda */
     var lg = [[hexA(C.c[0], 0.35), "base (tendencia + inercia AR)"], [hexA(C.c[1], 0.7), "efecto promo"], [hexA(C.c[2], 0.7), "efecto temperatura"], [C.ink, "pronóstico total"]];
     var lx = mb[0];
     lg.forEach(function(l){ ctx.fillStyle = l[0]; rrect(ctx, lx, 31, 14, 10, 3); ctx.fill(); lx += 20 + tx(ctx, l[1], lx + 20, 40, {s:11.5, c:C.text}) + 18; });
     mark(ctx, 2, lx + 5, 36, 3.6, C.c[1]); tx(ctx, "promoción", lx + 13, 40, {s:11.5, c:C.text});
     /* panel de temperatura */
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(tb[0] + .5, tb[1] + .5, tb[2], tb[3]);
     cap(ctx, "Temperatura (°C) · histórico y escenario", tb[0], tb[1] - 8, C);
     var tl = 0, th2 = 35, ty = function(v){ return tb[1] + tb[3] - (v - tl) / (th2 - tl) * tb[3]; };
     seg(ctx, tb[0], ty(Tbar), tb[0] + tb[2], ty(Tbar), hexA(C.muted, 0.6), 1, [3, 3]);
     tx(ctx, "media " + fmt(Tbar, 1) + " °C", tb[0] + 6, ty(Tbar) - 4, {s:11, c:C.muted});
     var th = temp.slice(H0); pathXY(ctx, th.map(function(_, q){ return sx(q + H0); }), th.map(ty)); stroke(ctx, hexA(C.c[2], 0.9), 1.4);
     pathXY(ctx, S.map(function(s){ return sx(s.t); }), S.map(function(s){ return ty(climT(s.t)); })); stroke(ctx, hexA(C.muted, 0.8), 1.2, [2, 3]);
     pathXY(ctx, S.map(function(s){ return sx(s.t); }), S.map(function(s){ return ty(s.T); })); stroke(ctx, C.c[2], 2.4);
     [0, 10, 20, 30].forEach(function(v){ tx(ctx, String(v), tb[0] - 6, ty(v) + 4, {s:11, c:C.muted, a:"right"}); });
     tx(ctx, "últimas 52 semanas", sx(H0 + 26), tb[1] + tb[3] + 16, {s:11, c:C.muted, a:"center"});
     tx(ctx, "+12 sem.", sx(NH + 5.5), tb[1] + tb[3] + 16, {s:11, c:C.muted, a:"center"});
     /* lectura */
     var tot = function(f){ return sum(S.map(f)); };
     var TB = tot(function(s){ return s.base; }), TP = tot(function(s){ return s.pe; }), TT = tot(function(s){ return s.te; });
     read.innerHTML = '<span>Promo <b>+' + fmt(beta[2], 0) + ' ud./semana</b></span><span>Temperatura <b>' + (beta[3] >= 0 ? "+" : "") + fmt(beta[3], 1) + ' ud. por °C</b></span><span>Tendencia <b>+' + fmt(beta[1], 2) + ' ud./semana</b></span><span>ρ (AR(1) del error) <b>' + fmt(rho, 2) + '</b></span>' +
       '<span style="flex-basis:100%">Próximas 12 semanas: <b>' + fmt(TB + TP + TT, 0) + ' ud.</b> = base ' + fmt(TB, 0) + ' + promo ' + fmt(TP, 0) + ' ' + (TT >= 0 ? "+ temperatura " + fmt(TT, 0) + " ▲" : "− temperatura " + fmt(-TT, 0) + " ▼") + '</span>' +
       '<span class="ldiag"><b class="lwarn">⚠ Ojo con el futuro de las exógenas</b>: para pronosticar con SARIMAX hay que <b>conocer o fijar</b> sus valores futuros. Las promociones las decides tú (bien); la temperatura hay que tomarla de una previsión meteorológica o plantear escenarios (como aquí). Un error en esa previsión se traslada tal cual al pronóstico de ventas.</span>';
   }
   ctlSlider(ctl, "Semanas con promoción (de las próximas 12)", 0, 12, 1, nP, function(v){ return v; }, function(v){ nP = v; draw(); });
   ctlSlider(ctl, "Temperatura frente a lo normal", -6, 6, 0.5, dT, function(v){ return (v > 0 ? "+" : v < 0 ? "−" : "") + fmt(Math.abs(v), 1) + " °C"; }, function(v){ dT = v; draw(); });
   draw();
 }});

/* ── 14. PROPHET: DESCOMPOSICIÓN ADITIVA ─────────────────────── */
VIZ.push({id:"v-prophet", model:"prophet", g:"model", ic:"🔮", dim:"2D",
 t:"Prophet por piezas: tendencia, semanas, años y festivos",
 q:"¿Cómo descompone Prophet una serie diaria y por qué la flexibilidad de la tendencia cambia tanto el pronóstico?",
 intro:"Tres años de <b>pedidos diarios</b> (inventados) de una tienda online. Se ajusta de verdad un modelo aditivo como el de Prophet: <b>tendencia lineal por tramos</b> con 25 posibles puntos de cambio, <b>estacionalidad semanal y anual</b> (series de Fourier) y <b>festivos</b>, por mínimos cuadrados con regularización (la de los puntos de cambio, tipo Laplace como en Prophet, resuelta por mínimos cuadrados reponderados). Los <b>últimos 90 días</b> no se usan para ajustar: son la validación.",
 notice:["Con <b>changepoint_prior_scale</b> bajo, la tendencia casi no puede doblarse (una recta); alto, se dobla en muchos puntos y su <b>último tramo</b> manda en la extrapolación: el pronóstico puede dispararse o hundirse.",
   "Los paneles de abajo son las piezas que se suman: el patrón <b>semanal</b> (más pedidos en fin de semana), el <b>anual</b> (valle en verano, subida en otoño-invierno) y los <b>festivos</b> (Black Friday, Navidad, rebajas).",
   "Desmarca «festivos» y mira el MAPE: el modelo deja de anticipar el pico de <b>Black Friday</b> que cae dentro de los 90 días de validación."],
 models:["prophet","sarima","hw","sarimax","linsimple"],
 build:function(stage, ctl, read, C){
   var W = 760, H = 440, K = makeCanvas(stage, W, H, "Serie diaria descompuesta en tendencia, estacionalidad semanal, anual y festivos"), ctx = K.ctx;
   var ND = 1095, NV = 90, NT = ND - NV, D0 = Date.UTC(2023, 0, 1), DAY = 86400000;
   var date = function(d){ return new Date(D0 + d * DAY); };
   var MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
   /* festivos: Black Friday (último viernes de noviembre), Navidad (22-24 dic), rebajas (7 ene) */
   var HOL = [[], [], []], HN = ["Black Friday", "Navidad", "Rebajas"];
   for(var d = 0; d < ND; d++){
     var dt = date(d), m = dt.getUTCMonth(), dd = dt.getUTCDate(), wd = dt.getUTCDay();
     if(m === 10 && wd === 5 && dd + 7 > 30) HOL[0].push(d);
     if(m === 11 && dd >= 22 && dd <= 24) HOL[1].push(d);
     if(m === 0 && dd === 7) HOL[2].push(d);
   }
   var isH = function(k, d){ return HOL[k].indexOf(d) > -1 ? 1 : 0; };
   var r = mulberry(29), y = [];
   for(d = 0; d < ND; d++){
     var tr = 180 + 0.09 * d + (d > 420 ? 0.16 * (d - 420) : 0) - (d > 820 ? 0.2 * (d - 820) : 0);
     wd = date(d).getUTCDay();
     var wk = [-8, -4, -2, 0, 6, 22, 18][wd];
     var doy = 2 * Math.PI * d / 365.25, yr = 22 * Math.cos(doy - 0.5) + 9 * Math.cos(2 * doy + 0.8) - 6 * Math.sin(doy);
     var hol = 140 * isH(0, d) + 45 * isH(1, d) + 55 * isH(2, d);
     y.push(Math.max(5, tr + wk + yr + hol + 10 * gauss(r)));
   }
   var ymax = Math.max.apply(null, y.slice(0, NT)), ys = y.map(function(v){ return v / ymax; });
   var NCP = 25, CP = []; for(var j = 0; j < NCP; j++) CP.push(Math.round((j + 1) * 0.8 * NT / (NCP + 1)));
   var cols = {wk:6, yr:20, hol:3};
   function feats(d){
     var t = d / (NT - 1), f = [1, t];
     CP.forEach(function(s){ f.push(Math.max(0, t - s / (NT - 1))); });
     for(var k = 1; k <= 3; k++){ f.push(Math.sin(2 * Math.PI * k * d / 7)); f.push(Math.cos(2 * Math.PI * k * d / 7)); }
     for(k = 1; k <= 10; k++){ f.push(Math.sin(2 * Math.PI * k * d / 365.25)); f.push(Math.cos(2 * Math.PI * k * d / 365.25)); }
     f.push(isH(0, d), isH(1, d), isH(2, d));
     return f;
   }
   var F = []; for(d = 0; d < ND; d++) F.push(feats(d));
   var P = F[0].length, iT = 2 + NCP, iW = iT, iY = iW + 6, iH = iY + 20;
   /* X'X y X'y una sola vez: la regularización solo toca la diagonal */
   var XtX = [], Xty = new Array(P).fill(0);
   for(var a = 0; a < P; a++) XtX.push(new Array(P).fill(0));
   for(d = 0; d < NT; d++){ var f = F[d]; for(a = 0; a < P; a++){ if(!f[a]) continue; Xty[a] += f[a] * ys[d]; for(var b = a; b < P; b++) XtX[a][b] += f[a] * f[b]; } }
   for(a = 0; a < P; a++) for(b = 0; b < a; b++) XtX[a][b] = XtX[b][a];
   var TAUS = [0.001, 0.005, 0.01, 0.05, 0.1, 0.5], ti = 3, use = {wk:true, yr:true, hol:true}, sigma2 = null;
   function solve(pen){ var A = XtX.map(function(row, i){ var rr = row.slice(); rr[i] += pen[i]; return rr; }); return solveLin(A, Xty.slice()); }
   function fit(){
     var tau = TAUS[ti], pen = new Array(P).fill(0), beta, off = function(i){ return (i >= iW && i < iY && !use.wk) || (i >= iY && i < iH && !use.yr) || (i >= iH && !use.hol); };
     if(sigma2 === null){ /* ruido estimado con un ajuste casi libre */
       var p0 = new Array(P).fill(1e-6); beta = solve(p0); var ss = 0; for(var d2 = 0; d2 < NT; d2++){ var e = ys[d2] - dotp(F[d2], beta); ss += e * e; } sigma2 = ss / (NT - P);
     }
     for(var i = 0; i < P; i++){ pen[i] = off(i) ? 1e9 : (i >= iW ? sigma2 / 100 : (i >= 2 ? sigma2 / tau / 0.01 : 1e-9)); }
     for(var it = 0; it < 25; it++){ /* IRLS: |δ| ≈ δ² / |δ anterior| */
       beta = solve(pen);
       for(i = 2; i < iT; i++) pen[i] = sigma2 / tau / Math.max(Math.abs(beta[i]), 1e-5);
     }
     return beta;
   }
   var dotp = function(f, bt){ var s = 0; for(var i = 0; i < f.length; i++) s += f[i] * bt[i]; return s; };
   var part = function(f, bt, i0, i1){ var s = 0; for(var i = i0; i < i1; i++) s += f[i] * bt[i]; return s * ymax; };
   var beta, comp, fan = [];
   function compute(){
     var keep = ti; fan = [];
     for(var q = 0; q < TAUS.length; q++){ ti = q; var bq = fit(); fan.push(F.map(function(f){ return part(f, bq, 0, iT); })); }
     ti = keep;
     beta = fit();
     comp = F.map(function(f){ return {tr:part(f, beta, 0, iT), wk:part(f, beta, iW, iY), yr:part(f, beta, iY, iH), hol:part(f, beta, iH, P)}; });
     comp.forEach(function(c){ c.yh = c.tr + c.wk + c.yr + c.hol; });
   }
   function draw(){
     K.clear();
     var mb = [56, 24, 690, 150], X = function(d){ return mb[0] + d / (ND - 1) * mb[2]; };
     var lo = Math.floor(Math.min.apply(null, y) / 50) * 50, hi = Math.ceil(Math.max.apply(null, y.concat(comp.map(function(c){ return c.yh; }))) / 50) * 50;
     var Y = function(v){ return mb[1] + mb[3] - (v - lo) / (hi - lo) * mb[3]; };
     cap(ctx, "Pedidos diarios · ajuste y pronóstico de 90 días", mb[0], 14, C);
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(mb[0] + .5, mb[1] + .5, mb[2], mb[3]);
     [lo, (lo + hi) / 2, hi].forEach(function(v){ tx(ctx, fmt(v, 0), mb[0] - 6, Y(v) + 4, {s:11, c:C.muted, a:"right"}); });
     ctx.fillStyle = hexA(C.c[2], 0.09); ctx.fillRect(X(NT - 0.5), mb[1], X(ND - 1) - X(NT - 0.5), mb[3]);
     tx(ctx, "validación", (X(NT) + X(ND - 1)) / 2, mb[1] + 14, {s:11, w:600, c:C.muted, a:"center"});
     for(d = 0; d < ND; d++){ ctx.fillStyle = d < NT ? hexA(C.ink, 0.28) : hexA(C.ink, 0.55); ctx.fillRect(X(d) - 0.6, Y(y[d]) - 0.6, 1.4, 1.4); }
     pathXY(ctx, comp.slice(0, NT).map(function(_, d2){ return X(d2); }), comp.slice(0, NT).map(function(c){ return Y(c.yh); })); stroke(ctx, hexA(C.c[0], 0.9), 1.2);
     pathXY(ctx, comp.slice(NT - 1).map(function(_, q){ return X(NT - 1 + q); }), comp.slice(NT - 1).map(function(c){ return Y(c.yh); })); stroke(ctx, C.c[1], 1.8);
     for(var yy = 0; yy < 3; yy++){ var dj = Math.round(yy * 365.25); tx(ctx, String(2023 + yy), X(dj + 182), mb[1] + mb[3] + 14, {s:11, c:C.muted, a:"center"}); seg(ctx, X(dj), mb[1] + mb[3], X(dj), mb[1] + mb[3] + 4, C.muted, 1); }
     var lgx = mb[0] + 10;
     ctx.fillStyle = hexA(C.ink, 0.45); ctx.fillRect(lgx, mb[1] + 12, 4, 4); lgx += 10 + tx(ctx, "pedidos reales", lgx + 8, mb[1] + 17, {s:11, c:C.text}) + 16;
     seg(ctx, lgx, mb[1] + 13, lgx + 16, mb[1] + 13, C.c[0], 2); lgx += 22 + tx(ctx, "ajuste", lgx + 22, mb[1] + 17, {s:11, c:C.text}) + 16;
     seg(ctx, lgx, mb[1] + 13, lgx + 16, mb[1] + 13, C.c[1], 2.4); tx(ctx, "pronóstico", lgx + 22, mb[1] + 17, {s:11, c:C.text});
     /* tendencia */
     var tb = [56, 206, 690, 64], tl = Math.min.apply(null, comp.map(function(c){ return c.tr; })), th = Math.max.apply(null, fan.map(function(fr){ return Math.max.apply(null, fr); }).concat([comp[ND - 1].tr]));
     tl = Math.min(tl, Math.min.apply(null, fan.map(function(fr){ return fr[ND - 1]; })));
     var TY = function(v){ return tb[1] + tb[3] - (v - tl) / (th - tl || 1) * (tb[3] - 6) - 3; };
     cap(ctx, "Tendencia · rombos = puntos de cambio usados · gris = otras flexibilidades", tb[0], tb[1] - 8, C);
     ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(tb[0] + .5, tb[1] + .5, tb[2], tb[3]);
     ctx.fillStyle = hexA(C.c[2], 0.09); ctx.fillRect(X(NT - 0.5), tb[1], X(ND - 1) - X(NT - 0.5), tb[3]);
     var used = 0, mxd = 0; for(j = 0; j < NCP; j++) mxd = Math.max(mxd, Math.abs(beta[2 + j]));
     CP.forEach(function(s, q){ var dl = beta[2 + q]; if(Math.abs(dl) > 0.004){ used++; seg(ctx, X(s), tb[1], X(s), tb[1] + tb[3], hexA(C.ink, 0.25), 1, [2, 3]); mark(ctx, 3, X(s), TY(comp[s].tr), 4, dl > 0 ? C.pos : C.neg, C.card, 1); }
       else { ctx.fillStyle = hexA(C.muted, 0.5); ctx.fillRect(X(s) - 0.5, tb[1] + tb[3] - 4, 1, 4); } });
     fan.forEach(function(fr, q){ if(q === ti) return; pathXY(ctx, fr.slice(NT - 200).map(function(_, k){ return X(NT - 200 + k); }), fr.slice(NT - 200).map(TY)); stroke(ctx, hexA(C.muted, 0.55), 1, [3, 2]); });
     pathXY(ctx, comp.map(function(_, d2){ return X(d2); }), comp.map(function(c){ return TY(c.tr); })); stroke(ctx, C.c[0], 2.2);
     pathXY(ctx, comp.slice(NT - 1).map(function(_, q){ return X(NT - 1 + q); }), comp.slice(NT - 1).map(function(c){ return TY(c.tr); })); stroke(ctx, C.c[1], 2.4);
     tx(ctx, fmt(tl, 0), tb[0] - 6, tb[1] + tb[3], {s:11, c:C.muted, a:"right"}); tx(ctx, fmt(th, 0), tb[0] - 6, tb[1] + 10, {s:11, c:C.muted, a:"right"});
     /* fila de componentes */
     var rb = 314, rh = 92;
     var panel = function(bx, title, on){ cap(ctx, title, bx[0], bx[1] - 8, C); ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(bx[0] + .5, bx[1] + .5, bx[2], bx[3]); if(!on){ tx(ctx, "desactivado", bx[0] + bx[2] / 2, bx[1] + bx[3] / 2 + 4, {s:12, c:C.muted, a:"center"}); } return on; };
     var wb = [56, rb, 190, rh];
     if(panel(wb, "Semanal", use.wk)){
       var WD = ["L", "M", "X", "J", "V", "S", "D"], wv = [1, 2, 3, 4, 5, 6, 0].map(function(w){ for(var q = 0; q < 7; q++) if(date(q).getUTCDay() === w) return comp[q].wk; });
       var wl = Math.min.apply(null, wv.concat([0])), wh = Math.max.apply(null, wv.concat([0])), WY = function(v){ return wb[1] + wb[3] - 16 - (v - wl) / (wh - wl || 1) * (wb[3] - 26); };
       seg(ctx, wb[0], WY(0), wb[0] + wb[2], WY(0), hexA(C.muted, 0.6), 1, [3, 3]);
       wv.forEach(function(v, q){ var x = wb[0] + 14 + q * (wb[2] - 28) / 6; ctx.fillStyle = v >= 0 ? hexA(C.c[0], 0.8) : hexA(C.c[0], 0.35); ctx.fillRect(x - 7, Math.min(WY(v), WY(0)), 14, Math.abs(WY(v) - WY(0))); tx(ctx, WD[q], x, wb[1] + wb[3] - 3, {s:11, c:C.muted, a:"center"}); });
       tx(ctx, (wh >= 0 ? "+" : "") + fmt(wh, 0), wb[0] + wb[2] - 4, wb[1] + 12, {s:11, w:600, c:C.ink, a:"right"});
     }
     var yb = [276, rb, 250, rh];
     if(panel(yb, "Anual", use.yr)){
       var yv = []; for(var q = 0; q < 366; q++) yv.push(comp[q].yr);
       var yl = Math.min.apply(null, yv), yh = Math.max.apply(null, yv), YY = function(v){ return yb[1] + yb[3] - 16 - (v - yl) / (yh - yl || 1) * (yb[3] - 24); };
       seg(ctx, yb[0], YY(0), yb[0] + yb[2], YY(0), hexA(C.muted, 0.6), 1, [3, 3]);
       pathXY(ctx, yv.map(function(_, q){ return yb[0] + 4 + q / 365 * (yb[2] - 8); }), yv.map(YY)); stroke(ctx, C.c[0], 2);
       [0, 3, 6, 9].forEach(function(mm){ tx(ctx, MES[mm], yb[0] + 4 + (mm * 30.4 + 15) / 365 * (yb[2] - 8), yb[1] + yb[3] - 3, {s:11, c:C.muted, a:"center"}); });
     }
     var hb = [556, rb, 190, rh];
     if(panel(hb, "Festivos", use.hol)){
       var hv = [0, 1, 2].map(function(k){ return beta[iH + k] * ymax; }), hm = Math.max.apply(null, hv.concat([1]));
       hv.forEach(function(v, k){ var yy2 = hb[1] + 18 + k * 25; tx(ctx, HN[k], hb[0] + 8, yy2 + 4, {s:11, c:C.text});
         ctx.fillStyle = C.c[1]; rrect(ctx, hb[0] + 90, yy2 - 5, Math.max(3, (hb[2] - 130) * Math.max(0, v) / hm), 10, 3); ctx.fill();
         tx(ctx, "+" + fmt(v, 0), hb[0] + hb[2] - 6, yy2 + 4, {s:11, w:600, c:C.ink, a:"right"}); });
     }
     /* lectura */
     var mape = 0, mae = 0; for(d = NT; d < ND; d++){ mape += Math.abs(y[d] - comp[d].yh) / y[d]; mae += Math.abs(y[d] - comp[d].yh); } mape /= NV; mae /= NV;
     var slope = (comp[ND - 1].tr - comp[NT - 1].tr) / NV;
     read.innerHTML = '<span>MAPE validación (90 días) <b>' + pct(mape, 1) + '</b></span><span>MAE <b>' + fmt(mae, 1) + ' pedidos/día</b></span>' +
       '<span>Puntos de cambio usados <b>' + used + ' de ' + NCP + '</b></span><span>Pendiente final de la tendencia <b>' + (slope >= 0 ? "+" : "") + fmt(slope, 2) + ' pedidos/día</b></span>' +
       '<span class="ldiag">' + (TAUS[ti] <= 0.005 ? "Tendencia muy rígida: casi una recta. No puede seguir la aceleración de 2024 ni el frenazo de 2025, y extrapola la pendiente media." :
         TAUS[ti] >= 0.5 ? "Tendencia muy flexible: se dobla en muchos sitios y persigue el ruido. El pronóstico depende del <b>último tramo</b>, que puede ser casualidad." :
         "Flexibilidad intermedia (0,05 es el valor por defecto de Prophet): la tendencia capta los cambios grandes sin perseguir el ruido.") +
       (!use.hol ? " Sin festivos, el pico de <b>Black Friday</b> en validación se escapa: compara el MAPE." : "") + ' El MAPE dice cuánto se desvía de media el pronóstico, en % de los pedidos reales.</span>';
   }
   var tmo = 0;
   ctlSlider(ctl, "changepoint_prior_scale (flexibilidad de la tendencia)", 0, TAUS.length - 1, 1, ti, function(v){ return String(TAUS[v]).replace(".", ","); }, function(v){ ti = v; clearTimeout(tmo); tmo = setTimeout(function(){ compute(); draw(); }, 30); });
   ctlCheck(ctl, "Estacionalidad semanal", true, function(v){ use.wk = v; compute(); draw(); });
   ctlCheck(ctl, "Estacionalidad anual", true, function(v){ use.yr = v; compute(); draw(); });
   ctlCheck(ctl, "Festivos", true, function(v){ use.hol = v; compute(); draw(); });
   compute(); draw();
   return function(){ clearTimeout(tmo); };
 }});

})();
