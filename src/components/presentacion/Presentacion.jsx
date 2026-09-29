// Presentación: arma el deck con las 8 slides en orden.
import Deck from "./Deck.jsx";
import SlidePortada from "./slides/SlidePortada.jsx";
import SlideCasoRed from "./slides/SlideCasoRed.jsx";
import SlideAnalisisDeterministico from "./slides/SlideAnalisisDeterministico.jsx";
import SlideVariables from "./slides/SlideVariables.jsx";
import SlideGeneracion from "./slides/SlideGeneracion.jsx";
import SlideEstimadores from "./slides/SlideEstimadores.jsx";
import SlideDecisiones from "./slides/SlideDecisiones.jsx";
import SlideVectorMotor from "./slides/SlideVectorMotor.jsx";

export default function Presentacion({ onComenzar }) {
  return (
    <Deck>
      <SlidePortada onComenzar={onComenzar} />
      <SlideCasoRed />
      <SlideAnalisisDeterministico />
      <SlideVariables />
      <SlideGeneracion />
      <SlideEstimadores />
      <SlideDecisiones />
      <SlideVectorMotor onComenzar={onComenzar} />
    </Deck>
  );
}
