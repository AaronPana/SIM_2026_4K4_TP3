// Generador congruencial mixto: X(n+1) = (a·X(n) + c) mod m, RND = X / m ∈ [0; 1).

// Crea un generador con estado propio. El primer RND sale de X1 (la semilla X0 no se usa como RND).
export function crearGCM({ x0, a, c, m }) {
  let x = x0;
  return {
    siguiente() {
      x = (a * x + c) % m;
      return { x, rnd: x / m };
    },
  };
}
