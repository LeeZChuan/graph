import { Line, PathStyleProps } from 'zrender';
import { Element } from '../core/Element';
import { LINESTYLE } from '../static/style';
import { adjustLine } from '../util/geometry';
interface XLineOption {
  location?: 'top' | 'bottom' | 'left' | 'right';
  style?: PathStyleProps;
}
export class AxisLine extends Element {
  constructor(name: string, option: XLineOption = {}) {
    super(name);
    this.option = option;
    this.shape = new Line({
      silent: true,
      style: this.style,
    });
  }
  shape: Line;
  option: XLineOption;
  get style() {
    return this.option.style || LINESTYLE;
  }
  get location() {
    return this.option.location || 'top';
  }
  update(): void {
    if (this.chart && this.position) {
      const rect = this.chart.getRect(this.position);
      switch (this.location) {
        case 'left':
          this.shape.attr({
            shape: {
              x1: rect.x,
              x2: rect.x,
              y1: rect.y,
              y2: rect.y + rect.height,
            },
          });
          break;
        case 'right':
          this.shape.attr({
            shape: {
              x1: rect.x + rect.width,
              x2: rect.x + rect.width,
              y1: rect.y,
              y2: rect.y + rect.height,
            },
          });
          break;
        case 'top':
          this.shape.attr({
            shape: {
              x1: rect.x,
              x2: rect.x + rect.width,
              y1: rect.y,
              y2: rect.y,
            },
          });
          break;
        case 'bottom':
          this.shape.attr({
            shape: {
              x1: rect.x,
              x2: rect.x + rect.width,
              y1: rect.y + rect.height,
              y2: rect.y + rect.height,
            },
          });
          break;
      }
      adjustLine(this.shape);
    }
  }
}
