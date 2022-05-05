import { init, ZRenderType } from "zrender";
import { Layout, LayoutPosition } from "../layout/Layout";
import { Element } from "./Element";
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
export class Chart {
  grid: { xs: number[]; ys: number[] } = { xs: [0], ys: [0] };
  constructor(dom: HTMLElement, option: ChartOption = {}) {
    this.option = option;
    this.zr = init(dom, {
      devicePixelRatio: this.dpr,
      renderer: this.render,
    });
  }
  zr: ZRenderType;
  option: ChartOption;
  elements = new Map<string, Element>();
  get dpr() {
    return this.option.dpr || 2;
  }
  get render() {
    return this.option.render || "canvas";
  }
  get layout() {
    return this.option.layout || new Layout([10, "auto", 10], [10, "auto", 10]);
  }
  add(part: Element, position: LayoutPosition) {
    if (!this.elements.has(part.name)) {
      this.elements.set(part.name, part);
      this.zr.add(part.shape);
      part.onAdd(this, position);
    }
  }
  remove(part: Element) {
    this.elements.delete(part.name);
    this.zr.remove(part.shape);
    part.onRemove();
  }
  ready() {
    this.grid = this.layout.getGrid(
      this.zr.dom.offsetWidth,
      this.zr.dom.offsetHeight
    );
    this.elements.forEach((part) => {
      part.update();
    });
  }
  getRect(position: LayoutPosition) {
    let c1: number, c2: number, r1: number, r2: number;
    if (typeof position[0] == "object") {
      c1 = position[0][0];
      c2 = position[0][1];
    } else {
      c1 = position[0];
      c2 = position[0];
    }
    if (typeof position[1] == "object") {
      r1 = position[1][0];
      r2 = position[1][1];
    } else {
      r1 = position[1];
      r2 = position[1];
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
}
