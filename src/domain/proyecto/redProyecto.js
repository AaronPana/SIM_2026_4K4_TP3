// Reglas del dominio: red A→B y C→D→E en paralelo, que convergen en F.

export const RUTAS = {
  PRODUCTO: "A-B",
  EMPAQUE: "C-D-E",
  AMBAS: "Ambas",
};

// Calcula los tiempos de la red para una iteración. F arranca cuando terminan las dos ramas.
export function calcularProyecto({ A, B, C, D, E, F }, truncar) {
  const finRama1 = truncar(A + B);
  const finRama2 = truncar(C + D + E);
  const inicioF = Math.max(finRama1, finRama2);
  const T = truncar(inicioF + F);

  // Ruta crítica = rama más lenta. Si empatan, ambas son críticas (decisión del grupo).
  let ruta = RUTAS.AMBAS;
  if (finRama1 > finRama2) ruta = RUTAS.PRODUCTO;
  if (finRama2 > finRama1) ruta = RUTAS.EMPAQUE;

  const holgura = truncar(Math.abs(finRama1 - finRama2));
  return { finRama1, finRama2, inicioF, T, ruta, holgura };
}

// Tiempo mínimo teórico: simulacro con el menor valor posible de cada actividad (E mínima = 0).
export function tiempoMinimoTeorico(actividades) {
  const minB = Math.min(...actividades.B.filas.map((f) => f.valor));
  const minF = Math.min(...actividades.F.filas.map((f) => f.valor));
  const rama1 = actividades.A.valor + minB;
  const rama2 = actividades.C.valor + actividades.D.a + 0;
  return Math.max(rama1, rama2) + minF;
}
