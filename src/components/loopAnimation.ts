/**
 * Animates the fuzzing-loop SVG: each arc draws in sequence, then the whole
 * loop repeats with a pulsing center node to convey iteration.
 */
export function initLoopAnimation(svg: SVGSVGElement) {
  const arcs = Array.from(svg.querySelectorAll<SVGPathElement>('path.arc'));
  const nodes = Array.from(svg.querySelectorAll<SVGGElement>('g.node'));

  // Prep each arc: compute its length, hide it via dashoffset.
  arcs.forEach((arc) => {
    const len = arc.getTotalLength();
    arc.style.strokeDasharray = `${len}`;
    arc.style.strokeDashoffset = `${len}`;
    arc.style.transition = 'stroke-dashoffset 600ms ease-out';
  });

  nodes.forEach((node, i) => {
    node.style.opacity = '0';
    node.style.transition = `opacity 400ms ease-out ${i * 150}ms`;
  });

  // Small defer so the browser commits the initial state before transitioning.
  requestAnimationFrame(() => {
    setTimeout(() => {
      nodes.forEach((n) => (n.style.opacity = '1'));
    }, 50);

    const drawArcs = () => {
      arcs.forEach((arc, i) => {
        setTimeout(() => {
          arc.style.strokeDashoffset = '0';
        }, 600 + i * 500);
      });
    };

    drawArcs();

    // Loop: reset and redraw every ~4s for the duration of the slide view.
    const intervalId = window.setInterval(() => {
      arcs.forEach((arc) => {
        const len = arc.getTotalLength();
        arc.style.transition = 'none';
        arc.style.strokeDashoffset = `${len}`;
        // Force reflow so the next transition takes effect.
        void arc.getBoundingClientRect();
        arc.style.transition = 'stroke-dashoffset 600ms ease-out';
      });
      drawArcs();
    }, 4000);

    // Stash the interval id so we can clear it if the slide unloads.
    (svg as any).__loopInterval = intervalId;
  });
}
