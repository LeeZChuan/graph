import { stringify } from "zrender/lib/tool/color";

export function getRange(data: number[]): [number, number] {
  let filterData = data.filter(item => !isNaN(parseFloat(String(item))));
  filterData = filterData.map(item => parseFloat(String(item)));
  if (filterData.length > 0) {
    let min = filterData[0];
    let max = filterData[0];
    filterData.forEach((e) => {
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
 * 获取扩张返回之后的Y轴的最大最小值
 * @param min 最小值
 * @param max 最大值
 * @returns
 */
export function getExpandRange(min: number, max: number): number[] {
  if (min >= max) {
    return [min, max];
  }
  // 分割线数量
  const splitCount = 6;
  const finalmin = min > 0 ? 0 : min;
  const finalmax = max < 0 ? 0 : max;
  const resultRange = [];
  if (finalmax - finalmin > 1) {
    const step = Math.ceil(((finalmax - finalmin) / (splitCount - 1)) * (1 + 0.05));
    resultRange[0] = Math.floor(finalmin);
    resultRange[1] = Math.floor(finalmin) + step * (splitCount - 1);
  } else {
    const step = ((finalmax - finalmin) / (splitCount - 1)) * (1 + 0.05);
    resultRange[0] = Number(finalmin);
    resultRange[1] = Number((finalmin) + step * (splitCount - 1));
  }
  return resultRange;
}


/**
 * 对一个区间做分割
 * @param min 区间最小值
 * @param max 区间最大值
 * @param splitCount 分割数量,
 * @param expandRate 向上扩展比例,
 * @returns 划分区间
 */
export function getExpandSplit(min: number, max: number, splitCount: number, expandRate: number): number[] {
  if (min === max) {
    return Array(splitCount).fill(min);
  }

  if (min >= max) {
    throw new Error("区间不合理");
  }

  const split: number[] = [];
  if (max - min > 1) {
    const step = Math.ceil(((max - min) / (splitCount - 1)) * (1 + expandRate));
    for (let i = 1; i <= splitCount; i++) {
      split.push(Number(Math.floor(min) + step * (i - 1)));
    }
  } else {
    const step = ((max - min) / (splitCount - 1)) * (1 + expandRate);
    for (let i = 1; i <= splitCount; i++) {
      split.push(Number(min + step * (i - 1)));
    }
  }

  return split;
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

// 随机生成颜色
export function getRandomColor() {
  let res = '#';
  for (let i = 0; i < 3; i++) {
    res += Math.floor(Math.random() * 256).toString(16);
  }

  return res;
}
