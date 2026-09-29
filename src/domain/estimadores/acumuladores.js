// Estimadores que se arrastran de iteración en iteración: nuevo = f(anterior, iteración actual).
import { RUTAS } from "../proyecto/redProyecto.js";
import { indiceIntervalo } from "./distribucionFrecuencia.js";

// Estado en la iteración 0: todo en cero, sin promedios todavía.
export function estadoInicialEstimadores(cantidadIntervalos) {
  return {
    sumaT: 0,
    promedioT: null,
    minT: null,
    sumaB: 0,
    sumaD: 0,
    sumaE: 0,
    sumaF: 0,
    promB: null,
    promD: null,
    promE: null,
    promF: null,
    contRama1: 0,
    propRama1: null,
    contRama2: 0,
    propRama2: null,
    sumaHolgura: 0,
    promHolgura: null,
    contMenorIgual: 0,
    probMenorIgual: null,
    contMayorIgual: 0,
    probMayorIgual: null,
    frecuencias: new Array(cantidadIntervalos).fill(0),
  };
}

// Actualiza los estimadores con la iteración n. Solo usa el estado anterior, no filas pasadas.
export function actualizarEstimadores(ant, it, ctx) {
  const { n, T, B, D, E, F, ruta, holgura } = it;
  const {
    truncar,
    limiteMenorIgual,
    limiteMayorIgual,
    intervalos,
    observacionesHistograma,
  } = ctx;

  const sumaT = truncar(ant.sumaT + T);
  const sumaB = ant.sumaB + B;
  const sumaD = truncar(ant.sumaD + D);
  const sumaE = truncar(ant.sumaE + E);
  const sumaF = ant.sumaF + F;

  // En un empate cuentan las dos ramas.
  const contRama1 = ant.contRama1 + (ruta !== RUTAS.EMPAQUE ? 1 : 0);
  const contRama2 = ant.contRama2 + (ruta !== RUTAS.PRODUCTO ? 1 : 0);

  // Minutos que le sobraron a la rama no crítica.
  const sumaHolgura = truncar(ant.sumaHolgura + holgura);

  const contMenorIgual = ant.contMenorIgual + (T <= limiteMenorIgual ? 1 : 0);
  const contMayorIgual = ant.contMayorIgual + (T >= limiteMayorIgual ? 1 : 0);

  // El histograma solo cuenta las primeras "observacionesHistograma" iteraciones.
  const frecuencias = [...ant.frecuencias];
  if (n <= observacionesHistograma)
    frecuencias[indiceIntervalo(intervalos, T)] += 1;

  return {
    sumaT,
    promedioT: truncar(sumaT / n),
    minT: ant.minT === null ? T : Math.min(ant.minT, T),
    sumaB,
    sumaD,
    sumaE,
    sumaF,
    promB: truncar(sumaB / n),
    promD: truncar(sumaD / n),
    promE: truncar(sumaE / n),
    promF: truncar(sumaF / n),
    contRama1,
    propRama1: truncar(contRama1 / n),
    contRama2,
    propRama2: truncar(contRama2 / n),
    sumaHolgura,
    promHolgura: truncar(sumaHolgura / n),
    contMenorIgual,
    probMenorIgual: truncar(contMenorIgual / n),
    contMayorIgual,
    probMayorIgual: truncar(contMayorIgual / n),
    frecuencias,
  };
}
