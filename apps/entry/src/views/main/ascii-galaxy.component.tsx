import { useEffect, useRef } from "react";
import "@views/main/index.style.scss";
import { setDim, createChars, initCamera, loop } from "@views/main/ascii-galaxy";

const ASCIIGalaxy = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    (() => {
      if (ref) {
        const canvas = ref.current!;
        setDim(canvas);
        initCamera();
        createChars();
        loop();
      }
    })();
  }, [ref]);

  return <canvas ref={ref} className="canvas" />;
};
export default ASCIIGalaxy;
