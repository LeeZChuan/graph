//over

type Space = number | "auto" | (() => number);
export type LayoutPosition = [
  [number, number] | number,
  [number, number] | number
];

// 定位实现
export class Layout {
  ws: Space[];
  hs: Space[];
  constructor(ws: Space[], hs: Space[]) {
    this.ws = ws;
    this.hs = hs;
  }

  // 将空间定义换算为真实的坐标值
  // arr 空间定义
  // length 空间总大小
  static split(arr: Space[], length: number) {
    let temp = 0;
    let auto = 0;
    let offset = 0;
    let xs = arr.map((space) => {
      switch (typeof space) {
        case "number":
          length -= space;
          offset += space;
          return offset;
        case "function":
          temp = space();
          length -= temp;
          offset += temp;
          return offset;
        default:
          auto++;
          return -1;
      }
    });
    if (auto) {
      // 临时变量储存auto的均分空间
      temp = length / auto;
      // 重置偏移量
      offset = 0;
      xs = xs.map((val, i) => {
        // 如果当前值为-1，即auto的标记返回值
        if (val < 0) {
          offset += temp;
          return i ? xs[i - 1] + offset : offset;
        } else {
          return val + offset;
        }
      });
    }
    return xs;
  }

  // 获取网格格点的真实坐标
  getGrid(width: number, height: number) {
    return {
      xs: [0, ...Layout.split(this.ws, width)],
      ys: [0, ...Layout.split(this.hs, height)],
    };
  }
}
