export function getRange(data: number[]) {
  if (data.length > 0) {
    let min = data[0],
      max = data[0];
    data.forEach((e) => {
      if (e < min) {
        min = e;
      } else if (e > max) {
        max = e;
      }
    });
    return [min, max];
  } else {
    throw new Error("空数组");
  }
}
/**
 * 对一个区间做分割,分割间距保持一位有效数字,结果区间覆盖传入区间
 * @param min 最小值
 * @param max 最大值
 * @param count 分割数,
 * @returns
 */
export function getSplitValue(min: number, max: number, count: number) {
  if (min >= max) {
    throw new Error("区间不合理");
  }

  const step = tick((max - min) / (count - 1));
  const res: number[] = [];

  let value = Math.floor(min / step) * step;
  while (value < max) {
    res.push(value);
    value += step;
  }
  res.push(value);
  return res;
}

export function tick(a: number) {
  const step = Math.pow(10, Math.floor(Math.log10(a)));
  return Math.ceil(a / step) * step;
}
