// Vector de estado con encabezado agrupado. Virtualizada: solo dibuja las filas visibles.
import { useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  construirColumnas,
  aplanarColumnas,
} from "../../config/columnasVector.js";
import { formatearValor } from "../../utils/formato.js";

const ALTO_FILA = 32;

export default function TablaVector({ resultado }) {
  const scrollRef = useRef(null);
  const { filas, ultima, ultimaIncluida, intervalos, parametros } = resultado;
  const precision = parametros.ejecucion.precision;

  const grupos = useMemo(
    () => construirColumnas({ intervalos, ...parametros.estimadores }),
    [intervalos, parametros],
  );
  const columnas = useMemo(() => aplanarColumnas(grupos), [grupos]);

  // Si la última iteración quedó fuera del rango, se agrega al final tras un separador.
  const items = useMemo(
    () => (ultimaIncluida ? filas : [...filas, { separador: true }, ultima]),
    [filas, ultima, ultimaIncluida],
  );

  const virtualizador = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ALTO_FILA,
    overscan: 12,
  });
  const virtuales = virtualizador.getVirtualItems();
  const arriba = virtuales.length ? virtuales[0].start : 0;
  const abajo = virtuales.length
    ? virtualizador.getTotalSize() - virtuales.at(-1).end
    : 0;

  return (
    <div className="tabla-vector" ref={scrollRef}>
      <table>
        <thead>
          <tr className="fila-grupos">
            {grupos.map((g, i) => (
              <th
                key={i}
                colSpan={g.columnas.length}
                className={i === 0 ? "col-fija" : ""}
              >
                {g.grupo}
              </th>
            ))}
          </tr>
          <tr className="fila-titulos">
            {columnas.map((c, i) => (
              <th key={c.clave} className={i === 0 ? "col-fija" : ""}>
                {c.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {arriba > 0 && <tr style={{ height: arriba }} aria-hidden="true" />}
          {virtuales.map((v) => {
            const fila = items[v.index];
            if (fila.separador) {
              return (
                <tr key={v.key} className="fila-separador">
                  <td colSpan={columnas.length}>
                    <span className="separador-texto">
                      … iteraciones sin mostrar …
                    </span>
                  </td>
                </tr>
              );
            }
            const esUltima = fila.iteracion === ultima.iteracion;
            return (
              <tr key={v.key} className={esUltima ? "fila-ultima" : ""}>
                {columnas.map((c, i) => (
                  <td
                    key={c.clave}
                    className={`${i === 0 ? "col-fija" : ""} ${c.tipo === "texto" ? "celda-texto" : ""}`}
                  >
                    {formatearValor(c.obtener(fila), c.tipo, precision)}
                  </td>
                ))}
              </tr>
            );
          })}
          {abajo > 0 && <tr style={{ height: abajo }} aria-hidden="true" />}
        </tbody>
      </table>
    </div>
  );
}
