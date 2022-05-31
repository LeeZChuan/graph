### chart-kit组件细节要点

##### 1.x轴标签的取样逻辑，存在三种设计，两段式，三段式，抽样展示

```ts
// controlTextVisable方法控制选择两段式、三段式、抽样展示
// 在axislabelView文件中的sampleHide:抽样展示
```



##### 2.y轴标签的凑整逻辑

核心点1：步长凑整

```ts
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
```

核心点2：轴线数值扩展

```ts
// 核心方法：getExpandCoverZero（），在math.ts文件中
// 用于扩展(单)数据轴的范围，传入四个参数（最大值，最小值，数量，上一个循环的步长）


// 核心方法：getTwoAxisCoverZero（），在math.ts文件中
// 传入五个参数分别是左右轴的最大值与最小值，与分割线的数量
//得到最终（双数据轴）的扩展后的比例尺最大值最小值

//其中核心有一个计算向上向下延展计算核心逻辑
```

##### 3.x轴标签左右内偏移

```ts
// 在axislabelView文件中的controlTextPosition方法控制文本的内缩逻辑
```

##### 4.十字光标高亮标签左右内偏移

```ts
// 参考crossaxispointerview文件中的getInRangeX方法，如果是第一个文本或者最后一个文本，那么就进行偏移收缩到内部
```

##### 5.柱子排布逻辑解释

```ts
请看柱状图高低密度与单柱多柱之间的关系
```

