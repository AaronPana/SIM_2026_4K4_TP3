// Valida el formulario y convierte los valores a número. Devuelve { errores, params, esValido }.
import { MAX_ITERACIONES, MAX_FILAS_CAPTURADAS } from "../config/constantes.js";
import { crearTruncador } from "../utils/truncar.js";

const TOLERANCIA_SUMA = 1e-9;

// Convierte lo escrito en el input a número; vacío o inválido → NaN.
const aNumero = (v) =>
  v === "" || v === null || v === undefined ? NaN : Number(v);

// Crea el acumulador de errores y los validadores reutilizables.
function crearValidador() {
  const errores = {};
  const error = (parametro, msg) => {
    if (!errores[parametro]) errores[parametro] = msg;
  };

  // Valida un número con reglas simples; devuelve el número (o NaN si falla).
  const numero = (
    parametro,
    valor,
    { entero = false, min, max, minExclusivo, maxExclusivo } = {},
  ) => {
    const n = aNumero(valor);
    if (Number.isNaN(n)) return (error(parametro, "Requerido"), NaN);
    if (entero && !Number.isInteger(n))
      return (error(parametro, "Debe ser entero"), n);
    if (min !== undefined && n < min)
      return (error(parametro, `Mínimo ${min}`), n);
    if (max !== undefined && n > max)
      return (error(parametro, `Máximo ${max.toLocaleString("es-AR")}`), n);
    if (minExclusivo !== undefined && n <= minExclusivo)
      return (error(parametro, `Debe ser mayor a ${minExclusivo}`), n);
    if (maxExclusivo !== undefined && n >= maxExclusivo)
      return (error(parametro, `Debe ser menor a ${maxExclusivo}`), n);
    return n;
  };

  return { errores, error, numero };
}

// Ejecución: N, rango a mostrar y precisión.
function validarEjecucion(raw, v) {
  const n = v.numero("ejecucion.n", raw.n, {
    entero: true,
    min: 1,
    max: MAX_ITERACIONES,
  });
  const desde = v.numero("ejecucion.desde", raw.desde, {
    entero: true,
    min: 1,
  });
  const hasta = v.numero("ejecucion.hasta", raw.hasta, {
    entero: true,
    min: 1,
  });

  if (!Number.isNaN(n) && desde > n)
    v.error("ejecucion.desde", "No puede superar N");
  if (!Number.isNaN(n) && hasta > n)
    v.error("ejecucion.hasta", "No puede superar N");
  if (hasta < desde)
    v.error("ejecucion.hasta", "Debe ser mayor o igual a 'desde'");
  if (hasta - desde + 1 > MAX_FILAS_CAPTURADAS)
    v.error(
      "ejecucion.hasta",
      `Máximo ${MAX_FILAS_CAPTURADAS.toLocaleString("es-AR")} filas a mostrar`,
    );

  const precision =
    raw.precision === "completa" ? "completa" : Number(raw.precision);
  return { n, desde, hasta, precision };
}

// Generador congruencial: enteros, X0 < m y producto a·X dentro del rango exacto de JavaScript.
function validarGenerador(clave, raw, v) {
  const base = `generadores.${clave}`;
  const m = v.numero(`${base}.m`, raw.m, { entero: true, min: 2 });
  const a = v.numero(`${base}.a`, raw.a, { entero: true, min: 1 });
  const c = v.numero(`${base}.c`, raw.c, { entero: true, min: 0 });
  const x0 = v.numero(`${base}.x0`, raw.x0, { entero: true, min: 0 });

  if (x0 >= m) v.error(`${base}.x0`, "Debe ser menor que m");
  if (a * (m - 1) + c > Number.MAX_SAFE_INTEGER)
    v.error(`${base}.a`, "a·(m−1)+c excede la precisión entera de JavaScript");
  return { x0, a, c, m };
}

// Tabla discreta: al menos una fila, valores ≥ 0, probabilidades en [0; 1] que sumen 1.
function validarTablaDiscreta(clave, raw, v, conEtiqueta) {
  const base = `actividades.${clave}`;
  if (!raw.filas.length) v.error(`${base}.suma`, "Agregá al menos una fila");

  const filas = raw.filas.map((f, i) => {
    const fila = {
      valor: v.numero(`${base}.filas.${i}.valor`, f.valor, { min: 0 }),
      prob: v.numero(`${base}.filas.${i}.prob`, f.prob, { min: 0, max: 1 }),
    };
    if (conEtiqueta) {
      fila.etiqueta = String(f.etiqueta ?? "").trim();
      if (!fila.etiqueta) v.error(`${base}.filas.${i}.etiqueta`, "Requerido");
    }
    return fila;
  });

  const suma = filas.reduce(
    (s, f) => s + (Number.isNaN(f.prob) ? 0 : f.prob),
    0,
  );
  if (Math.abs(suma - 1) > TOLERANCIA_SUMA)
    v.error(
      `${base}.suma`,
      `Las probabilidades suman ${crearTruncador(6)(suma)}, deben sumar 1`,
    );
  return { filas };
}

// Actividades A…F según su distribución.
function validarActividades(raw, v) {
  const a = v.numero("actividades.D.a", raw.D.a, { min: 0 });
  const b = v.numero("actividades.D.b", raw.D.b, { min: 0 });
  if (b <= a) v.error("actividades.D.b", "Debe ser mayor que a");

  return {
    A: { valor: v.numero("actividades.A.valor", raw.A.valor, { min: 0 }) },
    B: validarTablaDiscreta("B", raw.B, v, false),
    C: { valor: v.numero("actividades.C.valor", raw.C.valor, { min: 0 }) },
    D: { a, b },
    E: {
      media: v.numero("actividades.E.media", raw.E.media, { minExclusivo: 0 }),
    },
    F: validarTablaDiscreta("F", raw.F, v, true),
  };
}

// Estimadores: límites, percentil e histograma (las muestras no pueden superar N).
function validarEstimadores(raw, v, n) {
  const e = "estimadores";
  const est = {
    limiteMenorIgual: v.numero(`${e}.limiteMenorIgual`, raw.limiteMenorIgual, {
      min: 0,
    }),
    limiteMayorIgual: v.numero(`${e}.limiteMayorIgual`, raw.limiteMayorIgual, {
      min: 0,
    }),
    muestraPercentil: v.numero(`${e}.muestraPercentil`, raw.muestraPercentil, {
      entero: true,
      min: 1,
    }),
    nivelPercentil: v.numero(`${e}.nivelPercentil`, raw.nivelPercentil, {
      minExclusivo: 0,
      maxExclusivo: 1,
    }),
    cantidadIntervalos: v.numero(
      `${e}.cantidadIntervalos`,
      raw.cantidadIntervalos,
      { entero: true, min: 2 },
    ),
    rangoIntervalos: v.numero(`${e}.rangoIntervalos`, raw.rangoIntervalos, {
      minExclusivo: 0,
    }),
    histogramaUsaN: Boolean(raw.histogramaUsaN),
    observacionesHistograma: n,
  };

  if (est.muestraPercentil > n)
    v.error(`${e}.muestraPercentil`, "No puede superar N");
  if (!est.histogramaUsaN) {
    est.observacionesHistograma = v.numero(
      `${e}.observacionesHistograma`,
      raw.observacionesHistograma,
      {
        entero: true,
        min: 1,
      },
    );
    if (est.observacionesHistograma > n)
      v.error(`${e}.observacionesHistograma`, "No puede superar N");
  }
  return est;
}

export function validarParametros(raw) {
  const v = crearValidador();
  const ejecucion = validarEjecucion(raw.ejecucion, v);
  const generadores = Object.fromEntries(
    Object.entries(raw.generadores).map(([k, g]) => [
      k,
      validarGenerador(k, g, v),
    ]),
  );
  const actividades = validarActividades(raw.actividades, v);
  const estimadores = validarEstimadores(raw.estimadores, v, ejecucion.n);

  const esValido = Object.keys(v.errores).length === 0;
  return {
    errores: v.errores,
    esValido,
    params: esValido
      ? { ejecucion, generadores, actividades, estimadores }
      : null,
  };
}
