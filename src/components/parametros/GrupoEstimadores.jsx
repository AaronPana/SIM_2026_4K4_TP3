// Grupo 4: límites de probabilidad, percentil y distribución de frecuencias.
import CampoNumero from "./campos/CampoNumero.jsx";

export default function GrupoEstimadores({ form }) {
  const usaN = form.raw.estimadores.histogramaUsaN;
  return (
    <fieldset className="grupo">
      <legend>Estimadores</legend>
      <div className="grilla-campos">
        <CampoNumero
          form={form}
          parametro="estimadores.limiteMenorIgual"
          etiqueta="P(T ≤ x), x ="
          unidad="min"
        />
        <CampoNumero
          form={form}
          parametro="estimadores.limiteMayorIgual"
          etiqueta="P(T ≥ y), y ="
          unidad="min"
        />
        <CampoNumero
          form={form}
          parametro="estimadores.muestraPercentil"
          etiqueta="Muestra percentil"
          paso={1}
          ayuda="Primeras iteraciones"
        />
        <CampoNumero
          form={form}
          parametro="estimadores.nivelPercentil"
          etiqueta="Nivel de confianza"
          paso={0.01}
        />
        <CampoNumero
          form={form}
          parametro="estimadores.cantidadIntervalos"
          etiqueta="Intervalos"
          paso={1}
        />
        <CampoNumero
          form={form}
          parametro="estimadores.rangoIntervalos"
          etiqueta="Inicio del último"
          unidad="min"
          ayuda="Minutos después del primero"
        />
      </div>
      <div className="grupo-acciones">
        <label className="casilla">
          <input
            type="checkbox"
            checked={usaN}
            onChange={(e) =>
              form.setCampo("estimadores.histogramaUsaN", e.target.checked)
            }
          />
          El histograma usa las N iteraciones
        </label>
        {!usaN && (
          <CampoNumero
            form={form}
            parametro="estimadores.observacionesHistograma"
            etiqueta="Observaciones"
            paso={1}
          />
        )}
      </div>
    </fieldset>
  );
}
