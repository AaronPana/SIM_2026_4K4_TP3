// Red del proyecto en SVG. Puede marcar la ruta crítica y mostrar duraciones debajo de cada nodo.
import { RUTAS } from "../../domain/proyecto/redProyecto.js";

// Posición y descripción de cada actividad (viewBox de 960 × 300).
const NODOS = {
  A: { x: 170, y: 40, nombre: "Pago y stock", rama: 1 },
  B: { x: 440, y: 40, nombre: "Picking", rama: 1 },
  C: { x: 110, y: 200, nombre: "Etiqueta", rama: 2 },
  D: { x: 310, y: 200, nombre: "Packing", rama: 2 },
  E: { x: 510, y: 200, nombre: "Control", rama: 2 },
  F: { x: 720, y: 120, nombre: "Despacho", rama: 0 },
};
const W = 150;
const H = 60;
const INICIO = { x: 40, y: 150 };
const FIN = { x: 925, y: 150 };

// Punto de anclaje izquierdo y derecho de un nodo.
const izq = (n) => ({ x: NODOS[n].x, y: NODOS[n].y + H / 2 });
const der = (n) => ({ x: NODOS[n].x + W, y: NODOS[n].y + H / 2 });

// Aristas de la red con la rama a la que pertenecen (0 = común a ambas).
const ARISTAS = [
  { de: { x: INICIO.x + 16, y: INICIO.y }, a: izq("A"), rama: 1 },
  { de: der("A"), a: izq("B"), rama: 1 },
  { de: der("B"), a: izq("F"), rama: 1 },
  { de: { x: INICIO.x + 16, y: INICIO.y }, a: izq("C"), rama: 2 },
  { de: der("C"), a: izq("D"), rama: 2 },
  { de: der("D"), a: izq("E"), rama: 2 },
  { de: der("E"), a: izq("F"), rama: 2 },
  { de: der("F"), a: { x: FIN.x - 16, y: FIN.y }, rama: 0 },
];

// Una rama es crítica según la ruta indicada; la rama 0 (F) siempre lo es.
function esCritica(rama, ruta) {
  if (!ruta) return false;
  if (rama === 0 || ruta === RUTAS.AMBAS) return true;
  return (
    (rama === 1 && ruta === RUTAS.PRODUCTO) ||
    (rama === 2 && ruta === RUTAS.EMPAQUE)
  );
}

// Curva suave entre dos puntos.
const curva = (p, q) => {
  const mx = (p.x + q.x) / 2;
  return `M${p.x},${p.y} C${mx},${p.y} ${mx},${q.y} ${q.x},${q.y}`;
};

export default function RedProyecto({
  ruta = null,
  duraciones = null,
  titulo = "Red del proyecto",
}) {
  return (
    <svg className="red" viewBox="0 0 960 300" role="img" aria-label={titulo}>
      <defs>
        <marker
          id="flecha"
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

      {ARISTAS.map((ar, i) => (
        <path
          key={i}
          d={curva(ar.de, ar.a)}
          className={`red-arista rama-${ar.rama} ${esCritica(ar.rama, ruta) ? "es-critica" : ""}`}
          markerEnd="url(#flecha)"
        />
      ))}

      <circle cx={INICIO.x} cy={INICIO.y} r="16" className="red-evento" />
      <text x={INICIO.x} y={INICIO.y + 36} className="red-evento-texto">
        Inicio
      </text>
      <circle cx={FIN.x} cy={FIN.y} r="16" className="red-evento" />
      <text x={FIN.x} y={FIN.y + 36} className="red-evento-texto">
        Fin
      </text>

      {Object.entries(NODOS).map(([codigo, n]) => (
        <g
          key={codigo}
          className={`red-nodo rama-${n.rama} ${esCritica(n.rama, ruta) ? "es-critica" : ""}`}
        >
          <rect x={n.x} y={n.y} width={W} height={H} rx="8" />
          <text x={n.x + 16} y={n.y + 38} className="red-codigo">
            {codigo}
          </text>
          <text x={n.x + 44} y={n.y + 36} className="red-nombre">
            {n.nombre}
          </text>
          {duraciones?.[codigo] !== undefined && (
            <text x={n.x + W / 2} y={n.y + H + 22} className="red-duracion">
              {duraciones[codigo]}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
