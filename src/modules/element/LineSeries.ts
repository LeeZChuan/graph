import { PathStyleProps, Polyline } from 'zrender';
import { Element } from '../core/Element';

import { Scaler } from '../core/Scaler';
import { LinearScaler } from '../scaler/LinearScaler';
import { LINESTYLE } from '../static/style';

interface LineSeriesOption {
  xScaler?: Scaler;
  yScaler?: Scaler;
  style?: PathStyleProps;
  data?: number[];
}
export class LineSeries extends Element {
  constructor(name: string, option: LineSeriesOption = {}) {
    super(name);
    this.option = option;
    this.shape = new Polyline({
      silent: true,
      style: this.style,
    });
  }
  shape: Polyline;
  option: LineSeriesOption;
  get style() {
    return this.option.style || LINESTYLE;
  }
  update() {
    if (this.chart && this.position) {
      const { x, y, width, height } = this.chart.getRect(this.position);
      const { xScaler, yScaler } = this;
      this.shape.attr({
        x,
        y,
        shape: {
          points: this.data.map((val, i) => {
            return [xScaler.normalize(i) * width, (1 - yScaler.normalize(val)) * height];
          }),
        },
      });
    }
  }
  get data() {
    return this.option.data || [0, 0];
  }
  get xScaler() {
    return this.option.xScaler || new LinearScaler(0, 1);
  }
  get yScaler() {
    return this.option.yScaler || new LinearScaler(0, 1);
  }
}
