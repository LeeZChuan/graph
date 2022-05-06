// over
/** 归一化函数 */
export abstract class Scaler {
  abstract normalize(val: number): number;
  abstract denormalize(val: number): number;
}
