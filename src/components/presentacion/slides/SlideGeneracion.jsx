// Slide 5: generador congruencial mixto y precisión por truncamiento.
import Reveal from "../Reveal.jsx";
import { crearGCM } from "../../../domain/generadores/congruencialMixto.js";
import { uniforme } from "../../../domain/distribuciones/uniforme.js";
import { exponencial } from "../../../domain/distribuciones/exponencial.js";
import { crearTruncador } from "../../../utils/truncar.js";
import { formatearValor } from "../../../utils/formato.js";
import { PARAMETROS_POR_DEFECTO as P } from "../../../config/parametrosPorDefecto.js";

const g = P.generadores.B;
const gcm = crearGCM(g);
const primeros = [gcm.siguiente(), gcm.siguiente(), gcm.siguiente()];

// Ejemplo de precisión con el primer X generado.
const { a, b } = P.actividades.D;
const media = P.actividades.E.media;
const ejemplos = ["completa", 4, 2].map((prec) => {
  const t = crearTruncador(prec);
  const rnd = t(primeros[0].rnd);
  return {
    prec,
    rnd,
    D: t(uniforme(rnd, a, b)),
    E: t(exponencial(rnd, media)),
  };
});
const fmt = (v) => formatearValor(v, "decimal", "completa");

export default function SlideGeneracion() {
  return (
    <section className="slide">
      <Reveal className="slide-cuerpo">
        <h2 className="slide-titulo">Generación de números aleatorios</h2>
        <div className="dos-columnas">
          <div>
            <p className="formula">X(n+1) = (a · X(n) + c) mod m</p>
            <p className="formula formula-chica">RND = X / m ∈ [0; 1)</p>
            <ul className="lista-simple">
              <li>
                Un generador congruencial mixto independiente para cada variable
                aleatoria: B, D, E y F.
              </li>
              <li>
                Valores de prueba: X0 = {g.x0}, a = {g.a}, c = {g.c}, m = legajo
                ({g.m.toLocaleString("es-AR")}).
              </li>
              <li>El primer RND sale de X1; la semilla no se usa como RND.</li>
              <li>
                Se divide por m (no por m − 1) para que el RND nunca valga 1.
              </li>
              <li>
                Con los mismos parámetros, los cuatro generadores producen la
                misma secuencia y B, D, E y F usan el mismo RND en cada
                iteración. Eso distorsiona los resultados; por eso el enunciado
                pide un generador distinto por variable.
              </li>
            </ul>
            <table className="tabla-slide">
              <caption>Primeros valores con los parámetros de prueba</caption>
              <thead>
                <tr>
                  <th>n</th>
                  <th>X(n)</th>
                  <th>RND</th>
                </tr>
              </thead>
              <tbody>
                {primeros.map((p, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{p.x}</td>
                    <td>{fmt(p.rnd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="subtitulo">
              Precisión: se trunca, nunca se redondea
            </h3>
            <p className="texto">
              Un único parámetro fija cuántos decimales se conservan en todo
              número no entero. Cambia los resultados, no solo cómo se ven:
              permite replicar exactamente las cuentas de la cátedra.
            </p>
            <table className="tabla-slide">
              <thead>
                <tr>
                  <th>Precisión</th>
                  <th>RND</th>
                  <th>D</th>
                  <th>E</th>
                </tr>
              </thead>
              <tbody>
                {ejemplos.map((e) => (
                  <tr key={e.prec}>
                    <td>
                      {e.prec === "completa"
                        ? "Completa"
                        : `${e.prec} decimales`}
                    </td>
                    <td>{fmt(e.rnd)}</td>
                    <td>{fmt(e.D)}</td>
                    <td>{fmt(e.E)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="texto">
              Redondear podría convertir 0,996 en 1,00 y la exponencial pediría
              ln(0). Truncando, el RND nunca llega a 1.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
