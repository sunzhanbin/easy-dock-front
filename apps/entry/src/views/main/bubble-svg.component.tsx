import { useEffect, useRef, useMemo  } from "react";
import ReactDom from 'react-dom';
import { init } from "@views/main/buble-svg";
import  * as d3 from "d3";
import { bubbleList } from "@utils/const";
import useMemoCallback from "@common/hooks/use-memo-callback";


const BubbleSvgComponent = () => {
    const ref = useRef<SVGSVGElement>(null);
    const initRenderPath = useMemoCallback(() => {
        const svgRef = ref.current!;
        const line = d3.line().curve(d3.curveBasisClosed)
        if (svgRef) {
            init(svgRef, line);
        }
    });
    const initRenderLinear = useMemo((): any => {
        return <>
            {
                bubbleList.map((bubble, i) => <defs key={i}>
                    <linearGradient id={bubble.id} x1="0%" y1="0%" x2="100%" y2="0%">
                        {
                            bubble.colorList.map((item: any, index) =>
                                <stop
                                    key={index}
                                    offset={item.offset}
                                    style={{stopColor: item.stopColor, stopOpacity: item.stopColor}}
                                />)
                        }
                    </linearGradient>
                </defs>)
            }
        </>
    }, [bubbleList]);

    useEffect(() => {
        const svgRef = ref.current!;
        (() => {
            ReactDom.render(initRenderLinear, svgRef, () => {
                initRenderPath();
            });
        })();
        window.addEventListener("resize", () => {
            ReactDom.unmountComponentAtNode(svgRef);
            ReactDom.render(initRenderLinear, svgRef, () => {
                initRenderPath();
            });
        });
        return () => {
            ReactDom.unmountComponentAtNode(svgRef);
            window.removeEventListener('resize', () => {
                ReactDom.unmountComponentAtNode(svgRef);
            })
        }
    }, [ref, initRenderLinear]);
    return <svg className="bubble-svg" ref={ref}></svg>;
}
export default BubbleSvgComponent;
