import { Scaler } from '../core/Scaler';
export class LinearScaler extends Scaler {
  constructor(min: number, max: number) {
    super();
    this.delta = max - min;
    this.min = min;
  }
  delta: number;
  min: number;
  normalize(val: number): number {
    if (this.delta) {
      return (val - this.min) / this.delta;
    } else {
      return 0.5;
    }
  }
  denormalize(val: number): number {
    if (this.delta) {
      return this.delta * val + this.min;
    } else {
      return this.min;
    }
  }
}
