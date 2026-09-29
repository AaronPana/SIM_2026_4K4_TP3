// Editor de una distribución discreta: filas de valor y probabilidad, con la acumulada al lado.
import { leerParametro } from "../../../utils/parametros.js";
import { crearTruncador } from "../../../utils/truncar.js";

export default function TablaDiscreta({ form, clave, conEtiqueta = false }) {
  const base = `actividades.${clave}`;
  const filas = leerParametro(form.raw, `${base}.filas`);
  const errorSuma = form.errores[`${base}.suma`];

  // Acumulada solo informativa; si hay un valor inválido se muestra guion.
  let acumulada = 0;
  const acumuladas = filas.map((f) => {
    const p = Number(f.prob);
    if (f.prob === "" || Number.isNaN(p)) return null;
    acumulada = crearTruncador(10)(acumulada + p);
    return acumulada;
  });

  // Celda editable con su propio error.
  const celda = (i, campo, tipo = "number") => {
    const parametro = `${base}.filas.${i}.${campo}`;
    const error = form.errores[parametro];
    return (
      <td className={error ? "con-error" : ""}>
        <input
          type={tipo}
          step="any"
          value={filas[i][campo]}
          aria-label={`${campo} fila ${i + 1}`}
          aria-invalid={Boolean(error)}
          title={error}
          onChange={(e) => form.setCampo(parametro,e.target.value)}
        />
      </td>
    );
  };

  return (
    <div className="tabla-discreta">
      <table>
        <thead>
          <tr>
            {conEtiqueta && <th>Estado</th>}
            <th>Valor [min]</th>
            <th>Probabilidad</th>
            <th>Acumulada</th>
            <th aria-label="Quitar" />
          </tr>
        </thead>
        <tbody>
          {filas.map((_, i) => (
            <tr key={i}>
              {conEtiqueta && celda(i, "etiqueta", "text")}
              {celda(i, "valor")}
              {celda(i, "prob")}
              <td className="celda-acumulada">{acumuladas[i] ?? "—"}</td>
              <td>
                <button
                  type="button"
                  className="boton-icono"
                  onClick={() => form.quitarFila(clave, i)}
                  disabled={filas.length === 1}
                  aria-label={`Quitar fila ${i + 1}`}
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        className="boton boton-texto"
        onClick={() => form.agregarFila(clave)}
      >
        Agregar fila
      </button>
      {errorSuma && <p className="campo-error">{errorSuma}</p>}
    </div>
  );
}
