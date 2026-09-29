// Uniforme U[a; b] por transformada inversa: X = a + RND·(b − a).
export function uniforme(rnd, a, b) {
  return a + rnd * (b - a);
}
