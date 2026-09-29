// Datos fijos del trabajo. Se editan acá y se reflejan en toda la app.

// Legajo del alumno: es el módulo m de los generadores. Placeholder, reemplazar por el real.
export const LEGAJO = 95000;

// Datos de la portada. Si grupo o integrantes quedan vacíos, no se muestran.
export const PORTADA = {
  titulo: "Análisis de un proyecto logístico sin memoria",
  subtitulo: "Trabajo Práctico 3 — Simulación Montecarlo",
  materia: "Simulación",
  curso: "4K4",
  anio: 2026,
  facultad: "UTN — Facultad Regional Córdoba",
  grupo: "",
  integrantes: [],
};

// Opciones de precisión. "completa" no trunca; el resto trunca a esa cantidad de decimales.
export const PRECISIONES = [
  { valor: "completa", etiqueta: "Completa" },
  { valor: 4, etiqueta: "4 decimales" },
  { valor: 3, etiqueta: "3 decimales" },
  { valor: 2, etiqueta: "2 decimales" },
];

// Topes de ejecución para no saturar el navegador.
export const MAX_ITERACIONES = 1_000_000;
export const MAX_FILAS_CAPTURADAS = 100_000;

// Decimales con los que se muestran en pantalla los valores de precisión completa.
export const DECIMALES_PANTALLA_COMPLETA = 6;
