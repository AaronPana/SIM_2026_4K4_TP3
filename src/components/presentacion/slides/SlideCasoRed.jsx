// Slide 2: el caso y la red. El diagrama reemplaza la lista de actividades.
import Reveal from "../Reveal.jsx";
import RedProyecto from "../../diagramas/RedProyecto.jsx";

const ACTIVIDADES = [
  [
    "A",
    "Verificación de pago y stock",
    "El sistema aprueba el cobro y libera la orden.",
    "—",
  ],
  [
    "B",
    "Picking en almacén",
    "Un operario busca el producto en la estantería.",
    "A",
  ],
  [
    "C",
    "Impresión de etiqueta",
    "Se genera la guía de ruta y la factura.",
    "—",
  ],
  [
    "D",
    "Preparación de empaque",
    "Se arma la caja y se le adhieren las etiquetas.",
    "C",
  ],
  [
    "E",
    "Control de calidad",
    "Se escanea la caja para validar pesos y medidas.",
    "D",
  ],
  [
    "F",
    "Despacho y carga",
    "Se junta el producto con su caja y sale a ruta.",
    "B y E",
  ],
];

export default function SlideCasoRed() {
  return (
    <section className="slide">
      <Reveal className="slide-cuerpo">
        <h2 className="slide-titulo">El caso: despachar un pedido online</h2>
        <p className="slide-bajada">
          Dos líneas de trabajo arrancan juntas: una busca el producto y la otra
          prepara la caja. El despacho (F) solo empieza cuando las dos
          terminaron.
        </p>
        <div className="columnas-slide">
          <div>
            <RedProyecto />
            <p className="formula">T = máx(A + B ; C + D + E) + F</p>
          </div>
          <table className="tabla-slide tabla-slide-compacta">
            <thead>
              <tr>
                <th>Código</th>
                <th>Actividad</th>
                <th>Predecesora</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVIDADES.map(([c, n, d, p]) => (
                <tr key={c}>
                  <td className="celda-codigo">{c}</td>
                  <td>
                    {n}
                    <span className="celda-detalle">{d}</span>
                  </td>
                  <td>{p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}
