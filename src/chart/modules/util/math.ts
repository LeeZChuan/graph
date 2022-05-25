import { stringify } from "zrender/lib/tool/color";
import { divide, minus, plus, times } from "./number-precision";

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

// 将归一化的范围进行切割，并且切割的数字为count的大小
export function splitOne(count: number, desc = false) {
  const step = 1 / (count - 1);
  const res: number[] = [];
  if (desc) {
    for (let i = count - 1; i > -1; i--) {
      res.push(i * step);
    }
  } else {
    for (let i = 0; i < count; i++) {
      res.push(i * step);
    }
  }
  return res;
}

// 处理轴数据，扩展数据包含0轴
/**
 * 
 * @param maxVal 最大值
 * @param minVal 最小值
 * @param count 数量
 * @param prevStep 上一个循环中的步长
 */
export function getExpandCoverZero(maxVal: number, minVal: number, count: number, prevStep: number | undefined = undefined): Array<number> {
  const minV = minVal === null ? 0 : minVal;
  const maxV = maxVal === null ? 0 : maxVal;
  let min = Math.min(minV, maxV);
  let max = Math.max(minV, maxV);
  min = min > 0 ? 0 : min;
  max = max < 0 ? 0 : max;

  const splitCount = count - 1;
  const distance = prevStep ? prevStep : minus(max, min) / splitCount;
  const step = myTick(distance, 1 / splitCount);
  const result = [];
  // 全小于0
  if (max <= 0 && max * min === 0) {
    for (let i = 0; i <= splitCount; i++) {
      result.push(times(step, -i));
    }
  } else if (min <= 0 && max * min === 0) {
    for (let i = 0; i <= splitCount; i++) {
      result.push(times(step, i));
    }
  } else {
    let topCount = divide(max, step);
    topCount = Math.floor(topCount) * step > max + step ? Math.floor(topCount) : Math.ceil(topCount);
    const bottomCount = splitCount - topCount;
    // 如果刻度数不满足条件则需要增加范围再次循环
    if (topCount * step < max || bottomCount * step < Math.abs(min)) {
      return getExpandCoverZero(max, min, count, step * 1.05);
    }
    // 算出范围
    result.push(0);
    for (let i = 1; i < topCount; i++) {
      result.push(times(step, i));
    }

    for (let i = 1; i < bottomCount; i++) {
      result.push(times(step, i));
    }
  }

  result.sort(function (a, b) {
    return a - b;
  });

  return result;
}

/**
 * // 轴的凑整逻辑
 * @param val 步长
 * @param rate 允许误差
 * @returns 
 */
export function myTick(val: number, rate: number) {
  //先计算出步长的数量级
  const step = Math.pow(10, Math.floor(Math.log10(val)));
  // 最大最小值
  const max = times(Math.ceil(val / step), step);
  const min = times(Math.floor(val / step), step);
  const arr = [
    Math.pow(10, Math.ceil(Math.log10(val))),
    max,
    plus(min, times(0.5, step)),
    plus(min, times(0.2, step)),
    plus(min, times(0.4, step)),
    plus(min, times(0.6, step)),
    plus(min, times(0.8, step)),
  ];

  // 找到误差允许范围内的数据
  const index = arr.findIndex(item => item > val && (item - val) / val < rate);
  return index === -1 ? max : arr[index];
}

export function getTwoAxisCoverZero(maxVal: number, minVal: number, maxVal2: number, minVal2: number, count: number): Array<Array<number>> {
  if (maxVal < minVal || maxVal2 < minVal2) {
    console.warn('需要对数据进行校验');
  }

  const result = getExpandCoverZero(maxVal, minVal, count);
  const result2 = getExpandCoverZero(maxVal2, minVal2, count);

  // 如果有两根轴中有一个顶点在0轴上，且这两个顶点一个是A轴的最大值，一个是b轴的最小值，则我们需要重新处理一遍最大值最小值，然后再重新执行本方法
  if ((result[0] === 0 && result2[count - 1] === 0) || (result[count - 1] === 0 && result2[0] === 0)) {
    const reVal = Math.max(Math.abs(maxVal), Math.abs(minVal));
    const reVal2 = Math.max(Math.abs(maxVal2), Math.abs(minVal2));
    return getTwoAxisCoverZero(reVal, -reVal, reVal2, -reVal2, count);
  }

  //确定各自的分割方式，分割好之后的0轴位置
  const resultZeroPosition = result.findIndex(val => val === 0);
  const resultZeroPosition2 = result2.findIndex(val => val === 0);
  if (resultZeroPosition === resultZeroPosition2) {
    return [result, result2];
  }
  // 确定哪种分割方式在两侧的数据在0轴附近分布的更加均匀
  const middleCount = count / 2;
  // 确定需要延展的轴线
  const bottomCount = Math.abs(middleCount - resultZeroPosition) > Math.abs(middleCount - resultZeroPosition2) ? resultZeroPosition2 : resultZeroPosition;
  //需要变动的数据
  const changeRe = Math.abs(middleCount - resultZeroPosition) > Math.abs(middleCount - resultZeroPosition2) ? result : result2;

  //计算向上延展与向下延展
  const topCount = Math.max(count - bottomCount - 1, 0);
  const toStep = topCount === 0 ? 0 : changeRe[changeRe.length - 1] / topCount;
  const bottomStep = bottomCount === 0 ? 0 : Math.abs(changeRe[0]) / bottomCount;
  const stepTemp = Math.max(toStep, bottomStep);
  // 再对step步长凑整
  const precision = Math.floor(Math.log10(stepTemp));
  let step = Math.pow(10, precision);
  step = times(Math.ceil(stepTemp / step), step);

  // 数组范围进行延展
  const newRe = [];
  for (let i = 0; i <= topCount; i++) {
    newRe.push(times(i, step));
  }
  for (let i = 1; i < bottomCount; i++) {
    newRe.push(times(-i, step));
  }

  newRe.sort(function (a, b) {
    return a - b;
  });

  if (changeRe === result) {
    return [newRe, result2];
  } else {
    return [result, newRe];
  }


}