// Esquema ÚNICO de columnas del vector de estado. Lo usan la tabla en pantalla y el Excel.
import { etiquetaIntervalo } from "../utils/formato.js";

// Atajos: columna de la fila o de sus estimadores.
const col = (clave, titulo, tipo) => ({
  clave,
  titulo,
  tipo,
  obtener: (f) => f[clave],
});
const est = (clave, titulo, tipo) => ({
  clave,
  titulo,
  tipo,
  obtener: (f) => f.estimadores[clave],
});

// Bloque de una variable aleatoria: X del generador, RND y valor generado.
const bloqueVariable = (v, tituloValor) => [
  col(`x${v}`, `X ${v}`, "crudo"), // sin separador de miles: es el estado del GCM
  col(`rnd${v}`, `RND ${v}`, "decimal"),
  col(v, tituloValor, v === "B" || v === "F" ? "entero" : "decimal"),
];

// Arma los grupos de columnas. Frecuencias y probabilidades dependen de los parámetros usados.
export function construirColumnas({
  intervalos,
  limiteMenorIgual,
  limiteMayorIgual,
}) {
  const li = limiteMenorIgual.toLocaleString("es-AR");
  const ls = limiteMayorIgual.toLocaleString("es-AR");
  return [
    { grupo: "", columnas: [col("iteracion", "n", "entero")] },
    {
      grupo: "Constantes",
      columnas: [col("A", "A", "decimal"), col("C", "C", "decimal")],
    },
    { grupo: "B · Picking", columnas: bloqueVariable("B", "B [min]") },
    { grupo: "D · Packing", columnas: bloqueVariable("D", "D [min]") },
    { grupo: "E · Control", columnas: bloqueVariable("E", "E [min]") },
    {
      grupo: "F · Despacho",
      columnas: [
        ...bloqueVariable("F", "F [min]"),
        col("estadoF", "Montacargas", "texto"),
      ],
    },
    {
      grupo: "Red del proyecto",
      columnas: [
        col("finRama1", "Fin A+B", "decimal"),
        col("finRama2", "Fin C+D+E", "decimal"),
        col("inicioF", "Inicio F", "decimal"),
        col("T", "T [min]", "decimal"),
        col("ruta", "Ruta crítica", "texto"),
        col("holgura", "Holgura", "decimal"),
      ],
    },
    {
      grupo: "Duración del proyecto",
      columnas: [
        est("sumaT", "Σ T", "decimal"),
        est("promedioT", "T promedio", "decimal"),
        est("minT", "T mín. observado", "decimal"),
      ],
    },
    {
      grupo: "Promedio por actividad",
      columnas: [
        est("promB", "B prom.", "decimal"),
        est("promD", "D prom.", "decimal"),
        est("promE", "E prom.", "decimal"),
        est("promF", "F prom.", "decimal"),
      ],
    },
    {
      grupo: "Criticidad",
      columnas: [
        est("contRama1", "Cont. A-B", "entero"),
        est("propRama1", "Prop. A-B", "decimal"),
        est("contRama2", "Cont. C-D-E", "entero"),
        est("propRama2", "Prop. C-D-E", "decimal"),
        est("promHolgura", "Holgura prom.", "decimal"),
      ],
    },
    {
      grupo: "Probabilidades",
      columnas: [
        est("contMenorIgual", `Cont. T ≤ ${li}min`, "entero"),
        est("probMenorIgual", `P(T ≤ ${li}min)`, "decimal"),
        est("contMayorIgual", `Cont. T ≥ ${ls}min`, "entero"),
        est("probMayorIgual", `P(T ≥ ${ls}min)`, "decimal"),
      ],
    },
    {
      grupo: "Percentil",
      columnas: [col("percentil", "T percentil", "decimal")],
    },
    {
      grupo: "Frecuencias absolutas",
      columnas: intervalos.map((iv, i) => ({
        clave: `frec${i}`,
        titulo: etiquetaIntervalo(iv),
        tipo: "entero",
        obtener: (f) => f.estimadores.frecuencias[i],
      })),
    },
  ];
}

// Lista plana de columnas (útil para recorrer celdas).
export const aplanarColumnas = (grupos) => grupos.flatMap((g) => g.columnas);
