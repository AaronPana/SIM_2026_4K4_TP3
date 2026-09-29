// Formulario completo: cuatro grupos y la acción de simular (deshabilitada si hay errores).
import GrupoEjecucion from "./GrupoEjecucion.jsx";
import GrupoGeneradores from "./GrupoGeneradores.jsx";
import GrupoActividades from "./GrupoActividades.jsx";
import GrupoEstimadores from "./GrupoEstimadores.jsx";

export default function FormularioParametros({ form, onSimular, corriendo }) {
  const cantidadErrores = Object.keys(form.errores).length;
  const enviar = (e) => {
    e.preventDefault();
    if (form.esValido) onSimular(form.params);
  };
  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <GrupoEjecucion form={form} />
      <GrupoGeneradores form={form} />
      <GrupoActividades form={form} />
      <GrupoEstimadores form={form} />
      <div className="formulario-acciones">
        <button
          type="submit"
          className="boton boton-primario"
          disabled={!form.esValido || corriendo}
        >
          {corriendo ? "Simulando…" : "Simular"}
        </button>
        <button
          type="button"
          className="boton boton-secundario"
          onClick={form.restaurar}
        >
          Restaurar valores del enunciado
        </button>
        {cantidadErrores > 0 && (
          <p className="campo-error" role="status">
            Corregí{" "}
            {cantidadErrores === 1 ? "1 campo" : `${cantidadErrores} campos`}{" "}
            para poder simular.
          </p>
        )}
      </div>
    </form>
  );
}
