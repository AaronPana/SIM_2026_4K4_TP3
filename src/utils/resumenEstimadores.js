// Arma el resumen final de estimadores a partir de la última fila. Lo usan el panel y el Excel.
import { posicionPercentil } from "../domain/estimadores/percentil.js";

export function resumenEstimadores(resultado) {
  const { ultima, tMinimo, parametros: p } = resultado;
  const e = ultima.estimadores;
  const est = p.estimadores;
  const act = p.actividades;
  const pos = posicionPercentil(est.muestraPercentil, est.nivelPercentil);

  const duracion = [
    {
      etiqueta: "Tiempo mínimo teórico (simulacro)",
      valor: tMinimo,
      tipo: "decimal",
      unidad: "min",
    },
    {
      etiqueta: `Tiempo promedio (n = ${ultima.iteracion.toLocaleString("es-AR")})`,
      valor: e.promedioT,
      tipo: "decimal",
      unidad: "min",
    },
    {
      etiqueta: "Tiempo mínimo observado",
      valor: e.minT,
      tipo: "decimal",
      unidad: "min",
    },
    {
      etiqueta: "Holgura promedio de la rama no crítica",
      valor: e.promHolgura,
      tipo: "decimal",
      unidad: "min",
    },
    {
      etiqueta: `Tiempo a fijar (${est.nivelPercentil * 100} %, primeras ${est.muestraPercentil}, posición ${pos})`,
      valor: ultima.percentil,
      tipo: "decimal",
      unidad: "min",
    },
    {
      etiqueta: `P(T ≤ ${est.limiteMenorIgual}min)`,
      valor: e.probMenorIgual,
      tipo: "proporcion",
    },
    {
      etiqueta: `P(T ≥ ${est.limiteMayorIgual}min)`,
      valor: e.probMayorIgual,
      tipo: "proporcion",
    },
  ];

  // Duración promedio de cada actividad (A y C son constantes).
  const actividades = [
    { codigo: "A", promedio: act.A.valor, critica: e.propRama1 },
    { codigo: "B", promedio: e.promB, critica: e.propRama1 },
    { codigo: "C", promedio: act.C.valor, critica: e.propRama2 },
    { codigo: "D", promedio: e.promD, critica: e.propRama2 },
    { codigo: "E", promedio: e.promE, critica: e.propRama2 },
    { codigo: "F", promedio: e.promF, critica: 1 }, // F está en todas las rutas
  ];

  // Frecuencia relativa sobre las observaciones que efectivamente se contaron.
  const obs = Math.min(resultado.observacionesHistograma, ultima.iteracion);
  const frecuencias = resultado.intervalos.map((iv, i) => ({
    ...iv,
    absoluta: e.frecuencias[i],
    relativa: obs ? e.frecuencias[i] / obs : 0,
  }));

  return { duracion, actividades, frecuencias, observaciones: obs };
}
