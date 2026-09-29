// Grupo 3: parámetros de cada actividad según su distribución.
import CampoNumero from "./campos/CampoNumero.jsx";
import TablaDiscreta from "./campos/TablaDiscreta.jsx";

// Encabezado común de cada actividad.
function Actividad({ codigo, nombre, distribucion, children, ancha = false }) {
  return (
    <div className={`actividad ${ancha ? "actividad-ancha" : ""}`}>
      <h4>
        <span className="codigo">{codigo}</span> {nombre}
        <span className="actividad-dist">{distribucion}</span>
      </h4>
      {children}
    </div>
  );
}

export default function GrupoActividades({ form }) {
  return (
    <fieldset className="grupo">
      <legend>Actividades</legend>
      <div className="grilla-actividades">
        <Actividad codigo="A" nombre="Pago y stock" distribucion="Constante">
          <CampoNumero
            form={form}
            parametro="actividades.A.valor"
            etiqueta="Duración"
            unidad="min"
          />
        </Actividad>
        <Actividad codigo="C" nombre="Etiqueta" distribucion="Constante">
          <CampoNumero
            form={form}
            parametro="actividades.C.valor"
            etiqueta="Duración"
            unidad="min"
          />
        </Actividad>
        <Actividad codigo="D" nombre="Packing" distribucion="Uniforme">
          <div className="grilla-campos">
            <CampoNumero
              form={form}
              parametro="actividades.D.a"
              etiqueta="a"
              unidad="min"
            />
            <CampoNumero
              form={form}
              parametro="actividades.D.b"
              etiqueta="b"
              unidad="min"
            />
          </div>
        </Actividad>
        <Actividad
          codigo="E"
          nombre="Control de calidad"
          distribucion="Exponencial"
        >
          <CampoNumero
            form={form}
            parametro="actividades.E.media"
            etiqueta="Media"
            unidad="min"
          />
        </Actividad>
        <Actividad codigo="B" nombre="Picking" distribucion="Discreta" ancha>
          <TablaDiscreta form={form} clave="B" />
        </Actividad>
        <Actividad codigo="F" nombre="Despacho" distribucion="Discreta" ancha>
          <TablaDiscreta form={form} clave="F" conEtiqueta />
        </Actividad>
      </div>
    </fieldset>
  );
}
