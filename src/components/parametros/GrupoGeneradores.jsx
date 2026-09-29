// Grupo 2: un generador congruencial mixto por variable aleatoria (B, D, E, F).
import CampoNumero from "./campos/CampoNumero.jsx";

const VARIABLES = [
  ["B", "Picking"],
  ["D", "Packing"],
  ["E", "Control de calidad"],
  ["F", "Despacho"],
];

export default function GrupoGeneradores({ form }) {
  return (
    <fieldset className="grupo">
      <legend>Generadores congruenciales mixtos</legend>
      <p className="nota">X(n+1) = (a · X(n) + c) mod m · RND = X / m</p>
      <div className="grilla-generadores">
        {VARIABLES.map(([k, nombre]) => (
          <div key={k} className="generador">
            <div className="generador-cabecera">
              <h4>
                <span className="codigo">{k}</span> {nombre}
              </h4>
              <button
                type="button"
                className="boton boton-texto"
                onClick={() => form.replicarGenerador(k)}
              >
                Copiar a todos
              </button>
            </div>
            <div className="grilla-campos grilla-campos-4">
              <CampoNumero
                form={form}
                parametro={`generadores.${k}.x0`}
                etiqueta="X0"
                paso={1}
              />
              <CampoNumero
                form={form}
                parametro={`generadores.${k}.a`}
                etiqueta="a"
                paso={1}
              />
              <CampoNumero
                form={form}
                parametro={`generadores.${k}.c`}
                etiqueta="c"
                paso={1}
              />
              <CampoNumero
                form={form}
                parametro={`generadores.${k}.m`}
                etiqueta="m"
                paso={1}
              />
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
