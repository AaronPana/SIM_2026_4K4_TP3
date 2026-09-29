// Slide 3: análisis sin aleatoriedad. Ejemplo del enunciado, tiempo mínimo teórico e intervalos.
import Reveal from "../Reveal.jsx";
import RedProyecto from "../../diagramas/RedProyecto.jsx";
import {
  calcularProyecto,
  tiempoMinimoTeorico,
} from "../../../domain/proyecto/redProyecto.js";
import { construirIntervalos } from "../../../domain/estimadores/distribucionFrecuencia.js";
import { PARAMETROS_POR_DEFECTO as P } from "../../../config/parametrosPorDefecto.js";
import { etiquetaIntervalo } from "../../../utils/formato.js";

// Datos fijos del "simulacro" del enunciado.
const EJEMPLO = { A: 15, B: 30, C: 5, D: 10, E: 5, F: 15 };
const ej = calcularProyecto(EJEMPLO, (v) => v);

const tMin = tiempoMinimoTeorico(P.actividades);
const { cantidadIntervalos, rangoIntervalos } = P.estimadores;
const intervalos = construirIntervalos(
  tMin,
  cantidadIntervalos,
  rangoIntervalos,
);
const minB = Math.min(...P.actividades.B.filas.map((f) => f.valor));
const minF = Math.min(...P.actividades.F.filas.map((f) => f.valor));

export default function SlideAnalisisDeterministico() {
  return (
    <section className="slide">
      <Reveal className="slide-cuerpo">
        <h2 className="slide-titulo">Ruta crítica, holgura y tiempo mínimo</h2>
        <div className="dos-columnas">
          <div>
            <h3 className="subtitulo">Ejemplo con datos fijos del enunciado</h3>
            <RedProyecto ruta={ej.ruta} duraciones={EJEMPLO} />
            <ul className="lista-simple">
              <li>Ruta A–B–F: 15 + 30 + 15 = {ej.finRama1 + EJEMPLO.F} min</li>
              <li>
                Ruta C–D–E–F: 5 + 10 + 5 + 15 = {ej.finRama2 + EJEMPLO.F} min
              </li>
              <li>
                La rama más lenta es la <strong>crítica</strong> y fija T ={" "}
                {ej.T} min. La otra tiene una <strong>holgura</strong> de{" "}
                {ej.holgura} min: puede atrasarse eso sin demorar el despacho.
              </li>
              <li>
                Si las dos ramas terminan en el mismo minuto hay{" "}
                <strong>empate</strong>: las dos son críticas y se cuentan
                ambas. Por eso las proporciones de criticidad pueden sumar un
                poco más de 100 %.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="subtitulo">
              Tiempo mínimo teórico (simulacro con mínimos)
            </h3>
            <p className="formula formula-chica">
              máx({P.actividades.A.valor} + {minB} ; {P.actividades.C.valor} +{" "}
              {P.actividades.D.a} + 0) + {minF} = {tMin} min
            </p>
            <p className="texto">
              E es exponencial, así que su mínimo es 0. Este valor se conoce
              antes de simular, por eso sirve como extremo inferior de la
              distribución de frecuencias.
            </p>
            <h3 className="subtitulo">
              Intervalos de la distribución de frecuencias
            </h3>
            <p className="texto">
              Los primeros {cantidadIntervalos - 1} son de igual ancho (
              {rangoIntervalos} / {cantidadIntervalos - 1} ={" "}
              {rangoIntervalos / (cantidadIntervalos - 1)} min) y el último
              empieza {rangoIntervalos} min después del primero y contiene el
              resto.
            </p>
            <div className="chips">
              {intervalos.map((iv, i) => (
                <span key={i} className="chip">
                  {etiquetaIntervalo(iv)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
