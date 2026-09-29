// Exporta a Excel lo mismo que muestra la tabla: filas del rango elegido + la última iteración.
// Los decimales se truncan a la precisión que se ve en pantalla.
import ExcelJS from "exceljs";
import {
  construirColumnas,
  aplanarColumnas,
} from "../config/columnasVector.js";
import { resumenEstimadores } from "../utils/resumenEstimadores.js";
import { etiquetaIntervalo, decimalesVisibles } from "../utils/formato.js";
import { crearTruncador } from "../utils/truncar.js";

// Trunca solo números; null y textos pasan sin cambios.
const truncarNumero = (truncar, v) => (typeof v === "number" ? truncar(v) : v);

const COLOR_ENCABEZADO = "FF1B2430";
const COLOR_GRUPO = "FF2F3B4C";
const COLOR_ULTIMA = "FFFCE8A6";

// Estilo de encabezado oscuro con texto blanco.
function estilizarEncabezado(fila, color) {
  fila.eachCell((celda) => {
    celda.font = { bold: true, color: { argb: "FFFFFFFF" } };
    celda.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: color },
    };
    celda.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
  });
}

// Hoja del vector: encabezado agrupado en dos filas, como en las planillas de la cátedra.
function hojaVector(wb, resultado, truncar) {
  const ws = wb.addWorksheet("Vector de estado", {
    views: [{ state: "frozen", xSplit: 1, ySplit: 2 }],
  });
  const grupos = construirColumnas({
    intervalos: resultado.intervalos,
    ...resultado.parametros.estimadores,
  });
  const columnas = aplanarColumnas(grupos);

  const filaGrupos = ws.addRow(
    grupos.flatMap((g) => g.columnas.map((_, i) => (i === 0 ? g.grupo : ""))),
  );
  let inicio = 1;
  grupos.forEach((g) => {
    const fin = inicio + g.columnas.length - 1;
    if (fin > inicio) ws.mergeCells(1, inicio, 1, fin);
    inicio = fin + 1;
  });
  estilizarEncabezado(filaGrupos, COLOR_GRUPO);
  estilizarEncabezado(
    ws.addRow(columnas.map((c) => c.titulo)),
    COLOR_ENCABEZADO,
  );

  // Solo las columnas "decimal" se truncan; enteros, crudos y textos van tal cual.
  const agregarFila = (fila) =>
    ws.addRow(
      columnas.map((c) => {
        const v = c.obtener(fila) ?? null;
        return c.tipo === "decimal" ? truncarNumero(truncar, v) : v;
      }),
    );
  resultado.filas.forEach(agregarFila);

  // Si la última iteración quedó fuera del rango, se agrega igual, separada.
  if (!resultado.ultimaIncluida) ws.addRow(["…"]);
  const ultima = agregarFila(resultado.ultima);
  ultima.eachCell((c) => {
    c.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLOR_ULTIMA },
    };
    c.font = { bold: true };
  });

  ws.columns.forEach(
    (c, i) =>
      (c.width = Math.max(10, String(columnas[i]?.titulo ?? "").length + 2)),
  );
}

// Hoja de estimadores finales (última iteración).
function hojaEstimadores(wb, resumen, truncar) {
  const ws = wb.addWorksheet("Estimadores");
  const t = (v) => truncarNumero(truncar, v);
  estilizarEncabezado(ws.addRow(["Estimador", "Valor"]), COLOR_ENCABEZADO);
  resumen.duracion.forEach((d) => ws.addRow([d.etiqueta, t(d.valor)]));
  ws.addRow([]);
  estilizarEncabezado(
    ws.addRow(["Actividad", "Duración promedio", "Proporción crítica"]),
    COLOR_ENCABEZADO,
  );
  resumen.actividades.forEach((a) =>
    ws.addRow([a.codigo, t(a.promedio), t(a.critica)]),
  );
  ws.columns = [{ width: 58 }, { width: 20 }, { width: 20 }];
}

// Hoja de la distribución de frecuencias.
function hojaFrecuencias(wb, resumen, truncar) {
  const ws = wb.addWorksheet("Distribución de frecuencias");
  const t = (v) => truncarNumero(truncar, v);
  ws.addRow([`Observaciones consideradas: ${resumen.observaciones}`]);
  estilizarEncabezado(
    ws.addRow([
      "Intervalo",
      "Desde",
      "Hasta",
      "Frecuencia absoluta",
      "Frecuencia relativa",
    ]),
    COLOR_ENCABEZADO,
  );
  resumen.frecuencias.forEach((f) =>
    ws.addRow([
      etiquetaIntervalo(f),
      t(f.desde),
      f.hasta === Infinity ? "∞" : t(f.hasta),
      f.absoluta,
      t(f.relativa),
    ]),
  );
  ws.columns = [
    { width: 18 },
    { width: 12 },
    { width: 12 },
    { width: 20 },
    { width: 20 },
  ];
}

// Hoja de parámetros usados en la corrida.
function hojaParametros(wb, p) {
  const ws = wb.addWorksheet("Parámetros");
  estilizarEncabezado(
    ws.addRow(["Grupo", "Parámetro", "Valor"]),
    COLOR_ENCABEZADO,
  );
  const e = p.ejecucion;
  ws.addRow(["Ejecución", "N iteraciones", e.n]);
  ws.addRow(["Ejecución", "Mostrar desde / hasta", `${e.desde} / ${e.hasta}`]);
  ws.addRow([
    "Ejecución",
    "Precisión",
    e.precision === "completa"
      ? "Completa"
      : `${e.precision} decimales (truncado)`,
  ]);
  Object.entries(p.generadores).forEach(([k, g]) =>
    ws.addRow([
      `Generador ${k}`,
      "X0 · a · c · m",
      `${g.x0} · ${g.a} · ${g.c} · ${g.m}`,
    ]),
  );
  const a = p.actividades;
  ws.addRow(["Actividad A", "Constante", a.A.valor]);
  ws.addRow([
    "Actividad B",
    "Discreta",
    a.B.filas.map((f) => `${f.valor} (${f.prob})`).join(" · "),
  ]);
  ws.addRow(["Actividad C", "Constante", a.C.valor]);
  ws.addRow(["Actividad D", "Uniforme [a; b]", `[${a.D.a}; ${a.D.b}]`]);
  ws.addRow(["Actividad E", "Exponencial, media", a.E.media]);
  ws.addRow([
    "Actividad F",
    "Discreta",
    a.F.filas.map((f) => `${f.etiqueta}: ${f.valor} (${f.prob})`).join(" · "),
  ]);
  const s = p.estimadores;
  ws.addRow([
    "Estimadores",
    "Límites P(T ≤ x) / P(T ≥ y)",
    `${s.limiteMenorIgual} / ${s.limiteMayorIgual}`,
  ]);
  ws.addRow([
    "Estimadores",
    "Percentil: muestra / nivel",
    `${s.muestraPercentil} / ${s.nivelPercentil}`,
  ]);
  ws.addRow([
    "Estimadores",
    "Intervalos / rango",
    `${s.cantidadIntervalos} / ${s.rangoIntervalos}`,
  ]);
  ws.addRow([
    "Estimadores",
    "Observaciones histograma",
    s.histogramaUsaN ? "N" : s.observacionesHistograma,
  ]);
  ws.columns = [{ width: 16 }, { width: 30 }, { width: 60 }];
}

export async function exportarExcel(resultado) {
  const wb = new ExcelJS.Workbook();
  const resumen = resumenEstimadores(resultado);
  // Misma cantidad de decimales que en pantalla (6 si la precisión es completa).
  const truncar = crearTruncador(
    decimalesVisibles(resultado.parametros.ejecucion.precision),
  );
  hojaVector(wb, resultado, truncar);
  hojaEstimadores(wb, resumen, truncar);
  hojaFrecuencias(wb, resumen, truncar);
  hojaParametros(wb, resultado.parametros);

  const buffer = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
  );
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: "SIM_2026_4K4_TP3.xlsx",
  });
  link.click();
  URL.revokeObjectURL(url);
}
