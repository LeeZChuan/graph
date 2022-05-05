import { Element } from 'zrender';
import { Player, PlayerOption } from '../core/Player';
import { Scaler } from '../core/Scaler';
import { LinearScaler } from '../scaler/LinearScaler';

export interface AttrPlayerOption extends PlayerOption {
  attrs?: unknown;
}
export class AttrPlayer<T extends Element> extends Player {
  constructor(target: T, option: AttrPlayerOption = {}) {
    super(option);
    this.option = option;
    this.target = target;
    this.analyseAttrs(this.attrs, this.formatters, target);
    this.update();
  }
  target: T;
  option: AttrPlayerOption;
  formatters: any = {};
  get attrs() {
    return this.option.attrs || {};
  }
  update(): void {
    let now = Math.max(this.now, this.begin);
    now = Math.min(now, this.end);
    const val = this.scaler.normalize(now);
    const sttr: any = this.getAttr(this.formatters, val);
    this.target.attr(sttr);
  }
  analyseAttrs(attrs: any, target: any, obj: any) {
    for (const key in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) {
        if (typeof attrs[key] == 'object') {
          target[key] = {};
          this.analyseAttrs(attrs[key], target[key], obj[key]);
        } else if (typeof attrs[key] == 'number') {
          target[key] = new LinearScaler(attrs[key], obj[key]);
        } else {
          throw new Error('属性动画参数有误');
        }
      }
    }
  }
  getAttr(formatter: any, val: number) {
    const res: any = {};
    for (const key in formatter) {
      const element = formatter[key];
      if (element instanceof Scaler) {
        res[key] = element.denormalize(val);
      } else if (typeof element == 'object') {
        res[key] = this.getAttr(element, val);
      } else {
        throw new Error('属性动画参数解析有误');
      }
    }
    return res;
  }
}
