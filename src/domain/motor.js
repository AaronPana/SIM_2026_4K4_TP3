// Motor Montecarlo: recorre N iteraciones con solo dos vectores (anterior y actual).
import { crearGCM } from "./generadores/congruencialMixto.js";
import { constante } from "./distribuciones/constante.js";
import { uniforme } from "./distribuciones/uniforme.js";
import { exponencial } from "./distribuciones/exponencial.js";
import {
  construirTablaAcumulada,
  buscarEnTabla,
} from "./distribuciones/discreta.js";
import {
  calcularProyecto,
  tiempoMinimoTeorico,
} from "./proyecto/redProyecto.js";
import { construirIntervalos } from "./estimadores/distribucionFrecuencia.js";
import { crearMuestraPercentil } from "./estimadores/percentil.js";
import {
  estadoInicialEstimadores,
  actualizarEstimadores,
} from "./estimadores/acumuladores.js";
import { crearTruncador } from "../utils/truncar.js";

// Prepara todo lo que no cambia entre iteraciones (generadores, tablas, intervalos).
function prepararContexto(p) {
  const { ejecucion, generadores, actividades, estimadores: est } = p;
  const truncar = crearTruncador(ejecucion.precision);
  const tMinimo = tiempoMinimoTeorico(actividades);
  const intervalos = construirIntervalos(
    tMinimo,
    est.cantidadIntervalos,
    est.rangoIntervalos,
  );

  return {
    truncar,
    tMinimo,
    intervalos,
    gcm: {
      B: crearGCM(generadores.B),
      D: crearGCM(generadores.D),
      E: crearGCM(generadores.E),
      F: crearGCM(generadores.F),
    },
    tablaB: construirTablaAcumulada(actividades.B.filas),
    tablaF: construirTablaAcumulada(actividades.F.filas),
    actividades,
    muestra: crearMuestraPercentil(est.muestraPercentil, est.nivelPercentil),
    limiteMenorIgual: est.limiteMenorIgual,
    limiteMayorIgual: est.limiteMayorIgual,
    observacionesHistograma: est.histogramaUsaN
      ? ejecucion.n
      : est.observacionesHistograma,
  };
}

// Sortea un RND del generador de una variable y lo trunca a la precisión elegida.
function sortear(ctx, variable) {
  const { x, rnd } = ctx.gcm[variable].siguiente();
  return { x, rnd: ctx.truncar(rnd) };
}

// Calcula el vector actual a partir del anterior. Esta es "una fila" de la simulación.
function calcularIteracion(n, anterior, ctx) {
  const { truncar, actividades: act } = ctx;

  const A = constante(act.A.valor);
  const C = constante(act.C.valor);

  const rB = sortear(ctx, "B");
  const B = buscarEnTabla(ctx.tablaB, rB.rnd).valor;

  const rD = sortear(ctx, "D");
  const D = truncar(uniforme(rD.rnd, act.D.a, act.D.b));

  const rE = sortear(ctx, "E");
  const E = truncar(exponencial(rE.rnd, act.E.media));

  const rF = sortear(ctx, "F");
  const filaF = buscarEnTabla(ctx.tablaF, rF.rnd);
  const F = filaF.valor;

  const proyecto = calcularProyecto({ A, B, C, D, E, F }, truncar);
  const estimadores = actualizarEstimadores(
    anterior.estimadores,
    {
      n,
      T: proyecto.T,
      B,
      D,
      E,
      F,
      ruta: proyecto.ruta,
      holgura: proyecto.holgura,
    },
    ctx,
  );

  ctx.muestra.agregar(proyecto.T);

  return {
    iteracion: n,
    xB: rB.x,
    rndB: rB.rnd,
    B,
    xD: rD.x,
    rndD: rD.rnd,
    D,
    xE: rE.x,
    rndE: rE.rnd,
    E,
    xF: rF.x,
    rndF: rF.rnd,
    F,
    estadoF: filaF.etiqueta,
    A,
    C,
    ...proyecto,
    estimadores,
    percentil: ctx.muestra.resultado(),
  };
}

// Ejecuta la simulación. Solo copia las filas del rango [desde; hasta] y siempre la última.
export function ejecutarSimulacion(parametros) {
  const { n: N, desde, hasta } = parametros.ejecucion;
  const ctx = prepararContexto(parametros);

  let anterior = {
    estimadores: estadoInicialEstimadores(ctx.intervalos.length),
  };
  const filas = [];

  for (let n = 1; n <= N; n++) {
    const actual = calcularIteracion(n, anterior, ctx);
    if (n >= desde && n <= hasta) filas.push(actual);
    anterior = actual; // el vector anterior se descarta: no se guarda la tabla
  }

  const ultimaIncluida = hasta === N;
  return {
    filas,
    ultima: anterior,
    ultimaIncluida,
    tMinimo: ctx.tMinimo,
    intervalos: ctx.intervalos,
    observacionesHistograma: Math.min(ctx.observacionesHistograma, N),
    parametros,
  };
}
