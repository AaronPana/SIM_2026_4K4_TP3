// Slide 7: decisiones del grupo sobre las ambigüedades del enunciado.
import Reveal from "../Reveal.jsx";

const DECISIONES = [
  [
    "Tiempo mínimo teórico",
    "El primer intervalo empieza en el tiempo mínimo. Usamos el mínimo posible (50 min, calculado antes de simular) y no el mínimo observado: como no se guarda la tabla, los intervalos tienen que estar fijos desde la primera iteración.",
  ],
  [
    "≤ 60 y ≥ 90 literales",
    "Respetamos los símbolos del enunciado. Importa porque T vale exactamente 60 muy seguido: P(T ≤ 60) y P(T < 60) pueden diferir a la mitad. Los intervalos son [a; b).",
  ],
  [
    "Un generador por variable",
    "B, D, E y F tienen su propio GCM con parámetros independientes.",
  ],
  [
    "Primer RND desde X1",
    "La semilla X0 inicia la secuencia pero no se usa como número aleatorio.",
  ],
  [
    "RND = X / m",
    "Se divide por m, no por m − 1: el RND queda en [0; 1) y ln(1 − RND) siempre existe.",
  ],
  [
    "Truncar, no redondear",
    "Un único parámetro de precisión: completa, 4, 3 o 2 decimales.",
  ],
  ["Empates", "Si A + B = C + D + E, las dos ramas se cuentan como críticas."],
  [
    "Percentil empírico",
    "Se ordenan las primeras 99 T y se toma la número 95. No usamos promedio + 1,645 · desvío porque esa fórmula supone una campana (normal) y T toma casi solo cuatro valores.",
  ],
  [
    "Corte por iteraciones",
    "El modelo no tiene reloj: la simulación termina al llegar a N.",
  ],
  [
    "Filas a mostrar",
    "El rango desde–hasta se define antes de simular y la última iteración se muestra siempre.",
  ],
  [
    "Observaciones del histograma",
    "Por defecto el histograma cuenta las N iteraciones. Si en la evaluación piden armarlo con otra cantidad (por ejemplo, las primeras 500), se carga en su propio parámetro.",
  ],
];

export default function SlideDecisiones() {
  return (
    <section className="slide">
      <Reveal className="slide-cuerpo">
        <h2 className="slide-titulo">Decisiones del grupo</h2>
        <p className="slide-bajada">
          Lo que el enunciado deja abierto y cómo lo resolvimos.
        </p>
        <dl className="grilla-decisiones grilla-decisiones-compacta">
          {DECISIONES.map(([t, d]) => (
            <div key={t} className="decision">
              <dt>{t}</dt>
              <dd>{d}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
