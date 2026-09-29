// Diagrama de flujo de una iteración del motor, con el ciclo de vuelta hasta N.

const PASOS = [
  "Tomar el vector anterior",
  "Sortear RND de B, D, E y F (un GCM cada uno)",
  "Generar B y F (tabla) · D y E (transformada)",
  "Calcular ramas, T, ruta crítica y holgura",
  "Actualizar estimadores desde el anterior",
  "¿n dentro de [desde; hasta]? → copiar fila",
  "El actual pasa a ser el anterior",
];
const X = 40;
const W = 420;
const H = 44;
const GAP = 18;

export default function FlujoIteracion() {
  const alto = PASOS.length * (H + GAP) + 70;
  const yDecision = PASOS.length * (H + GAP) + 6;
  return (
    <svg
      className="flujo"
      viewBox={`0 0 560 ${alto}`}
      role="img"
      aria-label="Flujo de una iteración"
    >
      <defs>
        <marker
          id="flecha-flujo"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" className="red-flecha" />
        </marker>
      </defs>
      {PASOS.map((texto, i) => {
        const y = i * (H + GAP);
        return (
          <g key={i}>
            <rect
              x={X}
              y={y}
              width={W}
              height={H}
              rx="8"
              className={`flujo-paso ${i === 5 ? "es-decision" : ""}`}
            />
            <text x={X + 16} y={y + 28} className="flujo-texto">
              {texto}
            </text>
            <line
              x1={X + W / 2}
              y1={y + H}
              x2={X + W / 2}
              y2={y + H + GAP - 2}
              className="flujo-linea"
              markerEnd="url(#flecha-flujo)"
            />
          </g>
        );
      })}
      <rect
        x={X}
        y={yDecision}
        width={W}
        height={H}
        rx="22"
        className="flujo-fin"
      />
      <text x={X + 16} y={yDecision + 28} className="flujo-texto">
        ¿n &lt; N? Sí: n + 1 y volver · No: fin
      </text>
      <path
        d={`M${X + W},${yDecision + H / 2} H${X + W + 50} V${H / 2} H${X + W + 4}`}
        className="flujo-linea"
        markerEnd="url(#flecha-flujo)"
      />
    </svg>
  );
}
