import { Group, Text, TextStyleProps } from 'zrender';
import { Rect } from '../core/Chart';
import { Element } from '../core/Element';
import { Scaler } from '../core/Scaler';
import { LinearScaler } from '../scaler/LinearScaler';
import { TEXTSTYLE } from '../static/style';
interface AxisLabelsOption {
  location?: 'top' | 'bottom' | 'left' | 'right';
  style?: TextStyleProps;
  data?: [number, string][];
  distance?: number;
  scaler?: Scaler;
}
export class AxisLabels extends Element {
  constructor(name: string, option: AxisLabelsOption = {}) {
    super(name);
    this.option = option;
  }
  option: AxisLabelsOption;
  shape: Group = new Group();
  update(): void {
    if (this.chart && this.position) {
      const rect = this.chart.getRect(this.position);
      this.shape.attr({
        x: rect.x,
        y: rect.y,
      });
      this.shape.removeAll();
      switch (this.location) {
        case 'left':
          this.setleft(rect.height);
          break;
        case 'right':
          this.setRight(rect.width, rect.height);
          break;
        case 'top':
          this.setTop(rect.width);
          break;
        case 'bottom':
          this.setBottom(rect.width, rect.height);
          break;
      }
    }
  }
  private setleft(height: number) {
    this.data.forEach(([val, str]) => {
      const y = (1 - this.scaler.normalize(val)) * height;
      this.shape.add(
        new Text({
          silent: true,
          style: {
            ...this.style,
            text: str,
            align: 'left',
            verticalAlign: 'middle',
            x: this.distance,
            y,
          },
        })
      );
    });
  }
  private setRight(width: number, height: number) {
    this.data.forEach(([val, str]) => {
      const y = (1 - this.scaler.normalize(val)) * height;
      this.shape.add(
        new Text({
          silent: true,
          style: {
            ...this.style,
            text: str,
            align: 'right',
            verticalAlign: 'middle',
            x: width - this.distance,
            y,
          },
        })
      );
    });
  }
  private setTop(width: number) {
    this.data.forEach(([val, str]) => {
      const x = this.scaler.normalize(val) * width;
      this.shape.add(
        new Text({
          silent: true,
          style: {
            ...this.style,
            text: str,
            align: 'center',
            verticalAlign: 'top',
            x,
            y: this.distance,
          },
        })
      );
    });
  }
  private setBottom(width: number, height: number) {
    this.data.forEach(([val, str]) => {
      const x = this.scaler.normalize(val) * width;
      this.shape.add(
        new Text({
          silent: true,
          style: {
            ...this.style,
            text: str,
            align: 'center',
            verticalAlign: 'bottom',
            x,
            y: height - this.distance,
          },
        })
      );
    });
  }
  get location() {
    return this.option.location || 'top';
  }
  get style() {
    return this.option.style || TEXTSTYLE;
  }
  get data() {
    return this.option.data || [];
  }
  get scaler() {
    return this.option.scaler || new LinearScaler(1, 1);
  }
  get distance() {
    return this.option.distance || 10;
  }
}
