import { Line } from 'zrender';
/**
 * 调整直线的位置使线宽为1的线条能压在像素点上
 * @param line
 */
export function adjustLine(line: Line) {
  if (line.style.lineWidth && line.style.lineWidth > 1) {
    return line;
  }
  let { x1, x2, y1, y2 } = line.shape;
  if (x1 == x2) {
    x1 = x2 = Math.floor(x1) + 0.5;
  }
  if (y1 == y2) {
    y1 = y2 = Math.floor(y1) + 0.5;
  }
  line.attr({
    shape: {
      x1,
      x2,
      y1,
      y2,
    },
  });
  return line;
}
