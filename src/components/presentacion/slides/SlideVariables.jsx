// Slide 4: variables aleatorias, fórmulas de generación y tablas acumuladas de B y F.
import Reveal from "../Reveal.jsx";
import { construirTablaAcumulada } from "../../../domain/distribuciones/discreta.js";
import { PARAMETROS_POR_DEFECTO as P } from "../../../config/parametrosPorDefecto.js";
import { crearTruncador } from "../../../utils/truncar.js";

const act = P.actividades;

// Trunca a 2 decimales y completa con ceros (0.5 → "0.50"), sin redondear.
const dosDecimales = (v) => {
  const [ent, dec = ""] = String(crearTruncador(2)(v)).split(".");
  return `${ent}.${dec.padEnd(2, "0")}`;
};
const tablaB = construirTablaAcumulada(act.B.filas);
const tablaF = construirTablaAcumulada(act.F.filas);

const VARIABLES = [
  ["A", "Constante", `${act.A.valor} min`, "No usa RND"],
  ["B", "Discreta", "20 · 30 · 40 min", "Tabla de probabilidad acumulada"],
  ["C", "Constante", `${act.C.valor} min`, "No usa RND"],
  [
    "D",
    "Uniforme",
    `U[${act.D.a}; ${act.D.b}]`,
    `D = ${act.D.a} + RND · (${act.D.b} − ${act.D.a})`,
  ],
  [
    "E",
    "Exponencial negativa",
    `media ${act.E.media} min`,
    `E = −${act.E.media} · ln(1 − RND)`,
  ],
  ["F", "Discreta", "15 · 25 min", "Tabla de probabilidad acumulada"],
];

// Tabla acumulada con el intervalo de RND que le corresponde a cada valor.
function TablaAcumulada({ titulo, tabla, conEtiqueta }) {
  return (
    <table className="tabla-slide tabla-slide-compacta">
      <caption>{titulo}</caption>
      <thead>
        <tr>
          {conEtiqueta && <th>Estado</th>}
          <th>Valor</th>
          <th>P</th>
          <th>P acum.</th>
          <th>RND</th>
        </tr>
      </thead>
      <tbody>
        {tabla.map((f, i) => (
          <tr key={i}>
            {conEtiqueta && <td>{f.etiqueta}</td>}
            <td>{f.valor}</td>
            <td>{f.prob}</td>
            <td>{f.acumulada}</td>
            <td>
              [{dosDecimales(f.desde)}; {dosDecimales(f.hasta)})
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function SlideVariables() {
  return (
    <section className="slide">
      <Reveal className="slide-cuerpo">
        <h2 className="slide-titulo">Variables aleatorias</h2>
        <p className="slide-bajada">
          Las distribuciones continuas se generan por transformada inversa; las
          discretas, ubicando el RND en su intervalo de probabilidad acumulada.
        </p>
        <div className="columnas-slide">
          <table className="tabla-slide tabla-slide-compacta">
            <thead>
              <tr>
                <th>Act.</th>
                <th>Distribución</th>
                <th>Parámetros</th>
                <th>Generación</th>
              </tr>
            </thead>
            <tbody>
              {VARIABLES.map(([c, d, p, g]) => (
                <tr key={c}>
                  <td className="celda-codigo">{c}</td>
                  <td>{d}</td>
                  <td>{p}</td>
                  <td>{g}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <TablaAcumulada titulo="B · Picking" tabla={tablaB} />
            <TablaAcumulada titulo="F · Despacho" tabla={tablaF} conEtiqueta />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
