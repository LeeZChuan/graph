type Space = number | "auto" | (() => number);
export type LayoutPosition = [
  [number, number] | number,
  [number, number] | number
];

export class Layout {
  ws: Space[];
  hs: Space[];
  constructor(ws: Space[], hs: Space[]) {
    this.ws = ws;
    this.hs = hs;
  }
  static split(arr: Space[], length: number) {
    let temp = 0,
      auto = 0,
      offset = 0;
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
      temp = length / auto;
      offset = 0;
      xs = xs.map((val, i) => {
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
  getGrid(width: number, height: number) {
    return {
      xs: [0, ...Layout.split(this.ws, width)],
      ys: [0, ...Layout.split(this.hs, height)],
    };
  }
}
