// Distribución discreta empírica mediante tabla de probabilidad acumulada.

// Agrega a cada fila su intervalo de RND [desde; hasta). El redondeo evita basura de coma flotante.
export function construirTablaAcumulada(filas) {
  let acumulada = 0;
  return filas.map((fila) => {
    const desde = acumulada;
    acumulada = Number((acumulada + fila.prob).toFixed(10));
    return { ...fila, acumulada, desde, hasta: acumulada };
  });
}

// Devuelve la fila cuyo intervalo contiene al RND (intervalos cerrados a izquierda).
export function buscarEnTabla(tabla, rnd) {
  return tabla.find((fila) => rnd < fila.hasta) ?? tabla[tabla.length - 1];
}
