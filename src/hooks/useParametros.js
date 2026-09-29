// Estado del formulario de parámetros + validación en vivo.
import { useMemo, useState, useCallback } from "react";
import { PARAMETROS_POR_DEFECTO } from "../config/parametrosPorDefecto.js";
import { validarParametros } from "../validation/validarParametros.js";

const copiar = (o) => structuredClone(o);

// Asigna un valor en un parámetro tipo "actividades.B.filas.0.prob" sin mutar el original.
function asignarParametro(obj, parametro, valor) {
  const claves = parametro.split(".");
  const nuevo = copiar(obj);
  let nodo = nuevo;
  claves.slice(0, -1).forEach((k) => (nodo = nodo[k]));
  nodo[claves.at(-1)] = valor;
  return nuevo;
}

export function useParametros() {
  const [raw, setRaw] = useState(() => copiar(PARAMETROS_POR_DEFECTO));
  const validacion = useMemo(() => validarParametros(raw), [raw]);

  const setCampo = useCallback(
    (parametro, valor) => setRaw((p) => asignarParametro(p, parametro, valor)),
    [],
  );

  // Agrega una fila vacía a una tabla discreta (B o F).
  const agregarFila = useCallback((clave) => {
    setRaw((p) => {
      const nuevo = copiar(p);
      const fila =
        clave === "F"
          ? { etiqueta: "", valor: "", prob: "" }
          : { valor: "", prob: "" };
      nuevo.actividades[clave].filas.push(fila);
      return nuevo;
    });
  }, []);

  const quitarFila = useCallback((clave, indice) => {
    setRaw((p) => {
      const nuevo = copiar(p);
      nuevo.actividades[clave].filas.splice(indice, 1);
      return nuevo;
    });
  }, []);

  // Copia los parámetros de un generador a los otros tres (útil con los valores de prueba).
  const replicarGenerador = useCallback((origen) => {
    setRaw((p) => {
      const nuevo = copiar(p);
      Object.keys(nuevo.generadores).forEach(
        (k) => (nuevo.generadores[k] = { ...p.generadores[origen] }),
      );
      return nuevo;
    });
  }, []);

  const restaurar = useCallback(
    () => setRaw(copiar(PARAMETROS_POR_DEFECTO)),
    [],
  );

  return {
    raw,
    ...validacion,
    setCampo,
    agregarFila,
    quitarFila,
    replicarGenerador,
    restaurar,
  };
}
