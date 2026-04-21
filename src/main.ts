import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';

import './styles/reveal-override.css';
import { initLoopAnimation } from './components/loopAnimation';

const deck = new Reveal({
  hash: true,
  slideNumber: 'c/t',
  transition: 'fade',
  transitionSpeed: 'default',
  backgroundTransition: 'fade',
  controls: true,
  controlsLayout: 'edges',
  progress: true,
  center: false,
  width: 1600,
  height: 900,
  margin: 0.04,
  minScale: 0.2,
  maxScale: 2.0,
  viewDistance: 3,
  keyboard: true,
  overview: true,
});

deck.initialize().then(() => {
  // Initialize the fuzzing loop animation when that slide is reached.
  deck.on('slidechanged', (event: any) => {
    const slide = event.currentSlide as HTMLElement;
    const key = slide?.dataset?.slide;
    if (key === 'intro-loop') {
      const svg = slide.querySelector<SVGSVGElement>('svg.fuzz-loop');
      if (svg) initLoopAnimation(svg);
    }
  });

  // Also run on initial load if we start on the loop slide (deep-link / reload).
  const initial = document.querySelector<HTMLElement>('.reveal .slides section.present');
  if (initial?.dataset.slide === 'intro-loop') {
    const svg = initial.querySelector<SVGSVGElement>('svg.fuzz-loop');
    if (svg) initLoopAnimation(svg);
  }
});
