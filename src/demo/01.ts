import { LineChart } from '@/modules/chart/LineChart';
import { PlayerGroup } from '@/modules/player/PlayerGroup';
import { ClipPlayer } from '@/modules/player/ClipPlayer';

const dom = document.createElement('div');
dom.style.width = '400px';
dom.style.height = '300px';
document.body.append(dom);

const chart = new LineChart(dom);

const data: [string, number, number][] = [['20210101', 0, 0]];
for (let i = 0, k = 20210102; i < 100; i++, k++) {
  data.push([k.toString(), data[i][1] + Math.random() - 0.5, data[i][2] + Math.random() - 0.5]);
}
chart.setData(data);
chart.ready();

const end = 2000;

const player = new PlayerGroup([
  new ClipPlayer(chart.series[0].shape, { begin: 1000, end }),
  new ClipPlayer(chart.series[1].shape, { end }),
]);

player.now = end;
(window as any).player = player;
