// Estimadores finales (última iteración): duración del proyecto y detalle por actividad.
import { formatearValor, formatearPorcentaje } from "../../utils/formato.js";

export default function PanelEstimadores({ resumen, precision }) {
  // Proporciones como porcentaje; el resto con la precisión elegida.
  const mostrar = (d) =>
    d.tipo === "proporcion"
      ? formatearPorcentaje(d.valor)
      : `${formatearValor(d.valor, d.tipo, precision)}${d.valor !== null && d.unidad ? ` ${d.unidad}` : ""}`;

  return (
    <div className="panel-estimadores">
      <dl className="estimadores-duracion">
        {resumen.duracion.map((d) => (
          <div key={d.etiqueta} className="estimador">
            <dt>{d.etiqueta}</dt>
            <dd>{mostrar(d)}</dd>
          </div>
        ))}
      </dl>
      <table className="tabla-resumen">
        <caption>Por actividad</caption>
        <thead>
          <tr>
            <th>Actividad</th>
            <th>Duración promedio</th>
            <th>Veces crítica</th>
          </tr>
        </thead>
        <tbody>
          {resumen.actividades.map((a) => (
            <tr key={a.codigo}>
              <td className="celda-codigo">{a.codigo}</td>
              <td>{formatearValor(a.promedio, "decimal", precision)} min</td>
              <td>
                <span
                  className="barra-critica"
                  style={{ "--proporcion": a.critica }}
                />
                {formatearPorcentaje(a.critica)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
