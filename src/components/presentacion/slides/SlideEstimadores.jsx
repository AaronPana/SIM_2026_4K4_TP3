// Slide 6: estimadores pedidos por el enunciado y cómo se calcula cada uno sin guardar la tabla.
import Reveal from "../Reveal.jsx";
import { PARAMETROS_POR_DEFECTO as P } from "../../../config/parametrosPorDefecto.js";
import { posicionPercentil } from "../../../domain/estimadores/percentil.js";

const e = P.estimadores;
const pos = posicionPercentil(e.muestraPercentil, e.nivelPercentil);

// Cada estimador: nombre, cómo se calcula y qué significa.
const ESTIMADORES = [
  [
    "Variable objetivo",
    "T: duración total del proyecto en cada iteración.",
    "Cuánto tardó en salir ese pedido.",
  ],
  [
    "Tiempo promedio",
    "T̄(n) = ΣT / n. Se arrastra la suma, no los valores.",
    "Cuánto tarda un pedido en promedio.",
  ],
  [
    "Duración de cada actividad",
    "Promedio acumulado de B, D, E y F. A y C son constantes.",
    "Cuánto tarda en promedio cada tarea.",
  ],
  [
    "Proporción crítica",
    "Contador de veces que cada rama fue la más lenta, dividido n. F es crítica siempre.",
    "Qué tareas conviene acelerar: las que más seguido demoran el despacho.",
  ],
  [
    "Holgura promedio",
    "Suma acumulada de la holgura dividida n.",
    "Cuántos minutos, en promedio, le sobran a la rama que no es crítica.",
  ],
  [
    `Tiempo a fijar al ${e.nivelPercentil * 100} %`,
    `Se ordenan las primeras ${e.muestraPercentil} T y se toma la posición ⌈${e.nivelPercentil} · (${e.muestraPercentil} + 1)⌉ = ${pos}.`,
    `El tiempo que se le puede prometer al cliente cumpliendo en al menos el ${e.nivelPercentil * 100} % de los casos.`,
  ],
  [
    `P(T ≤ ${e.limiteMenorIgual}min)`,
    `Contador de T ≤ ${e.limiteMenorIgual}min, dividido n.`,
    `Qué parte de los pedidos sale en ${e.limiteMenorIgual} minutos o menos.`,
  ],
  [
    `P(T ≥ ${e.limiteMayorIgual}min)`,
    `Contador de T ≥ ${e.limiteMayorIgual}min, dividido n.`,
    `Qué parte de los pedidos tarda ${e.limiteMayorIgual} minutos o más.`,
  ],
  [
    "Distribución de frecuencias",
    `${e.cantidadIntervalos} contadores, uno por intervalo; cada T suma 1 en el suyo.`,
    "Cómo se reparten los tiempos: dónde se concentran y qué tan dispersos son.",
  ],
];

export default function SlideEstimadores() {
  return (
    <section className="slide">
      <Reveal className="slide-cuerpo">
        <h2 className="slide-titulo">Estimadores</h2>
        <p className="slide-bajada">
          Todos se actualizan en cada iteración a partir del vector anterior,
          así están disponibles en cualquier instante de la simulación.
        </p>
        <dl className="lista-definiciones lista-definiciones-compacta">
          {ESTIMADORES.map(([t, d, i]) => (
            <div key={t} className="definicion">
              <dt>{t}</dt>
              <dd>
                {d}
                <span className="celda-detalle">{i}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
