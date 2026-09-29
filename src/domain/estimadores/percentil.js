// Percentil empírico con las primeras k iteraciones (por defecto 99, al 95 %).
// Es el único buffer que guardamos: k valores, no la tabla de simulación.

// Posición del percentil en la muestra ordenada: ⌈nivel·(k+1)⌉. Con k = 99 y 0,95 da 95.
export function posicionPercentil(tamano, nivel) {
  const pos = Math.ceil(Number((nivel * (tamano + 1)).toPrecision(15)));
  return Math.min(tamano, Math.max(1, pos));
}

export function crearMuestraPercentil(tamano, nivel) {
  const valores = [];
  let resultado = null;
  return {
    // Agrega T mientras la muestra no esté completa; al completarse calcula el percentil.
    agregar(t) {
      if (valores.length >= tamano) return;
      valores.push(t);
      if (valores.length === tamano) {
        const ordenados = [...valores].sort((x, y) => x - y);
        resultado = ordenados[posicionPercentil(tamano, nivel) - 1];
      }
    },
    resultado: () => resultado,
  };
}
