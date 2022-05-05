import { Chart } from '@/modules/core/Chart';
import { Layout } from '@/modules/core/Layout';
import { ParallelLines } from '@/modules/element/ParallelLines';
import { AttrPlayer } from '@/modules/player/AttrPlayer';

const dom = document.createElement('div');
dom.style.width = '400px';
dom.style.height = '300px';
document.body.append(dom);

const chart = new Chart(dom, {
  layout: new Layout([10, 'auto', 10], [10, 'auto', 10]),
});

const splitLine = new ParallelLines('splitLine', {
  data: [0, 0.2, 0.4, 0.6, 0.8, 1],
});

chart.add(splitLine, [1, 1]);

chart.ready();

const player = new AttrPlayer(splitLine.shape.childAt(0), {
  attrs: {
    shape: {
      x2: 0,
    },
  },
});

(window as any).player = player;
