import { PathStyleProps } from 'zrender';
import { Chart, ChartOption, DataType } from '../core/Chart';
import { Layout } from '../core/Layout';
import { AxisLabels } from '../element/AxisLabels';
import { AxisLine } from '../element/AxisLine';
import { LineSeries } from '../element/LineSeries';
import { LinearScaler } from '../scaler/LinearScaler';
import { getRange, getSplitValue } from '../util/math';

interface LineChartOption extends ChartOption {
  seriesStyle?: (i: number) => PathStyleProps;
}

export class LineChart extends Chart {
  option: LineChartOption;
  data: DataType[] = [];
  xLabels: AxisLabels | undefined;
  yLabels: AxisLabels | undefined;
  series: LineSeries[] = [];
  constructor(dom: HTMLElement, option: LineChartOption = {}) {
    super(dom, option);
    this.option = option;
    option.layout = new Layout([100, 'auto', 50], [10, 'auto', 50]);
    this.add(
      new AxisLine('X', {
        location: 'top',
      }),
      [1, 2]
    );
    this.add(
      new AxisLine('Y', {
        location: 'right',
      }),
      [0, 1]
    );
  }
  setData(data: DataType[]) {
    this.data = data;
    if (data.length > 0) {
      const series: number[][] = [];
      const first = data[0];
      for (let i = 1; i < first.length; i++) {
        series.push(
          data.map(e => {
            return e[i] as number;
          })
        );
      }
      const xData = data.map(e => e[0]);
      const [min, max] = getRange(series.flat());
      const splits = getSplitValue(min, max, 5);
      const xScaler = new LinearScaler(0, data.length - 1);
      const yScaler = new LinearScaler(splits[0], splits[splits.length - 1]);
      const center = Math.floor(data.length / 2),
        last = data.length - 1;
      this.xLabels = new AxisLabels('xlabel', {
        location: 'top',
        scaler: xScaler,
        data: [
          [0, data[0][0]],
          [center, data[center][0]],
          [last, data[last][0]],
        ],
      });
      this.yLabels = new AxisLabels('ylabel', {
        scaler: yScaler,
        data: splits.map(val => {
          return [val, (val / 10).toFixed(2) + '%'];
        }),
        location: 'right',
      });
      this.series = series.map((e, i) => {
        const lineSeries = new LineSeries(i.toString(), {
          xScaler,
          yScaler,
          data: e,
          style: this.seriesStyle(i),
        });
        this.add(lineSeries, [1, 1]);

        return lineSeries;
      });
      this.add(this.xLabels, [1, 2]);
      this.add(this.yLabels, [0, 1]);
    }
  }
  get seriesStyle() {
    return (
      this.option.seriesStyle ||
      ((i: number) => {
        const colors: string[] = [
          '#5b91fc',
          '#33c3f3',
          '#35dcc5',
          '#ffc53e',
          '#f67cbd',
          '#a873e6',
          '#ff834a',
        ];
        return {
          stroke: colors[i],
          lineWidth: 2,
        };
      })
    );
  }
}
