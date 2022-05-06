// over
import { Group, init, ZRenderType, Rect as ZRRect } from "zrender";
import Eventful from "zrender/lib/core/Eventful";
import { Layout, LayoutPosition } from "../layout/Layout";
import { Element } from "./Element";
import Event from './Event';
import { getRandomColor } from '../util/math';
export interface ChartOption {
  dpr?: number;
  render?: "svg" | "canvas";
  /** 图表布局 */
  layout?: Layout;
  /** 长按多久捕获鼠标事件 */
  catchMouseAfter?: number;
  /** 松开多久捕获鼠标抬起事件 */
  hideMouseAfter?: number;
  /** 是否启用图表短按事件 */
  openshortMouseAction?: boolean;
}
export type DataType =
  | [string, number]
  | [string, number, number]
  | [string, number, number, number]
  | [string, number, number, number, number]
  | [string, number, number, number, number, number]
  | [string, number, number, number, number, number, number];
export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export class Chart extends Eventful<{ ready: () => void }> {
  constructor(dom: HTMLElement, option: ChartOption = {}) {
    this.option = option;
    this.zr = init(dom, {
      devicePixelRatio: this.dpr,
      renderer: this.render,
    });
    this.event = new Event(this, option);
  }
  // 记录网格每一行每一列的横坐标与纵坐标
  grid: { xs: number[]; ys: number[] } = { xs: [0], ys: [0] };
  // zrender画布实例
  zr: ZRenderType;
  // 图表配置项
  option: ChartOption;
  // 图表组件集合
  elements = new Map<string, Element>();
  // 事件管理
  event: Event;

  // 分辨率
  get dpr() {
    return this.option.dpr || 2;
  }

  // 渲染方式
  get render() {
    return this.option.render || "canvas";
  }

  // 布局对象
  get layout() {
    return this.option.layout || new Layout([10, "auto", 10], [10, "auto", 10]);
  }

  //添加一个图表组件
  add<T extends Element>(part: Element, position: LayoutPosition) {
    // if (!this.elements.has(part.name)) {
    //   this.elements.set(part.name, part);
    //   this.zr.add(part.shape);
    //   part.onAdd(this, position);
    // }

    const old = this.elements.get(part.name);
    if (old) {
      this.remove(old);
    }
    this.elements.set(part.name, part);
    //旧版add
    part.shape && this.zr.add(part.shape);
    //重构后的add
    part._view && this.zr.add(part._view.group);
    part.onAdd(this, position);
    return part;
  }

  // 移除一个图表组件
  remove(part: Element) {
    this.elements.delete(part.name);
    this.zr.remove(part.shape);
    part.onRemove();
  }

  // 图表组件安装完成，调用ready，根据获取的dom高度宽度信息，统一更新各个组件所处的布局信息，然后将组件内容进行更新
  ready() {
    this.grid = this.layout.getGrid(this.zr.dom.offsetWidth, this.zr.dom.offsetHeight);
    this.elements.forEach((part) => {
      // 调用所有组件的更新方法
      part.update();
    });
  }

  // 重新调整画布尺寸
  resize() {
    this.zr.resize();
    this.ready();
  }

  // 获取包围盒的画布坐标
  getRect(position: LayoutPosition) {
    let c1: number, c2: number, r1: number, r2: number;
    if (typeof position[0] == "object") {
      [[c1, c2]] = position;
    } else {
      [c1] = position;
      c2 = c1;
    }
    if (typeof position[1] == "object") {
      [, [r1, r2]] = position;
    } else {
      [, r1] = position;
      r2 = r1;
    }
    const x = this.grid.xs[c1];
    const y = this.grid.ys[r1];
    return {
      x,
      y,
      width: this.grid.xs[c2 + 1] - x,
      height: this.grid.ys[r2 + 1] - y,
    };
  }

  // 查看布局，用于调试
  showLayout(delay = 10000) {
    const group = new Group();
    for (let i = 0; i < this.grid.xs.length - 1; i++) {
      const x0 = this.grid.xs[i];
      const x1 = this.grid.xs[i + 1];
      for (let j = 0; j < this.grid.ys.length - 1; j++) {
        const y0 = this.grid.ys[j];
        const y1 = this.grid.ys[j + 1];
        group.add(new ZRRect({
          silent: true,
          shape: {
            x: x0,
            y: y0,
            width: x1 - x0,
            height: y1 - y0
          },
          style: {
            fill: getRandomColor(),
            opacity: 0.5
          }
        }));
      }
    }
    this.zr.add(group);
    setTimeout(()=>{
      this.zr.remove(group);
    },delay);
  }
}
