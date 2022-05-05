import { Group, Line, PathStyleProps } from 'zrender';
import { Element } from '../core/Element';
import { Scaler } from '../core/Scaler';
import { LinearScaler } from '../scaler/LinearScaler';
import { LINESTYLE } from '../static/style';
import { adjustLine } from '../util/geometry';

export interface ParallelLinesOption {
  location?: 'top' | 'bottom' | 'left' | 'right';
  style?: PathStyleProps;
  data?: number[];
  scaler?: Scaler;
}
//TODO 平行线组件
export class ParallelLines extends Element {
  constructor(name: string, option: ParallelLinesOption) {
    super(name);
    this.option = option;
  }
  option: ParallelLinesOption;
  shape = new Group();
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
          this.setleft(rect.width, rect.height);
          break;
        case 'right':
          this.setRight(rect.width, rect.height);
          break;
        case 'top':
          this.setTop(rect.width, rect.height);
          break;
        case 'bottom':
          this.setBottom(rect.width, rect.height);
          break;
      }
    }
  }
  private setleft(width: number, height: number) {
    this.data.forEach(val => {
      const x = this.scaler.normalize(val) * width;
      this.shape.add(
        adjustLine(
          new Line({
            silent: true,
            style: this.style,
            shape: {
              x1: x,
              y1: 0,
              x2: x,
              y2: height,
            },
          })
        )
      );
    });
  }
  private setRight(width: number, height: number) {
    this.data.forEach(val => {
      const x = (1 - this.scaler.normalize(val)) * width;
      this.shape.add(
        adjustLine(
          new Line({
            silent: true,
            style: this.style,
            shape: {
              x1: x,
              y1: 0,
              x2: x,
              y2: height,
            },
          })
        )
      );
    });
  }
  private setTop(width: number, height: number) {
    this.data.forEach(val => {
      const y = this.scaler.normalize(val) * height;
      this.shape.add(
        adjustLine(
          new Line({
            silent: true,
            style: this.style,
            shape: {
              x1: 0,
              y1: y,
              x2: width,
              y2: y,
            },
          })
        )
      );
    });
  }
  private setBottom(width: number, height: number) {
    this.data.forEach(val => {
      const y = (1 - this.scaler.normalize(val)) * height;
      this.shape.add(
        adjustLine(
          new Line({
            silent: true,
            style: this.style,
            shape: {
              x1: 0,
              y1: y,
              x2: width,
              y2: y,
            },
          })
        )
      );
    });
  }
  get style() {
    return this.option.style || LINESTYLE;
  }
  get data() {
    return this.option.data || [];
  }
  get scaler() {
    return this.option.scaler || new LinearScaler(0, 1);
  }
  get location() {
    return this.option.location || 'bottom';
  }
}
