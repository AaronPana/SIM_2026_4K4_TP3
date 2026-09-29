// Valores por defecto: los de prueba del enunciado + los que fijamos nosotros para ejecutar.
import { LEGAJO } from "./constantes.js";

// GCM de prueba del enunciado; el módulo es el legajo.
const generadorPrueba = () => ({ x0: 3922, a: 1221, c: 1714, m: LEGAJO });

export const PARAMETROS_POR_DEFECTO = {
  // No los fija el enunciado: son nuestros.
  ejecucion: {
    n: 1000,
    desde: 1,
    hasta: 100,
    precision: "completa",
  },

  // Un generador por cada variable aleatoria (A y C son constantes, no usan RND).
  generadores: {
    B: generadorPrueba(),
    D: generadorPrueba(),
    E: generadorPrueba(),
    F: generadorPrueba(),
  },

  actividades: {
    A: { valor: 15 },
    B: {
      filas: [
        { valor: 20, prob: 0.25 },
        { valor: 30, prob: 0.4 },
        { valor: 40, prob: 0.35 },
      ],
    },
    C: { valor: 5 },
    D: { a: 5, b: 25 },
    E: { media: 5 },
    F: {
      filas: [
        { etiqueta: "Montacargas libre", valor: 15, prob: 0.5 },
        { etiqueta: "Montacargas ocupado", valor: 25, prob: 0.5 },
      ],
    },
  },

  estimadores: {
    limiteMenorIgual: 60,
    limiteMayorIgual: 90,
    muestraPercentil: 99,
    nivelPercentil: 0.95,
    cantidadIntervalos: 10,
    rangoIntervalos: 90,
    // Si está activo, el histograma usa las N iteraciones.
    histogramaUsaN: true,
    observacionesHistograma: 1000,
  },
};
