// Distribución de frecuencias en barras (SVG) con su tabla de frecuencias absolutas y relativas.
import { etiquetaIntervalo, formatearPorcentaje } from "../../utils/formato.js";

const ANCHO = 720;
const ALTO = 220;
const MARGEN = 28;
const MARGEN_INFERIOR = 40;
const Y_ROTULO = 18;

// Rótulos del eje: ancho estimado por carácter (fuente de 11 px) y ángulo si no entran.
const ANCHO_CARACTER = 6.5;
const ANGULO = 40;
const SEN = Math.sin((ANGULO * Math.PI) / 180);
const COS = Math.cos((ANGULO * Math.PI) / 180);
const ALTO_LINEA = 13; // separación mínima entre rótulos rotados
const MIN_ANCHO_VALOR = 28; // debajo de esto no se escribe la frecuencia sobre la barra

export default function Histograma({ frecuencias, observaciones }) {
  const max = Math.max(...frecuencias.map((f) => f.relativa), 0.0001);
  const anchoBarra = (ANCHO - MARGEN * 2) / frecuencias.length;

  // Si el rótulo más largo no entra en su barra, se rotan todos.
  const rotulos = frecuencias.map(etiquetaIntervalo);
  const anchoRotulo = Math.max(...rotulos.map((r) => r.length)) * ANCHO_CARACTER;
  const rotar = anchoRotulo > anchoBarra;
  // Rotados, si las barras son muy angostas se muestra uno cada "paso" para que no se pisen.
  const paso = rotar ? Math.max(1, Math.ceil(ALTO_LINEA / (anchoBarra * SEN))) : 1;
  const margenInferior = rotar
    ? Math.max(MARGEN_INFERIOR, Math.ceil(Y_ROTULO + anchoRotulo * SEN + 8))
    : MARGEN_INFERIOR;
  // El primer rótulo rotado se extiende a la izquierda del gráfico: se corre el viewBox.
  const xMin = rotar
    ? Math.min(0, Math.floor(MARGEN + anchoBarra / 2 - anchoRotulo * COS - 4))
    : 0;
  const mostrarValor = anchoBarra >= MIN_ANCHO_VALOR;

  return (
    <div className="histograma">
      <p className="nota">
        Sobre {observaciones.toLocaleString("es-AR")} observaciones.
      </p>
      <svg
        viewBox={`${xMin} 0 ${ANCHO - xMin} ${ALTO + margenInferior}`}
        role="img"
        aria-label="Distribución de frecuencias de T"
      >
        {frecuencias.map((f, i) => {
          const alto = (f.relativa / max) * (ALTO - MARGEN);
          const x = MARGEN + i * anchoBarra;
          const centro = x + anchoBarra / 2;
          return (
            <g key={i}>
              <rect
                x={x + 4}
                y={ALTO - alto}
                width={anchoBarra - 8}
                height={alto}
                className="histograma-barra"
              />
              {mostrarValor && (
                <text
                  x={centro}
                  y={ALTO - alto - 6}
                  className="histograma-valor"
                >
                  {f.absoluta.toLocaleString("es-AR")}
                </text>
              )}
              {i % paso === 0 && (
                <text
                  x={centro}
                  y={ALTO + Y_ROTULO}
                  className={`histograma-eje ${rotar ? "rotado" : ""}`}
                  transform={
                    rotar
                      ? `rotate(-${ANGULO} ${centro} ${ALTO + Y_ROTULO})`
                      : undefined
                  }
                >
                  {rotulos[i]}
                </text>
              )}
            </g>
          );
        })}
        <line
          x1={MARGEN}
          y1={ALTO}
          x2={ANCHO - MARGEN}
          y2={ALTO}
          className="histograma-base"
        />
      </svg>
      <div className="tabla-scroll-x">
        <table className="tabla-resumen">
          <thead>
            <tr>
              <th>Intervalo</th>
              {frecuencias.map((f, i) => (
                <th key={i}>{etiquetaIntervalo(f)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Absoluta</td>
              {frecuencias.map((f, i) => (
                <td key={i}>{f.absoluta.toLocaleString("es-AR")}</td>
              ))}
            </tr>
            <tr>
              <td>Relativa</td>
              {frecuencias.map((f, i) => (
                <td key={i}>{formatearPorcentaje(f.relativa)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
