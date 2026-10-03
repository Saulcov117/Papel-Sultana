/* =====================================================================
   PRECIOS DE LISTA (pesos mexicanos). Edítalos aquí.
   Formato:  medida -> tintas -> { millares: precio total }
   Cada medida solo ofrece las cantidades que aparecen en la lista.
   ===================================================================== */
var CONFIG = {
  telefono: "528124329263",
  precios: {
    "30x20": {
      1: { 1: 610, 2: 1080, 4: 1650, 6: 2350, 8: 2980, 10: 3650 },
      2: { 1: 950, 2: 1580, 4: 2450, 6: 3400, 8: 4950, 10: 6100 }
    },
    "30x30": {
      1: { 1: 750, 3: 1580, 6: 2850, 8: 3750, 10: 4600 },
      2: { 1: 1060, 3: 2400, 6: 4200, 8: 5400, 10: 6600 }
    },
    "30x40": {
      1: { 1: 900, 2: 1750, 4: 2950, 6: 3950, 8: 5100, 10: 6200 },
      2: { 1: 1240, 2: 2250, 4: 3600, 6: 5400, 8: 6950, 10: 8400 }
    }
  }
};

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var p0 = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
  var p2 = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
  var miles = new Intl.NumberFormat("es-MX");
  var MEDIDAS = Object.keys(CONFIG.precios);
  var millares = 1;

  var dinero = function (n) { return (n % 1 === 0 ? p0 : p2).format(n); };
  var etiqueta = function (m) { return m.replace("x", " × ") + " cm"; };
  var textoMillares = function (n) { return n + (n === 1 ? " millar" : " millares"); };
  var elegido = function (nombre) { return document.querySelector('input[name="' + nombre + '"]:checked').value; };

  function cantidades(m, t) {
    return Object.keys(CONFIG.precios[m][t]).map(Number).sort(function (a, b) { return a - b; });
  }
  function fila(lista, k, v) {
    var d = document.createElement("div"), dt = document.createElement("dt"), dd = document.createElement("dd");
    dt.textContent = k; dd.textContent = v; d.appendChild(dt); d.appendChild(dd); lista.appendChild(d);
  }

  function calcular() {
    var m = elegido("medida"), t = elegido("tintas");
    var opciones = cantidades(m, t);

    // si la medida elegida no tiene la cantidad actual, usa la más cercana (la menor en caso de empate)
    if (opciones.indexOf(millares) < 0) {
      millares = opciones.reduce(function (mejor, n) {
        return Math.abs(n - millares) < Math.abs(mejor - millares) ? n : mejor;
      }, opciones[0]);
    }

    var cont = $("cantidades");
    cont.textContent = "";
    opciones.forEach(function (n) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = textoMillares(n);
      b.setAttribute("aria-pressed", String(n === millares));
      b.addEventListener("click", function () { millares = n; calcular(); });
      cont.appendChild(b);
    });

    var total = CONFIG.precios[m][t][millares];
    var porMillar = total / millares;
    $("total").textContent = dinero(total);

    var detalle = $("detalle");
    detalle.textContent = "";
    fila(detalle, "Medida", etiqueta(m));
    fila(detalle, "Tintas", t === "1" ? "1 tinta" : "2 tintas");
    fila(detalle, "Cantidad", textoMillares(millares) + " (" + miles.format(millares * 1000) + " hojas)");
    fila(detalle, "Precio por millar", dinero(porMillar));

    var comparar = $("comparar");
    comparar.textContent = "";
    MEDIDAS.forEach(function (x) {
      var precio = CONFIG.precios[x][t][millares];
      var tr = document.createElement("tr");
      [etiqueta(x), precio ? dinero(precio / millares) : "—", precio ? dinero(precio) : "Consultar"].forEach(function (txt) {
        var td = document.createElement("td"); td.textContent = txt; tr.appendChild(td);
      });
      comparar.appendChild(tr);
    });

    var ciudad = $("ciudad").value.trim();
    var texto = "Hola, quiero cotizar en Papel Sultana.\n" +
      "Medida: " + etiqueta(m) + "\n" +
      "Tintas: " + t + "\n" +
      "Cantidad: " + textoMillares(millares) + " (" + miles.format(millares * 1000) + " hojas)\n" +
      "Total de lista: " + dinero(total) + "\n" +
      (ciudad ? "Ciudad para el envío: " + ciudad + "\n" : "") +
      "Quiero confirmar mi pedido.";
    $("wa").href = "https://wa.me/" + CONFIG.telefono + "?text=" + encodeURIComponent(texto);
  }

  document.querySelectorAll('input[name="medida"],input[name="tintas"]').forEach(function (i) { i.addEventListener("change", calcular); });
  $("ciudad").addEventListener("input", calcular);
  calcular();
})();
