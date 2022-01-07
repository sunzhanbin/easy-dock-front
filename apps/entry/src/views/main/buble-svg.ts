import anime from "animejs";
let svg: SVGSVGElement;
let line: (arg0: any) => any;
const SVG_URL = "http://www.w3.org/2000/svg";

export function init(svgRef: SVGSVGElement, lineD3: any) {
    svg = svgRef;
    line = lineD3;
    for (var i = 0; i < 3; i++) {
        const b = blob(Math.round(3 + rnd(5)), rnd(window.innerWidth), rnd(window.innerHeight), window.innerWidth / 3 > 500? 500: window.innerWidth / 3, 0.2, 50, i);
        anime({
            targets: b.path,
            d: b.d2,
            duration: 5000 + rnd(3000),
            delay: rnd(2000),
            direction: 'alternate',
            easing: 'linear',
            loop: true
        });
    }
}

function blob(n: number, cx: number, cy: number, r: number, rnd1: number, rnd2: number, index: number) {
    const da = 2 * Math.PI / n;
    const points: any = blobPoints(n, cx, cy, r, rnd1, rnd2);
    const points2: any = blobPoints(n, cx, cy, r, rnd1, rnd2);
    const d: any = line(points);
    const d2 = line(points2);
    const fill = `url(#bubble${index + 1})`;
    let g = document.createElementNS(SVG_URL, 'g');
    let path = document.createElementNS(SVG_URL, 'path');
    let defsElement = document.createElementNS(SVG_URL, 'defs');
    let b: any = { points, path, d2, fill };
    path.setAttributeNS(null, 'd', d);
    g.appendChild(path)
    path.setAttributeNS(null, 'style', style(b));
    svg?.appendChild(g);
    return b;
}

function blobPoints(n: number, cx: number, cy: number, r: number, rnd1: number, rnd2: number) {
    const da = 2 * Math.PI / n;
    let points = [];
    for (var i = 0; i < n; i++) {
        let a = i * da + rnd(rnd1, true);
        let s = r + rnd(rnd2, true);
        let x = Math.cos(a) * s + window.innerWidth / 2;
        let y = Math.sin(a) * s + (window.innerHeight / 2 - 20);
        points.push([x, y]);
    }
    return points;
}

function style(b: any[]) {
    return `fill: ${b.fill};`;
}

function rnd(max: number, negative?: boolean | undefined) {
    let random = Math.random();
    if(max === 5){
        random = Math.random() * (0.9 - 0.4) + 0.4
    }
    return negative ? random * 2 * max - max : random * max;
}


