// Slide 8: vector de estado, regla de "solo anterior y actual" y flujo del motor.
import Reveal from "../Reveal.jsx";
import FlujoIteracion from "../../diagramas/FlujoIteracion.jsx";

const GRUPOS = [
  [
    "Generadores y variables",
    "X, RND y valor de B, D, E y F; A y C constantes.",
  ],
  [
    "Red del proyecto",
    "Minuto en que termina cada rama (A + B y C + D + E), minuto en que empieza F (el mayor de los dos), T = inicio de F + F, qué rama terminó más tarde (ruta crítica) y cuánto le sobró a la otra (holgura).",
  ],
  [
    "Estimadores",
    "Sumas y promedios (T, actividades y holgura), contadores y proporciones de criticidad y probabilidades, percentil y frecuencias.",
  ],
];

export default function SlideVectorMotor({ onComenzar }) {
  return (
    <section className="slide">
      <Reveal className="slide-cuerpo">
        <h2 className="slide-titulo">Vector de estado y motor</h2>
        <div className="dos-columnas">
          <div>
            <p className="texto">
              Cada iteración es una ejecución independiente del proyecto: no hay
              memoria entre filas, salvo los acumuladores. El motor trabaja solo
              con el vector anterior y el actual.
            </p>
            <dl className="lista-definiciones lista-definiciones-compacta">
              {GRUPOS.map(([t, d]) => (
                <div key={t} className="definicion">
                  <dt>{t}</dt>
                  <dd>{d}</dd>
                </div>
              ))}
            </dl>
            <p className="texto">
              De las N iteraciones solo se copian las del rango elegido, más la
              última. El Excel exporta exactamente esas mismas filas.
            </p>
            <button className="boton boton-primario" onClick={onComenzar}>
              Ir al simulador
            </button>
          </div>
          <FlujoIteracion />
        </div>
      </Reveal>
    </section>
  );
}
