/* ══════════════════════════════════════════════════════════════
   VIZ · lote A — un visual propio por modelo (regresión y clasificación clásicas)
   linsimple · ridge · lasso · elastic · poisson · quantile · bayesridge · svr · gbr
   logistica · lda · qda · nb · knn
   Todo se calcula de verdad con datos sintéticos deterministas (mulberry).
   ══════════════════════════════════════════════════════════════ */
(function(){

/* ── utilidades de dibujo ── */
function isMob(){ return !!(window.matchMedia && window.matchMedia("(max-width:640px)").matches); }
function T(ctx, s, x, y, col, o){
  o = o || {};
  ctx.save();
  ctx.font = (o.w ? o.w + " " : "") + (o.s || 11.5) + "px " + LABFONT;
  ctx.textAlign = o.a || "left"; ctx.textBaseline = o.b || "alphabetic";
  if(o.halo){ ctx.lineJoin = "round"; ctx.strokeStyle = o.halo; ctx.lineWidth = 4; ctx.strokeText(s, x, y); }
  ctx.fillStyle = col; ctx.fillText(s, x, y);
  ctx.restore();
}
function tw(ctx, s, size, w){ ctx.save(); ctx.font = (w ? w + " " : "") + (size || 11.5) + "px " + LABFONT; var m = ctx.measureText(s).width; ctx.restore(); return m; }
function poly(ctx, pts){ ctx.beginPath(); for(var i = 0; i < pts.length; i++){ if(i) ctx.lineTo(pts[i][0], pts[i][1]); else ctx.moveTo(pts[i][0], pts[i][1]); } }
function clip(ctx, b){ ctx.save(); ctx.beginPath(); ctx.rect(b[0], b[1], b[2], b[3]); ctx.clip(); }
function hline(ctx, x0, x1, y, col, dash, lw){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw || 1; if(dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore(); }
function vline(ctx, x, y0, y1, col, dash, lw){ ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = lw || 1; if(dash) ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); ctx.restore(); }
/* rejilla suave por debajo de los datos */
function gridY(ctx, box, A, ys, C){ ys.forEach(function(v){ var y = Math.round(A.sy(v)) + .5; if(y > box[1] + 1 && y < box[1] + box[3] - 1) hline(ctx, box[0], box[0] + box[2], y, hexA(C.line, 0.9)); }); }
function gridX(ctx, box, A, xs, C){ xs.forEach(function(v){ var x = Math.round(A.sx(v)) + .5; if(x > box[0] + 1 && x < box[0] + box[2] - 1) vline(ctx, x, box[1], box[1] + box[3], hexA(C.line, 0.9)); }); }
/* marcadores con forma (no dependemos solo del color) */
function mark(ctx, kind, x, y, r, fill, stroke, lw){
  ctx.beginPath();
  if(kind === "s") ctx.rect(x - r * .85, y - r * .85, r * 1.7, r * 1.7);
  else if(kind === "t"){ ctx.moveTo(x, y - r * 1.1); ctx.lineTo(x + r, y + r * .75); ctx.lineTo(x - r, y + r * .75); ctx.closePath(); }
  else if(kind === "d"){ ctx.moveTo(x, y - r * 1.15); ctx.lineTo(x + r * 1.15, y); ctx.lineTo(x, y + r * 1.15); ctx.lineTo(x - r * 1.15, y); ctx.closePath(); }
  else if(kind === "x"){ ctx.save(); ctx.strokeStyle = fill; ctx.lineWidth = lw || 2; ctx.moveTo(x - r, y - r); ctx.lineTo(x + r, y + r); ctx.moveTo(x + r, y - r); ctx.lineTo(x - r, y + r); ctx.stroke(); ctx.restore(); return; }
  else if(kind === "star"){ for(var i = 0; i < 10; i++){ var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; if(i) ctx.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); else ctx.moveTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); } ctx.closePath(); }
  else ctx.arc(x, y, r, 0, Math.PI * 2);
  if(fill){ ctx.fillStyle = fill; ctx.fill(); }
  if(stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1.2; ctx.stroke(); }
}
/* leyenda horizontal: items = [[texto, color, tipo]] tipo: line | dash | o | s | t | x | sq | band */
function legend(ctx, items, x, y, C, alignRight){
  var widths = items.map(function(it){ return 22 + tw(ctx, it[0], 11.5); }), total = widths.reduce(function(a, b){ return a + b + 14; }, -14);
  var cx = alignRight ? x - total : x;
  items.forEach(function(it, i){
    var k = it[2] || "o", c = it[1];
    if(k === "line" || k === "dash"){ ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 2.5; if(k === "dash") ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(cx, y - 4); ctx.lineTo(cx + 16, y - 4); ctx.stroke(); ctx.restore(); }
    else if(k === "band"){ ctx.fillStyle = hexA(c, 0.22); ctx.fillRect(cx, y - 10, 16, 12); }
    else if(k === "sq"){ ctx.fillStyle = c; ctx.fillRect(cx + 2, y - 10, 12, 12); }
    else if(k === "ring") mark(ctx, "o", cx + 8, y - 4, 4.5, null, c, 1.6);
    else mark(ctx, k, cx + 8, y - 4, 4.5, c, null);
    T(ctx, it[0], cx + 22, y, C.text);
    cx += widths[i] + 14;
  });
}
function inBox(b, p){ return p[0] >= b[0] && p[0] <= b[0] + b[2] && p[1] >= b[1] && p[1] <= b[1] + b[3]; }
function toData(b, xr, yr, p){ return [xr[0] + (p[0] - b[0]) / b[2] * (xr[1] - xr[0]), yr[0] + (b[1] + b[3] - p[1]) / b[3] * (yr[1] - yr[0])]; }
function clamp(v, a, b){ return v < a ? a : v > b ? b : v; }
function sgm(z){ return 1 / (1 + Math.exp(-z)); }
function mean(a){ var s = 0; for(var i = 0; i < a.length; i++) s += a[i]; return s / a.length; }
function sd(a){ var m = mean(a), s = 0; for(var i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m); return Math.sqrt(s / Math.max(1, a.length - 1)); }
function signed(x, d){ return (x >= 0 ? "+" : "−") + fmt(Math.abs(x), d); }
/* en móvil los gráficos se deslizan en horizontal: no bloqueamos el gesto */
function touchMode(cv){ cv.style.touchAction = isMob() ? "pan-x pan-y" : "pan-y"; }
/* soft-threshold y descenso por coordenadas (Elastic Net; ρ=1 → Lasso; ρ=0 → Ridge)
   objetivo: (1/2n)·Σ(y − Xβ)² + α·[ρ·|β|₁ + (1−ρ)/2·|β|²]  (X estandarizada, y centrada) */
function soft(z, g){ return z > g ? z - g : z < -g ? z + g : 0; }
function enetCD(cols, y, alpha, rho, warm, maxIt){
  var p = cols.length, n = y.length, b = warm ? warm.slice() : new Array(p).fill(0), r = y.slice(), j, i;
  for(j = 0; j < p; j++) if(b[j]) for(i = 0; i < n; i++) r[i] -= cols[j][i] * b[j];
  var nr = cols.map(function(c){ var s = 0; for(var k = 0; k < n; k++) s += c[k] * c[k]; return s / n; });
  for(var it = 0; it < (maxIt || 500); it++){
    var md = 0;
    for(j = 0; j < p; j++){
      var c = cols[j], z = 0;
      for(i = 0; i < n; i++) z += c[i] * r[i];
      z = z / n + nr[j] * b[j];
      var nb = soft(z, alpha * rho) / (nr[j] + alpha * (1 - rho)), d = nb - b[j];
      if(d !== 0){ for(i = 0; i < n; i++) r[i] -= c[i] * d; b[j] = nb; if(Math.abs(d) > md) md = Math.abs(d); }
    }
    if(md < 1e-7) break;
  }
  return b;
}
function standardize(cols){
  return cols.map(function(c){ var m = mean(c), s = Math.sqrt(c.reduce(function(a, v){ return a + (v - m) * (v - m); }, 0) / c.length) || 1;
    return {m:m, s:s, z:c.map(function(v){ return (v - m) / s; })}; });
}
/* árbol de regresión 1D (mínimos cuadrados) para el boosting */
function regTree1D(xs, rs, idx, depth, maxD, minLeaf){
  var n = idx.length, s = 0; idx.forEach(function(i){ s += rs[i]; });
  var v = s / n;
  if(depth >= maxD || n < 2 * minLeaf) return {v:v};
  var srt = idx.slice().sort(function(a, b){ return xs[a] - xs[b]; }), ls = 0, best = null;
  for(var k = 1; k < n; k++){
    ls += rs[srt[k - 1]];
    if(k < minLeaf || n - k < minLeaf || xs[srt[k - 1]] === xs[srt[k]]) continue;
    var g = ls * ls / k + (s - ls) * (s - ls) / (n - k);
    if(!best || g > best.g) best = {g:g, t:(xs[srt[k - 1]] + xs[srt[k]]) / 2};
  }
  if(!best) return {v:v};
  var L = [], R = []; idx.forEach(function(i){ (xs[i] <= best.t ? L : R).push(i); });
  return {t:best.t, l:regTree1D(xs, rs, L, depth + 1, maxD, minLeaf), r:regTree1D(xs, rs, R, depth + 1, maxD, minLeaf)};
}
function treeP(nd, x){ while(nd.l) nd = x <= nd.t ? nd.l : nd.r; return nd.v; }
/* muestreo Poisson y Gamma (para la Binomial Negativa = mezcla Gamma-Poisson) */
function rPois(r, lam){ var L = Math.exp(-lam), k = 0, p = 1; do { k++; p *= r(); } while(p > L && k < 200); return k - 1; }
function rGamma(r, a){
  if(a < 1){ var u = r(); return rGamma(r, 1 + a) * Math.pow(u, 1 / a); }
  var d = a - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for(;;){ var x = gauss(r), v = 1 + c * x; if(v <= 0) continue; v = v * v * v; var u2 = r();
    if(u2 < 1 - 0.0331 * x * x * x * x || Math.log(u2) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v; }
}
function lgam(n){ var s = 0; for(var i = 2; i <= n; i++) s += Math.log(i); return s; }
/* contorno por «marching squares» de una función f(x,y) = 0 en una rejilla */
function contour(ctx, box, xr, yr, f, step){
  var nx = Math.ceil(box[2] / step), ny = Math.ceil(box[3] / step), V = [];
  for(var j = 0; j <= ny; j++){ var row = []; for(var i = 0; i <= nx; i++){ var d = toData(box, xr, yr, [box[0] + i * step, box[1] + j * step]); row.push(f(d[0], d[1])); } V.push(row); }
  ctx.beginPath();
  function ip(a, b){ return a / (a - b); }
  for(j = 0; j < ny; j++) for(i = 0; i < nx; i++){
    var a = V[j][i], b = V[j][i + 1], c = V[j + 1][i + 1], d2 = V[j + 1][i], x0 = box[0] + i * step, y0 = box[1] + j * step, pts = [];
    if((a > 0) !== (b > 0)) pts.push([x0 + ip(a, b) * step, y0]);
    if((b > 0) !== (c > 0)) pts.push([x0 + step, y0 + ip(b, c) * step]);
    if((d2 > 0) !== (c > 0)) pts.push([x0 + ip(d2, c) * step, y0 + step]);
    if((a > 0) !== (d2 > 0)) pts.push([x0, y0 + ip(a, d2) * step]);
    if(pts.length >= 2){ ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[1][0], pts[1][1]); }
    if(pts.length === 4){ ctx.moveTo(pts[2][0], pts[2][1]); ctx.lineTo(pts[3][0], pts[3][1]); }
  }
  ctx.stroke();
}
/* mini-tarjeta de cifra para los paneles laterales */
function stat(ctx, x, y, label, value, sub, C, col){
  T(ctx, label, x, y, C.muted, {s:11, w:"600"});
  T(ctx, value, x, y + 27, col || C.ink, {s:24, w:"700"});
  if(sub) T(ctx, sub, x, y + 44, C.muted, {s:11});
}
function bar(ctx, x, y, w, h, col){ ctx.fillStyle = col; ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(x, y, Math.max(0, w), h, Math.min(3, h / 2)); else ctx.rect(x, y, Math.max(0, w), h); ctx.fill(); }

/* ══════════ 1. REGRESIÓN LINEAL SIMPLE ══════════ */
VIZ.push({id:"v-linsimple", model:"linsimple", g:"model", ic:"📏", dim:"2D",
 t:"La recta de mínimos cuadrados",
 q:"¿Qué recta elige la regresión lineal entre todas las posibles, y por qué esa?",
 intro:"Cada punto es un mes: lo que invertiste en <b>publicidad</b> y lo que <b>vendiste</b>. Las líneas naranjas son los <b>residuos</b> (cuánto se equivoca la recta en cada mes). La regresión elige la recta que hace mínima la <b>suma de los residuos al cuadrado</b>. Activa «Ajusta tú» y arrastra las dos asas para intentar ganarle; haz clic en el gráfico para añadir meses.",
 notice:["Marca «Ver los cuadrados»: cada residuo se convierte en un cuadrado (su área es el residuo al cuadrado). La recta óptima es la que deja <b>menos área naranja en total</b>: mueve las asas como quieras y tu SSE nunca bajará de la óptima.",
   "Pulsa «Añadir un outlier»: un solo mes raro <b>tira de la recta</b> y cambia la pendiente, porque al elevar al cuadrado un error grande pesa muchísimo.",
   "La pendiente se lee en euros: «cada 1 k€ más de publicidad se asocia a ≈ X k€ más de ventas». Es una <b>asociación</b> en estos datos, no una prueba de causa."],
 models:["linsimple","linmult","ridge","quantile"],
 build:function(stage, ctl, read, C){
   var W = 720, H = 400, K = makeCanvas(stage, W, H, "Dispersión de publicidad frente a ventas con la recta de mínimos cuadrados y sus residuos"), ctx = K.ctx;
   var box = [64, 22, 440, 320], XR = [0, 34], YR = [0, 150];
   var base = [], pts = [], mode = "opt", sq = false, hand = [[4, 74], [30, 98]], drag = -1, A;
   (function(){ var r = mulberry(21); for(var i = 0; i < 25; i++){ var x = 2 + 28 * r(); base.push([x, 38 + 2.2 * x + 9 * gauss(r)]); } })();
   function reset(){ pts = base.map(function(p){ return p.slice(); }); }
   function fit(){
     var n = pts.length, mx = 0, my = 0; pts.forEach(function(p){ mx += p[0]; my += p[1]; }); mx /= n; my /= n;
     var sxy = 0, sxx = 0; pts.forEach(function(p){ sxy += (p[0] - mx) * (p[1] - my); sxx += (p[0] - mx) * (p[0] - mx); });
     var b1 = sxy / sxx; return [my - b1 * mx, b1];
   }
   function sse(l){ return pts.reduce(function(a, p){ var e = p[1] - l[0] - l[1] * p[0]; return a + e * e; }, 0); }
   function sst(){ var my = mean(pts.map(function(p){ return p[1]; })); return pts.reduce(function(a, p){ return a + (p[1] - my) * (p[1] - my); }, 0); }
   function userLine(){ var b1 = (hand[1][1] - hand[0][1]) / (hand[1][0] - hand[0][0]); return [hand[0][1] - b1 * hand[0][0], b1]; }
   function draw(){
     K.clear();
     A = axes(ctx, box, XR, YR, C, {xl:"Inversión en publicidad (k€ al mes)", yl:"Ventas (k€ al mes)", xt:[0, 10, 20, 30], yt:[0, 50, 100, 150]});
     gridY(ctx, box, A, [50, 100], C); gridX(ctx, box, A, [10, 20, 30], C);
     var opt = fit(), l = mode === "opt" ? opt : userLine();
     clip(ctx, box);
     if(mode === "user"){
       ctx.save(); ctx.setLineDash([6, 5]); ctx.strokeStyle = C.muted; ctx.lineWidth = 1.6;
       poly(ctx, [[A.sx(XR[0]), A.sy(opt[0] + opt[1] * XR[0])], [A.sx(XR[1]), A.sy(opt[0] + opt[1] * XR[1])]]); ctx.stroke(); ctx.restore();
     }
     pts.forEach(function(p){
       var px = A.sx(p[0]), py = A.sy(p[1]), ly = A.sy(l[0] + l[1] * p[0]), s = Math.abs(py - ly);
       if(sq && s > 0.5){
         var x0 = px + s < box[0] + box[2] ? px : px - s;
         ctx.fillStyle = hexA(C.c[1], 0.12); ctx.fillRect(x0, Math.min(py, ly), s, s);
         ctx.strokeStyle = hexA(C.c[1], 0.55); ctx.lineWidth = 1; ctx.strokeRect(x0 + .5, Math.min(py, ly) + .5, s - 1, s - 1);
       }
       vline(ctx, px, py, ly, C.c[1], null, 1.8);
     });
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 3;
     poly(ctx, [[A.sx(XR[0]), A.sy(l[0] + l[1] * XR[0])], [A.sx(XR[1]), A.sy(l[0] + l[1] * XR[1])]]); ctx.stroke();
     ctx.restore();
     pts.forEach(function(p, i){ mark(ctx, i >= base.length ? "d" : "o", A.sx(p[0]), A.sy(p[1]), i >= base.length ? 5.5 : 4.6, C.ink, C.card, 1.4); });
     if(mode === "user") hand.forEach(function(h){
       var x = A.sx(h[0]), y = A.sy(h[1]);
       mark(ctx, "o", x, y, 11, hexA(C.c[0], 0.18)); mark(ctx, "o", x, y, 7, C.c[0], C.card, 2);
       T(ctx, "⇕", x, y - 15, C.c[0], {a:"center", w:"700", s:13, halo:C.card});
     });
     legend(ctx, [[mode === "opt" ? "recta de mínimos cuadrados" : "tu recta", C.c[0], "line"]].concat(mode === "user" ? [["óptima", C.muted, "dash"]] : []).concat([["residuo", C.c[1], "line"]]), box[0] + 10, box[1] + 18, C);
     /* panel lateral */
     var px0 = 540, so = sse(opt), su = sse(l), R2 = 1 - so / sst(), mx = Math.max(so, su) * 1.05;
     T(ctx, "Suma de residuos² (SSE)", px0, 38, C.ink, {w:"600", s:12});
     T(ctx, "lo que la regresión hace mínimo", px0, 54, C.muted, {s:11});
     T(ctx, "Mínimos cuadrados", px0, 82, C.muted, {s:11});
     bar(ctx, px0, 88, 92 * so / mx, 14, mode === "opt" ? C.c[0] : C.muted);
     T(ctx, fmt(so, 0), px0 + 92 * so / mx + 6, 100, C.ink, {w:"600", s:11.5});
     if(mode === "user"){
       T(ctx, "Tu recta", px0, 124, C.muted, {s:11});
       bar(ctx, px0, 130, 92 * su / mx, 14, C.c[0]);
       T(ctx, fmt(su, 0), px0 + 92 * su / mx + 6, 142, C.ink, {w:"600", s:11.5});
       T(ctx, su <= so * 1.005 ? "¡empate con la óptima!" : "+" + pct(su / so - 1, 0) + " de error", px0, 162, su <= so * 1.005 ? C.pos : C.neg, {s:11, w:"600"});
     }
     stat(ctx, px0, 200, "R² (recta óptima)", fmt(R2, 2), "de la variación de las ventas", C);
     T(ctx, "la explica la publicidad", px0, 258, C.muted, {s:11});
     stat(ctx, px0, 286, "PENDIENTE " + (mode === "opt" ? "ÓPTIMA" : "TUYA"), fmt(l[1], 2), "k€ de ventas por cada k€", C, C.c[0]);
     T(ctx, "invertido en publicidad", px0, 346, C.muted, {s:11});
     var extra = pts.length - base.length;
     read.innerHTML = '<span>Pendiente óptima <b>' + fmt(opt[1], 2) + '</b></span><span>Intercepto <b>' + fmt(opt[0], 1) + ' k€</b></span><span>R² <b>' + fmt(R2, 2) + '</b></span><span>SSE óptima <b>' + fmt(so, 0) + '</b></span>' +
       (mode === "user" ? '<span>SSE tuya <b>' + fmt(su, 0) + '</b> (' + (su <= so * 1.005 ? "igual" : "+" + pct(su / so - 1, 0)) + ')</span>' : '') +
       '<span>Meses <b>' + pts.length + '</b>' + (extra ? ' (' + extra + ' añadidos ◆)' : '') + '</span>' +
       '<span class="ldiag">' + (mode === "user" && su > so * 1.005
         ? "Tu recta deja <b>" + pct(su / so - 1, 0) + " más</b> de error al cuadrado que la óptima. Acércate a la línea discontinua: es la única recta con el SSE mínimo."
         : "Cada <b>1 k€</b> extra de publicidad se asocia a <b>≈ " + fmt(opt[1], 1) + " k€</b> más de ventas; con 0 € de publicidad la recta predice ≈ " + fmt(opt[0], 0) + " k€ (el intercepto)." +
           (extra ? " Ojo: los puntos añadidos ◆ han movido la pendiente frente a los datos originales." : "")) + '</span>';
   }
   function hitHandle(p){ if(mode !== "user") return -1; for(var i = 0; i < 2; i++){ if(Math.hypot(p[0] - A.sx(hand[i][0]), p[1] - A.sy(hand[i][1])) < 16) return i; } return -1; }
   K.cv.addEventListener("pointerdown", function(e){
     var p = K.pos(e), h = hitHandle(p);
     if(h >= 0){ drag = h; K.cv.setPointerCapture(e.pointerId); return; }
     if(inBox(box, p) && pts.length < 90){ var d = toData(box, XR, YR, p); pts.push(d); draw(); }
   });
   K.cv.addEventListener("pointermove", function(e){
     var p = K.pos(e);
     if(drag >= 0){ hand[drag][1] = clamp(toData(box, XR, YR, p)[1], YR[0], YR[1]); draw(); return; }
     K.cv.style.cursor = hitHandle(p) >= 0 ? "ns-resize" : inBox(box, p) ? "crosshair" : "default";
   });
   K.cv.addEventListener("pointerup", function(){ drag = -1; });
   touchMode(K.cv);
   ctlSeg(ctl, "Recta", [["opt", "Óptima (mínimos cuadrados)"], ["user", "✋ Ajusta tú"]], mode, function(v){ mode = v; draw(); });
   ctlCheck(ctl, "Ver los cuadrados", sq, function(v){ sq = v; draw(); });
   ctlBtn(ctl, "➕ Añadir un outlier", function(){ pts.push([31, 14 + 4 * (pts.length % 3)]); draw(); });
   ctlBtn(ctl, "↺ Datos originales", function(){ reset(); draw(); });
   reset(); draw();
   return function(){};
 }});

/* ══════════ 2. RIDGE: estabilidad con multicolinealidad ══════════ */
VIZ.push({id:"v-ridge", model:"ridge", g:"model", ic:"🧷", dim:"2D",
 t:"Ridge estabiliza los coeficientes",
 q:"¿Por qué Ridge da coeficientes fiables cuando dos variables dicen casi lo mismo?",
 intro:"Queremos medir cuánto aporta a las ventas la inversión en <b>TV</b> y en <b>digital</b>, que se mueven casi juntas (correlación alta). Remuestreamos los mismos datos <b>60 veces</b> (bootstrap) y ajustamos cada vez: cada punto es una pareja de coeficientes estimada. Naranja = regresión normal (OLS); morado = Ridge.",
 notice:["Con correlación 0,95 la nube naranja es <b>enorme y alargada</b> sobre la diagonal: el modelo sabe cuánto suman los dos efectos, pero no cómo repartirlos. Algunos remuestreos dan incluso efectos <b>negativos</b> (zona rayada).",
   "La nube morada (Ridge) es <b>compacta</b>: la penalización elige repartos razonables y la desviación típica cae mucho. Baja la correlación a 0,3 y verás que las dos nubes se parecen.",
   "Ridge no sale gratis: con α muy grande la nube se va hacia el (0, 0). Es el <b>sesgo</b> que pagas a cambio de menos varianza."],
 models:["ridge","linmult","lasso","elastic"],
 build:function(stage, ctl, read, C){
   var W = 720, H = 420, K = makeCanvas(stage, W, H, "Nubes de coeficientes estimados por OLS y por Ridge en 60 remuestreos"), ctx = K.ctx;
   var box = [62, 20, 370, 370], R = [-4, 10];
   var rho = 0.95, la = 1.3, seed = 3, show = "both", S = [], ols = [], rid = [];
   var TRUE = [3, 2];
   function gen(){
     var r = mulberry(seed * 31 + 7), n = 50, X = [], Y = [];
     for(var i = 0; i < n; i++){ var a = gauss(r), b = rho * a + Math.sqrt(1 - rho * rho) * gauss(r); X.push([a, b]); Y.push(TRUE[0] * a + TRUE[1] * b + 4 * gauss(r)); }
     var rb = mulberry(seed * 13 + 99); S = [];
     for(var k = 0; k < 60; k++){
       var m = [0, 0], my = 0, id = [];
       for(i = 0; i < n; i++){ var j = Math.floor(rb() * n); id.push(j); m[0] += X[j][0]; m[1] += X[j][1]; my += Y[j]; }
       m[0] /= n; m[1] /= n; my /= n;
       var A2 = [[0, 0], [0, 0]], b2 = [0, 0];
       id.forEach(function(j){ var u = X[j][0] - m[0], v = X[j][1] - m[1], w = Y[j] - my; A2[0][0] += u * u; A2[0][1] += u * v; A2[1][1] += v * v; b2[0] += u * w; b2[1] += v * w; });
       A2[1][0] = A2[0][1]; S.push([A2, b2]);
     }
   }
   function solve(){
     var al = Math.pow(10, la);
     ols = S.map(function(s){ return solveLin(s[0], s[1]); });
     rid = S.map(function(s){ return solveLin([[s[0][0][0] + al, s[0][0][1]], [s[0][1][0], s[0][1][1] + al]], s[1]); });
   }
   function cov(P){ var m = [mean(P.map(function(p){ return p[0]; })), mean(P.map(function(p){ return p[1]; }))], c = [[0, 0], [0, 0]];
     P.forEach(function(p){ var a = p[0] - m[0], b = p[1] - m[1]; c[0][0] += a * a; c[0][1] += a * b; c[1][1] += b * b; });
     c[0][0] /= P.length - 1; c[0][1] /= P.length - 1; c[1][1] /= P.length - 1; c[1][0] = c[0][1]; return {m:m, c:c}; }
   function ellipse(A, P, col){
     var q = cov(P), E = jacobiEig(q.c); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); ctx.beginPath();
     for(var k = 0; k <= 120; k++){ var t = k / 120 * 2 * Math.PI, u = 2 * Math.sqrt(Math.max(E[0].val, 0)) * Math.cos(t), v = 2 * Math.sqrt(Math.max(E[1].val, 0)) * Math.sin(t);
       var x = q.m[0] + u * E[0].vec[0] + v * E[1].vec[0], y = q.m[1] + u * E[0].vec[1] + v * E[1].vec[1]; if(k) ctx.lineTo(A.sx(x), A.sy(y)); else ctx.moveTo(A.sx(x), A.sy(y)); }
     ctx.stroke(); ctx.restore();
   }
   function negShare(P){ return P.filter(function(p){ return p[0] < 0 || p[1] < 0; }).length / P.length; }
   function draw(){
     K.clear();
     var A = axes(ctx, box, R, R, C, {xl:"β TV  (ventas extra por unidad de TV)", yl:"β digital", xt:[-4, 0, 4, 8], yt:[-4, 0, 4, 8]});
     gridY(ctx, box, A, [4, 8], C); gridX(ctx, box, A, [4, 8], C);
     clip(ctx, box);
     /* zona de signo imposible, rayada */
     ctx.save(); ctx.beginPath(); ctx.rect(box[0], box[1], A.sx(0) - box[0], box[3]); ctx.rect(A.sx(0), A.sy(0), box[0] + box[2] - A.sx(0), box[1] + box[3] - A.sy(0)); ctx.clip();
     ctx.fillStyle = hexA(C.neg, 0.05); ctx.fillRect(box[0], box[1], box[2], box[3]);
     ctx.strokeStyle = hexA(C.neg, 0.16); ctx.lineWidth = 1; ctx.beginPath();
     for(var d = -box[3]; d < box[2]; d += 9){ ctx.moveTo(box[0] + d, box[1] + box[3]); ctx.lineTo(box[0] + d + box[3], box[1]); } ctx.stroke(); ctx.restore();
     hline(ctx, box[0], box[0] + box[2], A.sy(0), C.muted, null, 1); vline(ctx, A.sx(0), box[1], box[1] + box[3], C.muted, null, 1);
     /* diagonal: la suma está bien medida */
     ctx.save(); ctx.setLineDash([2, 4]); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; poly(ctx, [[A.sx(-4), A.sy(9)], [A.sx(10), A.sy(-5)]]); ctx.stroke(); ctx.restore();
     if(show !== "ridge"){ ols.forEach(function(p){ mark(ctx, "o", A.sx(p[0]), A.sy(p[1]), 3.6, null, C.c[1], 1.4); }); ellipse(A, ols, C.c[1]); }
     if(show !== "ols"){ rid.forEach(function(p){ mark(ctx, "o", A.sx(p[0]), A.sy(p[1]), 3.6, hexA(C.c[0], 0.85)); }); ellipse(A, rid, C.c[0]); }
     ctx.restore();
     mark(ctx, "x", A.sx(TRUE[0]), A.sy(TRUE[1]), 7, C.ink, null, 2.6);
     T(ctx, "verdad (3, 2)", A.sx(TRUE[0]) + 10, A.sy(TRUE[1]) + 18, C.ink, {w:"600", halo:C.card});
     T(ctx, "β TV + β digital ≈ 5", A.sx(7.6), A.sy(-2.2), C.ink, {s:11, a:"center", halo:C.card});
     T(ctx, "▼ signo imposible (invertir restaría ventas)", box[0] + 8, box[1] + box[3] - 8, C.neg, {s:11, w:"600", halo:C.card});
     legend(ctx, [["OLS", C.c[1], "ring"], ["Ridge", C.c[0], "o"], ["elipse ≈ 95%", C.muted, "dash"]], box[0] + box[2] - 8, box[1] + 18, C, true);
     /* panel lateral */
     var px = 476, sO = [sd(ols.map(function(p){ return p[0]; })), sd(ols.map(function(p){ return p[1]; }))], sR = [sd(rid.map(function(p){ return p[0]; })), sd(rid.map(function(p){ return p[1]; }))];
     var nO = negShare(ols), nR = negShare(rid), mxs = Math.max(sO[0], sO[1], sR[0], sR[1], 0.5);
     T(ctx, "Variabilidad de cada coeficiente", px, 36, C.ink, {w:"600", s:12.5});
     T(ctx, "desviación típica entre remuestreos", px, 52, C.muted, {s:11});
     [["β TV", 0], ["β digital", 1]].forEach(function(g, k){
       var y = 78 + k * 66;
       T(ctx, g[0], px, y, C.text, {w:"600", s:11.5});
       bar(ctx, px, y + 7, 150 * sO[g[1]] / mxs, 13, C.c[1]); T(ctx, fmt(sO[g[1]], 2), px + 150 * sO[g[1]] / mxs + 6, y + 18, C.ink, {s:11.5, w:"600"});
       bar(ctx, px, y + 25, 150 * sR[g[1]] / mxs, 13, C.c[0]); T(ctx, fmt(sR[g[1]], 2), px + 150 * sR[g[1]] / mxs + 6, y + 36, C.ink, {s:11.5, w:"600"});
     });
     T(ctx, "Remuestreos con signo negativo", px, 228, C.ink, {w:"600", s:12.5});
     bar(ctx, px, 240, 150 * nO, 13, C.c[1]); T(ctx, "OLS " + pct(nO, 0), px + 150 * nO + 6, 251, C.ink, {s:11.5, w:"600"});
     bar(ctx, px, 258, 150 * nR, 13, C.c[0]); T(ctx, "Ridge " + pct(nR, 0), px + 150 * nR + 6, 269, C.ink, {s:11.5, w:"600"});
     var mR = cov(rid).m;
     T(ctx, "Media de Ridge", px, 312, C.muted, {s:11, w:"600"});
     T(ctx, "(" + fmt(mR[0], 1) + " ; " + fmt(mR[1], 1) + ")", px, 336, C.c[0], {s:20, w:"700"});
     T(ctx, "frente a la verdad (3 ; 2):", px, 354, C.muted, {s:11}); T(ctx, "ese hueco es el sesgo de Ridge", px, 369, C.muted, {s:11});
     var red = 1 - (sR[0] + sR[1]) / (sO[0] + sO[1]);
     read.innerHTML = '<span>α Ridge <b>' + fmt(Math.pow(10, la), Math.pow(10, la) < 1 ? 2 : 0) + '</b></span><span>Correlación TV–digital <b>' + fmt(rho, 2) + '</b></span>' +
       '<span>Desv. típica OLS <b>' + fmt(sO[0], 2) + ' / ' + fmt(sO[1], 2) + '</b></span><span>Desv. típica Ridge <b>' + fmt(sR[0], 2) + ' / ' + fmt(sR[1], 2) + '</b></span>' +
       '<span>Signo «imposible» <b>OLS ' + pct(nO, 0) + ' · Ridge ' + pct(nR, 0) + '</b></span>' +
       '<span class="ldiag">' + (rho < 0.6 ? "Con poca correlación cada variable aporta información propia: OLS ya es estable y Ridge apenas cambia nada."
         : red > 0.3 ? "<b class='lgood'>Ridge reduce la variabilidad un " + pct(red, 0) + "</b>: con OLS, un remuestreo distinto puede cambiar por completo el reparto entre TV y digital; con Ridge el reparto es estable."
         : "Con α tan pequeño Ridge casi coincide con OLS: sube α para ver cómo se compacta la nube.") +
         (Math.pow(10, la) > 300 ? " <b class='lwarn'>α muy alto:</b> la nube se acerca a (0, 0) y los efectos quedan infravalorados (sesgo)." : "") + '</span>';
   }
   ctlSlider(ctl, "Penalización α de Ridge (escala log)", -1, 3, 0.05, la, function(v){ var a = Math.pow(10, v); return fmt(a, a < 1 ? 2 : a < 10 ? 1 : 0); }, function(v){ la = v; solve(); draw(); });
   ctlSlider(ctl, "Correlación TV–digital", 0, 0.99, 0.01, rho, function(v){ return fmt(v, 2); }, function(v){ rho = v; gen(); solve(); draw(); });
   ctlSeg(ctl, "Mostrar", [["both", "Ambos"], ["ols", "OLS"], ["ridge", "Ridge"]], show, function(v){ show = v; draw(); });
   ctlBtn(ctl, "🎲 Otros datos", function(){ seed++; gen(); solve(); draw(); });
   gen(); solve(); draw();
   return function(){};
 }});

/* ══════════ 3. LASSO: camino de coeficientes ══════════ */
VIZ.push({id:"v-lasso", model:"lasso", g:"model", ic:"✂️", dim:"2D",
 t:"El camino de Lasso",
 q:"¿Cómo decide Lasso qué variables se quedan y cuáles salen del modelo?",
 intro:"Queremos predecir las ventas semanales con <b>8 variables candidatas</b>, pero solo <b>3 importan de verdad</b> (★): precio, descuento y publicidad. Cada línea es el coeficiente de una variable (estandarizado: efecto de subirla una desviación típica) según la fuerza de la penalización <b>α</b>. Todo se calcula con <b>descenso por coordenadas</b>, el mismo algoritmo que usa scikit-learn.",
 notice:["Al subir α (hacia la derecha) los coeficientes encogen y, uno a uno, se quedan en <b>exactamente 0</b>: las variables de ruido (grises) son las primeras en salir.",
   "Hay una zona de α en la que solo quedan las <b>3 variables reales</b>: ahí Lasso ha hecho selección de variables por ti. El triángulo ▲ marca el α con menos error en datos nuevos (test).",
   "Cambia a Ridge: los caminos se aplastan hacia 0 pero <b>nunca llegan</b>. Ridge encoge; Lasso encoge y además elimina."],
 models:["lasso","ridge","elastic","linmult"],
 build:function(stage, ctl, read, C){
   var W = 720, H = 400, K = makeCanvas(stage, W, H, "Camino de coeficientes de Lasso según la penalización alfa"), ctx = K.ctx;
   var box = [64, 24, 390, 310];
   var names = ["precio", "descuento", "publicidad", "día de la semana", "temperatura", "nº de tienda", "color de la web", "lluvia"];
   var TB = [-4, 3, 2, 0, 0, 0, 0, 0], mode = "lasso", t = 0.7, seed = 5, P = {}, Z, yc;
   function gen(){
     var r = mulberry(seed * 17 + 3), n = 80, nt = 400, X = [], Y = [], Xt = [], Yt = [];
     function row(){ var c = gauss(r), x = []; for(var j = 0; j < 8; j++) x.push(0.45 * c + gauss(r)); var y = 50; for(j = 0; j < 8; j++) y += TB[j] * x[j]; return [x, y + 3 * gauss(r)]; }
     for(var i = 0; i < n; i++){ var q = row(); X.push(q[0]); Y.push(q[1]); }
     for(i = 0; i < nt; i++){ q = row(); Xt.push(q[0]); Yt.push(q[1]); }
     var cols = []; for(var j = 0; j < 8; j++) cols.push(X.map(function(x){ return x[j]; }));
     var st = standardize(cols); Z = st.map(function(s){ return s.z; });
     var ym = mean(Y); yc = Y.map(function(v){ return v - ym; });
     function mse(b){ var s = 0; Xt.forEach(function(x, i){ var p = ym; for(var j = 0; j < 8; j++) p += b[j] * (x[j] - st[j].m) / st[j].s; s += (Yt[i] - p) * (Yt[i] - p); }); return s / Xt.length; }
     var amax = 0; for(j = 0; j < 8; j++){ var s = 0; for(i = 0; i < n; i++) s += Z[j][i] * yc[i]; amax = Math.max(amax, Math.abs(s) / n); }
     var G = 90, hi = Math.log10(amax) + 0.15, lo = Math.log10(amax) - 2.6, path = [], warm = null;
     for(var g = 0; g < G; g++){ var la = hi - (hi - lo) * g / (G - 1); warm = enetCD(Z, yc, Math.pow(10, la), 1, warm, 1000); path.push({la:la, b:warm.slice(), mse:mse(warm)}); }
     P.lasso = path.reverse();
     var XtX = [], Xty = []; for(j = 0; j < 8; j++){ XtX.push([]); var sy = 0; for(i = 0; i < n; i++) sy += Z[j][i] * yc[i]; Xty.push(sy / n);
       for(var k = 0; k < 8; k++){ var s2 = 0; for(i = 0; i < n; i++) s2 += Z[j][i] * Z[k][i]; XtX[j].push(s2 / n); } }
     var rp = []; for(g = 0; g < G; g++){ la = -2 + 5.2 * g / (G - 1); var al = Math.pow(10, la), A2 = XtX.map(function(rw, a){ return rw.map(function(v, b){ return v + (a === b ? al : 0); }); });
       var b = solveLin(A2, Xty); rp.push({la:la, b:b, mse:mse(b)}); }
     P.ridge = rp;
   }
   function draw(){
     K.clear();
     var path = P[mode], G = path.length, idx = Math.round(t * (G - 1)), cur = path[idx];
     var xr = [path[0].la, path[G - 1].la], M = 0; path.forEach(function(p){ p.b.forEach(function(v){ M = Math.max(M, Math.abs(v)); }); }); M = Math.ceil(M + 0.3);
     var xt = []; for(var v = Math.ceil(xr[0]); v <= Math.floor(xr[1]); v++) xt.push(v);
     var A = axes(ctx, box, xr, [-M, M], C, {xl:"log₁₀ α   (← menos penalización · más penalización →)", yl:"coeficiente (estandarizado)", xt:xt, yt:[-M, 0, M]});
     gridX(ctx, box, A, xt, C);
     hline(ctx, box[0], box[0] + box[2], A.sy(0), C.ink, [4, 4], 1);
     clip(ctx, box);
     var order = [3, 4, 5, 6, 7, 0, 1, 2];
     order.forEach(function(j){
       var real = j < 3; ctx.strokeStyle = real ? C.c[j] : hexA(C.muted, 0.75); ctx.lineWidth = real ? 2.6 : 1.4;
       poly(ctx, path.map(function(p){ return [A.sx(p.la), A.sy(p.b[j])]; })); ctx.stroke();
     });
     var best = path.reduce(function(a, p, i){ return p.mse < path[a].mse ? i : a; }, 0), bx = A.sx(path[best].la);
     vline(ctx, A.sx(cur.la), box[1], box[1] + box[3], C.ink, null, 1.6);
     ctx.restore();
     mark(ctx, "t", bx, box[1] + box[3] - 7, 5.5, C.ink);
     legend(ctx, [["α con menor error en test", C.ink, "t"]], box[0] + box[2] - 8, box[1] + 36, C, true);
     var lx = A.sx(cur.la);
     T(ctx, "α = " + fmt(Math.pow(10, cur.la), Math.pow(10, cur.la) < 1 ? 3 : 1), clamp(lx, box[0] + 40, box[0] + box[2] - 40), box[1] + 14, C.ink, {w:"600", a:"center", halo:C.card});
     var lab = [0, 1, 2].map(function(j){ var y0 = path[0].b[j]; return [j, A.sy(y0) + (y0 > 0 ? -8 : 16)]; }).sort(function(a, b){ return a[1] - b[1]; });
     for(var q = 1; q < 3; q++) if(lab[q][1] - lab[q - 1][1] < 15) lab[q][1] = lab[q - 1][1] + 15;
     lab.forEach(function(l){ T(ctx, "★ " + names[l[0]], box[0] + 8, l[1], C.c[l[0]], {w:"600", s:11.5, halo:C.card}); });
     T(ctx, "5 variables de ruido", box[0] + 8, A.sy(0) + 16, C.muted, {s:11, halo:C.card});
     /* panel de barras */
     var px = 490, cx = 595, hw = 82, kept = [];
     T(ctx, "Coeficientes con ese α", px, 36, C.ink, {w:"600", s:12.5});
     names.forEach(function(nm, j){
       var y = 62 + j * 37, b = cur.b[j], zero = b === 0, real = j < 3, col = real ? C.c[j] : C.muted;
       if(!zero) kept.push(j);
       T(ctx, (real ? "★ " : "") + nm, px, y, real ? C.ink : C.text, {s:11.5, w:real ? "600" : ""});
       T(ctx, zero ? "0 · fuera" : fmt(b, 2), 705, y, zero ? C.muted : C.ink, {s:11.5, w:"600", a:"right"});
       ctx.fillStyle = hexA(C.line, 1); ctx.fillRect(cx - hw, y + 7, 2 * hw, 8);
       vline(ctx, cx, y + 4, y + 18, C.muted, null, 1);
       if(!zero){ var w = hw * Math.min(1, Math.abs(b) / M); bar(ctx, b > 0 ? cx : cx - w, y + 6, w, 10, col); }
       else mark(ctx, "o", cx, y + 11, 3.5, C.card, C.muted, 1.4);
     });
     var nr = kept.filter(function(j){ return j >= 3; }).length, nreal = kept.filter(function(j){ return j < 3; }).length;
     read.innerHTML = '<span>Modelo <b>' + (mode === "lasso" ? "Lasso (L1)" : "Ridge (L2)") + '</b></span><span>Variables retenidas <b>' + kept.length + ' de 8</b></span>' +
       '<span>Ruido descartado <b>' + (5 - nr) + ' de 5</b></span><span>Error test (MSE) <b>' + fmt(cur.mse, 1) + '</b> · mínimo ' + fmt(path[best].mse, 1) + '</span>' +
       '<span class="ldiag">' + (mode === "ridge" ? "Ridge mantiene las <b>8 variables</b> con coeficiente distinto de cero, aunque sea minúsculo: no selecciona. Útil para estabilizar, no para simplificar."
         : kept.length === 0 ? "<b class='lwarn'>Penalización máxima:</b> todas las variables valen 0 y el modelo predice siempre la media."
         : "Se quedan: <b>" + kept.map(function(j){ return names[j]; }).join(", ") + "</b>." + (nr === 0 && nreal === 3 ? " <b class='lgood'>Justo las 3 que importan:</b> Lasso ha descartado todo el ruido." : nr > 0 ? " Aún entra ruido: sube α para limpiar." : " <b class='lwarn'>Demasiada penalización:</b> ya está tirando variables reales.")) + '</span>';
   }
   gen();
   ctlSeg(ctl, "Penalización", [["lasso", "Lasso (L1)"], ["ridge", "Ridge (L2)"]], mode, function(v){ mode = v; draw(); });
   ctlSlider(ctl, "Fuerza α (posición en el eje)", 0, 1, 0.005, t, function(v){ var p = P[mode][Math.round(v * (P[mode].length - 1))]; var a = Math.pow(10, p.la); return "α = " + fmt(a, a < 1 ? 3 : 1); }, function(v){ t = v; draw(); });
   ctlBtn(ctl, "🎲 Otros datos", function(){ seed++; gen(); draw(); });
   draw();
   return function(){};
 }});

/* ══════════ 4. ELASTIC NET: grupos correlacionados ══════════ */
VIZ.push({id:"v-elastic", model:"elastic", g:"model", ic:"🪢", dim:"2D",
 t:"Elastic Net y los grupos de variables",
 q:"¿Qué hace Lasso cuando varias variables miden casi lo mismo, y cómo lo arregla Elastic Net?",
 intro:"Hay <b>3 grupos</b> de variables casi idénticas (correlación ≈ 0,99 dentro de cada grupo): tres medidas del tráfico web, tres del precio y tres del clima, más 3 de ruido. Arriba, Lasso; abajo, Elastic Net con la mezcla <b>l1_ratio</b> que elijas (1 = Lasso puro, 0 = Ridge puro). Ambos se ajustan de verdad por descenso por coordenadas con la misma α.",
 notice:["Lasso pone casi todo el peso de cada grupo en <b>una sola variable</b> y deja las otras a 0. Pulsa «Otra muestra» varias veces: la elegida <b>cambia</b> casi al azar.",
   "Elastic Net <b>reparte</b> el peso entre las tres variables de cada grupo, y el reparto se mantiene de una muestra a otra: es más estable y más fácil de explicar.",
   "La suma del grupo (Σ) es parecida en los dos modelos: los dos capturan el mismo efecto total; lo que cambia es <b>cómo lo reparten</b>."],
 models:["elastic","lasso","ridge"],
 build:function(stage, ctl, read, C){
   var W = 720, H = 376, K = makeCanvas(stage, W, H, "Coeficientes por grupo de variables correlacionadas en Lasso y Elastic Net"), ctx = K.ctx;
   var GR = [["Tráfico web", ["sesiones", "usuarios", "páginas vistas"]], ["Precio", ["precio", "precio con IVA", "precio medio"]], ["Clima", ["temp. máxima", "temp. media", "sensación térmica"]], ["Ruido", ["ruido 1", "ruido 2", "ruido 3"]]];
   var GC = [C.c[1], C.c[2], C.c[4], C.muted];
   var seed = 1, la = -0.4, l1 = 0.3, bl, be, freq = null;
   function sample(s){
     var r = mulberry(s * 97 + 13), n = 100, cols = []; for(var j = 0; j < 12; j++) cols.push([]);
     var y = [];
     for(var i = 0; i < n; i++){
       var g = [gauss(r), gauss(r), gauss(r)];
       for(var a = 0; a < 3; a++) for(var k = 0; k < 3; k++) cols[a * 3 + k].push(g[a] + 0.08 * gauss(r));
       for(k = 0; k < 3; k++) cols[9 + k].push(gauss(r));
       y.push(3 * g[0] - 2 * g[1] + 1.5 * g[2] + 2 * gauss(r));
     }
     var Z = standardize(cols).map(function(s2){ return s2.z; }), ym = mean(y);
     return {Z:Z, y:y.map(function(v){ return v - ym; })};
   }
   function share(b, gi){ var s = 0, m = 0; for(var k = 0; k < 3; k++){ s += Math.abs(b[gi * 3 + k]); m = Math.max(m, Math.abs(b[gi * 3 + k])); } return s ? m / s : 0; }
   function fit(){ var d = sample(seed), al = Math.pow(10, la); bl = enetCD(d.Z, d.y, al, 1, null, 800); be = enetCD(d.Z, d.y, al, l1, null, 800); }
   function stats(){
     var al = Math.pow(10, la); freq = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
     for(var s = 0; s < 16; s++){ var d = sample(500 + s), b = enetCD(d.Z, d.y, al, 1, null, 400);
       for(var gi = 0; gi < 3; gi++){ var m = 0, a = 0; for(var k = 0; k < 3; k++) if(Math.abs(b[gi * 3 + k]) > m){ m = Math.abs(b[gi * 3 + k]); a = k; } if(m > 0) freq[gi][a]++; } }
   }
   function panel(b, y0, title, M){
     var box = [64, y0, 630, 122], gw = box[2] / 4, bw = 30, gap = 10;
     var A = axes(ctx, box, [0, 1], [-M, M], C, {yl:"coef.", yt:[-M, 0, M]});
     var nz = b.filter(function(v){ return v !== 0; }).length;
     T(ctx, title, box[0], y0 - 9, C.ink, {w:"600", s:12.5});
     T(ctx, "variables con coeficiente ≠ 0: " + nz + " de 12", box[0] + box[2], y0 - 9, C.muted, {s:11, a:"right"});
     hline(ctx, box[0], box[0] + box[2], A.sy(0), C.ink, [4, 4], 1);
     for(var gi = 0; gi < 4; gi++){
       if(gi) vline(ctx, box[0] + gi * gw + .5, box[1] + 6, box[1] + box[3] - 6, hexA(C.line, 1));
       var sum = 0;
       for(var k = 0; k < 3; k++){
         var v = b[gi * 3 + k], x = box[0] + gi * gw + (gw - 3 * bw - 2 * gap) / 2 + k * (bw + gap); sum += v;
         if(v !== 0){
           var y1 = A.sy(v), y2 = A.sy(0); bar(ctx, x, Math.min(y1, y2), bw, Math.abs(y2 - y1), GC[gi]);
           T(ctx, Math.abs(v) < 0.005 ? "≈0" : fmt(v, 2), x + bw / 2, v > 0 ? y1 - 4 : y1 + 13, C.ink, {s:11, a:"center", w:"600", halo:C.card});
         } else { mark(ctx, "o", x + bw / 2, A.sy(0), 3.5, C.card, C.muted, 1.3); T(ctx, "0", x + bw / 2, A.sy(0) - 7, C.muted, {s:11, a:"center", halo:C.card}); }
       }
       T(ctx, GR[gi][0] + (gi < 3 ? "  ·  Σ " + fmt(sum, 2) : ""), box[0] + gi * gw + gw / 2, box[1] + box[3] + 16, gi < 3 ? GC[gi] : C.muted, {s:11.5, w:"600", a:"center"});
     }
   }
   function draw(){
     K.clear();
     var M = 0; bl.concat(be).forEach(function(v){ M = Math.max(M, Math.abs(v)); }); M = Math.max(1, Math.ceil(M * 1.25 * 2) / 2);
     panel(bl, 30, "Lasso  (l1_ratio = 1)", M);
     panel(be, 214, "Elastic Net  (l1_ratio = " + fmt(l1, 2) + ")", M);
     var shL = [0, 1, 2].map(function(g){ return share(bl, g); }), shE = [0, 1, 2].map(function(g){ return share(be, g); });
     var fq = freq.map(function(f, g){ return GR[g][0] + ": " + f.map(function(c, k){ return GR[g][1][k] + " " + c; }).join(" · "); });
     read.innerHTML = '<span>α <b>' + fmt(Math.pow(10, la), 3) + '</b></span><span>l1_ratio <b>' + fmt(l1, 2) + '</b></span>' +
       '<span>Peso que se lleva la mayor de cada grupo · Lasso <b>' + shL.map(function(s){ return pct(s, 0); }).join(" / ") + '</b></span>' +
       '<span>Elastic Net <b>' + shE.map(function(s){ return pct(s, 0); }).join(" / ") + '</b></span>' +
       '<span class="ldiag">En 16 muestras distintas, la variable que Lasso eligió en cada grupo fue → ' + fq.join("; ") + '. ' +
       (l1 > 0.9 ? "<b class='lwarn'>Con l1_ratio cerca de 1, Elastic Net se comporta como Lasso.</b>" : "Un reparto de ≈ 33% por variable significa que Elastic Net trata al grupo como un bloque: <b class='lgood'>estable de una muestra a otra</b>.") + '</span>';
   }
   ctlSlider(ctl, "l1_ratio de Elastic Net (0 = Ridge, 1 = Lasso)", 0.05, 1, 0.05, l1, function(v){ return fmt(v, 2); }, function(v){ l1 = v; fit(); draw(); });
   ctlSlider(ctl, "Fuerza α (escala log)", -1.5, 0.2, 0.05, la, function(v){ return fmt(Math.pow(10, v), 3); }, function(v){ la = v; fit(); stats(); draw(); });
   ctlBtn(ctl, "🎲 Otra muestra", function(){ seed++; fit(); draw(); }, true);
   fit(); stats(); draw();
   return function(){};
 }});

/* ══════════ 5. POISSON / GLM ══════════ */
VIZ.push({id:"v-poisson", model:"poisson", g:"model", ic:"🔢", dim:"2D",
 t:"Contar con Poisson",
 q:"¿Por qué para predecir conteos (pedidos, llamadas, visitas) no basta una recta?",
 intro:"Una heladería cuenta <b>pedidos por hora</b>. A la izquierda, el histograma de 240 horas y la distribución de <b>Poisson(λ)</b> que tú eliges. A la derecha, pedidos según la <b>temperatura</b>: una recta normal frente a una regresión de Poisson ajustada de verdad (máxima verosimilitud por IRLS, el método de los GLM).",
 notice:["En una Poisson la <b>varianza es igual a la media</b>. Mueve λ hasta la media de los datos: la curva encaja con el histograma. Ese λ es justo el que estima el modelo.",
   "La recta naranja, fuera del rango de los datos (días fríos), predice <b>pedidos negativos</b>. La curva de Poisson es exponencial: <b>nunca baja de 0</b> y su coeficiente se lee como «% de cambio por grado».",
   "Marca «Sobredispersión»: la varianza se dispara muy por encima de la media. Poisson se queda corta (la cola del histograma no encaja) y la lectura te avisa: usa <b>Binomial Negativa</b>."],
 models:["poisson","linsimple","logistica"],
 build:function(stage, ctl, read, C){
   var W = 720, H = 400, K = makeCanvas(stage, W, H, "Histograma de pedidos por hora con distribución de Poisson y regresión de Poisson frente a recta"), ctx = K.ctx;
   var lam = 3, over = false, seed = 2, hA = [], dB = [], ols, pois, phi;
   function gen(){
     var r = mulberry(seed * 7 + 1); hA = [];
     for(var i = 0; i < 240; i++){ var l = over ? 4 * rGamma(r, 1.2) / 1.2 : 4; hA.push(rPois(r, l)); }
     dB = [];
     for(i = 0; i < 150; i++){ var x = 35 * r(), mu = Math.exp(-0.35 + 0.075 * x); if(over) mu *= rGamma(r, 1.5) / 1.5; dB.push([x, rPois(r, mu)]); }
     var mx = mean(dB.map(function(p){ return p[0]; })), my = mean(dB.map(function(p){ return p[1]; })), sxy = 0, sxx = 0;
     dB.forEach(function(p){ sxy += (p[0] - mx) * (p[1] - my); sxx += (p[0] - mx) * (p[0] - mx); });
     ols = [my - sxy / sxx * mx, sxy / sxx];
     var b = [Math.log(my), 0];
     for(var it = 0; it < 30; it++){
       var A2 = [[0, 0], [0, 0]], g = [0, 0];
       dB.forEach(function(p){ var m = Math.exp(b[0] + b[1] * p[0]); A2[0][0] += m; A2[0][1] += m * p[0]; A2[1][1] += m * p[0] * p[0]; g[0] += p[1] - m; g[1] += (p[1] - m) * p[0]; });
       A2[1][0] = A2[0][1]; var d = solveLin(A2, g); b = [b[0] + d[0], b[1] + d[1]];
       if(Math.abs(d[0]) + Math.abs(d[1]) < 1e-10) break;
     }
     pois = b;
     phi = dB.reduce(function(a, p){ var m = Math.exp(b[0] + b[1] * p[0]); return a + (p[1] - m) * (p[1] - m) / m; }, 0) / (dB.length - 2);
   }
   function pmf(k, l){ return Math.exp(k * Math.log(l) - l - lgam(k)); }
   function draw(){
     K.clear();
     /* a) histograma */
     var KM = over ? 18 : 12, cnt = new Array(KM + 1).fill(0); hA.forEach(function(v){ cnt[Math.min(KM, v)]++; });
     var ymax = Math.max(Math.max.apply(null, cnt), 240 * pmf(Math.max(0, Math.floor(lam)), lam)) * 1.18;
     var yt = ymax > 60 ? [0, 30, 60] : [0, 20, 40];
     var bA = [58, 40, 282, 290], A = axes(ctx, bA, [-0.5, KM + 0.5], [0, ymax], C, {xl:"pedidos en una hora", yl:"nº de horas", xt:over ? [0, 6, 12, 18] : [0, 4, 8, 12], yt:yt.filter(function(v){ return v < ymax; })});
     gridY(ctx, bA, A, yt, C);
     T(ctx, "a) ¿Cuántos pedidos llegan por hora?", bA[0], 24, C.ink, {w:"600", s:12.5});
     var bw = bA[2] / (KM + 1);
     cnt.forEach(function(c, k){ bar(ctx, A.sx(k) - bw / 2 + 1.5, A.sy(c), bw - 3, A.sy(0) - A.sy(c), hexA(C.muted, 0.38)); });
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 2.2; poly(ctx, cnt.map(function(c, k){ return [A.sx(k), A.sy(240 * pmf(k, lam))]; })); ctx.stroke();
     cnt.forEach(function(c, k){ mark(ctx, "o", A.sx(k), A.sy(240 * pmf(k, lam)), 3.4, C.c[0], C.card, 1.2); });
     if(over) T(ctx, "18+", A.sx(KM), A.sy(0) - 4 - (A.sy(0) - A.sy(cnt[KM])), C.muted, {s:11, a:"center"});
     legend(ctx, [["datos", C.muted, "sq"], ["Poisson(λ = " + fmt(lam, 1) + ")", C.c[0], "o"]], bA[0] + bA[2] - 8, bA[1] + 18, C, true);
     /* b) regresión */
     var ym = over ? 32 : 20, bB = [418, 40, 284, 290], B = axes(ctx, bB, [-5, 35], [-4, ym], C, {xl:"temperatura (°C)", yl:"pedidos por hora", xt:[-5, 5, 15, 25, 35], yt:over ? [0, 10, 20, 30] : [0, 10, 20]});
     T(ctx, "b) Pedidos según la temperatura", bB[0], 24, C.ink, {w:"600", s:12.5});
     clip(ctx, bB);
     ctx.fillStyle = hexA(C.neg, 0.07); ctx.fillRect(bB[0], B.sy(0), bB[2], bB[1] + bB[3] - B.sy(0));
     hline(ctx, bB[0], bB[0] + bB[2], B.sy(0), C.ink, [4, 4], 1);
     dB.forEach(function(p){ mark(ctx, "o", B.sx(p[0]), B.sy(p[1]), 2.8, hexA(C.text, 0.55)); });
     ctx.strokeStyle = C.c[1]; ctx.lineWidth = 2.4; poly(ctx, [[B.sx(-5), B.sy(ols[0] - 5 * ols[1])], [B.sx(35), B.sy(ols[0] + 35 * ols[1])]]); ctx.stroke();
     var cv = []; for(var i = 0; i <= 80; i++){ var x = -5 + 40 * i / 80; cv.push([B.sx(x), B.sy(Math.exp(pois[0] + pois[1] * x))]); }
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 3; poly(ctx, cv); ctx.stroke();
     ctx.restore();
     T(ctx, "▼ pedidos negativos: imposible", bB[0] + 8, bB[1] + bB[3] - 8, C.neg, {s:11, w:"600", halo:C.card});
     var o5 = ols[0] - 5 * ols[1];
     if(o5 < 0){ mark(ctx, "o", B.sx(-5) + 3, B.sy(o5), 4.5, C.c[1], C.card, 1.5); T(ctx, fmt(o5, 1), B.sx(-5) + 10, B.sy(o5) + 16, C.c[1], {s:11, w:"700", halo:C.card}); }
     legend(ctx, [["recta (OLS)", C.c[1], "line"], ["Poisson", C.c[0], "line"]], bB[0] + 8, bB[1] + 18, C);
     var m = mean(hA), v = hA.reduce(function(a, q){ return a + (q - m) * (q - m); }, 0) / (hA.length - 1);
     var tail = 0; for(var k = 8; k < 60; k++) tail += pmf(k, lam);
     var real8 = hA.filter(function(q){ return q >= 8; }).length / hA.length, eb = Math.exp(pois[1]);
     read.innerHTML = '<span>Media <b>' + fmt(m, 2) + '</b></span><span>Varianza <b>' + fmt(v, 2) + '</b></span><span>Varianza / media <b>' + fmt(v / m, 2) + '</b></span>' +
       '<span>P(≥ 8 pedidos) con tu λ <b>' + pct(tail) + '</b> · en los datos ' + pct(real8) + '</span>' +
       '<span>Poisson: cada +1 °C × <b>' + fmt(eb, 3) + '</b> (' + signed(100 * (eb - 1), 1) + '% pedidos)</span><span>Recta a −5 °C <b>' + fmt(o5, 1) + ' pedidos</b></span><span>Dispersión φ <b>' + fmt(phi, 2) + '</b></span>' +
       '<span class="ldiag">' + (over || phi > 1.5
         ? "<b class='lbad'>Sobredispersión</b> (varianza ≈ " + fmt(v / m, 1) + " veces la media; φ = " + fmt(phi, 1) + "): Poisson subestima la incertidumbre y los picos. <b>Usa Binomial Negativa</b> (o quasi-Poisson)."
         : Math.abs(lam - m) < 0.3 ? "<b class='lgood'>λ ≈ media de los datos:</b> es el λ de máxima verosimilitud. Varianza ≈ media: Poisson es razonable aquí."
         : "Acerca λ a la media de los datos (" + fmt(m, 1) + ") para ver cómo encaja la curva con el histograma.") + '</span>';
   }
   ctlSlider(ctl, "λ (media de la Poisson)", 0.5, 12, 0.1, lam, function(v){ return fmt(v, 1); }, function(v){ lam = v; draw(); });
   ctlCheck(ctl, "Sobredispersión (varianza ≫ media)", over, function(v){ over = v; gen(); draw(); });
   ctlBtn(ctl, "🎲 Otra muestra", function(){ seed++; gen(); draw(); });
   gen(); draw();
   return function(){};
 }});

/* ══════════ 6. REGRESIÓN CUANTÍLICA ══════════ */
VIZ.push({id:"v-quantile", model:"quantile", g:"model", ic:"📦", dim:"2D",
 t:"Predecir un percentil, no la media",
 q:"¿Cuánto stock necesito para no quedarme corto 9 de cada 10 días?",
 intro:"Cada punto es un día: <b>visitas previstas</b> a la tienda online y <b>unidades vendidas</b>. Fíjate en que la dispersión crece con las visitas. La recta morada no predice la media sino el <b>cuantil τ</b>: ajustada de verdad minimizando la <b>pérdida pinball</b> (solución exacta, probando todas las rectas candidatas que pasan por dos días). La banda es P10–P90.",
 notice:["El % de días por debajo de la recta coincide con <b>τ</b> (la cobertura): con τ = 0,90 el 90% de los días la demanda cabe en tu stock.",
   "La banda P10–P90 se <b>ensancha</b> hacia la derecha: con más visitas la demanda es más incierta. Una regresión normal daría un margen igual en todas partes.",
   "La pérdida pinball es <b>asimétrica</b>: con τ alto, quedarse corto (▲ rojos, rotura de stock) cuesta mucho más que pasarse. Por eso la recta sube."],
 models:["quantile","linsimple","gbr","lightgbm"],
 build:function(stage, ctl, read, C){
   var W = 720, H = 400, K = makeCanvas(stage, W, H, "Regresión cuantílica de la demanda diaria con banda P10 a P90"), ctx = K.ctx;
   var box = [64, 22, 440, 320], XR = [0, 10.5], YR = [0, 250], tau = 0.9, seed = 3, D = [], q10, q90, qt, olsL, showO = false;
   function gen(){
     var r = mulberry(seed * 11 + 5); D = [];
     for(var i = 0; i < 150; i++){ var x = 0.5 + 9.5 * r(); D.push([x, Math.max(2, 30 + 12 * x + (3 + 3 * x) * gauss(r))]); }
     var mx = mean(D.map(function(p){ return p[0]; })), my = mean(D.map(function(p){ return p[1]; })), sxy = 0, sxx = 0;
     D.forEach(function(p){ sxy += (p[0] - mx) * (p[1] - my); sxx += (p[0] - mx) * (p[0] - mx); });
     olsL = [my - sxy / sxx * mx, sxy / sxx];
     q10 = qfit(0.1); q90 = qfit(0.9);
   }
   function loss(l, t){ var s = 0; for(var i = 0; i < D.length; i++){ var u = D[i][1] - l[0] - l[1] * D[i][0]; s += u > 0 ? t * u : (t - 1) * u; } return s; }
   function qfit(t){
     var best = null, bl = Infinity, n = D.length;
     for(var i = 0; i < n; i++) for(var j = i + 1; j < n; j++){
       var dx = D[j][0] - D[i][0]; if(Math.abs(dx) < 1e-9) continue;
       var b1 = (D[j][1] - D[i][1]) / dx, l = [D[i][1] - b1 * D[i][0], b1], v = loss(l, t);
       if(v < bl){ bl = v; best = l; }
     }
     return best;
   }
   function draw(){
     K.clear();
     var A = axes(ctx, box, XR, YR, C, {xl:"visitas previstas a la web (miles)", yl:"unidades vendidas en el día", xt:[0, 2, 4, 6, 8, 10], yt:[0, 50, 100, 150, 200, 250]});
     gridY(ctx, box, A, [50, 100, 150, 200], C);
     var L = function(l, x){ return l[0] + l[1] * x; };
     clip(ctx, box);
     ctx.beginPath(); ctx.moveTo(A.sx(0), A.sy(L(q10, 0))); ctx.lineTo(A.sx(10.5), A.sy(L(q10, 10.5))); ctx.lineTo(A.sx(10.5), A.sy(L(q90, 10.5))); ctx.lineTo(A.sx(0), A.sy(L(q90, 0))); ctx.closePath();
     ctx.fillStyle = hexA(C.c[0], 0.1); ctx.fill();
     [q10, q90].forEach(function(q){ ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = hexA(C.c[0], 0.65); ctx.lineWidth = 1.3; poly(ctx, [[A.sx(0), A.sy(L(q, 0))], [A.sx(10.5), A.sy(L(q, 10.5))]]); ctx.stroke(); ctx.restore(); });
     if(showO){ ctx.save(); ctx.setLineDash([2, 4]); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; poly(ctx, [[A.sx(0), A.sy(L(olsL, 0))], [A.sx(10.5), A.sy(L(olsL, 10.5))]]); ctx.stroke(); ctx.restore(); }
     var below = 0;
     D.forEach(function(p){ var up = p[1] > L(qt, p[0]) + 1e-9; if(!up) below++;
       if(up) mark(ctx, "t", A.sx(p[0]), A.sy(p[1]), 3.8, C.neg); else mark(ctx, "o", A.sx(p[0]), A.sy(p[1]), 3, hexA(C.text, 0.45)); });
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 3; poly(ctx, [[A.sx(0), A.sy(L(qt, 0))], [A.sx(10.5), A.sy(L(qt, 10.5))]]); ctx.stroke();
     ctx.restore();
     var cov = below / D.length;
     T(ctx, "P10", box[0] + box[2] - 6, A.sy(L(q10, 10.5)) + 15, C.c[0], {s:11, a:"right", w:"600", halo:C.card});
     T(ctx, "P90", box[0] + box[2] - 6, Math.max(box[1] + 34, A.sy(L(q90, 10.5)) - 6), C.c[0], {s:11, a:"right", w:"600", halo:C.card});
     legend(ctx, [["cuantil τ = " + fmt(tau, 2), C.c[0], "line"], ["banda P10–P90", C.c[0], "band"], ["rotura de stock", C.neg, "t"]].concat(showO ? [["media (OLS)", C.ink, "dash"]] : []), box[0] + 10, box[1] + 18, C);
     /* panel: pinball */
     var px = 545, bP = [560, 56, 136, 92];
     T(ctx, "Pérdida pinball", px, 36, C.ink, {w:"600", s:12.5});
     var Pm = axes(ctx, bP, [-1, 1], [0, 1.05], C, {});
     vline(ctx, Pm.sx(0), bP[1], bP[1] + bP[3], C.muted, [3, 3], 1);
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 2.6; poly(ctx, [[Pm.sx(-1), Pm.sy(1 - tau)], [Pm.sx(0), Pm.sy(0)], [Pm.sx(1), Pm.sy(tau)]]); ctx.stroke();
     T(ctx, "te sobra", bP[0] + 4, bP[1] + bP[3] + 15, C.muted, {s:11});
     T(ctx, "te falta", bP[0] + bP[2] - 4, bP[1] + bP[3] + 15, C.neg, {s:11, a:"right", w:"600"});
     T(ctx, "pasarte: 1 − τ = " + fmt(1 - tau, 2), px, 190, C.text, {s:11});
     T(ctx, "quedarte corto: τ = " + fmt(tau, 2), px, 206, C.text, {s:11});
     stat(ctx, px, 242, "DÍAS BAJO LA RECTA", pct(cov, 0), "objetivo: τ = " + pct(tau, 0), C, Math.abs(cov - tau) < 0.04 ? C.pos : C.ink);
     var tb = [px, 302, 150, 10]; ctx.fillStyle = hexA(C.line, 1); ctx.fillRect(tb[0], tb[1], tb[2], tb[3]);
     bar(ctx, tb[0], tb[1], tb[2] * cov, tb[3], C.c[0]);
     vline(ctx, tb[0] + tb[2] * tau, tb[1] - 4, tb[1] + tb[3] + 4, C.ink, null, 2);
     var w2 = L(q90, 2) - L(q10, 2), w9 = L(q90, 9) - L(q10, 9), out = Math.round((1 - cov) * 10);
     T(ctx, "rotura ≈ " + out + " de cada 10 días", px, 334, C.neg, {s:11.5, w:"600"});
     qt.cov = cov;
     read.innerHTML = '<span>τ <b>' + fmt(tau, 2) + '</b></span><span>Días por debajo <b>' + pct(cov, 1) + '</b></span>' +
       '<span>Recta: <b>' + fmt(qt[0], 1) + ' + ' + fmt(qt[1], 1) + ' × visitas</b></span><span>Ancho P10–P90 <b>' + fmt(w2, 0) + ' u.</b> con 2 mil visitas · <b>' + fmt(w9, 0) + ' u.</b> con 9 mil</span>' +
       '<span class="ldiag">Si cada día preparas el stock que marca esta recta, te quedarás <b>sin stock ≈ ' + out + ' de cada 10 días</b> (en estos datos, ' + pct(1 - cov, 0) + ' de los días). ' +
       (tau >= 0.85 ? "Útil cuando una venta perdida cuesta mucho más que una unidad sobrante." : tau <= 0.2 ? "Con τ tan bajo casi siempre te faltará: tiene sentido solo si el sobrante es carísimo (p. ej., producto fresco)." : "Con τ = 0,5 predices la <b>mediana</b>: la mitad de los días te sobra y la otra mitad te falta.") + '</span>';
   }
   ctlSlider(ctl, "Cuantil τ", 0.05, 0.95, 0.05, tau, function(v){ return fmt(v, 2) + " (P" + Math.round(v * 100) + ")"; }, function(v){ tau = v; qt = qfit(tau); draw(); });
   ctlCheck(ctl, "Ver la media (regresión normal)", showO, function(v){ showO = v; draw(); });
   ctlBtn(ctl, "🎲 Otros días", function(){ seed++; gen(); qt = qfit(tau); draw(); });
   gen(); qt = qfit(tau); draw();
   return function(){};
 }});

/* ══════════ 7. BAYESIAN RIDGE ══════════ */
VIZ.push({id:"v-bayesridge", model:"bayesridge", g:"model", ic:"🌫️", dim:"2D",
 t:"Una recta con incertidumbre",
 q:"¿Cómo dice un modelo bayesiano «no estoy seguro», y cuándo deja de dudar?",
 intro:"Ventas de un producto nuevo en sus primeras semanas. En lugar de <b>una</b> recta, la regresión bayesiana da una <b>distribución de rectas posibles</b>: dibujamos 30 sacadas de esa distribución (la posterior), su media y la banda donde caería una semana nueva (±2σ). Cálculo exacto con fórmulas cerradas (prior gaussiano); simplificación: el ruido y la fuerza del prior se fijan en lugar de estimarlos.",
 notice:["Con 3 puntos las 30 rectas se abren como un abanico: el modelo <b>admite que no sabe</b> la pendiente. Sube el nº de puntos y el abanico se cierra.",
   "La banda es <b>estrecha donde hay datos</b> y se ensancha al alejarte (semana 12): extrapolar al futuro siempre es más incierto, y el modelo lo cuantifica.",
   "Por mucho que añadas puntos, la banda no baja de ±2 veces el ruido: esa parte de la incertidumbre (cada semana es distinta) <b>no se elimina con más datos</b>."],
 models:["bayesridge","ridge","linsimple","gp"],
 build:function(stage, ctl, read, C){
   var W = 720, H = 380, K = makeCanvas(stage, W, H, "Rectas muestreadas de la posterior bayesiana con banda predictiva"), ctx = K.ctx;
   var box = [64, 22, 620, 296], XR = [0, 12], YR = [-6, 14], a0 = 0.25, sig = 1.2, bet = 1 / (sig * sig);
   var pool = [], extra = [], nP = 4, showTrue = false, Z = [];
   (function(){ var r = mulberry(77); for(var i = 0; i < 80; i++){ var x = 3 + 4 * r(); pool.push([x, 1.5 + 0.55 * x + sig * gauss(r)]); }
     var r2 = mulberry(5); for(i = 0; i < 30; i++) Z.push([gauss(r2), gauss(r2)]); })();
   function data(){ return pool.slice(0, nP).concat(extra); }
   function post(D){
     var A2 = [[a0, 0], [0, a0]], b = [0, 0];
     D.forEach(function(p){ A2[0][0] += bet; A2[0][1] += bet * p[0]; A2[1][1] += bet * p[0] * p[0]; b[0] += bet * p[1]; b[1] += bet * p[0] * p[1]; });
     A2[1][0] = A2[0][1];
     var det = A2[0][0] * A2[1][1] - A2[0][1] * A2[0][1], S = [[A2[1][1] / det, -A2[0][1] / det], [-A2[0][1] / det, A2[0][0] / det]];
     return {S:S, m:[S[0][0] * b[0] + S[0][1] * b[1], S[1][0] * b[0] + S[1][1] * b[1]]};
   }
   function sdp(P, x){ return Math.sqrt(1 / bet + P.S[0][0] + 2 * x * P.S[0][1] + x * x * P.S[1][1]); }
   function draw(){
     K.clear();
     var D = data(), P = post(D);
     var A = axes(ctx, box, XR, YR, C, {xl:"semana desde el lanzamiento", yl:"ventas (miles de unidades)", xt:[0, 2, 4, 6, 8, 10, 12], yt:[-5, 0, 5, 10]});
     gridY(ctx, box, A, [0, 5, 10], C);
     var xs = D.map(function(p){ return p[0]; }), xmin = Math.min.apply(null, xs), xmax = Math.max.apply(null, xs);
     clip(ctx, box);
     ctx.fillStyle = hexA(C.c[0], 0.05); ctx.fillRect(A.sx(xmin), box[1], A.sx(xmax) - A.sx(xmin), box[3]);
     var up = [], dn = [];
     for(var i = 0; i <= 120; i++){ var x = XR[1] * i / 120, mu = P.m[0] + P.m[1] * x, s = sdp(P, x); up.push([A.sx(x), A.sy(mu + 2 * s)]); dn.push([A.sx(x), A.sy(mu - 2 * s)]); }
     poly(ctx, up.concat(dn.reverse())); ctx.closePath(); ctx.fillStyle = hexA(C.c[0], 0.13); ctx.fill();
     var L = [[Math.sqrt(P.S[0][0]), 0], [0, 0]]; L[1][0] = P.S[1][0] / L[0][0]; L[1][1] = Math.sqrt(Math.max(1e-12, P.S[1][1] - L[1][0] * L[1][0]));
     ctx.strokeStyle = hexA(C.c[0], 0.28); ctx.lineWidth = 1.1;
     Z.forEach(function(z){ var b0 = P.m[0] + L[0][0] * z[0], b1 = P.m[1] + L[1][0] * z[0] + L[1][1] * z[1]; poly(ctx, [[A.sx(0), A.sy(b0)], [A.sx(12), A.sy(b0 + 12 * b1)]]); ctx.stroke(); });
     if(showTrue){ ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; poly(ctx, [[A.sx(0), A.sy(1.5)], [A.sx(12), A.sy(1.5 + 12 * 0.55)]]); ctx.stroke(); ctx.restore(); }
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 3; poly(ctx, [[A.sx(0), A.sy(P.m[0])], [A.sx(12), A.sy(P.m[0] + 12 * P.m[1])]]); ctx.stroke();
     ctx.restore();
     D.forEach(function(p, k){ mark(ctx, k >= nP ? "d" : "o", A.sx(p[0]), A.sy(p[1]), k >= nP ? 5.5 : 4.4, C.ink, C.card, 1.3); });
     T(ctx, "zona con datos", (A.sx(xmin) + A.sx(xmax)) / 2, box[1] + box[3] - 10, C.c[0], {s:11, a:"center", w:"600", halo:C.card});
     var xc = (xmin + xmax) / 2, sc = sdp(P, xc), sf = sdp(P, 12);
     /* flechas de incertidumbre */
     [[xc, sc], [11.6, sf]].forEach(function(q){
       var x = A.sx(q[0]), mu = P.m[0] + P.m[1] * q[0], y1 = A.sy(mu + 2 * q[1]), y2 = A.sy(mu - 2 * q[1]);
       y1 = Math.max(box[1] + 2, y1); y2 = Math.min(box[1] + box[3] - 2, y2);
       vline(ctx, x, y1, y2, C.ink, null, 1.4); hline(ctx, x - 5, x + 5, y1, C.ink, null, 1.4); hline(ctx, x - 5, x + 5, y2, C.ink, null, 1.4);
       T(ctx, "±" + fmt(2 * q[1], 1), x + (q[0] > 11 ? -8 : 8), Math.max(box[1] + 14, y1 + 2) + 10, C.ink, {s:11.5, w:"700", a:q[0] > 11 ? "right" : "left", halo:C.card});
     });
     legend(ctx, [["media", C.c[0], "line"], ["30 rectas posibles", hexA(C.c[0], 0.5), "line"], ["banda ±2σ", C.c[0], "band"]].concat(showTrue ? [["recta real", C.ink, "dash"]] : []), box[0] + 10, box[1] + 18, C);
     var sl = Math.sqrt(P.S[1][1]);
     read.innerHTML = '<span>Puntos <b>' + D.length + '</b></span><span>Pendiente <b>' + fmt(P.m[1], 2) + ' ± ' + fmt(2 * sl, 2) + '</b> (miles/semana)</span>' +
       '<span>Incertidumbre en el centro de los datos <b>±' + fmt(2 * sc, 1) + '</b></span><span>En la semana 12 <b>±' + fmt(2 * sf, 1) + '</b></span>' +
       '<span class="ldiag">Lejos de los datos la banda es <b>' + fmt(sf / sc, 1) + ' veces</b> más ancha que en el centro. ' +
       (D.length < 8 ? "Con tan pocos puntos el abanico de rectas es amplio: <b class='lwarn'>no te fíes de la pendiente</b> todavía." :
        2 * sl < 0.15 ? "<b class='lgood'>La pendiente ya está bien determinada.</b> Lo que queda de banda es sobre todo ruido de cada semana (±" + fmt(2 * sig, 1) + "), que no baja con más datos." :
        "Cada punto nuevo estrecha el abanico, sobre todo si lo añades <b>lejos</b> del resto (haz clic a la derecha).") + '</span>';
   }
   K.cv.addEventListener("click", function(e){ var p = K.pos(e); if(!inBox(box, p) || extra.length > 40) return; extra.push(toData(box, XR, YR, p)); draw(); });
   K.cv.style.cursor = "crosshair"; touchMode(K.cv);
   ctlSlider(ctl, "Nº de puntos observados", 3, 80, 1, nP, function(v){ return v; }, function(v){ nP = v; draw(); });
   ctlCheck(ctl, "Ver la recta real (oculta)", showTrue, function(v){ showTrue = v; draw(); });
   ctlBtn(ctl, "↺ Quitar puntos añadidos", function(){ extra = []; draw(); });
   draw();
   return function(){};
 }});

/* ══════════ 8. SVR: el tubo ε ══════════ */
VIZ.push({id:"v-svr", model:"svr", g:"model", ic:"🧪", dim:"2D",
 t:"SVR y su tubo de tolerancia",
 q:"¿Qué errores ignora una SVR y cuáles le importan?",
 intro:"Consumo eléctrico según la temperatura. La SVR traza un <b>tubo de anchura ±ε</b> alrededor de su predicción: los errores dentro del tubo <b>no cuentan</b>. Solo los puntos fuera o en el borde (<b>vectores de soporte</b>, en morado) definen el modelo. Se resuelve de verdad por descenso por coordenadas en el problema dual (como LIBLINEAR); el modo «curvo» aproxima el kernel RBF con 80 características de Fourier aleatorias.",
 notice:["Sube ε: el tubo se ensancha, caben más puntos dentro y el nº de <b>vectores de soporte baja</b>. Con ε enorme el modelo se vuelve casi plano: ya no le importa nada.",
   "C es el precio de salirse del tubo. Con C pequeño la curva es <b>rígida</b> y deja puntos fuera; con C grande se retuerce para atraparlos (riesgo de sobreajuste).",
   "Los dos puntos raros apenas tuercen la curva: la SVR penaliza el error de forma <b>lineal</b> (no al cuadrado), así que es más robusta a outliers que la regresión normal."],
 models:["svr","svmlin","svmker","quantile"],
 build:function(stage, ctl, read, C){
   var W = 720, H = 380, K = makeCanvas(stage, W, H, "Regresión SVR con su tubo épsilon y vectores de soporte"), ctx = K.ctx;
   var box = [64, 22, 620, 296], XR = [0, 10], YR = [-0.5, 7.5], eps = 0.4, lc = 0, kind = "rbf", D = [], Om = [], fitted;
   (function(){ var r = mulberry(19); for(var i = 0; i < 48; i++){ var x = 10 * r(); D.push([x, 2 + 1.6 * Math.sin(0.75 * x) + 0.25 * x + 0.3 * gauss(r)]); }
     D.push([2.1, 6.4]); D.push([7.4, 0.5]);
     var r2 = mulberry(8); for(i = 0; i < 80; i++) Om.push([gauss(r2) / 1.1, 2 * Math.PI * r2()]); })();
   var ym = mean(D.map(function(p){ return p[1]; }));
   function phi(x){
     if(kind === "lin") return [(x - 5) / 3, 1];
     var f = Om.map(function(o){ return Math.sqrt(2 / Om.length) * Math.cos(o[0] * x + o[1]); }); f.push(1); return f;
   }
   function fit(){
     var Cc = Math.pow(10, lc), X = D.map(function(p){ return phi(p[0]); }), t = D.map(function(p){ return p[1] - ym; }), n = X.length, d = X[0].length;
     var w = new Array(d).fill(0), b = new Array(n).fill(0), Q = X.map(function(x){ return x.reduce(function(a, v){ return a + v * v; }, 0); }), ord = [], r = mulberry(3);
     for(var i = 0; i < n; i++) ord.push(i);
     for(var ep = 0; ep < 600; ep++){
       for(i = n - 1; i > 0; i--){ var j = Math.floor(r() * (i + 1)), tmp = ord[i]; ord[i] = ord[j]; ord[j] = tmp; }
       var md = 0;
       ord.forEach(function(i){
         var x = X[i], G = -t[i]; for(var k = 0; k < d; k++) G += w[k] * x[k];
         var bi = b[i], zp = bi - (G + eps) / Q[i], zn = bi - (G - eps) / Q[i], z = zp > 0 ? zp : zn < 0 ? zn : 0;
         z = clamp(z, -Cc, Cc); var dd = z - bi;
         if(dd !== 0){ for(k = 0; k < d; k++) w[k] += dd * x[k]; b[i] = z; md = Math.max(md, Math.abs(dd)); }
       });
       if(md < 1e-7) break;
     }
     fitted = {w:w, b:b};
   }
   function f(x){ var p = phi(x), s = ym; for(var k = 0; k < p.length; k++) s += fitted.w[k] * p[k]; return s; }
   function draw(){
     K.clear();
     var A = axes(ctx, box, XR, YR, C, {xl:"temperatura media del día (°C, escalada 0–10)", yl:"consumo (MWh)", xt:[0, 2, 4, 6, 8, 10], yt:[0, 2, 4, 6]});
     gridY(ctx, box, A, [2, 4, 6], C);
     var G = []; for(var i = 0; i <= 200; i++){ var x = 10 * i / 200; G.push([x, f(x)]); }
     clip(ctx, box);
     poly(ctx, G.map(function(g){ return [A.sx(g[0]), A.sy(g[1] + eps)]; }).concat(G.slice().reverse().map(function(g){ return [A.sx(g[0]), A.sy(g[1] - eps)]; })));
     ctx.closePath(); ctx.fillStyle = hexA(C.c[0], 0.12); ctx.fill();
     [eps, -eps].forEach(function(e){ ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = hexA(C.c[0], 0.7); ctx.lineWidth = 1.2; poly(ctx, G.map(function(g){ return [A.sx(g[0]), A.sy(g[1] + e)]; })); ctx.stroke(); ctx.restore(); });
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 2.8; poly(ctx, G.map(function(g){ return [A.sx(g[0]), A.sy(g[1])]; })); ctx.stroke();
     var nsv = 0, inside = 0, dist = 0, nout = 0;
     D.forEach(function(p, k){
       var fx = f(p[0]), r = p[1] - fx, sv = Math.abs(fitted.b[k]) > 1e-8, ins = Math.abs(r) <= eps + 1e-4;
       if(sv) nsv++; if(ins) inside++;
       if(!ins){ nout++; dist += Math.abs(r) - eps; var edge = fx + (r > 0 ? eps : -eps); ctx.save(); ctx.setLineDash([2, 2]); vline(ctx, A.sx(p[0]), A.sy(p[1]), A.sy(edge), C.c[0], [2, 2], 1.4); ctx.restore(); }
       if(sv) mark(ctx, "o", A.sx(p[0]), A.sy(p[1]), 4.8, C.c[0], C.card, 1.4);
       else mark(ctx, "o", A.sx(p[0]), A.sy(p[1]), 3.8, hexA(C.muted, 0.55));
     });
     ctx.restore();
     T(ctx, "+ε", box[0] + box[2] - 6, A.sy(G[200][1] + eps) - 5, C.c[0], {s:11, w:"700", a:"right", halo:C.card});
     T(ctx, "−ε", box[0] + box[2] - 6, A.sy(G[200][1] - eps) + 14, C.c[0], {s:11, w:"700", a:"right", halo:C.card});
     legend(ctx, [["predicción", C.c[0], "line"], ["tubo ±ε", C.c[0], "band"], ["vector de soporte", C.c[0], "o"], ["dentro del tubo (no cuenta)", C.muted, "o"]], box[0] + 10, box[1] + 18, C);
     var n = D.length;
     read.innerHTML = '<span>Vectores de soporte <b>' + nsv + ' de ' + n + '</b></span><span>Dentro del tubo <b>' + pct(inside / n, 0) + '</b></span>' +
       '<span>Distancia media al tubo (los de fuera) <b>' + (nout ? fmt(dist / nout, 2) : "—") + ' MWh</b></span><span>ε <b>' + fmt(eps, 2) + '</b> · C <b>' + fmt(Math.pow(10, lc), Math.pow(10, lc) < 1 ? 2 : 0) + '</b></span>' +
       '<span class="ldiag">' + (kind === "lin" ? "Una recta no puede seguir la curva: muchos puntos quedan fuera del tubo y todos se convierten en vectores de soporte. Prueba el modo <b>curvo (RBF)</b>."
         : eps >= 1 ? "<b class='lwarn'>Tubo muy ancho:</b> casi todo cabe dentro y el modelo se relaja; pierde detalle."
         : nsv / n > 0.75 ? "Casi todos los puntos son vectores de soporte: el tubo es tan fino que <b>todo error cuenta</b>. Sube ε para un modelo más simple."
         : "Solo <b>" + nsv + " puntos</b> definen la curva; el resto podría desaparecer sin cambiar nada. Esa es la gracia de la SVR.") + '</span>';
   }
   ctlSeg(ctl, "Forma", [["lin", "Lineal"], ["rbf", "Curva (RBF aprox.)"]], kind, function(v){ kind = v; fit(); draw(); });
   ctlSlider(ctl, "Anchura del tubo ε", 0, 1.5, 0.05, eps, function(v){ return "±" + fmt(v, 2); }, function(v){ eps = v; fit(); draw(); });
   ctlSlider(ctl, "C (precio de salirse del tubo, log)", -2, 2, 0.1, lc, function(v){ var c = Math.pow(10, v); return fmt(c, c < 1 ? 2 : c < 10 ? 1 : 0); }, function(v){ lc = v; fit(); draw(); });
   fit(); draw();
   return function(){};
 }});

/* ══════════ 9. GRADIENT BOOSTING REGRESSOR ══════════ */
VIZ.push({id:"v-gbr", model:"gbr", g:"model", ic:"🪜", dim:"2D",
 t:"Boosting árbol a árbol",
 q:"¿Cómo construye el gradient boosting una curva a base de árboles minúsculos?",
 intro:"Precio de viviendas según sus m². El boosting empieza prediciendo la media y, en cada <b>etapa</b>, entrena un árbol pequeñito sobre los <b>residuos</b> (lo que aún falla) y suma una fracción de él (la <b>tasa de aprendizaje</b>). Arriba, la predicción acumulada; abajo a la izquierda, los residuos y el árbol de esa etapa; abajo a la derecha, el error por etapa. Todo calculado de verdad.",
 notice:["En las primeras etapas la curva da <b>escalones grandes</b> y el error cae en picado; después cada árbol corrige detalles cada vez más pequeños.",
   "Los residuos de abajo se van <b>aplanando</b> hacia 0 etapa a etapa: el siguiente árbol solo ve lo que todavía no se ha explicado.",
   "Con tasa 1,0 el error de entrenamiento baja rapidísimo pero el de test <b>empieza a subir</b> pronto (sobreajuste). Con 0,1 aprende despacio pero generaliza mejor: por eso se combina tasa baja con muchas etapas."],
 models:["gbr","xgboost","lightgbm","catboost","arbol"],
 build:function(stage, ctl, read, C){
   var W = 720, H = 440, K = makeCanvas(stage, W, H, "Predicción acumulada del gradient boosting, residuos y árbol de cada etapa, y error por etapa"), ctx = K.ctx;
   var bT = [64, 24, 630, 172], bR = [64, 268, 370, 124], bE = [520, 268, 174, 124], XR = [40, 200], YR = [40, 460];
   var m = 8, lr = 0.1, depth = 1, seed = 4, M = 150, tr = [], te = [], S = null, play = false, raf = 0, last = 0, sl;
   var truth = function(x){ return 90 + 300 * (1 - Math.exp(-(x - 40) / 60)); };
   function gen(){ var r = mulberry(seed * 23 + 1); tr = []; te = [];
     for(var i = 0; i < 70; i++){ var x = 40 + 160 * r(); tr.push([x, truth(x) + 24 * gauss(r)]); }
     for(i = 0; i < 300; i++){ x = 40 + 160 * r(); te.push([x, truth(x) + 24 * gauss(r)]); } }
   function boost(){
     var xs = tr.map(function(p){ return p[0]; }), f0 = mean(tr.map(function(p){ return p[1]; }));
     var F = tr.map(function(){ return f0; }), Ft = te.map(function(){ return f0; }), idx = tr.map(function(p, i){ return i; });
     var grid = []; for(var g = 0; g <= 160; g++) grid.push(40 + g);
     var Gf = [grid.map(function(){ return f0; })], trees = [null], res = [tr.map(function(p, i){ return p[1] - F[i]; })];
     var rm = function(Fa, set){ var s = 0; set.forEach(function(p, i){ s += (p[1] - Fa[i]) * (p[1] - Fa[i]); }); return Math.sqrt(s / set.length); };
     var eTr = [rm(F, tr)], eTe = [rm(Ft, te)];
     for(var k = 1; k <= M; k++){
       var r = tr.map(function(p, i){ return p[1] - F[i]; }), tree = regTree1D(xs, r, idx, 0, depth, 3);
       F = F.map(function(v, i){ return v + lr * treeP(tree, xs[i]); });
       Ft = Ft.map(function(v, i){ return v + lr * treeP(tree, te[i][0]); });
       Gf.push(Gf[k - 1].map(function(v, q){ return v + lr * treeP(tree, grid[q]); }));
       trees.push(tree); res.push(r); eTr.push(rm(F, tr)); eTe.push(rm(Ft, te));
     }
     S = {grid:grid, Gf:Gf, trees:trees, res:res, eTr:eTr, eTe:eTe};
   }
   function draw(){
     K.clear();
     /* arriba: predicción acumulada */
     var A = axes(ctx, bT, XR, YR, C, {yl:"precio (k€)", xt:[40, 80, 120, 160, 200], yt:[100, 200, 300, 400]});
     gridY(ctx, bT, A, [100, 200, 300, 400], C);
     T(ctx, "Predicción tras " + m + (m === 1 ? " árbol" : " árboles"), bT[0], 16, C.ink, {w:"600", s:12.5});
     clip(ctx, bT);
     tr.forEach(function(p){ mark(ctx, "o", A.sx(p[0]), A.sy(p[1]), 3.4, hexA(C.text, 0.45)); });
     if(m > 0){ ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = C.muted; ctx.lineWidth = 1.4; poly(ctx, S.grid.map(function(x, q){ return [A.sx(x), A.sy(S.Gf[m - 1][q])]; })); ctx.stroke(); ctx.restore(); }
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 2.8; poly(ctx, S.grid.map(function(x, q){ return [A.sx(x), A.sy(S.Gf[m][q])]; })); ctx.stroke();
     ctx.restore();
     legend(ctx, [["etapa " + m, C.c[0], "line"]].concat(m > 0 ? [["etapa anterior", C.muted, "dash"]] : []).concat([["viviendas (train)", hexA(C.text, 0.6), "o"]]), bT[0] + bT[2] - 8, bT[1] + 18, C, true);
     /* abajo izquierda: residuos y árbol */
     var r = S.res[Math.max(1, m)] && m > 0 ? S.res[m] : S.res[0], Rm = Math.max.apply(null, r.map(Math.abs)) * 1.1, Rt = Rm > 120 ? 100 : Rm > 60 ? 50 : Rm > 24 ? 20 : 10;
     Rm = Math.max(Rm, Rt * 1.15);
     var B = axes(ctx, bR, XR, [-Rm, Rm], C, {xl:"superficie (m²)", yl:"residuo (k€)", xt:[40, 120, 200], yt:[-Rt, 0, Rt]});
     T(ctx, m > 0 ? "Residuos que ve el árbol nº " + m : "Residuos de partida (aún no hay árboles)", bR[0], bR[1] - 9, C.ink, {w:"600", s:12.5});
     hline(ctx, bR[0], bR[0] + bR[2], B.sy(0), C.ink, [4, 4], 1);
     clip(ctx, bR);
     tr.forEach(function(p, i){ var y = B.sy(r[i]); vline(ctx, B.sx(p[0]), B.sy(0), y, hexA(C.muted, 0.35), null, 1); mark(ctx, "o", B.sx(p[0]), y, 2.8, hexA(C.text, 0.55)); });
     if(m > 0){ ctx.strokeStyle = C.c[1]; ctx.lineWidth = 2.6; poly(ctx, S.grid.map(function(x){ return [B.sx(x), B.sy(treeP(S.trees[m], x))]; })); ctx.stroke(); }
     ctx.restore();
     if(m > 0) legend(ctx, [["árbol nº " + m + " (antes de × " + fmt(lr, 2) + ")", C.c[1], "line"]], bR[0] + bR[2] - 6, bR[1] + 16, C, true);
     /* abajo derecha: curva de error */
     var emax = Math.max(S.eTr[0], S.eTe[0]) * 1.05, best = S.eTe.reduce(function(a, v, i){ return v < S.eTe[a] ? i : a; }, 0);
     var E = axes(ctx, bE, [0, M], [0, emax], C, {xl:"etapa", xt:[0, 75, 150], yt:[0, Math.round(emax / 2 / 10) * 10]});
     T(ctx, "Error (RMSE, k€)", bE[0], bE[1] - 9, C.ink, {w:"600", s:12.5});
     [[S.eTr, C.c[0]], [S.eTe, C.c[1]]].forEach(function(s){ ctx.strokeStyle = s[1]; ctx.lineWidth = 2; poly(ctx, s[0].map(function(v, i){ return [E.sx(i), E.sy(v)]; })); ctx.stroke(); });
     vline(ctx, E.sx(m), bE[1], bE[1] + bE[3], C.ink, [3, 3], 1.2);
     mark(ctx, "t", E.sx(best), bE[1] + bE[3] - 6, 4.5, C.c[1]);
     legend(ctx, [["train", C.c[0], "line"], ["test", C.c[1], "line"]], bE[0] + bE[2] - 6, bE[1] + 16, C, true);
     read.innerHTML = '<span>Etapa <b>' + m + ' / ' + M + '</b></span><span>Tasa <b>' + fmt(lr, 2) + '</b></span><span>Profundidad del árbol <b>' + depth + '</b></span>' +
       '<span>RMSE train <b>' + fmt(S.eTr[m], 1) + '</b></span><span>RMSE test <b>' + fmt(S.eTe[m], 1) + '</b></span><span>Mejor etapa en test <b>' + best + '</b> (▲, ' + fmt(S.eTe[best], 1) + ')</span>' +
       '<span class="ldiag">' + (m === 0 ? "Etapa 0: el modelo predice la <b>media</b> para todas las viviendas. Pulsa ▶ para ver cómo se suman los árboles."
         : m > best + 25 && S.eTe[m] > S.eTe[best] * 1.03 ? "<b class='lbad'>Sobreajuste:</b> el train sigue bajando pero el test ya empeora; habría que parar hacia la etapa " + best + " (early stopping)."
         : m < best * 0.4 ? "<b class='lwarn'>Aún aprendiendo:</b> el error de test todavía baja; quedan patrones por capturar."
         : "<b class='lgood'>Zona buena:</b> cerca del mínimo de error en test.") + '</span>';
   }
   function setM(v){ m = clamp(Math.round(v), 0, M); sl.set(m); draw(); }
   function tick(ts){ if(!play) return; if(ts - last > 70){ last = ts; if(m >= M){ toggle(); return; } setM(m + 1); } raf = requestAnimationFrame(tick); }
   var pb;
   function toggle(){ play = !play; pb.innerHTML = play ? "⏸ Pausa" : "▶ Reproducir"; if(play){ if(m >= M) setM(0); last = 0; raf = requestAnimationFrame(tick); } else cancelAnimationFrame(raf); }
   pb = ctlBtn(ctl, "▶ Reproducir", toggle, true);
   sl = ctlSlider(ctl, "Etapa m (nº de árboles sumados)", 0, M, 1, m, function(v){ return v; }, function(v){ m = v; draw(); });
   ctlSeg(ctl, "Tasa de aprendizaje", [["0.05", "0,05"], ["0.1", "0,1"], ["0.3", "0,3"], ["1", "1,0"]], "0.1", function(v){ lr = +v; boost(); draw(); });
   ctlSeg(ctl, "Árbol", [["1", "Stump (prof. 1)"], ["2", "Prof. 2"]], "1", function(v){ depth = +v; boost(); draw(); });
   gen(); boost(); draw();
   return function(){ play = false; cancelAnimationFrame(raf); };
 }});

/* ══════════ 10. REGRESIÓN LOGÍSTICA ══════════ */
VIZ.push({id:"v-logistica", model:"logistica", g:"model", ic:"📉", dim:"2D",
 t:"La curva S de la logística",
 q:"¿Cómo convierte la regresión logística horas de uso en una probabilidad de baja?",
 intro:"Cada punto es un cliente: sus <b>horas de uso semanal</b> y si se dio de <b>baja</b> (arriba, 1) o no (abajo, 0); los separamos un poco en vertical para que no se pisen. La curva da la probabilidad de baja. Mueve β₀ y β₁ a mano o pulsa <b>«Ajustar»</b> (máxima verosimilitud, por el método de Newton). Arrastra la línea discontinua del <b>umbral</b> y haz clic en un cliente para ver su probabilidad.",
 notice:["Con «Ajustar» la curva se coloca donde la <b>log loss</b> es mínima: ninguna combinación de los deslizadores la mejora.",
   "En el panel pequeño, la misma curva en <b>log-odds</b> es una recta: la logística es una regresión lineal… sobre el logaritmo de las odds.",
   "Mover el umbral no cambia el modelo, solo la <b>decisión</b>: los ✕ rojos (errores) cambian de lado. El corte en horas es donde la curva cruza el umbral."],
 models:["logistica","linsimple","nb","svmlin"],
 build:function(stage, ctl, read, C){
   var W = 720, H = 400, K = makeCanvas(stage, W, H, "Curva sigmoide de probabilidad de baja según horas de uso, con umbral"), ctx = K.ctx;
   var box = [64, 24, 440, 316], XR = [0, 20], YR = [-0.1, 1.1], D = [], b0 = 0.6, b1 = -0.12, thr = 0.5, sel = 0, mle, drag = false, raf = 0, s0, s1, sT, A;
   (function(){ var r = mulberry(29); for(var i = 0; i < 110; i++){ var h = 20 * r(), p = sgm(2.2 - 0.38 * h); D.push([h, r() < p ? 1 : 0, (r() - 0.5) * 0.09]); } })();
   (function(){ var b = [0, 0]; for(var it = 0; it < 40; it++){ var H2 = [[0, 0], [0, 0]], g = [0, 0];
       D.forEach(function(d){ var p = sgm(b[0] + b[1] * d[0]), w = p * (1 - p); g[0] += d[1] - p; g[1] += (d[1] - p) * d[0]; H2[0][0] += w; H2[0][1] += w * d[0]; H2[1][1] += w * d[0] * d[0]; });
       H2[1][0] = H2[0][1]; var st = solveLin(H2, g); b = [b[0] + st[0], b[1] + st[1]]; if(Math.abs(st[0]) + Math.abs(st[1]) < 1e-10) break; }
     mle = b; })();
   sel = D.reduce(function(a, d, i){ return Math.abs(d[0] - 3) < Math.abs(D[a][0] - 3) ? i : a; }, 0);
   function ll(c0, c1){ return -D.reduce(function(a, d){ var p = clamp(sgm(c0 + c1 * d[0]), 1e-12, 1 - 1e-12); return a + (d[1] ? Math.log(p) : Math.log(1 - p)); }, 0) / D.length; }
   function draw(){
     K.clear();
     A = axes(ctx, box, XR, YR, C, {xl:"horas de uso a la semana", yl:"probabilidad de baja", xt:[0, 5, 10, 15, 20], yt:[0, 0.5, 1]});
     gridY(ctx, box, A, [0, 0.5, 1], C);
     T(ctx, "se dio de baja (1)", box[0] + box[2] - 8, A.sy(1) - 12, C.muted, {s:11, a:"right", halo:C.card});
     T(ctx, "sigue (0)", box[0] + box[2] - 8, A.sy(0) + 22, C.muted, {s:11, a:"right", halo:C.card});
     var hs = b1 !== 0 ? (Math.log(thr / (1 - thr)) - b0) / b1 : NaN, ok = 0;
     clip(ctx, box);
     if(isFinite(hs) && hs > 0 && hs < 20){ vline(ctx, A.sx(hs), box[1], box[1] + box[3], C.muted, [2, 3], 1.2); }
     var cv = []; for(var i = 0; i <= 160; i++){ var x = 20 * i / 160; cv.push([A.sx(x), A.sy(sgm(b0 + b1 * x))]); }
     ctx.strokeStyle = C.c[0]; ctx.lineWidth = 3; poly(ctx, cv); ctx.stroke();
     D.forEach(function(d, k){
       var p = sgm(b0 + b1 * d[0]), pred = p >= thr ? 1 : 0, good = pred === d[1], x = A.sx(d[0]), y = A.sy(d[1] + d[2] * (d[1] ? -1 : 1) - (d[1] ? 0.02 : -0.02));
       if(good){ ok++; mark(ctx, "o", x, y, 3.8, hexA(C.pos, 0.75)); } else mark(ctx, "x", x, y, 3.6, C.neg, null, 2);
     });
     hline(ctx, box[0], box[0] + box[2], A.sy(thr), C.ink, [6, 4], 1.8);
     ctx.restore();
     /* asa del umbral */
     var ty = A.sy(thr); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(box[0] + box[2] + 1, ty); ctx.lineTo(box[0] + box[2] + 10, ty - 6); ctx.lineTo(box[0] + box[2] + 10, ty + 6); ctx.closePath(); ctx.fill();
     T(ctx, "umbral " + fmt(thr, 2) + " ⇕", box[0] + box[2] - 8, ty + (thr > 0.3 ? 18 : -8), C.ink, {s:11.5, w:"700", a:"right", halo:C.card});
     if(isFinite(hs) && hs > 0 && hs < 20) T(ctx, "corte ≈ " + fmt(hs, 1) + " h", A.sx(hs) + 5, A.sy(0.2), C.muted, {s:11, w:"600", halo:C.card});
     /* cliente seleccionado */
     var d = D[sel], ps = sgm(b0 + b1 * d[0]), sx = A.sx(d[0]);
     vline(ctx, sx, A.sy(d[1] + d[2] * (d[1] ? -1 : 1) - (d[1] ? 0.02 : -0.02)), A.sy(ps), C.ink, [2, 2], 1.2);
     mark(ctx, "o", sx, A.sy(d[1] + d[2] * (d[1] ? -1 : 1) - (d[1] ? 0.02 : -0.02)), 8, null, C.ink, 2);
     mark(ctx, "o", sx, A.sy(ps), 5, C.c[0], C.card, 2);
     T(ctx, "p = " + fmt(ps, 2), sx + (d[0] > 15 ? -10 : 10), A.sy(ps) + (ps > 0.5 ? 18 : -8), C.ink, {s:12, w:"700", a:d[0] > 15 ? "right" : "left", halo:C.card});
     legend(ctx, [["acierto", hexA(C.pos, 0.85), "o"], ["error", C.neg, "x"]], box[0] + box[2] - 8, box[1] + 42, C, true);
     /* panel log-odds */
     var px = 545, bL = [560, 46, 136, 104], L = axes(ctx, bL, [0, 20], [-8, 8], C, {xt:[0, 20], yt:[-8, 0, 8]});
     T(ctx, "En log-odds: una recta", px, 30, C.ink, {w:"600", s:12.5});
     hline(ctx, bL[0], bL[0] + bL[2], L.sy(0), C.muted, [3, 3], 1);
     clip(ctx, bL); ctx.strokeStyle = C.c[0]; ctx.lineWidth = 2.4; poly(ctx, [[L.sx(0), L.sy(b0)], [L.sx(20), L.sy(b0 + 20 * b1)]]); ctx.stroke(); ctx.restore();
     T(ctx, "log(p / (1−p)) = β₀ + β₁·h", px, 180, C.text, {s:11.5});
     T(ctx, "→ una recta", px, 196, C.muted, {s:11});
     var orr = Math.exp(b1), lc = ll(b0, b1), lm = ll(mle[0], mle[1]);
     stat(ctx, px, 232, "ODDS RATIO  e^β₁", fmt(orr, 2), "por cada hora más de uso", C, C.c[0]);
     stat(ctx, px, 300, "LOG LOSS", fmt(lc, 3), "mínima posible: " + fmt(lm, 3), C, lc <= lm + 0.002 ? C.pos : C.ink);
     var chg = (orr - 1) * 100;
     read.innerHTML = '<span>β₀ <b>' + fmt(b0, 2) + '</b></span><span>β₁ <b>' + fmt(b1, 3) + '</b></span><span>Acierto con umbral ' + fmt(thr, 2) + ' <b>' + pct(ok / D.length, 0) + '</b></span><span>Log loss <b>' + fmt(lc, 3) + '</b></span>' +
       '<span>Cliente seleccionado: <b>' + fmt(d[0], 1) + ' h/semana</b> → P(baja) = <b>' + pct(ps, 0) + '</b> → predice «' + (ps >= thr ? "se va" : "se queda") + '» ' + ((ps >= thr ? 1 : 0) === d[1] ? "✓ acierta" : "✗ falla") + ' (' + (d[1] ? "se fue" : "siguió") + ')</span>' +
       '<span class="ldiag">Odds ratio = e^β₁ = <b>' + fmt(orr, 2) + '</b>: cada hora más de uso <b>multiplica las odds de baja por ' + fmt(orr, 2) + '</b> (' + (chg < 0 ? "▼ " + fmt(-chg, 0) + "% menos" : "▲ " + fmt(chg, 0) + "% más") + '). ' +
       (lc > lm + 0.01 ? "Tu curva aún no es la óptima: pulsa <b>«Ajustar»</b>." : "<b class='lgood'>Curva de máxima verosimilitud.</b>") + '</span>';
   }
   function animTo(t0, t1){
     cancelAnimationFrame(raf); var st = null, f0 = b0, f1 = b1;
     function step(ts){ if(st === null) st = ts; var u = Math.min(1, (ts - st) / 650), e = 1 - Math.pow(1 - u, 3); b0 = f0 + (t0 - f0) * e; b1 = f1 + (t1 - f1) * e; s0.set(+b0.toFixed(2)); s1.set(+b1.toFixed(3)); draw(); if(u < 1) raf = requestAnimationFrame(step); }
     raf = requestAnimationFrame(step);
   }
   K.cv.addEventListener("pointerdown", function(e){
     var p = K.pos(e);
     if(Math.abs(p[1] - A.sy(thr)) < 10 && p[0] > box[0] && p[0] < box[0] + box[2] + 14){ drag = true; K.cv.setPointerCapture(e.pointerId); return; }
     var best = -1, bd = 22; D.forEach(function(d, k){ var y = A.sy(d[1] + d[2] * (d[1] ? -1 : 1) - (d[1] ? 0.02 : -0.02)), dd = Math.hypot(A.sx(d[0]) - p[0], y - p[1]); if(dd < bd){ bd = dd; best = k; } });
     if(best >= 0){ sel = best; draw(); }
   });
   K.cv.addEventListener("pointermove", function(e){ var p = K.pos(e);
     if(drag){ thr = clamp(toData(box, XR, YR, p)[1], 0.02, 0.98); thr = Math.round(thr * 100) / 100; sT.set(thr); draw(); return; }
     K.cv.style.cursor = Math.abs(p[1] - A.sy(thr)) < 10 && p[0] > box[0] && p[0] < box[0] + box[2] + 14 ? "ns-resize" : "pointer"; });
   K.cv.addEventListener("pointerup", function(){ drag = false; });
   touchMode(K.cv);
   ctlBtn(ctl, "✨ Ajustar (máxima verosimilitud)", function(){ animTo(mle[0], mle[1]); }, true);
   s0 = ctlSlider(ctl, "β₀ (intercepto)", -4, 8, 0.01, b0, function(v){ return fmt(v, 2); }, function(v){ cancelAnimationFrame(raf); b0 = v; draw(); });
   s1 = ctlSlider(ctl, "β₁ (efecto de cada hora)", -1.5, 0.5, 0.001, b1, function(v){ return fmt(v, 3); }, function(v){ cancelAnimationFrame(raf); b1 = v; draw(); });
   sT = ctlSlider(ctl, "Umbral de decisión", 0.02, 0.98, 0.01, thr, function(v){ return fmt(v, 2); }, function(v){ thr = v; draw(); });
   draw();
   return function(){ cancelAnimationFrame(raf); };
 }});

/* ══════════ 11. LDA: proyectar para separar ══════════ */
VIZ.push({id:"v-lda", model:"lda", g:"model", ic:"🧭", dim:"2D",
 t:"LDA: el eje que mejor separa",
 q:"¿En qué dirección hay que mirar los datos para separar mejor dos clases?",
 intro:"Dos tipos de cliente (● y ■) con la misma forma alargada. <b>PCA</b> busca la dirección de <b>máxima varianza</b>; <b>LDA</b> busca la de <b>máxima separación</b> entre clases. Elige un eje y mira, a la derecha, cómo quedan los clientes al proyectarlos sobre él. Todo calculado de verdad (covarianza común, dirección Σ⁻¹·(μ₂ − μ₁)).",
 notice:["En el eje <b>PCA</b> las dos montañas se <b>solapan</b> casi por completo: la dirección con más varianza no es la que separa las clases.",
   "En el eje <b>LDA</b> las dos montañas quedan <b>separadas</b>: el ratio de Fisher (distancia entre medias ÷ dispersión) es mucho mayor.",
   "Elige «Tú» y gira el eje: ningún ángulo supera el ratio de Fisher de LDA. La línea discontinua es la <b>frontera LDA</b>: perpendicular a ese eje."],
 models:["lda","qda","pca","logistica"],
 build:function(stage, ctl, read, C){
   var W = 720, H = 420, K = makeCanvas(stage, W, H, "Dos clases con dirección PCA, dirección LDA y frontera, e histogramas de la proyección"), ctx = K.ctx;
   var box = [56, 16, 358, 358], R = [-5.5, 5.5], axis = "lda", ang = 100, seed = 2, D = [], Te = [], wL, wP, mu, thr, m1, m2, Sw;
   var th = 35 * Math.PI / 180, u = [Math.cos(th), Math.sin(th)], v = [-Math.sin(th), Math.cos(th)];
   function gen(){
     var r = mulberry(seed * 41 + 3), d = [1.35 * v[0] + 0.7 * u[0], 1.35 * v[1] + 0.7 * u[1]];
     function one(c){ var g1 = Math.sqrt(5) * gauss(r), g2 = Math.sqrt(0.22) * gauss(r), s = c ? 0.5 : -0.5; return [s * d[0] + g1 * u[0] + g2 * v[0], s * d[1] + g1 * u[1] + g2 * v[1], c]; }
     D = []; Te = []; for(var i = 0; i < 300; i++) D.push(one(i % 2)); for(i = 0; i < 2000; i++) Te.push(one(i % 2));
     var c0 = D.filter(function(p){ return !p[2]; }), c1 = D.filter(function(p){ return p[2]; });
     m1 = [mean(c0.map(function(p){ return p[0]; })), mean(c0.map(function(p){ return p[1]; }))];
     m2 = [mean(c1.map(function(p){ return p[0]; })), mean(c1.map(function(p){ return p[1]; }))];
     Sw = [[0, 0], [0, 0]]; var St = [[0, 0], [0, 0]]; mu = [(m1[0] + m2[0]) / 2, (m1[1] + m2[1]) / 2];
     D.forEach(function(p){ var m = p[2] ? m2 : m1, a = p[0] - m[0], b = p[1] - m[1], a2 = p[0] - mu[0], b2 = p[1] - mu[1];
       Sw[0][0] += a * a; Sw[0][1] += a * b; Sw[1][1] += b * b; St[0][0] += a2 * a2; St[0][1] += a2 * b2; St[1][1] += b2 * b2; });
     Sw[1][0] = Sw[0][1]; St[1][0] = St[0][1];
     Sw = Sw.map(function(rw){ return rw.map(function(x){ return x / (D.length - 2); }); });
     var w = solveLin(Sw, [m2[0] - m1[0], m2[1] - m1[1]]), n = Math.hypot(w[0], w[1]); wL = [w[0] / n, w[1] / n];
     wP = jacobiEig(St)[0].vec; if(wP[0] * wL[0] + wP[1] * wL[1] < 0) wP = [-wP[0], -wP[1]];
     thr = wL[0] * mu[0] + wL[1] * mu[1];
   }
   function dir(){ if(axis === "lda") return wL; if(axis === "pca") return wP; var a = ang * Math.PI / 180; return [Math.cos(a), Math.sin(a)]; }
   function fisher(w){ var p0 = [], p1 = []; D.forEach(function(p){ (p[2] ? p1 : p0).push(p[0] * w[0] + p[1] * w[1]); });
     var a = mean(p0), b = mean(p1), s0 = sd(p0), s1 = sd(p1); return (b - a) * (b - a) / (s0 * s0 + s1 * s1); }
   function accOn(w){ var a = 0, s = w[0] * (m2[0] - m1[0]) + w[1] * (m2[1] - m1[1]) >= 0 ? 1 : -1, c = w[0] * mu[0] + w[1] * mu[1];
     Te.forEach(function(p){ var pr = s * (p[0] * w[0] + p[1] * w[1] - c) > 0 ? 1 : 0; if(pr === p[2]) a++; }); return a / Te.length; }
   function draw(){
     K.clear();
     var A = axes(ctx, box, R, R, C, {xl:"variable 1 (p. ej., gasto, estandarizado)", yl:"variable 2 (p. ej., visitas)", xt:[-4, 0, 4], yt:[-4, 0, 4]});
     gridY(ctx, box, A, [-4, 0, 4], C); gridX(ctx, box, A, [-4, 0, 4], C);
     var w = dir();
     clip(ctx, box);
     D.forEach(function(p){ mark(ctx, p[2] ? "s" : "o", A.sx(p[0]), A.sy(p[1]), 3.2, hexA(C.c[p[2] ? 1 : 0], 0.7)); });
     /* frontera LDA */
     var p0 = [mu[0] + (thr - (wL[0] * mu[0] + wL[1] * mu[1])) * wL[0], mu[1] + (thr - (wL[0] * mu[0] + wL[1] * mu[1])) * wL[1]], t = [-wL[1], wL[0]];
     ctx.save(); ctx.setLineDash([7, 5]); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; poly(ctx, [[A.sx(p0[0] - 9 * t[0]), A.sy(p0[1] - 9 * t[1])], [A.sx(p0[0] + 9 * t[0]), A.sy(p0[1] + 9 * t[1])]]); ctx.stroke(); ctx.restore();
     /* ejes */
     [["pca", wP], ["lda", wL]].concat(axis === "tu" ? [["tu", w]] : []).forEach(function(a){
       var on = a[0] === axis, q = a[1];
       ctx.save(); ctx.strokeStyle = on ? C.ink : C.muted; ctx.lineWidth = on ? 2.4 : 1.2; if(!on) ctx.setLineDash([3, 3]);
       poly(ctx, [[A.sx(mu[0] - 8 * q[0]), A.sy(mu[1] - 8 * q[1])], [A.sx(mu[0] + 8 * q[0]), A.sy(mu[1] + 8 * q[1])]]); ctx.stroke(); ctx.restore();
     });
     /* puntos proyectados sobre el eje elegido */
     D.forEach(function(p){ var s = (p[0] - mu[0]) * w[0] + (p[1] - mu[1]) * w[1]; mark(ctx, "o", A.sx(mu[0] + s * w[0]), A.sy(mu[1] + s * w[1]), 1.6, hexA(C.c[p[2] ? 1 : 0], 0.9)); });
     ctx.restore();
     function tag(q, txt, on){ var k = 4.6, x = clamp(A.sx(mu[0] + k * q[0]), box[0] + 30, box[0] + box[2] - 30), y = clamp(A.sy(mu[1] + k * q[1]), box[1] + 14, box[1] + box[3] - 8);
       T(ctx, txt, x, y, on ? C.ink : C.muted, {s:11.5, w:on ? "700" : "600", a:"center", halo:C.card}); }
     tag(wP, "PCA", axis === "pca"); tag(wL, "LDA", axis === "lda"); if(axis === "tu") tag(w, "tu eje", true);
     T(ctx, "frontera LDA", A.sx(p0[0] - 3.3 * t[0]), A.sy(p0[1] - 3.3 * t[1]), C.ink, {s:11, w:"600", a:"center", halo:C.card});
     legend(ctx, [["clase A", C.c[0], "o"], ["clase B", C.c[1], "s"]], box[0] + 8, box[1] + box[3] - 10, C);
     /* histogramas */
     var hb = [474, 50, 226, 176], pr = D.map(function(p){ return [(p[0] - mu[0]) * w[0] + (p[1] - mu[1]) * w[1], p[2]]; });
     var L = Math.max.apply(null, pr.map(function(q){ return Math.abs(q[0]); })) * 1.05, nb = 26, h0 = new Array(nb).fill(0), h1 = new Array(nb).fill(0);
     pr.forEach(function(q){ var b = Math.min(nb - 1, Math.floor((q[0] + L) / (2 * L) * nb)); (q[1] ? h1 : h0)[b]++; });
     var hm = Math.max.apply(null, h0.concat(h1)) * 1.12;
     T(ctx, "Proyección sobre el eje " + (axis === "pca" ? "PCA" : axis === "lda" ? "LDA" : "elegido"), hb[0], 34, C.ink, {w:"600", s:12.5});
     var Hh = axes(ctx, hb, [-L, L], [0, hm], C, {xl:"posición sobre el eje"});
     var bw = hb[2] / nb;
     [[h0, C.c[0]], [h1, C.c[1]]].forEach(function(s){ s[0].forEach(function(c, b){ if(!c) return; var y = Hh.sy(c); ctx.fillStyle = hexA(s[1], 0.42); ctx.fillRect(hb[0] + b * bw + 1, y, bw - 2, hb[1] + hb[3] - y); ctx.strokeStyle = s[1]; ctx.lineWidth = 1; ctx.strokeRect(hb[0] + b * bw + 1.5, y + .5, bw - 3, hb[1] + hb[3] - y - 1); }); });
     var J = fisher(w), JL = fisher(wL), JP = fisher(wP), acL = accOn(wL), acS = accOn(w);
     stat(ctx, hb[0], 284, "RATIO DE FISHER EN ESTE EJE", fmt(J, 2), "máximo posible (LDA): " + fmt(JL, 2), C, J >= JL * 0.98 ? C.pos : C.ink);
     stat(ctx, hb[0], 350, "ACIERTO EN TEST CORTANDO AQUÍ", pct(acS, 0), null, C);
     read.innerHTML = '<span>Fisher PCA <b>' + fmt(JP, 2) + '</b></span><span>Fisher LDA <b>' + fmt(JL, 2) + '</b></span>' + (axis === "tu" ? '<span>Fisher tu eje <b>' + fmt(J, 2) + '</b></span>' : '') +
       '<span>Acierto LDA (test) <b>' + pct(acL, 1) + '</b></span><span>Cortando sobre el eje PCA <b>' + pct(accOn(wP), 1) + '</b></span>' +
       '<span class="ldiag">' + (axis === "pca" ? "<b class='lbad'>PCA mira donde más se estiran los datos</b>, que aquí es a lo largo de cada clase: las proyecciones se solapan y cortar en ese eje acierta poco más que tirar una moneda."
         : axis === "lda" ? "<b class='lgood'>LDA mira donde las medias quedan más lejos en relación con la dispersión</b>: las dos montañas se separan y la frontera (perpendicular) acierta el " + pct(acL, 0) + "."
         : J >= JL * 0.98 ? "<b class='lgood'>¡Has encontrado la dirección de LDA!</b> Ningún otro ángulo da un ratio mayor." : "Tu eje consigue un " + pct(J / JL, 0) + " del ratio de Fisher de LDA. Sigue girando.") + '</span>';
   }
   var angSl;
   ctlSeg(ctl, "Eje de proyección", [["pca", "PCA (máx. varianza)"], ["lda", "LDA (máx. separación)"], ["tu", "Tú"]], axis, function(x){ axis = x; angSl.input.disabled = x !== "tu"; draw(); });
   angSl = ctlSlider(ctl, "Ángulo de tu eje (solo «Tú»)", 0, 180, 1, ang, function(x){ return x + "°"; }, function(x){ ang = x; if(axis === "tu") draw(); });
   angSl.input.disabled = true;
   ctlBtn(ctl, "🎲 Otra muestra", function(){ seed++; gen(); draw(); });
   gen(); draw();
   return function(){};
 }});

/* ══════════ 12. QDA: fronteras curvas ══════════ */
VIZ.push({id:"v-qda", model:"qda", g:"model", ic:"🥚", dim:"2D",
 t:"QDA: cuando cada clase tiene su forma",
 q:"¿Qué gana QDA al permitir que cada clase tenga su propia dispersión?",
 intro:"Transacciones <b>normales</b> (●, muy parecidas entre sí) frente a <b>fraudes</b> (▲, muy dispersos). LDA supone que las dos clases tienen la <b>misma forma</b> y traza una recta; QDA estima una covarianza <b>por clase</b> y su frontera es una curva (aquí, cerrada alrededor de lo normal). El fondo muestra qué predice cada modelo en cada punto. Ajuste real; acierto medido en 3.000 transacciones de test.",
 notice:["Con dispersión alta, la frontera QDA es un <b>óvalo cerrado</b>: «normal» es lo que está cerca del centro, y todo lo que se aleja en cualquier dirección es sospechoso.",
   "La recta de LDA solo puede cortar el plano en dos mitades: deja escapar fraudes que están <b>al otro lado</b> de lo normal. Compara el recall de fraude.",
   "Baja el ratio de dispersión a 1: las dos clases tienen la misma forma, QDA y LDA <b>se parecen</b>, y LDA (más simple, menos parámetros) es suficiente."],
 models:["qda","lda","nb","gmm"],
 build:function(stage, ctl, read, C){
   var W = 720, H = 420, K = makeCanvas(stage, W, H, "Regiones de decisión de QDA y LDA para transacciones normales y fraude"), ctx = K.ctx;
   var box = [56, 22, 630, 352], ratio = 3.5, view = "both", seed = 6, D = [], Te = [], P;
   var py = 4.2, ppu = box[3] / (2 * py), px = box[2] / ppu / 2, XR = [0.6 - px, 0.6 + px], YR = [-py, py];
   function gen(){
     var r = mulberry(seed * 53 + 9), s = 0.6, sb = 0.6 * ratio, c = 0.3;
     function one(k){ if(!k) return [s * gauss(r), s * gauss(r), 0];
       var a = gauss(r), b = c * a + Math.sqrt(1 - c * c) * gauss(r); return [1.0 + sb * a, 0.5 + sb * b, 1]; }
     D = []; Te = []; for(var i = 0; i < 240; i++) D.push(one(i % 2)); for(i = 0; i < 3000; i++) Te.push(one(i % 2));
     var st = [0, 1].map(function(k){ var q = D.filter(function(p){ return p[2] === k; }), m = [mean(q.map(function(p){ return p[0]; })), mean(q.map(function(p){ return p[1]; }))], S = [[0, 0], [0, 0]];
       q.forEach(function(p){ var a = p[0] - m[0], b = p[1] - m[1]; S[0][0] += a * a; S[0][1] += a * b; S[1][1] += b * b; });
       return {m:m, S:S, n:q.length}; });
     function fin(S, n){ var M = [[S[0][0] / n, S[0][1] / n], [S[0][1] / n, S[1][1] / n]], det = M[0][0] * M[1][1] - M[0][1] * M[0][1]; return {I:[[M[1][1] / det, -M[0][1] / det], [-M[0][1] / det, M[0][0] / det]], ld:Math.log(det)}; }
     var q0 = fin(st[0].S, st[0].n - 1), q1 = fin(st[1].S, st[1].n - 1), pl = fin([[st[0].S[0][0] + st[1].S[0][0], st[0].S[0][1] + st[1].S[0][1]], [0, st[0].S[1][1] + st[1].S[1][1]]], D.length - 2);
     P = {m:[st[0].m, st[1].m], q:[q0, q1], pl:pl};
   }
   function maha(I, m, x, y){ var a = x - m[0], b = y - m[1]; return a * a * I[0][0] + 2 * a * b * I[0][1] + b * b * I[1][1]; }
   function gQ(x, y){ return (-0.5 * P.q[1].ld - 0.5 * maha(P.q[1].I, P.m[1], x, y)) - (-0.5 * P.q[0].ld - 0.5 * maha(P.q[0].I, P.m[0], x, y)); }
   function gL(x, y){ return -0.5 * maha(P.pl.I, P.m[1], x, y) + 0.5 * maha(P.pl.I, P.m[0], x, y); }
   function score(g){ var ok = 0, tp = 0, nf = 0; Te.forEach(function(p){ var pr = g(p[0], p[1]) > 0 ? 1 : 0; if(pr === p[2]) ok++; if(p[2]){ nf++; if(pr) tp++; } }); return [ok / Te.length, tp / nf]; }
   function draw(){
     K.clear();
     var A = axes(ctx, box, XR, YR, C, {xl:"importe (estandarizado)", yl:"hora del día (estandarizada)", xt:[-6, -3, 0, 3, 6], yt:[-4, -2, 0, 2, 4]});
     var g = view === "lda" ? gL : gQ, st = 6;
     clip(ctx, box);
     for(var y = box[1]; y < box[1] + box[3]; y += st) for(var x = box[0]; x < box[0] + box[2]; x += st){
       var d = toData(box, XR, YR, [x + st / 2, y + st / 2]); ctx.fillStyle = g(d[0], d[1]) > 0 ? hexA(C.c[1], 0.13) : hexA(C.c[0], 0.13); ctx.fillRect(x, y, st, st);
     }
     gridY(ctx, box, A, [-2, 0, 2], C); gridX(ctx, box, A, [-3, 0, 3], C);
     D.forEach(function(p){ mark(ctx, p[2] ? "t" : "o", A.sx(p[0]), A.sy(p[1]), p[2] ? 3.8 : 3.2, hexA(C.c[p[2]], 0.85)); });
     if(view !== "lda"){ ctx.strokeStyle = C.ink; ctx.lineWidth = 2.2; contour(ctx, box, XR, YR, gQ, 5); }
     if(view !== "qda"){ ctx.save(); ctx.setLineDash([7, 5]); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8; contour(ctx, box, XR, YR, gL, 5); ctx.restore(); }
     ctx.restore();
     var items = [["normal", C.c[0], "o"], ["fraude", C.c[1], "t"]];
     if(view !== "lda") items.push(["frontera QDA", C.ink, "line"]);
     if(view !== "qda") items.push(["frontera LDA", C.ink, "dash"]);
     ctx.fillStyle = hexA(C.card, 0.88); ctx.fillRect(box[0] + 4, box[1] + 4, 20 + items.reduce(function(a, it){ return a + 36 + tw(ctx, it[0], 11.5); }, 0), 24);
     legend(ctx, items, box[0] + 12, box[1] + 21, C);
     var sQ = score(gQ), sL = score(gL);
     read.innerHTML = '<span>Ratio de dispersión <b>× ' + fmt(ratio, 2) + '</b></span><span>Acierto test · LDA <b>' + pct(sL[0], 1) + '</b> · QDA <b>' + pct(sQ[0], 1) + '</b></span>' +
       '<span>Fraudes detectados (recall) · LDA <b>' + pct(sL[1], 0) + '</b> · QDA <b>' + pct(sQ[1], 0) + '</b></span>' +
       '<span class="ldiag">' + (ratio < 1.5 ? "Con formas parecidas las dos fronteras casi coinciden: <b>LDA basta</b> y estima menos parámetros (más estable con pocos datos)."
         : sQ[0] - sL[0] > 0.03 ? "<b class='lgood'>QDA gana " + fmt(100 * (sQ[0] - sL[0]), 1) + " puntos de acierto</b>: su frontera curva rodea a las transacciones normales, y detecta fraudes en <b>todas</b> las direcciones, no solo en un lado de la recta."
         : "QDA y LDA rinden parecido con este ratio; sube la dispersión del fraude para ver la diferencia.") + '</span>';
   }
   ctlSeg(ctl, "Ver", [["both", "QDA + recta LDA"], ["qda", "Solo QDA"], ["lda", "Solo LDA"]], view, function(v){ view = v; draw(); });
   ctlSlider(ctl, "Dispersión del fraude frente a lo normal", 1, 5, 0.25, ratio, function(v){ return "× " + fmt(v, 2); }, function(v){ ratio = v; gen(); draw(); });
   ctlBtn(ctl, "🎲 Otra muestra", function(){ seed++; gen(); draw(); });
   gen(); draw();
   return function(){};
 }});

/* ══════════ 13. NAIVE BAYES: filtro de spam ══════════ */
VIZ.push({id:"v-nb", model:"nb", g:"model", ic:"📨", dim:"2D",
 t:"Un filtro de spam con Naive Bayes",
 q:"¿Cómo suma Naive Bayes las pistas de cada palabra para decidir si un correo es spam?",
 intro:"Haz clic en las <b>palabras subrayadas</b> del correo para activarlas o tacharlas. Cada palabra presente aporta una <b>evidencia</b>: el logaritmo de cuánto más frecuente es en spam que en correo normal (contado en 1.000 correos de entrenamiento inventados, con suavizado de Laplace). El modelo <b>suma</b> esas evidencias al punto de partida (el prior) y lo convierte en probabilidad. Simplificación: solo cuentan las palabras presentes.",
 notice:["«premio» y «gratis» empujan fuerte hacia spam (barras ▲); «reunión» y «proyecto» empujan hacia normal (▼). «hola» casi no aporta: sale igual en los dos tipos.",
   "El cálculo es una <b>suma</b>: cada palabra se trata como independiente de las demás (esa es la parte «ingenua»). Por eso es rapidísimo y funciona bien con texto.",
   "Sube el prior (% de spam esperado): la misma frase pasa antes a spam. Con un prior muy bajo hacen falta muchas pistas para convencer al filtro."],
 models:["nb","logistica","bayesnet"],
 build:function(stage, ctl, read, C){
   var NS = 400, NN = 600, prior = 0.4;
   var WD = {"hola":[230, 360], "premio":[140, 5], "gratis":[210, 24], "urgente":[130, 45], "reunión":[6, 170], "factura":[70, 95], "proyecto":[12, 160], "oferta":[190, 70]};
   var on = {"hola":1, "premio":1, "gratis":1, "urgente":1, "reunión":1, "factura":0, "proyecto":0, "oferta":0};
   function ev(w){ var c = WD[w], ps = (c[0] + 1) / (NS + 2), pn = (c[1] + 1) / (NN + 2); return {ps:ps, pn:pn, l:Math.log(ps / pn)}; }
   var txt = ['<b>[hola]</b>, Laura:', 'Tienes un <b>[premio]</b> <b>[gratis]</b> esperándote. Es <b>[urgente]</b>: confírmalo antes de la <b>[reunión]</b> de las 10.', 'Te adjuntamos la <b>[factura]</b> del <b>[proyecto]</b> con nuestra <b>[oferta]</b> especial.'];
   var host = document.createElement("div"); host.className = "vnb";
   host.style.cssText = "width:100%;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:14px;font-family:" + LABFONT;
   var cardCss = "background:" + C.card + ";border:.5px solid " + C.line + ";border-radius:16px;padding:18px 20px;min-width:0";
   host.innerHTML = '<div style="' + cardCss + '"><div style="font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:' + C.muted + '">Correo entrante</div>' +
     '<div style="margin-top:10px;font-size:13px;color:' + C.muted + ';line-height:1.6">De: <span style="color:' + C.text + '">promo@ventas-top.example</span><br>Asunto: <span style="color:' + C.text + ';font-weight:600">Última oportunidad</span></div>' +
     '<div class="vnb-body" style="margin-top:12px;padding-top:12px;border-top:.5px solid ' + C.line + ';font-size:15.5px;line-height:2.05;color:' + C.text + '"></div>' +
     '<div style="margin-top:10px;font-size:12px;color:' + C.muted + '">Toca una palabra para quitarla o ponerla.</div></div>' +
     '<div style="' + cardCss + '"><div style="font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:' + C.muted + '">Veredicto del filtro</div>' +
     '<div class="vnb-meter"></div><div class="vnb-ev" style="margin-top:16px;display:flex;flex-direction:column;gap:7px"></div></div>';
   stage.appendChild(host);
   var body = host.querySelector(".vnb-body"), meter = host.querySelector(".vnb-meter"), evh = host.querySelector(".vnb-ev");
   body.innerHTML = txt.map(function(l){ return '<p style="margin:0 0 6px">' + l.replace(/<b>\[([^\]]+)\]<\/b>/g, function(m, w){ return '<button type="button" data-w="' + w + '" class="vnb-w"></button>'; }) + '</p>'; }).join("");
   var btns = [].slice.call(body.querySelectorAll(".vnb-w"));
   btns.forEach(function(b){ b.textContent = b.dataset.w; b.addEventListener("click", function(){ on[b.dataset.w] = on[b.dataset.w] ? 0 : 1; paint(); }); });
   function row(label, val, sub, strong){
     var M = 4.2, w = Math.min(1, Math.abs(val) / M) * 50, pos = val >= 0, col = pos ? C.neg : C.pos;
     return '<div style="display:grid;grid-template-columns:minmax(78px,30%) 1fr 54px;gap:8px;align-items:center;font-size:12.5px">' +
       '<span style="color:' + (strong ? C.ink : C.text) + ';font-weight:' + (strong ? 700 : 600) + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + (sub || "") + '">' + label + '</span>' +
       '<span style="position:relative;height:14px;background:' + C.bg + ';border-radius:7px">' +
       '<i style="position:absolute;left:50%;top:-2px;bottom:-2px;width:1px;background:' + C.muted + '"></i>' +
       '<i style="position:absolute;top:2px;height:10px;border-radius:5px;background:' + col + ';' + (pos ? 'left:50%' : 'right:50%') + ';width:' + w + '%"></i></span>' +
       '<span style="text-align:right;font-weight:700;color:' + col + ';font-variant-numeric:tabular-nums">' + (pos ? "▲ " : "▼ ") + fmt(Math.abs(val), 2) + '</span></div>';
   }
   function paint(){
     btns.forEach(function(b){ var a = on[b.dataset.w];
       b.style.cssText = "font:inherit;font-weight:600;cursor:pointer;border-radius:7px;padding:1px 7px;margin:0 1px;line-height:1.5;border:1px solid " + (a ? C.c[0] : C.line) + ";background:" + (a ? hexA(C.c[0], 0.14) : "transparent") + ";color:" + (a ? C.ink : C.muted) + ";text-decoration:" + (a ? "underline " + hexA(C.c[0], 0.6) + " 2px" : "line-through") + ";text-underline-offset:3px";
       b.setAttribute("aria-pressed", a ? "true" : "false"); });
     var lp = Math.log(prior / (1 - prior)), sum = lp, act = Object.keys(WD).filter(function(w){ return on[w]; });
     var rows = row("prior", lp, "punto de partida: log(" + fmt(prior, 2) + " / " + fmt(1 - prior, 2) + ")");
     act.forEach(function(w){ var e = ev(w); sum += e.l; rows += row("«" + w + "»", e.l, "aparece en " + pct(e.ps, 0) + " del spam y " + pct(e.pn, 0) + " del correo normal"); });
     rows += '<div style="height:1px;background:' + C.line + ';margin:3px 0"></div>' + row("total", sum, "", true);
     evh.innerHTML = '<div style="display:flex;justify-content:space-between;font-size:11px;color:' + C.muted + ';font-weight:600"><span>▼ hacia normal</span><span>evidencia (log)</span><span>hacia spam ▲</span></div>' + rows;
     var P = sgm(sum), spam = P >= 0.5, vc = spam ? C.neg : C.pos;
     meter.innerHTML = '<div style="display:flex;align-items:baseline;gap:12px;margin-top:10px;flex-wrap:wrap"><span style="font-size:38px;font-weight:800;color:' + vc + ';font-variant-numeric:tabular-nums;line-height:1.1">' + pct(P, 1) + '</span>' +
       '<span style="font-size:14px;font-weight:700;color:' + C.ink + '">' + (spam ? "🚫 Va a la carpeta de spam" : "📥 Llega a la bandeja de entrada") + '</span></div>' +
       '<div style="font-size:12px;color:' + C.muted + ';margin-top:2px">P(spam | correo)</div>' +
       '<div style="position:relative;height:12px;border-radius:6px;background:' + C.bg + ';margin-top:10px;overflow:hidden"><i style="position:absolute;left:0;top:0;bottom:0;width:' + (100 * P) + '%;background:' + vc + ';border-radius:6px;transition:width .35s"></i></div>' +
       '<div style="position:relative;height:16px;font-size:11px;color:' + C.muted + '"><span style="position:absolute;left:50%;transform:translateX(-50%);top:2px">↑ umbral 50%</span></div>';
     var biggest = act.slice().sort(function(a, b){ return Math.abs(ev(b).l) - Math.abs(ev(a).l); })[0];
     read.innerHTML = '<span class="leq">log-odds = ' + fmt(lp, 2) + ' (prior)' + act.map(function(w){ var l = ev(w).l; return ' ' + (l >= 0 ? "+" : "−") + ' ' + fmt(Math.abs(l), 2) + ' (' + w + ')'; }).join("") + ' = <b>' + fmt(sum, 2) + '</b></span>' +
       '<span class="leq">P(spam) = 1 / (1 + e^(−' + fmt(sum, 2) + ')) = <b>' + pct(P, 1) + '</b></span>' +
       '<span class="ldiag">' + (biggest ? "La pista más fuerte es <b>«" + biggest + "»</b>: aparece en el " + pct(ev(biggest).ps, 0) + " del spam y en el " + pct(ev(biggest).pn, 1) + " del correo normal, es decir, es <b>" + fmt(Math.exp(Math.abs(ev(biggest).l)), 1) + " veces</b> más frecuente en " + (ev(biggest).l > 0 ? "spam" : "correo normal") + ". " : "Sin palabras activas solo cuenta el prior. ") +
         (spam ? "<b class='lbad'>Suma positiva → spam.</b>" : "<b class='lgood'>Suma negativa → correo normal.</b>") + '</span>';
   }
   ctlSlider(ctl, "Prior: % de spam esperado antes de leer", 0.05, 0.95, 0.01, prior, function(v){ return pct(v, 0); }, function(v){ prior = v; paint(); });
   ctlBtn(ctl, "Activar todas", function(){ Object.keys(on).forEach(function(w){ on[w] = 1; }); paint(); });
   ctlBtn(ctl, "Tachar todas", function(){ Object.keys(on).forEach(function(w){ on[w] = 0; }); paint(); });
   paint();
   return function(){};
 }});

/* ══════════ 14. KNN: votan los vecinos ══════════ */
VIZ.push({id:"v-knn", model:"knn", g:"model", ic:"🏘️", dim:"2D",
 t:"KNN: dime con quién andas",
 q:"¿Cómo clasifica KNN a un cliente nuevo, y qué cambia al variar K?",
 intro:"Tres tipos de cliente según su <b>gasto</b> y su <b>frecuencia de compra</b> (ya en la misma escala, imprescindible en KNN). Haz clic o arrastra en el gráfico para colocar un <b>cliente nuevo</b> (★): sus <b>K vecinos</b> más cercanos votan y gana la clase con más votos. Activa «Ver regiones» para colorear qué decidiría el modelo en cada punto.",
 notice:["Con <b>K = 1</b> las regiones forman <b>islas</b> alrededor de clientes sueltos: el modelo memoriza cada punto (sobreajuste).",
   "Con K grande la frontera se <b>suaviza</b>; si te pasas (K = 31), las clases pequeñas o mezcladas pierden terreno: subajuste.",
   "Cambia a distancia Manhattan: el «círculo» de vecinos se convierte en un <b>rombo</b> (se mide en cuadrícula, como calles), y algunas fronteras se mueven."],
 models:["knn","kmeans","svmker","arbol"],
 build:function(stage, ctl, read, C){
   var W = 720, H = 420, K = makeCanvas(stage, W, H, "Clientes de tres clases y los K vecinos más cercanos de un cliente nuevo"), ctx = K.ctx;
   var box = [58, 16, 358, 358], R = [0, 10], k = 7, metric = "e", regions = false, q = [4.7, 5.1], drag = false, D = [], cache = {}, A;
   var NM = ["Ocasional", "Fiel", "Premium"], SH = ["o", "s", "t"], CC = [C.c[0], C.c[1], C.c[2]];
   (function(){ var r = mulberry(13), ctr = [[3, 3], [6.2, 4.2], [5.2, 7.4]], s = [1.25, 1.1, 1.05];
     for(var c = 0; c < 3; c++) for(var i = 0; i < 36; i++) D.push([clamp(ctr[c][0] + s[c] * gauss(r), 0.2, 9.8), clamp(ctr[c][1] + s[c] * gauss(r), 0.2, 9.8), c]); })();
   function dist(a, b){ return metric === "e" ? Math.hypot(a[0] - b[0], a[1] - b[1]) : Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]); }
   function knn(p, kk){
     var d = D.map(function(x, i){ return [dist(p, x), i]; }).sort(function(a, b){ return a[0] - b[0]; }).slice(0, kk);
     var v = [0, 0, 0]; d.forEach(function(e){ v[D[e[1]][2]]++; });
     var mx = Math.max(v[0], v[1], v[2]), win = -1;
     for(var i = 0; i < d.length && win < 0; i++){ var c = D[d[i][1]][2]; if(v[c] === mx) win = c; }
     return {nb:d, v:v, win:win};
   }
   function regionImg(){
     var key = k + metric; if(cache[key]) return cache[key];
     var st = 6, out = [], n = D.length, bd = new Float64Array(k), bc = new Int8Array(k);
     for(var y = 0; y < box[3]; y += st) for(var x = 0; x < box[2]; x += st){
       var d = toData(box, R, R, [box[0] + x + st / 2, box[1] + y + st / 2]), m = 0;
       for(var i = 0; i < n; i++){ var p = D[i], dd = metric === "e" ? (p[0] - d[0]) * (p[0] - d[0]) + (p[1] - d[1]) * (p[1] - d[1]) : Math.abs(p[0] - d[0]) + Math.abs(p[1] - d[1]);
         if(m === k && dd >= bd[k - 1]) continue;
         var j = m < k ? m++ : k - 1; while(j > 0 && bd[j - 1] > dd){ bd[j] = bd[j - 1]; bc[j] = bc[j - 1]; j--; } bd[j] = dd; bc[j] = p[2]; }
       var v = [0, 0, 0]; for(i = 0; i < k; i++) v[bc[i]]++;
       var mx = Math.max(v[0], v[1], v[2]), win = 0; for(i = 0; i < k; i++) if(v[bc[i]] === mx){ win = bc[i]; break; }
       out.push([x, y, win]);
     }
     cache[key] = out; return out;
   }
   function draw(){
     K.clear();
     A = axes(ctx, box, R, R, C, {xl:"gasto mensual (escalado 0–10)", yl:"frecuencia de compra (escalada 0–10)", xt:[0, 5, 10], yt:[0, 5, 10]});
     clip(ctx, box);
     if(regions) regionImg().forEach(function(c){ ctx.fillStyle = hexA(CC[c[2]], 0.17); ctx.fillRect(box[0] + c[0], box[1] + c[1], 6, 6); });
     gridY(ctx, box, A, [5], C); gridX(ctx, box, A, [5], C);
     var res = knn(q, k), rad = res.nb[res.nb.length - 1][0], qx = A.sx(q[0]), qy = A.sy(q[1]), pr = box[2] / 10 * rad;
     ctx.beginPath();
     if(metric === "e") ctx.arc(qx, qy, pr, 0, Math.PI * 2); else { ctx.moveTo(qx, qy - pr); ctx.lineTo(qx + pr, qy); ctx.lineTo(qx, qy + pr); ctx.lineTo(qx - pr, qy); ctx.closePath(); }
     ctx.fillStyle = hexA(C.ink, 0.05); ctx.fill(); ctx.strokeStyle = C.ink; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.4; ctx.stroke(); ctx.setLineDash([]);
     res.nb.forEach(function(e){ var p = D[e[1]]; ctx.strokeStyle = hexA(CC[p[2]], 0.75); ctx.lineWidth = 1.4; poly(ctx, [[qx, qy], [A.sx(p[0]), A.sy(p[1])]]); ctx.stroke(); });
     var isN = {}; res.nb.forEach(function(e){ isN[e[1]] = 1; });
     D.forEach(function(p, i){ var n = isN[i]; mark(ctx, SH[p[2]], A.sx(p[0]), A.sy(p[1]), n ? 4.6 : 3.6, n ? CC[p[2]] : hexA(CC[p[2]], 0.55), n ? C.card : null, 1.4); });
     ctx.restore();
     mark(ctx, "star", qx, qy, 11, CC[res.win], C.ink, 1.8);
     /* panel de votos */
     var px = 474;
     T(ctx, "Votos de los " + k + (k === 1 ? " vecino" : " vecinos"), px, 38, C.ink, {w:"600", s:12.5});
     T(ctx, "más cercanos (" + (metric === "e" ? "distancia euclídea" : "distancia Manhattan") + ")", px, 54, C.muted, {s:11});
     [0, 1, 2].forEach(function(c){
       var y = 84 + c * 46, v = res.v[c];
       mark(ctx, SH[c], px + 6, y - 4, 5, CC[c]); T(ctx, NM[c], px + 18, y, C.text, {s:12, w:"600"});
       T(ctx, v + " · " + pct(v / k, 0), 700, y, C.ink, {s:12, w:"700", a:"right"});
       ctx.fillStyle = hexA(C.line, 1); ctx.fillRect(px, y + 8, 226, 10);
       bar(ctx, px, y + 8, 226 * v / k, 10, CC[c]);
     });
     T(ctx, "PREDICCIÓN", px, 242, C.muted, {s:11, w:"600"});
     mark(ctx, "star", px + 11, 266, 10, CC[res.win], C.ink, 1.5);
     T(ctx, NM[res.win], px + 30, 274, CC[res.win], {s:24, w:"700"});
     T(ctx, "probabilidad = votos / K = " + pct(res.v[res.win] / k, 0), px, 298, C.muted, {s:11});
     T(ctx, "Arrastra la ★ o haz clic en el gráfico", px, 360, C.muted, {s:11});
     var tie = res.v.filter(function(x){ return x === res.v[res.win]; }).length > 1;
     read.innerHTML = '<span>K <b>' + k + '</b></span><span>Votos <b>' + NM.map(function(n, c){ return n + " " + res.v[c]; }).join(" · ") + '</b></span>' +
       '<span>Predicción <b>' + NM[res.win] + '</b> con probabilidad <b>' + pct(res.v[res.win] / k, 0) + '</b></span><span>Radio del vecindario <b>' + fmt(rad, 2) + '</b></span>' +
       '<span class="ldiag">' + (tie ? "<b class='lwarn'>Empate:</b> se decide por el vecino más cercano. Usa K impar (y con 3 clases, aun así puede pasar). " : "") +
       (k === 1 ? "Con K = 1 decide <b>un único cliente</b>: si es un caso raro, la predicción también lo será (activa las regiones y verás las islas)."
        : k >= 21 ? "Con K tan grande el vecindario abarca medio gráfico: la decisión se vuelve <b>muy suave</b> y las clases minoritarias de la zona pierden."
        : "Probabilidad de " + pct(res.v[res.win] / k, 0) + ": " + (res.v[res.win] / k > 0.8 ? "<b class='lgood'>zona clara</b>, casi todos los vecinos coinciden." : "<b class='lwarn'>zona de frontera</b>, los vecinos no se ponen de acuerdo.")) + '</span>';
   }
   function place(e){ var p = K.pos(e); if(!inBox(box, p)) return; q = toData(box, R, R, p); draw(); }
   K.cv.addEventListener("pointerdown", function(e){ var p = K.pos(e); if(!inBox(box, p)) return; drag = true; K.cv.setPointerCapture(e.pointerId); place(e); });
   K.cv.addEventListener("pointermove", function(e){ if(drag) place(e); });
   K.cv.addEventListener("pointerup", function(){ drag = false; });
   K.cv.style.cursor = "crosshair"; touchMode(K.cv);
   ctlSlider(ctl, "K (nº de vecinos que votan)", 1, 31, 1, k, function(v){ return v; }, function(v){ k = v; draw(); });
   ctlSeg(ctl, "Distancia", [["e", "Euclídea"], ["m", "Manhattan"]], metric, function(v){ metric = v; draw(); });
   ctlCheck(ctl, "Ver regiones de decisión", regions, function(v){ regions = v; draw(); });
   draw();
   return function(){};
 }});

})();
