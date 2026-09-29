// Pantalla del simulador: parámetros arriba, resultados abajo.
import { useMemo, useState } from "react";
import { resumenEstimadores } from "../../utils/resumenEstimadores.js";
import FormularioParametros from "../parametros/FormularioParametros.jsx";
import PanelEstimadores from "../resultados/PanelEstimadores.jsx";
import Histograma from "../resultados/Histograma.jsx";
import TablaVector from "../resultados/TablaVector.jsx";

// El estado vive en App para no perderlo al volver a la presentación.
export default function Simulador({ form, simulacion, onVolver }) {
  const { resultado, corriendo, error, ejecutar } = simulacion;
  const [exportando, setExportando] = useState(false);
  const resumen = useMemo(
    () => (resultado ? resumenEstimadores(resultado) : null),
    [resultado],
  );

  // Avisa si el formulario cambió después de la última corrida.
  const desactualizado =
    resultado &&
    JSON.stringify(form.params) !== JSON.stringify(resultado.parametros);

  const descargar = async () => {
    setExportando(true);
    try {
      // exceljs pesa mucho: se carga solo cuando se pide el Excel.
      const { exportarExcel } = await import("../../export/exportarExcel.js");
      await exportarExcel(resultado);
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="simulador">
      <header className="barra">
        <div>
          <h1 className="barra-titulo">Simulador del proyecto logístico</h1>
          <p className="barra-sub">Montecarlo · TP3 · 4K4</p>
        </div>
        <button className="boton boton-secundario" onClick={onVolver}>
          Volver a la presentación
        </button>
      </header>

      <main className="simulador-cuerpo">
        <section className="seccion">
          <h2 className="seccion-titulo">Parámetros</h2>
          <FormularioParametros
            form={form}
            onSimular={ejecutar}
            corriendo={corriendo}
          />
        </section>

        {error && <p className="aviso aviso-error">{error}</p>}

        {resultado && (
          <>
            {desactualizado && (
              <p className="aviso">
                Cambiaste parámetros: los resultados corresponden a la corrida
                anterior.
              </p>
            )}
            <section className="seccion">
              <div className="seccion-cabecera">
                <h2 className="seccion-titulo">
                  Resultados tras{" "}
                  {resultado.ultima.iteracion.toLocaleString("es-AR")}{" "}
                  iteraciones
                </h2>
                <button
                  className="boton boton-secundario"
                  onClick={descargar}
                  disabled={exportando}
                >
                  {exportando ? "Generando Excel…" : "Descargar Excel"}
                </button>
              </div>
              <PanelEstimadores
                resumen={resumen}
                precision={resultado.parametros.ejecucion.precision}
              />
            </section>

            <section className="seccion">
              <h2 className="seccion-titulo">
                Distribución de frecuencias de T
              </h2>
              <Histograma
                frecuencias={resumen.frecuencias}
                observaciones={resumen.observaciones}
              />
            </section>

            <section className="seccion">
              <h2 className="seccion-titulo">Vector de estado</h2>
              <p className="nota">
                Iteraciones{" "}
                {resultado.parametros.ejecucion.desde.toLocaleString("es-AR")} a{" "}
                {resultado.parametros.ejecucion.hasta.toLocaleString("es-AR")}
                {resultado.ultimaIncluida ? "" : " y la última"}. La última
                iteración está resaltada.
              </p>
              <TablaVector resultado={resultado} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
