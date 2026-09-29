// Distribución de frecuencias: los primeros (k−1) intervalos de igual ancho y el último abierto.

// El primer intervalo arranca en T mínimo; el último empieza "rango" minutos después.
export function construirIntervalos(tMinimo, cantidad, rango) {
  const ancho = rango / (cantidad - 1);
  const intervalos = [];
  for (let i = 0; i < cantidad - 1; i++) {
    intervalos.push({
      desde: tMinimo + i * ancho,
      hasta: tMinimo + (i + 1) * ancho,
    });
  }
  intervalos.push({ desde: tMinimo + rango, hasta: Infinity });
  return intervalos;
}

// Índice del intervalo [desde; hasta) que contiene a t.
export function indiceIntervalo(intervalos, t) {
  const i = intervalos.findIndex((iv) => t < iv.hasta);
  return i === -1 ? intervalos.length - 1 : i;
}
