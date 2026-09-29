// Grupo 1: cantidad de iteraciones, rango de filas a mostrar y precisión.
import CampoNumero from "./campos/CampoNumero.jsx";
import SelectorPrecision from "./campos/SelectorPrecision.jsx";

export default function GrupoEjecucion({ form }) {
  // "Mostrar todas" fija el rango en 1..N.
  const mostrarTodas = () => {
    form.setCampo("ejecucion.desde", 1);
    form.setCampo("ejecucion.hasta", form.raw.ejecucion.n);
  };
  return (
    <fieldset className="grupo">
      <legend>Ejecución</legend>
      <div className="grilla-campos">
        <CampoNumero
          form={form}
          parametro="ejecucion.n"
          etiqueta="Iteraciones (N)"
          paso={1}
        />
        <CampoNumero
          form={form}
          parametro="ejecucion.desde"
          etiqueta="Mostrar desde"
          paso={1}
        />
        <CampoNumero
          form={form}
          parametro="ejecucion.hasta"
          etiqueta="Mostrar hasta"
          paso={1}
        />
        <SelectorPrecision form={form} />
      </div>
      <div className="grupo-acciones">
        <button
          type="button"
          className="boton boton-texto"
          onClick={mostrarTodas}
        >
          Mostrar todas las iteraciones
        </button>
        <span className="nota">La última iteración se muestra siempre.</span>
      </div>
    </fieldset>
  );
}
